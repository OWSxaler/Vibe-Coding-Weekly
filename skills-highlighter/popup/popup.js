// === DOM References ===
const listSelect = document.getElementById("list-select");
const newListBtn = document.getElementById("new-list-btn");
const renameListBtn = document.getElementById("rename-list-btn");
const deleteListBtn = document.getElementById("delete-list-btn");
const listModal = document.getElementById("list-modal");
const listNameInput = document.getElementById("list-name-input");
const modalSave = document.getElementById("modal-save");
const modalCancel = document.getElementById("modal-cancel");
const categoriesContainer = document.getElementById("categories-container");
const addCategoryBtn = document.getElementById("add-category-btn");
const highlightBtn = document.getElementById("highlight-btn");
const clearBtn = document.getElementById("clear-btn");
const summaryEl = document.getElementById("summary");
const fitPercent = document.getElementById("fit-percent");
const fitFill = document.getElementById("fit-fill");
const matchCountEl = document.getElementById("match-count");
const matchListEl = document.getElementById("match-list");
const exportBtn = document.getElementById("export-btn");
const exportFeedback = document.getElementById("export-feedback");
const suggestionsEl = document.getElementById("suggestions");
const suggestionsList = document.getElementById("suggestions-list");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const autoHighlightToggle = document.getElementById("auto-highlight-toggle");
const domainList = document.getElementById("domain-list");
const saveDomainsBtn = document.getElementById("save-domains-btn");

// Template & JD DOM references
const templateBtn = document.getElementById("template-btn");
const templateModal = document.getElementById("template-modal");
const templateGrid = document.getElementById("template-grid");
const templateCancel = document.getElementById("template-cancel");
const importJdBtn = document.getElementById("import-jd-btn");
const jdModal = document.getElementById("jd-modal");
const jdInput = document.getElementById("jd-input");
const jdPreview = document.getElementById("jd-preview");
const jdPreviewList = document.getElementById("jd-preview-list");
const jdExtractBtn = document.getElementById("jd-extract-btn");
const jdCreateBtn = document.getElementById("jd-create-btn");
const jdCancel = document.getElementById("jd-cancel");

// Company & Move Score DOM references
const companyInsightsEl = document.getElementById("company-insights");
const companyInsightsList = document.getElementById("company-insights-list");
const companyHighlightToggle = document.getElementById("company-highlight-toggle");
const moveScoreEl = document.getElementById("move-score");
const moveScoreValue = document.getElementById("move-score-value");
const moveScoreFill = document.getElementById("move-score-fill");
const moveSignalsList = document.getElementById("move-signals-list");
const moveScoreToggle = document.getElementById("move-score-toggle");

let currentList = null;
let modalMode = null; // "new" or "rename"
let lastMatchData = null; // for export
let lastJdExtracted = null; // for JD import

// === Initialization ===
async function init() {
  await Storage.migrateIfNeeded();
  await loadTheme();
  await loadLists();
  await loadAutoHighlightSettings();
  await loadFeatureToggles();
}

// === Theme ===
async function loadTheme() {
  const prefs = await Storage.getPreferences();
  applyTheme(prefs.darkMode || "system");
}

function applyTheme(mode) {
  let dark = false;
  if (mode === "dark") dark = true;
  else if (mode === "system") dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  document.documentElement.dataset.theme = dark ? "dark" : "light";
  // ☀ = 9788, ☽ = 9789
  themeIcon.innerHTML = dark ? "&#9789;" : "&#9788;";
  themeToggle.dataset.mode = mode;
}

themeToggle.addEventListener("click", async () => {
  const modes = ["system", "light", "dark"];
  const current = themeToggle.dataset.mode || "system";
  const next = modes[(modes.indexOf(current) + 1) % modes.length];
  await Storage.setPreferences({ darkMode: next });
  applyTheme(next);
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", async () => {
  const prefs = await Storage.getPreferences();
  if (prefs.darkMode === "system") applyTheme("system");
});

// === List Management ===
async function loadLists() {
  const lists = await Storage.getLists();
  currentList = await Storage.getActiveList();

  listSelect.innerHTML = "";
  for (const list of Object.values(lists)) {
    const opt = document.createElement("option");
    opt.value = list.id;
    opt.textContent = list.name;
    if (list.id === currentList.id) opt.selected = true;
    listSelect.appendChild(opt);
  }

  renderCategories();
}

listSelect.addEventListener("change", async () => {
  await saveCurrentCategories();
  await Storage.setActiveList(listSelect.value);
  currentList = await Storage.getActiveList();
  renderCategories();
});

