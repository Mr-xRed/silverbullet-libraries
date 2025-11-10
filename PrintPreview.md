---
tags: meta/library
title: "Print Preview Command"
author: "Mr-xRed"
pageDecoration.prefix: "🖨️ "
files:
- printpreview.css
---

> **warning** Caution
> WORK IN PROGRESS

# Print Preview Command `Ctrl-Alt-p`

## What does it do?
* Save and fetch content: It saves the current editor page and retrieves its Markdown text.
* Parse and expand Markdown: Converts the Markdown into a parse tree, expands it, and renders it back to expanded Markdown.
* Convert to HTML: Turns the expanded Markdown into HTML and cleans up repeated `<br>` tags, adjusts image paths, and marks certain tables as widgets.
* Wrap in HTML structure: Embeds the HTML into a full HTML page with metadata, CSS, and hidden header info for print.
* Export and preview: Writes the HTML to PrintPreview.html, syncs it, sends notification, and opens it in the browser.

## Options & Config

### Config.set example

* You can style your PrintPreview page with a custom CSS file and other attributes:

```lua
config.set("PrintPreview", {
    CSSFile = "path/to/your_custom.css", --default is included with the library
    pageSize = "A4",                     --default: A4
    marginTB = "20mm",                   --default: 20mm
    marginLR = "25mm",                   --default: 25mm
    landscape = true                     --default: false
})  
```

> **tip** Check [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@page/size) for different `pageSize` options: 

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
    pageSize = schema.string(),   --default: A4
    landscape = schema.boolean(), --default: false
    marginTB = schema.string(),   --default: 20mm
    marginLR = schema.string(),   --default: 25mm
  }
})

command.define {
  name = "Markdown: Print Preview",
  key = "Ctrl-Alt-p",
  run = function()
    editor.save()
    --retrieve configuration values and set defaults
    local PrintPreview = config.get("PrintPreview")
    local styleFile = PrintPreview.CSSFile or "Library/Mr-xRed/PrintPreview/printpreview.css"
    local pageSize = PrintPreview.pageSize or "A4"
    local pageLayout = PrintPreview.landscape and "landscape" or ""
    local marginTopBottom = PrintPreview.marginTB or "20mm"
    local marginLeftRight = PrintPreview.marginLR or "25mm"
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
<style> @page { size: ]].. pageSize .. " " .. pageLayout ..  [[; margin: ]] .. marginTopBottom .. " ".. marginLeftRight ..[[;
     @top-center { content: ']].. pageName .. pageAuthor ..[['; }}</style>
<body>
<!-- Hidden elements for printed headers -->
<!--
<h1 class="title" style="display:none;">]] .. pageName .. [[</h1>
<p class="author" style="display:none;">]] .. pageAuthor .. [[</p>
 -->
]] .. htmlContent .. [[
</body>
</html>
]]

    -- Write HTML to file
    local outputFile = "PrintPreview.html"
    space.writeFile(outputFile, fullHtml)
    sync.performFileSync(outputFile)

    editor.flashNotification("HTML exported to: " .. outputFile)
    editor.openUrl("/.fs/" .. outputFile)
  end
}
```


## Discussions to this Library
* [Silverbullet Community](https://community.silverbullet.md/t/how-to-print-export-with-preview-removed/2581?u=mr.red)