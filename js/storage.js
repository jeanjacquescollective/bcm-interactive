// storage.js
import { sessions, currentSessionId, sectionIds, setCurrentSessionId } from "./state.js";
import { canvasTitleInput, lastSavedText } from "./dom.js";
import { setCanvasData, getCanvasData } from "./canvas.js";

export function loadSessions() {
  const savedSessions = localStorage.getItem("bmcSessions");

  if (savedSessions) {
    sessions.splice(0, sessions.length, ...JSON.parse(savedSessions));
    if (sessions.length > 0) {
      loadSession(sessions[sessions.length - 1].id);
    } else {
      createNewSession("Default Canvas");
    }
  } else {
    createNewSession("Default Canvas");
  }
}

export function saveCanvas() {
  if (currentSessionId) {
    const session = sessions.find((s) => s.id === currentSessionId);
    if (session) {
      session.data = getCanvasData();
      session.lastModified = new Date().toISOString();
      localStorage.setItem("bmcSessions", JSON.stringify(sessions));
      lastSavedText.textContent = `Last saved: ${new Date(session.lastModified).toLocaleString()}`;
    }
  }
}

export function createNewSession(defaultName) {
  const name = defaultName || "Untitled Canvas";
  const newSession = {
    id: Date.now(),
    name,
    created: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    data: getCanvasData(),
  };
  sessions.push(newSession);
  localStorage.setItem("bmcSessions", JSON.stringify(sessions));
  loadSession(newSession.id);
}

export function loadSession(sessionId) {
  const session = sessions.find((s) => s.id === sessionId);
  if (session) {
    // currentSessionId = sessionId;
    setCurrentSessionId(sessionId);
    canvasTitleInput.value = session.name;
    lastSavedText.textContent = `Last saved: ${new Date(session.lastModified).toLocaleString()}`;
    setCanvasData(session.data);
  }
}
