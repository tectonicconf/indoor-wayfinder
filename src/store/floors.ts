// Floor maps from the "Tectonic 26 Master File" design export (2800x2520 SVG each, text outlined).
import vooruitFloor0 from "@/assets/floorplans/tectonic-26/vooruit-0-meeting-hub.svg";
import vooruitFloor1 from "@/assets/floorplans/tectonic-26/vooruit-1-pitching-stage.svg";
import wintercircusNeg2 from "@/assets/floorplans/tectonic-26/wintercircus-neg2.svg";
import wintercircusNeg1 from "@/assets/floorplans/tectonic-26/wintercircus-neg1.svg";
import wintercircus0 from "@/assets/floorplans/tectonic-26/wintercircus-0.svg";
import wintercircus1 from "@/assets/floorplans/tectonic-26/wintercircus-1.svg";
import wintercircus4 from "@/assets/floorplans/tectonic-26/wintercircus-4.svg";
import bridgeOverview from "@/assets/floorplans/tectonic-26/bridge-wintercircus-neg2-vooruit-0.svg";

export interface Venue {
  id: string;
  name: string;
}

export interface Floor {
  id: string;
  venueId: string;
  name: string;
  /** Sort order within a venue; also doubles as the displayed level number where relevant. */
  order: number;
  /** Compact label (e.g. "GF", "+1F") for the floor switcher pill. Falls back to `name`. */
  shortLabel?: string;
  /** Floor map image URL (SVG or raster). */
  svg: string;
  viewBox: string;
}

export const venues: Venue[] = [
  { id: "wintercircus", name: "Wintercircus" },
  { id: "vooruit", name: "Vooruit" },
  { id: "overview", name: "Overview" },
];

export const floors: Floor[] = [
  {
    id: "vooruit-0",
    venueId: "vooruit",
    name: "Vooruit - Meeting Hub (Level 0)",
    order: 0,
    shortLabel: "0",
    svg: vooruitFloor0,
    viewBox: "0 0 2800 2520",
  },
  {
    id: "vooruit-1",
    venueId: "vooruit",
    name: "Vooruit - Pitching Stage (Level +1)",
    order: 1,
    shortLabel: "1",
    svg: vooruitFloor1,
    viewBox: "0 0 2800 2520",
  },
  {
    id: "wintercircus-neg2",
    venueId: "wintercircus",
    name: "Wintercircus - Level -2",
    order: -2,
    shortLabel: "-2",
    svg: wintercircusNeg2,
    viewBox: "0 0 2800 2520",
  },
  {
    id: "wintercircus-neg1",
    venueId: "wintercircus",
    name: "Wintercircus - Level -1",
    order: -1,
    shortLabel: "-1",
    svg: wintercircusNeg1,
    viewBox: "0 0 2800 2520",
  },
  {
    id: "wintercircus-0",
    venueId: "wintercircus",
    name: "Wintercircus - Ground floor",
    order: 0,
    shortLabel: "0",
    svg: wintercircus0,
    viewBox: "0 0 2800 2520",
  },
  {
    id: "wintercircus-1",
    venueId: "wintercircus",
    name: "Wintercircus - Level +1",
    order: 1,
    shortLabel: "1",
    svg: wintercircus1,
    viewBox: "0 0 2800 2520",
  },
  {
    id: "wintercircus-4",
    venueId: "wintercircus",
    name: "Wintercircus - Level +4",
    order: 4,
    shortLabel: "4",
    svg: wintercircus4,
    viewBox: "0 0 2800 2520",
  },
  {
    // Both venues and the bridge between Wintercircus -2 and Vooruit 0.
    id: "overview-bridge",
    venueId: "overview",
    name: "Overview - Bridge between venues",
    order: 0,
    shortLabel: "0",
    svg: bridgeOverview,
    viewBox: "0 0 2800 2800",
  },
];

export const DEFAULT_FLOOR_ID = "vooruit-0";

export function getFloorById(id: string): Floor | undefined {
  return floors.find((f) => f.id === id);
}

export function getFloorsForVenue(venueId: string): Floor[] {
  return floors.filter((f) => f.venueId === venueId).sort((a, b) => a.order - b.order);
}

export function getVenueById(id: string): Venue | undefined {
  return venues.find((v) => v.id === id);
}

/** The floor a venue switch lands on: the one closest to ground level (order 0), preferring the upper one on a tie. */
export function getDefaultFloorForVenue(venueId: string): Floor | undefined {
  return getFloorsForVenue(venueId).reduce<Floor | undefined>(
    (best, f) =>
      !best || Math.abs(f.order) < Math.abs(best.order) ||
      (Math.abs(f.order) === Math.abs(best.order) && f.order > best.order)
        ? f
        : best,
    undefined
  );
}
