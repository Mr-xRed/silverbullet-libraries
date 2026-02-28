---
name: "Library/Mr-xRed/TOCInSidePanel"
tags: meta/library
pageDecoration.prefix: "🛠️ "
---

# Custom TOC Sidepanel

**_Because scrolling through a 200-heading page to find the right section is nobody's idea of a good time._**

A live, collapsible **Table of Contents** that pins itself to the right-hand side (customizable) of your editor and actually keeps up with what you're doing. It folds and unfolds sections in the document as you navigate the tree.

TRY IT OUT 👉 ${widgets.commandButton("Toggle Table of Contents","Toggle TOC in Sidepanel")}

## Core Features

* **Live Heading Tree:** Renders all headings from the current page, auto-refreshing on page load
* **Undirectional Fold Mirroring:** Collapsing or expanding a node in the sidepanel folds or unfolds the exact corresponding section in the document — one level at a time
* **Direct Navigation:** Click any heading to jump straight to that position in the document
* **Toolbar Controls:** One-click Expand All, Collapse All, Refresh, and Close buttons

## Known limitations and issues
* The folding & unfolding is synced witht the page only one-directional
* Whe there are many level one headers and they are outside the codemirror buffer, they don’t collapse
- Sometimes you need to fold-unfold the heading in the TOC to get in sync with the Page

## Config & Defaults

```lua
config.set("SidepanelTOC", {sidePanel = "rhs"})
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

## Space-Style

```space-style
/* priority: 100 */
html{
    --toc-chevron-size: 14px;
    --toc-spine-width: 3px;
}
/* ── Dark theme ── */
html[data-theme="dark"] {
    --toc-bg-color: var(--top-background-color);
    --toc-border-color: oklch(0.45 0 0);
    --toc-text-color: oklch(0.75 0 0);
    --toc-text-muted: oklch(0.95 0 0 / 0.65);
    --toc-accent-color: oklch(0.65 0.22 260);
    --toc-item-hover: oklch(0.65 0 0 / 0.15);
    --toc-node-bg: oklch(0.50 0 0);
    --toc-node-accent: oklch(0.55 0.2 260);
}

/* ── Light theme ── */
html[data-theme="light"] {
    --toc-bg-color: var(--top-background-color);
    --toc-border-color: oklch(0.8 0 0);
    --toc-text-color: oklch(0.35 0 0);
    --toc-text-muted: oklch(0.35 0 0 / 0.65);
    --toc-accent-color: oklch(0.65 0.22 260);
    --toc-item-hover: oklch(0.65 0 0 / 0.15);
    --toc-node-bg: oklch(0.70 0.03 240);
    --toc-node-accent: oklch(0.55 0.2 260);
}

