import DayCalendarHourGridLines from './dayCalendarHourGridLines';
import DayCalendarCurrentTimeLine from './dayCalendarCurrentTimeLine';
import DayCalendarEventsLayer from './dayCalendarEventsLayer';
import CalendarEvent from '../../classCalendarEvent';

type Props = {
	events: CalendarEvent[];
	slots: number[];
	slotHeight: number;
	currentMinutesFromMidnight: number | null;
};

export default function DayCalendarGridColumn({
	events,
	slots,
	slotHeight,
	currentMinutesFromMidnight,
}: Props) {
	return (
		<div id="calendarDayGridColumn" className="calendarDayGridColumn">
			<DayCalendarHourGridLines slots={slots} slotHeight={slotHeight} />
			<DayCalendarCurrentTimeLine
				currentMinutesFromMidnight={currentMinutesFromMidnight}
			/>
			<DayCalendarEventsLayer events={events} />
		</div>
	);
}