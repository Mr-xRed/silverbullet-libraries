---
name: "Library/Mr-xRed/TOCInSidePanel"
tags: meta/library
pageDecoration.prefix: "🛠️ "
---

${widgets.commandButton("Toggle Table of Contents","Toggle TOC in Sidebar")}

# Custom TOC Sidebar

A live, collapsible Table of Contents that pins itself to the right-hand side of your editor and actually keeps up with what you're doing. It folds and unfolds sections in the document as you navigate the tree — because scrolling through a 200-heading page to find the right section is nobody's idea of a good time.

Bild anzeigen

## **Core Features**

*   **Live Heading Tree:** Renders all headings from the current page instantly, auto-refreshing on page load
*   **Bidirectional Fold Mirroring:** Collapsing or expanding a node in the sidebar folds or unfolds the exact corresponding section in the document — one level at a time
*   **Direct Navigation:** Click any heading to jump straight to that position in the document
*   **Ancestor Highlighting:** Hover over any entry to illuminate its full parent chain and connecting spine lines
*   **Toolbar Controls:** One-click Expand All, Collapse All, Refresh, and Close buttons

## Config & Defaults

```lua
config.set("CustomTOCSidebar", {
    autoOpenOnLoad = true,
    sidePanel = "rhs"
  })
```

## DEMO Headings
  Lorem ipsum dolor sit amet, four Silverbullet kittens lounge across the dashboard, quietly indexing thoughts while pretending to nap.

### Heading 3
  Consectetur adipiscing elit, each Silverbullet kitten purrs in markdown syntax, turning scattered ideas into structured clarity.

#### Heading 4
  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, as the four Silverbullet kittens chase backlinks through digital corridors.

### Heading 3
  Ut enim ad minim veniam, the Silverbullet kittens curl around nested notes and guard them like precious yarn.

#### Heading 4
  Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat, while the four Silverbullet kittens synchronise tags with suspicious elegance.

##### Heading 5
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, and the Silverbullet kittens paw at dynamic queries until insights emerge.

###### Heading 6
  Excepteur sint occaecat cupidatat non proident, the four Silverbullet kittens stretch across daily journals and sharpen their claws on metadata.

#### Heading 4
  Sunt in culpa qui officia deserunt mollit anim id est laborum, yet the Silverbullet kittens still manage to refactor your chaotic notes into tidy blocks.

### Heading 3
  Curabitur pretium tincidunt lacus, and the four Silverbullet kittens, vigilant and slightly smug, guard your knowledge base from the abyss of forgotten ideas.

## Implementation

