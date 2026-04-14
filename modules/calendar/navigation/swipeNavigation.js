import { applyCalendarNavigation } from "../../hooks/use-calendar-nav-button";

export default function enableSwipeNavigation() {
  const calendarContainer = document.getElementById("calendarContainer");
  if (calendarContainer) {
    calendarContainer.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    calendarContainer.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });
    calendarContainer.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });
  }
}

let xDown = null;
let yDown = null;

// Capture where the user first touches the screen
function handleTouchStart(event) {
  const firstTouch = event.touches[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

/*
  After capturing the location of an initial touch,
  track the movement of the finger across the screen 
  and determine if the user is swiping left or right
  based on the distance and direction of the movement
 */
function handleTouchMove(event) {
  if (!xDown || !yDown) {
    return;
  }

  const xUp = event.touches[0].clientX;
  const yUp = event.touches[0].clientY;

  const xDiff = xDown - xUp;
  const yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 75) {
      // Swipe right
      applyCalendarNavigation(1);
      xDown = null;
      yDown = null;
    } else if (xDiff < -75) {
      // Swipe left
      applyCalendarNavigation(-1);
      xDown = null;
      yDown = null;
    }
  }
}

// Reset values when finger lifts off the screen
function handleTouchEnd() {
  xDown = null;
  yDown = null;
}
