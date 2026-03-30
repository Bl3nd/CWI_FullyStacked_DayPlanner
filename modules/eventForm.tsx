import React from "react";
import CalendarEvent from "./classCalendarEvent";
import StorageManager from "./dataStorage";
import { openEventEditor } from "./eventManager";
import { hideEventCreator } from "./eventManager";
import { submitEvent } from "./eventManager";

type eventFormProps = {
  UID?: string;
  onCancel: () => void;
  onDelete: (UID: any) => void;
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
};

export default function EventForm({ UID, onCancel, onDelete, onSubmit }: eventFormProps) {
  if (!UID) {
    // If UID is null, return an empty event form submission
    return (
      <div id="eventPopupContainer" className="">
        <form id="eventForm" onSubmit={onSubmit}>
          <h2 id="eventFormTitle">Add Event</h2>
          <label htmlFor="eventTitle">
            Event Name <span>*</span>
          </label>
          <input type="text" id="eventTitle" name="title" required />
          <label htmlFor="eventDate">
            Date <span>*</span>
          </label>
          <input type="date" id="eventDate" name="date" required />
          <div id="timeContainer">
            <label htmlFor="eventStartTime">
              Start Time <span>*</span>
            </label>
            <input
              type="time"
              id="eventStartTime"
              name="timeStart"
              step={900}
              required
            />
            <label htmlFor="eventEndTime">
              End Time <span>*</span>
            </label>
            <input
              type="time"
              id="eventEndTime"
              name="timeEnd"
              step={900}
              required
            />
            <label htmlFor="eventColor">Color</label>
            <input
              type="color"
              id="eventColor"
              name="color"
              defaultValue="#ffffff"
              list="colorOptions"
            />
            <datalist id="colorOptions">
              <option value="#ffffff">White</option>
              <option value="#ff0000">Red</option>
              <option value="#00ff00">Green</option>
              <option value="#0000ff">Blue</option>
              <option value="#ffff00">Yellow</option>
              <option value="#ff00ff">Magenta</option>
              <option value="#00ffff">Cyan</option>
            </datalist>
          </div>
          <label htmlFor="eventAddress">Address</label>
          <input
            type="text"
            id="eventAddress"
            name="address"
            autoComplete="street-address"
          />
          <label htmlFor="eventDescription">Description</label>
          <textarea
            id="eventDescription"
            name="description"
            rows={4}
            cols={50}
            defaultValue={""}
          />
          <div id="eventFormButtonsContainer">
            <button type="submit">Submit</button>
            <button type="button" onClick={onCancel} id="cancelEventButton">
              Cancel
            </button>
            <button type="button" onClick={onDelete} id="deleteEventButton">
              Delete
            </button>
          </div>
        </form>
      </div>
    );
  } else {
    // TODO: Implement event editing functionality
  }
}
