import React from "react";
import appState from "./appState";
import CalendarEvent from "./classCalendarEvent";

type eventFormProps = {
  UID: string | null;
  onCancel: () => void;
  onDelete: (UID: any) => void;
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
};

export default function EventForm({
  UID,
  onCancel,
  onDelete,
  onSubmit,
}: eventFormProps) {
  // Form variables
  const title: string = UID? "Edit Event" :"Add Event";
  // Pull all events from appState
  const targetEvent: CalendarEvent | undefined = UID? appState.getEventByUID(UID) : undefined;
  // If UID is null, return an empty event form submission
  return (
    <div
      id="eventPopupContainer"
      // Close form if user clicks outside of it
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <form id="eventForm" onSubmit={onSubmit}>
        <h2 id="eventFormTitle">{title}</h2>
        <label htmlFor="eventTitle">
          Event Name <span className="text-danger">*</span>
        </label>
        <input type="text" id="eventTitle" name="title" defaultValue={targetEvent?.title} required />
        <label htmlFor="eventDate">
          Date <span className="text-danger">*</span>
        </label>
        <input type="date" id="eventDate" name="date" defaultValue={targetEvent?.date ?? appState.dateView} required />
        <div id="timeContainer">
          <label htmlFor="eventStartTime">
            Start Time <span className="text-danger">*</span>
          </label>
          <input
            type="time"
            id="eventStartTime"
            name="timeStart"
            defaultValue={targetEvent?.timeStart}
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
            defaultValue={targetEvent?.timeEnd}
            step={900}
            required
          />
          <label htmlFor="eventColor">Color</label>
          <input
            type="color"
            id="eventColor"
            name="color"
            defaultValue={targetEvent?.color ?? "#ffffff"}
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
          defaultValue={targetEvent?.address}
        />
        <label htmlFor="eventDescription">Description</label>
        <textarea
          id="eventDescription"
          name="description"
          defaultValue={targetEvent?.description}
          rows={4}
          cols={50}
        />
        <div id="eventFormButtonsContainer">
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel} id="cancelEventButton">
            Cancel
          </button>
          {UID? <button type="button" onClick={onDelete} id="deleteEventButton">
            Delete
          </button> : undefined}
        </div>
      </form>
    </div>
  );
}
