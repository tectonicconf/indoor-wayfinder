import { locatePlace, floorLabel } from "@/utils/places";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useOnClickOutside } from "usehooks-ts";
import { MapDataContext, NavigationContext } from "../pages/Map";
import { MapDataContextType, NavigationContextType, ObjectItem } from "../utils/types";

/** Search = LOCATE: picking a result jumps to its floor and highlights it. Directions start from the place card. */
function SearchBar() {
  const [inputValue, setInputValue] = useState<string>("");
  const { objects } = useContext(MapDataContext) as MapDataContextType;
  const { setNavigation } = useContext(NavigationContext) as NavigationContextType;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isInputInvalid, setIsInputInvalid] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const query = inputValue.trim().toLowerCase();
  const suggestions = objects.filter((obj) => !query || obj.name.toLowerCase().includes(query));

  useOnClickOutside(suggestionsRef, () => {
    setIsOpen(false);
    inputRef.current?.blur();
  });

  useEffect(() => {
    const el = suggestionsRef.current?.children[selectedIndex];
    if (el) (el as HTMLElement).scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  function choose(obj: ObjectItem) {
    setInputValue(obj.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
    locatePlace(obj.name, setNavigation);
  }

  function handleSearch() {
    const exact = objects.find((o) => o.name.toLowerCase() === query);
    const pick = exact ?? suggestions[selectedIndex >= 0 ? selectedIndex : 0];
    if (!pick || !query) {
      setIsInputInvalid(true);
      return;
    }
    choose(pick);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      setIsOpen(true);
      setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
      event.preventDefault();
    } else if (event.key === "ArrowUp") {
      setSelectedIndex((i) => Math.max(i - 1, 0));
      event.preventDefault();
    } else if (event.key === "Enter") {
      handleSearch();
      event.preventDefault();
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className="md:w-96 w-full flex flex-row relative">
      <div className="flex flex-inline items-center rounded-full w-full bg-white/10 backdrop-blur-md border border-white/15 p-1">
        <div className="h-10 w-10 center flex-none text-tectonic-cyan text-lg">
          <FiSearch />
        </div>
        <div className="flex w-full">
          <input
            className={`h-10 pr-3 w-full flex-none bg-transparent text-white placeholder:text-white/50 text-base focus:outline-none ${
              isInputInvalid && "input-error"
            } `}
            placeholder="Search a place"
            aria-label="Search a place"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={(e) => {
              setIsOpen(true);
              e.currentTarget.select();
            }}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            onAnimationEnd={() => setIsInputInvalid(false)}
          />

          {isOpen && (
            <ul
              ref={suggestionsRef}
              className="absolute left-0 right-0 top-full z-50 mt-1.5 bg-[#000523] border border-white/15 rounded-[14px] shadow-xl max-h-[50dvh] h-min overflow-auto"
              key={"suggestions"}
            >
              {suggestions.length > 0 ? (
                suggestions.map((obj, index) => (
                  <li
                    key={obj.id}
                    className={`cursor-pointer px-4 py-3 min-h-[44px] border-t border-white/10 first:border-t-0 text-white/80 hover:bg-white/10 active:bg-white/20 text-sm ${
                      selectedIndex === index ? "border-l-4 border-l-tectonic-cyan bg-white/10" : ""
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      choose(obj);
                    }}
                  >
                    <span className="block text-white">{obj.name}</span>
                    <span className="block text-xs text-white/50">{floorLabel(obj.floorId)}</span>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-white/60 text-sm" key={"no-result"}>
                  No results found
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