```space-lua
-- priority: 10

config.define("CustomTOCSidebar", {
  type = "object",
  properties = {
    autoOpenOnLoad = { type = "boolean" },
    sidePanel = { type = "string" }
  }
})

local _tocVisible = false

function widgets.customTocSidebar()
  local cfg = config.get("CustomTOCSidebar") or {}
  local sidePanel = cfg.sidePanel or "rhs"

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

  -- Inline JS snippets (injected into onclick attrs to avoid innerHTML script-execution limitations)
  local jsExpandAll = [[
    (function() {
      var items = document.querySelectorAll('.toc-item');
      for (var i = 0; i < items.length; i++) {
        items[i].setAttribute('data-collapsed', 'false');
        items[i].style.display = '';
      }
      syscall('editor.unfoldAll');
    })()
  ]]

  local jsCollapseAll = [[
    (function() {
      var items = document.querySelectorAll('.toc-item');
      for (var i = 0; i < items.length; i++) {
        var level = parseInt(items[i].getAttribute('data-level'));
        // Mark every item collapsed (not just parents) so leaf headings also
        // reflect the folded document state and their chevron behaves correctly.
        items[i].setAttribute('data-collapsed', 'true');
        if (level === 0) {
          items[i].style.display = '';
        } else {
          items[i].style.display = 'none';
        }
      }
      syscall('editor.foldAll');
    })()
  ]]

  local jsToggleCollapse = [[
    (function(index, event) {
      event.stopPropagation();
      var items = document.querySelectorAll('.toc-item');
      var item = items[index];
      var level = parseInt(item.getAttribute('data-level'));
      var collapsed = item.getAttribute('data-collapsed') === 'true';
      var itemName = item.querySelector('.toc-text') ? item.querySelector('.toc-text').textContent : ('item ' + index);
      function showDescendants(idx) {
        var lvl = parseInt(items[idx].getAttribute('data-level'));
        if (items[idx].getAttribute('data-collapsed') === 'true') return;
        for (var i = idx + 1; i < items.length; i++) {
          var itemLevel = parseInt(items[i].getAttribute('data-level'));
          if (itemLevel <= lvl) break;
          if (itemLevel === lvl + 1) { items[i].style.display = ''; showDescendants(i); }
        }
      }
      if (collapsed) {
        item.setAttribute('data-collapsed', 'false');
        showDescendants(index);
      } else {
        item.setAttribute('data-collapsed', 'true');
        for (var i = index + 1; i < items.length; i++) {
          if (parseInt(items[i].getAttribute('data-level')) <= level) break;
          items[i].style.display = 'none';
        }
      }
      // Mirror fold state in the document editor
      // Use moveCursor (not navigate) to position within the current page for fold operations
      var pos = parseInt(item.getAttribute('data-pos'));
      if (collapsed) {
        // EXPANDING: move cursor to heading and toggleFold to open it,
        // then re-fold each direct child so only one level opens —
        // exactly mirroring the sidebar state.
        syscall('editor.moveCursor', pos);
        syscall('editor.toggleFold');
        for (var i = index + 1; i < items.length; i++) {
          var childLevel = parseInt(items[i].getAttribute('data-level'));
          if (childLevel <= level) break;
          if (childLevel === level + 1) {
            var childPos = parseInt(items[i].getAttribute('data-pos'));
            // Re-fold child in document and mark it collapsed in sidebar so chevron matches
            syscall('editor.moveCursor', childPos);
            syscall('editor.fold');
            items[i].setAttribute('data-collapsed', 'true');
          }
        }
        // Return cursor to the heading that was clicked
        syscall('editor.moveCursor', pos);
      } else {
        // COLLAPSING: fold at this heading — collapses entire subtree in the editor
        syscall('editor.moveCursor', pos);
        syscall('editor.fold');
      }
    })(%d, event)
  ]]

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

    -- Compute spine gradients inline to avoid fragile post-processing gsub
    local spineStyle = ""
    if #activeSpines > 0 then
      local gradients = {}
      for _, level in ipairs(activeSpines) do
        local pos = (tonumber(level) - 1) * 18 + 14.5
        table.insert(gradients, string.format(
          "linear-gradient(to right, transparent %.1fpx, var(--bt-border-color) %.1fpx, var(--bt-border-color) %.1fpx, transparent %.1fpx)",
          pos, pos, pos + 4, pos + 4
        ))
      end
      spineStyle = " background-image: " .. table.concat(gradients, ", ") .. ";"
    end

    -- Determine if this item has children (next header has higher level)
    local hasChildren = i < #headers and headers[i + 1].level > h.level

    -- Build child elements: all items get a chevron for fold/unfold control.
    -- Leaf items (no TOC children) still get a chevron since they may have
    -- foldable content in the document; their children loop in jsToggleCollapse
    -- simply finds nothing, so sidebar state is unaffected.
    local itemChildren = {}
    table.insert(itemChildren, dom.span {
      class = "toc-chevron",
      ["xonclick"] = string.format(jsToggleCollapse, i - 1)
    })
    table.insert(itemChildren, dom.span {
      class = "toc-text",
      ["xonclick"] = string.format("syscall('editor.navigate', '%s@%d')", pageName, h.pos),
      h.name
    })

    local item = dom.div {
      class = "toc-item",
      ["data-level"] = tostring(relLevel),
      ["data-last"] = isLastAtLevel and "true" or "false",
      ["data-index"] = tostring(i - 1),
      ["data-has-children"] = hasChildren and "true" or "false",
      ["data-collapsed"] = "false",
      ["data-pos"] = tostring(h.pos),
      style = string.format("--indent: %d;%s", relLevel, spineStyle),
      ["data-spine-levels"] = table.concat(activeSpines, ","),
      unpack(itemChildren)
    }
    table.insert(items, item)
  end

  local toolbar = dom.div {
    class = "toc-toolbar",
    dom.button {
      class = "toc-btn",
      ["xonclick"] = jsExpandAll,
      "XSVG_EXPAND"
    },
    dom.button {
      class = "toc-btn",
      ["xonclick"] = jsCollapseAll,
      "XSVG_COLLAPSE"
    },
    dom.button {
      class = "toc-btn",
      ["xonclick"] = "syscall('system.invokeCommand', 'Toggle TOC in Sidebar')",
      "XSVG_REFRESH"
    },
    dom.button {
      class = "toc-btn toc-btn-close",
      ["xonclick"] = string.format("syscall('editor.hidePanel', '%s')", sidePanel),
      "XSVG_CLOSE"
    }
  }

  local tocContainer = dom.div {
    class = "toc-wrapper",
    dom.div {
      class = "toc-header",
      --dom.h3 { "📋 Table of Contents" },
      toolbar,
    },
    dom.div { class = "toc-scroll",
      dom.div { class = "toc-tree", ["data-page"] = pageName, unpack(items) }
    }
  }
  local styles = [[<style>
html body {margin:0;}

/* ── Dark theme ── */
html[data-theme="dark"] {
    --bg-color: oklch(0.65 0 0 / 0.1);
    --bt-border-color: oklch(1 0 0 / 0.5);
    --text-muted: oklch(0.95 0 0 / 0.65);
    --ui-accent-color: oklch(0.65 0.22 260);
    --sidebar-item-hover-color: oklch(0.65 0 0 / 0.15);
    --node-bg: oklch(0.40 0 0);
    --node-accent: oklch(0.52 0.17 250);
}

/* ── Light theme ── */
html[data-theme="light"] {
    --bg-color: oklch(0.65 0 0 / 0.1);
    --bt-border-color: oklch(0 0 0 / 0.2);
    --text-muted: oklch(0.35 0 0 / 0.65);
    --ui-accent-color: oklch(0.65 0.22 260);
    --sidebar-item-hover-color: oklch(0.65 0 0 / 0.15);
    --node-bg: oklch(0.40 0 0);
    --node-accent: oklch(0.52 0.17 250);
}

  .toc-wrapper {
      font-family: var(--ui-font, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
      background: var(--bg-color, transparent);
    }
    .toc-header {
      position: sticky;
      top: 0;
      z-index: 10;
      padding: 8px;
      border-bottom: 1px solid var(--bt-border-color);
      background: var(--bg-color);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    .toc-wrapper h3 {
      margin: 0 0 10px 2px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      opacity: 0.6;
    }
    .toc-toolbar {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .toc-btn {
      font-size: 11px;
      padding: 4px 4px;
      border-radius: 6px;
      border: 1px solid var(--bt-border-color);
      background: var(--bg-color);
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s ease;
      line-height: 1.4;
      font-weight: 500;
      letter-spacing: 0.01em;
    }
    .toc-btn > span.p {
      display: flex;
    }
    .toc-btn:hover {
      background: var(--ui-accent-color);
      border-color: var(--ui-accent-color);
      color: #fff;
      box-shadow: 0 1px 4px rgba(0,122,255,0.25);
    }
    .toc-btn-close {
      margin-left: auto;
      padding: 4px 8px;
      font-size: 12px;
      border-radius: 6px;
    }
    .toc-scroll {
      padding: 8px 8px 16px 8px;
    }
    .toc-tree { position: relative; }

    .toc-item {
      position: relative;
      padding: 4px 8px 4px calc(var(--indent) * 18px + 7px);
      font-size: 12.5px;
      color: var(--text-color);
      border-radius: 7px;
      transition: background 0.12s ease, color 0.12s ease;
      display: flex;
      align-items: center;
      background-repeat: no-repeat;
      cursor: default;
      line-height: 1.45;
    }

    /* ── Tree branch lines (Codepen style: 4px, L-shape with rounded corner) ── */

    /* Vertical spine segment for the current item's branch */
    .toc-item[data-level]:not([data-level="0"])::before {
      content: "";
      position: absolute;
      left: calc((var(--indent) - 1) * 18px + 14.5px);
      top: 0;
      width: 4px;
      height: 100%;
      background-color: var(--bt-border-color);
      border-radius: 0;
    }
    /* Last in branch: spine stops at vertical midpoint (forms the L top half) */
    .toc-item[data-last="true"]:not([data-level="0"])::before {
      height: 55%;
      border-radius: 0 0 0 4px;
    }
    /* Horizontal connector */
    .toc-item[data-level]:not([data-level="0"])::after {
      content: "";
      position: absolute;
      left: calc((var(--indent) - 1) * 18px + 18.5px);
      top: calc(50% - 2px);
      width: 8px;
      height: 4px;
      background-color: var(--bt-border-color);
    }

    /* ── Circle node indicator (Codepen's summary::before equivalent) ── */
    .toc-chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      min-width: 18px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      /* Default: accent-colored circle with minus (expanded) icon */
      background-color: var(--node-accent);
      background-size: 50% 50%;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23FFFFFF' viewBox='0 0 448 512'%3E%3Cpath d='M416 256c0 17.7-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z' /%3E%3C/svg%3E");
      cursor: pointer;
      user-select: none;
      position: relative;
      z-index: 2;
      margin-right: 5px;
      transition: background-color 0.15s ease;
    }
    /* Leaf nodes (no TOC children): muted gray circle */
    .toc-item[data-has-children="false"] > .toc-chevron {
      background-color: var(--node-bg);
    }
    /* Collapsed state: switch to plus icon */
    .toc-item[data-collapsed="true"] > .toc-chevron {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23FFFFFF' viewBox='0 0 448 512'%3E%3Cpath d='M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z' /%3E%3C/svg%3E");
    }

    .toc-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      z-index: 2;
      cursor: pointer;
      flex: 1;
    }
    .toc-item:hover {
      background-color: var(--sidebar-item-hover-color);
      color: var(--ui-accent-color);
    }
    .toc-item:hover > .toc-chevron {
      background-color: var(--ui-accent-color);
    }

    .toc-item[data-level="0"] {
      font-weight: 600;
      margin-top: 4px;
     /* padding-left: 10px;*/
      font-size: 13px;
    }
  </style>]]
  local finalHtml = js.tojs(tocContainer).outerHTML
  
  finalHtml = finalHtml:gsub('xonclick=', 'onclick=')
  finalHtml = finalHtml:gsub('XSVG_EXPAND',   '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>')
  finalHtml = finalHtml:gsub('XSVG_COLLAPSE', '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>')
  finalHtml = finalHtml:gsub('XSVG_REFRESH',  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-cw-icon lucide-rotate-cw"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>')
  finalHtml = finalHtml:gsub('XSVG_CLOSE',    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>')

  return finalHtml .. styles
end
command.define {
  name = "Toggle TOC in Sidebar",
  run = function()
    local cfg = config.get("CustomTOCSidebar") or {}
    local sidePanel = cfg.sidePanel or "rhs"
    if _tocVisible then
      editor.hidePanel(sidePanel)
      _tocVisible = false
    else
      local html = widgets.customTocSidebar()
      if html then
        editor.showPanel(sidePanel, 1, html)
        _tocVisible = true
      else
        print("No headers found to display.")
      end
    end
  end
}
event.listen {
  name = "editor:pageLoaded",
  run = function(e)
    local cfg = config.get("CustomTOCSidebar") or {}
    local autoOpenOnLoad = cfg.autoOpenOnLoad ~= false
    local sidePanel = cfg.sidePanel or "rhs"
    if not autoOpenOnLoad then return end
    local html = widgets.customTocSidebar()
    if html then
      editor.showPanel(sidePanel, 1, html)
      _tocVisible = true
    end
  end
}
```

