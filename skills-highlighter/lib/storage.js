// Storage abstraction for Skills Highlighter
// Loaded via <script> in popup, importScripts() in service worker

const Storage = (() => {
  const SCHEMA_VERSION = 2;

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function createDefaultCategory(keywords = []) {
    const id = "cat_" + generateId();
    return {
      id,
      name: "General",
      color: "#fff176",
      keywords,
    };
  }

  function createDefaultList(name = "My Skills", keywords = []) {
    const id = "list_" + generateId();
    const cat = createDefaultCategory(keywords);
    return {
      id,
      name,
      createdAt: Date.now(),
      categories: { [cat.id]: cat },
    };
  }

  async function migrateIfNeeded() {
    const data = await chrome.storage.local.get(null);

    if (data.schemaVersion === SCHEMA_VERSION) return;

    // Migrate from v1 (flat keywords array) to v2 (lists + categories)
    const oldKeywords = data.keywords || [];
    const list = createDefaultList("My Skills", oldKeywords);

    const newData = {
      lists: { [list.id]: list },
      activeListId: list.id,
      autoHighlight: {
        enabled: false,
        domains: [
          "linkedin.com",
          "indeed.com",
          "glassdoor.com",
          "lever.co",
          "greenhouse.io",
          "workday.com",
          "jobs.ashbyhq.com",
          "wellfound.com",
        ],
      },
      preferences: {
        darkMode: "system",
      },
      schemaVersion: SCHEMA_VERSION,
    };

    // Clear old data and write new schema
    await chrome.storage.local.clear();
    await chrome.storage.local.set(newData);
  }

  async function getLists() {
    const { lists } = await chrome.storage.local.get("lists");
    return lists || {};
  }

  async function getActiveList() {
    const { lists, activeListId } = await chrome.storage.local.get([
      "lists",
      "activeListId",
    ]);
    if (!lists || !activeListId || !lists[activeListId]) {
      // Return first list or create a default
      const listIds = Object.keys(lists || {});
      if (listIds.length > 0) {
        const firstId = listIds[0];
        await chrome.storage.local.set({ activeListId: firstId });
        return lists[firstId];
      }
      // No lists exist — create default
      const list = createDefaultList();
      await chrome.storage.local.set({
        lists: { [list.id]: list },
        activeListId: list.id,
      });
      return list;
    }
    return lists[activeListId];
  }

  async function setActiveList(listId) {
    await chrome.storage.local.set({ activeListId: listId });
  }

  async function saveList(listObj) {
    const { lists } = await chrome.storage.local.get("lists");
    const updated = lists || {};
    updated[listObj.id] = listObj;
    await chrome.storage.local.set({ lists: updated });
  }

  async function deleteList(listId) {
    const { lists, activeListId } = await chrome.storage.local.get([
      "lists",
      "activeListId",
    ]);
    if (!lists || !lists[listId]) return;
    delete lists[listId];

    const updates = { lists };

    // If we deleted the active list, switch to another
    if (activeListId === listId) {
      const remaining = Object.keys(lists);
      if (remaining.length > 0) {
        updates.activeListId = remaining[0];
      } else {
        // Create a new default list
        const newList = createDefaultList();
        lists[newList.id] = newList;
        updates.lists = lists;
        updates.activeListId = newList.id;
      }
    }

    await chrome.storage.local.set(updates);
  }

  async function getPreferences() {
    const { preferences } = await chrome.storage.local.get("preferences");
    return preferences || { darkMode: "system" };
  }

  async function setPreferences(partial) {
    const current = await getPreferences();
    const merged = { ...current, ...partial };
    await chrome.storage.local.set({ preferences: merged });
  }

  async function getAutoHighlightConfig() {
    const { autoHighlight } = await chrome.storage.local.get("autoHighlight");
    return (
      autoHighlight || {
        enabled: false,
        domains: [],
      }
    );
  }

  async function setAutoHighlightConfig(cfg) {
    const current = await getAutoHighlightConfig();
    const merged = { ...current, ...cfg };
    await chrome.storage.local.set({ autoHighlight: merged });
  }

  function flattenListToKeywordGroups(list) {
    if (!list || !list.categories) return [];
    return Object.values(list.categories)
      .filter((cat) => cat.keywords && cat.keywords.length > 0)
      .map((cat) => ({
        keywords: cat.keywords,
        color: cat.color,
        categoryName: cat.name,
      }));
  }

  return {
    generateId,
    createDefaultCategory,
    createDefaultList,
    migrateIfNeeded,
    getLists,
    getActiveList,
    setActiveList,
    saveList,
    deleteList,
    getPreferences,
    setPreferences,
    getAutoHighlightConfig,
    setAutoHighlightConfig,
    flattenListToKeywordGroups,
  };
})();

// Make available for service worker importScripts
if (typeof self !== "undefined" && typeof window === "undefined") {
  self.Storage = Storage;
}
