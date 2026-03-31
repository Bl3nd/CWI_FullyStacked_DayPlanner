import { createRoot, type Root } from "react-dom/client";
import CalendarDisplayButtonsGroup from "./navigation/calendar-display-buttons-group";
import CalendarNavButtonsGroup from "./navigation/calendar-nav-buttons-group";
import { renderCalendarView } from "./calendar";
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

  renderCalendar(); // Render the whole calendar view that includes the events per slot.

  document
    .getElementById("slotDurationSelect")
    ?.addEventListener("change", () => renderCalendar()); // Event listener for the slot duration select
}

// Render the calendar view for the given calendar state. This function should be called when the calendar state changes (e.g. when the user clicks a button to change the view).
function renderCalendar(): void {
  renderCalendarView(
    appState.allEventsByDate,
    appState.dateViewObject,
    appState.calendarView,
  );

  renderCalendarHeaderDisplay();
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
            renderCalendar();
            renderDisplayButtons(); // Re-render the calendar view buttons to reflect the new active view.
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
        <CalendarNavButtonsGroup
          onRender={() => renderCalendar()}
        />,
      );
    };

    renderCalendarNavButtons(); // Automatically call the render function.
  }
}

// Render the calendar header display (the current date being viewed).
let headerDateContainerRoot: Root | null = null;
function renderCalendarHeaderDisplay(): void {
  // Get the root element for the calendar header display.
  const headerDateContainer = document.getElementById("headerDateContainer");
  if (headerDateContainer) {
    // If the root element exists, create a root for the calendar header display.
    // Create a root for the calendar header display.
    if (headerDateContainerRoot === null) {
      headerDateContainerRoot = createRoot(headerDateContainer); // Create a root for the calendar header display if it doesn't exist. This is to prevent the root from being created multiple times.
    }

    // Function to render the calendar header display using the react components.
    const renderHeaderDateDisplay = () => {
      // We know that the root does exist at this point.
      headerDateContainerRoot!.render(<CalendarHeaderDisplay />);
    };

    renderHeaderDateDisplay(); // Automatically call the render function.
  }
}

export { initializeCalendarUI };
