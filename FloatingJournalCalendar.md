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
* **Drag&Drop**: Drag the day to add the Journal WikiLink to the page
* **Smart Date Logic:** Highlights "Today"

### **✨ Enhanced User Interface**
* **Dynamic Theming:** Built-in support for both **Dark** and **Light**.
* **Draggable & Snappable:** A "grab-and-go" header allows you to move the calendar anywhere. It features **edge-snapping** and **viewport clamping** to ensure it never gets lost off-screen. 
* **Persistent Positioning:** Remembers its last location on your screen across sessions, so it stays exactly where you’ve put it.`
* **Quick Jump:** Includes a "Today & Refresh" button `↺` to instantly return to the current month and year from anywhere in the calendar and refresh the dot’s
- Added `Cmd/Ctrl + Click` to convert the selected text to a piped WikiLink
  e.g: `[[Journal/2024/05/2024-05-20_Mon|Selected Text]]`

### **⚙️ Customizable**
* **Flexible Path Patterns:** Configure your journal file structure (e.g., `Journal/2024/05/2024-05-20_Mon`). 
* **Localization Support:** Easily change month names and weekday abbreviations to match your preferred language. Choose whether to start weeks on Sunday or Monday.


## Config Example and default values

```lua
-- priority: 1
config.set("FloatingJournalCalendar", {
  journalPathPattern = 'Journal/#year#/#month#-#monthname#/#year#-#month#-#day#_#weekday#',
  monthNames = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"},
  dayNames = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"},
  weekStartsSunday = false
})    
```

> **note** Note
> Copy this into a `space-lua` block on your config page to change default values

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
}

html[data-theme="dark"] #sb-journal-root {
    --jc-background: var(--top-background-color);
    --jc-border-color: oklch(from var(--modal-border-color) 0.65 c h / 0.5);
    --jc-elements-background: oklch(0.75 0 0 / 0.1);
    --jc-hover-background: oklch(0.65 0 0 / 0.5);
    --jc-text-color:  var(--root-color);
    --jc-accent-color: var(--ui-accent-color);
}

html[data-theme="light"] #sb-journal-root {
    --jc-background: var(--top-background-color);
    --jc-border-color: oklch(from var(--modal-border-color) 0.65 c h / 0.5);
    --jc-elements-background: oklch(0.75 0 0 / 0.2);
    --jc-hover-background: oklch(0.75 0 0 / 0.6);
    --jc-text-color:  var(--root-color);
    --jc-accent-color: var(--ui-accent-color);
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
            /* background: var(--jc-elements-background);*/
              padding: 6px 8px;
              cursor: grab;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 6px;
            /* border-bottom: 1px solid var(--jc-border-color); */
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
                  
          .jc-day:not(.empty) {
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
                  
          .jc-day:hover {
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
                  
          /* New Container for multiple dots */
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
              /* Removed absolute positioning */
          }
                  
          .jc-dot.green { background: oklch(0.6 0.18 145); }
          .jc-dot.yellow { background: oklch(0.95 0.18 95); }
          .jc-dot.orange { background: oklch(0.8 0.20 55); }
          .jc-dot.red { background: oklch(0.6 0.2 10); }
                  
          .jc-day.sun .jc-dot.red {
              /* Ensure red dot is visible on sunday if text is red, though dot bg is distinct enough */
              box-shadow: 0 0 0 1px white;
          }
```

