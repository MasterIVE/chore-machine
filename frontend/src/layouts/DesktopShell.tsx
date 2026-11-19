import { Link, NavLink, Outlet } from "react-router-dom";
import { groups } from "../data/mockGroups";

function DesktopShell() {
  return (
    <div className="flex min-h-screen bg-sky font-body text-ink">
      <aside className="w-56 shrink-0 bg-navy-deep text-white p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-7 font-display font-bold text-base">
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

        <Link
          to="/groups"
          className="mt-auto text-center bg-salmon text-ink font-display font-semibold text-[13px] py-2.5 rounded-lg hover:bg-white/8 transition-colors"
        >
          + New group
        </Link>
      </aside>

      <main className="flex-1 p-6 relative">
        <Outlet />
      </main>
    </div>
  );
}

export default DesktopShell;
