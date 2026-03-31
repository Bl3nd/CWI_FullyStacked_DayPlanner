import localStorageMock from "./mockStorage";

import StorageManager from "../modules/dataStorage";
import CalendarEvent from "../modules/classCalendarEvent";

function storageTests() {
  let passed = 0;
  let failed = 0;

  // Replace localStorage with mock version
  localStorageMock.initialize();

  // ─── SETUP: Mock confirm() ────────────────────────────────────────────────────
  // confirm() is replaced with a controllable fake so tests can simulate
  // the user clicking "OK" or "Cancel" without any real dialog appearing
  const originalConfirm = globalThis.confirm;
  let confirmResponse = true; // default to user clicking OK
  globalThis.confirm = () => confirmResponse;

  // ─── HELPERS ──────────────────────────────────────────────────────────────────

  function expect(label, fn) {
    try {
      fn();
      console.log(`✅ PASS — "${label}"`);
      passed++;
    } catch (e) {
      console.error(`❌ FAIL — "${label}": ${e.message}`);
      failed++;
    }
  }

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  // Wipes mock storage between tests
  function clearStorage() {
    localStorageMock.clear();
  }

  // Sample CalendarEvent for reuse across tests
  const sampleEventData = {
    date: "2025-03-01",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Test Meeting",
    description: "A test event",
    address: "123 Main St",
    color: "#FF0000",
  };

  // ─── SAVE EVENT ───────────────────────────────────────────────────────────────

  console.group("saveEvent()");

  expect("Saves event to localStorage with correct key", () => {
    clearStorage();
    const event = new CalendarEvent(sampleEventData);
    StorageManager.saveEvent(event);
    const key = `CalendarEvent_${event.UID}`;
    assert(
      localStorage.getItem(key) !== null,
      "Expected key not found in localStorage.",
    );
  });

  expect("Saved value is valid JSON", () => {
    clearStorage();
    const event = new CalendarEvent(sampleEventData);
    StorageManager.saveEvent(event);
    const key = `CalendarEvent_${event.UID}`;
    const raw = localStorage.getItem(key);
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("Stored value is not valid JSON.");
    }
    assert(parsed !== null, "Parsed value is null.");
  });

  expect("UID is not duplicated in stored JSON value", () => {
    clearStorage();
    const event = new CalendarEvent(sampleEventData);
    StorageManager.saveEvent(event);
    const key = `CalendarEvent_${event.UID}`;
    const parsed = JSON.parse(localStorage.getItem(key));
    assert(
      parsed.UID === undefined,
      "UID should be excluded from stored JSON value.",
    );
  });

  expect("Saved JSON contains all other event properties", () => {
    clearStorage();
    const event = new CalendarEvent(sampleEventData);
    StorageManager.saveEvent(event);
    const key = `CalendarEvent_${event.UID}`;
    const parsed = JSON.parse(localStorage.getItem(key));
    assert(parsed.date === sampleEventData.date, "date mismatch.");
    assert(
      parsed.timeStart === sampleEventData.timeStart,
      "timeStart mismatch.",
    );
    assert(parsed.timeEnd === sampleEventData.timeEnd, "timeEnd mismatch.");
    assert(parsed.title === sampleEventData.title, "title mismatch.");
    assert(
      parsed.description === sampleEventData.description,
      "description mismatch.",
    );
    assert(parsed.address === sampleEventData.address, "address mismatch.");
    assert(parsed.color === sampleEventData.color, "color mismatch.");
  });

  expect("Saving multiple events creates separate keys", () => {
    clearStorage();
    const event1 = new CalendarEvent({ ...sampleEventData, title: "Event 1" });
    const event2 = new CalendarEvent({ ...sampleEventData, title: "Event 2" });
    StorageManager.saveEvent(event1);
    StorageManager.saveEvent(event2);
    assert(
      localStorage.length === 2,
      `Expected 2 items in storage, found ${localStorage.length}.`,
    );
  });

  console.groupEnd();

  // ─── LOAD ALL EVENTS ──────────────────────────────────────────────────────────

  console.group("loadAllEvents()");

  expect("Returns an empty array when storage is empty", () => {
    clearStorage();
    const events = StorageManager.loadAllEvents();
    assert(Array.isArray(events), "Expected an array.");
    assert(events.length === 0, `Expected 0 events, got ${events.length}.`);
  });

  expect("Returns correct number of saved events", () => {
    clearStorage();
    StorageManager.saveEvent(
      new CalendarEvent({ ...sampleEventData, title: "Event 1" }),
    );
    StorageManager.saveEvent(
      new CalendarEvent({ ...sampleEventData, title: "Event 2" }),
    );
    StorageManager.saveEvent(
      new CalendarEvent({ ...sampleEventData, title: "Event 3" }),
    );
    const events = StorageManager.loadAllEvents();
    assert(events.length === 3, `Expected 3 events, got ${events.length}.`);
  });

  expect("Loaded items are CalendarEvent instances", () => {
    clearStorage();
    StorageManager.saveEvent(new CalendarEvent(sampleEventData));
    const events = StorageManager.loadAllEvents();
    assert(
      events[0] instanceof CalendarEvent,
      "Expected a CalendarEvent instance.",
    );
  });

  expect("Loaded event has correct properties", () => {
    clearStorage();
    const original = new CalendarEvent(sampleEventData);
    StorageManager.saveEvent(original);
    const loaded = StorageManager.loadAllEvents()[0];
    assert(loaded.UID === original.UID, "UID mismatch.");
    assert(loaded.date === original.date, "date mismatch.");
    assert(loaded.timeStart === original.timeStart, "timeStart mismatch.");
    assert(loaded.timeEnd === original.timeEnd, "timeEnd mismatch.");
    assert(loaded.title === original.title, "title mismatch.");
    assert(
      loaded.description === original.description,
      "description mismatch.",
    );
    assert(loaded.address === original.address, "address mismatch.");
    assert(loaded.color === original.color, "color mismatch.");
  });

  expect("Ignores non-CalendarEvent items in localStorage", () => {
    clearStorage();
    // Manually insert a non-event item to make sure it's ignored
    localStorage.setItem(
      "SomeOtherModule_data",
      JSON.stringify({ foo: "bar" }),
    );
    StorageManager.saveEvent(new CalendarEvent(sampleEventData));
    const events = StorageManager.loadAllEvents();
    assert(events.length === 1, `Expected 1 event, but got ${events.length}.`);
  });

  console.groupEnd();

  // ─── DELETE EVENT ─────────────────────────────────────────────────────────────

  console.group("deleteEvent()");

  expect("Deletes correct event when user confirms", () => {
    clearStorage();
    confirmResponse = true;
    const event = new CalendarEvent(sampleEventData);
    StorageManager.saveEvent(event);
    StorageManager.deleteEvent(event.UID);
    assert(
      localStorage.getItem(`CalendarEvent_${event.UID}`) === null,
      "Event should have been deleted.",
    );
  });

  expect("Does not delete event when user cancels", () => {
    clearStorage();
    confirmResponse = false;
    const event = new CalendarEvent(sampleEventData);
    StorageManager.saveEvent(event);
    StorageManager.deleteEvent(event.UID);
    assert(
      localStorage.getItem(`CalendarEvent_${event.UID}`) !== null,
      "Event should NOT have been deleted.",
    );
    confirmResponse = true; // reset
  });

  expect("Only deletes the targeted event, not others", () => {
    clearStorage();
    confirmResponse = true;
    const event1 = new CalendarEvent({ ...sampleEventData, title: "Event 1" });
    const event2 = new CalendarEvent({ ...sampleEventData, title: "Event 2" });
    StorageManager.saveEvent(event1);
    StorageManager.saveEvent(event2);
    StorageManager.deleteEvent(event1.UID);
    assert(
      localStorage.getItem(`CalendarEvent_${event1.UID}`) === null,
      "Event 1 should be deleted.",
    );
    assert(
      localStorage.getItem(`CalendarEvent_${event2.UID}`) !== null,
      "Event 2 should still exist.",
    );
  });

  console.groupEnd();

  // ─── DELETE ALL EVENTS ────────────────────────────────────────────────────────

  console.group("deleteAllEvents()");

  expect("Deletes all events when user confirms twice", () => {
    clearStorage();
    confirmResponse = true; // both confirms return true
    StorageManager.saveEvent(
      new CalendarEvent({ ...sampleEventData, title: "Event 1" }),
    );
    StorageManager.saveEvent(
      new CalendarEvent({ ...sampleEventData, title: "Event 2" }),
    );
    StorageManager.deleteAllEvents();
    assert(
      localStorage.length === 0,
      `Expected 0 items in storage, found ${localStorage.length}.`,
    );
  });

  expect("Does not delete anything if first confirm is cancelled", () => {
    clearStorage();
    let confirmCount = 0;
    // First confirm returns false, second would return true (but shouldn't be reached)
    globalThis.confirm = () => (confirmCount++ === 0 ? false : true);
    StorageManager.saveEvent(
      new CalendarEvent({ ...sampleEventData, title: "Event 1" }),
    );
    StorageManager.saveEvent(
      new CalendarEvent({ ...sampleEventData, title: "Event 2" }),
    );
    StorageManager.deleteAllEvents();
    assert(
      localStorage.length === 2,
      `Expected 2 items, found ${localStorage.length}.`,
    );
    globalThis.confirm = () => confirmResponse; // restore simple mock
  });

  expect("Does not delete anything if second confirm is cancelled", () => {
    clearStorage();
    let confirmCount = 0;
    // First confirm returns true, second returns false
    globalThis.confirm = () => (confirmCount++ === 0 ? true : false);
    StorageManager.saveEvent(
      new CalendarEvent({ ...sampleEventData, title: "Event 1" }),
    );
    StorageManager.saveEvent(
      new CalendarEvent({ ...sampleEventData, title: "Event 2" }),
    );
    StorageManager.deleteAllEvents();
    assert(
      localStorage.length === 2,
      `Expected 2 items, found ${localStorage.length}.`,
    );
    globalThis.confirm = () => confirmResponse; // restore simple mock
  });

  expect(
    "Only deletes CalendarEvent keys, leaves other localStorage items intact",
    () => {
      clearStorage();
      confirmResponse = true;
      localStorage.setItem(
        "SomeOtherModule_data",
        JSON.stringify({ foo: "bar" }),
      );
      StorageManager.saveEvent(
        new CalendarEvent({ ...sampleEventData, title: "Event 1" }),
      );
      StorageManager.deleteAllEvents();
      assert(
        localStorage.getItem("SomeOtherModule_data") !== null,
        "Non-event item should not be deleted.",
      );
    },
  );

  console.groupEnd();

  // ─── SUMMARY ──────────────────────────────────────────────────────────────────

  // Restore original globals
  localStorageMock.restore();
  globalThis.confirm = originalConfirm;

  console.log(
    `\n📋 Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests.`,
  );
  if (failed === 0) {
    console.log("🎉 All tests passed!");
  } else {
    console.warn(`⚠️  ${failed} test(s) failed. See above for details.`);
  }
}

export default storageTests;
