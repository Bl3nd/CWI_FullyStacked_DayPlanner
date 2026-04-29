import { useSyncExternalStore } from "react";
import appState from "./appState";

export const colorThemes = {
  blue: { hex: "#0d6efd", rgb: "13, 110, 253" },
  purple: { hex: "#4e3a77", rgb: "78, 58, 119" },
  pink: { hex: "#b8568c", rgb: "184, 86, 140" },
  red: { hex: "#a32420", rgb: "163, 36, 32" },
  orange: { hex: "#da5b29", rgb: "218, 91, 41" },
  yellow: { hex: "#c8ac69", rgb: "200, 172, 105" },
  green: { hex: "#378e3c", rgb: "55, 142, 60" },
};

/**
 * Manages application settings, including saving to and loading from localStorage.
 * Each binary setting has a getter and a toggle method.
 * The color theme setting has a getter and a setter that validates the assigned value
 * against a predefined list of valid options.
 *
 * The restoreDefaults() method resets all settings to their default values.
 *
 * The class also implements a simple subscription mechanism
 * to notify React listeners when settings change.
 */
class AppSettings {
  private _lightMode: "light" | "dark" = "light";
  private _tempUnit: "Celsius" | "Fahrenheit" = "Fahrenheit";
  private _firstDayOfWeek: "Sunday" | "Monday" = "Sunday";
  private _displayHolidays: boolean = true;
  private _colorTheme: keyof typeof colorThemes = "blue";

  // For setting CSS variables related to color themes
  private root = document.documentElement;

  private snapshot = this.buildSnapshot();
  private listeners = new Set<() => void>();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot() {
    return this.snapshot;
  }

  private buildSnapshot() {
    return {
      lightMode: this._lightMode,
      tempUnit: this._tempUnit,
      firstDayOfWeek: this._firstDayOfWeek,
      displayHolidays: this._displayHolidays,
      colorTheme: this._colorTheme,
    };
  }

  private notifyListeners() {
    this.snapshot = this.buildSnapshot();
    this.listeners.forEach((listener) => listener());
  }

  get lightMode() {
    return this._lightMode;
  }
  // Sets bootstrap theme and body class based on light mode setting
  toggleLightMode = () => {
    if (this._lightMode === "light") {
      this._lightMode = "dark";
      document.documentElement.setAttribute("data-bs-theme", "dark");
      document.body.classList.add("dark-mode");
    } else {
      this._lightMode = "light";
      document.documentElement.setAttribute("data-bs-theme", "light");
      document.body.classList.remove("dark-mode");
    }
    this.saveSettings();
  };

  get tempUnit() {
    return this._tempUnit;
  }
  toggleTempUnit = () => {
    if (this._tempUnit === "Fahrenheit") {
      this._tempUnit = "Celsius";
    } else {
      this._tempUnit = "Fahrenheit";
    }
    this.notifyListeners();
    this.saveSettings();
  };

  get firstDayOfWeek() {
    return this._firstDayOfWeek;
  }
  toggleFirstDayOfWeek = () => {
    if (this._firstDayOfWeek === "Sunday") {
      this._firstDayOfWeek = "Monday";
    } else {
      this._firstDayOfWeek = "Sunday";
    }
    this.notifyListeners();
    this.saveSettings();
  };

  get displayHolidays() {
    return this._displayHolidays;
  }
  toggleDisplayHolidays = () => {
    if (this._displayHolidays === true) {
      this._displayHolidays = false;
    } else {
      this._displayHolidays = true;
    }
    this.notifyListeners();
    this.saveSettings();
  };

  get colorTheme() {
    return this._colorTheme;
  }

  set colorTheme(value) {
    if (value in colorThemes) {
      this._colorTheme = value;
      const theme = colorThemes[value];
      document.getElementById("dynamic-theme")?.remove();
      // Create an element meant to hold Bootstrap CSS variable overrides
      // for the selected color theme

      // Directly overrwriting CSS variables on the document :root
      // doesn't properly change button styling as those are scoped
      // to the .btn-primary class, so we need to create a style element
      // with the correct selectors to ensure the new theme is applied correctly
      const style = document.createElement("style");
      style.id = "dynamic-theme";
      style.innerHTML = `
    :root {
      --bs-primary: ${theme.hex};
      --bs-primary-rgb: ${theme.rgb};
    }
    .btn-primary {
      --bs-btn-bg: ${theme.hex};
      --bs-btn-border-color: ${theme.hex};
      --bs-btn-hover-bg: ${this.darkenColor(theme.hex, 10)};
      --bs-btn-hover-border-color: ${this.darkenColor(theme.hex, 12)};
      --bs-btn-active-bg: ${this.darkenColor(theme.hex, 15)};
    }
    .text-primary { color: ${theme.hex} !important; }
    .bg-primary { background-color: ${theme.hex} !important; }
    .border-primary { border-color: ${theme.hex} !important; }
    `;
      document.head.appendChild(style);
    } else {
      throw new Error(
        `Invalid color theme: ${value}. Valid options are: ${Object.keys(
          colorThemes,
        ).join(", ")}.`,
      );
    }
    this.saveSettings();
  }

  private darkenColor(hex: string, percent: number) {
    const factor = 1 - percent / 100;
    const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
    const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
    const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
    return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  }

  restoreDefaults() {
    document.documentElement.setAttribute("data-bs-theme", "light");
    document.body.classList.remove("dark-mode");
    this._lightMode = "light";
    this._tempUnit = "Fahrenheit";
    this._firstDayOfWeek = "Sunday";
    this._displayHolidays = true;
    this._colorTheme = "blue";
    this.notifyListeners();
    this.saveSettings();
  }

  saveSettings() {
    const settings = {
      lightMode: this._lightMode,
      tempUnit: this._tempUnit,
      firstDayOfWeek: this._firstDayOfWeek,
      displayHolidays: this._displayHolidays,
      colorTheme: this._colorTheme,
    };
    localStorage.setItem("DayPlannerSettings", JSON.stringify(settings));
  }

  loadSettings() {
    const settingsString = localStorage.getItem("DayPlannerSettings");
    if (!settingsString) return;
    try {
      const settings = JSON.parse(settingsString);
      this._lightMode = settings.lightMode;
      this._tempUnit = settings.tempUnit;
      this._firstDayOfWeek = settings.firstDayOfWeek;
      this._displayHolidays = settings.displayHolidays;
      this.colorTheme = settings.colorTheme;
    } catch (error) {
      console.warn("Error parsing settings from localStorage:", error);
    }
    if (this._lightMode === "dark") {
      document.documentElement.setAttribute("data-bs-theme", "dark");
      document.body.classList.add("dark-mode");
    }
  }
}

export function useAppSettings() {
  return useSyncExternalStore(
    (listener) => appSettings.subscribe(listener),
    () => appSettings.getSnapshot(),
  );
}

const appSettings = new AppSettings();
export default appSettings;
