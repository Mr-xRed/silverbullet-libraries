---
name: "Library/Mr-xRed/TaskManager"
tags: meta/library
pageDecoration.prefix: "✅ "
---

# Task Manager

> **note** Shortcut-Key
> `Alt-Shift-e` - Inline Task Editor - move your cursor to any markdown task and edit the Task in the Modal Window. If there is no task in the line it will transform it into a task.

### Example: **Simple Task Manager** with no extra attributes:

```lua
-- Default Columns: [] | Task | Page | Completed 
${TaskManager(query[[from index.tag "task" order by name limit 5]])}
```

${TaskManager(query[[from index.tag "task" order by name limit 5 ]])}

### Example: **Custom Task Manager** with custom attributes:

```lua
-- add your custom task attributes as following: {{"Header", "attribute", "format"},{...}}
-- format options: "string" | "date" | "dateTime" | "YYYY/MM/DD hh:mm"

${TaskManager(query[[from index.tag "task" order by name limit 5]], {
  {"Priority", "priority", "string"},
  {"Due Date", "due", "YY-MM-DD"},
  {"Scheduled", "scheduled", "date"},
  {"Completed", "completed", "dateTime"},
  {"Estimate", "est", "string"}
})}
```

${TaskManager(query[[from index.tag "task" order by name limit 5]], {
  {"Priority", "priority", "string"},
  {"Due Date", "due", "YY-MM-DD"},
  {"Scheduled", "scheduled", "date"},
  {"Completed", "completed", "dateTime"},
  {"Estimate", "est", "string"}
})}


## Config Example
```lua
config.set("taskManager", {  -- for icons you can use any unicode character or emojis
  open = "☐",                -- Task Open icon,  e.g.: "🔳", "⭕️", "☐"
  done = "☑",                -- Task Done icon, e.g.: "✅", "🟢", "☑"
  gotoTask = "↪",            -- Jump to task icon, e.g.: "⛓️", "⚓️", "↪"
  editTask = "✎",            -- Edit button icon, e.g.: "✏️" "✍️" "✎"
  boxSize = "1.8em",         -- any CSS unit "px", "em"
  emptyAttribute = "---",    -- any unicode character or emojis. e.g.: "🚫", "N.A.", "---"
 })
```

## Task Manager Table Styling

