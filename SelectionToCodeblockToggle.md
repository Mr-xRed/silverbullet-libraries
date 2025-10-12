#meta

## Selection to custom CodeBlock

This `space-lua` will create custom shortcut commands (Ctrl-Alt-1 to Ctrl-Alt-9) for converting current selection or current line into the specific CodeBlock.

To define your custom CodeBlock languages, edit `block_lang` variable below. You can define up to 9 CodeBlock languages which will be assigned to Ctrl-Alt-1 to Ctrl-Alt-9.

```space-lua

local block_lang = { "bash", "space-lua", "space-style", "mysql" }

for i, lang in ipairs(block_lang) do
  command.define {
    name = "CodeBlock: " .. lang,
    key = "Ctrl-Alt-" .. i,
    run = function() CodeBlock(lang) end}
end

local function CodeBlock(lang) 
    local sel_start = editor.getSelection().from
    local sel_end = editor.getSelection().to 
    
    editor.moveCursor(sel_start) 
    local sel_line_start = editor.getCurrentLine().from
    
    editor.moveCursor(sel_end)
    local sel_line_end = editor.getCurrentLine().to

    if sel_line_start == sel_line_end then
      editor.insertAtCursor("```" .. lang .. "\n|^|\n```", false, true)
    else
    
    editor.setSelection(sel_line_start, sel_line_end)
    local text = editor.getSelection().text
    
    if text:match("^```" .. lang ) and text:match("```$") then 
      local off_start = text:gsub("^```" .. lang .. "\n", "")
      local off_end = off_start:gsub("\n```$","",1)
      editor.replaceRange(sel_line_start, sel_line_end, off_end)
    else local new_text = "```" .. lang .. "\n" .. text .. "\n```"
      editor.replaceRange(sel_line_start, sel_line_end, new_text) 
    end
  end
end
```


## Discussions to this library:
* [SilverBullet Community](https://community.silverbullet.md/t/space-script-selection-bash-codeblock/1544?u=mr.red)