function showModal(mode, defaultValue = "") {
  modalMode = mode;
  listNameInput.value = defaultValue;
  listModal.classList.remove("hidden");
  listNameInput.focus();
}

function hideModal() {
  listModal.classList.add("hidden");
  modalMode = null;
}

newListBtn.addEventListener("click", () => showModal("new"));
renameListBtn.addEventListener("click", () => showModal("rename", currentList.name));
modalCancel.addEventListener("click", hideModal);

listNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") modalSave.click();
  if (e.key === "Escape") hideModal();
});

modalSave.addEventListener("click", async () => {
  const name = listNameInput.value.trim();
  if (!name) return;

  if (modalMode === "new") {
    const newList = Storage.createDefaultList(name);
    await Storage.saveList(newList);
    await Storage.setActiveList(newList.id);
  } else if (modalMode === "rename") {
    currentList.name = name;
    await Storage.saveList(currentList);
  }

  hideModal();
  await loadLists();
});

deleteListBtn.addEventListener("click", async () => {
  const lists = await Storage.getLists();
  if (Object.keys(lists).length <= 1) return; // don't delete last list
  await Storage.deleteList(currentList.id);
  await loadLists();
});

// === Template Picker ===
templateBtn.addEventListener("click", () => {
  renderTemplateGrid();
  templateModal.classList.remove("hidden");
});

templateCancel.addEventListener("click", () => {
  templateModal.classList.add("hidden");
});

function renderTemplateGrid() {
  templateGrid.innerHTML = "";
  if (typeof RolePersonas === "undefined") return;

  RolePersonas.forEach((persona) => {
    const card = document.createElement("div");
    card.className = "template-card";
    card.innerHTML = `
      <div class="template-card-icon">${persona.icon}</div>
      <div class="template-card-name">${escapeHtml(persona.name)}</div>
      <div class="template-card-desc">${escapeHtml(persona.description)}</div>
    `;
    card.addEventListener("click", () => loadPersonaTemplate(persona));
    templateGrid.appendChild(card);
  });
}

async function loadPersonaTemplate(persona) {
  const list = Storage.createDefaultList(persona.name);
  // Replace the default category with persona categories
  list.categories = {};
  persona.categories.forEach((cat) => {
    const catObj = Storage.createDefaultCategory(cat.keywords);
    catObj.name = cat.name;
    catObj.color = cat.color;
    list.categories[catObj.id] = catObj;
  });

  await Storage.saveList(list);
  await Storage.setActiveList(list.id);
  templateModal.classList.add("hidden");
  await loadLists();
}

// === JD Import ===
importJdBtn.addEventListener("click", () => {
  jdInput.value = "";
  jdPreview.classList.add("hidden");
  jdCreateBtn.classList.add("hidden");
  jdExtractBtn.classList.remove("hidden");
  lastJdExtracted = null;
  jdModal.classList.remove("hidden");
  jdInput.focus();
});

jdCancel.addEventListener("click", () => {
  jdModal.classList.add("hidden");
});

jdExtractBtn.addEventListener("click", () => {
  const text = jdInput.value.trim();
  if (!text) return;

  const extracted = extractSkillsFromJD(text);
  if (extracted.length === 0) {
    jdPreviewList.innerHTML = '<div style="font-size:11px;color:var(--text-muted);">No skills detected. Try pasting a more detailed job description.</div>';
    jdPreview.classList.remove("hidden");
    return;
  }

  lastJdExtracted = extracted;
  renderJdPreview(extracted);
  jdPreview.classList.remove("hidden");
  jdExtractBtn.classList.add("hidden");
  jdCreateBtn.classList.remove("hidden");
});

jdCreateBtn.addEventListener("click", async () => {
  if (!lastJdExtracted || lastJdExtracted.length === 0) return;

  const list = Storage.createDefaultList("From JD");
  list.categories = {};

  lastJdExtracted.forEach((group) => {
    const cat = Storage.createDefaultCategory(group.skills);
    cat.name = group.category;
    cat.color = group.color;
    list.categories[cat.id] = cat;
  });

  await Storage.saveList(list);
  await Storage.setActiveList(list.id);
  jdModal.classList.add("hidden");
  await loadLists();
});

function extractSkillsFromJD(text) {
  const categories = window.__knownSkillsByCategory || [];
  const results = [];

  categories.forEach((cat) => {
    const matched = [];
    cat.skills.forEach((skill) => {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "i");
      if (regex.test(text)) {
        matched.push(skill);
      }
    });
    if (matched.length > 0) {
      results.push({
        category: cat.category,
        color: cat.color,
        skills: matched,
      });
    }
  });

  return results;
}

