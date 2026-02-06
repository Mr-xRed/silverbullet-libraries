# TOC in the Sidepanel
# H1 CUSTOM SCRIPTS
## H2 Journal Template
## H2 Parse Custom Date
### H3 Toggle hidden Frontmatter
### H3 Date Formats (Now, TommorrowNow)
## H2 Custom Table of Contents
### H3 Disable Std TOC
### H3 Create Custom TOC
#### H4 Top Widget Hook for TOC (with inverse logic)
### H3 Recent Pages in the Sidepanel
## H2 Disabled System Widgets
### H3 (Toc, LinkedMentions, LinkedTasks)

```space-lua
-- priority: 10
function widgets.customTocSidebar()
  local text = editor.getText()
  local pageName = editor.getCurrentPage()
  local parsedMarkdown = markdown.parseMarkdown(text)
  
  -- Collect all headers
  local headers = {}
  for topLevelChild in parsedMarkdown.children do
    if topLevelChild.type then
      local headerLevel = string.match(topLevelChild.type, "^ATXHeading(%d+)")
      if headerLevel then
        local headerText = ""
        -- Skip the heading markers (e.g., ###)
        local children = {unpack(topLevelChild.children)}
        table.remove(children, 1)
         
        for _, child in ipairs(children) do
          headerText = headerText .. string.trim(markdown.renderParseTree(child))
        end
        
        -- Strip link syntax
        headerText = string.gsub(headerText, "%[%[(.-)%]%]", "%1")
        if headerText ~= "" then
          table.insert(headers, {
            name = headerText,
            pos = topLevelChild.from,
            level = tonumber(headerLevel)
          })
        end
      end
    end
  end
  if #headers == 0 then
    return nil
  end
  -- Find min level for indentation normalization
  local minLevel = 6
  for _, h in ipairs(headers) do
    if h.level < minLevel then minLevel = h.level end
  end
  -- Build DOM elements
  local items = {}
  for i, h in ipairs(headers) do
    local relLevel = h.level - minLevel
    
    -- Check if this is the last item at this level before a parent/sibling change
    local isLastAtLevel = true
    for j = i + 1, #headers do
      if headers[j].level == h.level then
        isLastAtLevel = false
        break
      elseif headers[j].level < h.level then
        isLastAtLevel = true
        break
      end
    end

    -- Determine which ancestor levels need a continuing vertical line
    local activeSpines = {}
    for level = 1, relLevel - 1 do
      local stillActive = false
      for j = i + 1, #headers do
        local nextRelLevel = headers[j].level - minLevel
        if nextRelLevel == level then
          stillActive = true
          break
        elseif nextRelLevel < level then
          stillActive = false
          break
        end
      end
      if stillActive then
        table.insert(activeSpines, tostring(level))
      end
    end

    local item = dom.div {
      class = "toc-item",
      ["data-level"] = tostring(relLevel),
      ["data-last"] = isLastAtLevel and "true" or "false",
      ["data-spines"] = table.concat(activeSpines, ","),
      style = string.format("--indent: %d;", relLevel),
      ["xonclick"] = string.format("syscall('editor.navigate', '%s@%d')", pageName, h.pos),
      dom.span { class = "toc-text", h.name }
    }
    table.insert(items, item)
  end
  local tocContainer = dom.div {
    class = "toc-wrapper",
    dom.h3 { "📋 Table of Contents" },
    dom.div { class = "toc-tree", unpack(items) }
  }
  local styles = [[<style>
    .toc-wrapper { 
      padding: 16px 12px; 
      font-family: var(--ui-font, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif); 
    }
    .toc-wrapper h3 { 
      margin: 0 0 16px 8px; 
      font-size: 13px; 
      text-transform: uppercase; 
      letter-spacing: 0.05em; 
      color: var(--text-muted); 
      opacity: 0.8;
    }
    .toc-tree { position: relative; }
    
    .toc-item { 
      position: relative;
      padding: 6px 10px 6px calc(var(--indent) * 18px + 10px); 
      cursor: pointer; 
      font-size: 13px; 
      color: var(--text-color);
      border-radius: 6px;
      transition: background 0.15s ease, color 0.15s ease;
      display: flex;
      align-items: center;
      background-repeat: no-repeat;
    }
    /* Direct branch spine */
    .toc-item[data-level]:not([data-level="0"])::before {
      content: "";
      position: absolute;
      left: calc((var(--indent) - 1) * 18px + 14px);
      top: 0;
      width: 1px;
      height: 100%;
      background-color: var(--bt-border-color, #ddd);
    }
    /* L-shape for last in branch */
    .toc-item[data-last="true"]:not([data-level="0"])::before {
      height: 50%;
    }
    /* Horizontal connector */
    .toc-item[data-level]:not([data-level="0"])::after {
      content: "";
      position: absolute;
      left: calc((var(--indent) - 1) * 18px + 14px);
      top: 50%;
      width: 10px;
      height: 1px;
      background-color: var(--bt-border-color, #ddd);
    }
    .toc-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      z-index: 2;
    }
    .toc-item:hover { 
      background-color: var(--sidebar-item-hover-color, rgba(0,0,0,0.05)); 
      color: var(--primary-color, #007aff); 
    }
    
    .toc-item[data-level="0"] { font-weight: 600; margin-top: 4px; padding-left: 10px; }
  </style>]]
  local finalHtml = js.tojs(tocContainer).outerHTML
  
  -- Inject dynamic gradients AND preserve the existing --indent style
  finalHtml = finalHtml:gsub('style="([^"]*)" data%-spines="([^"]*)"', function(existingStyle, s)
    local gradients = {}
    for level in s:gmatch("([^,]+)") do
      local pos = (tonumber(level) - 1) * 18 + 14
      table.insert(gradients, string.format("linear-gradient(to right, transparent %dpx, var(--bt-border-color, #ddd) %dpx, var(--bt-border-color, #ddd) %dpx, transparent %dpx)", pos, pos, pos+1, pos+1))
    end
    if #gradients > 0 then
      return string.format('style="%s background-image: %s;"', existingStyle, table.concat(gradients, ", "))
    end
    return string.format('style="%s"', existingStyle)
  end)
  return finalHtml:gsub('xonclick=', 'onclick=') .. styles
end
command.define {
  name = "Show TOC in Sidebar",
  run = function()
    local html = widgets.customTocSidebar()
    if html then
      editor.showPanel("rhs", 1, html)
    else
      print("No headers found to display.")
    end
  end
}
```
