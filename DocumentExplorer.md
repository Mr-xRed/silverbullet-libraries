---
name: "Library/Mr-xRed/DocumentExplorer"
tags: meta/library
pageDecoration.prefix: "🗂️ "
---

# Document Explorer

## Currently supported extension:
* Pages: .md
* Images: .png, .jpg, .jpeg, .webp, .gif, .svg
* Documents: .pdf
* Every other extension is rendered as `❔` and opened as raw file if browser supports it

## Supported Browsers:
* 🟢 Chrome:  tested(Mac&Win) & working 
* 🟢 Edge:    tested(Win) & working
* 🟢 Brave:   tested(Mac&Linux) & working
* 🟢 Firefox: tested(Mac) & working
* 🟢 Safari:  tested(Mac) & working (on latest edge)


## GoTo: ${widgets.commandButton("Document Explorer","Navigate: Document Explorer")} or use shortcut: `Ctrl-Alt-d`

## ## Configuration Options and Defaults:
* `homeDirName`        - Name how your Home Directory appears in the Breadcrumbs (default: "🏠 Home")
* `virtulaPagePattern` - Virtual page pattern (default: "🗂️ Explorer")
* `widgetHeight`       - Height of the widget in the VirtualPage (default: "75vh")
* `tileSize`           - Tile size, recommanded between 100px-200px (default: "120px") 
* `goToCurrentDir`     - Start navigation in the Directory of the currently opened page (default: true)
* `listView`           - Switch to listView (default: false)


```lua
config.set( "explorer", {
            homeDirName = "🏠 Home",
            virtualPagePattern = "🗂️ Explorer",
            widgetHeight = "75vh",
            tileSize = "120px", 
            goToCurrentDir = true,
            listView = false
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
    tileSize = schema.string(),
    widgetHeight = schema.string(),
    homeDirName = schema.string(),
    virtualPagePattern = schema.string(),
    goToCurrentDir = schema.boolean(),
    listView = schema.boolean()
   }
})
```


### Command
```space-lua
command.define {
  name = "Navigate: Document Explorer",
  key = "Ctrl-Alt-d",
  run = function()
    local current = editor.getCurrentPath() or ""
    local cfg = config.get("explorer") or {}
    local goToCurrentDir = cfg.goToCurrentDir ~= false
    local path = ""
    local virtualPagePattern = cfg.virtualPagePattern or "🗂️ Explorer"
    local virtualPagePatternMatch = "^"..virtualPagePattern.."/"
    
    if current == virtualPagePattern or current:match(virtualPagePatternMatch) then
      editor.navigate(current)
      return
    end
    
   if goToCurrentDir then
      path = current:match("^(.*)/") or ""
    end

    if path ~= "" then
      editor.navigate(virtualPagePattern.."/" .. path)
    else
      editor.navigate(virtualPagePattern)
    end
  end
}

```