function renderJdPreview(extracted) {
  jdPreviewList.innerHTML = "";
  extracted.forEach((group) => {
    const div = document.createElement("div");
    div.className = "jd-preview-category";
    div.style.borderLeftColor = group.color;
    div.innerHTML = `
      <div class="jd-preview-category-name">${escapeHtml(group.category)} (${group.skills.length})</div>
      <div class="jd-preview-skills">${group.skills.map(escapeHtml).join(", ")}</div>
    `;
    jdPreviewList.appendChild(div);
  });
}

// === Category Management ===
function renderCategories() {
  categoriesContainer.innerHTML = "";
  if (!currentList || !currentList.categories) return;

  for (const cat of Object.values(currentList.categories)) {
    const block = document.createElement("div");
    block.className = "category-block";
    block.dataset.catId = cat.id;

    block.innerHTML = `
      <div class="category-header">
        <div class="category-color-dot" style="background-color: ${cat.color}">
          <input type="color" value="${cat.color}" title="Pick color">
        </div>
        <input type="text" class="category-name" value="${escapeHtml(cat.name)}" placeholder="Category name">
        <button class="category-delete" title="Remove category">&times;</button>
      </div>
      <textarea rows="2" placeholder="JavaScript, React, Python...">${escapeHtml(cat.keywords.join(", "))}</textarea>
    `;

    // Color picker
    const colorInput = block.querySelector('input[type="color"]');
    const dot = block.querySelector(".category-color-dot");
    colorInput.addEventListener("input", () => {
      dot.style.backgroundColor = colorInput.value;
    });

    // Delete category
    block.querySelector(".category-delete").addEventListener("click", () => {
      if (Object.keys(currentList.categories).length <= 1) return;
      delete currentList.categories[cat.id];
      Storage.saveList(currentList);
      renderCategories();
    });

    categoriesContainer.appendChild(block);
  }
}

addCategoryBtn.addEventListener("click", async () => {
  const cat = Storage.createDefaultCategory();
  const colors = ["#81d4fa", "#ce93d8", "#ffab91", "#a5d6a7", "#fff176", "#90caf9"];
  cat.color = colors[Object.keys(currentList.categories).length % colors.length];
  cat.name = "New Category";
  currentList.categories[cat.id] = cat;
  await Storage.saveList(currentList);
  renderCategories();
});

async function saveCurrentCategories() {
  if (!currentList) return;
  const blocks = categoriesContainer.querySelectorAll(".category-block");
  blocks.forEach((block) => {
    const catId = block.dataset.catId;
    if (!currentList.categories[catId]) return;
    const name = block.querySelector(".category-name").value.trim() || "Untitled";
    const color = block.querySelector('input[type="color"]').value;
    const keywords = parseKeywords(block.querySelector("textarea").value);
    currentList.categories[catId].name = name;
    currentList.categories[catId].color = color;
    currentList.categories[catId].keywords = keywords;
  });
  await Storage.saveList(currentList);
}

// === Highlighting ===
function parseKeywords(text) {
  return [...new Set(
    text.split(",").map((k) => k.trim()).filter((k) => k.length > 0)
  )];
}

function collectKeywordGroups() {
  const groups = [];
  const blocks = categoriesContainer.querySelectorAll(".category-block");
  blocks.forEach((block) => {
    const color = block.querySelector('input[type="color"]').value;
    const categoryName = block.querySelector(".category-name").value.trim();
    const keywords = parseKeywords(block.querySelector("textarea").value);
    if (keywords.length > 0) {
      groups.push({ keywords, color, categoryName });
    }
  });
  return groups;
}

function getAllKeywords(groups) {
  return groups.flatMap((g) => g.keywords);
}

function getFitColor(percent) {
  if (percent >= 70) return "#27ae60";
  if (percent >= 40) return "#f39c12";
  return "#e74c3c";
}

function getMoveColor(score) {
  if (score >= 60) return "#e74c3c"; // high likelihood = red (action)
  if (score >= 30) return "#f39c12"; // moderate = orange
  return "#27ae60"; // low = green (stable)
}

