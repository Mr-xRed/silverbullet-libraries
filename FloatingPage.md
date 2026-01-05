---
name: "Library/Mr-xRed/FloatingPage"
tags: meta/library
files:
- UnifiedFloating.js
pageDecoration.prefix: "📃 "
---
# Open Floating Page

> **warning** PROOF OF CONCEPT - EXPERIMENTAL ONLY
 
> **success** Shortcut Keys
> `Ctrl-Alt-o` - Opens the Page Picker to chose the Page
> Ctrl-Alt-Enter/Cmd-Alt-Enter - Opens the page under the cursor in a Floating Window
> Ctrl-Alt-Click/Cmd-Alt-Click - Opens the clicked WikiLink under the mouse in a Floating Window

Try it out here 👉 ${widgets.commandButton("Floating: Open")}${widgets.commandButton("Page","Floating: EXAMPLE: Open Internal Page")}${widgets.commandButton("External Website","Floating: EXAMPLE: Open Webpage")}${widgets.commandButton("Custom HTML","Floating: EXAMPLE: Open Custom HTML")}

This JS opens a page, a website, direct HTML into a Floating Resizable window.
See Examples below
# Here is a text to test it out:

Lorem ipsum dolor sit amet, https://www.wikipedia.org consectetur adipiscing elit, https://www.wikipedia.de sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo https://www.wikipedia.ro consequat. Duis aute irure dolor in reprehenderit in [voluptate](https://www.google.de) velit esse cillum dolore eu fugiat nulla pariatur. [[Excepteur]] sint occaecat cupidatat non proident, sunt in culpa qui officia [[deserunt]] mollit anim id est laborum.


# Examples:

```space-lua
  
-- Mode 1: Internal SilverBullet Page
command.define {
  name = "Floating: EXAMPLE: Open Internal Page",
  hide = true,
  run = function()
    js.import("/.fs/Library/Mr-xRed/UnifiedFloating.js").show("CONFIG", "Configuration")
  end
}

-- Mode 2: External Website
command.define {
  name = "Floating: EXAMPLE: Open Webpage",
  hide = true,
  run = function()
    -- Note: Some sites like Google/GitHub block iframes for security. 
    -- Wikipedia and personal sites usually work fine.
    js.import("/.fs/Library/Mr-xRed/UnifiedFloating.js").show("https://en.wikipedia.org", "Wikipedia")
  end
}

-- Mode 3: Direct HTML Code
command.define {
  name = "Floating: EXAMPLE: Open Custom HTML",
  hide = true,
  run = function()
    local myHtml = [[
      <body style="background: #1a1a1a; color: white; font-family: sans-serif; padding: 20px;">
        <h1>Hello from Lua!</h1>
        <p>This is a floating window rendered directly from a string.</p>
        <button onclick="alert('It works!')">Click Me</button>
      </body>
    ]]
    js.import("/.fs/Library/Mr-xRed/UnifiedFloating.js").show(myHtml, "Custom App")
  end
}

```

```space-lua
command.define {
  name = "Floating: Open",
  key = "Ctrl-Shift-o",
  run = function()
    local allPages = query[[
      from index.tag "page"
      order by _.lastModified desc]]
    local page = editor.filterBox('🔍', allPages, "Select page")
    if page != nil then
      js.import("/.fs/Library/Mr-xRed/UnifiedFloating.js").show(page.name)
    end
  end
}
```



```space-lua
-- Shared logic for detecting links at a specific document offset
local function findAndOpenLink(offset)
    local line = editor.getCurrentLine()
    local text = line.text
    
    -- Convert document-wide offset to line-relative position for searching
    -- Lua is 1-indexed, so we ensure we have a valid index
    local relativePos = offset - line.from + 1
    
    local foundLink = nil
    local patterns = {
        { type = "markdown", regex = "%[(.-)%]%((.-)%)" },
        { type = "wiki",     regex = "%[%[(.-)%]%]" },
        { type = "bare",     regex = "https?://%S+" }
    }

    for _, p in ipairs(patterns) do
        local searchStart = 1
        while true do
            local start, finish, cap1, cap2 = text:find(p.regex, searchStart)
            if not start then break end
            
            if relativePos >= start and relativePos <= finish then
                if p.type == "markdown" then
                    foundLink = cap2
                elseif p.type == "wiki" then
                    foundLink = cap1
                else
                    foundLink = text:sub(start, finish):gsub("[%.,;]$" , "")
                end
                break
            end
            searchStart = finish + 1
        end
        if foundLink then break end
    end

    if foundLink then
        js.import("/.fs/Library/Mr-xRed/UnifiedFloating.js").show(foundLink)
        return true
    end
    return false
end

-- 1. Command Definition (Keyboard Trigger)
command.define {
    name = "Floating: Open Link Under Cursor",
    key = "Ctrl-Alt-Enter",
    mac = "Cmd-Alt-Enter",
    run = function()
        local pos = editor.getCursor()
        -- Handle both table-based and number-based cursor positions
        local offset = type(pos) == "table" and (pos.offset or 0) or tonumber(pos)
        
        if not findAndOpenLink(offset) then
            editor.flashNotification("No valid link or tag at cursor position.")
        end
    end
}

-- 2. Event Listener (Mouse Trigger)
event.listen {
    name = "page:click",
    run = function(e)
        -- Support both Ctrl+Alt (Windows) and Cmd+Alt (Mac)
        if not (e.data.altKey and (e.data.metaKey or e.data.ctrlKey)) then
            return
        end
        
        -- Use the position provided by the click event
        local offset = tonumber(e.data.pos)
        if findAndOpenLink(offset) then
            -- We successfully handled it
            return true 
        end
    end
}
```
