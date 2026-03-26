import CalendarNavButton from "../navigation/calendar-nav-button";

type CalendarNavButtonsGroupProps = {
  state: {
    viewDate: Date;
    calendarView: string;
  };
  onRender: () => void;
};

export default function CalendarNavButtonsGroup({
  state,
  onRender,
}: CalendarNavButtonsGroupProps) {
  return (
    <>
      <CalendarNavButton state={state} direction="subtract" onRender={onRender}>
        <img src="./assets/icons/chevron-left.svg" />
      </CalendarNavButton>
      <CalendarNavButton state={state} onRender={onRender}>
        <img src="./assets/icons/chevron-right.svg" />
      </CalendarNavButton>
    </>
  );
}
