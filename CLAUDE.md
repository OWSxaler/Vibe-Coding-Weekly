# CLAUDE.md

## Project Overview

This repository contains **Skills Highlighter**, a Chrome extension (Manifest V3) that highlights user-defined skills on any webpage — job descriptions, LinkedIn profiles, CV viewers, etc.

## Project Structure

```
skills-highlighter/
├── manifest.json          # Extension manifest (Manifest V3)
├── popup/                 # Extension popup UI (HTML/CSS/JS)
├── content/               # Content script injected into web pages
├── background/            # Service worker for shortcuts & messaging
├── lib/                   # Shared utilities (storage, known skills DB)
└── icons/                 # Extension icons
```

## Tech Stack

- Vanilla JavaScript (no frameworks or build tools)
- Chrome Extensions API (Manifest V3)
- Chrome Storage API for persistence

## Development

- No build step required — load the `skills-highlighter/` folder directly as an unpacked Chrome extension
- Test by navigating to `chrome://extensions/`, enabling Developer Mode, and clicking "Load unpacked"
- All code is client-side; there is no backend or external API

## Conventions

- Use vanilla JS — no TypeScript, no bundlers, no npm dependencies
- Keep files focused: one concern per file
- Follow existing code style (2-space indentation, single quotes in JS)
