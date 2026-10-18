import { useContext } from "react";
import { NavigationContext } from "@/pages/Map";
import { NavigationContextType } from "@/utils/types";
import { floorLinks } from "@/store/floorLinks";
import { getFloorById } from "@/store/floors";

const PILL_PAD = 8;

/**
 * Makes the direction labels, stairs, ramps and bridges on the active floor map
 * switch to the floor they lead to.
 */
function FloorLinks({ className }: { className?: string }) {
  const { navigation, setNavigation } = useContext(
    NavigationContext
  ) as NavigationContextType;

  return (
    <g id="FloorLinks">
      {floorLinks
        .filter((link) => link.floorId === navigation.activeFloor)
        .map((link, i) => {
          const label = `Go to ${getFloorById(link.targetFloorId)?.name ?? link.targetFloorId}`;
          const props = {
            role: "button",
            "aria-label": label,
            className: `object floor-link ${className ?? ""}`,
            onClick: () =>
              setNavigation((prev) => ({ ...prev, activeFloor: link.targetFloorId })),
          };
          if (link.rect) {
            const [x, y, w, h] = link.rect;
            return (
              <rect
                key={i}
                {...props}
                x={x - PILL_PAD}
                y={y - PILL_PAD}
                width={w + 2 * PILL_PAD}
                height={h + 2 * PILL_PAD}
                rx={Math.min(w, h) / 2 + PILL_PAD}
              >
                <title>{label}</title>
              </rect>
            );
          }
          return (
            <path key={i} {...props} d={link.area}>
              <title>{label}</title>
            </path>
          );
        })}
    </g>
  );
}

export default FloorLinks;
