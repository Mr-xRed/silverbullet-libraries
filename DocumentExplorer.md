---
name: "Library/Mr-xRed/DocumentExplorer"
tags: meta/library
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

## GoTo: ${widgets.commandButton("Toggle Document Explorer","Navigate: Document Explorer")} or use shortcuts: 

`Ctrl-Alt-d`          - Toggle Document Explorer
`Ctrl-Alt-ArrotRight` - Increase Document Explorer Width in 10% increments
`Ctrl-Alt-ArrotLeft`  - Decrease Document Explorer Width in 10% increments

## Configuration Options and Defaults:
* `homeDirName`        - Name how your Home Directory appears in the Breadcrumbs (default: "🏠 Home")
* `goToCurrentDir`     - Start navigation in the Directory of the currently opened page (default: true)
* `tileSize`           - Tile size, recommended between 60px-160px (default: "80px") 
* enableContextMenu  - Enable the Right-Click for Files & Folders: Rename & Delete (default: false)
* _`viewMode`           - CURRENTLY NOT SUPPORTED - Choose between “grid” and “list” (default: grid)_

```lua
config.set("explorer", {
  homeDirName = "🏠 Home",
  goToCurrentDir = true,
  tileSize = "80px",
  enableContextMenu = false 
--  viewMode = "grid"
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

-- ---------- Helper to build file tiles ----------
local function fileTile(icon, name, target, ext)
  local tileClass = "grid-tile"
  local onClickAction
  
  if ext == "md" then tileClass = tileClass .. " md-tile"
  elseif ext == "pdf" then tileClass = tileClass .. " pdf-tile"
  elseif ext == "img" then tileClass = tileClass .. " image-tile"
  elseif ext == "excalidraw" then tileClass = tileClass .. " excalidraw-tile"
  elseif ext == "drawio" then tileClass = tileClass .. " drawio-tile"
  else tileClass = tileClass .. " unknown-tile"
  end

  if ext ~= "md" and ext ~= "pdf" and ext ~= "drawio" and ext ~= "excalidraw" and ext ~= "img" then
      onClickAction = "window.open('" .. target .. "', '_blank')"
  else
      onClickAction = "syscall('editor.navigate','" .. target .. "',false,false)"
  end

  local iconContent = icon
  if ext == "img" then
      iconContent = "<img src='/.fs" .. target .. "' loading='lazy' class='tile-thumb' />"
  end

  
  return "<div class='" .. tileClass .. "' data-ext='" .. (ext or "?"):upper() .. "' title='" .. name .. "' onclick=\"" .. onClickAction .. "\">" ..
    "<div class='icon'>" .. iconContent .. "</div><div class='grid-title'>" .. name .. "</div></div>"
end


-- ---------- drawPanel function ----------

local function drawPanel()
  local currentWidth = clientStore.get("explorer.panelWidth") or config.get("explorer.panelWidth") or 0.8
  
  local folderPrefix = clientStore.get(PATH_KEY) or ""
  if folderPrefix ~= "" and not folderPrefix:match("/$") then
    folderPrefix = folderPrefix .. "/"
  end

  local files = space.listFiles()
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
      <div class="explorer-panel">
        <div class="explorer-header">
          <div class="explorer-search">          
            <div class="input-wrapper">
              <input type="text" title="e.g.: user man pdf" id="tileSearch" placeholder="Filter..." oninput="filterTiles()">
              <div id="clearSearch" class="clear-btn" onmousedown="clearFilter(event)">✕</div>
            </div>
            <div class="explorer-close-btn" title="Close Explorer" onclick="syscall('editor.invokeCommand', 'Navigate: Document Explorer')">✕</div>
          </div>
          ]] .. breadcrumbHtml .. [[
        </div>
        <div class="document-explorer" id="explorerGrid" data-current-path="]] .. folderPrefix .. [[">
  ]]

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

  for _, f in ipairs(mds) do html = html .. fileTile("📝", f:gsub("%.md$",""), "/"..folderPrefix..f:gsub("%.md$",""), "md") end
  for _, f in ipairs(pdfs) do html = html .. fileTile("📄", f:gsub("%.pdf$",""), "/"..folderPrefix..f, "pdf") end
  for _, f in ipairs(drawio) do html = html .. fileTile("📐", f:gsub("%.drawio$",""), "/"..folderPrefix..f, "drawio") end
  for _, f in ipairs(excalidraw) do html = html .. fileTile("🔳", f:gsub("%.excalidraw$",""), "/"..folderPrefix..f, "excalidraw") end
  for _, f in ipairs(images) do html = html .. fileTile("🖼️", f, "/"..folderPrefix..f, "img") end
  for _, f in ipairs(unknowns) do 
    local extension = f:match("%.([^.]+)$") or "?"
    html = html .. fileTile("❔", f, "/.fs/"..folderPrefix..f, extension) 
  end

  html = html .. "</div></div>"

-- --------------- JavaScript for: --------------------
   -- Context Menu
   -- Live Filter
   -- Space Style import
   
local script = [[
(function() {

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

// ---------------- Rename & Delete ----------------

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
        
        // Toggle Clear Button and Padding Class
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

// ---------------- Clear Filter ----------------      
    window.clearFilter = function(event) {
        if (event) {
            event.preventDefault(); 
            event.stopPropagation();
        }
        const input = document.getElementById("tileSearch");
        input.value = "";
        
        // Explicitly remove class on clear
        const wrapper = input.closest('.input-wrapper');
        wrapper.classList.remove("has-clear");
        
        filterTiles(); 
        input.focus(); 
    };

// ---- Apply custom styles from SilverBullet ----
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
  name = "Navigate: Document Explorer",
  key = "Ctrl-Alt-d",
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

## Styling:

```space-style
body {
color: var(--explorer-text-color);
}
/*
#sb-top .panel {
  position: fixed;
}
*/
.explorer-panel {
  display: flex;
  flex-direction: column;
  height: 100vh; 
  width: 100%;
  overflow: hidden;
}