function showSummary(keywordGroups, matched) {
  const matchedLower = new Set(matched.map((m) => (typeof m === "string" ? m : m.keyword).toLowerCase()));
  const allKeywords = getAllKeywords(keywordGroups);
  const total = allKeywords.length;
  const found = allKeywords.filter((kw) => matchedLower.has(kw.toLowerCase())).length;
  const percent = total > 0 ? Math.round((found / total) * 100) : 0;
  const color = getFitColor(percent);

  // Build keyword→color map
  const kwColorMap = {};
  keywordGroups.forEach((g) => {
    g.keywords.forEach((kw) => { kwColorMap[kw.toLowerCase()] = g.color; });
  });

  // Fit score
  fitPercent.textContent = percent + "%";
  fitPercent.style.color = color;
  fitFill.style.width = percent + "%";
  fitFill.style.backgroundColor = color;

  matchCountEl.textContent = `${found} / ${total} skills matched`;

  matchListEl.innerHTML = "";
  allKeywords.forEach((kw) => {
    const tag = document.createElement("span");
    const isMatched = matchedLower.has(kw.toLowerCase());
    tag.className = isMatched ? "skill-tag matched" : "skill-tag unmatched";
    if (isMatched) {
      tag.dataset.color = kwColorMap[kw.toLowerCase()] || "";
      tag.style.borderLeftColor = kwColorMap[kw.toLowerCase()] || "";
    }
    tag.textContent = kw;
    matchListEl.appendChild(tag);
  });

  summaryEl.classList.remove("hidden");

  // Store for export
  lastMatchData = { listName: currentList.name, keywordGroups, matched: allKeywords.filter((kw) => matchedLower.has(kw.toLowerCase())), missing: allKeywords.filter((kw) => !matchedLower.has(kw.toLowerCase())), percent };
}

highlightBtn.addEventListener("click", async () => {
  await saveCurrentCategories();
  const keywordGroups = collectKeywordGroups();
  if (keywordGroups.length === 0) return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const prefs = await Storage.getPreferences();

  try {
    // Inject scripts needed
    const scripts = ["content/content.js"];
    if (prefs.companyHighlight) {
      scripts.unshift("lib/company-data.js");
    }
    if (prefs.moveScore) {
      scripts.unshift("lib/move-signals.js");
      // move-signals needs company-data for company signals
      if (!prefs.companyHighlight) {
        scripts.unshift("lib/company-data.js");
      }
    }
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: scripts,
    });

    chrome.tabs.sendMessage(
      tab.id,
      {
        action: "highlight",
        keywordGroups,
        companyHighlight: !!prefs.companyHighlight,
        moveScoreEnabled: !!prefs.moveScore,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }
        if (response && response.matched) {
          showSummary(keywordGroups, response.matched);

          const allKw = getAllKeywords(keywordGroups);
          const total = allKw.length;
          const found = response.matched.length;
          const pct = total > 0 ? Math.round((found / total) * 100) : 0;

          chrome.action.setBadgeText({ text: pct + "%", tabId: tab.id });
          chrome.action.setBadgeBackgroundColor({ color: getFitColor(pct), tabId: tab.id });

          // Request suggestions
          requestSuggestions(tab.id, allKw);

          // Show company insights if available
          if (response.companyInsights && response.companyInsights.length > 0) {
            showCompanyInsights(response.companyInsights);
          } else {
            companyInsightsEl.classList.add("hidden");
          }

          // Show move score if available
          if (response.moveScore !== undefined && response.moveScore !== null) {
            showMoveScore(response.moveScore, response.moveSignals || []);
          } else {
            moveScoreEl.classList.add("hidden");
          }
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
  } catch (e) { /* content script may not exist */ }
  summaryEl.classList.add("hidden");
  suggestionsEl.classList.add("hidden");
  companyInsightsEl.classList.add("hidden");
  moveScoreEl.classList.add("hidden");
  lastMatchData = null;
  chrome.action.setBadgeText({ text: "", tabId: tab.id });
});

// === Company Insights Display ===
function showCompanyInsights(insights) {
  companyInsightsList.innerHTML = "";
  insights.forEach((insight) => {
    const card = document.createElement("div");
    card.className = "company-insight-card";

    let html = `<div class="company-insight-name">${escapeHtml(insight.name)}`;
    if (insight.formativeYears) {
      html += `<span class="formative-badge">Formative</span>`;
    }
    html += `</div>`;

    if (insight.stage) {
      html += `<div class="company-insight-stage">${escapeHtml(insight.stage)}</div>`;
    }
    if (insight.detail) {
      html += `<div class="company-insight-detail">${escapeHtml(insight.detail)}</div>`;
    }

    card.innerHTML = html;
    companyInsightsList.appendChild(card);
  });
  companyInsightsEl.classList.remove("hidden");
}

