# Update SilverBullet Libraries 

## Libraries imported using **Github Repo** that can be updated:
${query[[from index.tag "page"
where githubUrl != nil 
select "[["..ref.."]]"
order by githubUrl desc 
]]}

#### Try it out: Push button to update all community libraries from GitHub: ${widgets.commandButton("Github Update","Import: Update all Libraries from GitHub")}

## Libraries imported using **Markdown**: 🚧 in progress 🚧
${query[[from index.tag "page"
where source == "markdown-import" 
select  "[["..ref.."]]"
order by githubUrl desc 
]]} 


### Try it out: Push button to update Markdown libraries 🚧 in progress 🚧


### Commands & Current progress:
- Import: Update current page from GitHub Repo ✅
- Import: Update all Libraries from GitHub Repo ✅
- Import: Update all Libraries with Markdown interpreter 🚧 in progress 🚧

## Implementation 

### Update GitHub Library (Function)
```space-lua
-- Function to update a given page from GitHub

function updateLibraryFromGitHub(page)

  if not page then editor.flashNotification("No page specified to update", "error") return end
  -- get current text and original frontmatter
  local original_text = space.readPage(page) or ""
  local parsed = index.extractFrontmatter(original_text)
  local fm = parsed.frontmatter or {}
  local url = fm.githubUrl
  local frontmatter = '---\ngithubUrl: "'.. url ..'"\n---'

  if not url or url == "" then
    editor.flashNotification("⚠️ No 'githubUrl' found in frontmatter: " .. page, "error")
    return
  end

  -- Convert GitHub URL to raw
  local rawUrl = url
  rawUrl = rawUrl:gsub("^https://github%.com/", "https://raw.githubusercontent.com/")
  rawUrl = rawUrl:gsub("/blob/", "/")
  rawUrl = rawUrl:gsub("/tree/", "/")

  -- editor.flashNotification("Fetching latest version from GitHub…")

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

  local final
  if fm and fm ~= "" then
    final = frontmatter .. "\n\n" .. newContent
  else
    final = newContent
  end

  space.writePage(page, final)
  editor.flashNotification("✅ Page: " .. page.." updated from GitHub")
end

```

### Update all GitHub Libraries (Command)
```space-lua
local function updateAllGithubLibraries()
  -- if not page then editor.flashNotification("No page specified to update", "error") return end
  local updatablePages = query[[from index.tag "page" where githubUrl != nil select ref order by githubUrl desc ]]
    for _, pages in ipairs(updatablePages) do
      updateLibraryFromGitHub(pages)
    end
  return
end

command.define {
  name = "Import: Update all Libraries from GitHub",
  key = "Ctrl-Alt-z",
  mac = "Cmd-Alt-z",
  run = function()
       updateAllGithubLibraries()
  end
}

```

### Update GitHub library for current page (Command)
```space-lua
-- Command definition
command.define {
  name = "Import: Update current page from GitHub",
  key = "Ctrl-Alt-u",
  mac = "Cmd-Alt-u",
  run = function()
    local page = editor.getCurrentPage()
    updateLibraryFromGitHub(page)
    editor.navigate({ kind = "page", page = page })
  end
}
```


# Discussions to this Library
[Silverbullet Community](https://community.silverbullet.md/t/space-lua-command-to-update-silverbullet-libraries/3421?u=mr.red)

