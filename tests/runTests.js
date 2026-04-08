import calendarNavigationFunctionsTest from "./use-calendar-nav-button_test";
import eventTests from "./classCalendarEvent_test";
import storageTests from "./dataStorage_test";
import settingsTests from "./settings_test";
import appStateTests from "./appState_test";

function runTests() {
  eventTests();
  storageTests();
  appStateTests();
  settingsTests();
  calendarNavigationFunctionsTest();
}

export default runTests;
