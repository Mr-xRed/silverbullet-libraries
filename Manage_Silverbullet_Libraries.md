---
name: "Library/Mr-xRed/Manage_Silverbullet_Libraries"
pageDecoration.prefix: "☠️ "
tags: meta
---

> **warning** DEPRECATED
> This library will no longer receive updates. And all Functions&Commands have been disactivated.
> Use the official ✨[[Library/Std/Pages/Library Manager]]✨ instead.

# Manage SilverBullet Libraries 

${widgets.commandButton("Import: URL")} | ${widgets.commandButton("Import: Browse GitHub Repositories")} | ${widgets.commandButton("Update All Github Libraries","Import: Check & Update All GitHub Libraries")} | ${widgets.commandButton("Update All Markdown Libraries","Import: Update All Raw-Markdown Libraries")} | ${widgets.commandButton("Import: Check All Github Update Statuses")}


# 📥 Imported Silverbullet-Libraries

${buildTable(query[[from index.tag "page" where githubUrl != nil or source == "markdown-import" 
select {
  ref = ref,
  maintainer = (githubUrl and githubUrl:match("github%.com/([^/]+)/")) or "",
  githubUrl = githubUrl,
  sourceUrl = sourceUrl,
  status = (
      (not updateDate or updateDate == "" or updateDate == nil  
      or not lastCommitDate or lastCommitDate == "" or lastCommitDate == nil ) and "⚪ Unknown"
      or updateDate < lastCommitDate and "🔴 Outdated" or "🟢 Up to date"),
   last_updated = (updateDate and parse_datetime(updateDate)) 
    and os.date("%y.%m.%d %H:%M", parse_datetime(updateDate)) or "",
   last_commit = (lastCommitDate and parse_datetime(lastCommitDate)) 
    and os.date("%y.%m.%d %H:%M", parse_datetime(lastCommitDate)) or ""
  }
order by updateDate]])}

> **warning** To see the interactive table (above) you need the latest edge build: 
> **SilverBullet 2.2.1--gf44f00f** or newer

> **success** Fallback-Table
> As a fallback for **2.1.9** or lower, you can see your imported libraries in the following non interactive table

${query[[from index.tag "page" where githubUrl != nil or source == "markdown-import" 
select {
  ref = ref,
  Status = (
      (not updateDate or updateDate == "" or updateDate == nil  
      or not lastCommitDate or lastCommitDate == "" or lastCommitDate == nil ) and "⚪ Unknown"
      or updateDate < lastCommitDate and "🔴 Outdated" or "🟢 Up to date"),
   ["Last Commit"] = (lastCommitDate and parse_datetime(lastCommitDate)) 
    and os.date("%m-%d %H:%M", parse_datetime(lastCommitDate)) or "",
  ["Last Updated"] = (updateDate and parse_datetime(updateDate)) 
    and os.date("%m-%d %H:%M", parse_datetime(updateDate)) or "",
   Source = (githubUrl and "["..(githubUrl:match("github%.com/([^/]+)/")).."](".. githubUrl .. ")") or
          (sourceUrl and "[Markdown](" .. (sourceUrl or "") .. ")")
  }
order by updateDate]]}

# Available Commands

