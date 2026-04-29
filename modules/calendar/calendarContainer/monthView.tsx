import { useAppSettings } from "../../appSettings";
import appState, { useAppState } from "../../appState";
import { CalendarViews } from "../../enumCalendarViews";
import "../../../styling/monthView.css";
import CalendarEvent from "../../classCalendarEvent";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

// ─── Helpers ───

function getOrderedDayNames(weekStartsOn: 0 | 1): readonly string[] {
  return weekStartsOn === 1 ? [...DAY_NAMES.slice(1), DAY_NAMES[0]] : DAY_NAMES;
}

/**
 * Returns 42 days for a 6-row calendar grid, padding the first and last weeks with
 * days from the previous and following month
 */
function getCalendarGridDays(
  year: number, // Year passed in to account for leap years
  month: number, // 1-based (Jan = 1), from "YYYY-MM-DD"
  weekStartsOn: 0 | 1 = 0, // 0 = Sunday, 1 = Monday
): CalendarDay[] {
  const zeroBasedMonth = month - 1;
  const firstOfMonth = new Date(year, zeroBasedMonth, 1);
  const offset = (firstOfMonth.getDay() - weekStartsOn + 7) % 7;
  const gridStart = new Date(year, zeroBasedMonth, 1 - offset);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    return {
      date,
      isCurrentMonth: date.getMonth() === zeroBasedMonth,
      isToday: date.toDateString() === new Date().toDateString(),
    };
  });
}

// Make sure all day events and holidays are displayed first in day cells
function getEventOrder(event: CalendarEvent): number {
  if (event.UID.startsWith("holiday")) return 0;
  if (event.UID.startsWith("allDay")) return 1;
  return 2;
}

// Filter out holidays of appSettings isn't showing them then sort the array
function getSortedEvents(
  allEventsByDate: Map<string, CalendarEvent[]>,
  dateKey: string,
  displayHolidays: boolean,
): CalendarEvent[] {
  return (allEventsByDate.get(dateKey) ?? [])
    .filter((e) => displayHolidays || !e.UID.startsWith("holiday"))
    .sort((a, b) => getEventOrder(a) - getEventOrder(b));
}

// For when day cell is clicked, switch to day view and date of day selected
function switchToDayView(dateString: string) {
  appState.switchToDay(dateString);
}

// ─── React Components ───

// Days of the week displayed at the top of each column in the month grid
function DayNameHeader({ names }: { names: readonly string[] }) {
  return (
    <>
      {names.map((name) => (
        <div key={name} className="dayNameCell">
          {name}
        </div>
      ))}
    </>
  );
}

// Small, color-coded event elements that just show the title
function EventChip({ event }: { event: CalendarEvent }) {
  const isHoliday = event.UID.startsWith("holiday");
  return (
    <div
      key={event.UID}
      className={`dayCellEvent ${isHoliday ? "dayCellEventHoliday" : ""}`}
      style={{ backgroundColor: event.color }}
      title={event.title}
    >
      {event.title}
    </div>
  );
}

// Individual day containers, tagged with isCurrentMonth and isToday for styling emphasis
interface DayCellProps {
  day: CalendarDay;
  events: CalendarEvent[];
}

function DayCell({
  day: { date, isCurrentMonth, isToday },
  events,
}: DayCellProps) {
  const dateKey = date.toLocaleDateString("en-CA");
  const classNames = [
    "dayCell",
    isCurrentMonth && "currentMonthDayCell",
    isToday && "todayCell",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} onClick={() => switchToDayView(dateKey)}>
      <span className="dayCellNumber">{date.getDate()}</span>
      {events.map((event) => (
        <EventChip key={event.UID} event={event} />
      ))}
    </div>
  );
}

export default function MonthView() {
  const { allEventsByDate, dateView } = useAppState();
  const { firstDayOfWeek, displayHolidays } = useAppSettings();

  const weekStartsOn: 0 | 1 = firstDayOfWeek === "Sunday" ? 0 : 1;
  const [year, month] = dateView.split("-").map(Number) as [
    number,
    number,
    number,
  ];

  const dayNames = getOrderedDayNames(weekStartsOn);
  const days = getCalendarGridDays(year, month, weekStartsOn);

  return (
    <div className="monthGrid">
      {/* Names of days across top of grid */}
      <DayNameHeader names={dayNames} />
      {/* Fill all 6 week rows with appropriate days */}
      {days.map((day) => (
        <DayCell
          key={day.date.toISOString()}
          day={day}
          events={getSortedEvents(
            allEventsByDate,
            day.date.toLocaleDateString("en-CA"),
            displayHolidays,
          )}
        />
      ))}
    </div>
  );
}
