import { createRoot, type Root } from "react-dom/client";
import CalendarDisplayButtonsGroup from "./navigation/calendar-display-buttons-group";
import CalendarNavButtonsGroup from "./navigation/calendar-nav-buttons-group";
import CalendarWrapper from "./calendarContainer/calendarWrapper";
import { CalendarHeaderDisplay } from "./calendar-header-display";
import appState from "../appState";
import { CalendarViews } from "../enumCalendarViews";

/**
 * Initializes the calendar UI and renders the components. This function should only call the render functions for the calendar UI components.
 * @returns void
 */
function initializeCalendarUI(): void {
  renderCalendarViewButtons(); // Render the 'Day', 'Week', 'Month' buttons.
  renderCalendarNavigationButtons(); // Render the previous and next buttons.
  mountCalendarWrapper(); // Mount React into #calendarViewArea
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

  // if (!calendarViewAreaElement) {
  //   console.error("calendarViewArea not found");
  //   return;
  // }

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
    // Render the calendar view buttons.
    const renderDisplayButtons = () => {
      displayButtonsRoot.render(
        <CalendarDisplayButtonsGroup
          activeView={appState.calendarView}
          onSelectView={(view: CalendarViews) => {
            appState.calendarView = view;
            renderDisplayButtons(); // Re-render the calendar view buttons to reflect the new active view.
          }}
          //todayButton logic.  sets new date to today, set view to dayView, and rerenders the calendar and buttons.
          onSelectToday={() => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            appState.dateView = today.toLocaleDateString("en-CA");
            appState.calendarView = CalendarViews.Day;

            renderDisplayButtons();
          }}
        />,
      );
    };

    renderDisplayButtons(); // Automatically call the render function.
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

export { initializeCalendarUI };
