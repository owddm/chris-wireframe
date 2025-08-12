import EventsFilterDropdown from "./EventsFilterDropdown";
import { useEventsFilter } from "./EventsFilterProvider";
import type { EventsOrganizerViews } from "./EventsOrganizer";
import EventsSearchInput from "./EventsSearchInput";
import EventsSortSelector from "./EventsSortSelector";
import { EventsViewModeSelector } from "./EventsViewModeSelector";

interface EventsFilterProps {
  currentView: EventsOrganizerViews;
  availableFilters: {
    topics: string[];
    locations: string[];
  };
}

export function EventsFilter({ availableFilters, currentView }: EventsFilterProps) {
  const { currentFilters, clearAllFilters } = useEventsFilter();

  const hasActiveFilters =
    currentFilters.search || currentFilters.topics.length > 0 || currentFilters.location;

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-8 md:flex-row">
      <div className="join flex w-full max-w-[25em]">
        <EventsSearchInput />

        {availableFilters.locations.length > 0 && (
          <EventsFilterDropdown
            id="location"
            label="Location"
            options={availableFilters.locations}
            data-testid="location-filter-dropdown"
          />
        )}
        {/* TODO: Add topics back in */}
        {false && availableFilters.topics.length > 0 && (
          <EventsFilterDropdown
            id="topics"
            label="Topics"
            options={availableFilters.topics}
            data-testid="topics-filter-dropdown"
          />
        )}

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-secondary join-item"
            onClick={clearAllFilters}
            data-testid="clear-all-filters"
          >
            Clear
          </button>
        )}
      </div>

      <div className="join flex items-center">
        <EventsSortSelector data-testid="sort-selector" />
        <EventsViewModeSelector currentView={currentView} />
      </div>
    </div>
  );
}
