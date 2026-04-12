import CalendarView from "./calendarView"
import appState, { useAppState } from "../../appState";

/**
 * calendarWrapper connects appState with the calendar UI.
 * 
 * It uses the useAppState() hook to subscribe to appState changes.
 * Whenever appState changes (view changed, date changed, event added/edited/deleted),
 * React automatically re-renders this component with the latest values.
 */

export default function calendarWrapper() {
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

	return (
		<CalendarView 
			view={snapshot.calendarView}
			events={eventsForViewDate}
			viewDate={appState.dateViewObject} 
		/>
	);
}