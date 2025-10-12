#meta

## Header: Toggle Level
Toggle header levels (h1-h6)  headers with one convenient combo-keypress (Ctrl-1 to Ctrl-6):

## Implementation 
```space-lua
-- function to toggle a specific header level
local function toggleHead(level)
  local line = editor.getCurrentLine()
  local text = line.textWithCursor

  -- Detect current header level
  local currentLevel = string.match(text, "^(#+)%s*")
  currentLevel = currentLevel and #currentLevel or 0

  local cleanText = string.gsub(text, "^#+%s*", "")

  -- Toggle: remove if same, otherwise set new level
  if currentLevel == level then
    editor.replaceRange(line.from, line.to, cleanText, true)
    editor.flashNotification(editor.getCurrentLine(), "info")
  else
    editor.replaceRange(line.from, line.to, string.rep("#", level) .. " " .. cleanText, true)
  end
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