// Remember to change the restoreDefaults() method and testSuite() if you change any of these default values

let lightMode = "light";
const lightModeOptions = ["light", "dark"];

let tempUnit = "Fahrenheit";
const tempUnitOptions = ["Celsius", "Fahrenheit"];

let colorTheme = "blue";
const colorThemeOptions = [
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
];

let firstDayOfWeek = "Sunday";
const firstDayOfWeekOptions = ["Sunday", "Monday"];

let displayHolidays = true;
const diplayHolidaysOptions = [true, false];

/**
 * Manages application settings, including saving to and loading from localStorage.
 * Each setting has a getter and setter that validates input against predefined options.
 * Invalid values are logged to the console with a warning message.
 * The restoreDefaults() method resets all settings to their default values.
 */
const appSettings = {
  //
  // Light mode
  //
  get lightMode() {
    return lightMode;
  },
  set lightMode(value) {
    if (lightModeOptions.includes(value)) {
      lightMode = value;
      document.documentElement.setAttribute("data-bs-theme", value);
      if (value === "dark") {
        document.body.classList.add("dark-mode");
      }
    } else {
      logInvalidValue(value, "lightMode", lightModeOptions);
    }
  },
  toggleLightMode() {
    if (lightMode === "light") {
      lightMode = "dark";
      document.documentElement.setAttribute("data-bs-theme", "dark");
      document.body.classList.add("dark-mode");
    } else {
      lightMode = "light";
      document.documentElement.setAttribute("data-bs-theme", "light");
      document.body.classList.remove("dark-mode");
    }
  },
  //
  // Temperature unit
  //
  get tempUnit() {
    return tempUnit;
  },
  set tempUnit(value) {
    if (tempUnitOptions.includes(value)) {
      tempUnit = value;
    } else {
      logInvalidValue(value, "tempUnit", tempUnitOptions);
    }
  },
  toggleTempUnit() {
    if (tempUnit === "Fahrenheit") {
      tempUnit = "Celsius";
    } else {
      tempUnit = "Fahrenheit";
    }
  },
  //
  // Color theme
  //
  get colorTheme() {
    return colorTheme;
  },
  set colorTheme(value) {
    if (colorThemeOptions.includes(value)) {
      colorTheme = value;
    } else {
      logInvalidValue(value, "colorTheme", colorThemeOptions);
    }
  },
  //
  // First day of week
  //
  get firstDayOfWeek() {
    return firstDayOfWeek;
  },
  set firstDayOfWeek(value) {
    if (firstDayOfWeekOptions.includes(value)) {
      firstDayOfWeek = value;
    } else {
      logInvalidValue(value, "firstDayOfWeek", firstDayOfWeekOptions);
    }
  },
  toggleFirstDayOfWeek() {
    if (firstDayOfWeek === "Sunday") {
      firstDayOfWeek = "Monday";
    } else {
      firstDayOfWeek = "Sunday";
    }
  },
  //
  // Display holidays
  //
  get displayHolidays() {
    return displayHolidays;
  },
  set displayHolidays(value) {
    if (diplayHolidaysOptions.includes(value)) {
      displayHolidays = value;
    } else {
      logInvalidValue(value, "displayHolidays", diplayHolidaysOptions);
    }
  },
  toggleDisplayHolidays() {
    if (displayHolidays === true) {
      displayHolidays = false;
    } else {
      displayHolidays = true;
    }
  },

  restoreDefaults() {
    this.lightMode = "light";
    this.tempUnit = "Fahrenheit";
    this.colorTheme = "blue";
    this.firstDayOfWeek = "Sunday";
    this.displayHolidays = true;
  },

  saveSettings() {
    const settings = {
      lightMode,
      tempUnit,
      colorTheme,
      firstDayOfWeek,
      displayHolidays,
    };
    localStorage.setItem("DayPlannerSettings", JSON.stringify(settings));
  },

  loadSettings() {
    const settingsString = localStorage.getItem("DayPlannerSettings");
    if (!settingsString) return;
    try {
      const settings = JSON.parse(settingsString);
      this.lightMode = settings.lightMode;
      this.tempUnit = settings.tempUnit;
      this.colorTheme = settings.colorTheme;
      this.firstDayOfWeek = settings.firstDayOfWeek;
      this.displayHolidays = settings.displayHolidays;
    } catch (error) {
      console.warn("Error parsing settings from localStorage:", error);
    }
  },
};

/**
 * Logs a warning message to the console when an invalid value is assigned to a setting, including the setting name and valid options.
 * @param {*} value
 * @param {string} settingName
 * @param {Array} validOptions
 */
function logInvalidValue(value, settingName, validOptions) {
  console.warn(
    `Invalid value for ${settingName}: ${value}. Valid options are: ${validOptions.join(
      ", ",
    )}.`,
  );
}

export default appSettings;
