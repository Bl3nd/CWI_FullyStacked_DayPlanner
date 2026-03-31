// C-7-Today: Button resets the date view to current date and updates header. passes events loaded from main.js via StorageManager.loadAllEvents().
import { renderCalendarView } from "./calendar/calendar";
import StorageManager from "./dataStorage";

export default function initTodayButton() {
  //appState sets default: day view centered on 'today' (per D-1-Current)
  const appState = {
    currentView: "day",
    anchorDate: new Date(),
  };

  //change header text to match anchorDate data.
  function changeHeaderDate() {
    const headerDateContainer = document.getElementById("headerDateContainer");
    //error guardrail
    if (!headerDateContainer) {
      console.error('Could not find div with id="headerDateContainer".');
      return;
    }
    //update headerDateContainer with toDateString of anchorDate.
    headerDateContainer.textContent = appState.anchorDate.toDateString();
  }

  //pull events and redraw day view using the prebuilt pipeline. (removed my own map and redraw system.)
  function renderTodayView() {
    const allEvents = StorageManager.loadAllEvents();
    renderCalendarView(allEvents, appState.anchorDate, "day");
  }

  //initial header setup.
  appState.anchorDate.setHours(0, 0, 0, 0);
  changeHeaderDate();

  //listener for 'goToToday' button in index
  const goToTodayButton = document.getElementById("goToTodayButton");
  //error guardrail
  if (!goToTodayButton) {
    console.error('could not find button with id="goToTodayButton".');
    return;
  }

  //listener for onclick, resets anchorDate to current date and reprints the header.
  goToTodayButton.addEventListener("click", () => {
    appState.anchorDate = new Date();
    appState.anchorDate.setHours(0, 0, 0, 0);

    changeHeaderDate();
    renderTodayView();
    console.log("today clicked. New anchorDate:", appState.anchorDate);
  });

  //testers
  console.log("viewController Init");
  console.log("Start state", appState);
}
