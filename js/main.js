// app.js
import { initIcons } from "./icons.js";
import { loadSessions } from "./storage.js";
import { setupEventListeners } from "./events.js";
import { setupDragAndDrop } from "./dragdrop.js"; // If you want separate drag-drop
import { noteColorButtons } from "./dom.js";

function init() {
   initIcons();
  loadSessions();
  setupEventListeners();
  setupDragAndDrop();
  noteColorButtons[0].classList.add("ring-2", "ring-blue-500");
}

window.onload = init;
// window.onbeforeunload = function () {
//   return "Are you sure you want to leave? Your changes may not be saved.";
// };
