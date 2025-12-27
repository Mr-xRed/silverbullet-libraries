---
name: "Library/Mr-xRed/OpenFloatingPage"
tags: meta/library
files:
- FloatingPage.js
pageDecoration.prefix: "📃 "
---
# Open Floating Page (Proof of Concept)

> **warning** PROOF OF CONCEPT - EXPERIMENTAL ONLY
 
This command opens a page, picked from the page navigation picker, in the panel
in a floating resizable window.

> **success** Shortcut Keys
> `Ctrl-Alt-o` - Open a page in a Window
> `Ctrl-Alt-x` - Close the Window

Try it out: ${widgets.commandButton("FloatingPage: Open")} ${widgets.commandButton("FloatingPage: Close")}

```space-lua
command.define {
  name = "FloatingPage: Open",
  key = "Ctrl-Alt-o",
  run = function()
    local allPages = query[[
      from index.tag "page"
      order by _.lastModified desc]]
    local page = editor.filterBox('🔍', allPages, "Select page")
    if page != nil then
      js.import("/.fs/Library/Mr-xRed/FloatingPage.js").show(page.name)
    end
  end
}

command.define {
  name = "FloatingPage: Close",
  key = "Ctrl-Alt-x",
  run = function()
    js.import("/.fs/Library/Mr-xRed/FloatingPage.js").close()
  end
}
```