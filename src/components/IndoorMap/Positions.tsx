import { getVerticesForFloor } from "@/utils/floorHelpers";
import { NavigationContextType } from "@/utils/types";
import { DEFAULT_FLOOR_ID } from "@/store/floors";

interface PositionsProps {
  positionRadius: number;
  handlePositionClick: (e: React.MouseEvent<SVGPathElement>) => void;
  className: string;
  navigation?: NavigationContextType["navigation"];
}
function Positions({
  positionRadius,
  handlePositionClick,
  className,
  navigation,
}: PositionsProps) {
  const positionBackgroundColor = "#2d74ee";
  const positionBackgroundRadius = positionRadius + 7;
  const positonBackgroundOpacity = 0.2;
  const vertices = getVerticesForFloor(
    navigation?.activeFloor ?? DEFAULT_FLOOR_ID
  );
  const startVertex = vertices.find((v) => v.id === navigation?.start);

  function isActivePosition(vertexId: string) {
    return navigation?.start === vertexId;
  }
  return (
    <g id="Vertexes">
      {/* Background circle for Google Maps like look */}
      {startVertex && (
        <circle
          id="background-circle"
          cx={startVertex.cx}
          cy={startVertex.cy}
          fill={positionBackgroundColor}
          opacity={positonBackgroundOpacity}
          r={positionBackgroundRadius}
        />
      )}
      {vertices.map((vertex) => (
        <circle
          // only allow click on positions that are not referring to an object
          onClick={vertex.objectName ? () => {} : handlePositionClick}
          key={vertex.id}
          id={vertex.id}
          // show only positions that are not referring to an object (e.g. shops, restrooms, etc.)
          className={`position ${vertex.objectName ? "opacity-0" : className} ${isActivePosition(vertex.id) && "position-active opacity-100"}`}
          cx={vertex.cx}
          cy={vertex.cy}
          r={positionRadius}
        />
      ))}
      {/* Circle animation */}
      {startVertex && (
        <circle
          id="circle-animation"
          cx={startVertex.cx}
          cy={startVertex.cy}
          fill="none"
          stroke="white"
          strokeWidth={2}
          r={positionRadius}
        >
          <animate
            attributeName="stroke-width"
            values="1;3;1"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </g>
  );
}

export default Positions;
