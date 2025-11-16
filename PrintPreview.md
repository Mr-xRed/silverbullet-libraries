---
name: "Library/Mr-xRed/PrintPreview"
tags: meta/library
title: "Print Preview Command"
author: "Mr-xRed"
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
> When Running the command make sure you have Pop-Up’s enabled because the PrintPreview will open a new Window/Tab with a `PrintPreview.html`

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
    CSSFile = "path/to/your_custom.css", --default is included with the library
    pageSize = "A4",                     --default: "A4"
    marginTRBL = "20mm 20mm 20mm 25mm",  --default: "20mm 20mm 20mm 25mm" Top Right Bottom Left
    landscape = true                     --default: false
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
config.define("PrintPreview", {
  type = "object",
  properties = {
    CSSFile = schema.string(),
    pageSize = schema.string(),   
    landscape = schema.boolean(), 
    marginTRBL = schema.string(),
  }
})


local function selectCSS()
    local files = space.listFiles()
    local options = {}

    for _, f in ipairs(files) do
      if f.contentType and f.contentType:match("^text/css;") then
        table.insert(options, {
          name = f.name,
          value = f.name,
          description = f.path or f.contentType
        })
      end
    end

    if #options == 0 then
      editor.flashNotification("No CSS files found.")
      return
    end

    local result = editor.filterBox("Select StyleSheet:", options, "or press 'Esc' to use default")

    if result then
      return result.name
    else
      return "Library/Mr-xRed/classic.css"
    end
  end
  
command.define {
  name = "Markdown: Print Preview",
  key = "Ctrl-Alt-p",
  run = function()
    editor.save()
    --retrieve configuration values and set defaults
    local PrintPreview = config.get("PrintPreview") or {}
    local styleFile = PrintPreview.CSSFile or selectCSS() 
    local pageSize = PrintPreview.pageSize or "A4"
    local pageLayout = PrintPreview.landscape and "landscape" or ""
    local marginTRBL = PrintPreview.marginTRBL or "20mm 20mm 20mm 25mm"
    local mdContent = editor.getText()
    -- Extracts Title and Author from frontmatter
    local pageFrontmatter = (index.extractFrontmatter(mdContent)).frontmatter
    local pageName =  pageFrontmatter.title or editor.getCurrentPage()
    local pageAuthor = pageFrontmatter.author and (" - " .. pageFrontmatter.author) or ""
    -- Parse and expand Markdown
    local mdTree = markdown.parseMarkdown(mdContent)
          mdTree = markdown.expandMarkdown(mdTree)
    local expandedMd = markdown.renderParseTree(mdTree)
    -- Convert expanded Markdown to HTML
    local htmlContent = markdown.markdownToHtml(expandedMd)
    -- Clean up <br> tags: fix malformed ones, collapse repeated <br>, and remove <br> immediately after closing tags
          htmlContent = htmlContent:gsub("<br></br>", "<br>")
          htmlContent = htmlContent:gsub("<br><br>", "<br>")
          htmlContent = htmlContent:gsub("(</%w+>)<br>", "%1")
    -- Fix image/file paths by replacing relative `%.fs/` with absolute `/.fs/` in src attributes
          htmlContent = htmlContent:gsub('src=["\']%.fs/', 'src="/.fs/')
    -- Add class "isWidget" to tables containing _isWidget so it can be hidden
          htmlContent = htmlContent:gsub('(<table)([^>]*>.-<td>_isWidget</td>.-</table>)', '%1 class="isWidget"%2')
    -- Wrap in HTML structure and link CSS
    local fullHtml = [[
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>]] .. pageName .. [[</title>
<link rel="stylesheet" href="/.fs/]]..styleFile..[[">
</head>
<style> @page { size: ]].. pageSize .. " " .. pageLayout ..  [[; margin: ]] .. marginTRBL .. [[;
     @top-center { content: ']].. pageName .. pageAuthor ..[['; }}</style>
<body>
]] .. htmlContent .. [[
</body>
</html>
]]

    -- Write HTML to file
    local outputFile = "temp/PrintPreview.html"
    space.writeFile(outputFile, fullHtml)
    sync.performFileSync(outputFile)

    editor.flashNotification("HTML exported to: " .. outputFile)
    editor.openUrl("/.fs/" .. outputFile)
  end
}
```


## Discussions to this Library
* [Silverbullet Community](https://community.silverbullet.md/t/how-to-print-export-with-preview-removed/2581?u=mr.red)