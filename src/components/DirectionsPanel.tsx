import { useContext, useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";
import { FiChevronDown, FiChevronUp, FiCircle, FiMapPin, FiRepeat } from "react-icons/fi";
import { TbRoute } from "react-icons/tb";
import { MapDataContext, NavigationContext } from "@/pages/Map";
import { MapDataContextType, NavigationContextType } from "@/utils/types";
import { floorLabel } from "@/utils/places";
import { vertexForPlace } from "@/utils/floorHelpers";
import { formatDistance, formatDuration } from "@/utils/routing";
import { getFloorById } from "@/store/floors";

const STEP_ICON: Record<string, string> = {
  start: "●",
  walk: "→",
  stairs: "↕",
  elevator: "↕",
  bridge: "⇄",
  arrive: "⚑",
};

/** NAVIGATE: choose where you are coming from, then follow the steps. */
function DirectionsPanel() {
  const { objects } = useContext(MapDataContext) as MapDataContextType;
  const { navigation, setNavigation, route } = useContext(NavigationContext) as NavigationContextType;
  const startName = vertexForPlace(navigation.start)?.objectName ?? "";
  const [text, setText] = useState(startName);
  const [pickerOpen, setPickerOpen] = useState(!startName);
  const [stepsOpen, setStepsOpen] = useState(false);

  useEffect(() => setText(startName), [startName]);

  const dest = objects.find((o) => o.name === navigation.end);
  const query = text.trim().toLowerCase();
  const candidates = objects.filter(
    (o) =>
      o.name !== navigation.end &&
      vertexForPlace(o.name) &&
      (!query || o.name.toLowerCase().includes(query))
  );

  function pickStart(name: string) {
    setNavigation((prev) => ({ ...prev, start: name }));
    setText(name);
    setPickerOpen(false);
  }

  function swap() {
    if (!startName || !navigation.end) return;
    setNavigation((prev) => ({ ...prev, start: prev.end ?? "", end: startName, selected: startName }));
  }

  const close = () => setNavigation((prev) => ({ ...prev, end: "", selected: "" }));
  const sameSpot = startName && startName === navigation.end;

  return (
    <div className="relative flex-none mt-1.5 w-full md:max-w-xl md:self-center max-h-[45dvh] overflow-y-auto bg-[#000523]/95 backdrop-blur-md border border-white/15 shadow-lg rounded-[14px]">
      <div className="flex items-center justify-between pl-4 h-11 sticky top-0 bg-[#000523] z-10">
        <p className="text-tectonic-cyan font-semibold text-sm flex items-center gap-1.5">
          <TbRoute /> Directions
        </p>
        <button className="h-11 w-11 center" aria-label="close directions" onClick={close}>
          <FaX className="text-white/60" />
        </button>
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <label className="flex items-center gap-2 rounded-full bg-white/10 border border-white/15 pl-3 h-11">
              <FiCircle className="text-tectonic-cyan flex-none" />
              <input
                className="min-w-0 flex-1 bg-transparent h-full text-base text-white placeholder:text-white/50 focus:outline-none"
                placeholder="Where are you now?"
                aria-label="Starting point"
                value={text}
                onFocus={(e) => {
                  setPickerOpen(true);
                  e.currentTarget.select();
                }}
                onChange={(e) => {
                  setText(e.target.value);
                  setPickerOpen(true);
                }}
              />
            </label>
            <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 h-11">
              <FiMapPin className="text-tectonic-blue flex-none" />
              <p className="truncate text-sm text-white">
                {dest?.name} <span className="text-white/50">· {floorLabel(dest?.floorId)}</span>
              </p>
            </div>
          </div>
          <button
            className="flex-none w-11 h-11 center rounded-full bg-white/10 border border-white/15 text-white/80 disabled:opacity-30"
            aria-label="swap start and destination"
            disabled={!startName}
            onClick={swap}
          >
            <FiRepeat className="rotate-90" />
          </button>
        </div>

        {pickerOpen && (
          <div className="mt-2">
            {!query && (
              <div className="flex gap-2 mb-2">
                <button
                  className="px-3 h-9 rounded-full bg-tectonic-blue/20 border border-tectonic-blue/40 text-sm text-white"
                  onClick={() => pickStart("Main entrance")}
                >
                  I am at the main entrance
                </button>
              </div>
            )}
            <ul className="max-h-44 overflow-y-auto rounded-[12px] border border-white/10 bg-white/5">
              {candidates.length ? (
                candidates.map((o) => (
                  <li key={o.id}>
                    <button
                      className="w-full text-left px-3 py-2 min-h-[44px] border-t border-white/10 first:border-t-0 active:bg-white/20"
                      onClick={() => pickStart(o.name)}
                    >
                      <span className="block text-sm text-white">{o.name}</span>
                      <span className="block text-xs text-white/50">{floorLabel(o.floorId)}</span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-3 py-3 text-sm text-white/60">No places found</li>
              )}
            </ul>
          </div>
        )}

        {!pickerOpen && !startName && (
          <p className="mt-3 text-sm text-white/60">Choose where you are to see the route.</p>
        )}
        {!pickerOpen && sameSpot && <p className="mt-3 text-sm text-white/60">You are already here.</p>}
        {!pickerOpen && startName && !sameSpot && !route && (
          <p className="mt-3 text-sm text-white/60">No walking route found between these places.</p>
        )}

        {!pickerOpen && route && (
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold">
                {formatDuration(route.seconds)}{" "}
                <span className="text-white/60 font-normal">· {formatDistance(route.meters)}</span>
              </p>
              <button
                className="flex items-center gap-1 px-3 h-9 rounded-full bg-white/10 text-sm text-white/80"
                aria-expanded={stepsOpen}
                onClick={() => setStepsOpen((o) => !o)}
              >
                Steps {stepsOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
            {route.floorIds.length > 1 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {route.floorIds.map((id) => (
                  <button
                    key={id}
                    className={`px-3 h-8 rounded-full text-xs font-semibold border ${
                      navigation.activeFloor === id
                        ? "bg-tectonic-blue border-tectonic-blue text-white"
                        : "bg-white/5 border-white/15 text-white/70"
                    }`}
                    onClick={() => setNavigation((prev) => ({ ...prev, activeFloor: id }))}
                  >
                    {getFloorById(id)?.name.replace(/^.* - /, "")}
                  </button>
                ))}
              </div>
            )}
            {stepsOpen && (
            <ol className="mt-2">
              {route.steps.map((step, i) => (
                <li key={i}>
                  <button
                    className="w-full flex items-start gap-3 text-left py-2 min-h-[44px] active:bg-white/10 rounded-lg"
                    onClick={() => setNavigation((prev) => ({ ...prev, activeFloor: step.floorId }))}
                  >
                    <span className="flex-none w-6 h-6 mt-0.5 center rounded-full bg-white/10 text-tectonic-cyan text-xs">
                      {STEP_ICON[step.kind]}
                    </span>
                    <span className="text-sm text-white/90">{step.text}</span>
                  </button>
                </li>
              ))}
            </ol>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DirectionsPanel;
