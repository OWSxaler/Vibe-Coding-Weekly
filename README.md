# Skills Highlighter

A Chrome extension that highlights your skills on any webpage — job descriptions, LinkedIn profiles, CV viewers, and more. Paste your skills, visit a page, and instantly see which ones match.

## Features

- **Saved Skill Lists** — Create, rename, and switch between multiple skill sets
- **Color-Coded Categories** — Organise skills by type (languages, frameworks, tools, etc.) with distinct highlight colours
- **Fit Score** — See what percentage of your skills match the current page
- **Auto-Highlight** — Automatically highlight skills when you visit configured job sites
- **Keyboard Shortcut** — Toggle highlights with `Ctrl+Shift+H` (`Cmd+Shift+H` on Mac)
- **Skill Suggestions** — Discover relevant skills found on the page that aren't in your list
- **Export Summary** — Copy a match summary to your clipboard with one click
- **Dark Mode** — Toggle between light and dark themes

## Installation

1. **Download** — Clone or download this repository as a ZIP and unzip it
2. **Open Chrome** — Navigate to `chrome://extensions/`
3. **Enable Developer Mode** — Toggle the switch in the top-right corner
4. **Load the Extension** — Click **"Load unpacked"** and select the `skills-highlighter` folder
5. The extension icon will appear in your Chrome toolbar

## Usage

1. Click the **Skills Highlighter** icon in your toolbar
2. Add your skills — type them into a category, or create new categories
3. Navigate to a job posting, LinkedIn profile, or any webpage
4. Click **Highlight** (or press `Ctrl+Shift+H`) to highlight matching skills on the page
5. Check the **Fit Score** to see how well you match
6. Review **Suggestions** for skills found on the page that you haven't listed

## Project Structure

```
skills-highlighter/
├── manifest.json              # Chrome extension config (Manifest V3)
├── popup/
│   ├── popup.html             # Extension popup UI
│   ├── popup.css              # Styles (light + dark themes)
│   └── popup.js               # Popup logic and interactions
├── content/
│   └── content.js             # Content script — scans and highlights skills on pages
├── background/
│   └── service-worker.js      # Background worker for shortcuts and messaging
├── lib/
│   ├── known-skills.js        # Built-in library of common tech skills
│   └── storage.js             # Chrome storage utilities
└── icons/                     # Extension icons (16, 32, 48, 128px)
```

## Built With

This project was vibe-coded live using [Claude Code](https://claude.ai/code) during a Vibe Coding Weekly session.
