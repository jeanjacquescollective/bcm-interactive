// state.js
export let currentSessionId = null;
export let sessions = [];
export let selectedNoteColor = "#FFEB3B"; // Default yellow
export let editingNoteData = null;

export const sectionIds = [
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



export function setCurrentSessionId(id) {
  currentSessionId = id;
}   

export function setSelectedNoteColor(color) {
  selectedNoteColor = color;
}

export function setEditingNoteData(data) {
  editingNoteData = data;
}