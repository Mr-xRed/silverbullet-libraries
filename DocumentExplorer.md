---
name: "Library/Mr-xRed/DocumentExplorer"
tags: meta/library
pageDecoration.prefix: "🗂️ "
---
# Document Explorer

### Currently supported extension:
* Pages: .md
* Images: .png, .jpg, .jpeg, .webp, .gif
* Documents: .pdf

### Supported Browsers:
* 🟢 Chrome: tested & working 
* 🟢 Brave - tested & working
* 🟢 Firefox - tested & working (animations doesn`t work)
* 🟡 Safari - tested & partially working (opening documents doesn’t work)

## GoTo: ${widgets.commandButton("Document Explorer","Navigate: Document Explorer")}

```space-lua
command.define {
  name = "Navigate: Document Explorer",
  key = "Ctrl-Alt-d",
  run = function()
    editor.navigate("explorer")
  end
}
```

## Integration:

### Document Explorer Widget
```space-lua
function widgets.documentExplorer(folderPrefix, height)
  if not height or height == "" then
    height = "75vh"
  end

  folderPrefix = folderPrefix or ""

  local files = space.listFiles()
  local folders, images, mds, pdfs = {}, {}, {}, {}
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

      -- files only (no deeper paths)
      if not rest:find("/") then
        if rest:match("%.png$") or rest:match("%.jpg$")
          or rest:match("%.jpeg$") or rest:match("%.webp$")
          or rest:match("%.gif$") then
          table.insert(images, { full = file.name, name = rest })
        elseif rest:match("%.md$") then
          table.insert(mds, { full = file.name, name = rest:gsub("%.md$", "") })
        elseif rest:match("%.pdf$") then
          table.insert(pdfs, { full = file.name, name = rest:gsub("%.pdf$", "") })
        end
      end
    end
  end

  table.sort(folders)
  table.sort(images, function(a,b) return a.name < b.name end)
  table.sort(mds, function(a,b) return a.name < b.name end)
  table.sort(pdfs, function(a,b) return a.name < b.name end)

  -- ---------- BREADCRUMBS ----------
  local crumbs = {}
  local path = ""
  table.insert(crumbs, "<a data-ref='/explorer:' href='/explorer:'>Root</a>")
  for part in folderPrefix:gmatch("([^/]+)/") do
    path = path .. part .. "/"
    table.insert(crumbs,
      "<a data-ref='/explorer:" .. path .. "' href='/explorer:" .. path .. "'>" .. part .. "</a>"
    )
  end
  local breadcrumbHtml =
    "<div class='explorer-breadcrumbs'>" ..
      table.concat(crumbs, "<span class='sep'>/</span>") ..
    "</div>"

  -- ---------- EXPLORER ----------
  local html =
    "<div class='document-explorer-wrapper'>" ..
      breadcrumbHtml ..
      "<div class='document-explorer' style='max-height:" .. height .. ";'>"

  -- Parent folder
  if folderPrefix ~= "" then
    local parent = folderPrefix:gsub("[^/]+/$", "")
    html = html ..
      "<a class='image-tile folder-tile' data-ref='/explorer:" .. parent .. "' href='/explorer:" .. parent .. "'>" ..
        "<div class='folder-icon'>📂</div>" ..
        "<div class='image-title'>..</div>" ..
      "</a>"
  end

  -- Folders
  for _, f in ipairs(folders) do
    html = html ..
      "<a class='image-tile folder-tile' data-ref='/explorer:" .. folderPrefix .. f .. "/' href='/explorer:" .. folderPrefix .. f .. "/'>" ..
        "<div class='folder-icon'>📁</div>" ..
        "<div class='image-title'>" .. f .. "</div>" ..
      "</a>"
  end

  -- Markdown files
  for _, md in ipairs(mds) do
    html = html ..
      "<a class='image-tile md-tile' data-ref='/" .. md.full:gsub("%.md$", "") .. "' href='/" .. md.full:gsub("%.md$", "") .. "' title='" .. md.full .. "'>" ..
        "<div class='md-icon'>📝</div>" ..
        "<div class='image-title'>" .. md.name .. "</div>" ..
      "</a>"
  end

  -- PDF files
  for _, pdf in ipairs(pdfs) do
    html = html ..
      "<a class='image-tile pdf-tile' data-ref='/" .. pdf.full .. "' href='/" .. pdf.full .. "' title='" .. pdf.full .. "'>" ..
        "<div class='pdf-icon'>📄</div>" ..
        "<div class='image-title'>" .. pdf.name .. "</div>" ..
      "</a>"
  end

  -- Images
  for _, img in ipairs(images) do
    html = html ..
      "<a class='image-tile' data-ref='/" .. img.full .. "' href='/.fs/" .. img.full .. "' title='" .. img.full .. "'>" ..
        "<div class='image-thumb'>" ..
          "<img src='/.fs/" .. img.full .. "' loading='lazy' />" ..
        "</div>" ..
        "<div class='image-title'>" .. img.name .. "</div>" ..
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

virtualPage.define {
  pattern = "explorer:?(.*)",
  run = function(path)
    local folder = path or ""
    if folder ~= "" and not folder:match("/$") then
      folder = folder .. "/"
    end
    return "\n${widgets.documentExplorer(\"" .. folder .. "\", \"75vh\")}\n"
  end
}

```

## Styling:

```space-style

/* ---------- FILE EXTENSION LABEL ---------- */
.md-tile,
.pdf-tile {
  position: relative; 
}

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

.md-tile::after {
  content: "MD";
  background: oklch(0.55 0.23 260 / 0.6); /* blue */
}

.pdf-tile::after {
  content: "PDF";
  background: oklch(0.55 0.23 30 / 0.6); /* red */
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

.pdf-icon {
  font-size: 4rem;
  margin-top: 26px;
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

.md-icon {
  font-size: 4rem;
  margin-top: 26px;
}

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
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-auto-rows: 190px;
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

  background: var(--editor-code-background-color);
  border-radius: 8px;
  overflow: hidden;

  box-shadow: 0 2px 6px oklch(0 0 0 / 0.25);
}

.folder-tile {
  align-items: center;
  justify-content: center;
}

.folder-icon {
  font-size: 4rem;
  margin-top: 26px;
}

.image-thumb {
  height: 150px;
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
  background-color: oklch(0.65 0 0 / 0.3); /* neutral grey */
}

.image-tile:hover img {
  transform: scale(1.05);
  transition: transform 0.25s ease;
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
  0% {
    opacity: 0.6;
    transform: translateY(30px) scaleX(0.3);
    filter: blur(5px);
  }
  11% {
    opacity: 1;
    transform: translateY(0) scaleX(1);
    filter: blur(0);
  }
  90% {
    opacity: 1;
    transform: translateY(0) scaleX(1);
    filter: blur(0);
  }
  100% {
    opacity: 0.6;
    transform: translateY(-30px) scaleX(0.3);
    filter: blur(5px);
  }
}

```


## Discussions to this library
* [SilverBullet Community](https://community.silverbullet.md/t/document-explorer-image-gallery-for-silverbullet/3647?u=mr.red)
