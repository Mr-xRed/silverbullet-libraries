---
name: "Library/Mr-xRed/JournalCalendar"
tags: meta/library
pageDecoration.prefix: "🗓️ "
---
# Journal Calendar & Page Navigation
The **Journal Calendar** is a lightweight, interactive navigation tool for SilverBullet. It provides a sleek, floating interface that allows users to quickly browse their journal entries. By scanning existing pages against a customizable date pattern, it visually identifies days with active entries, enabling seamless one-click navigation through personal history.

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
* **Localization Support:** Easily change month names and weekday abbreviations to match your preferred language.


## Config Example and default values

```lua
-- priority: 1
config.set("journalCalendar", {
  journalPathPattern = 'Journal/#year#/#month#/#year#-#month#-#day#_#weekday#',
  monthNames = '["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]',
  dayNames = '["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]'
})
```


```space-lua
config.define("journalCalendar", {
  type = "object",
  properties = {
    journalPathPattern = schema.string(),
    monthNames = schema.string(),
    dayNames = schema.string()
  }
})
```

## Side Panel Integration

```space-lua
-- priority: 0
local cfg = config.get("journalCalendar") or {}
local journal_path_pattern = cfg.journalPathPattern or 'Journal/#year#/#month#/#year#-#month#-#day#_#weekday#'
local month_names = cfg.monthNames or '["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]'
local day_names = cfg.dayNames or '["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]'

function toggleJournalCalendar()
    local existing_root = js.window.document.getElementById("sb-journal-root")
    if existing_root then 
        existing_root.remove() 
        return 
    end

    local sessionID = "jc_" .. tostring(math.floor(js.window.performance.now()))
    
    local saved_top = clientStore.get("jc_pos_top") or "80px"
    local saved_left = clientStore.get("jc_pos_left") or "auto"
    local saved_right = (saved_left == "auto") and "20px" or "auto"

    local all_pages = space.listPages()
    local page_list_json = js.stringify(all_pages)

    local function handler(e)
        if e.detail.session == sessionID then
            if e.detail.action == "navigate" then
                editor.navigate(e.detail.path)
            elseif e.detail.action == "save_pos" then
                clientStore.set("jc_pos_top", e.detail.top)
                clientStore.set("jc_pos_left", e.detail.left)
            end
        end
    end
    js.window.addEventListener("sb-journal-event", handler)

    local container = js.window.document.createElement("div")
    container.id = "sb-journal-root"
    container.innerHTML = [[
    <style>
        body.sb-dragging-active {
            user-select: none !important;
            -webkit-user-select: none !important;
        }
        #sb-journal-root {
            position: fixed; top: ]] .. saved_top .. [[; left: ]] .. saved_left .. [[; right: ]] .. saved_right .. [[;
            width: 300px; z-index: 10000; font-family: system-ui, sans-serif; user-select: none;
            touch-action: none;
        }
        html[data-theme="dark"] #sb-journal-root {
            --jc-background: oklch(0.3 0 0); --jc-border-color: oklch(0.5 0 0 / 0.4);
            --jc-elements-background: oklch(0.5 0 0 / 0.2); --jc-hover-background: oklch(0.5 0 0 / 0.4);
            --jc-text-color: oklch(1 0 0); --jc-accent-color:oklch(0.55 0.25 270);
        }
        html[data-theme="light"] #sb-journal-root {
            --jc-background: oklch(0.9 0 0); --jc-border-color: oklch(0.75 0 0 / 0.4);
            --jc-elements-background: oklch(0.75 0 0 / 0.2); --jc-hover-background: oklch(0.5 0 0 / 0.4);
            --jc-text-color: oklch(0.2 0 0); --jc-accent-color:oklch(0.75 0.25 270);
        }
        .jc-card { background: var(--jc-background); color: var(--jc-text-color); border-radius: 12px; border: 2px solid var(--jc-border-color); box-shadow: 0 10px 30px oklch(0 0 0 / 0.5); overflow: hidden; display: flex; flex-direction: column; }
        .jc-header { background: var(--jc-elements-background); padding: 10px; cursor: grab; display: flex; align-items: center; justify-content: space-between; gap: 5px; }
        .jc-nav-btn, .jc-close, .jc-today-btn { background: var(--jc-elements-background); color: var(--jc-text-color); border: 1px solid var(--jc-border-color); border-radius: 4px; padding: 2px 8px; cursor: pointer; font-size: 0.9em; }
        .jc-nav-btn:hover, .jc-today-btn:hover { background: var(--jc-hover-background); }
        .jc-close { font-size: 1.4em; line-height: 1; }
        .jc-close:hover { background: oklch(0.65 0.18 30/ 0.7); color: white; }
        .jc-selectors { display: flex; gap: 4px; align-items: center; }
        .jc-select { background: var(--jc-elements-background); color: var(--jc-text-color); border: 1px solid var(--jc-border-color); border-radius: 4px; font-size: 0.85em; padding: 2px; cursor: pointer; }
        .jc-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; padding: 6px; }
        .jc-lbl { font-size: 0.7em; opacity: 0.5; text-align: center; font-weight: bold; }
        .jc-lbl.sun { color: oklch(0.65 0.18 30); opacity: 1; }
        .jc-day { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 0.85em; border-radius: 6px; cursor: pointer; position: relative; background: var(--jc-elements-background); transition: 0.2s; }
        .jc-day:hover { background: var(--jc-accent-color); color: white; }
        .jc-day.sun { color: oklch(0.65 0.18 30); font-weight: bold; }
        .jc-day.today { border: 2px solid var(--jc-accent-color); font-weight: bold; color: oklch(0.65 0.18 30); }
        .jc-day.empty { background: transparent; cursor: default; }
        .jc-dot { width: 4px; height: 4px; background: yellow; border-radius: 50%; position: absolute; bottom: 4px; box-shadow: 2px 2px 3px oklch(0 0 0 / 0.5)}
        .jc-day.sun .jc-dot { background: oklch(0.65 0.18 30); }
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

    local script = [[
    (function() {
        const session = "]] .. sessionID .. [[";
        const root = document.getElementById("sb-journal-root");
        const SNAP_THRESHOLD = 15;
        const TOP_OFFSET = 65;
        
        const monthNames = ]]..month_names..[[;
        const dayNames = ]]..day_names..[[;
        const journalPattern = "]] .. journal_path_pattern .. [[";
        const pagesRaw = ]] .. page_list_json .. [[;
        const existingPages = new Set(pagesRaw.map(p => p.name));
        
        let viewDate = new Date();
        const today = new Date();

        function getJournalPath(y, m, d, dw) {
            const mm = String(m + 1).padStart(2, '0');
            const dd = String(d).padStart(2, '0');
            const wd = dayNames[dw === 0 ? 6 : dw - 1];
            return journalPattern.replace(/#year#/g, y).replace(/#month#/g, mm).replace(/#day#/g, dd).replace(/#weekday#/g, wd);
        }

        function clampToViewport(win) {
            const rect = win.getBoundingClientRect();
            let left = rect.left, top = rect.top, width = rect.width, height = rect.height;
            if (left < 0) left = 0;
            if (top < TOP_OFFSET) top = TOP_OFFSET;
            if (left + width > window.innerWidth) left = window.innerWidth - width;
            if (top + height > window.innerHeight) top = window.innerHeight - height;
            win.style.left = `${left}px`; win.style.top = `${top}px`;
            win.style.right = "auto";
        }

        function render() {
            const year = viewDate.getFullYear();
            const month = viewDate.getMonth();
            document.getElementById("jc-month").innerHTML = monthNames.map((n, i) => `<option value="${i}" ${i === month ? 'selected' : ''}>${n}</option>`).join('');
            let years = [];
            for(let i = year - 10; i <= year + 10; i++) years.push(i);
            document.getElementById("jc-year").innerHTML = years.map(y => `<option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>`).join('');
            document.getElementById("jc-labels").innerHTML = dayNames.map((d, i) => `<div class="jc-lbl ${i === 6 ? 'sun' : ''}">${d}</div>`).join('');
            
            const dayGrid = document.getElementById("jc-days");
            dayGrid.innerHTML = "";
            let firstDay = new Date(year, month, 1).getDay();
            let offset = (firstDay === 0) ? 6 : firstDay - 1;
            let lastDay = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < offset; i++) {
                const b = document.createElement("div"); b.className = "jc-day empty"; dayGrid.appendChild(b);
            }

            for (let i = 1; i <= lastDay; i++) {
                const d = document.createElement("div");
                d.className = "jc-day";
                const dayOfWeek = new Date(year, month, i).getDay();
                if (dayOfWeek === 0) d.classList.add("sun");
                if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) d.classList.add("today");
                
                const path = getJournalPath(year, month, i, dayOfWeek);
                if (existingPages.has(path)) {
                    const dot = document.createElement("div");
                    dot.className = "jc-dot";
                    d.appendChild(dot);
                }
                const span = document.createElement("span");
                span.innerText = i;
                d.appendChild(span);
                d.onclick = () => {
                    window.dispatchEvent(new CustomEvent("sb-journal-event", { 
                        detail: { action: "navigate", path: path, session: session } 
                    }));
                };
                dayGrid.appendChild(d);
            }
        }

        window.addEventListener("resize", () => clampToViewport(root));

        document.getElementById("jc-prev").onclick = () => { viewDate.setMonth(viewDate.getMonth() - 1); render(); };
        document.getElementById("jc-next").onclick = () => { viewDate.setMonth(viewDate.getMonth() + 1); render(); };
        document.getElementById("jc-today").onclick = () => { viewDate = new Date(); render(); };
        document.getElementById("jc-month").onchange = (e) => { viewDate.setMonth(parseInt(e.target.value)); render(); };
        document.getElementById("jc-year").onchange = (e) => { viewDate.setFullYear(parseInt(e.target.value)); render(); };
        document.getElementById("jc-close-btn").onclick = () => root.remove();

        let startX, startY, startL, startT;
        const handle = document.getElementById("jc-handle");
        
        handle.onpointerdown = (e) => {
            if (e.target.tagName === "SELECT" || e.target.tagName === "BUTTON") return;
            e.preventDefault();
            
            document.body.classList.add("sb-dragging-active");
            startX = e.clientX; startY = e.clientY;
            startL = root.offsetLeft; startT = root.offsetTop;
            
            handle.setPointerCapture(e.pointerId);

            const onMove = (moveEv) => {
                let newLeft = startL + (moveEv.clientX - startX);
                let newTop = startT + (moveEv.clientY - startY);
                const width = root.offsetWidth;
                const height = root.offsetHeight;

                // Snapping logic
                if (newLeft < SNAP_THRESHOLD) newLeft = 0;
                if (newTop < TOP_OFFSET + SNAP_THRESHOLD) newTop = TOP_OFFSET; 
                if (newLeft + width > window.innerWidth - SNAP_THRESHOLD) newLeft = window.innerWidth - width;
                if (newTop + height > window.innerHeight - SNAP_THRESHOLD) newTop = window.innerHeight - height;

                // Hard boundaries (Clamping)
                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - width));
                newTop = Math.max(TOP_OFFSET, Math.min(newTop, window.innerHeight - height));

                root.style.left = `${newLeft}px`;
                root.style.top = `${newTop}px`;
                root.style.right = "auto";
            };

            const onUp = () => {
                document.body.classList.remove("sb-dragging-active");
                handle.releasePointerCapture(e.pointerId);
                window.removeEventListener("pointermove", onMove);
                window.removeEventListener("pointerup", onUp);
                
                window.dispatchEvent(new CustomEvent("sb-journal-event", { 
                    detail: { action: "save_pos", top: root.style.top, left: root.style.left, session: session } 
                }));
            };

            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
        };

        render();
        // Run once to ensure it spawns inside the clamped area
        setTimeout(() => clampToViewport(root), 10);
    })();
    ]]

    local scriptEl = js.window.document.createElement("script")
    scriptEl.innerHTML = script
    container.appendChild(scriptEl)
end

command.define {
    name = "Journal: Calendar",
    run = function() toggleJournalCalendar() end
}
```

* [SilverBullet Community](https://community.silverbullet.md/t/sleek-interactive-journal-calendar/3680?u=mr.red)






















