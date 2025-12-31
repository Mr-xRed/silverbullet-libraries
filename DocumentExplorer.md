---
name: "Library/Mr-xRed/DocumentExplorer"
tags: meta/library
files:
- PanelDragResize.js
- docex_styles.css
- lucide-icons.svg
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
> Make sure you copy this as space-style so it won’t get overwritten with future updates!

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

local SVG_ICONS = {
grid  = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-grid"></use></svg>',
list  = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-list"></use></svg>',
tree  = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-tree"></use></svg>',
folder = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-folder"></use></svg>',
folderUp = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-folderOpened"></use></svg>',
folderCollapse = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-folderCollapse"></use></svg>',
folderExpand = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-folderExpand"></use></svg>',
refresh = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-refresh"></use></svg>',
fileMD = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-fileMD"></use></svg>',
filePDF = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-filePDF"></use></svg>',
fileEX = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-fileEX"></use></svg>',
fileDIO = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-fileDIO"></use></svg>',
file = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-file"></use></svg>',
fileIMG = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-fileIMG"></use></svg>',
home = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-home"></use></svg>',
close = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-close"></use></svg>',
filterOff = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-filterOff"></use></svg>',
filterOn = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-filterOn"></use></svg>',
window = '<svg class="icon-svg"><use href="/.fs/Library/Mr-xRed/lucide-icons.svg#icon-window"></use></svg>'
 }

 local ICONS = {
   grid      = "🗄️",
   list      = "📋",
   tree      = "🌲",
   folder    = "📁",
   folderUp  = "📂",
   fileMD    = "📝",
   filePDF   = "📄",
   fileEX    = "🔲",
   fileDIO   = "📐",
   file      = "❓",
   fileIMG   = "🖼️",
   home      = "🏠",
   close     = "❎",
   filterOff = "😎",
   filterOn  = "👀",
   window    = "🪟"
}

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
local cachedFiles = nil
local PATH_KEY = "gridExplorer.cwd"
local VIEW_MODE_KEY = "gridExplorer.viewMode"

-- ---------- Helper to check negative filters ----------
local function isFiltered(path)
  -- We always calculate this so we can "tag" the item in HTML
  local lowPath = path:lower()
  for _, pattern in ipairs(negativeFilter) do
    local lowPattern = pattern:lower()
    
    if lowPattern:match("^%*.*%*$") then
      local searchStr = lowPattern:sub(2, -2)
      if lowPath:find(searchStr, 1, true) then return true end

    elseif lowPattern:sub(1, 2) == "*." then
      local ext = lowPattern:sub(3)
      if ext:sub(1, 1) == "*" then
        ext = "[^%.]+%" .. ext:sub(2)
      end
      if lowPath:match("%." .. ext .. "$") then return true end
    
    elseif lowPath:find(lowPattern, 1, true) then
      return true
    end
  end
  return false
end

-- ---------- Helper to build file tiles ----------
local function fileTile(icon, name, target, ext, viewMode)
  local isThisFileFiltered = isFiltered(target)
  local tileClass = "grid-tile"
  
  -- Add the class so CSS can hide/show it
  if isThisFileFiltered then
      tileClass = tileClass .. " filtered-item"
  end

  local onClickAction
  local rawPath = target:gsub("^/", "") 
  local dragData = rawPath 
  
  local originalExt = (ext or "?"):lower()
  local category = originalExt
  
  if originalExt == "jpg" or originalExt == "jpeg" or originalExt == "png" or 
     originalExt == "webp" or originalExt == "gif" or originalExt == "svg" then
      category = "img"
  end

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

  if category ~= "md" and category ~= "pdf" and category ~= "drawio" and category ~= "excalidraw" and category ~= "img" then
      onClickAction = "window.open('" .. target .. "', '_blank')"
  else
      onClickAction = "syscall('editor.navigate','" .. target .. "',false,false)"
  end

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

-- ---------- Refresh Button ----------
function refreshExplorer()
    cachedFiles = space.listFiles()
    drawPanel()
end

function refreshExplorerButton()
    cachedFiles = nil
    drawPanel()
    editor.flashNotification("Document Explorer Refreshed.")
end

