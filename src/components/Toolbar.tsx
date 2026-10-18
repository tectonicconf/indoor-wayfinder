import { NavigationContext } from "@/pages/Map";
import { NavigationContextType } from "@/utils/types";
import { useContext } from "react";
import { isDesktop } from "react-device-detect";
import DesktopRouteDetails from "./DesktopRouteDetails";
import SearchBar from "./SearchBar";

function Toolbar() {
  const { navigation } = useContext(NavigationContext) as NavigationContextType;
  return (
    <div className="flex space-x-1 mb-1.5 md:mb-0 h-12 flex-none relative">
      <SearchBar />
      {navigation.end && isDesktop && <DesktopRouteDetails />}
    </div>
  );
}

export default Toolbar;
