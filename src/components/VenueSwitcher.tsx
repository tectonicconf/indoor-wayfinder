import { useContext, useEffect, useRef } from "react";
import { NavigationContext } from "@/pages/Map";
import { NavigationContextType } from "@/utils/types";
import { getFloorById, getDefaultFloorForVenue, venues } from "@/store/floors";

/**
 * Venue switcher, a full-width segmented control above the map (phone-first, see
 * CLAUDE.md). Switching venues returns to
 * the floor last viewed in that venue (or its default floor on first visit) - the
 * floor switcher then lists that venue's levels.
 */
function VenueSwitcher() {
  const { navigation, setNavigation } = useContext(
    NavigationContext
  ) as NavigationContextType;

  const activeFloor = getFloorById(navigation.activeFloor);
  const lastFloorByVenue = useRef<Record<string, string>>({});
  useEffect(() => {
    if (activeFloor) lastFloorByVenue.current[activeFloor.venueId] = activeFloor.id;
  }, [activeFloor]);

  if (!activeFloor || venues.length < 2) return null;

  return (
    <div className="flex flex-none gap-1 p-1 mb-1.5 md:mb-0 w-full md:flex-1 md:max-w-96 lg:w-96 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
      {venues.map((venue) => {
        const isActive = venue.id === activeFloor.venueId;
        return (
          <button
            key={venue.id}
            type="button"
            aria-label={venue.name}
            aria-pressed={isActive}
            onClick={() => {
              if (isActive) return;
              const targetFloor =
                getFloorById(lastFloorByVenue.current[venue.id] ?? "") ??
                getDefaultFloorForVenue(venue.id);
              if (!targetFloor) return;
              setNavigation((prev) => ({ ...prev, activeFloor: targetFloor.id }));
            }}
            className={`flex-1 h-10 px-2 md:px-4 rounded-full text-sm font-semibold transition-colors ${
              isActive
                ? "bg-tectonic-blue text-white"
                : "text-white/80 active:bg-white/10"
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
