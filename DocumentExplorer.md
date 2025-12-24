---
name: "Library/Mr-xRed/DocumentExplorer"
tags: meta/library
files:
- PanelDragResize.js
pageDecoration.prefix: "🗂️ "
---
# 🗂️ Document Explorer for the Side Panel

> **warning** WORK IN PROGRESS
> Not all features from the OLD (VirtualPage) version are present. Currently only GridView is available

## Currently supported extension:
* Pages: .md
* Images: .png, .jpg, .jpeg, .webp, .gif, .svg
* Documents: .pdf, .excalidraw, .drawio (if Plugs installed)
* Every other extension is rendered as `❔` and opened as raw file if browser supports it

## GoTo: ${widgets.commandButton("Document Explorer in SidePanel","Navigate: Document Explorer")} or ${widgets.commandButton("Document Explorer Move&Resize","Navigate: Document Explorer Move&Resize")}
## or use the shortcuts: 

> **tip** New ShortCut Keys
> `Ctrl-Alt-e`           - Toggle Document Explorer in the Side Panel
> `Ctrl-Alt-w`           - Toggle Document Explorer in Drag&Resize Window
> `Ctrl-Alt-ArrotRight` - Increase Document Explorer Width in 10% increments
> `Ctrl-Alt-ArrotLeft`  - Decrease Document Explorer Width in 10% increments

## Configuration Options and Defaults:
* `homeDirName`        - Name how your Home Directory appears in the Breadcrumbs (default: "🏠 Home")
* `goToCurrentDir`     - Start navigation in the Directory of the currently opened page (default: true)
* `tileSize`           - Tile size, recommended between 60px-160px (default: "80px") 
* `enableContextMenu`  - **Enable the Right-Click** for Files & Folders: Rename & Delete (default: false)
* `viewMode`           - Choose “grid”|“list”|“tree” (default: grid)

```lua
config.set("explorer", {
  homeDirName = "🏠 Home",
  goToCurrentDir = true,
  tileSize = "80px",
  enableContextMenu = false
})
```



> **note** Note
> Copy this into a `space-lua` block on your config page to change default values

## Integration:

### Config Init
```space-lua
config.define("explorer", {
  type = "object",
  properties = {
    homeDirName = schema.string(),
    tileSize = schema.string(),
    panelWidth = schema.number(),
    goToCurrentDir = schema.boolean(),
    enableContextMenu = schema.boolean()
  }
})
```

## Side Panel Integration

