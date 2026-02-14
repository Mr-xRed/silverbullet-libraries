---
name: "Library/Mr-xRed/KanbanBoard"
tags: meta/library
pageDecoration.prefix: "✅ "
---
  
> **warning** Caution - BETA PREVIEW!
>  THIS IS STILL WORK IN PROGRESS! DON’T USE IT ON YOUR PRODUCTION TASKS, IT COULD MESS THEM UP!

# Kanban Board (WORK IN PROGRESS)

This widget creates a customizable Kanban board to visualize and manage tasks from your notes.

## Known issues and bugs:
- **✅ FIXED** - ~~if the task completed in the modal window or in the markdown `[x]` it wont update the `status` attribute~~
- **✅ FIXED** - ~~if the status is edited to “done” it won’t complete the task, it only moves the task to the done column~~
- **✅ FIXED** - ~~No support when you have a [[WikiLink]] in your tasks~~
- **✅ FIXED** - ~~Tags(`#tag`) can be added to the name, but they cannot be edited in the name~~
- 🚫 emoji attributes `📅2026-04-02` for due dates or similars are not supported, and not planned for future relases either
- and some more undocumented ones: 🪲🪳🕷️🦟


> **warning** Important
>   - IMPORTANT!!! - After `System: Reload` and if a KanbanBoard Widget is on your Page make sure to also Reload the page (`Client: Reload UI` or `Ctrl-R` or `F5`)
>   -  Make sure to Refresh the widget if you manually modified the markdown task.
>   -  If you manually update the task in the markdown make sure to reload the widget for the changes to take effect.
>   -  To work properly the attribute values WILL be wrapped in `""` for safer handling strings, and consistency, even if it’s not always necessary. This is not a bug just a heads-up.

## How it Works

The Kanban board works by querying tasks and organizing them into columns based on a specific attribute, typically `status`. You can define the columns and their corresponding status values in the widget's parameters.

**Features:**
- **Customizable Columns:** Define your own workflow stages.
- **Drag and Drop:** Move tasks between columns to update their status.
- **Priority Ranking:** Tasks can be ranked within columns.
- **Quick Edit:** Edit task details directly from the board.
- **Modern UI:** A clean and responsive interface.

## Setup and Configuration

### Widget Parameters

*   **`query`**: (Required) A SilverBullet query to fetch the tasks to display.
*   **`options`**: (Required) A table to configure the board's behavior.
    *   **`Column`**: The task attribute to use for column status (e.g., `"status"`).
    *   **`Columns`**: An ordered list of columns, where each column is a `{status, title}` pair (e.g., `{{'todo', 'To Do'}, {'doing', 'In Progress'}}`).
    *   **`SortDefault`**: (Optional) The task attribute to use for default sorting cards within columns. e.g. `priority`.
    *   **`Fields`**: (Optional) A list of task attributes to display on the card. E.g. `{"due", "priority"}`.
    *   **HideKeys**: (Optional) Hide certain attribute keys/labels from the card. This can be usefull if you have a longer text or a title as attribute and want to display the whole thin

### Example with all options

```lua
${KanbanBoard(
  query[[from index.tag "task"]], 
  {
    {"Column", "status"},
    {"Columns", {
      {"todo", "📝 To Do","purple"},
      {"doing", "⏳ In Progress","red"},
      {"review", "👀 Needs Review","yellow"},
      {"done", "✅ Done","green"}
    }},
    {"SortDefault", "priority"},
    {"Fields", {"priority", "completed"}},
    {"HideKeys", {"tags"}}
  }
)}
```


## DEMO Tasks
- [ ] Multi line normal task with a #hashtag and a [[WikiLink]] in the name and at the end #hashtag 
      [priority: "1"][scheduled: "2026-02-27"][taskID: "T-01-26"]
      [contact: "George"] [status: "⏳"] [due: "2026-03-02"]  
* [ ] Task with a #TestTag and special @ # - * , ! ; $ \ | / characters
      [status: "📥"]  [priority: "2"] [due: "2026-02-02"][taskID: "T-02-26"] 
* [ ] Another normal task  with a #tag in the name [status: "📥"][due: "2026-02-13"][scheduled: "2026-04-01"] #testTag [priority: "2"][taskID: "T-03-26"]
- [x] Completed task [priority: "3"] [status: "✅"][taskID: "T-06-26"]  [completed: "2026-02-14 13:54"]
- [ ] High priority with two [[WikiLink]] in [[name]] #TestTag
      [status: "👀"][priority: "5"] [taskID:"T-04-26"]
- [ ] New task with at tag at the #end [status: "👀"] [priority: "4"][taskID:"T-05-26"]

## DEMO WIDGET

${KanbanBoard(
  query[[from index.tag "task" where page == _CTX.currentPage.name]], 
  {
    {"Column", "status"},
    {"Columns", {
      {"📥", "To Do","purple"},
      {"⏳", "In Progress","blue"},
      {"👀", "Needs Review","orange"},
      {"✅", "Done","green"}
    }},
    {"SortDefault", "priority"},
    {"Fields", {"taskID","priority", "scheduled", "due", "status", "contact", "tags"}},
    {"HideKeys", {"taskID", "tags"}}
  }
)}

# Implementation

## CSS Styling

