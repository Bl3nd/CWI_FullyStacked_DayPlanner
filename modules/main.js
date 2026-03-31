import "bootstrap/dist/css/bootstrap.min.css";
import "../styling/baseStyling.css";
import "../styling/calendar.css";
import "../styling/dayCalendar.css";
import "../styling/eventForm.css";
import "../styling/weeklyCalendar.css";

import StorageManager from "./dataStorage";
import appSettings from "./settings";
import createSettingsMenu from "./settingsMenu";

import initTodayButton from "./todayButton.js";

import { initializeEventManager } from "./eventManager";

import { loadWeatherDisplay } from "./weatherDisplay";

import runTests from "../tests/runTests.js";
import { initializeCalendarUI } from "./calendar/calendar-ui";

// TODO: change this to utilize appState.eventsByUID and appState.eventsByDate instead of loading events from storage.
const allEvents = StorageManager.loadAllEvents();
appSettings.loadSettings();

createSettingsMenu();

initializeEventManager();

// Initialize and render all of the calendar UI components (e.g. display (view) buttons, navigation buttons, and the full calendar)
initializeCalendarUI(allEvents);

initTodayButton();
loadWeatherDisplay();

// runTests();
