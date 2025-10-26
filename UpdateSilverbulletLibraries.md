# Update SilverBullet Libraries 

${widgets.commandButton("Import","Import: URL")} | ${widgets.commandButton("Update GitHub","Import: Update all GitHub Libraries")} | ${widgets.commandButton("Update Raw Markdown","Import: Update all Raw Markdown Libraries")} | ${widgets.commandButton("Update current page","Import: Update current page")}


## Libraries imported using **Github Repo**:
${query[[from index.tag "page"
where githubUrl != nil 
select "[["..ref.."]]"
order by githubUrl desc 
]]}

## Libraries imported using **Markdown**:
${query[[from index.tag "page"
where source == "markdown-import" 
select  "[["..ref.."]]"
order by githubUrl desc 
]]} 

### Commands & Current progress:
- Import: Update current page (GitHub or Raw Markdown) ✅
- Import: Update all GitHub Libraries ✅
- Import: Update all Raw Markdown Libraries ✅
- Import: One 💍 Command to rule them all  🚧 in progress 🚧


## Implementation 

### Update GitHub Library (Function)
```space-lua
function updateLibraryFromGitHub(page)
  if not page then 
    editor.flashNotification("No page specified to update", "error")
    return
  end

  -- Get current content and frontmatter
  local original_text = space.readPage(page) or ""
  local parsed = index.extractFrontmatter(original_text)
  local fm = parsed.frontmatter or {}
  local url = fm.githubUrl

  if not url or url == "" then
    editor.flashNotification("⚠️ No 'githubUrl' found in frontmatter: " .. page, "error")
    return
  end

  -- Convert GitHub URL to raw
  local rawUrl = url
  rawUrl = rawUrl:gsub("^https://github%.com/", "https://raw.githubusercontent.com/")
  rawUrl = rawUrl:gsub("/blob/", "/")
  rawUrl = rawUrl:gsub("/tree/", "/")

  local req = http.request(rawUrl)
  if not req.ok then
    js.log("Failed to fetch " .. rawUrl)
    editor.flashNotification("⚠️ Update failed: could not fetch remote file:" .. url, "error")
    return
  end

  local newContent = req.body or ""
  if newContent == "" then
    editor.flashNotification("⚠️ Fetched content is empty:" .. url, "error")
    return
  end

  -- Patch frontmatter
  local patched = index.patchFrontmatter(newContent, {
    {op="set-key", path="githubUrl", value=url}
  })

  space.writePage(page, patched)
  editor.flashNotification("✅ Page: " .. page.." updated from GitHub")
end


```

## Update Raw Markdown Library (Function)
```space-lua
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
    {op="set-key", path="source", value=interpreter}
  })

  space.writePage(page, patched)
  editor.flashNotification("✅ Page: " .. page .. " updated")
end

```



### Update all GitHub Libraries (Command)
```space-lua
local function updateAllGithubLibraries()
  local updatablePages = query[[from index.tag "page" where githubUrl != nil select ref order by githubUrl desc ]]
    for _, pages in ipairs(updatablePages) do
      updateLibraryFromGitHub(pages)
    end
  return
end

command.define {
  name = "Import: Update all GitHub Libraries",
  key = "Ctrl-Alt-g",
  mac = "Cmd-Alt-g",
  run = function()
       updateAllGithubLibraries()
  end
}

```


## Update Raw Markdown (Command)
```space-lua
local function updateAllRawMarkdownLibraries()
  local updatablePages = query[[from index.tag "page" where source == "markdown-import" select ref order by sourceUrl desc ]]
  if not updatablePages or #updatablePages == 0 then
    editor.flashNotification("Nothing to update, try importing a library first!") 
    return
  end
  for _, page in ipairs(updatablePages) do
    updateLibraryRawMarkdown(page)
  end
end

command.define {
  name = "Import: Update all Raw Markdown Libraries",
  key = "Ctrl-Alt-m",
  mac = "Cmd-Alt-m",
  run = function()
    updateAllRawMarkdownLibraries()
  end
}
```


### Update GitHub library for current page (Command)
```space-lua
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


# Discussions to this Library
[Silverbullet Community](https://community.silverbullet.md/t/space-lua-command-to-update-silverbullet-libraries/3421?u=mr.red)

