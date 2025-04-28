// dragdrop.js
import { moveNote } from "./canvas.js";
import { saveCanvas } from "./storage.js";
import { sectionIds } from "./state.js";

export function setupDragAndDrop() {
  sectionIds.forEach((sectionId) => {
    const container = document.getElementById(`notes-${sectionId}`);

    container.addEventListener("dragstart", (e) => {
      const note = e.target.closest(".note");
      if (note) {
        e.dataTransfer.setData("text/plain", JSON.stringify({
          sectionId,
          noteId: note.dataset.id
        }));
      }
    });

    container.addEventListener("dragover", (e) => {
      e.preventDefault(); // Necessary to allow dropping
    });

    container.addEventListener("drop", (e) => {
      e.preventDefault();
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const targetSectionId = sectionId;

      if (data.sectionId !== targetSectionId) {
        moveNote(data.sectionId, targetSectionId, data.noteId);
        saveCanvas();
      }
    });
  });
}
