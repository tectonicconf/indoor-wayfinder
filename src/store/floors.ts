import vooruitFloor0 from "@/assets/floorplans/vooruit-floor-0.svg";
import vooruitFloor1 from "@/assets/floorplans/vooruit-floor-1.svg";
import wintercircusNeg2 from "@/assets/floorplans/wintercircus-neg2f.svg";
import wintercircusNeg1 from "@/assets/floorplans/wintercircus-neg1f.svg";
import wintercircus1 from "@/assets/floorplans/wintercircus-1f.svg";
import wintercircus2 from "@/assets/floorplans/wintercircus-2f.svg";
import wintercircus3 from "@/assets/floorplans/wintercircus-3f.svg";
import wintercircus4 from "@/assets/floorplans/wintercircus-4f.svg";

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
  svg: string;
  viewBox: string;
}

export const venues: Venue[] = [
  { id: "wintercircus", name: "Wintercircus" },
  { id: "vooruit", name: "Vooruit" },
];

export const floors: Floor[] = [
  {
    id: "vooruit-0",
    venueId: "vooruit",
    name: "Vooruit - Floor 0",
    order: 0,
    shortLabel: "0",
    svg: vooruitFloor0,
    viewBox: "0 0 507 760",
  },
  {
    id: "vooruit-1",
    venueId: "vooruit",
    name: "Vooruit - Floor 1",
    order: 1,
    shortLabel: "1",
    svg: vooruitFloor1,
    viewBox: "0 0 509 777",
  },
  {
    id: "wintercircus-neg2",
    venueId: "wintercircus",
    name: "Wintercircus - Floor -2",
    order: -2,
    shortLabel: "-2",
    svg: wintercircusNeg2,
    viewBox: "860 10 1906 2365",
  },
  {
    id: "wintercircus-neg1",
    venueId: "wintercircus",
    name: "Wintercircus - Floor -1",
    order: -1,
    shortLabel: "-1",
    svg: wintercircusNeg1,
    viewBox: "550 80 1940 1960",
  },
  {
    id: "wintercircus-1",
    venueId: "wintercircus",
    name: "Wintercircus - Floor 1",
    order: 1,
    shortLabel: "1",
    svg: wintercircus1,
    viewBox: "639 197 1862 2099",
  },
  {
    id: "wintercircus-2",
    venueId: "wintercircus",
    name: "Wintercircus - Floor 2",
    order: 2,
    shortLabel: "2",
    svg: wintercircus2,
    viewBox: "525 328 1771 1986",
  },
  {
    id: "wintercircus-3",
    venueId: "wintercircus",
    name: "Wintercircus - Floor 3",
    order: 3,
    shortLabel: "3",
    svg: wintercircus3,
    viewBox: "421 592 1680 1736",
  },
  {
    id: "wintercircus-4",
    venueId: "wintercircus",
    name: "Wintercircus - Floor 4",
    order: 4,
    shortLabel: "4",
    svg: wintercircus4,
    viewBox: "350 701 1679 1505",
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
