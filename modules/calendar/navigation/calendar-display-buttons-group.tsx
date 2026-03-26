import CalendarDisplayButton from "../navigation/calendar-display-button";
import { CalendarView } from "../calendar";

type CalendarDisplayButtonsGroupProps = {
  activeView: "day" | "week" | "month" | string;
  onSelectView: (view: string) => void;
};

export default function CalendarDisplayButtonsGroup({
  activeView,
  onSelectView,
}: CalendarDisplayButtonsGroupProps) {
  return (
    <>
      <CalendarDisplayButton
        calendarView={CalendarView.DAY}
        isActive={activeView === CalendarView.DAY}
        onClick={() => onSelectView(CalendarView.DAY)}
      />
      <CalendarDisplayButton
        calendarView={CalendarView.WEEK}
        isActive={activeView === CalendarView.WEEK}
        onClick={() => onSelectView(CalendarView.WEEK)}
      />
      <CalendarDisplayButton
        calendarView={CalendarView.MONTH}
        isActive={activeView === CalendarView.MONTH}
        onClick={() => onSelectView(CalendarView.MONTH)}
      />
    </>
  );
}
