import { graph } from "@/algorithms/dijkstra";
import { graphData, VertexData } from "@/store/graphData";
import { RouteSegment, splitPathByFloor } from "@/utils/routeSegments";
import { vertexForPlace } from "@/utils/floorHelpers";

export { vertexForPlace };

/** Map units per real metre (estimate - tune once the floor plans are measured). */
export const UNITS_PER_METER = 30;
/** Average indoor walking speed in m/s. */
export const WALKING_SPEED = 1.3;

export interface RouteSegmentView extends RouteSegment {
  points: [number, number][];
  meters: number;
}

export interface Route {
  start: VertexData;
  end: VertexData;
  segments: RouteSegmentView[];
  floorIds: string[];
  meters: number;
  seconds: number;
}

const byId = new Map(graphData.vertices.map((v) => [v.id, v]));
const edgeWeight = (a: VertexData, b: VertexData) => {
  const e = graphData.edges.find(
    (x) => (x.from === a.id && x.to === b.id) || (x.from === b.id && x.to === a.id)
  );
  return e?.weight ?? Math.hypot(a.cx - b.cx, a.cy - b.cy);
};

const roundMeters = (m: number) => (m < 20 ? Math.max(5, Math.round(m / 5) * 5) : Math.round(m / 10) * 10);

export function computeRoute(from: string, to: string): Route | null {
  const start = vertexForPlace(from);
  const end = vertexForPlace(to);
  if (!start || !end || start.id === end.id) return null;

  const path = graph.calculateShortestPath(start.id, end.id);
  if (path.length < 2) return null;

  const segments: RouteSegmentView[] = splitPathByFloor(path).map((segment) => {
    const verts = segment.vertexIds.map((id) => byId.get(id)!);
    let units = 0;
    for (let i = 1; i < verts.length; i++) units += edgeWeight(verts[i - 1], verts[i]);
    return {
      ...segment,
      points: verts.map((v) => [v.cx, v.cy] as [number, number]),
      meters: units / UNITS_PER_METER,
    };
  });

  let totalUnits = 0;
  for (let i = 1; i < path.length; i++) totalUnits += edgeWeight(byId.get(path[i - 1])!, byId.get(path[i])!);
  const meters = totalUnits / UNITS_PER_METER;

  return {
    start,
    end,
    segments,
    floorIds: [...new Set(segments.map((s) => s.floorId))],
    meters,
    seconds: meters / WALKING_SPEED,
  };
}

export function formatDistance(meters: number) {
  return `${roundMeters(meters)} m`;
}

export function formatDuration(seconds: number) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes} min`;
}
