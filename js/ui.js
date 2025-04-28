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
  selectedNoteColor,
  setEditingNoteData,
} from "./state.js";
import { sessions } from "./state.js";
import { saveCanvas } from "./storage.js";

export function openNoteEditor(action, sectionId, noteId = null) {
  noteEditorModal.classList.remove("hidden");
  noteTextArea.value = "";

  if (action === "edit" && noteId) {
    const section = sessions
      .find((session) => session.sections.some((sec) => sec.id === sectionId))
      ?.sections.find((sec) => sec.id === sectionId);

    const note = section?.notes.find((note) => note.id === noteId);
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
  setEditingNoteData({ action, sectionId, noteId, selectedNoteColor });
}

export function closeNoteEditor() {
  noteEditorModal.classList.add("hidden");
  setEditingNoteData(null);
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
