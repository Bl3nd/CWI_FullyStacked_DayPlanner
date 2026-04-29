import CalendarView from "./calendarView";
import appState, { useAppState } from "../../appState";

/**
 * calendarWrapper connects appState with the calendar UI.
 *
 * It uses the useAppState() hook to subscribe to appState changes.
 * Whenever appState changes (view changed, date changed, event added/edited/deleted),
 * React automatically re-renders this component with the latest values.
 */

export default function CalendarWrapper() {
  /**
   * Subscribe to appState changes.
   * snapshot contains: { allEventsByDate, calendarView, dateView }
   *
   * React will automatically re-render this component whenener
   * appState.notifyListeners() is called (on every state change).
   */
  const snapshot = useAppState();

  // Get only the events for the currently viewed day.
  const eventsForViewDate = appState.getEventsByDate(snapshot.dateView);

  // filter out events that are holiday- or allDay- UID Taged events
  const regularEventsForViewDate = eventsForViewDate.filter(
    (event) =>
      !event.UID.startsWith("holiday-") && !event.UID.startsWith("allDay-"),
  );

  // Derive from snapshot, not from appState directly
  const [year, month, day] = snapshot.dateView.split("-").map(Number) as [
    number,
    number,
    number,
  ];
  const viewDate = new Date(year, month - 1, day);

  return (
    <CalendarView
      view={snapshot.calendarView}
      events={regularEventsForViewDate}
      viewDate={viewDate}
    />
  );
}
