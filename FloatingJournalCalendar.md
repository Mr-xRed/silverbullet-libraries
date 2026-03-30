---
name: "Library/Mr-xRed/FloatingJournalCalendar"
tags: meta/library
pageDecoration.prefix: "🗓️ "
---
# Floating Journal Calendar & Page Navigation

The **Floating Journal Calendar** is a lightweight, interactive navigation tool for SilverBullet. It provides a sleek, floating interface that allows users to quickly browse their journal entries. By scanning existing pages against a customizable date pattern, it visually identifies days with active entries, enabling seamless one-click navigation through personal history.

![JournalCalendar|1000px](https://raw.githubusercontent.com/Mr-xRed/silverbullet-libraries/refs/heads/main/screenshots/JournalCalendar.png)

## **Main Features**

### **📅 Visual Journaling**

- **Activity Indicators:** Automatically scans your space and places a distinct dot on days that already have a journal entry.
- **Instant Navigation:** Click any date to immediately navigate to that specific journal page.
- **Drag&Drop**: Drag the day to add the Journal WikiLink to the page
- **Shift+Click**: Hold `Shift` and click a day to insert a formatted plain-text date string at the cursor — format is fully customizable via `shiftDatePattern`
- **Cmd/Ctrl+Shift+Click**: Hold `Cmd/Ctrl+Shift` and click a day to insert a WikiLink with the formatted date as alias — e.g. `[[Journal/2026/03/2026-03-28|March 28th, 2026]]`
- **Smart Date Logic:** Highlights "Today"

### **✨ Enhanced User Interface**

- **Dynamic Theming:** Built-in support for both **Dark** and **Light**.
- **Draggable & Snappable:** A "grab-and-go" header allows you to move the calendar anywhere. It features **edge-snapping** and **viewport clamping** to ensure it never gets lost off-screen.
- **Persistent Positioning:** Remembers its last location on your screen across sessions, so it stays exactly where you've put it.
- **Quick Jump:** Includes a "Today & Refresh" button `↺` to instantly return to the current month and year from anywhere in the calendar and refresh the dot's
- **Overflow Days:** First and last days of adjacent months shown subtly in partial weeks.
- **Week Numbers:** Optional week number column — click a week number to open your weekly note.
- Added `Cmd/Ctrl + Click` to convert the selected text to a piped WikiLink
  e.g: `[[Journal/2024/05/2024-05-20_Mon|Selected Text]]`
- Added `Shift + Click` to insert a plain-text formatted date string at the cursor position
  e.g: `2026-03-28`, `March 28th`, `Saturday (March 28th, 2026)`, `2026-03-28 14:38:23`
- Added `Cmd/Ctrl + Shift + Click` to insert a WikiLink with the formatted date as alias
  e.g: `[[Journal/2026/03/2026-03-28_Sat|March 28th, 2026]]`

### **⚙️ Customizable**

- **Flexible Path Patterns:** Configure your journal file structure and weekly notes path (with [[Library/Mr-xRed/FloatingJournalCalendar#Date Pattern Placeholders|Pattern Placeholders]]).
- **Week Numbering System:** Choose between `"iso"` (ISO 8601, default), `"us"` (Sunday-start, week 1 = Jan 1), or `"simple"` (plain count from Jan 1).
- **Localization Support:** Easily change month names and weekday abbreviations. Choose whether to start weeks on Sunday or Monday.

## Config Example and default values

```lua
-- priority: 1
config.set("FloatingJournalCalendar", {
  journalPathPattern = 'Journal/#year#/#month#-#monthname#/#year#-#month#-#day#_#weekday#',
  weeklyNotesPathPattern = 'Journal/Weekly/#weekyear#-W#weeknum#',
  monthNames = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"},
  dayNames = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"},
  weekStartsSunday = false,
  showWeekNumbers = true,
  weekNumberSystem = "iso",   -- "iso" | "us" | "simple"
  useHeatmap = false,         -- heatmap shading instead of dots
  showContour = true,         -- show/hide the month outline border
  showFooter = true,          -- master footer toggle
  footerMoonPhase = true,     -- 🌔 moon phase name
  footerMonthCount = true,    -- entry count for the viewed month
  footerTotalCount = true,    -- total entry count across all time
  footerLastEntry = true,     -- how many days since the last entry
  footerStreak = true,        -- 🔥 consecutive-day journaling streak
  shiftDatePattern = '#year#-#month#-#day#',  -- plain-text date for Shift+Click
  -- Optional: Custom colors (hex format recommended)
  -- colors = {
  --   accentColor = "#6366f1",        -- Links, today highlight, toggle switches
  --   background = "#1f2937",         -- Calendar card background
  --   borderColor = "#4b5563",        -- Borders
  --   elementsBackground = "#374151", -- Day cells and buttons
  --   hoverBackground = "#4b5563",    -- Hover states
  --   textColor = "#e5e7eb",          -- Main text
  --   outlineColor = "#ffffff",       -- Month contour line
  --   sundayColor = "#f87171",        -- Sunday text color
  --   dotGreen = "#22c55e",           -- Entry dot: 1 entry
  --   dotYellow = "#eab308",          -- Entry dot: 2 entries
  --   dotOrange = "#f97316",          -- Entry dot: 3 entries
  --   dotRed = "#ef4444"              -- Entry dot: 4+ entries
  -- }
})    
```

> **note** Note
> Copy this into a `space-lua` block on your config page to change default values.
> 
> **Week numbering systems:**
> 
>   - `"iso"` — ISO 8601: week starts Monday, Week 1 = first week containing a Thursday. Week-year may differ from calendar year for days near Jan 1.
>   - `"us"` — North American: week starts Sunday, Week 1 = week containing Jan 1. Week-year always equals calendar year.
>   - `"simple"` — Plain count: Week 1 = Jan 1–7, Week 2 = Jan 8–14, etc. Week-year always equals calendar year.

## Shift+Click — Date Pattern Variables

All three pattern strings — `journalPathPattern`, `weeklyNotesPathPattern`, and `shiftDatePattern` — share the same unified variable set. Use any combination of the placeholders below in any of them.

### Interaction Overview

| Modifier | Action | Result |
|---|---|---|
| *(none)* | Click | Navigate to journal page |
| `Drag` | Drag to editor | Insert `[[WikiLink]]` |
| `Cmd/Ctrl` | Click | Insert `[[WikiLink]]` (or `[[WikiLink|Selection]]` if text selected) |
| `Shift` | Click | Insert plain-text date from `shiftDatePattern` |
| `Cmd/Ctrl + Shift` | Click | Insert `[[WikiLink\|Formatted Date]]` alias |

### Date Pattern Placeholders

| Placeholder | Description | Example |
|---|---|---|
| `#year#` | 4-digit year | `2026` |
| `#YY#` | 2-digit year | `26` |
| `#month#` | 2-digit month | `03` |
| `#M#` | Month without leading zero | `3` |
| `#day#` | 2-digit day | `08` |
| `#D#` | Day without leading zero | `8` |
| `#monthname#` | Full month name (localized) | `March` |
| `#monthshort#` | Short month name (first 3 chars) | `Mar` |
| `#weekday#` | Short weekday (localized) | `Sat` |
| `#weekdayfull#` | Full weekday name (English) | `Saturday` |
| `#ordinal#` | Day ordinal suffix | `st` · `nd` · `rd` · `th` |
| `#HH#` | Hours (24 h, 2-digit) | `14` |
| `#hh#` | Hours (12 h, 2-digit) | `02` |
| `#mm#` | Minutes (2-digit) | `38` |
| `#ss#` | Seconds (2-digit) | `07` |
| `#weeknum#` | Week number (2-digit, zero-padded) | `03` |
| `#weeknumraw#` | Week number (no padding) | `3` |
| `#weekyear#` | Week-year (ISO/US/simple aware) | `2026` |
| `#wildcard#` | Empty string (path prefix matching) | `` |

### Shift+Click — `shiftDatePattern` Examples

| Pattern | Result |
|---|---|
| `#year#-#month#-#day#` | `2026-03-28` |
| `#monthname# #D##ordinal#` | `March 28th` |
| `#weekdayfull# (#monthname# #D##ordinal#, #year#)` | `Saturday (March 28th, 2026)` |
| `#year#-#month#-#day# #HH#:#mm#:#ss#` | `2026-03-28 14:38:07` |
| `#D#. #monthname# #year#` | `28. March 2026` |
| `#weekday#, #D#/#month#/#YY#` | `Sat, 28/03/26` |

### Journal Path — `journalPathPattern` Examples

| Pattern | Result |
|---|---|
| `Journal/#year#/#month#/#year#-#month#-#day#_#weekday#` | `Journal/2026/03/2026-03-28_Sat` |
| `Journal/#year#/#monthname#/#D##ordinal#` | `Journal/2026/March/28th` |
| `Diary/#year#-W#weeknum#/#weekday#` | `Diary/2026-W13/Sat` |

### Weekly Notes — `weeklyNotesPathPattern` Examples

| Pattern | Result |
|---|---|
| `Journal/Weekly/#weekyear#-W#weeknum#` | `Journal/Weekly/2026-W13` |
| `Journal/Weekly/#year#/#monthname# W#weeknumraw#` | `Journal/Weekly/2026/March W3` |

## Floating Journal Calendar Intergation

```space-style
/* priority: 1000 */
body.sb-dragging-active { user-select: none !important; -webkit-user-select: none !important; }
        
#sb-journal-root {
    position: fixed;
    width: 310px;
    z-index: 100;
    font-family: system-ui, sans-serif;
    user-select: none;
    touch-action: none;
    transform-origin: 92% 8%;
    will-change: transform, opacity;
}

/* ── Size variants ─────────────────────────────────────────────────────── */
#sb-journal-root.jc-size-sm { font-size: 0.75em; }
#sb-journal-root.jc-size-lg { font-size: 1.25em; }

#sb-journal-root.jc-animate-in {
    animation: jc-implode-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

#sb-journal-root.jc-animate-out {
    animation: jc-implode-out 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes jc-implode-in {
    0% { transform: scale(0); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes jc-implode-out {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(0); opacity: 0; }
}

html[data-theme="dark"] #sb-journal-root {
    --jc-background: var(--top-background-color);
    --jc-border-color: oklch(from var(--modal-border-color) 0.65 c h / 0.5);
    --jc-elements-background: oklch(0.75 0 0 / 0.1);
    --jc-hover-background: oklch(0.65 0 0 / 0.5);
    --jc-text-color: var(--root-color);
    --jc-accent-color: var(--ui-accent-color);
    --jc-outline-color: white;
    --jc-sunday-color: oklch(0.6 0.2 30);
    --jc-dot-green: oklch(0.6 0.18 145);
    --jc-dot-yellow: oklch(0.95 0.18 95);
    --jc-dot-orange: oklch(0.8 0.20 55);
    --jc-dot-red: oklch(0.6 0.2 10);
}

html[data-theme="light"] #sb-journal-root {
    --jc-background: var(--top-background-color);
    --jc-border-color: oklch(from var(--modal-border-color) 0.65 c h / 0.5);
    --jc-elements-background: oklch(0.75 0 0 / 0.2);
    --jc-hover-background: oklch(0.75 0 0 / 0.6);
    --jc-text-color: var(--root-color);
    --jc-accent-color: var(--ui-accent-color);
    --jc-outline-color: black;
    --jc-sunday-color: oklch(0.6 0.2 30);
    --jc-dot-green: oklch(0.6 0.18 145);
    --jc-dot-yellow: oklch(0.8 0.18 95);
    --jc-dot-orange: oklch(0.75 0.20 55);
    --jc-dot-red: oklch(0.6 0.2 10);
}

/* ── Card flip ────────────────────────────────────────────────────────── */
.jc-card {
    perspective: 1000px;
    overflow: visible;
    cursor: default;
}

.jc-flip-inner {
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d; /* Safari still needs the prefix */
    transition: transform 0.52s cubic-bezier(0.4, 0, 0.2, 1),
                height   0.52s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}
.jc-flip-inner.flipped { transform: rotateY(180deg); }

/* FIX 3: Disable all hover/pointer effects during flip animation */
.jc-flip-inner.jc-flipping * { pointer-events: none !important; }

.jc-face {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    background: var(--jc-background);
    color: var(--jc-text-color);
    border-radius: 8px;
    border: 1px solid var(--jc-border-color);
    box-shadow: 0px 4px 15px 0 oklch(0 0 0 / 0.5);
    display: flex;
    flex-direction: column;
}

/* Safari fix: translateZ(1px) forces each face onto its own GPU compositor
   layer before the flip begins. Without it Safari creates layers mid-animation
   (because height also transitions on the same element), briefly rendering both
   faces and showing the front mirrored through the back. */
.jc-face-front {
    cursor: grab;
    transform: translateZ(1px);
}

.jc-face-back {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    transform: rotateY(180deg) translateZ(1px);
    cursor: default;
    overflow: hidden;
    /* FIX 5: Back face is non-interactive when not visible */
    pointer-events: none;
}

/* FIX 5: When flipped, front is non-interactive and back becomes interactive */
.jc-flip-inner.flipped .jc-face-front { pointer-events: none; }
.jc-flip-inner.flipped .jc-face-back  { pointer-events: auto; }

.jc-header {
    padding: 0.38em 0.3em;
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.3em;
}

.jc-nav-btn,
.jc-close,
.jc-today-btn {
    background: var(--jc-elements-background);
    color: var(--jc-text-color);
    border: 1px solid var(--jc-border-color);
    border-radius: 6px;
    padding: 2px 4px;
    cursor: pointer;
    font-size: 0.85em;
}

.jc-nav-btn,
.jc-today-btn {
  padding: 2px 6px; 
}

.jc-nav-btn:hover,
.jc-today-btn:hover {
    background: var(--jc-hover-background);
}

.jc-close {
    font-size: 1.2em;
    line-height: 1;
}

.jc-close:hover {
    background: oklch(0.65 0.2 30);
    color: white;
}

/* Gear — gray hover like nav buttons, not red */
#jc-gear-btn {
    font-size: 1.2em;
}
#jc-gear-btn:hover {
    background: var(--jc-hover-background);
    color: var(--jc-text-color);
}

/* Apply — green */
#jc-settings-apply {
    font-size: 1.2em;
    font-weight: bold;
}
#jc-settings-apply:hover {
    background: oklch(0.55 0.18 145);
    color: white;
    border-color: oklch(0.55 0.18 145);
}

.jc-settings-label {
  margin-bottom: 5px;
}

/* Locked toggle button in settings header */
#jc-locked-toggle {
    font-size: 0.72em;
    font-family: monospace;
    line-height: 1;
    opacity: 0.38;
    padding: 1px 4px;
    border-radius: 3px;
}
#jc-locked-toggle:hover {
    background: var(--jc-hover-background);
    color: var(--jc-text-color);
    opacity: 0.75;
}
#jc-locked-toggle.active {
    opacity: 1;
    background: var(--jc-accent-color);
    border-color: var(--jc-accent-color);
    color: white;
}

.jc-selectors {
    display: flex;
    gap: 4px;
    align-items: center;
}

.jc-select {
    background: var(--jc-elements-background);
    color: var(--jc-text-color);
    border: 1px solid var(--jc-border-color);
    border-radius: 6px;
    font-size: 0.8em;
    padding: 2px 4px;
    cursor: pointer;
    text-align: center;
}

.jc-select option {
    background: var(--modal-help-background-color);
}

.jc-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.13em;
    padding: 0.38em;
    position: relative;
}

.jc-lbl {
    font-size: 0.7em;
    opacity: 0.6;
    text-align: center;
    font-weight: bold;
}

.jc-lbl.sun {
    color: var(--jc-sunday-color);
    opacity: 1;
}

/* Week number column header label */
.jc-wk-lbl {
    font-size: 0.65em;
    opacity: 0.35;
    text-align: center;
    font-weight: bold;
    align-self: center;
}

/* Week number cell — clickable */
.jc-week-num {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80%;
    padding-right: 3px;
    font-size: 0.65em;
    opacity: 0.4;
    color: var(--jc-text-color);
    font-variant-numeric: tabular-nums;
    align-self: center;
    cursor: pointer;
    border-radius: 4px;
    transition: opacity 0.15s ease, background 0.15s ease;
}

.jc-week-num:hover {
    opacity: 0.9;
    background: var(--jc-hover-background);
}

.jc-day:not(.empty):not(.faded) {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1em;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    background: var(--jc-elements-background);
    transition: all 0.25s ease;
}

/* Faded overflow days from prev/next months */
.jc-day.faded {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1em;
    border-radius: 6px;
    position: relative;
    background: var(--jc-elements-background);
    opacity: 0.22;
    cursor: default;
    pointer-events: none;
}

.jc-day:not(.faded):hover {
    background: var(--jc-hover-background);
}

.jc-day.sun {
    color: var(--jc-sunday-color);
    font-weight: bold;
}

.jc-day.today {
    outline: 2px solid var(--jc-accent-color);
    outline-offset: -2px;
    font-weight: bold;
}

.jc-day.empty {
    background: transparent;
}

.jc-dots-container {
    display: flex;
    gap: 0.13em;
    position: absolute;
    bottom: 0.31em;
    justify-content: center;
    width: 100%;
}

.jc-dot {
    width: 0.26em;
    height: 0.26em;
    border-radius: 50%;
    box-shadow: 1px 1px 2px oklch(0 0 0 / 0.5);
}

.jc-dot.green  { background: var(--jc-dot-green); }
.jc-dot.yellow { background: var(--jc-dot-yellow); }
.jc-dot.orange { background: var(--jc-dot-orange); }
.jc-dot.red    { background: var(--jc-dot-red); }

.jc-day.sun .jc-dot.red {
    box-shadow: 0 0 0 1px white;
}

/* ── Footer ───────────────────────────────────────────────────────────── */
.jc-footer {
    border-top: 1px solid var(--jc-border-color);
    padding: 0.25em 0.5em 0.38em;
}

.jc-footer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.68em;
    opacity: 0.65;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    letter-spacing: 0.01em;
    gap: 8px;
}

.jc-streak-badge {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font-weight: 600;
    opacity: 1;
    transition: color 0.3s;
}
.jc-streak-badge.streak-cold { opacity: 0.4; font-weight: normal; }
.jc-streak-badge.streak-warm { color: oklch(0.75 0.18 60); }
.jc-streak-badge.streak-hot  { color: oklch(0.72 0.2 45); }
.jc-streak-badge.streak-epic { color: oklch(0.68 0.22 30); }

/* ── Heatmap cells ────────────────────────────────────────────────────── */
.jc-day.jc-heatmap {
    background: oklch(from var(--jc-accent-color) 0.72 c h / var(--jc-heat-opacity)) !important;
}
.jc-day.jc-heatmap:hover {
    background: oklch(from var(--jc-accent-color) 0.65 c h / calc(var(--jc-heat-opacity) + 0.18)) !important;
}

/* ── Gear button ──────────────────────────────────────────────────────── */
.jc-gear-icon {
    display: inline-block;
    transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
#jc-gear-btn:hover .jc-gear-icon { transform: rotate(60deg); }
#jc-gear-btn.active .jc-gear-icon { transform: rotate(90deg); }

/* ── Settings (back face) ─────────────────────────────────────────────── */
.jc-settings-header {
    padding: 7px 10px;
    border-bottom: 1px solid var(--jc-border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.82em;
    font-weight: 600;
    flex-shrink: 0;
    cursor: grab;
}

.jc-settings-body {
    overflow-y: auto;
    flex: 1;
    padding: 4px 10px 10px;
    display: flex;
    flex-direction: column;
    gap: 1px;
    user-select: none;
}

.jc-settings-section {
    font-size: 0.62em;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    opacity: 0.4;
    margin-top: 10px;
    margin-bottom: 3px;
    font-weight: 700;
}

.jc-settings-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 0;
    gap: 10px;
    min-height: 20px;
}

.jc-settings-label {
    font-size: 0.78em;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 5px;
}

.jc-lua-badge {
    font-size: 0.72em;
    opacity: 0.45;
    background: var(--jc-elements-background);
    border: 1px solid var(--jc-border-color);
    border-radius: 3px;
    padding: 0 3px;
    cursor: help;
    font-family: monospace;
}

.jc-settings-row.jc-locked .jc-settings-label { opacity: 0.45; }

.jc-settings-input-wrap {
    width: 100%;
    padding: 0.9em 0;
}

/* Toggle switch */
.jc-toggle {
    position: relative;
    width: 32px;
    height: 18px;
    flex-shrink: 0;
}
.jc-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
.jc-toggle-slider {
    position: absolute;
    inset: 0;
    background: oklch(0.55 0 0 / 0.25);
    border: 1px solid var(--jc-border-color);
    border-radius: 18px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
}
.jc-toggle-slider::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    left: 2px;
    top: 2px;
    background: oklch(0.85 0 0);
    border-radius: 50%;
    transition: transform 0.2s, background 0.2s;
    box-shadow: 0 1px 3px oklch(0 0 0 / 0.3);
}
html[data-theme="dark"] .jc-toggle-slider::before { background: oklch(0.65 0 0); }
.jc-toggle input:checked + .jc-toggle-slider {
    background: var(--jc-accent-color);
    border-color: var(--jc-accent-color);
}
.jc-toggle input:checked + .jc-toggle-slider::before {
    transform: translateX(14px);
    background: white;
}
.jc-toggle input:disabled + .jc-toggle-slider { opacity: 0.3; cursor: not-allowed; }

.jc-theme-paste-area{
 margint-top:30px; 
}
/* Select and text input in settings */
.jc-settings-select,
.jc-settings-input {
    background: var(--jc-elements-background);
    color: var(--jc-text-color);
    border: 1px solid var(--jc-border-color);
    border-radius: 5px;
    font-size: 0.78em;
    padding: 2px 5px;
    cursor: pointer;
    user-select: text;
}
.jc-settings-select { min-width: 90px; }
.jc-settings-select option { background: var(--modal-help-background-color); }
.jc-settings-input {
    width: 100%;
    box-sizing: border-box;
    cursor: text;
    font-family: monospace;
    font-size: 0.96em;
}
.jc-settings-input:disabled,
.jc-settings-select:disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }
```

```space-lua
-- priority: -1
config.define("FloatingJournalCalendar", {
  type = "object",
  properties = {
    journalPathPattern     = schema.string(),
    weeklyNotesPathPattern = schema.string(),
    monthNames             = { type = "array", items = { type = "string" } },
    dayNames               = { type = "array", items = { type = "string" } },
    weekStartsSunday       = schema.boolean(),
    showWeekNumbers        = schema.boolean(),
    weekNumberSystem       = schema.string(),
    showFooter             = schema.boolean(),
    footerMoonPhase        = schema.boolean(),
    footerMonthCount       = schema.boolean(),
    footerTotalCount       = schema.boolean(),
    footerLastEntry        = schema.boolean(),
    footerStreak           = schema.boolean(),
    useHeatmap             = schema.boolean(),
    showContour            = schema.boolean(),
    shiftDatePattern       = schema.string(),
    colors                 = {
      type = "object",
      properties = {
        accentColor        = schema.string(),
        background         = schema.string(),
        borderColor        = schema.string(),
        elementsBackground = schema.string(),
        hoverBackground    = schema.string(),
        textColor          = schema.string(),
        outlineColor       = schema.string(),
        sundayColor        = schema.string(),
        dotGreen           = schema.string(),
        dotYellow          = schema.string(),
        dotOrange          = schema.string(),
        dotRed             = schema.string()
      }
    }
  }
})

local function quote_list(t)
    local quoted = {}
    for i, v in ipairs(t) do
        quoted[i] = '"' .. v .. '"'
    end
    return "[" .. table.concat(quoted, ", ") .. "]"
end

function toggleFloatingJournalCalendar()
    local existing_root = js.window.document.getElementById("sb-journal-root")
    if existing_root then 
        js.window.eval([[ (el) => {
            el.classList.add("jc-animate-out");
            setTimeout(() => el.remove(), 300);
        }]])(existing_root)
        return 
    end

    local cfg = config.get("FloatingJournalCalendar") or {}
    local path_pattern         = cfg.journalPathPattern or 'Journal/#year#/#month#-#monthname#/#year#-#month#-#day#_#weekday#'
    local weekly_path_pattern  = cfg.weeklyNotesPathPattern or 'Journal/Weekly/#weekyear#-W#weeknum#'
    local month_names          = quote_list(cfg.monthNames or {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"})
    local day_names            = quote_list(cfg.dayNames or {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"})
    local week_starts_sunday   = cfg.weekStartsSunday or false
    local show_week_numbers    = cfg.showWeekNumbers
    if show_week_numbers == nil then show_week_numbers = true end
    local week_number_system   = cfg.weekNumberSystem or "iso"

    local show_footer          = cfg.showFooter
    if show_footer == nil then show_footer = true end
    local footer_moon_phase    = cfg.footerMoonPhase
    if footer_moon_phase == nil then footer_moon_phase = true end
    local footer_month_count   = cfg.footerMonthCount
    if footer_month_count == nil then footer_month_count = true end
    local footer_total_count   = cfg.footerTotalCount
    if footer_total_count == nil then footer_total_count = true end
    local footer_last_entry    = cfg.footerLastEntry
    if footer_last_entry == nil then footer_last_entry = true end
    local footer_streak        = cfg.footerStreak
    if footer_streak == nil then footer_streak = true end
    local use_heatmap          = cfg.useHeatmap
    if use_heatmap == nil then use_heatmap = false end
    local show_contour         = cfg.showContour
    if show_contour == nil then show_contour = true end
    local shift_date_pattern   = cfg.shiftDatePattern or '#year#-#month#-#day#'
    local colors               = cfg.colors or {}

    -- FIX 1: Use the correct JS-side keys "months" and "days" (not "monthNames"/"dayNames")
    -- so that LUA_OVERRIDES matches what buildSettingsBody() checks.
    local lua_override_parts = {}
    local function mark(key, val) if val ~= nil then table.insert(lua_override_parts, '"' .. key .. '":true') end end
    mark("pattern",           cfg.journalPathPattern)
    mark("weeklyPattern",     cfg.weeklyNotesPathPattern)
    mark("months",            cfg.monthNames)   -- was "monthNames" — key must match JS draft key
    mark("days",              cfg.dayNames)     -- was "dayNames"   — key must match JS draft key
    mark("weekStartsSunday",  cfg.weekStartsSunday)
    mark("showWeekNumbers",   cfg.showWeekNumbers)
    mark("weekNumSystem",     cfg.weekNumberSystem)
    mark("showFooter",        cfg.showFooter)
    mark("footerMoonPhase",   cfg.footerMoonPhase)
    mark("footerMonthCount",  cfg.footerMonthCount)
    mark("footerTotalCount",  cfg.footerTotalCount)
    mark("footerLastEntry",   cfg.footerLastEntry)
    mark("footerStreak",      cfg.footerStreak)
    mark("useHeatmap",        cfg.useHeatmap)
    mark("showContour",       cfg.showContour)
    mark("shiftDatePattern",  cfg.shiftDatePattern)
    mark("colors",            cfg.colors)
    local lua_overrides_json = "{" .. table.concat(lua_override_parts, ",") .. "}"

    local all_pages = space.listPages()
    local page_map_items = {}
    for _, p in ipairs(all_pages) do
        table.insert(page_map_items, '"' .. p.name .. '":true')
    end
    local existing_pages_json = "{" .. table.concat(page_map_items, ",") .. "}"

    local sessionID    = "jc_" .. math.floor(os.time())
    local saved_top    = clientStore.get("jc_pos_top") or "80px"
    local saved_left   = clientStore.get("jc_pos_left") or "auto"
    local initial_right = "20px"
    if saved_left ~= "auto" then initial_right = "auto" end

    js.window.addEventListener("sb-journal-event", function(e)
        if e.detail.session == sessionID then
            if e.detail.action == "navigate" then
                local prefix = e.detail.path
                if e.detail.ctrlKey or e.detail.metaKey then
                    local sel = editor.getSelection()
                    if sel and sel.from ~= sel.to then
                        local selectedText = editor.getText():sub(sel.from + 1, sel.to)
                        editor.replaceRange(sel.from, sel.to, "[[" .. prefix .. "|" .. selectedText .. "]]")
                    else
                        editor.insertAtCursor("[[" .. prefix .. "]]")
                    end
                    return
                end
                local matches = {}
                local current_pages = space.listPages()
                for _, p in ipairs(current_pages) do
                    if p.name:find(prefix, 1, true) == 1 then
                        table.insert(matches, { name = p.name, value = p.name })
                    end
                end
                if #matches > 1 then
                    local selection = editor.filterBox("Select Journal Entry:", matches, "Multiple entries found for this date.", "Pick a page...")
                    if selection then editor.navigate(selection.value) end
                else
                    local final_path = (#matches == 1) and matches[1].value or prefix
                    editor.navigate(final_path)
                end
            elseif e.detail.action == "insert-date" then
                    editor.insertAtCursor(e.detail.dateText)
            elseif e.detail.action == "insert-wikilink-alias" then
                    editor.insertAtCursor("[[" .. e.detail.path .. "|" .. e.detail.dateText .. "]]")
            elseif e.detail.action == "navigate-week" then
                editor.navigate(e.detail.path)
            elseif e.detail.action == "request-refresh" then
                refreshCalendarDots()
            elseif e.detail.action == "save_pos" then
                clientStore.set("jc_pos_top",  e.detail.top)
                clientStore.set("jc_pos_left", e.detail.left)
            end
        end
    end)

    local container = js.window.document.createElement("div")
    container.id = "sb-journal-root"
    container.classList.add("jc-animate-in")
    container.innerHTML = [[
    <style>
      #sb-journal-root {
        top: ]] .. saved_top .. [[;
        left: ]] .. saved_left .. [[;
        right: ]] .. initial_right .. [[;
      }
      #sb-journal-root.ctrl-active  .jc-day { cursor: copy !important; }
      #sb-journal-root.shift-active .jc-day { cursor: context-menu !important; }
      #sb-journal-root.ctrl-active.shift-active .jc-day { cursor: alias !important; }
    </style>
    <div class="jc-card" id="jc-draggable">
        <div class="jc-flip-inner" id="jc-flip-inner">
            <div class="jc-face jc-face-front" id="jc-face-front">
                <div class="jc-header" id="jc-handle">
                    <button class="jc-nav-btn" id="jc-prev">‹</button>
                    <div class="jc-selectors">
                        <select id="jc-month" class="jc-select"></select>
                        <select id="jc-year"  class="jc-select"></select>
                        <button class="jc-today-btn" id="jc-today" title="Jump to Today & Refresh">↺</button>
                    </div>
                    <button class="jc-nav-btn" id="jc-next">›</button>
                    <button class="jc-close" id="jc-gear-btn" title="Settings"><span class="jc-gear-icon">⛭</span></button>
                    <button class="jc-close" id="jc-close-btn">✕</button>
                </div>
                <div class="jc-grid" id="jc-labels"></div>
                <div class="jc-grid" id="jc-days"></div>
                <div class="jc-footer" id="jc-footer">
                    <div class="jc-footer-row" id="jc-footer-row"></div>
                </div>
            </div>
            <div class="jc-face jc-face-back" id="jc-face-back">
                <div class="jc-settings-header" id="jc-settings-header">
                    <span>⛭ Settings</span>
                    <div style="display:flex;gap:4px;align-items:center">
                        <button class="jc-close" id="jc-locked-toggle" title="Show locked (lua) fields">lua</button>
                        <button class="jc-close" id="jc-settings-apply" title="Apply & close">✓</button>
                        <button class="jc-close" id="jc-settings-close" title="Discard & close">✕</button>
                    </div>
                </div>
                <div class="jc-settings-body" id="jc-settings-body"></div>
            </div>
        </div>
    </div>
    ]]

    js.window.document.body.appendChild(container)

    local scriptEl = js.window.document.createElement("script")
    scriptEl.innerHTML = [[
    (function() {
        const session          = "]]..sessionID..[[";
        let months             = ]]..month_names..[[;
        let days               = ]]..day_names..[[;
        let weekStartsSunday   = ]]..tostring(week_starts_sunday)..[[;
        let showWeekNumbers    = ]]..tostring(show_week_numbers)..[[;
        let weekNumSystem      = "]]..week_number_system..[[";
        let weeklyPattern      = "]]..weekly_path_pattern..[[";
        let showFooter         = ]]..tostring(show_footer)..[[;
        let footerMoonPhase    = ]]..tostring(footer_moon_phase)..[[;
        let footerMonthCount   = ]]..tostring(footer_month_count)..[[;
        let footerTotalCount   = ]]..tostring(footer_total_count)..[[;
        let footerLastEntry    = ]]..tostring(footer_last_entry)..[[;
        let footerStreak       = ]]..tostring(footer_streak)..[[;
        let useHeatmap         = ]]..tostring(use_heatmap)..[[;
        let showContour        = ]]..tostring(show_contour)..[[;
        let   existing         = ]]..existing_pages_json..[[;
        let   pattern          = "]]..path_pattern..[[";
        let   shiftDatePattern = "]]..shift_date_pattern..[[";
        let   calSize          = 'md';
        let   colors           = ]]..(function()
            if not colors or next(colors) == nil then return "{}" end
            local parts = {}
            for k, v in pairs(colors) do
                table.insert(parts, '"' .. k .. '":"' .. tostring(v):gsub('"', '\\"') .. '"')
            end
            return "{" .. table.concat(parts, ",") .. "}"
        end)()..[[;
        const root             = document.getElementById("sb-journal-root");

        const LUA_OVERRIDES = ]]..lua_overrides_json..[[;
        const LS_KEY = 'jc_settings_v1';

        (function() {
            try {
                const s = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
                const a = (k, setter) => { if (!LUA_OVERRIDES[k] && k in s) setter(s[k]); };
                a('months',          v => months          = v);
                a('days',            v => days            = v);
                a('weekStartsSunday',v => weekStartsSunday= v);
                a('showWeekNumbers', v => showWeekNumbers = v);
                a('weekNumSystem',   v => weekNumSystem   = v);
                a('weeklyPattern',   v => weeklyPattern   = v);
                a('pattern',         v => pattern         = v);
                a('showFooter',      v => showFooter      = v);
                a('footerMoonPhase', v => footerMoonPhase = v);
                a('footerMonthCount',v => footerMonthCount= v);
                a('footerTotalCount',v => footerTotalCount= v);
                a('footerLastEntry', v => footerLastEntry = v);
                a('footerStreak',    v => footerStreak    = v);
                a('useHeatmap',      v => useHeatmap      = v);
                a('showContour',     v => showContour     = v);
                a('shiftDatePattern',v => shiftDatePattern= v);
                // calSize is a pure client setting, never locked by Lua
                a('calSize',         v => calSize         = v);
                // Load colors from localStorage, respecting Lua overrides
                a('colors',          v => { if (!LUA_OVERRIDES['colors']) colors = { ...colors, ...v }; });
            } catch(e) {}
        })();

        // ── Color Utilities ────────────────────────────────────────────────────
        // Convert oklch to rgb for color picker display
        // Accurate conversion: oklch → lab → xyz(D65) → linear srgb → gamma srgb
        function oklchToRgb(L, C, h, alpha = 1) {
            // Normalize inputs
            L = Math.max(0, Math.min(1, L));
            C = Math.max(0, C);
            h = ((h % 360) + 360) % 360;

            // oklch → lab (Oklab)
            const hRad = h * Math.PI / 180;
            const a = C * Math.cos(hRad);
            const b = C * Math.sin(hRad);

            // lab → xyz (D65) using proper Oklab inversion
            // Oklab is defined as a linear transform of XYZ (with cube root)
            // l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ^ 3
            // m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ^ 3
            // s_ = (L - 0.0894841775 * a - 1.2914855480 * b) ^ 3
            // Then XYZ = M^-1 * [l_, m_, s_]

            const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
            const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
            const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

            const l3 = l_ * l_ * l_;
            const m3 = m_ * m_ * m_;
            const s3 = s_ * s_ * s_;

            // Inverse of the Oklab matrix (converts LMS cubic back to XYZ)
            // This is the correct inverse transformation
            const x =  1.227013851 * l3 - 0.557799289 * m3 + 0.281256152 * s3;
            const y = -0.040580178 * l3 + 1.112256371 * m3 - 0.0716762 * s3;
            const z = -0.076381285 * l3 - 0.421481978 * m3 + 1.586635227 * s3;

            // xyz → linear srgb (using proper D65 matrix)
            const rLin =  3.240969941904522 * x - 1.537383177570093 * y - 0.498610760293056 * z;
            const gLin = -0.969243636280880 * x + 1.875967501507721 * y + 0.041555057408176 * z;
            const bLin =  0.055630079696993 * x - 0.203976958888976 * y + 1.056971514242878 * z;

            // linear srgb → gamma srgb
            function gamma(c) {
                const absC = Math.abs(c);
                const signC = Math.sign(c);
                if (absC <= 0.0031308) {
                    return signC * 12.92 * absC;
                }
                return signC * (1.055 * Math.pow(absC, 1/2.4) - 0.055);
            }

            let r = gamma(rLin);
            let g = gamma(gLin);
            let b_ = gamma(bLin);

            return {
                r: Math.round(Math.max(0, Math.min(255, r * 255))),
                g: Math.round(Math.max(0, Math.min(255, g * 255))),
                b: Math.round(Math.max(0, Math.min(255, b_ * 255))),
                a: alpha
            };
        }

        // Parse oklch() or oklch(from ...) CSS values
        function parseOklch(cssValue) {
            // Handle oklch(l c h / alpha) or oklch(l c h)
            const match = cssValue.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/);
            if (match) {
                return oklchToRgb(
                    parseFloat(match[1]),
                    parseFloat(match[2]),
                    parseFloat(match[3]),
                    match[4] ? parseFloat(match[4]) : 1
                );
            }
            // Handle oklch(from var(...) l c h / alpha)
            const fromMatch = cssValue.match(/oklch\(\s*from\s+[^)]+\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/);
            if (fromMatch) {
                return oklchToRgb(
                    parseFloat(fromMatch[1]),
                    parseFloat(fromMatch[2]),
                    parseFloat(fromMatch[3]),
                    fromMatch[4] ? parseFloat(fromMatch[4]) : 1
                );
            }
            return null;
        }

        // Convert any CSS color to hex for color picker
        function colorToHex(cssValue) {
            if (!cssValue) return null;
            // Try parsing oklch first
            const rgb = parseOklch(cssValue);
            if (rgb) {
                return '#' + [rgb.r, rgb.g, rgb.b].map(x => x.toString(16).padStart(2, '0')).join('');
            }
            // If already hex, return as-is
            if (cssValue.startsWith('#')) return cssValue.slice(0, 7);
            // For CSS variables or other values, try to use root's computed style
            // without creating new DOM elements (to avoid layout thrashing)
            try {
                const computed = getComputedStyle(root).getPropertyValue(cssValue.replace('var(', '').replace(')', '')).trim();
                if (computed && computed.startsWith('#')) return computed.slice(0, 7);
                // Try parsing as oklch if computed is oklch
                const computedRgb = parseOklch(computed);
                if (computedRgb) {
                    return '#' + [computedRgb.r, computedRgb.g, computedRgb.b].map(x => x.toString(16).padStart(2, '0')).join('');
                }
            } catch(e) {}
            return null;
        }

        // Apply custom colors to the root element
        function applyCustomColors() {
            if (!colors) return;
            const colorMap = {
                accentColor: '--jc-accent-color',
                background: '--jc-background',
                borderColor: '--jc-border-color',
                elementsBackground: '--jc-elements-background',
                hoverBackground: '--jc-hover-background',
                textColor: '--jc-text-color',
                outlineColor: '--jc-outline-color',
                sundayColor: '--jc-sunday-color',
                dotGreen: '--jc-dot-green',
                dotYellow: '--jc-dot-yellow',
                dotOrange: '--jc-dot-orange',
                dotRed: '--jc-dot-red'
            };
            Object.entries(colors).forEach(([key, val]) => {
                if (colorMap[key] && val) {
                    root.style.setProperty(colorMap[key], val);
                }
            });
        }

        // Apply colors on init
        applyCustomColors();

        // Apply initial size class
        (function() {
            root.classList.remove('jc-size-sm', 'jc-size-lg');
            if (calSize === 'sm') root.classList.add('jc-size-sm');
            else if (calSize === 'lg') root.classList.add('jc-size-lg');
        })();

        function saveSettings(obj) {
            try {
                const s = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
                Object.assign(s, obj);
                localStorage.setItem(LS_KEY, JSON.stringify(s));
            } catch(e) {}
        }

        const SNAP       = 15;
        const TOP_OFFSET = 65;
        let vDate = new Date();

        // Track modifier keys for cursor feedback and click behaviour.
        // NOTE: We do NOT use isShiftDown for drag — Shift+Drag is unreliable on Mac/Safari.
        //       Shift is handled via Shift+Click instead (see el.onclick below).
        window.addEventListener("keydown", (e) => {
            if (e.ctrlKey || e.metaKey) root.classList.add("ctrl-active");
            if (e.shiftKey)             root.classList.add("shift-active");
        });
        window.addEventListener("keyup", (e) => {
            if (!e.ctrlKey && !e.metaKey) root.classList.remove("ctrl-active");
            if (!e.shiftKey)              root.classList.remove("shift-active");
        });

        // ── Settings (flip card) ──────────────────────────────────────────────
        let settingsOpen = false;
        let showLocked   = false; // locked (lua) fields hidden by default
        let draft = {}; // pending changes, only applied on ✅

        function flipCard(open) {
            settingsOpen = open;
            const inner = document.getElementById('jc-flip-inner');
            const front = document.getElementById('jc-face-front');
            const back  = document.getElementById('jc-face-back');
            const gear  = document.getElementById('jc-gear-btn');

            if (open) {
                // FIX 4: Remove contour SVG before flipping — it bleeds through on mobile
                const existingSvg = document.getElementById("jc-contour-svg");
                if (existingSvg) existingSvg.remove();

                draft = {
                    months, days, weekStartsSunday, showWeekNumbers, weekNumSystem,
                    weeklyPattern, pattern, shiftDatePattern, showFooter, footerMoonPhase,
                    footerMonthCount, footerTotalCount, footerLastEntry, footerStreak,
                    useHeatmap, showContour, calSize, colors: { ...(colors || {}) }
                };
                buildSettingsBody();

                const calH = front.offsetHeight;
                inner.style.height = calH + 'px';

                // Measure back face natural height directly — back has position:absolute
                // top:0;bottom:0 so visibility/minHeight tricks were no-ops and caused
                // a GPU compositor flash on the front face in preserve-3d context.
                const rawSettingsH = back.scrollHeight;

                // Cap settings height to available viewport height
                const maxAvailH = window.innerHeight - TOP_OFFSET - 20;
                const settingsH = Math.min(Math.max(rawSettingsH, calH), maxAvailH);

                gear.classList.add('active');
                // FIX 3: Disable pointer events on all children during flip to prevent hover flicker
                inner.classList.add('jc-flipping');
                setTimeout(() => inner.classList.remove('jc-flipping'), 600);
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    inner.classList.add('flipped');
                    inner.style.height = settingsH + 'px';
                    setTimeout(clamp, 560); // clamp after flip animation
                }));
            } else {
                const calH = front.scrollHeight;
                // FIX 3: Disable pointer events during flip-back too
                inner.classList.add('jc-flipping');
                setTimeout(() => inner.classList.remove('jc-flipping'), 600);
                inner.classList.remove('flipped');
                inner.style.height = calH + 'px';
                gear.classList.remove('active');
                setTimeout(() => { if (!settingsOpen) inner.style.height = ''; }, 560);
            }
        }

        function applySettings() {
            // Copy draft to live vars
            months          = draft.months;
            days            = draft.days;
            weekStartsSunday= draft.weekStartsSunday;
            showWeekNumbers = draft.showWeekNumbers;
            weekNumSystem   = draft.weekNumSystem;
            weeklyPattern   = draft.weeklyPattern;
            pattern         = draft.pattern;
            showFooter      = draft.showFooter;
            footerMoonPhase = draft.footerMoonPhase;
            footerMonthCount= draft.footerMonthCount;
            footerTotalCount= draft.footerTotalCount;
            footerLastEntry = draft.footerLastEntry;
            footerStreak    = draft.footerStreak;
            useHeatmap      = draft.useHeatmap;
            showContour     = draft.showContour;
            shiftDatePattern= draft.shiftDatePattern;
            calSize         = draft.calSize;
            colors          = draft.colors || {};
            // Persist only non-lua-locked keys (calSize is never locked)
            const toSave = {};
            Object.keys(draft).forEach(k => { if (!LUA_OVERRIDES[k]) toSave[k] = draft[k]; });
            // Handle nested colors - respect Lua override on the entire colors object
            if (!LUA_OVERRIDES.colors) {
                toSave.colors = draft.colors || {};
            }
            saveSettings(toSave);
            flipCard(false);
            // Delay render AND color application until after the flip animation completes
            // (520ms transition + 50ms buffer). Firing at 50ms caused the calendar side
            // to blink because DOM mutations landed mid-animation.
            // Colors are already live-previewed via color-picker oninput, so deferring
            // applyCustomColors() here is safe.
            setTimeout(() => {
                root.classList.remove('jc-size-sm', 'jc-size-lg');
                if (calSize === 'sm') root.classList.add('jc-size-sm');
                else if (calSize === 'lg') root.classList.add('jc-size-lg');
                applyCustomColors();
                render();
            }, 50);
        }

        // ── Update locked field visibility ────────────────────────────────────
        // Hides/shows .jc-locked rows and also hides section headers that
        // have no visible (unlocked) children beneath them.
        function updateLockedVisibility() {
            const body = document.getElementById('jc-settings-body');
            if (!body) return;
            const children = [...body.children];
            let lastSection = null;
            let sectionHasUnlocked = false;

            children.forEach(el => {
                if (el.classList.contains('jc-settings-section')) {
                    // Resolve previous section: hide it if all items below were locked
                    if (lastSection) {
                        lastSection.style.display = (!showLocked && !sectionHasUnlocked) ? 'none' : '';
                    }
                    lastSection = el;
                    sectionHasUnlocked = false;
                    el.style.display = ''; // tentatively show, resolved above next time
                } else if (el.classList.contains('jc-locked')) {
                    el.style.display = showLocked ? 'flex' : 'none';
                } else {
                    if (el.style.display !== 'none') el.style.display = '';
                    sectionHasUnlocked = true;
                    //el.style.display = '';
                    //sectionHasUnlocked = true;
                }
            });
            // Resolve the final section
            if (lastSection) {
                lastSection.style.display = (!showLocked && !sectionHasUnlocked) ? 'none' : '';
            }

            // Update the toggle button appearance
            const btn = document.getElementById('jc-locked-toggle');
            if (btn) {
                btn.classList.toggle('active', showLocked);
                btn.title = showLocked ? 'Hide locked (lua) fields' : 'Show locked (lua) fields';
            }
        }

        function buildSettingsBody() {
            const body = document.getElementById('jc-settings-body');
            if (!body) return;
            body.innerHTML = '';

            // Stop all keyboard events from leaking to SilverBullet
            body.onkeydown = e => e.stopPropagation();

            function makeToggle(key, label, hint) {
                const locked = !!LUA_OVERRIDES[key];
                const row = document.createElement('div');
                row.className = 'jc-settings-row' + (locked ? ' jc-locked' : '');
                row.innerHTML = `
                  <label class="jc-settings-label" title="${hint || ''}">
                    ${label}
                    ${locked ? '<span class="jc-lua-badge" title="Locked — set via Lua config">lua</span>' : ''}
                  </label>
                  <label class="jc-toggle">
                    <input type="checkbox" ${draft[key] ? 'checked' : ''} ${locked ? 'disabled' : ''}>
                    <span class="jc-toggle-slider"></span>
                  </label>`;
                if (!locked) {
                    row.querySelector('input').onchange = e => { draft[key] = e.target.checked; };
                }
                body.appendChild(row);
            }

            function makeSelect(key, label, options) {
                const locked = !!LUA_OVERRIDES[key];
                const row = document.createElement('div');
                row.className = 'jc-settings-row' + (locked ? ' jc-locked' : '');
                const optHtml = options.map(([v, l]) =>
                    `<option value="${v}" ${draft[key] === v ? 'selected' : ''}>${l}</option>`).join('');
                row.innerHTML = `
                  <label class="jc-settings-label">
                    ${label}
                    ${locked ? '<span class="jc-lua-badge" title="Locked — set via Lua config">lua</span>' : ''}
                  </label>
                  <select class="jc-settings-select" ${locked ? 'disabled' : ''}>${optHtml}</select>`;
                if (!locked) {
                    row.querySelector('select').onchange = e => { draft[key] = e.target.value; };
                }
                body.appendChild(row);
            }

            function makeTextInput(key, label) {
                const locked = !!LUA_OVERRIDES[key];
                const val = Array.isArray(draft[key]) ? draft[key].join(', ') : (draft[key] || '');
                const wrap = document.createElement('div');
                wrap.className = 'jc-settings-row jc-settings-input-wrap' + (locked ? ' jc-locked' : '');
                wrap.innerHTML = `
                  <div style="width:100%">
                    <div class="jc-settings-label">
                      ${label}
                      ${locked ? '<span class="jc-lua-badge" title="Locked — set via Lua config">lua</span>' : ''}
                    </div>
                    <input class="jc-settings-input" type="text" value="${val.replace(/"/g,'&quot;')}"
                      ${locked ? 'disabled readonly' : ''}>
                  </div>`;
                if (!locked) {
                    const inp = wrap.querySelector('input');
                    // Capture all keyboard events so they don't reach SilverBullet
                    inp.addEventListener('keydown', e => e.stopPropagation());
                    inp.addEventListener('keyup',   e => e.stopPropagation());
                    inp.oninput = () => {
                        if (Array.isArray(draft[key])) {
                            draft[key] = inp.value.split(',').map(s => s.trim()).filter(Boolean);
                        } else {
                            draft[key] = inp.value;
                        }
                    };
                }
                body.appendChild(wrap);
            }

            function section(label) {
                const el = document.createElement('div');
                el.className = 'jc-settings-section';
                el.textContent = label;
                body.appendChild(el);
            }

            // Get default colors - avoid getComputedStyle to prevent layout thrashing during flip
            function getDefaultColor(key) {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                // Return hardcoded hex defaults to avoid expensive style calculations
                const defaults = {
                    accentColor: isDark ? '#6366f1' : '#4f46e5',
                    background: isDark ? '#1f2937' : '#ffffff',
                    borderColor: isDark ? '#6b7280' : '#d1d5db',
                    elementsBackground: isDark ? '#374151' : '#f3f4f6',
                    hoverBackground: isDark ? '#4b5563' : '#e5e7eb',
                    textColor: isDark ? '#e5e7eb' : '#111827',
                    outlineColor: isDark ? '#ffffff' : '#000000',
                    sundayColor: '#dc2626',
                    dotGreen: '#16a34a',
                    dotYellow: isDark ? '#facc15' : '#ca8a04',
                    dotOrange: isDark ? '#fb923c' : '#ea580c',
                    dotRed: '#dc2626'
                };
                return defaults[key] || '#6366f1';
            }

            function makeColorPicker(key, label, hint) {
                const locked = !!(LUA_OVERRIDES.colors && LUA_OVERRIDES.colors[key]);
                const row = document.createElement('div');
                row.className = 'jc-settings-row' + (locked ? ' jc-locked' : '');

                // Get current value (draft > colors > default)
                const currentVal = draft.colors?.[key] || colors?.[key];
                const defaultHex = colorToHex(getDefaultColor(key));
                const hexValue = currentVal ? colorToHex(currentVal) : defaultHex;

                row.innerHTML = `
                  <label class="jc-settings-label" title="${hint || ''}">
                    ${label}
                    ${locked ? '<span class="jc-lua-badge" title="Locked — set via Lua config">lua</span>' : ''}
                  </label>
                  <div style="display:flex;gap:6px;align-items:center">
                    <input type="color" class="jc-settings-color" value="${hexValue || '#6366f1'}" ${locked ? 'disabled' : ''}
                           style="width:44px;height:24px;padding:0;border:1px solid var(--jc-border-color);border-radius:4px;cursor:pointer;background:none">
                    <button class="jc-reset-color" title="Reset to default" ${locked ? 'disabled' : ''}
                            style="font-size:0.7em;padding:2px 6px;border:1px solid var(--jc-border-color);border-radius:4px;background:var(--jc-elements-background);color:var(--jc-text-color);cursor:pointer;opacity:${currentVal ? '1' : '0.4'}">↺</button>
                  </div>`;

                if (!locked) {
                    const colorInput = row.querySelector('input[type="color"]');
                    const resetBtn = row.querySelector('.jc-reset-color');

                    // Update draft when color changes
                    colorInput.oninput = (e) => {
                        draft.colors = draft.colors || {};
                        draft.colors[key] = e.target.value;
                        resetBtn.style.opacity = '1';
                        // Preview immediately
                        const colorMap = {
                            accentColor: '--jc-accent-color',
                            background: '--jc-background',
                            borderColor: '--jc-border-color',
                            elementsBackground: '--jc-elements-background',
                            hoverBackground: '--jc-hover-background',
                            textColor: '--jc-text-color',
                            outlineColor: '--jc-outline-color',
                            sundayColor: '--jc-sunday-color',
                            dotGreen: '--jc-dot-green',
                            dotYellow: '--jc-dot-yellow',
                            dotOrange: '--jc-dot-orange',
                            dotRed: '--jc-dot-red'
                        };
                        if (colorMap[key]) {
                            root.style.setProperty(colorMap[key], e.target.value);
                        }
                    };

                    // Reset to default
                    resetBtn.onclick = () => {
                        draft.colors = draft.colors || {};
                        delete draft.colors[key];
                        const defaultVal = getDefaultColor(key);
                        colorInput.value = colorToHex(defaultVal) || '#6366f1';
                        resetBtn.style.opacity = '0.4';
                        // Remove inline style to revert to CSS default
                        const colorMap = {
                            accentColor: '--jc-accent-color',
                            background: '--jc-background',
                            borderColor: '--jc-border-color',
                            elementsBackground: '--jc-elements-background',
                            hoverBackground: '--jc-hover-background',
                            textColor: '--jc-text-color',
                            outlineColor: '--jc-outline-color',
                            sundayColor: '--jc-sunday-color',
                            dotGreen: '--jc-dot-green',
                            dotYellow: '--jc-dot-yellow',
                            dotOrange: '--jc-dot-orange',
                            dotRed: '--jc-dot-red'
                        };
                        if (colorMap[key]) {
                            root.style.removeProperty(colorMap[key]);
                        }
                    };
                }
                body.appendChild(row);
            }

            function makeResetColorsButton() {
                const locked = !!LUA_OVERRIDES.colors;
                const row = document.createElement('div');
                row.className = 'jc-settings-row' + (locked ? ' jc-locked' : '');
                row.style.marginTop = '8px';

                const hasCustomColors = colors && Object.keys(colors).length > 0;

                row.innerHTML = `
                  <div></div>
                  <button class="jc-reset-all-colors" ${locked ? 'disabled' : ''}
                          style="font-size:0.75em;padding:4px 10px;border:1px solid var(--jc-border-color);border-radius:5px;background:var(--jc-elements-background);color:var(--jc-text-color);cursor:pointer;opacity:${hasCustomColors && !locked ? '1' : '0.4'}">
                    Reset all colors
                  </button>`;

                if (!locked) {
                    const btn = row.querySelector('.jc-reset-all-colors');
                    if (hasCustomColors) {
                        btn.onclick = () => {
                            draft.colors = {};
                            colors = {}; // Also clear live colors so pickers show defaults
                            // Rebuild to reset all color pickers
                            buildSettingsBody();
                            // Clear all custom color styles
                            const colorProps = ['--jc-accent-color', '--jc-background', '--jc-border-color',
                                              '--jc-elements-background', '--jc-hover-background', '--jc-text-color', '--jc-outline-color',
                                              '--jc-sunday-color', '--jc-dot-green', '--jc-dot-yellow', '--jc-dot-orange', '--jc-dot-red'];
                            colorProps.forEach(prop => root.style.removeProperty(prop));
                        };
                    }
                }
                body.appendChild(row);
            }

            // ── Theme import / export ─────────────────────────────────────────────
            // Export: serialize draft.colors → JSON → clipboard (+ "Copied!" flash).
            // Import: toggle an inline paste area so clipboard-API permission is never
            //         needed (Safari blocks it in many contexts). User pastes the JSON,
            //         hits Apply, colors are validated and live-previewed.
            function makeColorThemeBar() {
                const locked = !!LUA_OVERRIDES.colors;

                const VALID_KEYS = ['accentColor','background','borderColor','elementsBackground',
                    'hoverBackground','textColor','outlineColor','sundayColor',
                    'dotGreen','dotYellow','dotOrange','dotRed'];

                const colorMap = {
                    accentColor:'--jc-accent-color', background:'--jc-background',
                    borderColor:'--jc-border-color', elementsBackground:'--jc-elements-background',
                    hoverBackground:'--jc-hover-background', textColor:'--jc-text-color',
                    outlineColor:'--jc-outline-color', sundayColor:'--jc-sunday-color',
                    dotGreen:'--jc-dot-green', dotYellow:'--jc-dot-yellow',
                    dotOrange:'--jc-dot-orange', dotRed:'--jc-dot-red'
                };

                const btnStyle = `font-size:0.75em;padding:4px 10px;border:1px solid var(--jc-border-color);
                    border-radius:5px;background:var(--jc-elements-background);color:var(--jc-text-color);
                    cursor:pointer;display:inline-flex;align-items:center;gap:4px;`;

                // ── Export / Import toggle row ────────────────────────────────────
                const exportRow = document.createElement('div');
                exportRow.className = 'jc-settings-row';
                exportRow.style.cssText = 'margin-top:4px;gap:6px;justify-content:flex-end;flex-wrap:wrap;';
                exportRow.innerHTML = `
                  <span style="font-size:0.72em;opacity:0.5;flex:1;align-self:center;">Theme</span>
                  <button class="jc-theme-export" title="Copy theme JSON to clipboard" style="${btnStyle}">
                    📋 Copy theme
                  </button>
                  <button class="jc-theme-import-toggle" title="Paste a theme JSON" style="${btnStyle}${locked?';opacity:0.4;cursor:not-allowed;':''}">
                    📥 Paste theme
                  </button>`;
                body.appendChild(exportRow);

                // ── Import paste area (hidden until Paste theme is clicked) ───────
                const importWrap = document.createElement('div');
                // Set layout properties via cssText, then set display separately.
                // Bundling display:none into cssText alongside flex-direction can be
                // misparsed by Safari/WebKit, leaving the area always visible on open.
                //importWrap.style.cssText = 'flex-direction:column;gap:5px;padding:4px 0 6px;';
                //importWrap.style.display = 'none';
                importWrap.style.cssText = 'gap:5px;padding:10px 0 6px;';
                importWrap.style.display = 'none';
                importWrap.innerHTML = `
                  <textarea class="jc-theme-paste-area jc-settings-input"
                    rows="3" spellcheck="false" autocomplete="off"
                    placeholder='{"accentColor":"#6366f1","background":"#1f2937", …}'
                    style="resize:vertical;min-height:52px;font-size:0.78em;line-height:1.4;font-family:monospace;width:100%;box-sizing:border-box;"></textarea>
                  <div style="display:flex;gap:6px;justify-content:flex-end;align-items:center;">
                    <span class="jc-theme-import-msg" style="font-size:0.72em;flex:1;"></span>
                    <button class="jc-theme-import-apply" style="${btnStyle}">Apply</button>
                    <button class="jc-theme-import-cancel" style="${btnStyle}">Cancel</button>
                  </div>`;
                body.appendChild(importWrap);

                // ── Export logic ─────────────────────────────────────────────────
                const exportBtn = exportRow.querySelector('.jc-theme-export');
                exportBtn.onclick = () => {
                    const snapshot = {};
                    VALID_KEYS.forEach(k => {
                        const live = draft.colors?.[k] || colors?.[k];
                        if (live) {
                            snapshot[k] = live;
                        } else {
                            const computed = getComputedStyle(root).getPropertyValue(colorMap[k]).trim();
                            if (computed) snapshot[k] = computed;
                        }
                    });
                    const json = JSON.stringify(snapshot, null, 2);
                    try {
                        navigator.clipboard.writeText(json).then(() => {
                            exportBtn.textContent = '✓ Copied!';
                            setTimeout(() => { exportBtn.innerHTML = '📋 Copy theme'; }, 1800);
                        });
                    } catch(e) {
                        // Clipboard blocked — show JSON inline so user can copy manually
                        //importWrap.style.display = 'flex';
                        importWrap.style.display = 'block';
                        const ta = importWrap.querySelector('.jc-theme-paste-area');
                        ta.value = json;
                        ta.select();
                        importWrap.querySelector('.jc-theme-import-msg').textContent = 'Clipboard blocked — select all & copy manually.';
                    }
                };

                // ── Paste theme toggle ────────────────────────────────────────────
                const toggleBtn = exportRow.querySelector('.jc-theme-import-toggle');
                if (!locked) {
                    toggleBtn.onclick = () => {
                        const isHidden = importWrap.style.display === 'none';
                        //importWrap.style.display = isHidden ? 'flex' : 'none';
                        importWrap.style.display = isHidden ? 'block' : 'none';
                        if (isHidden) {
                            importWrap.querySelector('.jc-theme-paste-area').focus();
                            importWrap.querySelector('.jc-theme-import-msg').textContent = '';
                        }
                    };
                }

                // ── Import apply / cancel ─────────────────────────────────────────
                const applyImportBtn = importWrap.querySelector('.jc-theme-import-apply');
                const msgEl          = importWrap.querySelector('.jc-theme-import-msg');
                const cancelBtn      = importWrap.querySelector('.jc-theme-import-cancel');
                const pasteArea      = importWrap.querySelector('.jc-theme-paste-area');

                pasteArea.addEventListener('keydown', e => e.stopPropagation());
                pasteArea.addEventListener('keyup',   e => e.stopPropagation());

                cancelBtn.onclick = () => {
                    importWrap.style.display = 'none';
                    pasteArea.value = '';
                    msgEl.textContent = '';
                };

                applyImportBtn.onclick = () => {
                    let parsed;
                    try {
                        parsed = JSON.parse(pasteArea.value.trim());
                    } catch(e) {
                        msgEl.style.color = 'oklch(0.6 0.2 30)';
                        msgEl.textContent = '✕ Invalid JSON';
                        return;
                    }
                    const accepted = {}, rejected = [];
                    Object.entries(parsed).forEach(([k, v]) => {
                        if (VALID_KEYS.includes(k) && typeof v === 'string') accepted[k] = v;
                        else rejected.push(k);
                    });
                    if (Object.keys(accepted).length === 0) {
                        msgEl.style.color = 'oklch(0.6 0.2 30)';
                        msgEl.textContent = '✕ No valid color keys found';
                        return;
                    }
                    draft.colors = { ...(draft.colors || {}), ...accepted };
                    Object.entries(accepted).forEach(([k, v]) => {
                        if (colorMap[k]) root.style.setProperty(colorMap[k], v);
                    });
                    // Rebuild pickers so they reflect the imported values
                    buildSettingsBody();
                };
            }

            section('Appearance');
            makeSelect('calSize', 'Calendar size',
                [ ['sm','Small'], ['md','Medium'], ['lg','Large'] ]);
            makeToggle('showContour', 'Month outline border', 'Show the SVG outline around the current month');
            makeToggle('useHeatmap',  'Heatmap mode',         'Shade cells by activity instead of dots');

            // ── Colors Section ────────────────────────────────────────────────────
            section('Colors');
            makeColorPicker('accentColor', 'Accent color', 'Links, today highlight, toggle switches');
            makeColorPicker('textColor', 'Text color', 'Main text color');
            makeColorPicker('background', 'Background', 'Calendar card background');
            makeColorPicker('borderColor', 'Border color', 'Borders and outlines');
            makeColorPicker('elementsBackground', 'Elements background', 'Day cells and buttons');
            makeColorPicker('hoverBackground', 'Hover background', 'Day/button hover state');
            makeColorPicker('outlineColor', 'Month outline', 'SVG contour line color');
            makeColorPicker('sundayColor', 'Sunday text', 'Sunday column header and day numbers');
            section('Entry Dot Colors');
            makeColorPicker('dotGreen', 'Dot green', '1 entry indicator');
            makeColorPicker('dotYellow', 'Dot yellow', '2 entries indicator');
            makeColorPicker('dotOrange', 'Dot orange', '3 entries indicator');
            makeColorPicker('dotRed', 'Dot red', '4+ entries indicator');
            makeResetColorsButton();
            makeColorThemeBar();

            section('Layout');
            makeToggle('showWeekNumbers',  'Show week numbers', '');
            makeToggle('weekStartsSunday', 'Week starts Sunday', '');
            makeSelect('weekNumSystem', 'Week number system',
                [ ['iso','ISO 8601'],['us','US (Sun-start)'],['simple','Simple'] ]);

            section('Footer');
            makeToggle('showFooter',       'Show footer bar', '');
            makeToggle('footerStreak',     'Streak counter 🔥', '');
            makeToggle('footerMoonPhase',  'Moon phase', '');
            makeToggle('footerMonthCount', 'Month entry count', '');
            makeToggle('footerTotalCount', 'Total entry count', '');
            makeToggle('footerLastEntry',  'Last entry', '');

            section('Paths');
            makeTextInput('pattern',          'Journal path pattern');
            makeTextInput('weeklyPattern',    'Weekly note path pattern');
            makeTextInput('shiftDatePattern', 'Shift+Drag date pattern');

            section('Locale');
            makeTextInput('months', 'Month names (comma-separated)');
            makeTextInput('days',   'Day names Mon–Sun (comma-separated)');

            // Apply locked visibility after building
            updateLockedVisibility();
        }

        // FIX 2: Use offsetWidth/offsetHeight — these are unaffected by CSS transforms
        // (getBoundingClientRect returns scaled values during the open animation).
        function clamp() {
            const w = root.offsetWidth, h = root.offsetHeight;
            let left = root.offsetLeft, top = root.offsetTop;
            if (left < 0) left = 0;
            if (top < TOP_OFFSET) top = TOP_OFFSET;
            if (left + w > window.innerWidth)  left = Math.max(0, window.innerWidth  - w);
            if (top  + h > window.innerHeight) top  = Math.max(TOP_OFFSET, window.innerHeight - h);
            root.style.left  = left + "px";
            root.style.top   = top  + "px";
            root.style.right = "auto";
        }

        // ── Unified date/path pattern formatter ───────────────────────────────
        // Single source of truth for ALL pattern strings:
        //   journalPathPattern, weeklyNotesPathPattern, shiftDatePattern
        //
        // Supported variables:
        //   #year#        4-digit year            2026
        //   #YY#          2-digit year            26
        //   #month#       2-digit month           03
        //   #M#           month, no leading zero  3
        //   #day#         2-digit day             08
        //   #D#           day, no leading zero    8
        //   #monthname#   full month name         March
        //   #monthshort#  short month name        Mar
        //   #weekday#     short weekday (locale)  Sat
        //   #weekdayfull# full weekday (English)  Saturday
        //   #ordinal#     day ordinal suffix      st / nd / rd / th
        //   #HH#          hours 24 h              14
        //   #hh#          hours 12 h              02
        //   #mm#          minutes                 38
        //   #ss#          seconds                 07
        //   #weeknum#     week number, 2-digit    03
        //   #weeknumraw#  week number, no pad     3
        //   #weekyear#    ISO/US/simple week-year 2026
        //   #wildcard#    empty string (path prefix matching)
        const WEEKDAY_FULL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        function ordinalSuffix(d) {
            if (d >= 11 && d <= 13) return "th";
            switch (d % 10) { case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th"; }
        }
        function pad2(n) { return String(n).padStart(2, "0"); }

        function formatDatePattern(dateObj, pat) {
            const rawDay = dateObj.getDay();                          // 0=Sun … 6=Sat
            // days[] is always Mon-first: [Mon,Tue,Wed,Thu,Fri,Sat,Sun]
            // weekStartsSunday only affects column display order, not name lookup.
            const dIdx   = rawDay === 0 ? 6 : rawDay - 1;
            const dName  = days[dIdx] || WEEKDAY_FULL[rawDay].slice(0, 3);

            const Y   = dateObj.getFullYear();
            const Mo  = dateObj.getMonth();        // 0-based
            const D   = dateObj.getDate();
            const H   = dateObj.getHours();
            const Min = dateObj.getMinutes();
            const S   = dateObj.getSeconds();
            const mName = months[Mo] || dateObj.toLocaleString("en", { month: "long" });

            // Week info — getWeekInfo() is hoisted (function declaration) so safe to call here
            const { week, weekYear } = getWeekInfo(dateObj);

            return pat
                .replace(/#year#/g,        String(Y))
                .replace(/#YY#/g,          String(Y).slice(-2))
                .replace(/#month#/g,       pad2(Mo + 1))
                .replace(/#M#/g,           String(Mo + 1))
                .replace(/#day#/g,         pad2(D))
                .replace(/#D#/g,           String(D))
                .replace(/#monthname#/g,   mName)
                .replace(/#monthshort#/g,  mName.slice(0, 3))
                .replace(/#weekdayfull#/g, WEEKDAY_FULL[rawDay])
                .replace(/#weekday#/g,     dName)
                .replace(/#ordinal#/g,     ordinalSuffix(D))
                .replace(/#HH#/g,          pad2(H))
                .replace(/#hh#/g,          pad2(H % 12 || 12))
                .replace(/#mm#/g,          pad2(Min))
                .replace(/#ss#/g,          pad2(S))
                .replace(/#weeknumraw#/g,  String(week))
                .replace(/#weeknum#/g,     pad2(week))
                .replace(/#weekyear#/g,    String(weekYear))
                .replace(/#wildcard#/g,    "");
        }

        // ── Moon phase ────────────────────────────────────────────────────────
        const MOON_EMOJIS = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];
        const MOON_NAMES  = ["New Moon","Waxing Crescent","First Quarter","Waxing Gibbous",
                             "Full Moon","Waning Gibbous","Last Quarter","Waning Crescent"];
        function moonPhase(date) {
            const ref   = new Date("2000-01-06T18:14:00Z");
            const cycle = 29.53059;
            const days  = ((date - ref) / 86400000 % cycle + cycle) % cycle;
            const idx   = Math.round(days / cycle * 8) % 8;
            return { emoji: MOON_EMOJIS[idx], name: MOON_NAMES[idx] };
        }

        // ── Streak + day path helper ─────────────────────────────────────────
        function buildDayPath(dt) {
            return formatDatePattern(dt, pattern);
        }

        function computeStreak(pageNames) {
            const now = new Date();
            const todayBp = buildDayPath(now);
            const startDelta = pageNames.some(n => n.startsWith(todayBp)) ? 0 : 1;
            let streak = 0;
            for (let delta = startDelta; delta <= 365; delta++) {
                const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() - delta);
                if (pageNames.some(n => n.startsWith(buildDayPath(dt)))) streak++;
                else break;
            }
            return streak;
        }

        // ── Footer ────────────────────────────────────────────────────────────
        function updateFooter() {
            const footerEl = document.getElementById("jc-footer");
            if (!footerEl) return;
            if (!showFooter) { footerEl.style.display = 'none'; return; }
            footerEl.style.display = '';

            const row = document.getElementById("jc-footer-row");
            if (!row) return;

            const y         = vDate.getFullYear(), m = vDate.getMonth();
            const pageNames = Object.keys(existing);
            const patPrefix = pattern.split('#')[0];
            const now       = new Date();

            let monthEntries = 0, totalEntries = 0;
            if (footerMonthCount || footerTotalCount) {
                const daysInMonth = new Date(y, m + 1, 0).getDate();
                for (let d = 1; d <= daysInMonth; d++) {
                    if (pageNames.some(n => n.startsWith(buildDayPath(new Date(y, m, d))))) monthEntries++;
                }
                if (footerTotalCount)
                    totalEntries = pageNames.filter(n => n.startsWith(patPrefix)).length;
            }

            let lastLabel = null;
            if (footerLastEntry) {
                for (let delta = 0; delta <= 365; delta++) {
                    const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() - delta);
                    if (pageNames.some(n => n.startsWith(buildDayPath(dt)))) {
                        lastLabel = delta === 0 ? 'today' : delta === 1 ? 'yesterday' : delta + 'd ago';
                        break;
                    }
                }
                if (lastLabel === null) lastLabel = 'never';
            }

            const parts = [];

            if (footerStreak) {
                const s = computeStreak(pageNames);
                let cls = 'jc-streak-badge streak-cold', icon = '—', tip = 'No streak — write today to start one!';
                if      (s >= 30) { cls = 'jc-streak-badge streak-epic'; icon = '🔥🔥🔥'; tip = `${s}-day streak — legendary!`; }
                else if (s >= 14) { cls = 'jc-streak-badge streak-hot';  icon = '🔥🔥';   tip = `${s}-day streak — on fire!`; }
                else if (s >= 1)  { cls = 'jc-streak-badge streak-warm'; icon = '🔥';     tip = `${s}-day streak — keep going!`; }
                parts.push(`<span class="${cls}" title="${tip}">${s > 0 ? icon + ' ' + s : icon}</span>`);
            }
            if (footerMoonPhase) {
                const moon = moonPhase(now);
                parts.push(`<span title="${moon.name}">${moon.emoji} ${moon.name}</span>`);
            }
            if (footerMonthCount || footerTotalCount) {
                let countStr = '📓 ';
                if (footerMonthCount && footerTotalCount) countStr += `${monthEntries} / ${totalEntries}`;
                else if (footerMonthCount)                countStr += `${monthEntries} this month`;
                else                                      countStr += `${totalEntries} total`;
                parts.push(`<span>${countStr}</span>`);
            }
            if (footerLastEntry) parts.push(`<span>last: ${lastLabel}</span>`);

            row.innerHTML = parts.join('');
        }


        // ── Week number calculation ───────────────────────────────────────────
        // Returns { week, weekYear } according to the chosen system.
        // offsetLeft/offsetTop/offsetWidth are used everywhere for geometry so
        // that CSS scale() transforms (open animation) don't distort measurements.
        function getWeekInfo(date) {
            const y  = date.getFullYear();
            const mo = date.getMonth();
            const da = date.getDate();

            if (weekNumSystem === 'us') {
                // Sunday-start weeks. Week 1 = the Sun-Sat week containing Jan 1.
                // Edge case: late-Dec days whose Sunday-start week also contains
                // Jan 1 of the NEXT year are week 1 of that next year.
                const dow     = date.getDay(); // 0=Sun
                const weekSat = new Date(y, mo, da + (6 - dow)); // Saturday ending this week
                if (weekSat.getFullYear() > y) {
                    // This week crosses into next year and contains its Jan 1
                    return { week: 1, weekYear: weekSat.getFullYear() };
                }
                // Normal: count Sun-start weeks from Jan 1 of this year.
                const jan1Dow = new Date(y, 0, 1).getDay(); // 0=Sun
                const doy     = Math.round((new Date(y, mo, da) - new Date(y, 0, 1)) / 86400000);
                return { week: Math.floor((doy + jan1Dow) / 7) + 1, weekYear: y };
            }

            if (weekNumSystem === 'simple') {
                // Plain count: Week 1 = Jan 1-7, Week 2 = Jan 8-14, …
                const jan1 = new Date(y, 0, 1);
                const doy  = Math.round((new Date(y, mo, da) - jan1) / 86400000);
                return { week: Math.floor(doy / 7) + 1, weekYear: y };
            }

            // ISO 8601 (default): week starts Monday; Week 1 contains first Thursday
            const d   = new Date(Date.UTC(y, mo, da));
            const dow = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + 4 - dow);
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            return {
                week:     Math.ceil(((d - yearStart) / 86400000 + 1) / 7),
                weekYear: d.getUTCFullYear()
            };
        }

        function buildWeeklyPath(wkDate) {
            return formatDatePattern(wkDate, weeklyPattern);
        }

        // ── Itsycal-style month contour ───────────────────────────────────────
        // NOTE: We use offsetLeft/offsetTop/offsetWidth/offsetHeight intentionally.
        // These reflect CSS layout geometry and are UNAFFECTED by CSS transforms
        // (e.g. the scale(0→1) open animation). getBoundingClientRect() would
        // return near-zero values during the animation, causing the tiny contour
        // bug on first open.
        function roundedPath(pts, r) {
            const n = pts.length;
            let d = '';
            for (let i = 0; i < n; i++) {
                const p0 = pts[(i - 1 + n) % n];
                const p1 = pts[i];
                const p2 = pts[(i + 1) % n];
                const d1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
                const d2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
                if (d1 === 0 || d2 === 0) continue;
                const cr = Math.min(r, d1 / 2, d2 / 2);
                const ux = (p1[0] - p0[0]) / d1, uy = (p1[1] - p0[1]) / d1;
                const vx = (p2[0] - p1[0]) / d2, vy = (p2[1] - p1[1]) / d2;
                const bx = p1[0] - ux * cr, by = p1[1] - uy * cr;
                const ex = p1[0] + vx * cr, ey = p1[1] + vy * cr;
                if (d === '') d += `M ${bx} ${by} `;
                else          d += `L ${bx} ${by} `;
                d += `Q ${p1[0]} ${p1[1]} ${ex} ${ey} `;
            }
            return d + 'Z';
        }

        function drawContour(startCol, totalDays) {
            const grid = document.getElementById("jc-days");
            if (!grid) return;
            const old = document.getElementById("jc-contour-svg");
            if (old) old.remove();
            if (totalDays === 0) return;

            // We need two different cells:
            //   col0Cell  — the very first .jc-day in the grid (always in column 0,
            //               row 0), used to get the true left/top of day-column 0.
            //               May be a faded overflow day or a current-month day.
            //   sizeCell  — any .jc-day for width/height (all cells are the same size).
            // We intentionally use offsetLeft/offsetTop/offsetWidth/offsetHeight
            // because these are layout values unaffected by CSS transforms
            // (the scale(0→1) open animation would corrupt getBoundingClientRect()).
            const col0Cell = grid.querySelector(".jc-day");
            if (!col0Cell) return;

            const cellW = col0Cell.offsetWidth;
            const cellH = col0Cell.offsetHeight;
            if (cellW === 0 || cellH === 0) return;

            // col0Cell is always in grid column 0 (first day cell in the grid,
            // after the optional week-number cell which is NOT a .jc-day).
            // Its offsetLeft is therefore the true left edge of day-column 0.
            const colStart = col0Cell.offsetLeft;
            const rowStart = col0Cell.offsetTop;
            const gap = (calSize === 'sm') ? 1.4
                      : (calSize === 'lg') ? 2.4
                      : 2.0;

            const xl = c => colStart + c * (cellW + gap);
            const xr = c => colStart + c * (cellW + gap) + cellW;
            const yt = r => rowStart + r * (cellH + gap);
            const yb = r => rowStart + r * (cellH + gap) + cellH;

            const endCol = (startCol + totalDays - 1) % 7;
            const endRow = Math.floor((startCol + totalDays - 1) / 7);

            let pts;
            if (endRow === 0) {
                pts = [
                    [xl(startCol), yt(0)], [xr(endCol), yt(0)],
                    [xr(endCol),   yb(0)], [xl(startCol), yb(0)]
                ];
            } else if (startCol === 0 && endCol === 6) {
                pts = [
                    [xl(0), yt(0)],     [xr(6), yt(0)],
                    [xr(6), yb(endRow)],[xl(0), yb(endRow)]
                ];
            } else if (startCol > 0 && endCol === 6) {
                pts = [
                    [xl(startCol), yt(0)],     [xr(6),        yt(0)],
                    [xr(6),        yb(endRow)], [xl(0),        yb(endRow)],
                    [xl(0),        yt(1)],      [xl(startCol), yt(1)]
                ];
            } else if (startCol === 0) {
                pts = [
                    [xl(0),      yt(0)],     [xr(6),      yt(0)],
                    [xr(6),      yt(endRow)],[xr(endCol), yt(endRow)],
                    [xr(endCol), yb(endRow)],[xl(0),      yb(endRow)]
                ];
            } else {
                pts = [
                    [xl(startCol), yt(0)],     [xr(6),        yt(0)],
                    [xr(6),        yt(endRow)], [xr(endCol),   yt(endRow)],
                    [xr(endCol),   yb(endRow)], [xl(0),        yb(endRow)],
                    [xl(0),        yt(1)],      [xl(startCol), yt(1)]
                ];
            }

            const gridW = grid.offsetWidth;
            const svgH  = yb(endRow) + 8;
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.id = "jc-contour-svg";
            svg.setAttribute("width",  gridW);
            svg.setAttribute("height", svgH);
            // Start invisible; fade in after paint so it never flashes during flip-back
            svg.style.cssText = "position:absolute;top:0;left:0;pointer-events:none;overflow:visible;z-index:1;opacity:0;transition:opacity 0.35s ease;";

            const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
            const radius = (calSize === 'sm') ? 3.5 : 5;
            pathEl.setAttribute("d", roundedPath(pts, radius));
            pathEl.setAttribute("fill",            "none");
            pathEl.setAttribute("stroke",          "var(--jc-outline-color)");
            pathEl.setAttribute("stroke-width",    "1.5");
            pathEl.setAttribute("stroke-linejoin", "round");
            pathEl.setAttribute("opacity",         "0.75");
            svg.appendChild(pathEl);
            grid.appendChild(svg);

            // Trigger fade-in on the next two animation frames to ensure the element
            // is fully painted before the transition starts
            requestAnimationFrame(() => requestAnimationFrame(() => {
                svg.style.opacity = '1';
            }));
        }
        // ─────────────────────────────────────────────────────────────────────

        function render() {
            const y   = vDate.getFullYear(), m = vDate.getMonth();
            const now = new Date();

            // Adjust widget width for current size and week number column
            const sizeW = { sm: [258, 258], md: [310, 330], lg: [388, 413] }[calSize] || [310, 330];
            root.style.width = (showWeekNumbers ? sizeW[1] : sizeW[0]) + 'px';

            const colTemplate = showWeekNumbers ? "1.8em repeat(7, 1fr)" : "repeat(7, 1fr)";

            // ── Selectors ──────────────────────────────────────────────────────
            document.getElementById("jc-month").innerHTML = months.map((n, i) =>
                `<option value="${i}" ${i === m ? 'selected' : ''}>${n}</option>`).join('');
            let years = [];
            for (let i = y - 10; i <= y + 10; i++) years.push(i);
            document.getElementById("jc-year").innerHTML = years.map(v =>
                `<option value="${v}" ${v === y ? 'selected' : ''}>${v}</option>`).join('');

            // ── Labels row ─────────────────────────────────────────────────────
            const labelsGrid = document.getElementById("jc-labels");
            labelsGrid.style.gridTemplateColumns = colTemplate;
            labelsGrid.innerHTML = "";
            if (showWeekNumbers) {
                const wl = document.createElement("div");
                wl.className   = "jc-wk-lbl";
                wl.textContent = "W";
                labelsGrid.appendChild(wl);
            }
            const displayDays = weekStartsSunday ? [days[6], ...days.slice(0, 6)] : days;
            displayDays.forEach((d, i) => {
                const isSun = weekStartsSunday ? i === 0 : i === 6;
                const el    = document.createElement("div");
                el.className   = "jc-lbl" + (isSun ? " sun" : "");
                el.textContent = d.slice(0, 3);
                labelsGrid.appendChild(el);
            });

            // ── Days grid ──────────────────────────────────────────────────────
            const grid = document.getElementById("jc-days");
            grid.innerHTML = "";
            grid.style.gridTemplateColumns = colTemplate;

            const firstDay       = new Date(y, m, 1).getDay();
            const offset         = weekStartsSunday ? firstDay : (firstDay === 0 ? 6 : firstDay - 1);
            const lastDay        = new Date(y, m + 1, 0).getDate();
            const prevLastDay    = new Date(y, m, 0).getDate();
            const totalCells     = Math.ceil((offset + lastDay) / 7) * 7;
            const numRows        = totalCells / 7;
            const pageNames      = Object.keys(existing);

            for (let row = 0; row < numRows; row++) {

                // ── Week number cell ───────────────────────────────────────────
                if (showWeekNumbers) {
                    const cellIdx = row * 7;
                    let wkDate;
                    if      (cellIdx < offset)            wkDate = new Date(y, m - 1, prevLastDay - (offset - 1 - cellIdx));
                    else if (cellIdx < offset + lastDay)  wkDate = new Date(y, m,     cellIdx - offset + 1);
                    else                                  wkDate = new Date(y, m + 1, cellIdx - offset - lastDay + 1);

                    const { week, weekYear } = getWeekInfo(wkDate);
                    const weekPath           = buildWeeklyPath(wkDate);

                    const wkEl = document.createElement("div");
                    wkEl.className   = "jc-week-num";
                    wkEl.textContent = week;
                    wkEl.title       = "Open week " + week + " note";
                    wkEl.onclick     = () => window.dispatchEvent(new CustomEvent("sb-journal-event", {
                        detail: { action: "navigate-week", path: weekPath, session }
                    }));
                    grid.appendChild(wkEl);
                }

                // ── Day cells ──────────────────────────────────────────────────
                for (let col = 0; col < 7; col++) {
                    const cellIdx = row * 7 + col;
                    const el      = document.createElement("div");

                    if (cellIdx < offset) {
                        // Previous month overflow
                        const prevDay = prevLastDay - (offset - 1 - cellIdx);
                        el.className  = "jc-day faded";
                        el.innerHTML  = `<span>${prevDay}</span>`;
                        grid.appendChild(el);
                        continue;
                    }

                    if (cellIdx >= offset + lastDay) {
                        // Next month overflow
                        const nextDay = cellIdx - offset - lastDay + 1;
                        el.className  = "jc-day faded";
                        el.innerHTML  = `<span>${nextDay}</span>`;
                        grid.appendChild(el);
                        continue;
                    }

                    // Current month day
                    const dayNum  = cellIdx - offset + 1;
                    el.className  = "jc-day current-month";
                    el.draggable  = true;
                    const dateObj = new Date(y, m, dayNum);
                    const isSun   = dateObj.getDay() === 0;
                    if (isSun) el.classList.add("sun");
                    if (dayNum === now.getDate() && m === now.getMonth() && y === now.getFullYear())
                        el.classList.add("today");

                    const basePath = formatDatePattern(dateObj, pattern);
                    el.dataset.path = basePath;  // ← ADD THIS
  
                    const matchCount = pageNames.filter(name => name.startsWith(basePath)).length;
                    if (matchCount > 0) {
                        if (useHeatmap) {
                            el.classList.add('jc-heatmap');
                            const opacity = Math.min(0.13 + (matchCount - 1) * 0.1, 0.6);
                            el.style.setProperty('--jc-heat-opacity', opacity);
                        } else {
                            const dotsContainer = document.createElement("div");
                            dotsContainer.className = "jc-dots-container";
                            const numReds   = Math.floor(matchCount / 4);
                            const remainder = matchCount % 4;
                            for (let r = 0; r < numReds; r++) {
                                const dot = document.createElement("div");
                                dot.className = "jc-dot red";
                                dotsContainer.appendChild(dot);
                            }
                            if (remainder > 0) {
                                const dot = document.createElement("div");
                                let colorClass = "green";
                                if (remainder === 2) colorClass = "yellow";
                                if (remainder === 3) colorClass = "orange";
                                dot.className = "jc-dot " + colorClass;
                                dotsContainer.appendChild(dot);
                            }
                            el.appendChild(dotsContainer);
                        }
                    }

                    el.innerHTML += `<span>${dayNum}</span>`;

                    el.onclick = (e) => {
                        const isCtrl  = e.ctrlKey || e.metaKey;
                        const isShift = e.shiftKey;

                        if (isCtrl && isShift) {
                            // Ctrl/Cmd+Shift+Click: insert WikiLink|Formatted Date alias
                            const dateText = formatDatePattern(dateObj, shiftDatePattern);
                            window.dispatchEvent(new CustomEvent("sb-journal-event", {
                                detail: { action: "insert-wikilink-alias", path: basePath, dateText, session }
                            }));
                            return;
                        }
                        if (isShift) {
                            // Shift+Click: insert plain-text formatted date at cursor
                            const dateText = formatDatePattern(dateObj, shiftDatePattern);
                            window.dispatchEvent(new CustomEvent("sb-journal-event", {
                                detail: { action: "insert-date", dateText, session }
                            }));
                            return;
                        }
                        // Click / Ctrl+Click / Cmd+Click: navigate or insert WikiLink
                        window.dispatchEvent(new CustomEvent("sb-journal-event", {
                            detail: { action: "navigate", path: basePath, session, ctrlKey: e.ctrlKey, metaKey: e.metaKey }
                        }));
                    };
                    el.ondragstart = (e) => {
                        e.dataTransfer.setData("text/plain", "[[" + basePath + "]].."]]"..[[");
                        e.dataTransfer.dropEffect = "copy";
                    };
                    grid.appendChild(el);
                }
            }

            // Draw month contour. Uses offsetLeft/offsetTop (layout, transform-safe).
            if (showContour) {
                drawContour(offset, lastDay);
            } else {
                const old = document.getElementById("jc-contour-svg");
                if (old) old.remove();
            }
            updateFooter();
        }

        window.addEventListener("sb-journal-update", (e) => {
            if (!e.detail || !e.detail.existing) return;
            existing = e.detail.existing;
            const pageNames = Object.keys(existing);
        
            document.querySelectorAll(".jc-day[data-path]").forEach(el => {
                const basePath   = el.dataset.path;
                const matchCount = pageNames.filter(name => name.startsWith(basePath)).length;
        
                // Clear old dot state
                const oldDots = el.querySelector(".jc-dots-container");
                if (oldDots) oldDots.remove();
                el.classList.remove("jc-heatmap");
                el.style.removeProperty("--jc-heat-opacity");
        
                if (matchCount > 0) {
                    if (useHeatmap) {
                        el.classList.add("jc-heatmap");
                        const opacity = Math.min(0.13 + (matchCount - 1) * 0.1, 0.6);
                        el.style.setProperty("--jc-heat-opacity", opacity);
                    } else {
                        const dotsContainer = document.createElement("div");
                        dotsContainer.className = "jc-dots-container";
                        const numReds   = Math.floor(matchCount / 4);
                        const remainder = matchCount % 4;
                        for (let r = 0; r < numReds; r++) {
                            const dot = document.createElement("div");
                            dot.className = "jc-dot red";
                            dotsContainer.appendChild(dot);
                        }
                        if (remainder > 0) {
                            const dot = document.createElement("div");
                            let colorClass = "green";
                            if (remainder === 2) colorClass = "yellow";
                            if (remainder === 3) colorClass = "orange";
                            dot.className = "jc-dot " + colorClass;
                            dotsContainer.appendChild(dot);
                        }
                        // Insert before the day number span
                        const span = el.querySelector("span");
                        el.insertBefore(dotsContainer, span);
                    }
                }
            });
            updateFooter();
        });

        window.addEventListener("resize", clamp);

        document.getElementById("jc-gear-btn").onclick      = () => flipCard(true);
        document.getElementById("jc-settings-apply").onclick = () => applySettings();
        document.getElementById("jc-settings-close").onclick = () => flipCard(false);
        document.getElementById("jc-prev").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth() - 1); render(); };
        document.getElementById("jc-next").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth() + 1); render(); };
        document.getElementById("jc-today").onclick = () => {
            vDate = new Date();
            window.dispatchEvent(new CustomEvent("sb-journal-event", { detail: { action: "request-refresh", session } }));
            render();
        };
        document.getElementById("jc-month").onchange = (e) => { vDate.setDate(1); vDate.setMonth(parseInt(e.target.value)); render(); };
        document.getElementById("jc-year").onchange  = (e) => { vDate.setFullYear(parseInt(e.target.value)); render(); };
        document.getElementById("jc-close-btn").onclick = () => {
            root.classList.add("jc-animate-out");
            setTimeout(() => root.remove(), 300);
        };
        document.getElementById("jc-locked-toggle").onclick = () => {
            showLocked = !showLocked;
            updateLockedVisibility();
        };

        const card = document.getElementById("jc-draggable");
        card.onpointerdown = (e) => {
            if (
                e.target.closest("button, select, input, textarea") ||
                e.target.closest(".jc-day:not(.empty):not(.faded)") ||
                e.target.closest(".jc-week-num") ||
                e.target.closest(".jc-face-back")
            ) return;

            document.body.classList.add("sb-dragging-active");
            let sX = e.clientX - root.offsetLeft, sY = e.clientY - root.offsetTop;

            const move = (mv) => {
                let nL = mv.clientX - sX, nT = mv.clientY - sY;
                const w = root.offsetWidth, h = root.offsetHeight;
                if (nL < SNAP) nL = 0;
                if (nT < TOP_OFFSET + SNAP) nT = TOP_OFFSET;
                if (nL + w > window.innerWidth  - SNAP) nL = window.innerWidth  - w;
                if (nT + h > window.innerHeight - SNAP) nT = window.innerHeight - h;
                root.style.left  = Math.max(0,          Math.min(nL, window.innerWidth  - w)) + "px";
                root.style.top   = Math.max(TOP_OFFSET, Math.min(nT, window.innerHeight - h)) + "px";
                root.style.right = "auto";
            };
            const up = () => {
                document.body.classList.remove("sb-dragging-active");
                window.removeEventListener("pointermove", move);
                window.dispatchEvent(new CustomEvent("sb-journal-event", {
                    detail: { action: "save_pos", top: root.style.top, left: root.style.left, session }
                }));
            };
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", up, { once: true });
        };

        // ── Settings header drag ──────────────────────────────────────────────
        const settingsHeader = document.getElementById("jc-settings-header");
        settingsHeader.onpointerdown = (e) => {
            if (e.target.closest("button")) return;
            document.body.classList.add("sb-dragging-active");
            settingsHeader.style.cursor = "grabbing";
            let sX = e.clientX - root.offsetLeft, sY = e.clientY - root.offsetTop;
            const move = (mv) => {
                const w = root.offsetWidth, h = root.offsetHeight;
                const nL = Math.max(0, Math.min(mv.clientX - sX, window.innerWidth  - w));
                const nT = Math.max(TOP_OFFSET, Math.min(mv.clientY - sY, window.innerHeight - h));
                root.style.left  = nL + "px";
                root.style.top   = nT + "px";
                root.style.right = "auto";
            };
            const up = () => {
                document.body.classList.remove("sb-dragging-active");
                settingsHeader.style.cursor = "";
                window.removeEventListener("pointermove", move);
                window.dispatchEvent(new CustomEvent("sb-journal-event", {
                    detail: { action: "save_pos", top: root.style.top, left: root.style.left, session }
                }));
            };
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", up, { once: true });
        };

        render();
        // FIX 2: Wait until after the open animation (400ms) before clamping,
        // so offsetWidth/offsetHeight reflect the fully-scaled final size.
        setTimeout(() => {
            if (root.style.left !== "auto") root.style.right = "auto";
            clamp(); // bring back into view if saved position is off-screen
        }, 450);
    })();
    ]]
    container.appendChild(scriptEl)
end

function refreshCalendarDots()
    local existing_root = js.window.document.getElementById("sb-journal-root")
    if not existing_root then return end

    local all_pages = space.listPages()
    local page_map_items = {}
    for _, p in ipairs(all_pages) do
        table.insert(page_map_items, '"' .. p.name .. '":true')
    end
    local json_str = "{" .. table.concat(page_map_items, ",") .. "}"
    
    js.window.dispatchEvent(js.window.eval([[ (data) => new CustomEvent("sb-journal-update", { detail: { existing: data } }) ]])(js.window.JSON.parse(json_str)))
end

event.listen { name = "editor:pageLoaded", run = function() refreshCalendarDots() end }
--event.listen { name = "file:changed", run = function(e) if not e.oldHash then refreshCalendarDots() end end }

command.define {
    name = "Journal: Floating Calendar",
    run  = function() toggleFloatingJournalCalendar() end
}
```

## Discussion to this library

- [SilverBullet Community](https://community.silverbullet.md/t/sleek-interactive-floating-journal-calendar/3680/6?u=mr.red)