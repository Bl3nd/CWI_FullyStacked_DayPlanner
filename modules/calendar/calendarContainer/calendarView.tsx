import CalendarEvent from "../../classCalendarEvent";
import { CalendarViews } from "../../enumCalendarViews";
import WeekView from "./weekView";
import DayView from "./dayView";
import MonthView from "./monthView";

type Props = {
  view: CalendarViews;
  events: CalendarEvent[];
  viewDate: Date;
};

// Decides which calendar content to show; Day | Week | Month
export default function CalendarView({ view, events, viewDate }: Props) {
  if (view === CalendarViews.Day) {
    return <DayView events={events} viewDate={viewDate} />;
  }

  if (view === CalendarViews.Week) {
    return <WeekView />;
  }

  if (view === CalendarViews.Month) {
    return <MonthView />;
  }

  return null;
}
