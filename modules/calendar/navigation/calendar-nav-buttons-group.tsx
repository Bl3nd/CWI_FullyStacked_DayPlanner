import { showEventManager } from "../../eventManager";
import { useNavigateWithArrows } from "../../hooks/use-navigate-with-arrows";
import CalendarNavButton from "../navigation/calendar-nav-button";

type CalendarNavButtonsGroupProps = {
  onAfterNavigate: () => void;
  
};

/**
 * A component that represents a group of buttons to navigate the calendar by one day, week, or month.
 * @param onAfterNavigate - Function to call after a navigation button is clicked.
 * @returns The JSX element
 */
function CalendarNavButtonsGroup({
  onAfterNavigate,
}: CalendarNavButtonsGroupProps) {
  // Use the custom hook to navigate the calendar with the arrows.
  useNavigateWithArrows(() => onAfterNavigate());

  return (
    <>
      {/* Go to previous day/week/month */}
      <CalendarNavButton
        directionType="previous"
        onAfterNavigate={onAfterNavigate}
      >
        <img src="./assets/icons/chevron-left.svg" />
      </CalendarNavButton>
      <button
        id="addEventButton"
        className="btn btn-sm btn-primary d-flex justify-content-center align-items-center"
        onClick={() => showEventManager()}
      >
        <img src="./assets/icons/plus.svg" />
      </button>
      {/* Go to next day/week/month */}
      <CalendarNavButton directionType="next" onAfterNavigate={onAfterNavigate}>
        <img src="./assets/icons/chevron-right.svg" />
      </CalendarNavButton>
    </>
  );
}

export default CalendarNavButtonsGroup;
