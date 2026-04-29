import { useAppSettings } from "../../appSettings";
import appState from "../../appState";
import {
  assignLanesForEvents,
  calculateTotalConcurrentEvents,
  showClickedEventPopup,
} from "../dailyCalendar";
import { isToday, timeStringToMinutes } from "../calendar";
import { CalendarViews } from "../../enumCalendarViews";
import { getWeekRangeStartDate } from "../calendar-header-display";

// Helper type definitions for the events to make sure the types are consistent with what is expected.
type TimedEvent = {
  UID: string;
  timeStart: string;
  timeEnd: string;
  title: string;
  color?: string;
};

type PositionedEvent = {
  event: TimedEvent;
  top: number;
  height: number;
  laneIndex: number;
  totalLanes: number;
};

// Helper function
function getPositionedEvents(dayEvents: TimedEvent[]): PositionedEvent[] {
  const minimumEventHeight = 18;
  const lanesByEventUID = assignLanesForEvents(dayEvents) as Map<
    string,
    number
  >;

  return dayEvents.map((event) => {
    const start = timeStringToMinutes(event.timeStart);
    const end = timeStringToMinutes(event.timeEnd);
    const laneIndex = lanesByEventUID.get(event.UID) ?? 0;
    const totalLanes = calculateTotalConcurrentEvents(event, dayEvents);

    return {
      event,
      top: start,
      height: Math.max(minimumEventHeight, end - start),
      laneIndex,
      totalLanes,
    };
  });
}

// Displays the days of the week and the date (DD format) in the header of the week view.
function WeekDayHeader({ columnDate, day }: { columnDate: Date; day: string }) {
  const isCurrentDay = isToday(columnDate);

  return (
    <div
      className={`d-flex flex-column text-center position-sticky top-0 z-1 bg-body border-bottom border-secondary border-opacity-50 pt-1 ${isCurrentDay ? "bg-primary text-white" : ""}`}
      role="button"
      onClick={() => {
        appState.dateView = columnDate.toLocaleDateString("en-CA");
        appState.calendarView = CalendarViews.Day;
      }}
    >
      <h6 className="text-uppercase">{day}</h6>
      <span>{columnDate.getDate()}</span>
    </div>
  );
}

// Displays the events for the given day in the week view.
function WeekEventsDisplay({ daysDate }: { daysDate: string }) {
  const { displayHolidays } = useAppSettings();
  // Filter out holidays if the displayHolidays setting is false.
  const events = appState
    .getEventsByDate(daysDate)
    .filter((event) =>
      displayHolidays
        ? true
        : !event.UID.startsWith("allDay-") && !event.UID.startsWith("holiday-"),
    );

  return (
    <div className="position-relative" style={{ height: "1440px" }}>
      {/* Render the 24 hour grid lines */}
      {Array.from({ length: 24 }).map((_, hour) => (
        <div
          key={hour}
          style={{ height: "60px" }}
          className="border-bottom border-secondary border-opacity-10"
        />
      ))}

      {/* Render the events for the given day */}
      {getPositionedEvents(events).map(
        ({ event, top, height, laneIndex, totalLanes }) => {
          const widthPercent = 100 / totalLanes;
          const leftPercent = widthPercent * laneIndex;

          return (
            <button
              key={event.UID}
              className="btn btn-sm position-absolute overflow-hidden d-flex align-items-start justify-content-start px-1 py-0 bg-secondary-subtle text-start"
              style={{
                top: `${top}px`,
                height: `${height}px`,
                left: totalLanes <= 1 ? "2px" : `calc(${leftPercent}%`, // left padding of 2px or a certain percentage of the width of the event
                width:
                  totalLanes <= 1
                    ? "calc(100% - 4px)"
                    : `calc(${widthPercent}% - 2px)`,
                borderColor: event.color ? `${event.color}CC` : "#1a73e8CC", // CC = 80% opacity
                fontSize: "0.625rem",
              }}
              onClick={(e) => {
                e.stopPropagation();
                showClickedEventPopup(event);
              }}
            >
              <span title={event.title} className="small w-100 fw-medium">
                {event.title}
              </span>
            </button>
          );
        },
      )}
    </div>
  );
}

// Weekly calendar container component that displays the whole week of events in a column layout.
const WeekView = () => {
  const { firstDayOfWeek } = useAppSettings();
  const dateViewObject = appState.dateViewObject;
  const weekStart = getWeekRangeStartDate(dateViewObject, firstDayOfWeek);
  const dayLabels =
    firstDayOfWeek === "Monday"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="h-100 overflow-auto">
      <div
        className="d-grid h-100"
        style={{
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          columnGap: "0.00625rem",
        }}
      >
        {dayLabels.map((day, index) => {
          const columnDate = new Date(weekStart);
          columnDate.setDate(weekStart.getDate() + index);
          const daysDate = columnDate.toLocaleDateString("en-CA");

          return (
            <div
              key={daysDate}
              className="min-w-0 h-100 border border-secondary border-opacity-25 rounded-1"
            >
              <WeekDayHeader columnDate={columnDate} day={day} />
              <WeekEventsDisplay daysDate={daysDate} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
