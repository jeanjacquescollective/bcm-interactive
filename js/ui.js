// ui.js
import { addNoteToSection, updateNoteInSection } from "./canvas.js";
import {
  noteEditorModal,
  noteEditorTitle,
  noteTextArea,
  sessionsModal,
  sessionsListContainer,
} from "./dom.js";
import {
  editingNoteData,
  resetEditingNoteData,
  setEditingNoteData,
} from "./state.js";
import { sessions } from "./state.js";
import { loadSession, saveCanvas } from "./storage.js";

export function openNoteEditor(action, sessionId, sectionId, noteId = null) {
  noteEditorModal.classList.remove("hidden");
  noteTextArea.value = "";

  if (action === "edit" && noteId) {
    console.log(sessions, sessionId, noteId);
    const session = sessions.find((session) => session.id === sessionId);
    console.log(session);
    const section = session
      ?.data?.[sectionId];
    console.log(section);
    const note = section?.find((note) => parseInt(note.id, 10) === parseInt(noteId, 10));
    console.log(note);
    if (note) {
      noteTextArea.value = note.text;
      const colorButtons = document.querySelectorAll(".note-color-btn");
      colorButtons.forEach((button) => {
        if (button.dataset.color === note.color) {
          button.classList.add("ring-2", "ring-blue-500");
        } else {
          button.classList.remove("ring-2", "ring-blue-500");
        }
      });
    }
  }
  noteTextArea.focus();

  noteEditorTitle.textContent = action === "add" ? "Add Note" : "Edit Note";
  const selectedNoteColor = editingNoteData.selectedNoteColor || "#ffffff";
  setEditingNoteData({ action, sectionId, noteId, selectedNoteColor });
}

export function closeNoteEditor() {
  noteEditorModal.classList.add("hidden");
}

export function saveNote() {
  const text = noteTextArea.value.trim();
  if (text) {
    const { action, sectionId, noteId, selectedNoteColor } = editingNoteData;
    if (action === "add") {
      const newNoteId = Date.now();
      addNoteToSection(sectionId, text, selectedNoteColor, newNoteId);
    } else if (action === "edit" && noteId) {
      updateNoteInSection(sectionId, noteId, text, selectedNoteColor);
    }
    closeNoteEditor();
    saveCanvas();
  }
}

export function openSessionsModal() {
  sessionsModal.classList.remove("hidden");
  renderSessionsList();
}

export function closeSessionsModal() {
  sessionsModal.classList.add("hidden");
}

function renderSessionsList() {
  sessionsListContainer.innerHTML = "";
  sessions.forEach((session) => {
    const sessionItem = document.createElement("div");
    sessionItem.className = "p-2 border-b cursor-pointer hover:bg-gray-100";
    sessionItem.textContent = session.name;
    sessionItem.addEventListener("click", () => {
      loadSession(session.id);
      sessionsModal.classList.add("hidden");
    });
    sessionsListContainer.appendChild(sessionItem);
  });
}


export function openSidebar() {
  const sidebar = document.querySelector("#sidebar");
  if (sidebar) {
    sidebar.classList.remove("hidden");
  }
}

export function closeSidebar() {
  const sidebar = document.querySelector("#sidebar");
  if (sidebar) {
    sidebar.classList.add("hidden");
  }
}