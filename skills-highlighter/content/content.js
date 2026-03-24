(() => {
  // Prevent multiple injections
  if (window.__skillsHighlighterInjected) return;
  window.__skillsHighlighterInjected = true;

  const HIGHLIGHT_CLASS = "skills-highlight";

  function clearHighlights() {
    document.querySelectorAll(`mark.${HIGHLIGHT_CLASS}`).forEach((mark) => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlightKeywordGroups(keywordGroups) {
    clearHighlights();

    if (!keywordGroups || keywordGroups.length === 0) return [];

    // Build keyword → color lookup
    const kwColorMap = new Map();
    const allKeywords = [];
    keywordGroups.forEach((group) => {
      group.keywords.forEach((kw) => {
        kwColorMap.set(kw.toLowerCase(), group.color || "#fff176");
        allKeywords.push(kw);
      });
    });

    if (allKeywords.length === 0) return [];

    const pattern = allKeywords.map(escapeRegex).join("|");
    const regex = new RegExp(`\\b(${pattern})\\b`, "gi");
    const matchedSet = new Set();

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA" || tag === "NOSCRIPT") {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.classList.contains(HIGHLIGHT_CLASS)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach((node) => {
      const text = node.textContent;
      regex.lastIndex = 0;
      if (!regex.test(text)) return;
      regex.lastIndex = 0;

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }

        const color = kwColorMap.get(match[0].toLowerCase()) || "#fff176";
        const mark = document.createElement("mark");
        mark.className = HIGHLIGHT_CLASS;
        mark.setAttribute("style", `background-color: ${color}; padding: 1px 2px; border-radius: 2px; color: #000;`);
        mark.textContent = match[0];
        fragment.appendChild(mark);

        matchedSet.add(match[0].toLowerCase());
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      node.parentNode.replaceChild(fragment, node);
    });

    // Return matched keywords with their colors
    return allKeywords
      .filter((kw) => matchedSet.has(kw.toLowerCase()))
      .map((kw) => ({ keyword: kw, color: kwColorMap.get(kw.toLowerCase()) }));
  }

  function extractSkills(currentKeywords) {
    const currentLower = new Set((currentKeywords || []).map((k) => k.toLowerCase()));
    const knownSkills = window.__knownSkills || [];

    // Get all visible text from the page
    const bodyText = document.body.innerText.toLowerCase();
    const suggestions = [];

    knownSkills.forEach((skill) => {
      if (currentLower.has(skill.toLowerCase())) return;
      // Word boundary check
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "i");
      if (regex.test(bodyText)) {
        suggestions.push(skill);
      }
    });

    return suggestions;
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "highlight") {
      const matched = highlightKeywordGroups(message.keywordGroups);
      sendResponse({ matched });
    } else if (message.action === "clear") {
      clearHighlights();
      sendResponse({ cleared: true });
    } else if (message.action === "toggle") {
      const existing = document.querySelectorAll(`mark.${HIGHLIGHT_CLASS}`);
      if (existing.length > 0) {
        clearHighlights();
        sendResponse({ highlighted: false, matched: [] });
      } else {
        const matched = highlightKeywordGroups(message.keywordGroups);
        sendResponse({ highlighted: true, matched });
      }
    } else if (message.action === "extractSkills") {
      const suggestions = extractSkills(message.currentKeywords);
      sendResponse({ suggestions });
    }
    return true;
  });
})();