html body {margin:0;}

  .toc-wrapper {
      font-family: var(--ui-font,"Segoe UI", Roboto, sans-serif);
      background: var(--toc-bg-color, transparent);
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .toc-header {
      flex-shrink: 0;
      position: sticky;
      top: 0;
      z-index: 10;
      padding: 8px;
      border-bottom: 1px solid var(--toc-border-color);
      background: var(--toc-bg-color);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
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
      border: 1px solid var(--toc-border-color);
      background: var(--toc-bg-color);
      color: var(--toc-text-muted);
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
      background: var(--toc-accent-color);
/* border-color: var(--toc-accent-color);*/
      color: #fff;
      box-shadow: 0 1px 4px rgba(0,122,255,0.25);
    }
    .toc-btn-close {
      margin-left: auto;
      font-size: 12px;
      border-radius: 6px;
    }

   .toc-btn-close:hover {
      background: oklch(0.65 0.2 30);
    }
   
   .toc-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 8px 8px 16px 8px;
    }
    .toc-tree { position: relative; }

    .toc-item {
      position: relative;
      padding: 4px 8px 4px calc(var(--indent) * var(--toc-chevron-size) + 8px);
      font-size: 12.5px;
      color: var(--toc-text-color);
      border-radius: 7px;
      transition: background 0.12s ease, color 0.12s ease;
      display: flex;
      align-items: center;
      background-repeat: no-repeat;
      cursor: default;
      line-height: 1.45;
    }

    /* ── Tree branch lines (L-shape with rounded corner) ── */

    /* Vertical spine segment for the current item's branch. */
    .toc-item[data-level]:not([data-level="0"])::before {
      content: "";
      position: absolute;
      left: calc((var(--indent) - 1) * var(--toc-chevron-size) + var(--toc-chevron-size) / 2 + 7.5px - var(--toc-spine-width) / 2);
      top: -14px;
      width: var(--toc-spine-width);
      height: calc(100% + 14px);
      background-color: var(--toc-border-color);
      border-radius: 0;
    }
    /* Last in branch: spine stops at the horizontal midpoint turn. */
    .toc-item[data-last="true"]:not([data-level="0"])::before {
      height: calc(50% + 14px + var(--toc-spine-width) / 2);
      border-radius: 0 0 0 10px;
    }
    /* Horizontal connector. */
    .toc-item[data-level]:not([data-level="0"])::after {
      content: "";
      position: absolute;
      left: calc((var(--indent) - 1) * var(--toc-chevron-size) + var(--toc-chevron-size) / 2 + 7.5px + var(--toc-spine-width) / 2);
      top: calc(50% - var(--toc-spine-width) / 2);
      width: calc(var(--toc-chevron-size) / 2 + var(--toc-spine-width));
      height: var(--toc-spine-width);
      background-color: var(--toc-border-color);
    }

    /* ── Circle node indicator ── */
    .toc-chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: var(--toc-chevron-size);
      height: var(--toc-chevron-size);
      border-radius: 50%;
      background-color: var(--toc-node-bg);
      background-size: 80% 80%;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='lightgray' viewBox='0 0 448 512'%3E%3Cpath d='M416 256c0 17.7-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z' /%3E%3C/svg%3E");
      cursor: pointer;
      user-select: none;
      position: relative;
      z-index: 2;
      margin-right: 5px;
      transition: background-color 0.15s ease;
    }
    /*.toc-chevron:hover { background-size: 80% 80%;}*/

    /* Leaf nodes: muted gray circle */
    .toc-item[data-has-children="false"] > .toc-chevron {
      background-color: var(--toc-node-bg);
    }
    /* Collapsed state: switch to plus icon */
    .toc-item[data-collapsed="true"] > .toc-chevron {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='lightgray' viewBox='0 0 448 512'%3E%3Cpath d='M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z' /%3E%3C/svg%3E");
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
      background-color: var(--toc-item-hover);
      color: var(--toc-accent-color);
    }
    .toc-item:hover > .toc-chevron {
      background-color: var(--toc-accent-color);
    }

    .toc-item[data-level="0"] {
      font-weight: 600;
      margin-top: 4px;
      font-size: 13px;
    }

    /* ── Placeholder (no headings) ── */
    .toc-placeholder {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 24px 16px;
      color: var(--toc-text-muted);
      text-align: center;
    }
    .toc-placeholder svg {
      opacity: 0.35;
    }
    .toc-placeholder-title {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--toc-text-color);
      opacity: 0.5;
    }
    .toc-placeholder-sub {
      font-size: 11.5px;
      opacity: 0.6;
      line-height: 1.5;
    }
```

## Implementation

```space-lua
-- priority: 10

config.define("SidepanelTOC", {
  type = "object",
  properties = {
    autoOpenOnLoad = { type = "boolean" },
    sidePanel = { type = "string" }
  }
})

local _tocVisible = false

