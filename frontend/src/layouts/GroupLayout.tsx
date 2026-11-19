import { NavLink, Outlet, useParams } from 'react-router-dom';

function GroupLayout() {
  // This component is the element of the groups/:id route, so id is always set here
  const { id } = useParams<{ id: string }>();

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg text-[13px] font-display font-semibold ${
      isActive ? 'bg-navy text-white' : 'text-slate hover:bg-white/60'
    }`;

  return (
    <div>
      <div className="flex gap-1.5 mb-4">
        <NavLink to={`/groups/${id}/tasks`} className={tabClass}>Tasks</NavLink>
        <NavLink to={`/groups/${id}/members`} className={tabClass}>Members</NavLink>
        <NavLink to={`/groups/${id}/assign`} className={tabClass}>Assign</NavLink>
      </div>

      {/* Tasks / Members / Assign render here */}
      <Outlet />
    </div>
  );
}

export default GroupLayout;
