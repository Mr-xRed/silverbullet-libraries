---
name: "Library/Mr-xRed/FloatingJournalCalendar_UAPC"
tags: meta/library
files:
- UnifiedAdvancedPanelControl.js
pageDecoration.prefix: "🗓️ "
---
# Floating Journal Calendar (UAPC Version)

This is a refactored version of the Floating Journal Calendar that uses the `UnifiedAdvancedPanelControl` for its window management.

## Implementation

```space-style
/* This block can be removed if the styles are fully self-contained in the Lua part. For now, it's left for reference. */
/* The #sb-journal-root styles are no longer directly used by the UAPC version in the same way. */
```

```
-- Mode 3: Direct HTML Code
command.define {
  name = "Floating: EXAMPLE: Open Custom HTML",
  run = function()
    local myHtml = [[
      <body style="background: #1a1a1a; color: white; font-family: sans-serif; padding: 20px;">
        <h1>Hello from Lua!</h1>
        <p>This is a floating window rendered directly from a string.</p>
        <button onclick="alert('It works!')">Click Me</button>
      </body>
    ]]
    js.import("/.fs/Library/Mr-xRed/UnifiedAdvancedPanelControl.js").show(myHtml, "Custom App")
  end
}
```

```
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

-- Store the event listener globally to avoid re-adding it on every toggle.
if not _G.journalCalendarEventListener then
    _G.journalCalendarEventListener = function(e)
        if e.detail.source == "FloatingJournalCalendar" then
            if e.detail.action == "navigate" and (e.detail.ctrlKey or e.detail.metaKey) then
                -- This listener now ONLY handles the Ctrl/Cmd+Click case for inserting piped links.
                local prefix = e.detail.path
                local sel = editor.getSelection()
                if sel and sel.from ~= sel.to then
                    local selectedText = editor.getText():sub(sel.from + 1, sel.to)
                    editor.replaceRange(sel.from, sel.to, "[[" .. prefix .. "|" .. selectedText .. "]]")
                else
                    editor.insertAtCursor("[[" .. prefix .. "]]")
                end
            elseif e.detail.action == "request-refresh" then
                refreshCalendarDots()
            end
        end
    end
    event.listen({name = "sb-journal-event", run = _G.journalCalendarEventListener})
end

-- Message bridge: listen for postMessage from the iframe and re-dispatch as a CustomEvent
-- so the existing event.listen('sb-journal-event', ...) receives it. One-time install.
if not _G.journalCalendarMessageBridge then
    _G.journalCalendarMessageBridge = true
    js.window.eval([[
      (function(){
        if (window._floatingJournalMessageBridge) return;
        window._floatingJournalMessageBridge = true;
        window.addEventListener('message', function(e) {
          try {
            var data = e.data;
            if (!data) return;
            if (data.type === 'sb-journal-event' && data.source === 'FloatingJournalCalendar') {
              window.dispatchEvent(new CustomEvent('sb-journal-event', { detail: data.detail }));
            }
          } catch (err) {
            // swallow — doesn't break the host
          }
        });
      })();
    ]])
end

function toggleFloatingJournalCalendarUAPC()
    -- 1. Data Gathering
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

    -- 2. CSS for the iframe
    local css = [[
        :root {
            color-scheme: light dark;
        }
        body {
            margin: 0;
            font-family: system-ui, sans-serif;
            background: var(--jc-background, #1d1e20);
            color: var(--jc-text-color, #ffffff);
        }
        a, a:visited {
            color: inherit;
            text-decoration: none;
        }
        html[data-theme="dark"] body {
            --jc-background: var(--top-background-color, #1d1e20);
            --jc-border-color: oklch(from var(--modal-border-color, #555) 0.65 c h / 0.5);
            --jc-elements-background: oklch(0.75 0 0 / 0.1);
            --jc-hover-background: oklch(0.65 0 0 / 0.5);
            --jc-text-color: var(--root-color, #ffffff);
            --jc-accent-color: var(--ui-accent-color, #4a90e2);
            --jc-select-option-background: var(--modal-help-background-color, #333);
        }
        html[data-theme="light"] body {
            --jc-background: var(--top-background-color, #ffffff);
            --jc-border-color: oklch(from var(--modal-border-color, #ccc) 0.65 c h / 0.5);
            --jc-elements-background: oklch(0.75 0 0 / 0.2);
            --jc-hover-background: oklch(0.75 0 0 / 0.6);
            --jc-text-color: var(--root-color, #000000);
            --jc-accent-color: var(--ui-accent-color, #1a73e8);
            --jc-select-option-background: var(--modal-help-background-color, #f0f0f0);
        }
        .jc-card {
            background: var(--jc-background);
            color: var(--jc-text-color);
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .jc-header {
            padding: 6px 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
        }
        .jc-nav-btn, .jc-today-btn {
            background: var(--jc-elements-background);
            color: var(--jc-text-color);
            border: 1px solid var(--jc-border-color);
            border-radius: 6px;
            padding: 2px 6px;
            cursor: pointer;
            font-size: 0.85em;
        }
        .jc-nav-btn:hover, .jc-today-btn:hover { background: var(--jc-hover-background); }
        .jc-selectors { display: flex; gap: 4px; align-items: center; }
        .jc-select {
            background: var(--jc-elements-background);
            color: var(--jc-text-color);
            border: 1px solid var(--jc-border-color);
            border-radius: 6px;
            font-size: 0.8em;
            padding: 2px 4px;
            cursor: pointer;
        }
        .jc-select option { background: var(--jc-select-option-background); }
        .jc-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; padding: 6px; }
        .jc-lbl { font-size: 0.7em; opacity: 0.6; text-align: center; font-weight: bold; }
        .jc-lbl.sun { color: oklch(0.65 0.18 30); opacity: 1; }
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
        .jc-day:hover { background: var(--jc-hover-background); }
        .jc-day.sun { color: oklch(0.6 0.2 30); font-weight: bold; }
        .jc-day.today { outline: 2px solid var(--jc-accent-color); outline-offset: -2px; font-weight: bold; }
        .jc-day.empty { background: transparent; }
        .jc-dots-container { display: flex; gap: 2px; position: absolute; bottom: 5px; justify-content: center; width: 100%; }
        .jc-dot { width: 4px; height: 4px; border-radius: 50%; box-shadow: 1px 1px 2px oklch(0 0 0 / 0.5); }
        .jc-dot.green { background: oklch(0.6 0.18 145); }
        .jc-dot.yellow { background: oklch(0.95 0.18 95); }
        .jc-dot.orange { background: oklch(0.8 0.20 55); }
        .jc-dot.red { background: oklch(0.6 0.2 10); }
    ]]

    -- 3. HTML for the calendar body
    local html = [[
        <div class="jc-card" id="jc-container">
            <div class="jc-header">
                <button class="jc-nav-btn" id="jc-prev">‹</button>
                <div class="jc-selectors">
                    <select id="jc-month" class="jc-select"></select>
                    <select id="jc-year" class="jc-select"></select>
                    <button class="jc-today-btn" id="jc-today" title="Jump to Today & Refresh">↺</button>
                </div>
                <button class="jc-nav-btn" id="jc-next">›</button>
            </div>
            <div class="jc-grid" id="jc-labels"></div>
            <div class="jc-grid" id="jc-days"></div>
        </div>
    ]]

    -- 4. JavaScript for the iframe
    local javascript = [[
    (function() {
        const pendingRequests = new Map();
        let syscallReqId = 0;

        globalThis.syscall = async (name, ...args) => {
          return await new Promise((resolve, reject) => {
            syscallReqId++;
            pendingRequests.set(syscallReqId, { resolve, reject });
            globalThis.parent.postMessage({
              type: "syscall",
              id: syscallReqId,
              name,
              args,
            }, "*");
          });
        };

        globalThis.addEventListener("message", (message) => {
          const data = message.data;
          if (data.type === "syscall-response") {
            const syscallId = data.id;
            const lookup = pendingRequests.get(syscallId);
            if (!lookup) {
              throw Error("Invalid request id");
            }
            pendingRequests.delete(syscallId);
            if (data.error) {
              lookup.reject(new Error(data.error));
            } else {
              lookup.resolve(data.result);
            }
          }
        });
        const months = ]]..month_names..[[;
        const days = ]]..day_names..[[;
        const weekStartsSunday = ]]..tostring(week_starts_sunday)..[[;
        let existing = ]]..existing_pages_json..[[;
        const pattern = "]]..path_pattern..[[";
        const root = document.getElementById("jc-container");
        let vDate = new Date();

        function syncTheme() {
            const parentTheme = window.parent.document.documentElement.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', parentTheme);

            const computedStyle = window.parent.getComputedStyle(window.parent.document.documentElement);
            const cssVars = ['--top-background-color', '--modal-border-color', '--root-color', '--ui-accent-color', '--modal-help-background-color'];
            let styleContent = ':root {';
            for (const v of cssVars) {
                styleContent += `${v}: ${computedStyle.getPropertyValue(v)};`;
            }
            styleContent += '}';
            let styleEl = document.getElementById('sb-theme-sync');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'sb-theme-sync';
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = styleContent;
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
                return `<div class="jc-lbl ${isSun ? 'sun' : ''}">${d.slice(0,3)}</div>`;
            }).join('');

            const grid = document.getElementById("jc-days");
            grid.innerHTML = "";
            const firstDay = new Date(y, m, 1).getDay();
            const offset = weekStartsSunday ? firstDay : (firstDay === 0 ? 6 : firstDay - 1);
            const lastDay = new Date(y, m + 1, 0).getDate();

            for(let i=0; i<offset; i++) grid.appendChild(Object.assign(document.createElement("div"), {className:"jc-day empty"}));

            const pageNames = Object.keys(existing);

            for(let i=1; i<=lastDay; i++) {
                const a = document.createElement("a");
                const d = document.createElement("div");
                d.draggable = true;
                const dateObj = new Date(y, m, i);
                const isSun = dateObj.getDay() === 0;
                if(isSun) d.classList.add("sun");
                if(i===now.getDate() && m===now.getMonth() && y===now.getFullYear()) d.classList.add("today");

                const basePath = pattern
                    .replace(/#year#/g, y).replace(/#month#/g, String(m+1).padStart(2,'0'))
                    .replace(/#monthname#/g, months[m]).replace(/#day#/g, String(i).padStart(2,'0'))
                    .replace(/#weekday#/g, days[isSun ? 6 : dateObj.getDay()-1]);
                
                const matchCount = pageNames.filter(name => name.startsWith(basePath)).length;

                if(matchCount > 0) {
                    const dotsContainer = document.createElement("div");
                    dotsContainer.className = "jc-dots-container";
                    const numReds = Math.floor(matchCount / 4);
                    for(let r=0; r<numReds; r++) {
                        dotsContainer.innerHTML += '<div class="jc-dot red"></div>';
                    }
                    const remainder = matchCount % 4;
                    if (remainder > 0) {
                        const colorClass = remainder === 3 ? "orange" : (remainder === 2 ? "yellow" : "green");
                        dotsContainer.innerHTML += `<div class="jc-dot ${colorClass}"></div>`;
                    }
                    d.appendChild(dotsContainer);
                }
                
                d.innerHTML += `<span>${i}</span>`;

                // now use data-ref on the anchor and leave actual navigation to parent injector --
                a.setAttribute('data-ref', basePath);
                // removed a.href = "#" to avoid navigating to the blob URL --

                d.ondragstart = (e) => {
                    e.dataTransfer.setData("text/plain", "[[" + basePath + "]" + "]");
                    e.dataTransfer.dropEffect = "copy";
                };
                
                a.appendChild(d);
                grid.appendChild(a);
            }
        }
        
        window.addEventListener("sb-journal-update-event", (e) => {
             if (e.detail && e.detail.existing) {
                existing = e.detail.existing;
                render();
            }
        });

        document.getElementById("jc-prev").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth()-1); render(); };
        document.getElementById("jc-next").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth()+1); render(); };
        document.getElementById("jc-today").onclick = () => { 
            vDate = new Date(); 
            // Use postMessage for request-refresh as well
            window.parent.postMessage({
              type: "sb-journal-event",
              source: "FloatingJournalCalendar",
              detail: { action: "request-refresh", source: "FloatingJournalCalendar" }
            }, "*");
            render(); 
        };
        document.getElementById("jc-month").onchange = (e) => { vDate.setDate(1); vDate.setMonth(parseInt(e.target.value)); render(); };
        document.getElementById("jc-year").onchange = (e) => { vDate.setFullYear(parseInt(e.target.value)); render(); };

        syncTheme();
        render();
        new window.parent.MutationObserver(syncTheme).observe(window.parent.document.documentElement, { attributes: true, attributeFilter: ['data-theme']});
    })();
    ]]

    -- 5. Assemble and Show
    full_html = "<style>" .. css .. "</style>" .. html .. "<script>" .. javascript .. "</script>" 
    js.import("/.fs/Library/Mr-xRed/UnifiedAdvancedPanelControl.js").show(full_html, "Calendar")

    -- Manual injection into the iframe from the parent window (TOC-style syscall binding)
    local scriptId = "sb-calendar-sidebar-runtime"
    local existing = js.window.document.getElementById(scriptId)
    if existing then existing.remove() end
    local scriptEl = js.window.document.createElement("script")
    scriptEl.id = scriptId

    scriptEl.innerHTML = [[
      (function() {
        const findAndBind = () => {
          const iframe = document.querySelector(".sb-panel iframe");
          if (!iframe || !iframe.contentWindow) {
            setTimeout(findAndBind, 250);
            return;
          }

          try {
            const win = iframe.contentWindow;
            const doc = win.document;
            if (!doc || !doc.body) {
              setTimeout(findAndBind, 250);
              return;
            }

            if (win.__calendarBound) return;
            win.__calendarBound = true;

            const applyLogic = () => {
              const links = doc.querySelectorAll("a[data-ref]");
              links.forEach((el) => {
                const dataRef = el.getAttribute("data-ref");
                const href = el.getAttribute("href");
                let target = dataRef || href;

                if (!target) return;

                // Normalize anchor-like values
                target = target.replace(/^#/, "");

                // Remove href to prevent default navigation and make clickable
                if (el.hasAttribute("href")) el.removeAttribute("href");
                el.style.cursor = "pointer";

                if (el.__syscallBound) return;
                el.__syscallBound = true;

                el.addEventListener("click", function(e) {
                  e.preventDefault();
                  e.stopPropagation();

                  let path = target;
                  path = path.replace(/\.md$/, "");
                  if (!path.startsWith("/")) {
                    path = "/" + path;
                  }

                  // Ctrl/Cmd+click: handled by posting sb-journal-event back to parent (existing flow)
                  if (e.ctrlKey || e.metaKey) {
                    window.postMessage({
                      type: "sb-journal-event",
                      source: "FloatingJournalCalendar",
                      detail: { action: "navigate", path: path, source: "FloatingJournalCalendar", ctrlKey: e.ctrlKey, metaKey: e.metaKey }
                    }, "*");
                    return;
                  }

                  // Prefer calling iframe.syscall('editor.navigate', ...) when available (TOC approach)
                  if (typeof win.syscall === "function") {
                    try {
                      win.syscall('editor.navigate', path, false, false);
                    } catch (err) {
                      // ignore failures here; do not attempt alternate posting (keeps behavior consistent with TOC)
                    }
                  }
                }, { passive: false });
              });
            };

            applyLogic();

            const observer = new win.MutationObserver(applyLogic);
            observer.observe(doc.body, { childList: true, subtree: true });

            if (!doc.getElementById("calendar-custom-styles-once")) {
              const parentStyles = parent.document.getElementById("custom-styles")?.innerHTML || "";
              const cleanStyles = parentStyles.replace(/<\/?style>/g, "");
              const styleEl = doc.createElement("style");
              styleEl.id = "calendar-custom-styles-once";
              styleEl.innerHTML = cleanStyles;
              doc.head.appendChild(styleEl);
            }

          } catch (err) {
            setTimeout(findAndBind, 500);
          }
        };

        setTimeout(findAndBind, 100);
      })();
    ]]

    js.window.document.body.appendChild(scriptEl)
end

function refreshCalendarDots()
    local frame = js.window.document.querySelector("#sb-float-Floating_Journal_Calendar iframe")
    if not frame then return end

    local all_pages = space.listPages()
    local page_map_items = {}
    for _, p in ipairs(all_pages) do
        table.insert(page_map_items, '"' .. p.name .. '":true')
    end
    local json_str = "{" .. table.concat(page_map_items, ",") .. "}"
    
    local event = js.window.eval([[ (data) => new CustomEvent("sb-journal-update-event", { detail: { existing: data } }) ]])(js.window.JSON.parse(json_str))
    frame.contentWindow.dispatchEvent(event)
end

event.listen { name = "editor:pageLoaded", run = function() refreshCalendarDots() end }

command.define {
    name = "Journal: Floating Calendar (UAPC)",
    run = function() toggleFloatingJournalCalendarUAPC() end
}
```



