---
name: Library/Mr-xRed/MediaManager
tags: meta/library
pageDecoration.prefix: "🧰 "
---

# Media Manager for SilverBullet

A unified media library for SilverBullet that lets you search, fetch, and store **books, movies, and TV series** as structured pages with rich metadata.

## Usage: ${widgets.commandButton("Media Manager: Add Item")}

## **Main features**

*   📚 **[Books via Open Library](https://community.silverbullet.md/t/add-book-note-via-openlibrary-metadata-lbrary/3770)** with authors, ISBNs, covers, and cleaned descriptions (shoutout to [jamesravey](https://community.silverbullet.md/u/jamesravey))
    
*   🎬 **Movies & TV series via OMDb**, including ratings, posters, cast, and IMDb links
    
*   🧠 **Smart templates & filenames** with automatic folder organisation
    
*   🧼 **Cleaned metadata** (sanitised filenames and descriptions)
    

> **warning** OMDb API key
> To use **movies and TV series**, you must configure a **free
> Get one at [**omdbapi.com**](https://omdbapi.com/apikey.aspx) and add it to your SilverBullet config.


## Configuration Examples

```lua
config.set("bookmanager",{
  prefix = "MediaDB/Books/",
  filenameTemplate = [==[${title} (${first_publish_year})]==],
  pageTemplate = [==[---
type: "book"
title: "${title}"
year: "${first_publish_year}"
author:
${author_block}
isbn: "${isbn}"
url: "https://openlibrary.org${olid}"
tags: "mediaDB/book"
dataSource: "OpenLibraryAPI"
cover: "${cover_image_url}"
description: "${description}"
---
# ${title} - ${author_name[1]} (${first_publish_year})
]==]
})


config.set("omdbmanager", {
    omdb_apikey = "abc123"
})
```

## Implementation
```space-lua
-- ==============================
--  Media Manager: Core Logic
-- ==============================

local MediaManager = {}

-- Utility functions for data sanitization
MediaManager.utils = {
    sanitizeFilename = function(text)
        local safe = string.gsub(text, "[/%\\:'\"%*%?%<%>%|]", "")
        return string.gsub(safe, "%s+", " ")
    end,

    cleanDescription = function(text)
        if not text or text == "" then return "" end
        
        local function cut_at_first_marker(t)
            local lower = string.lower(t)
            local markers = {
                "([source", "[source", "----------", "preceded by:", 
                "see also:", "followed by:", "contains:"
            }
            local first_pos = nil
            for _, m in ipairs(markers) do
                local s = string.find(lower, m, 1, true)
                if s and (not first_pos or s < first_pos) then
                    first_pos = s
                end
            end
            return first_pos and string.sub(t, 1, first_pos - 1) or t
        end

        local d = cut_at_first_marker(text)
        d = string.gsub(d, "%b[]%b()", "")
        d = string.gsub(d, "%[%d+%]", "")
        d = string.gsub(d, "%[%d+%]:%s*https?://%S+", "")
        d = string.gsub(d, "%[source%]", "")
        d = string.gsub(d, "%[Source%]", "")
        d = string.gsub(d, "https?://%S+", "")
        d = string.gsub(d, "[\r\n]+", " ")
        d = string.gsub(d, "%s+", " ")
        d = string.gsub(d, '"', '”')
        return string.gsub(d, "^%s*(.-)%s*$", "%1")
    end
}

-- OMDb Shared Logic 
local function createOMDbProvider(typeParam, configName)
    return {
        configKey = configName,
        search = function(queryString)
            local cfg = config.get(configName) or {}
            local apiKey = cfg.omdb_apikey
            
            if not apiKey or apiKey == "" then
                editor.flashNotification("Error: OMDb API Key missing in '" .. configName .. "' config.")
                return nil
            end

            local url = "https://www.omdbapi.com/?apikey=" .. apiKey .. "&type=" .. typeParam .. "&s=" .. string.gsub(queryString, " ", "+")
            local resp = net.proxyFetch(url, { method = "GET", headers = { Accept = "application/json" } })

            if not resp.ok then error("Failed to fetch from OMDb: " .. resp.status) end
            local data = resp.body
            
            if data.Response == "False" then
                editor.flashNotification("No " .. typeParam .. " found: " .. (data.Error or ""))
                return nil
            end

            local options = {}
            for i, doc in ipairs(data.Search) do
                options[i] = {
                    name = doc.Title,
                    value = i,
                    description = string.format("Year: %s", doc.Year)
                }
            end
            
            local result = editor.filterBox("Select " .. typeParam .. ":", options)
            return result and data.Search[result.value] or nil
        end,

        mapData = function(item)
            local cfg = config.get(configName) or {}
            local apiKey = cfg.omdb_apikey
            
            -- Fetch full details
            local url = "https://www.omdbapi.com/?apikey=" .. apiKey .. "&i=" .. item.imdbID
            local resp = net.proxyFetch(url, { method = "GET", headers = { Accept = "application/json" } })
            
            local details = item -- fallback
            if resp.ok then
                details = resp.body
            end

            local safeItem = {}
            -- Map OMDb fields to Frontmatter fields
            safeItem['title'] = details.Title or "Unknown"
            safeItem['year'] = details.Year or ""
            safeItem['rated'] = details.Rated or ""
            safeItem['released'] = details.Released or ""
            safeItem['runtime'] = details.Runtime or ""
            safeItem['genre'] = details.Genre or ""
            safeItem['director'] = details.Director or ""
            safeItem['writer'] = details.Writer or ""
            safeItem['actors'] = details.Actors or ""
            safeItem['plot'] = MediaManager.utils.cleanDescription(details.Plot)
            safeItem['description'] = safeItem['plot'] -- using plot as description
            safeItem['language'] = details.Language or ""
            safeItem['country'] = details.Country or ""
            safeItem['awards'] = details.Awards or ""
            safeItem['poster'] = (details.Poster and details.Poster ~= "N/A") and details.Poster or ""
            safeItem['metascore'] = details.Metascore or ""
            safeItem['imdb_rating'] = details.imdbRating or ""
            safeItem['imdb_votes'] = details.imdbVotes or ""
            safeItem['imdb_id'] = details.imdbID or ""
            safeItem['type'] = details.Type or typeParam
            safeItem['score'] = details.imdbRating or ""
            safeItem['imdb_link'] = "https://imdb.com/title/" .. (details.imdbID or "")

            return safeItem
        end
    }
end

-- Providers Registry
MediaManager.providers = {
    book = {
        configKey = "bookmanager",
        search = function(queryString)
            local url = "https://openlibrary.org/search.json?q=" .. string.gsub(queryString, " ", "+")
            local resp = net.proxyFetch(url, { method = "GET", headers = { Accept = "application/json" } })

            if not resp.ok then error("Failed to fetch from Open Library: " .. resp.status) end
            local data = resp.body
            if #data.docs == 0 then return nil end

            local options = {}
            for i, doc in ipairs(data.docs) do
                options[i] = {
                    name = doc.title,
                    value = i,
                    description = string.format("By %s, published %s", doc.author_name, doc.first_publish_year)
                }
            end
            
            local result = editor.filterBox("Select:", options)
            return result and data.docs[result.value] or nil
        end,

        mapData = function(book)
            local safeBook = {}
            for k in {'title','first_publish_year','author_name', 'isbn'} do
                safeBook[k] = book[k] or "Unknown"
            end
            
            -- Fix: Map first_publish_year to year for the filename template
            safeBook['year'] = book['first_publish_year'] or "Unknown"
            
            safeBook['olid'] = book['key']
            safeBook['cover_image_url'] = book.cover_i and ("https://covers.openlibrary.org/b/id/" .. book.cover_i .. "-L.jpg") or ""

            -- Build dynamic author block
            local author_lines = {}
            if type(book.author_name) == "table" then
                for _, name in ipairs(book.author_name) do
                    table.insert(author_lines, '  - "' .. name .. '"')
                end
            end
            safeBook['author_block'] = table.concat(author_lines, "\n")

            -- ISBN Extraction Logic
            local function extract_first_isbn(b)
                if not b then return nil end
                if type(b.isbn) == "table" and #b.isbn > 0 then return b.isbn[1]
                elseif type(b.isbn) == "string" then return b.isbn end
                if type(b.isbn_13) == "table" and #b.isbn_13 > 0 then return b.isbn_13[1] end
                if type(b.isbn_10) == "table" and #b.isbn_10 > 0 then return b.isbn_10[1] end

                local edition = b.cover_edition_key or (type(b.edition_key) == "table" and b.edition_key[1]) or nil
                if edition then
                    local ed_url = "https://openlibrary.org/books/" .. edition .. ".json"
                    local ed_resp = net.proxyFetch(ed_url, { method = "GET", headers = { Accept = "application/json" } })
                    if ed_resp.ok then
                        local ed = ed_resp.body
                        if type(ed.isbn_13) == "table" and #ed.isbn_13 > 0 then return ed.isbn_13[1] end
                        if type(ed.isbn_10) == "table" and #ed.isbn_10 > 0 then return ed.isbn_10[1] end
                    end
                end
                return nil
            end

            local found_isbn = extract_first_isbn(book)
            safeBook['isbn'] = (found_isbn and found_isbn ~= "") and found_isbn or "Unknown"

            -- Description Fetching Logic
            local description_text = ""
            if book.key then
                local work_url = "https://openlibrary.org" .. book.key .. ".json"
                local work_resp = net.proxyFetch(work_url, { method = "GET", headers = { Accept = "application/json" } })
                if work_resp.ok then
                    local w = work_resp.body
                    if w.description then
                        description_text = (type(w.description) == "table") and (w.description.value or "") or (w.description or "")
                    elseif w.first_sentence then
                        description_text = (type(w.first_sentence) == "table") and (w.first_sentence.value or "") or (w.first_sentence or "")
                    end
                end
            end
            safeBook['description'] = MediaManager.utils.cleanDescription(description_text)

            return safeBook
        end
    },
    movie = createOMDbProvider("movie", "omdbmanager"),
    series = createOMDbProvider("series", "omdbmanager")
}

-- Main Orchestrator
function MediaManager.addMedia(typeKey)
    local provider = MediaManager.providers[typeKey]
    if not provider then return end

    local cfg = config.get(provider.configKey) or {}
    
    -- Smart Default Prefix Logic
    local defaultPrefix
    if typeKey == "series" then
        defaultPrefix = "MediaDB/TVSeries/"
    elseif typeKey == "movie" then
        defaultPrefix = "MediaDB/Movies/"
    elseif typeKey == "book" then
        defaultPrefix = "MediaDB/Books/"
    else  
        local capitalized = typeKey:sub(1,1):upper() .. typeKey:sub(2)
        defaultPrefix = "MediaDB/" .. capitalized .. "s/"
    end

    local pagePrefix = cfg.prefix or defaultPrefix
    
    local filenameTemplateStr = cfg.filenameTemplate or [==[${title} (${year})]==]
    
    -- Default templates based on type
    local defaultPageTemplate = [==[---
type: "book"
title: "${title}"
year: "${first_publish_year}"
author:
${author_block}
isbn: "${isbn}"
url: "https://openlibrary.org${olid}"
tags: "mediaDB/book"
dataSource: "OpenLibraryAPI"
cover: "${cover_image_url}"
description: "${description}"
---
# ${title} - ${author_name[1]} (${first_publish_year})
]==]

    if typeKey == "movie" or typeKey == "series" then
        defaultPageTemplate = [==[---
type: "${type}"
title: "${title}"
description: "${description}"
genre: "${genre}"
rated: "${rated}"
score: "${score}"
year: "${year}"
released: "${released}"
poster: "${poster}"
imdb_link: "${imdb_link}"
runtime: "${runtime}"
director: "${director}"
writer: "${writer}"
actors: "${actors}"
imdb_rating: "${imdb_rating}"
plot: "${plot}"
---
# ${title} (${year})

![Poster](${poster})
]==]
    end

    local pageTemplateStr = cfg.pageTemplate or defaultPageTemplate

    local queryString = editor.prompt("Search for " .. typeKey .. ":")
    if not queryString then return end

    print("Searching for " .. typeKey .. ": " .. queryString)
    
    local rawData = provider.search(queryString)
    if not rawData then
        return
    end
    
    local safeData = provider.mapData(rawData)
    local titleTemplate = template.new(filenameTemplateStr)
    local rawTitle = titleTemplate(safeData)
    local safeTitle = MediaManager.utils.sanitizeFilename(rawTitle)
    local pageName = pagePrefix .. safeTitle

    if not space.pageExists(pageName) then
        local pageTemplate = template.new(pageTemplateStr)
        local content = pageTemplate(safeData)
        space.writePage(pageName, content)
        editor.flashNotification(typeKey:gsub("^%l", string.upper) .. " added: " .. safeTitle)
    else
        editor.flashNotification(typeKey:gsub("^%l", string.upper) .. " already in collection: " .. safeTitle)
    end
    
    editor.navigate(pageName)
end


command.define {
  name = "Media Manager: Add Item",
  run = function()
    local options = {
        { name = "Book", value = "book", description = "Search Open Library" },
        { name = "Movie", value = "movie", description = "Search OMDb Movies" },
        { name = "TV Series", value = "series", description = "Search OMDb TV Series" }
    }
    local selection = editor.filterBox("Add to Media Database:", options)
    
    if selection then
        MediaManager.addMedia(selection.value)
    end
  end
}
```


## Discussions to this library
* [SilverBullet Community](https://community.silverbullet.md/t/simple-media-gallery-for-books-movie-tv-series-games-etc/3795?u=mr.red)
