// Lets you do a long press anywhere on the day calandar
// and it automatically fills out time

import { showEventManager } from "../../eventManager";

let selectedTime: { startTime: string; endTime: string } | null = null;

let pressTimer: ReturnType<typeof setTimeout> | null = null;

const LONG_PRESS_DURATION = 500; // Time in milliseconds
const DEFAULT_EVENT_DURATION = 60; // Time in minutes

function formatTime(totalMinutes: number): string {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const mins = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${mins}`;
}

// My laptop for some reason is not recognizing "mouse" and recognizes "pen".
// It's not even a touch screen.
// I left all of them in for other devices.
function isValidInput(event: React.PointerEvent<HTMLDivElement>): boolean {
  const { pointerType, button } = event;

  switch (pointerType) {
    case "touch": 
      return true; // Mobile tap

    case "mouse":
      return button === 0; // Mouse button, 0 for only left clicks

    case "pen":
      return button === 0; // Pen tap, 0 for only left clicks

    default:
      // Unknown pointer type
      return false;
  }
}

function calcTime(
  dayGridColumn: HTMLDivElement,
  yPosition: number,
) {
  const elementRectangle = dayGridColumn.getBoundingClientRect();
  const y = yPosition - elementRectangle.top;

  const minutes = Math.floor((y / elementRectangle.height) * 1440); // 1440 minutes in a day

  // Changes starting interval when clicking on calandar, value in minutes,
  // Example at 60 starting times are 1:00am, 2:00am, 3:00am ect.
  // Example at 30 starting times are 1:00am, 1:30am, 2:00am ect.
  // both numbers in formula should match if changed
  const startMinutes = Math.floor(minutes / 60) * 60;

  // "% 1440" makes times close to midnight loop back to start Ex: (11pm to 12am)
  // Calandar currently does not support events going into multiple days Ex:(11pm to 12am)
  // Replace current formula and if/else statement and replace with comment below if support gets added
  // const endMinutes = (startMinutes + DEFAULT_EVENT_DURATION) % 1440;
  const initialEndMinutes = startMinutes + DEFAULT_EVENT_DURATION;
  let endMinutes: number;

  // Caps time at 11:45pm
  if (initialEndMinutes >= 1440) {
    endMinutes = 1425;    
  } else {
    endMinutes = initialEndMinutes;
  }

  selectedTime = {
    startTime: formatTime(startMinutes),
    endTime: formatTime(endMinutes),
  };

  showEventManager();
}

// Long Press
export function handleLongPress(
  event: React.PointerEvent<HTMLDivElement>,
): void {
  if (!isValidInput(event)) return;

  if (pressTimer) clearTimeout(pressTimer);

  const dayGridColumn = event.currentTarget;
  const clientY = event.clientY;

  pressTimer = setTimeout(() => {
    calcTime(dayGridColumn, clientY);
  }, LONG_PRESS_DURATION);
}

// Cancels long press if long press is too short or interrupted 
export function endLongPress(): void {
  if (pressTimer) {
    clearTimeout(pressTimer);
    pressTimer = null;
  }
}

export function getTimeSlot(): { startTime: string; endTime: string } | null {
  return selectedTime;
}

// Prevents the add event button from autofilling with previous data
export function clearTimeSlot(): void {
  selectedTime = null;
}