```
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

-- Store the event listener globally to avoid re-adding it on every toggle.
if not _G.journalCalendarEventListener then
    _G.journalCalendarEventListener = function(e)
        if e.detail.source == "FloatingJournalCalendar" then
            if e.detail.action == "navigate" and (e.detail.ctrlKey or e.detail.metaKey) then
                -- This listener now ONLY handles the Ctrl/Cmd+Click case for inserting piped links.
                local prefix = e.detail.path
                local sel = editor.getSelection()
                if sel and sel.from ~= sel.to then
                    local selectedText = editor.getText():sub(sel.from + 1, sel.to)
                    editor.replaceRange(sel.from, sel.to, "[[" .. prefix .. "|" .. selectedText .. "]]")
                else
                    editor.insertAtCursor("[[" .. prefix .. "]]")
                end
            elseif e.detail.action == "request-refresh" then
                refreshCalendarDots()
            end
        end
    end
    event.listen({name = "sb-journal-event", run = _G.journalCalendarEventListener})
end

-- Message bridge: listen for postMessage from the iframe and re-dispatch as a CustomEvent
-- so the existing event.listen('sb-journal-event', ...) receives it. One-time install.
if not _G.journalCalendarMessageBridge then
    _G.journalCalendarMessageBridge = true
    js.window.eval([[
      (function(){
        if (window._floatingJournalMessageBridge) return;
        window._floatingJournalMessageBridge = true;
        window.addEventListener('message', function(e) {
          try {
            var data = e.data;
            if (!data) return;
            if (data.type === 'sb-journal-event' && data.source === 'FloatingJournalCalendar') {
              window.dispatchEvent(new CustomEvent('sb-journal-event', { detail: data.detail }));
            }
          } catch (err) {
            // swallow — doesn't break the host
          }
        });
      })();
    ]])
end

function toggleFloatingJournalCalendarUAPC()
    -- 1. Data Gathering
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

    -- 2. CSS for the iframe
    local css = [[
        :root {
            color-scheme: light dark;
        }
        body {
            margin: 0;
            font-family: system-ui, sans-serif;
            background: var(--jc-background, #1d1e20);
            color: var(--jc-text-color, #ffffff);
        }
        a, a:visited {
            color: inherit;
            text-decoration: none;
        }
        html[data-theme="dark"] body {
            --jc-background: var(--top-background-color, #1d1e20);
            --jc-border-color: oklch(from var(--modal-border-color, #555) 0.65 c h / 0.5);
            --jc-elements-background: oklch(0.75 0 0 / 0.1);
            --jc-hover-background: oklch(0.65 0 0 / 0.5);
            --jc-text-color: var(--root-color, #ffffff);
            --jc-accent-color: var(--ui-accent-color, #4a90e2);
            --jc-select-option-background: var(--modal-help-background-color, #333);
        }
        html[data-theme="light"] body {
            --jc-background: var(--top-background-color, #ffffff);
            --jc-border-color: oklch(from var(--modal-border-color, #ccc) 0.65 c h / 0.5);
            --jc-elements-background: oklch(0.75 0 0 / 0.2);
            --jc-hover-background: oklch(0.75 0 0 / 0.6);
            --jc-text-color: var(--root-color, #000000);
            --jc-accent-color: var(--ui-accent-color, #1a73e8);
            --jc-select-option-background: var(--modal-help-background-color, #f0f0f0);
        }
        .jc-card {
            background: var(--jc-background);
            color: var(--jc-text-color);
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .jc-header {
            padding: 6px 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
        }
        .jc-nav-btn, .jc-today-btn {
            background: var(--jc-elements-background);
            color: var(--jc-text-color);
            border: 1px solid var(--jc-border-color);
            border-radius: 6px;
            padding: 2px 6px;
            cursor: pointer;
            font-size: 0.85em;
        }
        .jc-nav-btn:hover, .jc-today-btn:hover { background: var(--jc-hover-background); }
        .jc-selectors { display: flex; gap: 4px; align-items: center; }
        .jc-select {
            background: var(--jc-elements-background);
            color: var(--jc-text-color);
            border: 1px solid var(--jc-border-color);
            border-radius: 6px;
            font-size: 0.8em;
            padding: 2px 4px;
            cursor: pointer;
        }
        .jc-select option { background: var(--jc-select-option-background); }
        .jc-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; padding: 6px; }
        .jc-lbl { font-size: 0.7em; opacity: 0.6; text-align: center; font-weight: bold; }
        .jc-lbl.sun { color: oklch(0.65 0.18 30); opacity: 1; }
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
        .jc-day:hover { background: var(--jc-hover-background); }
        .jc-day.sun { color: oklch(0.6 0.2 30); font-weight: bold; }
        .jc-day.today { outline: 2px solid var(--jc-accent-color); outline-offset: -2px; font-weight: bold; }
        .jc-day.empty { background: transparent; }
        .jc-dots-container { display: flex; gap: 2px; position: absolute; bottom: 5px; justify-content: center; width: 100%; }
        .jc-dot { width: 4px; height: 4px; border-radius: 50%; box-shadow: 1px 1px 2px oklch(0 0 0 / 0.5); }
        .jc-dot.green { background: oklch(0.6 0.18 145); }
        .jc-dot.yellow { background: oklch(0.95 0.18 95); }
        .jc-dot.orange { background: oklch(0.8 0.20 55); }
        .jc-dot.red { background: oklch(0.6 0.2 10); }
    ]]

    -- 3. HTML for the calendar body
    local html = [[
        <div class="jc-card" id="jc-container">
            <div class="jc-header">
                <button class="jc-nav-btn" id="jc-prev">‹</button>
                <div class="jc-selectors">
                    <select id="jc-month" class="jc-select"></select>
                    <select id="jc-year" class="jc-select"></select>
                    <button class="jc-today-btn" id="jc-today" title="Jump to Today & Refresh">↺</button>
                </div>
                <button class="jc-nav-btn" id="jc-next">›</button>
            </div>
            <div class="jc-grid" id="jc-labels"></div>
            <div class="jc-grid" id="jc-days"></div>
        </div>
    ]]

    -- 4. JavaScript for the iframe
    local javascript = [[
    (function() {
        const pendingRequests = new Map();
        let syscallReqId = 0;

        globalThis.syscall = async (name, ...args) => {
          return await new Promise((resolve, reject) => {
            syscallReqId++;
            pendingRequests.set(syscallReqId, { resolve, reject });
            globalThis.parent.postMessage({
              type: "syscall",
              id: syscallReqId,
              name,
              args,
            }, "*");
          });
        };

        globalThis.addEventListener("message", (message) => {
          const data = message.data;
          if (data.type === "syscall-response") {
            const syscallId = data.id;
            const lookup = pendingRequests.get(syscallId);
            if (!lookup) {
              throw Error("Invalid request id");
            }
            pendingRequests.delete(syscallId);
            if (data.error) {
              lookup.reject(new Error(data.error));
            } else {
              lookup.resolve(data.result);
            }
          }
        });
        const months = ]]..month_names..[[;
        const days = ]]..day_names..[[;
        const weekStartsSunday = ]]..tostring(week_starts_sunday)..[[;
        let existing = ]]..existing_pages_json..[[;
        const pattern = "]]..path_pattern..[[";
        const root = document.getElementById("jc-container");
        let vDate = new Date();

        function syncTheme() {
            const parentTheme = window.parent.document.documentElement.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', parentTheme);

            const computedStyle = window.parent.getComputedStyle(window.parent.document.documentElement);
            const cssVars = ['--top-background-color', '--modal-border-color', '--root-color', '--ui-accent-color', '--modal-help-background-color'];
            let styleContent = ':root {';
            for (const v of cssVars) {
                styleContent += `${v}: ${computedStyle.getPropertyValue(v)};`;
            }
            styleContent += '}';
            let styleEl = document.getElementById('sb-theme-sync');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'sb-theme-sync';
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = styleContent;
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
                return `<div class="jc-lbl ${isSun ? 'sun' : ''}">${d.slice(0,3)}</div>`;
            }).join('');

            const grid = document.getElementById("jc-days");
            grid.innerHTML = "";
            const firstDay = new Date(y, m, 1).getDay();
            const offset = weekStartsSunday ? firstDay : (firstDay === 0 ? 6 : firstDay - 1);
            const lastDay = new Date(y, m + 1, 0).getDate();

            for(let i=0; i<offset; i++) grid.appendChild(Object.assign(document.createElement("div"), {className:"jc-day empty"}));

            const pageNames = Object.keys(existing);

            for(let i=1; i<=lastDay; i++) {
                const a = document.createElement("a");
                const d = document.createElement("div");
                d.draggable = true;
                const dateObj = new Date(y, m, i);
                const isSun = dateObj.getDay() === 0;
                if(isSun) d.classList.add("sun");
                if(i===now.getDate() && m===now.getMonth() && y===now.getFullYear()) d.classList.add("today");

                const basePath = pattern
                    .replace(/#year#/g, y).replace(/#month#/g, String(m+1).padStart(2,'0'))
                    .replace(/#monthname#/g, months[m]).replace(/#day#/g, String(i).padStart(2,'0'))
                    .replace(/#weekday#/g, days[isSun ? 6 : dateObj.getDay()-1]);
                
                const matchCount = pageNames.filter(name => name.startsWith(basePath)).length;

                if(matchCount > 0) {
                    const dotsContainer = document.createElement("div");
                    dotsContainer.className = "jc-dots-container";
                    const numReds = Math.floor(matchCount / 4);
                    for(let r=0; r<numReds; r++) {
                        dotsContainer.innerHTML += '<div class="jc-dot red"></div>';
                    }
                    const remainder = matchCount % 4;
                    if (remainder > 0) {
                        const colorClass = remainder === 3 ? "orange" : (remainder === 2 ? "yellow" : "green");
                        dotsContainer.innerHTML += `<div class="jc-dot ${colorClass}"></div>`;
                    }
                    d.appendChild(dotsContainer);
                }
                
                d.innerHTML += `<span>${i}</span>`;

                // now use data-ref on the anchor and leave actual navigation to parent injector --
                a.setAttribute('data-ref', basePath);
                // removed a.href = "#" to avoid navigating to the blob URL --

                d.ondragstart = (e) => {
                    e.dataTransfer.setData("text/plain", "[[" + basePath + "]" + "]");
                    e.dataTransfer.dropEffect = "copy";
                };
                
                a.appendChild(d);
                grid.appendChild(a);
            }
        }
        
        window.addEventListener("sb-journal-update-event", (e) => {
             if (e.detail && e.detail.existing) {
                existing = e.detail.existing;
                render();
            }
        });

        document.getElementById("jc-prev").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth()-1); render(); };
        document.getElementById("jc-next").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth()+1); render(); };
        document.getElementById("jc-today").onclick = () => { 
            vDate = new Date(); 
            // Use postMessage for request-refresh as well
            window.parent.postMessage({
              type: "sb-journal-event",
              source: "FloatingJournalCalendar",
              detail: { action: "request-refresh", source: "FloatingJournalCalendar" }
            }, "*");
            render(); 
        };
        document.getElementById("jc-month").onchange = (e) => { vDate.setDate(1); vDate.setMonth(parseInt(e.target.value)); render(); };
        document.getElementById("jc-year").onchange = (e) => { vDate.setFullYear(parseInt(e.target.value)); render(); };

        syncTheme();
        render();
        new window.parent.MutationObserver(syncTheme).observe(window.parent.document.documentElement, { attributes: true, attributeFilter: ['data-theme']});
    })();
    ]]

    -- 5. Assemble and Show
    full_html = "<style>" .. css .. "</style>" .. html .. "<script>" .. javascript .. "</script>" 
    js.import("/.fs/Library/Mr-xRed/UnifiedAdvancedPanelControl.js").show(full_html, "Calendar")

    -- Manual injection into the iframe from the parent window (TOC-style syscall binding)
    local scriptId = "sb-calendar-sidebar-runtime"
    local existing = js.window.document.getElementById(scriptId)
    if existing then existing.remove() end
    local scriptEl = js.window.document.createElement("script")
    scriptEl.id = scriptId

    scriptEl.innerHTML = [[
      (function() {
        const findAndBind = () => {
          const iframe = document.querySelector(".sb-panel iframe");
          if (!iframe || !iframe.contentWindow) {
            setTimeout(findAndBind, 250);
            return;
          }

          try {
            const win = iframe.contentWindow;
            const doc = win.document;
            if (!doc || !doc.body) {
              setTimeout(findAndBind, 250);
              return;
            }

            if (win.__calendarBound) return;
            win.__calendarBound = true;

            const applyLogic = () => {
              const links = doc.querySelectorAll("a[data-ref]");
              links.forEach((el) => {
                const target = el.getAttribute("data-ref") || el.getAttribute("href");
                if (!target) return;

                if (el.__syscallBound) return;
                el.__syscallBound = true;

                el.addEventListener("click", function(e) {
                  e.preventDefault();
                  e.stopPropagation();

                  let path = target.replace(/\.md$/, "");
                  if (!path.startsWith("/")) {
                    path = "/" + path;
                  }

                  // Ctrl/Cmd+click should still produce piped link insertion via existing sb-journal-event listener.
                  if (e.ctrlKey || e.metaKey) {
                    window.postMessage({
                      type: "sb-journal-event",
                      source: "FloatingJournalCalendar",
                      detail: { action: "navigate", path: path, source: "FloatingJournalCalendar", ctrlKey: e.ctrlKey, metaKey: e.metaKey }
                    }, "*");
                    return;
                  }

                  // Prefer calling iframe.syscall('editor.navigate', ...) when available.
                  if (typeof win.syscall === "function") {
                    try {
                      win.syscall('editor.navigate', path, false, false);
                    } catch (err) {
                      // ignore and fallback to posting a syscall-style message
                      window.postMessage({ type: "syscall", id: Date.now(), name: "editor.navigate", args: [path, false, false] }, "*");
                    }
                  } else {
                    // fallback if no syscall function (best effort)
                    window.postMessage({ type: "syscall", id: Date.now(), name: "editor.navigate", args: [path, false, false] }, "*");
                  }
                }, { passive: false });
              });
            };

            applyLogic();

            const observer = new win.MutationObserver(applyLogic);
            observer.observe(doc.body, { childList: true, subtree: true });

            if (!doc.getElementById("calendar-custom-styles-once")) {
              const parentStyles = parent.document.getElementById("custom-styles")?.innerHTML || "";
              const cleanStyles = parentStyles.replace(/<\/?style>/g, "");
              const styleEl = doc.createElement("style");
              styleEl.id = "calendar-custom-styles-once";
              styleEl.innerHTML = cleanStyles;
              doc.head.appendChild(styleEl);
            }

          } catch (err) {
            setTimeout(findAndBind, 500);
          }
        };

        setTimeout(findAndBind, 100);
      })();
    ]]

    js.window.document.body.appendChild(scriptEl)
end

function refreshCalendarDots()
    local frame = js.window.document.querySelector("#sb-float-Floating_Journal_Calendar iframe")
    if not frame then return end

    local all_pages = space.listPages()
    local page_map_items = {}
    for _, p in ipairs(all_pages) do
        table.insert(page_map_items, '"' .. p.name .. '":true')
    end
    local json_str = "{" .. table.concat(page_map_items, ",") .. "}"
    
    local event = js.window.eval([[ (data) => new CustomEvent("sb-journal-update-event", { detail: { existing: data } }) ]])(js.window.JSON.parse(json_str))
    frame.contentWindow.dispatchEvent(event)
end

event.listen { name = "editor:pageLoaded", run = function() refreshCalendarDots() end }

command.define {
    name = "Journal: Floating Calendar (UAPC)",
    run = function() toggleFloatingJournalCalendarUAPC() end
}
```

