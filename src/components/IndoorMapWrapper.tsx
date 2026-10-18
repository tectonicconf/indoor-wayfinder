import React, { useContext } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { MapDataContext, NavigationContext } from "../pages/Map";
import { MapDataContextType, NavigationContextType } from "../utils/types";
import { MapBackground, RouteLayer, Objects, FloorLinks } from "./IndoorMap";

import Controls from "./MapControls";
import FloorSwitcher from "./FloorSwitcher";
import { locatePlace } from "@/utils/places";
import { toast } from "react-toastify";

function IndoorMapWrapper() {
  const { setNavigation } = useContext(NavigationContext) as NavigationContextType;
  const { objects } = useContext(MapDataContext) as MapDataContextType;

  // Tapping a place on the map LOCATES it (place card with a Directions button).
  function handleObjectClick(e: React.MouseEvent<SVGPathElement>) {
    const targetId = (e.target as HTMLElement).id;
    const selectedObject = objects.find((obj) => obj.name === targetId);
    if (selectedObject?.id) {
      locatePlace(selectedObject.name, setNavigation);
    } else {
      toast.error("Object not found");
    }
  }

  return (
    <div className="relative w-full h-full bg-tectonic-navy center">
      <TransformWrapper
        centerOnInit
        minScale={1}
        maxScale={12}
        doubleClick={{ mode: "zoomIn", step: 1 }}
        initialScale={1}
        smooth={true}
        wheel={{ smoothStep: 0.01 }}
      >
        <TransformComponent
          wrapperClass="bg-tectonic-navy"
          wrapperStyle={{ width: "100%", height: "100%" }}
          contentStyle={{ width: "100%", height: "100%" }}
        >
          <MapBackground>
            {/*Objects are the clickable areas on the map e.g. Rooms, Desks, ...*/}
            <Objects handleObjectClick={handleObjectClick} className="cursor-pointer" />
            {/*Direction labels, stairs, ramps and bridges that switch floors*/}
            <FloorLinks className="cursor-pointer" />
            {/*The walking route for the active floor*/}
            <RouteLayer />
          </MapBackground>
        </TransformComponent>
        <Controls />
      </TransformWrapper>
      <FloorSwitcher />
    </div>
  );
}
export default IndoorMapWrapper;
