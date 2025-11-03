---
tags: meta
---

# Title Bar Restyling

* this is a restyle for your Title Bar which will give it a modern look with frosted glass effect

## Implementation
```space-style
#sb-top{
  border: none;
  height: 0px;
}

#sb-top .main {
  position: fixed;
  top: 10px; 
  left: calc(50% - 5px); 
  transform: translateX(-50%);
  
  width: calc(100vw - 20px);
  max-width: var(--editor-width);
  border-radius: 15px;
  border: 1px solid #aaa4;
  padding: 5px 0px;
  box-shadow:
    inset 2px 2px 6px rgba(255,255,255,0.2), 
    inset -2px -2px 6px rgba(0,0,0,0.3),     
    0 2px 4px rgba(0,0,0,0.2),
    0 10px 10px rgba(0,0,0,0.2);
  
  background: rgba(64, 64, 64, 0.2);
  backdrop-filter: blur(16px) saturate(100%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);

  overflow: visible;
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
```

## Discussions to this space-style
* [SilverBullet Community](https://community.silverbullet.md/t/space-style-modern-frosted-glass-style-title-bar/3483?u=mr.red)