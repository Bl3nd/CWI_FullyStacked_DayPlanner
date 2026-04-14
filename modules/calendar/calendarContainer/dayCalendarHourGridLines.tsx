import * as Calendar from '../calendar';

type Props = {
	slots: number[];
	slotHeight: number;
};

// Renders the horizontal background lines that divide the day grid into time slots
export default function DayCalendarHourGridLines({
	slots,
	slotHeight,
}: Props) {
	return (
		<div
			id="calendarHourGridLinesContainer"
			className="calendarHourGridLines"
			style={{ height: `${Calendar.DAY_TOTAL_HEIGHT}px`}}
		>
			{slots.map((slotStart) => (
				<div
					key={slotStart}
					className="calendarHourGridLine"
					style={{ height: `${slotHeight}px`}}
					aria-hidden="true"
				/>
			))}
		</div>
	);
}