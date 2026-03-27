---
name: "Library/Mr-xRed/FloatingJournalCalendar"
tags: meta/library
pageDecoration.prefix: "🗓️ "
---

# Floating Journal Calendar & Page Navigation

The **Floating Journal Calendar** is a lightweight, interactive navigation tool for SilverBullet. It provides a sleek, floating interface that allows users to quickly browse their journal entries. By scanning existing pages against a customizable date pattern, it visually identifies days with active entries, enabling seamless one-click navigation through personal history.


![JournalCalendar](https://raw.githubusercontent.com/Mr-xRed/silverbullet-libraries/refs/heads/main/screenshots/JournalCalendar.png)

## **Main Features**

### **📅 Visual Journaling**

- **Activity Indicators:** Automatically scans your space and places a distinct dot on days that already have a journal entry.
- **Instant Navigation:** Click any date to immediately navigate to that specific journal page.
- **Drag&Drop**: Drag the day to add the Journal WikiLink to the page
- **Smart Date Logic:** Highlights “Today”

### **✨ Enhanced User Interface**

- **Dynamic Theming:** Built-in support for both **Dark** and **Light**.
- **Draggable & Snappable:** A “grab-and-go” header allows you to move the calendar anywhere. It features **edge-snapping** and **viewport clamping** to ensure it never gets lost off-screen.
- **Persistent Positioning:** Remembers its last location on your screen across sessions, so it stays exactly where you’ve put it.
- **Quick Jump:** Includes a “Today & Refresh” button `↺` to instantly return to the current month and year from anywhere in the calendar and refresh the dot’s
- **Overflow Days:** First and last days of adjacent months shown subtly in partial weeks.
- **Week Numbers:** Optional week number column — click a week number to open your weekly note.

- Added `Cmd/Ctrl + Click` to convert the selected text to a piped WikiLink
  e.g: `[[Journal/2024/05/2024-05-20_Mon|Selected Text]]`

### **⚙️ Customizable**

- **Flexible Path Patterns:** Configure your journal file structure and weekly notes path (with `#weeknum#`, `#weekyear#` placeholders).
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
  weekNumberSystem = "iso"   -- "iso" | "us" | "simple"
})    
```

> **note** Note
> Copy this into a `space-lua` block on your config page to change default values.
> 
> **Week numbering systems:**
> 
>  - `"iso"` — ISO 8601: week starts Monday, Week 1 = first week containing a Thursday. Week-year may differ from calendar year for days near Jan 1.
>  - `"us"` — North American: week starts Sunday, Week 1 = week containing Jan 1. Week-year always equals calendar year.
>  - `"simple"` — Plain count: Week 1 = Jan 1–7, Week 2 = Jan 8–14, etc. Week-year always equals calendar year.

## Floating Journal Calendar Intergation

```space-style
/* priority: 1000 */
body.sb-dragging-active { user-select: none !important; -webkit-user-select: none !important; }
        
#sb-journal-root {
    position: fixed;
    width: 300px;
    z-index: 100;
    font-family: system-ui, sans-serif;
    user-select: none;
    touch-action: none;
    transform-origin: 92% 8%;
    will-change: transform, opacity;
}

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
}

html[data-theme="light"] #sb-journal-root {
    --jc-background: var(--top-background-color);
    --jc-border-color: oklch(from var(--modal-border-color) 0.65 c h / 0.5);
    --jc-elements-background: oklch(0.75 0 0 / 0.2);
    --jc-hover-background: oklch(0.75 0 0 / 0.6);
    --jc-text-color: var(--root-color);
    --jc-accent-color: var(--ui-accent-color);
    --jc-outline-color: black;
}

.jc-card {
    background: var(--jc-background);
    color: var(--jc-text-color);
    border-radius: 8px;
    border: 1px solid var(--jc-border-color);
    box-shadow: 0px 4px 15px 0 oklch(0 0 0 / 0.5);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    cursor: grab;
}

.jc-header {
    padding: 6px 8px;
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
}

.jc-nav-btn,
.jc-close,
.jc-today-btn {
    background: var(--jc-elements-background);
    color: var(--jc-text-color);
    border: 1px solid var(--jc-border-color);
    border-radius: 6px;
    padding: 2px 6px;
    cursor: pointer;
    font-size: 0.85em;
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
}

.jc-select option {
    background: var(--modal-help-background-color);
}

.jc-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    padding: 6px;
    position: relative;
}

.jc-lbl {
    font-size: 0.7em;
    opacity: 0.6;
    text-align: center;
    font-weight: bold;
}

.jc-lbl.sun {
    color: oklch(0.65 0.18 30);
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
    color: oklch(0.6 0.2 30);
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
    gap: 2px;
    position: absolute;
    bottom: 5px;
    justify-content: center;
    width: 100%;
}

.jc-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    box-shadow: 1px 1px 2px oklch(0 0 0 / 0.5);
}

.jc-dot.green  { background: oklch(0.6 0.18 145); }
.jc-dot.yellow { background: oklch(0.95 0.18 95); }
.jc-dot.orange { background: oklch(0.8 0.20 55); }
.jc-dot.red    { background: oklch(0.6 0.2 10); }

