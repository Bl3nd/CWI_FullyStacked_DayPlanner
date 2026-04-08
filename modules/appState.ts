import { useSyncExternalStore } from "react";
import CalendarEvent from "./classCalendarEvent";
import StorageManager from "./dataStorage";
import { CalendarViews } from "./enumCalendarViews";

import { createMockEvents, registerCheatCode } from "./mockEvents";

// Helper functions to map events by UID and by Date for efficient access

/**
 * Creates a map with {key: value} pairs of {UID: CalendarEvent} for all events passed in.
 * @param events Array of CalendarEvent objects loaded from storage
 * @returns
 */
function mapEventsByUID(events: CalendarEvent[]): Map<string, CalendarEvent> {
  const mappedEvents = new Map();
  events.forEach((event) => {
    mappedEvents.set(event.UID, event);
  });
  return mappedEvents;
}

/**
 * Creates a map with {key: value} pairs of {date: CalendarEvent[]} for all events passed in.
 * Each key is a date string in "YYYY-MM-DD" format, and the value is an array
 * of CalendarEvent objects that occur on that date.
 * @param events Array of CalendarEvent objects loaded from storage
 * @returns
 */
function mapEventsByDate(
  events: CalendarEvent[],
): Map<string, CalendarEvent[]> {
  const mappedDates = new Map();
  events.forEach((event) => {
    const dateKey = event.date;
    if (!mappedDates.has(dateKey)) {
      mappedDates.set(dateKey, []);
    }
    mappedDates.get(dateKey).push(event);
  });
  return mappedDates;
}

class AppState {
  private _loadedEvents = StorageManager.loadAllEvents();

  private _eventsByUID = mapEventsByUID(this._loadedEvents);
  private _eventsByDate = mapEventsByDate(this._loadedEvents);
  private _dateView = new Date().toLocaleDateString("en-CA");

  private _calendarView = StorageManager.loadCalendarView();

  // Set of listener functions to call whenever the app state changes (e.g. when events are added, edited, or deleted)
  private listeners = new Set<() => void>();

  constructor() {
    const loadedEvents = StorageManager.loadAllEvents();

    this._eventsByUID = mapEventsByUID(loadedEvents);
    this._eventsByDate = mapEventsByDate(loadedEvents);

    // Set date view to current date in "YYYY-MM-DD" format
    this._dateView = new Date().toLocaleDateString("en-CA");

    // Load calendar view from storage, default to "day" if not saved
    this._calendarView = StorageManager.loadCalendarView();
  }

  /**
   * Returns a Map of all events keyed by their UID,
   * where each value is a CalendarEvent object
   */
  get allEventsByUID(): Map<string, CalendarEvent> {
    return this._eventsByUID;
  }

  /**
   * Returns a Map of all events keyed by their date (YYYY-MM-DD),
   * where each value is an array of CalendarEvent objects for that date
   */
  get allEventsByDate(): Map<string, CalendarEvent[]> {
    return this._eventsByDate;
  }

  /**
   * Returns the CalendarEvent object with the specified UID,
   * or undefined if no event with that UID exists.
   * @param uid Unique identifier of the event to retrieve
   * @returns
   */
  getEventByUID(uid: string): CalendarEvent | undefined {
    return this._eventsByUID.get(uid);
  }

  /**
   * Returns an array of CalendarEvent objects for the specified date.
   * If no events exist for that date, returns an empty array.
   * @param date "YYYY-MM-DD" formatted date string to retrieve events for
   * @returns Array of CalendarEvent objects for the specified date,
   * or [] if no events exist for that date
   */
  getEventsByDate(date: string): CalendarEvent[] {
    return this._eventsByDate.get(date) || [];
  }

  /**
   * Adds a new event to the app state, updates both eventsByUID and eventsByDate maps,
   * and saves the event to localStorage.
   *
   * USE THIS FOR EDITING AS WELL
   *
   * If an event with the same UID already exists, it will be overwritten.
   * @param event CalendarEvent object to add
   */
  addEvent(event: CalendarEvent): void {
    // Replace map instead of mutating
    this._eventsByUID = new Map(this._eventsByUID).set(event.UID, event);

    // Check if an event with the same UID already exists for that date
    const existingEvents = this._eventsByDate.get(event.date) ?? [];
    const alreadyExists = existingEvents.some((e) => e.UID === event.UID);

    // If it already exists, replace the existing event with the new event in the array of events for that date.
    // If it doesn't already exist, add the new event to the array of events for that date.
    const updatedEvents = alreadyExists
      ? existingEvents.map((e) => (e.UID === event.UID ? event : e))
      : [...existingEvents, event];

    // Replace map instead of mutating
    this._eventsByDate = new Map(this._eventsByDate).set(
      event.date,
      updatedEvents,
    );

    StorageManager.saveEvent(event);
    this.notifyListeners();
  }

