---
name: "Library/Mr-xRed/Treeview_Extension_DragAndResize"
tags: meta/library
files:
- PanelDragResize.js
pageDecoration.prefix: "📎 "
---
# Treeview Extension to Drag & Resize

> **warning** Experimental
> This Extension is still experimental and it might not work on all your Devices/Mobiles/Tablets/Browsers as intended.

> **warning** Dependencies
> You must have TreeView Plug installed: [Treeview Plug](https://github.com/joekrill/silverbullet-treeview)

## How to Install?

### Step 1. Replace your Treeview ActionButton, with new command:

> **note** Important
> Replace the old command: `"Tree View: Toggle"` with this one: `"Tree View: Toggle Move&Resize"`

Here is an example how your ActionButton Config should look like this:

```lua
    {
      icon = "layout", description = "Toggle Tree View",
      run = function()
        editor.invokeCommand "Tree View: Toggle Move&Resize"
       end
    },
```

### Step 2. System Reload: ${widgets.commandButton("System: Reload")}

### Step 3. Reload UI and enjoy: ${widgets.commandButton("Client: Reload UI")}

> **success** Success
> Now you have a Movable and Resizable TreeView

## How does this work:
> **warning** This is currently more like a hack than a real-world implementation
>   1.  **Selection of elements:** It grabs the two panel `<div>` (primary and secondary) and the primary is used as the header element and as the drag handle.
>   2.  **State tracking:** Maintains flags (`isDragging`, `isResizing`) and initial offsets/positions for calculating movement or resizing.
>   3.  **Edge detection:** Determines if the pointer is near the right or bottom edges to switch between drag mode and resize mode.
>   4.  **Dragging logic:** Calculates the new top-left position of the primary panel based on cursor movement and applies the same relative delta to the secondary panel.
>   5.  **Resizing logic:** Computes width/height changes from pointer movement and updates both panels dimensions while keeping their relative sizes.
>   6.  **Cursor management:** Dynamically updates the cursor style (`grab`, `move`, `resize`) depending on hover or active action.
>   7.  **Iframe handling:** Temporarily disables `pointer-events` on any nested iframes while dragging/resizing to prevent event capture issues.
>   8.  **Bounds and snapping:** Ensures panels stay within screen limits, respect minimum width/height, and snap to edges if near.
>   9.  **Persistence:** Stores panel positions and sizes in `localStorage` so the layout survives reloads.
>   10. **Global pointer management:** Uses `window` event listeners for pointermove and pointerup to ensure smooth dragging/resizing even if the cursor leaves the header, cleaning up afterward.
>  
> ==This is essentially a two-panel windowing system built on top of elements never intended for it.==


## Implementation
### Visual Customization & Style
```space-style

:root{
    --sb-panel-width: 400px;      /* Default panel width */
    --sb-panel-height: 400px;     /* Default panel height */

    --min-sb-panel-height: 250px; /* Minimal panel height */
    --min-sb-panel-width: 250px;  /* Minimal panel width */

    --header-height: 30px;        /* Header height, drag-area */
    --top-offset: 70px;           /* Initial position */
    --left-offset: 10px;          /* Initial position */

    --frame-width: 5px;           /* frame thickness, you need to clear local storage to take effect*/
    --frame-color: rgba(64, 64, 64, 0.2);         /* frame color */

    --window-border: 2px;         /* solid border width (aesthetic) */
    --window-border-radius: 10px; /* inner iframe border radius*/
    --window-border-color: #5558; /* solid border color (aesthetic) */
}

#sb-top .panel{
  display: block;
  position: fixed;

  box-sizing: border-box ; 

  width: var(--sb-panel-width);
  height: var(--sb-panel-height);

  top: calc(var(--top-offset));
  left: calc(var(--left-offset));

  min-height: var(--min-sb-panel-width);
  min-width: var(--min-sb-panel-height);

  background: var(--frame-color) !important;
  border: var(--window-border) solid var(--window-border-color);

  backdrop-filter: blur(10px);
  box-shadow:0px 0px 20px #0008;

  border-radius: calc(var(--window-border-radius) + (var(--frame-width)));
  z-index: 20;
}

#sb-main .sb-panel {
  display: block;
  position: fixed;
  overflow: hidden;

  box-sizing: border-box ; 

  min-width: calc(var(--min-sb-panel-width) - 2 * (var(--frame-width) + var(--window-border)));
  min-height: calc(var(--min-sb-panel-height) - var(--header-height) - var(--frame-width) - var(--window-border));

  width: calc(var(--sb-panel-width) - 2 * (var(--frame-width) + var(--window-border)));
  height: calc(var(--sb-panel-height) - var(--header-height) - var(--frame-width) - var(--window-border));
  top: calc(var(--top-offset) + (var(--header-height)));
  left: calc(var(--left-offset) + 2px + var(--frame-width));

  background: #0000;
  border: var(--window-border) solid var(--window-border-color) !important;
  border-radius: var(--window-border-radius);
  z-index: 20;
}
```

## Redefine Keybindings and Command
```space-lua
command.update {
  name = "Tree View: Toggle",
  key = "",
  mac = "",
  hide = true
}

command.define {
  name = "Tree View: Toggle Move&Resize",
  key = "Ctrl-Alt-b",
  mac = "Cmd-Alt-b",
  run = function()
        editor.invokeCommand "Tree View: Toggle"
        js.import("/.fs/Library/Mr-xRed/PanelDragResize.js").enableDrag()
       end
}
```


## Discussions about this extension:
- [SilverBullet Community](https://community.silverbullet.md/t/proof-of-concept-floating-widgets-example-treeview-orbitcal-calendar/3442?u=mr.red)