[[#🗂️ Import: Browse GitHub Repositories (Command)|🗂️ Import: Browse GitHub Repositories]] 
[[#🚀 Import: Check All Github Update Statuses (Command)|🚀 Import: Check All Github Update Statuses (Command)]]
[[#🚀 Import: Check & Update All GitHub Libraries (Command)|🚀 Import: Check & Update All GitHub Libraries (Command)]]
[[#🚀 Import: Update All Raw-Markdown Libraries (Command)|🚀 Import: Update All Raw-Markdown Libraries (Command)]]


# Configuration (example)

#### libraries.apiToken
* the API Token is only required if you exceed the 60 API calls per hour limit
* if you setup you Github API Token you have up to 5000 API calls per hour
  
> **note** To setup your free API Token log into your Github
> Go to **Settings** > **Developer settings** > **Personal access Tokens** > **Fine grained Tokens** > [**Generate new token**](https://github.com/settings/personal-access-tokens/new)
> You can use any token type — even one limited to *Public repositories (read-only access)*
  
#### libraries.defaultPath
* set your default path where you want your libraries to be saved

#### libraries.repos
* repos are in form of: `{"owner/repository","path"}`


```
config.set( "libraries", {
    apiToken = "YOUR_GITHUB_API_TOKEN", 
    defaultPath = "Library/Custom/",
    repos = {
              {"silverbulletmd/silverbullet-libraries",""}, -- {"owner/repository", "path"},
              {"Mr-xRed/silverbullet-libraries",""},
              {"malys/silverbullet-libraries","src"},
              {"janssen-io/silverbullet-libraries","Library"},
              {"ChenZhu-Xie/xczphysics_SilverBullet",""},
              {"zeus-web/Silverbullet_Libraries",""}
            }
})
```

# Implementation 

## 🗂️ Import: Browse GitHub Repositories (Command)
```
command.define {
  name = "Import: Browse GitHub Repositories",
  key = "Ctrl-Alt-s",
  mac = "Cmd-Alt-s",
  run = function()

    local importConfig = config.get("libraries") or {}
    local API_TOKEN = importConfig.apiToken
    local repos = importConfig.repos or {{"silverbulletmd/silverbullet-libraries",""}}
    local defaultPath = importConfig.defaultPath or "Library/Custom/"
    local askedAuth = false
    local useAuth = API_TOKEN and API_TOKEN ~= ""

    local function buildHeaders(useToken)
      local headers = { ["X-GitHub-Api-Version"] = "2022-11-28" }
      if useToken and API_TOKEN and API_TOKEN ~= "" then
        headers["Authorization"] = "Bearer " .. API_TOKEN
      end
      return headers
    end

    local function safeRequest(url)
      local resp = http.request(url, { headers = buildHeaders(useAuth) })
      -- only handle invalid auth once
      if resp.status == 401 and useAuth and not askedAuth then
        askedAuth = true
        local conf = editor.confirm("⚠️ Invalid or expired GitHub API token. Continue unauthenticated (limited requests) or cancel to fix it? Set an empty (apiToken = \"\") to skip this prompt next time.")
        if conf == false then
          editor.flashNotification("Cancelled to fix API Token", "error")
          return 
        end
        useAuth = false
        resp = http.request(url, { headers = buildHeaders(useAuth) })
      end
    return resp
    end
  
    -- Build repo options
    local repoOptions = {}
    for _, r in ipairs(repos) do
      local path = r[2] ~= "" and ("/"..r[2]) or ""
      table.insert(repoOptions, {
        name = r[1],
        value = "https://api.github.com/repos/" .. r[1] .. "/contents" .. path,
        description = "Browse files in " .. r[1] .. path
      })
    end

    local repoApi = editor.filterBox("🧩 Select a repository", repoOptions)
    if not repoApi then
      editor.flashNotification("No repository selected", "error")
      return
    end

    local currentUrl = repoApi.value
    local browsing = true
    local selectedItem = nil

    while browsing do
      local fileList = safeRequest(currentUrl)
      if not fileList.ok then
        editor.flashNotification("⚠️ Failed to fetch: " .. currentUrl, "error")
        return
      end

      local response = fileList.body
      if type(response) ~= "table" then
        editor.flashNotification("⚠️ Unexpected API response format", "error")
        return
      end

      local entries = {}
      for _, item in ipairs(response) do
        local icon = item.type == "dir" and "📁" or "📄"
        local desc = item.type == "file" and (item.size and (item.size .. " bytes") or "") or ""
        table.insert(entries, {
          name = icon .. " " .. item.name,
          value = item,
          description = desc
        })
      end

      -- Sort directories before files
      table.sort(entries, function(a, b)
        if a.value.type == b.value.type then
          return a.value.name:lower() < b.value.name:lower()
        end
        return a.value.type == "dir"
      end)

      -- Add ".." to go up one folder if not at repo root
      if currentUrl:match(".+/contents/.+") then
        local parentUrl = currentUrl:gsub("/[^/]+/?$", "")
        table.insert(entries, 1, {
          name = "📂 ..",
          value = { type = "dir", url = parentUrl },
        })
      end

      local browse = editor.filterBox("🔍 ", entries)
      if not browse then
        editor.flashNotification("Cancelled", "error")
        return
      end

      selectedItem = browse.value
      if selectedItem.type == "dir" then
        currentUrl = selectedItem.url
      else
        browsing = false
      end
    end

    -- --- HANDLE FILE AFTER LOOP ---
    if not selectedItem then
      editor.flashNotification("No file selected", "error")
      return
    end

    if not selectedItem.name:match("%.md$") then
      editor.flashNotification("⚠️ Selected file is not Markdown: " .. selectedItem.name, "error")
      return
    end

    local rawUrl = selectedItem.download_url
    local githubUrl = selectedItem.html_url
    local commitsUrl = selectedItem.url
    commitsUrl = commitsUrl:gsub("%?.*$", "")
    commitsUrl = commitsUrl:gsub("/contents/", "/commits?path=")

    local reqCommits = safeRequest(commitsUrl)
    if not reqCommits.ok then
      editor.flashNotification("⚠️ Failed to fetch commit info: " .. commitsUrl, "error")
      return
    end

    local commits = reqCommits.body or {}
    if #commits == 0 then
      editor.flashNotification("⚠️ No commits found for this file", "error")
      return
    end

    local lastCommit = commits[1]
    local lastCommitDate = lastCommit.commit.committer.date

    local fileReq = safeRequest(selectedItem.download_url)
    if not fileReq.ok then
      editor.flashNotification("⚠️ Failed to fetch file: " .. selectedItem.download_url, "error")
      return
    end

    local content = fileReq.body
    local fm = index.extractFrontmatter(content)

    -- Extract the last part of the path, without the .md
    local url = selectedItem.download_url
    local suggestedPath = url:match("^.*/([^/?#]+)%.md$")

    suggestedPath = defaultPath .. suggestedPath

    local localPath = editor.prompt("Save to", suggestedPath)
    if not localPath then
      return
    end

    if space.fileExists(localPath .. ".md") then
      editor.flashNotification("Page already exists", "error")
      return
    end

    -- Write page
    space.writePage(localPath, content)
    editor.flashNotification("Imported to " .. localPath)
    editor.navigate({kind="page", page=localPath})

    -- Patch frontmatter
    local updated = index.patchFrontmatter(editor.getText(), {
      {op="set-key", path="githubUrl", value=githubUrl},
      {op="set-key", path="rawUrl", value=rawUrl},
      {op="set-key", path="updateDate", value=os.date("%Y-%m-%dT%H:%M:%SZ")},
      {op="set-key", path="lastCommitDate", value=lastCommitDate}
    })
    editor.setText(updated)
  end
}
```

## 🧱 Build DOM Table to accept buttons (Function)

```lua
function buildTable(q)
  local rows = {}
  for r in q do
    table.insert(rows, dom.tr {
      dom.td { "[["..r.ref.."]]"},
      dom.td { r.status},
      dom.td { r.last_commit},
      dom.td { r.last_updated},
      dom.td { (r.githubUrl and "["..r.maintainer.."]("..r.githubUrl..")") or 
               (r.sourceUrl and "[Markdown]("..r.sourceUrl..")") },
      dom.td { widgets.button ("Update", function() updateLibrary(r.ref) end), 
               widgets.button ("Delete", function() deletePageButton(r.ref) end)
        }
     })
  end
  
  return widget.htmlBlock(dom.table{class = "manageLibraries",
    dom.thead {
      dom.tr {
        dom.td {"Name"},
        dom.td {"Status"},
        dom.td {"Last Commit"},
        dom.td {"Updated"},
        dom.td {"Source"},
        dom.td {"Action"}
      }
    },
    dom.tbody(rows)
  })
end

local function deletePageButton(page_to_delete)
            if editor.confirm("DELETE? ⚠️🔥 " .. page_to_delete .. "🔥⚠️ ") then
                space.deletePage(page_to_delete)
                codeWidget.refreshAll()
                editor.flashNotification("🗑️ Page deleted: " .. page_to_delete)
            else return
        end
end  
```

## 🖌 Buttons Style

```
.sb-notifications {
  position: fixed !important;
  z-index: 9999 !important;
}

:root {
  --btn-update-bg: oklch(50% 0.25 160);
  --btn-update-text: oklch(100% 0.05 160);
  --btn-update-border: oklch(70% 0.20 160);
  --btn-update-hover: oklch(70% 0.25 160);

  --btn-delete-bg: oklch(50% 0.25 30);
  --btn-delete-text: oklch(100% 0.05 30);
  --btn-delete-border: oklch(70% 0.20 30);
  --btn-delete-hover: oklch(70% 0.25 30);
}

table.manageLibraries td button {
  padding: 6px 12px !important;
  margin-inline: 4px;
  font-size: 0.95em;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background 0.25s ease,
    transform 0.15s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

/* UPDATE button */
table.manageLibraries td button:first-child {
  background: var(--btn-update-bg);
  color: var(--btn-update-text);
  border-color: var(--btn-update-border);
}

table.manageLibraries td button:first-child:hover {
  background: var(--btn-update-hover);
  border-color: color-mix(in oklch, var(--btn-update-hover), white 5%);
  box-shadow: 0 0 5px color-mix(in oklch, var(--btn-update-hover), white 15%);
  transform: scale(0.95);
}

/* DELETE button */
table.manageLibraries td button:last-child {
  background: var(--btn-delete-bg);
  color: var(--btn-delete-text);
  border-color: var(--btn-delete-border);
}

table.manageLibraries td button:last-child:hover {
  background: var(--btn-delete-hover);
  border-color: color-mix(in oklch, var(--btn-delete-hover), white 5%);
  box-shadow: 0 0 5px color-mix(in oklch, var(--btn-delete-hover), white 15%);
  transform: scale(0.95);
}

/* Optional: subtle elevation for a “modern” feel */
table.manageLibraries td button:active {
  transform: scale(0.90);
  box-shadow: 0 0 4px color-mix(in oklch, black, var(--btn-delete-bg) 20%);
}

```

## ⚙️ Check & Update GitHub Library (Function)
```
function updateLibraryFromGitHub(page)
  if not page then 
    editor.flashNotification("No page specified to update", "error")
    return
  end

  local original_text = space.readPage(page) or ""
  local parsed = index.extractFrontmatter(original_text)
  local fm = parsed.frontmatter or {}
  local url = fm.githubUrl
  local updateDate = fm.updateDate
  local lastCommitDate = fm.lastCommitDate  -- might be nil initially

  if not url or url == "" then
    editor.flashNotification("⚠️ No 'githubUrl' found in frontmatter: " .. page, "error")
    return
  end

  -- Convert GitHub URL to API URL to fetch latest commit
  local apiUrl = url
  apiUrl = apiUrl:gsub("^https://github%.com/", "https://api.github.com/repos/")
  apiUrl = apiUrl:gsub("/blob/main/", "/commits?path=")

  local req = http.request(apiUrl)
  if not req.ok then
    editor.flashNotification("⚠️ Failed to fetch commit info: " .. apiUrl, "error")
    return
  end

  local commits = req.body or {}
  if rawlen.commits == 0 or {} then
    editor.flashNotification("⚠️ No commits found for this file", "error")
    return
  end

  local lastCommit = commits[1] or {}
  local remoteCommitDate = lastCommit.commit.committer.date  -- ISO8601 string

  -- Treat missing dates as outdated
  if not updateDate or updateDate == "" or not remoteCommitDate or remoteCommitDate == "" then
    editor.flashNotification("⚠️ Missing date info — treating as outdated and updating.", "info")
  else
    -- Compare only if both exist
    if updateDate >= remoteCommitDate then
      editor.flashNotification("☑️ Already up-to-date.")
      -- Still patch lastCommitDate for record consistency
      local patched = index.patchFrontmatter(original_text, {
        {op="set-key", path="lastCommitDate", value=remoteCommitDate}
      })
      space.writePage(page, patched)
      return
    end
  end

  -- Convert GitHub URL to raw content URL
  local rawUrl = url
  rawUrl = rawUrl:gsub("^https://github%.com/", "https://raw.githubusercontent.com/")
  rawUrl = rawUrl:gsub("/blob/", "/")
  rawUrl = rawUrl:gsub("/tree/", "/")

  local contentReq = http.request(rawUrl)
  if not contentReq.ok then
    editor.flashNotification("⚠️ Update failed: could not fetch remote file: " .. url, "error")
    return
  end

  local newContent = contentReq.body or ""
  if newContent == "" then
    editor.flashNotification("⚠️ Fetched content is empty: " .. url, "error")
    return
  end

  -- Patch frontmatter with update info
  local patched = index.patchFrontmatter(newContent, {
    {op="set-key", path="githubUrl", value=url},
    {op="set-key", path="updateDate", value=os.date("%Y-%m-%dT%H:%M:%SZ")},
    {op="set-key", path="lastCommitDate", value=remoteCommitDate or ""}
  })

  space.writePage(page, patched)
  editor.flashNotification("✅ Page '" .. page .. "' updated. Commit: " .. (remoteCommitDate or "unknown"))
end
```

## ⚙️ Update Raw Markdown Library (Function)
```
-- Function to update a given Markdown page
function updateLibraryRawMarkdown(page)
  if not page then 
    editor.flashNotification("No page specified to update", "error") 
    return 
  end

  -- Get current text and frontmatter
  local original_text = space.readPage(page) or ""
  local parsed = index.extractFrontmatter(original_text)
  local fm = parsed.frontmatter or {}
  local url = fm.sourceUrl
  local interpreter = fm.source

  if not url or url == "" then
    editor.flashNotification("⚠️ No 'sourceUrl' found in frontmatter: " .. page, "error")
    return
  end

  local req = http.request(url)
  if not req.ok then
    js.log("Failed to fetch " .. url)
    editor.flashNotification("⚠️ Update failed: could not fetch remote file:" .. url, "error")
    return
  end

  local newContent = req.body or ""
  if newContent == "" then
    editor.flashNotification("⚠️ Fetched content is empty:" .. url, "error")
    return
  end

  -- Patch frontmatter instead of manually reconstructing
  local patched = index.patchFrontmatter(newContent, {
    {op="set-key", path="sourceUrl", value=url},
    {op="set-key", path="updateDate", value=os.date("%Y-%m-%dT%H:%M:%SZ")},
    {op="set-key", path="source", value=interpreter}
  })

  space.writePage(page, patched)
  editor.flashNotification("✅ Page: " .. page .. " updated")
end

```

## ⚙️ Check Update Status for a page (Function)
```
function checkLibraryUpdateStatus(page)
  if not page then return end

  local original_text = space.readPage(page) or ""
  local parsed = index.extractFrontmatter(original_text)
  local fm = parsed.frontmatter or {}
  local githubUrl = fm.githubUrl
  local updateDate = fm.updateDate

  if not githubUrl or githubUrl == "" then
    editor.flashNotification("⚠️ No 'githubUrl' found in frontmatter: " .. page, "error")
    return
  end

  -- Convert GitHub URL to API URL to fetch latest commit
  local apiUrl = githubUrl
        apiUrl = apiUrl:gsub("^https://github%.com/", "https://api.github.com/repos/")
        apiUrl = apiUrl:gsub("/blob/main/","/commits?path=")  -- gets commits for the file

  local req = http.request(apiUrl)
  if not req.ok then
    editor.flashNotification("⚠️ Failed to fetch commit info: " .. apiUrl, "error")
    return
  end

  local commits = req.body or {}
  if #commits == 0 then
    editor.flashNotification("⚠️ No commits found for this file", "error")
    return
  end

  local lastCommit = commits[1]
  local lastCommitDate = lastCommit.commit.committer.date  -- ISO8601 string
 
  -- Patch frontmatter with lastCommitDate
  local patched = index.patchFrontmatter(original_text, {
    {op="set-key", path="lastCommitDate", value=lastCommitDate}
  })
  space.writePage(page, patched)

  if updateDate and updateDate >= lastCommitDate then
    editor.flashNotification("✅ Page '"..page.."' is up-to-date")
  else
    editor.flashNotification("⚠️ Page '"..page.."' is outdated. Last commit: "..lastCommitDate)
  end
end

```

## ⚙️ Update Github or Markdown for specified page (Function)
```
function updateLibrary(page)
    local original_text = space.readPage(page)
    local fm = index.extractFrontmatter(original_text).frontmatter or {}
    local sourceUrl = fm.sourceUrl
    local githubUrl = fm.githubUrl
    if githubUrl or not githubUrl == "" then
        updateLibraryFromGitHub(page)
    elseif sourceUrl or not sourceUrl == "" then
        updateLibraryRawMarkdown(page)
    else editor.flashNotification("⚠️ No update URL found in frontmatter")
        return
    end
    codeWidget.refreshAll() 
end
```

## 🚀 Import: Check All Github Update Statuses (Command)
```
command.define {
  name = "Import: Check All Github Update Statuses",
  key = "Ctrl-Alt-h",
  mac = "Cmd-Alt-h",
  run = function()
  -- Query all pages with githubUrl
  local updatablePages = query[[from index.tag "page" where githubUrl != nil select ref order by githubUrl desc]]
  
  if not updatablePages or #updatablePages == 0 then
    editor.flashNotification("⚠️ No GitHub libraries found to check!")
    return
  end
  -- Loop through pages and check each
  for _, page in ipairs(updatablePages) do
    checkLibraryUpdateStatus(page)
  end
   codeWidget.refreshAll() 
   editor.flashNotification("✅ Status Updated!")
  return
end
}
```

## 🚀 Import: Check & Update All GitHub Libraries (Command)
```
command.define {
  name = "Import: Check & Update All GitHub Libraries",
  key = "Ctrl-Alt-g",
  mac = "Cmd-Alt-g",
  run = function()
  local updatablePages = query[[from index.tag "page" where githubUrl != nil select ref order by githubUrl desc ]]
  if not updatablePages or #updatablePages == 0 then
    editor.flashNotification("Nothing to update, try importing a library first!") 
    return
  end
    for _, pages in ipairs(updatablePages) do
      updateLibraryFromGitHub(pages)
    end
    codeWidget.refreshAll()
  return
end
}
```

## 🚀 Import: Update All Raw-Markdown Libraries (Command)

```
command.define {
  name = "Import: Update All Raw-Markdown Libraries",
  key = "Ctrl-Alt-m",
  mac = "Cmd-Alt-m",
  run = function ()
  local updatablePages = query[[from index.tag "page" where source == "markdown-import" select ref order by sourceUrl desc ]]
  if not updatablePages or #updatablePages == 0 then
    editor.flashNotification("Nothing to update, try importing a library first!") 
    return
  end
  for _, page in ipairs(updatablePages) do
    updateLibraryRawMarkdown(page)
   end
    codeWidget.refreshAll()
   return 
 end
}
```

## ❓ Update GitHub library for current page (Command)
```
-- Command definition
command.define {
  name = "Import: Update current page",
  key = "Ctrl-Alt-u",
  mac = "Cmd-Alt-u",
  run = function()
    local page = editor.getCurrentPage()
    local original_text = editor.getText()
    local fm = index.extractFrontmatter(original_text).frontmatter or {}
    local raw_url = fm.sourceUrl
    local github_url = fm.githubUrl
    if github_url or not github_url == "" then
        updateLibraryFromGitHub(page)
    elseif raw_url or not raw_url == "" then
        updateLibraryRawMarkdown(page)
    else editor.flashNotification("⚠️ No update URL found in frontmatter")
        return
    end
    editor.navigate({ kind = "page", page = page })
  end
}
```

## ❓ Check Update Status for current page (Command)
```
command.define {
  name = "Import: Check Current Page update status",
  key = "Ctrl-Alt-c",
  mac = "Cmd-Alt-c",
  run = function()
    local page = editor.getCurrentPage()
    checkLibraryUpdateStatus(page)
  end
}
```


## 🪄 Helper Functions
### Parse Custom Date
```
function parse_datetime(str)
  if not str or str == "" then
    return nil
  end
  local y, m, d, h, min, s = str:match("(%d+)%-(%d+)%-(%d+)T(%d+):(%d+):(%d+)")
  if not (y and m and d and h and min and s) then
    return nil
  end
  return os.time({
    year = tonumber(y),
    month = tonumber(m),
    day = tonumber(d),
    hour = tonumber(h),
    min = tonumber(min),
    sec = tonumber(s),
  })
end

```

# Discussions to this Library
[Silverbullet Community](https://community.silverbullet.md/t/space-lua-command-to-update-silverbullet-libraries/3421?u=mr.red)