```space-lua
local cfg = config.get("explorer") or {}
local tileSize = cfg.tileSize or "80px"
local homeDirName = cfg.homeDirName or "🏠 Home"
local goToCurrentDir = cfg.goToCurrentDir ~= false
local enableContextMenu = cfg.enableContextMenu == true

local PANEL_ID = "lhs"
local PANEL_VISIBLE = false
local PATH_KEY = "gridExplorer.cwd"
local VIEW_MODE_KEY = "gridExplorer.viewMode"

-- ---------- Helper to build file tiles ----------
local function fileTile(icon, name, target, ext, viewMode)
  local tileClass = "grid-tile"
  local onClickAction
  local rawPath = target:gsub("^/", "") 
  local dragData = rawPath 
  
  -- Normalize extension and determine category
  local originalExt = (ext or "?"):lower()
  local category = originalExt
  
  if originalExt == "jpg" or originalExt == "jpeg" or originalExt == "png" or 
     originalExt == "webp" or originalExt == "gif" or originalExt == "svg" then
      category = "img"
  end

  -- Assign CSS classes and Drag&Drop data based on category
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

  -- Navigation Logic
  if category ~= "md" and category ~= "pdf" and category ~= "drawio" and category ~= "excalidraw" and category ~= "img" then
      onClickAction = "window.open('" .. target .. "', '_blank')"
  else
      onClickAction = "syscall('editor.navigate','" .. target .. "',false,false)"
  end

  -- Icon & Thumbnail Logic
  local finalIcon = icon
  if viewMode ~= "grid" then
      if category == "md" then finalIcon = "📝"
      elseif category == "pdf" then finalIcon = "📄"
      elseif category == "excalidraw" then finalIcon = "🔳"
      elseif category == "drawio" then finalIcon = "📐"
      elseif category == "img" then finalIcon = "🖼️"
      else finalIcon = "❔"
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
        if prefix == "" or f.name:sub(1, #prefix) == prefix then
            local rel = f.name:sub(#prefix + 1)
            local current = tree
            for part in rel:gmatch("[^/]+") do
                current[part] = current[part] or {} 
                if not rel:find(part .. "/") then 
                    current[part]._path = f.name 
                end
                current = current[part]
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
                   fileTile("📄", name, "/" .. node._path:gsub("%.md$",""), ext, "tree") .. 
                   "</div>"
        else
            html = "<details open class='tree-folder'>" ..
                   "<summary class='grid-tile folder-tile'>" ..
                   "<div class='icon'><span class='chevron'>›</span>📁</div><div class='grid-title'>"..name.."</div>"..               
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

-- ---------- drawPanel function ----------

local function drawPanel()
  local currentWidth = clientStore.get("explorer.panelWidth") or config.get("explorer.panelWidth") or 0.8
  local viewMode = clientStore.get(VIEW_MODE_KEY) or config.get("explorer.viewMode") or "grid"
  
  local folderPrefix = clientStore.get(PATH_KEY) or ""
  if folderPrefix ~= "" and not folderPrefix:match("/$") then
    folderPrefix = folderPrefix .. "/"
  end

  local files = space.listFiles()
  
  local crumbs = {"<a onclick=\"syscall('editor.invokeCommand','DocumentExplorer: Open Folder',{path:''})\">"..homeDirName.."</a>"}
  local pathAccum = ""
  for part in folderPrefix:gmatch("([^/]+)/") do
    pathAccum = pathAccum .. part .. "/"
    table.insert(crumbs, "<a onclick=\"syscall('editor.invokeCommand','DocumentExplorer: Open Folder',{path:'"..pathAccum.."'} )\">" .. part .. "</a>")
  end
  local breadcrumbHtml = "<div class='explorer-breadcrumbs'>" .. table.concat(crumbs, " <span class='sep'>/</span> ") .. "</div>"

  local style = ":root { --tile-size:" .. tileSize .. "; --icon-size-grid: calc(var(--tile-size) * 0.4); }"

  local html = [[
      <link rel="stylesheet" href="/.client/main.css" />
      <style>]] .. style .. [[</style>
      <div class="explorer-panel mode-]] .. viewMode .. [[">
        <div class="explorer-header">
          <div class="explorer-search">          
            <div class="input-wrapper">
              <input type="text" title="e.g.: user man pdf" id="tileSearch" placeholder="Filter..." oninput="filterTiles()">
              <div id="clearSearch" class="clear-btn" onmousedown="clearFilter(event)">✕</div>
            </div>
            <div class="view-switcher">
              <button class="]]..(viewMode=="grid" and "active" or "")..[[" onclick="syscall('editor.invokeCommand','DocumentExplorer: Change View Mode',{mode:'grid'})">⊞</button>
              <button class="]]..(viewMode=="list" and "active" or "")..[[" onclick="syscall('editor.invokeCommand','DocumentExplorer: Change View Mode',{mode:'list'})">≡</button>
              <button class="]]..(viewMode=="tree" and "active" or "")..[[" onclick="syscall('editor.invokeCommand','DocumentExplorer: Change View Mode',{mode:'tree'})">⑃</button>
            </div>
            <div class="explorer-close-btn" title="Close Explorer" onclick="syscall('editor.invokeCommand', 'Navigate: Document Explorer')">✕</div>
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

      table.sort(folders); table.sort(mds); table.sort(pdfs);
      table.sort(drawio); table.sort(excalidraw); table.sort(images); table.sort(unknowns)

      if folderPrefix ~= "" then
        local parent = folderPrefix:gsub("[^/]+/$", "")
        html = html .. "<div class='grid-tile' onclick=\"syscall('editor.invokeCommand','DocumentExplorer: Open Folder',{path:'"..parent.."'} )\">" ..
          "<div class='icon'>📂</div><div class='grid-title'>..</div></div>"
      end

      for _, f in ipairs(folders) do
        local p = folderPrefix .. f .. "/"
        html = html .. "<div class='grid-tile folder-tile' title='" .. f .. "' onclick=\"syscall('editor.invokeCommand','DocumentExplorer: Open Folder',{path:'"..p.."'} )\">" ..
          "<div class='icon'>📁</div><div class='grid-title'>"..f.."</div></div>"
      end

      for _, f in ipairs(mds) do html = html .. fileTile("📝", f:gsub("%.md$",""), "/"..folderPrefix..f:gsub("%.md$",""), "md", viewMode) end
      for _, f in ipairs(pdfs) do html = html .. fileTile("📄", f:gsub("%.pdf$",""), "/"..folderPrefix..f, "pdf", viewMode) end
      for _, f in ipairs(drawio) do html = html .. fileTile("📐", f:gsub("%.drawio$",""), "/"..folderPrefix..f, "drawio", viewMode) end
      for _, f in ipairs(excalidraw) do html = html .. fileTile("🔳", f:gsub("%.excalidraw$",""), "/"..folderPrefix..f, "excalidraw", viewMode) end
      for _, f in ipairs(images) do html = html .. fileTile("🖼️", f, "/"..folderPrefix..f, "img", viewMode) end
      for _, f in ipairs(unknowns) do 
          local extension = f:match("%.([^.]+)$") or "?"
          html = html .. fileTile("❔", f, "/.fs/"..folderPrefix..f, extension, viewMode) 
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
            tile.style.opacity = "0.4";
            setTimeout(() => { tile.style.opacity = "1"; }, 1000);
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
                    const currentDir = document.getElementById("explorerGrid").getAttribute("data-current-path");
                    if (confirm("Are you sure you want to delete " + internalPath + "?")) {
                        await syscall("space.deleteFile", internalPath);
                        if (!internalPath.match(/\.[^.]+$/)) await syscall("space.deleteFile", internalPath + ".md");
                        await syscall("editor.invokeCommand", "DocumentExplorer: Open Folder", { path: currentDir });
                    }
                };
            }
        };

        window.onclick = () => { menu.style.display = 'none'; };
    }

// ---------------- Filter Logic ----------------
    window.filterTiles = function() {
        const input = document.getElementById("tileSearch");
        const clearBtn = document.getElementById("clearSearch");
        const wrapper = input.closest('.input-wrapper');
        const query = input.value.toLowerCase();
        
        if (query.length > 0) {
            clearBtn.style.display = "flex";
            wrapper.classList.add("has-clear");
        } else {
            clearBtn.style.display = "none";
            wrapper.classList.remove("has-clear");
        }
    
        const terms = query.split(/\s+/).filter(t => t.length > 0);
        const tiles = document.querySelectorAll(".grid-tile");
    
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
        if (event) {
            event.preventDefault(); 
            event.stopPropagation();
        }
        const input = document.getElementById("tileSearch");
        input.value = "";
        const wrapper = input.closest('.input-wrapper');
        wrapper.classList.remove("has-clear");
        filterTiles(); 
        input.focus(); 
    };

    // --- UPDATED: Load EVERYTHING from Parent ---
    const customStyles = parent.document.getElementById("custom-styles")?.innerHTML;
    if (customStyles) {
        const styleEl = document.createElement("style");
        styleEl.innerHTML = customStyles;
        document.head.appendChild(styleEl);
    }
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
  key = "Ctrl-Alt-e",
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
    clientStore.set("explorer.panelWidth", math.min(cur + 0.1, 1))
    drawPanel()
  end
}

command.define {
  name = "Document Explorer: Decrease Width",
  key = "Ctrl-Alt-ArrowLeft",
  hide = true,
  run = function()
    local cur = clientStore.get("explorer.panelWidth") or 0.8
    clientStore.set("explorer.panelWidth", math.max(cur - 0.1, 0.2))
    drawPanel()
  end
}

command.define {
  name = "Navigate: Document Explorer Move&Resize",
  key = "Ctrl-Alt-w",
  run = function()
        editor.invokeCommand "Navigate: Document Explorer"
        js.import("/.fs/Library/Mr-xRed/PanelDragResize.js").enableDrag()
       end
}

```

