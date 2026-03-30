import generateUID from "./UIDGenerator.js";
import StorageManager from "./dataStorage.js";
import CalendarEvent from "./classCalendarEvent.js";
import { renderCalendarView } from "./calendar/calendar.js";
import React from "react";
import { createRoot } from "react-dom/client";
import EventForm from "./eventForm.tsx";

const eventPopupContainer = document.getElementById("eventPopupContainer");
const eventTitleInput = document.getElementById("eventTitle");
const endTimeInput = document.getElementById("eventEndTime");
const eventDateInput = document.getElementById("eventDate");
const eventFormRootElement = document.getElementById("eventFormRoot");
const eventFormRoot = createRoot(eventFormRootElement);

//C-3 editing constants
const eventForm = document.getElementById("eventForm");
const eventFormTitle = document.getElementById("eventFormTitle");
const startTimeInput = document.getElementById("eventStartTime");
const eventColorInput = document.getElementById("eventColor");
const eventAddressInput = document.getElementById("eventAddress");
const eventDescriptionInput = document.getElementById("eventDescription");

//edit state variable
let editingEventUID = null;

/**
 * Initializes the event manager by setting up event listeners for the "Add Event" button, "Cancel" button, and the event form submission.
 */
function initializeEventManager() {
  const addEventButton = document.getElementById("addEventButton");
  const calendarEventsLayer = document.getElementById("calendarEventsLayer");

  addEventButton.addEventListener("click", () => {
    prepareAddEventMode();
    showEventCreator();
  });

  //additional listener for 'edit event' option.  Reads clicks on event targets and stores eventUID then runs openEventEditor() based on eventUID.

  calendarEventsLayer.addEventListener("click", (event) => {
    const clickedEventButton = event.target.closest("[data-event-id]");

    if (!clickedEventButton) {
      return;
    }

    const eventUID = clickedEventButton.dataset.eventId;
    openEventEditor(eventUID);
  });
}

/** Handle form submission for creating a new calendar event
 * Extracts data from the form, performs data validation, creates an event object, and assigns it a unique identifier (UID)
 * Uses StorageManager to store the event in localStorage
 * @param {HTMLFormElement} event - The form element containing event details
*/
function submitEvent(event) {
  event.preventDefault();
  // Pull form from the event
  const eventForm = event.currentTarget;
  // Extract form data and create event object
  const data = new FormData(eventForm);
  const eventProps = Object.fromEntries(data);
  // Validate form input data
  if (!validateEventSubmission(eventProps)) {
    eventForm.reportValidity();
    return;
  }
  // Generate and assign UID, save event, and hide the event creation form
  //*Caleb edit.*  adjusted the id const to check if editingEventUID has a value to keep that value, otherwise run generateUID() function.
  const id = editingEventUID ?? generateUID();
  eventProps.UID = id;
  const newEvent = new CalendarEvent(eventProps);
  StorageManager.saveEvent(newEvent);
  hideEventCreator();
  calenderEventRefresh();
  console.log("Event saved (UID: " + id + ")");
  console.log(newEvent);
}

/**
 * Validates the submission of a new calendar event.
 * Performs checks on the event title, date, and time to ensure they meet specified criteria. Validation messages are shown for any invalid input,
 * and are cleared when the user starts correcting the input.
 * @param {*} event - The event object containing submission data
 * @returns {boolean} - True if the event is valid, false otherwise
 */
function validateEventSubmission(event) {
  // Title validation
  if (event.title.trim() === "" || event.title.length > 100) {
    eventTitleInput.setCustomValidity(
      "Event title cannot be empty or exceed 100 characters.",
    );
    eventTitleInput.addEventListener(
      "input",
      () => {
        eventTitleInput.setCustomValidity("");
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

/**
 *  Show event creation form
 */
function showEventCreator() {
  eventFormRoot.render(<EventForm UID={null} onCancel={hideEventCreator} onSubmit={submitEvent} />);

  // const cancelEventButton = document.getElementById("cancelEventButton");
  const eventForm = document.getElementById("eventForm");
  const deleteEventButton = document.getElementById("deleteEventButton");

  // cancelEventButton.addEventListener("click", () => {
  //   hideEventCreator();
  // });

  // eventForm.addEventListener("submit", (e) => {
  //   submitEvent(e.target);
  // });
  //additional listener for 'delete event' button option.  reads click on id="deleteEventButton" and runs the deletion function.
  // deleteEventButton.addEventListener("click", () => {
  //   //failure guardrail
  //   if (!editingEventUID) {
  //     return;
  //   }
  //   StorageManager.deleteEvent(editingEventUID);
  //   hideEventCreator();
  //   calenderEventRefresh();
  // });
}

/**
 * Hide event creation form and reset form fields
 */
function hideEventCreator() {
  eventPopupContainer.classList.remove("visible");
  eventPopupContainer.classList.add("hidden");
  eventForm.reset();
  editingEventUID = null;

  if (eventFormTitle) {
    eventFormTitle.textContent = "Add Event";
  }
}

/**
 * functions for editing events for C-3
 */
//This function is used to reset back to a blank slate for switching from edit mode back to add mode.  function added to initializeEventManager() in addEventButton.addEventListener to reset on click.
function prepareAddEventMode() {
  editingEventUID = null;
  if (eventFormTitle) {
    eventFormTitle.textContent = "Add Event";
  }
  //reset function is a cool prebuilt brower function that resets to default.  This clears data for when we switch back to 'Add Event' mode. just thought it was cool.
  // eventForm.reset();
}

function deleteEventHandler(event) {

}

//Function to open 'edit event' mode and, and display contents of event in correct fields
function openEventEditor(eventUID) {
  const allEvents = StorageManager.loadAllEvents();
  // checks through event array and returns on a matching value to what's clicked.  If anyone nows an easier way then combing all events let me know.
  const eventToEdit = allEvents.find((event) => event.UID === eventUID);

  //failure guardrail
  if (!eventToEdit) {
    console.error(`could not find event with UID: ${eventUID}`);
    return;
  }

  editingEventUID = eventUID;

  //sets popup title to Edit instead of Add
  if (eventFormTitle) {
    eventFormTitle.textContent = "Edit Event";
  }

  //saveds stored eventUID form values to populate in the correct locations.
  eventTitleInput.value = eventToEdit.title;
  eventDateInput.value = eventToEdit.date;
  startTimeInput.value = eventToEdit.timeStart;
  endTimeInput.value = eventToEdit.timeEnd;
  eventColorInput.value = eventToEdit.color ?? "#ffffff";
  eventAddressInput.value = eventToEdit.address ?? "";
  eventDescriptionInput.value = eventToEdit.description ?? "";

  showEventCreator();
}

/**
 * re-render function after adding, editing, or deleting an event
 */
function calenderEventRefresh() {
  const headerDateContainer = document.getElementById("headerDateContainer");
  const headerDateText = headerDateContainer.textContent;
  const headerDateRender = new Date(headerDateText);
  const allEvents = StorageManager.loadAllEvents();
  renderCalendarView(allEvents, headerDateRender, "day");
}

export {
  initializeEventManager,
  openEventEditor,
  hideEventCreator,
  submitEvent,
};
