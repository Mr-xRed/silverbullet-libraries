---
name: "Library/Mr-xRed/DocumentExplorer"
tags: meta/library
files:
- UnifiedFloating.js
- docex_styles.css
- lucide-icons.svg
- hybrid-cursor.svg
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

## GoTo: ${widgets.commandButton("Document Explorer in SidePanel","Navigate: Document Explorer")} or 
${widgets.commandButton("Document Explorer in Window","Navigate: Document Explorer Window")}

${widgets.commandButton("Decrease Width","Document Explorer: Decrease Width")}  ${widgets.commandButton("Increase Width","Document Explorer: Increase Width")}
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
* treeFolderFirst    - sort order in treeview: folders then files (default: false)

```lua
config.set("explorer", {
  homeDirName = "🏠 Home",
  goToCurrentDir = true,
  tileSize = "80px",
  enableContextMenu = true,
  listHeight = "24px",
  negativeFilter = {"Library/Std","*.zip","*.js","*.css", "*test*"},
  treeFolderFirst = false
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
html[data-theme="dark"]{
  --explorer-bg-color: var(--top-background-color, oklch(0.25 0 0));
  --explorer-text-color:  var(--root-color, white);
  --explorer-accent-color: var(--ui-accent-color, oklch(0.75 0.25 230));
  --explorer-accent-text: var(--modal-selected-option-color);
  --explorer-hover-bg: oklch(0.65 0 0 / 0.5);
  --explorer-border-color: oklch(0.65 0 0 / 0.5);
  --explorer-tile-bg: oklch(0.75 0 0 / 0.1);
  --folder-color: oklch(0.85 0.1 105);
  --file-md-color:  hsl(213, 100%, 83%);
  --file-pdf-color: oklch(0.85 0.1 30); 
  --file-img-color: oklch(0.85 0.1 180); 
  --file-ex-color:  oklch(0.85 0.1 300); 
  --file-dio-color: oklch(0.85 0.1 90); 
  --file-unk-color: oklch(0.85 0 0);
}

html[data-theme="light"]{
  --explorer-bg-color: var(--top-background-color, oklch(0.85 0 0));
  --explorer-text-color: var(--root-color, black);
  --explorer-accent-color: var(--ui-accent-color, oklch(0.80 0.18 230));
  --explorer-accent-text: var(--modal-selected-option-color);
  --explorer-hover-bg: oklch(0.75 0 0 / 0.5);
  --explorer-border-color: oklch(0.50 0 0 / 0.5);
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

## For the Floating Window
```css
:root{
  --header-height: 20px;                         /* Header height, drag-area */
  --frame-width: 5px;                            /* frame thickness */
  --window-border: 2px;                          /* solid border width (aesthetic) */
  --window-border-radius: 10px;                  /* inner iframe border radius */
  --window-border-color: oklch(0.65 0 0 / 0.3);  /* solid border color (aesthetic) */
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
    treeFolderFirst = schema.boolean(),
    goToCurrentDir = schema.boolean(),
    enableContextMenu = schema.boolean(),
    negativeFilter = { type = "array", items = { type = "string" } }
  }
})

