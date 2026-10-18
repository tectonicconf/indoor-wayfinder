import { useContext } from "react";
import { NavigationContext } from "@/pages/Map";
import { NavigationContextType } from "@/utils/types";
import { floorLinks } from "@/store/floorLinks";
import { getFloorById } from "@/store/floors";

const PILL_PAD = 8;

/** Unrotated width/height of a label whose tilted bounding box is bw x bh. */
function tiltedSize(bw: number, bh: number, angle: number): [number, number] {
  const t = (Math.abs(angle) * Math.PI) / 180;
  const c = Math.cos(t);
  const s = Math.sin(t);
  const det = c * c - s * s;
  if (!angle || det < 0.1) return [bw, bh];
  const w = (c * bw - s * bh) / det;
  const h = (c * bh - s * bw) / det;
  return w > 0 && h > 0 ? [w, Math.max(h, 24)] : [bw, bh];
}

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
            const [x, y, bw, bh] = link.rect;
            const [w, h] = tiltedSize(bw, bh, link.angle ?? 0);
            const cx = x + bw / 2;
            const cy = y + bh / 2;
            return (
              <rect
                key={i}
                {...props}
                x={cx - w / 2 - PILL_PAD}
                y={cy - h / 2 - PILL_PAD}
                width={w + 2 * PILL_PAD}
                height={h + 2 * PILL_PAD}
                rx={Math.min(w, h) / 2 + PILL_PAD}
                transform={link.angle ? `rotate(${link.angle} ${cx} ${cy})` : undefined}
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