```
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

-- Store the event listener globally to avoid re-adding it on every toggle.
if not _G.journalCalendarEventListener then
    _G.journalCalendarEventListener = function(e)
        if e.detail.source == "FloatingJournalCalendar" then
            if e.detail.action == "navigate" and (e.detail.ctrlKey or e.detail.metaKey) then
                -- This listener now ONLY handles the Ctrl/Cmd+Click case for inserting piped links.
                local prefix = e.detail.path
                local sel = editor.getSelection()
                if sel and sel.from ~= sel.to then
                    local selectedText = editor.getText():sub(sel.from + 1, sel.to)
                    editor.replaceRange(sel.from, sel.to, "[[" .. prefix .. "|" .. selectedText .. "]]")
                else
                    editor.insertAtCursor("[[" .. prefix .. "]]")
                end
            elseif e.detail.action == "request-refresh" then
                refreshCalendarDots()
            end
        end
    end
    event.listen({name = "sb-journal-event", run = _G.journalCalendarEventListener})
end

-- Message bridge: listen for postMessage from the iframe and re-dispatch as a CustomEvent
-- so the existing event.listen('sb-journal-event', ...) receives it. One-time install.
if not _G.journalCalendarMessageBridge then
    _G.journalCalendarMessageBridge = true
    js.window.eval([[
      (function(){
        if (window._floatingJournalMessageBridge) return;
        window._floatingJournalMessageBridge = true;
        window.addEventListener('message', function(e) {
          try {
            var data = e.data;
            if (!data) return;
            if (data.type === 'sb-journal-event' && data.source === 'FloatingJournalCalendar') {
              window.dispatchEvent(new CustomEvent('sb-journal-event', { detail: data.detail }));
            }
          } catch (err) {
            // swallow — doesn't break the host
          }
        });
      })();
    ]])
end

function toggleFloatingJournalCalendarUAPC()
    -- 1. Data Gathering
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

    -- 2. CSS for the iframe
    local css = [[
        :root {
            color-scheme: light dark;
        }
        body {
            margin: 0;
            font-family: system-ui, sans-serif;
            background: var(--jc-background, #1d1e20);
            color: var(--jc-text-color, #ffffff);
        }
        a, a:visited {
            color: inherit;
            text-decoration: none;
        }
        html[data-theme="dark"] body {
            --jc-background: var(--top-background-color, #1d1e20);
            --jc-border-color: oklch(from var(--modal-border-color, #555) 0.65 c h / 0.5);
            --jc-elements-background: oklch(0.75 0 0 / 0.1);
            --jc-hover-background: oklch(0.65 0 0 / 0.5);
            --jc-text-color: var(--root-color, #ffffff);
            --jc-accent-color: var(--ui-accent-color, #4a90e2);
            --jc-select-option-background: var(--modal-help-background-color, #333);
        }
        html[data-theme="light"] body {
            --jc-background: var(--top-background-color, #ffffff);
            --jc-border-color: oklch(from var(--modal-border-color, #ccc) 0.65 c h / 0.5);
            --jc-elements-background: oklch(0.75 0 0 / 0.2);
            --jc-hover-background: oklch(0.75 0 0 / 0.6);
            --jc-text-color: var(--root-color, #000000);
            --jc-accent-color: var(--ui-accent-color, #1a73e8);
            --jc-select-option-background: var(--modal-help-background-color, #f0f0f0);
        }
        .jc-card {
            background: var(--jc-background);
            color: var(--jc-text-color);
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .jc-header {
            padding: 6px 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
        }
        .jc-nav-btn, .jc-today-btn {
            background: var(--jc-elements-background);
            color: var(--jc-text-color);
            border: 1px solid var(--jc-border-color);
            border-radius: 6px;
            padding: 2px 6px;
            cursor: pointer;
            font-size: 0.85em;
        }
        .jc-nav-btn:hover, .jc-today-btn:hover { background: var(--jc-hover-background); }
        .jc-selectors { display: flex; gap: 4px; align-items: center; }
        .jc-select {
            background: var(--jc-elements-background);
            color: var(--jc-text-color);
            border: 1px solid var(--jc-border-color);
            border-radius: 6px;
            font-size: 0.8em;
            padding: 2px 4px;
            cursor: pointer;
        }
        .jc-select option { background: var(--jc-select-option-background); }
        .jc-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; padding: 6px; }
        .jc-lbl { font-size: 0.7em; opacity: 0.6; text-align: center; font-weight: bold; }
        .jc-lbl.sun { color: oklch(0.65 0.18 30); opacity: 1; }
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
        .jc-day:hover { background: var(--jc-hover-background); }
        .jc-day.sun { color: oklch(0.6 0.2 30); font-weight: bold; }
        .jc-day.today { outline: 2px solid var(--jc-accent-color); outline-offset: -2px; font-weight: bold; }
        .jc-day.empty { background: transparent; }
        .jc-dots-container { display: flex; gap: 2px; position: absolute; bottom: 5px; justify-content: center; width: 100%; }
        .jc-dot { width: 4px; height: 4px; border-radius: 50%; box-shadow: 1px 1px 2px oklch(0 0 0 / 0.5); }
        .jc-dot.green { background: oklch(0.6 0.18 145); }
        .jc-dot.yellow { background: oklch(0.95 0.18 95); }
        .jc-dot.orange { background: oklch(0.8 0.20 55); }
        .jc-dot.red { background: oklch(0.6 0.2 10); }
    ]]

    -- 3. HTML for the calendar body
    local html = [[
        <div class="jc-card" id="jc-container">
            <div class="jc-header">
                <button class="jc-nav-btn" id="jc-prev">‹</button>
                <div class="jc-selectors">
                    <select id="jc-month" class="jc-select"></select>
                    <select id="jc-year" class="jc-select"></select>
                    <button class="jc-today-btn" id="jc-today" title="Jump to Today & Refresh">↺</button>
                </div>
                <button class="jc-nav-btn" id="jc-next">›</button>
            </div>
            <div class="jc-grid" id="jc-labels"></div>
            <div class="jc-grid" id="jc-days"></div>
        </div>
    ]]

    -- 4. JavaScript for the iframe
    local javascript = [[
    (function() {
        const pendingRequests = new Map();
        let syscallReqId = 0;

        globalThis.syscall = async (name, ...args) => {
          return await new Promise((resolve, reject) => {
            syscallReqId++;
            pendingRequests.set(syscallReqId, { resolve, reject });
            globalThis.parent.postMessage({
              type: "syscall",
              id: syscallReqId,
              name,
              args,
            }, "*");
          });
        };

        globalThis.addEventListener("message", (message) => {
          const data = message.data;
          if (data.type === "syscall-response") {
            const syscallId = data.id;
            const lookup = pendingRequests.get(syscallId);
            if (!lookup) {
              throw Error("Invalid request id");
            }
            pendingRequests.delete(syscallId);
            if (data.error) {
              lookup.reject(new Error(data.error));
            } else {
              lookup.resolve(data.result);
            }
          }
        });
        const months = ]]..month_names..[[;
        const days = ]]..day_names..[[;
        const weekStartsSunday = ]]..tostring(week_starts_sunday)..[[;
        let existing = ]]..existing_pages_json..[[;
        const pattern = "]]..path_pattern..[[";
        const root = document.getElementById("jc-container");
        let vDate = new Date();

        function syncTheme() {
            const parentTheme = window.parent.document.documentElement.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', parentTheme);

            const computedStyle = window.parent.getComputedStyle(window.parent.document.documentElement);
            const cssVars = ['--top-background-color', '--modal-border-color', '--root-color', '--ui-accent-color', '--modal-help-background-color'];
            let styleContent = ':root {';
            for (const v of cssVars) {
                styleContent += `${v}: ${computedStyle.getPropertyValue(v)};`;
            }
            styleContent += '}';
            let styleEl = document.getElementById('sb-theme-sync');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'sb-theme-sync';
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = styleContent;
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
                return `<div class="jc-lbl ${isSun ? 'sun' : ''}">${d.slice(0,3)}</div>`;
            }).join('');

            const grid = document.getElementById("jc-days");
            grid.innerHTML = "";
            const firstDay = new Date(y, m, 1).getDay();
            const offset = weekStartsSunday ? firstDay : (firstDay === 0 ? 6 : firstDay - 1);
            const lastDay = new Date(y, m + 1, 0).getDate();

            for(let i=0; i<offset; i++) grid.appendChild(Object.assign(document.createElement("div"), {className:"jc-day empty"}));

            const pageNames = Object.keys(existing);

            for(let i=1; i<=lastDay; i++) {
                const a = document.createElement("a");
                const d = document.createElement("div");
                d.className = "jc-day";
                d.draggable = true;
                const dateObj = new Date(y, m, i);
                const isSun = dateObj.getDay() === 0;
                if(isSun) d.classList.add("sun");
                if(i===now.getDate() && m===now.getMonth() && y===now.getFullYear()) d.classList.add("today");

                const basePath = pattern
                    .replace(/#year#/g, y).replace(/#month#/g, String(m+1).padStart(2,'0'))
                    .replace(/#monthname#/g, months[m]).replace(/#day#/g, String(i).padStart(2,'0'))
                    .replace(/#weekday#/g, days[isSun ? 6 : dateObj.getDay()-1]);
                
                const matchCount = pageNames.filter(name => name.startsWith(basePath)).length;

                if(matchCount > 0) {
                    const dotsContainer = document.createElement("div");
                    dotsContainer.className = "jc-dots-container";
                    const numReds = Math.floor(matchCount / 4);
                    for(let r=0; r<numReds; r++) {
                        dotsContainer.innerHTML += '<div class="jc-dot red"></div>';
                    }
                    const remainder = matchCount % 4;
                    if (remainder > 0) {
                        const colorClass = remainder === 3 ? "orange" : (remainder === 2 ? "yellow" : "green");
                        dotsContainer.innerHTML += `<div class="jc-dot ${colorClass}"></div>`;
                    }
                    d.appendChild(dotsContainer);
                }
                
                d.innerHTML += `<span>${i}</span>`;

                // now use data-ref on the anchor and leave actual navigation to parent injector 
                a.setAttribute('data-ref', basePath);
                a.href = "#";

                d.ondragstart = (e) => {
                    e.dataTransfer.setData("text/plain", "[[" + basePath + "]" + "]");
                    e.dataTransfer.dropEffect = "copy";
                };
                
                a.appendChild(d);
                grid.appendChild(a);
            }
        }
        
        window.addEventListener("sb-journal-update-event", (e) => {
             if (e.detail && e.detail.existing) {
                existing = e.detail.existing;
                render();
            }
        });

        document.getElementById("jc-prev").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth()-1); render(); };
        document.getElementById("jc-next").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth()+1); render(); };
        document.getElementById("jc-today").onclick = () => { 
            vDate = new Date(); 
            // Use postMessage for request-refresh as well
            window.parent.postMessage({
              type: "sb-journal-event",
              source: "FloatingJournalCalendar",
              detail: { action: "request-refresh", source: "FloatingJournalCalendar" }
            }, "*");
            render(); 
        };
        document.getElementById("jc-month").onchange = (e) => { vDate.setDate(1); vDate.setMonth(parseInt(e.target.value)); render(); };
        document.getElementById("jc-year").onchange = (e) => { vDate.setFullYear(parseInt(e.target.value)); render(); };

        syncTheme();
        render();
        new window.parent.MutationObserver(syncTheme).observe(window.parent.document.documentElement, { attributes: true, attributeFilter: ['data-theme']});
    })();
    ]]

    -- 5. Assemble and Show
    full_html = "<style>" .. css .. "</style>" .. html .. "<script>" .. javascript .. "</script>"
    js.import("/.fs/Library/Mr-xRed/UnifiedAdvancedPanelControl.js").show(full_html, "Calendar")

    -- Manual injection into the iframe from the parent window (TOC-style syscall binding)
    local scriptId = "sb-calendar-sidebar-runtime"
    local existing = js.window.document.getElementById(scriptId)
    if existing then existing.remove() end
    local scriptEl = js.window.document.createElement("script")
    scriptEl.id = scriptId

    scriptEl.innerHTML = [[
      (function() {
        const findAndBind = () => {
          const iframe = document.querySelector(".sb-panel iframe");
          if (!iframe || !iframe.contentWindow) {
            setTimeout(findAndBind, 250);
            return;
          }

          try {
            const win = iframe.contentWindow;
            const doc = win.document;
            if (!doc || !doc.body) {
              setTimeout(findAndBind, 250);
              return;
            }

            if (win.__calendarBound) return;
            win.__calendarBound = true;

            const applyLogic = () => {
              const links = doc.querySelectorAll("a[data-ref]");
              links.forEach((el) => {
                const target = el.getAttribute("data-ref") || el.getAttribute("href");
                if (!target) return;

                if (el.__syscallBound) return;
                el.__syscallBound = true;

                el.addEventListener("click", function(e) {
                  e.preventDefault();
                  e.stopPropagation();

                  let path = target.replace(/\.md$/, "");
                  if (!path.startsWith("/")) {
                    path = "/" + path;
                  }

                  // Ctrl/Cmd+click should still produce piped link insertion via existing sb-journal-event listener.
                  if (e.ctrlKey || e.metaKey) {
                    window.postMessage({
                      type: "sb-journal-event",
                      source: "FloatingJournalCalendar",
                      detail: { action: "navigate", path: path, source: "FloatingJournalCalendar", ctrlKey: e.ctrlKey, metaKey: e.metaKey }
                    }, "*");
                    return;
                  }

                  // Prefer calling iframe.syscall('editor.navigate', ...) when available.
                  if (typeof win.syscall === "function") {
                    try {
                      win.syscall('editor.navigate', path, false, false);
                    } catch (err) {
                      // ignore and fallback to posting a syscall-style message
                      window.postMessage({ type: "syscall", id: Date.now(), name: "editor.navigate", args: [path, false, false] }, "*");
                    }
                  } else {
                    // fallback if no syscall function (best effort)
                    window.postMessage({ type: "syscall", id: Date.now(), name: "editor.navigate", args: [path, false, false] }, "*");
                  }
                }, { passive: false });
              });
            };

            applyLogic();

            const observer = new win.MutationObserver(applyLogic);
            observer.observe(doc.body, { childList: true, subtree: true });

            if (!doc.getElementById("calendar-custom-styles-once")) {
              const parentStyles = parent.document.getElementById("custom-styles")?.innerHTML || "";
              const cleanStyles = parentStyles.replace(/<\/?style>/g, "");
              const styleEl = doc.createElement("style");
              styleEl.id = "calendar-custom-styles-once";
              styleEl.innerHTML = cleanStyles;
              doc.head.appendChild(styleEl);
            }

          } catch (err) {
            setTimeout(findAndBind, 500);
          }
        };

        setTimeout(findAndBind, 100);
      })();
    ]]

    js.window.document.body.appendChild(scriptEl)
end

function refreshCalendarDots()
    local frame = js.window.document.querySelector("#sb-float-Floating_Journal_Calendar iframe")
    if not frame then return end

    local all_pages = space.listPages()
    local page_map_items = {}
    for _, p in ipairs(all_pages) do
        table.insert(page_map_items, '"' .. p.name .. '":true')
    end
    local json_str = "{" .. table.concat(page_map_items, ",") .. "}"
    
    local event = js.window.eval([[ (data) => new CustomEvent("sb-journal-update-event", { detail: { existing: data } }) ]])(js.window.JSON.parse(json_str))
    frame.contentWindow.dispatchEvent(event)
end

event.listen { name = "editor:pageLoaded", run = function() refreshCalendarDots() end }

command.define {
    name = "Journal: Floating Calendar (UAPC)",
    run = function() toggleFloatingJournalCalendarUAPC() end
}
```

