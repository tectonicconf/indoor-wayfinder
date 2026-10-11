import { useContext } from "react";
import { NavigationContext } from "@/pages/Map";
import { NavigationContextType } from "@/utils/types";
import { getFloorById, getDefaultFloorForVenue, venues } from "@/store/floors";

/**
 * Venue switcher, styled as a floating segmented control (top-left, thumb reachable)
 * since this is a phone-first control (see CLAUDE.md). Switching venues lands on
 * that venue's default floor - the floor switcher then lists that venue's levels.
 */
function VenueSwitcher() {
  const { navigation, setNavigation } = useContext(
    NavigationContext
  ) as NavigationContextType;

  const activeFloor = getFloorById(navigation.activeFloor);
  if (!activeFloor || venues.length < 2) return null;

  return (
    <div className="absolute left-1.5 top-1.5 flex rounded-full bg-white shadow-md border border-gray-200 overflow-hidden z-10">
      {venues.map((venue) => {
        const isActive = venue.id === activeFloor.venueId;
        return (
          <button
            key={venue.id}
            type="button"
            aria-label={venue.name}
            aria-pressed={isActive}
            onClick={() => {
              const targetFloor = getDefaultFloorForVenue(venue.id);
              if (!targetFloor) return;
              setNavigation((prev) => ({ ...prev, activeFloor: targetFloor.id }));
            }}
            className={`h-11 px-4 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-tectonic-blue text-white"
                : "bg-white text-gray-700 active:bg-gray-100"
            }`}
          >
            {venue.name}
          </button>
        );
      })}
    </div>
  );
}

export default VenueSwitcher;
