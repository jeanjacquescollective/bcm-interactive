// canvas.js
import { currentSessionId, sectionIds } from "./state.js";
import { saveCanvas } from "./storage.js";
import { openNoteEditor } from "./ui.js";

export function setCanvasData(data) {
  sectionIds.forEach((sectionId) => {
    const notesContainer = document.getElementById(`notes-${sectionId}`);
    notesContainer.innerHTML = "";
    if (data[sectionId]) {
      data[sectionId].forEach((note) => {
        addNoteToSection(sectionId, note.text, note.color, note.id);
      });
    }
  });
}

export function getCanvasData() {
  const data = {};
  sectionIds.forEach((sectionId) => {
    const notesContainer = document.getElementById(`notes-${sectionId}`);
    const notes = Array.from(notesContainer.children).map((note) => ({
      text: note.querySelector(".note-text").textContent,
      color: note.dataset.color,
      id: parseInt(note.dataset.id),
    }));
    data[sectionId] = notes;
  });
  return data;
}

export function addNoteToSection(sectionId, text, color, noteId) {
  const notesContainer = document.getElementById(`notes-${sectionId}`);
  const noteElement = document.createElement("div");
  noteElement.className =
    "note bg-white rounded-lg shadow p-2 mb-2 cursor-move";
  noteElement.style.backgroundColor = color;
  noteElement.draggable = true;
  noteElement.dataset.id = noteId;
  noteElement.dataset.color = color;
  noteElement.innerHTML = `<span class="note-text">${text}</span>`;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "text-red-500 hover:text-red-700 ml-2 text-xs";
  deleteBtn.innerHTML = "&times;";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    notesContainer.removeChild(noteElement);
    saveCanvas();
  });

  const updateButton = document.createElement("button");
    updateButton.className = "text-blue-500 hover:text-blue-700 ml-2 text-xs";
    updateButton.innerHTML = "Edit";
    updateButton.addEventListener("click", (e) => {
        e.stopPropagation();
        const noteText = noteElement.querySelector(".note-text").textContent;
        const noteColor = noteElement.dataset.color;
        const noteId = noteElement.dataset.id;
        openNoteEditor("edit", currentSessionId, sectionId, noteId, noteText, noteColor);
        }
    );
    noteElement.appendChild(updateButton);

  noteElement.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        sectionId,
        noteId: noteElement.dataset.id,
      })
    );
  });

  noteElement.addEventListener("dragover", (e) => {
    e.preventDefault(); // Necessary to allow dropping
  });

  noteElement.addEventListener("drop", (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const targetSectionId = sectionId;

    if (data.sectionId !== targetSectionId) {
      moveNote(data.sectionId, targetSectionId, data.noteId);
      saveCanvas();
    }
  });

  noteElement.appendChild(deleteBtn);
  notesContainer.appendChild(noteElement);
}

export function updateNoteInSection(sectionId, noteId, newText) {
  const notesContainer = document.getElementById(`notes-${sectionId}`);
  const noteElement = Array.from(notesContainer.children).find(
    (note) => note.dataset.id == noteId
  );
  if (noteElement) {
    noteElement.querySelector(".note-text").textContent = newText;
  }
}

export function moveNote(sourceSectionId, targetSectionId, noteId) {
  const sourceContainer = document.getElementById(`notes-${sourceSectionId}`);
  const targetContainer = document.getElementById(`notes-${targetSectionId}`);
  const noteElement = Array.from(sourceContainer.children).find(
    (note) => note.dataset.id == noteId
  );

  if (noteElement) {
    sourceContainer.removeChild(noteElement);
    targetContainer.appendChild(noteElement);
    saveCanvas();
  }
}
