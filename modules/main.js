import { renderCalendarView } from "./calendar/calendar.js";
import StorageManager from "./dataStorage.js";
import { initializeEventManager } from "./eventManager.js";
import appSettings from "./settings.js";
import initTodayButton from "./todayButton.js";

// Load user settings from localStorage when the application starts
appSettings.loadSettings();

// Load all saved calendar events from localStorage when the application starts
const allEvents = StorageManager.loadAllEvents();

// Initialize listeners for the event manager
initializeEventManager();

// Initialize todayButton listeners
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
