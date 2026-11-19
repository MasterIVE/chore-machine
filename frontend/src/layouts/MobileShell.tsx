// layouts/MobileShell.tsx
import { NavLink, Outlet, useMatch } from 'react-router-dom';

function NavItem({ to, label, end }: { to: string; label: string; end?: boolean }) {
  return (
    <NavLink to={to} end={end} className="flex flex-col items-center gap-1 text-[9.5px] font-mono">
      {({ isActive }) => (
        <>
          <span className={`w-4.5 h-4.5 rounded-md ${isActive ? 'bg-salmon' : 'bg-slate-light'}`} />
          <span className={isActive ? 'text-navy-deep font-semibold' : 'text-slate'}>{label}</span>
        </>
      )}
    </NavLink>
  );
}

function MobileShell() {
  // This layout sits above the groups/:id route, so useParams() can't see the id.
  // useMatch reads it straight from the URL instead.
  const match = useMatch('/groups/:id/*');
  const groupId = match?.params.id;

  return (
    <div className="flex flex-col min-h-screen bg-sky font-body text-ink">
      {/* Top bar — no sidebar on mobile */}
      <header className="bg-navy-deep text-white px-4 pt-6 pb-3">
        <div className="text-[11px] text-slate-300/70 font-mono">Roomies — Flat 4B</div>
        <div className="font-display font-bold text-lg">Chores</div>
      </header>

      {/* Page content slot */}
      <main className="flex-1 overflow-y-auto p-3.5">
        <Outlet />
      </main>

      {/* Bottom nav — replaces the sidebar */}
      <nav className="bg-white border-t border-slate-light flex justify-around py-2.5">
        <NavItem to="/groups" label="Home" end />

        {/* Only meaningful once a group is open */}
        {groupId && (
          <>
            <NavItem to={`/groups/${groupId}/tasks`} label="Chores" />
            <NavItem to={`/groups/${groupId}/assign`} label="Assign" />
          </>
        )}

        <NavItem to="/profile/me" label="Profile" />
      </nav>
    </div>
  );
}

export default MobileShell;