## Implementation 2026-02-25-09:02:41

```
-- priority: 10

config.define("CustomTOCSidebar", {
  type = "object",
  properties = {
    autoOpenOnLoad = { type = "boolean" },
    sidePanel = { type = "string" }
  }
})

local _tocVisible = false

function widgets.customTocSidebar()
  local cfg = config.get("CustomTOCSidebar") or {}
  local sidePanel = cfg.sidePanel or "rhs"

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

  -- Inline JS snippets (injected into onclick attrs to avoid innerHTML script-execution limitations)
  local jsExpandAll = [[
    (function() {
      var items = document.querySelectorAll('.toc-item');
      for (var i = 0; i < items.length; i++) {
        items[i].setAttribute('data-collapsed', 'false');
        items[i].style.display = '';
      }
      syscall('editor.unfoldAll');
    })()
  ]]

  local jsCollapseAll = [[
    (function() {
      var items = document.querySelectorAll('.toc-item');
      for (var i = 0; i < items.length; i++) {
        var level = parseInt(items[i].getAttribute('data-level'));
        // Mark every item collapsed (not just parents) so leaf headings also
        // reflect the folded document state and their chevron behaves correctly.
        items[i].setAttribute('data-collapsed', 'true');
        if (level === 0) {
          items[i].style.display = '';
        } else {
          items[i].style.display = 'none';
        }
      }
      syscall('editor.foldAll');
    })()
  ]]

  local jsToggleCollapse = [[
    (function(index, event) {
      event.stopPropagation();
      var items = document.querySelectorAll('.toc-item');
      var item = items[index];
      var level = parseInt(item.getAttribute('data-level'));
      var collapsed = item.getAttribute('data-collapsed') === 'true';
      var itemName = item.querySelector('.toc-text') ? item.querySelector('.toc-text').textContent : ('item ' + index);
      function showDescendants(idx) {
        var lvl = parseInt(items[idx].getAttribute('data-level'));
        if (items[idx].getAttribute('data-collapsed') === 'true') return;
        for (var i = idx + 1; i < items.length; i++) {
          var itemLevel = parseInt(items[i].getAttribute('data-level'));
          if (itemLevel <= lvl) break;
          if (itemLevel === lvl + 1) { items[i].style.display = ''; showDescendants(i); }
        }
      }
      if (collapsed) {
        item.setAttribute('data-collapsed', 'false');
        showDescendants(index);
      } else {
        item.setAttribute('data-collapsed', 'true');
        for (var i = index + 1; i < items.length; i++) {
          if (parseInt(items[i].getAttribute('data-level')) <= level) break;
          items[i].style.display = 'none';
        }
      }
      // Mirror fold state in the document editor
      // Use moveCursor (not navigate) to position within the current page for fold operations
      var pos = parseInt(item.getAttribute('data-pos'));
      if (collapsed) {
        // EXPANDING: move cursor to heading and toggleFold to open it,
        // then re-fold each direct child so only one level opens —
        // exactly mirroring the sidebar state.
        syscall('editor.moveCursor', pos);
        syscall('editor.toggleFold');
        for (var i = index + 1; i < items.length; i++) {
          var childLevel = parseInt(items[i].getAttribute('data-level'));
          if (childLevel <= level) break;
          if (childLevel === level + 1) {
            var childPos = parseInt(items[i].getAttribute('data-pos'));
            // Re-fold child in document and mark it collapsed in sidebar so chevron matches
            syscall('editor.moveCursor', childPos);
            syscall('editor.fold');
            items[i].setAttribute('data-collapsed', 'true');
          }
        }
        // Return cursor to the heading that was clicked
        syscall('editor.moveCursor', pos);
      } else {
        // COLLAPSING: fold at this heading — collapses entire subtree in the editor
        syscall('editor.moveCursor', pos);
        syscall('editor.fold');
      }
    })(%d, event)
  ]]

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

    -- Compute spine gradients inline to avoid fragile post-processing gsub
    local spineStyle = ""
    if #activeSpines > 0 then
      local gradients = {}
      for _, level in ipairs(activeSpines) do
        local pos = (tonumber(level) - 1) * 18 + 14.8
        table.insert(gradients, string.format(
          "linear-gradient(to right, transparent %dpx, var(--bt-border-color) %dpx, var(--bt-border-color) %dpx, transparent %dpx)",
          pos, pos, pos + 4, pos + 4
        ))
      end
      spineStyle = " background-image: " .. table.concat(gradients, ", ") .. ";"
    end

    -- Determine if this item has children (next header has higher level)
    local hasChildren = i < #headers and headers[i + 1].level > h.level

    -- Build child elements: all items get a chevron for fold/unfold control.
    -- Leaf items (no TOC children) still get a chevron since they may have
    -- foldable content in the document; their children loop in jsToggleCollapse
    -- simply finds nothing, so sidebar state is unaffected.
    local itemChildren = {}
    table.insert(itemChildren, dom.span {
      class = "toc-chevron",
      ["xonclick"] = string.format(jsToggleCollapse, i - 1)
    })
    table.insert(itemChildren, dom.span {
      class = "toc-text",
      ["xonclick"] = string.format("syscall('editor.navigate', '%s@%d')", pageName, h.pos),
      h.name
    })

    local item = dom.div {
      class = "toc-item",
      ["data-level"] = tostring(relLevel),
      ["data-last"] = isLastAtLevel and "true" or "false",
      ["data-index"] = tostring(i - 1),
      ["data-has-children"] = hasChildren and "true" or "false",
      ["data-collapsed"] = "false",
      ["data-pos"] = tostring(h.pos),
      style = string.format("--indent: %d;%s", relLevel, spineStyle),
      ["data-spine-levels"] = table.concat(activeSpines, ","),
      unpack(itemChildren)
    }
    table.insert(items, item)
  end

  local toolbar = dom.div {
    class = "toc-toolbar",
    dom.button {
      class = "toc-btn",
      ["xonclick"] = jsExpandAll,
      "XSVG_EXPAND"
    },
    dom.button {
      class = "toc-btn",
      ["xonclick"] = jsCollapseAll,
      "XSVG_COLLAPSE"
    },
    dom.button {
      class = "toc-btn",
      ["xonclick"] = "syscall('system.invokeCommand', 'Toggle TOC in Sidebar')",
      "XSVG_REFRESH"
    },
    dom.button {
      class = "toc-btn toc-btn-close",
      ["xonclick"] = string.format("syscall('editor.hidePanel', '%s')", sidePanel),
      "XSVG_CLOSE"
    }
  }

  local tocContainer = dom.div {
    class = "toc-wrapper",
    dom.div {
      class = "toc-header",
      --dom.h3 { "📋 Table of Contents" },
      toolbar,
    },
    dom.div { class = "toc-scroll",
      dom.div { class = "toc-tree", ["data-page"] = pageName, unpack(items) }
    }
  }
  local styles = [[<style>
html body {margin:0;}

/* ── Dark theme ── */
html[data-theme="dark"] {
    --bg-color: oklch(0.65 0 0 / 0.1);
    --bt-border-color: rgba(255, 255, 255, 0.18);
    --text-muted: oklch(0.95 0 0 / 0.65);
    --ui-accent-color: oklch(0.65 0.22 260);
    --sidebar-item-hover-color: oklch(0.65 0 0 / 0.15);
    --node-bg: oklch(0.40 0 0);
    --node-accent: oklch(0.52 0.17 250);
}

/* ── Light theme ── */
html[data-theme="light"] {
    --bg-color: oklch(0.65 0 0 / 0.1);
    --bt-border-color: #dddddd;
    --node-bg: #dddddd;
    --node-accent: #4a7c59;
}

  .toc-wrapper {
      font-family: var(--ui-font, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
      background: var(--bg-color, transparent);
    }
    .toc-header {
      position: sticky;
      top: 0;
      z-index: 10;
      padding: 8px;
      border-bottom: 1px solid var(--bt-border-color);
      background: var(--bg-color);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    .toc-wrapper h3 {
      margin: 0 0 10px 2px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      opacity: 0.6;
    }
    .toc-toolbar {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .toc-btn {
      font-size: 11px;
      padding: 4px 4px;
      border-radius: 6px;
      border: 1px solid var(--bt-border-color);
      background: var(--bg-color);
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s ease;
      line-height: 1.4;
      font-weight: 500;
      letter-spacing: 0.01em;
    }
    .toc-btn > span.p {
      display: flex;
    }
    .toc-btn:hover {
      background: var(--ui-accent-color);
      border-color: var(--ui-accent-color);
      color: #fff;
      box-shadow: 0 1px 4px rgba(0,122,255,0.25);
    }
    .toc-btn-close {
      margin-left: auto;
      padding: 4px 8px;
      font-size: 12px;
      border-radius: 6px;
    }
    .toc-scroll {
      padding: 8px 8px 16px 8px;
    }
    .toc-tree { position: relative; }

    .toc-item {
      position: relative;
      padding: 4px 8px 4px calc(var(--indent) * 18px + 10px);
      font-size: 12.5px;
      color: var(--text-color);
      border-radius: 7px;
      transition: background 0.12s ease, color 0.12s ease;
      display: flex;
      align-items: center;
      background-repeat: no-repeat;
      cursor: default;
      line-height: 1.45;
    }

    /* ── Tree branch lines (Codepen style: 4px, L-shape with rounded corner) ── */

    /* Vertical spine segment for the current item's branch */
    .toc-item[data-level]:not([data-level="0"])::before {
      content: "";
      position: absolute;
      left: calc((var(--indent) - 1) * 18px + 14px);
      top: 0;
      width: 4px;
      height: 100%;
      background-color: var(--bt-border-color);
      border-radius: 0;
    }
    /* Last in branch: spine stops at vertical midpoint (forms the L top half) */
    .toc-item[data-last="true"]:not([data-level="0"])::before {
      height: 55%;
      border-radius: 0 0 0 4px;
    }
    /* Horizontal connector */
    .toc-item[data-level]:not([data-level="0"])::after {
      content: "";
      position: absolute;
      left: calc((var(--indent) - 1) * 18px + 18px);
      top: calc(50% - 2px);
      width: 8px;
      height: 4px;
      background-color: var(--bt-border-color);
    }

    /* ── Circle node indicator (Codepen's summary::before equivalent) ── */
    .toc-chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      min-width: 18px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      /* Default: accent-colored circle with minus (expanded) icon */
      background-color: var(--node-accent);
      background-size: 50% 50%;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23FFFFFF' viewBox='0 0 448 512'%3E%3Cpath d='M416 256c0 17.7-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z' /%3E%3C/svg%3E");
      cursor: pointer;
      user-select: none;
      position: relative;
      z-index: 2;
      margin-right: 5px;
      transition: background-color 0.15s ease;
    }
    /* Leaf nodes (no TOC children): muted gray circle */
    .toc-item[data-has-children="false"] > .toc-chevron {
      background-color: var(--node-bg);
    }
    /* Collapsed state: switch to plus icon */
    .toc-item[data-collapsed="true"] > .toc-chevron {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23FFFFFF' viewBox='0 0 448 512'%3E%3Cpath d='M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z' /%3E%3C/svg%3E");
    }

    .toc-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      z-index: 2;
      cursor: pointer;
      flex: 1;
    }
    .toc-item:hover {
      background-color: var(--sidebar-item-hover-color);
      color: var(--ui-accent-color);
    }
    .toc-item:hover > .toc-chevron {
      background-color: var(--ui-accent-color);
    }

    .toc-item[data-level="0"] {
      font-weight: 600;
      margin-top: 4px;
      padding-left: 10px;
      font-size: 13px;
    }
  </style>]]
  local finalHtml = js.tojs(tocContainer).outerHTML
  
  finalHtml = finalHtml:gsub('xonclick=', 'onclick=')
  finalHtml = finalHtml:gsub('XSVG_EXPAND',   '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>')
  finalHtml = finalHtml:gsub('XSVG_COLLAPSE', '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>')
  finalHtml = finalHtml:gsub('XSVG_REFRESH',  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-cw-icon lucide-rotate-cw"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>')
  finalHtml = finalHtml:gsub('XSVG_CLOSE',    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>')

  return finalHtml .. styles
end
command.define {
  name = "Toggle TOC in Sidebar",
  run = function()
    local cfg = config.get("CustomTOCSidebar") or {}
    local sidePanel = cfg.sidePanel or "rhs"
    if _tocVisible then
      editor.hidePanel(sidePanel)
      _tocVisible = false
    else
      local html = widgets.customTocSidebar()
      if html then
        editor.showPanel(sidePanel, 1, html)
        _tocVisible = true
      else
        print("No headers found to display.")
      end
    end
  end
}
event.listen {
  name = "editor:pageLoaded",
  run = function(e)
    local cfg = config.get("CustomTOCSidebar") or {}
    local autoOpenOnLoad = cfg.autoOpenOnLoad ~= false
    local sidePanel = cfg.sidePanel or "rhs"
    if not autoOpenOnLoad then return end
    local html = widgets.customTocSidebar()
    if html then
      editor.showPanel(sidePanel, 1, html)
      _tocVisible = true
    end
  end
}
```


