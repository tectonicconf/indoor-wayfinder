import Tooltip from "@/components/ui/Tooltip";
import {
  navigateToObject,
  navigateWithDelay as navigationTestAll,
} from "@/utils/navigationHelper";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FiCircle, FiNavigation } from "react-icons/fi";
import { useOnClickOutside } from "usehooks-ts";
import { MapDataContext, NavigationContext } from "../pages/Map";
import {
  MapDataContextType,
  NavigationContextType,
  ObjectItem,
} from "../utils/types";

function SearchBar() {
  const [inputValue, setInputValue] = useState<string>("");
  const { objects } = useContext(MapDataContext) as MapDataContextType;
  const [suggestions, setSuggestions] = useState<ObjectItem[]>(objects);
  const [isAutocomplete, setIsAutocomplete] = useState<boolean>(false);
  const [isInputInvalid, setIsInputInvalid] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { navigation, setNavigation } = useContext(
    NavigationContext
  ) as NavigationContextType;
  const { setIsEditMode } = useContext(
    NavigationContext
  ) as NavigationContextType;

  useEffect(() => {
    setSuggestions(objects);
  }, [objects]);

  useOnClickOutside(suggestionsRef, () => {
    setIsAutocomplete(false);
    setIsEditMode(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  });

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);
    if (value) {
      setIsAutocomplete(true);
      const filteredSuggestions = objects.filter((obj) =>
        obj.name.toLowerCase().includes(value.trim().toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setIsAutocomplete(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (isAutocomplete) {
      if (event.key === "ArrowDown") {
        if (selectedIndex < suggestions.length - 1) {
          setSelectedIndex((prevIndex) => prevIndex + 1);
          setInputValue(suggestions[selectedIndex + 1].name);
        }
        event.preventDefault();
      } else if (event.key === "ArrowUp") {
        if (selectedIndex > 0) {
          setSelectedIndex((prevIndex) => prevIndex - 1);
          setInputValue(suggestions[selectedIndex - 1].name);
        }
        event.preventDefault();
      } else if (event.key === "Enter" && selectedIndex >= 0) {
        handleSuggestionClick(suggestions[selectedIndex]);
        event.preventDefault();
        console.log(suggestions[selectedIndex].categoryName);

        navigateToObject(
          suggestions[selectedIndex].name,
          navigation,
          setNavigation
        );
      }
    }
  }

  useEffect(() => {
    if (suggestionsRef.current && selectedIndex >= 0) {
      const suggestionElements = suggestionsRef.current.children;
      if (suggestionElements[selectedIndex]) {
        suggestionElements[selectedIndex].scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [selectedIndex]);

  function handleSuggestionClick(selectedObject: ObjectItem) {
    console.log(selectedObject);
    setInputValue(selectedObject.name);
    setIsAutocomplete(false);
  }
  function handleInputFocus(event: React.FocusEvent<HTMLInputElement>) {
    setIsEditMode(false);

    if (inputValue.length > 1) {
      setIsAutocomplete(true);
    }
    event.currentTarget.select();
  }

  function handleInputBlur() {
    setIsAutocomplete(false);
    setSelectedIndex(-1);
  }

  function handleSearch(inputValue: string) {
    const matchingObject = objects.find(
      (obj) => obj.name.toLowerCase() === inputValue.trim().toLowerCase()
    );
    if (!matchingObject) {
      //? To test the navigation feature
      if (inputValue === "Test") {
        const delay = 500;
        navigationTestAll(objects, 0, delay, navigation, setNavigation);
        return;
      } else {
        setIsInputInvalid(true);
        return;
      }
    }
    navigateToObject(matchingObject.name, navigation, setNavigation);
    setSelectedIndex(-1);
  }

  return (
    <div className="md:w-96 w-full flex flex-row">
      <div className="flex flex-inline items-center rounded-full w-full bg-white/10 backdrop-blur-md border border-white/15 p-1">
        <div className="h-10 w-10 center flex-none text-tectonic-cyan text-[8px]">
          <div className="w-full h-6 center border-white/20 border-r">
            <FiCircle />
          </div>
        </div>
        <div className="flex w-full relative">
          <input
            className={`h-10 px-3 w-full flex-none bg-transparent text-white placeholder:text-white/50 text-base focus:outline-none ${
              isInputInvalid && "input-error"
            } `}
            placeholder="Search"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            ref={inputRef}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            onAnimationEnd={() => setIsInputInvalid(false)}
          />

          {isAutocomplete && (
            <ul
              ref={suggestionsRef}
              className="absolute w-full z-10 mt-[3.25rem] bg-[#000523]/95 backdrop-blur-md border border-white/15 rounded-[14px] shadow-xl max-h-60 h-min overflow-auto"
              key={"suggestions"}
            >
              {suggestions.length > 0 ? (
                suggestions.map((obj, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer px-4 py-3 border-t border-white/10 first:border-t-0 text-white/80 hover:bg-white/10 active:bg-white/20 text-sm md:text-md ${
                      selectedIndex === index
                        ? "border-l-4 border-l-tectonic-cyan bg-white/10"
                        : ""
                    }`}
                    onMouseDown={() => handleSuggestionClick(obj)}
                  >
                    {obj.name}
                  </li>
                ))
              ) : (
                <li
                  className="px-4 py-3 text-white/60 text-sm md:text-md"
                  key={"no-result"}
                >
                  No results found
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="">
          <Tooltip content="Search" className="bg-tectonic-navy border border-white/15">
            <button
              className="h-10 w-10 flex flex-none center justify-center rounded-full bg-tectonic-blue text-white active:bg-tectonic-blue/80"
              onClick={() => handleSearch(inputValue)}
              aria-label="search"
            >
              <FiNavigation />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