-- ---------- Tree Logic ----------
local function renderTree(files, prefix)
    local tree = {}
    local prefixLen = #prefix
    local s_find = string.find
    local s_sub = string.sub

    for _, f in ipairs(files) do
        local name = f.name
        if prefix == "" or s_sub(name, 1, prefixLen) == prefix then
            local rel = s_sub(name, prefixLen + 1)
            local current = tree
            local start = 1
            while true do
                local stop = s_find(rel, "/", start)
                if not stop then
                    local part = s_sub(rel, start)
                    current[part] = current[part] or {}
                    current[part]._path = name
                    break
                else
                    local part = s_sub(rel, start, stop - 1)
                    if not current[part] then current[part] = {} end
                    current = current[part]
                    start = stop + 1
                end
            end
        end
    end

    local function traverse(node, name, buffer)
        local sorted = {}
        for k in pairs(node) do 
            if k:sub(1,1) ~= "_" then table.insert(sorted, k) end 
        end
        table.sort(sorted)
        
        if node._path then
            local ext = node._path:match("%.([^.]+)$") or "md"
            table.insert(buffer, "<div class='tree-file'>")
            table.insert(buffer, fileTile(ICONS.file, name:gsub("%.md$",""), "/" .. node._path:gsub("%.md$",""), ext, "tree"))
            table.insert(buffer, "</div>")
        else
            local fClass = "grid-tile folder-tile"
            if isFiltered(name) then fClass = fClass .. " filtered-item" end

            table.insert(buffer, "<details class='tree-folder'><summary class='" .. fClass .. "' title='"..name.."'>")
            table.insert(buffer, "<div class='icon'>"..ICONS.folder.."</div><div class='grid-title'>"..name.."</div></summary>")
            table.insert(buffer, "<div class='tree-content'>")
            for _, k in ipairs(sorted) do 
                traverse(node[k], k, buffer) 
            end
            table.insert(buffer, "</div></details>")
        end
    end

    local rootKeys = {}
    for k in pairs(tree) do 
        if k:sub(1,1) ~= "_" then table.insert(rootKeys, k) end 
    end
    table.sort(rootKeys)

    local htmlParts = {"<div class='tree-view-container'>"}
    for _, k in ipairs(rootKeys) do 
        traverse(tree[k], k, htmlParts) 
    end
    table.insert(htmlParts, "</div>")
    return table.concat(htmlParts)
end

function deleteFileWithConfirm(path)  
  if not path then return end  
  if editor.confirm("Are you sure you want to delete " .. path .. "?") then  
    local fileToDelete = path  
    if not path:match("%.[^.]+$") then  
        fileToDelete = path .. ".md"  
    end        
    space.deleteFile(fileToDelete)  
    refreshExplorer()
  end  
end

