import { Dispatch, SetStateAction } from "react";
import { graph } from "../algorithms/dijkstra";
import { Navigation, NavigationContextType } from "./types";
import { ObjectItem } from "./types";
import { graphData } from "@/store/graphData";
import { splitPathByFloor, RouteSegment } from "@/utils/routeSegments";
import { toast } from "react-toastify";
import db from "@/assets/db.json";
export let routeLength = 0;
/** The active route split per floor, updated on every navigateToObject call. */
export let routeSegments: RouteSegment[] = [];

const findVertexByObjectId = (vertexId: string) =>
  graphData.vertices.find((v) => v.objectName === vertexId);

export function navigateToObject(
  selectedObjectId: string,
  navigation: NavigationContextType["navigation"],
  setNavigation: NavigationContextType["setNavigation"]
) {
  const target = findVertexByObjectId(selectedObjectId);
  if (!target) {
    // No route network to this location yet: show it on its floor instead.
    const location = (db.objects as ObjectItem[]).find((o) => o.name === selectedObjectId);
    if (!location?.floorId) {
      toast.error("Location not found");
      return;
    }
    setNavigation((prev) => ({
      ...prev,
      activeFloor: location.floorId!,
      selected: location.name,
    }));
    toast.info("Walking directions are coming soon - here it is on the map.");
    return;
  }

  const shortestPath = graph.calculateShortestPath(navigation.start, target.id);
  routeSegments = splitPathByFloor(shortestPath);

  // Only the portion of the route that lives on the floor currently being
  // displayed can be drawn - other segments live in unrelated SVG coordinate
  // spaces (different floors/venues). Multi-floor UI (auto-switching floors,
  // "continue on <floor>" prompts) consumes `routeSegments` above; this just
  // draws today's single-floor slice of it.
  const activeSegment =
    routeSegments.find((segment) => segment.floorId === navigation.activeFloor) ??
    routeSegments[0];

  const segmentVertexIds = activeSegment?.vertexIds ?? [];
  const pathString = segmentVertexIds
    .slice(1)
    .map((vertexId) => {
      const vertex = graphData.vertices.find((v) => v.id === vertexId);
      return vertex ? `L${vertex.cx} ${vertex.cy}` : "";
    })
    .join(" ");

  const firstVertex = graphData.vertices.find(
    (v) => v.id === segmentVertexIds[0]
  );
  const navigationRoutePath = document.getElementById("navigation-route");
  if (navigationRoutePath && firstVertex) {
    navigationRoutePath.setAttribute(
      "d",
      `M${firstVertex.cx} ${firstVertex.cy} ${pathString}`
    );
    navigationRoutePath.classList.remove("path-once", "path-active");
    navigationRoutePath.classList.add("path-once");
    navigationRoutePath.addEventListener(
      "animationend",
      () => {
        navigationRoutePath.classList.remove("path-once");
        navigationRoutePath.classList.add("path-active");
      },
      { once: true }
    );
  }

  setNavigation((prevNavigation) => ({
    ...prevNavigation,
    end: selectedObjectId,
    selected: selectedObjectId,
  }));
}

export function resetEdges() {
  document.getElementById("navigation-route")?.setAttribute("d", "");
  graphData.edges.forEach((edge) => {
    const element = document.getElementById(edge.id);
    if (element) {
      element.classList.remove("path-active");
    }
  });
}

export function navigateWithDelay(
  objects: ObjectItem[],
  index: number,
  delay: number,
  navigation: Navigation,
  setNavigation: Dispatch<SetStateAction<Navigation>>
) {
  if (index < objects.length) {
    const obj = objects[index];
    navigateToObject(obj.name, navigation, setNavigation);

    setTimeout(() => {
      navigateWithDelay(objects, index + 1, delay, navigation, setNavigation);
    }, delay);
  }
}
