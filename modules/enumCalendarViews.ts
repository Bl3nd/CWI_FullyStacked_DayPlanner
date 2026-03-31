/**
 * Valid views for setting and displaying view of Calendar UI:
 * Day, Week, Month
 *
 * Used in appState to ensure only valid views are set, and in dataStorage to save/load view from localStorage.
 * Use anywhere else in the app where you need to reference calendar views to ensure consistency and type safety.
 */
export enum CalendarViews {
  Day = "day",
  Week = "week",
  Month = "month",
}
