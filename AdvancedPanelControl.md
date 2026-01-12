---
name: "Library/Mr-xRed/AdvancedPanelControl"
tags: meta/library
files:
- UnifiedAdvancedPanelControl.js
pageDecoration.prefix: "🛠️ "
---

# Advanced Panel Controls (LHS, RHS, BHS) 

## Main features
- **Unified** **Advanced Panel Controls** (UAPC) with the Floating Window JavaScript.
- **Control Buttons** on panels for close, full-width, mode switch and expand/collapse
- **Gesture/Swipe Control** for Mobile users.
- Switch between Window Mode and Docked Panel Mode seamlessly.
- Added **Synthetic Panels** concept, to assign a virtual panel side to a floating window.
- Consistent panel controls across all Panels and Synthetic Panels
- Panel sizing is persisted via clientStore (LHS, RHS, BHS).
- Panel constraints configurable (min/max width and height).
- Button-Size and Style configurable through Space-Style (Documentation -> Soon)

u![UAPC-Screenshot|1000px](https://raw.githubusercontent.com/Mr-xRed/silverbullet-libraries/refs/heads/main/UAPC-Screenshot.png)


## Known Issues
- BHS (Bottom Hand Side) panel resizing, controls and full feature support not yet implemented.
- Bug: Edge cases when multiple real panels are added after synthetic panels may need further handling.
- Bug: Gesture Control when in Full Width mode, any Swipe direction will go back into expanded panel
- Close Panel button, will "only" close the Panel for the current instance. If the Plug uses the  "Toggle" logic the panel is reserved persistently between Refreshes (e.g. TreeView Plug, DocumentExplorer(with `recoverAfterRefresh = true`) will return to the Panel even after you closed it from the "Close" button)  -> To effectively close that panel use the dedicated Close Button provided by the developer of the Plug/library. This doesnt affect Synthetic Panels

## ToDo`s:
- Finish the migration of the DocumentExplorer to the new Panel system
- Styling & Design is not yet completed - inconsistencies might appear
- Config & Space-Style Documentation still needs to be done
- and many more...


## Configuration

*   **auto**: It automatically toggles between docked and overlay based on your screen width. (default)
*   **dock**: Best for desktops; it pushes the editor to the side to make room for your panels.
*   **overlay**: Ideal for mobile or focused work; the panels float over the editor to temporarily access the panel


```lua
config.set("AdvancedPanelControl", {
  mode = "auto",  -- "auto" | "overlay" | "dock"
  gestures = true,  -- true (enabled), false (disabled)
  minWidth = "300", -- min Width Constraints for LHS and RHS
  maxWidth = "1000", -- max Width Constraints for LHS and RHS
  minHeight = "100", -- min Height Constraints for BHS
  maxHeight = "500", -- max Height Constraints for BHS
})
```


> **warning** IMPORTANT!
> For this Library to work as intended you need to remove all your previous custom space-styles or Libraries which you added previously to manipulate the panels, otherwise it will conflict with them!

## Implementation

### Default overrides
```space-style

#sb-main .cm-editor .cm-content {padding: 5px 40px;}

#sb-top {z-index: 105; }

#sb-top .panel {position: fixed;}

#sb-editor { min-width: 0;}

.sb-lua-wrapper { max-width: 100%; overflow-x: auto; }

```


```space-style
/* priority: 100*/
/* ---------------------------------------------------------
   Root Variables
   --------------------------------------------------------- */
   
:root {
  --header-height: 20px;
  --frame-width: 5px;
  --frame-opacity: 100%;
  --uapc-border: 2px;
  --uapc-border-radius: 8px;
  
  --control-btn-size: 28px;
  --control-btn-size-hover: 28px;
  --btn-border-radius: 15px;
  --drag-line-width: 16px;
  --lhs-control-postion: 50vh;
  --rhs-control-postion: 50vh;
  --bhs-control-postion: 50vw;
}

/* ----- Accent Colors ------ */
html[data-theme="dark"] {
  --uapc-accent-color: var(--ui-accent-color);
  --uapc-border-color: oklch( from var(--uapc-accent-color) calc(l - 0.5) c h / var(--frame-opacity) );
}

html[data-theme="light"] {
  --uapc-accent-color: var(--ui-accent-color);
  --uapc-border-color: oklch( from var(--uapc-accent-color) calc(l - 0.5) c h / var(--frame-opacity) );
}


/* =========================================================
   Floating Window
   ========================================================= */

.sb-window-container {
  position: fixed !important;
  z-index: 89 !important;

  display: flex !important;
  flex-direction: column !important;
  box-sizing: border-box !important;

  padding: var(--frame-width);
  border: var(--uapc-border) solid var(--uapc-border-color);
  border-radius: calc(var(--uapc-border-radius) + var(--frame-width));

  background: oklch( from var(--uapc-accent-color) l 0.01 h / var(--frame-opacity));

  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px #00000090;

  touch-action: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.sb-window-container.is-focused {
  background: oklch( from var(--uapc-accent-color) l 0.15 h / var(--frame-opacity));
  border-color: var(--uapc-border-color) !important;
  box-shadow: 0 0 20px #000000b0;
}

/* ---------------------------------------------------------
   Window Header
   --------------------------------------------------------- */

.sb-window-header {
  position: relative;

  height: var(--header-height) !important;
  width: 100% !important;

  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  cursor: grab !important;
  border-radius: 8px !important;
  flex-shrink: 0 !important;

  transition: background 0.2s ease;
}

.is-panel .sb-window-header::after {
  content: "";

  width: 60px;
  height: 12px;

  background: repeating-linear-gradient(
    to bottom,
    #808080cc 0px,
    #808080cc 2px,
    transparent 2px,
    transparent 5px
  );

  opacity: 0.6;
}

.sb-window-title {
  max-width: 100%;
  padding: 0 75px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  font-size: 0.85em;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;

  color: var(--root-color);
  pointer-events: none;
  z-index: 1;
}

/* ---------------------------------------------------------
   Window Close Button
   --------------------------------------------------------- */

.sb-window-close-btn {
  position: absolute;
  top: -2px;
  right: 0;

  width: 22px;
  height: 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  color: var(--root-color);

  cursor: pointer;
  border-radius: 6px;

  background: oklch(
    from var(--uapc-accent-color)
    l 0.02 h / 0.1
  );

  transition: all 0.2s;
  z-index: 92;
}

.sb-window-container.is-focused .sb-window-close-btn {
  background: oklch(
    from var(--uapc-accent-color)
    l c h / 0.5
  );
}

.sb-window-close-btn:hover,
.sb-window-container.is-focused .sb-window-close-btn:hover {
  background: oklch(0.65 0.2 30);
  color: white;
}

/* ---------------------------------------------------------
   Window Content
   --------------------------------------------------------- */

.sb-window-content {
  position: relative !important;
  flex: 1 1 0% !important;

  margin-top: 4px !important;
  width: 100% !important;
  height: 100% !important;

  overflow: clip !important;
  box-sizing: border-box !important;

  border: var(--uapc-border) solid var(--uapc-border-color) !important;
  border-radius: var(--uapc-border-radius) !important;
  
  background: var(--root-background-color, transparent) !important;
}

.sb-window-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

/* =========================================================
   Window Resizers
   ========================================================= */

.sb-resizer { position: absolute; z-index: 91;}

.resizer-t,
.resizer-b {
  left: 20px;
  right: 20px;
  height: 8px;
  cursor: ns-resize;
}

.resizer-t { top: 0; }
.resizer-b { bottom: 0; }
.resizer-l,.resizer-r {top:20px;bottom:20px;width:8px;cursor:ew-resize;}
.resizer-l { left: 0; }
.resizer-r { right: 0; }
.resizer-tl,.resizer-tr,.resizer-bl,.resizer-br{width:22px;height: 22px;}
.resizer-tl { top: 0; left: 0; cursor: nwse-resize; }
.resizer-tr { top: 0; right: 0; cursor: nesw-resize; }
.resizer-bl { bottom: 0; left: 0; cursor: nesw-resize; }
.resizer-br { bottom: 0; right: 0; cursor: nwse-resize; }

/* =========================================================
   Panel Controls (Migrated)
   ========================================================= */

/* ---------------------------------------------------------
   Base Panel Behaviour
   --------------------------------------------------------- */

.sb-panel {
  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1) !important;
  overflow: visible !important;
}


/* ---------------------------------------------------------
   Unified Control Buttons
   --------------------------------------------------------- */

@property --control-btn-size { syntax: '<length>'; inherits: true; initial-value: 24px; }

.sb-panel-controls-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  transform: translateY(-50%);
  gap: 0px;
  z-index: 91;
  border: 1px solid var(--panel-border-color);
  background: oklch( from var(--top-background-color) l c h / var(--frame-opacity) );
  transition: --control-btn-size 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
}

.sb-panel-controls-container:hover {--control-btn-size: var(--control-btn-size-hover);}

.sb-panel-control-base {
  width: var(--control-btn-size);
  height: var(--control-btn-size);
  
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: monospace;
  font-weight: bold;
  font-size: calc(var(--control-btn-size) - 10px);

  color: var(--root-color);
  cursor: pointer;

  transition: color 0.3s cubic-bezier(0.25, 1, 0.5, 1),
              background 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.sb-panel-control-base:hover {
  background: var(--ui-accent-color);
  color: white;
}

.lhs .sb-drawer-toggle, .rhs .sb-drawer-toggle {
  height: calc(3 * var(--control-btn-size));
}

.bhs .sb-drawer-toggle {
  width: calc(3 * var(--control-btn-size));
}
/* ---------------------------------------------------------
   Panel Orientations
   --------------------------------------------------------- */

.lhs .sb-panel-controls-container {
  top: var(--lhs-control-postion);
  right: calc((-1 * var(--control-btn-size)) - 1px);

  border-left: none;
  border-radius: 0 var(--btn-border-radius)
                 var(--btn-border-radius) 0;
}

.rhs .sb-panel-controls-container {
  top: var(--rhs-control-postion);
  left: calc((-1 * var(--control-btn-size)) - 1px);
  
  border-right: none;
  border-radius: var(--btn-border-radius) 0
                 0 var(--btn-border-radius);
}

.bhs .sb-panel-controls-container {
  top: calc((-1 * var(--control-btn-size)) - 1px);
  right: var(--bhs-control-postion);

  flex-direction: row;

  border-bottom: none;
  border-radius: var(--btn-border-radius)
                 var(--btn-border-radius) 0 0;
}

/* ---------------------------------------------------------
   Border Radius Logic
   --------------------------------------------------------- */

.lhs .sb-panel-control-base:first-child {
  border-radius: 0 var(--btn-border-radius) 0 0;
}

.lhs .sb-panel-control-base:last-child {
  border-radius: 0 0 var(--btn-border-radius) 0;
}

.rhs .sb-panel-control-base:first-child {
  border-radius: var(--btn-border-radius) 0 0 0;
}

.rhs .sb-panel-control-base:last-child {
  border-radius: 0 0 0 var(--btn-border-radius);
}

.bhs .sb-panel-control-base:first-child {
  border-radius: var(--btn-border-radius) 0 0 0;
}

.bhs .sb-panel-control-base:last-child {
  border-radius: 0 var(--btn-border-radius) 0 0;
}

/* ---------------------------------------------------------
   Panel States
   --------------------------------------------------------- */

.sb-panel.is-collapsed { pointer-events: none;}

.sb-panel.is-collapsed.lhs { margin-left: calc(var(--sb-panel-width) * -1);}
.sb-panel.is-collapsed.rhs { margin-right: calc(var(--sb-panel-width) * -1);}
.sb-panel.is-collapsed.bhs { margin-bottom: calc(var(--sb-panel-height) * -1);}

.sb-panel.is-collapsed .sb-panel-controls-container { pointer-events: auto;}

/* Fullscreen */

.sb-panel.is-full {
  position: fixed !important;
  z-index: 98 !important;
  top: 56px !important;
  left: 0 !important;
  width: 100vw !important;
  height: calc(100vh - 56px) !important;
  margin: 0 !important;
  transform: none !important;
}

.sb-panel.is-full .sb-panel-controls-container{
  border: 1px solid var(--panel-border-color) !important;
  border-radius: var(--btn-border-radius);}


.sb-panel.rhs.is-full { left: auto !important; right: 0 !important;}
.sb-panel.is-full .sb-panel-control-base:first-child {
  border-radius: var(--btn-border-radius) var(--btn-border-radius) 0 0;}
.sb-panel.is-full .sb-panel-control-base:last-child {
  border-radius: 0 0 var(--btn-border-radius) var(--btn-border-radius);}


.sb-panel.lhs.is-full .sb-panel-controls-container{ right: 5px; }
.sb-panel.rhs.is-full .sb-panel-controls-container{ left: 5px; }


/* ---------------------------------------------------------
   Resize Handles
   --------------------------------------------------------- */

.sb-drag-handle {
  position: absolute;
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: center;

  touch-action: none;
}

.sb-drag-line {
  position: absolute;

  background: var(--ui-accent-color, #007bff);
  opacity: 0;

  transition: opacity 0.3s;
  pointer-events: none;
}

.sb-drag-handle:hover .sb-drag-line {
  opacity: 0.5;
  background: gray;
}

.sb-drag-handle[data-dragging="true"] .sb-drag-line {
  opacity: 1 !important;
  background: var(--ui-accent-color) !important;
}

/* LHS */
.lhs .sb-drag-handle {
  top: 0;
  right: 0;

  width: var(--drag-line-width);
  height: 100%;

  transform: translateX(50%);
  cursor: col-resize;
}

.lhs .sb-drag-line {
  top: 0;
  left: calc(-2px + 0.5 * var(--drag-line-width));

  width: 4px;
  height: 100%;
}

/* RHS */
.rhs .sb-drag-handle {
  top: 0;
  left: 0;

  width: var(--drag-line-width);
  height: 100%;

  transform: translateX(-50%);
  cursor: col-resize;
}

.rhs .sb-drag-line {
  top: 0;
  left: calc(-2px + 0.5 * var(--drag-line-width));

  width: 4px;
  height: 100%;
}

/* BHS */
.bhs .sb-drag-handle {
  top: calc(-0.5 * var(--drag-line-width));
  left: 0;

  width: 100%;
  height: var(--drag-line-width);

  cursor: row-resize;
}

.bhs .sb-drag-line {
  top: 8px;
  left: 0;

  width: 100%;
  height: 2px;
}

/* Detached */
.sb-panel.is-detached-window .sb-drag-handle,
.sb-panel.is-detached-window .sb-panel-controls-container {
  display: none;
}


```

### Space-Lua + JS (Imports)
```space-lua
-- priority: -1

-- Helper to bridge JS calls back to SilverBullet Lua functions
function hideSilverBulletPanel(id)
  editor.hidePanel(id)
end

function initPanelControls()
  -- Configuration extraction
  local cfg = config.get("AdvancedPanelControl") or {}
  local panelMode = cfg.mode or "auto"
  local gesturesEnabled = cfg.gestures ~= false

  -- Dimensional Constraints
  local minWidth = cfg.minWidth or "300"
  local maxWidth = cfg.maxWidth or "1000"
  local minHeight = cfg.minHeight or "100"
  local maxHeight = cfg.maxHeight or "500"

  -- Handle Positioning
  local lhsPos = cfg.lhsHandlePosition or "50%"
  local rhsPos = cfg.rhsHandlePosition or "50%"
  local bhsPos = cfg.bhsHandlePosition or "50%"

  -- Store Retrieval
  local savedLHS = clientStore.get("lhsPanelWidth") or "300"
--  editor.flashNotification(savedLHS)
  local savedRHS = clientStore.get("rhsPanelWidth") or "300"
--  editor.flashNotification(savedRHS)
  local savedBHS = clientStore.get("bottomPanelHeight") or "200"
--  editor.flashNotification(savedBHS)

-- Pass configuration and saved values to the module's initPanelControls function.
  local jsModule = js.import("/.fs/Library/Mr-xRed/UnifiedAdvancedPanelControl.js")
  if jsModule and jsModule.initPanelControls then
    jsModule.initPanelControls({
      panelMode = panelMode,
      gestures = gesturesEnabled,
      constraints = { minW = tonumber(minWidth), maxW = tonumber(maxWidth), minH = tonumber(minHeight), maxH = tonumber(maxHeight) },
      positions = { lhs = lhsPos, rhs = rhsPos },
      savedLHS = savedLHS,
      savedRHS = savedRHS,
      savedBHS = savedBHS
    })
  else
--    editor.flashNotification("Failed to initialize UnifiedFloating.js module")
  end

  -- Register listeners that were previously wired in Lua (store saves and close)
  js.window.addEventListener("sb-save-lhs", function(e)
    clientStore.set("lhsPanelWidth", e.detail.value)
--    editor.flashNotification(e.detail.value)
  end)
  js.window.addEventListener("sb-save-rhs", function(e)
    clientStore.set("rhsPanelWidth", e.detail.value)
--    editor.flashNotification(e.detail.value)
  end)
  js.window.addEventListener("sb-save-bhs", function(e)
    clientStore.set("bottomPanelHeight", e.detail.value)
--    editor.flashNotification(e.detail.value)
  end)
  js.window.addEventListener("sb-close-panel", function(e)
    hideSilverBulletPanel(e.detail.type)
  end)
  js.window.addEventListener('silverbullet:hidePanel', function(e)
    hideSilverBulletPanel(e.detail.type)
  end)
  
  js.window.addEventListener("flashNotification", function(e)
    editor.flashNotification(e.detail.value)
  end)

end

initPanelControls()

```

# Discussions about this library
- [Silverbullet Community](https://community.silverbullet.md/t/resizing-side-panels-lhs-rhs-bhs-using-drag-handle/3728)