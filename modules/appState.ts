import CalendarEvent from "./classCalendarEvent";
import StorageManager from "./dataStorage";
import { CalendarViews } from "./enumCalendarViews";

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
  private _eventsByUID: Map<string, CalendarEvent>;
  private _eventsByDate: Map<string, CalendarEvent[]>;
  private _calendarView: CalendarViews;
  private _dateView: string;

  constructor() {
    const loadedEvents = StorageManager.loadAllEvents();

    this._eventsByUID = mapEventsByUID(loadedEvents);
    this._eventsByDate = mapEventsByDate(loadedEvents);

    // Set date view to current date in "YYYY-MM-DD" format
    this._dateView = new Date().toLocaleDateString("en-CA");
    console.log(this._dateView);
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
    this._eventsByUID.set(event.UID, event);

    const dateKey = event.date;
    if (!this._eventsByDate.has(dateKey)) {
      this._eventsByDate.set(dateKey, []);
    }
    // @ts-ignore - TypeScript thinks this._eventsByDate.get(dateKey) could be undefined,
    // but we just ensured it exists, so go home TypeScript, you're drunk
    this._eventsByDate.get(dateKey).push(event);

    StorageManager.saveEvent(event);
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
    if (!event) {
      throw new Error(`Event with UID ${uid} does not exist.`);
    }

    this._eventsByUID.delete(uid);

    const dateKey = event.date;
    const eventsForDate = this._eventsByDate.get(dateKey);
    if (eventsForDate) {
      // Remove the event with the specified UID from the array of events for that date.
      // If there are no other events remaining for that date,
      // remove the date key from the map entirely
      const updatedEvents = eventsForDate.filter((e) => e.UID !== uid);
      if (updatedEvents.length > 0) {
        this._eventsByDate.set(dateKey, updatedEvents);
      } else {
        this._eventsByDate.delete(dateKey);
      }
    }
    StorageManager.deleteEvent(uid);
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
  }
}

/**
 * Single source of truth for all event data and calendar state in the app.
 *
 * Provides methods to access and manipulate events, calendar view, and date view.
 * Initially loads events and calendar view from localStorage into eventsByUID and eventsByDate maps,
 * and sets date view to current date.
 *
 * When events are added, edited, or deleted, updates the internal maps and saves changes to localStorage.
 * When calendar view is changed, saves the new view to localStorage.
 *
 * allEventsByUID()
 * getEventByUID("uid")
 * allEventsByDate()
 * getEventsByDate("YYYY-MM-DD")
 * addEvent(event)
 * removeEvent("uid")
 * calendarView (getter/setter) "day" | "week" | "month"
 * dateView (getter/setter) "YYYY-MM-DD" string
 */
const appState = new AppState();

export default appState;
