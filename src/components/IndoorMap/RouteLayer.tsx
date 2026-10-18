import { useContext } from "react";
import { NavigationContext } from "@/pages/Map";
import { NavigationContextType } from "@/utils/types";

/** Draws the active floor's slice of the walking route, with start / end / floor-change markers. */
function RouteLayer() {
  const { navigation, route } = useContext(NavigationContext) as NavigationContextType;
  if (!route) return null;
  const floor = navigation.activeFloor;
  const segment = route.segments.find((s) => s.floorId === floor);
  const d = segment ? "M" + segment.points.map(([x, y]) => `${x} ${y}`).join("L") : "";
  const leaves = route.segments.find((s, i) => s.floorId === floor && i < route.segments.length - 1);
  const leavePoint = leaves?.points[leaves.points.length - 1];
  const enters = route.segments.find((s) => s.floorId === floor && s.enteredVia);
  const enterPoint = enters?.points[0];

  return (
    <g id="Route" className="pointer-events-none">
      {d && (
        <>
          <path d={d} className="route-casing" fill="none" />
          <path d={d} className="route-line" fill="none" />
        </>
      )}
      {[leavePoint, enterPoint].map(
        (p, i) => p && <circle key={i} cx={p[0]} cy={p[1]} r={30} className="route-change" />
      )}
      {route.start.floorId === floor && (
        <circle cx={route.start.cx} cy={route.start.cy} r={30} className="route-start" />
      )}
      {route.end.floorId === floor && (
        <g>
          <circle cx={route.end.cx} cy={route.end.cy} r={46} className="route-end-halo" />
          <circle cx={route.end.cx} cy={route.end.cy} r={32} className="route-end" />
        </g>
      )}
    </g>
  );
}

export default RouteLayer;
