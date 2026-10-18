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

  const onFloor = objects.filter(
    (obj) => obj.area && obj.floorId === navigation.activeFloor
  );
  const classFor = (name: string) =>
    `object ${navigation.selected === name ? "object-selected" : ""} ${className ?? ""}`;

  return (
    <g id="Objects">
      {onFloor.map((obj) => (
        <path
          key={obj.id}
          id={obj.name}
          d={obj.area}
          onClick={handleObjectClick}
          className={classFor(obj.name)}
        >
          <title>{obj.name}</title>
        </path>
      ))}
      {/* Label hit areas go last so they win over overlapping areas. */}
      {onFloor
        .filter((obj) => obj.labelArea)
        .map((obj) => (
          <path
            key={`${obj.id}-label`}
            id={obj.name}
            d={obj.labelArea}
            onClick={handleObjectClick}
            className={classFor(obj.name)}
          >
            <title>{obj.name}</title>
          </path>
        ))}
    </g>
  );
}

export default Objects;
