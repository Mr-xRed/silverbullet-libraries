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

```space-lua
config.set("CustomTOCSidebar", {
    autoOpenOnLoad = true,
    sidePanel = "rhs"
  })
```

## Implementation
```space-lua

```