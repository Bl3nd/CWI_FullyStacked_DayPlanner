import { CalendarViews } from "../enumCalendarViews";
import appState, { useAppState } from "../appState";
import { useAppSettings } from "../appSettings";

/**
 * A component that represents the header date display (e.g. "March 28, 2026").
 * @returns The JSX element
 */
function CalendarHeaderDisplay() {
  const { calendarView } = useAppState();
  const { firstDayOfWeek } = useAppSettings();
  return (
    <span className="fs-5 fw-bold">
      {formatHeaderDate(calendarView, firstDayOfWeek, appState.dateViewObject)}
    </span>
  );
}

// Formats the header date based on the viewing date and calendar view
function formatHeaderDate(
  calendarView: CalendarViews,
  firstDayOfWeek: string,
  date: Date,
): string {
  switch (calendarView) {
    case "day":
      return formatSingleDay(date);
    case "week":
      return formatWeekRange(date, firstDayOfWeek);
    case "month":
      return formatMonth(date);
    default:
      throw new Error(`Unsupported calendar view: ${calendarView}`);
  }
}

// "Apr 5, 2026"
function formatSingleDay(date: Date) {
  return date.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** First day shown in week view: Sunday by default, or Monday when that setting is on. */
export function getWeekRangeStartDate(date: Date, firstDayOfWeek: string) {
  const firstDayIndex = firstDayOfWeek === "Monday" ? 1 : 0;
  const dayOfWeek = date.getDay();
  const daysFromStart = (dayOfWeek - firstDayIndex + 7) % 7;
  const startDate = new Date(date.getTime());
  startDate.setDate(date.getDate() - daysFromStart);
  return startDate;
}

// "Apr 5 - Apr 11, 2026" if first day of week is set to Sunday
// "Apr 6 - Apr 12, 2026" if first day of week is set to Monday
function formatWeekRange(date: Date, firstDayOfWeek: string) {
  const startDate = getWeekRangeStartDate(date, firstDayOfWeek);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const startString = startDate.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
  });
  const endString = endDate.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${startString} - ${endString}`;
}

// "April 2026"
function formatMonth(date: Date) {
  return date.toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
  });
}

export {
  CalendarHeaderDisplay,
  formatHeaderDate,
  formatSingleDay,
  formatWeekRange,
  formatMonth,
};
