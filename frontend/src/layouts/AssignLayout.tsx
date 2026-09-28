// pages/AssignLayout.tsx
import { NavLink, Outlet, useParams } from 'react-router-dom';

function AssignLayout() {
  const { id } = useParams<{ id: string }>();

  const toggleClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-full text-[12.5px] font-display font-semibold border ${
      isActive
        ? 'bg-navy text-white border-navy'
        : 'bg-white text-slate border-slate-light'
    }`;

  return (
    <div>
      {/* Calender */}

      <div className="flex gap-2 mb-4">
        <NavLink to={`/groups/${id}/assign/simple`} className={toggleClass}>
          Simple assign
        </NavLink>
        <NavLink to={`/groups/${id}/assign/advanced`} className={toggleClass}>
          Advanced assign
        </NavLink>
      </div>

      {/* Simple/Advanced matched URL renders here */}
      <Outlet />
    </div>
  );
}
export default AssignLayout