```space-style
/* priority: -1*/
/* ---------------------------------
   Task Manager Theme Variables
---------------------------------- */

html[data-theme='dark'] { .taskManager, #sb-taskeditor {
  --task-header-bg: var(--modal-hint-background-color);
  --taskedit-modal-bg: var(--modal-background-color);
  --taskedit-modal-input-bg: var(--modal-help-background-color);
  --taskedit-modal-color: var(--modal-color);
  --taskedit-modal-header:var(--modal-header-label-color);
  --taskedit-modal-border:  var(--modal-border-color);
}}

html[data-theme='light'] { .taskManager, #sb-taskeditor {
  --task-header-bg: var(--modal-hint-background-color);
  --taskedit-modal-bg: var(--modal-background-color);
  --taskedit-modal-input-bg: var(--modal-help-background-color);
  --taskedit-modal-color: var(--modal-color);
  --taskedit-modal-border:  var(--modal-border-color);
}}


/* ---------------------------------
   Task Manager Table
---------------------------------- */

#sb-main .cm-editor .taskManager {
  font-size: 0.8em;
}

#sb-main .cm-editor .taskManager table {
  display: table;
  border-collapse: separate;
  box-sizing: border-box;
  text-indent: initial;
  unicode-bidi: isolate;
  border-spacing: 2px;
  border-color: red;
  overflow: hidden; /* crucial */
}

#sb-main .cm-editor .taskManager thead tr{
  line-height: 2;
  background: var(--task-header-bg);
  border-radius:10px;

}

#sb-main .cm-editor .taskManager td {
  padding: 2px;
}

#sb-main .cm-editor .taskManager td:first-child {
  justify-content: center;
}

#sb-main .cm-editor .taskManager tbody td:first-child {
  display: flex;
  align-items: center;     /* vertical centring */
  justify-content: center; /* horizontal centring */
}

#sb-main .cm-editor .taskManager th,
#sb-main .cm-editor .taskManager td {
  text-align: center;
  vertical-align: middle;
}

#sb-main .cm-editor .taskManager th:nth-child(2),
#sb-main .cm-editor .taskManager td:nth-child(2),
#sb-main .cm-editor .taskManager th:nth-child(3),
#sb-main .cm-editor .taskManager td:nth-child(3) {
  text-align: left;
}

#sb-main .cm-editor .taskManager tbody tr:nth-of-type(even) {}
#sb-main .cm-editor .taskManager tbody tr:nth-of-type(odd) {}




#sb-main .cm-editor .taskManager thead th:first-child {
  border-top-left-radius: 10px;
}

#sb-main .cm-editor .taskManager thead th:last-child {
  border-top-right-radius: 10px;
}


/* ---------------------------------
   Task Manager Buttons
---------------------------------- */

#sb-main button.btn-toggle-task,
#sb-main button.btn-goto-page,
#sb-main button.btn-edit-task {
  background: transparent;
  padding: 0 4px;
  border: none;
  cursor: pointer;
  
  display: inline-flex;
  align-items: center;   /* vertical centring */
  justify-content: center; /* horizontal centring */
}

#sb-main button.btn-goto-page,
#sb-main button.btn-edit-task {
  opacity: 0.5;
  transition: opacity 0.2s;
}

#sb-main button.btn-goto-page:hover,
#sb-main button.btn-edit-task:hover {
  opacity: 1;
}


/* ---------------------------------
   Edit Task Modal
---------------------------------- */

#sb-taskeditor {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(14px);
  z-index: 200;

  font-family: var(--ui-font);

  transition: opacity 0.3s ease;
}

.te-card {
  width: 420px;
  max-width: 80vw;

  display: flex;
  flex-direction: column;
  gap: 10px;

  padding: 15px;
  border-radius: 15px;

  background: var(--taskedit-modal-bg);
  color: var(--taskedit-modal-color);

  border: 1px solid var(--taskedit-modal-border);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.te-header {
  font-size: 1.1em;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--taskedit-modal-header);
}

.te-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.te-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.te-label {
  font-size: 0.8em;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.te-input {
  width: 100%;
  box-sizing: border-box;

  padding: 4px 6px;
  border-radius: 6px;

  background: var(--taskedit-modal-input-bg);
  border: 1px solid transparent;
  color: var(--taskedit-modal-color);

  font-size: 0.95em;
  font-family: var(--ui-font);
  outline: none;
/*  transition: border-color 0.2s;*/
}

.te-input:focus {
  background: oklch( from var(--taskedit-modal-input-bg) l c h / 0.1);
  border: 1px solid var(--ui-accent-color);
}

.te-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--ui-accent-color);
}

.te-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.te-btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;

  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
}

.te-cancel {
  color: oklch(from var(--taskedit-modal-color) l c h / 0.5);
  background: rgba(128, 128, 128, 0.05);
}

.te-cancel:hover {
  color: oklch(from var(--taskedit-modal-color) l c h);
  background: rgba(128, 128, 128, 0.1);
}

.te-save {
  color: var(--modal-selected-option-color);
  background: var(--ui-accent-color);
  opacity: 1;
}

.te-save:hover {
  opacity: 0.9;
}

 .te-attr-row { display: flex; gap: 10px; margin-top: 10px; align-items: flex-end; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 4px; }
      .te-attr-col { display: flex; flex-direction: column; gap: 4px; flex: 1; }
      .te-attr-select { background: #333; color: white; border: 1px solid #555; border-radius: 4px; padding: 4px; height: 32px; }



/* ---------------------------------
   Native Date Picker Styling
---------------------------------- */

input[type="date"]::-webkit-calendar-picker-indicator,
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

input[type="date"]::-webkit-datetime-edit-fields-wrapper, 
input[type="datetime-local"]::-webkit-datetime-edit-fields-wrapper {
  cursor:text;
}


```


