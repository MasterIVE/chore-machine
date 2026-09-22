import { useState } from 'react';
import { tasks as initialTasks } from '../data/mockTasks';
import { members } from '../data/mockMembers';

const filters = ['All', 'Unassigned', 'Kitchen', 'Bathroom', 'Outdoor'] as const;

function GroupTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeFilter, setActiveFilter] = useState<typeof filters[number]>('All');

  const toggleDone = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t))
    );
  };

  const visible = tasks.filter(t => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unassigned') return !t.assigneeId;
    return t.category === activeFilter;
  });

  return (
    <div>
      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap mb-4">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              activeFilter === f
                ? 'bg-salmon-soft border-salmon text-[#A44A36]'
                : 'bg-white border-slate-light text-slate'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Chore grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {visible.map(task => {
          const assignee = members.find(m => m.id === task.assigneeId);
          return (
            <div key={task.id} className="bg-white border border-slate-light rounded-xl p-3.5">
              <div className="flex justify-between items-start">
                <h3 className="font-display text-sm font-semibold">{task.title}</h3>
                <button
                  onClick={() => toggleDone(task.id)}
                  className={`w-4.5 h-4.5 rounded-md border-2 shrink-0 ${
                    task.status === 'done' ? 'bg-navy border-navy' : 'border-slate-light'
                  }`}
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className={`w-2.5 h-2.5 rounded-[50%_50%_50%_0] rotate-45 bg-${assignee?.color}`} />
                <span className="text-[11.5px] font-mono text-slate">
                  {assignee?.name} · {task.frequency}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-13 h-13 rounded-[50%_50%_50%_0] bg-salmon text-ink shadow-lg shadow-salmon/50 flex items-center justify-center">
        <a href="*"><span className="text-2xl font-bold">+</span></a>
      </button>
    </div>
  );
}
export default GroupTasks;