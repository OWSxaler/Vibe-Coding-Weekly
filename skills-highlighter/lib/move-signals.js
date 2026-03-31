// Predictive sourcing: "Likelihood to Move" scoring engine
// Analyzes signals extracted from profile pages to estimate
// how likely a candidate is open to new opportunities.

if (!window.__MoveSignals) {
  window.__MoveSignals = {
    // Signal definitions with weights
    signals: {
      // Profile signals (directly detectable)
      openToWork: { label: "Open to Work badge", points: 40 },
      lookingForRole: { label: "Seeking new role language", points: 30 },
      recentlyUpdated: { label: "Recently updated profile", points: 10 },
      freelanceMentioned: { label: "Freelance/consulting mentioned", points: 10 },

      // Tenure signals
      shortCurrentTenure: { label: "Short tenure at current role (<1yr)", points: 10 },
      longWithoutPromotion: { label: "Long tenure, no promotion (3+ yrs)", points: 20 },
      multipleShortStints: { label: "Pattern of short stints", points: 15 },

      // Company signals (cross-referenced with company DB)
      companyLayoffs: { label: "Company had recent layoffs", points: 25 },
      noRecentFunding: { label: "No recent funding (startup)", points: 15 },
      companyStruggles: { label: "Company performance concerns", points: 20 },
      earlyStageCompany: { label: "Early-stage startup (risky)", points: 10 },

      // Role/market signals
      highDemandSkills: { label: "High-demand skills detected", points: 10 },
      highTurnoverRole: { label: "High-turnover role type", points: 5 },
    },

    // Phrases that indicate someone is looking
    lookingPhrases: [
      "open to opportunities",
      "looking for",
      "seeking new",
      "available for",
      "open to work",
      "actively looking",
      "in transition",
      "exploring opportunities",
      "between roles",
      "seeking a role",
      "on the market",
    ],

    // Phrases indicating freelance/contract
    freelancePhrases: [
      "freelance",
      "consultant",
      "contractor",
      "independent",
      "self-employed",
      "available for hire",
    ],

    // High-turnover role keywords
    highTurnoverRoles: [
      "recruiter",
      "sales development",
      "SDR",
      "BDR",
      "account executive",
      "customer success",
    ],

    // High-demand skill keywords (2024-2025 market)
    highDemandSkills: [
      "AI", "Machine Learning", "LLM", "GenAI", "MLOps",
      "Kubernetes", "Rust", "Go",
      "Staff Engineer", "Principal Engineer",
      "Platform Engineering", "SRE",
    ],

    // Companies known to have had significant layoffs (2023-2025)
    recentLayoffCompanies: [
      "meta", "facebook", "amazon", "google", "alphabet", "microsoft",
      "twitter", "x", "snap", "snapchat", "spotify", "stripe",
      "coinbase", "robinhood", "shopify", "twilio", "salesforce",
      "zoom", "lyft", "discord", "notion", "grammarly",
    ],

    /**
     * Calculate move likelihood score from extracted page signals
     * @param {Object} pageData - Extracted data from the page
     * @returns {{ score: number, signals: Array<{label: string, points: number}> }}
     */
    calculate(pageData) {
      const detected = [];
      let totalScore = 0;

      const addSignal = (key) => {
        const sig = this.signals[key];
        if (sig) {
          detected.push({ label: sig.label, points: sig.points });
          totalScore += sig.points;
        }
      };

      // Check profile signals
      if (pageData.hasOpenToWork) addSignal("openToWork");
      if (pageData.hasLookingLanguage) addSignal("lookingForRole");
      if (pageData.hasFreelanceMention) addSignal("freelanceMentioned");

      // Check tenure signals
      if (pageData.currentTenureMonths !== null && pageData.currentTenureMonths < 12) {
        addSignal("shortCurrentTenure");
      }
      if (pageData.longestSameTitleMonths !== null && pageData.longestSameTitleMonths > 36) {
        addSignal("longWithoutPromotion");
      }
      if (pageData.shortStintCount >= 3) {
        addSignal("multipleShortStints");
      }

      // Check company signals
      if (pageData.currentCompanyLayoffs) addSignal("companyLayoffs");
      if (pageData.currentCompanyNoFunding) addSignal("noRecentFunding");
      if (pageData.currentCompanyEarlyStage) addSignal("earlyStageCompany");

      // Check role/market signals
      if (pageData.hasHighDemandSkills) addSignal("highDemandSkills");
      if (pageData.hasHighTurnoverRole) addSignal("highTurnoverRole");

      return {
        score: Math.min(100, totalScore),
        signals: detected,
      };
    },
  };
}
