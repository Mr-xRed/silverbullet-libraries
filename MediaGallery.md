---
name: "Library/Mr-xRed/MediaGallery"
tags: meta/library
pageDecoration.prefix: "🖼️ "
---

# Media Gallery (Widget + Virtual Page)

A configurable, client-side media gallery widget that renders your media pages as a searchable, paginated grid with posters/covers.

## **Main features**

*   🖼 **Responsive grid layout** with configurable tile size and pagination
    
*   🔍 **Live filtering** across titles, metadata, plots, genres, and cast
    
*   🧩 **Type-aware defaults** for movies, series, and books (fully overridable)
    
## Acces it:
Virtual Pages: [[mediaGallery:books]], [[mediaGallery:movies]], [[mediaGallery:series]]
or
Add as Widget to any page: `${widgets.mediaGallery("books","180px","12")}`

## Configuration: Example for Pages:

![Pages Configuration Example](https://raw.githubusercontent.com/Mr-xRed/silverbullet-libraries/refs/heads/main/MediaGallery_config.png)

## Configuration: Example for Objects:

![Objects Configuration Example](https://raw.githubusercontent.com/Mr-xRed/silverbullet-libraries/refs/heads/main/MediaGallery_objects_config.png)
## Configuration Example and Field description:

```
config.set("mediaGallery",{
  tileSize = "180px", -- default value for Virtual Page or if not specified in widget
  pageItems = 12,     -- default value for Virtual Page or if not specified in widget
  custom = {
    {"page", "movie", {"title", "year", "runtime","director"}, "score", "cover", {"plot", "actors","genre"}}
    {"object","person",{"name","birthday","phone","emoji"}},
  }
}) 

-- 1st. - data source: `page` or `object`
-- 2nd. - data source: tag name, is also the Virtual Page tag e.g. [[mediaGaller:movie]]
-- 3rd. - {array}: title & detail source with up to 5x elements
-- 4th. - attribute name for score field
-- 5th. - attribute name for the image URL
-- 6th. - {array}: custom filter attributes to include in the live filter other than already specified in title & details

```

## Status-specific badge colors

```space-style
/* Status-specific badge colors */
.media-score[data-status="to-read"] {
  background: oklch(0.6 0.18 20); /* Reddish */
  box-shadow: 0 0 5px rgba(0,0,0,1);
  color: white;
}

.media-score[data-status="done"] {
  background: oklch(0.6 0.18 140); /* Greenish */
  box-shadow: 0 0 5px rgba(0,0,0,1);
  color: white;
}

.media-score[data-status="reading"] {
  background: oklch(0.6 0.18 250); /* Bluish */
  box-shadow: 0 0 5px rgba(0,0,0,1);
  color: white;
}
```


## Implementation

```space-lua
-- Configuration Defaults
local cfg = config.get("mediaGallery") or {}
local tileSize = cfg.tileSize or "160px" -- default for posters
local pageItems = cfg.pageItems or 14 -- pagination limit

-- Default templates for specific types if not overridden in config
local tagDefaults = {
  ["movie"] = {"page", "movie", {"title", "year", "runtime","director"}, "score", "cover", {"plot", "actors", "genre"}},
  ["series"] = {"page", "series", {"title", "year", "writer", "runtime", "actors"}, "imdb_rating", "poster", {"actors", "plot", "genre"}},
  ["book"] = {"page", "book", {"title", "author", "year"}, "score", "cover", {"description", "publisher", "genre"}},
}

function widgets.mediaGallery(mediaType, customTileSize, customPageItems)
  -- 1. Determine the tag and configuration
  -- Use provided arguments or fall back to defaults
  local currentTileSize = customTileSize or tileSize
  local currentPageItems = tonumber(customPageItems) or pageItems
  
  -- Generate a unique ID for this specific widget instance to prevent crosstalk
  local uid = "mg_" .. mediaType:gsub("%W", "") .. "_" .. math.random(1000, 9999)
  
  -- We look for the mediaType directly in tagDefaults or custom config
  local tag = mediaType
  local currentCfg = nil
  
  -- Check user's custom config first
  for _, entry in ipairs(cfg.custom or {}) do
      if entry[2] == tag then -- Index 2 is now the tag name
          currentCfg = entry
          break
      end
  end
  
  -- Use type-specific defaults or global fallback if no custom config exists
  if not currentCfg then
      -- Attempt to find a match in tagDefaults (handling singular/plural if needed)
      currentCfg = tagDefaults[tag] or tagDefaults[tag:gsub("s$", "")] or {"object", tag, {"title", "year"}, "score", "cover", {"director", "plot", "actors", "genre"}}
  end
  
  -- The actual tag and mode used for the query
  local queryMode = currentCfg[1]
  local queryTag = currentCfg[2]
  -- 2. Execute the query
  local items
  if queryMode == "page" then
--     items = query[[from index.tag(page) where type == queryTag order by title]]
        items = query[[from index.tag("page") where type == queryTag order by title]]
  else
      items = query[[from index.tag(queryTag) order by title]]
  end
  
  -- 3. Build the HTML
  -- We wrap everything in a unique container ID to scope the JS logic
  local html = "<div id='" .. uid .. "' class='media-grid-instance'>"
  
  html = html .. [[
    <div class="media-controls">
      <div class="media-filter-container">
        <label class="media-filter-label">Filter: </label>
        <input type="text" id="media-search" class="media-search-input" placeholder="Search by title, director, genre, plot..." />
      </div>
      <div class="media-pagination"></div>
    </div>
  ]]
  
  html = html .. "<div class='media-gallery-wrapper' style='--poster-width: " .. currentTileSize .. ";'>"
  
  if #items == 0 then
     return "<div class='media-empty-state'>No items found for tag: <code>" .. queryTag .. "</code></div>"
  end

  for _, item in ipairs(items) do
    -- Map attributes from config
    local titleFields = currentCfg[3] or {}
    local scoreField = currentCfg[4] or "score"
    local imageField = currentCfg[5] or "cover"
    local filterFields = currentCfg[6] or {}
    
    local poster = item[imageField] or item.poster or ""
    local title = item[titleFields[1]] or "Untitled"
    local score = item[scoreField] or item.imdb_rating or ""
    local link = "/" .. item.ref
    
    -- Build Metadata Rows (Row 2 up to Row 6)
    local metaRowsHtml = ""
    for i = 2, 6 do
        if titleFields[i] and item[titleFields[i]] then
            local val = item[titleFields[i]]
            if type(val) == "table" then val = table.concat(val, ", ") end
            metaRowsHtml = metaRowsHtml .. "<div class='media-meta-row row-" .. i .. "'>" .. tostring(val) .. "</div>"
        end
    end
    
    -- Build Filter Content
    local searchTerms = {}
    for _, f in ipairs(titleFields) do 
        local val = item[f]
        if type(val) == "table" then
            table.insert(searchTerms, table.concat(val, " "))
        else
            table.insert(searchTerms, tostring(val or ""))
        end
    end
    table.insert(searchTerms, tostring(score))
    for _, f in ipairs(filterFields) do
        local val = item[f]
        if type(val) == "table" then
            table.insert(searchTerms, table.concat(val, " "))
        else
            table.insert(searchTerms, tostring(val or ""))
        end
    end
    
    local filterContent = string.lower(table.concat(searchTerms, " "))
    
    -- Hide score badge if "0", empty, or N/A
    local scoreHtml = ""
    if score ~= "" and score ~= "0" and score ~= 0 and score ~= "N/A" then
        -- Generate a data-status attribute for CSS styling based on the content
        local statusAttr = ""
        if type(score) == "string" then
            statusAttr = " data-status='" .. score:lower():gsub("%s+", "-") .. "'"
        end
        scoreHtml = "<div class='media-score'" .. statusAttr .. ">" .. score .. "</div>"
    end
    
    -- Fallback for missing images
    local imageHtml = ""
    if poster ~= "" then
      imageHtml = "<img src='" .. poster .. "' loading='lazy' alt='" .. title .. "' />"
    else
      imageHtml = "<div class='media-poster-placeholder'><span>" .. title:sub(1,1) .. "</span></div>"
    end

    -- Render the Card
    html = html .. 
      "<a class='media-card' href='" .. link .. "' data-ref='" .. link .. "' data-filter='" .. filterContent .. "'>" ..
        "<div class='media-poster'>" .. 
          imageHtml ..
          scoreHtml ..
        "</div>" ..
        "<div class='media-info'>" ..
          "<div class='media-title'>" .. title .. "</div>" ..
          "<div class='media-meta'>" ..
              metaRowsHtml ..
          "</div>" ..
        "</div>" ..
      "</a>"
  end

  html = html .. "</div></div>"

  -- Injecting JS logic using the bridge
  local scriptEl = js.window.document.createElement("script")
  scriptEl.innerHTML = [[
    (function() {
        const uid = "]] .. uid .. [[";
        let currentPage = 1;
        const itemsPerPage = ]] .. currentPageItems .. [[;
        
        const init = () => {
            const root = document.getElementById(uid);
            if (!root) return false;

            const input = root.querySelector(".media-search-input");
            const paginationContainer = root.querySelector(".media-pagination");
            const galleryWrapper = root.querySelector(".media-gallery-wrapper");
            
            if (!input || !paginationContainer || !galleryWrapper) return false;

            const updateDisplay = () => {
                const rawQuery = input.value.toLowerCase().trim();
                const keywords = rawQuery.split(/\s+/).filter(k => k.length > 0);
                const allCards = Array.from(galleryWrapper.querySelectorAll(".media-card"));
                
                const filteredCards = allCards.filter(card => {
                    const data = card.getAttribute("data-filter") || "";
                    return keywords.every(word => data.includes(word));
                });

                allCards.forEach(c => c.style.display = "none");

                const totalItems = filteredCards.length;
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                
                if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
                
                const start = (currentPage - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                
                filteredCards.slice(start, end).forEach(card => {
                    card.style.display = "flex";
                });

                renderPagination(totalPages);
            };

            const renderPagination = (totalPages) => {
                paginationContainer.innerHTML = "";
                if (totalPages <= 1) return;

                const createBtn = (page, text, active = false) => {
                    const btn = document.createElement("button");
                    btn.textContent = text || page;
                    btn.className = "page-btn" + (active ? " active" : "");
                    btn.onclick = (e) => {
                        e.preventDefault();
                        currentPage = page;
                        updateDisplay();
                        root.scrollIntoView({behavior: 'smooth', block: 'start'});
                    };
                    return btn;
                };

                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(totalPages, startPage + 4);
                if (endPage === totalPages) startPage = Math.max(1, endPage - 4);

                if (startPage > 1) {
                    paginationContainer.appendChild(createBtn(1));
                    if (startPage > 2) paginationContainer.appendChild(document.createTextNode("..."));
                }

                for (let i = startPage; i <= endPage; i++) {
                    paginationContainer.appendChild(createBtn(i, i, i === currentPage));
                }

                if (endPage < totalPages) {
                    if (endPage < totalPages - 1) paginationContainer.appendChild(document.createTextNode("..."));
                    paginationContainer.appendChild(createBtn(totalPages, totalPages));
                }
            };

            input.addEventListener("input", () => {
                currentPage = 1;
                updateDisplay();
            });

            updateDisplay();
            return true;
        };

        // Retry mechanism to ensure the DOM is ready
        let attempts = 0;
        const timer = setInterval(() => {
            if (init() || attempts > 20) clearInterval(timer);
            attempts++;
        }, 100);
    })();
  ]]
  js.window.document.body.appendChild(scriptEl)

  return widget.new {
    display = "block",
    html = html
  }
end

-- Define the Virtual Page: mediaGallery:<type>
virtualPage.define {
  pattern = "mediaGallery:(.*)",
  run = function(mediaType)
    mediaType = mediaType or "movie"
    local header = "# Gallery: " .. mediaType:upper()
    return header .. "\n${widgets.mediaGallery(\"" .. mediaType .. "\",\"" .. tileSize .. "\",\"" .. pageItems .. "\")}\n"
  end
}
```

## Widget Styling


```space-style
/* ---------- CONTROLS ---------- */
.media-controls {
  padding: 0 20px 10px 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.media-filter-container {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-grow: 1;
}

.media-filter-label {
  font-weight: 600;
  font-size: 0.9em;
  color: var(--text-muted);
  white-space: nowrap;
}

#media-search {
  width: 100%;
  max-width: 400px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid var(--hr-color);
  background: var(--embed-background);
  color: var(--text-normal);
  font-size: 0.9em;
  outline: none;
}

/* ---------- PAGINATION ---------- */
.media-pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85em;
  color: var(--text-muted);
}

.page-btn {
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid var(--hr-color);
  background: var(--embed-background);
  color: var(--text-normal);
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover {
  background: var(--hr-color);
}

.page-btn.active {
  background: var(--link-color);
  color: white;
  border-color: var(--link-color);
}

/* ---------- WRAPPER ---------- */
.media-gallery-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--poster-width), 1fr));
  gap: 24px;
  padding: 20px;
}

.media-empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-style: italic;
}

/* ---------- CARD BASE ---------- */
.media-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  border-radius: 12px;
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.media-card:hover {
  transform: translateY(-5px);
}

/* ---------- POSTER AREA ---------- */
.media-poster {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  background-color: oklch(0.25 0 0);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px oklch(0 0 0 / 0.3);
}

.media-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-poster-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 3em;
  font-weight: bold;
  color: oklch(1 0 0 / 0.2);
  background: linear-gradient(135deg, oklch(0.3 0 0), oklch(0.2 0 0));
}

.media-score {
  position: absolute;
  top: 8px;
  right: 8px;
  background: oklch(0.95 0.16 90 / 0.95);
  color: oklch(0.2 0.05 90);
  font-weight: 800;
  font-size: 0.85em;
  padding: 4px 8px;
  border-radius: 6px;
  z-index: 2;
  text-transform: capitalize;
}

/* ---------- INFO AREA ---------- */
.media-info {
  padding: 12px 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.media-title {
  font-weight: 600;
  font-size: 1em;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-normal);
  margin-bottom: 2px;
}

.media-meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.media-meta-row {
  font-size: 0.8em;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.85;
}

.row-2 { font-weight: 500; color: var(--text-normal); opacity: 0.9; }
.row-3 { opacity: 0.8; }
.row-4, .row-5, .row-6 { opacity: 0.65; font-size: 0.75em; }
```

## Discussions to this library
* [SilverBullet Community](https://community.silverbullet.md/t/simple-media-gallery-for-books-movie-tv-series-games-etc/3795?u=mr.red)
