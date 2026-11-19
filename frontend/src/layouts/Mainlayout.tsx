import DesktopShell from "./DesktopShell";
import MobileShell from "./MobileShell";
import { useMediaQuery } from "../hooks/usMediaQuery";

// Each shell renders its own <Outlet />, so nothing needs to be passed in
function Mainlayout() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return isDesktop ? <DesktopShell /> : <MobileShell />;
}

export default Mainlayout;
