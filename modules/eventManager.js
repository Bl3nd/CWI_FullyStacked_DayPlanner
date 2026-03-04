import generateUID from "./UIDGenerator.js";
import StorageManager from "./dataStorage.js";

const eventPopupContainer = document.getElementById("eventPopupContainer");
const eventTitleInput = document.getElementById("eventTitle");
const endTimeInput = document.getElementById("eventEndTime");
const eventDateInput = document.getElementById("eventDate");

/**
 * Initializes the event manager by setting up event listeners for the "Add Event" button, "Cancel" button, and the event form submission.
 */
function initializeEventManager() {
  const addEventButton = document.getElementById("addEventButton");
  const cancelEventButton = document.getElementById("cancelEventButton");
  const eventForm = document.getElementById("eventForm");

  addEventButton.addEventListener("click", () => {
    showEventCreator();
  });

  cancelEventButton.addEventListener("click", () => {
    hideEventCreator();
  });

  eventForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitEvent(e.target);
    // console.log(addEventButton, cancelEventButton, eventForm);
  });
}

/** Handle form submission for creating a new calendar event
 * Extracts data from the form, performs data validation, creates an event object, and assigns it a unique identifier (UID)
 * Uses StorageManager to store the event in localStorage
 * @param {HTMLFormElement} eventForm - The form element containing event details
 */
function submitEvent(eventForm) {
  // Extract form data and create event object
  const data = new FormData(eventForm);
  const event = Object.fromEntries(data);
  // Validate form input data
  if (!validateEventSubmission(event)) {
    eventForm.reportValidity();
    return;
  }
  // Generate and assign UID, save event, and hide the event creation form
  const id = generateUID();
  event.UID = id;
  StorageManager.saveEvent(event);
  hideEventCreator();
  console.log("Event saved (UID: " + id + ")");
  console.log(event);
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
  eventPopupContainer.classList.remove("hidden");
  eventPopupContainer.classList.add("visible");
}

/**
 * Hide event creation form and reset form fields
 */
function hideEventCreator() {
  eventPopupContainer.classList.remove("visible");
  eventPopupContainer.classList.add("hidden");
  eventForm.reset();
}

export { initializeEventManager };
