import { useMemo } from 'react';
import { members } from '../data/mockMembers';
import { tasks } from '../data/mockTasks';
import { generateSchedule } from '../lib/schedule';

const pastelMap: Record<string, string> = {
  'member-c': 'bg-[#E3F1FB] text-[#2C6288]',
  'member-d': 'bg-[#FFF0EC] text-[#B36A57]',
  'member-e': 'bg-[#E7EEF5] text-[#2F4F6B]',
  'salmon':   'bg-salmon-soft text-[#A44A36]',
};

function AssignAdvanced() {
  const rangeStart = new Date('2026-09-01');
  const rangeEnd = new Date('2026-09-14'); // e.g. the "2-week report" from the calendar picker

  const schedule = useMemo(
    () => generateSchedule(tasks, members, rangeStart, rangeEnd),
    []
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
  for (let d = new Date(rangeStart); d <= rangeEnd; d.setDate(d.getDate() + 1)) days.push(new Date(d));

  return (
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
                <div key={i} className={`rounded-md px-1.5 py-1 text-[9.5px] font-semibold mb-1 ${pastel}`}>
                  {a.title} — {member?.name}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
export default AssignAdvanced;