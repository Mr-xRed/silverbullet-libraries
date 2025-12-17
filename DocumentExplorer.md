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
* 🟢 Brave:   tested(Mac) & working
* 🟢 Firefox: tested(Mac) & working (animations doesn`t work)
* 🟢 Safari:  tested(Mac) & working on latest edge 


## GoTo: ${widgets.commandButton("Document Explorer","Navigate: Document Explorer")} or use shortcut: `Ctrl-Alt-d`

## Configuration Options and Defaults:
* `homeDirName`    - Name how your Home Directory appears in the Breadcrumbs (default: "🏠 Home")
* `widgetHeight`   - Height of the widget in the VirtualPage (default: "75vh")
* `tileSize`       - the tile size, recommanded between 100px-200px (default: "160px") 
* `goToCurrentDir` - start navigation in the Directory of the currently opened page (default: true)


```lua
config.set( "explorer", {
            homeDirName = "🏠 Home",
            widgetHeight = "75vh"
            tileSize = "160px", 
            goToCurrentDir = true,
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
    goToCurrentDir = schema.boolean(),
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
 
    if current == "explorer" or current:match("^explorer/") then
      editor.navigate(current)
      return
    end
    
   if goToCurrentDir then
      path = current:match("^(.*)/") or ""
    end

    if path ~= "" then
      editor.navigate("explorer/" .. path)
    else
      editor.navigate("explorer")
    end
  end
}

```

### Document Explorer Widget
```space-lua

--Defining Config Defaults
 local expConf = config.get("explorer") or {}
 local tileSize = expConf.tileSize or "160px"
 local homeDirName = expConf.homeDirName or "🏠 Home"
  
function widgets.documentExplorer(folderPrefix, height)
  if not height or height == "" then
    height = "75vh"
  end

  folderPrefix = folderPrefix or ""

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
    "<a href='/explorer' data-ref='/explorer'>".. homeDirName .."</a>"
  )

  for part in folderPrefix:gmatch("([^/]+)/") do
    path = path .. part .. "/"
    table.insert(crumbs,
      "<a href='/explorer/" .. path .. "' data-ref='/explorer/" .. path .. "'>" .. part .. "</a>"
    )
  end

  local breadcrumbHtml =
    "<div class='explorer-breadcrumbs'>" ..
      table.concat(crumbs, "<span class='sep'>/</span>") ..
    "</div>"

  -- ---------- EXPLORER ----------
  local html =
    "<div class='document-explorer-wrapper' style='--tile-size:" .. tileSize .. "'>" ..
      breadcrumbHtml ..
      "<div class='document-explorer' style='max-height:" .. height .. ";'>"

  -- Parent folder
  if folderPrefix ~= "" then
    local parent = folderPrefix:gsub("[^/]+/$", "")
    html = html ..
      "<a class='image-tile folder-tile' href='/explorer/" .. parent .. "' data-ref='/explorer/" .. parent .. "'>" ..
        "<div class='folder-icon'>📂</div>" ..
        "<div class='image-title'>..</div>" ..
      "</a>"
  end

  -- Folders
  for _, f in ipairs(folders) do
    local p = folderPrefix .. f .. "/"
    html = html ..
      "<a class='image-tile folder-tile' href='/explorer/" .. p .. "' data-ref='/explorer/" .. p .. "'>" ..
        "<div class='folder-icon'>📁</div>" ..
        "<div class='image-title'>" .. f .. "</div>" ..
      "</a>"
  end

  -- Markdown files
  for _, md in ipairs(mds) do
    local target = "/" .. md.full:gsub("%.md$", "")
    html = html ..
      "<a class='image-tile md-tile' href='" .. target .. "' data-ref='" .. target .. "' title='" .. md.full .. "'>" ..
        "<div class='md-icon'>📝</div>" ..
        "<div class='image-title'>" .. md.name .. "</div>" ..
      "</a>"
  end

  -- PDF files
  for _, pdf in ipairs(pdfs) do
    local target = "/" .. pdf.full
    html = html ..
      "<a class='image-tile pdf-tile' href='" .. target .. "' data-ref='" .. target .. "' title='" .. pdf.full .. "'>" ..
        "<div class='pdf-icon'>📄</div>" ..
        "<div class='image-title'>" .. pdf.name .. "</div>" ..
      "</a>"
  end

  -- Images
  for _, img in ipairs(images) do
    local fs = "/.fs/" .. img.full
    html = html ..
      "<a class='image-tile' href='" .. fs .. "' data-ref='/" .. img.full .. "' title='" .. img.full .. "'>" ..
        "<div class='image-thumb'><img src='" .. fs .. "' loading='lazy' /></div>" ..
        "<div class='image-title'>" .. img.name .. "</div>" ..
      "</a>"
  end

  -- Unknown files
  for _, unk in ipairs(unknowns) do
    local ext = unk.name:match("%.([^.]+)$")
    ext = ext and ext:upper() or "?"

    html = html ..
      "<a class='image-tile unknown-tile' data-ext='" .. ext .. "' href='/.fs/" .. unk.full .. "' target='_blank' title='" .. unk.full .. "'>" ..
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
 local expConf = config.get("explorer") or {}
 local widgetHeight = expConf.widgetHeight or "75vh"
 
virtualPage.define {
  pattern = "explorer/?(.*)",
  run = function(path)
    local folder = path or ""

    -- normalise
    if folder ~= "" and not folder:match("/$") then
      folder = folder .. "/"
    end

    -- prevent traversal
    folder = folder:gsub("%.%.", "")

    return "\n${widgets.documentExplorer(\"" .. folder .. "\", \""..widgetHeight.."\")}\n"
  end
}

```

## Styling:
```space-style

/* -------------- ICON SIZE -------------- */
.folder-icon,
.md-icon,
.pdf-icon,
.unknown-icon {
  font-size: calc(var(--tile-size) * 0.4);
  margin-top: calc(var(--tile-size) * 0.15);
}


/* ---------- UNKNOWN FILE TILE ---------- */
.unknown-tile {
  width: 100%;
  text-align: center;
  justify-content: center;
}

.unknown-tile::after {
  content: attr(data-ext);
  position: absolute;
  top: 4px;
  right: 6px;

  color: oklch(1 0 0);
  font-size: 0.65em;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 4px;
  pointer-events: none;

  background: oklch(0.45 0 0 / 0.6); /* neutral grey */
}

/* ---------- PDF TILE ---------- */
.pdf-tile {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  justify-content: center;
}

/* ---------- MARKDOWN TILE ---------- */
.md-tile {
  width: 100%;
  background: oklch(0 0 0 / 0); /* transparent */

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  text-align: center;
  justify-content: center;
}

/* ---------- FILE EXTENSION LABEL ---------- */

.md-tile, .pdf-tile, .unknown-tile { position: relative; }

.md-tile::after,
.pdf-tile::after {
  content: attr(data-ext);
  position: absolute;
  top: 4px;
  right: 6px;
  color: oklch(1 0 0); /* white */
  font-size: 0.65em;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 4px;
  pointer-events: none;
}

.md-tile::after { content: "MD"; background: oklch(0.55 0.23 260 / 0.6); /* blue */ }
.pdf-tile::after { content: "PDF"; background: oklch(0.55 0.23 30 / 0.6); /* red */ }

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

/* ---------- EXPLORER ---------- */
.document-explorer {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(calc(var(--tile-size) - 30px), 1fr));
  grid-auto-rows: var(--tile-size);
  gap: 14px;

  padding: 1em;
  overflow-y: auto;
  align-content: start;
}

