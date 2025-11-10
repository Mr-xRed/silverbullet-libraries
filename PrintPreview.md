---
tags: meta/library
pageDecoration.prefix: "🖨️ "
files:
- printpreview.css
---
> **warning** Caution
> WORK IN PROGRESS


# Print Preview Command

### What does it do?
* Save and fetch content: It saves the current editor page and retrieves its Markdown text.
* Parse and expand Markdown: Converts the Markdown into a parse tree, expands it, and renders it back to expanded Markdown.
* Convert to HTML: Turns the expanded Markdown into HTML and cleans up repeated `<br>` tags, adjusts image paths, and marks certain tables as widgets.
* Wrap in HTML structure: Embeds the HTML into a full HTML page with metadata, CSS, and hidden header info for print.
* Export and preview: Writes the HTML to PrintPreview.html, syncs it, flashes a notification, and opens it in the browser.


## Implementation
```space-lua

config.define("PrintPreviewCSS", {type = "string"})


command.define {
  name = "Markdown: Print Preview",
  key = "Ctrl-Alt-p",
  run = function()
    editor.save()
    local cssFile = config.get("PrintPreviewCSS") or "Library/Mr-xRed/PrintPreview/printpreview.css"

    local mdContent = editor.getText()
    local pageName = editor.getCurrentPage()  -- Get current page name
    local pageAuthor = "Anonymous"            -- page author from metadata
    -- Parse and expand Markdown
    local mdTree = markdown.parseMarkdown(mdContent)
          mdTree = markdown.expandMarkdown(mdTree)
    local expandedMd = markdown.renderParseTree(mdTree)
    -- Convert expanded Markdown to HTML
    local htmlContent = markdown.markdownToHtml(expandedMd)
    -- Convert repeated <br> lines into single <br>
          htmlContent = htmlContent:gsub("<br><br>", "")
          htmlContent = htmlContent:gsub("<br></br>", "<br>")
          htmlContent = htmlContent:gsub('src=["\']%.fs/', 'src="/.fs/')
    -- Add class "isWidget" to tables containing _isWidget
          htmlContent = htmlContent:gsub(
              '(<table.-<td>_isWidget</td>.-</table>)',
              function(table_html)
                  return table_html:gsub("<table", '<table class="isWidget"', 1)
              end
          )

    -- Wrap in HTML structure and link CSS
    local fullHtml = [[
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>]] .. pageName .. [[</title>
<link rel="stylesheet" href="/.fs/]]..cssFile..[[">
</head>
<style> @page { @top-center { content: ']].. pageName.. " - ".. pageAuthor ..[['; }}</style>
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


## CSS File - only for debugging purposes

${widgets.commandButton("Save printpreview.css")}

```space-lua
local styleCSS = [[

@page {
   size: A4 /*landscape*/;  /* uncomment for landscape */
   margin: 15mm 25mm;
   
    @top-center {
        font-family: "Inter", "Segoe UI", sans-serif;
        font-size: 10pt;
        color: #555;
        font-weight: bold;
        letter-spacing: 0.5px;    
        color: #555;
 /*       border-bottom: 1px solid #ccc; */
    }
    @bottom-center {
        font-family: "Inter", "Segoe UI", sans-serif;
        content: counter(page) " / " counter(pages);
        font-size: 9pt;
        color: #555;
/*        border-top: 1px solid #ccc; */
    }
}

body {
/*
    font-family: 'Courier New', Courier, monospace; 
    font-family: "Times New Roman", serif;
*/
    font-family: "Inter", "Segoe UI", sans-serif;
    width: clamp(400px, 70%, 1000px);
    margin: 0 auto;
    line-height: 1.5;
    text-align: justify;
    text-justify: inter-word;
    hyphens: auto;
}

p {
    margin: 0 0 1em 0;
    text-align: justify;         
    text-justify: inter-word;
    hyphens: auto;
    text-align-last: justify;     
}


p { hyphens: auto;
    text-align: justify;
}

/* Modern link style */
a {
    color: #005b99;        /* your preferred blue */
    text-decoration: none;  /* remove underline */
    font-weight: bold;      /* make bold */
}

/* Optional: hover effect */
a:hover {
    text-decoration: underline;  /* underline on hover for clarity */
}


h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  color: #005b99;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

h1 {
  padding-bottom: 0.1em;
  border-bottom: 1px solid #005b99;
}

/* h2 { page-break-before: always; } */

code, pre {
  background: #f5f5f5;
  padding: 0.1em 0.2em;
  border-radius: 3px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.85em;
  
/* Word wrap settings */
  white-space: pre-wrap;       /* Wraps lines and preserves indentation */
  word-break: break-word;      /* Break long words if needed */
  overflow-wrap: break-word;   /* Modern fallback for breaking words */
}

pre {
    max-width: 100%;
    overflow-x: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table :is(th, td) {
  border: 1px solid #bababa;
  padding: 0.4rem;
}

table > thead {
  background-color: #f7f7f7;
}

table > tbody > tr:nth-child(even) {
  background-color: #f7f7f7;
}

blockquote {
  color: #555;
  border-left: 3px solid #005b99;
  padding-left: 0.5em;  /* reduced */
  font-style: italic;
}

span.p {
  display: block;
}


img {
  padding: 1em;
  page-break-inside: avoid;  /* Avoid splitting the image */
  break-inside: avoid;       /* Modern equivalent */
  max-width: 100%;           /* Scale down if needed */
  display: block;        /* ensures it’s a block element, starts on a new line */
  margin: 1em auto;      /* optional spacing and centering */

}

figure {
  display: block;
  text-align: center;  /* centers image and caption */
}

@media print {
  body{
    width: 100% !important;
    margin: 0 !important;
  }
}


/* OPTIONAL Hide specific colour tags inside tables */


table.isWidget {
    display: none;
}


.sb-hashtag[data-tag-name="silver"],
.sb-hashtag[data-tag-name="burgundy"],
.sb-hashtag[data-tag-name="maroon"],
.sb-hashtag[data-tag-name="hazel"],
.sb-hashtag[data-tag-name="mint"],
.sb-hashtag[data-tag-name="sea"],
.sb-hashtag[data-tag-name="grape"],
.sb-hashtag[data-tag-name="wine"] {
  display: none !important;
}

/*

blockquote .p strong:first-of-type {
    display: none;
}
blockquote .p:nth-of-type(2) {
    font-weight: bold; /* make remaining text bold */
      color: red;
}
*/

]]

command.define {
  name = "Save printpreview.css",
  hide = true,
  key = "Ctrl-ö",
  run = function()
          editor.invokeCommand("System: Reload")
          local cssFile = space.writeDocument("printpreview.css", styleCSS)
          editor.flashNotification("CSS-File saved with size: " .. cssFile.size .. " bytes")
    end
}

command.define {
  name = "Delete printpreview.css",
  hide = true,
  run = function()
          local cssFile = space.deleteDocument("printpreview.css")
          editor.flashNotification("Deleted: printpreview.css")
    end
}
```

