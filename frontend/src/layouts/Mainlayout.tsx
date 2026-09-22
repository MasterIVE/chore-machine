import {Outlet} from "react-router-dom";
import DesktopShell from "./DesktopShell";
import MobileShell from "./MobileShell";
import { useMediaQuery } from "../hooks/usMediaQuery";

function Mainlayout() {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return isDesktop
    ? <DesktopShell><Outlet /></DesktopShell>
    : <MobileShell><Outlet /></MobileShell>;
}
export default Mainlayout