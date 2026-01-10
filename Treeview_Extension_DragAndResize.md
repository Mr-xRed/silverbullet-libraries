---
name: "Library/Mr-xRed/Treeview_Extension_DragAndResize"
tags: meta/library
pageDecoration.prefix: "☠️ "
---
# Treeview or Document Explorer Extension to Drag & Resize

> **danger** ☠️ DEPRECATED

> **warning** Dependencies
> You must have TreeView Plug installed: [Treeview Plug](https://github.com/joekrill/silverbullet-treeview)
> to use it with [Document Explorer](https://github.com/Mr-xRed/silverbullet-libraries/blob/main/DocumentExplorer.md) you don’t need to install this Extension, it is already included in that Library.

> **tip** New ShortCut Keys
> `Ctrl-Alt-a` / `Cmd-Alt-a` - Toggle Tree View with Move&Resize
> `Ctrl-Alt-b` / `Cmd-Alt-b` - Toggle Tree View 

## How to Install?

### Step 1. Replace your Tree View ActionButton, with the new command:

> **note** Important
> Replace the old command: `"Tree View: Toggle"` with this one: `"Tree View: Toggle Move&Resize"`

Here is an example how your ActionButton Config should look like this:

```
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

> **success** Fixed
>   * **DOM Encapsulation:** Instead of linking two panels, it dynamically "kidnaps" the existing `.sb-panel` and wraps it inside a new `.sb-container` parent, creating a self-contained window unit. 
> >  * **Shadow Header Injection:** It generates a dedicated `.sb-header` element that acts as a structural handle. This separates the "Drag Zone" from the "Content Zone," preventing accidental interactions with the UI inside the panel.
>   * **Stateful Persistence:** Uses a unified JSON object in `localStorage` to preserve the window's "geometry" (X, Y, Width, Height) across sessions.
> >  * **Overlay Protection:** Automatically manages `pointer-events` on nested iframes during movement. This prevents the "Iframe Trap" where the cursor gets "swallowed" by the internal content, causing the drag to stutter or fail.
>   * **Edge-Independent Resizing:** Uses a dedicated `.sb-resize-handle` anchor in the bottom-right corner rather than simple edge detection, providing a much more reliable target for resizing on high-resolution screens.
>   * **Auto-Cleanup Observer:** Employs a `MutationObserver` to watch the global DOM. If the original panel is removed (e.g., by the system closing the panel), the script detects this and automatically destroys the container to prevent "ghost" elements.
>   * **Priority Style Injection:** Injects a CSS block directly into the main document’s `<head>` with `!important` flags to override hardcoded system styles that would otherwise force the panel back to its original position.
>   * **Pointer Capture API:** Utilizes `setPointerCapture` so that even if the user moves the mouse faster than the window can follow, the browser keeps the "focus" on the drag/resize action.
> >  * **Context-Aware Global Fixes:** Targets external elements (like `#sb-top .panel`) via the main HTML head to ensure the entire workspace adapts to the floating window layout.


## Visual Customization & Style

```
:root{
  --header-height: 20px;          /* Header height, drag-area */
  --frame-width: 5px;             /* frame thickness */
  --frame-color: #f040401d;        /* frame color */
  --window-border: 2px;           /* solid border width */
  --window-border-radius: 10px;   /* inner iframe border radius */
  --window-border-color: #00000000;   /* solid border color */
} 

```

## Define Command with Move&Resize JS
```
-- priority: -1

command.define {
  name = "Tree View: Toggle Move&Resize",
  key = "Ctrl-Alt-a",
  mac = "Cmd-Alt-a",
  run = function()
        local cfg = config.get("treeview") or {}
        local PANEL_ID = cfg.position or "lhs"
        local selector = "#sb-main .sb-panel." .. PANEL_ID
        editor.invokeCommand "Tree View: Toggle"
        editor.flashNotification(selector)
        js.import("/.fs/Library/Mr-xRed/UnifiedFloating.js").enableDrag(selector) 
    end
}
```


## Discussions about this extension:
- [SilverBullet Community](https://community.silverbullet.md/t/proof-of-concept-floating-widgets-example-treeview-orbitcal-calendar/3442?u=mr.red)
