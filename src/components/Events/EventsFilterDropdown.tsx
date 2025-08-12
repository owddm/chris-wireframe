import { useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { LuChevronDown } from "react-icons/lu";

import { useEventsFilter } from "./EventsFilterProvider";

interface EventsFilterDropdownProps {
  id: "topics" | "location";
  label: string;
  options: string[];
  "data-testid"?: string;
}

export default function EventsFilterDropdown({
  id,
  label,
  options,
  "data-testid": dataTestId,
}: EventsFilterDropdownProps) {
  const { currentFilters, updateFilter } = useEventsFilter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selected =
    id === "topics"
      ? currentFilters.topics
      : currentFilters.location
        ? [currentFilters.location]
        : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleOptionChange = (option: string) => {
    if (id === "topics") {
      updateFilter("topics", option);
    } else {
      // For location, toggle between selected and empty
      updateFilter("location", currentFilters.location === option ? "" : option);
      // Close dropdown for single select
      if (currentFilters.location !== option) {
        setIsOpen(false);
      }
    }
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getButtonLabel = () => {
    if (id === "location" && currentFilters.location) {
      return capitalizeFirst(currentFilters.location);
    }
    if (id === "topics" && currentFilters.topics.length > 0) {
      return `${label} (${currentFilters.topics.length})`;
    }
    return label;
  };

  return (
    <div className="relative" data-testid={dataTestId}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`btn join-item whitespace-nowrap ${selected.length > 0 ? "btn-accent" : ""}`}
      >
        {getButtonLabel()}
        <LuChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          // className="absolute top-full -right-10 z-50 mt-2 flex w-[25em] items-end justify-end md:right-auto md:-left-10 md:w-[30em] md:justify-start lg:w-[40em]"
          className="absolute top-full right-0 mt-2 flex w-[25em] items-end justify-end"
        >
          {/* <div className="soft-glass inline-flex flex-wrap gap-2 p-4!"> */}
          <div className="flex">
            {options.map((option, i) => (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionChange(option)}
                className={clsx(`btn`, {
                  "btn-accent": selected.includes(option),
                  "rounded-l-full": i === 0,
                  "rounded-r-full": i === options.length - 1,
                })}
                data-testid={`${id === "topics" ? "topic" : "location"}-option`}
              >
                {id === "location" ? capitalizeFirst(option) : option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
