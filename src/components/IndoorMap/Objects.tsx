import { useContext } from "react";
import { MapDataContext, NavigationContext } from "@/pages/Map";
import { MapDataContextType, NavigationContextType } from "@/utils/types";

interface ObjectsProps {
  handleObjectClick: (e: React.MouseEvent<SVGPathElement>) => void;
  className?: string;
}

/** Clickable location areas on the active floor (traced in Figma, see db.json). */
function Objects({ handleObjectClick, className }: ObjectsProps) {
  const { objects } = useContext(MapDataContext) as MapDataContextType;
  const { navigation } = useContext(NavigationContext) as NavigationContextType;

  return (
    <g id="Objects">
      {objects
        .filter((obj) => obj.area && obj.floorId === navigation.activeFloor)
        .map((obj) => (
          <path
            key={obj.id}
            id={obj.name}
            d={obj.area}
            onClick={handleObjectClick}
            className={`object ${
              navigation.selected === obj.name ? "object-selected" : ""
            } ${className ?? ""}`}
          >
            <title>{obj.name}</title>
          </path>
        ))}
    </g>
  );
}

export default Objects;
