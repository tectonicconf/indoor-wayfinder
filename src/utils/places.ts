import { Dispatch, SetStateAction } from "react";
import db from "@/assets/db.json";
import { getFloorById } from "@/store/floors";
import { Navigation, ObjectItem } from "@/utils/types";

type SetNavigation = Dispatch<SetStateAction<Navigation>>;

const findPlace = (name: string) => (db.objects as ObjectItem[]).find((o) => o.name === name);

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
