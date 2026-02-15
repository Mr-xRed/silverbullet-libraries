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

${TaskManager(query[[from index.tag "task" order by name limit 10]], {
  {"Priority", "priority", "string"},
  {"Due Date", "due", "YY-MM-DD"},
  {"Completed", "completed", "dateTime"},
  {"Estimate", "est", "string"}
})}

## Config Example
```lua
config.set("taskManager", {  -- for icons you can use any unicode character or emojis
  open = "☐",                -- Task Open icon,  e.g.: "🔳", "⭕️", "☐"
  done = "☑",                -- Task Done icon, e.g.: "✅", "🟢", "☑"
  editTask = "Edit",            -- Edit button icon, e.g.: "✏️" "✍️" "✎"
  boxSize = "1.8em",         -- any CSS unit "px", "em"
  emptyAttribute = "---",    -- any unicode character or emojis. e.g.: "🚫", "N.A.", "---"
 })
```

## Task Manager Table Styling

```space-style
/* priority: -1 */

/* ---------------------------------
   Task Manager Theme Variables
---------------------------------- */

html[data-theme='dark'] {
  .taskManager,
  #sb-taskeditor {
    --task-header-bg: var(--modal-hint-background-color);
    --taskedit-modal-bg: var(--modal-background-color);
    --taskedit-modal-input-bg: var(--modal-help-background-color);
    --taskedit-modal-color: var(--modal-color);
    --taskedit-modal-header: var(--modal-header-label-color);
    --taskedit-modal-border: var(--modal-border-color);
  }
}

html[data-theme='light'] {
  .taskManager,
  #sb-taskeditor {
    --task-header-bg: var(--ui-accent-color);
    --taskedit-modal-bg: var(--modal-background-color);
    --taskedit-modal-input-bg: var(--modal-help-background-color);
    --taskedit-modal-color: var(--modal-color);
    --taskedit-modal-border: var(--modal-border-color);
  }
}


/* ---------------------------------
   Task Manager Table
---------------------------------- */

#sb-main .cm-editor .taskManager {
  font-size: 0.8em;
}

#sb-main .cm-editor .taskManager table {
  display: table;
  box-sizing: border-box;
  border-collapse: separate;
  border-spacing: 2px;
  border-color: red;
  overflow: hidden;

  text-indent: initial;
  unicode-bidi: isolate;
}

#sb-main .cm-editor .taskManager thead tr {
  line-height: 2;
  background: var(--task-header-bg);
  border-radius: 10px;
}

#sb-main .cm-editor .taskManager th,
#sb-main .cm-editor .taskManager td {
  padding: 2px;
  text-align: center;
  vertical-align: middle;
}

#sb-main .cm-editor .taskManager th:nth-child(2),
#sb-main .cm-editor .taskManager td:nth-child(2),
#sb-main .cm-editor .taskManager th:nth-child(3),
#sb-main .cm-editor .taskManager td:nth-child(3) {
  text-align: left;
}

#sb-main .cm-editor .taskManager td:first-child {
  justify-content: center;
}

#sb-main .cm-editor .taskManager tbody td:first-child {
  display: flex;
  align-items: center;
  justify-content: center;
}

#sb-main .cm-editor .taskManager thead th:first-child {
  border-top-left-radius: 10px;
}

#sb-main .cm-editor .taskManager thead th:last-child {
  border-top-right-radius: 10px;
}

#sb-main .cm-editor .taskManager tbody tr:nth-of-type(even) {}
#sb-main .cm-editor .taskManager tbody tr:nth-of-type(odd) {}


/* ---------------------------------
   Task Manager Buttons
---------------------------------- */

#sb-main button.btn-toggle-task {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: transparent;
  border: none;
  padding: 0 4px;

  cursor: pointer;
}

#sb-main button.btn-edit-task {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: oklch(from var(--editor-wiki-link-page-background-color) l c h / 0.2);
  color: var(--editor-wiki-link-page-color);

  padding: 2px 4px;
  border: none;
  border-radius: 5px;

  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.3s;
}

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

  background: rgba(0, 0, 0, 0.6);
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

#te-dynamic-fields {
  display: flex;
  flex-direction: column;
  gap: 15px;
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
  color: var(--taskedit-modal-color);

  border: 1px solid transparent;
  outline: none;

  font-size: 0.95em;
  font-family: var(--ui-font);
/*  transition: border-color 0.2s; */
}

.te-input:focus {
  background: oklch(from var(--taskedit-modal-input-bg) l c h / 0.1);
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
  padding: 6px 12px;
  border-radius: 6px;
  border: none;

  cursor: pointer;

  font-size: 0.9em;
  font-weight: 600;
}

#te-add-attr-btn,
.te-cancel {
  color: oklch(from var(--taskedit-modal-color) l c h / 0.5);
  background: rgba(128, 128, 128, 0.05);
}

#te-add-attr-btn:hover,
.te-cancel:hover {
  color: oklch(from var(--taskedit-modal-color) l c h);
  background: rgba(128, 128, 128, 0.1);
}

.te-save {
  color: var(--modal-selected-option-color);
  background: var(--ui-accent-color);
}

.te-save:hover {
  opacity: 0.9;
}

.te-attr-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;

  margin-top: 10px;
  padding: 10px;

  border-radius: 10px;
  border: 1px solid var(--taskedit-modal-border);

  background: oklch(
    from var(--taskedit-modal-input-bg)
    calc(l - 0.1) c h / 0.1
  );
}

.te-attr-col {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.te-attr-select {
  padding: 4px;
  border-radius: 4px;

  background: var(--taskedit-modal-input-bg);
  color: var(--taskedit-modal-color);
}


/* ---------------------------------
   Native Date Picker Styling
---------------------------------- */

input[type="date"]::-webkit-calendar-picker-indicator,
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

input[type="date"]::-webkit-datetime-edit-fields-wrapper,
input[type="datetime-local"]::-webkit-datetime-edit-fields-wrapper {
  cursor: text;
}

.te-input[type="date"],
.te-input[type="datetime-local"] {
  width: 100%;
  min-width: 0;
}

.te-attr-row .te-attr-col:last-of-type {
  flex: 1 1 0;
}



```

