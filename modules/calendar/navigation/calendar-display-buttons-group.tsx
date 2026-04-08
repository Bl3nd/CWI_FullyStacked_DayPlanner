import CalendarDisplayButton from "../navigation/calendar-display-button";
import { CalendarViews } from "../../enumCalendarViews";

type CalendarDisplayButtonsGroupProps = {
  activeView: CalendarViews;
  // A function to call when a button is clicked. The parent gets to decide what to do within this function.
  onSelectView: (view: CalendarViews) => void;
  // A Function for when todayButton is clicked.
  onSelectToday: () => void;
};

/**
 * A component that represents a group of buttons to change the calendar view.
 * @param activeView - The current view of the calendar.
 * @param onSelectView - Function to call when a button is clicked.
 * @returns The JSX element
 */
function CalendarDisplayButtonsGroup({
  activeView,
  onSelectView,
  onSelectToday,
}: CalendarDisplayButtonsGroupProps) {
  return (
    <>
      {/* Day view button */}
      <CalendarDisplayButton
        assignedCalendarView={CalendarViews.Day}
        isActive={activeView === CalendarViews.Day}
        onClick={() => onSelectView(CalendarViews.Day)}
      />
      {/* Week view button */}
      <CalendarDisplayButton
        assignedCalendarView={CalendarViews.Week}
        isActive={activeView === CalendarViews.Week}
        onClick={() => onSelectView(CalendarViews.Week)}
      />
      {/* Month view button */}
      <CalendarDisplayButton
        assignedCalendarView={CalendarViews.Month}
        isActive={activeView === CalendarViews.Month}
        onClick={() => onSelectView(CalendarViews.Month)}
      />
      {/*Today Button.  Forces dayView and current Day
      I added a new button instead of making large alterations to calendar-display-button.tsx so as not to step on cody's code.*/}
      <button
        type="button"
        className="btn btn-sm btn-secondary"
        onClick={onSelectToday}
      >
        Today
      </button>
    </>
  );
}

export default CalendarDisplayButtonsGroup;
