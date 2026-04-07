---
name: "Library/Mr-xRed/JournalExplorer"
tags: meta/library
pageDecoration.prefix: "📔 "
---

# 📔 Journal Explorer

A **Journal Explorer** for your SilverBullet journal entries. It scans your space for pages matching your journal path pattern, renders them as richly styled tiles (calendar icon + title/snippet + image thumbnail), and supports infinite lazy scrolling, a live sticky date-context header, filtering, sorting, and a full settings panel — all without leaving your workspace.

## Main Features

* **Chronological List** — Newest entry at top; scrolls into the past.
* **Lazy Batching** — Loads tiles in batches; content fetched ahead of scroll via `IntersectionObserver`.
* **Background Indexing** — All entries are silently pre-fetched into IndexedDB after initial render, enabling full-history search on subsequent visits.
* **Sticky Date Header** — Shows the Month + Year of the topmost visible entry; updates smoothly as you scroll.
* **Month Separator Tiles** — Inline dividers mark month boundaries; replace the sticky header as they reach the top.
* **Tear-off Calendar Icon** — CSS-only three-row icon: month abbrev + large date number + short weekday name.
* **Rich Tile** — Title, snippet preview, and first image extracted from page content.
* **Multi-word Filter** — Splits query by spaces and ANDs all terms; searches full title, snippet, and path across all indexed entries.
* **Sort Toggle** — Newest-first (default) ↔ Oldest-first.
* **New Entry** — Creates today's journal page using your path pattern.
* **Settings Panel** — Configure path pattern, position, batch size, locale, and display options. Fields locked by your space-lua config are marked 🔒.
* **Scroll Preservation** — Opening a journal entry never resets the explorer scroll position.
* **Extensible** — View mode switcher slot ready for Grid / Calendar views.

## Config Example & Defaults

```lua
-- priority: 1
config.set("journalExplorer", {
  position           = "lhs",
  journalPathPattern = "Journal/#year#/#month#-#monthname#/#year#-#month#-#day#_#weekday#",
  batchSize          = 20, 
  showThumbnails     = true,
  showSnippets       = true,
  monthNames  = {"January","February","March","April","May","June","July","August","September","October","November","December"},
  dayNames    = {"Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"},
})
```

> **note** Copy this into a `space-lua` block on your config page to override defaults. Any key set here will be shown as 🔒 in the Settings panel and cannot be changed through the UI.

**Placeholders:** `#year#` `#month#` `#day#` `#monthname#` `#monthshort#` `#weekday#` (3-letter abbrev) `#weekdayfull#` (full name) `#weeknum#` `#ordinal#` `#HH#` `#mm#` `#ss#` `#wildcard#`

## Space Style (Optional Theming Overrides)

```css
/*
  JournalExplorer — override any --je-* variable below.
  These are injected into the panel iframe automatically.
*/
html[data-theme="dark"] {
  --je-accent:      var(--ui-accent-color,  oklch(60% 0.18 255));
  --je-accent-text: var(--ui-accent-contrast-color, white);
  --je-bg:          var(--top-background-color, #111827);
  --je-text:        var(--root-color, #e5e7eb);
  --je-border:      oklch(from var(--modal-border-color) 0.45 c h / 0.55);
  --je-hover:       oklch(1 0 0 / 0.06);
  --je-tile-bg:     oklch(1 0 0 / 0.04);
  --je-cal-body:    oklch(0.26 0.01 250);
  --je-today-ring:  oklch(0.75 0.18 80);
  --je-text-muted:  oklch(0.80 0 0);
  --je-skeleton:    oklch(0.28 0 0);
  --je-sk-shine:    oklch(0.36 0 0);
}
html[data-theme="light"] {
  --je-accent:      var(--ui-accent-color,  oklch(55% 0.15 250));
  --je-accent-text: var(--ui-accent-contrast-color, white);
  --je-bg:          var(--top-background-color, #f9fafb);
  --je-text:        var(--root-color, #111827);
  --je-border:      oklch(from var(--modal-border-color) 0.80 c h / 0.7);
  --je-hover:       oklch(0 0 0 / 0.04);
  --je-tile-bg:     oklch(1 0 0 / 0.75);
  --je-cal-body:    oklch(0.97 0 0);
  --je-today-ring:  oklch(0.60 0.18 80);
  --je-text-muted:  oklch(0.50 0 0);
  --je-skeleton:    oklch(0.88 0 0);
  --je-sk-shine:    oklch(0.94 0 0);
}
```


