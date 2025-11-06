---
tags: meta/library
---

## Discussions
* [SilverBullet Community](https://community.silverbullet.md/t/css-structure-map-for-silverbullet/3507?u=mr.red)


> **warning** Caution
> WORK IN PROGRESS not 100% accurate !!!


`html, body                                             ` ➡️ [[#Document]] 
`└── #sb-root                                           ` ➡️ [[#Root & Layout IDs]]
`    ├── .sb-modal-box                                  ` ➡️ [[#Top Bar Classes]]
`    │                                                  ` ➡️
`    ├── #sb-top                                        ` ➡️
`    │   ├── .main                                      ` ➡️
`    │   │   └── .inner                                 ` ➡️
`    │   │       └── .wrapper                           ` ➡️
`    │   │           ├── .sb-page-prefix                ` ➡️
`    │   │           ├── #sb-current-page               ` ➡️ Page Title editor
`    │   │           │   └── .cm-editor                 ` ➡️ Mini Editor
`    │   │           │       ├── .cm-scroller           ` ➡️
`    │   │           │       └── .cm-content            ` ➡️
`    │   │           │           └── .cm-line           ` ➡️
`    │   │           ├── .sb-notifications              ` ➡️
`    │   │           │   └── .sb-notification-{type}    ` ➡️
`    │   │           ├── .sb-sync-progress              ` ➡️
`    │   │           │   └── .progress-wrapper          ` ➡️
`    │   │           │       └── .progress-bar          ` ➡️
`    │   │           └── .sb-actions                    ` ➡️ Action Buttons
`    │   │               └── button                     ` ➡️
`    │   ├── .panel                                     ` ➡️
`    │   │                                              ` ➡️
`    │   ├── .sb-sync-error                             ` ➡️ conditional class on `#sb-top` 
`    │   ├── .sb-saved / .sb-unsaved / .sb-loading.     ` ➡️ on `#sb-current-page`
`    │   └── .sb-decorated-object                       ` ➡️ optional on `#sb-current-page`
`    │                                                  ` ➡️
`    ├── #sb-main                                       ` ➡️ main content area
`    │   ├── .sb-panel                                  ` ➡️ left/right panels
`    │   │   └── iframe                                 ` ➡️
`    │   └── #sb-editor                                 ` ➡️ editor container
`    │       ├── .cm-editor                             ` ➡️ CodeMirror editor
`    │       │   ├── .cm-scroller                       ` ➡️
`    │       │   ├── .cm-content                        ` ➡️
`    │       │   │   └── .cm-line                       ` ➡️ individual lines  [[#Line Type Classes]]
`    │       │   │       ├── .sb-line-h1 → .sb-line-h6  ` ➡️ heading levels
`    │       │   │       ├── .sb-line-code              ` ➡️ code blocks
`    │       │   │       ├── .sb-line-blockquote        ` ➡️ blockquotes
`    │       │   │       ├── .sb-line-task              ` ➡️ task items
`    │       │   │       ├── .sb-line-comment           ` ➡️
`    │       │   │       ├── .sb-line-hr                ` ➡️
`    │       │   │       ├── .sb-line-ul, .sb-line-ol   ` ➡️ list
`    │       │   │       └── .sb-line-li-{1 → 5}        ` ➡️ list indentation levels
`    │       │   ├── .cm-gutters                        ` ➡️ line gutters
`    │       │   ├── .cm-cursor / .cm-dropCursor        ` ➡️
`    │       │   ├── .cm-selectionBackground            ` ➡️
`    │       │   ├── .cm-panels-bottom                  ` ➡️ bottom panels like search
`    │       │   │   ├── .cm-search                     ` ➡️
`    │       │   │   │   ├── .cm-textfield              ` ➡️    
`    │       │   │   │   └── .cm-button                 ` ➡️
`    │       │   │   └── .cm-vim-panel                  ` ➡️
`    │       │   └── .cm-tooltip-autocomplete           ` ➡️
`    │       │       ├── .cm-completionLabel            ` ➡️
`    │       │       ├── .cm-completionDetail           ` ➡️
`    │       │       └── .cm-completionIcon             ` ➡️
`    │       ├── .sb-markdown-widget                    ` ➡️
`    │       ├── .sb-markdown-top-widget                ` ➡️
`    │       ├── .sb-markdown-bottom-widget             ` ➡️
`    │       ├── .sb-lua-directive-block                ` ➡️
`    │       ├── .sb-lua-directive-inline               ` ➡️
`    │       ├── .sb-top-iframe                         ` ➡️
`    │       └── .sb-bottom-iframe                      ` ➡️
`    │                                                  ` ➡️
`    └── .sb-bhs                                        ` ➡️ bottom horizontal split
`        └── .sb-panel                                  ` ➡️
`                                                       ` ➡️
# Notes

The structure is organized into three main sections:

`#sb-top` - header bar 
`#sb-main` - main content area with editor and panels
`.sb-bhs` - bottom horizontal split. 

The editor uses CodeMirror, so many classes are prefixed with `.cm-`
All styling can be customized through Space Style without modifying source files.

Page decorations allow per-page CSS class application via frontmatter.


## Document
- `html`, `body`  

## Root & Layout IDs

- `#sb-root`
- `#sb-top`  
- `#sb-main`  
- `#sb-editor`   ➡️ under `#sb-main`
- `#sb-current-page` ➡️ under `#sb-top > .main > .inner > .wrapper`


## Top Bar Classes

- `.sb-sync-error`  
- `.sb-saved`  
- `.sb-unsaved`  
- `.sb-loading`  
- `.sb-actions`  
- `.sb-notifications`  
- `.sb-notification-info`  
- `.sb-notification-error`  
- `.progress-wrapper`  
- `.progress-bar`  
- `.sb-page-prefix`  

## Panel & Layout Classes

- `.sb-panel` 
- `.sb-bhs`
- `.sb-modal`
- `.sb-modal-box` 
- `.sb-preview`  
- `.sb-bottom-iframe`  
- `.sb-top-iframe`  

## CodeMirror Editor Classes

- `.cm-editor`  
- `.cm-focused`  
- `.cm-content`  
- `.cm-line`  
- `.cm-gutters`  
- `.cm-foldPlaceholder`  
- `.cm-cursor`, `.cm-dropCursor`  
- `.cm-selectionBackground`  
- `.cm-panels-bottom`  
- `.cm-vim-panel`  
- `.cm-scroller`  
- `.cm-list-bullet`  
- `.cm-tooltip-autocomplete`  
- `.cm-completionDetail`  
- `.cm-completionLabel`  
- `.cm-completionIcon`  
- `.cm-search`  
- `.cm-textfield`  
- `.cm-button`  

## Line Type Classes

- `.sb-line-h1`, `.sb-line-h2`, `.sb-line-h3`, `.sb-line-h4`, `.sb-line-h5`, `.sb-line-h6`  
- `.sb-line-ul`  
- `.sb-line-ol`
- `.sb-line-li-1` through `.sb-line-li-6` (list indentation levels)
- `.sb-line-task`  
- `.sb-line-blockquote`  
- `.sb-line-code`  
- `.sb-line-fenced-code`  
- `.sb-line-code-outside`  
- `.sb-line-frontmatter-outside`  
- `.sb-line-table-outside`  
- `.sb-line-tbl-header`  
- `.sb-line-hr`  
- `.sb-line-comment`  

## Content Styling Classes

- `.sb-header-inside`  
- `.sb-hashtag`, `.hashtag`  
- `.sb-wiki-link`  
- `.sb-wiki-link-missing`  
- `.sb-wiki-link-invalid`  
- `.sb-naked-url`  
- `.sb-link`  
- `.sb-url`  
- `.sb-strikethrough`  
- `.sb-emphasis`  
- `.sb-strong`  
- `.sb-sub`  
- `.sb-sup`  
- `.sb-hr`  
- `.sb-highlight`  
- `.sb-meta`  
- `.sb-struct`  
- `.sb-code`  

## Task & Checkbox Classes

- `.sb-checkbox`  
- `.sb-task-mark`  
- `.sb-task-state`  
- `.sb-task-deadline`  
- `.cm-task-checked`  

## Widget Classes

- `.sb-markdown-widget`  
- `.sb-markdown-top-widget`  
- `.sb-markdown-bottom-widget`  
- `.sb-lua-directive-block`  
- `.sb-lua-directive-inline`  
- `.sb-lua-top-widget`  
- `.sb-lua-bottom-widget`  
- `.sb-widget-array`  
- `.sb-markdown-toolbar`  

## Directive Classes

- `.sb-directive`  
- `.sb-directive-mark`  

## Table Classes

- `.sb-table-widget` 



# Citations (2025-11-05)

**File:** client/styles/main.scss (L35-43)
```css
html,
body {
  margin: 0;
  height: 100%;
  padding: 0;
  width: 100%;
  overflow: hidden;
  background-color: var(--top-background-color);
}
```

**File:** client/styles/main.scss (L45-51)
```css
#sb-root {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--root-background-color);
}
```

**File:** client/styles/main.scss (L53-55)
```css
.sb-panel {
  flex: 1;
}
```

**File:** client/styles/main.scss (L57-62)
```css
.sb-bottom-iframe {
  width: 100%;
  margin-top: 10px;
  border: 1px solid var(--editor-widget-background-color);
  border-radius: 5px;
}
```

**File:** client/styles/main.scss (L64-69)
```css
.sb-top-iframe {
  width: 100%;
  margin-top: 10px;
  border: 1px solid var(--editor-widget-background-color);
  border-radius: 5px;
}
```

**File:** client/styles/main.scss (L71-80)
```css
#sb-main {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  height: 0;

  .sb-panel {
    flex: 1;
  }
}
```

**File:** client/styles/main.scss (L82-93)
```css
#sb-editor {
  flex: 2;
  height: 100%;

  width: 100%;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}
```

**File:** client/styles/main.scss (L101-109)
```css
.sb-bhs {
  height: 300px;
  width: 100%;
  z-index: 10;

  .sb-panel {
    height: 100%;
  }
}
```

**File:** client/styles/main.scss (L111-122)
```css
.sb-modal {
  position: absolute;
  z-index: 100;

  .sb-panel {
    height: 100%;

    iframe {
      background-color: initial;
    }
  }
}
```

**File:** client/styles/main.scss (L124-132)
```css
.sb-page-prefix {
  display: flex;
  align-items: baseline;
  flex: 0 0 auto;
  text-align: left;
  padding-top: 3px;
  font-family: var(--ui-font);
  white-space: pre-wrap;
}
```

**File:** client/styles/main.scss (L145-147)
```css
.sb-preview {
  position: relative;
}
```

**File:** client/styles/main.scss (L149-161)
```css
.sb-markdown-toolbar {
  position: absolute;
  opacity: 0;
  transition: opacity 0.2s;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;
}

.sb-markdown-toolbar:hover {
  opacity: 1;
```

**File:** client/styles/colors.scss (L7-10)
```css
.cm-cursor,
.cm-dropCursor {
  border-left: 1.2px solid var(--editor-caret-color) !important;
}
```

**File:** client/styles/colors.scss (L12-16)
```css
#sb-top {
  color: var(--top-color);
  background-color: var(--top-background-color);
  border-bottom: var(--top-border-color) 1px solid;
}
```

**File:** client/styles/colors.scss (L18-21)
```css
#sb-top.sb-sync-error {
  color: var(--top-sync-error-color);
  background-color: var(--top-sync-error-background-color);
}
```

**File:** client/styles/colors.scss (L23-25)
```css
.sb-saved {
  color: var(--top-saved-color);
}
```

**File:** client/styles/colors.scss (L27-29)
```css
.sb-unsaved {
  color: var(--top-unsaved-color);
}
```

**File:** client/styles/colors.scss (L31-33)
```css
.sb-loading {
  color: var(--top-loading-color);
}
```

**File:** client/styles/colors.scss (L54-60)
```css
.sb-notifications {
  font-family: var(--editor-font);
}

.sb-notifications > div {
  border: var(--notifications-border-color) 1px solid;
}
```

**File:** client/styles/colors.scss (L62-64)
```css
.sb-notification-info {
  background-color: var(--notification-info-background-color);
}
```

**File:** client/styles/colors.scss (L66-68)
```css
.sb-notification-error {
  background-color: var(--notification-error-background-color);
}
```

**File:** client/styles/colors.scss (L132-134)
```css
  .cm-scroller {
    font-family: var(--ui-font);
  }
```

**File:** client/styles/colors.scss (L187-189)
```css
  .cm-selectionBackground {
    background-color: var(--editor-selection-background-color);
  }
```

**File:** client/styles/colors.scss (L191-209)
```css
  .cm-panels-bottom {
    color: var(--editor-panels-bottom-color);
    background-color: var(--editor-panels-bottom-background-color);
    border-top: var(--editor-panels-bottom-border-color) 1px solid;

    .cm-search {
      .cm-textfield {
        background-color: var(--editor-panels-bottom-input-background-color);
      }
      .cm-button {
        background-image: var(--editor-panels-bottom-button-background-image);
        &:active {
          background-image: var(
            --editor-panels-bottom-button-active-background-image
          );
        }
      }
    }
  }
```

**File:** client/styles/colors.scss (L260-262)
```css
.sb-naked-url {
  color: var(--editor-naked-url-color);
}
```

**File:** client/styles/colors.scss (L284-286)
```css
.sb-line-code {
  background-color: var(--editor-code-background-color);
}
```

**File:** client/styles/colors.scss (L288-290)
```css
.sb-struct {
  color: var(--editor-struct-color);
}
```

**File:** client/styles/colors.scss (L292-294)
```css
.sb-code {
  background-color: var(--editor-code-background-color);
}
```

**File:** client/styles/colors.scss (L300-303)
```css
.sb-directive-mark {
  color: var(--editor-directive-mark-color);
  font-weight: bold;
}
```

**File:** client/styles/colors.scss (L305-308)
```css
.sb-directive {
  color: var(--editor-directive-color);
  font-weight: bold;
}
```

**File:** client/styles/colors.scss (L310-312)
```css
.sb-highlight {
  background-color: var(--editor-highlight-background-color);
}
```

**File:** client/styles/colors.scss (L314-320)
```css
.sb-line-fenced-code {
  background-color: var(--editor-code-background-color);
}

.sb-line-fenced-code .sb-comment {
  color: var(--editor-code-comment-color);
}
```

**File:** client/styles/colors.scss (L343-345)
```css
.sb-meta {
  color: var(--editor-meta-color);
}
```

**File:** client/styles/colors.scss (L376-378)
```css
.sb-emphasis {
  font-style: italic;
}
```

**File:** client/styles/colors.scss (L380-382)
```css
.sb-strong {
  font-weight: 900;
}
```

**File:** client/styles/colors.scss (L384-387)
```css
.sb-sub {
  vertical-align: sub;
  font-size: smaller;
}
```

**File:** client/styles/colors.scss (L389-392)
```css
.sb-sup {
  vertical-align: super;
  font-size: smaller;
}
```

**File:** client/styles/colors.scss (L399-409)
```css
.sb-link:not(.sb-meta, .sb-url) {
  color: var(--editor-link-color);
}

.sb-link.sb-url {
  color: var(--editor-link-meta-color);
}

.sb-url:not(.sb-link) {
  color: var(--editor-link-url-color);
}
```

**File:** client/styles/colors.scss (L415-418)
```css
.sb-wiki-link {
  color: var(--editor-wiki-link-page-color);
  background-color: var(--editor-wiki-link-page-background-color);
}
```

**File:** client/styles/colors.scss (L420-423)
```css
a.sb-wiki-link-missing,
.sb-wiki-link-missing > .sb-wiki-link {
  color: var(--editor-wiki-link-page-missing-color);
}
```

**File:** client/styles/colors.scss (L425-428)
```css
a.sb-wiki-link-invalid,
.sb-wiki-link-invalid > .sb-wiki-link {
  color: var(--editor-wiki-link-page-invalid-color);
}
```

**File:** client/styles/colors.scss (L438-440)
```css
.sb-line-comment {
  background-color: var(--editor-code-comment-color); // rgba(255, 255, 0, 0.5);
```

**File:** client/styles/top.scss (L45-67)
```css
    #sb-current-page {
      flex: 1;

      overflow: hidden;
      white-space: nowrap;
      text-align: left;
      display: block;

      -webkit-app-region: drag;

      .cm-scroller {
        font-family: var(--ui-font);
      }

      .cm-content {
        padding: 0;

        .cm-line {
          padding: 0;
          caret-color: var(--editor-caret-color);
        }
      }
    }
```

**File:** client/styles/top.scss (L70-78)
```css
  .sb-actions {
    display: flex;
    flex: 0 0 auto;
    text-align: right;

    &.hamburger button.expander {
      display: none;
    }
  }
```

**File:** client/styles/top.scss (L80-86)
```css
  .progress-wrapper {
    position: relative;
    margin-top: 4px;
    margin-right: 6px;
    padding: 4px;
    background-color: var(--top-background-color);
  }
```

**File:** client/styles/top.scss (L88-97)
```css
  .progress-bar {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 8px;
  }
```

**File:** client/styles/editor.scss (L1-3)
```css
.cm-focused {
  outline: none !important;
}
```

**File:** client/styles/editor.scss (L5-15)
```css
#sb-main .cm-editor {
  font-size: 18px;
  height: 100%;

  .cm-content {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    max-width: var(--#{"editor-width"});
    padding: 5px 20px;
  }
```

**File:** client/styles/editor.scss (L17-29)
```css
  .cm-line {
    padding: 0;

    &.sb-line-h1,
    &.sb-line-h2,
    &.sb-line-h3,
    &.sb-line-h4,
    &.sb-line-h5,
    &.sb-line-h6 {
      font-weight: bold;
      padding: 2px;
    }
  }
```

**File:** client/styles/editor.scss (L70-82)
```css
  .cm-panels-bottom .cm-vim-panel {
    padding: 0 20px;
    max-width: var(--editor-width);
    margin: auto;
    font-family: var(--editor-font);
    height: 1.5em;
    line-height: 1.5em;

    input {
      font-family: var(--editor-font);
      font-size: 1em;
    }
  }
```

**File:** client/styles/editor.scss (L85-88)
```css
  .cm-gutters {
    background-color: transparent;
    border-right: none;
  }
```

**File:** client/styles/editor.scss (L90-93)
```css
  .cm-foldPlaceholder {
    background-color: transparent;
    border: 0;
  }
```

**File:** client/styles/editor.scss (L100-107)
```css
    &.sb-line-task {
      text-indent: calc(-1 * (#{$baseIndent}ch + 5ch));
      padding-left: calc(#{$baseIndent}ch + 5ch);

      .cm-list-bullet::after {
        left: calc(#{$baseIndent}ch + 5ch);
      }
    }
```

**File:** client/styles/editor.scss (L109-112)
```css
    &.sb-line-blockquote {
      text-indent: calc(-1 * (#{$baseIndent}ch + 4ch));
      padding-left: calc(#{$baseIndent}ch + 4ch);
    }
```

**File:** client/styles/editor.scss (L119-120)
```css
  .sb-line-ul {
    &.sb-line-li-1 {
```

**File:** client/styles/editor.scss (L212-222)
```css
  .cm-list-bullet {
    position: relative;
    visibility: hidden;
  }

  .cm-list-bullet::after {
    visibility: visible;
    position: absolute;
    content: "\2022";
    /* U+2022 BULLET */
  }
```

**File:** client/styles/editor.scss (L224-227)
```css
  .cm-task-checked,
  .sb-line-task:has(.cm-task-checked) .sb-wiki-link {
    text-decoration: line-through !important;
  }
```

**File:** client/styles/editor.scss (L229-245)
```css
  .cm-tooltip-autocomplete {
    .cm-completionDetail {
      font-style: normal;
      display: block;
      font-size: 80%;
      margin-left: 5px;
    }

    .cm-completionLabel {
      display: block;
      margin-left: 5px;
    }

    .cm-completionIcon {
      display: none;
    }
  }
```

**File:** client/styles/editor.scss (L247-269)
```css
  .sb-header-inside.sb-line-h1 {
    text-indent: -2ch;
  }

  .sb-header-inside.sb-line-h2 {
    text-indent: -3ch;
  }

  .sb-header-inside.sb-line-h3 {
    text-indent: -4ch;
  }

  .sb-header-inside.sb-line-h4 {
    text-indent: -5ch;
  }

  .sb-header-inside.sb-line-h5 {
    text-indent: -6ch;
  }

  .sb-header-inside.sb-line-h6 {
    text-indent: -7ch;
  }
```

**File:** client/styles/editor.scss (L271-273)
```css
  .sb-checkbox > input[type="checkbox"] {
    width: 3ch;
  }
```

**File:** client/styles/editor.scss (L275-281)
```css
  .sb-hashtag,
  .hashtag {
    border-radius: 6px;
    padding: 0 3px;
    margin: 0 1px 0 0;
    font-size: 0.9em;
  }
```

**File:** client/styles/editor.scss (L287-293)
```css
  .sb-strikethrough {
    text-decoration: line-through;

    &.sb-meta {
      text-decoration: none;
    }
  }
```

**File:** client/styles/editor.scss (L295-298)
```css
  .sb-line-hr {
    margin-top: 1em;
    margin-bottom: -1em;
  }
```

**File:** client/styles/editor.scss (L300-300)
```css
  .sb-hr {
```

**File:** client/styles/editor.scss (L334-337)
```css
  .sb-lua-directive-block {
    display: block;
    margin: -1em 0;
  }
```

**File:** client/styles/editor.scss (L339-342)
```css
  .sb-widget-array {
    display: flex;
    flex-direction: column;
  }
```

**File:** client/styles/editor.scss (L344-346)
```css
  .sb-task-mark {
    font-size: 91%;
  }
```

**File:** client/styles/editor.scss (L348-350)
```css
  .sb-task-state {
    font-size: 91%;
  }
```

**File:** client/styles/editor.scss (L352-354)
```css
  .sb-task-deadline {
    background-color: rgba(22, 22, 22, 0.07);
  }
```

**File:** client/styles/editor.scss (L356-363)
```css
  .sb-line-frontmatter-outside,
  .sb-line-code-outside {
    .sb-meta {
      color: transparent;
    }

    color: transparent;
  }
```

**File:** client/styles/editor.scss (L374-376)
```css
  .sb-line-table-outside {
    display: none;
  }
```

**File:** client/styles/editor.scss (L378-384)
```css
  .sb-line-tbl-header {
    font-weight: bold;
  }

  .sb-line-tbl-header .meta {
    font-weight: normal;
  }
```

**File:** client/styles/editor.scss (L513-515)
```css
  .sb-markdown-bottom-widget {
    margin-top: 10px;
  }
```

**File:** client/styles/editor.scss (L517-540)
```css
  .sb-lua-top-widget .content,
  .sb-lua-bottom-widget .content {
    max-height: 500px;
    padding: 10px;
  }

  .sb-lua-bottom-widget p strong {
    display: block;
    padding: 10px 12px;
    background-color: var(--editor-widget-background-color);
    border: 1px solid var(--editor-widget-background-color);
    border-radius: 8px 8px 0 0;
    font-weight: 600;
  }

  .sb-lua-bottom-widget blockquote {
    margin: 0 5px;
    padding: 12px;
    border: 1px solid var(--editor-widget-background-color);
    border-radius: 8px;
    background-color: var(--editor-widget-background-color);
    color: var(--editor-text-color);
    border-top: 1px solid var(--editor-widget-background-color);
  }
```

**File:** client/styles/editor.scss (L542-550)
```css
  .sb-markdown-top-widget:has(*) .content {
    max-height: 500px;
  }

  @media screen and (max-height: 1000px) {
    .sb-markdown-top-widget:has(*) .content {
      max-height: 300px;
    }
  }
```

**File:** client/styles/editor.scss (L552-630)
```css
  .sb-markdown-widget,
  .sb-lua-directive-block,
  .sb-lua-directive-inline,
  .sb-markdown-top-widget:has(*),
  .sb-markdown-bottom-widget:has(*) {
    border: 1px solid var(--editor-widget-background-color);
    border-radius: 5px;
    white-space: normal;
    position: relative;
    min-height: 48px;

    .content {
      overflow-y: auto;
    }

    ul,
    ol {
      margin-top: 0;
      margin-bottom: 0;
    }

    ul {
      list-style: none;
      // padding-left: 1ch;
    }

    ul li::before {
      content: "\2022";
      /* Add content: \2022 is the CSS Code/unicode for a bullet */
      color: var(--editor-list-bullet-color);
      display: inline-block;
      /* Needed to add space between the bullet and the text */
      width: 1em;
      /* Also needed for space (tweak if needed) */
      margin-left: -1em;
    }

    h1,
    h2,
    h3,
    h4,
    h5 {
      margin: 0;
    }

    a.wiki-link {
      border-radius: 5px;
      padding: 0 5px;
      color: var(--editor-wiki-link-page-color);
      background-color: var(--editor-wiki-link-page-background-color);
      text-decoration: none;
    }

    span.task-deadline {
      background-color: rgba(22, 22, 22, 0.07);
    }

    tt {
      background-color: var(--editor-code-background-color);
    }

    // Only show the button bar on hover on non-touch devices
    &:hover .button-bar {
      display: block;
    }

    // Always show button bar on touch devices
    @media (hover: none) and (pointer: coarse) {
      .button-bar {
        display: block !important;
      }
    }

    .button-bar {
      position: absolute;
      right: 0;
      top: 0;
      display: none;
      background: var(--editor-widget-background-color);
```