## Implementation 2026-02-25-08:54:20

```

-- priority: 10

config.define("CustomTOCSidebar", {
  type = "object",
  properties = {
    autoOpenOnLoad = { type = "boolean" },
    sidePanel = { type = "string" }
  }
})

local _tocVisible = false

function widgets.customTocSidebar()
  local cfg = config.get("CustomTOCSidebar") or {}
  local sidePanel = cfg.sidePanel or "rhs"

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

  -- Inline JS snippets (injected into onclick attrs to avoid innerHTML script-execution limitations)
  local jsExpandAll = [[
    (function() {
      var items = document.querySelectorAll('.toc-item');
      for (var i = 0; i < items.length; i++) {
        items[i].setAttribute('data-collapsed', 'false');
        items[i].style.display = '';
      }
      syscall('editor.unfoldAll');
    })()
  ]]

  local jsCollapseAll = [[
    (function() {
      var items = document.querySelectorAll('.toc-item');
      for (var i = 0; i < items.length; i++) {
        var level = parseInt(items[i].getAttribute('data-level'));
        // Mark every item collapsed (not just parents) so leaf headings also
        // reflect the folded document state and their chevron behaves correctly.
        items[i].setAttribute('data-collapsed', 'true');
        if (level === 0) {
          items[i].style.display = '';
        } else {
          items[i].style.display = 'none';
        }
      }
      syscall('editor.foldAll');
    })()
  ]]

  local jsToggleCollapse = [[
    (function(index, event) {
      event.stopPropagation();
      var items = document.querySelectorAll('.toc-item');
      var item = items[index];
      var level = parseInt(item.getAttribute('data-level'));
      var collapsed = item.getAttribute('data-collapsed') === 'true';
      var itemName = item.querySelector('.toc-text') ? item.querySelector('.toc-text').textContent : ('item ' + index);
      function showDescendants(idx) {
        var lvl = parseInt(items[idx].getAttribute('data-level'));
        if (items[idx].getAttribute('data-collapsed') === 'true') return;
        for (var i = idx + 1; i < items.length; i++) {
          var itemLevel = parseInt(items[i].getAttribute('data-level'));
          if (itemLevel <= lvl) break;
          if (itemLevel === lvl + 1) { items[i].style.display = ''; showDescendants(i); }
        }
      }
      if (collapsed) {
        item.setAttribute('data-collapsed', 'false');
        showDescendants(index);
      } else {
        item.setAttribute('data-collapsed', 'true');
        for (var i = index + 1; i < items.length; i++) {
          if (parseInt(items[i].getAttribute('data-level')) <= level) break;
          items[i].style.display = 'none';
        }
      }
      // Mirror fold state in the document editor
      // Use moveCursor (not navigate) to position within the current page for fold operations
      var pos = parseInt(item.getAttribute('data-pos'));
      if (collapsed) {
        // EXPANDING: move cursor to heading and toggleFold to open it,
        // then re-fold each direct child so only one level opens —
        // exactly mirroring the sidebar state.
        syscall('editor.moveCursor', pos);
        syscall('editor.toggleFold');
        for (var i = index + 1; i < items.length; i++) {
          var childLevel = parseInt(items[i].getAttribute('data-level'));
          if (childLevel <= level) break;
          if (childLevel === level + 1) {
            var childPos = parseInt(items[i].getAttribute('data-pos'));
            // Re-fold child in document and mark it collapsed in sidebar so chevron matches
            syscall('editor.moveCursor', childPos);
            syscall('editor.fold');
            items[i].setAttribute('data-collapsed', 'true');
          }
        }
        // Return cursor to the heading that was clicked
        syscall('editor.moveCursor', pos);
      } else {
        // COLLAPSING: fold at this heading — collapses entire subtree in the editor
        syscall('editor.moveCursor', pos);
        syscall('editor.fold');
      }
    })(%d, event)
  ]]

  -- Highlight ancestor items when hovering a child heading.
  -- ::before/::after on same-level siblings is handled via CSS classes.
  -- Pass-through spines on deeper items are drawn as background-image gradients
  -- (inlined in style), so those must be rewritten directly in JS with the accent color,
  -- then restored on mouseout via data-original-bg.
  local jsMouseOver = [[
    (function(index, event) {
      event.stopPropagation();
      var items = document.querySelectorAll('.toc-item');
      var cs = getComputedStyle(document.documentElement);
      var accentColor = cs.getPropertyValue('--ui-accent-color').trim();
      var borderColor = cs.getPropertyValue('--bt-border-color').trim();
      // Clear previous highlights and restore saved background-images
      for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('toc-ancestor-highlight');
        items[i].classList.remove('toc-spine-highlight');
        items[i].classList.remove('toc-hovered-highlight');
        if (items[i].hasAttribute('data-original-bg')) {
          items[i].style.backgroundImage = items[i].getAttribute('data-original-bg');
          items[i].removeAttribute('data-original-bg');
        }
      }
      // Highlight the hovered item itself (its ::before/::after connector to parent)
      items[index].classList.add('toc-ancestor-highlight');
      items[index].classList.add('toc-hovered-highlight');
      var currentIndex = index;
      var currentLevel = parseInt(items[index].getAttribute('data-level'));
      // Walk up to root highlighting ancestors and spine-contributing siblings
      while (currentLevel > 0) {
        // Find direct parent (first item above with lower level)
        var parentIndex = -1;
        for (var i = currentIndex - 1; i >= 0; i--) {
          if (parseInt(items[i].getAttribute('data-level')) < currentLevel) {
            parentIndex = i;
            break;
          }
        }
        if (parentIndex === -1) break;
        var parentLevel = parseInt(items[parentIndex].getAttribute('data-level'));
        // For all items between parentIndex and currentIndex:
        // - same-level siblings: their ::before draws the vertical spine in this column -> toc-spine-highlight
        // - deeper items: their vertical spine in this column is a background-image gradient -> rewrite it
        for (var i = currentIndex - 1; i > parentIndex; i--) {
          var itemLevel = parseInt(items[i].getAttribute('data-level'));
          if (itemLevel === currentLevel) {
            // Same-level sibling: ::before handles the spine segment -> CSS class is enough
            items[i].classList.add('toc-spine-highlight');
          } else if (itemLevel > currentLevel) {
            -- Deeper item: the spine at parentLevel column is a background-image gradient
            var spineLevels = items[i].getAttribute('data-spine-levels');
            if (spineLevels && spineLevels !== '') {
              var levels = spineLevels.split(',');
              var hasParentLevel = false;
              for (var k = 0; k < levels.length; k++) {
                if (parseInt(levels[k]) === currentLevel) { hasParentLevel = true; break; }
              }
              if (hasParentLevel) {
                // Save the original background-image before modifying
                if (!items[i].hasAttribute('data-original-bg')) {
                  items[i].setAttribute('data-original-bg', items[i].style.backgroundImage || '');
                }
                // Rebuild all gradients for this item, swapping the currentLevel column to accent color
                var gradients = [];
                for (var k = 0; k < levels.length; k++) {
                  var lvl = parseInt(levels[k]);
                  var pos = (lvl - 1) * 18 + 14;
                  if (lvl === currentLevel) {
                    gradients.push('linear-gradient(to right, transparent ' + pos + 'px, ' + accentColor + ' ' + pos + 'px, ' + accentColor + ' ' + (pos + 4) + 'px, transparent ' + (pos + 4) + 'px)');
                  } else {
                    gradients.push('linear-gradient(to right, transparent ' + pos + 'px, ' + borderColor + ' ' + pos + 'px, ' + borderColor + ' ' + (pos + 4) + 'px, transparent ' + (pos + 4) + 'px)');
                  }
                }
                items[i].style.backgroundImage = gradients.join(', ');
              }
            }
          }
        }
        // Highlight the parent itself (text accent + its own connector lines)
        items[parentIndex].classList.add('toc-ancestor-highlight');
        currentIndex = parentIndex;
        currentLevel = parentLevel;
      }
    })(%d, event)
  ]]

  -- Remove ancestor highlights and restore any rewritten background-images when mouse leaves an item
  local jsMouseOut = [[
    (function() {
      var items = document.querySelectorAll('.toc-item');
      for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('toc-ancestor-highlight');
        items[i].classList.remove('toc-spine-highlight');
        items[i].classList.remove('toc-hovered-highlight');
        if (items[i].hasAttribute('data-original-bg')) {
          items[i].style.backgroundImage = items[i].getAttribute('data-original-bg');
          items[i].removeAttribute('data-original-bg');
        }
      }
    })()
  ]]

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

    -- Compute spine gradients inline to avoid fragile post-processing gsub
    local spineStyle = ""
    if #activeSpines > 0 then
      local gradients = {}
      for _, level in ipairs(activeSpines) do
        local pos = (tonumber(level) - 1) * 18 + 14
        table.insert(gradients, string.format(
          "linear-gradient(to right, transparent %dpx, var(--bt-border-color) %dpx, var(--bt-border-color) %dpx, transparent %dpx)",
          pos, pos, pos + 4, pos + 4
        ))
      end
      spineStyle = " background-image: " .. table.concat(gradients, ", ") .. ";"
    end

    -- Determine if this item has children (next header has higher level)
    local hasChildren = i < #headers and headers[i + 1].level > h.level

    -- Build child elements: all items get a chevron for fold/unfold control.
    -- Leaf items (no TOC children) still get a chevron since they may have
    -- foldable content in the document; their children loop in jsToggleCollapse
    -- simply finds nothing, so sidebar state is unaffected.
    local itemChildren = {}
    table.insert(itemChildren, dom.span {
      class = "toc-chevron",
      ["xonclick"] = string.format(jsToggleCollapse, i - 1)
    })
    table.insert(itemChildren, dom.span {
      class = "toc-text",
      ["xonclick"] = string.format("syscall('editor.navigate', '%s@%d')", pageName, h.pos),
      h.name
    })

    local item = dom.div {
      class = "toc-item",
      ["data-level"] = tostring(relLevel),
      ["data-last"] = isLastAtLevel and "true" or "false",
      ["data-index"] = tostring(i - 1),
      ["data-has-children"] = hasChildren and "true" or "false",
      ["data-collapsed"] = "false",
      ["data-pos"] = tostring(h.pos),
      style = string.format("--indent: %d;%s", relLevel, spineStyle),
      ["data-spine-levels"] = table.concat(activeSpines, ","),
      ["xonmouseover"] = string.format(jsMouseOver, i - 1),
      ["xonmouseout"] = jsMouseOut,
      unpack(itemChildren)
    }
    table.insert(items, item)
  end

  local toolbar = dom.div {
    class = "toc-toolbar",
    dom.button {
      class = "toc-btn",
      ["xonclick"] = jsExpandAll,
      "XSVG_EXPAND"
    },
    dom.button {
      class = "toc-btn",
      ["xonclick"] = jsCollapseAll,
      "XSVG_COLLAPSE"
    },
    dom.button {
      class = "toc-btn",
      ["xonclick"] = "syscall('system.invokeCommand', 'Toggle TOC in Sidebar')",
      "XSVG_REFRESH"
    },
    dom.button {
      class = "toc-btn toc-btn-close",
      ["xonclick"] = string.format("syscall('editor.hidePanel', '%s')", sidePanel),
      "XSVG_CLOSE"
    }
  }

  local tocContainer = dom.div {
    class = "toc-wrapper",
    dom.div {
      class = "toc-header",
      --dom.h3 { "📋 Table of Contents" },
      toolbar,
    },
    dom.div { class = "toc-scroll",
      dom.div { class = "toc-tree", ["data-page"] = pageName, unpack(items) }
    }
  }
  local styles = [[<style>
html body {margin:0;}

/* ── Dark theme ── */
html[data-theme="dark"] {
    --bg-color: oklch(0.65 0 0 / 0.1);
    --bt-border-color: rgba(255, 255, 255, 0.18);
    --text-muted: oklch(0.95 0 0 / 0.65);
    --ui-accent-color: oklch(0.65 0.22 260);
    --sidebar-item-hover-color: oklch(0.65 0 0 / 0.15);
    --node-bg: oklch(0.40 0 0);
    --node-accent: oklch(0.52 0.17 250);
}

/* ── Light theme ── */
html[data-theme="light"] {
    --bg-color: oklch(0.65 0 0 / 0.1);
    --bt-border-color: #dddddd;
    --node-accent: #4a7c59;
      -webkit-backdrop-filter: blur(8px);
    --node-bg: #dddddd;
    }
    .toc-wrapper h3 {
      margin: 0 0 10px 2px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      opacity: 0.6;
    }
    .toc-toolbar {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .toc-btn {
      font-size: 11px;
      padding: 4px 4px;
      border-radius: 6px;
      border: 1px solid var(--bt-border-color);
      background: var(--bg-color);
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s ease;
      line-height: 1.4;
      font-weight: 500;
      letter-spacing: 0.01em;
    }
    .toc-btn > span.p {
      display: flex;
    }
    .toc-btn:hover {
      background: var(--ui-accent-color);
      border-color: var(--ui-accent-color);
      color: #fff;
      box-shadow: 0 1px 4px rgba(0,122,255,0.25);
    }
    .toc-btn-close {
      margin-left: auto;
      padding: 4px 8px;
      font-size: 12px;
      border-radius: 6px;
    }
    .toc-scroll {
      padding: 8px 8px 16px 8px;
    }
    .toc-tree { position: relative; }

    .toc-item {
      position: relative;
      padding: 4px 8px 4px calc(var(--indent) * 18px + 10px);
      font-size: 12.5px;
      color: var(--text-color);
      border-radius: 7px;
      transition: background 0.12s ease, color 0.12s ease;
      display: flex;
      align-items: center;
      background-repeat: no-repeat;
      cursor: default;
      line-height: 1.45;
    }

    /* ── Tree branch lines (Codepen style: 4px, L-shape with rounded corner) ── */

    /* Vertical spine segment for the current item's branch */
    .toc-item[data-level]:not([data-level="0"])::before {
      content: "";
      position: absolute;
      left: calc((var(--indent) - 1) * 18px + 14px);
      top: 0;
      width: 4px;
      height: 100%;
      background-color: var(--bt-border-color);
      border-radius: 0;
    }
    /* Last in branch: spine stops at vertical midpoint (forms the L top half) */
    .toc-item[data-last="true"]:not([data-level="0"])::before {
      height: 55%;
      border-radius: 0 0 0 4px;
    }
    /* Horizontal connector */
    .toc-item[data-level]:not([data-level="0"])::after {
      content: "";
      position: absolute;
      left: calc((var(--indent) - 1) * 18px + 18px);
      top: calc(50% - 2px);
      width: 8px;
      height: 4px;
      background-color: var(--bt-border-color);
    }

    /* ── Circle node indicator (Codepen's summary::before equivalent) ── */
    .toc-chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      min-width: 18px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      /* Default: accent-colored circle with minus (expanded) icon */
      background-color: var(--node-accent);
      background-size: 50% 50%;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23FFFFFF' viewBox='0 0 448 512'%3E%3Cpath d='M416 256c0 17.7-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z' /%3E%3C/svg%3E");
      cursor: pointer;
      user-select: none;
      position: relative;
      z-index: 2;
      margin-right: 5px;
      transition: background-color 0.15s ease;
    }
    /* Leaf nodes (no TOC children): muted gray circle */
    .toc-item[data-has-children="false"] > .toc-chevron {
      background-color: var(--node-bg);
    }
    /* Collapsed state: switch to plus icon */
    .toc-item[data-collapsed="true"] > .toc-chevron {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23FFFFFF' viewBox='0 0 448 512'%3E%3Cpath d='M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z' /%3E%3C/svg%3E");
    }

    .toc-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      z-index: 2;
      cursor: pointer;
      flex: 1;
    }
    .toc-item:hover {
      background-color: var(--sidebar-item-hover-color);
      color: var(--ui-accent-color);
    }
    .toc-item:hover > .toc-chevron {
      background-color: var(--ui-accent-color);
    }

    /* ── Ancestor hover highlights ── */
    .toc-item.toc-ancestor-highlight {
      color: var(--ui-accent-color);
    }
    .toc-item.toc-ancestor-highlight::before,
    .toc-item.toc-spine-highlight::before {
      background-color: var(--ui-accent-color) !important;
    }
    .toc-item.toc-ancestor-highlight[data-last="true"]::after,
    .toc-item.toc-hovered-highlight::after {
      background-color: var(--ui-accent-color) !important;
    }
    .toc-item.toc-ancestor-highlight > .toc-chevron {
      background-color: var(--ui-accent-color);
    }

    .toc-item[data-level="0"] {
      font-weight: 600;
      margin-top: 4px;
      padding-left: 10px;
      font-size: 13px;
    }
  </style>]]
  local finalHtml = js.tojs(tocContainer).outerHTML
  
  finalHtml = finalHtml:gsub('xonclick=', 'onclick=')
  finalHtml = finalHtml:gsub('xonmouseover=', 'onmouseover=')
  finalHtml = finalHtml:gsub('xonmouseout=', 'onmouseout=')
  finalHtml = finalHtml:gsub('XSVG_EXPAND',   '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>')
  finalHtml = finalHtml:gsub('XSVG_COLLAPSE', '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>')
  finalHtml = finalHtml:gsub('XSVG_REFRESH',  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-cw-icon lucide-rotate-cw"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>')
  finalHtml = finalHtml:gsub('XSVG_CLOSE',    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>')

  return finalHtml .. styles
end
command.define {
  name = "Toggle TOC in Sidebar",
  run = function()
    local cfg = config.get("CustomTOCSidebar") or {}
    local sidePanel = cfg.sidePanel or "rhs"
    if _tocVisible then
      editor.hidePanel(sidePanel)
      _tocVisible = false
    else
      local html = widgets.customTocSidebar()
      if html then
        editor.showPanel(sidePanel, 1, html)
        _tocVisible = true
      else
        print("No headers found to display.")
      end
    end
  end
}
event.listen {
  name = "editor:pageLoaded",
  run = function(e)
    local cfg = config.get("CustomTOCSidebar") or {}
    local autoOpenOnLoad = cfg.autoOpenOnLoad ~= false
    local sidePanel = cfg.sidePanel or "rhs"
    if not autoOpenOnLoad then return end
    local html = widgets.customTocSidebar()
    if html then
      editor.showPanel(sidePanel, 1, html)
      _tocVisible = true
    end
  end
}
```