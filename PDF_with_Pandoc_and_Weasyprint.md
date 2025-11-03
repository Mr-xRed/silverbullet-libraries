---
tags: meta/library
---

## This command will use `pandoc` & `weasyprint` to create a printout of a page in PDF

> **warning** WORK IN PROGRESS
> For now everything is hard coded except the resulting filename.
> It’s just an example and where to start with pandoc and weasyprint, but not a complete solution yet.

### Short instructions how to install `pandoc` and `weasyprint` (on the server side where SilverBullet is running)

- these instructions are for linux only (debian) 
- maybe it also works with other distros like ubuntu but cant guarantee
- if you run SilverBullet on docker, these instructions aren’t for you (sorry).

```bash
sudo apt install pandoc
sudo apt install python3-pip python3-cffi libcairo2 libpango-1.0-0 libgdk-pixbuf2.0-0 libffi-dev shared-mime-info
pip install weasyprint
sudo apt install libcairo2 libpango-1.0-0 libpangoft2-1.0-0 libgdk-pixbuf2.0-0 libffi-dev libpangocairo-1.0-0
```

## Instructions

1. After you installed pandoc & weasyprint Reload: ${widgets.commandButton("System: Reload")} 
2. Save this [[#pandoc.css]] using this button: ${widgets.commandButton("Save pandoc.css")} 
3. Use Ctrl-p to start the command or ${widgets.commandButton("Pandoc: Publish PDF")}
4. Enter your target Filename (without the PDF extension)

## ⚙️ Step-by-step what this script does:

1.  Save the current editor content    
    *   `editor.save()` ensures any unsaved changes are written before processing.
2.  Prepare and render Markdown
    *   Reads the current page (`editor.getText()`).
    *   Parses and expands the Markdown into a full tree (`markdown.parseMarkdown` and `markdown.expandMarkdown`).
    *   Renders it back into complete Markdown text (`markdown.renderParseTree`).
3.  Create a temporary Markdown file
    *   Writes the rendered content into `pandocTMP.md`.
    *   Syncs the file system to ensure the file exists before continuing.
4.  Prompt for output file name
    *   Asks the user to input a file name.
    *   Creates a PDF path under `/Pandoc/` folder.
5.  Generate HTML with Pandoc
    *   Runs Pandoc to convert the temporary Markdown file to HTML:
        *   Uses a CSS file [[#pandoc.css]] for styling.
        *   The commented-out options show that you could enable TOC, landscape, etc.
6.  Convert HTML to PDF with WeasyPrint
    *   Runs WeasyPrint on the generated HTML to produce the final PDF.
7.  Clean up temporary files
    *   Deletes both `pandocTMP.md` and `pandocTMP.html`.
8.  Notify and open result
    *   Displays a message confirming success.
    *   Opens the generated PDF file for review/print/download.

## Command implementation

```space-lua
command.define {
  name = "Pandoc: Publish PDF",
  key = "Ctrl-p",
  run = function()
    editor.save()
    local mdContent = editor.getText()
    local mdTree = markdown.parseMarkdown(mdContent)
          mdTree = markdown.expandMarkdown(mdTree)
    local renderedMd = markdown.renderParseTree(mdTree)
    -- Create a temporary file
    space.writeFile("pandocTMP.md", renderedMd)
    sync.performFileSync("pandocTMP.md")
    local target = editor.prompt("File name", "")
    if not target or target == "" then return end
    local target_pdf =  "Pandoc/" .. target .. ".pdf"
    while not space.fileExists("pandocTMP.md") do
      end

    local pandocArgs = {
      "-c", "Pandoc/pandoc.css",
  --    "--toc",                            
  --    "--toc-depth=3",
      "-s",
      "-o", "pandocTMP.html",
      "pandocTMP.md"
    }
    
    shell.run("pandoc", pandocArgs)
    sync.performFileSync("pandocTMP.html")
    while not space.fileExists("pandocTMP.html") do end

    local weasyArgs = {
      "pandocTMP.html",
       target_pdf
    }
    shell.run("weasyprint", weasyArgs)

    space.deleteFile("pandocTMP.md")
    space.deleteFile("pandocTMP.html")
    editor.flashNotification("PDF generated: " .. target_pdf)
    editor.openUrl("/.fs/" .. target_pdf)
  end
}

```


## pandoc.css

${widgets.commandButton("Save pandoc.css")}  ${widgets.commandButton("Delete pandoc.css")}

```space-lua

local CSS = [[
/* Register strings for the header */
h1.title { string-set: title content(); }
p.author { string-set: author content(); }

@page {
   size: A4 /*landscape*/;  /* uncomment for landscape */
   margin: 25mm 25mm;       /* Top/Bottom Left/Right*/
  
  @top-center {
    content: string(title) " — " string(author);
    font-size: 10pt;
    color: #555;
  }
  @bottom-center {
    content: "Page " counter(page) " of " counter(pages);
    font-size: 9pt;
    color: #999;
  }
}
body {
    font-family: 'Courier New', Courier, monospace; 
    font-family: "Times New Roman", serif;
    font-family: "Inter", "Segoe UI", sans-serif;
    color: #222;
    line-height: 1.5;      /* spacing between lines */
}

p { hyphens: auto;
    text-align: justify;
}

/* #TOC {
  page-break-after: always;
}
#TOC ul {
  list-style-type: none;
  padding-left: 0;
}
#TOC a {
  text-decoration: none;
  color: inherit;
} */

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
}

table {
  width: 100%;
  border-collapse: collapse;
}

table :is(th, td) {
  border: 2px solid var(#bababa);
  padding: 0.4rem;
}

table > thead {
  background-color: var(#f7f7f7);
}

table > tbody > tr:nth-child(even) {
  background-color: var(#f7f7f7);
}

blockquote {
  color: #555;
  border-left: 3px solid #005b99;
  padding-left: 0.5em;  /* reduced */
  font-style: italic;
}

img {
  margin-left: auto;
  margin-right: auto;
  page-break-inside: avoid;  /* Avoid splitting the image */
  break-inside: avoid;       /* Modern equivalent */
  display: block;            /* Ensures proper box behavior */
  max-width: 100%;           /* Scale down if needed */
}
figure {
  display: block;
  text-align: center;  /* centers image and caption */
}
]]

command.define {
  name = "Save pandoc.css",
  hide = true,
  run = function()
          local CSSFile = space.writeDocument("Pandoc/pandoc.css", CSS)
          editor.flashNotification("CSS-file saved with size: " .. CSSFile.size .. " bytes")
    end
}

command.define {
  name = "Delete pandoc.css",
  hide = true,
  run = function()
          space.deleteDocument("Pandoc/pandoc.css")
          editor.flashNotification("CSS-File deleted")
    end
}

```

## Pandoc args & options

```
pandoc [OPTIONS] [FILES]
  -f FORMAT, -r FORMAT  --from=FORMAT, --read=FORMAT                    
  -t FORMAT, -w FORMAT  --to=FORMAT, --write=FORMAT                     
  -o FILE               --output=FILE                                   
                        --data-dir=DIRECTORY                            
  -M KEY[:VALUE]        --metadata=KEY[:VALUE]                          
                        --metadata-file=FILE                            
  -d FILE               --defaults=FILE                                 
                        --file-scope                                    
                        --sandbox                                       
  -s                    --standalone                                    
                        --template=FILE                                 
  -V KEY[:VALUE]        --variable=KEY[:VALUE]                          
                        --wrap=auto|none|preserve                       
                        --ascii                                         
                        --toc, --table-of-contents                      
                        --toc-depth=NUMBER                              
  -N                    --number-sections                               
                        --number-offset=NUMBERS                         
                        --top-level-division=section|chapter|part       
                        --extract-media=PATH                            
                        --resource-path=SEARCHPATH                      
  -H FILE               --include-in-header=FILE                        
  -B FILE               --include-before-body=FILE                      
  -A FILE               --include-after-body=FILE                       
                        --no-highlight                                  
                        --highlight-style=STYLE|FILE                    
                        --syntax-definition=FILE                        
                        --dpi=NUMBER                                    
                        --eol=crlf|lf|native                            
                        --columns=NUMBER                                
  -p                    --preserve-tabs                                 
                        --tab-stop=NUMBER                               
                        --pdf-engine=PROGRAM                            
                        --pdf-engine-opt=STRING                         
                        --reference-doc=FILE                            
                        --self-contained                                
                        --request-header=NAME:VALUE                     
                        --no-check-certificate                          
                        --abbreviations=FILE                            
                        --indented-code-classes=STRING                  
                        --default-image-extension=extension             
  -F PROGRAM            --filter=PROGRAM                                
  -L SCRIPTPATH         --lua-filter=SCRIPTPATH                         
                        --shift-heading-level-by=NUMBER                 
                        --base-header-level=NUMBER                      
                        --strip-empty-paragraphs                        
                        --track-changes=accept|reject|all               
                        --strip-comments                                
                        --reference-links                               
                        --reference-location=block|section|document     
                        --atx-headers                                   
                        --markdown-headings=setext|atx                  
                        --listings                                      
  -i                    --incremental                                   
                        --slide-level=NUMBER                            
                        --section-divs                                  
                        --html-q-tags                                   
                        --email-obfuscation=none|javascript|references  
                        --id-prefix=STRING                              
  -T STRING             --title-prefix=STRING                           
  -c URL                --css=URL                                       
                        --epub-subdirectory=DIRNAME                     
                        --epub-cover-image=FILE                         
                        --epub-metadata=FILE                            
                        --epub-embed-font=FILE                          
                        --epub-chapter-level=NUMBER                     
                        --ipynb-output=all|none|best                    
  -C                    --citeproc                                      
                        --bibliography=FILE                             
                        --csl=FILE                                      
                        --citation-abbreviations=FILE                   
                        --natbib                                        
                        --biblatex                                      
                        --mathml                                        
                        --webtex[=URL]                                  
                        --mathjax[=URL]                                 
                        --katex[=URL]                                   
                        --gladtex                                       
                        --trace                                         
                        --dump-args                                     
                        --ignore-args                                   
                        --verbose                                       
                        --quiet                                         
                        --fail-if-warnings                              
                        --log=FILE                                      
                        --bash-completion                               
                        --list-input-formats                            
                        --list-output-formats                           
                        --list-extensions[=FORMAT]                      
                        --list-highlight-languages                      
                        --list-highlight-styles                         
  -D FORMAT             --print-default-template=FORMAT                 
                        --print-default-data-file=FILE                  
                        --print-highlight-style=STYLE|FILE              
  -v                    --version                                       
  -h                    --help                 
```