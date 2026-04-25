import generateUID from "./UIDGenerator";
import StorageManager from "./dataStorage";
import CalendarEvent from "./classCalendarEvent";
import { renderCalendarView } from "./calendar/calendar";
import { createRoot, type Root } from "react-dom/client";
import React from "react";
import EventForm from "./eventForm";
import appState from "./appState";
import { clearTimeSlot } from "./calendar/calendarContainer/tapToAddEvent";

// TODO: Add non null verification/exception handling

// Root element container for event form component
const eventFormRootElement: HTMLElement | null =
  document.getElementById("eventFormRoot");

//edit state variable
let editingEventUID: string | null = null;

/**
 * Initializes the event manager by setting up event listener for the "Add Event" button.
 */
function initializeEventManager(): void {
  const addEventButton: HTMLElement | null =
    document.getElementById("addEventButton");
  const calendarEventsLayer: HTMLElement | null = document.getElementById(
    "calendarEventsLayer",
  );

  addEventButton?.addEventListener("click", () => {
    showEventManager();
  });

  //additional listener for 'edit event' option.  Reads clicks on event targets and stores eventUID then runs openEventEditor() based on eventUID.

  calendarEventsLayer?.addEventListener("click", (event) => {
    const clickedEventButton: HTMLElement = (
      event.currentTarget as HTMLElement
    ).closest("[data-event-id]")!;

    if (!clickedEventButton) {
      return;
    }

    const eventUID: string = clickedEventButton.dataset.eventId!;
    showEventManager(eventUID);
  });
}

/**
 * Show (and close) event creation and editing form. Will create a new React root each time it is called, then will unmount itself when the form is closed.
 * Resets form fields automatically.
 * @param {string} UID - OPTIONAL: If provided, the form will load the event corresponding to the UID for editing or deletion.
 */
function showEventManager(UID: string | null = null): void {
  const eventFormRoot: Root | null = createRoot(eventFormRootElement!);
  eventFormRoot.render(
    <EventForm
      UID={UID}
      onCancel={close}
      onSubmit={submit}
      onDelete={deleteEvent}
    />,
  );

  function close() {
    clearTimeSlot();
    eventFormRoot!.unmount();
  }

  function submit(component: React.SubmitEvent<HTMLFormElement>) {
    submitEvent(component, UID);
    close();
  }

  function deleteEvent() {
    if (
      confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    ) {
      appState.removeEvent(UID!);
      renderCalendarView(
        appState.allEventsByDate,
        appState.dateViewObject,
        appState.calendarView,
      );
      close();
    }
  }
}

/**
 * Handle form submission for creating or editing a calendar event.
 * Extracts data from the form, performs data validation, creates a CalendarEvent object, and assigns it a unique identifier (UID) if it does not have one already.
 * Uses appState to store the event.
 * @param {HTMLFormElement} event - The form element containing event details
 */
function submitEvent(
  event: React.SubmitEvent<HTMLFormElement>,
  UID: string | null,
): void {
  event.preventDefault();
  // Pull form from the event
  const eventForm: HTMLFormElement = event.currentTarget;
  // Extract form data and create event object
  const data: FormData = new FormData(eventForm);
  const eventProps: any = Object.fromEntries(data);
  // Validate form input data
  if (!validateEventSubmission(eventProps)) {
    eventForm.reportValidity();
    return;
  }
  // Generate and assign UID if not provided, save event, and hide the event creation form
  eventProps.UID = UID ?? generateUID();
  const newEvent = new CalendarEvent(eventProps);
  appState.addEvent(newEvent);
  renderCalendarView(
    appState.allEventsByDate,
    appState.dateViewObject,
    appState.calendarView,
  );
}

/**
 * Validates the submission of a new calendar event.
 * Performs checks on the event title, date, and time to ensure they meet specified criteria. Validation messages are shown for any invalid input,
 * and are cleared when the user starts correcting the input.
 * @param {CalendarEvent} event - The event object containing submission data
 * @returns {boolean} True if the event is valid, false otherwise
 */
function validateEventSubmission(event: CalendarEvent): boolean {
  // Form input references
  const eventTitleInput: HTMLInputElement | null = document.getElementById(
    "eventTitle",
  ) as HTMLInputElement;
  const endTimeInput: HTMLInputElement | null = document.getElementById(
    "eventEndTime",
  ) as HTMLInputElement;
  const eventDateInput: HTMLInputElement | null = document.getElementById(
    "eventDate",
  ) as HTMLInputElement;

  // Title validation
  if (event.title.trim() === "" || event.title.length > 100) {
    eventTitleInput!.setCustomValidity(
      "Event title cannot be empty or exceed 100 characters.",
    );
    eventTitleInput!.addEventListener(
      "input",
      () => {
        eventTitleInput!.setCustomValidity("");
      },
      { once: true },
    );
    return false;
  }
  // Date validation
  const pastDateLimit = new Date("2000-01-02");
  const futureDateLimit = new Date("2100-01-01");
  const eventDate = new Date(event.date);
  if (eventDate < pastDateLimit || eventDate > futureDateLimit) {
    eventDateInput.setCustomValidity(
      "Event date is out of the allowed range.\n(" +
        pastDateLimit.toLocaleDateString("en-US") +
        " - " +
        futureDateLimit.toLocaleDateString("en-US") +
        ")",
    );
    eventDateInput.addEventListener(
      "input",
      () => {
        eventDateInput.setCustomValidity("");
      },
      { once: true },
    );
    return false;
  }
  // Time validation
  const startTimeInt = event.timeStart.replace(":", "");
  const endTimeMinInt = event.timeEnd.replace(":", "");
  if (startTimeInt >= endTimeMinInt) {
    endTimeInput.setCustomValidity("End time must be after start time.");
    endTimeInput.addEventListener(
      "input",
      () => {
        endTimeInput.setCustomValidity("");
      },
      { once: true },
    );
    return false;
  }

  return true;
}

export { initializeEventManager, showEventManager };
