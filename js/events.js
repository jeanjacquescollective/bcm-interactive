// events.js
import {
  canvasTitleInput,
  addNoteButtons,
  helpIcons,
  noteCancelBtn,
  noteSaveBtn,
  noteColorButtons,
  manageCanvasesBtn,
  closeSessionsBtn,
  createSessionBtn,
  helpBtn,
  closeHelpBtn,
  languageToggle,
  nlLanguageElements,
  enLanguageElements,
} from "./dom.js";
import { saveCanvas, createNewSession } from "./storage.js";
import {
  openNoteEditor,
  closeNoteEditor,
  saveNote,
  openSessionsModal,
  closeSessionsModal,
} from "./ui.js";
import {
  currentSessionId,
  editingNoteData,
  setEditingNoteData,
} from "./state.js";

export function setupEventListeners() {
  canvasTitleInput.addEventListener("input", saveCanvas);

  addNoteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sectionId = button.dataset.section;

      openNoteEditor("add", currentSessionId, sectionId);
    });
  });

  helpIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const section = icon.dataset.section;
      const helpText = document.getElementById(`help-${section}`);
      helpText.classList.toggle("hidden");
    });
  });

  noteCancelBtn.addEventListener("click", closeNoteEditor);
  noteSaveBtn.addEventListener("click", saveNote);

  noteColorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      noteColorButtons.forEach((btn) =>
        btn.classList.remove("ring-2", "ring-blue-500")
      );
      button.classList.add("ring-2", "ring-blue-500");
      setEditingNoteData({
        ...editingNoteData,
        selectedNoteColor: button.dataset.color,
      });
      console.log("Selected color:", editingNoteData);
    });
  });

  manageCanvasesBtn.addEventListener("click", openSessionsModal);
  closeSessionsBtn.addEventListener("click", closeSessionsModal);
  createSessionBtn.addEventListener("click", () => createNewSession());
  helpBtn.addEventListener("click", () => helpModal.classList.remove("hidden"));
  closeHelpBtn.addEventListener("click", () =>
    helpModal.classList.add("hidden")
  );

  languageToggle.addEventListener("click", () => {
    console.log("Language toggle clicked");
    const currentLanguage = languageToggle.dataset.lang || "en";
    const newLanguage = currentLanguage === "en" ? "nl" : "en";
    languageToggle.dataset.lang = newLanguage;
    // languageToggle.textContent = newLanguage === "en" ? "Switch to Spanish" : "Switch to English";
    nlLanguageElements.forEach((el) => {
      el.classList.toggle("hidden", newLanguage !== "nl");
    });
    enLanguageElements.forEach((el) => {
      el.classList.toggle("hidden", newLanguage !== "en");
    });
  });
}
