import { useContext } from "react";
import { graphData } from "@/store/graphData";
import { getEdgesForFloor } from "@/utils/floorHelpers";
import { NavigationContext } from "@/pages/Map";
import { NavigationContextType } from "@/utils/types";
import { DEFAULT_FLOOR_ID } from "@/store/floors";

function Paths() {
  const { navigation } = useContext(NavigationContext) as NavigationContextType;
  const edges = getEdgesForFloor(navigation?.activeFloor ?? DEFAULT_FLOOR_ID);

  return (
    <g id="Edges">
      {edges.map((edge) => {
        const { id, from, to } = edge;
        const fromVertex = graphData.vertices.find(
          (vertex) => vertex.id === from
        );
        const toVertex = graphData.vertices.find((vertex) => vertex.id === to);
        if (fromVertex && toVertex) {
          const pathClassName = "path";
          const pathD = `M${fromVertex.cx} ${fromVertex.cy}L${toVertex.cx} ${toVertex.cy}`;
          return <path key={id} id={id} className={pathClassName} d={pathD} />;
        }
        return null;
      })}
      <path id="navigation-route" className="path" d="" fill="none" />
    </g>
  );
}

export default Paths;
