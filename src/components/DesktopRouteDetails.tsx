import { useRouteDetails } from "@/hooks/useRouteDetails";
import { FaX } from "react-icons/fa6";
import { TbRoute } from "react-icons/tb";

function DesktopRouteDetails() {
  const { object, rightRouteLength, walkingTime, handleLeave } =
    useRouteDetails();

  return (
    <div className="md:w-fit md:visible invisible hidden md:flex flex-row pl-6">
      <div className="flex flex-inline rounded-full w-full bg-white/10 backdrop-blur-md border border-white/15 navigation-info-pulse">
        <div className="w-12 h-12 center flex-none text-tectonic-cyan text-xl">
          <TbRoute />
        </div>
        <div className="flex flex-col max-w-32 h-full justify-center break-word">
          <p className="text-white text-sm font-semibold">{object?.name}</p>
        </div>
        <div className="flex flex-col h-full justify-center px-4">
          <p className="text-white/60 text-xs">
            {rightRouteLength} m, {walkingTime} sek
          </p>
        </div>
        <div className="h-12 w-12 center flex-none text-xs">
          <button
            className="w-full h-8 center border-white/20 border-l"
            onClick={handleLeave}
          >
            <FaX className="text-white/60" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DesktopRouteDetails;
