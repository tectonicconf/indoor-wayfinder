import { graphData, VertexData, EdgeData } from "@/store/graphData";
import { DEFAULT_FLOOR_ID } from "@/store/floors";

/** The graph vertex for a place: matches a location name, or a raw vertex id (QR deep links). */
export function vertexForPlace(place: string): VertexData | undefined {
  if (!place) return undefined;
  return (
    graphData.vertices.find((v) => v.objectName === place) ??
    graphData.vertices.find((v) => v.id === place)
  );
}

export function getVertexFloorId(vertexId: string): string | undefined {
  return graphData.vertices.find((v) => v.id === vertexId)?.floorId;
}

export function getVerticesForFloor(floorId: string): VertexData[] {
  return graphData.vertices.filter((v) => v.floorId === floorId);
}

/**
 * Edges whose both endpoints sit on the given floor. An edge that crosses floors
 * (stairs/elevator/bridge) is intentionally excluded here - see getTransitionEdges.
 */
export function getEdgesForFloor(floorId: string): EdgeData[] {
  return graphData.edges.filter((edge) => {
    const fromFloor = getVertexFloorId(edge.from);
    const toFloor = getVertexFloorId(edge.to);
    return fromFloor === floorId && toFloor === floorId;
  });
}

/** Edges that connect two different floors (and/or venues), e.g. stairs, elevators, a bridge. */
export function getTransitionEdges(): EdgeData[] {
  return graphData.edges.filter((edge) => {
    const fromFloor = getVertexFloorId(edge.from);
    const toFloor = getVertexFloorId(edge.to);
    return fromFloor !== undefined && toFloor !== undefined && fromFloor !== toFloor;
  });
}

export function resolveFloorIdForStart(start: string): string {
  return vertexForPlace(start)?.floorId ?? DEFAULT_FLOOR_ID;
}