WORKING, no navigation
```
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

-- Store the event listener globally to avoid re-adding it on every toggle.
if not _G.journalCalendarEventListener then
    _G.journalCalendarEventListener = function(e)
        if e.detail.source == "FloatingJournalCalendar" then
            if e.detail.action == "navigate" and (e.detail.ctrlKey or e.detail.metaKey) then
                -- This listener now ONLY handles the Ctrl/Cmd+Click case for inserting piped links.
                local prefix = e.detail.path
                local sel = editor.getSelection()
                if sel and sel.from ~= sel.to then
                    local selectedText = editor.getText():sub(sel.from + 1, sel.to)
                    editor.replaceRange(sel.from, sel.to, "[[" .. prefix .. "|" .. selectedText .. "]]")
                else
                    editor.insertAtCursor("[[" .. prefix .. "]]")
                end
            elseif e.detail.action == "request-refresh" then
                refreshCalendarDots()
            end
        end
    end
    event.listen({name = "sb-journal-event", run = _G.journalCalendarEventListener})
end

-- Message bridge: listen for postMessage from the iframe and re-dispatch as a CustomEvent
-- so the existing event.listen('sb-journal-event', ...) receives it. One-time install.
if not _G.journalCalendarMessageBridge then
    _G.journalCalendarMessageBridge = true
    js.window.eval([[
      (function(){
        if (window._floatingJournalMessageBridge) return;
        window._floatingJournalMessageBridge = true;
        window.addEventListener('message', function(e) {
          try {
            var data = e.data;
            if (!data) return;
            if (data.type === 'sb-journal-event' && data.source === 'FloatingJournalCalendar') {
              window.dispatchEvent(new CustomEvent('sb-journal-event', { detail: data.detail }));
            }
          } catch (err) {
            // swallow — doesn't break the host
          }
        });
      })();
    ]])
end

function toggleFloatingJournalCalendarUAPC()
    -- 1. Data Gathering
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

    -- 2. CSS for the iframe
    local css = [[
        :root {
            color-scheme: light dark;
        }
        body {
            margin: 0;
            font-family: system-ui, sans-serif;
            background: var(--jc-background, #1d1e20);
            color: var(--jc-text-color, #ffffff);
        }
        a, a:visited {
            color: inherit;
            text-decoration: none;
        }
        html[data-theme="dark"] body {
            --jc-background: var(--top-background-color, #1d1e20);
            --jc-border-color: oklch(from var(--modal-border-color, #555) 0.65 c h / 0.5);
            --jc-elements-background: oklch(0.75 0 0 / 0.1);
            --jc-hover-background: oklch(0.65 0 0 / 0.5);
            --jc-text-color: var(--root-color, #ffffff);
            --jc-accent-color: var(--ui-accent-color, #4a90e2);
            --jc-select-option-background: var(--modal-help-background-color, #333);
        }
        html[data-theme="light"] body {
            --jc-background: var(--top-background-color, #ffffff);
            --jc-border-color: oklch(from var(--modal-border-color, #ccc) 0.65 c h / 0.5);
            --jc-elements-background: oklch(0.75 0 0 / 0.2);
            --jc-hover-background: oklch(0.75 0 0 / 0.6);
            --jc-text-color: var(--root-color, #000000);
            --jc-accent-color: var(--ui-accent-color, #1a73e8);
            --jc-select-option-background: var(--modal-help-background-color, #f0f0f0);
        }
        .jc-card {
            background: var(--jc-background);
            color: var(--jc-text-color);
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .jc-header {
            padding: 6px 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
        }
        .jc-nav-btn, .jc-today-btn {
            background: var(--jc-elements-background);
            color: var(--jc-text-color);
            border: 1px solid var(--jc-border-color);
            border-radius: 6px;
            padding: 2px 6px;
            cursor: pointer;
            font-size: 0.85em;
        }
        .jc-nav-btn:hover, .jc-today-btn:hover { background: var(--jc-hover-background); }
        .jc-selectors { display: flex; gap: 4px; align-items: center; }
        .jc-select {
            background: var(--jc-elements-background);
            color: var(--jc-text-color);
            border: 1px solid var(--jc-border-color);
            border-radius: 6px;
            font-size: 0.8em;
            padding: 2px 4px;
            cursor: pointer;
        }
        .jc-select option { background: var(--jc-select-option-background); }
        .jc-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; padding: 6px; }
        .jc-lbl { font-size: 0.7em; opacity: 0.6; text-align: center; font-weight: bold; }
        .jc-lbl.sun { color: oklch(0.65 0.18 30); opacity: 1; }
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
        .jc-day:hover { background: var(--jc-hover-background); }
        .jc-day.sun { color: oklch(0.6 0.2 30); font-weight: bold; }
        .jc-day.today { outline: 2px solid var(--jc-accent-color); outline-offset: -2px; font-weight: bold; }
        .jc-day.empty { background: transparent; }
        .jc-dots-container { display: flex; gap: 2px; position: absolute; bottom: 5px; justify-content: center; width: 100%; }
        .jc-dot { width: 4px; height: 4px; border-radius: 50%; box-shadow: 1px 1px 2px oklch(0 0 0 / 0.5); }
        .jc-dot.green { background: oklch(0.6 0.18 145); }
        .jc-dot.yellow { background: oklch(0.95 0.18 95); }
        .jc-dot.orange { background: oklch(0.8 0.20 55); }
        .jc-dot.red { background: oklch(0.6 0.2 10); }
    ]]

    -- 3. HTML for the calendar body
    local html = [[
        <div class="jc-card" id="jc-container">
            <div class="jc-header">
                <button class="jc-nav-btn" id="jc-prev">‹</button>
                <div class="jc-selectors">
                    <select id="jc-month" class="jc-select"></select>
                    <select id="jc-year" class="jc-select"></select>
                    <button class="jc-today-btn" id="jc-today" title="Jump to Today & Refresh">↺</button>
                </div>
                <button class="jc-nav-btn" id="jc-next">›</button>
            </div>
            <div class="jc-grid" id="jc-labels"></div>
            <div class="jc-grid" id="jc-days"></div>
        </div>
    ]]

    -- 4. JavaScript for the iframe
    local javascript = [[
    (function() {
        const pendingRequests = new Map();
        let syscallReqId = 0;

        globalThis.syscall = async (name, ...args) => {
          return await new Promise((resolve, reject) => {
            syscallReqId++;
            pendingRequests.set(syscallReqId, { resolve, reject });
            globalThis.parent.postMessage({
              type: "syscall",
              id: syscallReqId,
              name,
              args,
            }, "*");
          });
        };

        globalThis.addEventListener("message", (message) => {
          const data = message.data;
          if (data.type === "syscall-response") {
            const syscallId = data.id;
            const lookup = pendingRequests.get(syscallId);
            if (!lookup) {
              throw Error("Invalid request id");
            }
            pendingRequests.delete(syscallId);
            if (data.error) {
              lookup.reject(new Error(data.error));
            } else {
              lookup.resolve(data.result);
            }
          }
        });
        const months = ]]..month_names..[[;
        const days = ]]..day_names..[[;
        const weekStartsSunday = ]]..tostring(week_starts_sunday)..[[;
        let existing = ]]..existing_pages_json..[[;
        const pattern = "]]..path_pattern..[[";
        const root = document.getElementById("jc-container");
        let vDate = new Date();

        function syncTheme() {
            const parentTheme = window.parent.document.documentElement.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', parentTheme);

            const computedStyle = window.parent.getComputedStyle(window.parent.document.documentElement);
            const cssVars = ['--top-background-color', '--modal-border-color', '--root-color', '--ui-accent-color', '--modal-help-background-color'];
            let styleContent = ':root {';
            for (const v of cssVars) {
                styleContent += `${v}: ${computedStyle.getPropertyValue(v)};`;
            }
            styleContent += '}';
            let styleEl = document.getElementById('sb-theme-sync');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'sb-theme-sync';
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = styleContent;
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
                return `<div class="jc-lbl ${isSun ? 'sun' : ''}">${d.slice(0,3)}</div>`;
            }).join('');

            const grid = document.getElementById("jc-days");
            grid.innerHTML = "";
            const firstDay = new Date(y, m, 1).getDay();
            const offset = weekStartsSunday ? firstDay : (firstDay === 0 ? 6 : firstDay - 1);
            const lastDay = new Date(y, m + 1, 0).getDate();

            for(let i=0; i<offset; i++) grid.appendChild(Object.assign(document.createElement("div"), {className:"jc-day empty"}));

            const pageNames = Object.keys(existing);

            for(let i=1; i<=lastDay; i++) {
                const a = document.createElement("a");
                const d = document.createElement("div");
                d.className = "jc-day";
                d.draggable = true;
                const dateObj = new Date(y, m, i);
                const isSun = dateObj.getDay() === 0;
                if(isSun) d.classList.add("sun");
                if(i===now.getDate() && m===now.getMonth() && y===now.getFullYear()) d.classList.add("today");

                const basePath = pattern
                    .replace(/#year#/g, y).replace(/#month#/g, String(m+1).padStart(2,'0'))
                    .replace(/#monthname#/g, months[m]).replace(/#day#/g, String(i).padStart(2,'0'))
                    .replace(/#weekday#/g, days[isSun ? 6 : dateObj.getDay()-1]);
                
                const matchCount = pageNames.filter(name => name.startsWith(basePath)).length;

                if(matchCount > 0) {
                    const dotsContainer = document.createElement("div");
                    dotsContainer.className = "jc-dots-container";
                    const numReds = Math.floor(matchCount / 4);
                    for(let r=0; r<numReds; r++) {
                        dotsContainer.innerHTML += '<div class="jc-dot red"></div>';
                    }
                    const remainder = matchCount % 4;
                    if (remainder > 0) {
                        const colorClass = remainder === 3 ? "orange" : (remainder === 2 ? "yellow" : "green");
                        dotsContainer.innerHTML += `<div class="jc-dot ${colorClass}"></div>`;
                    }
                    d.appendChild(dotsContainer);
                }
                
                d.innerHTML += `<span>${i}</span>`;
                
                d.onclick = (e) => {
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        // Use postMessage to cross iframe boundary reliably
                        window.parent.postMessage({
                          type: "sb-journal-event",
                          source: "FloatingJournalCalendar",
                          detail: { action:"navigate", path: basePath, source: "FloatingJournalCalendar", ctrlKey: e.ctrlKey, metaKey: e.metaKey }
                        }, "*");
                    } else {
                        // Ensure the path passed to editor.navigate starts with a leading slash.
                        const navPath = basePath.startsWith('/') ? basePath : '/' + basePath;
                        syscall('editor.navigate', navPath, false, false);
                    }
                };
                d.ondragstart = (e) => {
                    e.dataTransfer.setData("text/plain", "[[" + basePath + "]" + "]");
                    e.dataTransfer.dropEffect = "copy";
                };
                
                a.appendChild(d);
                grid.appendChild(a);
            }
        }
        
        window.addEventListener("sb-journal-update-event", (e) => {
             if (e.detail && e.detail.existing) {
                existing = e.detail.existing;
                render();
            }
        });

        document.getElementById("jc-prev").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth()-1); render(); };
        document.getElementById("jc-next").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth()+1); render(); };
        document.getElementById("jc-today").onclick = () => { 
            vDate = new Date(); 
            // Use postMessage for request-refresh as well
            window.parent.postMessage({
              type: "sb-journal-event",
              source: "FloatingJournalCalendar",
              detail: { action: "request-refresh", source: "FloatingJournalCalendar" }
            }, "*");
            render(); 
        };
        document.getElementById("jc-month").onchange = (e) => { vDate.setDate(1); vDate.setMonth(parseInt(e.target.value)); render(); };
        document.getElementById("jc-year").onchange = (e) => { vDate.setFullYear(parseInt(e.target.value)); render(); };

        syncTheme();
        render();
        new window.parent.MutationObserver(syncTheme).observe(window.parent.document.documentElement, { attributes: true, attributeFilter: ['data-theme']});
    })();
    ]]

    -- 5. Assemble and Show
    full_html = "<style>" .. css .. "</style>" .. html .. "<script>" .. javascript .. "</script>"
    js.import("/.fs/Library/Mr-xRed/UnifiedAdvancedPanelControl.js").show(full_html, "Calendar")
end

function refreshCalendarDots()
    local frame = js.window.document.querySelector("#sb-float-Floating_Journal_Calendar iframe")
    if not frame then return end

    local all_pages = space.listPages()
    local page_map_items = {}
    for _, p in ipairs(all_pages) do
        table.insert(page_map_items, '"' .. p.name .. '":true')
    end
    local json_str = "{" .. table.concat(page_map_items, ",") .. "}"
    
    local event = js.window.eval([[ (data) => new CustomEvent("sb-journal-update-event", { detail: { existing: data } }) ]])(js.window.JSON.parse(json_str))
    frame.contentWindow.dispatchEvent(event)
end

event.listen { name = "editor:pageLoaded", run = function() refreshCalendarDots() end }

command.define {
    name = "Journal: Floating Calendar (UAPC)",
    run = function() toggleFloatingJournalCalendarUAPC() end
}
```


