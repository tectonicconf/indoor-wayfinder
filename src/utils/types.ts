import type { Route } from "@/utils/routing";

export interface ObjectItem {
  id: string;
  name: string;
  desc: string;
  categoryId: string;
  categoryName?: string;
  /** Floor (see src/store/floors.ts) the location is on. */
  floorId?: string;
  /** Clickable area as SVG path data in that floor map's coordinates. */
  area?: string;
  /**
   * Optional extra hit area for the location's label, drawn above all other
   * areas (e.g. the ATRIUM label, which overlaps the surrounding booths).
   */
  labelArea?: string;
}
export interface Category {
  id: string;
  name: string;
}

export interface Beacon {
  _id: string;
  beacon_id: string;
  rssi: number;
}

export interface Navigation {
  /** "From" place (location name, or a graph vertex id from a QR deep link). Empty until chosen. */
  start: string;
  /** "To" place. While set, the directions panel is open. */
  end?: string;
  /** The floor (see src/store/floors.ts) currently being displayed/edited. */
  activeFloor: string;
  /** Location (object name) currently located/highlighted on the map (shown in the place card). */
  selected?: string;
}

export interface NavigationContextType {
  navigation: Navigation;
  setNavigation: React.Dispatch<React.SetStateAction<Navigation>>;
  /** Walking route from navigation.start to navigation.end, or null. */
  route: Route | null;
}

export interface MapDataContextType {
  objects: ObjectItem[];
  categories: Category[];
}
