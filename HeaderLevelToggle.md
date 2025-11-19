---
name: "Library/Mr-xRed/HeaderLevelToggle"
tags: meta/library
pageDecoration.prefix: "🛠️ "
---
# Header: Toggle Level

Toggle header levels (h1-h6)  headers with one convenient combo-keypress (Ctrl-1 to Ctrl-6):

## Implementation
```space-lua
-- function to toggle a specific header level
local function toggleHead(level)
  local line = editor.getCurrentLine()
  
  local text = line.text
  local currentLevel = string.match(text, "^(#+)%s*")
  currentLevel = currentLevel and #currentLevel or 0
  
  local textC = line.textWithCursor
  local posC = string.find(textC, "|^|", 1, true)
  
  local lineHead
  if posC > currentLevel + 1 then
    local bodyTextC = string.gsub(textC, "^#+%s*", "")
    if currentLevel == level then
      lineHead = bodyTextC
    else
      lineHead = string.rep("#", level) .. " " .. bodyTextC
    end
  else
    local bodyText = string.gsub(text, "^#+%s*", "")
    if currentLevel == level then
      lineHead = "|^|" .. bodyText
    else
      lineHead = string.rep("#", level) .. " |^|" .. bodyText
    end
  end
  editor.replaceRange(line.from, line.to, lineHead, true)
end

-- register commands Ctrl-1 → Ctrl-6
for lvl = 1, 6 do
  command.define {
    name = "Header: Toggle Level " .. lvl,
    key = "Ctrl-" .. lvl,
    run = function() 
      toggleHead(lvl) 
    end
  }
end
```

## Discussions about this widget
* [SilverBullet Community](https://community.silverbullet.md/t/space-lua-toggle-rotate-header-level-h1-h6-on-off/3320?u=mr.red)