## Build Table for Task Manager

```space-lua
-- priority: -1

-- ------------- Helper: Escape Magic Characters for Lua Patterns -------------
local function escapeLuaPattern(s)
    return s:gsub("([%^%$%(%)%%%.%[%]%*%+%-%?])", "%%%1")
end

-- ------------- Load Config & Default Values -------------
local cfg = config.get("taskManager") or {}
local open = cfg.open or "☐"
local done = cfg.done or "☑︎"
local boxSize = cfg.boxSize or "1.4em"
local emptyAttribute = cfg.emptyAttribute or "---"
-- local gotoTask = cfg.gotoTask or "↪"
local editTask = cfg.editTask or "Edit"


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
    end, 500) 
end

-- ------------- Update Task Attributes Function (Updated for AST/Multi-line) -------------
local function updateTaskRemote(pageName, pos, range, originalName, finalState, newText, attributes)
    local content = space.readPage(pageName)
    if not content then return end

    -- Use the AST Range to get the EXACT block of this task, preserving newlines
    local blockStart = pos + 1
    local blockLen = range[2] - range[1]
    local taskBlock = content:sub(blockStart, blockStart + blockLen - 1)

    -- 1. Update State (Checkbox)
    local stateMark = "[ ]"
    if finalState == "x" or finalState == "X" then stateMark = "[x]" end

    -- If the block has no task marker yet (new task being created from a plain line),
    -- prepend one instead of trying to replace a non-existent checkbox.
    -- Build the line directly from newText so step 2 has nothing left to replace.
    if not taskBlock:find("^%s*[%*%-]%s*%[") then
        taskBlock = "* " .. stateMark .. " " .. (newText or taskBlock)
        newText = originalName
    else
        taskBlock = taskBlock:gsub("^(%s*[%*%-]%s*)%[[ xX]?%]", "%1" .. stateMark, 1)
    end

    -- 2. Update Description (Name)
    -- Use string.find with plain=true for a literal search, which is safer than using gsub with a pattern.
    -- This avoids issues with special characters in the task name.
    if originalName and newText and originalName ~= newText then
        local start, finish = string.find(taskBlock, originalName, 1, true)
        if start then
            taskBlock = taskBlock:sub(1, start - 1) .. newText .. taskBlock:sub(finish + 1)
        end
    end

    -- 3. Update Attributes (In-Place or Append)
    for _, attr in ipairs(attributes) do
        local key = attr.key
        local val = tostring(attr.value or "")

        -- Strip existing quotes to avoid double-wrapping, then re-wrap in ""
        if val:sub(1, 1) == '"' and val:sub(-1, -1) == '"' then
            val = val:sub(2, -2)
        end
        local quotedVal = '"' .. val .. '"'

        if key and key ~= "" then
            -- Regex to find [key: value] regardless of where it is (line 1, 2, or 99)
            local attrPattern = "(%[" .. escapeLuaPattern(key) .. "%s*:%s*.-%])"
            
            if taskBlock:find(attrPattern) then
                -- Attribute exists, replace it in place with quoted value
                taskBlock = taskBlock:gsub(attrPattern, "[" .. key .. ": " .. quotedVal .. "]")
            else
                -- Attribute does not exist, append to end of block with quoted value
                taskBlock = taskBlock .. " [" .. key .. ": " .. quotedVal .. "]"
            end
        end
    end

    -- 4. Handle "completed" timestamp special logic
    local timestamp = os.date("%Y-%m-%d %H:%M")
    local completedPattern = "(%[completed%s*:%s*.-%])"
    
    if finalState == "x" or finalState == "X" then
        if not taskBlock:find(completedPattern) then
            -- Wrap completion timestamp in quotes
            taskBlock = taskBlock .. ' [completed: "' .. timestamp .. '"]'
        end
    else
        -- Task is NOT done. Remove completed tag if it exists anywhere in the block.
        if taskBlock:find(completedPattern) then
            taskBlock = taskBlock:gsub(completedPattern, "")
        end
    end

    -- Write back
    local prefix = content:sub(1, blockStart - 1)
    local suffix = content:sub(blockStart + blockLen)
    
    local finalContent = prefix .. taskBlock .. suffix
    space.writePage(pageName, finalContent)

    js.window.setTimeout(function()  
        codeWidget.refreshAll()  
    end, 500)
end

-- ------------- Task Editor Modal (JS Bridge) -------------
local function openTaskEditor(taskData, extraCols)
    local sessionID = "te_" .. tostring(math.floor(js.window.performance.now()))
    
    local existing = js.window.document.getElementById("sb-taskeditor")
    if existing then existing.remove() end

    -- List of meta-keys that are not custom attributes
    local ignoredKeys = {
      ref = true, tag = true, tags = true, name = true, text = true, page = true, pos = true, range = true,
      toPos = true, state = true, done = true, itags = true, header = true, links = true,
      ilinks = true, _isNewTask = true
    }

    -- Backwards compatibility: construct range from pos/toPos if range is missing
    if not taskData.range and taskData.pos and taskData.toPos then
        taskData.range = { taskData.pos, taskData.toPos }
    end

    -- Read full raw name from source (including hashtags, wikilinks, etc.)
    local fullName = taskData.text or taskData.name or ""

    local content = space.readPage(taskData.page)
    if content and taskData.pos and taskData.range then
        local blockStart = taskData.pos + 1
        local blockLen = taskData.range[2] - taskData.range[1]

        if blockStart > 0 and blockLen > 0 and blockStart + blockLen - 1 <= #content then
            local taskBlock = content:sub(blockStart, blockStart + blockLen - 1)

            -- Find the starting position of the first attribute (e.g., [due: ...]) in the raw text
            -- by checking for all known attribute keys from the parsed taskData.
            local first_attr_pos = -1
            for key, _ in pairs(taskData) do
                if not ignoredKeys[key] then
                    local pattern = "%[" .. escapeLuaPattern(key) .. "%s*:"
                    local p = taskBlock:find(pattern)
                    if p and (first_attr_pos == -1 or p < first_attr_pos) then
                        first_attr_pos = p
                    end
                end
            end

            -- The name is everything before the first attribute.
            local name_part
            if first_attr_pos > -1 then
                name_part = taskBlock:sub(1, first_attr_pos - 1)
            else
                name_part = taskBlock -- No attributes found
            end

            local extractedName = name_part:match("^%s*[%*%-]%s*%[ ?[xX]? ?%]%s*(.*)")
            if extractedName then
               fullName = extractedName:match("^%s*(.-)%s*$") -- trim whitespace
            end
        end
    end

    local function uniqueHandler(e)
        if e.detail.session == sessionID then
            updateTaskRemote(
                taskData.page, 
                taskData.pos,
                taskData.range,
                fullName,
                e.detail.state, 
                e.detail.text, 
                e.detail.attributes
            )
            js.window.removeEventListener("sb-save-task", uniqueHandler)
        end
    end
    js.window.addEventListener("sb-save-task", uniqueHandler)

    -- Build fields from existing task attributes
    local existingFields = {}
    for key, value in pairs(taskData) do
        if not ignoredKeys[key] then
            if type(value) ~= "table" then
                table.insert(existingFields, {
                    key = tostring(key),
                    value = tostring(value)
                })
            end
        end
    end

    local fieldsJSON = "[]"
    if #existingFields > 0 then
        local parts = {}
        for _, f in ipairs(existingFields) do
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
        fieldsJSON = "[" .. table.concat(parts, ",") .. "]"
    end

    -- FIX: Use raw text and strip attributes to preserve tags like #tag
    -- (fullName already contains the clean name without attributes)
    local taskNameSafe = string.gsub(tostring(fullName or ""), '"', '\\"')
    taskNameSafe = string.gsub(taskNameSafe, '\n', ' ')
    local isChecked = (taskData.state == "x" or taskData.state == "X") and "checked" or ""

    local container = js.window.document.createElement("div")
    container.id = "sb-taskeditor"
    container.innerHTML = [[
    <style></style>
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

      <div id="te-dynamic-fields"></div>

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
        <button id="te-add-attr-btn" class="te-btn">Add</button>
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

        const createFieldInput = (key, val, type, label) => {
            const group = document.createElement('div');
            group.className = 'te-group';
            const lbl = document.createElement('label');
            lbl.className = 'te-label';
            lbl.innerText = label || key;
            const input = document.createElement('input');
            input.className = 'te-input';
            input.dataset.key = key;
            
            const isTime = type === 'datetime' || type === 'datetime-local' || type === 'dateTime' || (type && (type.includes('hh') || type.includes('mm')));
            const isDate = !isTime && (type === 'date' || (type && (type.includes('YY') || type.includes('MM'))));

            if (isTime) {
                 input.type = 'datetime-local';
                 input.value = formatForInput(val, 'datetime-local');
            } else if (isDate) {
                 input.type = 'date';
                 input.value = formatForInput(val, 'date');
            } else {
                 // Auto-detect type from value format when no explicit type hint is given
                 if (val && val.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)) {
                     input.type = 'datetime-local';
                     input.value = formatForInput(val, 'datetime-local');
                 } else if (val && val.match(/^\d{4}-\d{2}-\d{2}$/)) {
                     input.type = 'date';
                     input.value = formatForInput(val, 'date');
                 } else {
                     input.type = 'text';
                     input.value = val;
                 }
            }
            group.appendChild(lbl);
            group.appendChild(input);
            container.appendChild(group);
        };

        fields.forEach(f => {
            createFieldInput(f.key, f.value, f.type, f.label);
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
                                  widgets.button(editTask,function() openTaskEditor(t) end,
                                  { class = "btn-edit-task", title = "Edit Attributes" }), 
                                  widgets.button(isDone and done or open,
                                  function() toggleTaskRemote(t.page, t.pos, t.state, t.text) end,
                                  { class = "btn-toggle-task", style = "font-size: ".. boxSize})},
                        dom.td { title = isLong and rawName or nil, displayName },
                        dom.td { string.format(" [[%s@%d|%s]]", t.page, t.pos, t.page:match("([^/]+)$") or t.page)}
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
-- =========== Add Completed Timestamp inline ==============
-- =========================================================

event.listen {
  name = "task:stateChange",
  run = function(e)
    local data = e.data
    local text = data.text
    
    -- Safety check: ensure text exists to avoid 'nil value' errors
    if not text then return end

    -- CASE 1: Task marked as complete ('x')
    if data.newState == "x" then
      -- Check if timestamp already exists to prevent infinite loops/double-clicks
      if not string.find(text, "%[completed:") then
        -- Some sandboxes restrict os.date; we use a simple format
        local completedAt = os.date("%Y-%m-%dT%H:%M:%S")
        -- Append the timestamp at the end
        local newText = string.gsub(text, "%[%s*%]", "[x]") .. " [completed: \"" .. completedAt .. "\"]"
        
        editor.dispatch({
          changes = {
            from = data.from,
            to = data.to,
            insert = newText
          }
        })
      end

    -- CASE 2: Task marked as incomplete (' ')
    elseif data.newState == " " then
      -- Check if there is actually a timestamp to remove
      if string.find(text, "%[completed:") then        
        -- Remove the [completed: ...] tag and any leading space
        local cleanText = string.gsub(text, "%[[xX]%]", "[ ]")
        local newText = string.gsub(cleanText, "%s*%[completed: [^%]]+]", "")
        
        editor.dispatch({
          changes = {
            from = data.from,
            to = data.to,
            insert = newText
          }
        })
      end
    end
  end
}



-- =========================================================
-- ============ INLINE TASK EDITOR EXTENSION ===============
-- =========================================================

local function openInlineTaskEditor(taskData, existingFields)
    local sessionID = "te_inline_" .. tostring(math.floor(js.window.performance.now()))
    
    local existing = js.window.document.getElementById("sb-taskeditor")
    if existing then existing.remove() end

    -- List of meta-keys that are not custom attributes
    local ignoredKeys = {
      ref = true, tag = true, tags = true, name = true, text = true, page = true, pos = true, range = true,
      toPos = true, state = true, done = true, itags = true, header = true, links = true,
      ilinks = true, _isNewTask = true
    }

    -- Backwards compatibility: construct range from pos/toPos if range is missing
    if not taskData.range and taskData.pos and taskData.toPos then
        taskData.range = { taskData.pos, taskData.toPos }
    end

    -- Read full raw name from source (including hashtags, wikilinks, etc.)
    local fullName = taskData.name or ""

    local content = space.readPage(taskData.page)
    if content and taskData.pos and taskData.range then
        local blockStart = taskData.pos + 1
        local blockLen = taskData.range[2] - taskData.range[1]

        if blockStart > 0 and blockLen > 0 and blockStart + blockLen - 1 <= #content then
            local taskBlock = content:sub(blockStart, blockStart + blockLen - 1)

            -- Find the starting position of the first attribute in the raw text
            -- by checking for all known attribute keys embedded in taskData.
            local first_attr_pos = -1
            for key, _ in pairs(taskData) do
                if not ignoredKeys[key] then
                    local pattern = "%[" .. escapeLuaPattern(key) .. "%s*:"
                    local p = taskBlock:find(pattern)
                    if p and (first_attr_pos == -1 or p < first_attr_pos) then
                        first_attr_pos = p
                    end
                end
            end

            local name_part
            if first_attr_pos > -1 then
                name_part = taskBlock:sub(1, first_attr_pos - 1)
            else
                name_part = taskBlock -- No attributes found
            end

            local extractedName = name_part:match("^%s*[%*%-]%s*%[ ?[xX]? ?%]%s*(.*)")
            if extractedName then
               fullName = extractedName:match("^%s*(.-)%s*$") -- trim whitespace
            end
        end
    end

    local function uniqueHandler(e)
        if e.detail.session == sessionID then
            updateTaskRemote(
                taskData.page, 
                taskData.pos,
                taskData.range,
                fullName,
                e.detail.state, 
                e.detail.text, 
                e.detail.attributes
            )
            js.window.removeEventListener("sb-save-task", uniqueHandler)
        end
    end
    js.window.addEventListener("sb-save-task", uniqueHandler)

    -- Build fields: first try from taskData attributes (embedded by inlineEditTask),
    -- then fall back to existingFields (from regex parsing) if taskData has none.
    local attributeFields = {}
    for key, value in pairs(taskData) do
        if not ignoredKeys[key] then
            if type(value) ~= "table" then
                table.insert(attributeFields, {
                    key = tostring(key),
                    value = tostring(value)
                })
            end
        end
    end

    if #attributeFields == 0 and existingFields and #existingFields > 0 then
        attributeFields = existingFields
    end

    local parts = {}
    for _, f in ipairs(attributeFields) do
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

    local taskNameSafe = string.gsub(tostring(fullName or ""), '"', '\\"')
    taskNameSafe = string.gsub(taskNameSafe, '\n', ' ')
    local isChecked = (taskData.state == "x" or taskData.state == "X") and "checked" or ""

    local modalHeader = taskData._isNewTask and "New Task" or "Inline Task Editor"

    local container = js.window.document.createElement("div")
    container.id = "sb-taskeditor"
    container.innerHTML = [[
    <style>
    
    </style>
    <div class="te-card" id="te-card-inner">
      <div class="te-header">]] .. modalHeader .. [[</div>
      
      <div class="te-row">
        <input type="checkbox" id="te-status-checkbox" class="te-checkbox" ]] .. isChecked .. [[>
        <label for="te-status-checkbox" style="cursor:pointer">Completed</label>
      </div>

      <div class="te-group">
        <label class="te-label">Task Description</label>
        <input type="text" id="te-main-input" class="te-input" value="]] .. taskNameSafe .. [[">
      </div>

      <div id="te-dynamic-fields"></div>
      
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
        <button id="te-add-attr-btn" class="te-btn">Add</button>
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
                 // Auto-detect type from value format
                 if(val && val.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)) {
                     input.type = 'datetime-local';
                     input.value = formatForInput(val, 'datetime-local');
                 } else if(val && val.match(/^\d{4}-\d{2}-\d{2}$/)) {
                     input.type = 'date';
                     input.value = formatForInput(val, 'date');
                 } else {
                     input.type = 'text';
                     input.value = val;
                 }
            }
            group.appendChild(label);
            group.appendChild(input);
            container.appendChild(group);
        };

        fields.forEach(f => {
            createFieldInput(f.key, f.value, f.type || "string");
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
    local cursor = editor.getCursor()
    local currentPage = editor.getCurrentPage()

    -- Query all tasks from the index to get AST data (including multi-line range).
    -- Filter to the current page and find the task whose range contains the cursor.
    local foundTask = nil
    for t in query[[from index.tag "task"]] do
        if t.page == currentPage then
            -- Backwards compatibility: construct range from pos/toPos if range is missing
            if not t.range and t.pos and t.toPos then
                t.range = { t.pos, t.toPos }
            end
            -- Check if the cursor sits inside this task's range
            if t.range and t.pos <= cursor and t.range[2] >= cursor then
                foundTask = t
                break
            end
        end
    end

    if foundTask then
        -- Found via AST index — open with full multi-line range
        openInlineTaskEditor(foundTask, {})
        return
    end

    -- Fallback: cursor is not on an indexed task (e.g. unsaved page, plain line).
    -- Parse the current line manually so the editor still opens.
    local line = editor.getCurrentLine()
    local lineContent = line.text

    local prefix, state, rest =
      lineContent:match("^(%s*[%-%*])%s*%[([ xX])%](.*)")

    if not prefix then
      -- Not a task line at all — open editor to create a new task in place.
      openInlineTaskEditor({
        name = lineContent:match("^%s*(.-)%s*$") or "",
        state = " ",
        page = currentPage,
        pos = line.from,
        range = {line.from, line.to},
        _isNewTask = true
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

    -- Embed parsed attributes into taskData so openInlineTaskEditor can
    -- locate first_attr_pos in the raw source for full name extraction.
    local taskData = {
      name = cleanText,
      state = state,
      page = currentPage,
      pos = line.from,
      range = {line.from, line.to}
    }
    for _, attr in ipairs(attributes) do
      taskData[attr.key] = attr.value
    end

    openInlineTaskEditor(taskData, attributes)
  end


command.define {
  name = "Task Editor: Inline",
  key = "Alt-Shift-e",
  mac = "Alt-Cmd-e",
  run = function() inlineEditTask() end
}
```

## Discussion to this Library
- [Silverbullet Community](https://community.silverbullet.md/t/todo-task-manager-global-interactive-table-sorter-filtering/3767?u=mr.red)