```
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

-- Store the event listener globally to avoid re-adding it on every toggle.
if not _G.journalCalendarEventListener then
    _G.journalCalendarEventListener = function(e)
        if e.detail.source == "FloatingJournalCalendar" then
            if e.detail.action == "navigate" and (e.detail.ctrlKey or e.detail.metaKey) then
                -- This listener now ONLY handles the Ctrl/Cmd+Click case for inserting piped links.
                local prefix = e.detail.path
                local sel = editor.getSelection()
                if sel and sel.from ~= sel.to then
                    local selectedText = editor.getText():sub(sel.from + 1, sel.to)
                    editor.replaceRange(sel.from, sel.to, "[[" .. prefix .. "|" .. selectedText .. "]]")
                else
                    editor.insertAtCursor("[[" .. prefix .. "]]")
                end
            elseif e.detail.action == "request-refresh" then
                refreshCalendarDots()
            end
        end
    end
    event.listen({name = "sb-journal-event", run = _G.journalCalendarEventListener})
end

-- Message bridge: listen for postMessage from the iframe and re-dispatch as a CustomEvent
-- so the existing event.listen('sb-journal-event', ...) receives it. One-time install.
if not _G.journalCalendarMessageBridge then
    _G.journalCalendarMessageBridge = true
    js.window.eval([[
      (function(){
        if (window._floatingJournalMessageBridge) return;
        window._floatingJournalMessageBridge = true;
        window.addEventListener('message', function(e) {
          try {
            var data = e.data;
            if (!data) return;
            if (data.type === 'sb-journal-event' && data.source === 'FloatingJournalCalendar') {
              window.dispatchEvent(new CustomEvent('sb-journal-event', { detail: data.detail }));
            }
          } catch (err) {
            // swallow — doesn't break the host
          }
        });
      })();
    ]])
end

function toggleFloatingJournalCalendarUAPC()
    -- 1. Data Gathering
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

    -- 2. CSS for the iframe
    local css = [[
        :root {
            color-scheme: light dark;
        }
        body {
            margin: 0;
            font-family: system-ui, sans-serif;
            background: var(--jc-background, #1d1e20);
            color: var(--jc-text-color, #ffffff);
        }
        a, a:visited {
            color: inherit;
            text-decoration: none;
        }
        html[data-theme="dark"] body {
            --jc-background: var(--top-background-color, #1d1e20);
            --jc-border-color: oklch(from var(--modal-border-color, #555) 0.65 c h / 0.5);
            --jc-elements-background: oklch(0.75 0 0 / 0.1);
            --jc-hover-background: oklch(0.65 0 0 / 0.5);
            --jc-text-color: var(--root-color, #ffffff);
            --jc-accent-color: var(--ui-accent-color, #4a90e2);
            --jc-select-option-background: var(--modal-help-background-color, #333);
        }
        html[data-theme="light"] body {
            --jc-background: var(--top-background-color, #ffffff);
            --jc-border-color: oklch(from var(--modal-border-color, #ccc) 0.65 c h / 0.5);
            --jc-elements-background: oklch(0.75 0 0 / 0.2);
            --jc-hover-background: oklch(0.75 0 0 / 0.6);
            --jc-text-color: var(--root-color, #000000);
            --jc-accent-color: var(--ui-accent-color, #1a73e8);
            --jc-select-option-background: var(--modal-help-background-color, #f0f0f0);
        }
        .jc-card {
            background: var(--jc-background);
            color: var(--jc-text-color);
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .jc-header {
            padding: 6px 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
        }
        .jc-nav-btn, .jc-today-btn {
            background: var(--jc-elements-background);
            color: var(--jc-text-color);
            border: 1px solid var(--jc-border-color);
            border-radius: 6px;
            padding: 2px 6px;
            cursor: pointer;
            font-size: 0.85em;
        }
        .jc-nav-btn:hover, .jc-today-btn:hover { background: var(--jc-hover-background); }
        .jc-selectors { display: flex; gap: 4px; align-items: center; }
        .jc-select {
            background: var(--jc-elements-background);
            color: var(--jc-text-color);
            border: 1px solid var(--jc-border-color);
            border-radius: 6px;
            font-size: 0.8em;
            padding: 2px 4px;
            cursor: pointer;
        }
        .jc-select option { background: var(--jc-select-option-background); }
        .jc-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; padding: 6px; }
        .jc-lbl { font-size: 0.7em; opacity: 0.6; text-align: center; font-weight: bold; }
        .jc-lbl.sun { color: oklch(0.65 0.18 30); opacity: 1; }
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
        .jc-day:hover { background: var(--jc-hover-background); }
        .jc-day.sun { color: oklch(0.6 0.2 30); font-weight: bold; }
        .jc-day.today { outline: 2px solid var(--jc-accent-color); outline-offset: -2px; font-weight: bold; }
        .jc-day.empty { background: transparent; }
        .jc-dots-container { display: flex; gap: 2px; position: absolute; bottom: 5px; justify-content: center; width: 100%; }
        .jc-dot { width: 4px; height: 4px; border-radius: 50%; box-shadow: 1px 1px 2px oklch(0 0 0 / 0.5); }
        .jc-dot.green { background: oklch(0.6 0.18 145); }
        .jc-dot.yellow { background: oklch(0.95 0.18 95); }
        .jc-dot.orange { background: oklch(0.8 0.20 55); }
        .jc-dot.red { background: oklch(0.6 0.2 10); }
    ]]

    -- 3. HTML for the calendar body
    local html = [[
        <div class="jc-card" id="jc-container">
            <div class="jc-header">
                <button class="jc-nav-btn" id="jc-prev">‹</button>
                <div class="jc-selectors">
                    <select id="jc-month" class="jc-select"></select>
                    <select id="jc-year" class="jc-select"></select>
                    <button class="jc-today-btn" id="jc-today" title="Jump to Today & Refresh">↺</button>
                </div>
                <button class="jc-nav-btn" id="jc-next">›</button>
            </div>
            <div class="jc-grid" id="jc-labels"></div>
            <div class="jc-grid" id="jc-days"></div>
        </div>
    ]]

    -- 4. JavaScript for the iframe
    local javascript = [[
    (function() {
        const pendingRequests = new Map();
        let syscallReqId = 0;

        globalThis.syscall = async (name, ...args) => {
          return await new Promise((resolve, reject) => {
            syscallReqId++;
            pendingRequests.set(syscallReqId, { resolve, reject });
            globalThis.parent.postMessage({
              type: "syscall",
              id: syscallReqId,
              name,
              args,
            }, "*");
          });
        };

        globalThis.addEventListener("message", (message) => {
          const data = message.data;
          if (data.type === "syscall-response") {
            const syscallId = data.id;
            const lookup = pendingRequests.get(syscallId);
            if (!lookup) {
              throw Error("Invalid request id");
            }
            pendingRequests.delete(syscallId);
            if (data.error) {
              lookup.reject(new Error(data.error));
            } else {
              lookup.resolve(data.result);
            }
          }
        });
        const months = ]]..month_names..[[;
        const days = ]]..day_names..[[;
        const weekStartsSunday = ]]..tostring(week_starts_sunday)..[[;
        let existing = ]]..existing_pages_json..[[;
        const pattern = "]]..path_pattern..[[";
        const root = document.getElementById("jc-container");
        let vDate = new Date();

        function syncTheme() {
            const parentTheme = window.parent.document.documentElement.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', parentTheme);

            const computedStyle = window.parent.getComputedStyle(window.parent.document.documentElement);
            const cssVars = ['--top-background-color', '--modal-border-color', '--root-color', '--ui-accent-color', '--modal-help-background-color'];
            let styleContent = ':root {';
            for (const v of cssVars) {
                styleContent += `${v}: ${computedStyle.getPropertyValue(v)};`;
            }
            styleContent += '}';
            let styleEl = document.getElementById('sb-theme-sync');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'sb-theme-sync';
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = styleContent;
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
                return `<div class="jc-lbl ${isSun ? 'sun' : ''}">${d.slice(0,3)}</div>`;
            }).join('');

            const grid = document.getElementById("jc-days");
            grid.innerHTML = "";
            const firstDay = new Date(y, m, 1).getDay();
            const offset = weekStartsSunday ? firstDay : (firstDay === 0 ? 6 : firstDay - 1);
            const lastDay = new Date(y, m + 1, 0).getDate();

            for(let i=0; i<offset; i++) grid.appendChild(Object.assign(document.createElement("div"), {className:"jc-day empty"}));

            const pageNames = Object.keys(existing);

            for(let i=1; i<=lastDay; i++) {
                const a = document.createElement("a");
                const d = document.createElement("div");
                d.className = "jc-day";
                d.draggable = true;
                const dateObj = new Date(y, m, i);
                const isSun = dateObj.getDay() === 0;
                if(isSun) d.classList.add("sun");
                if(i===now.getDate() && m===now.getMonth() && y===now.getFullYear()) d.classList.add("today");

                const basePath = pattern
                    .replace(/#year#/g, y).replace(/#month#/g, String(m+1).padStart(2,'0'))
                    .replace(/#monthname#/g, months[m]).replace(/#day#/g, String(i).padStart(2,'0'))
                    .replace(/#weekday#/g, days[isSun ? 6 : dateObj.getDay()-1]);
                
                const matchCount = pageNames.filter(name => name.startsWith(basePath)).length;

                if(matchCount > 0) {
                    const dotsContainer = document.createElement("div");
                    dotsContainer.className = "jc-dots-container";
                    const numReds = Math.floor(matchCount / 4);
                    for(let r=0; r<numReds; r++) {
                        dotsContainer.innerHTML += '<div class="jc-dot red"></div>';
                    }
                    const remainder = matchCount % 4;
                    if (remainder > 0) {
                        const colorClass = remainder === 3 ? "orange" : (remainder === 2 ? "yellow" : "green");
                        dotsContainer.innerHTML += `<div class="jc-dot ${colorClass}"></div>`;
                    }
                    d.appendChild(dotsContainer);
                }
                
                d.innerHTML += `<span>${i}</span>`;
                
                d.onclick = (e) => {
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        // Use postMessage to cross iframe boundary reliably
                        window.parent.postMessage({
                          type: "sb-journal-event",
                          source: "FloatingJournalCalendar",
                          detail: { action:"navigate", path: basePath, source: "FloatingJournalCalendar", ctrlKey: e.ctrlKey, metaKey: e.metaKey }
                        }, "*");
                    } else {
                        syscall('editor.navigate', basePath, false, false);
                    }
                };
                d.ondragstart = (e) => {
                    e.dataTransfer.setData("text/plain", "[[" + basePath + "]" + "]");
                    e.dataTransfer.dropEffect = "copy";
                };
                
                a.appendChild(d);
                grid.appendChild(a);
            }
        }
        
        window.addEventListener("sb-journal-update-event", (e) => {
             if (e.detail && e.detail.existing) {
                existing = e.detail.existing;
                render();
            }
        });

        document.getElementById("jc-prev").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth()-1); render(); };
        document.getElementById("jc-next").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth()+1); render(); };
        document.getElementById("jc-today").onclick = () => { 
            vDate = new Date(); 
            // Use postMessage for request-refresh as well
            window.parent.postMessage({
              type: "sb-journal-event",
              source: "FloatingJournalCalendar",
              detail: { action: "request-refresh", source: "FloatingJournalCalendar" }
            }, "*");
            render(); 
        };
        document.getElementById("jc-month").onchange = (e) => { vDate.setDate(1); vDate.setMonth(parseInt(e.target.value)); render(); };
        document.getElementById("jc-year").onchange = (e) => { vDate.setFullYear(parseInt(e.target.value)); render(); };

        syncTheme();
        render();
        new window.parent.MutationObserver(syncTheme).observe(window.parent.document.documentElement, { attributes: true, attributeFilter: ['data-theme']});
    })();
    ]]

    -- 5. Assemble and Show
    full_html = "<style>" .. css .. "</style>" .. html .. "<script>" .. javascript .. "</script>"
    js.import("/.fs/Library/Mr-xRed/UnifiedAdvancedPanelControl.js").show(full_html, "Calendar")
end

function refreshCalendarDots()
    local frame = js.window.document.querySelector("#sb-float-Floating_Journal_Calendar iframe")
    if not frame then return end

    local all_pages = space.listPages()
    local page_map_items = {}
    for _, p in ipairs(all_pages) do
        table.insert(page_map_items, '"' .. p.name .. '":true')
    end
    local json_str = "{" .. table.concat(page_map_items, ",") .. "}"
    
    local event = js.window.eval([[ (data) => new CustomEvent("sb-journal-update-event", { detail: { existing: data } }) ]])(js.window.JSON.parse(json_str))
    frame.contentWindow.dispatchEvent(event)
end

event.listen { name = "editor:pageLoaded", run = function() refreshCalendarDots() end }

command.define {
    name = "Journal: Floating Calendar (UAPC)",
    run = function() toggleFloatingJournalCalendarUAPC() end
}
```

