type CalendarDisplayButtonProps = {
  calendarView: string; // Make sure the calendar view is a valid view based upon CalendarView enum
  isActive: boolean;
  onClick: () => void; // Function to re-render the calendar
};

export default function CalendarDisplayButton({
  calendarView,
  isActive,
  onClick,
}: CalendarDisplayButtonProps) {
  // day -> Day; week -> Week; month -> Month;
  const label = calendarView.charAt(0).toUpperCase() + calendarView.slice(1);

  return (
    <button
      type="button"
      className={`displayChangeButton ${isActive ? "highlightDisplayButton" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
