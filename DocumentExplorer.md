---
name: "Library/Mr-xRed/DocumentExplorer"
tags: meta/library
files:
- PanelDragResize.js
- docex_styles.css
pageDecoration.prefix: "🗂️ "
---
# 🗂️ Document Explorer

> **warning** WORK IN PROGRESS

![DocumentExplorer_Screenshot](https://raw.githubusercontent.com/Mr-xRed/silverbullet-libraries/refs/heads/main/DocumentExplorer_Screenshot.png)

## Features
• Dynamic View Modes:
  * ==Grid== Large thumbnails (with image previews) for a visual gallery experience.
  * ==List==: Compact, vertical view for high-density file management.
  * ==Tree==: Hierarchical navigation with folder nesting and expansion logic.
* Easily switch between ==Window== or ==SidePanel== 
• Real-Time ==Filtering== by filename or extension
• ==Drag&Drop==: Seamlessly drag files from the explorer directly into your pages to insert links or image embeds.
• Context Menu: ==Right-click== for quick File/Folder renaming and deletion.
• ==Responsive design==: Adjustable panel width using keyboard shortcuts.
- Easy to create a Color Theme

## Currently supported extension:
* Pages: .md
* Images: .png, .jpg, .jpeg, .webp, .gif, .svg
* Documents: .pdf, .excalidraw, .drawio (if Plugs installed)
* Every other extension is rendered as `❔` and opened as raw file if browser supports it

## GoTo: ${widgets.commandButton("Document Explorer in SidePanel","Navigate: Document Explorer")} or ${widgets.commandButton("Document Explorer in Window","Navigate: Document Explorer Window")}
## or use the shortcuts: 

> **tip** New ShortCut Keys
> `Ctrl-Alt-e`          - Toggle Document Explorer
> `Ctrl-Alt-ArrotRight` - Increase Document Explorer Width in 10% increments
> `Ctrl-Alt-ArrotLeft`  - Decrease Document Explorer Width in 10% increments

## Configuration Options and Defaults:
* `homeDirName`        - Name how your Home Directory appears in the Breadcrumbs (default: "🏠 Home")
* `goToCurrentDir`     - Start navigation in the Directory of the currently opened page (default: true)
* `tileSize`           - Grid Tile size, recommended between 60px-120px (default: "80px") 
* `listHeight`         - List & Tree Row height, recommended between 18px-36px (default: "24px") 
* `enableContextMenu`  - Enable/Disable the Right-Click for Files & Folders: Rename & Delete (default: true)
* `negativeFilter`     - Negative Filter to hide certain elements in Explorer (by path, extensions or wildcard) (default: none ) 

```lua
config.set("explorer", {
  homeDirName = "🏠 Home",
  goToCurrentDir = true,
  tileSize = "80px",
  enableContextMenu = true,
  listHeight = "24px",
  negativeFilter = {"Library/Std","*.zip","*.js","*.css", "*test*"}
})
```

> **note** Note
> Copy this into a `space-lua` block on your config page to change default values.

### Styling: Icons

```
Icons from Lucide (https://lucide.dev)
Copyright (c) Lucide Contributors 2025
Portions Copyright (c) 2013–2023 Cole Bemis (Feather)
Licensed under the ISC and MIT licenses.
```

## Space-Style Color Theming Example

> **tip** Tip
> Make sure you copy this as space-style so it not gets overwritten with future updates!

```css

:root{
  --header-height: 20px;                         /* Header height, drag-area */
  --frame-width: 5px;                            /* frame thickness */
  --frame-color: oklch(0.4 0 0 / 0.3);           /* frame color */
  --window-border: 2px;                          /* solid border width (aesthetic) */
  --window-border-radius: 10px;                  /* inner iframe border radius */
  --window-border-color: oklch(0.65 0 0 / 0.3);  /* solid border color (aesthetic) */
} 
      
html[data-theme="dark"]{
  --explorer-bg-color: oklch(0.25 0 0);
  --explorer-hover-bg: oklch(0.65 0 0 / 0.5);
  --explorer-text-color: oklch(1 0 0);
  --explorer-border-color: oklch(0.65 0 0 / 0.5);
  --explorer-accent-color: oklch(0.75 0.25 230);
  --explorer-tile-bg: oklch(0.75 0 0 / 0.1);
  --link-color:  oklch(0.85 0.1 260);
  --folder-color: oklch(0.85 0.1 105);
  --file-md-color:  oklch(0.85 0.1 260);
  --file-pdf-color: oklch(0.85 0.1 30); 
  --file-img-color: oklch(0.85 0.1 180); 
  --file-ex-color:  oklch(0.85 0.1 300); 
  --file-dio-color: oklch(0.85 0.1 90); 
  --file-unk-color: oklch(0.85 0 0);
}

html[data-theme="light"]{
  --explorer-bg-color: oklch(0.85 0 0);
  --explorer-hover-bg: oklch(0.75 0 0 / 0.5);
  --explorer-text-color: oklch(0 0 0);
  --explorer-border-color: oklch(0.50 0 0 / 0.5);
  --explorer-accent-color: oklch(0.80 0.18 230);
  --explorer-tile-bg: oklch(0.75 0 0 / 0.1);
  --folder-color: oklch(0.65 0.15 105);
  --file-md-color:  oklch(0.65 0.15 260);
  --file-pdf-color: oklch(0.65 0.15 30); 
  --file-img-color: oklch(0.65 0.15 180); 
  --file-ex-color:  oklch(0.65 0.15 300); 
  --file-dio-color: oklch(0.65 0.15 90); 
  --file-unk-color: oklch(0.65 0 0);
}

```


## Integration:

```space-lua
-- priority: -1

-- ------------- Config Init -------------
config.define("explorer", {
  type = "object",
  properties = {
    homeDirName = schema.string(),
    tileSize = schema.string(),
    listHeight = schema.string(),
    panelWidth = schema.number(),
    goToCurrentDir = schema.boolean(),
    enableContextMenu = schema.boolean(),
    negativeFilter = { type = "array", items = { type = "string" } }
  }
})

-- ------------- Lucide Icon Library -------------
local ICONS = {

 grid   = [[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>]],

 list   = [[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>]],

 tree   = [[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-tree-icon lucide-folder-tree"><path d="M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z"/><path d="M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z"/><path d="M3 5a2 2 0 0 0 2 2h3"/><path d="M3 3v13a2 2 0 0 0 2 2h3"/></svg>]],

 folder = [[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-icon lucide-folder"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>]],

 folderUp = [[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-up-icon lucide-folder-up"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="M12 10v6"/><path d="m9 13 3-3 3 3"/></svg>]],

 fileMD   = [[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-notebook-text-icon lucide-notebook-text"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9.5 8h5"/><path d="M9.5 12H16"/><path d="M9.5 16H14"/></svg>]],

 filePDF   = [[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>]],

 fileEX   = [[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-ruler-icon lucide-pencil-ruler"><path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"/><path d="m8 6 2-2"/><path d="m18 16 2-2"/><path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>]],

 fileDIO   = [[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-ruler-icon lucide-pencil-ruler"><path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"/><path d="m8 6 2-2"/><path d="m18 16 2-2"/><path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>]],

 file   = [[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-question-mark-icon lucide-file-question-mark"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M12 17h.01"/><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"/></svg>]],

 fileIMG  = [[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>]],

 home   = [[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>]],

 close  = [[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>]],

 filterOff = [[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>]],

 filterOn = [[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>]],

  window = [[<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/></svg>]]

}

-- local ICONS = {
--   grid      = "🗄️",
--   list      = "📋",
--   tree      = "🌲",
--   folder    = "📁",
--   folderUp  = "📂",
--   fileMD    = "📝",
--   filePDF   = "📄",
--   fileEX    = "🔲",
--   fileDIO   = "📐",
--   file      = "❓",
--   fileIMG   = "🖼️",
--   home      = "🏠",
--   close     = "❎",
--   filterOff = "😎",
--   filterOn  = "👀",
--   window    = "🪟"
-- }


-- ------------- Load Config -------------
local cfg = config.get("explorer") or {}
local tileSize = cfg.tileSize or "80px"
local listHeight = cfg.listHeight or "24px"
local homeDirName = cfg.homeDirName or "🏠 Home"
local goToCurrentDir = cfg.goToCurrentDir ~= false
local enableContextMenu = cfg.enableContextMenu ~= false
local negativeFilter = cfg.negativeFilter or {}

local PANEL_ID = "lhs"
local PANEL_VISIBLE = false
local PATH_KEY = "gridExplorer.cwd"
local VIEW_MODE_KEY = "gridExplorer.viewMode"

-- ---------- Helper to check negative filters ----------
local function isFiltered(path)
  if clientStore.get("explorer.disableFilter") == "true" then return false end
  
  local lowPath = path:lower()
  for _, pattern in ipairs(negativeFilter) do
    local lowPattern = pattern:lower()
    
    -- Case 1: *word* (Internal Wildcard - matches if word exists anywhere)
    if lowPattern:match("^%*.*%*$") then
      local searchStr = lowPattern:sub(2, -2)
      if lowPath:find(searchStr, 1, true) then return true end

    -- Case 2: *.ext (Suffix Wildcard)
    elseif lowPattern:sub(1, 2) == "*." then
      local ext = lowPattern:sub(3)
      if lowPath:match("%." .. ext .. "$") then return true end
    
    -- Case 3: Plain string / Prefix match
    elseif lowPath:find(lowPattern, 1, true) then
      return true
    end
  end
  return false
end

-- ---------- Helper to build file tiles ----------
local function fileTile(icon, name, target, ext, viewMode)
  local tileClass = "grid-tile"
  local onClickAction
  local rawPath = target:gsub("^/", "") 
  local dragData = rawPath 
  
  local originalExt = (ext or "?"):lower()
  local category = originalExt
  
  if originalExt == "jpg" or originalExt == "jpeg" or originalExt == "png" or 
     originalExt == "webp" or originalExt == "gif" or originalExt == "svg" then
      category = "img"
  end

  -- ---------- CSS classes and Drag&Drop data ----------
  if category == "md" then 
      tileClass = tileClass .. " md-tile"
      dragData = "[[" .. rawPath .. "]]"
  elseif category == "pdf" then 
      tileClass = tileClass .. " pdf-tile"
      dragData = "[[" .. rawPath .. "]]"
  elseif category == "img" then 
      tileClass = tileClass .. " image-tile"
      dragData = "![[" .. rawPath .. "]]"
  elseif category == "excalidraw" then 
      tileClass = tileClass .. " excalidraw-tile"
      dragData = "```excalidraw\n" .. rawPath .. "\n```"
  elseif category == "drawio" then 
      tileClass = tileClass .. " drawio-tile"
      dragData = "```drawio\nurl:" .. rawPath .. "\n```"
  else 
      tileClass = tileClass .. " unknown-tile"
  end
  
  local encodedDrag = encoding.base64Encode(dragData)

  -- ---------- Navigation Logic ----------
  if category ~= "md" and category ~= "pdf" and category ~= "drawio" and category ~= "excalidraw" and category ~= "img" then
      onClickAction = "window.open('" .. target .. "', '_blank')"
  else
      onClickAction = "syscall('editor.navigate','" .. target .. "',false,false)"
  end

  -- ---------- Icon & Thumbnail Logic ----------
  local finalIcon = icon
  if viewMode ~= "grid" then
      if category == "md" then finalIcon = ICONS.fileMD
      elseif category == "pdf" then finalIcon = ICONS.filePDF
      elseif category == "excalidraw" then finalIcon = ICONS.fileEX
      elseif category == "drawio" then finalIcon = ICONS.fileDIO
      elseif category == "img" then finalIcon = ICONS.fileIMG
      else finalIcon = ICONS.file
      end
  else
      if category == "img" then
          finalIcon = "<img src='/.fs" .. target .. "' loading='lazy' class='tile-thumb' />"
      end
  end

  return "<div class='" .. tileClass .. "' " ..
    "draggable='true' ondragstart='handleDragStart(event, \"" .. encodedDrag .. "\")' " ..
    "data-ext='" .. originalExt:upper() .. "' title='" .. name .. "' onclick=\"" .. onClickAction .. "\">" ..
    "<div class='icon'>" .. finalIcon .. "</div><div class='grid-title'>" .. name .. "</div></div>"
end

-- ---------- Tree Logic ----------
local function renderTree(files, prefix)
    local tree = {}
    for _, f in ipairs(files) do
        -- Check negative filter before processing
        if not isFiltered(f.name) then
            if prefix == "" or f.name:sub(1, #prefix) == prefix then
                local rel = f.name:sub(#prefix + 1)
                local current = tree
                  for part in rel:gmatch("[^/]+") do
                      current[part] = current[part] or {} 
                          if not rel:find(part .. "/", 1, true) then 
                          current[part]._path = f.name 
                      end
                      current = current[part]
                  end
            end
        end
    end

    local function traverse(node, name, level)
        local sorted = {}
        for k in pairs(node) do 
            if k:sub(1,1) ~= "_" then table.insert(sorted, k) end 
        end
        table.sort(sorted)
        
        local html = ""
        if node._path then
            local ext = node._path:match("%.([^.]+)$") or "md"
            html = "<div class='tree-file'>" .. 
       fileTile(ICONS.file, name:gsub("%.md$",""), "/" .. node._path:gsub("%.md$",""), ext, "tree") .. "</div>"
        else
            html = "<details open class='tree-folder'>" ..
                   "<summary class='grid-tile folder-tile' title='"..name.."' >" ..
                    "<div class='icon'>"..ICONS.folder.."</div><div class='grid-title'>"..name.."</div>"..
                    "</summary>" ..
                   "<div class='tree-content'>"
            for _, k in ipairs(sorted) do 
                html = html .. traverse(node[k], k, level + 1) 
            end
            html = html .. "</div></details>"
        end
        return html
    end

    local finalHtml = "<div class='tree-view-container'>"
    local rootKeys = {}
    for k in pairs(tree) do 
        if k:sub(1,1) ~= "_" then table.insert(rootKeys, k) end 
    end
    table.sort(rootKeys)
    for _, k in ipairs(rootKeys) do finalHtml = finalHtml .. traverse(tree[k], k, 0) end
    return finalHtml .. "</div>"
end

-- ---------- deleteFile function ----------

function deleteFileWithConfirm(path)  
  if not path then   
    return   
  end  
  if editor.confirm("Are you sure you want to delete " .. path .. "?") then  
    local fileToDelete = path  
    -- Add .md if it's a page (no extension)  
    if not path:match("%.[^.]+$") then  
        fileToDelete = path .. ".md"  
    end        
    -- Delete the file using space.deleteFile  
    space.deleteFile(fileToDelete)  
    -- Refresh the explorer to show the deletion  
    local currentDir = clientStore.get("gridExplorer.cwd") or ""  
    editor.invokeCommand("DocumentExplorer: Open Folder", {path = currentDir}) 
  end  
end 

-- ---------- drawPanel function ----------

local function drawPanel()
  local currentWidth = clientStore.get("explorer.panelWidth") or config.get("explorer.panelWidth") or 0.8
  local viewMode = clientStore.get(VIEW_MODE_KEY) or config.get("explorer.viewMode") or "grid"
  
  local folderPrefix = clientStore.get(PATH_KEY) or ""
  if viewMode == "tree" then
      folderPrefix = "" -- Force root directory for tree view
  end
  if folderPrefix ~= "" and not folderPrefix:match("/$") then
    folderPrefix = folderPrefix .. "/"
  end

  local files = space.listFiles()
  
  local crumbs = {"<a title=\"Go Home\" onclick=\"syscall('editor.invokeCommand','DocumentExplorer: Open Folder',{path:''})\">"..homeDirName.."</a>"}
  local pathAccum = ""
  for part in folderPrefix:gmatch("([^/]+)/") do
    pathAccum = pathAccum .. part .. "/"
    table.insert(crumbs, "<a onclick=\"syscall('editor.invokeCommand','DocumentExplorer: Open Folder',{path:'"..pathAccum.."'} )\">" .. part .. "</a>")
  end
  local breadcrumbHtml = "<div class='explorer-breadcrumbs'>" .. table.concat(crumbs, " <span class='sep'>/</span> ") .. "</div>"

local html = [[
      <div class="explorer-panel mode-]] .. viewMode .. [[">
        <div class="explorer-header">
          <div class="explorer-toolbar">          
            <div class="input-wrapper">
              <input type="text" title="e.g.: user man pdf" id="tileSearch" placeholder="Filter..." oninput="filterTiles()">
              <div id="clearSearch" class="clear-btn" onmousedown="clearFilter(event)">✕</div>
            </div>
            <div class="view-switcher">
              <div title="Grid View" class="]]..(viewMode=="grid" and "active" or "")..[[" onclick="syscall('editor.invokeCommand','DocumentExplorer: Change View Mode',{mode:'grid'})">]]..ICONS.grid..[[</div>
              <div title="List View" class="]]..(viewMode=="list" and "active" or "")..[[" onclick="syscall('editor.invokeCommand','DocumentExplorer: Change View Mode',{mode:'list'})">]]..ICONS.list..[[</div>
              <div title="Tree View" class="]]..(viewMode=="tree" and "active" or "")..[[" onclick="syscall('editor.invokeCommand','DocumentExplorer: Change View Mode',{mode:'tree'})">]]..ICONS.tree..[[</div>
            </div>
            <div title="Toggle Negative Filter" 
                    class="explorer-action-btn" id="filter-btn" 
                    style="background: ]] .. (clientStore.get("explorer.disableFilter") == "true" and "var(--explorer-accent-color)" or "var(--explorer-tile-bg)") .. [[" 
                    onclick="syscall('editor.invokeCommand','DocumentExplorer: ToggleFilter')">
              ]] .. (clientStore.get("explorer.disableFilter") == "true" and ICONS.filterOn or ICONS.filterOff) .. [[
            </div>
            <div class="action-buttons" style="display: flex; gap: 4px;">
              <div class="explorer-action-btn" title="Switch to Window/Sidepanel" onclick="syscall('editor.invokeCommand', 'DocumentExplorer: Toggle Window Mode')">]]..ICONS.window..[[</div>
              <div class="explorer-close-btn" title="Close Explorer" onclick="syscall('editor.invokeCommand', 'Navigate: Document Explorer')">]]..ICONS.close..[[</div>
            </div>
          </div>
          ]] .. breadcrumbHtml .. [[
        </div>
        <div class="document-explorer" id="explorerGrid" data-current-path="]] .. folderPrefix .. [[">
  ]]

  if viewMode == "tree" then
      html = html .. renderTree(files, folderPrefix)
  else
      local folders, mds, pdfs, drawio, excalidraw ,images, unknowns = {}, {}, {}, {}, {}, {}, {}
      local seen = {}

      for _, file in ipairs(files) do
        -- Check negative filter
        if not isFiltered(file.name) then
            if folderPrefix == "" or file.name:sub(1, #folderPrefix) == folderPrefix then
              local rest = file.name:sub(#folderPrefix + 1)
              local slash = rest:find("/")
              if slash then
                local sub = rest:sub(1, slash - 1)
                if not seen[sub] then
                  seen[sub] = true
                  table.insert(folders, sub)
                end
              elseif rest ~= "" then
                if rest:match("%.md$") then table.insert(mds, rest)
                elseif rest:match("%.pdf$") then table.insert(pdfs, rest)
                elseif rest:match("%.drawio$") then table.insert(drawio, rest)
                elseif rest:match("%.excalidraw$") then table.insert(excalidraw, rest)
                elseif rest:match("%.png$") 
                    or rest:match("%.jpg$")
                    or rest:match("%.gif$")
                    or rest:match("%.jpeg$")
                    or rest:match("%.svg$")
                    or rest:match("%.webp$") then table.insert(images, rest)
                else table.insert(unknowns, rest)
                end
              end
            end
        end
      end

      table.sort(folders); table.sort(mds); table.sort(pdfs);
      table.sort(drawio); table.sort(excalidraw); table.sort(images); table.sort(unknowns)

      if folderPrefix ~= "" then
        local parent = folderPrefix:gsub("[^/]+/$", "")
        html = html .. "<div class='grid-tile folderup-tile' onclick=\"syscall('editor.invokeCommand','DocumentExplorer: Open Folder',{path:'"..parent.."'} )\">" ..
          "<div class='icon'>"..ICONS.folderUp.."</div><div class='grid-title'>..</div></div>"
      end

      for _, f in ipairs(folders) do
        local p = folderPrefix .. f .. "/"
        html = html .. "<div class='grid-tile folder-tile' title='" .. f .. "' onclick=\"syscall('editor.invokeCommand','DocumentExplorer: Open Folder',{path:'"..p.."'} )\">" ..
          "<div class='icon'>"..ICONS.folder.."</div><div class='grid-title'>"..f.."</div></div>"
      end

      for _, f in ipairs(mds) do html = html .. fileTile(ICONS.fileMD, f:gsub("%.md$",""), "/"..folderPrefix..f:gsub("%.md$",""), "md", viewMode) end
      for _, f in ipairs(pdfs) do html = html .. fileTile(ICONS.filePDF, f:gsub("%.pdf$",""), "/"..folderPrefix..f, "pdf", viewMode) end
      for _, f in ipairs(drawio) do html = html .. fileTile(ICONS.fileDIO, f:gsub("%.drawio$",""), "/"..folderPrefix..f, "drawio", viewMode) end
      for _, f in ipairs(excalidraw) do html = html .. fileTile(ICONS.fileEX, f:gsub("%.excalidraw$",""), "/"..folderPrefix..f, "excalidraw", viewMode) end
      for _, f in ipairs(images) do html = html .. fileTile(ICONS.fileIMG, f, "/"..folderPrefix..f, "img", viewMode) end
      for _, f in ipairs(unknowns) do 
          local extension = f:match("%.([^.]+)$") or "?"
          html = html .. fileTile(ICONS.file, f, "/.fs/"..folderPrefix..f, extension, viewMode) 
      end
  end

  html = html .. "</div></div>"

local script = [[
(function() {
// ---------------- Drag & Drop Logic ----------------
window.handleDragStart = function(event, encodedData) {
    const decodedData = atob(encodedData);
    event.dataTransfer.setData("text/plain", decodedData);
    event.dataTransfer.effectAllowed = "copy";
    
    const tile = event.target.closest('.grid-tile');
    if (tile) {
        tile.classList.add("is-dragging");

        tile.addEventListener('dragend', function cleanup() {
            tile.classList.remove("is-dragging");
            tile.removeEventListener('dragend', cleanup);
        }, { once: true });
    }
};
        
// ---------------- Context Menu ----------------
    const contextMenuEnabled = ]] .. tostring(enableContextMenu) .. [[;
    
    if (contextMenuEnabled) {
        const menu = document.createElement('div');
        menu.id = 'explorer-context-menu';
        menu.style.display = 'none';
        menu.style.position = 'fixed';
        menu.style.zIndex = '1000';
        document.body.appendChild(menu);

        window.oncontextmenu = function(e) {
            const tile = e.target.closest('.grid-tile');
            if (!tile || tile.innerText.includes("..")) return; 
            
            e.preventDefault();
            
            let targetPath = "";
            const onClickAttr = tile.getAttribute('onclick') || "";
            const isFolder = tile.classList.contains('folder-tile');
            
            const multiArgMatch = onClickAttr.match(/path\s*:\s*['"]([^'"]+)['"]/);
            const simpleArgMatch = onClickAttr.match(/syscall\s*\(\s*['"][^'"]+['"]\s*,\s*['"]([^'"]+)['"]/);
            const winOpenMatch = onClickAttr.match(/window\.open\s*\(\s*['"]([^'"]+)['"]/);
            
            if (multiArgMatch) targetPath = multiArgMatch[1];
            else if (simpleArgMatch) targetPath = simpleArgMatch[1];
            else if (winOpenMatch) targetPath = winOpenMatch[1];
            else targetPath = tile.getAttribute('title') || "";

            let internalPath = targetPath.replace(/^\/\.fs\//, "").replace(/^\//, "");
            if (isFolder) internalPath = internalPath.replace(/\/$/, "");

            let menuContent = `<div class="menu-item" id="ctx-rename">Rename</div>`;
            if (!isFolder) {
                menuContent += `<div class="menu-item delete" id="ctx-delete">Delete</div>`;
            }
            menu.innerHTML = menuContent;

            menu.style.display = 'block';
            const menuWidth = menu.offsetWidth;
            const menuHeight = menu.offsetHeight;
            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;

            let posX = e.clientX;
            if (posX + menuWidth > winWidth) posX = posX - menuWidth;
            let posY = e.clientY;
            if (posY + menuHeight > winHeight) posY = posY - menuHeight;

            menu.style.left = posX + 'px';
            menu.style.top = posY + 'px';

            document.getElementById('ctx-rename').onclick = async () => {
                menu.style.display = 'none';
                const currentDir = document.getElementById("explorerGrid").getAttribute("data-current-path");
                let renamePath = internalPath;
                const isPage = !isFolder && !internalPath.match(/\.[^.]+$/);
                if (isPage) renamePath += ".md";
                await syscall("system.invokeFunction", "index.renamePrefixCommand", { oldPrefix: renamePath });
                await syscall("editor.invokeCommand", "DocumentExplorer: Open Folder", { path: currentDir }); 
            };
            const deleteBtn = document.getElementById('ctx-delete');  
            if (deleteBtn) {  
                deleteBtn.onclick = async () => {  
                    menu.style.display = 'none';  
                      
                    // Call the Lua function via lua.evalExpression  
                    await syscall("lua.evalExpression", `deleteFileWithConfirm("${internalPath}")`);  
                };  
            }
        };

        window.onclick = () => { menu.style.display = 'none'; };
    }

// ---------------- Filter Logic ----------------
    window.filterTiles = function() {
        const input = document.getElementById("tileSearch");
        const clearBtn = document.getElementById("clearSearch");
        const query = input.value.toLowerCase();
        const terms = query.split(/\s+/).filter(t => t.length > 0);
        const tiles = document.querySelectorAll(".grid-tile");
    
        if (query.length > 0) { clearBtn.style.display = "flex"; } 
        else { clearBtn.style.display = "none"; }

        tiles.forEach(tile => {
            if (tile.innerText === "..") return;
            const title = (tile.getAttribute("title") || "").toLowerCase();
            const ext = (tile.getAttribute("data-ext") || "").toLowerCase();
            const combined = title + " " + ext;
            const match = terms.every(term => combined.includes(term));
            tile.style.display = match ? "flex" : "none";
        });
    };

    window.clearFilter = function(event) {
        if (event) { event.preventDefault(); event.stopPropagation(); }
        const input = document.getElementById("tileSearch");
        input.value = "";
        filterTiles(); 
        input.focus(); 
    };

// ---------------- Load Styles Once ----------------
    function ensureElement(id, tag, attributes, content) {
        if (document.getElementById(id)) return document.getElementById(id);
        const el = document.createElement(tag);
        el.id = id;
        for (let key in attributes) el.setAttribute(key, attributes[key]);
        if (content) el.innerHTML = content;
        document.head.appendChild(el);
        return el;
    }

    // Load main.css and Custom Styles once
ensureElement("silverbullet-main-css", "link", { rel: "stylesheet", href: "/.client/main.css"});
ensureElement("explorer-style-css", "link", { rel: "stylesheet", href: "/.fs/Library/Mr-xRed/docex_styles.css" });
    
    // ---------------- Load Custom Style Sheets ----------------
    // We use a specific ID to check if we've already processed these
    if (!document.getElementById("explorer-custom-styles-once")) {
        const parentStyles = parent.document.getElementById("custom-styles")?.innerHTML || "";
        const cleanStyles = parentStyles.replace(/<\/?style>/g, "");
        
        const styleEl = document.createElement("style");
        styleEl.id = "explorer-custom-styles-once";
        styleEl.innerHTML = cleanStyles;
        document.head.appendChild(styleEl);
    }

    // ---------------- Load Dynamic Vars ----------------
    // Note: We update .innerHTML every time because the values (tileSize) 
    // might have changed in the config, but we don't create a new element.
    const dynamicVars = `:root { 
              --tile-size: ]] .. tileSize..[[;
              --list-tile-height: ]]..listHeight..[[;
              --icon-size-grid: calc(var(--tile-size) * 0.6); }`;
    const varEl = ensureElement("explorer-dynamic-vars", "style", {});
    varEl.innerHTML = dynamicVars;

})(); 
]]
  
  editor.showPanel(PANEL_ID, currentWidth, html, script)
  PANEL_VISIBLE = true
end

command.define {
  name = "DocumentExplorer: Open Folder",
  hide = true,
  run = function(args)
    clientStore.set(PATH_KEY, args and args.path or "")
    drawPanel()
  end
}

command.define {
  name = "DocumentExplorer: Change View Mode",
  hide = true,
  run = function(args)
    clientStore.set(VIEW_MODE_KEY, args.mode)
    drawPanel()
  end
}

command.define {
  name = "Navigate: Document Explorer",
  hide = true,
  run = function()
    if PANEL_VISIBLE then
      editor.hidePanel(PANEL_ID)
      PANEL_VISIBLE = false
    else
      if goToCurrentDir then
        local current = editor.getCurrentPath() or ""
        clientStore.set(PATH_KEY, current:match("^(.*)/") or "")
      end
      drawPanel()
    end
  end
}

command.define {
  name = "Document Explorer: Increase Width",
  key = "Ctrl-Alt-ArrowRight",
  hide = true,
  run = function()
    local cur = clientStore.get("explorer.panelWidth") or 0.8
    clientStore.set("explorer.panelWidth", math.min(cur + 0.05, 1))
    drawPanel()
  end
}

command.define {
  name = "Document Explorer: Decrease Width",
  key = "Ctrl-Alt-ArrowLeft",
  hide = true,
  run = function()
    local cur = clientStore.get("explorer.panelWidth") or 0.8
    clientStore.set("explorer.panelWidth", math.max(cur - 0.05, 0.45))
    drawPanel()
  end
}

command.define {
  name = "Navigate: Document Explorer Window",
  hide = true,
  run = function()
        editor.invokeCommand "Navigate: Document Explorer"
        js.import("/.fs/Library/Mr-xRed/PanelDragResize.js").enableDrag()
       end
}


command.define {
  name = "DocumentExplorer: Toggle Window Mode",
  hide = true,
  run = function()
    local currentMode = clientStore.get("explorer.currentDisplayMode") or "panel"    
    -- Close current view
    if currentMode == "window" then
      -- If in window, we just call the toggle which will hide it
      editor.hidePanel(PANEL_ID) 
      PANEL_VISIBLE = false
      clientStore.set("explorer.currentDisplayMode", "panel")
      editor.invokeCommand("Navigate: Document Explorer")
    else
      -- If in panel, hide panel and open window
      editor.hidePanel(PANEL_ID)
      PANEL_VISIBLE = false
      clientStore.set("explorer.currentDisplayMode", "window")
      editor.invokeCommand("Navigate: Document Explorer Window")
    end
  end
}


command.define {
  name = "Navigate: Toggle Document Explorer",
  key = "Ctrl-Alt-e",
  run = function()
    -- Check if a panel is currently visible at all
    if PANEL_VISIBLE then
        editor.hidePanel(PANEL_ID)
        PANEL_VISIBLE = false
    else
        local lastMode = clientStore.get("explorer.currentDisplayMode") or "panel"
        
        if lastMode == "window" then
            editor.invokeCommand("Navigate: Document Explorer Window")
        else
            editor.invokeCommand("Navigate: Document Explorer")
        end
    end
  end
}

command.define {
  name = "DocumentExplorer: ToggleFilter",
  hide = true,
  run = function()
    local current = clientStore.get("explorer.disableFilter")
    if current == "true" then
      clientStore.set("explorer.disableFilter", "false")
    else
      clientStore.set("explorer.disableFilter", "true")
    end
    drawPanel()
  end
}

```



## Discussions to this library
* [SilverBullet Community](https://community.silverbullet.md/t/document-explorer-image-gallery-for-silverbullet/3647?u=mr.red)