### Document Explorer Widget
```space-lua

-- Defining Config Defaults
local cfg = config.get("explorer") or {}
local tileSize = cfg.tileSize or "120px"
local homeDirName = cfg.homeDirName or "🏠 Home"
local virtualPagePattern = cfg.virtualPagePattern or "🗂️ Explorer"

-- Document Explorer Widget
function widgets.documentExplorer(folderPrefix, height, listView)
  height = height or "75vh"
  folderPrefix = folderPrefix or ""
  listView = listView or false  -- default false (grid view)

  local wrapperClass = listView and "document-explorer-wrapper list-view" or "document-explorer-wrapper grid-view"

  local files = space.listFiles()
  local folders, images, mds, pdfs, unknowns = {}, {}, {}, {}, {}
  local seen = {}

  -- ---------- COLLECT DIRECT CHILDREN ----------
  for _, file in ipairs(files) do
    if folderPrefix == "" or file.name:sub(1, #folderPrefix) == folderPrefix then
      local rest = file.name:sub(#folderPrefix + 1)

      -- subfolders
      local slashPos = rest:find("/")
      if slashPos then
        local sub = rest:sub(1, slashPos - 1)
        if not seen[sub] then
          seen[sub] = true
          table.insert(folders, sub)
        end
      end

      -- files only
      if not rest:find("/") then
        if rest:match("%.png$") or rest:match("%.jpg$")
          or rest:match("%.jpeg$") or rest:match("%.webp$")
          or rest:match("%.gif$") or rest:match("%.svg$") then
          table.insert(images, { full = file.name, name = rest })
        elseif rest:match("%.md$") then
          table.insert(mds, { full = file.name, name = rest:gsub("%.md$", "") })
        elseif rest:match("%.pdf$") then
          table.insert(pdfs, { full = file.name, name = rest:gsub("%.pdf$", "") })
        else
          table.insert(unknowns, { full = file.name, name = rest })
        end
      end
    end
  end

  table.sort(folders)
  table.sort(images, function(a,b) return a.name < b.name end)
  table.sort(mds, function(a,b) return a.name < b.name end)
  table.sort(pdfs, function(a,b) return a.name < b.name end)
  table.sort(unknowns, function(a,b) return a.name < b.name end)

  -- ---------- BREADCRUMBS ----------
  local crumbs = {}
  local path = ""

  table.insert(crumbs,
    "<a href='/"..virtualPagePattern..
    "' data-ref='/"..virtualPagePattern.."'>" .. homeDirName .. "</a>"
  )

  for part in folderPrefix:gmatch("([^/]+)/") do
    path = path .. part .. "/"
    table.insert(crumbs,
      "<a href='/"..virtualPagePattern.."/" .. path .. 
      "' data-ref='/"..virtualPagePattern.."/" .. path .. "'>" .. part .. "</a>"
    )
  end

  local breadcrumbHtml =
    "<div class='explorer-breadcrumbs'>" ..
      table.concat(crumbs, "<span class='sep'>/</span>") ..
    "</div>"

  -- ---------- EXPLORER ----------
  local html =
    "<div class='" .. wrapperClass ..
    "' style='--tile-size:" .. tileSize .. 
    ";--icon-size-grid: calc(var(--tile-size) * 0.4); --icon-size-list: 1.5em;'>" .. breadcrumbHtml ..
    "<div class='document-explorer' style='max-height:" .. height .. ";'>"

  -- Parent folder
  if folderPrefix ~= "" then
    local parent = folderPrefix:gsub("[^/]+/$", "")
    html = html ..
      "<a class='image-tile folder-tile' href='/" .. virtualPagePattern .. "/" .. parent ..
      "' data-ref='/"..virtualPagePattern.."/" .. parent .. "'>" ..
      "<div class='folder-icon'>📂</div>" ..
      "<div class='image-title'>..</div>" ..
      "</a>"
  end

  -- Folders
  for _, f in ipairs(folders) do
    local p = folderPrefix .. f .. "/"
    html = html ..
      "<a class='image-tile folder-tile' href='/"..virtualPagePattern.."/" .. p ..
      "' data-ref='/"..virtualPagePattern.."/" .. p .. "'>" ..
      "<div class='folder-icon'>📁</div>" ..
      "<div class='image-title'>" .. f .. "</div>" ..
      "</a>"
  end

  -- Markdown files
  for _, md in ipairs(mds) do
    local target = "/" .. md.full:gsub("%.md$", "")
    html = html ..
      "<a class='image-tile md-tile' href='" .. target ..
      "' data-ref='" .. target .. "' title='" .. md.full .. "'>" ..
      "<div class='md-icon'>📝</div>" ..
      "<div class='image-title'>" .. md.name .. "</div>" ..
      "</a>"
  end

  -- PDF files
  for _, pdf in ipairs(pdfs) do
    local target = "/" .. pdf.full
    html = html ..
      "<a class='image-tile pdf-tile' href='" .. target ..
      "' data-ref='" .. target .. "' title='" .. pdf.full .. "'>" ..
      "<div class='pdf-icon'>📄</div>" ..
      "<div class='image-title'>" .. pdf.name .. "</div>" ..
      "</a>"
  end

  -- Images
  for _, img in ipairs(images) do
    local fs = "/.fs/" .. img.full
    html = html ..
      "<a class='image-tile' href='" .. fs .. 
      "' data-ref='/" .. img.full .. "' title='" .. img.full .. "'>" ..
      "<div class='image-thumb'><img src='" .. fs .. "' loading='lazy' /></div>" ..
      "<div class='image-title'>" .. img.name .. "</div>" ..
      "</a>"
  end

  -- Unknown files
  for _, unk in ipairs(unknowns) do
    local ext = unk.name:match("%.([^.]+)$")
    ext = ext and ext:upper() or "?"

    html = html ..
      "<a class='image-tile unknown-tile' data-ext='" .. ext ..
      "' href='/.fs/" .. unk.full .. "' target='_blank' title='" .. unk.full .. "'>" ..
      "<div class='unknown-icon'>❔</div>" ..
      "<div class='image-title'>" .. unk.name .. "</div>" ..
      "</a>"
  end

  html = html .. "</div></div>"

  return widget.new {
    display = "block",
    html = html
  }
end

```

### VirtualPage
```space-lua
 local cfg = config.get("explorer") or {}
 local widgetHeight = cfg.widgetHeight or "75vh"
 local virtualPagePattern = cfg.virtualPagePattern or "🗂️ Explorer"
 local listView = cfg.listView or false
 
virtualPage.define {
  pattern = virtualPagePattern.."/?(.*)",
  run = function(path)
    local folder = path or ""

    -- normalise
    if folder ~= "" and not folder:match("/$") then
      folder = folder .. "/"
    end

    -- prevent traversal
    folder = folder:gsub("%.%.", "")

    return "\n${widgets.documentExplorer(\"" .. folder .. "\", \"" .. widgetHeight .. "\"," .. (listView and "true" or "false") .. ")}\n"
  end
}

```

