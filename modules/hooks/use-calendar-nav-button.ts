import { useCallback } from "react";
import appState from "../appState";
import { CalendarViews } from "../enumCalendarViews";

/**
 * A hook that handles the click event for a calendar navigation button that navigates the calendar by day, week, or month.
 * @param navDirectionType - The direction to navigate the calendar.
 * @param onAfterNavigate - The function to call after the calendar is navigated (e.g to re-render the calendar with the new date).
 * @returns The function to handle the click event.
 */
export function useCalendarNavButtonHandler(
  navDirectionType: "next" | "previous",
  onAfterNavigate: () => void,
) {
  return useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      const navDirection = navDirectionType === "next" ? 1 : -1;
      applyCalendarNavigation(navDirection);

      onAfterNavigate();
    },
    [navDirectionType, onAfterNavigate],
  );
}

/**
 * Calculates and applies the new date to the `appState.dateView` based on the navigation direction and current view.
 * @param navDirection - The direction to navigate the calendar.
 */
export function applyCalendarNavigation(navDirection: number): void {
  const currentDate = appState.dateViewObject;

  // Check that the navigation direction is valid.
  if (navDirection !== 1 && navDirection !== -1) {
    throw new Error("Invalid navigation direction. Must be 1 or -1.");
  }

  // Read view mode at click time so Day/Week/Month toggles apply even if this subtree was not re-rendered.
  switch (appState.calendarView) {
    case CalendarViews.Day:
      appState.dateView = addDay(currentDate, navDirection);
      break;
    case CalendarViews.Week:
      appState.dateView = addWeek(currentDate, navDirection);
      break;
    case CalendarViews.Month:
      appState.dateView = addMonth(currentDate, navDirection);
      break;
    default:
      throw new Error(
        `Calendar view ${appState.calendarView} is not supported. Please add support for this view.`,
      );
  }
}

// Adds a single day to the view date
function addDay(date: Date, navDirection: number): string {
  const newDate = new Date(date.getTime());
  newDate.setDate(newDate.getDate() + navDirection);
  return newDate.toLocaleDateString("en-CA");
}

// Adds a single week to the view date
function addWeek(date: Date, navDirection: number): string {
  return addDay(date, navDirection * 7);
}

// Adds a single month to the view date. Clamps the day (e.g. Mar 31 + 1 → Apr 30) so
// setMonth does not overflow into the next month.
function addMonth(date: Date, navDirection: number): string {
  return clampDayToAddedMonth(date, navDirection).toLocaleDateString("en-CA");
}

// Keeps the original day unless it would overflow into the next month, in which case it clamps to the last day of the month.
function clampDayToAddedMonth(date: Date, navDirection: number): Date {
  const day = date.getDate();
  const newDate = new Date(date.getTime());
  // Set the day to the first day of the month
  newDate.setDate(1);
  // Add the delta months
  newDate.setMonth(newDate.getMonth() + navDirection);
  // Get the last day of the month
  const lastDay = new Date(
    newDate.getFullYear(),
    newDate.getMonth() + 1,
    0,
  ).getDate();

  // Set the day to the minimum of the current day and the last day of the month
  newDate.setDate(Math.min(day, lastDay));
  return newDate;
}

export { addDay, addWeek, addMonth };
