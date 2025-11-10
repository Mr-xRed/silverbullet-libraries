---
tags: meta/library
pageDecoration.prefix: "☠️ "
files:
- pandoc.css
---

## This command will use `pandoc` & `weasyprint` to create a printout of a page in PDF

> **warning** DEPRECATED
> This is just an example and how to start with pandoc and weasyprint, but not a complete solution.
> Use PrintPreview instead.

### Short instructions how to install `pandoc` and `weasyprint` (on the server side where SilverBullet is running)

- these instructions are for linux only (debian) 
- maybe it also works with other distros like ubuntu but can’t guarantee
- if you run SilverBullet on docker, these instructions aren’t for you (sorry).

```bash
sudo apt install pandoc
sudo apt install python3-pip python3-cffi libcairo2 libpango-1.0-0 libgdk-pixbuf2.0-0 libffi-dev shared-mime-info
pip install weasyprint
sudo apt install libcairo2 libpango-1.0-0 libpangoft2-1.0-0 libgdk-pixbuf2.0-0 libffi-dev libpangocairo-1.0-0
```

## Instructions

1. Set the relative path inside your space to your custom CSS using:
  `config.set("pandocCSS","Relative/Path/To/custom.css")`
  if omitted then the default CSS file path will be used:
  `Library/Mr-xRed/PDF_with_Pandoc_and_Weasyprint/pandoc.css`
2. Reload System
3. Use Ctrl-p to run the command or.
4. Enter your target Filename (without the PDF extension)

## ⚙️ Step-by-step what this script does:

1.  Save the current editor content    
    *   `editor.save()` ensures any unsaved changes are written before processing.
2.  Prepare and render Markdown
    *   Reads the current page (`editor.getText()`).
    *   Parses and expands the Markdown into a full tree (`markdown.parseMarkdown` and `markdown.expandMarkdown`).
    *   Renders it back into complete Markdown text (`markdown.renderParseTree`).
3.  Create a temporary Markdown file
    *   Writes the rendered content into `pandocTMP.md`
    *   Syncs the file system to ensure the file exists before continuing.
4.  Prompt for output file name
    *   Asks the user to input a file name.
    *   Creates a PDF path under `/Pandoc/` folder.
5.  Generate PDF with Pandoc & Weasyprint as PDF-Engine 
    * Uses the CSS file for styling.
    * The commented-out options show that you could enable TOC, landscape, etc.
    *   Runs WeasyPrint to produce the final PDF.
6.  Clean up the temporary file
    *   Deletes both `pandocTMP.md`
7.  Notify and open result
    *   Displays a message confirming success.
    *   Opens the generated PDF file for review/print/download.

## Command implementation

```lua
config.define("pandocCSS", {type = "string"})

local pandocCSS = config.get("pandocCSS") or "Library/Mr-xRed/PDF_with_Pandoc_and_Weasyprint/pandoc.css"

command.define {
  name = "Pandoc: Publish PDF",
  key = "Ctrl-p",
  run = function()
    editor.save()
    local mdContent = editor.getText()
    local mdTree = markdown.parseMarkdown(mdContent)
          mdTree = markdown.expandMarkdown(mdTree)
    local renderedMd = markdown.renderParseTree(mdTree)
    local tempFile = "pandocTMP.md"
    -- Create a temporary file
    space.writeFile(tempFile, renderedMd)
    sync.performFileSync(tempFile)
    local target = editor.prompt("Enter 'Path/FileName' without the .pdf extension", "PDF/")
    if not target or target == "" then return end
    local target_pdf = target .. ".pdf"
    space.writeFile(target_pdf, "CreatedForFilePath")
    while not space.fileExists(tempFile) do
      end
    
    local pandocArgs = {
      "-c", pandocCSS,
  --    "--toc",                            
  --    "--toc-depth=3",
      "--pdf-engine=weasyprint",
      "-s",
--      "--metadata", "title=" .. target,
      "-o", target_pdf,
      "-i", tempFile
    }
    
    shell.run("pandoc", pandocArgs)
    while not space.fileExists(target_pdf) do end
    space.deleteFile("pandocTMP.md")
    editor.flashNotification("PDF generated: " .. target_pdf)
    editor.openUrl("/.fs/" .. target_pdf)
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