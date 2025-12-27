---
name: "Library/Mr-xRed/FloatingPage"
tags: meta/library
files:
- FloatingPage.js
pageDecoration.prefix: "📃 "
---
# Open Floating Page (Proof of Concept)

> **warning** PROOF OF CONCEPT - EXPERIMENTAL ONLY
 
> **success** Shortcut Keys
> `Ctrl-Alt-o` - Opens the Page Picker to chose the Page

Try it out: ${widgets.commandButton("Floating: Open")}

This JS opens a page, a website, direct HTML into a Floating Resizable window.

See Examples below.

# Examples:

```lua
-- Mode 1: Internal SilverBullet Page
command.define {
  name = "Floating: EXAMPLE: Open Internal Page",
  run = function()
    js.import("/.fs/Library/Mr-xRed/FloatingPage.js").show("CONFIG", "Configuration")
  end
}

-- Mode 2: External Website
command.define {
  name = "Floating: EXAMPLE: Open Webpage ",
  run = function()
    -- Note: Some sites like Google/GitHub block iframes for security. 
    -- Wikipedia and personal sites usually work fine.
    js.import("/.fs/Library/Mr-xRed/FloatingPage.js").show("https://en.wikipedia.org", "Wikipedia")
  end
}

-- Mode 3: Direct HTML Code
command.define {
  name = "Floating: EXAMPLE: Open Custom HTML",
  run = function()
    local myHtml = [[
      <body style="background: #1a1a1a; color: white; font-family: sans-serif; padding: 20px;">
        <h1>Hello from Lua!</h1>
        <p>This is a floating window rendered directly from a string.</p>
        <button onclick="alert('It works!')">Click Me</button>
      </body>
    ]]
    js.import("/.fs/Library/Mr-xRed/FloatingPage.js").show(myHtml, "Custom App")
  end
}

```

```space-lua
command.define {
  name = "Floating: Open",
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
```