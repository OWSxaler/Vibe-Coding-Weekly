// Service worker for Skills Highlighter
// Handles extension lifecycle events

chrome.runtime.onInstalled.addListener(() => {
  console.log("Skills Highlighter installed");
});