```space-style

:root {
  --je-shadow: 0 1px 4px oklch(0 0 0 / 0.35);
  --je-radius: 8px;
}


html[data-theme="dark"] {
  --je-accent:      var(--ui-accent-color,  oklch(60% 0.18 255));
  --je-accent-text: var(--ui-accent-contrast-color, white);
  --je-bg:          var(--top-background-color, #111827);
  --je-text:        var(--root-color, #e5e7eb);
  --je-border:      oklch(from var(--modal-border-color) 0.45 c h / 0.55);
  --je-hover:       oklch(1 0 0 / 0.16);
  --je-tile-bg:     oklch(1 0 0 / 0.04);
  --je-cal-body:    oklch(0.26 0.01 250);
  --je-today-ring:  oklch(0.75 0.18 80);
  --je-text-muted:  oklch(0.80 0 0);
  --je-skeleton:    oklch(0.28 0 0);
  --je-sk-shine:    oklch(0.36 0 0);
}
html[data-theme="light"] {
  --je-accent:      var(--ui-accent-color,  oklch(55% 0.15 250));
  --je-accent-text: var(--ui-accent-contrast-color, white);
  --je-bg:          var(--top-background-color, #f9fafb);
  --je-text:        var(--root-color, #111827);
  --je-border:      oklch(from var(--modal-border-color) 0.80 c h / 0.7);
  --je-hover:       oklch(0 0 0 / 0.04);
  --je-tile-bg:     oklch(1 0 0 / 0.75);
  --je-cal-body:    oklch(0.97 0 0);
  --je-today-ring:  oklch(0.60 0.18 80);
  --je-text-muted:  oklch(0.40 0 0);
  --je-skeleton:    oklch(0.88 0 0);
  --je-sk-shine:    oklch(0.94 0 0);
}

#je-panel {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: var(--je-bg);
  overflow: hidden;
  position: relative;
}

.je-toolbar {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 7px 8px 5px 8px;
  border-bottom: 1px solid var(--je-border);
  background: var(--je-bg);
  flex-shrink: 0;
}

.je-spacer { flex: 1; }

.je-view-sw {
  display: flex;
  align-items: center;
  gap: 2px;
  background: oklch(0.5 0 0 / 0.1);
  border: 1px solid var(--je-border);
  border-radius: 7px;
  padding: 2px;
}

/* ── Background indexing indicator ── */
.je-bg-ind {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--je-accent);
  opacity: 0;
  flex-shrink: 0;
  transition: opacity 0.4s;
}
.je-bg-ind.je-bg-active {
  opacity: 0.75;
  animation: je-pulse 1.6s ease-in-out infinite;
}
@keyframes je-pulse {
  0%, 100% { transform: scale(1); opacity: 0.75; }
  50%       { transform: scale(1.4); opacity: 1; }
}

.je-btn {
  flex-shrink: 0;
  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 7px;
  cursor: pointer;
  color: var(--je-text);
  background: transparent;
  transition: background 0.15s, border-color 0.15s;
}
.je-btn:hover { background: var(--je-hover); border-color: var(--je-border); }
.je-btn-active { background: var(--je-accent) !important; color: var(--je-accent-text) !important; border-color: transparent !important; }

.je-btn svg {
  display: inline-block;
  flex-shrink: 0;
  width: 15px;
  height: 15px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
}

.je-filter-bar {
  display: none;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-bottom: 1px solid var(--je-border);
  background: var(--je-bg);
  flex-shrink: 0;
}
.je-filter-bar input {
  flex: 1; padding: 5px 8px;
  border-radius: 6px; border: 1px solid var(--je-border);
  background: var(--je-tile-bg); color: var(--je-text);
  font-size: 12px; outline: none;
}
.je-filter-bar input:focus { border-color: var(--je-accent); }
.je-filter-clear {
  background: none; border: none; cursor: pointer;
  color: var(--je-text-muted); font-size: 15px; line-height: 1;
  padding: 2px 4px; flex-shrink: 0;
}

.je-date-ctx {
  padding: 5px 12px;
  font-size: 10.5px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--je-text-muted);
  background: var(--je-bg);
  border-bottom: 1px solid var(--je-border);
  flex-shrink: 0;
  transition: color 0.2s;
}

#je-list {
  flex: 1; overflow-y: auto; overflow-x: hidden;
  padding: 5px 6px 10px 6px;
  display: flex; flex-direction: column; gap: 4px;
}
#je-list::-webkit-scrollbar { width: 3px; }
#je-list::-webkit-scrollbar-track { background: transparent; }
#je-list::-webkit-scrollbar-thumb { background: var(--je-border); border-radius: 2px; }

/* ── Month Separator Tile ── */
.je-month-sep {
  padding: 4px 12px;
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.11em; text-transform: uppercase;
  color: var(--je-text-muted);
  background: var(--je-bg);
  border: 1px solid var(--je-border);
  border-radius: var(--je-radius);
  text-align: center;
  margin: 2px 0;
  flex-shrink: 0;
}

.je-tile {
  display: flex; align-items: stretch; gap: 9px;
  padding: 7px 9px;
  border-radius: var(--je-radius);
  border: 1px solid var(--je-border);
  background: var(--je-tile-bg);
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
  min-height: 64px;
  user-select: none;
}
.je-tile:hover { background: var(--je-hover); box-shadow: var(--je-shadow); transform: translateX(2px); }
.je-tile:active { transform: translateX(1px); opacity: 0.85; }
.je-tile-open { border-color: var(--je-accent); border-left-width: 3px; padding-left: 7px; }

/* ── Tear-off calendar icon — 3-row: month / day / weekday ── */
.je-cal {
  flex: 0 0 42px; width: 42px;
  border-radius: 7px; overflow: hidden;
  display: flex; flex-direction: column;
  border: 1px solid var(--je-border);
  align-self: center;
  box-shadow: 0 1px 3px oklch(0 0 0 / 0.15);
}
.je-cal-top {
  background: var(--je-accent);
  color: var(--je-accent-text);
  font-size: 8px; font-weight: 800;
  text-align: center;
  padding: 3px 2px 2px;
  letter-spacing: 0.07em; line-height: 1;
}
.je-cal-today .je-cal-top { background: var(--je-today-ring); }
.je-cal-num {
  flex: 1;
  display: flex; align-items: center; justify-content: center;
  font-size: 21px; font-weight: 700;
  color: var(--je-text);
  background: var(--je-cal-body);
  line-height: 1;
}
.je-cal-today .je-cal-num { color: var(--je-today-ring); }
.je-cal-bottom {
  background: var(--je-cal-body);
  color: var(--je-text-muted);
  font-size: 7.5px; font-weight: 700;
  text-align: center;
  padding: 2px 2px 3px;
  letter-spacing: 0.05em; line-height: 1;
  /*border-top: 1px solid var(--je-border);*/
}
.je-cal-today .je-cal-bottom { color: var(--je-today-ring); }

.je-content {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column;
  justify-content: center; gap: 3px;
  overflow: hidden;
}
.je-title {
  font-size: 12.5px; font-weight: 600; color: var(--je-text);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.4;
}
.je-snip {
  font-size: 11px; color: var(--je-text-muted); line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
.je-title-err { color: var(--je-text-muted); font-style: italic; }

.je-thumb {
  flex: 0 0 50px; width: 50px; height: 50px;
  border-radius: 6px; overflow: hidden;
  align-self: center;
  background: var(--je-tile-bg); border: 1px solid var(--je-border);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.je-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.je-thumb .je-ph { width: 100%; height: 100%; }

@keyframes je-shimmer {
  0%   { background-position: -200px 0; }
  100% { background-position:  200px 0; }
}
.je-sk {
  border-radius: 4px;
  background: linear-gradient(90deg, var(--je-skeleton) 25%, var(--je-sk-shine) 50%, var(--je-skeleton) 75%);
  background-size: 400px 100%;
  animation: je-shimmer 1.4s ease-in-out infinite;
}
.je-title.je-sk { height: 13px; width: 75%; }
.je-snip.je-sk  { height: 10px; width: 55%; margin-top: 2px; }
.je-thumb-sk    { width: 100%; height: 100%; background: var(--je-skeleton); }

.je-empty { padding: 28px 14px; text-align: center; color: var(--je-text-muted); font-size: 12px; }
.je-end   { padding: 10px; text-align: center; color: var(--je-text-muted); font-size: 11px; opacity: 0.5; }
.je-sentinel { height: 1px; flex-shrink: 0; }

/* ── Settings overlay ── */
.je-settings {
  position: absolute; inset: 0;
  background: var(--je-bg); z-index: 20;
  display: none; flex-direction: column; overflow: hidden;
}
@keyframes je-slide-up {
  from { transform: translateY(14px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
.je-settings.je-settings-open { display: flex; animation: je-slide-up 0.2s ease; }
.je-s-hdr {
  display: flex; align-items: center;
  padding: 9px 12px; border-bottom: 1px solid var(--je-border);
  gap: 8px; flex-shrink: 0;
}
.je-s-hdr h3 { flex: 1; font-size: 13px; font-weight: 700; margin: 0; color: var(--je-text); }
.je-s-body {
  padding: 12px 12px 6px 12px;
  display: flex; flex-direction: column; gap: 12px;
  flex: 1; overflow-y: auto;
}
.je-s-group { display: flex; flex-direction: column; gap: 4px; }
.je-s-group label {
  font-size: 10.5px; font-weight: 700;
  color: var(--je-text-muted);
  text-transform: uppercase; letter-spacing: 0.06em;
}
.je-s-group input[type="text"],
.je-s-group input[type="number"],
.je-s-group select {
  padding: 6px 8px; border-radius: 6px;
  border: 1px solid var(--je-border);
  background: var(--je-tile-bg); color: var(--je-text);
  font-size: 12px; outline: none;
  width: 100%; box-sizing: border-box; max-width: 100%;
}
.je-s-group input:focus, .je-s-group select:focus { border-color: var(--je-accent); }
.je-s-group input:disabled, .je-s-group select:disabled {
  opacity: 0.45; cursor: not-allowed;
  background: var(--je-skeleton);
}
.je-s-hint { font-size: 10px; color: var(--je-text-muted); line-height: 1.5; margin-top: 2px; }
.je-s-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.je-s-row span { font-size: 12px; color: var(--je-text); }
.je-s-row input[type="checkbox"] { width: 15px; height: 15px; cursor: pointer; accent-color: var(--je-accent); }
.je-s-row input[type="checkbox"]:disabled { cursor: not-allowed; opacity: 0.45; }
.je-s-sep { height: 1px; background: var(--je-border); border: none; margin: 2px 0; flex-shrink: 0; }
.je-lock-badge { font-size: 10px; margin-left: 3px; }
.je-s-lock-note {
  font-size: 10px; color: var(--je-text-muted);
  background: oklch(0.5 0 0 / 0.08);
  border: 1px solid var(--je-border);
  border-radius: 5px; padding: 5px 7px; line-height: 1.5;
}
```


## Integration

