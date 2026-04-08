import { CalendarViews } from "../enumCalendarViews";
import { useAppStateStore } from "../appState";

import appState from "../appState";
import appSettings from "../settings";

/**
 * A component that represents the header date display (e.g. "March 28, 2026").
 * @returns The JSX element
 */
function CalendarHeaderDisplay() {
  const appState = useAppStateStore();
  return <span>{formatHeaderDate(appState.calendarView)}</span>;
}

// Formats the header date based on the viewing date and calendar view
function formatHeaderDate(calendarView: CalendarViews): string {
  const date = appState.dateViewObject;
  switch (calendarView) {
    case "day":
      return formatSingleDay(date);
    case "week":
      return formatWeekRange(date);
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

// "Apr 5 - Apr 11, 2026" if first day of week is set to Sunday
// "Apr 6 - Apr 12, 2026" if first day of week is set to Monday
function formatWeekRange(date: Date) {
  const firstDayIndex = appSettings.firstDayOfWeek === "Monday" ? 1 : 0;
  const dayOfWeek = date.getDay();

  const daysFromStart = (dayOfWeek - firstDayIndex + 7) % 7;

  const startDate = new Date(date);
  startDate.setDate(date.getDate() - daysFromStart);

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

export { CalendarHeaderDisplay };