/* ---------- TILE ---------- */
.image-tile {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;

  background: oklch(0.85 0 0 / 0.2);

  border-radius: 8px;
  overflow: hidden;

  box-shadow: 0 2px 6px oklch(0 0 0 / 0.25);
}

.folder-tile .image-title {
  position: relative;
}

.folder-tile {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    justify-content: center;
}


.image-thumb {
  height: calc(var(--tile-size) - 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.image-thumb img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-title {
  padding: 5px 8px;
  font-size: 0.75em;
  text-align: center;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---------- HOVER ---------- */
.image-tile:hover {
  background-color: oklch(0.85 0 0 / 0.6); /* neutral grey */
}


/* ---------- ANIMATION (SAFE) ---------- */
@supports (animation-timeline: view()) {
  .image-tile {
    animation: fly-in linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 100%;
  }
}

@keyframes fly-in {
  0%   { opacity: 0; transform: translateY(30px) scaleX(0.3); }
  11%  { opacity: 1; transform: translateY(0) scaleX(1); }
  90%  { opacity: 1; transform: translateY(0) scaleX(1); }
  100% { opacity: 0; transform: translateY(-30px) scaleX(0.3); }
}

```


## Discussions to this library
* [SilverBullet Community](https://community.silverbullet.md/t/document-explorer-image-gallery-for-silverbullet/3647?u=mr.red)