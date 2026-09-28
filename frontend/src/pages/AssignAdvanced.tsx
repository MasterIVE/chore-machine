// pages/AssignAdvanced.tsx
import { useMemo, useState } from 'react';
import { members } from '../data/mockMembers';
import { tasks } from '../data/mockTasks';
import { generateSchedule } from '../lib/schedule';

const pastelMap: Record<string, string> = {
  'member-c': 'bg-[#E3F1FB] text-[#2C6288]',
  'member-d': 'bg-[#FFF0EC] text-[#B36A57]',
  'member-e': 'bg-[#E7EEF5] text-[#2F4F6B]',
  'salmon':   'bg-salmon-soft text-[#A44A36]',
};

const DAY = 86_400_000;

// Snap any date to the Sunday that starts its week — keeps ranges aligned
// with the calendar grid instead of starting on an arbitrary weekday
function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

const rangeOptions = [
  { label: '1 week', days: 7 },
  { label: '2 weeks', days: 14 },
  { label: '4 weeks', days: 28 },
];

function AssignAdvanced() {
  const [rangeStart, setRangeStart] = useState(() => startOfWeek(new Date()));
  const [rangeDays, setRangeDays] = useState(14);

  const rangeEnd = useMemo(
    () => new Date(rangeStart.getTime() + (rangeDays - 1) * DAY),
    [rangeStart, rangeDays]
  );

  const schedule = useMemo(
    () => generateSchedule(tasks, members, rangeStart, rangeEnd),
    [rangeStart, rangeEnd]
  );

  const byDay = useMemo(() => {
    const map = new Map<string, typeof schedule>();
    schedule.forEach(a => {
      const key = a.date.toISOString().slice(0, 10);
      map.set(key, [...(map.get(key) ?? []), a]);
    });
    return map;
  }, [schedule]);

  const days: Date[] = [];
  for (let d = new Date(rangeStart); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  const shiftRange = (direction: 1 | -1) => {
    setRangeStart(prev => new Date(prev.getTime() + direction * rangeDays * DAY));
  };

  const goToToday = () => setRangeStart(startOfWeek(new Date()));

  const onPickDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    setRangeStart(startOfWeek(new Date(e.target.value)));
  };

  return (
    <div>
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
        <h2 className="font-display font-bold text-base text-navy-deep">
          {rangeStart.toLocaleDateString('default', { month: 'long', day: 'numeric' })}
          {' – '}
          {rangeEnd.toLocaleDateString('default', { month: 'long', day: 'numeric' })}
        </h2>

        <div className="flex items-center gap-2">
          <input
            type="date"
            onChange={onPickDate}
            className="px-2.5 py-1.5 rounded-lg border border-slate-light bg-white text-xs text-slate"
          />

          <select
            value={rangeDays}
            onChange={e => setRangeDays(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-lg border border-slate-light bg-white text-xs font-semibold text-slate"
          >
            {rangeOptions.map(opt => (
              <option key={opt.days} value={opt.days}>{opt.label}</option>
            ))}
          </select>

          <button onClick={goToToday} className="px-3 py-1.5 rounded-lg border border-slate-light bg-white text-xs font-semibold text-slate">
            Today
          </button>
          <button onClick={() => shiftRange(-1)} className="w-7 h-7 rounded-lg border border-slate-light bg-white text-slate text-xs">‹</button>
          <button onClick={() => shiftRange(1)} className="w-7 h-7 rounded-lg border border-slate-light bg-white text-slate text-xs">›</button>
        </div>
      </div>

      {/* Weekday row */}
      <div className="grid grid-cols-7 mb-1.5">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-[11px] font-semibold text-slate pl-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map(day => {
          const key = day.toISOString().slice(0, 10);
          const dayAssignments = byDay.get(key) ?? [];

          return (
            <div key={key} className="rounded-lg border border-slate-light bg-white p-1.5 min-h-21">
              <div className="text-[11px] font-mono text-slate mb-1">{day.getDate()}</div>
              {dayAssignments.map((a, i) => {
                const member = members.find(m => m.id === a.memberId);
                const pastel = member ? pastelMap[member.color] ?? 'bg-slate-light text-ink' : '';
                return (
                  <div key={i} className={`rounded-md px-1.5 py-1 text-[9.5px] font-semibold mb-1 truncate ${pastel}`}>
                    {a.title} — {member?.name}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AssignAdvanced;