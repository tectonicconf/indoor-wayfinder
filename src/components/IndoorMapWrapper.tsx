import React, { useContext, useEffect, useRef } from "react";
import { TransformComponent, TransformWrapper, useControls } from "react-zoom-pan-pinch";
import { MapDataContext, NavigationContext } from "../pages/Map";
import { MapDataContextType, NavigationContextType } from "../utils/types";
import { MapBackground, RouteLayer, Objects, FloorLinks } from "./IndoorMap";

import Controls from "./MapControls";
import FloorSwitcher from "./FloorSwitcher";
import { locatePlace } from "@/utils/places";
import { toast } from "react-toastify";

/** How far (px) the map can be dragged past its edges: 40% of the smaller screen side. */
const PAN_MARGIN = Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.4);

/** Resets zoom and pan whenever the map switches to another floor or venue. */
function ResetZoomOnFloorChange() {
  const { resetTransform } = useControls();
  const { navigation } = useContext(NavigationContext) as NavigationContextType;
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    resetTransform(200);
  }, [navigation.activeFloor]);
  return null;
}

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
        // Let the map be dragged a bit past its edges and stay there (no snap-back),
        // but never so far that it leaves the screen: the overscroll is capped at
        // PAN_MARGIN px. Momentum is off because it would pull the map back to the edge.
        alignmentAnimation={{ disabled: true, sizeX: PAN_MARGIN, sizeY: PAN_MARGIN }}
        panning={{ velocityDisabled: true }}
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
        <ResetZoomOnFloorChange />
      </TransformWrapper>
      <FloorSwitcher />
    </div>
  );
}
export default IndoorMapWrapper;
