---
name: "Library/Mr-xRed/PrintPreview"
tags: meta/library
pageDecoration.prefix: "🖨️ "
files:
- classic.css
- code.css
- data.css
---
# PrintPreview Command `Ctrl-Alt-p`

> **warning** Caution
> WORK IN PROGRESS

> **tip** Hint
> When Running the command make sure you have **Pop-Up**’s enabled because the PrintPreview will open a new Window/Tab with a `PrintPreview.html`

## How does it work?
* It saves the current editor page and retrieves its Markdown text.
* Converts the Markdown into a parse tree, expands it, and renders it back to expanded Markdown.
* Turns the expanded Markdown into HTML and cleans up repeated `<br>` tags, adjusts image paths, and marks certain tables as widgets.
* Embeds the HTML into a full HTML page with metadata, CSS and header and footer info for print.
* Writes the HTML to temp/PrintPreview.html, syncs it, sends notification, and opens it in the browser.

## Options & Config

* You can style your PrintPreview page with a custom CSS file and other attributes:

**Config.set example**
```lua
config.set("PrintPreview", {
--    CSSFile = "path/to/your_custom.css", --default is included with the library
    pageSize = "A4",                     --default: "A4"
    marginTRBL = "20mm 20mm 20mm 25mm",  --default: "20mm 20mm 20mm 25mm" Top Right Bottom Left
    landscape = true                     --default: false
    accentHue = "260"                    --default: if ommited it will ask you
})  
```

> **tip** Check out [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@page/size) for different `pageSize` options 

