    // Initialize Feather icons
    document.addEventListener("DOMContentLoaded", () => {
        feather.replace();
      });

      // Canvas state
      let currentSessionId = null;
      let sessions = [];
      let selectedNoteColor = "#FFEB3B"; // Default yellow color
      let editingNoteData = null;

      // DOM elements
      const canvasTitleInput = document.getElementById("canvas-title");
      const lastSavedText = document.getElementById("last-saved");
      const notesContainers = document.querySelectorAll(".notes-container");
      const addNoteButtons = document.querySelectorAll(".add-note-btn");
      const helpIcons = document.querySelectorAll(".help-icon");
      const helpTexts = document.querySelectorAll(".help-text");
      const noteEditorModal = document.getElementById("note-editor-modal");
      const noteEditorTitle = document.getElementById("note-editor-title");
      const noteTextArea = document.getElementById("note-text");
      const noteCancelBtn = document.getElementById("note-cancel-btn");
      const noteSaveBtn = document.getElementById("note-save-btn");
      const noteColorButtons = document.querySelectorAll(".note-color-btn");
      const sessionsModal = document.getElementById("sessions-modal");
      const closeSessionsBtn = document.getElementById("close-sessions-btn");
      const createSessionBtn = document.getElementById("create-session-btn");
      const newSessionNameInput = document.getElementById("new-session-name");
      const sessionsListContainer = document.getElementById("sessions-list");
      const manageCanvasesBtn = document.getElementById("manage-canvases-btn");
      const helpBtn = document.getElementById("help-btn");
      const helpModal = document.getElementById("help-modal");
      const closeHelpBtn = document.getElementById("close-help-btn");

      // Canvas sections
      const sectionIds = [
        "keyPartners",
        "keyActivities",
        "keyResources",
        "valuePropositions",
        "customerRelationships",
        "channels",
        "customerSegments",
        "costStructure",
        "revenueStreams",
      ];

      // Initialize app
      function init() {
        loadSessions();
        setupEventListeners();
        setupDragAndDrop();
        noteColorButtons[0].classList.add("ring-2", "ring-blue-500"); // Highlight default color
      }

      // Setup event listeners
      function setupEventListeners() {
        // Canvas title changes
        canvasTitleInput.addEventListener("input", () => {
          saveCanvas();
        });

        // Add note buttons
        addNoteButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const section = button.dataset.section;
            openNoteEditor("add", section);
          });
        });

        // Help icons
        helpIcons.forEach((icon) => {
          icon.addEventListener("click", () => {
            const section = icon.dataset.section;
            const helpText = document.getElementById(`help-${section}`);
            helpText.classList.toggle("hidden");
          });
        });

        // Note editor modal
        noteCancelBtn.addEventListener("click", closeNoteEditor);
        noteSaveBtn.addEventListener("click", saveNote);

        // Note color selection
        noteColorButtons.forEach((button) => {
          button.addEventListener("click", () => {
            noteColorButtons.forEach((btn) =>
              btn.classList.remove("ring-2", "ring-blue-500")
            );
            button.classList.add("ring-2", "ring-blue-500");
            selectedNoteColor = button.dataset.color;
          });
        });

        // Sessions modal
        manageCanvasesBtn.addEventListener("click", openSessionsModal);
        closeSessionsBtn.addEventListener("click", () => {
          sessionsModal.classList.add("hidden");
        });
        createSessionBtn.addEventListener("click", createNewSession);

        // Help modal
        helpBtn.addEventListener("click", () => {
          helpModal.classList.remove("hidden");
        });
        closeHelpBtn.addEventListener("click", () => {
          helpModal.classList.add("hidden");
        });
      }

      // Setup drag and drop
      function setupDragAndDrop() {
        const canvasSections = document.querySelectorAll(".canvas-section");

        canvasSections.forEach((section) => {
          section.addEventListener("dragover", (e) => {
            e.preventDefault();
            section.classList.add("drag-over");
          });

          section.addEventListener("dragleave", () => {
            section.classList.remove("drag-over");
          });

          section.addEventListener("drop", (e) => {
            e.preventDefault();
            section.classList.remove("drag-over");

            const sourceSection = e.dataTransfer.getData("sourceSection");
            const noteId = e.dataTransfer.getData("noteId");

            if (sourceSection && noteId) {
              moveNote(
                sourceSection,
                section.dataset.section,
                parseInt(noteId)
              );
            }
          });
        });
      }

      // Load all sessions from localStorage
      function loadSessions() {
        const savedSessions = localStorage.getItem("bmcSessions");

        if (savedSessions) {
          sessions = JSON.parse(savedSessions);

          if (sessions.length > 0) {
            // Load the most recent session
            loadSession(sessions[sessions.length - 1].id);
          } else {
            createNewSession("Default Canvas");
          }
        } else {
          createNewSession("Default Canvas");
        }
      }

      // Create a new session
      function createNewSession() {
        const name = newSessionNameInput.value || "Untitled Canvas";

        const newSession = {
          id: Date.now(),
          name: name,
          created: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          data: getCanvasData(),
        };
        sessions.push(newSession);
        localStorage.setItem("bmcSessions", JSON.stringify(sessions));
        renderSessionsList();
        loadSession(newSession.id);
        newSessionNameInput.value = ""; // Clear input field
        sessionsModal.classList.add("hidden");
        saveCanvas(); // Save the new session
      }

      // Load a specific session
      function loadSession(sessionId) {
        const session = sessions.find((s) => s.id === sessionId);
        if (session) {
          currentSessionId = sessionId;
          canvasTitleInput.value = session.name;
          lastSavedText.textContent = `Last saved: ${new Date(
            session.lastModified
          ).toLocaleString()}`;
          setCanvasData(session.data);
        }
      }

      // Set canvas data from session
      function setCanvasData(data) {
        sectionIds.forEach((sectionId) => {
          const notesContainer = document.getElementById(`notes-${sectionId}`);
          notesContainer.innerHTML = ""; // Clear existing notes

          if (data[sectionId]) {
            data[sectionId].forEach((note) => {
              addNoteToSection(sectionId, note.text, note.color, note.id);
            });
          }
        });
      }

      // Get canvas data to save
      function getCanvasData() {
        const data = {};
        sectionIds.forEach((sectionId) => {
          const notesContainer = document.getElementById(`notes-${sectionId}`);
          const notes = Array.from(notesContainer.children).map((note) => {
            return {
              text: note.querySelector(".note-text").textContent,
              color: note.dataset.color,
              id: parseInt(note.dataset.id),
            };
          });
          data[sectionId] = notes;
        });
        return data;
      }

      // Save the current canvas state
      function saveCanvas() {
        if (currentSessionId) {
          const session = sessions.find((s) => s.id === currentSessionId);
          if (session) {
            session.data = getCanvasData();
            session.lastModified = new Date().toISOString();
            localStorage.setItem("bmcSessions", JSON.stringify(sessions));
            lastSavedText.textContent = `Last saved: ${new Date(
              session.lastModified
            ).toLocaleString()}`;
          }
        }
      }

      // Render sessions list in the modal
      function renderSessionsList() {
        sessionsListContainer.innerHTML = ""; // Clear existing list
        sessions.forEach((session) => {
          const sessionItem = document.createElement("div");
          sessionItem.className =
            "p-2 border-b cursor-pointer hover:bg-gray-100";
          sessionItem.textContent = session.name;
          sessionItem.addEventListener("click", () => {
            loadSession(session.id);
            sessionsModal.classList.add("hidden");
          });
          sessionsListContainer.appendChild(sessionItem);
        });
      }

      // Open note editor modal
      function openNoteEditor(action, sectionId, noteId = null) {
        noteEditorModal.classList.remove("hidden");
        noteTextArea.value = "";
        noteEditorTitle.textContent =
          action === "add" ? "Add Note" : "Edit Note";
        editingNoteData = { action, sectionId, noteId };
      }

      // Close note editor modal
      function closeNoteEditor() {
        noteEditorModal.classList.add("hidden");
        editingNoteData = null;
      }

      // Save note to the canvas
      function saveNote() {
        const text = noteTextArea.value.trim();
        if (text) {
          const { action, sectionId, noteId } = editingNoteData;
          if (action === "add") {
            const newNoteId = Date.now(); // Unique ID for the new note
            addNoteToSection(sectionId, text, selectedNoteColor, newNoteId);
          } else if (action === "edit" && noteId) {
            updateNoteInSection(sectionId, noteId, text);
          }
          closeNoteEditor();
          saveCanvas(); // Save the canvas after adding/editing a note
        }
      }

      // Add note to a specific section
      function addNoteToSection(sectionId, text, color, noteId) {
        const notesContainer = document.getElementById(`notes-${sectionId}`);
        const noteElement = document.createElement("div");
        noteElement.className =
          "note bg-white rounded-lg shadow p-2 mb-2 cursor-move";
        noteElement.draggable = true;
        noteElement.dataset.id = noteId;
        noteElement.dataset.color = color;
        noteElement.innerHTML = `<span class="note-text">${text}</span>`;

        // Add delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "text-red-500 hover:text-red-700 ml-2 text-xs";
        deleteBtn.innerHTML = "&times;";
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent triggering drag event
          notesContainer.removeChild(noteElement);
          saveCanvas(); // Save the canvas after deleting a note
        });
        noteElement.appendChild(deleteBtn);

        notesContainer.appendChild(noteElement);
      }

      // Update note text in a specific section
      function updateNoteInSection(sectionId, noteId, newText) {
        const notesContainer = document.getElementById(`notes-${sectionId}`);
        const noteElement = Array.from(notesContainer.children).find(
          (note) => note.dataset.id == noteId
        );
        if (noteElement) {
          noteElement.querySelector(".note-text").textContent = newText;
        }
      }

      // Move note between sections
      function moveNote(sourceSectionId, targetSectionId, noteId) {
        const sourceContainer = document.getElementById(
          `notes-${sourceSectionId}`
        );
        const targetContainer = document.getElementById(
          `notes-${targetSectionId}`
        );
        const noteElement = Array.from(sourceContainer.children).find(
          (note) => note.dataset.id == noteId
        );

        if (noteElement) {
          sourceContainer.removeChild(noteElement);
          targetContainer.appendChild(noteElement);
          saveCanvas(); // Save the canvas after moving a note
        }
      }

      function openSessionsModal() {
        sessionsModal.classList.remove("hidden");
        renderSessionsList();
      }
      
      // // Initialize the sessions modal
      // sessionsModal.classList.add("hidden");
      // // Initialize the help modal
      // helpModal.classList.add("hidden");
      // // Initialize the note editor modal
      // noteEditorModal.classList.add("hidden");

      // Initialize the app on page load
      window.onload = init;