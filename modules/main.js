import "bootstrap/dist/css/bootstrap.min.css";
import "../styling/baseStyling.css";
import "../styling/calendar.css";
import "../styling/dayCalendar.css";
import "../styling/eventForm.css";
import "../styling/weeklyCalendar.css";

import StorageManager from "./dataStorage";
import appSettings from "./settings";
import createSettingsMenu from "./settingsMenu";

import { updateHeaderDate } from "./calendar/headerDate";
import { renderCalendarView, CalendarView } from "./calendar/calendar";
import { initializeCalendarNavigation } from "./calendar/calendarNavigationButtons";
import { initializeCalendarDisplayButtons } from "./calendar/calendarDisplayButtons";
import initTodayButton from "./todayButton";

import { initializeEventManager } from "./eventManager";

import { loadWeatherDisplay } from "./weatherDisplay";

import runTests from "../tests/runTests";

// TODO: change this to utilize appState.eventsByUID and appState.eventsByDate instead of loading events from storage.
const allEvents = StorageManager.loadAllEvents();
appSettings.loadSettings();

createSettingsMenu();

initializeEventManager();
initTodayButton();

{
  const viewDate = new Date();
  viewDate.setHours(0, 0, 0, 0);

  renderCalendarView(allEvents, viewDate);
  const slotDurationSelect = document.getElementById("slotDurationSelect");
  if (slotDurationSelect) {
    slotDurationSelect.addEventListener("change", () => {
      renderCalendarView(allEvents, viewDate);
    });
  }
}

{
  const viewDate = new Date();
  viewDate.setHours(0, 0, 0, 0);
  const calendarState = { viewDate, calendarView: CalendarView.DAY };

  // Renders the calendar
  function render() {
    renderCalendarView(
      allEvents,
      calendarState.viewDate,
      calendarState.calendarView,
    );
    updateHeaderDate(calendarState); // Updates the header date
  }

  render();
  document
    .getElementById("slotDurationSelect")
    ?.addEventListener("change", render); // Event listener for the slot duration select
  initializeCalendarNavigation(calendarState, render); // Initializes the calendar navigation buttons
  initializeCalendarDisplayButtons(calendarState, render); // Initializes the calendar display buttons
}

loadWeatherDisplay();

// runTests();
