---
name: "Library/Mr-xRed/DocumentExplorer"
tags: meta/library
files:
- AdvancedPanelControl.md
- UnifiedAdvancedPanelControl.js
- docex_styles.css
- lucide-icons.svg
- hybrid-cursor.svg
pageDecoration.prefix: "🗂️ "
---

# 🗂️ Document Explorer (Ver. 1.2.0)

![DocumentExplorer_Screenshot](https://raw.githubusercontent.com/Mr-xRed/silverbullet-libraries/refs/heads/main/screenshots/DocumentExplorer_Screenshot.png)

## Features
• Dynamic View Modes:
  * ==Grid== Large thumbnails (with image previews) for a visual gallery experience.
  * ==List==: Compact, vertical view for high-density file management.
  * ==Tree==: Hierarchical navigation with folder nesting and expansion logic.
* Easily switch between ==Window== or ==SidePanel== 
• Real-Time ==Filtering== by filename or extension
• ==Drag&Drop==: Seamlessly drag files from the explorer directly into your pages to insert links or image embeds.
• Context Menu: ==Right-click== for quick File/Folder renaming and deletion.
• ==Batch Selection==: Hold `Ctrl` (or `Cmd` on Mac) and click to select multiple files, then right-click for batch Rename or Delete.
• ==Responsive design==: Adjustable panel width using your mouse.
- With instructions for a Color Theme

## ⚠️ Know Limitations and Warnings
- The Built-In Rename function in Silverbullet has couple of limitation affecting the Backlinks, when renaming multiple files at once:
    - ❗️⚠️ You need to confirm the files one by one when `Cut & Pasting` or when batch `Rename` multiple files, because DocumentExplorer uses the built-in `Rename` function from Silverbullet, which will also update the backlinks inside the pages. 
    - ❗️⚠️ When renaming a folder with multiple files in it, the Backlinks are not correctly updated
    - recommandation: instead of Renaming the folder, use batch-cut/paste on the files

  
## Currently supported extension:
* Pages: .md
* Images: .png, .jpg, .jpeg, .webp, .gif, .svg
* Documents: .pdf, .excalidraw, .drawio (if Plugs installed)
* Every other extension is rendered as `❔` and opened as raw file if browser supports it


> **tip** ShortCut Key
> `Ctrl-Alt-e` - Toggle Document Explorer

## Configuration Options and Defaults:
* **`position`**           - Where the panel is docked ("lhs"|"rhs" - left/right hand side) (default: lhs)
* **`homeDirName`**        - Name how your Home Directory appears in the Breadcrumbs (default: "🏠 Home")
* **`goToCurrentDir`**     - Start navigation in the Directory of the currently opened page (default: true)
* **`tileSize`**           - Grid Tile size, recommended between 60px-120px (default: "80px") 
* **`listHeight`**         - List & Tree Row height, recommended between 18px-36px (default: "24px") 
* **`enableContextMenu`**  - Enable/Disable the Right-Click for Files & Folders: Rename & Delete (default: true)
* **`negativeFilter`**     - Negative Filter to hide certain elements in Explorer (by path, extensions or wildcard) (default: none )
* **`treeFolderFirst`**    - sort order in treeview: folders then files (default: false)
* **`recoverAfterRefresh`** - Recover after Page refresh - Reopen DocEx when you Refresh the page (default: true) 


> **note** Note
> Copy this into a `space-lua` block in your config page to change the default values.
>
> Note: if your Silverbullet instance is served behind a URL prefix (see [`SB_URL_PREFIX`](https://silverbullet.md/Install/Configuration)), this is detected automatically via `system.getURLPrefix()` — no configuration needed.


```lua
config.set("explorer", {
  position = "lhs",
  homeDirName = "🏠 Home",
  goToCurrentDir = true,
  tileSize = "80px",
  enableContextMenu = true,
  listHeight = "24px",
  negativeFilter = {"Library/Std","*.js", "*test*"},
  treeFolderFirst = false,
  recoverAfterRefresh = true
})
```

### Styling: Icons

```
Icons from Lucide (https://lucide.dev)
Copyright (c) Lucide Contributors 2025
Portions Copyright (c) 2013–2023 Cole Bemis (Feather)
Licensed under the ISC and MIT licenses.
```

## Space-Style Color Theming Example

> **tip** Tip
> Make sure you copy this as space-style so it won't get overwritten with future updates!


```
html[data-theme="dark"]{
  /*Main UI Color*/
  --explorer-bg-color: var(--top-background-color);
  --explorer-text-color:  var(--root-color,white);
  --explorer-accent-color: var(--ui-accent-color,  oklch(55% 0.15 250));
  --explorer-accent-text: var(--ui-accent-contrast-color);
  --breadcrumb-color: var(--editor-wiki-link-page-color);
  --explorer-border-color: oklch(from var(--modal-border-color) 0.65 c h / 0.5);
  --explorer-hover-bg: oklch(0.65 0 0 / 0.5);
  --explorer-tile-bg:  oklch(0.75 0 0 / 0.1);
  /*Folder and File Color*/
  --folder-color: oklch(0.85 0.1 105);
  --file-md-color:  hsl(213, 100%, 83%);
  --file-pdf-color: oklch(0.85 0.1 30); 
  --file-img-color: oklch(0.85 0.1 180); 
  --file-ex-color:  oklch(0.85 0.1 300); 
  --file-dio-color: oklch(0.85 0.1 90); 
  --file-unk-color: oklch(0.85 0 0);
}

html[data-theme="light"]{
  /*Main UI Color*/
  --explorer-bg-color: var(--top-background-color);
  --explorer-text-color: var(--root-color, black);
  --explorer-accent-color: var(--ui-accent-color,oklch(55% 0.15 250));
  --explorer-accent-text: var(--ui-accent-contrast-color);
  --breadcrumb-color: var(--editor-wiki-link-page-color);
  --explorer-border-color: oklch(from var(--modal-border-color) 0.50 c h / 0.5);
  --explorer-hover-bg: oklch(0.75 0 0 / 0.5);
  --explorer-tile-bg:  oklch(0.75 0 0 / 0.1);
  /*Folder and File Color*/
  --folder-color: oklch(0.65 0.15 105);
  --file-md-color:  oklch(0.65 0.15 260);
  --file-pdf-color: oklch(0.65 0.15 30); 
  --file-img-color: oklch(0.65 0.15 180); 
  --file-ex-color:  oklch(0.65 0.15 300); 
  --file-dio-color: oklch(0.65 0.15 90); 
  --file-unk-color: oklch(0.65 0 0);
}
```

## For the Window
```space-style
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
    position = schema.string(),
    homeDirName = schema.string(),
    tileSize = schema.string(),
    listHeight = schema.string(),
    panelWidth = schema.number(),
    treeFolderFirst = schema.boolean(),
    goToCurrentDir = schema.boolean(),
    enableContextMenu = schema.boolean(),
    negativeFilter = { type = "array", items = { type = "string" } },
    recoverAfterRefresh = schema.boolean()
  }
})

-- ------------- URL Prefix (for SB_URL_PREFIX installs) -------------
-- Auto-detected from system.getURLPrefix() (see
-- https://silverbullet.md/Install/Configuration).
local urlPrefix = system.getURLPrefix()

local ICONS = {
grid  = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-grid"></use></svg>',
list  = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-list"></use></svg>',
tree  = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-tree"></use></svg>',
folder = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-folder"></use></svg>',
folderUp = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-folderOpened"></use></svg>',
folderCollapse = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-folderCollapse"></use></svg>',
folderExpand = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-folderExpand"></use></svg>',
refresh = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-refresh"></use></svg>',
fileMD = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-fileMD"></use></svg>',
filePDF = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-filePDF"></use></svg>',
fileEX = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-fileEX"></use></svg>',
fileDIO = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-fileDIO"></use></svg>',
file = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-file"></use></svg>',
fileIMG = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-fileIMG"></use></svg>',
home = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-home"></use></svg>',
close = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-close"></use></svg>',
filterOff = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-filterOff"></use></svg>',
filterOn = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-filterOn"></use></svg>',
window = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-window"></use></svg>',
newPage = '<svg class="icon-svg"><use href="' .. urlPrefix .. '.fs/Library/Mr-xRed/lucide-icons.svg#icon-newPage"></use></svg>',

}

-- ------------- Load Config -------------
local cfg = config.get("explorer") or {}
local PANEL_ID = cfg.position or "lhs"
local tileSize = cfg.tileSize or "80px"
local listHeight = cfg.listHeight or "25.2px"
local homeDirName = cfg.homeDirName or "🏠 Home"
local goToCurrentDir = cfg.goToCurrentDir ~= false
local enableContextMenu = cfg.enableContextMenu ~= false
local negativeFilter = cfg.negativeFilter or {}
local treeFolderFirst = cfg.treeFolderFirst == true 
local recoverAfterRefresh = cfg.recoverAfterRefresh ~= false


local PANEL_VISIBLE = false
local cachedFiles = nil
local PATH_KEY = "gridExplorer.cwd"
local VIEW_MODE_KEY = "gridExplorer.viewMode"

-- ---------- Restore panel visibility on page load ----------
local function restoreExplorerOpenStateOnPageLoad()
  if not recoverAfterRefresh then return end
  
  if clientStore.get("explorer.suppressOnce") == "true" then
    clientStore.set("explorer.suppressOnce", "false")
    return 
  end
  
  local shouldOpen = clientStore.get("explorer.open")
  
  if shouldOpen == "true" and not PANEL_VISIBLE then
    local lastMode = clientStore.get("explorer.currentDisplayMode") or "panel"
    local selector = "#sb-main .sb-panel." .. PANEL_ID
    if lastMode == "window" then
      if not cachedFiles then cachedFiles = space.listFiles() end
      drawPanel()
      js.import(urlPrefix .. ".fs/Library/Mr-xRed/UnifiedAdvancedPanelControl.js").enableWindow(selector)
    else
      if not cachedFiles then cachedFiles = space.listFiles() end
      drawPanel()
    end
  end
end
-- ---------- Helper to check negative filters ----------
local function isFiltered(path)
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
      onClickAction = "window.open('" .. urlPrefix .. target .. "', '_blank')"
  else
      onClickAction = "explorerOpenPage('" .. target .. "', event)"
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
          finalIcon = "<img src='" .. urlPrefix .. ".fs" .. target .. "' loading='lazy' class='tile-thumb' />"
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

-- ---------- Event Listeners ----------
-- Add restoreExplorerOpenStateOnPageLoad to the pageLoaded event
event.listen { name = "editor:pageLoaded", run = function()
    triggerHighlightUpdate()
    restoreExplorerOpenStateOnPageLoad() 
end }
event.listen { name = "editor:documentLoaded", run = triggerHighlightUpdate }

-- ---------- Panel Width Persistence ----------
event.listen {
  name = "sb-save-" .. PANEL_ID,
  run = function(detail)
    if detail and detail.value then
      clientStore.set("explorer.panelWidth", detail.value)
    end
  end
}

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
            -- REMOVED: k:sub(1,1) ~= "_" check to allow underscores
            if k ~= "_path" then table.insert(sorted, k) end 
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
                table.insert(buffer, "<div class='hybrid-md-badge' onclick=\"event.stopPropagation(); event.preventDefault(); explorerOpenPage('" .. pagePath .. "', event)\">MD</div>")
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
        -- REMOVED: k:sub(1,1) ~= "_" check to allow underscores
        if k ~= "_path" then table.insert(rootKeys, k) end 
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


function createNewPage()
    local currentPath = clientStore.get(PATH_KEY) or ""
    local fullPathFromPrompt = editor.prompt("Enter page name with full path:", currentPath)

    if fullPathFromPrompt and fullPathFromPrompt:gsub("/$","") ~= currentPath:gsub("/$","") then
        local pageName = fullPathFromPrompt:gsub("%.md$", "")

        if space.pageExists(pageName) then
            editor.flashNotification("Page '" .. pageName .. ".md' already exists.", "error")
            return
        end
        space.writePage(pageName, "")
        editor.navigate("/" .. pageName)
        refreshExplorer()
        editor.flashNotification("Created page: " .. pageName .. ".md")
    end
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

-- ---------- Batch Delete (reads paths from clientStore to avoid JS escaping issues) ----------
-- Paths are stored as newline-separated string to avoid needing json.decode
function batchDeleteFiles()
  local pathsStr = clientStore.get("explorer.batchSelectedPaths")
  if not pathsStr or pathsStr == "" then return end
  local count = 0
  for path in pathsStr:gmatch("[^\n]+") do
    local fileToDelete = path
    if not path:match("%.[^.]+$") then
        fileToDelete = path .. ".md"
    end
    space.deleteFile(fileToDelete)
    count = count + 1
  end
  clientStore.set("explorer.batchSelectedPaths", "")
  refreshExplorer()
  editor.flashNotification("Deleted " .. count .. " item(s).")
end

-- ---------- Clipboard Copy (read+write files into current folder) ----------
-- Cut/Move is handled from JS via renamePrefixCommand so wikilinks get updated.
function clipboardPaste()
  local pathsStr = clientStore.get("explorer.clipboard.paths")
  local destFolder = clientStore.get(PATH_KEY) or ""
  if destFolder ~= "" and not destFolder:match("/$") then
    destFolder = destFolder .. "/"
  end

  if not pathsStr or pathsStr == "" then
    editor.flashNotification("Clipboard is empty.", "error")
    return
  end

  local copied = 0
  local skipped = 0

  for srcPath in pathsStr:gmatch("[^\n]+") do
    -- Get just the filename (last path component)
    local fileName = srcPath:match("([^/]+)$") or srcPath

    -- Build actual source file path (add .md if no extension)
    local srcFile = srcPath
    if not srcPath:match("%.[^.]+$") then
      srcFile = srcPath .. ".md"
    end

    -- Build destination file path (preserve extension)
    local destFile = destFolder .. fileName
    if not destFile:match("%.[^.]+$") then
      destFile = destFile .. ".md"
    end

    -- Skip if destination already exists
    if space.fileExists(destFile) then
      skipped = skipped + 1
    else
      local data = space.readFile(srcFile)
      space.writeFile(destFile, data)
      copied = copied + 1
    end
  end

  refreshExplorer()

  local msg = "Copied " .. copied .. " item(s)."
  if skipped > 0 then
    msg = msg .. " Skipped " .. skipped .. " (already exist in destination)."
  end
  editor.flashNotification(msg)
end

-- ---------- Destination existence check (called from JS before each move) ----------
-- Returns "true" or "false" as a string so the JS syscall result is unambiguous.
function explorerDestExists(path)
  if space.fileExists(path) then return "true" end
  -- Also check with .md extension for pages stored without it
  if not path:match("%.[^.]+$") and space.fileExists(path .. ".md") then return "true" end
  return "false"
end

-- ---------- drawPanel function ----------
    local function drawPanel()
      local currentWidth = clientStore.get("explorer.panelWidth") or config.get("explorer.panelWidth") or 0.8
      local viewMode = clientStore.get(VIEW_MODE_KEY) or config.get("explorer.viewMode") or "grid"
      
      -- Logic Toggle check
      local filterEnabled = clientStore.get("explorer.disableFilter") ~= "true"
      local autoLoadEnabled = clientStore.get("explorer.autoLoad") == "true"
    
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
    
--      table.insert(h, [[<div class="explorer-panel ]] .. PANEL_ID .. [[ mode-]])
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
      local autoLoadActiveClass = autoLoadEnabled and " active" or ""
      table.insert(h, [[</div>
                        <div title="Auto-Load Images/PDFs on Arrow Navigation" 
                              class="explorer-action-btn]] .. autoLoadActiveClass .. [[" id="autoload-btn" 
                              onclick="syscall('editor.invokeCommand','DocumentExplorer: ToggleAutoLoad')">]])
      table.insert(h, ICONS.fileIMG)
      table.insert(h, [[</div>
                        <div title="New Page" 
                              class="explorer-action-btn" 
                              onclick="syscall('lua.evalExpression', 'createNewPage()')">]])
      table.insert(h, ICONS.newPage)
      table.insert(h, [[</div>
                 </div>  
                  <div class="action-buttons" style="display: flex; gap: 4px;">
<!--              <div class="explorer-action-btn" title="Switch to Window/Sidepanel" onclick="syscall('editor.invokeCommand', 'DocumentExplorer: Toggle Window Mode')">]])
      table.insert(h, ICONS.window)
      table.insert(h, [[</div> -->
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
                  table.insert(h, "<div class='" .. hClass .. "' title='" .. f .. "' onclick=\"syscall('editor.invokeCommand','DocumentExplorer: Open Folder',{path:'"..folderPath.."'} )\">")
                  table.insert(h, "<div class='hybrid-folder-zone'>")
                  table.insert(h, "<div class='icon'>"..ICONS.folder.."</div><div class='grid-title'>"..f.."</div></div>")
                  table.insert(h, "<div class='hybrid-md-badge' onclick=\"event.stopPropagation(); explorerOpenPage('" .. pagePath .. "', event)\">MD</div>")
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
              table.insert(h, fileTile(ICONS.file, f, ".fs/"..folderPrefix..f, extension, viewMode)) 
          end
      end
    
      table.insert(h, "</div></div>")

local script = [[
(function() {
    const style = document.createElement('style');
    style.id = 'doc-ex-hiding-style';
    style.innerHTML = `.doc-ex-hiding { visibility: hidden !important; }`;
    if (!parent.document.getElementById(style.id)) {
        parent.document.head.appendChild(style);
    }

// ---------------- Keyboard Navigation ----------------
let focusedIndex = -1;

// Auto-Load: when enabled, arrow-key navigation opens the focused tile
// automatically (after a short debounce) without needing to press Enter.
// Restricted to images and PDFs only - folders, .md pages, excalidraw,
// drawio, and "unknown" file types are never auto-loaded.
const autoLoadEnabled = ]] .. tostring(autoLoadEnabled) .. [[;
const AUTO_LOAD_ALLOWED_CLASSES = ["image-tile", "pdf-tile"];
let autoLoadTimer = null;

function scheduleAutoLoad(target) {
    if (autoLoadTimer) clearTimeout(autoLoadTimer);
    if (!target) return;
    if (!AUTO_LOAD_ALLOWED_CLASSES.some(c => target.classList.contains(c))) return;

    autoLoadTimer = setTimeout(() => {
        autoLoadTimer = null;
        // Guard against the tile having been removed/replaced (e.g. panel redrawn)
        // or focus having moved on to a different tile since this was scheduled.
        if (target.isConnected && target.classList.contains("is-focused")) {
            target.click();
        }
    }, 200);
}

// Shared tile-visibility check: a tile only counts as navigable if it isn't
// hidden by the search filter, and none of its ancestor <details> (tree
// folders) are currently collapsed. We check the <details> "open" attribute
// directly rather than a generic style-visibility API, since that's the
// actual mechanism this codebase uses to collapse folders, and it's reliable
// no matter how the stylesheet visually implements the collapse.
//
// IMPORTANT: a folder's own <summary> tile must stay navigable even while
// that folder is collapsed (that's the row you actually see/select to expand
// it) - only its *contents* become hidden. So a closed <details> only counts
// against a tile if the tile isn't that details' own direct <summary> child.
function isTileNavigable(t) {
    if (window.getComputedStyle(t).display === 'none') return false;
    let child = t;
    let el = t.parentElement;
    while (el) {
        if (el.tagName === 'DETAILS' && !el.hasAttribute('open')) {
            const isOwnSummary = child.tagName === 'SUMMARY' && child.parentElement === el;
            if (!isOwnSummary) return false;
        }
        child = el;
        el = el.parentElement;
    }
    return true;
}

// Walks up from a tile to find its "own" tree-folder <details> element.
// For a folder's <summary> tile, that's the <details> it's a direct child
// of (its own wrapper). For a file tile, that's its immediate containing
// folder. Implemented as a plain manual walk (rather than .closest() with a
// compound selector) to avoid any doubt about selector support/behavior.
function treeOwnDetails(tile) {
    let el = tile.parentElement;
    while (el) {
        if (el.tagName === 'DETAILS' && el.classList.contains('tree-folder')) return el;
        el = el.parentElement;
    }
    return null;
}

// Given a <details class="tree-folder">, returns its <summary> tile (its
// direct child), or null. Manual child-scan instead of a :scope selector.
function treeSummaryOf(detailsEl) {
    if (!detailsEl) return null;
    for (const child of detailsEl.children) {
        if (child.tagName === 'SUMMARY') return child;
    }
    return null;
}

// Manually scrolls the tile into view within its actual scroll container.
// We don't rely on native element.scrollIntoView() here, since its
// "nearest scrollable ancestor" auto-detection can behave unreliably
// depending on how overflow is set up in this panel's CSS/iframe. #explorerGrid
// is checked first since that's this panel's file-list container; if that
// somehow isn't the actual scroll box, we search upward for one dynamically,
// and fall back to the native method only as a last resort.
function scrollTileIntoView(tile) {
    if (!tile) return;
    let container = document.getElementById("explorerGrid");
    if (!container || container.scrollHeight <= container.clientHeight) {
        container = null;
        let node = tile.parentElement;
        while (node) {
            const cs = window.getComputedStyle(node);
            if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
                container = node;
                break;
            }
            node = node.parentElement;
        }
    }
    if (!container) {
        tile.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
        return;
    }
    const cRect = container.getBoundingClientRect();
    const tRect = tile.getBoundingClientRect();
    if (tRect.top < cRect.top) container.scrollTop -= (cRect.top - tRect.top);
    else if (tRect.bottom > cRect.bottom) container.scrollTop += (tRect.bottom - cRect.bottom);
    if (tRect.left < cRect.left) container.scrollLeft -= (cRect.left - tRect.left);
    else if (tRect.right > cRect.right) container.scrollLeft += (tRect.right - cRect.right);
}

// Guard against accumulating a new listener every time the panel redraws
// (e.g. opening/exiting a folder calls drawPanel(), which re-runs this whole
// script). Without this, listeners stack up and every keypress fires all of
// them at once, each moving focus independently - producing exactly the
// "jumps to a random tile, worse each time" symptom.
if (window.explorerKeydownHandler) {
    window.removeEventListener('keydown', window.explorerKeydownHandler);
}
window.explorerKeydownHandler = function(e) {
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
        // Also clear batch selection on Escape
        if (selectedPaths.size > 0) {
            clearSelection();
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
    const tiles = Array.from(document.querySelectorAll(".grid-tile")).filter(isTileNavigable);

    if (tiles.length === 0) return;

    // 5. GRID CALCULATIONS
    const grid = document.getElementById("explorerGrid");
    // Use the first *visible* tile (tiles[0]), not just the first .grid-tile
    // in DOM order - if the negative filter is hiding tiles, the literal
    // first one in the DOM can easily be a hidden (display:none) one, whose
    // offsetWidth is always 0. That silently produced a huge, bogus column
    // count, making Up/Down jump around erratically in grid view specifically.
    const firstTile = tiles[0];
    let cols = 1;
    const isTreeMode = !!document.querySelector(".mode-tree");
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
        } else if (isTreeMode && e.key === "ArrowRight" && focusedIndex !== -1 && tiles[focusedIndex]) {
            // TREE VIEW ONLY: Right expands a collapsed folder (staying on it),
            // or moves to the next visible tile for an already-open folder / a file.
            const current = tiles[focusedIndex];
            if (current.classList.contains("folder-tile")) {
                const ownDetails = treeOwnDetails(current);
                if (ownDetails && !ownDetails.hasAttribute("open")) {
                    ownDetails.setAttribute("open", "true");
                } else {
                    focusedIndex = Math.min(focusedIndex + 1, tiles.length - 1);
                }
            } else {
                focusedIndex = Math.min(focusedIndex + 1, tiles.length - 1);
            }
        } else if (isTreeMode && e.key === "ArrowLeft" && focusedIndex !== -1 && tiles[focusedIndex]) {
            // TREE VIEW ONLY: Left collapses an open folder (staying on it), or
            // jumps focus up to the parent folder for a collapsed folder / a file.
            const current = tiles[focusedIndex];
            const isFolderTile = current.classList.contains("folder-tile");
            const ownDetails = treeOwnDetails(current);

            if (isFolderTile && ownDetails && ownDetails.hasAttribute("open")) {
                ownDetails.removeAttribute("open");
            } else {
                // For a folder tile, ownDetails is its own <details> wrapper, so
                // look one level further up for the parent. For a file tile,
                // ownDetails already IS its immediate containing folder.
                const parentDetails = isFolderTile
                    ? (ownDetails && ownDetails.parentElement ? treeOwnDetails(ownDetails.parentElement) : null)
                    : ownDetails;
                const parentSummary = treeSummaryOf(parentDetails);
                const parentIdx = parentSummary ? tiles.indexOf(parentSummary) : -1;
                if (parentIdx !== -1) focusedIndex = parentIdx;
            }
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
        scrollTileIntoView(target);

        // AUTO-LOAD: on pure arrow-key movement (not Enter/Backspace), schedule
        // an automatic open of the newly-focused tile after a short debounce,
        // so quickly arrowing past several files doesn't open every one of them.
        if (autoLoadEnabled && e.key !== "Enter" && e.key !== "Backspace") {
            scheduleAutoLoad(target);
        }

        // SPEEDY ENTER LOGIC
        if (e.key === "Enter") {
            // Cancel any pending auto-load so it doesn't re-fire a click later.
            if (autoLoadTimer) { clearTimeout(autoLoadTimer); autoLoadTimer = null; }
            // Trigger the click immediately
            target.click();

            // NOTE: We deliberately do NOT reset focusedIndex here.
            // Opening a file does not redraw the panel, so keeping focusedIndex
            // pointed at this tile means the next arrow press continues from
            // the file that was just opened, instead of jumping back to the top.
            return;
        }
        
        // BACKSPACE: Go Up
        if (e.key === "Backspace") {
            // Cancel any pending auto-load - we're leaving this folder entirely.
            if (autoLoadTimer) { clearTimeout(autoLoadTimer); autoLoadTimer = null; }
            const upBtn = document.querySelector(".folderup-tile");
            if (upBtn) {
                // Going up a folder triggers "DocumentExplorer: Open Folder", which calls
                // drawPanel() and rebuilds the whole panel/script - focusedIndex will be
                // freshly re-initialized to -1 by that reload, so it's safe (and correct)
                // to reset it here too, to top-start the new folder's listing.
                focusedIndex = -1;
                upBtn.click();
            }
        }
    }
};
window.addEventListener('keydown', window.explorerKeydownHandler);

// ---------------- Sync focus with mouse selection ----------------
// Whenever a tile is clicked with the mouse (selecting/opening it, or just
// selecting it via Ctrl/Cmd-click for batch mode), keep focusedIndex pointed
// at that tile so the next arrow-key press continues navigation from there
// instead of resetting to the top of the list.
if (window.explorerFocusClickHandler) {
    document.removeEventListener('click', window.explorerFocusClickHandler, true);
}
window.explorerFocusClickHandler = function(e) {
    const tile = e.target.closest('.grid-tile');
    if (!tile) return;

    if (tile.classList.contains('folderup-tile')) {
        // Going up (via ".." click, Backspace, or Enter-on-".." - they all
        // dispatch a real/synthetic click here first) - remember the folder
        // we're leaving, so once the parent folder's panel loads, the cursor
        // can land back on it instead of resetting to the top of the list.
        const grid = document.getElementById('explorerGrid');
        const leavingPath = grid ? (grid.dataset.currentPath || '').replace(/\/$/, '') : '';
        if (leavingPath) {
            syscall('clientStore.set', 'explorer.cameFromChild', leavingPath);
        }
        return;
    }

    // Recompute against the same "currently visible" tile set the keyboard
    // handler uses, so indices stay consistent between mouse and keyboard.
    const visibleTiles = Array.from(document.querySelectorAll(".grid-tile")).filter(isTileNavigable);
    const idx = visibleTiles.indexOf(tile);
    if (idx === -1) return;

    if (autoLoadTimer) { clearTimeout(autoLoadTimer); autoLoadTimer = null; }
    focusedIndex = idx;
    document.querySelectorAll(".is-focused").forEach(el => el.classList.remove("is-focused"));
    tile.classList.add("is-focused");

    // INSTANT ACTIVE-PAGE HIGHLIGHT: don't wait for the 1x/interval watchdog
    // to notice the page changed (that round-trips through editor:pageLoaded
    // -> clientStore -> polling, which is where the lag comes from). We
    // already know which openable tile was just clicked, so highlight it
    // immediately. refreshActiveHighlight() still runs afterward via the
    // watchdog and remains the source of truth - this is just an optimistic
    // guess that gets confirmed (or corrected) a moment later.
    if (!tile.classList.contains('folder-tile')) {
        document.querySelectorAll('.is-active-page').forEach(el => el.classList.remove('is-active-page'));
        tile.classList.add('is-active-page');
    }
};
document.addEventListener('click', window.explorerFocusClickHandler, true); // capture phase so this runs even though the tile's own inline onclick navigates away

// ---------------- Batch Selection ----------------
let selectedPaths = new Set();

// Extract the full path from a tile element (handles both file tiles and folder tiles)
function getFullTilePath(tile) {
    // For folder tiles, the onclick contains path:{...}
    const onclick = tile.getAttribute('onclick') || '';
    const folderMatch = onclick.match(/path\s*:\s*['"]([^'"]+)['"]/);
    if (folderMatch) {
        return folderMatch[1].replace(/\/$/, '');
    }
    // For file tiles, the title attribute holds the full path (without leading slash)
    return (tile.getAttribute('title') || '').replace(/^\//, '');
}

// ---------------- Restore cursor when navigating up a folder ----------------
// If we just came from a child folder (see explorerFocusClickHandler's
// folderup-tile branch above), land the keyboard cursor back on that folder
// in this newly-loaded parent listing, rather than defaulting to the top -
// closer to how a normal desktop file explorer behaves.
(async function restoreCameFromFocus() {
    try {
        const cameFromPath = await syscall('clientStore.get', 'explorer.cameFromChild');
        if (!cameFromPath) return;
        // Consume it immediately so a later, unrelated panel load never reuses it.
        await syscall('clientStore.set', 'explorer.cameFromChild', '');

        const navigable = Array.from(document.querySelectorAll('.grid-tile')).filter(isTileNavigable);
        const match = navigable.find(t => !t.classList.contains('folderup-tile') && getFullTilePath(t) === cameFromPath);
        if (match) {
            focusedIndex = navigable.indexOf(match);
            document.querySelectorAll('.is-focused').forEach(el => el.classList.remove('is-focused'));
            match.classList.add('is-focused');
            scrollTileIntoView(match);
        }
    } catch (err) {
        // Best-effort only - fall back to no initial focus if anything goes wrong.
    }
})();

function toggleTileSelection(tile) {
    if (!tile || tile.classList.contains('folderup-tile')) return;
    const path = getFullTilePath(tile);
    if (!path) return;

    if (selectedPaths.has(path)) {
        selectedPaths.delete(path);
        tile.classList.remove('is-selected');
    } else {
        selectedPaths.add(path);
        tile.classList.add('is-selected');
    }
}

function clearSelection() {
    selectedPaths.clear();
    document.querySelectorAll('.is-selected').forEach(el => el.classList.remove('is-selected'));
}

// Capture-phase click handler: intercept Ctrl/Cmd+Click for batch selection
if (window.explorerBatchSelectClickHandler) {
    document.removeEventListener('click', window.explorerBatchSelectClickHandler, true);
}
window.explorerBatchSelectClickHandler = function(e) {
    if (e.ctrlKey || e.metaKey) {
        const tile = e.target.closest('.grid-tile');
        if (!tile || tile.classList.contains('folderup-tile')) return;
        // Prevent the tile's inline onclick from firing
        e.stopPropagation();
        e.preventDefault();
        toggleTileSelection(tile);
    } else {
        // Regular click - clear selection unless clicking on the context menu
        const isContextMenu = e.target.closest('#explorer-context-menu');
        if (!isContextMenu && selectedPaths.size > 0) {
            clearSelection();
        }
    }
};
document.addEventListener('click', window.explorerBatchSelectClickHandler, true); // capture phase ensures we run before inline onclick handlers

// ---------------- Opening a page ----------------
// Every tile that opens a page goes through here.
//
// The panel lives in an iframe, so clicking a tile leaves the keyboard focus inside
// that iframe. The page itself opened just fine, but the cursor never arrived in the
// editor, and the next keystroke was still being handled by the panel: the arrow keys
// moved the tile selection, and "/" jumped into the tile search instead of typing into
// the note. The only way out was to click into the text with the mouse. editor.navigate
// does not move the focus on its own, so we hand it over explicitly afterwards.
//
// Only a real mouse click hands the focus over, which is what event.isTrusted tells us.
// Pressing Enter and the auto-load timer both open a page through a synthetic
// target.click(), and in both of those cases the user is still working in the panel with
// the keyboard - going after the focus there would fight the arrow navigation, the very
// thing the "we deliberately do NOT reset focusedIndex" note in the Enter handler exists
// to protect.
//
// What that gate buys is narrower than it looks, and worth writing down because the wider
// claim is tempting: it does not keep the keyboard in the panel. SilverBullet moves the
// focus into the editor on every navigation by itself (client.navigate ends in
// client.focus()), synthetic click or not - measured by running an open with the hand-off
// below removed altogether. What the gate does keep out is the watch window: without it
// the panel would go on taking the focus back for most of a second after a keyboard open,
// and every attempt to return to the panel during that second would be undone.
//
// How long the hand-off keeps watching after a click, and how often it looks. The window
// has to outlast the page load that editor.navigate only starts, because the focus can
// still be taken back while that load finishes; the step is short enough that a keystroke
// meant for the note is never swallowed by the panel first.
const EXPLORER_FOCUS_WATCH_MS = 800;
const EXPLORER_FOCUS_STEP_MS = 50;

window.explorerOpenPage = async function(path, event) {
    const fromMouseClick = !!(event && event.isTrusted);
    try {
        await syscall('editor.navigate', path, false, false);
    } catch (e) {
        // A tile can outlive the file it points at - renaming a page from the path field
        // in the top bar is how a note gets moved, and the panel's file list is only
        // rebuilt on refresh. The click still happened inside the iframe either way, so
        // skipping the hand-off here left the keyboard trapped in the panel for the rest
        // of the session, which is the very failure this function exists to prevent.
        console.error("DocumentExplorer: navigation failed", e);
    }
    if (fromMouseClick) {
        try {
            await syscall('editor.focus');
        } catch (e) {
            console.error("DocumentExplorer: focus hand-off failed", e);
        }
        // Outside the try for the same reason the navigation is: a refused syscall is no
        // reason to leave the keyboard in the panel.
        explorerHandFocusToEditor();
    }
};

// A single check, run the moment editor.navigate resolves, reads the focus too early.
// Two things still land after it, and either one takes the focus back without a word:
//
//   - the browser's own focus hand-off for the click. A tile is not a focusable element,
//     so the focus goes to the nearest thing that is - this iframe - and the browser is
//     free to apply that after the click handlers have run.
//   - the page load itself. editor.navigate only starts it; the syscall resolves before
//     the new page is on screen.
//
// The first of those is also what made the single check report success: SilverBullet's
// path field in the top bar commits on blur, and an unchanged name makes it call
// client.focus() itself. So clicking a tile with the path selected focused the editor for
// a moment, the check saw the editor focused and returned happy - and the browser then
// moved the focus into the panel anyway. Hence: keep watching for a short while, and stop
// the moment anything makes a deliberate claim.
function explorerHandFocusToEditor() {
    explorerStopFocusHandoff();

    // Touching the panel again is the user overruling the hand-off - a click into the
    // filter box, or the keyboard. Reading the focus is not enough to notice that: in
    // Firefox the focus a click inside this iframe asks for can still be in flight when
    // the next check runs, and the hand-off would then talk over it. The click that
    // started all this is already over by the time we get here, so it cannot cancel itself.
    window.explorerFocusCancelHandler = function() { explorerStopFocusHandoff(); };
    window.addEventListener("mousedown", window.explorerFocusCancelHandler, true);
    window.addEventListener("keydown", window.explorerFocusCancelHandler, true);

    const deadline = Date.now() + EXPLORER_FOCUS_WATCH_MS;
    const tick = function() {
        window.explorerFocusTimer = null;
        if (explorerFocusEditorOnce() === "other" || Date.now() >= deadline) {
            explorerStopFocusHandoff();
            return;
        }
        window.explorerFocusTimer = setTimeout(tick, EXPLORER_FOCUS_STEP_MS);
    };
    tick();
}

// Ends a hand-off, whether it finished or was overruled: the pending timer and the
// listeners that watch for the user overruling it. Both are kept on window rather than in
// this script's scope, because a redraw re-runs the script in the same document, and a
// timer or a listener only the previous run could reach would go on firing with nothing
// left pointing at it.
function explorerStopFocusHandoff() {
    if (window.explorerFocusTimer) {
        clearTimeout(window.explorerFocusTimer);
        window.explorerFocusTimer = null;
    }
    if (window.explorerFocusCancelHandler) {
        window.removeEventListener("mousedown", window.explorerFocusCancelHandler, true);
        window.removeEventListener("keydown", window.explorerFocusCancelHandler, true);
        window.explorerFocusCancelHandler = null;
    }
}

// editor.focus is a request rather than a guarantee, so the result is verified instead
// of assumed. client.focus() on the host side returns without doing anything while any
// modal is open (command palette, page navigator, filter box, prompt, confirm), and it
// reports no error when it does - so the syscall can succeed while the focus never
// moves, leaving the panel swallowing keystrokes exactly as before. When that happens
// and nothing else has a claim on the focus, hand it to the editor content directly.
//
// Moves the focus and reports where it ended up - deliberately both, against the usual
// rule of keeping the two apart. The answer is the outcome of this very attempt, and the
// caller needs it to decide whether to keep trying; asking separately afterwards would
// read a focus that the next event may already have moved.
//   "editor" - the editor holds it
//   "other"  - something else has a deliberate claim, stop trying
//   "panel"  - still stuck in this iframe, worth another attempt
function explorerFocusEditorOnce() {
    try {
        // Typing in the tile filter is a deliberate claim on the panel, never override it.
        const panelActive = document.activeElement;
        if (panelActive && panelActive.id === "tileSearch") return "other";

        const host = parent.document;
        // A modal is open, so the host declined deliberately. Pulling the focus out of the
        // dialog the user is answering would be a worse bug than the one fixed here.
        if (host.querySelector(".sb-modal-backdrop, .sb-modal-box")) return "other";

        // Nothing to hand the focus to: a document editor is open in place of the page
        // editor, or the page is still being built. Nothing to retry either.
        const content = host.querySelector("#sb-editor .cm-content");
        if (!content) return "other";

        const hostActive = host.activeElement;
        if (hostActive === content) return "editor";

        const panelHasFocus = !!hostActive && hostActive.tagName === "IFRAME"
            && hostActive.contentWindow === window;
        // The focus sits elsewhere in the host on purpose - the path field in the top bar,
        // an action button, another panel. An idle host reports body, or the document
        // element when nothing at all is focused, and neither is a claim.
        const hostHoldsItElsewhere = !panelHasFocus && !!hostActive
            && hostActive !== host.body && hostActive !== host.documentElement;
        if (hostHoldsItElsewhere) return "other";
        // The user has put the focus on something inside the panel itself.
        if (panelHasFocus && panelActive && panelActive !== document.body) return "other";

        if (panelHasFocus) {
            // Firefox keeps this iframe as the focused frame however many times the editor
            // element is asked to take the focus: the request reaches the parent document,
            // but the focused frame does not change, so activeElement there stays the
            // <iframe> and every keystroke still goes to the panel. Releasing the frame
            // first is what actually moves it. In Chromium this costs nothing, because
            // focus() alone already works there.
            hostActive.blur();
        }
        content.focus({ preventScroll: true });
        return host.activeElement === content ? "editor" : "panel";
    } catch (e) {
        // Stop rather than retry: a check that just threw will throw the same way on every
        // remaining tick, and all that produces is the same error sixteen times over.
        console.error("DocumentExplorer: focus check failed", e);
        return "other";
    }
}


// ---------------- Drag & Drop Logic ----------------
window.handleDragStart = function(event, encodedData) {
    // 1. Decode Base64 to a binary string
    const binaryString = atob(encodedData);
    
    // 2. Convert binary string to a Uint8Array
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    // 3. Properly decode the bytes as UTF-8
    const decodedData = new TextDecoder().decode(bytes);
    
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

    window.oncontextmenu = async function(e) {
    const tile = e.target.closest('.grid-tile, .tree-folder'); // Added .tree-folder selector
    const onGrid = !!(e.target.closest('#explorerGrid, .document-explorer'));

    // If not on a tile and not on the grid, bail out entirely
    if (!onGrid && !tile) return;
    // Skip the folderup ".." tile
    if (tile && tile.innerText.includes("..")) return;

    e.preventDefault();

    const panel = document.querySelector(".explorer-panel");
    const isTreeView = panel.classList.contains("mode-tree");
    const isBadgeClick = e.target.closest('.hybrid-md-badge');

    // --- Clipboard State (fetched async so Paste can appear when relevant) ---
    const clipPaths = await syscall('clientStore.get', 'explorer.clipboard.paths');
    const hasClipboard = !!(clipPaths && clipPaths.trim() !== '');

    // --- Grid-level menu (right-click on empty space in the grid) ---
    if (!tile) {
        if (!hasClipboard) return; // Nothing useful to show
        let menuContent = `<div class="menu-item" id="ctx-paste">Paste here</div>`;
        menu.innerHTML = menuContent;
        menu.style.display = 'block';
        let posX = e.clientX;
        let posY = e.clientY;
        if (posX + menu.offsetWidth > window.innerWidth) posX -= menu.offsetWidth;
        if (posY + menu.offsetHeight > window.innerHeight) posY -= menu.offsetHeight;
        menu.style.left = posX + 'px';
        menu.style.top = posY + 'px';

        document.getElementById('ctx-paste').onclick = async () => {
            menu.style.display = 'none';
            const clipOp = await syscall('clientStore.get', 'explorer.clipboard.operation');
            if (clipOp === 'cut') {
                const paths = clipPaths.split('\n').filter(Boolean);
                const grid = document.getElementById('explorerGrid');
                const destFolder = grid ? (grid.getAttribute('data-current-path') || '') : '';
                let moved = 0, skipped = 0;
                for (const srcPath of paths) {
                    const fileName = srcPath.split('/').pop();
                    const destPath = (destFolder.replace(/\/$/, '') ? destFolder.replace(/\/$/, '') + '/' : '') + fileName;
                    if (srcPath === destPath) { skipped++; continue; }
                    const existsResult = await syscall('lua.evalExpression', `explorerDestExists("${destPath}")`);
                    if (existsResult === 'true') { skipped++; continue; }
                    await syscall('system.invokeFunction', 'index.renamePrefixCommand', { oldPrefix: srcPath, newPrefix: destPath });
                    moved++;
                }
                await syscall('clientStore.set', 'explorer.clipboard.paths', '');
                await syscall('clientStore.set', 'explorer.clipboard.operation', '');
                await syscall('lua.evalExpression', 'refreshExplorer()');
                const msg = `Moved ${moved} item(s).${skipped > 0 ? ' Skipped ' + skipped + ' (already exist or same location).' : ''}`;
                await syscall('lua.evalExpression', `editor.flashNotification("${msg}")`);
            } else {
                await syscall('lua.evalExpression', 'clipboardPaste()');
            }
        };
        return;
    }

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

    // FIXED: Handle both .fs/ and .fs/ prefixes
    let internalPath = targetPath.replace(/^[\/]?\.fs\//, "").replace(/^\//, "");
    if (isFolder) internalPath = internalPath.replace(/\/$/, "");

    // --- Batch Mode Detection ---
    // Batch mode is active when multiple items are selected
    const isBatchMode = selectedPaths.size > 1;
    const batchCount = selectedPaths.size;

    // --- Build Menu Content ---
    let menuContent = "";

    if (isBatchMode) {
        // Batch mode: only show copy/cut/paste/rename/delete for the selection
        menuContent += `<div class="menu-item" id="ctx-copy">Copy ${batchCount} items</div>`;
        menuContent += `<div class="menu-item" id="ctx-cut">Cut ${batchCount} items</div>`;
        if (hasClipboard) menuContent += `<div class="menu-item" id="ctx-paste">Paste here</div>`;
        menuContent += `<div class="menu-item" id="ctx-rename">Rename ${batchCount} items</div>`;
        menuContent += `<div class="menu-item delete" id="ctx-delete">Delete ${batchCount} items</div>`;
    } else {
        // Single item mode (original logic)

        // ADDED: Open option for folders in Tree View
        if (isFolder && isTreeView) {
            menuContent += `<div class="menu-item" id="ctx-open" style="font-weight:bold;">Focus</div>`;
        }

        // NEW: Preview option for files
        if (!isFolder || isBadgeClick) {
            menuContent += `<div class="menu-item" id="ctx-preview">Pop-Out</div>`;
        }

        // NEW: Dock options (Dock Right / Dock Left) inserted between Pop-Out and Rename/Delete
        if (!isFolder || isBadgeClick) {
            menuContent += `<div class="menu-item" id="ctx-dock-right">Dock Right</div>`;
            menuContent += `<div class="menu-item" id="ctx-dock-left">Dock Left</div>`;
        }

        menuContent += `<div class="menu-item" id="ctx-copy">Copy</div>`;
        menuContent += `<div class="menu-item" id="ctx-cut">Cut</div>`;
        if (hasClipboard) menuContent += `<div class="menu-item" id="ctx-paste">Paste here</div>`;
        menuContent += `<div class="menu-item" id="ctx-rename">Rename</div>`;
        if (!isFolder || isBadgeClick) {
            menuContent += `<div class="menu-item delete" id="ctx-delete">Delete</div>`;
        }
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
    
    // Handle the Open command (single mode only)
    if (document.getElementById('ctx-open')) {
        document.getElementById('ctx-open').onclick = async () => {
            menu.style.display = 'none';
            let openPath = internalPath;
            if (openPath !== "" && !openPath.endsWith("/")) openPath += "/";
            await syscall('editor.invokeCommand', 'DocumentExplorer: Open Folder', { path: openPath });
        };
    }

    // Handle the Preview command (single mode only)
    if (document.getElementById('ctx-preview')) {
        document.getElementById('ctx-preview').onclick = async () => {
            menu.style.display = 'none';
            
            // Set the suppression flag so the new window doesn't spawn an explorer
            await syscall('clientStore.set', 'explorer.suppressOnce', 'true');
            
            const fileName = internalPath.split('/').pop();
            const luaCmd = `js.import("]] .. urlPrefix .. [[.fs/Library/Mr-xRed/UnifiedAdvancedPanelControl.js").show("${internalPath}", "${fileName}")`;
            await syscall('lua.evalExpression', luaCmd);
        };
    }

    // Handle Dock Right (single mode only)
    if (document.getElementById('ctx-dock-right')) {
        document.getElementById('ctx-dock-right').onclick = async () => {
            menu.style.display = 'none';
            // Suppress the explorer spawn on new window
            await syscall('clientStore.set', 'explorer.suppressOnce', 'true');
            const fileName = internalPath.split('/').pop();
            const luaCmd = `js.import("]] .. urlPrefix .. [[.fs/Library/Mr-xRed/UnifiedAdvancedPanelControl.js").showDocked("${internalPath}", "rhs", "${fileName}")`;
            await syscall('lua.evalExpression', luaCmd);
        };
    }

    // Handle Dock Left (single mode only)
    if (document.getElementById('ctx-dock-left')) {
        document.getElementById('ctx-dock-left').onclick = async () => {
            menu.style.display = 'none';
            // Suppress the explorer spawn on new window
            await syscall('clientStore.set', 'explorer.suppressOnce', 'true');
            const fileName = internalPath.split('/').pop();
            const luaCmd = `js.import("]] .. urlPrefix .. [[.fs/Library/Mr-xRed/UnifiedAdvancedPanelControl.js").showDocked("${internalPath}", "lhs", "${fileName}")`;
            await syscall('lua.evalExpression', luaCmd);
        };
    }

    // Handle Copy: store paths + operation in clientStore (single or batch)
    if (document.getElementById('ctx-copy')) {
        document.getElementById('ctx-copy').onclick = async () => {
            menu.style.display = 'none';
            const pathsToStore = isBatchMode ? Array.from(selectedPaths).join('\n') : internalPath;
            await syscall('clientStore.set', 'explorer.clipboard.paths', pathsToStore);
            await syscall('clientStore.set', 'explorer.clipboard.operation', 'copy');
            const count = isBatchMode ? batchCount : 1;
            await syscall('lua.evalExpression', `editor.flashNotification("${count} item(s) copied to clipboard.")`);
            if (isBatchMode) clearSelection();
        };
    }

    // Handle Cut: store paths + operation in clientStore (single or batch)
    if (document.getElementById('ctx-cut')) {
        document.getElementById('ctx-cut').onclick = async () => {
            menu.style.display = 'none';
            const pathsToStore = isBatchMode ? Array.from(selectedPaths).join('\n') : internalPath;
            await syscall('clientStore.set', 'explorer.clipboard.paths', pathsToStore);
            await syscall('clientStore.set', 'explorer.clipboard.operation', 'cut');
            const count = isBatchMode ? batchCount : 1;
            await syscall('lua.evalExpression', `editor.flashNotification("${count} item(s) cut to clipboard.")`);
            if (isBatchMode) clearSelection();
        };
    }

    // Handle Paste: cut uses renamePrefixCommand (updates wikilinks), copy uses Lua clipboardPaste()
    if (document.getElementById('ctx-paste')) {
        document.getElementById('ctx-paste').onclick = async () => {
            menu.style.display = 'none';
            const clipPaths = await syscall('clientStore.get', 'explorer.clipboard.paths');
            const clipOp   = await syscall('clientStore.get', 'explorer.clipboard.operation');
            if (!clipPaths || clipPaths.trim() === '') return;

            if (clipOp === 'cut') {
                // --- MOVE via renamePrefixCommand ---
                // SilverBullet will automatically update all wikilinks pointing to moved files.
                const paths = clipPaths.split('\n').filter(Boolean);

                // Read destination folder from the DOM (already set as data-current-path)
                const grid = document.getElementById('explorerGrid');
                const destFolder = grid ? (grid.getAttribute('data-current-path') || '') : '';

                let moved = 0;
                let skipped = 0;

                for (const srcPath of paths) {
                    const fileName = srcPath.split('/').pop();
                    // Build destination path (strip trailing slash from folder, rejoin with filename)
                    const destPath = (destFolder.replace(/\/$/, '') ? destFolder.replace(/\/$/, '') + '/' : '') + fileName;

                    // Skip if source and destination resolve to the same path
                    if (srcPath === destPath) {
                        skipped++;
                        continue;
                    }

                    // Skip if destination already exists (ask Lua, returns "true"/"false" string)
                    const existsResult = await syscall('lua.evalExpression', `explorerDestExists("${destPath}")`);
                    if (existsResult === 'true') {
                        skipped++;
                        continue;
                    }

                    // renamePrefixCommand with both oldPrefix and newPrefix performs a silent move
                    // and updates all wikilinks across the space automatically.
                    await syscall('system.invokeFunction', 'index.renamePrefixCommand', {
                        oldPrefix: srcPath,
                        newPrefix: destPath
                    });
                    moved++;
                }

                // Clear clipboard so files can't be moved twice
                await syscall('clientStore.set', 'explorer.clipboard.paths', '');
                await syscall('clientStore.set', 'explorer.clipboard.operation', '');
                await syscall('lua.evalExpression', 'refreshExplorer()');

                const msg = `Moved ${moved} item(s).${skipped > 0 ? ' Skipped ' + skipped + ' (already exist or same location).' : ''}`;
                await syscall('lua.evalExpression', `editor.flashNotification("${msg}")`);
            } else {
                // --- COPY via Lua (read+write files, existence check inside Lua) ---
                await syscall('lua.evalExpression', 'clipboardPaste()');
            }
        };
    }

    // Handle Rename: single or batch
    document.getElementById('ctx-rename').onclick = async () => {
        menu.style.display = 'none';
        if (isBatchMode) {
            // Batch rename: invoke rename dialog for each selected item one by one
            const pathsToRename = Array.from(selectedPaths);
            for (const batchPath of pathsToRename) {
                let renamePath = batchPath;
                if (!batchPath.match(/\.[^.]+$/)) renamePath = batchPath + '.md';
                await syscall("system.invokeFunction", "index.renamePrefixCommand", { oldPrefix: renamePath });
            }
            clearSelection();
            await syscall('lua.evalExpression', 'refreshExplorer()');
        } else {
            // Single rename (original logic)
            let renamePath = internalPath;
            if (!isFolder && !internalPath.match(/\.[^.]+$/)) renamePath += ".md";
            await syscall("system.invokeFunction", "index.renamePrefixCommand", { oldPrefix: renamePath });
            await syscall('lua.evalExpression', 'refreshExplorer()');
        }
    };

    // Handle Delete: single or batch
    if (document.getElementById('ctx-delete')) {
        document.getElementById('ctx-delete').onclick = async () => {
            menu.style.display = 'none';
            if (isBatchMode) {
                // Batch delete: confirm once, then delete each file one by one via Lua
                const pathsArray = Array.from(selectedPaths);
                const confirmed = await syscall('editor.confirm', `Delete ${pathsArray.length} items?`);
                if (confirmed) {
                    // Store paths as newline-separated string to avoid JSON parsing issues in Lua
                    await syscall('clientStore.set', 'explorer.batchSelectedPaths', pathsArray.join('\n'));
                    await syscall('lua.evalExpression', 'batchDeleteFiles()');
                }
                clearSelection();
            } else {
                // Single delete (original logic)
                await syscall("lua.evalExpression", `deleteFileWithConfirm("${internalPath}")`);
            }
        };
    }
};


// --- Mobile Long Press Logic ---
let touchTimer;
let touchStartPos = { x: 0, y: 0 };
const LONG_PRESS_DURATION = 600; // 1 second
const MOVE_THRESHOLD = 30; // Pixels to allow before canceling

if (window.explorerTouchStartHandler) window.removeEventListener('touchstart', window.explorerTouchStartHandler);
window.explorerTouchStartHandler = function(e) {
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
};
window.addEventListener('touchstart', window.explorerTouchStartHandler, { passive: true });

if (window.explorerTouchMoveHandler) window.removeEventListener('touchmove', window.explorerTouchMoveHandler);
window.explorerTouchMoveHandler = function(e) {
    if (!touchTimer) return;

    // Calculate how far the finger moved
    const moveX = Math.abs(e.touches[0].clientX - touchStartPos.x);
    const moveY = Math.abs(e.touches[0].clientY - touchStartPos.y);

    // If moved more than threshold, cancel the long-press (user is dragging/scrolling)
    if (moveX > MOVE_THRESHOLD || moveY > MOVE_THRESHOLD) {
        clearTimeout(touchTimer);
        touchTimer = null;
    }
};
window.addEventListener('touchmove', window.explorerTouchMoveHandler, { passive: true });

if (window.explorerTouchEndHandler) window.removeEventListener('touchend', window.explorerTouchEndHandler);
window.explorerTouchEndHandler = function() {
    clearTimeout(touchTimer);
    touchTimer = null;
};
window.addEventListener('touchend', window.explorerTouchEndHandler);

if (window.explorerTouchCancelHandler) window.removeEventListener('touchcancel', window.explorerTouchCancelHandler);
window.explorerTouchCancelHandler = function() {
    clearTimeout(touchTimer);
    touchTimer = null;
};
window.addEventListener('touchcancel', window.explorerTouchCancelHandler);



  

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

 //     tile.scrollIntoView({ behavior: 'auto', block: 'center' });
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

// ---- FOUC PREVENTION & STATE MANAGEMENT ----
// 1. Inject CSS to hide panel during window transition
(function() { // Wrapped in IIFE to avoid polluting global scope
    const style = document.createElement('style');
    style.id = 'doc-ex-hiding-style';
    style.innerHTML = `.doc-ex-hiding { visibility: hidden !important; }`;
    if (!parent.document.getElementById(style.id)) {
        parent.document.head.appendChild(style);
    }
})();

// 2. Add MutationObserver to track panel/window state
if (window.explorerModeWatcher) {
    window.explorerModeWatcher.disconnect();
}
setTimeout(() => {
  const panelSelector = '.sb-panel.]] .. PANEL_ID .. [[';
  const panelElement = parent.document.querySelector(panelSelector);
  if (panelElement) {
      const observer = new MutationObserver(async (mutationsList) => {
          for(const mutation of mutationsList) {
              if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                  const isDetached = panelElement.classList.contains('is-detached-window');
                  const currentMode = isDetached ? "window" : "panel";
                  const lastKnownMode = await syscall("clientStore.get", "explorer.currentDisplayMode") || "panel";
                  if (currentMode !== lastKnownMode) {
                      await syscall("clientStore.set", "explorer.currentDisplayMode", currentMode);
                  }
              }
          }
      });
      observer.observe(panelElement, { attributes: true });
      window.explorerModeWatcher = observer;
      // Set initial state
      const isDetached = panelElement.classList.contains('is-detached-window');
      syscall("clientStore.set", "explorer.currentDisplayMode", isDetached ? "window" : "panel");
  }
}, 100);
// ---- END ----

setTimeout(() => {
    restoreTreeState(); 
    initTreePersistence();
    refreshActiveHighlight(); 
}, 50);



// Clear any existing watchdog to prevent memory leaks on panel redraw
if (window.highlightWatchdog) clearInterval(window.highlightWatchdog);
// The underlying clientStore.get syscall is extremely fast and a no-op
// when the token hasn't changed, so polling this often is still very
// light on the CPU. This is mainly a fast-reconciling safety net now -
// tile clicks/Enter/auto-load already highlight instantly on their own
// (see the click handler above) - this catches page changes that don't
// go through an explorer tile, e.g. wiki-links or browser back/forward.
window.highlightWatchdog = setInterval(watchdog, 250);
  
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
    document.documentElement.style.visibility = 'hidden';
    const panel = parent.document.querySelector('.sb-panel.]] .. PANEL_ID .. [[');
    if (panel) panel.style.visibility = 'hidden';
    
    function ensureElement(id, tag, attributes, content) {
        if (document.getElementById(id)) return document.getElementById(id);
        const el = document.createElement(tag);
        el.id = id;
        for (let key in attributes) el.setAttribute(key, attributes[key]);
        if (content) el.innerHTML = content;
        document.head.appendChild(el);
        return el;
    }

    const mainCss  = ensureElement("silverbullet-main-css", "link", { rel: "stylesheet", href: "]] .. urlPrefix .. [[.client/main.css"});
    const explorerCss = ensureElement("explorer-style-css", "link", { rel: "stylesheet", href: "]] .. urlPrefix .. [[.fs/Library/Mr-xRed/docex_styles.css" });
    
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

    function onStyleLoaded(el) {
        return new Promise(resolve => {
            if (el.sheet) {
                resolve();
                return;
            }
            el.addEventListener('load',  resolve, { once: true });
            el.addEventListener('error', resolve, { once: true });
        });
    }

    const reveal = () => {
        document.documentElement.style.visibility = '';
        const panel = parent.document.querySelector('.sb-panel.]] .. PANEL_ID .. [[');
        if (panel) panel.style.visibility = '';
    };

    Promise.all([onStyleLoaded(mainCss), onStyleLoaded(explorerCss)]).then(reveal);

    setTimeout(reveal, 2000); // Failsafe


})(); 
]]

  local finalHtml = table.concat(h)
  editor.showPanel(PANEL_ID, currentWidth, finalHtml, script)
  PANEL_VISIBLE = true
  clientStore.set("explorer.open", "true")
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

command.define {
  name = "DocumentExplorer: ToggleAutoLoad",
  hide = true,
  run = function()
    local current = clientStore.get("explorer.autoLoad")
    if current == "true" then
      clientStore.set("explorer.autoLoad", "false")
    else
      clientStore.set("explorer.autoLoad", "true")
    end
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
      clientStore.set("explorer.open", "false") 
    else
      if not cachedFiles then cachedFiles = space.listFiles() end
      drawPanel() 
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

-- ----------------------------------

--command.define {
--  name = "DocumentExplorer: Toggle Window Mode",
--  hide = true,
--  run = function()
--    local currentMode = clientStore.get("explorer.currentDisplayMode") or "panel"    
--    local selector = "#sb-main .sb-panel." .. PANEL_ID -- This targets the SB panel wrapper
    
    -- Force a clean slate
--    editor.hidePanel(PANEL_ID)
--    PANEL_VISIBLE = false

--    if currentMode == "window" then
--      clientStore.set("explorer.currentDisplayMode", "panel")
--      drawPanel()
--    else
--      clientStore.set("explorer.currentDisplayMode", "window")
--      drawPanel()
--      js.import(urlPrefix .. ".fs/Library/Mr-xRed/UnifiedAdvancedPanelControl.js").enableWindow(selector)
--    end
--    clientStore.set("explorer.open", "true")
--  end
--}

command.define {
  name = "Navigate: Document Explorer Window",
 -- hide = true,
  run = function()
      local selector = "#sb-main .sb-panel." .. PANEL_ID
      if not PANEL_VISIBLE then
        if not cachedFiles then cachedFiles = space.listFiles() end
        drawPanel()
      end
      clientStore.set("explorer.open", "true")
        js.import(urlPrefix .. ".fs/Library/Mr-xRed/UnifiedAdvancedPanelControl.js").enableWindow(selector)
  end
}
```

## Discussions to this library
* [SilverBullet Community](https://community.silverbullet.md/t/document-explorer-image-gallery-for-silverbullet/3647?u=mr.red)