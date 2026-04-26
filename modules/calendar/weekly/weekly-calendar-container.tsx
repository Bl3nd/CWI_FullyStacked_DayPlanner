import { useAppSettings } from "../../appSettings";
import appState, { useAppState } from "../../appState";
import CalendarEventButton from "../calendarContainer/calendarEventButton";
import {
  assignLanesForEvents,
  calculateTotalConcurrentEvents,
} from "../dailyCalendar";
import { getWeekRangeStartDate } from "../calendar-header-display";
import { isToday } from "../calendar";
import { CalendarViews } from "../../enumCalendarViews";

// Weekly calendar container component that displays the whole week of events in a column layout.
const WeeklyCalendarContainer = () => {
  const { firstDayOfWeek } = useAppSettings();
  const dateViewObject = appState.dateViewObject;
  const weekStart = getWeekRangeStartDate(dateViewObject, firstDayOfWeek);
  const dayLabels =
    firstDayOfWeek === "Monday"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={{ height: "1440px" }}>
      <div className="weeklyCalendarGrid h-100">
        {dayLabels.map((day, index) => {
          // Retrieve the date for the current day of the week and check if it is today
          const columnDate = new Date(weekStart);
          columnDate.setDate(weekStart.getDate() + index);
          const daysDate = columnDate.toLocaleDateString("en-CA");
          const isCurrentDay = isToday(columnDate);
          return (
            <div
              key={daysDate}
              className={`weeklyCalendarDayColumn d-flex flex-column ${isCurrentDay ? " weeklyCalendarDayColumn--today" : ""}`}
            >
              <WeeklyCalendarDayColumnHeader
                day={day}
                columnDate={columnDate}
                isCurrentDay={isCurrentDay}
              />
              <WeeklyCalendarDayColumn daysDate={daysDate} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Header for each day of the week. Clickable to switch to day view for the selected day.
const WeeklyCalendarDayColumnHeader = ({
  day,
  columnDate,
  isCurrentDay,
}: {
  day: string;
  columnDate: Date;
  isCurrentDay: boolean;
}) => {
  const dayOfMonth = columnDate.getDate();
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center gap-1 position-sticky top-0 z-1 weeklyCalendarDayColumnHeader${isCurrentDay ? " weeklyCalendarDayColumnHeader--today" : " bg-body"}`}
      role="button"
      onClick={() => {
        appState.dateView = columnDate.toLocaleDateString("en-CA");
        appState.calendarView = CalendarViews.Day;
        // BUG: This is not re-rendering the calendar view buttons.
      }}
    >
      <span className="fs-6">{day}</span>
      <span className="">{dayOfMonth}</span>
    </div>
  );
};

// Column for each day of the week. Displays the events for the day in the same lane layout as the day calendar but with a max of 2 concurrent events.
const WeeklyCalendarDayColumn = ({ daysDate }: { daysDate: string }) => {
  const { allEventsByDate } = useAppState();
  const dayEvents = allEventsByDate.get(daysDate) ?? [];
  const assignedLanes = assignLanesForEvents(dayEvents);

  return (
    <div className="p-2">
      <div className="flex-grow-1 d-flex flex-column">
        {dayEvents.map((event, index) => {
          // Button logic (similar to the calculations used for the day calendar)
          const laneIndex = assignedLanes.get(event.UID) ?? 0;
          let totalLanes = Math.min(
            calculateTotalConcurrentEvents(event, dayEvents),
            2,
          );

          // If the assigned lane is greater than or equal to the total lanes (min of 2 concurrent events), show nothing
          if (laneIndex >= totalLanes) {
            return null;
          }

          const isRightmostLane =
            totalLanes > 1 && laneIndex === totalLanes - 1;
          const hasSameStartSibling = dayEvents.some(
            (e) => e.UID !== event.UID && e.timeStart === event.timeStart,
          );

          // If the lane is the rightmost lane and there are no other events with the same start time, show nothing
          // - this is an edge case where the assigned lane is the 3rd lane but we only want to show a max of two concurrent events
          if (isRightmostLane && !hasSameStartSibling) {
            return null;
          }

          return (
            <div key={event.UID} className="position-relative">
              <CalendarEventButton
                event={event}
                index={index}
                totalLanes={totalLanes}
                laneIndex={laneIndex}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyCalendarContainer;
