import appState from "../modules/appState";
import CalendarEvent from "../modules/classCalendarEvent";
import { CalendarViews } from "../modules/enumCalendarViews";

// ─── Test runner ──────────────────────────────────────────────────────────────

export default function appStateTests() {
  let passed = 0;
  let total = 0;

  function test(name, uids, fn) {
    total++;
    try {
      fn();
      passed++;
    } catch (err) {
      console.log(`  ❌ FAIL: ${name}`);
      console.log(`     ${err.message}`);
    } finally {
      uids.forEach((uid) => {
        try {
          appState.removeEvent(uid);
        } catch {}
      });
    }
  }

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function assertEqual(actual, expected, label = "") {
    if (actual !== expected)
      throw new Error(
        `${label ? label + ": " : ""}expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
      );
  }

  console.log("🧪 Testing AppState...");

  // Mock confirm() so removeEvent calls don't block on a dialog
  const originalConfirm = globalThis.confirm;
  globalThis.confirm = () => true;

  // Save calendarView so we can restore it after tests that change it
  const initialCalendarView = appState.calendarView;

  // ── addEvent ────────────────────────────────────────────────────────────────

  test("addEvent stores event retrievable by UID", ["test-uid-1"], () => {
    appState.addEvent(
      new CalendarEvent({
        UID: "test-uid-1",
        date: "2025-06-15",
        timeStart: "09:00",
        timeEnd: "10:00",
        title: "Team standup",
      }),
    );
    assertEqual(appState.getEventByUID("test-uid-1")?.title, "Team standup");
  });

  test("addEvent stores event retrievable by date", ["test-uid-2"], () => {
    appState.addEvent(
      new CalendarEvent({
        UID: "test-uid-2",
        date: "2025-06-15",
        timeStart: "09:00",
        timeEnd: "10:00",
        title: "Lunch",
      }),
    );
    const byDate = appState.getEventsByDate("2025-06-15");
    const event = byDate.find((e) => e.UID === "test-uid-2");
    assert(event !== undefined, "event should be present in date map");
  });

  test(
    "addEvent with same UID overwrites existing event (no duplicate)",
    ["test-uid-3"],
    () => {
      appState.addEvent(
        new CalendarEvent({
          UID: "test-uid-3",
          date: "2025-06-15",
          timeStart: "09:00",
          timeEnd: "10:00",
          title: "Original",
        }),
      );
      appState.addEvent(
        new CalendarEvent({
          UID: "test-uid-3",
          date: "2025-06-15",
          timeStart: "09:00",
          timeEnd: "10:00",
          title: "Updated",
        }),
      );
      assertEqual(appState.getEventByUID("test-uid-3").title, "Updated");
      const byDate = appState.getEventsByDate("2025-06-15");
      const matches = byDate.filter((e) => e.UID === "test-uid-3");
      assertEqual(matches.length, 1, "no duplicate in date map");
    },
  );

  test(
    "addEvent multiple events on same date are all stored",
    ["test-uid-a", "test-uid-b"],
    () => {
      appState.addEvent(
        new CalendarEvent({
          UID: "test-uid-a",
          date: "2025-07-04",
          timeStart: "09:00",
          timeEnd: "10:00",
          title: "Parade",
        }),
      );
      appState.addEvent(
        new CalendarEvent({
          UID: "test-uid-b",
          date: "2025-07-04",
          timeStart: "09:00",
          timeEnd: "10:00",
          title: "Fireworks",
        }),
      );
      const byDate = appState.getEventsByDate("2025-07-04");
      const testEvents = byDate.filter((e) => e.UID.startsWith("test-uid-"));
      assertEqual(testEvents.length, 2);
    },
  );

  test("addEvent notifies listeners", ["test-uid-n"], () => {
    let notified = false;
    const unsub = appState.subscribe(() => {
      notified = true;
    });
    appState.addEvent(
      new CalendarEvent({
        UID: "test-uid-n",
        date: "2025-08-01",
        timeStart: "09:00",
        timeEnd: "10:00",
        title: "Notify test",
      }),
    );
    unsub();
    assert(notified, "listener should have been called");
  });

  // ── removeEvent ─────────────────────────────────────────────────────────────

  test("removeEvent deletes event from UID map", [], () => {
    appState.addEvent(
      new CalendarEvent({
        UID: "test-uid-4",
        date: "2025-09-01",
        timeStart: "09:00",
        timeEnd: "10:00",
        title: "Delete me",
      }),
    );
    appState.removeEvent("test-uid-4");
    assert(
      appState.getEventByUID("test-uid-4") === undefined,
      "event should be gone",
    );
  });

  test("removeEvent deletes event from date map", [], () => {
    appState.addEvent(
      new CalendarEvent({
        UID: "test-uid-5",
        date: "2025-09-01",
        timeStart: "09:00",
        timeEnd: "10:00",
        title: "Delete me",
      }),
    );
    appState.removeEvent("test-uid-5");
    const byDate = appState.getEventsByDate("2025-09-01");
    assert(
      !byDate.some((e) => e.UID === "test-uid-5"),
      "event should not be in date map",
    );
  });

  test("removeEvent leaves other events on same date intact", [], () => {
    appState.addEvent(
      new CalendarEvent({
        UID: "test-uid-7",
        date: "2025-09-03",
        timeStart: "09:00",
        timeEnd: "10:00",
        title: "Keep",
      }),
    );
    appState.addEvent(
      new CalendarEvent({
        UID: "test-uid-8",
        date: "2025-09-03",
        timeStart: "09:00",
        timeEnd: "10:00",
        title: "Remove",
      }),
    );
    appState.removeEvent("test-uid-8");
    assert(
      appState.getEventByUID("test-uid-7") !== undefined,
      "sibling event should still exist",
    );
    assert(
      appState.getEventByUID("test-uid-8") === undefined,
      "removed event should be gone",
    );
    appState.removeEvent("test-uid-7");
  });

  test("removeEvent throws when UID not found", [], () => {
    let threw = false;
    try {
      appState.removeEvent("test-nonexistent");
    } catch {
      threw = true;
    }
    assert(threw, "should throw for missing UID");
  });

  test("removeEvent notifies listeners", [], () => {
    appState.addEvent(
      new CalendarEvent({
        UID: "test-uid-rn",
        date: "2025-10-01",
        timeStart: "09:00",
        timeEnd: "10:00",
        title: "Notify on remove",
      }),
    );
    let notified = false;
    const unsub = appState.subscribe(() => {
      notified = true;
    });
    appState.removeEvent("test-uid-rn");
    unsub();
    assert(notified, "listener should have been called");
  });

  // ── calendarView ────────────────────────────────────────────────────────────

  test("calendarView can be set to each valid view", [], () => {
    for (const view of Object.values(CalendarViews)) {
      appState.calendarView = view;
      assertEqual(appState.calendarView, view);
    }
  });

  test("calendarView setter notifies listeners", [], () => {
    let notified = false;
    const unsub = appState.subscribe(() => {
      notified = true;
    });
    appState.calendarView = CalendarViews.Month;
    unsub();
    assert(notified, "listener should have been called");
  });

  test("calendarView setter throws on invalid value", [], () => {
    let threw = false;
    try {
      appState.calendarView = "yearly";
    } catch {
      threw = true;
    }
    assert(threw, "should throw for invalid view");
  });

  // ── dateView ────────────────────────────────────────────────────────────────

  test("dateView accepts valid YYYY-MM-DD dates", [], () => {
    appState.dateView = "2024-01-01";
    assertEqual(appState.dateView, "2024-01-01");
    appState.dateView = "2099-12-31";
    assertEqual(appState.dateView, "2099-12-31");
  });

  test("dateView rejects invalid formats", [], () => {
    for (const d of [
      "2024-1-1",
      "24-01-01",
      "2024/01/01",
      "1999-01-01",
      "not-a-date",
    ]) {
      let threw = false;
      try {
        appState.dateView = d;
      } catch {
        threw = true;
      }
      assert(threw, `should reject "${d}"`);
    }
  });

  test("dateView setter notifies listeners", [], () => {
    let notified = false;
    const unsub = appState.subscribe(() => {
      notified = true;
    });
    appState.dateView = "2025-03-15";
    unsub();
    assert(notified, "listener should have been called");
  });

  test("dateViewObject returns correct Date for set dateView", [], () => {
    appState.dateView = "2025-06-20";
    const d = appState.dateViewObject;
    assertEqual(d.getFullYear(), 2025);
    assertEqual(d.getMonth(), 5); // 0-indexed
    assertEqual(d.getDate(), 20);
  });

  // ── getSnapshot ─────────────────────────────────────────────────────────────

  test("getSnapshot reflects current calendarView", [], () => {
    appState.calendarView = CalendarViews.Week;
    assertEqual(appState.getSnapshot().calendarView, CalendarViews.Week);
  });

  test("getSnapshot reflects current dateView", [], () => {
    appState.dateView = "2026-01-01";
    assertEqual(appState.getSnapshot().dateView, "2026-01-01");
  });

  test(
    "getSnapshot allEventsByDate updates after addEvent",
    ["test-uid-snap"],
    () => {
      appState.addEvent(
        new CalendarEvent({
          UID: "test-uid-snap",
          date: "2026-02-14",
          timeStart: "09:00",
          timeEnd: "10:00",
          title: "Valentine's",
        }),
      );
      assert(
        appState
          .getSnapshot()
          .allEventsByDate.get("2026-02-14")
          ?.some((e) => e.UID === "test-uid-snap"),
        "snapshot should reflect new event",
      );
    },
  );

  // ── subscribe / unsubscribe ─────────────────────────────────────────────────

  test(
    "unsubscribe stops further notifications",
    ["test-uid-u1", "test-uid-u2"],
    () => {
      let count = 0;
      const unsub = appState.subscribe(() => {
        count++;
      });
      appState.addEvent(
        new CalendarEvent({
          UID: "test-uid-u1",
          date: "2026-03-01",
          timeStart: "09:00",
          timeEnd: "10:00",
          title: "First",
        }),
      );
      unsub();
      appState.addEvent(
        new CalendarEvent({
          UID: "test-uid-u2",
          date: "2026-03-02",
          timeStart: "09:00",
          timeEnd: "10:00",
          title: "Second",
        }),
      );
      assertEqual(count, 1, "should only have been notified once");
    },
  );

  test("multiple listeners all notified on change", ["test-uid-ml"], () => {
    let a = 0,
      b = 0;
    const unsubA = appState.subscribe(() => a++);
    const unsubB = appState.subscribe(() => b++);
    appState.addEvent(
      new CalendarEvent({
        UID: "test-uid-ml",
        date: "2026-04-01",
        timeStart: "09:00",
        timeEnd: "10:00",
        title: "Multi-listener",
      }),
    );
    unsubA();
    unsubB();
    assertEqual(a, 1);
    assertEqual(b, 1);
  });

  // ─── Restore globals, calendarView, and dateView ─────────────────────────────

  globalThis.confirm = originalConfirm;
  appState.calendarView = initialCalendarView;
  appState.dateView = new Date().toLocaleDateString("en-CA");

  // ─── Results ─────────────────────────────────────────────────────────────────

  console.log(`✅ AppState — ${passed}/${total} Tests Passed!`);
}
