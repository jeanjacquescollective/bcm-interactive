// state.js
export let currentSessionId = null;
export let sessions = [];
export let editingNoteData = {
  action: null,
  sectionId: null,
  noteId: null,
  selectedNoteColor: "#FFEB3B",
};

export function resetEditingNoteData () {
  editingNoteData = {
    action: null,
    sectionId: null,
    noteId: null,
    selectedNoteColor: "#FFEB3B",
  };
}

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



export function setEditingNoteData(data) {
  editingNoteData = data;
}