```space-style

#sb-main .cm-editor .sb-lua-directive-block:has(.kanban-board) .button-bar { top: -40px; padding:0; border-radius: 2em; opacity:0.2; transition: all 0.5s ease;} 
#sb-main .cm-editor .sb-lua-directive-block:has(.kanban-board) .button-bar:hover { opacity:1;}


/* Kanban Board Styles */
.kanban-board {
  display: flex;
  gap: 10px;
  padding: 10px;
  overflow-x: auto;
  align-items: normal;
  /* MODIFICATION: Switched to flex-start so overflow-x: auto can
     scroll from the leftmost column without clipping. */
  justify-content: flex-start;
}

.kanban-column {
  flex: 1;
  min-width: 250px;
  max-width: 500px;
  /* MODIFICATION: Removed the duplicate `min-width: 0` that was overriding the 250px
     above and causing columns to squish on mobile. Added flex-shrink: 0 so columns
     hold their minimum width and the board scrolls horizontally instead. */
  flex-shrink: 0;
  background: oklch(from var(--modal-help-background-color) l c h / 0.4);
  border-radius: 18px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.kanban-column-title {
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.kanban-cards {
  min-height: 100px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
}

.kanban-card {
  background: var(--modal-background-color);
  border: 1px solid var(--modal-border-color);
  box-shadow: 0 0 5px rgba(0 0 0 / 0.8);
  border-radius: 10px;
  padding: 10px;
  cursor: grab;
  position: relative;
  width: 100%; /* added: responsive width */
  box-sizing: border-box; /* added */
}

.kanban-card-name {
  font-weight: bold;
  margin-bottom: 4px;
  overflow: hidden; /* added */
  text-overflow: ellipsis; /* added */
  white-space: nowrap; /* added */
  display: block;
  padding-right: 10px;
  text-decoration-line: none;
}

.kanban-card-page {
  font-size: 0.8em;
  opacity: 0.7;
  overflow: hidden; /* added */
  text-overflow: ellipsis; /* added */
  white-space: nowrap; /* added */
}

.kanban-card-edit {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  opacity: 0.5;
  padding: 2px;
  z-index: 1;
}
.kanban-card-edit:hover {
  opacity: 1;
}

.kanban-card-fields {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85em;
  opacity: 0.8;
}
.kanban-card-field {
  display: flex;
  gap: 4px;
}
.kanban-field-key {
  font-weight: bold;
  white-space: nowrap;
}

/* ---------------------------------
   Kanban Controls (Filter / Sort)
   — pagination removed; mirrored from MediaGallery media-controls otherwise
---------------------------------- */

.kanban-controls {
  padding: 10px 20px 10px 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.kanban-filter-container {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-grow: 1;
}

.kanban-filter-label,
.kanban-sort-label {
  font-weight: 600;
  font-size: 0.9em;
  color: var(--text-muted);
  white-space: nowrap;
}

.kanban-search-input {
  width: 100%;
  max-width: 300px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--modal-border-color);
  background: var(--modal-background-color);
  color: var(--modal-color);
  font-size: 0.9em;
  outline: none;
}

.kanban-sort-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kanban-sort-select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--modal-border-color);
  background: var(--modal-background-color);
  color: var(--modal-color);
  font-size: 0.85em;
  outline: none;
  cursor: pointer;
}

.kanban-sort-buttons {
  display: flex;
  border: 1px solid var(--modal-border-color);
  border-radius: 6px;
  overflow: hidden;
}

.kanban-sort-btn {
  padding: 6px 10px;
  border: none;
  background: var(--modal-background-color);
  color: var(--text-muted);
  font-size: 0.75em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.kanban-sort-btn:hover {
  background: var(--modal-border-color);
  color: var(--modal-color);
}

.kanban-sort-btn.active {
  background: var(--ui-accent-color);
  color: white;
}

/* ---------------------------------
   Column Card Colors (optional accent color per column)
   The --column-card-color variable is set inline on .kanban-column-colored.
   All derived colors are computed from it via relative oklch syntax.
---------------------------------- */

html[data-theme='dark'] .kanban-column-colored .kanban-card {
  background: oklch(from var(--column-card-color) 0.3 0.2 h / 0.35);
  border-color: oklch(from var(--column-card-color) 0.55 0.2 h / 0.65);
  box-shadow: 0 0 5px oklch(from var(--column-card-color) 0.3 0.2 h / 0.5);
}

html[data-theme='light'] .kanban-column-colored .kanban-card {
  background: oklch(from var(--column-card-color) 0.95 0.1 h / 0.55);
  border-color: oklch(from var(--column-card-color) 0.6 0.15 h / 0.75);
  box-shadow: 0 0 5px oklch(from var(--column-card-color) 0.7 0.15 h / 0.5);
}


/* ---------------------------------
   Task Manager Theme Variables
---------------------------------- */

html[data-theme='dark'] {
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
  #sb-taskeditor {
    --task-header-bg: var(--ui-accent-color);
    --taskedit-modal-bg: var(--modal-background-color);
    --taskedit-modal-input-bg: var(--modal-help-background-color);
    --taskedit-modal-color: var(--modal-color);
    --taskedit-modal-border: var(--modal-border-color);
  }
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

## Lua Implementation

```space-lua
-- ------------- Helper: Escape Magic Characters for Lua Patterns -------------
local function escapeLuaPattern(s)
    return s:gsub("([%^%$%(%)%%%.%[%]%*%+%-%?])", "%%%1")
end

