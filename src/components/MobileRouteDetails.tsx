import { useRouteDetails } from "@/hooks/useRouteDetails";
import { FaX } from "react-icons/fa6";
import { TbRoute } from "react-icons/tb";

function MobileRouteDetails() {
  const { object, rightRouteLength, walkingTime, handleLeave } =
    useRouteDetails();
  return (
    <div className="relative flex-none navigation-info-pulse mt-1.5 w-full bg-white border-t border-tectonic-cyan/40 shadow-lg rounded-lg overflow-hidden">
      <button className="absolute right-0 top-0 h-11 w-11 center" aria-label="close route" onClick={handleLeave}>
        <FaX className="text-gray-400" />
      </button>

      <div className="p-4 pb-0">
        <h1 className="text-gray-900 text-xl font-semibold mb-1">
          {object?.name}
        </h1>
        <p className="text-gray-500 text-sm">{object?.categoryName}</p>
      </div>
      <div className="bg-gray-200 text-gray-900 px-3 py-1 center w-fit rounded-md text-sm font-semibold m-3">
        <TbRoute className="inline-block mr-1" />
        {walkingTime} seconds away - {rightRouteLength} meters
      </div>
    </div>
  );
}

export default MobileRouteDetails;