local ICONS = {
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

 local ICONS_EMOJI = {
   grid      = "🗄️",
   list      = "📋",
   tree      = "🌲",
   folderCollapse = "−",
   folderExpand = "✚",
   refresh = "🔁",
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
-- The new sorting preference
local treeFolderFirst = cfg.treeFolderFirst == true 


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
    "data-ext='" .. originalExt:upper() .. "' title='" .. target:gsub("^/", "") .. "' onclick=\"" .. onClickAction .. "\">" ..
    "<div class='icon'>" .. finalIcon .. "</div><div class='grid-title'>" .. name .. "</div></div>"
end

-- ---------- Refresh Logic ----------

function triggerHighlightUpdate()
    clientStore.set("explorer.lastUpdate", os.time() .. math.random())
end

--function refreshOnCreation()
--    cachedFiles = nil  
--    drawPanel()  
--    triggerHighlightUpdate()  
--    editor.flashNotification("New File Created.")
--end

function refreshExplorer()
    cachedFiles = space.listFiles()
    drawPanel()
end

function refreshExplorerButton()
    cachedFiles = space.listFiles()
    drawPanel()
    triggerHighlightUpdate()
    editor.flashNotification("File list refreshed.")
end

-- event.listen { name = "file:listed", run = refreshOnCreation }
event.listen { name = "editor:pageLoaded", run = triggerHighlightUpdate }
event.listen { name = "editor:documentLoaded", run = triggerHighlightUpdate }

-- ---------- Tree Logic ----------
local function renderTree(files, prefix)
    local tree = {}
    local prefixLen = #prefix
    local s_find = string.find
    local s_sub = string.sub

    -- 1. BUILD THE TREE
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
                    local baseName = part:gsub("%.md$", "")
                    
                    if part:match("%.md$") then
                        current[baseName] = current[baseName] or {}
                        current[baseName]._path = name 
                    else
                        current[part] = current[part] or {}
                        if not current[part]._path then
                            current[part]._path = name
                        end
                    end
                    break
                else
                    local part = s_sub(rel, start, stop - 1)
                    current[part] = current[part] or {}
                    current = current[part]
                    start = stop + 1
                end
            end
        end
    end

    -- Internal Helper: Check if a node contains children
    local function isFolderNode(n)
        for k in pairs(n) do
            if k ~= "_path" then return true end
        end
        return false
    end

    -- 2. DEFINE TRAVERSE
    local function traverse(node, name, buffer, currentPath)
        currentPath = currentPath or ""
        local sorted = {}
        for k in pairs(node) do 
            if k:sub(1,1) ~= "_" then table.insert(sorted, k) end 
        end

        if treeFolderFirst then
            table.sort(sorted, function(a, b)
                local isA = isFolderNode(node[a])
                local isB = isFolderNode(node[b])
                if isA ~= isB then return isA end
                return a:lower() < b:lower()
            end)
        else
            table.sort(sorted, function(a, b) return a:lower() < b:lower() end)
        end
        
        local fullPath = name
        if currentPath ~= "" then
            fullPath = currentPath .. "/" .. name
        end
        
        local isHybrid = (node._path ~= nil) and (isFolderNode(node))
        local isFolder = (isFolderNode(node)) and (node._path == nil)
        
        local filteredClass = ""
        if isFiltered(fullPath) then
            filteredClass = " filtered-item"
        end

        if isFolder or isHybrid then
            local fClass = "grid-tile folder-tile"
            if isHybrid then fClass = fClass .. " hybrid-tile" end

            table.insert(buffer, "<details class='tree-folder" .. filteredClass .. "'><summary class='" .. fClass .. "' data-path='"..fullPath.."' title='"..name.."'>")
            table.insert(buffer, "<div class='hybrid-folder-zone'>")
            table.insert(buffer, "<div class='icon'>"..ICONS.folder.."</div><div class='grid-title'>"..name.."</div></div>")
            
            if isHybrid then
                local pagePath = "/" .. node._path:gsub("%.md$","")
                table.insert(buffer, "<div class='hybrid-md-badge' onclick=\"event.stopPropagation(); event.preventDefault(); syscall('editor.navigate','" .. pagePath .. "',false,false)\">MD</div>")
            end
            
            table.insert(buffer, "</summary><div class='tree-content'>")

            -- --- VIRTUAL INJECTION (CHILD LEVEL) ---
            if isHybrid then
                local virtualName = name
                local targetPath = "/" .. node._path:gsub("%.md$","")
                table.insert(buffer, "<div class='tree-file hybrid-virtual-entry'>")
                table.insert(buffer, fileTile(ICONS.fileMD, virtualName, targetPath, "md", "tree"))
                table.insert(buffer, "</div>")
            end

            for _, k in ipairs(sorted) do 
                traverse(node[k], k, buffer, fullPath) 
            end
            table.insert(buffer, "</div></details>")
        else
            if node._path then
                local ext = node._path:match("%.([^.]+)$") or "md"
                table.insert(buffer, "<div class='tree-file" .. filteredClass .. "'>")
                table.insert(buffer, fileTile(ICONS.file, name:gsub("%.md$",""), "/" .. node._path:gsub("%.md$",""), ext, "tree"))
                table.insert(buffer, "</div>")
            end
        end
    end

    -- 3. EXECUTE TRAVERSE
    local rootKeys = {}
    for k in pairs(tree) do 
        if k:sub(1,1) ~= "_" then table.insert(rootKeys, k) end 
    end

    if treeFolderFirst then
        table.sort(rootKeys, function(a, b)
            local isA = isFolderNode(tree[a])
            local isB = isFolderNode(tree[b])
            if isA ~= isB then return isA end
            return a:lower() < b:lower()
        end)
    else
        table.sort(rootKeys, function(a, b) return a:lower() < b:lower() end)
    end

    local basePrefix = prefix:gsub("/$", "")
    local htmlParts = {"<div class='tree-view-container'>"}

    -- --- VIRTUAL INJECTION (ROOT LEVEL) ---
    -- If the CWD itself is a hybrid folder, we show the "Home" page at the very top.
    if prefix ~= "" then
        local rootFolderName = prefix:match("([^/]+)/$")
        local parentPath = prefix:gsub("[^/]+/$", "")
        local rootMdPath = parentPath .. rootFolderName .. ".md"
        
        -- Verify if the root file actually exists in our file list
        local rootExists = false
        for _, f in ipairs(files) do
            if f.name == rootMdPath then rootExists = true; break end
        end

        if rootExists then
            table.insert(htmlParts, "<div class='tree-file hybrid-virtual-entry root-virtual-entry'>")
            table.insert(htmlParts, fileTile(ICONS.fileMD, rootFolderName, "/" .. rootMdPath:gsub("%.md$",""), "md", "tree"))
            table.insert(htmlParts, "</div>")
        end
    end

    for _, k in ipairs(rootKeys) do 
        traverse(tree[k], k, htmlParts, basePrefix) 
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
      if viewMode == "tree" then 
        folderPrefix = clientStore.get(PATH_KEY) or "" 
      end
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
      table.insert(h, ICONS.folderCollapse)
      table.insert(h, [[</span>
                  </div>
      
                  <div title="Refresh View" 
                       class="explorer-action-btn" 
                       id="refresh-btn" 
                       onclick="syscall('lua.evalExpression', 'refreshExplorerButton()')">]])
      table.insert(h, ICONS.refresh)
      local filterDisabled = clientStore.get("explorer.disableFilter") == "true"
      local activeClass = filterDisabled and " active" or ""
      
      table.insert(h, [[</div>
                        <div title="Toggle Negative Filter" 
                              class="explorer-action-btn]] .. activeClass .. [[" id="filter-btn" 
                              onclick="syscall('editor.invokeCommand','DocumentExplorer: ToggleFilter')">]])
      table.insert(h, (filterDisabled and ICONS.filterOn or ICONS.filterOff))
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
    
          -- --- HYBRID PARENT LOGIC ---
          -- Check if we are inside a folder that has a matching .md file at its own level
          local parentPageInject = nil
          if folderPrefix ~= "" then
              local folderName = folderPrefix:match("([^/]+)/$")
              local parentDirPath = folderPrefix:gsub("[^/]+/$", "")
              local targetName = parentDirPath .. folderName .. ".md"
              
              for _, file in ipairs(cachedFiles) do
                  if file.name == targetName then
                      parentPageInject = folderName .. ".md"
                      break
                  end
              end
          end
    
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
    
          -- --- UNIFIED SORTING & HYBRID LOGIC ---
          local allFolders = {} 
          local hybridMap = {}
          local finalMds = {}
          
          local mdLookup = {}
          for _, f in ipairs(mds) do mdLookup[f:gsub("%.md$", "")] = true end
          
          for _, fName in ipairs(folders) do
              if mdLookup[fName] then hybridMap[fName] = true end
              table.insert(allFolders, fName) 
          end
          
          for _, fName in ipairs(mds) do
              local base = fName:gsub("%.md$", "")
              if not hybridMap[base] then table.insert(finalMds, fName) end
          end
    
          -- Alphabetical Sort (Case Insensitive)
          local sortFunc = function(a,b) return a:lower() < b:lower() end
          table.sort(allFolders, sortFunc)
          table.sort(finalMds, sortFunc)
          table.sort(pdfs, sortFunc); table.sort(drawio, sortFunc); 
          table.sort(excalidraw, sortFunc); table.sort(images, sortFunc); table.sort(unknowns, sortFunc)
    
          -- --- RENDER UI ---
    
          if folderPrefix ~= "" then
            local parent = folderPrefix:gsub("[^/]+/$", "")
            table.insert(h, "<div class='grid-tile folderup-tile' onclick=\"syscall('editor.invokeCommand','DocumentExplorer: Open Folder',{path:'"..parent.."'} )\">")
            table.insert(h, "<div class='icon'>"..ICONS.folderUp.."</div><div class='grid-title'>..</div></div>")
          end
    
          -- INJECT PARENT HYBRID PAGE (The "p1" inside folder "p1/")
      if parentPageInject then
          local cleanName = parentPageInject:gsub("%.md$", "")
          -- We use a modified fileTile call or wrap it to add a special class
          local fullPath = "/" .. folderPrefix:gsub("[^/]+/$", "") .. cleanName
          
          -- I'm wrapping this in a div with a special class for your CSS targeting
          table.insert(h, "<div class='hybrid-virtual-entry'>")
          table.insert(h, fileTile(ICONS.fileMD, cleanName, fullPath, "md", viewMode))
          table.insert(h, "</div>")
      end
    
          -- RENDER UNIFIED FOLDERS
          for _, f in ipairs(allFolders) do
              local folderPath = folderPrefix .. f .. "/"
              if hybridMap[f] then
                  local pagePath = "/" .. folderPrefix .. f
                  local hClass = "grid-tile folder-tile hybrid-tile"
                  if isFiltered(folderPath) then hClass = hClass .. " filtered-item" end
                  table.insert(h, "<div class='" .. hClass .. "' title='" .. f .. "'>")
                  table.insert(h, "<div class='hybrid-folder-zone' onclick=\"syscall('editor.invokeCommand','DocumentExplorer: Open Folder',{path:'"..folderPath.."'} )\">")
                  table.insert(h, "<div class='icon'>"..ICONS.folder.."</div><div class='grid-title'>"..f.."</div></div>")
                  table.insert(h, "<div class='hybrid-md-badge' onclick=\"event.stopPropagation(); syscall('editor.navigate','" .. pagePath .. "',false,false)\">MD</div>")
                  table.insert(h, "</div>")
              else
                  local fClass = "grid-tile folder-tile"
                  if isFiltered(folderPath) then fClass = fClass .. " filtered-item" end
                  table.insert(h, "<div class='" .. fClass .. "' title='" .. f .. "' onclick=\"syscall('editor.invokeCommand','DocumentExplorer: Open Folder',{path:'"..folderPath.."'} )\">")
                  table.insert(h, "<div class='icon'>"..ICONS.folder.."</div><div class='grid-title'>"..f.."</div></div>")
              end
          end
    
          -- RENDER FILES
          for _, f in ipairs(finalMds) do table.insert(h, fileTile(ICONS.fileMD, f:gsub("%.md$",""), "/"..folderPrefix..f:gsub("%.md$",""), "md", viewMode)) end
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
    const menu = document.getElementById('explorer-context-menu');
    
    // 1. ESCAPE: High Priority Close
    if (e.key === "Escape") {
        if (menu && menu.style.display === 'block') {
            menu.style.display = 'none';
            e.preventDefault();
            return;
        }
        if (document.activeElement.id === "tileSearch") {
            document.activeElement.blur();
            e.preventDefault();
            return;
        }
    }

    // 2. SEARCH FOCUS: "/" key
    if (e.key === "/" && document.activeElement.id !== "tileSearch") {
        e.preventDefault();
        const searchInput = document.getElementById("tileSearch");
        if (searchInput) {
            searchInput.focus();
            focusedIndex = -1; // Reset focus when starting a search
        }
        return;
    }

    // 3. NAVIGATION GATEKEEPER
    // Don't run nav logic if search is focused (except for ArrowDown to exit search)
    if (!document.getElementById("explorerGrid")) return;
    if (document.activeElement.id === "tileSearch" && e.key !== "ArrowDown") return;

    // 4. GET VISIBLE TILES (Cached for this specific keypress)
    const tiles = Array.from(document.querySelectorAll(".grid-tile")).filter(t => {
        return window.getComputedStyle(t).display !== 'none';
    });

    if (tiles.length === 0) return;

    // 5. GRID CALCULATIONS
    const grid = document.getElementById("explorerGrid");
    const firstTile = grid.querySelector(".grid-tile");
    let cols = 1;
    if (document.querySelector(".mode-grid") && firstTile) {
        const tileWidth = firstTile.offsetWidth;
        const gridWidth = grid.clientWidth;
        cols = Math.floor((gridWidth + 10) / (tileWidth + 10)) || 1;
    }

    // 6. KEY HANDLING
    const navKeys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Enter", "Backspace"];
    if (navKeys.includes(e.key)) {
        e.preventDefault();

        // ArrowDown from search bar jumps to first tile
        if (document.activeElement.id === "tileSearch" && e.key === "ArrowDown") {
            document.activeElement.blur();
            focusedIndex = 0;
        } else {
            if (e.key === "ArrowRight") focusedIndex = Math.min(focusedIndex + 1, tiles.length - 1);
            else if (e.key === "ArrowLeft") focusedIndex = Math.max(focusedIndex - 1, 0);
            else if (e.key === "ArrowUp") focusedIndex = Math.max(focusedIndex - cols, 0);
            else if (e.key === "ArrowDown") focusedIndex = Math.min(focusedIndex + cols, tiles.length - 1);
            
            if (focusedIndex === -1) focusedIndex = 0;
        }

        const target = tiles[focusedIndex];
        if (!target) return;

        // Visual Update
        document.querySelectorAll(".is-focused").forEach(el => el.classList.remove("is-focused"));
        target.classList.add("is-focused");
        target.scrollIntoView({ block: "nearest", behavior: "auto" }); // "auto" is faster than "smooth"

        // SPEEDY ENTER LOGIC
        if (e.key === "Enter") {
            // Trigger the click immediately
            target.click();
            
            // Clean up state in the background so it doesn't block the UI thread
            setTimeout(() => {
                focusedIndex = -1;
                target.classList.remove("is-focused");
            }, 0);
            return;
        }
        
        // BACKSPACE: Go Up
        if (e.key === "Backspace") {
            const upBtn = document.querySelector(".folderup-tile");
            if (upBtn) {
                focusedIndex = -1;
                upBtn.click();
            }
        }
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
    const tile = e.target.closest('.grid-tile, .tree-folder'); // Added .tree-folder selector
    if (!tile || tile.innerText.includes("..")) return; 
    
    e.preventDefault();
    
    const panel = document.querySelector(".explorer-panel");
    const isTreeView = panel.classList.contains("mode-tree");
    const isBadgeClick = e.target.closest('.hybrid-md-badge');
    
    // Determine if it's a folder
    let isFolder = tile.classList.contains('folder-tile') || 
                   tile.classList.contains('tree-folder') || 
                   tile.classList.contains('hybrid-tile');
    
    if (isBadgeClick) isFolder = false;

    // --- Path Extraction ---
    let targetPath = "";
    // Priority 1: data-path (used in Tree View summary)
    const summary = tile.querySelector('summary') || (tile.tagName === 'SUMMARY' ? tile : null);
    if (summary && summary.getAttribute('data-path')) {
        targetPath = summary.getAttribute('data-path');
    } else {
        // Priority 2: Standard attributes
        const onClickAttr = tile.getAttribute('onclick') || "";
        const multiArgMatch = onClickAttr.match(/path\s*:\s*['"]([^'"]+)['"]/);
        if (multiArgMatch) targetPath = multiArgMatch[1];
        else targetPath = tile.getAttribute('title') || "";
    }

    // FIXED: Handle both .fs/ and /.fs/ prefixes
    let internalPath = targetPath.replace(/^[\/]?\.fs\//, "").replace(/^\//, "");
    if (isFolder) internalPath = internalPath.replace(/\/$/, "");

    // --- Build Menu Content ---
    let menuContent = "";
    
    // ADDED: Open option for folders in Tree View
    if (isFolder && isTreeView) {
        menuContent += `<div class="menu-item" id="ctx-open" style="font-weight:bold;">Go To</div>`;
    }

    // NEW: Preview option for files
    if (!isFolder || isBadgeClick) {
        menuContent += `<div class="menu-item" id="ctx-preview">Pop-Out</div>`;
    }

    menuContent += `<div class="menu-item" id="ctx-rename">Rename</div>`;
    if (!isFolder || isBadgeClick) {
        menuContent += `<div class="menu-item delete" id="ctx-delete">Delete</div>`;
    }
    menu.innerHTML = menuContent;

    // --- Position Menu ---
    menu.style.display = 'block';
    let posX = e.clientX;
    let posY = e.clientY;
    if (posX + menu.offsetWidth > window.innerWidth) posX -= menu.offsetWidth;
    if (posY + menu.offsetHeight > window.innerHeight) posY -= menu.offsetHeight;
    menu.style.left = posX + 'px';
    menu.style.top = posY + 'px';

    // --- Action Handlers ---
    
    // Handle the Open command
    if (document.getElementById('ctx-open')) {
        document.getElementById('ctx-open').onclick = async () => {
            menu.style.display = 'none';
            let openPath = internalPath;
            if (openPath !== "" && !openPath.endsWith("/")) openPath += "/";
            await syscall('editor.invokeCommand', 'DocumentExplorer: Open Folder', { path: openPath });
        };
    }

    // Handle the Preview command
    if (document.getElementById('ctx-preview')) {
        document.getElementById('ctx-preview').onclick = async () => {
            menu.style.display = 'none';
            const fileName = internalPath.split('/').pop();
            const luaCmd = `js.import("/.fs/Library/Mr-xRed/UnifiedFloating.js").show("${internalPath}", "${fileName}")`;
            await syscall('lua.evalExpression', luaCmd);
        };
    }

    document.getElementById('ctx-rename').onclick = async () => {
        menu.style.display = 'none';
        let renamePath = internalPath;
        if (!isFolder && !internalPath.match(/\.[^.]+$/)) renamePath += ".md";
        await syscall("system.invokeFunction", "index.renamePrefixCommand", { oldPrefix: renamePath });
        await syscall('lua.evalExpression', 'refreshExplorer()');
    };

    if (document.getElementById('ctx-delete')) {
        document.getElementById('ctx-delete').onclick = async () => {
            menu.style.display = 'none';
            await syscall("lua.evalExpression", `deleteFileWithConfirm("${internalPath}")`);
        };
    }
};


// --- Mobile Long Press Logic ---
let touchTimer;
let touchStartPos = { x: 0, y: 0 };
const LONG_PRESS_DURATION = 600; // 1 second
const MOVE_THRESHOLD = 30; // Pixels to allow before canceling

window.addEventListener('touchstart', function(e) {
    const tile = e.target.closest('.grid-tile, .tree-folder');
    if (!tile || tile.innerText.includes("..")) return;

    // Store starting position
    touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    // Start the timer
    touchTimer = setTimeout(() => {
        // Create a fake contextmenu event to reuse your existing logic
        const fakeEvent = new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: touchStartPos.x,
            clientY: touchStartPos.y,
            button: 2
        });
        
        // Vibrate for feedback (optional, works on Android)
        if (navigator.vibrate) navigator.vibrate(50);
        
        tile.dispatchEvent(fakeEvent);
    }, LONG_PRESS_DURATION);
}, { passive: true });

window.addEventListener('touchmove', function(e) {
    if (!touchTimer) return;

    // Calculate how far the finger moved
    const moveX = Math.abs(e.touches[0].clientX - touchStartPos.x);
    const moveY = Math.abs(e.touches[0].clientY - touchStartPos.y);

    // If moved more than threshold, cancel the long-press (user is dragging/scrolling)
    if (moveX > MOVE_THRESHOLD || moveY > MOVE_THRESHOLD) {
        clearTimeout(touchTimer);
        touchTimer = null;
    }
}, { passive: true });

window.addEventListener('touchend', function() {
    clearTimeout(touchTimer);
    touchTimer = null;
});

window.addEventListener('touchcancel', function() {
    clearTimeout(touchTimer);
    touchTimer = null;
});
  


  

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

// ---------------- Persistence & Highlighting ----------------


function saveTreeState() {
  const openFolders = Array.from(document.querySelectorAll('.tree-folder[open]'))
    .map(details => details.querySelector('summary').getAttribute('data-path')); 
  localStorage.setItem('explorer_open_folders', JSON.stringify(openFolders));
}

function initTreePersistence() {
  const grid = document.getElementById("explorerGrid");
  if (grid) {
    grid.addEventListener('toggle', (e) => {
      if (e.target.tagName === 'DETAILS') saveTreeState();
    }, true);
  }
}

// ---------------- Highlighting Logic ----------------

// We keep this focused ONLY on restoring folder expansion
function restoreTreeState() {
  const saved = localStorage.getItem('explorer_open_folders');
  const openFolders = saved ? JSON.parse(saved) : [];
  
  document.querySelectorAll('.tree-folder').forEach(folder => {
    const path = folder.querySelector('summary').getAttribute('data-path');
    if (openFolders.includes(path)) {
      folder.setAttribute('open', 'true');
    }
  });
}

// This function handles the "Live" highlighting and scrolling
let lastKnownPage = ""; 

async function refreshActiveHighlight() {
  const activePage = await syscall('editor.getCurrentPage');
  if (!activePage || activePage === lastKnownPage) return; // Exit immediately if no change

  lastKnownPage = activePage; // Update the tracker
  console.log("Page changed to:", activePage); // Debugging

  const normActive = activePage.toLowerCase().replace(/^\//, "").replace(/\.md$/, "").replace(/\/$/, "");
  const tiles = document.querySelectorAll('.grid-tile');

  // Remove old highlights first
  document.querySelectorAll('.is-active-page').forEach(el => el.classList.remove('is-active-page'));

  tiles.forEach(tile => {
    // Try to derive a full path for the tile (prefer full paths over plain titles)
    let tileFullPath = (tile.getAttribute('title') || "").toLowerCase();

    // 1) Look for an element with data-path (summary in tree view or explicit attribute)
    const dpElement = tile.querySelector('[data-path]') || tile.closest('[data-path]');
    if (dpElement) {
      const dp = dpElement.getAttribute('data-path');
      if (dp) tileFullPath = dp.toLowerCase();
    }

    // 2) If still empty or ambiguous, try to extract path from onclick (used for folder tiles)
    if (!tileFullPath || tileFullPath === "") {
      const onclickAttr = tile.getAttribute('onclick') || (tile.querySelector && tile.querySelector('[onclick]') && tile.querySelector('[onclick]').getAttribute('onclick')) || "";
      const m = onclickAttr.match(/path\s*:\s*['"]([^'"]+)['"]/);
      if (m && m[1]) tileFullPath = m[1].toLowerCase();
    }

    // 3) If the tileFullPath looks like a simple name (no slash), try to resolve it relative to the current explorer path
    // This helps grid folder tiles which use title-only names
    if (tileFullPath && tileFullPath.indexOf("/") === -1) {
      const grid = document.getElementById("explorerGrid");
      const currentPath = grid ? (grid.getAttribute("data-current-path") || "") : "";
      const candidate = (currentPath + tileFullPath).replace(/^\/+/, "").replace(/\/$/, "");
      // Only adopt candidate if it makes sense relative to the active page (prevents accidental cross-folder matches)
      if (normActive === tileFullPath || normActive.endsWith("/" + tileFullPath) || normActive === candidate) {
        tileFullPath = candidate;
      }
    }

    // Normalize tile path for comparison
    const normTile = (tileFullPath || "").toLowerCase().replace(/^\//, "").replace(/\.md$/, "").replace(/\/$/, "");

    if (normTile === normActive && normActive !== "") {
      tile.classList.add('is-active-page');

      // Ensure any containing details/folders open in tree view
      let parent = tile.closest('details');
      while (parent) {
        parent.setAttribute('open', 'true');
        parent = parent.parentElement.closest('details');
      }

      tile.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}


// ---------------- Dynamic Update Logic ----------------

let lastUpdateToken = "";

async function watchdog() {
    // This syscall is extremely fast
    const currentToken = await syscall("clientStore.get", "explorer.lastUpdate");
    
    // GATEKEEPER: If the token hasn't changed, do nothing.
    if (!currentToken || currentToken === lastUpdateToken) return;
    
    lastUpdateToken = currentToken;
    console.log("Explorer update triggered by Lua event...");
    
    // Now perform the heavier work of identifying and highlighting
    await refreshActiveHighlight();
}

// ---------------- Execution ----------------
setTimeout(() => {
    restoreTreeState(); 
    initTreePersistence();
    refreshActiveHighlight(); 
}, 50);

// Clear any existing watchdog to prevent memory leaks on panel redraw
if (window.highlightWatchdog) clearInterval(window.highlightWatchdog);
// 500ms is responsive enough for humans but very light on the CPU
window.highlightWatchdog = setInterval(watchdog, 1000);
  
// ---------------- Filter Logic with Debounce ----------------
let cachedTiles = [];

function initializeTiles() { 
    // Target all possible containers across Grid, List, and Tree
    cachedTiles = Array.from(document.querySelectorAll(".grid-tile, .tree-folder, .tree-file, .hybrid-tile")); 
}

window.filterTiles = function() {
    const input = document.getElementById("tileSearch");
    if (!input) return;
    
    const query = input.value.toLowerCase().trim();
    const clearBtn = document.getElementById("clearSearch");
    if (clearBtn) clearBtn.style.display = query.length > 0 ? "flex" : "none";

    clearTimeout(window.filterDebounceTimer);
    window.filterDebounceTimer = setTimeout(() => {
        initializeTiles();
        const terms = query.split(/\s+/);
        const panel = document.querySelector(".explorer-panel");
        const isTreeView = panel.classList.contains("mode-tree");
        const isListView = panel.classList.contains("mode-list");

        // Step 1: Force hide everything 
        // We use !important in JS to ensure we override any rogue List View CSS
        cachedTiles.forEach(item => {
            if (!item.classList.contains("folderup-tile")) {
                item.style.setProperty('display', 'none', 'important');
            } else {
                item.style.display = ""; 
            }
        });

        // If empty query, restore original visibility
        if (query === "") {
            cachedTiles.forEach(item => item.style.display = "");
            if (isTreeView) restoreTreeState();
            return;
        }

        // Step 2: Match and Reveal Logic
        cachedTiles.forEach(item => {
            let target = item;
            
            // Map the search target based on structure
            if (item.classList.contains("tree-folder")) target = item.querySelector("summary");
            if (item.classList.contains("tree-file")) target = item.querySelector(".grid-tile");

            if (!target) return;

            // Gather metadata for search
            const title = (target.getAttribute("title") || "").toLowerCase();
            let ext = (target.getAttribute("data-ext") || "").toLowerCase();
            
            // HYBRID FIX: Explicitly check for hybrid markers in all views
            const isHybrid = target.classList.contains("hybrid-tile") || 
                             item.classList.contains("hybrid-tile") ||
                             target.querySelector(".hybrid-tile"); // Deep check for list rows

            if (isHybrid) {
                ext += " md folder hybrid";
            }

            const isMatch = terms.every(term => title.includes(term) || ext.includes(term));

            if (isMatch) {
                // Reveal the item
                // Using "" lets the CSS decide if it should be flex (grid) or block (list)
                item.style.display = ""; 
                
                // For Tree View: handle the nested parent reveal
                if (isTreeView) {
                    let parent = item.parentElement.closest('.tree-folder');
                    while (parent) {
                        parent.style.display = ""; 
                        parent.open = true;
                        parent = parent.parentElement.closest('.tree-folder');
                    }
                }
            }
        });

        focusedIndex = -1;
    }, 300); 
};

window.clearFilter = function(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    const input = document.getElementById("tileSearch");
    if (input) {
        input.value = "";
        filterTiles();
        input.focus();
    }
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
    clientStore.set("explorer.panelWidth", math.max(cur - 0.05, 0.5))
    drawPanel()
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
-- -------------------------------
command.define {
  name = "Navigate: Document Explorer Window",
  hide = true,
  run = function()
      if not PANEL_VISIBLE then
        if not cachedFiles then cachedFiles = space.listFiles() end
        drawPanel()
      end
      js.import("/.fs/Library/Mr-xRed/UnifiedFloating.js").enableDrag()
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
      if not cachedFiles then
        cachedFiles = space.listFiles() 
      end
      drawPanel()
    end
  end
}

command.define {
  name = "DocumentExplorer: Toggle Window Mode",
  hide = true,
  run = function()
    local currentMode = clientStore.get("explorer.currentDisplayMode") or "panel"    
    
    editor.hidePanel(PANEL_ID)
    PANEL_VISIBLE = false
   -- Switch mode
    if currentMode == "window" then
      clientStore.set("explorer.currentDisplayMode", "panel")
      drawPanel()
    else
      clientStore.set("explorer.currentDisplayMode", "window")
      drawPanel()
      js.import("/.fs/Library/Mr-xRed/UnifiedFloating.js").enableDrag()
    end
  end
}

command.define {
  name = "Navigate: Toggle Document Explorer",
  key = "Ctrl-Alt-e",
  run = function()
    if PANEL_VISIBLE then
        editor.hidePanel(PANEL_ID)
        PANEL_VISIBLE = false
    else
        -- INITIAL OPEN LOGIC:
        -- Only jump to current directory when user manually hits the shortcut to OPEN
        if goToCurrentDir then
            local current = editor.getCurrentPath() or ""
            clientStore.set(PATH_KEY, current:match("^(.*)/") or "")
        end

        local lastMode = clientStore.get("explorer.currentDisplayMode") or "panel"
        if lastMode == "window" then
            editor.invokeCommand("Navigate: Document Explorer Window")
        else
            editor.invokeCommand("Navigate: Document Explorer")
        end
    end
  end
}
```

## Discussions to this library
* [SilverBullet Community](https://community.silverbullet.md/t/document-explorer-image-gallery-for-silverbullet/3647?u=mr.red)