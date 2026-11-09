import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import axios from 'axios';
import api from '../api';
import { members as initialMembers } from '../data/mockMembers';
import Modal from '../components/addModal';

type Member = (typeof initialMembers)[number];
type Errors = Record<string, string>;

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <p role="alert" className="text-xs text-red-600">
      {msg}
    </p>
  ) : null;

const emptyForm = { name: '', role: '' };

function GroupMembers() {
  const [members, setMembers] = useState(initialMembers);
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
    setForm(emptyForm);
    setErrors({});
    setFormError(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = 'Member name is required';
    else if (form.name.length > 50) e.name = 'Keep it under 50 characters';
    if (!form.role.trim()) e.role = 'Member role is required';
    else if (form.role.length > 50) e.role = 'Keep it under 50 characters';
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
      const { data: created } = await api.post<Member>('/api/members/', {
        name: form.name.trim(),
        role: form.role.trim(),
      });

      setMembers(prev => [...prev, created]);
      closeModal();
    } catch (err) {
      if (!axios.isAxiosError(err)) {
        setFormError('Something went wrong.');
        return;
      }

      if (!err.response) {
        setFormError('Network error. Check your connection.');
        return;
      }

      const { status, data } = err.response;

      if (status === 400 && data && typeof data === 'object') {
        // DRF validation shape, e.g. { name: ["This field may not be blank."] }
        const serverErrors: Errors = {};
        for (const [key, val] of Object.entries(data)) {
          serverErrors[key] = Array.isArray(val) ? String(val[0]) : String(val);
        }
        setFormError(serverErrors.non_field_errors ?? null);
        setErrors(serverErrors);
        return;
      }

      if (status === 401) {
        setFormError('Please log in again.');
        return;
      }

      if (status === 403) {
        setFormError("You don't have permission to add members.");
        return;
      }

      setFormError(status >= 500 ? 'Server error. Try again later.' : 'Could not add member.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'border border-slate-light rounded-md px-2 py-1 text-sm';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
      {members.map(member => (
        <div key={member.id} className="bg-white border border-slate-light rounded-xl p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <span className={`w-3 h-3 rounded-[50%_50%_50%_0] rotate-45 bg-${member.color}`} />
            <h3 className="font-display text-sm font-semibold">{member.name}</h3>
          </div>
          <p className="text-xs text-slate">{member.role}</p>
        </div>
      ))}

      <button
        className="border-2 border-dashed border-slate-light rounded-xl flex items-center justify-center text-slate text-sm font-medium min-h-23 hover:bg-white"
        onClick={() => setIsOpen(true)}
      >
        + Add member
      </button>

      <Modal open={isOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
          {formError && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <label htmlFor="memberName">Member Name</label>
          <input
            type="text"
            id="memberName"
            name="name"
            value={form.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            placeholder="Enter member name"
            className={inputClass}
          />
          <FieldError msg={errors.name} />

          <label htmlFor="memberRole">Member Role</label>
          <input
            type="text"
            id="memberRole"
            name="role"
            value={form.role}
            onChange={handleChange}
            aria-invalid={!!errors.role}
            placeholder="What is the member's role?"
            className={inputClass}
          />
          <FieldError msg={errors.role} />

          <button
            type="submit"
            disabled={submitting}
            className="bg-salmon text-ink font-display font-semibold text-sm px-4 py-2 rounded-lg hover:bg-ink hover:text-white disabled:opacity-60"
          >
            {submitting ? 'Adding...' : 'Add Member'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default GroupMembers;