## Build Table for Task Manager

```space-lua
-- priority: -1

-- ------------- Load Config & Default Values -------------
local cfg = config.get("taskManager") or {}
local open = cfg.open or "☐"
local done = cfg.done or "☑︎"
local boxSize = cfg.boxSize or "1.4em"
local emptyAttribute = cfg.emptyAttribute or "---"
local gotoTask = cfg.gotoTask or "↪"
local editTask = cfg.editTask or "✎"


-- ------------- Task Toggle Function -------------
local function toggleTaskRemote(pageName, pos, currentState, queryText)
    local content = space.readPage(pageName)
    if not content then return end

    local lineEnd = content:find("\n", pos + 1) or (#content + 1)
    local originalLine = content:sub(pos + 1, lineEnd - 1)
    
    local newLine = ""
    local timestamp = os.date("%Y-%m-%d %H:%M")

    if currentState == " " or currentState == "" then
        local cleaned = originalLine:gsub("%[%s*%]", "[x]")
        cleaned = cleaned:gsub("%s*%[completed: [^%]]+]", "")
        newLine = cleaned .. " [completed: " .. timestamp .. "]"
    else
        local cleaned = originalLine:gsub("%[[xX]%]", "[ ]")
        newLine = cleaned:gsub("%s*%[completed: [^%]]+]", "")
    end

    local prefix = content:sub(1, pos)
    local suffix = content:sub(lineEnd)
    local finalContent = prefix .. newLine .. suffix
    space.writePage(pageName, finalContent)

    js.window.setTimeout(function()  
        codeWidget.refreshAll()  
    end, 200) 
end

-- ------------- Update Task Attributes Function -------------
local function updateTaskRemote(pageName, pos, finalState, newText, attributes)
    local content = space.readPage(pageName)
    if not content then return end

    local lineEnd = content:find("\n", pos + 1) or (#content + 1)
    local originalLine = content:sub(pos + 1, lineEnd - 1)
    
    local indent, bullet = originalLine:match("^(%s*)([%*%-]?)")
    indent = indent or ""
    bullet = bullet or "*"
    if bullet == "" then bullet = "*" end

    -- Use the state passed from the modal
    local stateMark = "[ ]"
    if finalState == "x" or finalState == "X" then 
        stateMark = "[x]" 
    end

    -- Logic for auto-timestamping "completed" attribute
    local hasCompleted = false
    local timestamp = os.date("%Y-%m-%d %H:%M")
    
    local attrString = ""
    for _, attr in ipairs(attributes) do
        local key = attr.key:lower()
        -- Skip existing completed tags if we are in 'x' state (we'll re-add/refresh it)
        -- Or skip it if we are in ' ' state (we want to remove it)
        if key ~= "completed" then
            if attr.value and attr.value ~= "" then
                attrString = attrString .. " [" .. attr.key .. ": " .. attr.value .. "]"
            end
        end
    end
    
    -- If state is checked, append the current completion timestamp
    if finalState == "x" or finalState == "X" then
        attrString = attrString .. " [completed: " .. timestamp .. "]"
    end

    local newLine = indent .. bullet .. " " .. stateMark .. " " .. newText .. attrString

    local prefix = content:sub(1, pos)
    local suffix = content:sub(lineEnd)
    
    local finalContent = prefix .. newLine .. suffix
    space.writePage(pageName, finalContent)

    js.window.setTimeout(function()  
        codeWidget.refreshAll()  
    end, 200)
end

-- ------------- Task Editor Modal (JS Bridge) -------------
local function openTaskEditor(taskData, extraCols)
    local sessionID = "te_" .. tostring(math.floor(js.window.performance.now()))
    
    local existing = js.window.document.getElementById("sb-taskeditor")
    if existing then existing.remove() end

    local fields = {}
    for _, col in ipairs(extraCols) do
        local key = col[2]
        if key ~= "completed" then -- We handle completed automatically now
            local label = col[1] or key or "Unknown"
            local val = taskData[key]
            
            if val == nil then val = "" end
            if type(val) == "table" then val = "" end 
            
            table.insert(fields, {
                label = tostring(label),
                key = tostring(key),
                type = col[3] or "string",
                value = tostring(val)
            })
        end
    end

    local function uniqueHandler(e)
        if e.detail.session == sessionID then
            updateTaskRemote(
                taskData.page, 
                taskData.pos, 
                e.detail.state, 
                e.detail.text, 
                e.detail.attributes
            )
            js.window.removeEventListener("sb-save-task", uniqueHandler)
        end
    end
    js.window.addEventListener("sb-save-task", uniqueHandler)

    local fieldsJSON = "[]"
    if #fields > 0 then
        local parts = {}
        for _, f in ipairs(fields) do
            local safeLabel = string.gsub(tostring(f.label), '"', '\\"')
            local safeKey = string.gsub(tostring(f.key), '"', '\\"')
            local safeVal = string.gsub(tostring(f.value), '"', '\\"')
            safeVal = string.gsub(safeVal, '\n', ' ')

            table.insert(parts, string.format(
                [[{ "label": "%s", "key": "%s", "type": "%s", "value": "%s" }]], 
                safeLabel, 
                safeKey, 
                f.type, 
                safeVal
            ))
        end
        fieldsJSON = "[" .. table.concat(parts, ",") .. "]"
    end

    local taskNameSafe = string.gsub(tostring(taskData.name or ""), '"', '\\"')
    taskNameSafe = string.gsub(taskNameSafe, '\n', ' ')
    local isChecked = (taskData.state == "x" or taskData.state == "X") and "checked" or ""

    local container = js.window.document.createElement("div")
    container.id = "sb-taskeditor"
    container.innerHTML = [[
    <style>
    </style>
    <div class="te-card" id="te-card-inner">
      <div class="te-header">Edit Task Details</div>
      
      <div class="te-row">
        <input type="checkbox" id="te-status-checkbox" class="te-checkbox" ]] .. isChecked .. [[>
        <label for="te-status-checkbox" style="cursor:pointer">Completed</label>
      </div>

      <div class="te-group">
        <label class="te-label">Task Description</label>
        <input type="text" id="te-main-input" class="te-input" value="]] .. taskNameSafe .. [[">
      </div>

      <div id="te-dynamic-fields" style="display: flex; flex-direction: column; gap: 15px;"></div>

      <div class="te-actions">
        <button class="te-btn te-cancel" id="te-cancel-btn">Cancel</button>
        <button class="te-btn te-save" id="te-save-btn">Save Changes</button>
      </div>
    </div>
    ]]

    js.window.document.body.appendChild(container)

    local script = [[
    (function() {
        const session = "]] .. sessionID .. [[";
        const fields = ]] .. fieldsJSON .. [[;
        const container = document.getElementById('te-dynamic-fields');
        const root = document.getElementById('sb-taskeditor');
        const card = document.getElementById('te-card-inner');

        const formatForInput = (val, type) => {
             if(!val) return "";
             val = val.trim();
             if (type === 'datetime-local') return val.replace(" ", "T");
             if (type === 'date') return val.split("T")[0].split(" ")[0];
             return val;
        };

        fields.forEach(f => {
            const group = document.createElement('div');
            group.className = 'te-group';
            const label = document.createElement('label');
            label.className = 'te-label';
            label.innerText = f.label;
            const input = document.createElement('input');
            input.className = 'te-input';
            input.dataset.key = f.key;
            
            const isTime = f.type === 'dateTime' || f.type.includes('hh') || f.type.includes('mm');
            const isDate = !isTime && (f.type === 'date' || f.type.includes('YY') || f.type.includes('MM'));

            if (isTime) {
                 input.type = 'datetime-local';
                 input.value = formatForInput(f.value, 'datetime-local');
            } else if (isDate) {
                 input.type = 'date';
                 input.value = formatForInput(f.value, 'date');
            } else {
                 input.type = 'text';
                 input.value = f.value;
            }
            group.appendChild(label);
            group.appendChild(input);
            container.appendChild(group);
        });

        const cleanup = () => { 
            window.removeEventListener("keydown", handleKey, true);
            if(root) root.remove(); 
        };
        
        const save = () => {
            const newText = document.getElementById('te-main-input').value;
            const newState = document.getElementById('te-status-checkbox').checked ? "x" : " ";
            const attributes = [];
            const inputs = container.querySelectorAll('input');
            inputs.forEach(inp => {
                let val = inp.value;
                if (inp.type === 'datetime-local' && val.includes("T")) val = val.replace("T", " ");
                attributes.push({ key: inp.dataset.key, value: val });
            });
            window.dispatchEvent(new CustomEvent("sb-save-task", { 
                detail: { session: session, text: newText, state: newState, attributes: attributes } 
            }));
            cleanup();
        };

        // Aggressive Focus Trap & Key Stopper
        const handleKey = (e) => {
            // Stop CM from seeing anything
            e.stopPropagation();

            const focusables = card.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.key === "Tab") {
                // Prevent focus escaping the modal
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        last.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === last) {
                        first.focus();
                        e.preventDefault();
                    }
                }
            } else if (e.key === "Escape") {
                cleanup();
            } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                save();
            }
        };

        window.addEventListener("keydown", handleKey, true);
        document.getElementById('te-cancel-btn').onclick = cleanup;
        document.getElementById('te-save-btn').onclick = save;
        root.onclick = (e) => { if(e.target === root) cleanup(); };
        
        setTimeout(() => document.getElementById('te-main-input').focus(), 50);
    })();
    ]]

    local scriptEl = js.window.document.createElement("script")
    scriptEl.innerHTML = script
    container.appendChild(scriptEl)
end

-- ------------- Table Building Function -------------
function TaskManager(taskQuery, extraCols)
    extraCols = extraCols or { {"Completed", "completed", "date"} }

    local function getField(task, key)
        if not key or type(key) ~= "string" then return nil end
        if task[key] ~= nil then return task[key] end
        local kl = key:lower()
        if task[kl] ~= nil then return task[kl] end
        local k2 = kl:gsub("%s+", "_")
        return task[k2]
    end

    local function formatValue(colSpec, task)
        local header, fieldKey, typ = colSpec[1], colSpec[2], colSpec[3] or "string"
        local val = getField(task, fieldKey)
        if val == nil or val == "" then return emptyAttribute end
        if type(val) == "table" then return #val == 0 and emptyAttribute or table.concat(val, ", ") end

    -- parse ISO or partial date with optional time
    local function parseISO(iso)
        if type(iso) ~= "string" then 
            return { year = 0, month = 0, day = 0, hour = 0, min = 0, sec = 0 } 
        end

        -- find the first date occurrence (YYYY-MM-DD) and its position
        local date_s, date_e = iso:find("%d%d%d%d%-%d%d%-%d%d")
        if not date_s then
            return { year = 0, month = 0, day = 0, hour = 0, min = 0, sec = 0 }
        end

        local date_str = iso:sub(date_s, date_e)
        local year, month, day = date_str:match("(%d%d%d%d)%-(%d%d)%-(%d%d)")

        -- search for time AFTER the date to avoid picking unrelated times/numbers
        local hour, min = iso:match("(%d%d):(%d%d)", date_e + 1)
        -- also support cases like "T15:58:00Z" or "15:58:00"
        if not hour then
            local t_s, t_e = iso:find("T%d%d:%d%d:%d%d", date_e + 1) or iso:find(" %d%d:%d%d:%d%d", date_e + 1)
            if t_s then
                hour, min = iso:match("T?(%d%d):(%d%d)", t_s)
            end
        end

        return {
            year = tonumber(year) or 0,
            month = tonumber(month) or 0,
            day = tonumber(day) or 0,
            hour = tonumber(hour) or 0,
            min = tonumber(min) or 0,
            sec = 0,
        }
    end

    if typ == "dateTime" then
        local d = parseISO(val)
        return string.format("%04d-%02d-%02d %02d:%02d", d.year, d.month, d.day, d.hour, d.min)
    elseif typ == "date" then
        local d = parseISO(val)
        return string.format("%04d-%02d-%02d", d.year, d.month, d.day)
    elseif typ:match("YY") or typ:match("DD") or typ:match("hh") or typ:match("mm") then
        local d = parseISO(val)
        local s = typ
        -- Replace YYYY before YY to avoid collisions
        s = s:gsub("YYYY", string.format("%04d", d.year))
        s = s:gsub("YY", string.format("%02d", d.year % 100))
        s = s:gsub("MM", string.format("%02d", d.month))
        s = s:gsub("DD", string.format("%02d", d.day))
        s = s:gsub("hh", string.format("%02d", d.hour))
        s = s:gsub("mm", string.format("%02d", d.min))
        return s
    end

    return tostring(val)
end

    local headerCells = {
        dom.td { "" },
        dom.td { "Task" },
        dom.td { "Page" },
    }

    for _, c in ipairs(extraCols) do
        table.insert(headerCells, dom.td { c[1] or "" })
    end

    return widget.htmlBlock(dom.table { class = "taskManager",
        dom.thead {
            dom.tr { table.unpack(headerCells) }
        },
        dom.tbody(
            (function()
                local rows = {}
                for t in taskQuery do
                    local isDone = (t.state == "x" or t.state == "X")

                    local rawName = t.name or ""
                    local limit = 60
                    local isLong = #rawName > limit
                    local displayTask = rawName

                    if isLong then
                        local snip = rawName:sub(1, limit)
                        local lastSpace = snip:match(".*() ")
                        if type(lastSpace) == "number" then
                            displayTask = rawName:sub(1, lastSpace - 1) .. "..."
                        else
                            displayTask = rawName:sub(1, limit - 3) .. "..."
                        end
                    end

                    local displayName = (isDone and "~~" or "") .. displayTask .. (isDone and "~~" or "")

                    local cells = {
                        dom.td {
                            widgets.button(editTask, function() openTaskEditor(t, extraCols) end, { class = "btn-edit-task", title = "Edit Attributes" }), 

                            widgets.button(isDone and done or open,
                                function()
                                    toggleTaskRemote(t.page, t.pos, t.state, t.text)
                                end,
                                { class = "btn-toggle-task", style = "font-size: ".. boxSize}
                            ),
                            widgets.button(gotoTask, function()
                                editor.navigate(t.page .. "@" .. t.pos)
                            end, { class = "btn-goto-page" }),
                        },
                        dom.td { title = isLong and rawName or nil, displayName },
                        dom.td {
                            " [[" .. (t.page or "") .. "]]"
                        }
                    }

                    for _, col in ipairs(extraCols) do
                        local val = formatValue(col, t)
                        table.insert(cells, dom.td { tostring(val) })
                    end

                    table.insert(rows, dom.tr(cells))
                end

                if #rows == 0 then
                    return {
                        dom.tr {
                            dom.td {
                                colspan = tostring(3 + #extraCols),
                                "_No tasks found matching query._"
                            }
                        }
                    }
                end

                return rows
            end)()
        )
    })
end




-- =========================================================
-- ============ INLINE TASK EDITOR EXTENSION ===============
-- =========================================================

local function openInlineTaskEditor(taskData, existingFields)
    local sessionID = "te_inline_" .. tostring(math.floor(js.window.performance.now()))
    
    local existing = js.window.document.getElementById("sb-taskeditor")
    if existing then existing.remove() end

    local function uniqueHandler(e)
        if e.detail.session == sessionID then
            updateTaskRemote(
                taskData.page, 
                taskData.pos, 
                e.detail.state, 
                e.detail.text, 
                e.detail.attributes
            )
            js.window.removeEventListener("sb-save-task", uniqueHandler)
        end
    end
    js.window.addEventListener("sb-save-task", uniqueHandler)

    local parts = {}
    for _, f in ipairs(existingFields) do
        -- Skip 'completed' from being rendered in dynamic list as we manage it via checkbox
        if f.key:lower() ~= "completed" then
            local safeLabel = string.gsub(tostring(f.key), '"', '\\"')
            local safeKey = string.gsub(tostring(f.key), '"', '\\"')
            local safeVal = string.gsub(tostring(f.value), '"', '\\"')
            safeVal = string.gsub(safeVal, '\n', ' ')
            table.insert(parts, string.format(
                [[{ "label": "%s", "key": "%s", "type": "string", "value": "%s" }]], 
                safeLabel, safeKey, safeVal
            ))
        end
    end
    local fieldsJSON = "[" .. table.concat(parts, ",") .. "]"

    local taskNameSafe = string.gsub(tostring(taskData.name or ""), '"', '\\"')
    taskNameSafe = string.gsub(taskNameSafe, '\n', ' ')
    local isChecked = (taskData.state == "x" or taskData.state == "X") and "checked" or ""

    local container = js.window.document.createElement("div")
    container.id = "sb-taskeditor"
    container.innerHTML = [[
    <style>
    
    </style>
    <div class="te-card" id="te-card-inner">
      <div class="te-header">Inline Task Editor</div>
      
      <div class="te-row">
        <input type="checkbox" id="te-status-checkbox" class="te-checkbox" ]] .. isChecked .. [[>
        <label for="te-status-checkbox" style="cursor:pointer">Completed</label>
      </div>

      <div class="te-group">
        <label class="te-label">Task Description</label>
        <input type="text" id="te-main-input" class="te-input" value="]] .. taskNameSafe .. [[">
      </div>

      <div id="te-dynamic-fields" style="display: flex; flex-direction: column; gap: 15px;"></div>
      
      <div class="te-attr-row">
        <div class="te-attr-col">
          <label class="te-label" style="font-size: 0.8em;">Attr Name</label>
          <input type="text" id="te-new-key" class="te-input" placeholder="e.g. due, priority">
        </div>
        <div class="te-attr-col" style="flex: 0.6;">
          <label class="te-label" style="font-size: 0.8em;">Type</label>
          <select id="te-new-type" class="te-attr-select">
            <option value="string">String</option>
            <option value="date">Date</option>
            <option value="datetime">DateTime</option>
          </select>
        </div>
        <div class="te-attr-col">
          <label class="te-label" style="font-size: 0.8em;">Value</label>
          <input type="text" id="te-new-val" class="te-input">
        </div>
        <button id="te-add-attr-btn" class="te-btn" style="height: 32px; background: #444; padding: 0 10px;">Add</button>
      </div>

      <div class="te-actions">
        <button class="te-btn te-cancel" id="te-cancel-btn">Cancel</button>
        <button class="te-btn te-save" id="te-save-btn">Save Changes</button>
      </div>
    </div>
    ]]

    js.window.document.body.appendChild(container)

    local script = [[
    (function() {
        const session = "]] .. sessionID .. [[";
        const fields = ]] .. fieldsJSON .. [[;
        const container = document.getElementById('te-dynamic-fields');
        const root = document.getElementById('sb-taskeditor');
        const card = document.getElementById('te-card-inner');

        const formatForInput = (val, type) => {
             if(!val) return "";
             val = val.trim();
             if (type === 'datetime-local') return val.replace(" ", "T");
             if (type === 'date') return val.split("T")[0].split(" ")[0];
             return val;
        };

        const createFieldInput = (key, val, type) => {
            const group = document.createElement('div');
            group.className = 'te-group';
            const label = document.createElement('label');
            label.className = 'te-label';
            label.innerText = key;
            const input = document.createElement('input');
            input.className = 'te-input';
            input.dataset.key = key;

            if (type === 'datetime') {
                 input.type = 'datetime-local';
                 input.value = formatForInput(val, 'datetime-local');
            } else if (type === 'date') {
                 input.type = 'date';
                 input.value = formatForInput(val, 'date');
            } else {
                 input.type = 'text';
                 input.value = val;
            }
            group.appendChild(label);
            group.appendChild(input);
            container.appendChild(group);
        };

        fields.forEach(f => {
            let type = "string";
            if(f.value.match(/^\d{4}-\d{2}-\d{2}$/)) type = "date";
            if(f.value.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)) type = "datetime";
            createFieldInput(f.key, f.value, type);
        });

        const newKeyInp = document.getElementById('te-new-key');
        const newTypeSel = document.getElementById('te-new-type');
        const newValInp = document.getElementById('te-new-val');

        newTypeSel.onchange = () => {
            if(newTypeSel.value === 'date') newValInp.type = 'date';
            else if(newTypeSel.value === 'datetime') newValInp.type = 'datetime-local';
            else newValInp.type = 'text';
        };

        document.getElementById('te-add-attr-btn').onclick = () => {
            const key = newKeyInp.value.trim();
            if(!key) return;
            createFieldInput(key, newValInp.value, newTypeSel.value);
            newKeyInp.value = "";
            newValInp.value = "";
        };

        const cleanup = () => { 
            window.removeEventListener("keydown", handleKey, true);
            if(root) root.remove(); 
        };
        
        const save = () => {
            const newText = document.getElementById('te-main-input').value;
            const newState = document.getElementById('te-status-checkbox').checked ? "x" : " ";
            const attributes = [];
            const inputs = container.querySelectorAll('.te-input[data-key]');
            inputs.forEach(inp => {
                let val = inp.value;
                if (inp.type === 'datetime-local' && val.includes("T")) val = val.replace("T", " ");
                attributes.push({ key: inp.dataset.key, value: val });
            });
            window.dispatchEvent(new CustomEvent("sb-save-task", { 
                detail: { session: session, text: newText, state: newState, attributes: attributes } 
            }));
            cleanup();
        };

        const handleKey = (e) => {
            e.stopPropagation();
            const focusables = card.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
        
            if (e.key === "Tab") {
                if (e.shiftKey) {
                    if (document.activeElement === first) { last.focus(); e.preventDefault(); }
                } else {
                    if (document.activeElement === last) { first.focus(); e.preventDefault(); }
                }
            } else if (e.key === "Escape") {
                cleanup();
            } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                save();
            }
        };
        
        window.addEventListener("keydown", handleKey, true);
        document.getElementById('te-cancel-btn').onclick = cleanup;
        document.getElementById('te-save-btn').onclick = save;
        root.onclick = (e) => { if(e.target === root) cleanup(); };
        setTimeout(() => document.getElementById('te-main-input').focus(), 50);
    })();
    ]]

    local scriptEl = js.window.document.createElement("script")
    scriptEl.innerHTML = script
    container.appendChild(scriptEl)
end


local function inlineEditTask()
    local line = editor.getCurrentLine()
    local lineContent = line.text

    local prefix, state, rest =
      lineContent:match("^(%s*[%-%*])%s*%[([ xX])%](.*)")

    if not prefix then
      openInlineTaskEditor({
        name = lineContent:match("^%s*(.-)%s*$") or "",
        state = " ",
        page = editor.getCurrentPage(),
        pos = line.from
      }, {})
      return
    end

    local attributes = {}
    for match in string.matchRegexAll(
      rest,
      "\\[([\\w_-]+)\\s*[:=]\\s*([^\\]]*)\\]"
    ) do
      table.insert(attributes, {
        key = match[2],
        value = match[3]
      })
    end

    local cleanText = rest
    cleanText = cleanText:gsub("%s*%[[^%]]+%]", "")
    cleanText = cleanText:match("^%s*(.-)%s*$") or ""

    openInlineTaskEditor({
      name = cleanText,
      state = state,
      page = editor.getCurrentPage(),
      pos = line.from
    }, attributes)
  end


command.define {
  name = "Task Editor: Inline",
  key = "Alt-Shift-e",
  run = function() inlineEditTask() end
}
```


## Discussion to this Library
- [Silverbullet Community](https://community.silverbullet.md/t/todo-task-manager-global-interactive-table-sorter-filtering/3767?u=mr.red)