```
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

-- Store the event listener globally to avoid re-adding it on every toggle.
if not _G.journalCalendarEventListener then
    _G.journalCalendarEventListener = function(e)
        if e.detail.source == "FloatingJournalCalendar" then
            if e.detail.action == "navigate" and (e.detail.ctrlKey or e.detail.metaKey) then
                -- This listener now ONLY handles the Ctrl/Cmd+Click case for inserting piped links.
                local prefix = e.detail.path
                local sel = editor.getSelection()
                if sel and sel.from ~= sel.to then
                    local selectedText = editor.getText():sub(sel.from + 1, sel.to)
                    editor.replaceRange(sel.from, sel.to, "[[" .. prefix .. "|" .. selectedText .. "]]")
                else
                    editor.insertAtCursor("[[" .. prefix .. "]]")
                end
            elseif e.detail.action == "request-refresh" then
                refreshCalendarDots()
            end
        end
    end
    event.listen({name = "sb-journal-event", run = _G.journalCalendarEventListener})
end

function toggleFloatingJournalCalendarUAPC()
    -- 1. Data Gathering
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

    -- 2. CSS for the iframe
    local css = [[
        :root {
            color-scheme: light dark;
        }
        body {
            margin: 0;
            font-family: system-ui, sans-serif;
            background: var(--jc-background, #1d1e20);
            color: var(--jc-text-color, #ffffff);
        }
        a, a:visited {
            color: inherit;
            text-decoration: none;
        }
        html[data-theme="dark"] body {
            --jc-background: var(--top-background-color, #1d1e20);
            --jc-border-color: oklch(from var(--modal-border-color, #555) 0.65 c h / 0.5);
            --jc-elements-background: oklch(0.75 0 0 / 0.1);
            --jc-hover-background: oklch(0.65 0 0 / 0.5);
            --jc-text-color: var(--root-color, #ffffff);
            --jc-accent-color: var(--ui-accent-color, #4a90e2);
            --jc-select-option-background: var(--modal-help-background-color, #333);
        }
        html[data-theme="light"] body {
            --jc-background: var(--top-background-color, #ffffff);
            --jc-border-color: oklch(from var(--modal-border-color, #ccc) 0.65 c h / 0.5);
            --jc-elements-background: oklch(0.75 0 0 / 0.2);
            --jc-hover-background: oklch(0.75 0 0 / 0.6);
            --jc-text-color: var(--root-color, #000000);
            --jc-accent-color: var(--ui-accent-color, #1a73e8);
            --jc-select-option-background: var(--modal-help-background-color, #f0f0f0);
        }
        .jc-card {
            background: var(--jc-background);
            color: var(--jc-text-color);
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .jc-header {
            padding: 6px 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
        }
        .jc-nav-btn, .jc-today-btn {
            background: var(--jc-elements-background);
            color: var(--jc-text-color);
            border: 1px solid var(--jc-border-color);
            border-radius: 6px;
            padding: 2px 6px;
            cursor: pointer;
            font-size: 0.85em;
        }
        .jc-nav-btn:hover, .jc-today-btn:hover { background: var(--jc-hover-background); }
        .jc-selectors { display: flex; gap: 4px; align-items: center; }
        .jc-select {
            background: var(--jc-elements-background);
            color: var(--jc-text-color);
            border: 1px solid var(--jc-border-color);
            border-radius: 6px;
            font-size: 0.8em;
            padding: 2px 4px;
            cursor: pointer;
        }
        .jc-select option { background: var(--jc-select-option-background); }
        .jc-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; padding: 6px; }
        .jc-lbl { font-size: 0.7em; opacity: 0.6; text-align: center; font-weight: bold; }
        .jc-lbl.sun { color: oklch(0.65 0.18 30); opacity: 1; }
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
        .jc-day:hover { background: var(--jc-hover-background); }
        .jc-day.sun { color: oklch(0.6 0.2 30); font-weight: bold; }
        .jc-day.today { outline: 2px solid var(--jc-accent-color); outline-offset: -2px; font-weight: bold; }
        .jc-day.empty { background: transparent; }
        .jc-dots-container { display: flex; gap: 2px; position: absolute; bottom: 5px; justify-content: center; width: 100%; }
        .jc-dot { width: 4px; height: 4px; border-radius: 50%; box-shadow: 1px 1px 2px oklch(0 0 0 / 0.5); }
        .jc-dot.green { background: oklch(0.6 0.18 145); }
        .jc-dot.yellow { background: oklch(0.95 0.18 95); }
        .jc-dot.orange { background: oklch(0.8 0.20 55); }
        .jc-dot.red { background: oklch(0.6 0.2 10); }
    ]]

    -- 3. HTML for the calendar body
    local html = [[
        <div class="jc-card" id="jc-container">
            <div class="jc-header">
                <button class="jc-nav-btn" id="jc-prev">‹</button>
                <div class="jc-selectors">
                    <select id="jc-month" class="jc-select"></select>
                    <select id="jc-year" class="jc-select"></select>
                    <button class="jc-today-btn" id="jc-today" title="Jump to Today & Refresh">↺</button>
                </div>
                <button class="jc-nav-btn" id="jc-next">›</button>
            </div>
            <div class="jc-grid" id="jc-labels"></div>
            <div class="jc-grid" id="jc-days"></div>
        </div>
    ]]

    -- 4. JavaScript for the iframe
    local javascript = [[
    (function() {
        const pendingRequests = new Map();
        let syscallReqId = 0;

        globalThis.syscall = async (name, ...args) => {
          return await new Promise((resolve, reject) => {
            syscallReqId++;
            pendingRequests.set(syscallReqId, { resolve, reject });
            globalThis.parent.postMessage({
              type: "syscall",
              id: syscallReqId,
              name,
              args,
            }, "*");
          });
        };

        globalThis.addEventListener("message", (message) => {
          const data = message.data;
          if (data.type === "syscall-response") {
            const syscallId = data.id;
            const lookup = pendingRequests.get(syscallId);
            if (!lookup) {
              throw Error("Invalid request id");
            }
            pendingRequests.delete(syscallId);
            if (data.error) {
              lookup.reject(new Error(data.error));
            } else {
              lookup.resolve(data.result);
            }
          }
        });
        const months = ]]..month_names..[[;
        const days = ]]..day_names..[[;
        const weekStartsSunday = ]]..tostring(week_starts_sunday)..[[;
        let existing = ]]..existing_pages_json..[[;
        const pattern = "]]..path_pattern..[[";
        const root = document.getElementById("jc-container");
        let vDate = new Date();

        function syncTheme() {
            const parentTheme = window.parent.document.documentElement.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', parentTheme);

            const computedStyle = window.parent.getComputedStyle(window.parent.document.documentElement);
            const cssVars = ['--top-background-color', '--modal-border-color', '--root-color', '--ui-accent-color', '--modal-help-background-color'];
            let styleContent = ':root {';
            for (const v of cssVars) {
                styleContent += `${v}: ${computedStyle.getPropertyValue(v)};`;
            }
            styleContent += '}';
            let styleEl = document.getElementById('sb-theme-sync');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'sb-theme-sync';
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = styleContent;
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
                return `<div class="jc-lbl ${isSun ? 'sun' : ''}">${d.slice(0,3)}</div>`;
            }).join('');

            const grid = document.getElementById("jc-days");
            grid.innerHTML = "";
            const firstDay = new Date(y, m, 1).getDay();
            const offset = weekStartsSunday ? firstDay : (firstDay === 0 ? 6 : firstDay - 1);
            const lastDay = new Date(y, m + 1, 0).getDate();

            for(let i=0; i<offset; i++) grid.appendChild(Object.assign(document.createElement("div"), {className:"jc-day empty"}));

            const pageNames = Object.keys(existing);

            for(let i=1; i<=lastDay; i++) {
                const a = document.createElement("a");
                const d = document.createElement("div");
                d.className = "jc-day";
                d.draggable = true;
                const dateObj = new Date(y, m, i);
                const isSun = dateObj.getDay() === 0;
                if(isSun) d.classList.add("sun");
                if(i===now.getDate() && m===now.getMonth() && y===now.getFullYear()) d.classList.add("today");

                const basePath = pattern
                    .replace(/#year#/g, y).replace(/#month#/g, String(m+1).padStart(2,'0'))
                    .replace(/#monthname#/g, months[m]).replace(/#day#/g, String(i).padStart(2,'0'))
                    .replace(/#weekday#/g, days[isSun ? 6 : dateObj.getDay()-1]);
                
                const matchCount = pageNames.filter(name => name.startsWith(basePath)).length;

                if(matchCount > 0) {
                    const dotsContainer = document.createElement("div");
                    dotsContainer.className = "jc-dots-container";
                    const numReds = Math.floor(matchCount / 4);
                    for(let r=0; r<numReds; r++) {
                        dotsContainer.innerHTML += '<div class="jc-dot red"></div>';
                    }
                    const remainder = matchCount % 4;
                    if (remainder > 0) {
                        const colorClass = remainder === 3 ? "orange" : (remainder === 2 ? "yellow" : "green");
                        dotsContainer.innerHTML += `<div class="jc-dot ${colorClass}"></div>`;
                    }
                    d.appendChild(dotsContainer);
                }
                
                d.innerHTML += `<span>${i}</span>`;
                
                d.onclick = (e) => {
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        window.parent.dispatchEvent(new CustomEvent("sb-journal-event", { detail: { action:"navigate", path: basePath, source: "FloatingJournalCalendar", ctrlKey: e.ctrlKey, metaKey: e.metaKey }}));
                    } else {
                        syscall('editor.navigate', basePath, false, false);
                    }
                };
                d.ondragstart = (e) => {
                    e.dataTransfer.setData("text/plain", "[[" + basePath + "]" + "]");
                    e.dataTransfer.dropEffect = "copy";
                };
                
                a.appendChild(d);
                grid.appendChild(a);
            }
        }
        
        window.addEventListener("sb-journal-update-event", (e) => {
             if (e.detail && e.detail.existing) {
                existing = e.detail.existing;
                render();
            }
        });

        document.getElementById("jc-prev").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth()-1); render(); };
        document.getElementById("jc-next").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth()+1); render(); };
        document.getElementById("jc-today").onclick = () => { 
            vDate = new Date(); 
            window.parent.dispatchEvent(new CustomEvent("sb-journal-event", { detail: { action: "request-refresh", source: "FloatingJournalCalendar" }}));
            render(); 
        };
        document.getElementById("jc-month").onchange = (e) => { vDate.setDate(1); vDate.setMonth(parseInt(e.target.value)); render(); };
        document.getElementById("jc-year").onchange = (e) => { vDate.setFullYear(parseInt(e.target.value)); render(); };

        syncTheme();
        render();
        new window.parent.MutationObserver(syncTheme).observe(window.parent.document.documentElement, { attributes: true, attributeFilter: ['data-theme']});
    })();
    ]]

    -- 5. Assemble and Show
    full_html = "<style>" .. css .. "</style>" .. html .. "<script>" .. javascript .. "</script>"
    js.import("/.fs/Library/Mr-xRed/UnifiedAdvancedPanelControl.js").show(full_html, "Calendar")
end

function refreshCalendarDots()
    local frame = js.window.document.querySelector("#sb-float-Floating_Journal_Calendar iframe")
    if not frame then return end

    local all_pages = space.listPages()
    local page_map_items = {}
    for _, p in ipairs(all_pages) do
        table.insert(page_map_items, '"' .. p.name .. '":true')
    end
    local json_str = "{" .. table.concat(page_map_items, ",") .. "}"
    
    local event = js.window.eval([[ (data) => new CustomEvent("sb-journal-update-event", { detail: { existing: data } }) ]])(js.window.JSON.parse(json_str))
    frame.contentWindow.dispatchEvent(event)
end

event.listen { name = "editor:pageLoaded", run = function() refreshCalendarDots() end }

command.define {
    name = "Journal: Floating Calendar (UAPC)",
    run = function() toggleFloatingJournalCalendarUAPC() end
}
```


