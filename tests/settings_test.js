import localStorageMock from "./mockStorage";

import appSettings from "../modules/settings";

function settingsTests() {
  let passed = 0;
  let failed = 0;

  localStorageMock.initialize();

  // Silence console.warn during expected-failure tests
  const originalWarn = console.warn;
  console.warn = () => {};

  // ─── HELPERS ──────────────────────────────────────────────────────────────────

  function expectValue(label, actual, expected) {
    if (actual === expected) {
      passed++;
    } else {
      console.error(
        `❌ FAIL — "${label}": expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}.`,
      );
      failed++;
    }
  }

  // ─── DEFAULTS ─────────────────────────────────────────────────────────────────
  console.log("🧪 Testing appSettings...");

  appSettings.restoreDefaults();
  expectValue("lightMode defaults to 'light'", appSettings.lightMode, "light");
  expectValue(
    "tempUnit defaults to 'Fahrenheit'",
    appSettings.tempUnit,
    "Fahrenheit",
  );
  expectValue("colorTheme defaults to 'blue'", appSettings.colorTheme, "blue");
  expectValue(
    "firstDayOfWeek defaults to 'Sunday'",
    appSettings.firstDayOfWeek,
    "Sunday",
  );
  expectValue(
    "displayHolidays defaults to true",
    appSettings.displayHolidays,
    true,
  );

  // ─── LIGHTMODE ────────────────────────────────────────────────────────────────

  appSettings.restoreDefaults();
  appSettings.lightMode = "fail";
  expectValue(
    "Invalid value does not change lightMode",
    appSettings.lightMode,
    "light",
  );
  appSettings.lightMode = "dark";
  expectValue("Valid value 'dark' is accepted", appSettings.lightMode, "dark");
  appSettings.lightMode = "light";
  expectValue(
    "Valid value 'light' is accepted",
    appSettings.lightMode,
    "light",
  );

  // ─── TEMPUNIT ─────────────────────────────────────────────────────────────────

  appSettings.restoreDefaults();
  appSettings.tempUnit = "Kelvin";
  expectValue(
    "Invalid value does not change tempUnit",
    appSettings.tempUnit,
    "Fahrenheit",
  );
  appSettings.tempUnit = "Celsius";
  expectValue(
    "Valid value 'Celsius' is accepted",
    appSettings.tempUnit,
    "Celsius",
  );
  appSettings.tempUnit = "Fahrenheit";
  expectValue(
    "Valid value 'Fahrenheit' is accepted",
    appSettings.tempUnit,
    "Fahrenheit",
  );

  // ─── COLORTHEME ───────────────────────────────────────────────────────────────

  appSettings.restoreDefaults();
  appSettings.colorTheme = "invalid";
  expectValue(
    "Invalid value does not change colorTheme",
    appSettings.colorTheme,
    "blue",
  );
  appSettings.colorTheme = "purple";
  expectValue(
    "Valid value 'purple' is accepted",
    appSettings.colorTheme,
    "purple",
  );
  appSettings.colorTheme = "pink";
  expectValue("Valid value 'pink' is accepted", appSettings.colorTheme, "pink");
  appSettings.colorTheme = "red";
  expectValue("Valid value 'red' is accepted", appSettings.colorTheme, "red");
  appSettings.colorTheme = "orange";
  expectValue(
    "Valid value 'orange' is accepted",
    appSettings.colorTheme,
    "orange",
  );
  appSettings.colorTheme = "yellow";
  expectValue(
    "Valid value 'yellow' is accepted",
    appSettings.colorTheme,
    "yellow",
  );
  appSettings.colorTheme = "green";
  expectValue(
    "Valid value 'green' is accepted",
    appSettings.colorTheme,
    "green",
  );
  appSettings.colorTheme = "blue";
  expectValue("Valid value 'blue' is accepted", appSettings.colorTheme, "blue");

  // ─── FIRSTDAYOFWEEK ───────────────────────────────────────────────────────────

  appSettings.restoreDefaults();
  appSettings.firstDayOfWeek = "Tuesday";
  expectValue(
    "Invalid value does not change firstDayOfWeek",
    appSettings.firstDayOfWeek,
    "Sunday",
  );
  appSettings.firstDayOfWeek = "Monday";
  expectValue(
    "Valid value 'Monday' is accepted",
    appSettings.firstDayOfWeek,
    "Monday",
  );
  appSettings.firstDayOfWeek = "Sunday";
  expectValue(
    "Valid value 'Sunday' is accepted",
    appSettings.firstDayOfWeek,
    "Sunday",
  );

  // ─── DISPLAYHOLIDAYS ──────────────────────────────────────────────────────────

  appSettings.restoreDefaults();
  appSettings.displayHolidays = "yes";
  expectValue(
    "Invalid value does not change displayHolidays",
    appSettings.displayHolidays,
    true,
  );
  appSettings.displayHolidays = 1;
  expectValue(
    "Truthy non-boolean does not change displayHolidays",
    appSettings.displayHolidays,
    true,
  );
  appSettings.displayHolidays = false;
  expectValue(
    "Valid value false is accepted",
    appSettings.displayHolidays,
    false,
  );
  appSettings.displayHolidays = true;
  expectValue(
    "Valid value true is accepted",
    appSettings.displayHolidays,
    true,
  );

  // ─── SAVE AND LOAD ────────────────────────────────────────────────────────────

  appSettings.restoreDefaults();
  appSettings.lightMode = "dark";
  appSettings.tempUnit = "Celsius";
  appSettings.colorTheme = "purple";
  appSettings.firstDayOfWeek = "Monday";
  appSettings.displayHolidays = false;
  appSettings.saveSettings();
  expectValue(
    "Settings key exists in localStorage after save",
    localStorage.getItem("DayPlannerSettings") !== null,
    true,
  );

  appSettings.restoreDefaults();
  appSettings.loadSettings();
  expectValue(
    "lightMode restored to 'dark' after load",
    appSettings.lightMode,
    "dark",
  );
  expectValue(
    "tempUnit restored to 'Celsius' after load",
    appSettings.tempUnit,
    "Celsius",
  );
  expectValue(
    "colorTheme restored to 'purple' after load",
    appSettings.colorTheme,
    "purple",
  );
  expectValue(
    "firstDayOfWeek restored to 'Monday' after load",
    appSettings.firstDayOfWeek,
    "Monday",
  );
  expectValue(
    "displayHolidays restored to false after load",
    appSettings.displayHolidays,
    false,
  );

  localStorage.setItem("DayPlannerSettings", "this is not valid json {{{");
  try {
    appSettings.loadSettings();
    passed++;
  } catch (e) {
    console.error(
      `❌ FAIL — "loadSettings() handles corrupted JSON without throwing": threw → ${e.message}`,
    );
    failed++;
  }

  localStorage.removeItem("DayPlannerSettings");
  try {
    appSettings.loadSettings();
    passed++;
  } catch (e) {
    console.error(
      `❌ FAIL — "loadSettings() handles missing localStorage key without throwing": threw → ${e.message}`,
    );
    failed++;
  }

  // ─── SUMMARY ──────────────────────────────────────────────────────────────────

  localStorageMock.restore();
  appSettings.restoreDefaults();

  const total = passed + failed;
  if (failed === 0) {
    console.log(`✅ appSettings — ${passed}/${total} Tests Passed!`);
  } else {
    console.warn(
      `⚠️  appSettings — ${passed}/${total} passed, ${failed} failed. See above for details.`,
    );
  }

  // Restore console.warn after tests
  console.warn = originalWarn;
}

export default settingsTests;
