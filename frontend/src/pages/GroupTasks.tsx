import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { tasks as initialTasks } from '../data/mockTasks';
import { members } from '../data/mockMembers';
import Modal from '../components/addModal';

const filters = ['All', 'Unassigned', 'Kitchen', 'Bathroom', 'Outdoor'] as const;

type Task = (typeof initialTasks)[number];
type Errors = Record<string, string>;

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <p role="alert" className="text-xs text-red-600">
      {msg}
    </p>
  ) : null;

function GroupTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('All');
  const [isOpen, setIsOpen] = useState(false);

  // Add-task form state
  const [form, setForm] = useState({ title: '', frequency: 'daily' });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleDone = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const closeModal = () => {
    setIsOpen(false);
    setForm({ title: '', frequency: 'daily' });
    setErrors({});
    setFormError(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.title.trim()) e.title = 'Task title is required';
    else if (form.title.length > 100) e.title = 'Keep it under 100 characters';
    if (!form.frequency) e.frequency = 'Choose a frequency';
    return e;
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title.trim(), frequency: form.frequency }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        if (res.status === 400) {
          // DRF validation shape, e.g. { title: ["This field may not be blank."] }
          const serverErrors: Errors = {};
          for (const [key, val] of Object.entries(body)) {
            serverErrors[key] = Array.isArray(val) ? String(val[0]) : String(val);
          }
          setFormError(serverErrors.non_field_errors ?? null);
          setErrors(serverErrors);
          return;
        }
        if (res.status === 401) {
          setFormError('Please log in again.');
          return;
        }
        if (res.status === 403) {
          setFormError("You don't have permission to add tasks here.");
          return;
        }
        throw new Error(
          res.status >= 500 ? 'Server error. Try again later.' : 'Could not add task.'
        );
      }

      const created: Task = await res.json();
      setTasks(prev => [...prev, created]);
      closeModal();
    } catch (err) {
      if (err instanceof TypeError) setFormError('Network error. Check your connection.');
      else if (err instanceof Error) setFormError(err.message);
      else setFormError('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const visible = tasks.filter(t => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unassigned') return !t.assigneeId;
    return t.category === activeFilter;
  });

  const inputClass = 'border border-slate-light rounded-md px-2 py-1 text-sm';

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
                <span className="text-[11.5px] font-mono text-slate">{task.frequency}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <button
        className="fixed bottom-8 right-8 w-13 h-13 rounded-[50%_50%_50%_0] bg-salmon text-ink shadow-lg shadow-salmon/50 flex items-center justify-center hover:bg-navy hover:*:text-white transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <i className="fa-solid fa-plus"></i>
      </button>

      <Modal open={isOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
          {formError && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <label htmlFor="taskTitle">Task Title</label>
          <input
            type="text"
            id="taskTitle"
            name="title"
            value={form.title}
            onChange={handleChange}
            aria-invalid={!!errors.title}
            placeholder="Enter task title"
            className={inputClass}
          />
          <FieldError msg={errors.title} />

          <label htmlFor="taskFrequency">Task Frequency</label>
          <select
            id="taskFrequency"
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            aria-invalid={!!errors.frequency}
            className={inputClass}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <FieldError msg={errors.frequency} />

          <button
            type="submit"
            disabled={submitting}
            className="bg-salmon text-ink font-display font-semibold text-sm px-4 py-2 rounded-lg hover:bg-ink hover:text-white disabled:opacity-60"
          >
            {submitting ? 'Adding...' : 'Add Task'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default GroupTasks;