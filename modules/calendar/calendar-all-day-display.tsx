import appState, { useAppState } from "../appState";
import { useAppSettings } from "../appSettings";
import { CalendarViews } from "../enumCalendarViews";

function CalendarAllDayDisplay() {
  /*Tie into useAppState and useAppSettings so the component can re-render
  when the view date or holiday display setting are changed*/

  const { dateView, calendarView } = useAppState();
  const { displayHolidays } = useAppSettings();

  //only show all-day display in dayView.
  if (calendarView !== CalendarViews.Day) {
    return null;
  }

  const eventsForViewDate = appState.getEventsByDate(dateView);

  let allDayEvents = [];

  if (!displayHolidays) {
    allDayEvents = eventsForViewDate.filter((event) =>
      event.UID.startsWith("allDay-"),
    );
  } else {
    allDayEvents = eventsForViewDate.filter(
      (event) =>
        event.UID.startsWith("allDay-") || event.UID.startsWith("holiday-"),
    );
  }

  // Do not render the display if there aren't any events to display.
  if (allDayEvents.length === 0) {
    return null;
  }

  //this slice should keep it small and we can add nav later to move through more then 2.
  //currently no day has more then one holiday.  Add testing for multiple events on wednesday. ***
  const visibleItems = allDayEvents.slice(0, 2);

  return (
    <div className="w-100 px-1 py-1">
      <div className="d-flex flex-column gap-2 w-100">
        {visibleItems.map((event) => (
          <div
            key={event.UID}
            className="allDayDisplay px-2 py-1 border rounded text-center fw-bold"
          >
            {event.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export { CalendarAllDayDisplay };
