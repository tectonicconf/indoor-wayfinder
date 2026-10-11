import { ReactNode, useContext } from "react";
import { NavigationContext } from "@/pages/Map";
import { NavigationContextType } from "@/utils/types";
import { getFloorById, DEFAULT_FLOOR_ID } from "@/store/floors";

interface MapBackgroundProps {
  children: ReactNode;
}

function MapBackground({ children }: MapBackgroundProps) {
  const { navigation } = useContext(NavigationContext) as NavigationContextType;
  const floor =
    getFloorById(navigation.activeFloor) ?? getFloorById(DEFAULT_FLOOR_ID);

  return (
    <svg viewBox={floor?.viewBox} className="h-full w-full">
      {floor && (
        <image
          id="background"
          x={floor.viewBox.split(" ")[0]}
          y={floor.viewBox.split(" ")[1]}
          width={floor.viewBox.split(" ")[2]}
          height={floor.viewBox.split(" ")[3]}
          href={floor.svg}
        />
      )}
      {children}
    </svg>
  );
}

export default MapBackground;

// Can be used to get mouse position in SVG coordinates
// just put it inside the MapBackground component and click somewhere on the map to get the coordinates
// can be very useful for adding new objects or positions

/*
  const getMousePositionSVG = (event: MouseEvent) => {
    const point = svgRef.current?.createSVGPoint();
    if (point) {
      point.x = event.clientX;
      point.y = event.clientY;
      const transformedPoint = point.matrixTransform(
        svgRef.current?.getScreenCTM()?.inverse()
      );
      console.log(transformedPoint.x, transformedPoint.y);
    }
  };
  useEffect(() => {
    svgRef.current?.addEventListener("click", getMousePositionSVG);
    console.log(svgRef.current?.getBoundingClientRect());
  }, []);
  */
