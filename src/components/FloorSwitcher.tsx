import { useContext } from "react";
import { NavigationContext } from "@/pages/Map";
import { NavigationContextType } from "@/utils/types";
import { getFloorById, getFloorsForVenue } from "@/store/floors";

/**
 * Floor-level switcher, styled as a floating vertical pill stack (bottom-right,
 * thumb reachable) since this is a phone-first control (see CLAUDE.md).
 */
function FloorSwitcher() {
  const { navigation, setNavigation } = useContext(
    NavigationContext
  ) as NavigationContextType;

  const activeFloor = getFloorById(navigation.activeFloor);
  if (!activeFloor) return null;

  const floors = getFloorsForVenue(activeFloor.venueId).slice().reverse();
  if (floors.length <= 1) return null;

  return (
    <div className="absolute right-2 bottom-16 md:bottom-16 flex flex-col gap-1.5 z-10">
      {floors.map((floor) => {
        const isActive = floor.id === navigation.activeFloor;
        return (
          <button
            key={floor.id}
            type="button"
            aria-label={floor.name}
            aria-pressed={isActive}
            onClick={() =>
              setNavigation((prev) => ({ ...prev, activeFloor: floor.id }))
            }
            className={`w-11 h-11 shrink-0 rounded-full text-xs font-semibold shadow-md border transition-colors ${
              isActive
                ? "bg-tectonic-blue text-white border-tectonic-blue"
                : "bg-white text-gray-700 border-gray-200 active:bg-gray-100"
            }`}
          >
            {floor.shortLabel ?? floor.name}
          </button>
        );
      })}
    </div>
  );
}

export default FloorSwitcher;
