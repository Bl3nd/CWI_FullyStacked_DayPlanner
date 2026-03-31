import appState from "../appState";
import { CalendarViews } from "../enumCalendarViews";

type CalendarHeaderDisplayProps = {
  state: { viewDate: Date };
};

/**
 * A component that represents the header date display (e.g. "March 28, 2026").
 * @param state - The state of the calendar.
 * @returns The JSX element
 */
function CalendarHeaderDisplay({ state }: CalendarHeaderDisplayProps) {
  return (
    <span>
      {formatHeaderDate(state.viewDate, appState.calendarView)}
    </span>
  );
}

// Formats the header date based on the viewing date and calendar view
function formatHeaderDate(
  viewingDate: Date,
  calendarView: CalendarViews,
): string {
  let headerDate = "";
  if (calendarView === CalendarViews.Day) {
    // Format the viewing date as a full date for day view
    headerDate = viewingDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } else if (calendarView === CalendarViews.Week) {
    // Format the viewing date as a range of dates for week view
    const end = new Date(viewingDate);
    end.setDate(end.getDate() + 6);
    headerDate = `${viewingDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  } else if (calendarView === CalendarViews.Month) {
    // Format the viewing date as a full month for month view
    headerDate = viewingDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  } else {
    headerDate = viewingDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return headerDate;
}

export { CalendarHeaderDisplay };
