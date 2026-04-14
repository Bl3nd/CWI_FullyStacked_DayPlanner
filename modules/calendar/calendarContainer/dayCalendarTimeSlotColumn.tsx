import * as Calendar from "../calendar";

type Props = {
	slots: number[],
	currentMinutesFromMidnight: number | null,
	slotDuration: number,
	slotHeight: number,
};

/**
 * Renders the left column of the day view.
 * Shows one row per time slot with a formatted time label (e.g. "9:00AM").
 * The slot that contains the current time gets data-active="true"
 * so DayView can scroll it into view.
 */

export default function DayCalendarTimeSlotColumn({
	slots,
	currentMinutesFromMidnight,
	slotDuration,
	slotHeight
}: Props) {
	return (
		<div id="calendarTimeLabelsColumn" className="calendarTimeLabelsColumn">
			{slots.map((slotStart) => {
				const slotEnd = slotStart + slotDuration;

				// Mark the slot active if the current time falls inside it
				const isActiveSlot = 
					currentMinutesFromMidnight != null &&
					currentMinutesFromMidnight >= slotStart &&
					currentMinutesFromMidnight < slotEnd;

					return (
						<div 
							key={slotStart}
							className="calendarTimeSlotRow"
							style={{ height: `${slotHeight}px`}}
							data-active={isActiveSlot ? "true" : "false"}
						>
							<span className="calendarTimeLabel">
								{Calendar.formatSlotTime(slotStart)}
							</span>
						</div>
					);
			})}
		</div>
	);
}