```

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

-- Store the event listener globally to avoid re-adding it on every toggle.
if not _G.journalCalendarEventListener then
    _G.journalCalendarEventListener = function(e)
        if e.detail.source == "FloatingJournalCalendar" then
            if e.detail.action == "navigate" and (e.detail.ctrlKey or e.detail.metaKey) then
                -- This listener now ONLY handles the Ctrl/Cmd+Click case for inserting piped links.
                local prefix = e.detail.path
                local sel = editor.getSelection()
                if sel and sel.from ~= sel.to then
                    local selectedText = editor.getText():sub(sel.from + 1, sel.to)
                    editor.replaceRange(sel.from, sel.to, "[[" .. prefix .. "|" .. selectedText .. "]]")
                else
                    editor.insertAtCursor("[[" .. prefix .. "]]")
                end
            elseif e.detail.action == "request-refresh" then
                refreshCalendarDots()
            end
        end
    end
    event.listen({name = "sb-journal-event", run = _G.journalCalendarEventListener})
end

function toggleFloatingJournalCalendarUAPC()
    -- 1. Data Gathering
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

    -- 2. CSS for the iframe
    local css = [[
        :root {
            color-scheme: light dark;
        }
        body {
            margin: 0;
            font-family: system-ui, sans-serif;
            background: var(--jc-background, #1d1e20);
            color: var(--jc-text-color, #ffffff);
        }
        a, a:visited {
            color: inherit;
            text-decoration: none;
        }
        html[data-theme="dark"] body {
            --jc-background: var(--top-background-color, #1d1e20);
            --jc-border-color: oklch(from var(--modal-border-color, #555) 0.65 c h / 0.5);
            --jc-elements-background: oklch(0.75 0 0 / 0.1);
            --jc-hover-background: oklch(0.65 0 0 / 0.5);
            --jc-text-color: var(--root-color, #ffffff);
            --jc-accent-color: var(--ui-accent-color, #4a90e2);
            --jc-select-option-background: var(--modal-help-background-color, #333);
        }
        html[data-theme="light"] body {
            --jc-background: var(--top-background-color, #ffffff);
            --jc-border-color: oklch(from var(--modal-border-color, #ccc) 0.65 c h / 0.5);
            --jc-elements-background: oklch(0.75 0 0 / 0.2);
            --jc-hover-background: oklch(0.75 0 0 / 0.6);
            --jc-text-color: var(--root-color, #000000);
            --jc-accent-color: var(--ui-accent-color, #1a73e8);
            --jc-select-option-background: var(--modal-help-background-color, #f0f0f0);
        }
        .jc-card {
            background: var(--jc-background);
            color: var(--jc-text-color);
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .jc-header {
            padding: 6px 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
        }
        .jc-nav-btn, .jc-today-btn {
            background: var(--jc-elements-background);
            color: var(--jc-text-color);
            border: 1px solid var(--jc-border-color);
            border-radius: 6px;
            padding: 2px 6px;
            cursor: pointer;
            font-size: 0.85em;
        }
        .jc-nav-btn:hover, .jc-today-btn:hover { background: var(--jc-hover-background); }
        .jc-selectors { display: flex; gap: 4px; align-items: center; }
        .jc-select {
            background: var(--jc-elements-background);
            color: var(--jc-text-color);
            border: 1px solid var(--jc-border-color);
            border-radius: 6px;
            font-size: 0.8em;
            padding: 2px 4px;
            cursor: pointer;
        }
        .jc-select option { background: var(--jc-select-option-background); }
        .jc-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; padding: 6px; }
        .jc-lbl { font-size: 0.7em; opacity: 0.6; text-align: center; font-weight: bold; }
        .jc-lbl.sun { color: oklch(0.65 0.18 30); opacity: 1; }
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
        .jc-day:hover { background: var(--jc-hover-background); }
        .jc-day.sun { color: oklch(0.6 0.2 30); font-weight: bold; }
        .jc-day.today { outline: 2px solid var(--jc-accent-color); outline-offset: -2px; font-weight: bold; }
        .jc-day.empty { background: transparent; }
        .jc-dots-container { display: flex; gap: 2px; position: absolute; bottom: 5px; justify-content: center; width: 100%; }
        .jc-dot { width: 4px; height: 4px; border-radius: 50%; box-shadow: 1px 1px 2px oklch(0 0 0 / 0.5); }
        .jc-dot.green { background: oklch(0.6 0.18 145); }
        .jc-dot.yellow { background: oklch(0.95 0.18 95); }
        .jc-dot.orange { background: oklch(0.8 0.20 55); }
        .jc-dot.red { background: oklch(0.6 0.2 10); }
    ]]

    -- 3. HTML for the calendar body
    local html = [[
        <div class="jc-card" id="jc-container">
            <div class="jc-header">
                <button class="jc-nav-btn" id="jc-prev">‹</button>
                <div class="jc-selectors">
                    <select id="jc-month" class="jc-select"></select>
                    <select id="jc-year" class="jc-select"></select>
                    <button class="jc-today-btn" id="jc-today" title="Jump to Today & Refresh">↺</button>
                </div>
                <button class="jc-nav-btn" id="jc-next">›</button>
            </div>
            <div class="jc-grid" id="jc-labels"></div>
            <div class="jc-grid" id="jc-days"></div>
        </div>
    ]]

    -- 4. JavaScript for the iframe
    local javascript = [[
    (function() {
        const pendingRequests = new Map();
        let syscallReqId = 0;

        globalThis.syscall = async (name, ...args) => {
          return await new Promise((resolve, reject) => {
            syscallReqId++;
            pendingRequests.set(syscallReqId, { resolve, reject });
            globalThis.parent.postMessage({
              type: "syscall",
              id: syscallReqId,
              name,
              args,
            }, "*");
          });
        };

        globalThis.addEventListener("message", (message) => {
          const data = message.data;
          if (data.type === "syscall-response") {
            const syscallId = data.id;
            const lookup = pendingRequests.get(syscallId);
            if (!lookup) {
              throw Error("Invalid request id");
            }
            pendingRequests.delete(syscallId);
            if (data.error) {
              lookup.reject(new Error(data.error));
            } else {
              lookup.resolve(data.result);
            }
          }
        });
        const months = ]]..month_names..[[;
        const days = ]]..day_names..[[;
        const weekStartsSunday = ]]..tostring(week_starts_sunday)..[[;
        let existing = ]]..existing_pages_json..[[;
        const pattern = "]]..path_pattern..[[";
        const root = document.getElementById("jc-container");
        let vDate = new Date();

        function syncTheme() {
            const parentTheme = window.parent.document.documentElement.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', parentTheme);

            const computedStyle = window.parent.getComputedStyle(window.parent.document.documentElement);
            const cssVars = ['--top-background-color', '--modal-border-color', '--root-color', '--ui-accent-color', '--modal-help-background-color'];
            let styleContent = ':root {';
            for (const v of cssVars) {
                styleContent += `${v}: ${computedStyle.getPropertyValue(v)};`;
            }
            styleContent += '}';
            let styleEl = document.getElementById('sb-theme-sync');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'sb-theme-sync';
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = styleContent;
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
                return `<div class="jc-lbl ${isSun ? 'sun' : ''}">${d.slice(0,3)}</div>`;
            }).join('');

            const grid = document.getElementById("jc-days");
            grid.innerHTML = "";
            const firstDay = new Date(y, m, 1).getDay();
            const offset = weekStartsSunday ? firstDay : (firstDay === 0 ? 6 : firstDay - 1);
            const lastDay = new Date(y, m + 1, 0).getDate();

            for(let i=0; i<offset; i++) grid.appendChild(Object.assign(document.createElement("div"), {className:"jc-day empty"}));

            const pageNames = Object.keys(existing);

            for(let i=1; i<=lastDay; i++) {
                const a = document.createElement("a");
                const d = document.createElement("div");
                d.className = "jc-day";
                d.draggable = true;
                const dateObj = new Date(y, m, i);
                const isSun = dateObj.getDay() === 0;
                if(isSun) d.classList.add("sun");
                if(i===now.getDate() && m===now.getMonth() && y===now.getFullYear()) d.classList.add("today");

                const basePath = pattern
                    .replace(/#year#/g, y).replace(/#month#/g, String(m+1).padStart(2,'0'))
                    .replace(/#monthname#/g, months[m]).replace(/#day#/g, String(i).padStart(2,'0'))
                    .replace(/#weekday#/g, days[isSun ? 6 : dateObj.getDay()-1]);
                
                const matchCount = pageNames.filter(name => name.startsWith(basePath)).length;

                if(matchCount > 0) {
                    const dotsContainer = document.createElement("div");
                    dotsContainer.className = "jc-dots-container";
                    const numReds = Math.floor(matchCount / 4);
                    for(let r=0; r<numReds; r++) {
                        dotsContainer.innerHTML += '<div class="jc-dot red"></div>';
                    }
                    const remainder = matchCount % 4;
                    if (remainder > 0) {
                        const colorClass = remainder === 3 ? "orange" : (remainder === 2 ? "yellow" : "green");
                        dotsContainer.innerHTML += `<div class="jc-dot ${colorClass}"></div>`;
                    }
                    d.appendChild(dotsContainer);
                }
                
                d.innerHTML += `<span>${i}</span>`;
                
                d.onclick = (e) => {
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        window.parent.dispatchEvent(new CustomEvent("sb-journal-event", { detail: { action:"navigate", path: basePath, source: "FloatingJournalCalendar", ctrlKey: e.ctrlKey, metaKey: e.metaKey }}));
                    } else {
                        syscall('editor.navigate', '/' + basePath, false, false);
                    }
                };
                d.ondragstart = (e) => {
                    e.dataTransfer.setData("text/plain", "[[" + basePath + "]].."]]"..[[");
                    e.dataTransfer.dropEffect = "copy";
                };
                
                a.appendChild(d);
                grid.appendChild(a);
            }
        }
        
        window.addEventListener("sb-journal-update-event", (e) => {
             if (e.detail && e.detail.existing) {
                existing = e.detail.existing;
                render();
            }
        });

        document.getElementById("jc-prev").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth()-1); render(); };
        document.getElementById("jc-next").onclick = () => { vDate.setDate(1); vDate.setMonth(vDate.getMonth()+1); render(); };
        document.getElementById("jc-today").onclick = () => { 
            vDate = new Date(); 
            window.parent.dispatchEvent(new CustomEvent("sb-journal-event", { detail: { action: "request-refresh", source: "FloatingJournalCalendar" }}));
            render(); 
        };
        document.getElementById("jc-month").onchange = (e) => { vDate.setDate(1); vDate.setMonth(parseInt(e.target.value)); render(); };
        document.getElementById("jc-year").onchange = (e) => { vDate.setFullYear(parseInt(e.target.value)); render(); };

        syncTheme();
        render();
        new window.parent.MutationObserver(syncTheme).observe(window.parent.document.documentElement, { attributes: true, attributeFilter: ['data-theme']});
    })();
    ]]

    -- 5. Assemble and Show
    full_html = "<style>" .. css .. "</style>" .. html .. "<script>" .. javascript .. "</script>"
    js.import("/.fs/Library/Mr-xRed/UnifiedAdvancedPanelControl.js").show(full_html, "Calendar")
end

function refreshCalendarDots()
    local frame = js.window.document.querySelector("#sb-float-Floating_Journal_Calendar iframe")
    if not frame then return end

    local all_pages = space.listPages()
    local page_map_items = {}
    for _, p in ipairs(all_pages) do
        table.insert(page_map_items, '"' .. p.name .. '":true')
    end
    local json_str = "{" .. table.concat(page_map_items, ",") .. "}"
    
    local event = js.window.eval([[ (data) => new CustomEvent("sb-journal-update-event", { detail: { existing: data } }) ]])(js.window.JSON.parse(json_str))
    frame.contentWindow.dispatchEvent(event)
end

event.listen { name = "editor:pageLoaded", run = function() refreshCalendarDots() end }

command.define {
    name = "Journal: Floating Calendar (UAPC)",
    run = function() toggleFloatingJournalCalendarUAPC() end
}
```