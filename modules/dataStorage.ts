import CalendarEvent from "./classCalendarEvent";
import { CalendarViews } from "./enumCalendarViews";

// TODO: replace confirm() dialogs in deletion methods with Bootstrap modal

// Used to identify which localStorage items are events
const savedEventPrefix = "CalendarEvent_";

/**
 * StorageManager is responsible for saving, deleting, and loading
 * calendar events and UI view from localStorage.
 */
const StorageManager = {
  /**
   * Pulls UID property to use in storage key, then converts
   * the rest of the object data to a JSON string to use in storage value.
   * Saves in localStorage with key = savedEventPrefix + UID
   * @param calEvent object CalendarEvent type with string properties: UID, date, time, title, description, address, color
   */
  saveEvent(calEvent: CalendarEvent): void {
    // UID is used in storage key, so exclude it from the stored data to avoid redundancy
    const excludedDataProperty = "UID";
    const jsonString = JSON.stringify(calEvent, (key, value) => {
      if (key === excludedDataProperty) {
        return undefined; // Exclude the UID property from being stored in both key and value
      }
      return value;
    });
    localStorage.setItem(savedEventPrefix + calEvent.UID, jsonString);
  },

  /**
   * Iterates through every item in localStorage, checking for keys that start with savedEventPrefix.
   * For each matching item, retrieve the data from the item's value and combine with the UID from the key to create an Event object,
   * @returns an array with all Event objects that are saved in storage
   */
  loadAllEvents(): CalendarEvent[] {
    const length = localStorage.length;
    const events = [];
    for (let i = 0; i < length; i++) {
      const key = localStorage.key(i);
      // Identify event items by checking for savedEventPrefix in the key
      if (key && key.startsWith(savedEventPrefix)) {
        const jsonString = localStorage.getItem(key);
        if (jsonString) {
          const eventData = JSON.parse(jsonString);
          const UID = key.replace(savedEventPrefix, ""); // Extract UID from the key
          events.push(new CalendarEvent({ UID, ...eventData })); // Combine UID with the rest of the event data
        }
      }
    }
    return events;
  },

  /**
   * Prompts the user for confirmation before deleting the event with the specified UID.
   * @param UID indentifier string from the CalendarEvent object to be deleted
   */
  deleteEvent(UID: string): void {
    if (
      confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    ) {
      localStorage.removeItem(savedEventPrefix + UID);
    }
  },

  /**
   * Prompts the user TWICE for confirmation before deleting all events from localStorage.
   */
  deleteAllEvents(): void {
    if (
      confirm(
        "Are you sure you want to delete all events? This action cannot be undone.",
      )
    ) {
      if (
        confirm(
          "Please confirm again. This will permanently delete ALL events from your calendar.",
        )
      ) {
        // Proceed with deletion only if both confirmations are accepted
        const length = localStorage.length;
        const keysToDelete = [];
        // Identify all keys that start with savedEventPrefix to avoid modifying localStorage while iterating
        for (let i = 0; i < length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(savedEventPrefix)) {
            keysToDelete.push(key);
          }
        }
        // Remove all identified CalendarEvent keys from localStorage
        keysToDelete.forEach((key) => localStorage.removeItem(key));
      }
    }
  },

  /**
   * Saves the current view (day, month, year) of the calendar in localStorage
   * to be used next time app is loaded
   * @param view Value from CalendarViews enumerator
   */
  saveCalendarView(view: CalendarViews): void {
    localStorage.setItem("CalendarView", view);
  },

  /**
   * Loads saved calendar view (day, month, year) from localStorage
   * @returns string Defaults to "day" if no valid saved value found
   */
  loadCalendarView(): CalendarViews {
    const view = localStorage.getItem("CalendarView");
    switch (view) {
      case "day":
        return CalendarViews.Day;
      case "week":
        return CalendarViews.Week;
      case "month":
        return CalendarViews.Month;
      default:
        return CalendarViews.Day;
    }
  },
};

export default StorageManager;
