// pages/Groups.tsx
import React, { useState } from 'react';
import { groups as initialGroups } from '../data/mockGroups';
import Modal from '../components/addModal';


function Groups() {
  const [groups, setGroups] = useState(initialGroups);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [isOpen, setIsOpen] = useState(false);



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

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl text-navy-deep">Manage groups</h2>

          <button className="bg-salmon text-ink font-display font-semibold text-sm px-4 py-2 rounded-lg  hover:bg-ink hover:text-white" onClick={() => setIsOpen(true)}>
            + New group
          </button>
 
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {groups.map(g => (
          <div key={g.id} className="bg-white border border-slate-light rounded-xl p-4 flex items-center justify-between">
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

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <form>
          <label htmlFor="groupName">Group Name</label>
          <input
            type="text"
            id="groupName"
            placeholder="Enter group name"
          />
          <button type="submit" className="bg-salmon text-ink font-display font-semibold text-sm px-4 py-2 rounded-lg hover:bg-ink hover:text-white">
            Add Group
          </button>                                     
        </form>
      </Modal>
    </div>
  );
}
export default Groups;