// === Likelihood to Move Score ===
function showMoveScore(score, signals) {
  const clamped = Math.min(100, Math.max(0, score));
  const color = getMoveColor(clamped);

  moveScoreValue.textContent = clamped + "/100";
  moveScoreValue.style.color = color;
  moveScoreFill.style.width = clamped + "%";
  moveScoreFill.style.backgroundColor = color;

  moveSignalsList.innerHTML = "";
  signals.forEach((signal) => {
    const item = document.createElement("div");
    item.className = "move-signal-item";
    const valColor = signal.points > 0 ? getMoveColor(signal.points * 2) : "var(--text-muted)";
    item.innerHTML = `
      <span class="move-signal-label">${escapeHtml(signal.label)}</span>
      <span class="move-signal-value" style="color:${valColor}">+${signal.points}</span>
    `;
    moveSignalsList.appendChild(item);
  });

  moveScoreEl.classList.remove("hidden");
}

// === Export ===
exportBtn.addEventListener("click", async () => {
  if (!lastMatchData) return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab ? tab.url : "";
  const text = [
    "Skills Highlighter Report",
    `List: ${lastMatchData.listName}`,
    `Page: ${url}`,
    `Fit: ${lastMatchData.percent}% (${lastMatchData.matched.length}/${lastMatchData.matched.length + lastMatchData.missing.length} skills matched)`,
    "",
    `Matched: ${lastMatchData.matched.join(", ") || "None"}`,
    `Missing: ${lastMatchData.missing.join(", ") || "None"}`,
  ].join("\n");

  await navigator.clipboard.writeText(text);
  exportFeedback.classList.remove("hidden");
  setTimeout(() => exportFeedback.classList.add("hidden"), 1500);
});

// === Suggestions ===
async function requestSuggestions(tabId, currentKeywords) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["lib/known-skills.js", "content/content.js"],
    });
    chrome.tabs.sendMessage(
      tabId,
      { action: "extractSkills", currentKeywords },
      (response) => {
        if (chrome.runtime.lastError || !response || !response.suggestions) {
          suggestionsEl.classList.add("hidden");
          return;
        }
        const suggestions = response.suggestions.slice(0, 15);
        if (suggestions.length === 0) {
          suggestionsEl.classList.add("hidden");
          return;
        }
        suggestionsList.innerHTML = "";
        suggestions.forEach((skill) => {
          const chip = document.createElement("button");
          chip.className = "suggestion-chip";
          chip.textContent = skill;
          chip.addEventListener("click", () => addSuggestionToList(skill));
          suggestionsList.appendChild(chip);
        });
        suggestionsEl.classList.remove("hidden");
      }
    );
  } catch (e) {
    suggestionsEl.classList.add("hidden");
  }
}

async function addSuggestionToList(skill) {
  // Add to the first category of the active list
  const catIds = Object.keys(currentList.categories);
  if (catIds.length === 0) return;
  const firstCat = currentList.categories[catIds[0]];
  if (!firstCat.keywords.some((k) => k.toLowerCase() === skill.toLowerCase())) {
    firstCat.keywords.push(skill);
    await Storage.saveList(currentList);
    renderCategories();
    // Re-trigger highlight
    highlightBtn.click();
  }
}

// === Feature Toggles ===
async function loadFeatureToggles() {
  const prefs = await Storage.getPreferences();
  companyHighlightToggle.checked = !!prefs.companyHighlight;
  moveScoreToggle.checked = !!prefs.moveScore;
}

companyHighlightToggle.addEventListener("change", async () => {
  await Storage.setPreferences({ companyHighlight: companyHighlightToggle.checked });
});

moveScoreToggle.addEventListener("change", async () => {
  await Storage.setPreferences({ moveScore: moveScoreToggle.checked });
});

// === Auto-highlight Settings ===
async function loadAutoHighlightSettings() {
  const config = await Storage.getAutoHighlightConfig();
  autoHighlightToggle.checked = config.enabled;
  domainList.value = config.domains.join(", ");
}

autoHighlightToggle.addEventListener("change", async () => {
  await Storage.setAutoHighlightConfig({ enabled: autoHighlightToggle.checked });
});

saveDomainsBtn.addEventListener("click", async () => {
  const domains = domainList.value.split(",").map((d) => d.trim()).filter((d) => d.length > 0);
  await Storage.setAutoHighlightConfig({ domains });
});

// === Utilities ===
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// === Start ===
init();
