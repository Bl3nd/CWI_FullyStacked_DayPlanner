import CalendarEvent from "../modules/classCalendarEvent";

function eventTests() {
  let passed = 0;
  let failed = 0;

  // Helper: expects the constructor to THROW
  function expectFailure(label, options) {
    try {
      new CalendarEvent(options);
      console.error(
        `❌ FAIL — "${label}": Expected an error but Event was created successfully.`,
      );
      failed++;
    } catch (e) {
      console.log(`✅ PASS — "${label}": Correctly threw → ${e.message}`);
      passed++;
    }
  }

  // Helper: expects the constructor to SUCCEED
  function expectSuccess(label, options) {
    try {
      const event = new CalendarEvent(options);
      console.log(`✅ PASS — "${label}": Event created successfully.`, event);
      passed++;
    } catch (e) {
      console.error(`❌ FAIL — "${label}": Unexpected error → ${e.message}`);
      failed++;
    }
  }

  // Helper for length checks since we're asserting a value, not pass/fail
  function expectLength(label, options, expectedLength) {
    try {
      const event = new CalendarEvent(options);
      if (event.length === expectedLength) {
        console.log(
          `✅ PASS — "${label}": length is ${expectedLength} minutes.`,
        );
        passed++;
      } else {
        console.error(
          `❌ FAIL — "${label}": expected ${expectedLength} minutes but got ${event.length}.`,
        );
        failed++;
      }
    } catch (e) {
      console.error(`❌ FAIL — "${label}": Unexpected error → ${e.message}`);
      failed++;
    }
  }

  // ─── MISSING REQUIRED FIELDS ─────────────────────────────────────────────────

  console.group("Missing required fields");
  expectFailure("Missing date", {
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("Missing timeStart", {
    date: "2025-03-01",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("Missing timeEnd", {
    date: "2025-03-01",
    timeStart: "09:00",
    title: "Meeting",
  });
  expectFailure("Missing title", {
    date: "2025-03-01",
    timeStart: "09:00",
    timeEnd: "10:00",
  });
  expectFailure("Empty string date (falsy)", {
    date: "",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("Empty string title (falsy)", {
    date: "2025-03-01",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "",
  });
  console.groupEnd();

  // ─── INVALID DATE FORMAT ──────────────────────────────────────────────────────

  console.group("Invalid date format");
  expectFailure("Date before year 2000", {
    date: "1999-01-01",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("Date after year 2099", {
    date: "2100-01-01",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("Date in MM-DD-YYYY format", {
    date: "03-01-2025",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("Date in MM/DD/YYYY format", {
    date: "03/01/2025",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("Date with invalid month (00)", {
    date: "2025-00-01",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("Date with invalid month (13)", {
    date: "2025-13-01",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("Date with invalid day (00)", {
    date: "2025-03-00",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("Date with invalid day (32)", {
    date: "2025-03-32",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("Date is a nonsense string", {
    date: "not-a-date",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Meeting",
  });
  console.groupEnd();

  // ─── INVALID TIME FORMAT ──────────────────────────────────────────────────────

  console.group("Invalid time format");
  expectFailure("Time in 12-hour AM format", {
    date: "2025-03-01",
    timeStart: "9:00 AM",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("Time with invalid hour (24)", {
    date: "2025-03-01",
    timeStart: "24:00",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("Time with invalid minutes (60)", {
    date: "2025-03-01",
    timeStart: "09:60",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("Time missing leading zero", {
    date: "2025-03-01",
    timeStart: "9:00",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("Time is a nonsense string", {
    date: "2025-03-01",
    timeStart: "not-a-time",
    timeEnd: "10:00",
    title: "Meeting",
  });
  console.groupEnd();

  // ─── INVALID TIME INCREMENTS ──────────────────────────────────────────────────

  console.group("Invalid time increments (must be 00, 15, 30, 45)");
  expectFailure("timeStart minutes = 10", {
    date: "2025-03-01",
    timeStart: "09:10",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("timeStart minutes = 01", {
    date: "2025-03-01",
    timeStart: "09:01",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectFailure("timeEnd minutes = 20", {
    date: "2025-03-01",
    timeStart: "09:00",
    timeEnd: "10:20",
    title: "Meeting",
  });
  console.groupEnd();

  // ─── INVALID TIME ORDER ───────────────────────────────────────────────────────

  console.group("Invalid time order");
  expectFailure("timeEnd before timeStart", {
    date: "2025-03-01",
    timeStart: "10:00",
    timeEnd: "09:00",
    title: "Meeting",
  });
  expectFailure("timeEnd equal to timeStart", {
    date: "2025-03-01",
    timeStart: "09:00",
    timeEnd: "09:00",
    title: "Meeting",
  });
  expectFailure("timeEnd one increment before timeStart", {
    date: "2025-03-01",
    timeStart: "09:15",
    timeEnd: "09:00",
    title: "Meeting",
  });
  console.groupEnd();

  // ─── INVALID PROPERTY TYPES ───────────────────────────────────────────────────

  console.group("Invalid property types");
  expectFailure("title is a number", {
    date: "2025-03-01",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: 42,
  });
  expectFailure("description is a number", {
    date: "2025-03-01",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Meeting",
    description: 123,
  });
  expectFailure("address is an array", {
    date: "2025-03-01",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Meeting",
    address: ["123 Main St"],
  });
  expectFailure("color is a boolean", {
    date: "2025-03-01",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Meeting",
    color: true,
  });
  expectFailure("color is invalid CSS", {
    date: "2025-03-01",
    timeStart: "11:00",
    timeEnd: "12:00",
    title: "Lunch",
    color: "reddishly",
  });
  expectFailure("color is invalid RGB", {
    date: "2025-03-01",
    timeStart: "11:00",
    timeEnd: "12:00",
    title: "Lunch",
    color: "rgb(pancakes,255,255)",
  });
  console.groupEnd();

  // ─── VALID CONSTRUCTIONS ──────────────────────────────────────────────────────

  console.group("Valid Event constructions");
  expectSuccess("Minimum required fields", {
    date: "2025-03-01",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Meeting",
  });
  expectSuccess("All fields provided", {
    date: "2025-06-15",
    timeStart: "08:30",
    timeEnd: "09:45",
    title: "Team Standup",
    description: "Weekly sync",
    address: "123 Main St",
    color: "#FF0000",
  });
  expectSuccess("With a pre-existing UID (from storage)", {
    UID: "abc-123",
    date: "2025-12-31",
    timeStart: "23:00",
    timeEnd: "23:45",
    title: "New Year's Eve",
  });
  expectSuccess("Year boundary: 2000", {
    date: "2000-01-01",
    timeStart: "09:00",
    timeEnd: "09:15",
    title: "Y2K Survivor Party",
  });
  expectSuccess("Year boundary: 2099", {
    date: "2099-12-31",
    timeStart: "09:00",
    timeEnd: "09:15",
    title: "Far Future Event",
  });
  expectSuccess("Optional fields omitted", {
    date: "2025-03-01",
    timeStart: "14:00",
    timeEnd: "14:45",
    title: "Solo Event",
  });
  expectSuccess("Extra properties are ignored", {
    date: "2025-03-01",
    timeStart: "09:00",
    timeEnd: "10:00",
    title: "Meeting",
    extraProp: "ignored",
  });
  expectSuccess("Out of range color values are still valid CSS", {
    date: "2025-03-01",
    timeStart: "11:00",
    timeEnd: "12:00",
    title: "Dinner",
    color: "rgb(280,280,300)",
  });
  console.groupEnd();

  // ─── LENGTH GETTER ────────────────────────────────────────────────────────────

  console.group("Length getter");

  expectLength(
    "1 hour event",
    {
      date: "2025-03-01",
      timeStart: "09:00",
      timeEnd: "10:00",
      title: "Meeting",
    },
    60,
  );
  expectLength(
    "30 minute event",
    {
      date: "2025-03-01",
      timeStart: "09:00",
      timeEnd: "09:30",
      title: "Meeting",
    },
    30,
  );
  expectLength(
    "15 minute event",
    {
      date: "2025-03-01",
      timeStart: "09:00",
      timeEnd: "09:15",
      title: "Meeting",
    },
    15,
  );
  expectLength(
    "Cross-hour boundary",
    {
      date: "2025-03-01",
      timeStart: "09:45",
      timeEnd: "10:15",
      title: "Meeting",
    },
    30,
  );
  expectLength(
    "Multi-hour event",
    {
      date: "2025-03-01",
      timeStart: "08:00",
      timeEnd: "11:00",
      title: "Meeting",
    },
    180,
  );
  expectLength(
    "Late night event",
    {
      date: "2025-03-01",
      timeStart: "23:00",
      timeEnd: "23:45",
      title: "Meeting",
    },
    45,
  );

  console.groupEnd();

  // ─── SUMMARY ─────────────────────────────────────────────────────────────────

  console.log(
    `\n📋 Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests.`,
  );
  if (failed === 0) {
    console.log("🎉 All tests passed!");
  } else {
    console.warn(`⚠️  ${failed} test(s) failed. See above for details.`);
  }
}

export default eventTests;
