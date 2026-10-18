import { useContext } from "react";
import { FaX } from "react-icons/fa6";
import { TbRoute } from "react-icons/tb";
import { MapDataContext, NavigationContext } from "@/pages/Map";
import { MapDataContextType, NavigationContextType } from "@/utils/types";
import { directionsTo, floorLabel } from "@/utils/places";

/** LOCATE result: what the place is and where, with a clear Directions button to NAVIGATE there. */
function PlaceSheet() {
  const { objects } = useContext(MapDataContext) as MapDataContextType;
  const { navigation, setNavigation } = useContext(NavigationContext) as NavigationContextType;
  const place = objects.find((o) => o.name === navigation.selected);
  if (!place) return null;

  return (
    <div className="relative flex-none mt-1.5 w-full md:max-w-xl md:self-center bg-[#000523]/95 backdrop-blur-md border border-white/15 shadow-lg rounded-[14px] overflow-hidden">
      <button
        className="absolute right-0 top-0 h-11 w-11 center"
        aria-label="close"
        onClick={() => setNavigation((prev) => ({ ...prev, selected: "" }))}
      >
        <FaX className="text-white/60" />
      </button>
      <div className="p-4 pb-3 pr-12">
        <p className="text-white/60 text-xs uppercase tracking-wide">{place.categoryName}</p>
        <h1 className="text-white text-xl font-semibold leading-tight">{place.name}</h1>
        <p className="text-tectonic-cyan text-sm font-semibold mb-1">{floorLabel(place.floorId)}</p>
        <p className="text-white/70 text-sm line-clamp-3">{place.desc}</p>
      </div>
      <div className="px-4 pb-4">
        <button
          type="button"
          className="w-full h-12 center gap-2 rounded-full bg-tectonic-blue active:bg-tectonic-blue/80 text-white font-semibold"
          onClick={() => directionsTo(place.name, setNavigation)}
        >
          <TbRoute className="text-xl" />
          Directions
        </button>
      </div>
    </div>
  );
}

export default PlaceSheet;
