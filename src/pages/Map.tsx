import IndoorMapWrapper from "@/components/IndoorMapWrapper";
import DirectionsPanel from "@/components/DirectionsPanel";
import PlaceSheet from "@/components/PlaceSheet";
import Toolbar from "@/components/Toolbar";
import VenueSwitcher from "@/components/VenueSwitcher";
import { createContext, useEffect, useMemo, useState } from "react";
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
import { computeRoute } from "@/utils/routing";
import { findPlaceFromLink } from "@/utils/places";

export const NavigationContext = createContext<NavigationContextType | null>(
  null
);
export const MapDataContext = createContext<MapDataContextType | null>(null);
function Map() {
  const [searchParams, setSearchParams] = useSearchParams();
  // "?position=<place>" lets a QR code or link preset the starting point;
  // "?to=<place>" opens directions to a location (e.g. ?to=Workshop%20room%201).
  const startPosition = searchParams.get("position") || "";
  const linkDestination = findPlaceFromLink(searchParams.get("to"));
  const [navigation, setNavigation] = useState<Navigation>({
    start: startPosition,
    end: linkDestination?.name ?? "",
    selected: linkDestination?.name,
    activeFloor: linkDestination?.floorId ?? resolveFloorIdForStart(startPosition),
  });
  const route = useMemo(
    () => computeRoute(navigation.start, navigation.end ?? ""),
    [navigation.start, navigation.end]
  );
  // When a route appears, show the floor it starts on.
  useEffect(() => {
    if (route) {
      setNavigation((prev) => ({ ...prev, activeFloor: route.segments[0].floorId }));
    }
  }, [route]);

  const navigationValue: NavigationContextType = {
    navigation,
    setNavigation,
    route,
  };
  const categories: Category[] = db.categories;
  const objects = useMemo((): ObjectItem[] => {
    const objectsData: ObjectItem[] = db.objects;
    objectsData.forEach((obj) => {
      obj.categoryName = categories.find((cat) => cat.id === obj.categoryId)?.name;
    });
    return objectsData;
  }, [categories]);

  // Keep the URL shareable: it reflects the current starting point and destination.
  useEffect(() => {
    const params: Record<string, string> = {};
    if (navigation.start) params.position = navigation.start;
    if (navigation.end) params.to = navigation.end;
    setSearchParams(params, { replace: true });
  }, [navigation.start, navigation.end]);

  const mapData = { objects, categories };
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
            {navigation.end ? <DirectionsPanel /> : navigation.selected ? <PlaceSheet /> : null}
          </main>
        </div>
      </NavigationContext.Provider>
    </MapDataContext.Provider>
  );
}

export default Map;
