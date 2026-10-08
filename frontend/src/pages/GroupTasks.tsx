import { useState } from 'react';
import { tasks as initialTasks } from '../data/mockTasks';
import { members } from '../data/mockMembers';
import Modal from '../components/addModal';

const filters = ['All', 'Unassigned', 'Kitchen', 'Bathroom', 'Outdoor'] as const;


function GroupTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeFilter, setActiveFilter] = useState<typeof filters[number]>('All');
  const [isOpen, setIsOpen] = useState(false);

  const toggleDone = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
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

              <button
                onClick={() => deleteTask(task.id)}
                className="text-xs font-semibold text-salmon hover:text-[#A44A36]"
              >
                Delete
              </button>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className={`w-2.5 h-2.5 rounded-[50%_50%_50%_0] rotate-45 bg-${assignee?.color}`} />
                <span className="text-[11.5px] font-mono text-slate">
                 {task.frequency}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-13 h-13 rounded-[50%_50%_50%_0] bg-salmon text-ink shadow-lg shadow-salmon/50 flex items-center justify-center hover:bg-navy hover:*:text-white transition-colors" onClick={() => setIsOpen(true)}>
        <i className="fa-solid fa-plus"></i>
      </button>


      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <form className="flex flex-col gap-3">
          <label htmlFor="taskTitle">Task Title</label>
          <input
            type="text"
            id="taskTitle"
            placeholder="Enter task title"
            className="border border-slate-light rounded-md px-2 py-1 text-sm flex-1 mr-3"
            required
          />
          <label htmlFor="taskFrequency">Task Frequency</label>
          <select id="taskFrequency"  className="border border-slate-light rounded-md px-2 py-1 text-sm flex-1 mr-3" required>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <button type="submit" className="bg-salmon text-ink font-display font-semibold text-sm px-4 py-2 rounded-lg hover:bg-ink hover:text-white">
            Add Task
          </button>                                     
        </form>
      </Modal>

    </div>
  );
}
export default GroupTasks;