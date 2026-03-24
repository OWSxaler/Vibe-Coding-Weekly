const keywordsInput = document.getElementById("keywords");
const highlightBtn = document.getElementById("highlight-btn");
const clearBtn = document.getElementById("clear-btn");
const summaryEl = document.getElementById("summary");
const matchCountEl = document.getElementById("match-count");
const matchListEl = document.getElementById("match-list");

// Load saved keywords on popup open
chrome.storage.local.get("keywords", (data) => {
  if (data.keywords) {
    keywordsInput.value = data.keywords.join(", ");
  }
});

function parseKeywords(text) {
  return [...new Set(
    text.split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0)
  )];
}

function showSummary(keywords, matched) {
  const matchedSet = new Set(matched.map((m) => m.toLowerCase()));
  const total = keywords.length;
  const found = matchedSet.size;

  matchCountEl.textContent = `${found} / ${total} skills found`;

  matchListEl.innerHTML = "";
  keywords.forEach((kw) => {
    const tag = document.createElement("span");
    tag.className = matchedSet.has(kw.toLowerCase())
      ? "skill-tag matched"
      : "skill-tag unmatched";
    tag.textContent = kw;
    matchListEl.appendChild(tag);
  });

  summaryEl.classList.remove("hidden");
}

highlightBtn.addEventListener("click", async () => {
  const keywords = parseKeywords(keywordsInput.value);
  if (keywords.length === 0) return;

  // Save keywords
  chrome.storage.local.set({ keywords });

  // Get active tab and inject + message content script
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    // Inject content script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content/content.js"],
    });

    // Send highlight message
    chrome.tabs.sendMessage(
      tab.id,
      { action: "highlight", keywords },
      (response) => {
        if (response && response.matched) {
          showSummary(keywords, response.matched);

          // Update badge
          chrome.action.setBadgeText({
            text: String(response.matched.length),
            tabId: tab.id,
          });
          chrome.action.setBadgeBackgroundColor({
            color: "#4a90d9",
            tabId: tab.id,
          });
        }
      }
    );
  } catch (err) {
    console.error("Failed to inject content script:", err);
  }
});

clearBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    chrome.tabs.sendMessage(tab.id, { action: "clear" });
    summaryEl.classList.add("hidden");

    chrome.action.setBadgeText({ text: "", tabId: tab.id });
  } catch (err) {
    // Content script may not be injected yet, that's ok
  }
});
