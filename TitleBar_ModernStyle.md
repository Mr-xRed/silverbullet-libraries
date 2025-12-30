---
name: "Library/Mr-xRed/TitleBar_ModernStyle"
description: "Modern restyling of the Title Bar"
tags: meta/library
pageDecoration.prefix: "🖌️ "
---

# Title Bar Restyling

* this is a restyle for your Title Bar which will give it a modern look with frosted glass effect

## Implementation
```css
#sb-top{
  border: none;
  height: 80px;
}

#sb-top .main {
  position: fixed;
  top: 10px; 
  left: calc(50% - 5px); 
  transform: translateX(-50%);
  
  width: calc(100vw - 60px);
  max-width: calc(var(--editor-width) + 120px);
  border-radius: 35px;
  padding: 5px 0px;
  box-shadow:
    inset 2px 2px 6px rgba(255,255,255,0.2), 
    inset -2px -2px 6px rgba(0,0,0,0.3),     
    0 2px 4px rgba(0,0,0,0.2),
    0 10px 10px rgba(0,0,0,0.2);
  
  background: rgba(64, 64, 64, 0.2);
  backdrop-filter: blur(16px) saturate(100%);
  -webkit-backdrop-filter: blur(16px) saturate(100%);

  overflow: visible;
  transition: background 0.5s ease, backdrop-filter 0.5s ease;
}

#sb-top .main:hover {
  background: rgba(192, 192, 192, 0.4);
  backdrop-filter: blur(20px) saturate(250%);
}

#sb-top .cm-line {
  text-shadow: 0 1px 5px var(--top-background-color);
}

  #sb-main .cm-editor .cm-content {
  margin-top: 100px;
}

.sb-notifications {
  top: 75px !important;
}

.sb-notifications > div {
  box-shadow: 0px 1px 5px rgba(0,0,0,0.3),  
              0px 5px 10px rgba(0,0,0,0.2);  
}

.cm-scroller {
    overflow-x: hidden !important;
}  



button svg {
  transition: filter 0.25s ease, transform 0.25s ease;
}
  /*  transition: filter 0.15s ease, transform 0.15s ease;
  filter:
    drop-shadow(0 0 1px rgba(0, 0, 0, 1))
    drop-shadow(0 0 2px var(--root-background-color));
}
*/
.sb-actions button:hover svg {
  filter: drop-shadow(0 0 1px currentColor);
  transform: scale(1.5);
}



#sb-editor > iframe {
    position: relative;
    height: calc(100% - 85px);
    border: none;
    top: 85px !important;
}

#sb-top.sb-sync-error {
    position: relative;
}

#sb-top.sb-sync-error:after {
    content: "SERVER UNREACHABLE";
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
    text-align: center;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: bold;
    background-color: oklch(60% 0.35 40/0.4);
    backdrop-filter: blur(10px) saturate(100%);
  -webkit-backdrop-filter: blur(10px) saturate(100%);
    color: var(--top-sync-error-color);
    white-space: nowrap; 
}

```

## Discussions to this space-style
* [SilverBullet Community](https://community.silverbullet.md/t/space-style-modern-frosted-glass-style-title-bar/3483?u=mr.red)