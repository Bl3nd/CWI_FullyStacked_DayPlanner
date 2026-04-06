import "../styling/settingsMenu.css";

import appSettings from "./settings";

// Icons for menuItems
import moonIcon from "../assets/icons/moon.svg";
import thermIcon from "../assets/icons/thermometer.svg";
import calIcon from "../assets/icons/calendar-1.svg";
import giftIcon from "../assets/icons/gift.svg";
import paletteIcon from "../assets/icons/palette.svg";

let menuIsOpen = false;

// Props objects passed to createMenuItem for setting
// text, icons, and functionality to each menu item
const menuItems = [
  {
    name: "Light Mode",
    icon: moonIcon,
    setting: function () {
      return appSettings.lightMode;
    },
    click: appSettings.toggleLightMode,
  },
  {
    name: "Temp Unit",
    icon: thermIcon,
    setting: function () {
      return appSettings.tempUnit[0] + "°";
    },
    click: appSettings.toggleTempUnit,
  },
  {
    name: "Week Start",
    icon: calIcon,
    setting: function () {
      // Get first 3 letters of day, e.g. "Mon"
      return appSettings.firstDayOfWeek.slice(0, 3);
    },
    click: appSettings.toggleFirstDayOfWeek,
  },
  {
    name: "Show Holidays",
    icon: giftIcon,
    setting: function () {
      return appSettings.displayHolidays;
    },
    click: appSettings.toggleDisplayHolidays,
  },
  {
    name: "Color Theme",
    icon: paletteIcon,
    setting: function () {
      return appSettings.colorTheme;
    },
    click: function () {}, // TODO: add drop-down color selection
  },
];

// This creates the hamburger-style menu icon in the upper right of
// the app that opens/closes the menu when pressed.
function createMenuButton() {
  const menuButton = document.createElement("div");
  menuButton.classList.add("settingsMenuButton");
  menuButton.onclick = () => {
    menuIsOpen ? closeMenu() : openMenu();
  };

  return menuButton;
}

// This is the main container that holds the list of menu setting items.
// It opens when the menu button is pressed, and closes when the menu button
// is pressed again or the user clicks somewhere outside of the menu container
function createMenuContainer() {
  // This is the menuContainer that opens/shows when the menu button is pressed
  const menuContainer = document.createElement("div");
  menuContainer.classList.add("settingsMenuContainer");
  menuContainer.classList.add("hidden"); // not showing initially

  const itemsContainer = document.createElement("div");
  itemsContainer.classList.add("settingsMenuItemsContainer", "bg-body");
  menuContainer.append(itemsContainer);

  // Iterate through menuItems creating a display element for each one
  // based on the object properties
  menuItems.forEach((item) => {
    const element = createMenuItem(item);
    itemsContainer.append(element);
  });

  return menuContainer;
}

// This creates each line in the menu based on the values in menuItems
function createMenuItem(props) {
  const container = document.createElement("div");
  container.classList.add("menuItemContainer");

  const name = document.createElement("p");
  name.classList.add("menuItemName");
  name.textContent = props.name;

  const icon = document.createElement("img");
  icon.classList.add("menuItemIcon");
  icon.src = props.icon;

  const setting = document.createElement("p");
  setting.classList.add("menuItemSetting");
  setting.textContent = props.setting();

  container.append(icon);
  container.append(name);
  container.append(setting);

  // Change setting in appSettings and update setting text
  container.onclick = () => {
    props.click();
    setting.textContent = props.setting();
  };

  return container;
}

function openMenu() {
  menuButton.classList.toggle("settingsMenuClose");
  menuContainer.classList.toggle("hidden");
  menuIsOpen = true;
  document.addEventListener("click", outsideClickListener);
}

function closeMenu() {
  const menuItemsContainer = document.getElementsByClassName(
    "settingsMenuItemsContainer",
  )[0];
  menuItemsContainer.classList.add("closing");

  // Wait for the closing animation to finish before hiding the menu and toggling the menu button
  menuItemsContainer.addEventListener(
    "animationend",
    () => {
      menuItemsContainer.classList.remove("closing");
      menuButton.classList.toggle("settingsMenuClose");
      menuContainer.classList.toggle("hidden");
      menuIsOpen = false;
      appSettings.saveSettings();
      document.removeEventListener("click", outsideClickListener);
    },
    { once: true },
  ); // 'once' ensures the event listener is removed after it runs
}

function outsideClickListener(event) {
  if (event.target === menuButton) return;

  const menuItems = document.querySelectorAll(".menuItemContainer");

  // Check if the event.target clicked matches any of the menu items
  const clickedInsideMenu = [...menuItems].some((item) =>
    item.contains(event.target),
  );
  if (!clickedInsideMenu) {
    closeMenu();
  }
}

let menuButton;
let menuContainer;

/**
 * Places the menu button and (initially hidden) menu container
 * first in the list of children for the document body.
 * These elements have 'position: absolute' so they will display
 * in the upper right corner of the app regardless of how the rest
 * of the elements are styled.
 */
function createSettingsMenu() {
  menuButton = createMenuButton();
  menuContainer = createMenuContainer();

  document.body.prepend(menuContainer);
  document.body.prepend(menuButton);
}

export default createSettingsMenu;
