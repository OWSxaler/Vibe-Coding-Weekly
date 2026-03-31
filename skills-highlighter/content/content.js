(() => {
  // Prevent multiple injections
  if (window.__skillsHighlighterInjected) return;
  window.__skillsHighlighterInjected = true;

  const HIGHLIGHT_CLASS = "skills-highlight";
  const COMPANY_HIGHLIGHT_CLASS = "company-highlight";
  const TOOLTIP_CLASS = "company-tooltip";

  function clearHighlights() {
    document.querySelectorAll(`mark.${HIGHLIGHT_CLASS}, mark.${COMPANY_HIGHLIGHT_CLASS}`).forEach((mark) => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
    document.querySelectorAll(`.${TOOLTIP_CLASS}`).forEach((el) => el.remove());
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
          if (parent.classList.contains(HIGHLIGHT_CLASS) || parent.classList.contains(COMPANY_HIGHLIGHT_CLASS)) {
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

  // === Company Highlighting ===
  function highlightCompanies() {
    const companyDB = window.__companyDatabase;
    if (!companyDB || companyDB.length === 0) return [];

    const companyInsights = [];
    const bodyText = document.body.innerText;

    // Build a lookup of all company names and aliases
    const companyNames = [];
    companyDB.forEach((company) => {
      companyNames.push({ pattern: company.name, company });
      if (company.aliases) {
        company.aliases.forEach((alias) => {
          companyNames.push({ pattern: alias, company });
        });
      }
    });

    // Sort by length descending so longer names match first
    companyNames.sort((a, b) => b.pattern.length - a.pattern.length);

    // Find which companies appear on the page
    const foundCompanies = new Map();
    companyNames.forEach(({ pattern, company }) => {
      if (foundCompanies.has(company.name)) return;
      const escaped = escapeRegex(pattern);
      const regex = new RegExp(`\\b${escaped}\\b`, "i");
      if (regex.test(bodyText)) {
        foundCompanies.set(company.name, company);
      }
    });

    if (foundCompanies.size === 0) return [];

    // Build regex for all found company names (including aliases)
    const allPatterns = [];
    foundCompanies.forEach((company) => {
      allPatterns.push(escapeRegex(company.name));
      if (company.aliases) {
        company.aliases.forEach((alias) => allPatterns.push(escapeRegex(alias)));
      }
    });

    const companyRegex = new RegExp(`\\b(${allPatterns.join("|")})\\b`, "gi");

    // Walk text nodes and highlight
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
          if (parent.classList.contains(HIGHLIGHT_CLASS) || parent.classList.contains(COMPANY_HIGHLIGHT_CLASS)) {
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
      companyRegex.lastIndex = 0;
      if (!companyRegex.test(text)) return;
      companyRegex.lastIndex = 0;

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;

      while ((match = companyRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }

        const matchedName = match[0];
        const company = findCompany(matchedName);

        const mark = document.createElement("mark");
        mark.className = COMPANY_HIGHLIGHT_CLASS;
        mark.setAttribute("style",
          "border-bottom: 2px dashed #f39c12; padding: 0 1px; " +
          "background: transparent; cursor: pointer; position: relative;"
        );
        mark.textContent = matchedName;

        // Add tooltip on hover
        if (company) {
          mark.addEventListener("mouseenter", (e) => showCompanyTooltip(e, company));
          mark.addEventListener("mouseleave", hideCompanyTooltip);
        }

        fragment.appendChild(mark);
        lastIndex = companyRegex.lastIndex;
      }

      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      node.parentNode.replaceChild(fragment, node);
    });

    // Build insights for each found company
    foundCompanies.forEach((company) => {
      const insight = buildCompanyInsight(company, bodyText);
      if (insight) companyInsights.push(insight);
    });

    return companyInsights;
  }

  function findCompany(name) {
    const db = window.__companyDatabase || [];
    const lower = name.toLowerCase();
    return db.find((c) => {
      if (c.name.toLowerCase() === lower) return true;
      if (c.aliases && c.aliases.some((a) => a.toLowerCase() === lower)) return true;
      return false;
    });
  }

  function buildCompanyInsight(company, bodyText) {
    const insight = {
      name: company.name,
      stage: null,
      detail: null,
      formativeYears: false,
    };

    // Try to detect date ranges near the company name
    const dateRange = findDateRangeNearCompany(company, bodyText);

    if (dateRange) {
      const stage = getCompanyStageAtTime(company, dateRange.startYear);
      insight.stage = stage;

      // Check if formative years (early stage, between funding rounds, pre-IPO growth)
      if (company.ipo && dateRange.startYear < company.ipo) {
        insight.formativeYears = true;
        insight.detail = `Joined pre-IPO (IPO: ${company.ipo}). ${dateRange.startYear}-${dateRange.endYear || "present"}`;
      } else if (!company.ipo && company.founded) {
        const yearsAfterFounding = dateRange.startYear - company.founded;
        if (yearsAfterFounding <= 5) {
          insight.formativeYears = true;
          insight.detail = `Early employee (${yearsAfterFounding}yr after founding). ${dateRange.startYear}-${dateRange.endYear || "present"}`;
        }
      }

      if (!insight.detail) {
        insight.detail = `${dateRange.startYear}-${dateRange.endYear || "present"}`;
      }
    } else {
      // No date range found, just show general info
      const currentStage = getCompanyStageAtTime(company, new Date().getFullYear());
      insight.stage = currentStage;
      insight.detail = `Founded ${company.founded}${company.ipo ? `, IPO ${company.ipo}` : ""}`;
    }

    return insight;
  }

  function findDateRangeNearCompany(company, text) {
    const names = [company.name, ...(company.aliases || [])];
    for (const name of names) {
      const escaped = escapeRegex(name);
      // Look for patterns like "Company Name ... Jan 2018 - Dec 2021" or "2018 - 2021" near the company name
      const patterns = [
        // "CompanyName" followed by date range within 200 chars
        new RegExp(`${escaped}[\\s\\S]{0,200}?(20\\d{2}|19\\d{2})\\s*[-–]\\s*(20\\d{2}|19\\d{2}|[Pp]resent)`, "i"),
        // Date range followed by "CompanyName" within 200 chars
        new RegExp(`(20\\d{2}|19\\d{2})\\s*[-–]\\s*(20\\d{2}|19\\d{2}|[Pp]resent)[\\s\\S]{0,200}?${escaped}`, "i"),
      ];

      for (const regex of patterns) {
        const match = text.match(regex);
        if (match) {
          const startYear = parseInt(match[1]);
          const endStr = match[2];
          const endYear = endStr.toLowerCase() === "present" ? null : parseInt(endStr);
          return { startYear, endYear };
        }
      }
    }
    return null;
  }

  function getCompanyStageAtTime(company, year) {
    if (!company.stages || company.stages.length === 0) return null;

    // Find the most recent stage at or before the given year
    let latestStage = null;
    for (const stage of company.stages) {
      if (stage.year <= year) {
        latestStage = stage;
      }
    }
    return latestStage ? latestStage.event : null;
  }

  function showCompanyTooltip(event, company) {
    hideCompanyTooltip();

    const tooltip = document.createElement("div");
    tooltip.className = TOOLTIP_CLASS;
    tooltip.setAttribute("style",
      "position: fixed; z-index: 999999; background: #1a1a1a; color: #e0e0e0; " +
      "padding: 10px 12px; border-radius: 8px; font-size: 12px; " +
      "max-width: 280px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); " +
      "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; " +
      "line-height: 1.4; pointer-events: none;"
    );

    let html = `<div style="font-weight:700;font-size:13px;margin-bottom:4px;">${company.name}</div>`;
    html += `<div style="color:#aaa;margin-bottom:6px;">Founded ${company.founded}`;
    if (company.ipo) html += ` | IPO ${company.ipo}`;
    html += `</div>`;

    if (company.stages && company.stages.length > 0) {
      html += `<div style="border-top:1px solid #333;padding-top:6px;margin-top:2px;">`;
      company.stages.forEach((stage) => {
        html += `<div style="font-size:11px;color:#ccc;margin-bottom:2px;">`;
        html += `<span style="color:#f39c12;font-weight:600;">${stage.year}</span> ${stage.event}`;
        html += `</div>`;
      });
      html += `</div>`;
    }

    tooltip.innerHTML = html;
    document.body.appendChild(tooltip);

    // Position near the mouse
    const rect = event.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    let top = rect.bottom + 6;
    let left = rect.left;

    // Keep within viewport
    if (top + tooltipRect.height > window.innerHeight) {
      top = rect.top - tooltipRect.height - 6;
    }
    if (left + tooltipRect.width > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width - 10;
    }

    tooltip.style.top = top + "px";
    tooltip.style.left = left + "px";
  }

  function hideCompanyTooltip() {
    document.querySelectorAll(`.${TOOLTIP_CLASS}`).forEach((el) => el.remove());
  }

  // === Move Score Signal Extraction ===
  function extractMoveSignals() {
    const MoveSignals = window.__MoveSignals;
    if (!MoveSignals) return null;

    const bodyText = document.body.innerText;
    const bodyLower = bodyText.toLowerCase();

    const pageData = {
      hasOpenToWork: false,
      hasLookingLanguage: false,
      hasFreelanceMention: false,
      currentTenureMonths: null,
      longestSameTitleMonths: null,
      shortStintCount: 0,
      currentCompanyLayoffs: false,
      currentCompanyNoFunding: false,
      currentCompanyEarlyStage: false,
      hasHighDemandSkills: false,
      hasHighTurnoverRole: false,
    };

    // Check for "Open to Work" badge
    pageData.hasOpenToWork = bodyLower.includes("open to work") ||
      !!document.querySelector('[class*="open-to-work"], [class*="openToWork"], .hiring-badge');

    // Check looking phrases
    pageData.hasLookingLanguage = MoveSignals.lookingPhrases.some((phrase) =>
      bodyLower.includes(phrase.toLowerCase())
    );

    // Check freelance mentions
    pageData.hasFreelanceMention = MoveSignals.freelancePhrases.some((phrase) =>
      bodyLower.includes(phrase.toLowerCase())
    );

    // Try to extract tenure info from dates on page
    const tenureInfo = extractTenureInfo(bodyText);
    if (tenureInfo) {
      pageData.currentTenureMonths = tenureInfo.currentTenureMonths;
      pageData.longestSameTitleMonths = tenureInfo.longestSameTitleMonths;
      pageData.shortStintCount = tenureInfo.shortStintCount;
    }

    // Check current company against layoff list
    const companyDB = window.__companyDatabase || [];
    const foundCompanies = [];
    companyDB.forEach((company) => {
      const names = [company.name, ...(company.aliases || [])];
      for (const name of names) {
        if (bodyLower.includes(name.toLowerCase())) {
          foundCompanies.push(company);
          break;
        }
      }
    });

    // Use first found company as "current" (LinkedIn profiles list current first)
    if (foundCompanies.length > 0) {
      const currentCompany = foundCompanies[0];
      const companyNameLower = currentCompany.name.toLowerCase();

      if (MoveSignals.recentLayoffCompanies.includes(companyNameLower)) {
        pageData.currentCompanyLayoffs = true;
      }

      // Check if early stage (no IPO, founded recently)
      const currentYear = new Date().getFullYear();
      if (!currentCompany.ipo && currentCompany.founded && (currentYear - currentCompany.founded) <= 5) {
        pageData.currentCompanyEarlyStage = true;
      }

      // Check for no recent funding
      if (!currentCompany.ipo && currentCompany.stages) {
        const lastFundingYear = Math.max(...currentCompany.stages.map((s) => s.year));
        if (currentYear - lastFundingYear >= 2) {
          pageData.currentCompanyNoFunding = true;
        }
      }
    }

    // Check for high-demand skills
    pageData.hasHighDemandSkills = MoveSignals.highDemandSkills.some((skill) => {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${escaped}\\b`, "i").test(bodyText);
    });

    // Check for high-turnover roles
    pageData.hasHighTurnoverRole = MoveSignals.highTurnoverRoles.some((role) =>
      bodyLower.includes(role.toLowerCase())
    );

    return MoveSignals.calculate(pageData);
  }

  function extractTenureInfo(text) {
    // Try to find date ranges like "Jan 2020 - Present", "2018 - 2021", etc.
    const dateRangePattern = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s+)?(20\d{2}|19\d{2})\s*[-–]\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s+)?(20\d{2}|19\d{2}|[Pp]resent)/gi;

    const stints = [];
    let match;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    while ((match = dateRangePattern.exec(text)) !== null) {
      const startYear = parseInt(match[1]);
      const endStr = match[2];
      const endYear = endStr.toLowerCase() === "present" ? currentYear : parseInt(endStr);
      const months = (endYear - startYear) * 12 + (endStr.toLowerCase() === "present" ? currentMonth : 0);
      stints.push({ startYear, endYear, months, isPresent: endStr.toLowerCase() === "present" });
    }

    if (stints.length === 0) return null;

    // Current tenure = the stint with "present"
    const currentStint = stints.find((s) => s.isPresent);
    const currentTenureMonths = currentStint ? currentStint.months : null;

    // Find longest stint (could indicate no promotion)
    const longestSameTitleMonths = Math.max(...stints.map((s) => s.months));

    // Count short stints (< 18 months)
    const shortStintCount = stints.filter((s) => s.months < 18 && !s.isPresent).length;

    return { currentTenureMonths, longestSameTitleMonths, shortStintCount };
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

      const response = { matched };

      // Company highlighting
      if (message.companyHighlight) {
        response.companyInsights = highlightCompanies();
      }

      // Move score calculation
      if (message.moveScoreEnabled) {
        const moveResult = extractMoveSignals();
        if (moveResult) {
          response.moveScore = moveResult.score;
          response.moveSignals = moveResult.signals;
        }
      }

      sendResponse(response);
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
