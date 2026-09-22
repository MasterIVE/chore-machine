import { NavLink, useParams } from "react-router-dom";
import { groups } from "../data/mockGroups";

function DesktopShell({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg text-[13px] font-display font-semibold ${
      isActive ? 'bg-navy text-white' : 'text-slate hover:bg-white/60'
    }`;

  return (
    <div className="flex min-h-screen bg-sky font-body text-ink">
      <aside className="w-56 shrink-0 bg-navy-deep text-white p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-7 font-display font-bold text-base">
          <span className="w-5.5 h-5.5 rounded-tl-full rounded-tr-full rounded-bl-full bg-salmon rotate-45" />
          Chore Machine
        </div>

        <div className="text-[11px] uppercase tracking-wider text-slate-300/70 font-mono mb-2 mt-3">
          Your groups
        </div>

        {groups.map(g => (
          <NavLink
            key={g.id}
            to={`/groups/${g.id}/tasks`}
            className={({ isActive }) =>
              `text-left px-2.5 py-2 rounded-lg text-[13.5px] mb-1 flex justify-between ${
                isActive ? 'bg-salmon/18 text-salmon-soft font-semibold' : 'hover:bg-white/5'
              }`
            }
          >
            {g.name} <span className="text-[11px] font-mono text-slate-300/70">{g.taskCount}</span>
          </NavLink>
        ))}

        <button className="mt-auto bg-salmon text-ink font-display font-semibold text-[13px] py-2.5 rounded-lg hover:bg-white/5 hover:text-white">
          <a href={`/groups/${id}`}>+ New group</a>
        </button>
      </aside>

      <main className="flex-1 p-6 relative">
       {/* this is where the title will be */}   

        {id && (
          <div className="flex gap-1.5 mb-4">
            <NavLink to={`/groups/${id}/tasks`} className={tabClass}>Tasks</NavLink>
            <NavLink to={`/groups/${id}/members`} className={tabClass}>Members</NavLink>
            <NavLink to={`/groups/${id}/assign`} className={tabClass}>Assign</NavLink>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
export default DesktopShell;