```space-lua
-- priority: -1
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
    local path_pattern = cfg.journalPathPattern or 'Journal/#year#/#month#-#monthname#/#year#-#month#-#day#_#weekday#'
    local month_names = quote_list(cfg.monthNames or {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"})
    local day_names = quote_list(cfg.dayNames or {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"})
    local week_starts_sunday = cfg.weekStartsSunday or false

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
                local prefix = e.detail.path
                
                -- Handle Ctrl+Click Link Insertion Logic
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
                    if selection then
                        editor.navigate(selection.value)
                    end
                else
                    local final_path = (#matches == 1) and matches[1].value or prefix
                    editor.navigate(final_path)
                end
            elseif e.detail.action == "request-refresh" then
                refreshCalendarDots()
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
      #sb-journal-root {
        top: ]] .. saved_top .. [[;
        left: ]] .. saved_left .. [[;
        right: ]] .. saved_right .. [[;
      }
      #sb-journal-root.ctrl-active .jc-day {
        cursor: copy !important;
      }
    </style>
    <div class="jc-card" id="jc-draggable">
        <div class="jc-header" id="jc-handle">
            <button class="jc-nav-btn" id="jc-prev">‹</button>
            <div class="jc-selectors">
                <select id="jc-month" class="jc-select"></select>
                <select id="jc-year" class="jc-select"></select>
                <button class="jc-today-btn" id="jc-today" title="Jump to Today & Refresh">↺</button>
            </div>
            <button class="jc-nav-btn" id="jc-next">›</button>
            <button class="jc-close" id="jc-close-btn">✕</button>
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
        const weekStartsSunday = ]]..tostring(week_starts_sunday)..[[;
        let existing = ]]..existing_pages_json..[[;
        const pattern = "]]..path_pattern..[[";
        const root = document.getElementById("sb-journal-root");
        
        const SNAP = 15;
        const TOP_OFFSET = 65;
        let vDate = new Date();

        // Visual feedback for Ctrl key
        window.addEventListener("keydown", (e) => {
            if (e.ctrlKey || e.metaKey) root.classList.add("ctrl-active");
        });
        window.addEventListener("keyup", (e) => {
            if (!e.ctrlKey && !e.metaKey) root.classList.remove("ctrl-active");
        });

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
            
            const displayDays = weekStartsSunday ? [days[6], ...days.slice(0, 6)] : days;
            document.getElementById("jc-labels").innerHTML = displayDays.map((d, i) => {
                const isSun = weekStartsSunday ? i === 0 : i === 6;
                return `<div class="jc-lbl ${isSun ? 'sun' : ''}">${d}</div>`;
            }).join('');
            
            document.querySelectorAll('.jc-lbl').forEach(el => {
              el.textContent = el.textContent.slice(0, 3);
            });

            const grid = document.getElementById("jc-days");
            grid.innerHTML = "";
            const firstDay = new Date(y, m, 1).getDay();
            const offset = weekStartsSunday ? firstDay : (firstDay === 0 ? 6 : firstDay - 1);
            const lastDay = new Date(y, m + 1, 0).getDate();

            for(let i=0; i<offset; i++) grid.appendChild(Object.assign(document.createElement("div"), {className:"jc-day empty"}));

            const pageNames = Object.keys(existing);

            for(let i=1; i<=lastDay; i++) {
                const d = document.createElement("div");
                d.className = "jc-day";
                d.draggable = true;
                const dateObj = new Date(y, m, i);
                const isSun = dateObj.getDay() === 0;
                if(isSun) d.classList.add("sun");
                if(i===now.getDate() && m===now.getMonth() && y===now.getFullYear()) d.classList.add("today");

                const basePath = pattern
                    .replace(/#year#/g, y)
                    .replace(/#month#/g, String(m+1).padStart(2,'0'))
                    .replace(/#monthname#/g, months[m])
                    .replace(/#day#/g, String(i).padStart(2,'0'))
                    .replace(/#weekday#/g, days[isSun ? 6 : dateObj.getDay()-1])
                    .replace(/#wildcard#/g, "");

                const matchCount = pageNames.filter(name => name.startsWith(basePath)).length;

                if(matchCount > 0) {
                    const dotsContainer = document.createElement("div");
                    dotsContainer.className = "jc-dots-container";
                    
                    const numReds = Math.floor(matchCount / 4);
                    const remainder = matchCount % 4;

                    for(let r=0; r<numReds; r++) {
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
                    d.appendChild(dotsContainer);
                }
                
                d.innerHTML += `<span>${i}</span>`;
                
                d.onclick = (e) => window.dispatchEvent(new CustomEvent("sb-journal-event", { detail: { action:"navigate", path: basePath, session, ctrlKey: e.ctrlKey, metaKey: e.metaKey }}));
                
                d.ondragstart = (e) => {
                    e.dataTransfer.setData("text/plain", "[[" + basePath + "]].."]]"..[[");
                    e.dataTransfer.dropEffect = "copy";
                };

                grid.appendChild(d);
            }
        }

        window.addEventListener("sb-journal-update", (e) => {
            if (e.detail && e.detail.existing) {
                existing = e.detail.existing;
                render();
            }
        });

        window.addEventListener("resize", clamp);
        document.getElementById("jc-prev").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth()-1); render(); };
        document.getElementById("jc-next").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth()+1); render(); };
        
        document.getElementById("jc-today").onclick = () => { 
            vDate = new Date(); 
            window.dispatchEvent(new CustomEvent("sb-journal-event", { detail: { action: "request-refresh", session }}));
            render(); 
        };

        document.getElementById("jc-month").onchange = (e) => { vDate.setDate(1); vDate.setMonth(parseInt(e.target.value)); render(); };
        document.getElementById("jc-year").onchange = (e) => { vDate.setFullYear(parseInt(e.target.value)); render(); };
        document.getElementById("jc-close-btn").onclick = () => root.remove();

        const card = document.getElementById("jc-draggable");
        card.onpointerdown = (e) => {
            if (
                e.target.closest("button, select, input, textarea") ||
                e.target.closest(".jc-day:not(.empty)")
            ) return;

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
    run = function() toggleFloatingJournalCalendar() end
}
```

## Discussion to this library
* [SilverBullet Community](https://community.silverbullet.md/t/sleek-interactive-floating-journal-calendar/3680/6?u=mr.red)