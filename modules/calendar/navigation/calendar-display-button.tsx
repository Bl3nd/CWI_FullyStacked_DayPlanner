import { CalendarViews } from "../../enumCalendarViews";

type CalendarDisplayButtonProps = {
  assignedCalendarView: CalendarViews; // Make sure the calendar view is a valid view based upon CalendarView enum
  isActive: boolean;
  onClick: () => void; // Function to re-render the calendar
};

/**
 * A component that represents a button to change the calendar view.
 * @param assignedCalendarView - The assigned calendar view for the button.
 * @param isActive - Whether the button is active (i.e. the current view of the calendar).
 * @param onClick - Function to call when the button is clicked.
 * @returns void
 */
function CalendarDisplayButton({
  assignedCalendarView,
  isActive,
  onClick,
}: CalendarDisplayButtonProps) {
  // day -> Day; week -> Week; month -> Month;
  const label =
    assignedCalendarView.charAt(0).toUpperCase() +
    assignedCalendarView.slice(1);

  return (
    <button
      type="button"
      className={`btn btn-sm ${isActive ? "btn-primary" : "btn-secondary"}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default CalendarDisplayButton;
