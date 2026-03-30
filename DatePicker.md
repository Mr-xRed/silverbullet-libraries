---
name: "Library/Mr-xRed/DatePicker"
tags: meta/library
pageDecoration.prefix: "🛠️ "
---

# Date Picker as Slash Command

A calendar date picker invoked with `/datepicker`. Inserts the selected date as a `[[WikiLink]]` at the cursor.


![DatePicker|1000](https://raw.githubusercontent.com/Mr-xRed/silverbullet-libraries/refs/heads/main/screenshots/DatePicker.png)

## Features

- 📅 Full calendar view with month/year dropdowns
- 🔤 **Configurable date format** — click ⚙ to open the settings panel
- 🔄 **Reset button** — restore format to default with one click
- 🌍 **Localization** — customize month and day names in Settings (Monday-first input)
- ⌨️ **Keyboard navigation** (arrow keys, Page Up/Down, Enter, Escape)
- 💾 Format choice, month names, and day names persist across sessions via `localStorage`

## Quick Start

1. Open any page and type `/datepicker`.
1. Click or keyboard-navigate to the desired day and press **Enter** (or click).

-----

## Keyboard Shortcuts

|Key                    |Action                                            |
|-----------------------|--------------------------------------------------|
|`←` / `→`              |Move one day back / forward                       |
|`↑` / `↓`              |Move one week back / forward                      |
|`Page Up` / `Page Down`|Jump to previous / next month                     |
|`Enter`                |Confirm and insert the focused date               |
|`Escape`               |Close picker *(or cancel settings without saving)*|

Keyboard navigation is active from the moment the picker opens — today's date is pre-focused.  
The focused day is highlighted with a coloured outline.

-----

## Settings Panel

Click the **⚙** gear button (bottom-right of the calendar) to flip the card to the settings view.

|Control                |Description                                                                                  |
|-----------------------|---------------------------------------------------------------------------------------------|
|**Date Format** input  |Free-text field; use any combination of literal characters and placeholders                  |
|**↺ Reset** button     |Resets the format field to the _default_ `[[%YYYY%-%MM%-%DD%]]`                                  |
|**Placeholder list**   |Click any token to insert it at the current cursor position in the format field              |
|**Live preview**       |Shows how today’s date looks with the current format string                                  |
|**Month names** input  |Comma-separated list of 12 full month names (January → December)                             |
|**Day names** input    |Comma-separated list of 7 full day names, **Monday first** (e.g. `Monday, Tuesday, … Sunday`)|
|**✓ Apply** (`Enter`)  |Save all settings to `localStorage` and return to the calendar                               |
|**✕ Cancel** (`Escape`)|Discard changes and return to the calendar                                                   |

Arrow keys, Backspace, and all text-editing keys work normally inside the settings input fields.

-----

## Date Format Placeholders

All placeholders use the pattern `%TOKEN%`.

### Date

|Placeholder|Output                                              |Example                  |
|-----------|----------------------------------------------------|-------------------------|
|`%YYYY%`   |4-digit year                                        |`2024`                   |
|`%YY%`     |2-digit year                                        |`24`                     |
|`%MMMM%`   |Full month name (localized)                         |`January`                |
|`%MMM%`    |Abbreviated month name — first 3 chars (localized)  |`Jan`                    |
|`%MM%`     |Month, zero-padded                                  |`01`                     |
|`%M%`      |Month, no padding                                   |`1`                      |
|`%DD%`     |Day of month, zero-padded                           |`05`                     |
|`%D%`      |Day of month, no padding                            |`5`                      |
|`%Ord%`     |Ordinal suffix only                                 |`st` · `nd` · `rd` · `th`|
|`%dddd%`   |Full weekday name (localized)                       |`Monday`                 |
|`%ddd%`    |Abbreviated weekday name — first 3 chars (localized)|`Mon`                    |
|`%WW%`     |ISO 8601 week number, zero-padded                   |`03`                     |
|`%W%`      |ISO 8601 week number, no padding                    |`3`                      |
|`%GGGG%`   |ISO week-year                                       |`2024`                   |

### Time

|Placeholder|Output                          |Example|
|-----------|--------------------------------|-------|
|`%HH%`     |Hour, 24-hour clock, zero-padded|`14`   |
|`%hh%`     |Hour, 12-hour clock, zero-padded|`02`   |
|`%mm%`     |Minutes, zero-padded            |`07`   |
|`%ss%`     |Seconds, zero-padded            |`09`   |
|`%A%`      |AM / PM                         |`PM`   |
|`%a%`      |am / pm                         |`pm`   |

**Ordinal usage:** `%D%%Ord%` → `5th`  or  `%DD%%Ord%` → `05th`  

-----

## Format Examples

|Format string                    |Resulting insert            |
|---------------------------------|----------------------------|
|`[[%YYYY%-%MM%-%DD%]]`               |`[[2024-01-05]]` *(default)*|
|`[[%YYYY%-%MM%-%DD%|%MMMM% %D%%Ord%, %YYYY%]]`         |`[[2024-01-05|January 5th, 2024]]`     |
|`[[%DD%.%MM%.%YYYY%]]`               |`[[05.01.2024]]`            |
|`[[%D%/%M%/%YYYY%]]`                 |`[[5/1/2024]]`              |
|`[[%MMMM% %D%%Ord%, %YYYY%]]`         |`[[January 5th, 2024]]`     |
|`[[%dddd%, %D% %MMM% %YY%]]`         |`[[Friday, 5 Jan 24]]`      |
|`[[%YYYY%-W%WW%]]`                   |`[[2024-W01]]`              |
|`[[%YYYY%-%MM%-%DD%T%HH%:%mm%:%ss%]]`|`[[2024-01-05T14:07:09]]`   |
|`[[%D% %MMMM% %YYYY%]]`              |`[[5 January 2024]]`        |

-----

## Localization

Open Settings and fill in:

- **Month names** — 12 values, comma-separated, January → December  
  Example: `Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember`
- **Day names** — 7 values, comma-separated, **Monday first**  
  Example: `Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo`

Short forms (`%MMM%`, `%ddd%`) and calendar header labels are derived automatically as the first 3 characters of each name.  
Values must contain exactly 12 (months) or 7 (days) entries to be accepted.

-----

## Storage

|Key           |Value                      |Notes                            |
|--------------|---------------------------|---------------------------------|
|`sb-dp-format`|Format string              |Saved with `localStorage.setItem`|
|`sb-dp-months`|Comma-separated month names|12 values, January first         |
|`sb-dp-days`  |Comma-separated day names  |7 values, Monday first           |

## Implementation

```space-lua
function insertDate(args)
  if args and args.date then
--    editor.insertAtCursor("[[" .. args.date .. "]]")
    editor.insertAtCursor(args.date)
    editor.moveCursor(editor.getCursor())
  end
end

function openDatePicker()
  local sessionID = "dp_" .. tostring(math.floor(js.window.performance.now()))

  local existing = js.window.document.getElementById("sb-datepicker-root")
  if existing then existing.remove() end

  local function uniqueHandler(e)
    if e.detail.session == sessionID then
      insertDate({ date = e.detail.date })
      js.window.removeEventListener("sb-insert-date", uniqueHandler)
    end
  end
  js.window.addEventListener("sb-insert-date", uniqueHandler)

  local container = js.window.document.createElement("div")
  container.id = "sb-datepicker-root"
  container.setAttribute("data-session", sessionID)

  container.innerHTML = [==[
<style>
  #sb-datepicker-root {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.42); z-index: 20000;
    display: flex; align-items: center; justify-content: center;
    font-family: sans-serif;
  }
  .dp-scene { perspective: 1000px; }
  .dp-wrapper {
    width: 318px; position: relative;
    transform-style: preserve-3d;
    transition: transform 0.52s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .dp-wrapper.flipped { transform: rotateY(180deg); }
  .dp-face {
    background: #1e1e1e; color: #e8e8e8;
    border: 1.5px solid rgba(255,255,255,0.12); border-radius: 14px;
    padding: 18px 16px; width: 318px; box-sizing: border-box;
    box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 16px 36px rgba(0,0,0,0.28),
                inset 0 1px 0 rgba(255,255,255,0.06);
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
    user-select: none;
  }
  .dp-back {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    transform: rotateY(180deg);
    overflow-y: auto; overflow-x: hidden;
    border-radius: 14px;
  }
  /* ── Header ── */
  .dp-header {
    display: flex; align-items: center; gap: 4px; margin-bottom: 12px;
  }
  .dp-selectors {
    flex: 1; display: flex; gap: 4px; justify-content: center; min-width: 0;
  }
  .dp-select {
    background: transparent; color: inherit;
    border: 1px solid rgba(255,255,255,0.1); border-radius: 5px;
    font-size: 0.87em; padding: 2px 4px; cursor: pointer; max-width: 100%;
  }
  .dp-select option { background: #222; color: #e8e8e8; }
  /* ── Nav buttons ── */
  .dp-nav {
    cursor: pointer; flex-shrink: 0;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.07); color: #e0e0e0;
    border-radius: 7px; padding: 4px 7px; font-size: 1em; line-height: 1;
    transition: background 0.13s, border-color 0.13s;
  }
  .dp-nav:hover { background: var(--ui-accent-color, #2b7fff); border-color: transparent; color: #fff; }
  /* ── Grid ── */
  .dp-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
  #dp-days  { min-height: 196px; align-content: start; margin-top: 2px; }
  .dp-lbl   { font-size: 0.73em; font-weight: 700; opacity: 0.45; text-align: center; padding-bottom: 5px; }
  .dp-lbl.sunday { color: #ff6060; opacity: 0.75; }
  /* ── Day cells ── */
  .dp-cell {
    padding: 0; border: none; outline: none;
    background: rgba(255,255,255,0.05); color: inherit;
    cursor: pointer; border-radius: 7px; font-size: 0.79em;
    height: 28px; display: flex; align-items: center; justify-content: center;
    transition: background 0.1s, color 0.1s;
  }
  .dp-cell:hover, .dp-cell:focus {
    background: var(--ui-accent-color, #2b7fff); color: #fff !important;
  }
  .dp-cell.today {
    border: 1.5px solid var(--ui-accent-color, #2b7fff); font-weight: 700;
  }
  .dp-cell.sunday { color: #ff6060; }
  .dp-cell.other-month {
    background: transparent; color: rgba(255,255,255,0.18);
  }
  .dp-cell.other-month.sunday { color: rgba(255,90,90,0.22); }
  .dp-cell.other-month:hover, .dp-cell.other-month:focus {
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.42) !important;
  }
  .dp-cell.focused {
    outline: 2px solid var(--ui-accent-color, #2b7fff);
    outline-offset: -2px;
    background: rgba(43,127,255,0.18);
  }
  .dp-cell.focused.sunday { color: #ff6060; }
  .dp-cell.today.focused {
    background: var(--ui-accent-color, #2b7fff); color: #fff !important;
  }
  .dp-cell.focused:hover, .dp-cell.focused:focus {
    background: var(--ui-accent-color, #2b7fff); color: #fff !important;
  }
  /* ── Footer ── */
  .dp-footer {
    margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 10px; display: flex; flex-direction: column;
    align-items: center; gap: 7px;
  }
  .dp-footer-row { display: flex; width: 100%; gap: 6px; align-items: center; }
  .btn-today {
    flex: 1; background: transparent;
    border: 1px solid var(--ui-accent-color, #2b7fff);
    color: var(--ui-accent-color, #2b7fff);
    padding: 5px 8px; border-radius: 6px; cursor: pointer;
    font-size: 0.8em; transition: background 0.15s, color 0.15s;
  }
  .btn-today:hover { background: var(--ui-accent-color, #2b7fff); color: #fff; }
  .btn-gear {
    flex-shrink: 0; background: transparent;
    border: 1px solid rgba(255,255,255,0.14);
    color: rgba(255,255,255,0.48); padding: 5px 7px;
    border-radius: 6px; cursor: pointer; font-size: 0.95em;
    line-height: 1; transition: background 0.15s, color 0.15s, transform 0.3s;
  }
  .btn-gear:hover { background: rgba(255,255,255,0.1); color: #fff; }
  .btn-gear.spinning { transform: rotate(60deg); }
  .dp-hint {
    font-size: 8.5px; opacity: 0.35; letter-spacing: 0.7px;
    text-transform: uppercase; text-align: center;
  }
  /* ── Settings back panel ── */
  .dp-sett-header {
    display: flex; align-items: center; gap: 6px; margin-bottom: 14px;
  }
  .dp-sett-title {
    flex: 1; font-size: 0.9em; font-weight: 700; opacity: 0.88;
    letter-spacing: 0.3px;
  }
  .dp-sett-body { display: flex; flex-direction: column; gap: 12px; }
  .dp-field-lbl {
    font-size: 0.74em; opacity: 0.55; margin-bottom: 5px; letter-spacing: 0.3px;
  }
  .dp-fmt-row { display: flex; gap: 5px; align-items: center; }
  .dp-fmt-row .dp-fmt-inp { flex: 1; }
  .dp-fmt-inp {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 7px; color: #e8e8e8;
    padding: 7px 9px; font-size: 0.83em;
    font-family: 'Courier New', monospace; outline: none;
    transition: border-color 0.15s, background 0.15s;
    user-select: text;
  }
  .dp-fmt-inp:focus {
    border-color: var(--ui-accent-color, #2b7fff);
    background: rgba(255,255,255,0.1);
  }
  .btn-reset {
    flex-shrink: 0; background: transparent;
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.45); padding: 5px 8px;
    border-radius: 6px; cursor: pointer; font-size: 1em; line-height: 1;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .btn-reset:hover {
    background: rgba(255,100,100,0.18); color: #ff9090;
    border-color: rgba(255,100,100,0.35);
  }
  .dp-preview {
    margin-top: 5px; font-size: 0.77em; opacity: 0.52;
    text-align: center; padding: 4px 8px;
    background: rgba(255,255,255,0.04); border-radius: 5px;
    font-family: 'Courier New', monospace; min-height: 1.4em;
    letter-spacing: 0.2px;
  }
  /* Placeholder grid – 4 cols: key · desc · key · desc */
  .dp-ph-title {
    font-size: 0.71em; opacity: 0.42; letter-spacing: 0.5px;
    text-transform: uppercase; font-weight: 700; margin-bottom: 6px;
  }
  .dp-ph-grid {
    display: grid;
    grid-template-columns: minmax(0,8ch) auto minmax(0,8ch) auto;
    gap: 3px 5px;
    font-size: 0.73em;
  }
  .dp-ph-key {
    font-family: 'Courier New', monospace;
    color: #9ecfaa;
    cursor: pointer; padding: 1px 3px; border-radius: 4px;
    transition: background 0.1s; white-space: nowrap; opacity: 0.9;
  }
  .dp-ph-key:hover { background: rgba(158,207,170,0.18); opacity: 1; }
  .dp-ph-desc {
    opacity: 0.35; align-self: center;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    font-size: 0.88em; letter-spacing: 0.1px;
  }
  /* Localization */
  .dp-sett-divider {
    border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 2px 0;
  }
  .dp-locale-inp {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 7px; color: #e8e8e8;
    padding: 6px 9px; font-size: 0.75em;
    font-family: 'Courier New', monospace; outline: none;
    transition: border-color 0.15s, background 0.15s;
    user-select: text;
  }
  .dp-locale-inp:focus {
    border-color: var(--ui-accent-color, #2b7fff);
    background: rgba(255,255,255,0.1);
  }
  .dp-locale-hint {
    font-size: 0.68em; opacity: 0.33; margin-top: 3px; font-style: italic;
  }
  .dp-sett-err {
    font-size: 0.72em; color: #ff8080; margin-top: 4px;
    min-height: 1em; text-align: center;
  }
</style>
<div class="dp-scene">
  <div class="dp-wrapper" id="dp-wrapper">
    <!-- ── FRONT ─────────────────────────────── -->
    <div class="dp-face dp-front">
      <div class="dp-header">
        <button class="dp-nav" id="dp-prev">&#8249;</button>
        <div class="dp-selectors">
          <select id="dp-month-select" class="dp-select"></select>
          <select id="dp-year-select"  class="dp-select"></select>
        </div>
        <button class="dp-nav" id="dp-next">&#8250;</button>
      </div>
      <div class="dp-grid" id="dp-labels"></div>
      <div class="dp-grid" id="dp-days"></div>
      <div class="dp-footer">
        <div class="dp-footer-row">
          <button class="btn-today" id="dp-today">Today</button>
          <button class="btn-gear"  id="dp-gear" title="Settings">&#9881;</button>
        </div>
        <div class="dp-hint">ESC &middot; &larr;&rarr;&uarr;&darr; navigate &middot; Enter select &middot; PgUp/Dn month</div>
      </div>
    </div>
    <!-- ── BACK (Settings) ───────────────────── -->
    <div class="dp-face dp-back">
      <div class="dp-sett-header">
        <span class="dp-sett-title">&#9881;&nbsp; Settings</span>
        <button class="dp-nav" id="dp-apply"       title="Apply (Enter)">&#10003;</button>
        <button class="dp-nav" id="dp-cancel-sett" title="Cancel (Esc)">&#10005;</button>
      </div>
      <div class="dp-sett-body">
        <!-- Format -->
        <div>
          <div class="dp-field-lbl">Date Format</div>
          <div class="dp-fmt-row">
            <input type="text" id="dp-fmt-inp" class="dp-fmt-inp"
                   spellcheck="false" autocomplete="off" />
            <button id="dp-reset-fmt" class="btn-reset" title="Reset to default">&#8635;</button>
          </div>
          <div id="dp-preview" class="dp-preview"></div>
        </div>
        <!-- Placeholders -->
        <div>
          <div class="dp-ph-title">Placeholders &mdash; click to insert</div>
          <div class="dp-ph-grid" id="dp-ph-grid"></div>
        </div>
        <hr class="dp-sett-divider" />
        <!-- Localization -->
        <div>
          <div class="dp-ph-title">Localization</div>
          <div class="dp-field-lbl">Month names (12, comma-separated)</div>
          <input type="text" id="dp-months-inp" class="dp-locale-inp"
                 spellcheck="false" autocomplete="off"
                 placeholder="January, February, March, &#x2026;" />
          <div class="dp-locale-hint">12 names &bull; short form = first 3 chars</div>
          <div class="dp-field-lbl" style="margin-top:9px">Day names, Mon first (7, comma-separated)</div>
          <input type="text" id="dp-days-inp" class="dp-locale-inp"
                 spellcheck="false" autocomplete="off"
                 placeholder="Monday, Tuesday, &#x2026; Sunday" />
          <div class="dp-locale-hint">7 names, Monday first &bull; short form = first 3 chars</div>
          <div id="dp-sett-err" class="dp-sett-err"></div>
        </div>
      </div>
    </div>
  </div>
</div>
]==]

  js.window.document.body.appendChild(container)

  local scriptEl = js.window.document.createElement("script")
  scriptEl.innerHTML = [==[
(function () {
  "use strict";

  const root    = document.getElementById("sb-datepicker-root");
  const wrapper = document.getElementById("dp-wrapper");
  const SESSION = root.getAttribute("data-session");
  const DEFAULT_FMT = "[[%YYYY%-%MM%-%DD%]]";

  /* ── Default locale ───────────────────────────────────────────────────── */
  const DEFAULT_MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  /* Monday-first for UI; internally JS uses Sun=0…Sat=6 */
  const DEFAULT_DAYS_MON = [
    "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"
  ];

  /* [Mon,Tue,Wed,Thu,Fri,Sat,Sun] → [Sun,Mon,Tue,Wed,Thu,Fri,Sat] */
  function monFirstToJs(a) {
    return [a[6], a[0], a[1], a[2], a[3], a[4], a[5]];
  }
  /* [Sun,Mon,Tue,Wed,Thu,Fri,Sat] → [Mon,Tue,Wed,Thu,Fri,Sat,Sun] */
  function jsToMonFirst(a) {
    return [a[1], a[2], a[3], a[4], a[5], a[6], a[0]];
  }

  function parseMonths(stored) {
    if (!stored) return DEFAULT_MONTHS.slice();
    const p = stored.split(",").map(s => s.trim()).filter(Boolean);
    return p.length === 12 ? p : DEFAULT_MONTHS.slice();
  }
  function parseDays(stored) {
    if (!stored) return monFirstToJs(DEFAULT_DAYS_MON);
    const p = stored.split(",").map(s => s.trim()).filter(Boolean);
    return p.length === 7 ? monFirstToJs(p) : monFirstToJs(DEFAULT_DAYS_MON);
  }

  /* ── State ────────────────────────────────────────────────────────────── */
  let MONTH_FULL = parseMonths(localStorage.getItem("sb-dp-months"));
  let DAY_FULL   = parseDays(localStorage.getItem("sb-dp-days"));

  let viewDate   = new Date();
  const today    = new Date();
  let focusDate  = new Date();
  let kbMode     = true;
  let isFlipped  = false;
  let currentFmt = localStorage.getItem("sb-dp-format") || DEFAULT_FMT;

  /* ── Helpers ──────────────────────────────────────────────────────────── */
  const pad = n => String(n).padStart(2, "0");

  function isoWeek(d) {
    const dt  = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = dt.getUTCDay() || 7;
    dt.setUTCDate(dt.getUTCDate() + 4 - day);
    const jan1 = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
    return Math.ceil(((dt - jan1) / 864e5 + 1) / 7);
  }

  function isoWeekYear(d) {
    const dt  = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = dt.getUTCDay() || 7;
    dt.setUTCDate(dt.getUTCDate() + 4 - day);
    return dt.getUTCFullYear();
  }

  function ordinalSuffix(d) {
    if (d >= 11 && d <= 13) return "th";
    switch (d % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  function formatDate(d, fmt) {
    const Y   = d.getFullYear(), Mo = d.getMonth(), D = d.getDate();
    const h24 = d.getHours(), min = d.getMinutes(), sec = d.getSeconds();
    const h12 = h24 % 12 || 12, dow = d.getDay();
    let r = fmt;
    /* Year – longer first */
    r = r.replace(/%YYYY%/g, Y);
    r = r.replace(/%YY%/g,   String(Y).slice(-2));
    /* Month – longer first */
    r = r.replace(/%MMMM%/g, MONTH_FULL[Mo]);
    r = r.replace(/%MMM%/g,  MONTH_FULL[Mo].slice(0, 3));
    r = r.replace(/%MM%/g,   pad(Mo + 1));
    r = r.replace(/%M%/g,    Mo + 1);
    /* Weekday – longer first */
    r = r.replace(/%dddd%/g, DAY_FULL[dow]);
    r = r.replace(/%ddd%/g,  DAY_FULL[dow].slice(0, 3));
    /* Day */
    r = r.replace(/%DD%/g,   pad(D));
    r = r.replace(/%Ord%/g,   ordinalSuffix(D));
    r = r.replace(/%D%/g,    D);
    /* Week */
    r = r.replace(/%GGGG%/g, isoWeekYear(d));
    r = r.replace(/%WW%/g,   pad(isoWeek(d)));
    r = r.replace(/%W%/g,    isoWeek(d));
    /* Time */
    r = r.replace(/%HH%/g,  pad(h24));
    r = r.replace(/%hh%/g,  pad(h12));
    r = r.replace(/%mm%/g,  pad(min));
    r = r.replace(/%ss%/g,  pad(sec));
    r = r.replace(/%A%/g,   h24 >= 12 ? "PM" : "AM");
    r = r.replace(/%a%/g,   h24 >= 12 ? "pm" : "am");
    return r;
  }

  /* ── Lifecycle ────────────────────────────────────────────────────────── */
  function cleanup() {
    window.removeEventListener("keydown", handleKey, true);
    if (root && root.parentNode) root.remove();
  }

  function selectDay(yr, mo, day) {
    const formatted = formatDate(new Date(yr, mo, day), currentFmt);
    window.dispatchEvent(new CustomEvent("sb-insert-date", {
      detail: { date: formatted, session: SESSION }
    }));
    cleanup();
  }

  /* ── Calendar render ──────────────────────────────────────────────────── */
  function createCell(dayNum, yr, mo, isOther) {
    const btn  = document.createElement("button");
    const date = new Date(yr, mo, dayNum);
    btn.className = "dp-cell" + (isOther ? " other-month" : "");
    btn.setAttribute("tabindex", "-1");
    if (date.getDay() === 0) btn.classList.add("sunday");
    if (!isOther &&
        dayNum === today.getDate() &&
        mo     === today.getMonth() &&
        yr     === today.getFullYear()) btn.classList.add("today");
    if (kbMode &&
        dayNum === focusDate.getDate() &&
        mo     === focusDate.getMonth() &&
        yr     === focusDate.getFullYear()) btn.classList.add("focused");
    btn.textContent = dayNum;
    btn.addEventListener("click", e => { e.stopPropagation(); selectDay(yr, mo, dayNum); });
    return btn;
  }

  function render() {
    const yr = viewDate.getFullYear();
    const mo = viewDate.getMonth();

    /* dropdowns */
    const mSel = document.getElementById("dp-month-select");
    const ySel = document.getElementById("dp-year-select");
    mSel.innerHTML = MONTH_FULL.map((n, i) =>
      `<option value="${i}"${i===mo?" selected":""}>${n}</option>`).join("");
    const yArr = [];
    for (let y = yr - 50; y <= yr + 20; y++) yArr.push(y);
    ySel.innerHTML = yArr.map(y =>
      `<option value="${y}"${y===yr?" selected":""}>${y}</option>`).join("");

    /* Weekday labels Mon–Sun using localized names
       JS day indices in Mon-first display order: 1,2,3,4,5,6,0 */
    const dayOrder = [1, 2, 3, 4, 5, 6, 0];
    document.getElementById("dp-labels").innerHTML =
      dayOrder.map((di, i) =>
        `<div class="dp-lbl${i===6?" sunday":""}">${DAY_FULL[di].slice(0, 3)}</div>`
      ).join("");

    /* day grid */
    const grid     = document.getElementById("dp-days");
    grid.innerHTML = "";

    const firstDow = new Date(yr, mo, 1).getDay();
    const offset   = firstDow === 0 ? 6 : firstDow - 1;
    const lastDay  = new Date(yr, mo + 1, 0).getDate();
    const prevLast = new Date(yr, mo,     0).getDate();
    const prevMo   = mo === 0 ? 11 : mo - 1;
    const prevYr   = mo === 0 ? yr - 1 : yr;
    const nextMo   = mo === 11 ? 0 : mo + 1;
    const nextYr   = mo === 11 ? yr + 1 : yr;

    for (let i = 0; i < offset; i++)
      grid.appendChild(createCell(prevLast - offset + 1 + i, prevYr, prevMo, true));
    for (let d = 1; d <= lastDay; d++)
      grid.appendChild(createCell(d, yr, mo, false));
    const trailing = (offset + lastDay) % 7;
    const fill     = trailing === 0 ? 0 : 7 - trailing;
    for (let i = 1; i <= fill; i++)
      grid.appendChild(createCell(i, nextYr, nextMo, true));

    if (kbMode) {
      const fc = grid.querySelector(".focused");
      if (fc) fc.focus();
    }
  }

  /* ── Settings flip ────────────────────────────────────────────────────── */
  function updatePreview() {
    const v = document.getElementById("dp-fmt-inp").value;
    document.getElementById("dp-preview").textContent =
      "\u25b6  " + formatDate(today, v || DEFAULT_FMT);
  }

  function flipToSettings() {
    isFlipped = true;
    wrapper.classList.add("flipped");
    document.getElementById("dp-gear").classList.add("spinning");
    document.getElementById("dp-sett-err").textContent = "";
    const inp = document.getElementById("dp-fmt-inp");
    inp.value = currentFmt;
    document.getElementById("dp-months-inp").value = MONTH_FULL.join(", ");
    document.getElementById("dp-days-inp").value   = jsToMonFirst(DAY_FULL).join(", ");
    updatePreview();
    setTimeout(() => { inp.focus(); inp.select(); }, 330);
  }

  function flipToCalendar() {
    isFlipped = false;
    wrapper.classList.remove("flipped");
    document.getElementById("dp-gear").classList.remove("spinning");
  }

  /* ── Placeholder reference ────────────────────────────────────────────── */
  /* Descriptions: max 4 visible chars so the 4-col grid stays compact */
  const PLACEHOLDERS = [
    ["%YYYY%", "Year: 20026"],  ["%YY%",   "Year short: 26" ],
    ["%MMMM%", "Full.m.: March"],  ["%MMM%",  "Short m.: Mar" ],
    ["%MM%",   "Month: 03" ],  ["%M%",    "Month: 3"  ],
    ["%DD%",   "Day(0): 05" ],  ["%D%",    "Day: 5" ],
    ["%Ord%",   "Ordinal: st,nd,th" ],  ["%dddd%", "F.Wkday:Monday"],
    ["%ddd%",  "Sh.Wkday: Mon" ],  ["%WW%",   "WeekNum(0): 09" ],
    ["%W%",    "WeekNum: 9"  ],  ["%GGGG%", "Weekyear"],
    ["%HH%",   "24-Hour: 16" ],  ["%hh%",   "12-Hour: 04" ],
    ["%mm%",   "Minutes: 45" ],  ["%ss%",   "Seconds" ],
    ["%A%",    "AM/PM"],  ["%a%",    "am/pm"],
  ];

  const phGrid = document.getElementById("dp-ph-grid");
  PLACEHOLDERS.forEach(([key, desc]) => {
    const k = document.createElement("span");
    k.className   = "dp-ph-key";
    k.textContent = key;
    k.title       = "Insert " + key;
    k.addEventListener("click", () => {
      const inp = document.getElementById("dp-fmt-inp");
      const s   = inp.selectionStart, e2 = inp.selectionEnd;
      inp.value = inp.value.slice(0, s) + key + inp.value.slice(e2);
      inp.selectionStart = inp.selectionEnd = s + key.length;
      inp.focus();
      updatePreview();
    });
    const dv = document.createElement("span");
    dv.className   = "dp-ph-desc";
    dv.textContent = desc;
    phGrid.appendChild(k);
    phGrid.appendChild(dv);
  });

  /* ── Wire up UI events ────────────────────────────────────────────────── */
  document.getElementById("dp-month-select").addEventListener("change", e => {
    viewDate = new Date(viewDate.getFullYear(), parseInt(e.target.value), 1); render();
  });
  document.getElementById("dp-year-select").addEventListener("change", e => {
    viewDate = new Date(parseInt(e.target.value), viewDate.getMonth(), 1); render();
  });
  document.getElementById("dp-prev").addEventListener("click", e => {
    e.stopPropagation();
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1); render();
  });
  document.getElementById("dp-next").addEventListener("click", e => {
    e.stopPropagation();
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1); render();
  });
  document.getElementById("dp-today").addEventListener("click", e => {
    e.stopPropagation();
    viewDate  = new Date(today.getFullYear(), today.getMonth(), 1);
    focusDate = new Date(); kbMode = true; render();
  });
  document.getElementById("dp-gear").addEventListener("click", e => {
    e.stopPropagation(); flipToSettings();
  });

  /* Reset format to default */
  document.getElementById("dp-reset-fmt").addEventListener("click", e => {
    e.stopPropagation();
    document.getElementById("dp-fmt-inp").value = DEFAULT_FMT;
    updatePreview();
    document.getElementById("dp-fmt-inp").focus();
  });

  /* Apply settings */
  document.getElementById("dp-apply").addEventListener("click", e => {
    e.stopPropagation();
    const errEl = document.getElementById("dp-sett-err");
    errEl.textContent = "";

    /* Format */
    const fmtVal = document.getElementById("dp-fmt-inp").value.trim();
    currentFmt = fmtVal || DEFAULT_FMT;
    localStorage.setItem("sb-dp-format", currentFmt);

    /* Month names */
    const monthsRaw = document.getElementById("dp-months-inp").value.trim();
    if (monthsRaw) {
      const p = monthsRaw.split(",").map(s => s.trim()).filter(Boolean);
      if (p.length === 12) {
        MONTH_FULL = p;
        localStorage.setItem("sb-dp-months", monthsRaw);
      } else {
        errEl.textContent = "Month names need exactly 12 entries."; return;
      }
    }

    /* Day names (Mon-first input → JS Sun-first internal array) */
    const daysRaw = document.getElementById("dp-days-inp").value.trim();
    if (daysRaw) {
      const p = daysRaw.split(",").map(s => s.trim()).filter(Boolean);
      if (p.length === 7) {
        DAY_FULL = monFirstToJs(p);
        localStorage.setItem("sb-dp-days", daysRaw);
      } else {
        errEl.textContent = "Day names need exactly 7 entries (Mon first)."; return;
      }
    }

    flipToCalendar();
    render();
  });

  document.getElementById("dp-cancel-sett").addEventListener("click", e => {
    e.stopPropagation(); flipToCalendar();
  });
  document.getElementById("dp-fmt-inp").addEventListener("input", updatePreview);

  /* click-outside closes */
  root.addEventListener("click", cleanup);
  wrapper.addEventListener("click", e => e.stopPropagation());

/* ── Keyboard navigation ──────────────────────────────────────────────── */
  const NAV_KEYS = new Set([
    "ArrowLeft","ArrowRight","ArrowUp","ArrowDown",
    "Enter","Escape","PageUp","PageDown", "Backspace", "Delete"
  ]);

  function handleKey(e) {
    // If we are currently in a text field, let the input handle itself 
    // but stop the event from reaching the SilverBullet editor.
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") {
      if (e.key === "Enter") {
        e.preventDefault(); 
        e.stopImmediatePropagation();
        document.getElementById("dp-apply").click();
      } else if (e.key === "Escape") {
        e.preventDefault(); 
        e.stopImmediatePropagation();
        flipToCalendar();
      }
      // Allow Arrows and Backspace to work in the input, 
      // but stop SilverBullet from seeing them.
      e.stopImmediatePropagation();
      return; 
    }

    if (!NAV_KEYS.has(e.key)) return;

    /* Settings mode: handled above, but as a safety for general navigation keys */
    if (isFlipped) {
      if (e.key === "Escape") {
        e.stopImmediatePropagation(); e.preventDefault(); flipToCalendar();
      }
      return; 
    }

    /* Calendar mode: capture everything */
    e.stopImmediatePropagation();
    e.preventDefault();

    if (e.key === "Escape") { cleanup(); return; }
    if (e.key === "Enter") {
      if (kbMode) selectDay(focusDate.getFullYear(), focusDate.getMonth(), focusDate.getDate());
      return;
    }

    kbMode = true;
    if      (e.key === "ArrowLeft")  focusDate.setDate(focusDate.getDate() - 1);
    else if (e.key === "ArrowRight") focusDate.setDate(focusDate.getDate() + 1);
    else if (e.key === "ArrowUp")    focusDate.setDate(focusDate.getDate() - 7);
    else if (e.key === "ArrowDown")  focusDate.setDate(focusDate.getDate() + 7);
    else if (e.key === "PageUp")     focusDate.setMonth(focusDate.getMonth() - 1);
    else if (e.key === "PageDown")   focusDate.setMonth(focusDate.getMonth() + 1);

    if (focusDate.getMonth()    !== viewDate.getMonth() ||
        focusDate.getFullYear() !== viewDate.getFullYear()) {
      viewDate = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
    }
    render();
  }

  window.addEventListener("keydown", handleKey, true);

  /* ── Initial render ───────────────────────────────────────────────────── */
  render();
  wrapper.setAttribute("tabindex", "-1");
  wrapper.focus();
})();
]==]

  container.appendChild(scriptEl)
end

slashCommand.define {
  name = "datepicker",
  run  = function() openDatePicker() end
}
```

- [SilverBullet Community](https://community.silverbullet.md/t/datepicker-add-on-as-slashcommand/3679?u=mr.red)