-- Returns html, script (two values) so callers can pass script as the 4th arg to editor.showPanel.
function widgets.SidepanelTOC()
  local cfg = config.get("SidepanelTOC") or {}
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
        local children = {table.unpack(topLevelChild.children)}
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
    return nil, nil
  end
  -- Find min level for indentation normalization
  local minLevel = 6
  for _, h in ipairs(headers) do
    if h.level < minLevel then minLevel = h.level end
  end

  -- Inline JS snippets
  local jsExpandAll = [[
    (function() {
      var items = document.querySelectorAll('.toc-item');
      for (var i = 0; i < items.length; i++) {
        items[i].setAttribute('data-collapsed', 'false');
        items[i].style.display = '';
      }
      syscall('editor.unfoldAll');
      typeof window.__tocSaveState === 'function' && window.__tocSaveState();
    })()
  ]]

  local jsCollapseAll = [[
    (function() {
      var items = document.querySelectorAll('.toc-item');
      for (var i = 0; i < items.length; i++) {
        var level = parseInt(items[i].getAttribute('data-level'));
        items[i].setAttribute('data-collapsed', 'true');
        if (level === 0) {
          items[i].style.display = '';
        } else {
          items[i].style.display = 'none';
        }
      }
      syscall('editor.foldAll');
      typeof window.__tocSaveState === 'function' && window.__tocSaveState();
    })()
  ]]

  local jsToggleCollapse = [[
    (function(index, event) {
      event.stopPropagation();
      var items = document.querySelectorAll('.toc-item');
      var item = items[index];
      var level = parseInt(item.getAttribute('data-level'));
      var collapsed = item.getAttribute('data-collapsed') === 'true';
      var pos = parseInt(item.getAttribute('data-pos'));
      if (collapsed) {
        item.setAttribute('data-collapsed', 'false');
        for (var i = index + 1; i < items.length; i++) {
          var childLevel = parseInt(items[i].getAttribute('data-level'));
          if (childLevel <= level) break;
          if (childLevel === level + 1) {
            items[i].style.display = '';
          }
        }
        syscall('editor.moveCursor', pos);
        syscall('editor.toggleFold');
        for (var i = index + 1; i < items.length; i++) {
          var childLevel = parseInt(items[i].getAttribute('data-level'));
          if (childLevel <= level) break;
          if (childLevel === level + 1) {
            var childPos = parseInt(items[i].getAttribute('data-pos'));
            syscall('editor.moveCursor', childPos);
            syscall('editor.fold');
            items[i].setAttribute('data-collapsed', 'true');
          }
        }
        syscall('editor.moveCursor', pos);
      } else {
        item.setAttribute('data-collapsed', 'true');
        for (var i = index + 1; i < items.length; i++) {
          if (parseInt(items[i].getAttribute('data-level')) <= level) break;
          items[i].style.display = 'none';
        }
        syscall('editor.moveCursor', pos);
        syscall('editor.fold');
      }
      typeof window.__tocSaveState === 'function' && window.__tocSaveState();
    })(%d, event)
  ]]

  -- Build DOM elements
  local items = {}
  for i, h in ipairs(headers) do
    local relLevel = h.level - minLevel
    
    local isLastAtLevel = true
    for j = i + 1, #headers do
      if headers[j].level == h.level then
        isLastAtLevel = false
        break
      elseif headers[j].level < h.level then
        break
      end
    end

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

    local spineStyle = ""
    if #activeSpines > 0 then
      local gradients = {}
      for _, level in ipairs(activeSpines) do
        local n = tonumber(level) - 1
        table.insert(gradients, string.format(
          "linear-gradient(to right, transparent calc(%d * var(--toc-chevron-size) + var(--toc-chevron-size) / 2 + 7.5px - var(--toc-spine-width) / 2), var(--toc-border-color) calc(%d * var(--toc-chevron-size) + var(--toc-chevron-size) / 2 + 7.5px - var(--toc-spine-width) / 2), var(--toc-border-color) calc(%d * var(--toc-chevron-size) + var(--toc-chevron-size) / 2 + 7.5px + var(--toc-spine-width) / 2), transparent calc(%d * var(--toc-chevron-size) + var(--toc-chevron-size) / 2 + 7.5px + var(--toc-spine-width) / 2))",
          n, n, n, n
        ))
      end
      spineStyle = " background-image: " .. table.concat(gradients, ", ") .. ";"
    end

    local hasChildren = i < #headers and headers[i + 1].level > h.level

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
      table.unpack(itemChildren)
    }
    table.insert(items, item)
  end

  local toolbar = dom.div {
    class = "toc-toolbar",
    dom.button {
      class = "toc-btn",
      ["xonclick"] = jsCollapseAll,
      "XSVG_COLLAPSE"
    },
    dom.button {
      class = "toc-btn",
      ["xonclick"] = jsExpandAll,
      "XSVG_EXPAND"
    },
    dom.button {
      class = "toc-btn",
      ["xonclick"] = "syscall('system.invokeCommand', 'Refresh TOC in Sidepanel')",
      "XSVG_REFRESH"
    },
    dom.button {
      class = "toc-btn toc-btn-close",
      ["xonclick"] = "syscall('system.invokeCommand','Toggle TOC in Sidepanel')",
      "XSVG_CLOSE"
    }
  }

  local tocContainer = dom.div {
    class = "toc-wrapper",
    dom.div {
      class = "toc-header",
      toolbar,
    },
    dom.div { class = "toc-scroll",
      dom.div { class = "toc-tree", ["data-page"] = pageName, table.unpack(items) }
    }
  }

  local styles = [[
    <link rel="stylesheet" href="/.client/main.css">
    <style>
      /* Inline fallback so spine calc()s resolve correctly before async Space-Style injection */
  /*    html { --toc-chevron-size: 14px; --toc-spine-width: 3px; }*/
      .toc-wrapper { visibility: hidden; }
    </style>
  ]]

  local finalHtml = js.tojs(tocContainer).outerHTML
  
  finalHtml = finalHtml:gsub('xonclick=', 'onclick=')
  finalHtml = finalHtml:gsub('XSVG_EXPAND',   '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>')
  finalHtml = finalHtml:gsub('XSVG_COLLAPSE', '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>')
  finalHtml = finalHtml:gsub('XSVG_REFRESH',  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>')
  finalHtml = finalHtml:gsub('XSVG_CLOSE',    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>')

  local script = [[
    (function() {
      var MAX_ATTEMPTS = 40;
      var INTERVAL_MS  = 100;
      var attempts = 0;

      var pageName = document.querySelector('.toc-tree')?.getAttribute('data-page') || '';
      if (!window.__tocState || window.__tocState.page !== pageName) {
        window.__tocState = { page: pageName, collapsed: {} };
      }

      function applyCollapsedState() {
        var saved = window.__tocState.collapsed;
        if (!saved || Object.keys(saved).length === 0) return;
        var items = document.querySelectorAll('.toc-item');
        for (var i = 0; i < items.length; i++) {
          var idx = items[i].getAttribute('data-index');
          if (saved[idx]) {
            items[i].setAttribute('data-collapsed', saved[idx].collapsed);
            items[i].style.display = saved[idx].display;
          }
        }
      }

      window.__tocSaveState = function() {
        var items = document.querySelectorAll('.toc-item');
        var state = {};
        for (var i = 0; i < items.length; i++) {
          var idx = items[i].getAttribute('data-index');
          state[idx] = {
            collapsed: items[i].getAttribute('data-collapsed'),
            display: items[i].style.display
          };
        }
        window.__tocState.collapsed = state;
      };

      function injectAndReveal() {
        try {
          var parentHtml = window.parent.document.documentElement;
          var theme = parentHtml.getAttribute("data-theme");
          if (theme) {
            document.documentElement.setAttribute("data-theme", theme);
          }
          var customStyles = window.parent.document.getElementById("custom-styles")?.innerHTML || "";
          if (!customStyles && attempts < MAX_ATTEMPTS) {
            attempts++;
            setTimeout(injectAndReveal, INTERVAL_MS);
            return;
          }
          if (customStyles) {
            var container = document.getElementById("injected-custom-styles");
            if (!container) {
              container = document.createElement("div");
              container.id = "injected-custom-styles";
              document.head.appendChild(container);
            }
            container.innerHTML = customStyles;
          }
        } catch (e) {
          console.warn("SidepanelTOC: could not inject space styles", e);
        }
        applyCollapsedState();
        var wrapper = document.querySelector(".toc-wrapper");
        if (wrapper) { wrapper.style.visibility = "visible"; }
      }

      injectAndReveal();
    })();
  ]]

  return finalHtml .. styles, script
end

-- Returns a placeholder panel html, script for pages with no headings.
function widgets.SidepanelTOCPlaceholder()
  local cfg = config.get("SidepanelTOC") or {}

  local closeBtn = dom.div {
    class = "toc-wrapper",
    dom.div {
      class = "toc-header",
      dom.div {
        class = "toc-toolbar",
        dom.button {
          class = "toc-btn toc-btn-close",
          ["xonclick"] = "syscall('system.invokeCommand','Toggle TOC in Sidepanel')",
          "XSVG_CLOSE"
        }
      }
    },
    dom.div {
      class = "toc-placeholder",
      dom.span { class = "toc-placeholder-title", "No headings" },
      dom.span { class = "toc-placeholder-sub", "This page has no headings to display in the TOC." }
    }
  }

  local styles = [[
    <link rel="stylesheet" href="/.client/main.css">
    <style>
      .toc-wrapper { visibility: hidden; }
    </style>
  ]]

  local finalHtml = js.tojs(closeBtn).outerHTML
  finalHtml = finalHtml:gsub('xonclick=', 'onclick=')
  finalHtml = finalHtml:gsub('XSVG_CLOSE', '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>')

  local script = [[
    (function() {
      var MAX_ATTEMPTS = 40;
      var INTERVAL_MS  = 100;
      var attempts = 0;

      function injectAndReveal() {
        try {
          var parentHtml = window.parent.document.documentElement;
          var theme = parentHtml.getAttribute("data-theme");
          if (theme) {
            document.documentElement.setAttribute("data-theme", theme);
          }
          var customStyles = window.parent.document.getElementById("custom-styles")?.innerHTML || "";
          if (!customStyles && attempts < MAX_ATTEMPTS) {
            attempts++;
            setTimeout(injectAndReveal, INTERVAL_MS);
            return;
          }
          if (customStyles) {
            var container = document.getElementById("injected-custom-styles");
            if (!container) {
              container = document.createElement("div");
              container.id = "injected-custom-styles";
              document.head.appendChild(container);
            }
            container.innerHTML = customStyles;
          }
        } catch (e) {
          console.warn("SidepanelTOC: could not inject space styles", e);
        }
        var wrapper = document.querySelector(".toc-wrapper");
        if (wrapper) { wrapper.style.visibility = "visible"; }
      }

      injectAndReveal();
    })();
  ]]

  return finalHtml .. styles, script
end

command.define {
  name = "Toggle TOC in Sidepanel",
  run = function()
    local cfg = config.get("SidepanelTOC") or {}
    local sidePanel = cfg.sidePanel or "rhs"
    if _tocVisible then
      editor.hidePanel(sidePanel)
      _tocVisible = false
      clientStore.set("customTocVisible", "false")
    else
      local html, script = widgets.SidepanelTOC()
      if html then
        editor.showPanel(sidePanel, 1, html, script)
        _tocVisible = true
        clientStore.set("customTocVisible", "true")
      else
        -- No headings: show placeholder instead of doing nothing
        local placeholderHtml, placeholderScript = widgets.SidepanelTOCPlaceholder()
        editor.showPanel(sidePanel, 1, placeholderHtml, placeholderScript)
        _tocVisible = true
        clientStore.set("customTocVisible", "true")
      end
    end
  end
}

command.define {
  name = "Refresh TOC in Sidepanel",
  run = function()
    local cfg = config.get("SidepanelTOC") or {}
    local sidePanel = cfg.sidePanel or "rhs"
    if _tocVisible then
      local html, script = widgets.SidepanelTOC()
      if html then
        editor.showPanel(sidePanel, 1, html, script)
      else
        print("No headers found to display.")
      end
    end
  end
}

event.listen {
  name = "editor:pageLoaded",
  run = function(e)
    local cfg = config.get("SidepanelTOC") or {}
    local sidePanel = cfg.sidePanel or "rhs"

    local visible = clientStore.get("customTocVisible")
    if visible ~= "true" then
      _tocVisible = false
      return
    end

    local html, script = widgets.SidepanelTOC()
    if html then
      editor.showPanel(sidePanel, 1, html, script)
      _tocVisible = true
    else
      -- Page has no headings: replace stale TOC with placeholder
      local placeholderHtml, placeholderScript = widgets.SidepanelTOCPlaceholder()
      editor.showPanel(sidePanel, 1, placeholderHtml, placeholderScript)
      _tocVisible = true
    end
  end
}
```


## Discussions to this library
- [Silverbullt Community](https://community.silverbullet.md/t/table-of-contents-in-sidepanel-work-in-progress/3919)