importScripts("../lib/storage.js");

// Track per-tab highlight state
const tabHighlightState = new Map();

// === Extension Install ===
chrome.runtime.onInstalled.addListener(async () => {
  await Storage.migrateIfNeeded();
});

// === Keyboard Shortcut ===
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "toggle-highlights") return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;

  const list = await Storage.getActiveList();
  const keywordGroups = Storage.flattenListToKeywordGroups(list);
  if (keywordGroups.length === 0) return;

  try {
    const prefs = await Storage.getPreferences();
    const scripts = ["lib/known-skills.js", "content/content.js"];
    if (prefs.companyHighlight) {
      scripts.unshift("lib/company-data.js");
      scripts.push("lib/move-signals.js");
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: scripts,
    });

    chrome.tabs.sendMessage(
      tab.id,
      { action: "toggle", keywordGroups },
      (response) => {
        if (chrome.runtime.lastError) return;
        if (response && response.highlighted) {
          tabHighlightState.set(tab.id, true);
          const allKw = keywordGroups.flatMap((g) => g.keywords);
          const total = allKw.length;
          const found = response.matched ? response.matched.length : 0;
          const pct = total > 0 ? Math.round((found / total) * 100) : 0;
          updateBadge(tab.id, pct);
        } else {
          tabHighlightState.set(tab.id, false);
          chrome.action.setBadgeText({ text: "", tabId: tab.id });
        }
      }
    );
  } catch (err) {
    console.error("Toggle failed:", err);
  }
});

// === Auto-Highlight ===
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;

  const config = await Storage.getAutoHighlightConfig();
  if (!config.enabled) return;

  let hostname;
  try {
    hostname = new URL(tab.url).hostname;
  } catch {
    return;
  }

  const matches = config.domains.some((domain) =>
    hostname === domain || hostname.endsWith("." + domain)
  );
  if (!matches) return;

  const list = await Storage.getActiveList();
  const keywordGroups = Storage.flattenListToKeywordGroups(list);
  if (keywordGroups.length === 0) return;

  try {
    const prefs = await Storage.getPreferences();
    const scripts = ["lib/known-skills.js", "content/content.js"];
    if (prefs.companyHighlight) {
      scripts.unshift("lib/company-data.js");
      scripts.push("lib/move-signals.js");
    }

    await chrome.scripting.executeScript({
      target: { tabId },
      files: scripts,
    });

    chrome.tabs.sendMessage(
      tabId,
      {
        action: "highlight",
        keywordGroups,
        companyHighlight: !!prefs.companyHighlight,
        moveScoreEnabled: !!prefs.moveScore,
      },
      (response) => {
        if (chrome.runtime.lastError) return;
        if (response && response.matched) {
          tabHighlightState.set(tabId, true);
          const allKw = keywordGroups.flatMap((g) => g.keywords);
          const total = allKw.length;
          const found = response.matched.length;
          const pct = total > 0 ? Math.round((found / total) * 100) : 0;
          updateBadge(tabId, pct);
        }
      }
    );
  } catch (err) {
    // Tab may not be injectable (chrome:// pages, etc.)
  }
});

// === Badge Helper ===
function updateBadge(tabId, percent) {
  let color;
  if (percent >= 70) color = "#27ae60";
  else if (percent >= 40) color = "#f39c12";
  else color = "#e74c3c";

  chrome.action.setBadgeText({ text: percent + "%", tabId });
  chrome.action.setBadgeBackgroundColor({ color, tabId });
}

// === Cleanup ===
chrome.tabs.onRemoved.addListener((tabId) => {
  tabHighlightState.delete(tabId);
});
