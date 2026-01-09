---
name: "Library/Mr-xRed/FloatingJournalCalendar"
tags: meta/library
pageDecoration.prefix: "🗓️ "
---
# Floating Journal Calendar & Page Navigation
The **Floating Journal Calendar** is a lightweight, interactive navigation tool for SilverBullet. It provides a sleek, floating interface that allows users to quickly browse their journal entries. By scanning existing pages against a customizable date pattern, it visually identifies days with active entries, enabling seamless one-click navigation through personal history.

![JournalCalendar](https://raw.githubusercontent.com/Mr-xRed/silverbullet-libraries/refs/heads/main/JournalCalendar.png)

## **Main Features**

### **📅 Visual Journaling**
* **Activity Indicators:** Automatically scans your space and places a distinct dot on days that already have a journal entry.
* **Instant Navigation:** Click any date to immediately navigate to that specific journal page.
* **Smart Date Logic:** Highlights "Today"

### **✨ Enhanced User Interface**
* **Dynamic Theming:** Built-in support for both **Dark** and **Light**.
* **Draggable & Snappable:** A "grab-and-go" header allows you to move the calendar anywhere. It features **edge-snapping** and **viewport clamping** to ensure it never gets lost off-screen. 
* **Persistent Positioning:** Remembers its last location on your screen across sessions, so it stays exactly where you’ve put it.
* **Quick Jump:** Includes a "Today" button (⦿) to instantly return to the current month and year from anywhere in the calendar.

### **⚙️ Customizable**
* **Flexible Path Patterns:** Configure your journal file structure (e.g., `Journal/2024/05/2024-05-20_Mon`). 
* **Localization Support:** Easily change month names and weekday abbreviations to match your preferred language. Choose whether to start weeks on Sunday or Monday.


## Config Example and default values

```lua
-- priority: 1
config.set("FloatingJournalCalendar", {
  journalPathPattern = 'Journal/#year#/#month#/#year#-#month#-#day#_#weekday#',
  monthNames = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"},
  dayNames = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"},
  weekStartsSunday = false
})    
```
> **note** Note
> Copy this into a `space-lua` block on your config page to change default values

### Example: Starting weeks on Sunday
```lua
-- priority: 1
config.set("FloatingJournalCalendar", {
  journalPathPattern = 'Journal/#year#/#month#/#year#-#month#-#day#_#weekday#',
  monthNames = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"},
  dayNames = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"},
  weekStartsSunday = true
})
```

## Side Panel Integration

```space-lua
-- priority: 0
config.define("FloatingJournalCalendar", {
  type = "object",
  properties = {
    journalPathPattern = schema.string(),
    monthNames = { type = "array", items = { type = "string" } },
    dayNames = { type = "array", items = { type = "string" } },
    weekStartsSunday = schema.boolean()
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
        existing_root.remove() 
        return 
    end

    local cfg = config.get("FloatingJournalCalendar") or {}
    local path_pattern = cfg.journalPathPattern or 'Journal/#year#/#month#/#year#-#month#-#day#_#weekday#'
    local month_names = quote_list(cfg.monthNames or {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"})
    local day_names = quote_list(cfg.dayNames or {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"})
    local start_sunday = cfg.weekStartsSunday or false

    local all_pages = space.listPages()
    local page_map_items = {}
    for _, p in ipairs(all_pages) do
        table.insert(page_map_items, '"' .. p.name .. '":true')
    end
    local existing_pages_json = "{" .. table.concat(page_map_items, ",") .. "}"

    local sessionID = "jc_" .. math.floor(os.time())
    local saved_top = clientStore.get("jc_pos_top") or "80px"
    local saved_left = clientStore.get("jc_pos_left") or "auto"
    local saved_right = (saved_left == "auto") and "20px" or "auto"

    js.window.addEventListener("sb-journal-event", function(e)
        if e.detail.session == sessionID then
            if e.detail.action == "navigate" then
                editor.navigate(e.detail.path)
            elseif e.detail.action == "save_pos" then
                clientStore.set("jc_pos_top", e.detail.top)
                clientStore.set("jc_pos_left", e.detail.left)
            end
        end
    end)

    local container = js.window.document.createElement("div")
    container.id = "sb-journal-root"
    container.innerHTML = [[
    <style>
        body.sb-dragging-active {
            user-select: none !important;
            -webkit-user-select: none !important;
        }
        
        #sb-journal-root {
            position: fixed;
            top: ]] .. saved_top .. [[;
            left: ]] .. saved_left .. [[;
            right: ]] .. saved_right .. [[;
            width: 300px;
            z-index: 10000;
            font-family: system-ui, sans-serif;
            user-select: none;
            touch-action: none;
        }
        
        html[data-theme="dark"] #sb-journal-root {
            --jc-background: oklch(0.3 0 0);
            --jc-border-color: oklch(0.5 0 0 / 0.4);
            --jc-elements-background: oklch(0.5 0 0 / 0.2);
            --jc-hover-background: oklch(0.5 0 0 / 0.4);
            --jc-text-color: oklch(1 0 0);
            --jc-accent-color: var(--ui-accent-color, oklch(0.55 0.25 270));
        }
        
        html[data-theme="light"] #sb-journal-root {
            --jc-background: oklch(0.95 0 0);
            --jc-border-color: oklch(0.75 0 0 / 0.4);
            --jc-elements-background: oklch(0.85 0 0 / 0.2);
            --jc-hover-background: oklch(0.75 0 0 / 0.4);
            --jc-text-color: oklch(0.1 0 0);
            --jc-accent-color: var(--ui-accent-color, oklch(0.75 0.25 270));
        }
        
        .jc-card {
            background: var(--jc-background);
            color: var(--jc-text-color);
            border-radius: 12px;
            border: 2px solid var(--jc-border-color);
            box-shadow: 2px 2px 10px oklch(0 0 0 / 0.2)/*,
                inset 0 0 5px oklch(0 0 0 / 1),
                inset 0 0 20px oklch(0 0 0 / 0.4)*/; 
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        
        .jc-header {
            background: var(--jc-elements-background);
            padding: 10px;
            cursor: grab;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 5px;
        }
        
        .jc-nav-btn,
        .jc-close,
        .jc-today-btn {
            background: var(--jc-elements-background);
            color: var(--jc-text-color);
            border: 1px solid var(--jc-border-color);
            border-radius: 4px;
            padding: 2px 8px;
            cursor: pointer;
            font-size: 0.9em;
        }
        
        .jc-nav-btn:hover,
        .jc-today-btn:hover {
            background: var(--jc-hover-background);
        }
        
        .jc-close {
            font-size: 1.4em;
            line-height: 1;
        }
        
        .jc-close:hover {
            background: oklch(0.65 0.18 30 / 0.7);
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
            border-radius: 4px;
            font-size: 0.85em;
            padding: 2px;
            cursor: pointer;
        }
        
        .jc-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 2px;
            padding: 6px;
        }
        
        .jc-lbl {
            font-size: 0.7em;
            opacity: 0.5;
            text-align: center;
            font-weight: bold;
        }
        
        .jc-lbl.sun {
            color: oklch(0.65 0.18 30);
            opacity: 1;
        }
        
        .jc-day:not(.empty) {
            aspect-ratio: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 0.85em;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            background: var(--jc-elements-background);
            transition: 0.2s;
            box-shadow:
            /*  inset 0 0 5px oklch(0 0 0 / 0.6),
                inset 0 0 20px oklch(1 0 0 / 0.2); */
        }
        
        .jc-day:hover {
            background: var(--jc-accent-color);
            color: white;
        }
        
        .jc-day.sun {
            color: oklch(0.65 0.18 30);
            font-weight: bold;
        }
        
        .jc-day.today {
            border: 2px solid var(--jc-accent-color);
            font-weight: bold;
            color: oklch(0.65 0.18 30);
        }
        
        .jc-day.empty {
            background: transparent;
            cursor: default;
        }
        
        .jc-dot {
            width: 4px;
            height: 4px;
            background: yellow;
            border-radius: 50%;
            position: absolute;
            bottom: 4px;
            box-shadow: 2px 2px 3px oklch(0 0 0 / 0.5);
        }
        
        .jc-day.sun .jc-dot {
            background: oklch(0.65 0.18 30);
        }
         }
    </style>
    <div class="jc-card" id="jc-draggable">
        <div class="jc-header" id="jc-handle">
            <button class="jc-nav-btn" id="jc-prev">‹</button>
            <div class="jc-selectors">
                <select id="jc-month" class="jc-select"></select>
                <select id="jc-year" class="jc-select"></select>
                <button class="jc-today-btn" id="jc-today" title="Jump to Today">⦿</button>
            </div>
            <button class="jc-nav-btn" id="jc-next">›</button>
            <button class="jc-close" id="jc-close-btn">×</button>
        </div>
        <div class="jc-grid" id="jc-labels"></div>
        <div class="jc-grid" id="jc-days"></div>
    </div>
    ]]

    js.window.document.body.appendChild(container)

    local scriptEl = js.window.document.createElement("script")
    scriptEl.innerHTML = [[
    (function() {
        const session = "]]..sessionID..[[";
        const months = ]]..month_names..[[;
        const days = ]]..day_names..[[;
        const start_sun = ]]..(start_sunday and "true" or "false")..[[;
        const existing = ]]..existing_pages_json..[[;
        const pattern = "]]..path_pattern..[[";
        const root = document.getElementById("sb-journal-root");
        
        const SNAP = 15;
        const TOP_OFFSET = 65;
        let vDate = new Date();

        function clamp() {
            const rect = root.getBoundingClientRect();
            let left = rect.left, top = rect.top;
            if (left < 0) left = 0;
            if (top < TOP_OFFSET) top = TOP_OFFSET;
            if (left + rect.width > window.innerWidth) left = window.innerWidth - rect.width;
            if (top + rect.height > window.innerHeight) top = window.innerHeight - rect.height;
            root.style.left = left + "px";
            root.style.top = top + "px";
            root.style.right = "auto";
        }

        function render() {
            const y = vDate.getFullYear(), m = vDate.getMonth();
            const now = new Date();

            document.getElementById("jc-month").innerHTML = months.map((n, i) => `<option value="${i}" ${i===m?'selected':''}>${n}</option>`).join('');
            let years = []; for(let i=y-10; i<=y+10; i++) years.push(i);
            document.getElementById("jc-year").innerHTML = years.map(v => `<option value="${v}" ${v===y?'selected':''}>${v}</option>`).join('');
            const sunIdx = start_sun ? 0 : 6;
            document.getElementById("jc-labels").innerHTML = days.map((d, i) => `<div class="jc-lbl ${i===sunIdx?'sun':''}">${d}</div>`).join('');

            const grid = document.getElementById("jc-days");
            grid.innerHTML = "";
            const firstDay = new Date(y, m, 1).getDay();
            const offset = start_sun ? firstDay : ((firstDay - 1) % 7);
            const lastDay = new Date(y, m + 1, 0).getDate();

            for(let i=0; i<offset; i++) grid.appendChild(Object.assign(document.createElement("div"), {className:"jc-day empty"}));

            for(let i=1; i<=lastDay; i++) {
                const d = document.createElement("div");
                d.className = "jc-day";
                const dateObj = new Date(y, m, i);
                const isSun = dateObj.getDay() === 0;
                if(isSun) d.classList.add("sun");
                if(i===now.getDate() && m===now.getMonth() && y===now.getFullYear()) d.classList.add("today");

                const path = pattern
                    .replace(/#year#/g, y)
                    .replace(/#month#/g, String(m+1).padStart(2,'0'))
                    .replace(/#day#/g, String(i).padStart(2,'0'))
                    .replace(/#weekday#/g, days[isSun ? 6 : dateObj.getDay()-1]);

                if(existing[path]) {
                    const dot = document.createElement("div"); dot.className = "jc-dot"; d.appendChild(dot);
                }
                d.innerHTML += `<span>${i}</span>`;
                d.onclick = () => window.dispatchEvent(new CustomEvent("sb-journal-event", { detail: { action:"navigate", path, session }}));
                grid.appendChild(d);
            }
        }

        window.addEventListener("resize", clamp);
        document.getElementById("jc-prev").onclick = () => { vDate.setMonth(vDate.getMonth()-1); render(); };
        document.getElementById("jc-next").onclick = () => { vDate.setMonth(vDate.getMonth()+1); render(); };
        document.getElementById("jc-today").onclick = () => { vDate = new Date(); render(); };
        document.getElementById("jc-month").onchange = (e) => { vDate.setMonth(parseInt(e.target.value)); render(); };
        document.getElementById("jc-year").onchange = (e) => { vDate.setFullYear(parseInt(e.target.value)); render(); };
        document.getElementById("jc-close-btn").onclick = () => root.remove();

        const handle = document.getElementById("jc-handle");
        handle.onpointerdown = (e) => {
            if (e.target.tagName === "SELECT" || e.target.tagName === "BUTTON") return;
            document.body.classList.add("sb-dragging-active");
            let sX = e.clientX - root.offsetLeft, sY = e.clientY - root.offsetTop;
            
            const move = (m) => {
                let nL = m.clientX - sX, nT = m.clientY - sY;
                const w = root.offsetWidth, h = root.offsetHeight;

                if (nL < SNAP) nL = 0;
                if (nT < TOP_OFFSET + SNAP) nT = TOP_OFFSET;
                if (nL + w > window.innerWidth - SNAP) nL = window.innerWidth - w;
                if (nT + h > window.innerHeight - SNAP) nT = window.innerHeight - h;

                root.style.left = Math.max(0, Math.min(nL, window.innerWidth - w)) + "px";
                root.style.top = Math.max(TOP_OFFSET, Math.min(nT, window.innerHeight - h)) + "px";
                root.style.right = "auto";
            };

            const up = () => {
                document.body.classList.remove("sb-dragging-active");
                window.removeEventListener("pointermove", move);
                window.dispatchEvent(new CustomEvent("sb-journal-event", { detail: { action:"save_pos", top:root.style.top, left:root.style.left, session }}));
            };
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", up, {once:true});
        };

        render();
        setTimeout(clamp, 50);
    })();
    ]]
    container.appendChild(scriptEl)
end

command.define {
    name = "Journal: Floating Calendar",
    run = function() toggleFloatingJournalCalendar() end
}
```

* [SilverBullet Community](https://community.silverbullet.md/t/sleek-interactive-floating-journal-calendar/3680/6?u=mr.red)






















