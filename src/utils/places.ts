import { Dispatch, SetStateAction } from "react";
import db from "@/assets/db.json";
import { getFloorById } from "@/store/floors";
import { Navigation, ObjectItem } from "@/utils/types";

type SetNavigation = Dispatch<SetStateAction<Navigation>>;

const findPlace = (name: string) => (db.objects as ObjectItem[]).find((o) => o.name === name);

/**
 * Resolves a place from a link parameter (e.g. "?to=Workshop room 1"): exact name,
 * then case-insensitive name, then location id. Returns undefined if nothing matches.
 */
export function findPlaceFromLink(value: string | null): ObjectItem | undefined {
  const wanted = value?.trim();
  if (!wanted) return undefined;
  const places = db.objects as ObjectItem[];
  const lower = wanted.toLowerCase();
  return (
    places.find((o) => o.name === wanted) ??
    places.find((o) => o.name.toLowerCase() === lower) ??
    places.find((o) => o.id.toLowerCase() === lower)
  );
}

/** LOCATE: jump to the place's floor and highlight it (the place card opens). Ends any directions. */
export function locatePlace(name: string, setNavigation: SetNavigation) {
  const place = findPlace(name);
  setNavigation((prev) => ({
    ...prev,
    selected: name,
    end: "",
    activeFloor: place?.floorId ?? prev.activeFloor,
  }));
}

/** NAVIGATE: open directions to the place. The route appears once a starting point is chosen. */
export function directionsTo(name: string, setNavigation: SetNavigation) {
  const place = findPlace(name);
  setNavigation((prev) => ({
    ...prev,
    selected: name,
    end: name,
    activeFloor: place?.floorId ?? prev.activeFloor,
  }));
}

export function floorLabel(floorId?: string) {
  return floorId ? (getFloorById(floorId)?.name ?? "") : "";
}
