import { createRoot, type Root } from "react-dom/client";
import CalendarDisplayButtonsGroup from "./navigation/calendar-display-buttons-group";
import CalendarNavButtonsGroup from "./navigation/calendar-nav-buttons-group";
import CalendarWrapper from "./calendarContainer/calendarWrapper";
import { CalendarHeaderDisplay } from "./calendar-header-display";
import { CalendarAllDayDisplay } from "./calendar-all-day-display";

/**
 * Initializes the calendar UI and renders the components. This function should only call the render functions for the calendar UI components.
 * @returns void
 */
function initializeCalendarUI(): void {
  renderCalendarViewButtons(); // Render the 'Day', 'Week', 'Month' buttons.
  renderCalendarNavigationButtons(); // Render the previous and next buttons.
  mountCalendarWrapper(); // Mount React into #calendarAllDayDisplayRoot
  mountAllDayDisplay(); //Mount React into #calendarViewArea
}

/**
 * Mounts CalendarWrapper into #calendarViewArea exactly once.
 *
 * After this runs, ALL calendar re-renders are driven by appState changes.
 * appState.notifyListeners() is called automatically inside every setter
 * (dateView, calendarView) and every mutation (addEvent, removeEvent).
 * CalendarWrapper subscribes via useAppState() and re-renders itself.
 *
 * DO NOT call this function again after the initial mount.
 * DO NOT call it from navigation buttons or event submission.
 * Those trigger appState changes which React picks up automatically.
 */
function mountCalendarWrapper(): void {
  const calendarViewAreaElement = document.getElementById("calendarViewArea");

  const root = createRoot(calendarViewAreaElement!);
  root.render(<CalendarWrapper />);
}

// Render the calendary view button group that includes the 'Day', 'Week', 'Month' buttons
function renderCalendarViewButtons(): void {
  // Get the root element for the calendar view buttons.
  const displayButtonsRootElement = document.getElementById(
    "calendarDisplayButtonsRoot",
  );
  if (displayButtonsRootElement) {
    // If the root element exists, create a root for the calendar view buttons.
    // Create a root for the calendar view buttons.
    const displayButtonsRoot = createRoot(displayButtonsRootElement);
    displayButtonsRoot.render(<CalendarDisplayButtonsGroup />);
  } else {
    throw new Error("calendarDisplayButtonsRoot is missing");
  }
}

// Render the calendar navigation button group that includes the previous and next buttons.
function renderCalendarNavigationButtons(): void {
  // Get the root element for the calendar navigation buttons.
  const calendarNavigationButtonsRootElement = document.getElementById(
    "calendarNavButtonsContainer",
  );
  if (calendarNavigationButtonsRootElement) {
    // If the root element exists, create a root for the calendar navigation buttons.
    // Create a root for the calendar navigation buttons.
    const calendarNavigationButtonsRoot = createRoot(
      calendarNavigationButtonsRootElement,
    );

    // Function to render the calendar navigation buttons using the react components.
    const renderCalendarNavButtons = () => {
      calendarNavigationButtonsRoot.render(
        <CalendarNavButtonsGroup onAfterNavigate={() => {}} />,
      );
    };

    renderCalendarNavButtons(); // Automatically call the render function.
  }
}

// Create React root for the calendar header date display
const headerDateRoot = createRoot(
  document.getElementById("headerDateContainer")!,
);

// One render call to initialize and then useAppStateStore will
// update it automatically when the dateView changes.
headerDateRoot.render(<CalendarHeaderDisplay />);

/**
 * Mounts the all-day display into its root element.
 * This renders holiday and future all-day items above the main calendar.
 */
function mountAllDayDisplay(): void {
  const allDayDisplayRootElement = document.getElementById(
    "calendarAllDayDisplayRoot",
  )!; //this should fail in a pretty obvious way if the getElementById returns anything but the correct return for the div

  const root = createRoot(allDayDisplayRootElement);
  root.render(<CalendarAllDayDisplay />);
}

export { initializeCalendarUI };
