import CalendarDisplayButton from "../navigation/calendar-display-button";
import { CalendarViews } from "../../enumCalendarViews";
import appState, { useAppState } from "../../appState";
/**
 * A component that represents a group of buttons to change the calendar view.
 * @param activeView - The current view of the calendar.
 * @param onSelectView - Function to call when a button is clicked.
 * @returns The JSX element
 */
function CalendarDisplayButtonsGroup() {
  const snapShot = useAppState();
  return (
    <>
      {/* Day view button */}
      <CalendarDisplayButton
        assignedCalendarView={CalendarViews.Day}
        isActive={snapShot.calendarView === CalendarViews.Day}
        onClick={() => (appState.calendarView = CalendarViews.Day)}
      />
      {/* Week view button */}
      <CalendarDisplayButton
        assignedCalendarView={CalendarViews.Week}
        isActive={snapShot.calendarView === CalendarViews.Week}
        onClick={() => (appState.calendarView = CalendarViews.Week)}
      />
      {/* Month view button */}
      <CalendarDisplayButton
        assignedCalendarView={CalendarViews.Month}
        isActive={snapShot.calendarView === CalendarViews.Month}
        onClick={() => (appState.calendarView = CalendarViews.Month)}
      />
      {/*Today Button.  Forces dayView and current Day
      I added a new button instead of making large alterations to calendar-display-button.tsx so as not to step on cody's code.*/}
      <button
        type="button"
        className="btn btn-sm btn-secondary"
        onClick={() => {
          appState.calendarView = CalendarViews.Day;
          appState.dateView = new Date().toLocaleDateString("en-CA");
        }}
      >
        Today
      </button>
    </>
  );
}

export default CalendarDisplayButtonsGroup;
