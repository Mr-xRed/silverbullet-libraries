---
name: "Library/Mr-xRed/OpenFloatingPage"
tags: meta/library
files:
- PanelDragResize.js
pageDecoration.prefix: "📃 "
---
# Open Floating Page (Proof of Concept)

This command opens a page, picked from the page navigation picker, in the panel
on the right hand side.

Try it out: ${widgets.commandButton("Sidebar: Open Page")}

```space-lua
command.define {
  name = "Sidebar: Open Page",
  key = "Ctrl-Alt-o",
  run = function()
    local allPages = query[[
      from index.tag "page"
      order by _.lastModified desc]]
    local page = editor.filterBox('🔍', allPages, "Select the page to open aside")
    if page != nil then
      editor.flashNotification(page.name)
      editor.showPanel("rhs",1,[[
      <style>
      html, body {margin: 0;padding: 0;width: 100%;height: 100%;}
      iframe {width: 100%;height: 100%;border: none;}
      </style>
      <iframe src="]] .. page.name .. [[" />]])
      js.import("/.fs/Library/Mr-xRed/PanelDragResize.js").enableDrag();
    end
  end
}
```

## Close Floating Page

To easily close this panel, the command ${widgets.commandButton("Sidebar: Close")} is provided.

```space-lua
command.define {
  name = "Sidebar: Close",
  key = "Ctrl-Alt-x",
  run = function()
    editor.hidePanel("rhs")
  end
}
```
