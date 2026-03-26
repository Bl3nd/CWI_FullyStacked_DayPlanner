import { createRoot } from "react-dom/client";
import CalendarDisplayButtonsGroup from "./navigation/calendar-display-buttons-group";
import CalendarNavButtonsGroup from "./navigation/calendar-nav-buttons-group";
import { renderCalendarView } from "./calendar";
import { updateHeaderDate } from "./headerDate";
import CalendarEvent from "../classCalendarEvent";

// State of the calendar UI. Update this interface to add or remove properties needed for the calendar UI. Don't forget to update the calendarState in main.js for now. Until we have a better way.
interface CalendarUIState {
  calendarView: "day" | "week" | "month" | string;
  viewDate: Date;
  allEvents: CalendarEvent[];
}

// Initializes the calendar UI
function initializeCalendarUI(calendarState: CalendarUIState) {
  renderCalendarViewButtons(calendarState);
  renderCalendarNavigationButtons(calendarState);

  renderCalendar(calendarState);

  document
    .getElementById("slotDurationSelect")
    ?.addEventListener("change", () => renderCalendar(calendarState)); // Event listener for the slot duration select
}

// Renders the calendar
function renderCalendar(calendarState: CalendarUIState) {
  renderCalendarView(
    calendarState.allEvents,
    calendarState.viewDate,
    calendarState.calendarView,
  );
  updateHeaderDate(calendarState); // Updates the header date
}

// Renders the calendar view buttons
function renderCalendarViewButtons(calendarState: CalendarUIState) {
  const displayButtonsRootElement = document.getElementById(
    "calendarDisplayButtonsRoot",
  );
  if (displayButtonsRootElement) {
    const displayButtonsRoot = createRoot(displayButtonsRootElement);
    const renderDisplayButtons = () => {
      displayButtonsRoot.render(
        <CalendarDisplayButtonsGroup
          activeView={calendarState.calendarView}
          onSelectView={(view) => {
            calendarState.calendarView = view;
            renderCalendar(calendarState);
            renderDisplayButtons();
          }}
        />,
      );
    };

    renderDisplayButtons();
  }
}

// Renders the calendar navigation buttons
function renderCalendarNavigationButtons(calendarState: CalendarUIState) {
  const calendarNavigationButtonsRootElement = document.getElementById(
    "calendarNavButtonsContainer",
  );
  if (calendarNavigationButtonsRootElement) {
    const calendarNavigationButtonsRoot = createRoot(
      calendarNavigationButtonsRootElement,
    );
    const renderCalendarNavButtons = () => {
      calendarNavigationButtonsRoot.render(
        <CalendarNavButtonsGroup
          state={calendarState}
          onRender={() => renderCalendar(calendarState)}
        />,
      );
    };

    renderCalendarNavButtons();
  }
}

export { initializeCalendarUI };