```space-style
body {
  color: var(--explorer-text-color);
}

/* Layout Container */
.explorer-panel {
  display: flex;
  flex-direction: column;
  height: 100vh; 
  width: 100%;
  overflow: hidden;
}

/* Header & Search */
.explorer-header {
  flex: 0 0 auto; 
  background: var(--explorer-bg-color);
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid oklch(0.75 0 0 / 0.1);
  box-shadow: 0px 2px 6px 0 oklch(0 0 0 / 0.3);
}

.explorer-search {
  display: flex;
  align-items: center;
  justify-content: space-between; 
  gap: 8px;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
}

.input-wrapper {
  position: relative;
  border-radius: 6px;
  display: flex;
  align-items: center;
  width: 4.5em; 
  flex-grow: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-wrapper:focus-within {
  flex-grow: 1;
  box-shadow: 0px 2px 6px 0 oklch(0 0 0 / 0.3);
}

.explorer-search input {
  width: 100%; 
  padding: 4px 7px; 
  border-radius: 6px;
  border: 1px solid oklch(0.75 0 0 / 0.2);
  color: inherit;
  font-size: 0.95em;
  outline: none;
  box-sizing: border-box;
}

.explorer-search input:focus {
  border: 2px solid color-mix(in oklch, var(--ui-accent-color), transparent 30%);
}

.clear-btn {
  position: absolute;
  right: 8px; 
  top: 50%;
  transform: translateY(-50%); 
  width: 14px;
  height: 14px;
  background: oklch(0.5 0 0);
  border-radius: 50%;
  display: none; 
  align-items: center;
  justify-content: center;
  font-size: 10px;
  cursor: pointer;
}

/* View Switcher & Close */
.view-switcher {
  display: flex;
  background: oklch(0.75 0 0 / 0.1);
  padding: 2px;
  border-radius: 8px;
  border: 1px solid oklch(0.75 0 0 / 0.1);
}

.view-switcher button {
  background: transparent;
  border: none;
  padding: 2px 6px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 1em;
  color: inherit;
  opacity: 0.6;
}

.view-switcher button.active {
  background: var(--ui-accent-color);
  color: white;
  opacity: 1;
}

.explorer-close-btn {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tile-bg);
  border: 1px solid oklch(0.75 0 0 / 0.2);
  border-radius: 6px;
  cursor: pointer;
}

/* Breadcrumbs */
.explorer-breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  font-size: 1em;
  align-items: center; 
}

.explorer-breadcrumbs a { 
  text-decoration: none; 
  color: var(--link-color); 
}

.explorer-breadcrumbs a:hover { text-decoration: underline; cursor: pointer; }

/* Main Content Area */
.document-explorer {
  flex: 1 1 auto; 
  overflow-y: auto !important;
  padding: 1em;
  gap: 8px;
  align-content: start;
  scroll-behavior: smooth;
}

/* --- GRID MODE --- */
.mode-grid .document-explorer {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--tile-size), 1fr));
  grid-auto-rows: var(--tile-size); 
}

.grid-tile {
  position: relative; 
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
  color: var(--explorer-text-color);
  user-select: none;
}

.grid-tile:hover {
  background: oklch(0.75 0 0 / 0.5);
}

.grid-tile::after {
  position: absolute;
  top: 4px;
  right: 4px;
  color: white;
  font-size: 0.6em;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 4px;
  pointer-events: none;
  z-index: 5;
}

.grid-title { 
  text-align: center;
  font-size: 0.75em;
  padding: 5px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
}

.icon {
  font-size: var(--icon-size-grid);
  height: calc(var(--tile-size) * 0.6); 
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  overflow: hidden; /* This crops the image */
  margin-top: 5px;  /* Reduced margin to give title more room */
}

/* --- LIST & TREE MODE COMMON (Fixes Compression) --- */
.mode-list .document-explorer, 
.mode-tree .document-explorer {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  align-items: stretch;
}

.mode-list .grid-tile, 
.mode-tree .grid-tile {
  flex-direction: row;
  height: 32px;
  padding: 0 20px 0 8px;
  align-items: center;
  gap: 10px;
  justify-content: flex-start;
  flex-shrink: 0;
  width: auto;
}

.mode-list .icon, 
.mode-tree .icon {
  margin-top: 0 !important;
  font-size: 1.2em;
  width: auto; /* Changed to accommodate chevron */
  min-width: 24px;
  flex-shrink: 0;
  overflow: visible;
}

.mode-list .grid-title, 
.mode-tree .grid-title {
  text-align: left;
  font-size: 0.9em;
  flex-grow: 1;
  padding: 0;
}

.mode-list .grid-tile::after, 
.mode-tree .grid-tile::after {
  position: relative;
  top: auto;
  right: auto;
  margin-left: auto;
  flex-shrink: 0;
}

/* --- TREE VIEW SPECIFIC (Fixes Alignment & Lines) --- */
.mode-tree .tree-view-container {
  padding-left: 5px;
}

.mode-tree .tree-content {
  margin-left: 18px; 
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Vertical line aligned with parent folder icon */
.mode-tree .tree-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: -10px; 
  bottom: 16px; 
  border-left: 2px solid oklch(0.5 0 0);
}

/* Horizontal branch ticks */
.mode-tree .tree-file::before, 
.mode-tree .tree-folder::before {
  content: "";
  position: absolute;
  left: -10px; 
  top: 16px;
  width: 10px; 
  border-top: 2px solid oklch(0.5 0 0);
}

/* Hide lines for root elements */
.tree-view-container > .tree-file::before,
.tree-view-container > .tree-folder::before {
  display: none;
}

.mode-tree .tree-file {
  position: relative;
  padding-left: 0px !important;
}

.mode-tree .tree-folder {
  position: relative;
}

.mode-tree .folder-tile {
  margin-left: -3px; 
}

.mode-tree details, .mode-tree summary {
  list-style: none;
}

.mode-tree summary::-webkit-details-marker {
  display: none;
}

/* --- CHEVRON ANIMATION --- */
.chevron {
  display: inline-block;
  font-size: 1.2em;
  margin-right: 4px;
  transition: transform 0.2s ease;
  width: 12px;
  text-align: center;
}

details[open] > summary .chevron {
  transform: rotate(90deg);
}

/* --- FILE EXTENSION COLORS --- */
.md-tile::after { content: "MD"; background: oklch(0.55 0.23 260 / 0.8); }
.pdf-tile::after { content: "PDF"; background: oklch(0.55 0.23 30 / 0.8); }
.excalidraw-tile::after { content: "EX"; background: oklch(0.55 0.14 300 / 0.8); }
.drawio-tile::after { content: "DIO"; background: oklch(0.55 0.23 90 / 0.8); }
.unknown-tile::after { content: attr(data-ext); background: oklch(0.45 0 0 / 0.8); }
.image-tile::after { content: "IMG"; background: oklch(0.65 0.25 180 / 0.8); }

/* --- CONTEXT MENU --- */
#explorer-context-menu {
  font-weight: bold;
  background: oklch(0.50 0 0 / 0.5);
  border: 1px solid oklch(0.5 0 0);
  border-radius: 6px;
  box-shadow: 0 4px 15px 0 oklch(0 0 0 / 0.5);
  padding: 4px;
  width: 80px;
  backdrop-filter: blur(10px);
}

#explorer-context-menu .menu-item {
  padding: 4px;
  cursor: pointer;
  font-size: 0.85em;
  color: var(--explorer-text-color);
  text-align: center;
}

#explorer-context-menu .menu-item:hover {
  color: white;
  background: var(--ui-accent-color);
  border-radius: 4px;
}

#explorer-context-menu .menu-item.delete { color: oklch(0.75 0.3 30); }
#explorer-context-menu .menu-item.delete:hover { background: red; color: white;}

/* Image Thumbnails */
.tile-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  border-radius: 4px;
  pointer-events: none; /* Prevent thumb from interfering with drag */
}


.mode-grid .image-tile .icon {
  margin-top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  overflow: hidden;
}

/* Base Variables & Font */
:root {
  --tile-bg: oklch(0.75 0 0 / 0.1);
  --header-height: 20px;
  --frame-width: 5px;
  --frame-color: rgba(64, 64, 64, 0.2);
  --window-border: 2px;
  --window-border-radius: 10px;
  --window-border-color: #5558;
  font-family: Monaco, Menlo, Consolas, "Courier New", Courier, monospace;
}

```

## Discussions to this library
* [SilverBullet Community](https://community.silverbullet.md/t/document-explorer-image-gallery-for-silverbullet/3647?u=mr.red)
