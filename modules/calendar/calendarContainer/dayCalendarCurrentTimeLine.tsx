import * as Calendar from "../calendar";

type Props = {
	currentMinutesFromMidnight: number | null;
};

// Renders the horizontal "now" line that shows the current time position on the day grid.
export default function DayCalendarCurrentTimeLine({
	currentMinutesFromMidnight,
}: Props) {
	const isVisible = currentMinutesFromMidnight !== null;

	return (
		<div
			id="calendarCurrentTimeLineContainer"
			className="calendarNowLine"
			aria-hidden="true"
			style={{
				visibility: isVisible ? "visible" : "hidden",
				top: isVisible
				? `${currentMinutesFromMidnight * Calendar.PIXELS_PER_MINUTE}px`
				: undefined,
			}}
		/>
	);
}