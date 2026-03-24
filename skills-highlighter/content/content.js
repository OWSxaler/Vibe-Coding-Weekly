(() => {
  // Prevent multiple injections
  if (window.__skillsHighlighterInjected) return;
  window.__skillsHighlighterInjected = true;

  const HIGHLIGHT_CLASS = "skills-highlight";
  const HIGHLIGHT_STYLE = "background-color: #fff176; padding: 1px 2px; border-radius: 2px;";

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

  function highlightKeywords(keywords) {
    clearHighlights();

    if (keywords.length === 0) return [];

    const pattern = keywords.map(escapeRegex).join("|");
    const regex = new RegExp(`\\b(${pattern})\\b`, "gi");
    const matchedSet = new Set();

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          // Skip script, style, textarea, and already-highlighted nodes
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
      if (!regex.test(text)) return;

      // Reset regex lastIndex
      regex.lastIndex = 0;

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }

        // Add highlighted match
        const mark = document.createElement("mark");
        mark.className = HIGHLIGHT_CLASS;
        mark.setAttribute("style", HIGHLIGHT_STYLE);
        mark.textContent = match[0];
        fragment.appendChild(mark);

        // Track matched keyword (original casing from keyword list)
        matchedSet.add(match[0].toLowerCase());

        lastIndex = regex.lastIndex;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      node.parentNode.replaceChild(fragment, node);
    });

    // Map back to original keyword casing
    return keywords.filter((kw) => matchedSet.has(kw.toLowerCase()));
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "highlight") {
      const matched = highlightKeywords(message.keywords);
      sendResponse({ matched });
    } else if (message.action === "clear") {
      clearHighlights();
      sendResponse({ cleared: true });
    }
    return true;
  });
})();