> **tip** Check out [printcss.live/editor](https://printcss.live/editor) if you want to make your own custom Stylesheets

* You can also set a `title` and `author` in the page’s frontmatter to use in the printout header. If you don’t set them, the page name will be used instead:

~~~example
---
title: "A Beatiful Story"
author: "Mr-xRed"
---
~~~

## Browser Support for `@page` attributes:

| At-rule |  Chrome   |   Edge  |  Firefox   |  Safari   |  Opera   |
| :--- | :---: | :---: | :---: | :---: | :---: |
| @page | v2   | v12  | v19  | No  | v6   |
| @page: size | v15  | v79  | v95  | No  | v15  |
| @page: page-orientation | v85  | v85  | No  | No  | v71  |
| @page: @top-center, @bottom-center (used for header & footer)| v131 | No  | No  | No  | No  |


## Implementation

```space-lua
-- priority: -1
config.define("PrintPreview", {
  type = "object",
  properties = {
--    CSSFile = schema.string(),
    pageSize = schema.string(),
    landscape = schema.boolean(),
    marginTRBL = schema.string(),
    accentHue = schema.string()
  }
})

-- Generate TOC ------------------------------------------------------
local function toc()
  local text = editor.getText()
  local pageName = editor.getCurrentPage()
  local parsedMarkdown = markdown.parseMarkdown(text)

  local headers = {}
  for topLevelChild in parsedMarkdown.children do
    if topLevelChild.type then
      local headerLevel = string.match(topLevelChild.type, "^ATXHeading(%d+)")
      if headerLevel then
        local text = ""
        table.remove(topLevelChild.children, 1)
        for child in topLevelChild.children do
          text = text .. string.trim(markdown.renderParseTree(child))
        end
        text = string.gsub(text, "%[%[(.-)%]%]", "%1")

        if text ~= "" then
          table.insert(headers, {
            name = text,
            pos = topLevelChild.from,
            level = tonumber(headerLevel)
          })
        end
      end
    end
  end

  local minLevel = 6
  for _, h in ipairs(headers) do
    if h.level < minLevel then minLevel = h.level end
  end

  local md = "# Table of Contents\n"
  for _, h in ipairs(headers) do
    md = md ..
      string.rep(" ", (h.level - minLevel) * 2)
      .. "* [[" .. pageName .. "@" .. h.pos .. "|" .. h.name .. "]]\n"
  end

  return md
end

--------------------------------------------------------------------
-- Select PRINT MODE (Classic, Data, Code, Custom)
--------------------------------------------------------------------
local function selectMode()
  local modes = {
    { name = "Classic", value = "classic", description="Narrations, Stories, Prose, Longer texts etc." },
    { name = "Data", value = "data", description="Tables, mermaid snippets and other data" },
    { name = "Code", value = "code", description="Code, Snippets, Highlighted syntaxes etc." },
    { name = "Custom CSS", value = "custom", description="Use your own stylesheets" }
  }
  local result = editor.filterBox("Select Print Mode:", modes, "Esc = Cancel")
  return result and result.value
end

--------------------------------------------------------------------
-- Accent Hue selection 
--------------------------------------------------------------------
local function selectAccentHue()
local hueOptions = {
  { name = "Red",    value = 30,  description = "Hue = 30"  },
  { name = "Orange", value = 60,  description = "Hue = 60"  },
  { name = "Yellow", value = 95,  description = "Hue = 95"  },
  { name = "Green",  value = 140, description = "Hue = 140" },
  { name = "Blue",   value = 265, description = "Hue = 265" },
  { name = "Indigo", value = 285, description = "Hue = 285" },
  { name = "Violet", value = 315, description = "Hue = 315" },
}
  local accentHue = editor.filterBox("Choose accent color (hue):", hueOptions, "Esc = fallback to grayscale")
  return accentHue and accentHue.value or nil
end
--------------------------------------------------------------------
-- Custom CSS selection (excluding defaults)
--------------------------------------------------------------------
local function selectCustomCSS()
  local files = space.listFiles()
  local options = {}

  local blocked = {
    ["Library/Mr-xRed/classic.css"] = true,
    ["Library/Mr-xRed/data.css"] = true,
    ["Library/Mr-xRed/code.css"] = true
  }

  for _, f in ipairs(files) do
    if f.contentType and f.contentType:match("^text/css;") and not blocked[f.name] then
      table.insert(options, {
        name = f.name,
        value = f.name,
        description = f.path or f.contentType
      })
    end
  end

  if #options == 0 then
    editor.flashNotification("No CSS files found.")
    return nil
  end

  local result = editor.filterBox("Choose custom stylesheet:", options, "Esc = Cancel")
  return result and result.name
end


--------------------------------------------------------------------
-- Build HTML depending on mode
--------------------------------------------------------------------
local function buildHtml(mode, cssFile, pageName, pageAuthor, htmlBody, pageSize, pageLayout, marginTRBL, accentHue, chroma)
  local extraHead = ""
  local extraBeforeEnd = ""

  if mode == "code" then
    extraHead = [[
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/vs.min.css">

<script defer src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"></script>

<script defer>
document.addEventListener('DOMContentLoaded', () => {
  const decodeHtml = html => {
    const t = document.createElement('textarea');
    t.innerHTML = html;
    return t.value;
  };

  const langMap = {
    'space-lua': 'lua',
    'space-style': 'css'
  };

  document.querySelectorAll('pre[data-lang]').forEach(pre => {
    let html = pre.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/&nbsp;/g, ' ');
    const text = decodeHtml(html);

    let lang = pre.getAttribute('data-lang') || '';
    lang = langMap[lang] || lang.replace(/^space-/, '') || 'plaintext';

    let code = pre.querySelector('code');
    if (!code) {
      code = document.createElement('code');
      pre.innerHTML = '';
      pre.appendChild(code);
    }

    code.className = 'language-' + lang;
    code.textContent = text;
  });

  if (window.hljs?.highlightAll) hljs.highlightAll();
  else document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
});
</script>
    ]]

  elseif mode == "data" then
    extraBeforeEnd = [[
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

  document.querySelectorAll('pre.mermaid').forEach(pre => {
    pre.textContent = pre.innerHTML
      .replace(/<br[^>]*>/gi, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&gt;/g, '>')   // most important ones
      .replace(/&lt;/g, '<')
      .replace(/&amp;/g, '&')
      .trim();
  });

  mermaid.initialize({ startOnLoad: true });
</script>
    ]]
  end

  -- Classic gets nothing extra.

  return [[
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>]] .. pageName .. [[</title>
<link rel="stylesheet" href="/.fs/]] .. cssFile .. [[">
<style>
:root{--hue:]] .. accentHue .. [[;--chroma:]] .. chroma .. [[;}
@page { size: ]] .. pageSize .. " " .. pageLayout .. [[; margin: ]] .. marginTRBL .. [[; 
@top-center { content: ']] .. pageName .. pageAuthor .. [['; }}
</style>
]] .. extraHead .. [[
</head>
<body>
<div class="page">
]] .. htmlBody .. [[
</div>
]] .. extraBeforeEnd .. [[
</body>
</html>
]]
end

--------------------------------------------------------------------
-- Main command
--------------------------------------------------------------------
command.define {
  name = "Export: Print Preview",
  key = "Ctrl-Alt-p",
  run = function()
    editor.save()

    local mode = selectMode()
    if not mode then
      editor.flashNotification("Print cancelled.")
      return
    end

    local cssFile
    if mode == "classic" then
      cssFile = "Library/Mr-xRed/classic.css"
    elseif mode == "code" then
      cssFile = "Library/Mr-xRed/code.css"
    elseif mode == "data" then
      cssFile = "Library/Mr-xRed/data.css"
    elseif mode == "custom" then
      cssFile = selectCustomCSS()
      if not cssFile then
        editor.flashNotification("No custom stylesheet selected.")
        return
      end
    end

    local PrintPreview = config.get("PrintPreview") or {}
    local pageSize = PrintPreview.pageSize or "A4"
    local pageLayout = PrintPreview.landscape and "landscape" or ""
    local marginTRBL = PrintPreview.marginTRBL or "20mm 20mm 20mm 25mm"
    local accentHue = tonumber(PrintPreview.accentHue) or tonumber(selectAccentHue()) or 0
    local chroma = (accentHue == 0) and 0 or 1

    local mdContent = editor.getText()
    local fm = (index.extractFrontmatter(mdContent)).frontmatter
    local pageName = fm.title or editor.getCurrentPage()
    local pageAuthor = fm.author and (" - " .. fm.author) or ""
    local tocMD = fm.toc and toc() or ""

    local mdTree = markdown.expandMarkdown(markdown.parseMarkdown(mdContent))
    local expanded = markdown.renderParseTree(mdTree)
    local htmlBody = markdown.markdownToHtml(tocMD) .. markdown.markdownToHtml(expanded)
    htmlBody = htmlBody:gsub('(<pre%s+)data%-lang="mermaid"([^>]*)', '%1data-lang="mermaid" class="mermaid"%2')
    htmlBody = htmlBody:gsub('<span class="p">(.-)</span>', '<p>%1</p>')
    htmlBody = htmlBody:gsub('<br%s*/?>%s*(<pre class="mermaid">)', '%1')
    htmlBody =  htmlBody:gsub("<br></br>", "<br>")
    htmlBody =  htmlBody:gsub("<br><br>", "<br>")
    htmlBody =  htmlBody:gsub("(</%w+>)<br>", "%1")
    htmlBody =  htmlBody:gsub('src=["\']%.fs/', 'src="/.fs/')
    htmlBody = htmlBody:gsub(
                  '(<table.-</table>)',
                  function(tbl)
                    if tbl:find('<td>%s*_isWidget%s*</td>') then
                      return tbl:gsub('<table', '<table class="isWidget"', 1)
                    else
                      return tbl
                    end
                  end
                )

    --    htmlBody = htmlBody:gsub('(<table)(>.-<td>_isWidget</td>.-</table>)', '<table class="isWidget"%2')
--      htmlBody = htmlBody:gsub("(<table.-)(<td>_isWidget</td>.-</table>)",'%2')
    
    local fullHtml = buildHtml(mode, cssFile, pageName, pageAuthor, htmlBody, pageSize, pageLayout, marginTRBL, accentHue, chroma)

    local outputFile = "temp/PrintPreview.html"
    space.writeFile(outputFile, fullHtml)
    sync.performFileSync(outputFile)

    editor.flashNotification("HTML exported: " .. outputFile)
--    editor.openUrl("/.fs/" .. outputFile)
     js.import("/.fs/Library/Mr-xRed/UnifiedAdvancedPanelControl.js").show(outputFile, "PrintPreview")
  end
}

```


## Discussions to this Library
* [Silverbullet Community](https://community.silverbullet.md/t/how-to-print-export-with-preview-removed/2581?u=mr.red)