```space-lua
-- priority: -10

-- ── Config Schema ─────────────────────────────────────────────────
config.define("journalExplorer", {
  type = "object",
  properties = {
    position           = schema.string(),
    journalPathPattern = schema.string(),
    batchSize          = schema.number(),
    panelWidth         = schema.number(),
    showThumbnails     = schema.boolean(),
    showSnippets       = schema.boolean(),
    monthNames         = { type = "array", items = { type = "string" } },
    dayNames           = { type = "array", items = { type = "string" } },
  }
})

-- ── Load Config + Locked-Key Detection ───────────────────────────
-- Mirrors the FloatingJournalCalendar pattern exactly:
--   • A key is LOCKED if and only if it is present in config.get() (nil-check).
--   • The UI never calls config.set() — it writes only to clientStore.
--   • Therefore config.get() is exclusively owned by space-lua, making a
--     simple nil-check the correct and complete lock test.
local function loadConfig()
  local c = config.get("journalExplorer") or {}
  local defaultMonths = {"January","February","March","April","May","June","July","August","September","October","November","December"}
  local defaultDays   = {"Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"}

  -- Simple nil-check lock detection (identical to FloatingJournalCalendar mark()).
  local locked = {}
  if c.position           ~= nil then locked.position           = true end
  if c.journalPathPattern ~= nil then locked.journalPathPattern = true end
  if c.batchSize          ~= nil then locked.batchSize          = true end
  if c.showThumbnails     ~= nil then locked.showThumbnails     = true end
  if c.showSnippets       ~= nil then locked.showSnippets       = true end
  if c.monthNames         ~= nil then locked.monthNames         = true end
  if c.dayNames           ~= nil then locked.dayNames           = true end

  -- Soft settings from clientStore (written exclusively by the UI settings panel).
  -- Lua hard-values take priority; clientStore fills in only when no Lua override exists.
  local csPos   = clientStore.get("journalExplorer.position")
  local csPat   = clientStore.get("journalExplorer.pattern")
  local csBatch = clientStore.get("journalExplorer.batchSize")

  -- Read a boolean soft-setting stored as "true"/"false" string in clientStore.
  local function csBool(key, default)
    local s = clientStore.get("journalExplorer." .. key)
    if s == nil then return default end
    return s == "true"
  end

  -- Read an array soft-setting stored as a comma-joined string in clientStore.
  local function csArr(key)
    local s = clientStore.get("journalExplorer." .. key)
    if not s then return nil end
    local arr = {}
    for v in s:gmatch("[^,]+") do table.insert(arr, v:match("^%s*(.-)%s*$")) end
    return #arr > 0 and arr or nil
  end

  -- Resolve booleans safely: Lua value if locked, else clientStore, else default.
  local thumbs, snippets
  if c.showThumbnails ~= nil then thumbs   = (c.showThumbnails ~= false)
  else                             thumbs   = csBool("showThumbnails", true) end
  if c.showSnippets   ~= nil then snippets = (c.showSnippets   ~= false)
  else                             snippets = csBool("showSnippets",  true) end

  return {
    PANEL_ID = c.position           or csPos             or "lhs",
    PATTERN  = c.journalPathPattern or csPat             or "Journal/#year#/#month#-#monthname#/#year#-#month#-#day#_#weekday#",
    BATCH    = c.batchSize          or tonumber(csBatch) or 20,
    WIDTH    = c.panelWidth         or 290,
    THUMBS   = thumbs,
    SNIPPETS = snippets,
    MONTHS   = c.monthNames or csArr("monthNames") or defaultMonths,
    DAYS     = c.dayNames   or csArr("dayNames")   or defaultDays,
    LOCKED   = locked,
  }
end

local CFG           = loadConfig()
local PANEL_VISIBLE = clientStore.get("journalExplorer.open") == "true"

-- ── Pattern → Lua Filter ──────────────────────────────────────────
local function buildFilterPattern(pat)
  pat = pat:gsub("([%(%)%.%%%+%-%[%^%$%?%*])", "%%%1")
  pat = pat:gsub("#weekdayfull#", "[%%a]+")
  pat = pat:gsub("#monthname#",   "[%%a]+")
  pat = pat:gsub("#monthshort#",  "[%%a]+")
  pat = pat:gsub("#weekday#",     "[%%a]+")
  pat = pat:gsub("#ordinal#",     "[%%a]+")
  pat = pat:gsub("#weekyear#",    "%%d%%d%%d%%d")
  pat = pat:gsub("#weeknum#",     "%%d%%d")
  pat = pat:gsub("#weeknumraw#",  "%%d+")
  pat = pat:gsub("#year#",        "%%d%%d%%d%%d")
  pat = pat:gsub("#month#",       "%%d%%d")
  pat = pat:gsub("#day#",         "%%d%%d")
  pat = pat:gsub("#YY#",          "%%d%%d")
  pat = pat:gsub("#M#",           "%%d+")
  pat = pat:gsub("#D#",           "%%d+")
  pat = pat:gsub("#HH#",          "%%d%%d")
  pat = pat:gsub("#hh#",          "%%d%%d")
  pat = pat:gsub("#mm#",          "%%d%%d")
  pat = pat:gsub("#ss#",          "%%d%%d")
  pat = pat:gsub("#wildcard#",    ".*")
  return "^" .. pat .. "$"
end

-- ── Date Extraction ───────────────────────────────────────────────
local function extractDate(name)
  local y, m, d = name:match("(%d%d%d%d)%-(%d%d)%-(%d%d)")
  if y then return tonumber(y), tonumber(m), tonumber(d) end
  y, m, d = name:match("(%d%d%d%d)/(%d%d)/(%d%d)")
  if y then return tonumber(y), tonumber(m), tonumber(d) end
  return nil, nil, nil
end

-- ── Weekday Name (Zeller) — FIX: use (+7)%7 for correct modulo ───
-- The remap table {6,7,1,2,3,4,5} correctly maps Zeller's h values
-- (0=Sat,1=Sun,2=Mon…6=Fri) to Mon-first indices (1=Mon…7=Sun).
-- The extra +7 before the final %7 prevents negative results in Lua.
local function weekdayName(year, month, day, dayNames)
  local y = year
  local m = month
  if m < 3 then m = m + 12; y = y - 1 end
  local k = y % 100
  local j = math.floor(y / 100)
  local h = ((day + math.floor(13*(m+1)/5) + k + math.floor(k/4) + math.floor(j/4) - 2*j) % 7 + 7) % 7
  local remap = {6, 7, 1, 2, 3, 4, 5}
  local idx = remap[h + 1] or 1
  return dayNames[idx] or "Monday"
end

-- ── JSON Helpers ──────────────────────────────────────────────────
local function jesc(s)
  if not s then return "" end
  s = s:gsub("\\", "\\\\")
  s = s:gsub('"', '\\"')
  s = s:gsub("\n", "\\n")
  s = s:gsub(string.char(13), "\\r")
  s = s:gsub(string.char(9), "\\t")
  return s
end
local function jbool(v) return (v ~= false) and "true" or "false" end

-- ── Markdown Content Extraction ───────────────────────────────────
local function extractInfo(content)
  if not content then return "", "", nil end
  local body = content
  local _, fmEnd = body:find("^%-%-%-.-%-%-%-[\n\r]*")
  if fmEnd then body = body:sub(fmEnd + 1) end
  local title, snippetBuf, imgRef, titleDone = "", {}, nil, false
  for line in body:gmatch("[^\r\n]+") do
    local t = line:match("^%s*(.-)%s*$")
    if t and #t > 0 then
      if not titleDone then
        title = t:match("^#+%s+(.+)$") or t
        titleDone = true
      else
        if not t:match("^#+%s") then
          local currentLen = 0
          for _, p in ipairs(snippetBuf) do currentLen = currentLen + #p end
          if currentLen < 140 then table.insert(snippetBuf, t) end
        end
      end
    end
  end
  local snippet = table.concat(snippetBuf, " ")
  if #snippet > 130 then snippet = snippet:sub(1, 127) .. "…" end
  imgRef = body:match("!%[%[([^%]|%s]+)")
  if not imgRef then imgRef = body:match("!%[[^%]]*%]%(([^%s%)]+)%)") end
  return title, snippet, imgRef
end

-- ── Today's Path Builder ──────────────────────────────────────────
-- #weekday# → first 3 letters (abbrev); #weekdayfull# → full name.
local function buildPathFromDate(pat, y, m, d, wday, h, mn, sec, months, days)
  local dayIdx = wday == 0 and 7 or wday
  local dayName    = days[dayIdx] or "Monday"
  local dayAbbr    = dayName:sub(1, 3)
  local monthName  = months[m] or "January"
  local monthShort = monthName:sub(1, 3)
  local ordinals = {"st","nd","rd"}
  local ord = (d > 3 and d < 21) and "th" or (ordinals[d % 10] or "th")
  if d > 23 then ord = ordinals[d % 10] or "th" end
  local weekNum = math.floor((d - 1) / 7) + 1
  local p = pat
  p = p:gsub("#year#",        string.format("%04d", y))
  p = p:gsub("#YY#",          string.format("%02d", y % 100))
  p = p:gsub("#month#",       string.format("%02d", m))
  p = p:gsub("#M#",           tostring(m))
  p = p:gsub("#day#",         string.format("%02d", d))
  p = p:gsub("#D#",           tostring(d))
  p = p:gsub("#monthname#",   monthName)
  p = p:gsub("#monthshort#",  monthShort)
  p = p:gsub("#weekdayfull#", dayName)
  p = p:gsub("#weekday#",     dayAbbr)
  p = p:gsub("#ordinal#",     ord)
  p = p:gsub("#weeknum#",     string.format("%02d", weekNum))
  p = p:gsub("#weeknumraw#",  tostring(weekNum))
  p = p:gsub("#weekyear#",    tostring(y))
  p = p:gsub("#HH#",          string.format("%02d", h or 0))
  p = p:gsub("#hh#",          string.format("%02d", (h or 0) % 12))
  p = p:gsub("#mm#",          string.format("%02d", mn or 0))
  p = p:gsub("#ss#",          string.format("%02d", sec or 0))
  p = p:gsub("#wildcard#",    "")
  return p
end

-- ── Entry List Builder ────────────────────────────────────────────
local function buildEntryList()
  local filterPat = buildFilterPattern(CFG.PATTERN)
  local all = space.listPages()
  local entries = {}
  for _, page in ipairs(all) do
    local name = page.name
    if name:match(filterPat) then
      local y, m, d = extractDate(name)
      if y and m and d then
        local dn = weekdayName(y, m, d, CFG.DAYS)
        table.insert(entries, {
          path    = name,
          year    = y, month = m, day = d,
          dayName = dn,
          sortKey = y * 10000 + m * 100 + d,
        })
      end
    end
  end
  table.sort(entries, function(a, b) return a.sortKey > b.sortKey end)
  return entries
end

-- ── Inline CSS ────────────────────────────────────────────────────
local PANEL_CSS = [==[<style>
html, body {
  height: 100%; overflow: hidden;
  font-family: var(--ui-font, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
  font-size: 13px;
}
body { background: var(--je-bg, #111827); color: var(--je-text, #e5e7eb); }
</style>
]==]

-- ── Panel HTML ────────────────────────────────────────────────────
local function buildHtml()
  local h = {}
  table.insert(h, PANEL_CSS)
  table.insert(h, [==[
<div id="je-panel">
  <div class="je-toolbar">
    <button id="je-new-btn" class="je-btn" title="New Entry">
      <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
    </button>
    <button id="je-refresh-btn" class="je-btn" title="Refresh">
      <svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>
    </button>
    <span id="je-bg-ind" class="je-bg-ind" title="Background indexing…"></span>
    <button id="je-sort-btn" class="je-btn" title="Sort: Newest First" data-asc="0">
      <svg viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="8" y2="18"/><polyline points="17 21 20 18 17 15"/></svg>
    </button>
    <button id="je-filter-btn" class="je-btn" title="Filter / Search">
      <svg viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
    </button>
    <div class="je-spacer"></div>
    <div id="je-view-sw" class="je-view-sw">
      <button id="je-view-list" class="je-btn je-btn-active" title="List View" data-view="list">
        <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      </button>
    </div>
    <button id="je-settings-btn" class="je-btn" title="Settings" style="margin-left:3px">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    </button>
    <button id="je-close-btn" class="je-btn" title="Close Journal Explorer" style="margin-left:2px">
      <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>

  <div id="je-filter-bar" class="je-filter-bar">
    <input type="text" id="je-filter-input" placeholder="Search entries… (space = AND)" autocomplete="off">
    <button id="je-filter-clear-btn" class="je-filter-clear" title="Clear">✕</button>
  </div>

  <div id="je-date-ctx" class="je-date-ctx">Loading…</div>
  <div id="je-list"></div>

  <div id="je-settings" class="je-settings">
    <div class="je-s-hdr">
      <svg style="width:15px;height:15px;stroke:var(--je-text-muted);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      <h3>Journal Explorer Settings</h3>
      <button id="je-s-apply-btn" class="je-btn" title="Apply &amp; Reload" style="color:var(--je-accent)">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </button>
      <button id="je-s-close-btn" class="je-btn" title="Cancel">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="je-s-body">
      <div class="je-s-group">
        <label>Journal Path Pattern</label>
        <input type="text" id="je-s-pattern" placeholder="Journal/#year#/…">
        <div class="je-s-hint">Placeholders: #year# #month# #day# #monthname# #weekday# (3-letter) #weekdayfull# (full) #weeknum# etc.</div>
      </div>
      <div class="je-s-group">
        <label>Panel Position</label>
        <select id="je-s-pos"><option value="lhs">Left Hand Side</option><option value="rhs">Right Hand Side</option></select>
      </div>
      <div class="je-s-group">
        <label>Batch Size</label>
        <input type="number" id="je-s-batch" min="5" max="100" placeholder="20">
        <div class="je-s-hint">Entries loaded per scroll batch (5–100).</div>
      </div>
      <hr class="je-s-sep">
      <div class="je-s-group">
        <div class="je-s-row"><span id="je-s-thumb-lbl">Show Thumbnails</span><input type="checkbox" id="je-s-thumb"></div>
      </div>
      <div class="je-s-group">
        <div class="je-s-row"><span id="je-s-snip-lbl">Show Snippets</span><input type="checkbox" id="je-s-snip"></div>
      </div>
      <hr class="je-s-sep">
      <div class="je-s-group">
        <label>Month Names (comma-separated)</label>
        <input type="text" id="je-s-months" placeholder="January, February, …">
      </div>
      <div class="je-s-group">
        <label>Day Names — Monday first (full names, comma-separated)</label>
        <input type="text" id="je-s-days" placeholder="Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday">
      </div>
    </div>
  </div>
</div>
]==])
  return table.concat(h)
end

-- ── Main JavaScript ───────────────────────────────────────────────
local MAIN_JS = [[
(function () {
"use strict";

// ── 1. Theme injection ────────────────────────────────────────────
(function injectParentTheme() {
  const pd = window.parent && window.parent.document;
  if (!pd) return;

  // Sync theme attribute
  const theme = pd.documentElement.getAttribute("data-theme") || "dark";
  document.documentElement.setAttribute("data-theme", theme);

  // 1. Handle Main CSS
  if (!document.getElementById("je-main-css")) {
    const mainLink = document.createElement("link");
    mainLink.id = "je-main-css";
    mainLink.rel = "stylesheet";
    mainLink.href = "/.client/main.css";
    document.head.appendChild(mainLink);
  }

  // 2. Clone ALL styles from parent (not just one ID)
  // This selects all <style> tags and custom <link> tags
  const parentStyles = pd.querySelectorAll('style, link[rel="stylesheet"]:not([href*="main.css"])');
  
  parentStyles.forEach((styleEl, index) => {
    const id = `je-injected-${index}`;
    if (document.getElementById(id)) return;

    const clone = styleEl.cloneNode(true);
    clone.id = id;
    document.head.appendChild(clone);
  });
})();

// ── 2. IndexedDB helpers ──────────────────────────────────────────
var _db = null;
var _DB_NAME  = "JE_Content_v1";
var _DB_STORE = "entries";

function _openDB(cb) {
  try {
    var req = indexedDB.open(_DB_NAME, 1);
    req.onupgradeneeded = function(e) {
      e.target.result.createObjectStore(_DB_STORE, { keyPath: "path" });
    };
    req.onsuccess = function(e) { _db = e.target.result; cb(_db); };
    req.onerror   = function()  { cb(null); };
  } catch(e) { cb(null); }
}

function _dbGet(cb) {
  if (!_db) { cb({}); return; }
  try {
    var req = _db.transaction(_DB_STORE, "readonly").objectStore(_DB_STORE).getAll();
    req.onsuccess = function(e) {
      var map = {};
      e.target.result.forEach(function(r) { map[r.path] = r; });
      cb(map);
    };
    req.onerror = function() { cb({}); };
  } catch(e) { cb({}); }
}

function _dbPut(path, info) {
  if (!_db) return;
  try {
    var tx = _db.transaction(_DB_STORE, "readwrite");
    tx.objectStore(_DB_STORE).put({ path: path, title: info.title, snippet: info.snippet, imgRef: info.imgRef, ts: Date.now() });
  } catch(e) {}
}

// ── 3. State ──────────────────────────────────────────────────────
var MONTHS     = JE_CONFIG.monthNames;
var BATCH_SIZE = JE_CONFIG.batchSize || 20;
var SHOW_THUMB = JE_CONFIG.showThumbnails !== false;
var SHOW_SNIP  = JE_CONFIG.showSnippets  !== false;
var LOCKED     = JE_CONFIG.locked || {};

var entries         = JE_ENTRIES.slice();
var filteredEntries = entries.slice();
var renderedCount   = 0;
var sortAsc         = false;
var filterActive    = false;
var currentOpenPath = null;
var loadedContent   = new Map();
var lastRenderedMonth = null;   // tracks month boundary across batches
var listItemCounter = 0;        // sequential DOM order index for stickyObs

// background indexing state
var bgQueue        = [];
var bgPending      = new Set();
var idbCachedPaths = new Set(); // paths seeded from stale IDB; re-fetched by bgStart

// ── 3b. Apply soft settings from localStorage (locked keys are skipped) ──
// Mirrors FloatingJournalCalendar: `if (!LUA_OVERRIDES[k] && k in s) setter(s[k])`.
// LOCKED keys are never read from localStorage — the Lua-injected JE_CONFIG value
// (already applied above via JE_PRELOAD / state init) is always authoritative.
try {
  var _lsRaw = localStorage.getItem("journalExplorer.settings");
  if (_lsRaw) {
    var _ls = JSON.parse(_lsRaw);
    if (!LOCKED.showThumbnails && _ls.showThumbnails !== undefined) SHOW_THUMB = Boolean(_ls.showThumbnails);
    if (!LOCKED.showSnippets   && _ls.showSnippets   !== undefined) SHOW_SNIP  = Boolean(_ls.showSnippets);
    if (!LOCKED.batchSize      && _ls.batchSize)                    BATCH_SIZE = _ls.batchSize;
    if (!LOCKED.monthNames     && _ls.monthNames && _ls.monthNames.length) MONTHS = _ls.monthNames;
  }
} catch (_lsErr) {}

// ── 4. Seed preloaded content map ─────────────────────────────────
JE_PRELOAD.forEach(function(p, i) {
  if (p && entries[i]) {
    loadedContent.set(entries[i].path, p);
    entries[i].title   = p.title;
    entries[i].snippet = p.snippet;
    entries[i].imgRef  = p.imgRef;
  }
});

// ── 5. Element refs ───────────────────────────────────────────────
var list       = document.getElementById("je-list");
var dateCtx    = document.getElementById("je-date-ctx");
var filterBar  = document.getElementById("je-filter-bar");
var filterInp  = document.getElementById("je-filter-input");
var settingsEl = document.getElementById("je-settings");
var bgInd      = document.getElementById("je-bg-ind");

// ── 6. Lua→JS content delivery bridge ────────────────────────────
window.parent.__jeDeliverContent = function(path, rawMarkdown) {
  var info = parseMarkdown(rawMarkdown);
  loadedContent.set(path, info);
  idbCachedPaths.delete(path); // now fresh — no longer stale IDB data
  _dbPut(path, info);

  // Update master entry objects
  var updateArr = function(arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].path === path) {
        arr[i].title   = info.title;
        arr[i].snippet = info.snippet;
        arr[i].imgRef  = info.imgRef;
        break;
      }
    }
  };
  updateArr(entries);
  updateArr(filteredEntries);

  // Paint any visible tile
  var tiles = list.querySelectorAll(".je-tile");
  for (var ti = 0; ti < tiles.length; ti++) {
    if (tiles[ti].dataset.path === path) {
      applyContentToTile(tiles[ti], info);
      tiles[ti].dataset.loaded = "1";
      break;
    }
  }

  // Advance background queue
  if (bgPending.has(path)) {
    bgPending.delete(path);
    if (bgQueue.length > 0) {
      setTimeout(bgNext, 80);
    } else if (bgPending.size === 0) {
      if (bgInd) bgInd.classList.remove("je-bg-active");
    }
  }
};

// ── 7. Lightweight active-tile updater (no redraw, no scroll reset)
window.parent.__jeSetActivePage = function(path) {
  currentOpenPath = path;
  setOpenTile(path);
};

// ── 8. Utilities ──────────────────────────────────────────────────
function monthYear(e) { return MONTHS[e.month - 1] + " " + e.year; }
function monthAbbr(e) { return (MONTHS[e.month - 1] || "").substring(0, 3).toUpperCase(); }

function esc(s) {
  return String(s || "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function resolveImgUrl(ref, pagePath) {
  if (!ref) return "";
  var r = ref.split("|")[0].trim();
  if (r.startsWith("http://") || r.startsWith("https://")) return r;
  var isAbs = r.startsWith("/") || r.includes("/");
  var fullPath = isAbs ? (r.startsWith("/") ? r.substring(1) : r)
                       : ((pagePath.includes("/") ? pagePath.substring(0, pagePath.lastIndexOf("/") + 1) : "") + r);
  return "/.fs/" + fullPath.split("/").map(encodeURIComponent).join("/");
}

function isToday(e) {
  var n = new Date();
  return e.year === n.getFullYear() && e.month === n.getMonth() + 1 && e.day === n.getDate();
}

function placeholderSVG() {
  return '<svg class="je-ph" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">'
    + '<rect width="50" height="50" rx="5" fill="var(--je-tile-bg)"/>'
    + '<line x1="11" y1="18" x2="39" y2="18" stroke="var(--je-border)" stroke-width="1.5" stroke-linecap="round"/>'
    + '<line x1="11" y1="25" x2="39" y2="25" stroke="var(--je-border)" stroke-width="1.5" stroke-linecap="round"/>'
    + '<line x1="11" y1="32" x2="28" y2="32" stroke="var(--je-border)" stroke-width="1.5" stroke-linecap="round"/>'
    + '</svg>';
}

// ── 9. Markdown parser ────────────────────────────────────────────
function parseMarkdown(text) {
  var body = text;
  var fmMatch = body.match(/^---[\s\S]*?\n---\n/);
  if (fmMatch) body = body.slice(fmMatch[0].length);
  var lines = body.split("\n");
  var title = "", snippetParts = [], imgRef = null, titleDone = false;
  for (var li = 0; li < lines.length; li++) {
    var t = lines[li].trim();
    if (!t) continue;
    if (!titleDone) { title = t.replace(/^#+\s+/, ""); titleDone = true; }
    else if (!t.startsWith("#") && snippetParts.join(" ").length < 150) snippetParts.push(t);
  }
  var snippet = snippetParts.join(" ");
  if (snippet.length > 130) snippet = snippet.slice(0, 127) + "\u2026";
  var wOpen = "![[", wClose = "]" + "]";
  var wStart = text.indexOf(wOpen);
  if (wStart !== -1) {
    var wEnd = text.indexOf(wClose, wStart + 3);
    if (wEnd !== -1) imgRef = text.slice(wStart + 3, wEnd).split("|")[0].trim();
  }
  if (!imgRef) { var mi = text.match(/!\[[^\]].."]]"..[==[*\]\(([^)]+)\)/); if (mi) imgRef = mi[1].trim(); }
  return { title: title, snippet: snippet, imgRef: imgRef };
}

// ── 10. Open tile highlight ───────────────────────────────────────
function setOpenTile(path) {
  list.querySelectorAll(".je-tile-open").forEach(function(t) { t.classList.remove("je-tile-open"); });
  currentOpenPath = path;
  if (path) {
    list.querySelectorAll(".je-tile").forEach(function(t) {
      if (t.dataset.path === path) t.classList.add("je-tile-open");
    });
  }
}

// ── 11. Tile DOM builder ──────────────────────────────────────────
function buildContentHTML(entry) {
  var t = '<div class="je-title' + (entry.title !== undefined ? "" : " je-sk") + '">'
    + (entry.title !== undefined ? esc(entry.title || "(no title)") : "") + "</div>";
  var s = "";
  if (SHOW_SNIP) {
    s = '<div class="je-snip' + (entry.title !== undefined ? "" : " je-sk") + '">'
      + (entry.snippet !== undefined ? esc(entry.snippet || "") : "") + "</div>";
  }
  return t + s;
}

function buildThumbHTML(entry) {
  if (!SHOW_THUMB) return "";
  if (entry.imgRef) {
    var url = resolveImgUrl(entry.imgRef, entry.path);
    return '<img src="' + esc(url) + '" alt="" loading="lazy" onerror="this.parentElement.innerHTML=window._JE_PH()">';
  }
  if (entry.title !== undefined) return placeholderSVG();
  return '<div class="je-thumb-sk"></div>';
}
window._JE_PH = placeholderSVG;

function createTile(entry, globalIdx) {
  var today = isToday(entry);
  var tile = document.createElement("div");
  tile.className = "je-tile" + (today ? " je-tile-today" : "") + (entry.path === currentOpenPath ? " je-tile-open" : "");
  tile.dataset.path      = entry.path;
  tile.dataset.idx       = String(globalIdx);
  tile.dataset.monthYear = monthYear(entry);
  tile.dataset.loaded    = entry.title !== undefined ? "1" : "0";

  // Calendar icon — 3 rows: month abbrev / day / weekday abbrev
  var cal = document.createElement("div");
  cal.className = "je-cal" + (today ? " je-cal-today" : "");

  var calTop = document.createElement("div");
  calTop.className   = "je-cal-top";
  calTop.textContent = monthAbbr(entry);

  var calNum = document.createElement("div");
  calNum.className   = "je-cal-num";
  calNum.textContent = String(entry.day);

  var calBot = document.createElement("div");
  calBot.className   = "je-cal-bottom";
  calBot.textContent = (entry.dayName || "").substring(0, 3);

  cal.appendChild(calTop);
  cal.appendChild(calNum);
  cal.appendChild(calBot);

  var content = document.createElement("div");
  content.className = "je-content";
  content.innerHTML = buildContentHTML(entry);

  tile.appendChild(cal);
  tile.appendChild(content);

  if (SHOW_THUMB) {
    var thumb = document.createElement("div");
    thumb.className = "je-thumb";
    thumb.innerHTML = buildThumbHTML(entry);
    tile.appendChild(thumb);
  }

  tile.addEventListener("click", function() {
    setOpenTile(entry.path);
    window.parent.dispatchEvent(new CustomEvent("je-navigate", { detail: { path: entry.path } }));
  });
  return tile;
}

// ── 12. Month Separator ───────────────────────────────────────────
function createMonthSeparator(entry) {
  var sep = document.createElement("div");
  sep.className = "je-month-sep";
  sep.dataset.monthYear = monthYear(entry);
  sep.textContent = monthYear(entry);
  return sep;
}


// ── 13. IntersectionObservers ─────────────────────────────────────
// stickyObs uses dataset.sortOrder (assigned sequentially to every DOM item)
// so both tiles and month separators participate correctly.
var visibleSet = new Set();
var stickyObs = new IntersectionObserver(function(io_entries) {
  io_entries.forEach(function(e) {
    if (e.isIntersecting) visibleSet.add(e.target);
    else visibleSet.delete(e.target);
  });
  var minOrder = Infinity, topEl = null;
  visibleSet.forEach(function(el) {
    var o = parseInt(el.dataset.sortOrder || "999999", 10);
    if (o < minOrder) { minOrder = o; topEl = el; }
  });
  if (topEl) dateCtx.textContent = topEl.dataset.monthYear;
}, { root: list, threshold: 0 });

var contentObs = new IntersectionObserver(function(io_entries) {
  io_entries.forEach(function(e) {
    if (e.isIntersecting && e.target.dataset.loaded === "0") {
      e.target.dataset.loaded = "2";
      fetchTileContent(e.target);
    }
  });
}, { root: list, rootMargin: "400px 0px 400px 0px", threshold: 0 });

var sentinelObs = new IntersectionObserver(function(io_entries) {
  io_entries.forEach(function(e) {
    if (e.isIntersecting) {
      sentinelObs.unobserve(e.target);
      e.target.remove();
      renderBatch(renderedCount);
    }
  });
}, { root: list, rootMargin: "250px 0px 0px 0px", threshold: 0 });

// ── 14. Content fetcher ───────────────────────────────────────────
function fetchTileContent(tile) {
  var path = tile.dataset.path;
  if (loadedContent.has(path)) {
    applyContentToTile(tile, loadedContent.get(path));
    tile.dataset.loaded = "1";
    return;
  }
  tile.dataset.loaded = "2";
  window.parent.dispatchEvent(new CustomEvent("je-fetch-page", { detail: { path: path } }));
}

function applyContentToTile(tile, info) {
  var fakeEntry = { title: info.title, snippet: info.snippet, imgRef: info.imgRef, path: tile.dataset.path };
  var content = tile.querySelector(".je-content");
  if (content) content.innerHTML = buildContentHTML(fakeEntry);
  if (SHOW_THUMB) {
    var thumb = tile.querySelector(".je-thumb");
    if (thumb) thumb.innerHTML = buildThumbHTML(fakeEntry);
  }
}

// ── 15. Background indexer ────────────────────────────────────────
// Silently fetches all entries not yet in loadedContent, one at a time
// with a small delay, storing results in IndexedDB for instant search
// on subsequent page loads.
function bgStart() {
  bgQueue = entries
    .filter(function(e) {
      // Re-fetch if not loaded at all, or if only loaded from (potentially stale) IDB cache
      return (!loadedContent.has(e.path) || idbCachedPaths.has(e.path)) && !bgPending.has(e.path);
    })
    .map(function(e) { return e.path; });
  if (bgQueue.length === 0) return;
  if (bgInd) bgInd.classList.add("je-bg-active");
  bgNext();
}

function bgNext() {
  // Skip entries already freshly loaded (not just IDB-cached, which still need re-fetch)
  while (bgQueue.length > 0 && loadedContent.has(bgQueue[0]) && !idbCachedPaths.has(bgQueue[0])) bgQueue.shift();
  if (bgQueue.length === 0) {
    if (bgPending.size === 0 && bgInd) bgInd.classList.remove("je-bg-active");
    return;
  }
  var path = bgQueue.shift();
  bgPending.add(path);
  window.parent.dispatchEvent(new CustomEvent("je-fetch-page", { detail: { path: path } }));
}

// ── 16. Batch renderer ────────────────────────────────────────────
function renderBatch(fromIdx) {
  if (fromIdx >= filteredEntries.length) return;
  var toIdx = Math.min(fromIdx + BATCH_SIZE, filteredEntries.length);
  var frag  = document.createDocumentFragment();

  for (var i = fromIdx; i < toIdx; i++) {
    var entry = filteredEntries[i];

    // Merge cached content if available
    if (entry.title === undefined && loadedContent.has(entry.path)) {
      var cached = loadedContent.get(entry.path);
      entry.title = cached.title; entry.snippet = cached.snippet; entry.imgRef = cached.imgRef;
    }

    // Month separator when month changes (never before the very first item)
    var entryMY = monthYear(entry);
    if (lastRenderedMonth !== null && entryMY !== lastRenderedMonth) {
      var sep = createMonthSeparator(entry);
      sep.dataset.sortOrder = String(listItemCounter++);
      stickyObs.observe(sep);
      frag.appendChild(sep);
    }
    lastRenderedMonth = entryMY;

    var tile = createTile(entry, i);
    tile.dataset.sortOrder = String(listItemCounter++);
    stickyObs.observe(tile);
    contentObs.observe(tile);
    frag.appendChild(tile);
  }

  // Append sentinel or end marker
  if (toIdx < filteredEntries.length) {
    var sentinel = document.createElement("div");
    sentinel.className = "je-sentinel";
    frag.appendChild(sentinel);
    requestAnimationFrame(function() { sentinelObs.observe(sentinel); });
  } else if (toIdx > 0) {
    var end = document.createElement("div");
    end.className = "je-end";
    end.textContent = "\u2014 " + filteredEntries.length + " entr" + (filteredEntries.length === 1 ? "y" : "ies") + " \u2014";
    frag.appendChild(end);
  }

  list.appendChild(frag);
  renderedCount = toIdx;
}

// ── 17. Multi-word filter ─────────────────────────────────────────
// Splits the query by whitespace; all terms must match (AND logic).
// Searches path, title, and snippet of every entry in loadedContent.
function applyFilter(query) {
  var raw = (query || "").toLowerCase().trim();
  if (!raw) { filteredEntries = entries.slice(); return; }
  var terms = raw.split(/\s+/).filter(Boolean);
  filteredEntries = entries.filter(function(e) {
    return terms.every(function(term) {
      if (e.path.toLowerCase().indexOf(term) !== -1) return true;
      var c = loadedContent.get(e.path);
      if (c) {
        if ((c.title   || "").toLowerCase().indexOf(term) !== -1) return true;
        if ((c.snippet || "").toLowerCase().indexOf(term) !== -1) return true;
      }
      return false;
    });
  });
}

// ── 18. Full re-render ─────────────────────────────────────────────
function rerender() {
  list.querySelectorAll(".je-tile").forEach(function(t) {
    stickyObs.unobserve(t); contentObs.unobserve(t);
  });
  list.querySelectorAll(".je-month-sep").forEach(function(t) { stickyObs.unobserve(t); });
  list.querySelectorAll(".je-sentinel").forEach(function(t) { sentinelObs.unobserve(t); });
  visibleSet.clear();
  list.innerHTML = "";
  renderedCount     = 0;
  lastRenderedMonth = null;
  listItemCounter   = 0;

  if (filteredEntries.length === 0) {
    list.innerHTML = '<div class="je-empty">No journal entries found.</div>';
    dateCtx.textContent = "No Entries";
    return;
  }
  dateCtx.textContent = monthYear(filteredEntries[0]);
  renderBatch(0);
}

// ── 19. Sort ──────────────────────────────────────────────────────
function setSort(asc) {
  sortAsc = asc;
  entries.sort(function(a, b) { return asc ? a.sortKey - b.sortKey : b.sortKey - a.sortKey; });
  var btn = document.getElementById("je-sort-btn");
  btn.dataset.asc = asc ? "1" : "0";
  btn.title = asc ? "Sort: Oldest First" : "Sort: Newest First";
  var icon = btn.querySelector("svg");
  if (icon) {
    icon.innerHTML = asc
      ? '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="8" y2="18"/><polyline points="17 15 20 18 17 21"/>'
      : '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="8" y2="18"/><polyline points="17 21 20 18 17 15"/>';
  }
  applyFilter(filterInp.value);
  rerender();
}

// ── 20. Settings helpers ──────────────────────────────────────────
function openSettings() {
  settingsEl.classList.toggle("je-settings-open");
  var g = function(id) { return document.getElementById(id); };
  // Soft (UI-saved) values from localStorage — only used for non-locked fields.
  var soft = {};
  try { var _lsS = localStorage.getItem("journalExplorer.settings"); if (_lsS) soft = JSON.parse(_lsS); } catch (_e) {}

  // Hard (Lua-locked) keys always show the space-lua authoritative value from JE_CONFIG.
  // Soft keys use localStorage if available, falling back to JE_CONFIG.
  g("je-s-pattern").value = LOCKED.journalPathPattern
    ? JE_CONFIG.journalPathPattern
    : (soft.journalPathPattern || JE_CONFIG.journalPathPattern || "");
  g("je-s-pos").value     = LOCKED.position
    ? JE_CONFIG.position
    : (soft.position || JE_CONFIG.position || "lhs");
  g("je-s-batch").value   = LOCKED.batchSize
    ? String(JE_CONFIG.batchSize || 20)
    : String(soft.batchSize || JE_CONFIG.batchSize || 20);
  g("je-s-thumb").checked = LOCKED.showThumbnails
    ? (JE_CONFIG.showThumbnails !== false)
    : (soft.showThumbnails !== undefined ? soft.showThumbnails !== false : JE_CONFIG.showThumbnails !== false);
  g("je-s-snip").checked  = LOCKED.showSnippets
    ? (JE_CONFIG.showSnippets !== false)
    : (soft.showSnippets !== undefined ? soft.showSnippets !== false : JE_CONFIG.showSnippets !== false);
  g("je-s-months").value  = LOCKED.monthNames
    ? (JE_CONFIG.monthNames || []).join(", ")
    : (soft.monthNames || JE_CONFIG.monthNames || []).join(", ");
  g("je-s-days").value    = LOCKED.dayNames
    ? (JE_CONFIG.dayNames || []).join(", ")
    : (soft.dayNames || JE_CONFIG.dayNames || []).join(", ");

  // Apply locked state for keys controlled by space-lua config
  var lockDefs = [
    { id: "je-s-pattern", key: "journalPathPattern" },
    { id: "je-s-pos",     key: "position" },
    { id: "je-s-batch",   key: "batchSize" },
    { id: "je-s-months",  key: "monthNames" },
    { id: "je-s-days",    key: "dayNames" },
    { id: "je-s-thumb",   key: "showThumbnails", labelId: "je-s-thumb-lbl" },
    { id: "je-s-snip",    key: "showSnippets",   labelId: "je-s-snip-lbl"  },
  ];
  var hasLocked = false;
  lockDefs.forEach(function(lf) {
    var input  = g(lf.id);
    var label  = lf.labelId ? g(lf.labelId) : (input && input.closest(".je-s-group") && input.closest(".je-s-group").querySelector("label"));
    if (!input) return;
    var isLocked = LOCKED[lf.key];
    input.disabled = !!isLocked;
    if (isLocked) {
      hasLocked = true;
      if (label && !label.querySelector(".je-lock-badge")) {
        var badge = document.createElement("span");
        badge.className = "je-lock-badge";
        badge.textContent = " \uD83D\uDD12";
        badge.title = "Locked by space-lua config — change there to override";
        label.appendChild(badge);
      }
    }
  });
  // Show a note if any field is locked
  var noteEl = g("je-s-lock-note");
  if (hasLocked && !noteEl) {
    var note = document.createElement("div");
    note.id = "je-s-lock-note";
    note.className = "je-s-lock-note";
    note.textContent = "\uD83D\uDD12 Some fields are locked because they are set in your space-lua config block. Edit that block to change them.";
    settingsEl.querySelector(".je-s-body").insertBefore(note, settingsEl.querySelector(".je-s-body").firstChild);
  }
}

function closeSettings() { settingsEl.classList.remove("je-settings-open"); }

function saveSettings() {
  var g = function(id) { return document.getElementById(id); };
  var splitTrim = function(s) { return s.split(",").map(function(x) { return x.trim(); }).filter(Boolean); };

  // Only collect soft (non-locked) settings — hard (Lua-locked) keys are excluded entirely.
  // They must never be sent to the Lua handler or stored in localStorage, because doing so
  // would make loadConfig() think the UI set them and strip the lock.
  var newSettings = {};
  if (!LOCKED.journalPathPattern) newSettings.journalPathPattern = g("je-s-pattern").value.trim();
  if (!LOCKED.position)           newSettings.position           = g("je-s-pos").value;
  if (!LOCKED.batchSize)          newSettings.batchSize          = parseInt(g("je-s-batch").value, 10) || 20;
  if (!LOCKED.showThumbnails)     newSettings.showThumbnails     = g("je-s-thumb").checked;
  if (!LOCKED.showSnippets)       newSettings.showSnippets       = g("je-s-snip").checked;
  if (!LOCKED.monthNames)         newSettings.monthNames         = splitTrim(g("je-s-months").value);
  if (!LOCKED.dayNames)           newSettings.dayNames           = splitTrim(g("je-s-days").value);

  try { localStorage.setItem("journalExplorer.settings", JSON.stringify(newSettings)); } catch (_e) {}
  window.parent.dispatchEvent(new CustomEvent("je-settings-save", { detail: newSettings }));
  closeSettings();
}

// ── 21. Toolbar wiring ────────────────────────────────────────────
document.getElementById("je-new-btn").onclick = function() {
  var n = new Date();
  window.parent.dispatchEvent(new CustomEvent("je-navigate", { detail: {
    path: "__new__", year: n.getFullYear(), month: n.getMonth() + 1,
    day: n.getDate(), wday: n.getDay(), hour: n.getHours(),
    minute: n.getMinutes(), second: n.getSeconds(),
  }}));
};
document.getElementById("je-refresh-btn").onclick = function() {
  window.parent.dispatchEvent(new CustomEvent("je-navigate", { detail: { path: "__refresh__" } }));
};
document.getElementById("je-sort-btn").onclick = function() { setSort(!sortAsc); };
document.getElementById("je-filter-btn").onclick = function() {
  filterActive = !filterActive;
  filterBar.style.display = filterActive ? "flex" : "none";
  document.getElementById("je-filter-btn").classList.toggle("je-btn-active", filterActive);
  if (filterActive) { filterInp.focus(); }
  else { filterInp.value = ""; applyFilter(""); rerender(); }
};
document.getElementById("je-filter-clear-btn").onclick = function() {
  filterInp.value = ""; applyFilter(""); rerender();
};
filterInp.addEventListener("input", function(e) {
  clearTimeout(filterInp._t);
  var val = e.target.value;
  filterInp._t = setTimeout(function() { applyFilter(val); rerender(); }, 280);
});
document.getElementById("je-settings-btn").onclick = openSettings;
document.getElementById("je-s-apply-btn").onclick   = saveSettings;
document.getElementById("je-s-close-btn").onclick   = closeSettings;
document.getElementById("je-close-btn").onclick = function() {
  window.parent.dispatchEvent(new CustomEvent("je-close", {}));
};

// ── 22. Boot: load IDB cache → render → start background index ────
var _idbReady = false;
var _idbTimer = setTimeout(function() {
  if (!_idbReady) { _idbReady = true; rerender(); setTimeout(bgStart, 1200); }
}, 600);

_openDB(function(db) {
  _dbGet(function(cache) {
    clearTimeout(_idbTimer);
    if (_idbReady) return; // timeout already fired
    _idbReady = true;
    // Seed loadedContent from IDB cache (don't overwrite preloaded data)
    Object.keys(cache).forEach(function(path) {
      if (!loadedContent.has(path)) {
        var item = cache[path];
        loadedContent.set(path, item);
        idbCachedPaths.add(path); // mark as stale — bgStart will re-fetch to detect edits
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].path === path && entries[i].title === undefined) {
            entries[i].title   = item.title;
            entries[i].snippet = item.snippet;
            entries[i].imgRef  = item.imgRef;
            break;
          }
        }
      }
    });
    rerender();
    setTimeout(bgStart, 1200);
  });
});

})(); 
]==]

-- ── Draw Panel ────────────────────────────────────────────────────
local LAST_PANEL_ID = nil

local function drawJournalPanel()
  local oldPanelId = CFG.PANEL_ID
  CFG = loadConfig()

  -- ✅ ONLY hide panel if position actually changed
  if LAST_PANEL_ID and LAST_PANEL_ID ~= CFG.PANEL_ID then
    editor.hidePanel(LAST_PANEL_ID)
  end

  LAST_PANEL_ID = CFG.PANEL_ID

  local entries  = buildEntryList()
  local preload  = {}
  local batchEnd = math.min(CFG.BATCH, #entries)
  for i = 1, batchEnd do
    local raw = space.readPage(entries[i].path)
    if raw then
      local title, snippet, imgRef = extractInfo(raw)
      table.insert(preload, { title = title, snippet = snippet, imgRef = imgRef })
    else
      table.insert(preload, { title = "", snippet = "", imgRef = nil })
    end
  end

  -- ── Serialise entries ─────────────────────────────────────────
  local entryItems = {}
  for _, e in ipairs(entries) do
    local item = '{"path":"' .. jesc(e.path) .. '"'
    item = item .. ',"year":'    .. tostring(e.year)
    item = item .. ',"month":'   .. tostring(e.month)
    item = item .. ',"day":'     .. tostring(e.day)
    item = item .. ',"dayName":"' .. jesc(e.dayName) .. '"'
    item = item .. ',"sortKey":' .. tostring(e.sortKey) .. '}'
    table.insert(entryItems, item)
  end
  local entriesJson = "[" .. table.concat(entryItems, ",") .. "]"

  -- ── Serialise preload ─────────────────────────────────────────
  local preloadItems = {}
  for _, p in ipairs(preload) do
    local imgVal = p.imgRef and ('"' .. jesc(p.imgRef) .. '"') or "null"
    local item = '{"title":"' .. jesc(p.title) .. '"'
    item = item .. ',"snippet":"' .. jesc(p.snippet) .. '"'
    item = item .. ',"imgRef":' .. imgVal .. '}'
    table.insert(preloadItems, item)
  end
  local preloadJson = "[" .. table.concat(preloadItems, ",") .. "]"

  -- ── Serialise config + locked map ────────────────────────────
  local quotedMonths, quotedDays = {}, {}
  for _, mn in ipairs(CFG.MONTHS) do table.insert(quotedMonths, '"' .. jesc(mn) .. '"') end
  for _, dn in ipairs(CFG.DAYS)   do table.insert(quotedDays,   '"' .. jesc(dn) .. '"') end

  local lockedParts = {}
  for k, v in pairs(CFG.LOCKED) do
    table.insert(lockedParts, '"' .. jesc(k) .. '":' .. (v and "true" or "false"))
  end

  local configJson = '{"journalPathPattern":"' .. jesc(CFG.PATTERN) .. '"'
  configJson = configJson .. ',"position":"'    .. CFG.PANEL_ID .. '"'
  configJson = configJson .. ',"batchSize":'    .. tostring(CFG.BATCH)
  configJson = configJson .. ',"showThumbnails":' .. jbool(CFG.THUMBS)
  configJson = configJson .. ',"showSnippets":'   .. jbool(CFG.SNIPPETS)
  configJson = configJson .. ',"monthNames":['  .. table.concat(quotedMonths, ",") .. ']'
  configJson = configJson .. ',"dayNames":['    .. table.concat(quotedDays,   ",") .. ']'
  configJson = configJson .. ',"locked":{'      .. table.concat(lockedParts,  ",") .. '}}'

  local scriptParts = {
    "const JE_VERSION = " .. tostring(os.time()) .. ";", -- keep forced refresh
    "const JE_ENTRIES = " .. entriesJson .. ";",
    "const JE_PRELOAD = " .. preloadJson .. ";",
    "const JE_CONFIG  = " .. configJson  .. ";",
    MAIN_JS,
  }

  editor.showPanel(CFG.PANEL_ID, CFG.WIDTH, buildHtml(), table.concat(scriptParts, "\n"))

  PANEL_VISIBLE = true
  clientStore.set("journalExplorer.open", "true")
end

-- ── Content fetch bridge ──────────────────────────────────────────
js.window.addEventListener("je-fetch-page", function(e)
  local path = e.detail.path
  local raw  = space.readPage(path)
  if js.window.__jeDeliverContent then
    js.window.__jeDeliverContent(path, raw or "")
  end
end)

-- ── Navigation bridge ─────────────────────────────────────────────
js.window.addEventListener("je-navigate", function(e)
  local detail = e.detail
  local path   = detail.path
  if path == "__refresh__" then
    drawJournalPanel()
  elseif path == "__new__" then
    local y   = tonumber(detail.year)   or 2024
    local m   = tonumber(detail.month)  or 1
    local d   = tonumber(detail.day)    or 1
    local wd  = tonumber(detail.wday)   or 1
    local h   = tonumber(detail.hour)   or 0
    local mn  = tonumber(detail.minute) or 0
    local sec = tonumber(detail.second) or 0
    local newPath = buildPathFromDate(CFG.PATTERN, y, m, d, wd, h, mn, sec, CFG.MONTHS, CFG.DAYS)
    editor.navigate(newPath)
    drawJournalPanel()
  else
    -- Navigate without resetting the panel scroll position.
    -- The JS __jeSetActivePage callback updates the active tile highlight only.
    editor.navigate(path)
    if js.window.__jeSetActivePage then
      js.window.__jeSetActivePage(path)
    end
  end
end)

-- ── Close bridge ─────────────────────────────────────────────────
js.window.addEventListener("je-close", function(e)
  editor.hidePanel(CFG.PANEL_ID)
  PANEL_VISIBLE = false
  clientStore.set("journalExplorer.open", "false")
end)

-- ── Settings save bridge ──────────────────────────────────────────
js.window.addEventListener("je-settings-save", function(e)
  local d = e.detail

  -- UI writes exclusively to clientStore — NEVER to config.set().
  -- This keeps config.get() exclusively owned by space-lua so that
  -- lock detection remains a simple nil-check (FloatingJournalCalendar pattern).
  -- Locked keys are absent from `d` (stripped by JS saveSettings), so the
  -- nil guards below also ensure we never accidentally overwrite a hard setting.
  if d.position           ~= nil then clientStore.set("journalExplorer.position",       tostring(d.position)) end
  if d.journalPathPattern ~= nil then clientStore.set("journalExplorer.pattern",        tostring(d.journalPathPattern)) end
  if d.batchSize          ~= nil then clientStore.set("journalExplorer.batchSize",      tostring(d.batchSize)) end
  if d.showThumbnails     ~= nil then clientStore.set("journalExplorer.showThumbnails", (d.showThumbnails ~= false) and "true" or "false") end
  if d.showSnippets       ~= nil then clientStore.set("journalExplorer.showSnippets",   (d.showSnippets  ~= false) and "true" or "false") end

  local months = {}
  if d.monthNames then for _, v in ipairs(d.monthNames) do table.insert(months, tostring(v)) end end
  if #months > 0 then clientStore.set("journalExplorer.monthNames", table.concat(months, ",")) end

  local days = {}
  if d.dayNames then for _, v in ipairs(d.dayNames) do table.insert(days, tostring(v)) end end
  if #days > 0 then clientStore.set("journalExplorer.dayNames", table.concat(days, ",")) end

  drawJournalPanel()
end)

-- ── Page-load listener — lightweight, never resets scroll ─────────
-- A full redraw is only triggered by explicit user actions (Refresh,
-- New Entry, Settings apply). This listener's sole job is to update
-- the active tile highlight if the panel is open.
event.listen {
  name = "editor:pageLoaded",
  run  = function()
    -- No-op intentionally: scroll position is preserved.
    -- Active tile updates happen directly in the je-navigate handler.
  end
}

-- ── Commands ──────────────────────────────────────────────────────
command.define {
  name = "Journal: Open Explorer",
  run  = function() drawJournalPanel() end
}

command.define {
  name = "Journal: Toggle Explorer",
  key  = "Ctrl-Alt-j",
  run  = function()
    if PANEL_VISIBLE then
      editor.hidePanel(CFG.PANEL_ID)
      PANEL_VISIBLE = false
      clientStore.set("journalExplorer.open", "false")
    else
      drawJournalPanel()
    end
  end
}

```