  /**
   * Removes an event with the specified UID from the app state,
   * updates both eventsByUID and eventsByDate maps, and deletes the event from localStorage.
   *
   * If no event with the specified UID exists, throws an error.
   * @param uid Unique identifier of the event to retrieve
   */
  removeEvent(uid: string): void {
    const event = this._eventsByUID.get(uid);
    if (!event) throw new Error(`No event found with UID: ${uid}`);

    // Replace map instead of mutating
    this._eventsByUID = new Map(this._eventsByUID);
    this._eventsByUID.delete(uid);

    // Remove the event from the array of events for that date
    const remainingEvents = (this._eventsByDate.get(event.date) ?? []).filter(
      (e) => e.UID !== uid,
    );

    this._eventsByDate = new Map(this._eventsByDate);

    if (remainingEvents.length === 0) {
      this._eventsByDate.delete(event.date);
    } else {
      this._eventsByDate.set(event.date, remainingEvents);
    }

    StorageManager.deleteEvent(uid);
    this.notifyListeners();
  }

  /**
   * Returns the current calendar view as a string ("day", "week", or "month").
   * @returns "day", "week", or "month" string representing the current calendar view
   */
  get calendarView(): CalendarViews {
    return this._calendarView;
  }

  /**
   * Sets the current calendar view. The view must be "day", "week", or "month".
   * If the view is not valid, throws an error.
   *
   * Also saves the new calendar view to localStorage so that it persists across page reloads.
   * @param view "day", "week", or "month" string to set as the current calendar view
   */
  set calendarView(view: CalendarViews) {
    if (!Object.values(CalendarViews).includes(view)) {
      throw new Error(
        `Invalid calendar view. Valid views are: ${Object.values(CalendarViews).join(", ")}`,
      );
    }
    this._calendarView = view;
    StorageManager.saveCalendarView(view);
    this.notifyListeners();
  }

  /**
   * Returns the current date view as a string.
   * @returns "YYYY-MM-DD" formatted date string
   */
  get dateView(): string {
    return this._dateView;
  }

  /**
   * Returns the current date view as a Date object.
   * @returns Date object representing the current date view
   */
  get dateViewObject(): Date {
    const [year, month, day] = this._dateView.split("-").map(Number);
    //@ts-ignore - TypeScript thinks this._dateView.split("-") could be undefined, but we always set it in the constructor and validate it in the setter
    return new Date(year, month - 1, day);
  }

  /**
   * Sets the current date view. The date must be in "YYYY-MM-DD" format for the year 2000-2099.
   * If the date is not in the correct format, throws an error.
   * @param date "YYYY-MM-DD" formatted date string to set as the current date view
   */
  set dateView(date: string) {
    // Check that date is in "YYYY-MM-DD" format for the year 2000-2099
    const dateRegex = /^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!dateRegex.test(date)) {
      throw new Error(
        `Invalid date format. Date must be in "YYYY-MM-DD" format for the year 2000-2099.`,
      );
    }
    this._dateView = date;
    this.notifyListeners();
  }

  /**
   * Allows components to subscribe to changes in the app state.
   * Whenever the app state changes, all subscribed listener functions will be called
   * so that they can update their UI accordingly.
   *
   * Returns an unsubscribe function that React uses when the component unmounts.
   */
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Calls all subscribed listener functions to notify them that the app state has changed.
   * Passes a snapshot of the current app state to each listener so React can update the UI accordingly.
   * This replaces extra calls to rerender elsewhere in the code.
   */
  private notifyListeners() {
    this.snapshot = this.buildSnapshot();
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Snapshot of the current app state that is passed to subscribed listener functions whenever the app state changes.
   * This is how React decides if a component needs to rerender - if the snapshot has changed
   * since the last time it was called, then the component will rerender with the new snapshot data.
   * @returns
   */
  getSnapshot() {
    return this.snapshot;
  }

  private snapshot = this.buildSnapshot();

  private buildSnapshot() {
    return {
      allEventsByDate: this._eventsByDate,
      calendarView: this._calendarView,
      dateView: this._dateView,
    };
  }
}

/**
 * Single source of truth for all event data and calendar state in the app.
 *
 * Components can subscribe to changes in the app state and receive a snapshot of the current state
 * whenever it changes, allowing them to update their UI accordingly.
 *
 * Provides methods to access and manipulate events, calendar view, and date view.
 * Initially loads events and calendar view from localStorage into eventsByUID and eventsByDate maps,
 * and sets date view to current date. When events are added, edited, or deleted,
 * creates new, updated internal maps and saves changes to localStorage.
 *
 * When calendar view is changed, saves the new view to localStorage.
 *
 */
const appState = new AppState();

// Tapping F2 3x within a couple seconds will load mock events for testing purposes. This is a "cheat code" that allows us to easily load mock events without having to run tests or manually create events one by one.
registerCheatCode(() => {
  console.log("Loading mock events...");
  const events = createMockEvents();
  events.forEach((event) => appState.addEvent(event));
});

/**
 * Function that React components can import and call to subscribe to changes in the app state.
 * Whenever the app state changes, the subscribed component will receive a new snapshot
 * of the app state and can update its UI if needed. *
 */

export function useAppStateStore() {
  return useSyncExternalStore(
    (listener) => appState.subscribe(listener),
    () => appState.getSnapshot(),
  );
}

export default appState;
