import CalendarEvent from "../../classCalendarEvent";
import { CalendarViews } from "../../enumCalendarViews";
import DayView from "./dayView";

type Props = {
	view: CalendarViews;
	events: CalendarEvent[];
	viewDate: Date;
};

// Decides which calendar content to show; Day | Week | Month
export default function CalendarView({
	view,
	events,
	viewDate,
}: Props) {
	if (view === CalendarViews.Day) {
		return (
			<DayView 
				events={events}
				viewDate={viewDate}
			/>
		);
	}

	if (view === CalendarViews.Week) {
		return (
			<div id="calendarWeekContentWrapper" className="calendarWeekContent" />
		);
	}

	if (view === CalendarViews.Month) {
		return (
			<div id="calendarMonthContentWrapper" className="calendarMonthContent" />
		);
	}

	return null;
}