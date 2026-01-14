
# Task Manager

${TaskManager(query[[from index.tag "task" order by name]])}


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
/*  margin-inline: 4px;*/
  font-size: 1.4em;
  border: none;
  cursor: pointer;


            
```

## Task Manager Build Table 

```space-lua

-- Helper to sanitize those ISO strings
local function humanDate(isoStr)
    if not isoStr or isoStr == "" or isoStr == "." then return "." end
    local date, time = isoStr:match("(%d%d%d%d%-%d%d%-%d%d)T(%d%d:%d%d)")
    if date and time then
        return date .. " " .. time
    end
    return isoStr 
end

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

local ICON_OPEN = [[
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
     viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="18" height="18" x="3" y="3" rx="2"/>
</svg>
]]

local ICON_DONE = [[
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
     viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect width="18" height="18" x="3" y="3" rx="2"/>
  <path d="m9 12 2 2 4-4"/>
</svg>
]]


function TaskManager(taskQuery)
    return widget.htmlBlock(dom.table { class = "taskManager",
        dom.thead {
            dom.tr { 
                dom.td {""}, dom.td {"Task"}, dom.td {"Page"}, dom.td {"Prio"},
                dom.td {"Scheduled"}, dom.td {"Completed"}
            }
        },
        dom.tbody(
            (function()
                local rows = {}
                for t in taskQuery do
                    local isDone = (t.state == "x")
                    
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
                    
                    -- Safety Check for Priority: Default to "-" if nil
                    -- Checking both 'priority' (standard) and 'prio' (your custom field)
                    local priorityValue = t.priority or t.prio or "."
                    
                table.insert(rows, dom.tr {
                    dom.td {
                                widgets.button(isDone and "☒" or "☐" ,
                                    function()
                                        toggleTaskRemote(t.page, t.pos, t.state, t.text)
                                    end,
                                    { class = "btn-toggle-task" }
                                )
                            },
                    dom.td { title = isLong and rawName or nil, displayName },
                    dom.td { widgets.button("↪", function() editor.navigate(t.page .. "@" .. t.pos)
                              end, { class = "btn-goto-page" }),
                              " [["..t.page.."]]" },
                    dom.td { tostring(priorityValue) }, 
                    dom.td { humanDate(t.scheduled) },
                    dom.td { humanDate(t.completed) }
                })
                end
                
                if #rows == 0 then
                    return { dom.tr { dom.td { colspan="6", "_No tasks found matching query._" } } }
                end
                
                return rows
            end)()
        )
    })
end

```