-- ---------- drawPanel function ----------
local function drawPanel()
  local currentWidth = clientStore.get("explorer.panelWidth") or config.get("explorer.panelWidth") or 0.8
  local viewMode = clientStore.get(VIEW_MODE_KEY) or config.get("explorer.viewMode") or "grid"
  
  -- Logic Toggle check
  local filterEnabled = clientStore.get("explorer.disableFilter") ~= "true"

  local folderPrefix = clientStore.get(PATH_KEY) or ""
  if viewMode == "tree" then folderPrefix = "" end
  if folderPrefix ~= "" and not folderPrefix:match("/$") then
    folderPrefix = folderPrefix .. "/"
  end

  if not cachedFiles then cachedFiles = space.listFiles() end
  
  local crumbs = {"<a title=\"Go Home\" onclick=\"syscall('editor.invokeCommand','DocumentExplorer: Open Folder',{path:''})\">"..homeDirName.."</a>"}
  local pathAccum = ""
  for part in folderPrefix:gmatch("([^/]+)/") do
    pathAccum = pathAccum .. part .. "/"
    table.insert(crumbs, "<a onclick=\"syscall('editor.invokeCommand','DocumentExplorer: Open Folder',{path:'"..pathAccum.."'} )\">" .. part .. "</a>")
  end
  local breadcrumbHtml = "<div class='explorer-breadcrumbs'>" .. table.concat(crumbs, " <span class='sep'>/</span> ") .. "</div>"

  local h = {} 
  
  table.insert(h, [[<div class="explorer-panel mode-]])
  table.insert(h, viewMode)
  table.insert(h, [[">
        <div class="explorer-header">
          <div class="explorer-toolbar">          
            <div class="input-wrapper">
              <input type="text" title="e.g.: user man pdf" id="tileSearch" placeholder="Filter..." oninput="filterTiles()">
              <div id="clearSearch" class="clear-btn" onmousedown="clearFilter(event)">✕</div>
            </div>
            <div class="view-switcher">
              <div title="Grid View" class="]])
  table.insert(h, (viewMode=="grid" and "active" or ""))
  table.insert(h, [[" onclick="syscall('editor.invokeCommand','DocumentExplorer: Change View Mode',{mode:'grid'})">]])
  table.insert(h, ICONS.grid)
  table.insert(h, [[</div>
              <div title="List View" class="]])
  table.insert(h, (viewMode=="list" and "active" or ""))
  table.insert(h, [[" onclick="syscall('editor.invokeCommand','DocumentExplorer: Change View Mode',{mode:'list'})">]])
  table.insert(h, ICONS.list)
  table.insert(h, [[</div>
              <div title="Tree View" class="]])
  table.insert(h, (viewMode=="tree" and "active" or ""))
  table.insert(h, [[" onclick="syscall('editor.invokeCommand','DocumentExplorer: Change View Mode',{mode:'tree'})">]])
  table.insert(h, ICONS.tree)
  table.insert(h, [[</div>
  </div>
         <div class="explorer-button-group">
              <div title="Expand/Collapse All" 
                   class="explorer-action-btn" id="tree-toggle-btn"
                   style="display: ]])
  table.insert(h, (viewMode == "tree" and "flex" or "none"))
  table.insert(h, [[" 
                   onclick="toggleTreeExpansion()">
                <span id="tree-toggle-icon">]])
  table.insert(h, ICONS.folderExpand)
  table.insert(h, [[</span>
              </div>
  
              <div title="Refresh View" 
                   class="explorer-action-btn" 
                   id="refresh-btn" 
                   onclick="syscall('lua.evalExpression', 'refreshExplorerButton()')">]])
  table.insert(h, ICONS.refresh)
  table.insert(h, [[</div>
  
              <div title="Toggle Negative Filter" 
                    class="explorer-action-btn" id="filter-btn" 
                    style="background: ]])
  table.insert(h, (clientStore.get("explorer.disableFilter") == "true" and "var(--explorer-accent-color)" or "var(--explorer-tile-bg)"))
  table.insert(h, [[" 
                    onclick="syscall('editor.invokeCommand','DocumentExplorer: ToggleFilter')">]])
  table.insert(h, (clientStore.get("explorer.disableFilter") == "true" and ICONS.filterOn or ICONS.filterOff))
  table.insert(h, [[</div>
          </div>  
              <div class="action-buttons" style="display: flex; gap: 4px;">
              <div class="explorer-action-btn" title="Switch to Window/Sidepanel" onclick="syscall('editor.invokeCommand', 'DocumentExplorer: Toggle Window Mode')">]])
  table.insert(h, ICONS.window)
  table.insert(h, [[</div>
              <div class="explorer-close-btn" title="Close Explorer" onclick="syscall('editor.invokeCommand', 'Navigate: Document Explorer')">]])
  table.insert(h, ICONS.close)
  table.insert(h, [[</div>
            </div>
          </div>]])
  table.insert(h, breadcrumbHtml)
  table.insert(h, [[</div>]])
  
  -- Container setup for CSS toggle
  local gridClass = "document-explorer"
  if filterEnabled then gridClass = gridClass .. " hide-filtered" end

  table.insert(h, [[<div class="]] .. gridClass .. [[" id="explorerGrid" data-current-path="]])
  table.insert(h, folderPrefix)
  table.insert(h, [[">]])

  if viewMode == "tree" then
      table.insert(h, renderTree(cachedFiles, folderPrefix))
  else
      local folders, mds, pdfs, drawio, excalidraw, images, unknowns = {}, {}, {}, {}, {}, {}, {}
      local seen = {}
      local prefixLen = #folderPrefix

      for _, file in ipairs(cachedFiles) do
        local name = file.name
        if folderPrefix == "" or name:sub(1, prefixLen) == folderPrefix then
          local rest = name:sub(prefixLen + 1)
          if rest ~= "" then
            local slash = rest:find("/")
            if slash then
              local sub = rest:sub(1, slash - 1)
              if not seen[sub] then
                  seen[sub] = true
                  table.insert(folders, sub)
              end
            else
                local ext = rest:match("%.([^.]+)$")
                if ext then ext = ext:lower() end 
      
                if ext == "md" then table.insert(mds, rest)
                elseif ext == "pdf" then table.insert(pdfs, rest)
                elseif ext == "drawio" then table.insert(drawio, rest)
                elseif ext == "excalidraw" then table.insert(excalidraw, rest)
                elseif ext == "png" or ext == "jpg" or ext == "jpeg" or 
                       ext == "gif" or ext == "svg" or ext == "webp" then table.insert(images, rest)
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
        table.insert(h, "<div class='grid-tile folderup-tile' onclick=\"syscall('editor.invokeCommand','DocumentExplorer: Open Folder',{path:'"..parent.."'} )\">")
        table.insert(h, "<div class='icon'>"..ICONS.folderUp.."</div><div class='grid-title'>..</div></div>")
      end

      for _, f in ipairs(folders) do
        local p = folderPrefix .. f .. "/"
        local fClass = "grid-tile folder-tile"
        if isFiltered(p) then fClass = fClass .. " filtered-item" end

        table.insert(h, "<div class='" .. fClass .. "' title='" .. f .. "' onclick=\"syscall('editor.invokeCommand','DocumentExplorer: Open Folder',{path:'"..p.."'} )\">")
        table.insert(h, "<div class='icon'>"..ICONS.folder.."</div><div class='grid-title'>"..f.."</div></div>")
      end

      for _, f in ipairs(mds) do table.insert(h, fileTile(ICONS.fileMD, f:gsub("%.md$",""), "/"..folderPrefix..f:gsub("%.md$",""), "md", viewMode)) end
      for _, f in ipairs(pdfs) do table.insert(h, fileTile(ICONS.filePDF, f:gsub("%.pdf$",""), "/"..folderPrefix..f, "pdf", viewMode)) end
      for _, f in ipairs(drawio) do table.insert(h, fileTile(ICONS.fileDIO, f:gsub("%.drawio$",""), "/"..folderPrefix..f, "drawio", viewMode)) end
      for _, f in ipairs(excalidraw) do table.insert(h, fileTile(ICONS.fileEX, f:gsub("%.excalidraw$",""), "/"..folderPrefix..f, "excalidraw", viewMode)) end
      for _, f in ipairs(images) do table.insert(h, fileTile(ICONS.fileIMG, f, "/"..folderPrefix..f, "img", viewMode)) end
      for _, f in ipairs(unknowns) do 
          local extension = f:match("%.([^.]+)$") or "?"
          table.insert(h, fileTile(ICONS.file, f, "/.fs/"..folderPrefix..f, extension, viewMode)) 
      end
  end

  table.insert(h, "</div></div>")

local script = [[
(function() {

// ---------------- Keyboard Navigation ----------------
let focusedIndex = -1;

window.addEventListener('keydown', function(e) {
    if (!document.getElementById("explorerGrid") || document.activeElement.id === "tileSearch") {
        if (e.key === "Escape" && document.activeElement.id === "tileSearch") {
            document.activeElement.blur();
        }
        return; 
    }

    // UPDATED: Only navigate through items that are VISIBLE (not hidden by CSS)
    const tiles = Array.from(document.querySelectorAll(".grid-tile")).filter(t => {
        return window.getComputedStyle(t).display !== 'none';
    });

    if (tiles.length === 0) return;

    const grid = document.getElementById("explorerGrid");
    const firstTile = grid.querySelector(".grid-tile");
    let cols = 1;
    
    if (document.querySelector(".mode-grid") && firstTile) {
        const tileWidth = firstTile.offsetWidth;
        const gridWidth = grid.clientWidth;
        cols = Math.floor((gridWidth + 10) / (tileWidth + 10)); 
        if (cols < 1) cols = 1;
    }

    if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Enter", "Backspace"].includes(e.key)) {
        e.preventDefault();

        if (e.key === "ArrowRight") focusedIndex = Math.min(focusedIndex + 1, tiles.length - 1);
        if (e.key === "ArrowLeft") focusedIndex = Math.max(focusedIndex - 1, 0);
        if (e.key === "ArrowUp") focusedIndex = Math.max(focusedIndex - cols, 0);
        if (e.key === "ArrowDown") focusedIndex = Math.min(focusedIndex + cols, tiles.length - 1);
        
        if (focusedIndex === -1) focusedIndex = 0;

        tiles.forEach(t => t.classList.remove("is-focused"));
        const target = tiles[focusedIndex];
        if (target) {
            target.classList.add("is-focused");
            target.scrollIntoView({ block: "nearest" });

            if (e.key === "Enter") {
                target.click();
                focusedIndex = -1;
            }
        }
        
        if (e.key === "Backspace") {
            const upBtn = document.querySelector(".folderup-tile");
            if (upBtn) {
                focusedIndex = -1;
                upBtn.click();
            }
        }
    }
    
    if (e.key === "/" && document.activeElement.id !== "tileSearch") {
        e.preventDefault();
        document.getElementById("tileSearch").focus();
    }
});
  
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
                await syscall('lua.evalExpression', 'refreshExplorer()');
            };
            const deleteBtn = document.getElementById('ctx-delete');  
            if (deleteBtn) {  
                deleteBtn.onclick = async () => {  
                    menu.style.display = 'none';  
                    await syscall("lua.evalExpression", `deleteFileWithConfirm("${internalPath}")`);
                    await syscall('lua.evalExpression', 'refreshExplorer()');
                };  
            }
        };

        window.onclick = () => { menu.style.display = 'none'; };
    }
// ---------------- Tree Expansion Logic ----------------
const ICON_COLLAPSE = `]] .. ICONS.folderCollapse .. [[`;   
const ICON_EXPAND   = `]] .. ICONS.folderExpand .. [[`; 

window.toggleTreeExpansion = function() {
    const explorer = document.getElementById("explorerGrid");
    const details = explorer.querySelectorAll("details.tree-folder");
    const iconContainer = document.getElementById("tree-toggle-icon");
    if (details.length === 0) return;

    const isAnyOpen = Array.from(details).some(d => d.open);
    details.forEach(d => { d.open = !isAnyOpen; });
    iconContainer.innerHTML = !isAnyOpen ? ICON_COLLAPSE : ICON_EXPAND;
};

// ---------------- Filter Logic with Debounce ----------------
    let cachedTiles = [];
    function initializeTiles() { cachedTiles = Array.from(document.querySelectorAll(".grid-tile")); }
      
    window.filterTiles = function() {
          const input = document.getElementById("tileSearch");
          const query = input.value.toLowerCase().trim();
          const clearBtn = document.getElementById("clearSearch");
          clearBtn.style.display = query.length > 0 ? "flex" : "none";
      
          clearTimeout(window.filterDebounceTimer);
          window.filterDebounceTimer = setTimeout(() => {
              if (cachedTiles.length === 0) initializeTiles();
              const terms = query.split(/\s+/);
              const grid = document.getElementById("explorerGrid");
              grid.style.display = "none"; 
      
              cachedTiles.forEach(tile => {
                  if (tile.classList.contains("folderup-tile")) return;
                  const title = (tile.getAttribute("title") || "").toLowerCase();
                  const ext = (tile.getAttribute("data-ext") || "").toLowerCase();
                  const isMatch = terms.every(term => title.includes(term) || ext.includes(term));
                  tile.style.display = isMatch ? "flex" : "none";
              });
      
              grid.style.display = "grid"; 
              focusedIndex = -1;
          }, 300); 
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

ensureElement("silverbullet-main-css", "link", { rel: "stylesheet", href: "/.client/main.css"});
ensureElement("explorer-style-css", "link", { rel: "stylesheet", href: "/.fs/Library/Mr-xRed/docex_styles.css" });
    
    if (!document.getElementById("explorer-custom-styles-once")) {
        const parentStyles = parent.document.getElementById("custom-styles")?.innerHTML || "";
        const cleanStyles = parentStyles.replace(/<\/?style>/g, "");
        const styleEl = document.createElement("style");
        styleEl.id = "explorer-custom-styles-once";
        styleEl.innerHTML = cleanStyles;
        document.head.appendChild(styleEl);
    }   

    const dynamicVars = `:root { 
              --tile-size: ]] .. tileSize..[[;
              --list-tile-height: ]]..listHeight..[[;
              --icon-size-grid: calc(var(--tile-size) * 0.6); 
    }`;
    const varEl = ensureElement("explorer-dynamic-vars", "style", {});
    varEl.innerHTML = dynamicVars;

})(); 
]]

  local finalHtml = table.concat(h)
  editor.showPanel(PANEL_ID, currentWidth, finalHtml, script)
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
      if not cachedFiles then
        cachedFiles = space.listFiles() 
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