-- ------------- Task Editor Modal (adapted from TaskManager) -------------
local function openTaskEditor(taskData)
    local sessionID = "kb_te_" .. tostring(math.floor(js.window.performance.now()))
    
    local existing = js.window.document.getElementById("sb-taskeditor")
    if existing then existing.remove() end

    -- START of new logic
    -- Get the full, raw task name, including hashtags and wikilinks, from the source document.
    local fullName = taskData.name -- Fallback to the clean name from the parser

    -- List of meta-keys that are not custom attributes, used to identify true attributes.
    -- MODIFICATION: Added _kanbanStatusKey, _kanbanDoneStatus, _kanbanDefaultStatus so they
    -- are never shown as editable fields in the modal editor.
    local ignoredKeys = {
      ref = true, tag = true, tags = true, name = true, text = true, page = true, pos = true, range = true,
      toPos = true, state = true, done = true, itags = true, header = true, completed = true, links = true,
      ilinks = true, _kanbanStatusKey = true, _kanbanDoneStatus = true, _kanbanDefaultStatus = true
    }
    
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
                if not ignoredKeys[key] then -- This key is a custom attribute
                    local pattern = "%[" .. escapeLuaPattern(key) .. "%s*:"
                    local pos = taskBlock:find(pattern)
                    if pos and (first_attr_pos == -1 or pos < first_attr_pos) then
                        first_attr_pos = pos
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
            
            -- Extract the name from this part (the text after the checkbox)
            local extractedName = name_part:match("^%s*[%*%-]%s*%[ ?[xX]? ?%]%s*(.*)")
            if extractedName then
               fullName = extractedName:match("^%s*(.-)%s*$") -- trim whitespace
            end
        end
    end
    -- END of new logic

    -- MODIFICATION START: Read kanban config passed by the JS click handler for bidirectional sync
    local boardStatusKey = tostring(taskData._kanbanStatusKey or "status")
    local doneStatus     = tostring(taskData._kanbanDoneStatus or "")
    local defaultStatus  = tostring(taskData._kanbanDefaultStatus or "")
    -- MODIFICATION END

    local function uniqueHandler(e)
        if e.detail.session == sessionID then
            updateTaskRemote(
                taskData.page, 
                taskData.pos,
                taskData.range, -- PASSING RANGE FROM AST
                fullName,  -- PASSING FULL, RAW NAME
                e.detail.state, 
                e.detail.text, 
                e.detail.attributes
            )
            js.window.removeEventListener("sb-save-task", uniqueHandler)
        end
    end
    js.window.addEventListener("sb-save-task", uniqueHandler)
    
    -- This list is used to determine which fields to show in the editor UI.
    -- local ignoredKeys is defined above
    local existingFields = {}
    for key, value in pairs(taskData) do
        if not ignoredKeys[key] then
            if type(value) ~= "table" then -- Attributes can sometimes be parsed as tables
                 table.insert(existingFields, {
                    key = tostring(key),
                    value = tostring(value)
                })
            end
        end
    end

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
    local fieldsJSON = "[" .. table.concat(parts, ",") .. "]"

    local taskNameSafe = string.gsub(tostring(fullName or ""), '"', '\\"')
    taskNameSafe = string.gsub(taskNameSafe, '\n', ' ')
    local isChecked = (taskData.state == "x" or taskData.state == "X") and "checked" or ""

    local container = js.window.document.createElement("div")
    container.id = "sb-taskeditor"
    container.innerHTML = [[
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

    -- MODIFICATION START: Escape and pass kanban config into the modal JS closure
    local boardStatusKeySafe = string.gsub(boardStatusKey, '"', '\\"')
    local doneStatusSafe     = string.gsub(doneStatus,     '"', '\\"')
    local defaultStatusSafe  = string.gsub(defaultStatus,  '"', '\\"')
    -- MODIFICATION END

    local script = [[
    (function() {
        const session = "]] .. sessionID .. [[";
        const fields = ]] .. fieldsJSON .. [[;
        const container = document.getElementById('te-dynamic-fields');
        const root = document.getElementById('sb-taskeditor');
        const card = document.getElementById('te-card-inner');

        // MODIFICATION START: Kanban config for bidirectional checkbox <-> status sync
        const boardStatusKey = "]] .. boardStatusKeySafe .. [[";
        const doneStatus     = "]] .. doneStatusSafe .. [[";
        const defaultStatus  = "]] .. defaultStatusSafe .. [[";
        // MODIFICATION END

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

        // MODIFICATION START: Bidirectional live sync between checkbox and status attribute
        if (boardStatusKey && doneStatus) {
            const checkbox = document.getElementById('te-status-checkbox');

            // Bug 2 fix: on open, if status field already equals doneStatus, check the box
            if (!checkbox.checked) {
                const statusInput = container.querySelector('.te-input[data-key="' + boardStatusKey + '"]');
                if (statusInput && statusInput.value.trim().toLowerCase() === doneStatus.toLowerCase()) {
                    checkbox.checked = true;
                }
            }

            // Bug 1 fix: checkbox → status field (live)
            checkbox.addEventListener('change', function() {
                const statusInput = container.querySelector('.te-input[data-key="' + boardStatusKey + '"]');
                if (statusInput) {
                    statusInput.value = this.checked ? doneStatus : defaultStatus;
                }
            });

            // Bug 2 fix: status field → checkbox (live, via delegation)
            container.addEventListener('input', function(e) {
                if (e.target.matches && e.target.matches('.te-input[data-key]') && e.target.dataset.key === boardStatusKey) {
                    checkbox.checked = (e.target.value.trim().toLowerCase() === doneStatus.toLowerCase());
                }
            });
        }
        // MODIFICATION END

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
            let newState = document.getElementById('te-status-checkbox').checked ? "x" : " ";
            const attributes = [];
            const inputs = container.querySelectorAll('.te-input[data-key]');
            inputs.forEach(inp => {
                let val = inp.value;
                if (inp.type === 'datetime-local' && val.includes("T")) val = val.replace("T", " ");
                attributes.push({ key: inp.dataset.key, value: val });
            });

            // MODIFICATION START: Safety-net sync at save time (checkbox state is authoritative
            // at this point because live sync already kept the two fields in step).
            // Bug 1: checked → ensure status == doneStatus (add if missing)
            // Bug 2: unchecked + status was doneStatus → revert status to defaultStatus
            if (boardStatusKey && doneStatus) {
                let statusAttr = attributes.find(a => a.key === boardStatusKey);
                if (newState === "x") {
                    if (statusAttr) statusAttr.value = doneStatus;
                    else attributes.push({ key: boardStatusKey, value: doneStatus });
                } else if (statusAttr && statusAttr.value.trim().toLowerCase() === doneStatus.toLowerCase()) {
                    statusAttr.value = defaultStatus;
                }
            }
            // MODIFICATION END

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

        // MODIFICATION: Only close if mouse started and ended on the root (background)
        let rootClickStarted = false;
        root.onmousedown = (e) => { rootClickStarted = (e.target === root); };
        root.onmouseup = (e) => {
            if (rootClickStarted && e.target === root) cleanup();
            rootClickStarted = false;
        };

        root.onclick = (e) => { e.stopPropagation(); }; // Prevent bubbling issues

        setTimeout(() => document.getElementById('te-main-input').focus(), 50);
    })();
    ]]

    local scriptEl = js.window.document.createElement("script")
    scriptEl.innerHTML = script
    container.appendChild(scriptEl)
end


-- ------------- Update Task Attributes Function (Updated for AST/Multi-line) -------------
function updateTaskRemote(pageName, pos, range, originalName, finalState, newText, attributes)
    local content = space.readPage(pageName)
    if not content then return end

    -- Use the AST Range to get the EXACT block of this task, preserving newlines
    local blockStart = pos + 1
    local blockLen = range[2] - range[1]
    local taskBlock = content:sub(blockStart, blockStart + blockLen - 1)

    -- 1. Update State (Checkbox)
    -- This regex finds the checkbox [ ] or [x] at the start of the task block
    local stateMark = "[ ]"
    if finalState == "x" or finalState == "X" then stateMark = "[x]" end
    taskBlock = taskBlock:gsub("^(%s*[%*%-]%s*)%[[ xX]?%]", "%1" .. stateMark, 1)

    -- 2. Update Description (Name)
    -- We replace the first occurrence of the original name with the new text.
    -- This attempts to preserve the rest of the line or subsequent lines.
    if originalName and newText and originalName ~= newText then
         -- Use string.find with plain=true for a literal search, which is safer than using gsub with a pattern.
         -- This avoids issues with special characters in the task name.
         local start, finish = string.find(taskBlock, originalName, 1, true)
         if start then
             taskBlock = taskBlock:sub(1, start - 1) .. newText .. taskBlock:sub(finish + 1)
         end
    end

    -- 3. Update Attributes (In-Place or Append)
    for _, attr in ipairs(attributes) do
        local key = attr.key
        local val = tostring(attr.value or "")
        
        -- MODIFICATION: Strip existing quotes if they are already there to avoid double-wrapping
        if val:sub(1,1) == '"' and val:sub(-1,-1) == '"' then
            val = val:sub(2, -2)
        end
        local quotedVal = '"' .. val .. '"'

        -- Basic validation
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
             -- MODIFICATION: Wrap completion timestamp in quotes
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
    end, 200)
end

-- ------------- Update Task Status for Drag and Drop (Updated for AST/Multi-line) -------------
function updateTaskStatus(pageName, pos, range, statusKey, newStatus, toggleState)
    local content = space.readPage(pageName)
    if not content then return end

    -- AST Calculation: Get specific task block
    local blockStart = pos + 1
    local blockLen = range[2] - range[1]
    
    -- Safety check: Ensure we aren't going out of bounds
    if blockStart + blockLen - 1 > #content then
        return 
    end

    local taskBlock = content:sub(blockStart, blockStart + blockLen - 1)
    
    -- MODIFICATION: Ensure new status is wrapped in quotes
    local cleanStatus = tostring(newStatus or "")
    if cleanStatus:sub(1,1) == '"' and cleanStatus:sub(-1,-1) == '"' then
        cleanStatus = cleanStatus:sub(2, -2)
    end
    local quotedStatus = '"' .. cleanStatus .. '"'
    
    -- 1. Update Status Attribute
    -- Find [status: value] anywhere in the multi-line block
    local attrPattern = "(%[" .. escapeLuaPattern(statusKey) .. "%s*:%s*.-%])"
    
    if taskBlock:find(attrPattern) then
        -- Replace existing tag in-place (preserves position)
        taskBlock = taskBlock:gsub(attrPattern, "[".. statusKey ..": " .. quotedStatus .. "]")
    else
        -- Append to end if not found
        taskBlock = taskBlock .. " [".. statusKey ..": " .. quotedStatus .. "]"
    end

    -- 2. Update Checkbox State if requested
    if toggleState == "checked" then
         taskBlock = taskBlock:gsub("^(%s*[%*%-]%s*)%[[ xX]?%]", "%1[x]", 1)
    elseif toggleState == "unchecked" then
         taskBlock = taskBlock:gsub("^(%s*[%*%-]%s*)%[[xX]%]", "%1[ ]", 1)
    end

    -- Write back using specific range
    local prefix = content:sub(1, blockStart - 1)
    local suffix = content:sub(blockStart + blockLen)
    
    local finalContent = prefix .. taskBlock .. suffix
    space.writePage(pageName, finalContent)

    js.window.setTimeout(function()  
        codeWidget.refreshAll()  
    end, 200)
end

-- ------------- Event Listeners -------------
js.window.addEventListener("sb-kanban-edit-task", function(e)
  openTaskEditor(e.detail)
end)

js.window.addEventListener("sb-kanban-dnd-update", function(e)
    if e.detail and e.detail.action == "move" then
        updateTaskStatus(
            e.detail.page, 
            e.detail.pos, 
            e.detail.range, -- PASSING RANGE
            e.detail.statusKey, 
            e.detail.newStatus, 
            e.detail.toggleState
        )
    end
end)

-- ------------- Main Kanban Board Function -------------
function KanbanBoard(taskQuery, options)
    -- List of meta-keys that are not custom attributes, used to identify true attributes.
    local ignoredKeys = {
      ref = true, tag = true, tags = true, name = true, text = true, page = true, pos = true, range = true,
      toPos = true, state = true, done = true, itags = true, header = true, completed = true, links = true,
      ilinks =true
    }
    local statusKey = "status"
    local sortDefault = nil -- default sort field, set via {"SortDefault", "fieldname"}
    local columnOrder = {}
    local columnTitles = {}
    local columnColors = {} -- optional accent color per column, set via 3rd element in Columns config
    local fields = {} -- New: For custom fields
    local hideKeys = {} -- field keys whose label is hidden on cards, set via {"HideKeys", {"key1","key2"}}

    for _, opt in ipairs(options) do
        if opt[1] == "Column" then statusKey = opt[2] end
        if opt[1] == "Columns" then
          local cols = opt[2]
          for _, colData in ipairs(cols) do
            local status = tostring(colData[1]):gsub("^%s*(.-)%s*$", "%1")
                status = status:lower()
            local title = colData[2]
            table.insert(columnOrder, status)
            columnTitles[status] = title
            if colData[3] and colData[3] ~= "" then -- optional accent color
                columnColors[status] = tostring(colData[3])
            end
          end
        end
        if opt[1] == "SortDefault" then sortDefault = opt[2] end -- read SortDefault option
        if opt[1] == "Fields" then fields = opt[2] or {} end -- New
        if opt[1] == "HideKeys" then -- build a lookup set of keys whose label to hide on cards
            for _, k in ipairs(opt[2] or {}) do
                hideKeys[tostring(k)] = true
            end
        end
    end

    local tasksByStatus = {}
    for _, status in ipairs(columnOrder) do
        tasksByStatus[status] = {}
    end

    if #columnOrder == 0 then return widget.new{ display="block", html="<p>Error: No columns defined for Kanban board.</p>" } end

    for t in taskQuery do
        local raw_status = t[statusKey] or columnOrder[1]
        local status = tostring(raw_status):gsub("^%s*(.-)%s*$", "%1")
              status = status:lower()
        
        if tasksByStatus[status] then
            table.insert(tasksByStatus[status], t)
        else
            -- If it doesn't have a status or is unknown, move to first column
            table.insert(tasksByStatus[columnOrder[1]], t)
        end
    end

    local boardId = "kanban-" .. tostring(math.random(100000))

    -- Build sort options: SortDefault first (if set), then "name", then remaining fields
    local sortFields = {}
    local seenSortFields = {}
    if sortDefault and sortDefault ~= "" then
        table.insert(sortFields, sortDefault)
        seenSortFields[sortDefault] = true
    end
    if not seenSortFields["name"] then
        table.insert(sortFields, "name")
        seenSortFields["name"] = true
    end
    for _, f in ipairs(fields) do
        if f and not seenSortFields[f] then
            table.insert(sortFields, f)
            seenSortFields[f] = true
        end
    end

    local sortOptionsHtml = ""
    for _, f in ipairs(sortFields) do
        local label = f:sub(1,1):upper() .. f:sub(2):gsub("_", " ")
        sortOptionsHtml = sortOptionsHtml .. "<option value='" .. f .. "'>" .. label .. "</option>"
    end

    -- MODIFICATION START: Serialize columnOrder to JSON for the board JS so the click handler
    -- can pass doneStatus / defaultStatus to the task editor (needed for Bug 1 & 2 fixes).
    local columnOrderParts = {}
    for _, s in ipairs(columnOrder) do
        table.insert(columnOrderParts, '"' .. s:gsub('"', '\\"') .. '"')
    end
    local columnOrderJson = "[" .. table.concat(columnOrderParts, ",") .. "]"
    -- MODIFICATION END

    -- Controls bar (filter + sort) — MODIFICATION: pagination removed, it is not used in the Kanban Board
    local controlsHtml = [[
    <div class="kanban-controls">
      <div class="kanban-filter-container">
        <label class="kanban-filter-label">Filter: </label>
        <input type="text" class="kanban-search-input" placeholder="Search tasks...">
      </div>
      <div class="kanban-sort-container">
        <label class="kanban-sort-label">Order by: </label>
        <select class="kanban-sort-select">
    ]] .. sortOptionsHtml .. [[
        </select>
        <div class="kanban-sort-buttons">
          <button class="kanban-sort-btn active" data-dir="asc" title="Sort A-Z">A-Z</button>
          <button class="kanban-sort-btn" data-dir="desc" title="Sort Z-A">Z-A</button>
        </div>
      </div>
    </div>
    ]]
    
    local html = '<div id="' .. boardId .. '">'
    html = html .. controlsHtml
    html = html .. '<div class="kanban-board">'
    
    for _, status in ipairs(columnOrder) do
        local title = columnTitles[status]
        local tasks = tasksByStatus[status]

        -- Build optional color class and inline CSS variable for this column
        local colorAttr = ""
        if columnColors[status] then
            colorAttr = ' kanban-column-colored" style="--column-card-color: ' .. columnColors[status]
        end

        html = html .. '<div class="kanban-column' .. colorAttr .. '" data-status="' .. status .. '">'
        html = html .. '<div class="kanban-column-title">' .. title .. ' (' .. #tasks .. ')</div>'
        html = html .. '<div class="kanban-cards">'
        
        for _, task in ipairs(tasks) do
        
            -- [[ MODIFICATION START: Backwards compatibility for stable release (missing range) ]] --
            -- If 'range' is missing (stable release), but we have 'pos' and 'toPos',
            -- we construct the range manually so it gets serialized into the JSON below.
            if not task.range and task.pos and task.toPos then
                task.range = { task.pos, task.toPos }
            end
            -- [[ MODIFICATION END ]] --
            
            -- START: New logic to get full task name for card display
            -- This parses the name from the source document to include hashtags, etc. on the card.
            local fullName = task.name -- Fallback

            local content = space.readPage(task.page)
            if content and task.pos and task.range then
                local blockStart = task.pos + 1
                local blockLen = task.range[2] - task.range[1]

                if blockStart > 0 and blockLen > 0 and blockStart + blockLen - 1 <= #content then
                    local taskBlock = content:sub(blockStart, blockStart + blockLen - 1)
                    
                    local first_attr_pos = -1
                    for key, _ in pairs(task) do
                        if not ignoredKeys[key] then -- This key is a custom attribute
                            local pattern = "%[" .. escapeLuaPattern(key) .. "%s*:"
                            local pos = taskBlock:find(pattern)
                            if pos and (first_attr_pos == -1 or pos < first_attr_pos) then
                                first_attr_pos = pos
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
            
            local taskName = (fullName or "")
                  taskName = taskName:gsub('"', '&quot;')
                  taskName = taskName:gsub('<', '&lt;')
                  taskName = taskName:gsub('>', '&gt;')
            -- END: New logic
            local taskPage = task.page
            local taskPos = task.pos
            local taskRef = task.ref
            
            local jsonParts = {}
            for k, v in pairs(task) do
                local key = tostring(k)
                key = key:gsub('"', '\\"')
                local keyStr = '"' .. key .. '"'

                local valStr
                if type(v) == "number" then
                    valStr = tostring(v)
                elseif type(v) == "boolean" then
                    valStr = v and "true" or "false"
                elseif type(v) == "table" then
                      -- Handle tables (like Range)
                      if key == "range" then
                          valStr = "[" .. table.concat(v, ",") .. "]"
                      else
                          local s = tostring(v)
                          -- MODIFICATION: Avoiding chaining
                          s = s:gsub('\\', '\\\\')
                          s = s:gsub('"', '\\"')
                          valStr = '"' .. s .. '"'
                      end
                else
                    local s = tostring(v)
                    -- MODIFICATION: Avoiding chaining
                    s = s:gsub('\\', '\\\\')
                    s = s:gsub('"', '\\"')
                    s = s:gsub('\n', '\\n')
                    valStr = '"' .. s .. '"'
                end
                table.insert(jsonParts, keyStr .. ":" .. valStr)
            end
            local taskJson = "{" .. table.concat(jsonParts, ",") .. "}"
            local taskJsonSafe = tostring(taskJson):gsub('"', '&quot;')

            -- Build filter content string for search (name + all visible field values)
            local filterParts = {string.lower(tostring(fullName or ""))}
            for _, fieldKey in ipairs(fields) do
                local fv = task[fieldKey]
                if fv then
                    if type(fv) == "table" then
                        table.insert(filterParts, string.lower(table.concat(fv, " ")))
                    else
                        table.insert(filterParts, string.lower(tostring(fv)))
                    end
                end
            end
            local filterContent = table.concat(filterParts, " ")
                  filterContent = filterContent:gsub('"', '&quot;')

            -- Build sort data attributes for all sortable fields
            local sortDataAttr = ' data-sort-name="' .. taskName .. '"'
            for _, f in ipairs(sortFields) do
                if f ~= "name" then
                    local sv = task[f]
                    if sv == nil then sv = "" end
                    if type(sv) == "table" then sv = table.concat(sv, ", ") end
                    local svSafe = tostring(sv):gsub("'", "&#39;")
                    sortDataAttr = sortDataAttr .. " data-sort-" .. f .. "='" .. svSafe .. "'"
                end
            end

            -- The card itself is no longer the draggable item if it's a link
            html = html .. '<div class="kanban-card-wrapper">'
            
            html = html .. '<div class="kanban-card" draggable="true" ' ..
                'data-task-page="' .. taskPage .. '" ' ..
                'data-task-pos="' .. taskPos .. '" ' ..
                'data-task-json="' .. taskJsonSafe .. '" ' ..
                'data-filter="' .. filterContent .. '"' ..
                sortDataAttr .. '>'
            
            html = html .. '<div class="kanban-card-edit">✎</div>'

            -- Clickable Title - MODIFICATION: added draggable="false" to prevent browser default drag behavior on link
            html = html .. '<a class="kanban-card-name" draggable="false" href="/' .. taskRef .. '" data-ref="/' .. taskRef .. '" title="'..taskName..'">' .. taskName .. '</a>'
            
            -- Custom Fields
            if #fields > 0 then
                html = html .. '<div class="kanban-card-fields">'
                for _, fieldKey in ipairs(fields) do
                    local fieldValue = task[fieldKey]
                    if fieldValue then
                        if type(fieldValue) == "table" then fieldValue = table.concat(fieldValue, ", ") end
                        -- Render key label only when it is not in the hideKeys lookup
                        local keyHtml = ""
                        if not hideKeys[fieldKey] then
                            keyHtml = '<span class="kanban-field-key">' .. fieldKey .. ': </span>'
                        end
                        html = html .. '<div class="kanban-card-field">' ..
                           keyHtml ..
                           '<span class="kanban-field-value">' .. tostring(fieldValue) .. '</span>' ..
                           '</div>'
                    end
                end
                html = html .. '</div>'
            end
            
            html = html .. '</div>' -- close kanban-card
            html = html .. '</div>' -- close kanban-card-wrapper
        end
        
        html = html .. '</div></div>'
    end
    
    html = html .. '</div>' -- close kanban-board
    html = html .. '</div>' -- close boardId wrapper
    
    local jsCode = [[
    (function() {
        const boardId = "]] .. boardId .. [[";
        const statusKey = "]] .. statusKey .. [[";
        // MODIFICATION: Column order array for passing done/default status to the task editor
        const columnOrder = ]] .. columnOrderJson .. [[;

        // ----- Filter / Sort state (mirrored from MediaGallery; pagination removed) -----
        let sortDirection = "asc";
        
        const init = () => {
            const root = document.getElementById(boardId);
            if (!root) return false;

            const board = root.querySelector(".kanban-board");
            const input = root.querySelector(".kanban-search-input");
            const sortSelect = root.querySelector(".kanban-sort-select");
            const sortBtns = root.querySelectorAll(".kanban-sort-btn");

            if (!board || !input) return false;

            // ----- Filter + Sort logic (same as MediaGallery updateDisplay; pagination removed) -----
            const updateDisplay = () => {
                const rawQuery = input.value.toLowerCase().trim();
                const keywords = rawQuery.split(/\s+/).filter(k => k.length > 0);
                const sortField = sortSelect.value;

                // Collect all cards across all columns
                const allWrappers = Array.from(board.querySelectorAll(".kanban-card-wrapper"));

                // Filter
                const filtered = allWrappers.filter(wrapper => {
                    const card = wrapper.querySelector(".kanban-card");
                    if (!card) return false;
                    const data = card.getAttribute("data-filter") || "";
                    return keywords.every(word => data.includes(word));
                });

                // Sort within each column independently
                const columns = Array.from(board.querySelectorAll(".kanban-column"));
                columns.forEach(col => {
                    const cardsContainer = col.querySelector(".kanban-cards");
                    if (!cardsContainer) return;

                    // Get filtered wrappers that belong to this column
                    const colWrappers = filtered.filter(w => cardsContainer.contains(w));
                    const allColWrappers = Array.from(cardsContainer.querySelectorAll(".kanban-card-wrapper"));

                    // Hide all first
                    allColWrappers.forEach(w => { w.style.display = "none"; });

                    // Sort the filtered subset
                    colWrappers.sort((a, b) => {
                        const cardA = a.querySelector(".kanban-card");
                        const cardB = b.querySelector(".kanban-card");
                        if (!cardA || !cardB) return 0;

                        let valA = cardA.getAttribute("data-sort-" + sortField) || "";
                        let valB = cardB.getAttribute("data-sort-" + sortField) || "";

                        // Attempt numeric conversion for numeric-looking fields
                        const numA = parseFloat(valA.replace(/[^0-9.]/g, ''));
                        const numB = parseFloat(valB.replace(/[^0-9.]/g, ''));
                        if (!isNaN(numA) && !isNaN(numB)) {
                            return sortDirection === "asc" ? numA - numB : numB - numA;
                        }

                        return sortDirection === "asc"
                            ? valA.localeCompare(valB)
                            : valB.localeCompare(valA);
                    });

                    // Show all filtered+sorted cards (no pagination)
                    colWrappers.forEach((w, idx) => {
                        w.style.display = "";
                        w.style.order = idx;
                    });
                });
            };

            // ----- Event listeners for controls (same pattern as MediaGallery) -----
            input.addEventListener("input", () => {
                updateDisplay();
            });

            sortSelect.addEventListener("change", () => {
                updateDisplay();
            });

            sortBtns.forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    sortBtns.forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    sortDirection = btn.getAttribute("data-dir");
                    updateDisplay();
                });
            });

            // ----- Drag-and-drop logic -----
            let draggedCard = null;

            board.addEventListener('click', (e) => {
                const editBtn = e.target.closest('.kanban-card-edit');
                if (editBtn) {
                    e.stopPropagation();
                    const card = editBtn.closest('.kanban-card');
                    try {
                        const taskData = JSON.parse(card.dataset.taskJson);
                        // MODIFICATION START: Pass kanban config so the editor can sync
                        // the status attribute with the Completed checkbox (Bug 1 & 2 fix).
                        taskData._kanbanStatusKey  = statusKey;
                        taskData._kanbanDoneStatus    = columnOrder.length > 0 ? columnOrder[columnOrder.length - 1] : "";
                        taskData._kanbanDefaultStatus = columnOrder.length > 0 ? columnOrder[0] : "";
                        // MODIFICATION END
                        window.dispatchEvent(new CustomEvent("sb-kanban-edit-task", { detail: taskData }));
                    } catch(err) { console.error("Failed to parse task data", err); }
                }
            });

            // --- Mouse drag events ---
            board.addEventListener('dragstart', (e) => {
                if (e.target.classList.contains('kanban-card')) {
                    draggedCard = e.target;
                    setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
                }
            });

            board.addEventListener('dragend', (e) => {
                if (draggedCard) {
                    draggedCard.style.opacity = '';
                    draggedCard = null;
                }
            });

            board.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            board.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedCard) {
                    const column = e.target.closest('.kanban-column');
                    if (column) {
                        const newStatus = column.dataset.status;
                        const page = draggedCard.dataset.taskPage;
                        const pos = parseInt(draggedCard.dataset.taskPos, 10);
                        
                        // Parse range from the stored JSON to ensure accuracy
                        let range = null;
                        try {
                            const data = JSON.parse(draggedCard.dataset.taskJson);
                            range = data.range;
                        } catch(err) { console.log("No range found"); }

                        const allColumns = Array.from(board.querySelectorAll('.kanban-column'));
                        const isLastColumn = allColumns.indexOf(column) === allColumns.length - 1;
                        const toggleState = isLastColumn ? "checked" : "unchecked";

                        // Append the entire wrapper, not just the card
                        column.querySelector('.kanban-cards').appendChild(draggedCard.closest('.kanban-card-wrapper'));
                        
                        if (page && !isNaN(pos) && newStatus && range) {
                            window.dispatchEvent(new CustomEvent("sb-kanban-dnd-update", {
                                detail: {
                                    action: "move",
                                    page: page,
                                    pos: pos,
                                    range: range, // Sending AST Range to Lua
                                    statusKey: statusKey,
                                    newStatus: newStatus,
                                    toggleState: toggleState
                                }
                            }));
                        }
                    }
                }
            });

            // MODIFICATION START: Add Touch support for drag and drop on mobile with delay
            let isDragging = false;
            let dragTimer = null;
            let touchStartX, touchStartY;

            board.addEventListener('touchstart', e => {
                const card = e.target.closest('.kanban-card');
                if (card && e.touches.length === 1) {
                    const touch = e.touches[0];
                    touchStartX = touch.clientX;
                    touchStartY = touch.clientY;

                    dragTimer = setTimeout(() => {
                        isDragging = true;
                        draggedCard = card;
                        draggedCard.style.opacity = '0.5';
                    }, 200); // 200ms delay
                }
            }, { passive: true });
            
            board.addEventListener('touchmove', e => {
                if (dragTimer) {
                    const touch = e.touches[0];
                    const deltaX = Math.abs(touch.clientX - touchStartX);
                    const deltaY = Math.abs(touch.clientY - touchStartY);

                    if (deltaX > 10 || deltaY > 10) {
                        clearTimeout(dragTimer);
                        dragTimer = null;
                    }
                }

                if (!isDragging || !draggedCard) return;
                
                e.preventDefault();

                const touch = e.touches[0];
                const elementOver = document.elementFromPoint(touch.clientX, touch.clientY);
                const columnOver = elementOver ? elementOver.closest('.kanban-column') : null;
                if (columnOver) {
                    const cardsContainer = columnOver.querySelector('.kanban-cards');
                    cardsContainer.appendChild(draggedCard.closest('.kanban-card-wrapper'));
                }
            }, { passive: false });
            
            board.addEventListener('touchend', e => {
                if (dragTimer) {
                    clearTimeout(dragTimer);
                    dragTimer = null;
                }
                
                if (!isDragging || !draggedCard) return;

                isDragging = false;
                draggedCard.style.opacity = '';

                const column = draggedCard.closest('.kanban-column');
                if (column) {
                    const newStatus = column.dataset.status;
                    const page = draggedCard.dataset.taskPage;
                    const pos = parseInt(draggedCard.dataset.taskPos, 10);
                    
                    let range = null;
                    try {
                        const data = JSON.parse(draggedCard.dataset.taskJson);
                        range = data.range;
                    } catch(err) { console.log("No range found"); }

                    const allColumns = Array.from(board.querySelectorAll('.kanban-column'));
                    const isLastColumn = allColumns.indexOf(column) === allColumns.length - 1;
                    const toggleState = isLastColumn ? "checked" : "unchecked";
                    
                    if (page && !isNaN(pos) && newStatus && range) {
                        window.dispatchEvent(new CustomEvent("sb-kanban-dnd-update", {
                            detail: {
                                action: "move",
                                page: page,
                                pos: pos,
                                range: range,
                                statusKey: statusKey,
                                newStatus: newStatus,
                                toggleState: toggleState
                            }
                        }));
                    }
                }
                draggedCard = null;
            });
            // MODIFICATION END

            // MODIFICATION START: On load, sync cards whose markdown checkbox state does not
            // match the column they are currently rendered in. Two directions are handled:
            // Direction 1: task is [x] in markdown but not in the done column → move it there.
            // Direction 2: task is [ ] in markdown but sitting in the done column → move it back to the first column.
            const syncCheckedTasks = () => {
                if (columnOrder.length === 0) return;
                const doneStatus    = columnOrder[columnOrder.length - 1];
                const defaultStatus = columnOrder[0];
                const doneColumn    = board.querySelector('.kanban-column[data-status="' + doneStatus + '"]');
                const defaultColumn = board.querySelector('.kanban-column[data-status="' + defaultStatus + '"]');
                if (!doneColumn || !defaultColumn) return;
                const doneCardsContainer    = doneColumn.querySelector('.kanban-cards');
                const defaultCardsContainer = defaultColumn.querySelector('.kanban-cards');
                if (!doneCardsContainer || !defaultCardsContainer) return;

                const allCards = Array.from(board.querySelectorAll('.kanban-card'));
                allCards.forEach(card => {
                    const column = card.closest('.kanban-column');
                    if (!column) return;
                    const currentStatus = column.dataset.status;

                    try {
                        const taskData = JSON.parse(card.dataset.taskJson);
                        const isChecked = (taskData.state === 'x' || taskData.state === 'X');
                        const range = taskData.range;

                        if (isChecked && currentStatus !== doneStatus) {
                            // Task is checked [x] in markdown but not in the done column → move it there
                            doneCardsContainer.appendChild(card.closest('.kanban-card-wrapper'));
                            if (taskData.page && taskData.pos != null && range) {
                                window.dispatchEvent(new CustomEvent("sb-kanban-dnd-update", {
                                    detail: {
                                        action: "move",
                                        page: taskData.page,
                                        pos: taskData.pos,
                                        range: range,
                                        statusKey: statusKey,
                                        newStatus: doneStatus,
                                        toggleState: "checked"
                                    }
                                }));
                            }
                        } else if (!isChecked && currentStatus === doneStatus) {
                            // Task is unchecked [ ] in markdown but still in the done column → move it back to default
                            defaultCardsContainer.appendChild(card.closest('.kanban-card-wrapper'));
                            if (taskData.page && taskData.pos != null && range) {
                                window.dispatchEvent(new CustomEvent("sb-kanban-dnd-update", {
                                    detail: {
                                        action: "move",
                                        page: taskData.page,
                                        pos: taskData.pos,
                                        range: range,
                                        statusKey: statusKey,
                                        newStatus: defaultStatus,
                                        toggleState: "unchecked"
                                    }
                                }));
                            }
                        }
                    } catch(err) { console.error("syncCheckedTasks error", err); }
                });
            };
            syncCheckedTasks();
            // MODIFICATION END

            // Initial render
            updateDisplay();
            return true;
        };
        
        let attempts = 0;
        const timer = setInterval(() => {
            if (init() || attempts > 10) clearInterval(timer);
            attempts++;
        }, 100);
    })();
    ]]

    local scriptEl = js.window.document.createElement("script")
    scriptEl.innerHTML = jsCode
    js.window.document.body.appendChild(scriptEl)

    return widget.new {
        display = "block",
        html = html
    }
end
```


## Discussions to this library
- [Silverbullet Community](https://community.silverbullet.md/t/kanban-integration-with-tasks/925/12?u=mr.red)