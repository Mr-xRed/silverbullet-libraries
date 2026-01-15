---
name: "Library/Mr-xRed/TaskManager"
tags: meta/library
pageDecoration.prefix: "✅ "
---

# Task Manager

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
config.set("taskManager", {
  open = "☐",               -- any unicode character or emojis. e.g.: "🔳", "⭕️", "☐"
  done = "☑",               -- any unicode character or emojis. e.g.: "✅", "🟢", "☑"
  gotoTask = "↪",           -- any unicode character or emojis. e.g.: "⛓️", "⚓️", "↪"
  boxSize = "1.8em",        -- any CSS unit "px", "em"
  emptyAttribute = "---",   -- any unicode character or emojis. e.g.: "🚫", "N.A.", "---"
 })
```

## Task Manager Table Styling

```space-style

html[data-theme='dark'] .taskManager {
  --task-header-color: oklch(0.6 0.2 260 / 0.5);
}

html[data-theme='light'] .taskManager {
  --task-header-color: oklch(from var(--ui-accent-color) calc(l + 0.1) c h / 0.8);
}


#sb-main .cm-editor .taskManager {
  
  font-size: 0.8em;
  
  table {
    display: table;
    border-collapse: separate;
    box-sizing: border-box;
    text-indent: initial;
    unicode-bidi: isolate;
    border-spacing: 2px;
    border-color: gray;
 }

    thead tr {
      line-height: 2;
      background: var(--task-header-color)
    }
      
    td { padding: 2px;}
    
    tbody tr:nth-of-type(even) { }
    tbody tr:nth-of-type(odd) { }
    /* thead th { opacity: 1 !important;}*/
    td:first-child { justify-content: center; }
    th:nth-child(2), td:nth-child(2),
    th:nth-child(3), td:nth-child(3) { text-align: left;}
    th, td { text-align: center; vertical-align: middle; }

 }


#sb-main button.btn-toggle-task,
#sb-main button.btn-goto-page {
  background: transparent;
  padding: 0 ;
/*  font-size: 1.4em;*/
  border: none;
  cursor: pointer;

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

-- ------------- Table Building Function -------------
function TaskManager(taskQuery, extraCols)
    extraCols = extraCols or {
        {"Completed", "completed", "date"}
    }

    -- helper to get a field from task robustly
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

    if val == nil then
        return emptyAttribute
    end

    if type(val) == "table" then
        if #val == 0 then
            return emptyAttribute
        else
            return table.concat(val, ", ")
        end
    end

    if val == "" then return emptyAttribute end

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
                            widgets.button(isDone and done or open,
                                function()
                                    toggleTaskRemote(t.page, t.pos, t.state, t.text)
                                end,
                                { class = "btn-toggle-task", style = "font-size: ".. boxSize}
                            )
                        },
                        dom.td { title = isLong and rawName or nil, displayName },
                        dom.td {
                            widgets.button(gotoTask, function()
                                editor.navigate(t.page .. "@" .. t.pos)
                            end, { class = "btn-goto-page" }),
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

```


## Discussion to this Library
- [Silverbullet Community](https://community.silverbullet.md/t/todo-task-manager-global-interactive-table-sorter-filtering/3767?u=mr.red)

