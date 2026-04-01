import "bootstrap/dist/css/bootstrap.min.css";
import "../styling/baseStyling.css";
import "../styling/calendar.css";
import "../styling/dayCalendar.css";
import "../styling/eventForm.css";
import "../styling/weeklyCalendar.css";

import appState from "./appState";
import appSettings from "./settings";
import createSettingsMenu from "./settingsMenu";

import initTodayButton from "./todayButton.js";
import { initializeEventManager } from "./eventManager";
import { initializeCalendarUI } from "./calendar/calendar-ui";

import { loadWeatherDisplay } from "./weatherDisplay";

import runTests from "../tests/runTests.js";

appSettings.loadSettings();
createSettingsMenu();

initializeEventManager();

// Initialize and render all of the calendar UI components (e.g. display (view) buttons, navigation buttons, and the full calendar)
initializeCalendarUI();

initTodayButton();
loadWeatherDisplay();

/* 
This checks that "--mode development" was passed to the webpack CLI, which sets process.env.NODE_ENV to "development". 

If we are in development mode, we run the tests. 

This allows us to run tests during development without affecting the production build, since the test code will be ignored in production mode due to the DefinePlugin configuration in webpack.config.js. 
*/
if (process.env.NODE_ENV !== "production") {
  console.info("Running in development mode, executing tests...");
  runTests();
}
