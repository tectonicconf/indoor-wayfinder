import { useControls } from "react-zoom-pan-pinch";
import { FaPlus, FaMinus, FaExpandAlt } from "react-icons/fa";

function Controls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="inline-flex rounded-md absolute right-1 bottom-1 md:right-0 md:bottom-0">
      <button
        className="control-btn rounded-l hidden md:block"
        aria-label="zoomIn"
        onClick={() => zoomIn()}
      >
        <FaPlus />
      </button>
      <button
        className="control-btn hidden md:block"
        aria-label="zoomOut"
        onClick={() => zoomOut()}
      >
        <FaMinus />
      </button>
      <button
        className="control-btn rounded md:rounded-r h-11 w-11 md:h-auto md:w-auto flex items-center justify-center shadow-md md:shadow-none"
        aria-label="resetTransform"
        onClick={() => resetTransform()}
      >
        <FaExpandAlt />
      </button>
    </div>
  );
}

export default Controls;
