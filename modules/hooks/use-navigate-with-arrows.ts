import { useEffect, useEffectEvent } from "react";
import { applyCalendarNavigation } from "./use-calendar-nav-button";

/**
 * A hook that navigates the calendar with the arrow keys.
 * @param onAfterRender - Function to call when the navigation is complete.
 */
export const useNavigateWithArrows = (onAfterRender: () => void) => {
  // Handle applying the navigation and calling the function that will is supposed to be ran after the navigation.
  const handleArrowStep = useEffectEvent(
    (delta: number, onAfterRender: () => void) => {
      applyCalendarNavigation(delta); // Apply the navigation.
      onAfterRender(); // Call the function that will refresh the calendar.
    },
  );

  // Handle the keyboard event to navigate the calendar with the arrows.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // If the key is not an arrow key, return.
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      // If the target is not a regular HTML element, return.
      if (isEditableControlTarget(event.target)) return;
      // Prevent the default behavior of the event.
      event.preventDefault();
      // Call the useEffectEvent hook that will handle the navigation.
      handleArrowStep(event.key === "ArrowLeft" ? -1 : 1, onAfterRender);
    };

    window.addEventListener("keydown", onKeyDown); // Register the keyboard listener.
    return () => window.removeEventListener("keydown", onKeyDown); // Unregister the keyboard listener.
  }, []);
};

function isEditableControlTarget(target: EventTarget | null): boolean {
  // If the target is not a regular HTML element, return false.
  if (!(target instanceof HTMLElement)) return false;

  const tag = target.tagName.toLowerCase();
  // If the tag is an input or another form element, return true.
  if (tag === "input" || tag === "textarea" || tag === "select") return true;

  // If the target is content editable, return true. This is to prevent the calendar navigation buttons from being focused when the user is typing in an input or textarea.
  return target.isContentEditable;
}
