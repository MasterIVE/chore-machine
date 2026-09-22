import type { Task, Frequency } from '../data/mockTasks';
import type { Member } from '../data/mockMembers';

const DAY = 86_400_000;
const STEP: Record<Exclude<Frequency, 'monthly'>, number> = { daily: 1, weekly: 7, 'bi-weekly': 14 };

// Generates the actual dates a task falls due within [rangeStart, rangeEnd],
// clipped to the range — a monthly task naturally yields 0 or 1 dates in a
// 2-week window because its cadence (30d) exceeds the window, no special-casing needed.
function occurrenceDates(task: Task, rangeStart: Date, rangeEnd: Date): Date[] {
  const anchor = new Date(task.anchorDate);
  const dates: Date[] = [];

  if (task.frequency === 'monthly') {
    const cursor = new Date(rangeStart);
    while (cursor <= rangeEnd) {
      if (cursor.getDate() === anchor.getDate()) dates.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return dates;
  }

  const step = STEP[task.frequency];
  const daysSinceAnchor = Math.floor((rangeStart.getTime() - anchor.getTime()) / DAY);
  const offset = ((daysSinceAnchor % step) + step) % step;
  let cursor = new Date(rangeStart.getTime() + (offset === 0 ? 0 : step - offset) * DAY);
  while (cursor <= rangeEnd) {
    dates.push(new Date(cursor));
    cursor = new Date(cursor.getTime() + step * DAY);
  }
  return dates;
}

export interface Occurrence { taskId: string; title: string; difficulty: number; date: Date; }
export interface Assignment extends Occurrence { memberId: string; }

export function buildOccurrences(tasks: Task[], rangeStart: Date, rangeEnd: Date): Occurrence[] {
  return tasks.flatMap(t =>
    occurrenceDates(t, rangeStart, rangeEnd).map(date => ({ taskId: t.id, title: t.title, difficulty: t.difficulty, date }))
  );
}

function weekKey(d: Date): string {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay()); // Sunday-start, matches your calendar grid
  return copy.toISOString().slice(0, 10);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// No member gets 2+ level-4/5 occurrences in the same week, UNLESS every
// occurrence that week is level-4/5 (unavoidable — constraint becomes moot).
function distributeWeek(occurrences: Occurrence[], members: Member[]): Assignment[] {
  const load: Record<string, number> = Object.fromEntries(members.map(m => [m.id, 0]));
  const leastLoaded = () => members.reduce((a, b) => (load[a.id] <= load[b.id] ? a : b));
  const results: Assignment[] = [];

  const highs = occurrences.filter(o => o.difficulty >= 4);
  const normals = occurrences.filter(o => o.difficulty < 4);
  const allHigh = normals.length === 0 && highs.length > 0;
  const canEnforce = !allHigh && highs.length <= members.length;

  if (canEnforce) {
    shuffle(members).forEach((member, i) => {
      const task = shuffle(highs)[i];
      if (!task) return;
      results.push({ ...task, memberId: member.id });
      load[member.id]++;
    });
    shuffle(normals).forEach(o => { const m = leastLoaded(); results.push({ ...o, memberId: m.id }); load[m.id]++; });
  } else {
    shuffle(occurrences).forEach(o => { const m = leastLoaded(); results.push({ ...o, memberId: m.id }); load[m.id]++; });
  }
  return results;
}

export function generateSchedule(tasks: Task[], members: Member[], rangeStart: Date, rangeEnd: Date): Assignment[] {
  const occurrences = buildOccurrences(tasks, rangeStart, rangeEnd);
  const weeks = new Map<string, Occurrence[]>();
  occurrences.forEach(o => weeks.set(weekKey(o.date), [...(weeks.get(weekKey(o.date)) ?? []), o]));
  return [...weeks.values()].flatMap(week => distributeWeek(week, members));
}