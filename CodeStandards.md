# CWI Planner Code Standards

## CalendarEvent Class

All calendar events are instances of the `CalendarEvent` class. Import and use this class for TypeScript typing anywhere you are passing or returning `CalendarEvent` objects.

```javascript
{
  UID: string,         // Unique identifier created with generateUID()
  date: string,        // YYYY-MM-DD format, e.g. "2025-04-15"
  timeStart: string,   // 24 hr time, e.g. "14:30" - use 15 minute increments
  timeEnd: string,     // 24 hr time, e.g. "15:00" - use 15 minute increments
  title: string,       // Display name of the event
  description: string, // Additional details about the event
  address: string,     // Location of the event
  color: string        // Hex code, e.g. "#ff5733"
}
```

## AppState Class

#### The `appState.ts` module is what's known as a "_single source of truth_" for the calendar event data in our app.

Anywhere in our app that you need to read, load, add, or remove calendar events should be done by importing `appState` and using the properties and methods on that class.

Same goes for accessing or modifying `dateView` and `calendarView`: always do that through the getters and setters for `appState.dateView` and `appState.calendarView`.

When the app first loads, any events saved in `localStorage` are loaded into two `map` data structures: `appState.allEventsByUID` and `appState.allEventsByDate`.

---

### `appState.allEventsByUID`

Stores events in {"UID" : CalendarEvent} pairs, so `appState.getEventByUID("UID")` will return the object with that UID. This is `O(1)` constant time complexity, so no iterating through the entire array.

### `appState.allEventsByDate`

Stores events in {"YYYY-MM-DD" : CalendarEvent[]} pairs, so `appState.getEventsByDate("YYYY-MM-DD")` will return an array with all calendar event objects for that date. This is also `O(1)` constant time complexity.

---

## Main.js

Projects with many moving parts generally have a `main.js`, `app.js`, or `index.js` file that serves as the entry point for the app. Our `main.js` file should be as short and easy to understand as possible.

Ideally we should import the bare minimum modules needed, and main should consist of several lines of function calls that load and initialize the data and elements needed to start the app.

All the actual code should be contained in the modules being called, i.e. there shouldn't be function definitions or React rendering logic inside of `main.js`.

Whatever the project, the entry point file works best when it looks something like this:

```javascript
import dataModule from location
import anotherModule from location
import otherStuff from location

loadStuff()
loadMoreStuff()

setThings()
setSomeOtherThings()

initializeDisplays()
injectFrameworkComponents()
```

This keeps everything abstract and makes it extremely easy to follow the logic and order of what the app is doing. From main, you can then look at the various modules being called and gradually dive into more detail and complexity.

To put it another way, **_main should be as abstract, high-level as possible_** while all the concrete, low-level code should be tucked away and encapsulated within appropriate modules.

## Bootstrap and CSS

Make sure that any elements you're styling for color are using Bootstrap's primary classes and variables.

So for classes you set on elements, that's `.text-primary` and `.bg-primary` for text color and background color.

You can also use those same colors in your .CSS files with `var(--bs-primary)` and var`(--bs-primary-rgb)`.

### Light Theme

Our app has a light/dark mode toggle, and this applies a `.dark-mode` class to the HTML `body` element.

Bootstrap automatically toggles basic text color and background color values, but if you want or need to use custom CSS to style your components for dark mode, this is how you would set properties for your class that are only applied when dark mode is on: 

```css
body.dark-mode .menuItemIcon {
  filter: invert(1);
}
```

This will only apply to `.menuItemIcon` when `body` has the `.dark-mode` class. So in this example, the `.menuItemIcon`, which is an .SVG icon, will be it's normal black color in light mode, but when dark mode is on it will invert 100% turning it white so it shows properly on a dark background. 

## Comments

Please comment your code. This project has contributors at different experience levels, so comments explaining _what the code does_ are encouraged.

Also remember that **_descriptive names for your variables and functions_** are a form of commenting too. Effectively naming variables is simultaneously one of the most difficult and useful skills for a developer to build!

Take advantage of the fact that all IDEs have auto-complete, so it's not really a problem to have longer names if they help everyone to read and understand the code better.

`load()` might be short and easy to type, but `loadAllEvents()` is actually informative, and you only have to type the first few letters anyway before your IDE will let you auto-complete the rest, so err on the side of being extra descriptive with your variables and function names.

**Good example:**

```javascript
// Creates a popup for the event clicked that shows more info about it.
function showClickedEventPopup(event)
```

JSDoc comments are especially appreciated on functions, as you can specify the parameters and return types.

### With functions being exported and imported elsewhere in the repository, JSDoc comments are essential because your IDE will display the comment in a pop-up whenever you hover your mouse over the function name, allowing you to see what a function expects, does, and returns without having to go look in the file.

```javascript
/**
   * Returns an array of CalendarEvent objects for the specified date.
   * If no events exist for that date, returns an empty array.
   *
   * @param date "YYYY-MM-DD" formatted date string to retrieve events for
   * @returns Array of CalendarEvent objects for the specified date,
   * or [] if no events exist for that date
   */
  getEventsByDate(date: string): CalendarEvent[]
```

## Formatting

I strongly suggest installing the `Prettier` code formatting extension on your IDE.

VSCode has a `>Format Document` command in the command palette. The first time you use it, it may ask you to designate a default formatter: you can select Prettier if you have it installed.

I have format document bound to `shift+alt+f` so I can easily clean up and standardize the files I'm working on. If everyone is using it on files they submit, then the whole codebase stays consistent and readable.

## Naming Conventions

- Variables and functions: `camelCase`
- CSS classes: `kebab-case`

## Understand and Test Everything You Submit

We're here to learn and grow, so don't `copy + paste` code from a website or LLM output that you don't understand. I expect that you can explain what your code is doing and how.

Also make sure you're actually testing your features and checking that `console` isn't throwing errors. Writing automated unit tests for your code is the ideal standard, but if you don't do that then you need to just play around in the app and make sure your buttons, forms, menus, etc. are working as expected.

## Use GitHub Branches

Always develop new features on an aptly-named branch in your repository like `settings-menu`. Make sure you are watching GH or the Discord for updates and using `git pull` to always keep your main branch in sync with latest.

Before you submit a PR, make sure you have merged the latest snapshot of main into your branch so there will be no merge conflicts.

---

_More standards may be added as the project develops. I'll let everyone know in Discord if I update this._
