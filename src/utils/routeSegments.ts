import { graphData, EdgeData, EdgeKind } from "@/store/graphData";
import { getVertexFloorId } from "@/utils/floorHelpers";

export interface RouteSegment {
  floorId: string;
  /** Ordered vertex ids of this segment, in the same coordinate space (one floor). */
  vertexIds: string[];
  /** How the visitor arrives onto this floor. Absent for the very first segment. */
  enteredVia?: {
    kind: EdgeKind;
    fromFloorId: string;
  };
}

function findEdgeBetween(aId: string, bId: string): EdgeData | undefined {
  return graphData.edges.find(
    (e) => (e.from === aId && e.to === bId) || (e.from === bId && e.to === aId)
  );
}

/**
 * Splits a Dijkstra vertex-id path into contiguous per-floor segments, so the UI
 * can render/highlight one floor's portion of the route at a time and prompt
 * "continue on <floor>" whenever the route crosses a stairs/elevator/bridge edge.
 */
export function splitPathByFloor(path: string[]): RouteSegment[] {
  if (path.length === 0) return [];

  const segments: RouteSegment[] = [];
  let currentFloor = getVertexFloorId(path[0]);
  let current: RouteSegment = {
    floorId: currentFloor ?? "",
    vertexIds: [path[0]],
  };

  for (let i = 1; i < path.length; i++) {
    const prevId = path[i - 1];
    const vertexId = path[i];
    const floorId = getVertexFloorId(vertexId) ?? currentFloor ?? "";

    if (floorId === currentFloor) {
      current.vertexIds.push(vertexId);
      continue;
    }

    const transitionEdge = findEdgeBetween(prevId, vertexId);
    segments.push(current);
    current = {
      floorId,
      vertexIds: [vertexId],
      enteredVia: {
        kind: transitionEdge?.kind ?? "walk",
        fromFloorId: currentFloor ?? "",
      },
    };
    currentFloor = floorId;
  }

  segments.push(current);
  return segments;
}

/** True when a computed route touches more than one floor. */
export function isMultiFloorRoute(segments: RouteSegment[]): boolean {
  return segments.length > 1;
}
