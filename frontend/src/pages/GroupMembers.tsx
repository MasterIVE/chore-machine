import { members } from '../data/mockMembers';
import { tasks } from '../data/mockTasks';

function GroupMembers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
      {members.map(member => {
        const activeCount = tasks.filter(t => t.assigneeId === member.id && t.status !== 'done').length;
        return (
          <div key={member.id} className="bg-white border border-slate-light rounded-xl p-4">
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`w-3 h-3 rounded-[50%_50%_50%_0] rotate-45 bg-${member.color}`} />
              <h3 className="font-display text-sm font-semibold">{member.name}</h3>
            </div>
            <p className="text-xs text-slate">{member.role}</p>
            <p className="text-[11.5px] font-mono text-slate mt-2">
              {activeCount} active chore{activeCount !== 1 ? 's' : ''}
            </p>
          </div>
        );
      })}

      <button className="border-2 border-dashed border-slate-light rounded-xl flex items-center justify-center text-slate text-sm font-medium min-h-23 hover:bg-white">
        + Add member
      </button>
    </div>
  );
}
export default GroupMembers;