.jc-day.sun .jc-dot.red {
    box-shadow: 0 0 0 1px white;
}
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
    weekNumberSystem       = schema.string()
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
      #sb-journal-root.ctrl-active .jc-day { cursor: copy !important; }
    </style>
    <div class="jc-card" id="jc-draggable">
        <div class="jc-header" id="jc-handle">
            <button class="jc-nav-btn" id="jc-prev">‹</button>
            <div class="jc-selectors">
                <select id="jc-month" class="jc-select"></select>
                <select id="jc-year"  class="jc-select"></select>
                <button class="jc-today-btn" id="jc-today" title="Jump to Today & Refresh">↺</button>
            </div>
            <button class="jc-nav-btn" id="jc-next">›</button>
            <button class="jc-close"   id="jc-close-btn">✕</button>
        </div>
        <div class="jc-grid" id="jc-labels"></div>
        <div class="jc-grid" id="jc-days"></div>
    </div>
    ]]

    js.window.document.body.appendChild(container)

    local scriptEl = js.window.document.createElement("script")
    scriptEl.innerHTML = [[
    (function() {
        const session          = "]]..sessionID..[[";
        const months           = ]]..month_names..[[;
        const days             = ]]..day_names..[[;
        const weekStartsSunday = ]]..tostring(week_starts_sunday)..[[;
        const showWeekNumbers  = ]]..tostring(show_week_numbers)..[[;
        const weekNumSystem    = "]]..week_number_system..[[";
        const weeklyPattern    = "]]..weekly_path_pattern..[[";
        let   existing         = ]]..existing_pages_json..[[;
        const pattern          = "]]..path_pattern..[[";
        const root             = document.getElementById("sb-journal-root");

        const SNAP       = 15;
        const TOP_OFFSET = 65;
        let vDate = new Date();

        window.addEventListener("keydown", (e) => { if (e.ctrlKey || e.metaKey) root.classList.add("ctrl-active"); });
        window.addEventListener("keyup",   (e) => { if (!e.ctrlKey && !e.metaKey) root.classList.remove("ctrl-active"); });

        function clamp() {
            const rect = root.getBoundingClientRect();
            let left = rect.left, top = rect.top;
            if (left < 0) left = 0;
            if (top < TOP_OFFSET) top = TOP_OFFSET;
            if (left + rect.width  > window.innerWidth)  left = window.innerWidth  - rect.width;
            if (top  + rect.height > window.innerHeight) top  = window.innerHeight - rect.height;
            root.style.left  = left + "px";
            root.style.top   = top  + "px";
            root.style.right = "auto";
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
            const { week, weekYear } = getWeekInfo(wkDate);
            return weeklyPattern
                .replace(/#weeknum#/g,  String(week).padStart(2, '0'))
                .replace(/#weeknumraw#/g, String(week))
                .replace(/#weekyear#/g, weekYear)
                .replace(/#year#/g,     wkDate.getFullYear())
                .replace(/#month#/g,    String(wkDate.getMonth() + 1).padStart(2, '0'));
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
            const gap      = 2;

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
            svg.style.cssText = "position:absolute;top:0;left:0;pointer-events:none;overflow:visible;z-index:1";

            const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
            pathEl.setAttribute("d",               roundedPath(pts, 5));
            pathEl.setAttribute("fill",            "none");
            pathEl.setAttribute("stroke",          "var(--jc-outline-color)");
            pathEl.setAttribute("stroke-width",    "1.5");
            pathEl.setAttribute("stroke-linejoin", "round");
            pathEl.setAttribute("opacity",         "0.75");
            svg.appendChild(pathEl);
            grid.appendChild(svg);
        }
        // ─────────────────────────────────────────────────────────────────────

        function render() {
            const y   = vDate.getFullYear(), m = vDate.getMonth();
            const now = new Date();

            // Adjust widget width for week number column
            root.style.width = showWeekNumbers ? "330px" : "300px";

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

                    const basePath = pattern
                        .replace(/#year#/g,      y)
                        .replace(/#month#/g,     String(m + 1).padStart(2, '0'))
                        .replace(/#monthname#/g, months[m])
                        .replace(/#day#/g,       String(dayNum).padStart(2, '0'))
                        .replace(/#weekday#/g,   days[isSun ? 6 : dateObj.getDay() - 1])
                        .replace(/#wildcard#/g,  "");

                    const matchCount = pageNames.filter(name => name.startsWith(basePath)).length;
                    if (matchCount > 0) {
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

                    el.innerHTML += `<span>${dayNum}</span>`;

                    el.onclick = (e) => window.dispatchEvent(new CustomEvent("sb-journal-event", {
                        detail: { action: "navigate", path: basePath, session, ctrlKey: e.ctrlKey, metaKey: e.metaKey }
                    }));
                    el.ondragstart = (e) => {
                        e.dataTransfer.setData("text/plain", "[[" + basePath + "]].."]]"..[[");
                        e.dataTransfer.dropEffect = "copy";
                    };
                    grid.appendChild(el);
                }
            }

            // Draw month contour. Uses offsetLeft/offsetTop (layout, transform-safe).
            drawContour(offset, lastDay);
        }

        window.addEventListener("sb-journal-update", (e) => {
            if (e.detail && e.detail.existing) { existing = e.detail.existing; render(); }
        });

        window.addEventListener("resize", clamp);

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

        const card = document.getElementById("jc-draggable");
        card.onpointerdown = (e) => {
            if (
                e.target.closest("button, select, input, textarea") ||
                e.target.closest(".jc-day:not(.empty):not(.faded)") ||
                e.target.closest(".jc-week-num")
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

        render();
        setTimeout(() => {
            if (root.style.left !== "auto") root.style.right = "auto";
        }, 100);
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

command.define {
    name = "Journal: Floating Calendar",
    run  = function() toggleFloatingJournalCalendar() end
}
```

## Discussion to this library

- [SilverBullet Community](https://community.silverbullet.md/t/sleek-interactive-floating-journal-calendar/3680/6?u=mr.red)
