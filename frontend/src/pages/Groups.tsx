// pages/Groups.tsx
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { groups as initialGroups } from '../data/mockGroups';
import Modal from '../components/addModal';

type Group = (typeof initialGroups)[number];
type Errors = Record<string, string>;

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <p role="alert" className="text-xs text-red-600">
      {msg}
    </p>
  ) : null;

function Groups() {
  const [groups, setGroups] = useState(initialGroups);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Add-group form state
  const [form, setForm] = useState({ name: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const startRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setDraftName(currentName);
  };

  const saveRename = (id: string) => {
    setGroups(prev => prev.map(g => (g.id === id ? { ...g, name: draftName } : g)));
    setRenamingId(null);
  };

  const deleteGroup = (id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id));
  };

  const closeModal = () => {
    setIsOpen(false);
    setForm({ name: '' });
    setErrors({});
    setFormError(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = 'Group name is required';
    else if (form.name.length > 50) e.name = 'Keep it under 50 characters';
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
      const res = await fetch('/api/groups/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        if (res.status === 400) {
          // DRF validation shape, e.g. { name: ["This field may not be blank."] }
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
        throw new Error(
          res.status >= 500 ? 'Server error. Try again later.' : 'Could not create group.'
        );
      }

      const created: Group = await res.json();
      setGroups(prev => [...prev, created]);
      closeModal();
    } catch (err) {
      if (err instanceof TypeError) setFormError('Network error. Check your connection.');
      else if (err instanceof Error) setFormError(err.message);
      else setFormError('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'border border-slate-light rounded-md px-2 py-1 text-sm';

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl text-navy-deep">Manage groups</h2>

        <button
          className="bg-salmon text-ink font-display font-semibold text-sm px-4 py-2 rounded-lg hover:bg-ink hover:text-white"
          onClick={() => setIsOpen(true)}
        >
          + New group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {groups.map(g => (
          <div
            key={g.id}
            className="bg-white border border-slate-light rounded-xl p-4 flex items-center justify-between"
          >
            {renamingId === g.id ? (
              <input
                autoFocus
                value={draftName}
                onChange={e => setDraftName(e.target.value)}
                onBlur={() => saveRename(g.id)}
                onKeyDown={e => e.key === 'Enter' && saveRename(g.id)}
                className="border border-slate-light rounded-md px-2 py-1 text-sm flex-1 mr-3"
              />
            ) : (
              <div>
                <div className="font-display font-semibold text-sm">{g.name}</div>
                <div className="text-[11px] font-mono text-slate mt-0.5">{g.taskCount} chores</div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => startRename(g.id, g.name)}
                className="text-xs font-semibold text-slate hover:text-navy-deep"
              >
                Rename
              </button>
              <button
                onClick={() => deleteGroup(g.id)}
                className="text-xs font-semibold text-salmon hover:text-[#A44A36]"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={isOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
          {formError && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <label htmlFor="groupName">Group Name</label>
          <input
            type="text"
            id="groupName"
            name="name"
            value={form.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            placeholder="Enter group name"
            className={inputClass}
          />
          <FieldError msg={errors.name} />

          <button
            type="submit"
            disabled={submitting}
            className="bg-salmon text-ink font-display font-semibold text-sm px-4 py-2 rounded-lg hover:bg-ink hover:text-white disabled:opacity-60"
          >
            {submitting ? 'Adding...' : 'Add Group'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Groups;