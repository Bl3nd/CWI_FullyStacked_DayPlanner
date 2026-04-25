import React from "react";
import appState from "./appState";
import CalendarEvent from "./classCalendarEvent";
import { getTimeSlot } from "./calendar/calendarContainer/tapToAddEvent";

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
  const title: string = UID ? "Edit Event" : "Add Event";
  // Pull all events from appState
  const targetEvent: CalendarEvent | undefined = UID
    ? appState.getEventByUID(UID)
    : undefined;
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
      <form id="eventForm" className="bg-body" onSubmit={onSubmit}>
        <h2 id="eventFormTitle">{title}</h2>
        <div>
          <label htmlFor="eventTitle">
            Event Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="eventTitle"
            name="title"
            defaultValue={targetEvent?.title}
            required
          />
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
        <div>
          <div className="inputPair">
            <label htmlFor="eventDate">
              Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              id="eventDate"
              name="date"
              defaultValue={targetEvent?.date ?? appState.dateView}
              required
            />
          </div>
          <div className="inputPair">
            <label htmlFor="eventStartTime">
              Start <span className="text-danger">*</span>
            </label>
            <input
              type="time"
              id="eventStartTime"
              name="timeStart"
              defaultValue={targetEvent?.timeStart ?? getTimeSlot()?.startTime}
              step={900}
              required
            />
          </div>
          <div className="inputPair">
            <label htmlFor="eventEndTime">
              End <span className="text-danger">*</span>
            </label>
            <input
              type="time"
              id="eventEndTime"
              name="timeEnd"
              defaultValue={targetEvent?.timeEnd ?? getTimeSlot()?.endTime}
              step={900}
              required
            />
          </div>
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
          rows={3}
          cols={50}
        />
        <div id="eventFormButtonsContainer">
          <button type="submit" className="btn btn-success btn-sm">
            Save
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={onCancel}
            id="cancelEventButton"
          >
            Cancel
          </button>
          {UID ? (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={onDelete}
              id="deleteEventButton"
            >
              Delete
            </button>
          ) : undefined}
        </div>
      </form>
    </div>
  );
}
