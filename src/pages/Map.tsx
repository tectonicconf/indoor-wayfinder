import IndoorMapWrapper from "@/components/IndoorMapWrapper";
import MobileRouteDetails from "@/components/MobileRouteDetails";
import Toolbar from "@/components/Toolbar";
import VenueSwitcher from "@/components/VenueSwitcher";
import { createContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useSearchParams } from "react-router-dom";
import {
  MapDataContextType,
  Navigation,
  NavigationContextType,
  ObjectItem,
  Category,
} from "../utils/types";
import db from "@/assets/db.json";
import { resolveFloorIdForStart } from "@/utils/floorHelpers";

export const NavigationContext = createContext<NavigationContextType | null>(
  null
);
export const MapDataContext = createContext<MapDataContextType | null>(null);
function Map() {
  let [searchParams, setSearchParams] = useSearchParams();
  // No default vertex yet - real venue waypoints (Vooruit, Wintercircus) still need authoring.
  const DEFAULT_POSITION = "";
  const startPosition = searchParams.get("position") || DEFAULT_POSITION;
  const [navigation, setNavigation] = useState<Navigation>({
    start: startPosition,
    end: "",
    activeFloor: resolveFloorIdForStart(startPosition),
  });
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const navigationValue: NavigationContextType = {
    navigation,
    setNavigation,
    isEditMode,
    setIsEditMode,
  };
  const categories: Category[] = db.categories;
  const objects = (): ObjectItem[] => {
    const objectsData: ObjectItem[] = db.objects;
    // Add categoryName to each object
    objectsData.forEach((obj) => {
      obj.categoryName = categories.find(
        (cat) => cat.id === obj.categoryId
      )?.name;
    });
    return objectsData;
  };

  useEffect(() => {
    setSearchParams({ position: navigation.start });
  }, [navigation.start]);

  const mapData = { objects: objects(), categories };
  return (
    <MapDataContext.Provider value={mapData}>
      <NavigationContext.Provider value={navigationValue}>
        <div className="flex bg-tectonic-navy text-white relative overflow-hidden w-full h-[100dvh]">
          <main
            className="flex w-full min-h-0 flex-grow flex-col md:p-6 p-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] pt-[max(0.375rem,env(safe-area-inset-top))]"
          >
            {/* Phone: search and venue switcher stacked; desktop: one row, search top-left, venue switcher centered. */}
            <div className="relative z-20 flex flex-none flex-col md:flex-row md:items-center md:gap-4 md:mb-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
              <Toolbar />
              <VenueSwitcher />
            </div>
            <div className="center w-full flex-1 min-h-0">
              <IndoorMapWrapper />
            </div>
            {navigation.end && isMobile && <MobileRouteDetails />}
          </main>
        </div>
      </NavigationContext.Provider>
    </MapDataContext.Provider>
  );
}

export default Map;
