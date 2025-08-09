import { type ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { useEventsFilter } from "./EventsFilterProvider";

export default function EventsSearchInput() {
  const { currentFilters, updateFilter, clearFilter } = useEventsFilter();
  const [localValue, setLocalValue] = useState(currentFilters.search);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalValue(currentFilters.search);
  }, [currentFilters.search]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalValue(value);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        updateFilter("search", value);
      }, 300);
    },
    [updateFilter],
  );

  const handleClear = useCallback(() => {
    setLocalValue("");
    clearFilter("search");
  }, [clearFilter]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <label className="input input-bordered join-item flex w-full items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 opacity-70"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <input
        type="text"
        className="grow"
        placeholder="Search events..."
        value={localValue}
        onChange={handleInputChange}
        data-testid="events-search-input"
      />
      {localValue && (
        <button
          type="button"
          className="btn btn-ghost btn-xs"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </label>
  );
}