.explorer-header {
  flex: 0 0 auto; 
  background: var(--explorer-bg-color);
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid oklch(0.75 0 0 / 0.1);
  box-shadow: 0px 2px 6px 0 oklch(0 0 0 / 0.3);
}

.explorer-close-btn:hover {
  background: color-mix(in oklch, var(--ui-accent-color), transparent 90%);
  border-color: var(--ui-accent-color);
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
  font-size: 1em;
}

.input-wrapper.has-clear input {
  padding-right: 26px;
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
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.explorer-search input:hover {
  outline: 2px solid color-mix(in oklch, var(--ui-accent-color), transparent 20%);
  cursor: pointer;
}

.explorer-search input:focus {
  border: 2px solid color-mix(in oklch, var(--ui-accent-color), transparent 30%);
  cursor: text;
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
  z-index: 10;
}

.document-explorer {
  flex: 1 1 auto; 
  overflow-y: auto !important;
  padding: 1em;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--tile-size), 1fr));
  grid-auto-rows: var(--tile-size); 
  gap: 8px;
  align-content: start;
  scroll-behavior: smooth;
}

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
  display: inline-flex;
  align-items: center;
  line-height: 1.2;
}

.explorer-breadcrumbs a:hover { text-decoration: underline; cursor: pointer; }
.explorer-breadcrumbs .sep { opacity: 0.8; display: inline-flex; align-items: center; }

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

.grid-tile:hover {
  background: oklch(0.75 0 0 / 0.5);
}

/* IMAGE TILE THUMBNAILS */

/* Add this to your existing space-style block */

.tile-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This crops the image to fill the icon area */
  border-radius: 4px;
}

/* Adjust the icon container for image tiles to use more space */
.image-tile .icon {
  margin-top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  overflow: hidden;
}

/* Ensure the title stays visible over/under the image if needed */
.image-tile .grid-title {
  background: oklch(0 0 0 / 0.6);
  color: white;
  position: absolute;
  bottom: 0;
  width: 100%;
  backdrop-filter: blur(4px);
}

.image-tile:hover { 
  outline: 3px solid var(--ui-accent-color);
}
/* ---------- FILE EXTENSION LABELS ---------- */

/* MD Files */
.md-tile::after { 
  content: "MD"; 
  background: oklch(0.55 0.23 260 / 0.8); 
}

/* PDF Files */
.pdf-tile::after { 
  content: "PDF"; 
  background: oklch(0.55 0.23 30 / 0.8); 
}

/* Excalidraw */
.excalidraw-tile::after { 
  content: "EX"; 
  background: oklch(0.55 0.14 300 / 0.8); 
}

/* DrawIO */
.drawio-tile::after { 
  content: "DIO"; 
  background: oklch(0.55 0.23 90 / 0.8); 
}

/* The Extension Label (e.g., JS, TXT) */
.unknown-tile::after {
  content: attr(data-ext);
  background: oklch(0.45 0 0 / 0.8);
 }

/* The Globe Icon */
.unknown-tile::before {
  content: "🌐";
  position: absolute;
  top: 0px; 
  left: 2px; 
  font-size: 0.8em; 
  opacity: 0.8;    
  z-index: 5;
}

.grid-title { 
  text-align: center;
  font-size: 0.75em;
  padding: 5px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


.icon {
  font-size: var(--icon-size-grid);
  margin-top: calc((var(--tile-size) - var(--icon-size-grid)) / 2 - 10px);
  display: flex;
  justify-content: center;
  align-items: center;
}

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
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

#explorer-context-menu .menu-item:hover {
  color:white;
  background: var(--ui-accent-color);
  border-radius: 4px;
}

#explorer-context-menu .menu-item.delete { color: oklch(0.75 0.3 30);}
#explorer-context-menu .menu-item.delete:hover { color:white; background: red;}

:root {
   --tile-bg: oklch(0.75 0 0 / 0.1);
   font-family: "Segoe UI", Roboto, Helvetica, sans-serif;
}
```


## Discussions to this library
* [SilverBullet Community](https://community.silverbullet.md/t/document-explorer-image-gallery-for-silverbullet/3647?u=mr.red)
