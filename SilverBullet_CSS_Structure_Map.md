---
tags: meta/library
---

## Discussions
* [SilverBullet Community](https://community.silverbullet.md/t/css-structure-map-for-silverbullet/3507?u=mr.red)


> **warning** Caution
> WORK IN PROGRESS not 100% accurate !!!


`html, body                                             ` [[#Document|🔗]]  
`└── #sb-root                                           ` [[#Root & Layout IDs|🔗]]  
`    ├── .sb-modal-box                                  ` [[#Top Bar Classes|🔗]]  
`    │                                                  ` ➡️  
`    ├── #sb-top                                        ` ➡️  
`    │   ├── .main                                      ` ➡️  
`    │   │   └── .inner                                 ` ➡️  
`    │   │       └── .wrapper                           ` ➡️  
`    │   │           ├── .sb-page-prefix                ` ➡️  
`    │   │           ├── #sb-current-page               ` ➡️  
`    │   │           │   └── .cm-editor                 ` ➡️  
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
`    │   ├── .sb-sync-error                             ` ➡️ conditional class  
`    │   ├── .sb-saved / .sb-unsaved / .sb-loading.     ` ➡️ on `#sb-current-page`  
`    │   └── .sb-decorated-object                       ` ➡️ opt. on `#sb-current-page`  
`    │                                                  ` ➡️  
`    ├── #sb-main                                       ` ➡️ main content area  
`    │   ├── .sb-panel                                  ` ➡️ left/right panels  
`    │   │   └── iframe                                 ` ➡️  
`    │   └── #sb-editor                                 ` ➡️ editor container  
`    │       ├── .cm-editor                             ` ➡️ CodeMirror editor  
`    │       │   ├── .cm-scroller                       ` ➡️  
`    │       │   ├── .cm-content                        ` ➡️  
`    │       │   │   └── .cm-line                       ` [[#Line Type Classes|🔗]]  
`    │       │   │       ├── .sb-line-h1 → .sb-line-h6  ` [[#Line Type Classes|🔗]] heading levels  
`    │       │   │       ├── .sb-line-code              ` [[#Line Type Classes|🔗]] code blocks  
`    │       │   │       ├── .sb-line-blockquote        ` [[#Line Type Classes|🔗]] blockquotes  
`    │       │   │       ├── .sb-line-task              ` [[#Line Type Classes|🔗]] task items  
`    │       │   │       ├── .sb-line-comment           ` [[#Line Type Classes|🔗]]  
`    │       │   │       ├── .sb-line-hr                ` [[#Line Type Classes|🔗]]  
`    │       │   │       ├── .sb-line-ul, .sb-line-ol   ` [[#Line Type Classes|🔗]] list  
`    │       │   │       └── .sb-line-li-{1 → 5}        ` [[#Line Type Classes|🔗]] list indentation levels  
`    │       │   ├── .cm-gutters                        ` [[#Line Type Classes|🔗]] line gutters  
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


## Theme: [[#Colors(theme.scss)]]

## Document

* `html, body` ➡ [[#main.scss(L35-43)]] ➡ ==Base document elements==  

## Root & Layout ID

* `#sb-root` ➡ [[#main.scss(L45-51)]] ➡ ==Root container==  
* `#sb-top` ➡ [[#colors.scss(L12-16)]] ➡ ==Top bar==  
* `#sb-main` ➡ [[#main.scss(L71-80)]] ➡ ==Main layout container==  
* `#sb-editor` ➡ [[#main.scss(L82-93)]] ➡ ==Editor container==  
* `#sb-current-page` ➡ [[#top.scss(L45-67)]] ➡ ==Current page wrapper==  

## Top Bar Class

* `.sb-sync-error` ➡ [[#colors.scss(L18-21)]] ➡ ==Top bar sync error==  
* `.sb-saved` ➡ [[#colors.scss(L23-25)]] ➡ ==Top bar saved state==  
* `.sb-unsaved` ➡ [[#colors.scss(L27-29)]] ➡ ==Top bar unsaved state==  
* `.sb-loading` ➡ [[#colors.scss(L31-33)]] ➡ ==Loading indicator==  
* `.sb-actions` ➡ [[#top.scss(L70-78)]] ➡ ==Top bar actions==  
* `.sb-notifications` ➡ [[#colors.scss(L54-60)]] ➡ ==Notifications container==  
* `.sb-notification-info` ➡ [[#colors.scss(L62-64)]] ➡ ==Info notification==  
* `.sb-notification-error` ➡ [[#colors.scss(L66-68)]] ➡ ==Error notification==  
* `.progress-wrapper` ➡ [[#top.scss(L80-86)]] ➡ ==Progress bar wrapper==  
* `.progress-bar` ➡ [[#top.scss(L88-97)]] ➡ ==Progress circle==  
* `.sb-page-prefix` ➡ [[#main.scss(L124-132)]] ➡ ==Page prefix text==  

## Panel & Layout Class

* `.sb-panel` ➡ [[#main.scss(L53-55)]] ➡ ==Panel container==  
* `.sb-bhs` ➡ [[#main.scss(L101-109)]] ➡ ==Bottom/highlight section==  
* `.sb-modal` ➡ [[#main.scss(L111-122)]] ➡ ==Modal overlay==  
* `.sb-modal-box` ➡ [[#main.scss(L111-122)]] ➡ ==Modal box==  
* `.sb-preview` ➡ [[#main.scss(L145-147)]] ➡ ==Preview container==  
* `.sb-bottom-iframe` ➡ [[#main.scss(L57-62)]] ➡ ==Bottom iframe==  
* `.sb-top-iframe` ➡ [[#main.scss(L64-69)]] ➡ ==Top iframe==  

## CodeMirror Editor Class

* `.cm-editor` ➡ [[#editor.scss(L5-15)]] ➡ ==CodeMirror editor==  
* `.cm-focused` ➡ [[#editor.scss(L1-3)]] ➡ ==Focused editor==  
* `.cm-content` ➡ [[#top.scss(L45-67)]] ➡ ==Editor content==  
* `.cm-line` ➡ [[#editor.scss(L17-29)]] ➡ ==Editor line==  
* `.cm-gutters` ➡ [[#editor.scss(L85-88)]] ➡ ==Line gutters==  
* `.cm-foldPlaceholder` ➡ [[#editor.scss(L90-93)]] ➡ ==Fold placeholder==  
* `.cm-cursor, .cm-dropCursor` ➡ [[#colors.scss(L7-10)]] ➡ ==Caret styles==  
* `.cm-selectionBackground` ➡ [[#colors.scss(L187-189)]] ➡ ==Text selection==  
* `.cm-panels-bottom` ➡ [[#colors.scss(L191-209)]] ➡ ==Bottom panels==  
* `.cm-vim-panel` ➡ [[#editor.scss(L70-82)]] ➡ ==Vim panel==  
* `.cm-scroller` ➡ [[#colors.scss(L132-134)]] ➡ ==Scroller==  
* `.cm-list-bullet` ➡ [[#editor.scss(L212-222)]] ➡ ==List bullet==  
* `.cm-tooltip-autocomplete` ➡ [[#editor.scss(L229-245)]] ➡ ==Autocomplete tooltip==  
* `.cm-completionDetail` ➡ [[#editor.scss(L229-245)]] ➡ ==Completion detail==  
* `.cm-completionLabel` ➡ [[#editor.scss(L229-245)]] ➡ ==Completion label==  
* `.cm-completionIcon` ➡ [[#editor.scss(L229-245)]] ➡ ==Completion icon==  
* `.cm-search` ➡ [[#colors.scss(L191-209)]] ➡ ==Search field==  
* `.cm-textfield` ➡ [[#colors.scss(L191-209)]] ➡ ==Search input==  
* `.cm-button` ➡ [[#colors.scss(L191-209)]] ➡ ==Search button==  

## Line Type Class

* `.sb-line-h1 → .sb-line-h6` ➡ [[#editor.scss(L17-29)]], [[#editor.scss(L247-269)]] ➡ ==Header lines==  
* `.sb-line-ul` ➡ [[#editor.scss(L119-120)]], [[#editor.scss(L212-222)]] ➡ ==Unordered list==  
* `.sb-line-ol` ➡ [[#editor.scss(L212-222)]] ➡ ==Ordered list==  
* `.sb-line-li-1 → .sb-line-li-6` ➡ [[#editor.scss(L212-222)]] ➡ ==List items==  
* `.sb-line-task` ➡ [[#editor.scss(L100-107)]], [[#editor.scss(L224-227)]] ➡ ==Task line==  
* `.sb-line-blockquote` ➡ [[#editor.scss(L109-112)]] ➡ ==Blockquote line==  
* `.sb-admonition` ➡ [[#editor.scss(L247-269)]] ➡ ==Admonition line==  
* `.sb-line-code` ➡ [[#colors.scss(L284-286)]] ➡ ==Inline code line==  
* `.sb-line-fenced-code` ➡ [[#colors.scss(L314-320)]] ➡ ==Fenced code==  
* `.sb-line-code-outside` ➡ [[#editor.scss(L356-363)]] ➡ ==Outside code line==  
* `.sb-line-frontmatter-outside` ➡ [[#editor.scss(L356-363)]] ➡ ==Frontmatter outside==  
* `.sb-line-table-outside` ➡ [[#editor.scss(L374-376)]] ➡ ==Table outside==  
* `.sb-line-tbl-header` ➡ [[#editor.scss(L378-384)]] ➡ ==Table header==  
* `.sb-line-hr` ➡ [[#editor.scss(L295-298)]] ➡ ==Horizontal rule==  
* `.sb-line-comment` ➡ [[#colors.scss(L438-440)]] ➡ ==Comment line==  

## Content Styling Classes

* `.sb-header-inside` ➡ [[#editor.scss(L247-269)]] ➡ ==Header inside==  
* `.sb-hashtag, .hashtag` ➡ [[#editor.scss(L275-281)]] ➡ ==Hashtag==  
* `.sb-wiki-link` ➡ [[#colors.scss(L415-418)]] ➡ ==Wiki link==  
* `.sb-wiki-link-missing` ➡ [[#colors.scss(L420-423)]] ➡ ==Missing wiki link==  
* `.sb-wiki-link-invalid` ➡ [[#colors.scss(L425-428)]] ➡ ==Invalid wiki link==  
* `.sb-naked-url` ➡ [[#colors.scss(L260-262)]] ➡ ==Naked URL==  
* `.sb-link` ➡ [[#colors.scss(L399-409)]] ➡ ==Link==  
* `.sb-url` ➡ [[#colors.scss(L399-409)]] ➡ ==URL==  
* `.sb-strikethrough` ➡ [[#editor.scss(L287-293)]] ➡ ==Strikethrough==  
* `.sb-emphasis` ➡ [[#colors.scss(L376-378)]] ➡ ==Italics==  
* `.sb-strong` ➡ [[#colors.scss(L380-382)]] ➡ ==Bold==  
* `.sb-sub` ➡ [[#colors.scss(L384-387)]] ➡ ==Subscript==  
* `.sb-sup` ➡ [[#colors.scss(L389-392)]] ➡ ==Superscript==  
* `.sb-hr` ➡ [[#editor.scss(L300-300)]] ➡ ==Horizontal rule==  
* `.sb-highlight` ➡ [[#colors.scss(L310-312)]] ➡ ==Highlight==  
* `.sb-meta` ➡ [[#colors.scss(L343-345)]] ➡ ==Meta==  
* `.sb-struct` ➡ [[#colors.scss(L288-290)]] ➡ ==Struct color==  
* `.sb-code` ➡ [[#colors.scss(L292-294)]] ➡ ==Code background==  

## Task & Checkbox Classes

* `.sb-checkbox` ➡ [[#editor.scss(L271-273)]] ➡ ==Checkbox==  
* `.sb-task-mark` ➡ [[#editor.scss(L344-346)]] ➡ ==Task mark==  
* `.sb-task-state` ➡ [[#editor.scss(L348-350)]] ➡ ==Task state==  
* `.sb-task-deadline` ➡ [[#editor.scss(L352-354)]] ➡ ==Task deadline==  
* `.cm-task-checked` ➡ [[#editor.scss(L224-227)]] ➡ ==Checked task==  

## Widget Classes

* `.sb-markdown-widget` ➡ [[#editor.scss(L552-630)]] ➡ ==Markdown widget==  
* `.sb-markdown-top-widget` ➡ [[#editor.scss(L542-550)]] ➡ ==Top widget==  
* `.sb-markdown-bottom-widget` ➡ [[#editor.scss(L513-515)]] ➡ ==Bottom widget==  
* `.sb-lua-directive-block` ➡ [[#editor.scss(L334-337)]] ➡ ==Lua block directive==  
* `.sb-lua-directive-inline` ➡ [[#editor.scss(L552-630)]] ➡ ==Lua inline directive==  
* `.sb-lua-top-widget` ➡ [[#editor.scss(L517-540)]] ➡ ==Lua top widget==  
* `.sb-lua-bottom-widget` ➡ [[#editor.scss(L517-540)]] ➡ ==Lua bottom widget==  
* `.sb-widget-array` ➡ [[#editor.scss(L339-342)]] ➡ ==Widget array container==  
* `.sb-markdown-toolbar` ➡ [[#main.scss(L149-161)]] ➡ ==Markdown toolbar==  
* `.sb-table-widget` ➡ [[#editor.scss(L552-630)]] ➡ ==Table widget==  

## Directive Classes

* `.sb-directive` ➡ [[#colors.scss(L305-308)]] ➡ ==Directive==  
* `.sb-directive-mark` ➡ [[#colors.scss(L300-303)]] ➡ ==Directive mark==  


# Citations (2025-11-05)

## main.scss(L35-43)
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

## main.scss(L45-51)
```css
#sb-root {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--root-background-color);
}
```

## main.scss(L53-55)
```css
.sb-panel {
  flex: 1;
}
```

## main.scss(L57-62)
```css
.sb-bottom-iframe {
  width: 100%;
  margin-top: 10px;
  border: 1px solid var(--editor-widget-background-color);
  border-radius: 5px;
}
```

## main.scss(L64-69)
```css
.sb-top-iframe {
  width: 100%;
  margin-top: 10px;
  border: 1px solid var(--editor-widget-background-color);
  border-radius: 5px;
}
```

## main.scss(L71-80)
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

## main.scss(L82-93)
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

## main.scss(L101-109)
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

## main.scss(L111-122)
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

## main.scss(L124-132)
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

## main.scss(L145-147)
```css
.sb-preview {
  position: relative;
}
```

## main.scss(L149-161)
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

## colors.scss(L7-10)
```css
.cm-cursor,
.cm-dropCursor {
  border-left: 1.2px solid var(--editor-caret-color) !important;
}
```

## colors.scss(L12-16)
```css
#sb-top {
  color: var(--top-color);
  background-color: var(--top-background-color);
  border-bottom: var(--top-border-color) 1px solid;
}
```

## colors.scss(L18-21)
```css
#sb-top.sb-sync-error {
  color: var(--top-sync-error-color);
  background-color: var(--top-sync-error-background-color);
}
```

## colors.scss(L23-25)
```css
.sb-saved {
  color: var(--top-saved-color);
}
```

## colors.scss(L27-29)
```css
.sb-unsaved {
  color: var(--top-unsaved-color);
}
```

## colors.scss(L31-33)
```css
.sb-loading {
  color: var(--top-loading-color);
}
```

## colors.scss(L54-60)
```css
.sb-notifications {
  font-family: var(--editor-font);
}

.sb-notifications > div {
  border: var(--notifications-border-color) 1px solid;
}
```

## colors.scss(L62-64)
```css
.sb-notification-info {
  background-color: var(--notification-info-background-color);
}
```

## colors.scss(L66-68)
```css
.sb-notification-error {
  background-color: var(--notification-error-background-color);
}
```

## colors.scss(L132-134)
```css
  .cm-scroller {
    font-family: var(--ui-font);
  }
```

## colors.scss(L187-189)
```css
  .cm-selectionBackground {
    background-color: var(--editor-selection-background-color);
  }
```

## colors.scss(L191-209)
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

## colors.scss(L260-262)
```css
.sb-naked-url {
  color: var(--editor-naked-url-color);
}
```

## colors.scss(L284-286)
```css
.sb-line-code {
  background-color: var(--editor-code-background-color);
}
```

## colors.scss(L288-290)
```css
.sb-struct {
  color: var(--editor-struct-color);
}
```

## colors.scss(L292-294)
```css
.sb-code {
  background-color: var(--editor-code-background-color);
}
```

## colors.scss(L300-303)
```css
.sb-directive-mark {
  color: var(--editor-directive-mark-color);
  font-weight: bold;
}
```

## colors.scss(L305-308)
```css
.sb-directive {
  color: var(--editor-directive-color);
  font-weight: bold;
}
```

## colors.scss(L310-312)
```css
.sb-highlight {
  background-color: var(--editor-highlight-background-color);
}
```

## colors.scss(L314-320)
```css
.sb-line-fenced-code {
  background-color: var(--editor-code-background-color);
}

.sb-line-fenced-code .sb-comment {
  color: var(--editor-code-comment-color);
}
```

## colors.scss(L343-345)
```css
.sb-meta {
  color: var(--editor-meta-color);
}
```

## colors.scss(L376-378)
```css
.sb-emphasis {
  font-style: italic;
}
```

## colors.scss(L380-382)
```css
.sb-strong {
  font-weight: 900;
}
```

## colors.scss(L384-387)
```css
.sb-sub {
  vertical-align: sub;
  font-size: smaller;
}
```

## colors.scss(L389-392)
```css
.sb-sup {
  vertical-align: super;
  font-size: smaller;
}
```

## colors.scss(L399-409)
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

## colors.scss(L415-418)
```css
.sb-wiki-link {
  color: var(--editor-wiki-link-page-color);
  background-color: var(--editor-wiki-link-page-background-color);
}
```

## colors.scss(L420-423)
```css
a.sb-wiki-link-missing,
.sb-wiki-link-missing > .sb-wiki-link {
  color: var(--editor-wiki-link-page-missing-color);
}
```

## colors.scss(L425-428)
```css
a.sb-wiki-link-invalid,
.sb-wiki-link-invalid > .sb-wiki-link {
  color: var(--editor-wiki-link-page-invalid-color);
}
```

## colors.scss(L438-440)
```css
.sb-line-comment {
  background-color: var(--editor-code-comment-color); // rgba(255, 255, 0, 0.5);
```

## top.scss(L45-67)
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

## top.scss(L70-78)
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

## top.scss(L80-86)
```css
  .progress-wrapper {
    position: relative;
    margin-top: 4px;
    margin-right: 6px;
    padding: 4px;
    background-color: var(--top-background-color);
  }
```

## top.scss(L88-97)
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

## editor.scss(L1-3)
```css
.cm-focused {
  outline: none !important;
}
```

## editor.scss(L5-15)
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

## editor.scss(L17-29)
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

## editor.scss(L70-82)
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

## editor.scss(L85-88)
```css
  .cm-gutters {
    background-color: transparent;
    border-right: none;
  }
```

## editor.scss(L90-93)
```css
  .cm-foldPlaceholder {
    background-color: transparent;
    border: 0;
  }
```

## editor.scss(L100-107)
```css
    &.sb-line-task {
      text-indent: calc(-1 * (#{$baseIndent}ch + 5ch));
      padding-left: calc(#{$baseIndent}ch + 5ch);

      .cm-list-bullet::after {
        left: calc(#{$baseIndent}ch + 5ch);
      }
    }
```

## editor.scss(L109-112)
```css
    &.sb-line-blockquote {
      text-indent: calc(-1 * (#{$baseIndent}ch + 4ch));
      padding-left: calc(#{$baseIndent}ch + 4ch);
    }
```

## editor.scss(L119-120)
```css
  .sb-line-ul {
    &.sb-line-li-1 {
```

## editor.scss(L212-222)
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

## editor.scss(L224-227)
```css
  .cm-task-checked,
  .sb-line-task:has(.cm-task-checked) .sb-wiki-link {
    text-decoration: line-through !important;
  }
```

## editor.scss(L229-245)
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

## editor.scss(L247-269)
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

## editor.scss(L271-273)
```css
  .sb-checkbox > input[type="checkbox"] {
    width: 3ch;
  }
```

## editor.scss(L275-281)
```css
  .sb-hashtag,
  .hashtag {
    border-radius: 6px;
    padding: 0 3px;
    margin: 0 1px 0 0;
    font-size: 0.9em;
  }
```

## editor.scss(L287-293)
```css
  .sb-strikethrough {
    text-decoration: line-through;

    &.sb-meta {
      text-decoration: none;
    }
  }
```

## editor.scss(L295-298)
```css
  .sb-line-hr {
    margin-top: 1em;
    margin-bottom: -1em;
  }
```

## editor.scss(L300-300)
```css
  .sb-hr {
```

## editor.scss(L334-337)
```css
  .sb-lua-directive-block {
    display: block;
    margin: -1em 0;
  }
```

## editor.scss(L339-342)
```css
  .sb-widget-array {
    display: flex;
    flex-direction: column;
  }
```

## editor.scss(L344-346)
```css
  .sb-task-mark {
    font-size: 91%;
  }
```

## editor.scss(L348-350)
```css
  .sb-task-state {
    font-size: 91%;
  }
```

## editor.scss(L352-354)
```css
  .sb-task-deadline {
    background-color: rgba(22, 22, 22, 0.07);
  }
```

## editor.scss(L356-363)
```css
  .sb-line-frontmatter-outside,
  .sb-line-code-outside {
    .sb-meta {
      color: transparent;
    }

    color: transparent;
  }
```

## editor.scss(L374-376)
```css
  .sb-line-table-outside {
    display: none;
  }
```

## editor.scss(L378-384)
```css
  .sb-line-tbl-header {
    font-weight: bold;
  }

  .sb-line-tbl-header .meta {
    font-weight: normal;
  }
```

## editor.scss(L513-515)
```css
  .sb-markdown-bottom-widget {
    margin-top: 10px;
  }
```

## editor.scss(L517-540)
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

## editor.scss(L542-550)
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

## editor.scss(L552-630)
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

## Colors(theme.scss)

```css
html {
  --ui-accent-color: #464cfc;
  --ui-accent-text-color: var(--ui-accent-color);
  --ui-accent-contrast-color: #eee;
  --highlight-color: rgba(255, 255, 0, 0.5);
  --link-color: #0330cb;
  --link-missing-color: #9e4705;
  --link-invalid-color: #bb08e7;
  --meta-color: #650007;
  --meta-subtle-color: #959595;
  --subtle-color: #676767;
  --subtle-background-color: rgba(72, 72, 72, 0.1);

  --root-background-color: #fff;
  --root-color: inherit;

  --top-color: inherit;
  --top-background-color: #e1e1e1;
  --top-border-color: #cacaca;
  --top-sync-error-color: var(--top-color);
  --top-sync-error-background-color: #fdf8cb;
  --top-saved-color: #111;
  --top-unsaved-color: #5e5e5e;
  --top-loading-color: #7a7a7a;

  --panel-background-color: #fff;
  --panel-border-color: #fff;

  --bhs-background-color: #fff;
  --bhs-border-color: rgb(193, 193, 193);

  --modal-color: inherit;
  --modal-background-color: #fff;
  --modal-border-color: rgb(108, 108, 108);
  --modal-header-label-color: var(--ui-accent-text-color);
  --modal-help-background-color: #eee;
  --modal-help-color: #555;
  --modal-selected-option-background-color: var(--ui-accent-color);
  --modal-selected-option-color: var(--ui-accent-contrast-color);
  --modal-hint-background-color: #212476;
  --modal-hint-color: #eee;
  --modal-hint-inactive-background-color: #e1e1e1;
  --modal-hint-inactive-color: #111;
  --modal-description-color: #6b6b6b;
  --modal-selected-option-description-color: #e6e6e6;

  --notifications-background-color: inherit;
  --notifications-border-color: rgb(41, 41, 41);
  --notification-info-background-color: rgb(187, 221, 247);
  --notification-error-background-color: rgb(255, 84, 84);

  --button-background-color: #eee;
  --button-hover-background-color: inherit;
  --button-color: black;
  --button-border-color: #6c6c6c;
  --primary-button-background-color: var(--ui-accent-color);
  --primary-button-hover-background-color: color-mix(
    in srgb,
    var(--ui-accent-color),
    black 35%
  );
  --primary-button-color: var(--ui-accent-contrast-color);
  --primary-button-border-color: transparent;

  --text-field-background-color: var(--button-background-color);

  --progress-background-color: #eee;
  --progress-sync-color: black;
  --progress-index-color: #0772be;

  --action-button-background-color: transparent;
  --action-button-color: #292929;
  --action-button-hover-color: #0772be;
  --action-button-active-color: #0772be;

  --editor-caret-color: black;
  --editor-selection-background-color: #d7e1f6;
  --editor-panels-bottom-color: inherit;
  --editor-panels-bottom-background-color: #e1e1e1;
  --editor-panels-bottom-border-color: #cacaca;
  --editor-completion-detail-color: #555;
  --editor-completion-detail-selected-color: #d2d2d2;
  --editor-list-bullet-color: rgb(150, 150, 150);
  --editor-heading-color: #333;
  --editor-heading-meta-color: var(--meta-subtle-color);
  --editor-hashtag-background-color: #002b6aad;
  --editor-hashtag-color: #e2e9ff;
  --editor-hashtag-border-color: #0120416b;
  --editor-ruler-color: rgb(76, 75, 75);
  --editor-naked-url-color: var(--link-color);
  --editor-code-color: #7c828e;
  --editor-link-color: var(--link-color);
  --editor-link-url-color: var(--link-color);
  --editor-link-meta-color: var(--meta-subtle-color);
  --editor-wiki-link-page-background-color: rgba(77, 141, 255, 0.07);
  --editor-wiki-link-page-color: var(--link-color);
  --editor-wiki-link-page-missing-color: var(--link-missing-color);
  --editor-wiki-link-page-invalid-color: var(--link-invalid-color);
  --editor-wiki-link-color: #8f96c2;
  --editor-command-button-color: inherit;
  --editor-command-button-background-color: #e3dfdf;
  --editor-command-button-hover-background-color: inherit;
  --editor-command-button-meta-color: var(--meta-subtle-color);
  --editor-command-button-border-color: gray;
  --editor-line-meta-color: var(--meta-subtle-color);
  --editor-meta-color: var(--meta-color);
  --editor-table-head-background-color: #333;
  --editor-table-head-color: #eee;
  --editor-table-even-background-color: #f3f3f3;
  --editor-blockquote-background-color: var(--subtle-background-color);
  --editor-blockquote-color: var(--subtle-color);
  --editor-blockquote-border-color: rgb(74, 74, 74);
  --editor-code-background-color: var(--subtle-background-color);
  --editor-struct-color: darkred;
  --editor-highlight-background-color: var(--highlight-color);
  --editor-code-comment-color: var(--meta-subtle-color);
  --editor-code-variable-color: #024866;
  --editor-code-typename-color: #038138;
  --editor-code-string-color: #540293;
  --editor-code-number-color: #01833c;
  --editor-code-operator-color: #808080;
  --editor-code-info-color: var(--subtle-color);
  --editor-code-atom-color: #5a0000;
  --editor-frontmatter-background-color: rgba(255, 246, 189, 0.3);
  --editor-frontmatter-color: var(--subtle-color);
  --editor-frontmatter-marker-color: #89000080;
  --editor-widget-background-color: rgb(238, 238, 238);
  --editor-task-marker-color: var(--subtle-color);
  --editor-task-state-color: var(--subtle-color);

  --editor-directive-mark-color: #6c0101;
  --editor-directive-color: #696969;
  --editor-directive-background-color: #ebebeb7d;

  --editor-panels-bottom-input-background-color: #fff;
  --editor-panels-bottom-button-background-image: linear-gradient(
    #eff1f5,
    #d9d9df
  );
  --editor-panels-bottom-button-active-background-image: linear-gradient(
    #b4b4b4,
    #d0d3d6
  );

  --ui-font:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", "Noto Color Emoji";
  --editor-font: "iA-Mono", "Menlo";
  --editor-width: 800px;
}

html[data-theme="light"] {
  color-scheme: light;
}

html[data-theme="dark"] {
  color-scheme: dark;

  --ui-accent-color: #464cfc;
  --ui-accent-text-color: var(--ui-accent-color);
  --ui-accent-text-color: color-mix(
    in srgb,
    var(--ui-accent-color),
    white 50%
  );
  --highlight-color: rgba(255, 255, 0, 0.5);
  --link-color: #7e99fc;
  --link-missing-color: #9e4705;
  --link-invalid-color: #d444f8;
  --meta-color: #d6222e;
  --meta-subtle-color: #959595;
  --subtle-color: #959595;
  --subtle-background-color: rgba(105, 105, 105, 0.1);

  --root-background-color: #111;
  --root-color: #fff;

  --top-color: #fff;
  --top-background-color: #262626;
  --top-border-color: rgb(62, 62, 62);
  --top-sync-error-color: var(--top-color);
  --top-sync-error-background-color: #622626;
  --top-saved-color: #fff;
  --top-unsaved-color: #c7c7c7;
  --top-loading-color: #c7c7c7;

  --panel-background-color: #111;
  --panel-border-color: rgb(62, 62, 62);

  --bhs-background-color: #111;
  --bhs-border-color: rgb(62, 62, 62);

  --modal-color: #ccc;
  --modal-background-color: #262626;
  --modal-border-color: #6c6c6c;
  --modal-header-label-color: var(--ui-accent-text-color);
  --modal-help-background-color: #333;
  --modal-help-color: #ccc;
  --modal-selected-option-background-color: var(--ui-accent-color);
  --modal-selected-option-color: #eee;
  --modal-hint-background-color: #212476;
  --modal-hint-color: #eee;
  --modal-hint-inactive-background-color: #353535;
  --modal-hint-inactive-color: #ccc;
  --modal-description-color: #969696;
  --modal-selected-option-description-color: #e6e6e6;

  --notifications-background-color: #333;
  --notifications-border-color: rgb(197, 197, 197);
  --notification-info-background-color: #1b76bb;
  --notification-error-background-color: #a32121;

  --button-background-color: #555;
  --button-hover-background-color: #777;
  --button-color: white;
  --button-border-color: #666;
  --primary-button-background-color: var(--ui-accent-color);
  --primary-button-hover-background-color: color-mix(
    in srgb,
    var(--ui-accent-color),
    black 35%
  );
  --primary-button-color: var(--ui-accent-contrast-color);
  --primary-button-border-color: transparent;

  --progress-background-color: #555;
  --progress-sync-color: white;
  --progress-index-color: yellow;

  --text-field-background-color: var(--button-background-color);

  --action-button-background-color: transparent;
  --action-button-color: #adadad;
  --action-button-hover-color: #37a1ed;
  --action-button-active-color: #37a1ed;

  --editor-caret-color: #fff;
  --editor-selection-background-color: #d7e1f630;
  --editor-panels-bottom-color: #fff;
  --editor-panels-bottom-background-color: #262626;
  --editor-panels-bottom-border-color: rgb(62, 62, 62);
  --editor-completion-detail-color: #aaa;
  --editor-completion-detail-selected-color: #d2d2d2;
  --editor-list-bullet-color: rgb(150, 150, 150);
  --editor-heading-color: #d1d1d1;
  --editor-heading-meta-color: var(--meta-subtle-color);
  --editor-hashtag-background-color: #004bbb;
  --editor-hashtag-color: #e2e9ff;
  --editor-hashtag-border-color: #007bff6b;
  --editor-ruler-color: rgb(76, 75, 75);
  --editor-naked-url-color: var(--link-color);
  --editor-link-color: var(--link-color);
  --editor-link-url-color: var(--link-color);
  --editor-link-meta-color: var(--meta-subtle-color);
  --editor-wiki-link-page-background-color: #a3bce712;
  --editor-wiki-link-page-color: var(--link-color);
  --editor-wiki-link-page-missing-color: var(--link-missing-color);
  --editor-wiki-link-page-invalid-color: var(--link-invalid-color);
  --editor-wiki-link-color: #8f96c2;
  --editor-command-button-color: #fff;
  --editor-command-button-background-color: #555;
  --editor-command-button-hover-background-color: #777;
  --editor-command-button-meta-color: var(--meta-subtle-color);
  --editor-command-button-border-color: #666;
  --editor-line-meta-color: var(--meta-subtle-color);
  --editor-meta-color: var(--meta-color);
  --editor-table-head-background-color: rgba(72, 72, 72, 0.4);
  --editor-table-head-color: #eee;
  --editor-table-even-background-color: rgba(72, 72, 72, 0.3);
  --editor-blockquote-background-color: var(--subtle-background-color);
  --editor-blockquote-color: var(--subtle-color);
  --editor-blockquote-border-color: rgb(74, 74, 74);
  --editor-code-background-color: var(--subtle-background-color);
  --editor-struct-color: #d6222e;
  --editor-highlight-background-color: var(--highlight-color);
  --editor-code-comment-color: var(--meta-subtle-color);
  --editor-code-variable-color: #41a3ce;
  --editor-code-typename-color: #038138;
  --editor-code-string-color: #986db9;
  --editor-code-number-color: #986db9;
  --editor-code-info-color: var(--subtle-color);
  --editor-code-atom-color: #d6222e;
  --editor-frontmatter-background-color: rgb(41, 40, 35, 0.5);
  --editor-frontmatter-color: var(--subtle-color);
  --editor-frontmatter-marker-color: #fff;
  --editor-widget-background-color: rgba(72, 72, 72, 0.5);
  --editor-task-marker-color: var(--subtle-color);
  --editor-task-state-color: var(--subtle-color);

  --editor-directive-mark-color: #ba0303;
  --editor-directive-color: #898989;
  --editor-directive-background-color: #4c4c4c7d;

  --editor-panels-bottom-input-background-color: inherit;
  --editor-panels-bottom-button-background-image: linear-gradient(
    #393939,
    #111
  );
  --editor-panels-bottom-button-active-background-image: linear-gradient(
    #111,
    #333
  );
}

html[data-markdown-syntax-rendering="on"] {
  --editor-meta-color: unset;
  --editor-directive-mark-color: unset;

  #sb-main
    .cm-editor
    .sb-lua-directive-block:not(
      .sb-lua-top-widget
    ):not(
      .sb-lua-bottom-widget
    ):not(
      .sb-inline-content
    ) {
    margin-top: 0.5em;
  }
}

.sb-admonition[admonition="note" i] {
  .sb-admonition-type {
    &::before {
      width: var(--admonition-width) !important;
    }

    * {
      display: none;
    }
  }

  --admonition-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>');
  --admonition-color: #00b8d4;
}

.sb-admonition[admonition="warning" i] {
  .sb-admonition-type {
    &::before {
      width: var(--admonition-width) !important;
    }

    * {
      display: none;
    }
  }

  --admonition-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>');
  --admonition-color: #ff9100;
}

.sb-admonition[admonition="danger" i] {
  .sb-admonition-type {
    &::before {
      width: var(--admonition-width) !important;
    }

    * {
      display: none;
    }
  }

  --admonition-icon: url('data:image/svg+xml,<svg  width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>');
  --admonition-color: #d50000;
}

.sb-admonition[admonition="success" i] {
  .sb-admonition-type {
    &::before {
      width: var(--admonition-width) !important;
    }

    * {
      display: none;
    }
  }

  --admonition-icon: url('data:image/svg+xml,<svg  width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>');
  --admonition-color: #00c853;
}
```