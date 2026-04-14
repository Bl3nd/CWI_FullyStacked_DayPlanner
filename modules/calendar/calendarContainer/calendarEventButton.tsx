import CalendarEvent from "../../classCalendarEvent";
import * as Calendar from "../calendar";
import { showClickedEventPopup } from "../dailyCalendar";

type Props = {
	event: CalendarEvent;
	index: number;
	totalLanes: number;
	laneIndex: number;
};

export default function CalendarEventButton({
	event,
	index,
	totalLanes,
	laneIndex,
}: Props) {
	// Button calculations
	const startTimeMinutes = Calendar.timeStringToMinutes(event.timeStart);
	const endTimeMinutes = Calendar.timeStringToMinutes(event.timeEnd);
	const duration = endTimeMinutes - startTimeMinutes;
	const topPosition = startTimeMinutes * Calendar.PIXELS_PER_MINUTE;
	const durationHeight = duration * Calendar.PIXELS_PER_MINUTE;
	const maxHeight = Math.max(18, durationHeight);
	const isShort = durationHeight <= 44;

	// Lane calculations
	const width = 100 / totalLanes;
	const leftPosition =  width * laneIndex;

	const formattedTimeString = `${Calendar.formatTime(event.timeStart)} - ${Calendar.formatTime(event.timeEnd)}`;

	return (
		<button
			className={
				isShort
					? "calendarEventContainer calendarEventContainer--compact"
					: "calendarEventContainer"
			}
			style={{
				["--event-color" as any]: event.color ?? "#1a73e8",
				top: `${topPosition}px`,
				height: `${maxHeight}px`,
				left: 
					totalLanes <= 1 
					? "0"
					: `calc(${leftPosition}% + ${laneIndex * 2}px)`,
				width: totalLanes <= 1 ? "100%" : `calc(${width}% - 2px)`,
			}}
			onClick={(e) => {
				e.stopPropagation();  // Stops popup from instantly closing
				showClickedEventPopup(event);
			}}
		>
			{isShort ? (
				<span className="calendarEventHeader">
					<span className="calendarEventTime">{formattedTimeString}</span>
					<span className="calendarEventTitle">{event.title}</span>
				</span>
			) : (
				<>
					<span className="calendarEventTime">{formattedTimeString}</span>
					<span className="calendarEventTitle">{event.title}</span>
					<span className="calendarEventDescription">{event.description}</span>
				</>
			)}
		</button>
	);
}