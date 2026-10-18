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

  const links = floorLinks
    .filter((link) => link.floorId === navigation.activeFloor)
    // Stairs/ramps/bridges first, labels last: a label drawn over a ramp must win the tap.
    .sort((a, b) => Number(!!a.rect) - Number(!!b.rect));

  // Each link is drawn twice: first an invisible touch margin (all margins in one layer
  // underneath), then the shape itself on top, so a margin never steals a tap from a shape.
  const render = (halo: boolean) =>
    links.map((link, i) => {
          const label = `Go to ${getFloorById(link.targetFloorId)?.name ?? link.targetFloorId}`;
          const props = {
            role: halo ? undefined : "button",
            "aria-label": halo ? undefined : label,
            "aria-hidden": halo ? true : undefined,
            className: halo
              ? `floor-link-halo ${className ?? ""}`
              : `object floor-link ${className ?? ""}`,
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
                rx={Math.min(Math.min(w, h) / 2, 24) + PILL_PAD}
                transform={link.angle ? `rotate(${link.angle} ${x} ${y})` : undefined}
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
        });

  return (
    <g id="FloorLinks">
      <g>{render(true)}</g>
      <g>{render(false)}</g>
    </g>
  );
}

export default FloorLinks;
