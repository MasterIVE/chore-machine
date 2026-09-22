// layouts/MobileShell.tsx
import { NavLink } from 'react-router-dom';

function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-sky font-body text-ink">
      {/* Top bar — no sidebar on mobile */}
      <header className="bg-navy-deep text-white px-4 pt-6 pb-3">
        <div className="text-[11px] text-slate-300/70 font-mono">Roomies — Flat 4B</div>
        <div className="font-display font-bold text-lg">Chores</div>
      </header>

      {/* Page content slot */}
      <main className="flex-1 overflow-y-auto p-3.5">
        {children}   {/* ← Outlet lands here instead */}
      </main>

      {/* Bottom nav — the thing that replaces the sidebar entirely */}
      <nav className="bg-white border-t border-slate-light flex justify-around py-2.5">
        <NavLink to="/groups" className="flex flex-col items-center gap-1 text-[9.5px] font-mono">
          {({ isActive }) => (
            <>
              <span className={`w-4.5 h-4.5 rounded-md ${isActive ? 'bg-salmon' : 'bg-slate-light'}`} />
              <span className={isActive ? 'text-navy-deep font-semibold' : 'text-slate'}>Home</span>
            </>
          )}
        </NavLink>
        <NavLink to="/groups/:id/tasks" className="flex flex-col items-center gap-1 text-[9.5px] font-mono">
          {({ isActive }) => (
            <>
              <span className={`w-4.5 h-4.5 rounded-md ${isActive ? 'bg-salmon' : 'bg-slate-light'}`} />
              <span className={isActive ? 'text-navy-deep font-semibold' : 'text-slate'}>Chores</span>
            </>
          )}
        </NavLink>
        <NavLink to="/groups/:id/assign/simple" className="flex flex-col items-center gap-1 text-[9.5px] font-mono">
          {({ isActive }) => (
            <>
              <span className={`w-4.5 h-4.5 rounded-md ${isActive ? 'bg-salmon' : 'bg-slate-light'}`} />
              <span className={isActive ? 'text-navy-deep font-semibold' : 'text-slate'}>Assign</span>
            </>
          )}
        </NavLink>
        <NavLink to="/profile" className="flex flex-col items-center gap-1 text-[9.5px] font-mono">
          {({ isActive }) => (
            <>
              <span className={`w-4.5 h-4.5 rounded-md ${isActive ? 'bg-salmon' : 'bg-slate-light'}`} />
              <span className={isActive ? 'text-navy-deep font-semibold' : 'text-slate'}>Profile</span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
}
export default MobileShell