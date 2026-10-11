export type EdgeKind = "walk" | "stairs" | "elevator" | "bridge";

export interface VertexData {
  id: string;
  objectName: string | null;
  cx: number;
  cy: number;
  /** Which floor (see src/store/floors.ts) this vertex physically sits on. */
  floorId: string;
}

export interface EdgeData {
  id: string;
  from: string;
  to: string;
  /** Defaults to "walk". Non-walk edges connect vertices on different floors/venues. */
  kind?: EdgeKind;
  /**
   * Fixed traversal cost. Required for edges whose endpoints are not in the same
   * coordinate space (different floors/venues), since the normal Euclidean-distance
   * weighting only makes sense within a single floor's SVG coordinates.
   */
  weight?: number;
}
export interface GraphData {
  vertices: VertexData[];
  edges: EdgeData[];
}
export const graphData: GraphData = {
  // No demo/placeholder locations - real venue data (Vooruit, Wintercircus) goes here.
  vertices: [],
  edges: [],
};
