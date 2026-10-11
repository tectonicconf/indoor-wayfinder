import vooruitFloor0 from "@/assets/floorplans/vooruit-floor-0.svg";
import vooruitFloor1 from "@/assets/floorplans/vooruit-floor-1.svg";

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

export const venues: Venue[] = [{ id: "vooruit", name: "Vooruit" }];

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

/** The floor a venue switch lands on: its ground floor (order 0), or else its lowest floor. */
export function getDefaultFloorForVenue(venueId: string): Floor | undefined {
  const venueFloors = getFloorsForVenue(venueId);
  return venueFloors.find((f) => f.order === 0) ?? venueFloors[0];
}