## Styling:

```space-style

/* ---------- BREADCRUMBS ---------- */
.explorer-breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0.5em 1em;
  font-size: 1.2em;
  opacity: 0.85;
}

.explorer-breadcrumbs a {
  text-decoration: none;
  color: var(--editor-link-color);
}

.explorer-breadcrumbs a:hover {
  text-decoration: underline;
}

.explorer-breadcrumbs .sep {
  opacity: 0.8;
}

/* ---------- TILE BASE STYLE ---------- */
.image-tile {
  display: flex;
  flex-direction: column; /* default: grid */
  text-decoration: none;
  color: inherit;
  background-color: oklch(0.75 0 0 / 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: background-color 0.2s;
}

.image-tile:hover {
  background-color: oklch(0.85 0 0 / 0.5);
}

/* ---------- ICONS ---------- */
.folder-icon,
.md-icon,
.pdf-icon,
.unknown-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ---------- FILE EXTENSION LABELS ---------- */
.md-tile, .pdf-tile, .unknown-tile { position: relative; }

.md-tile::after { content: "MD"; background: oklch(0.55 0.23 260 / 0.6); }
.pdf-tile::after { content: "PDF"; background: oklch(0.55 0.23 30 / 0.6); }
.unknown-tile::after {
  content: attr(data-ext);
  background: oklch(0.45 0 0 / 0.6);
}

.md-tile::after,
.pdf-tile::after,
.unknown-tile::after {
  position: absolute;
  top: 4px;
  right: 6px;
  color: oklch(1 0 0);
  font-size: 0.65em;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 4px;
  pointer-events: none;
}

/* ---------- TITLES ---------- */
.image-title {
  flex: 1 1 auto;
  min-width: 0; /* needed for ellipsis */
  padding: 0 6px;
  font-size: 0.75em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  position: relative;
}

/* ---------- FOLDER TOOLTIP ---------- */
.folder-tile .image-title:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background: var(--bg_2);
  color: var(--text-color_1);
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 0.75em;
  z-index: 10;
}

/* ---------- GRID VIEW ---------- */
.document-explorer-wrapper.grid-view .document-explorer {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--tile-size), 1fr));
  grid-auto-rows: var(--tile-size);
  gap: 12px;
  padding: 1em;
  overflow-y: auto;
  align-content: start;
}

.document-explorer-wrapper.grid-view .image-tile {
  flex-direction: column;
  justify-content: space-between; /* title at bottom */
  box-shadow: 0 2px 6px oklch(0 0 0 / 0.15);
}

.document-explorer-wrapper.grid-view .image-title {
  text-align: center;
}

.document-explorer-wrapper.grid-view .folder-icon,
.document-explorer-wrapper.grid-view .md-icon,
.document-explorer-wrapper.grid-view .pdf-icon,
.document-explorer-wrapper.grid-view .unknown-icon {
  font-size: var(--icon-size-grid);
  margin-top: calc((var(--tile-size) - var(--icon-size-grid)) / 2 - 10px);
}

.document-explorer-wrapper.grid-view .image-tile .image-thumb {
  width: 100%;
  height: calc(var(--tile-size) - 30px);
}

/* ---------- LIST VIEW ---------- */
.document-explorer-wrapper.list-view .document-explorer {
  display: flex;
  flex-direction: column;
  gap: 0; /* removed gap */
  padding: 1em;
  overflow-y: auto;
}

.document-explorer-wrapper.list-view .image-tile {
  flex-direction: row;
  border-radius: 0;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 6px 8px;
  box-shadow: none; /* removed shadow */
}

.document-explorer-wrapper.list-view .image-title {
  text-align: left;
  padding: 5px;
}

.document-explorer-wrapper.list-view .folder-icon,
.document-explorer-wrapper.list-view .md-icon,
.document-explorer-wrapper.list-view .pdf-icon,
.document-explorer-wrapper.list-view .unknown-icon {
  font-size: var(--icon-size-list);
  margin-top: 0;
}

/* ---------- IMAGE vs FILE ICONS ---------- */
.image-tile:not(.folder-tile) .image-thumb { display: flex; }
.image-tile.folder-tile .image-thumb { display: none; }

/* ---------- THUMBNAILS ---------- */
.image-thumb {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-thumb img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Grid view: thumbnail fills available space */
.document-explorer-wrapper.grid-view .image-thumb {
  width: 100%;
  height: calc(var(--tile-size) - 40px);
}

/* List view: square thumbnail */
.document-explorer-wrapper.list-view .image-thumb {
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
}

```



## Discussions to this library
* [SilverBullet Community](https://community.silverbullet.md/t/document-explorer-image-gallery-for-silverbullet/3647?u=mr.red)