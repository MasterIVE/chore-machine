import { members } from '../data/mockMembers';
import Modal from '../components/addModal';
import { useState } from 'react';

function GroupMembers() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
      {members.map(member => {
  
        return (
          <div key={member.id} className="bg-white border border-slate-light rounded-xl p-4">
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`w-3 h-3 rounded-[50%_50%_50%_0] rotate-45 bg-${member.color}`} />
              <h3 className="font-display text-sm font-semibold">{member.name}</h3>
            </div>
            <p className="text-xs text-slate">{member.role}</p>
            
          </div>
        );
      })}

      <button className="border-2 border-dashed border-slate-light rounded-xl flex items-center justify-center text-slate text-sm font-medium min-h-23 hover:bg-white " onClick={() => setIsOpen(true)}>
        + Add member
      </button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <form className="flex flex-col gap-3">
          <label htmlFor="memberName">Member Name</label>
          <input
            type="text"
            id="memberName"
            placeholder="Enter member name"
            className="border border-slate-light rounded-md px-2 py-1 text-sm flex-1 mr-3"
            required
          />
          <label htmlFor="memberRole">Member Role</label>
          <input
            type="text"
            id="memberRole"
            placeholder="What is the member's role?"
            className="border border-slate-light rounded-md px-2 py-1 text-sm flex-1 mr-3"
            required
          />
          <button type="submit" className="bg-salmon text-ink font-display font-semibold text-sm px-4 py-2 rounded-lg hover:bg-ink hover:text-white">
            Add Member
          </button>                                     
        </form>
      </Modal>

    </div>
  );
}
export default GroupMembers;