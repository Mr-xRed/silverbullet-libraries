---
name: "Library/Mr-xRed/PanelWidthResizer"
tags: meta/library
pageDecoration.prefix: "🛠️ "
---

# Resize Side Panels (LHS, RHS, BHS) using your mouse & drag handles

## Configuration

*   **auto**: It automatically toggles between docked and overlay based on your screen width. (default)
*   **dock**: Best for desktops; it pushes the editor to the side to make room for your panels.
*   **overlay**: Ideal for mobile or focused work; the panels float over the editor to temporarily access the panel


```space-lua
config.set("sidePanel.mode", "auto") -- "auto" | "overlay" | "dock"
```

## Implementation

### Title bar fix
- We are setting the TitleBar to “fixed” so it doesn’t change focus when resizing the panels
- 
```space-style
#sb-top .panel {
 position:fixed;
}
```

### Space-Lua + JS
```space-lua
function initDraggablePanel()
    local cfg = config.get("sidePanel") or {}
    local panelMode = cfg.mode or "auto"

    local savedLHS = clientStore.get("lhsPanelWidth") or "300"
    local savedRHS = clientStore.get("rhsPanelWidth") or "300"
    local savedBHS = clientStore.get("bottomPanelHeight") or "200"

    local script = [[
        (function() {
            const handlePrefix = "sb-drag-handle-";
            const panelMode = "]] .. panelMode .. [[";
            
            const getLayouts = () => {
                const main = document.querySelector("#sb-main");
                if (!main) return [];
                const layouts = [];
                const sidePanels = main.querySelectorAll(":scope > .sb-panel");
                const bottomPanel = document.querySelector("#sb-root > .sb-bhs");
                const editor = document.querySelector("#sb-editor");

                sidePanels.forEach(panel => {
                    if (panel.classList.contains("is-detached-window")) return;
                    // 1. Assign classes directly based on DOM position if not already present
                    // This creates the 'lhs'/'rhs' classes for other scripts to use
                    const isLHS = panel.nextElementSibling === editor || (panel.nextElementSibling && panel.nextElementSibling.contains(editor));
                    const type = isLHS ? "LHS" : "RHS";
                    const className = type.toLowerCase(); // 'lhs' or 'rhs'

                    if (!panel.classList.contains(className)) {
                        panel.classList.add(className);
                    }

                    layouts.push({ el: panel, type: type });
                });

                if (bottomPanel && !bottomPanel.classList.contains("is-detached-window")) {
                    if (!bottomPanel.classList.contains("bhs")) bottomPanel.classList.add("bhs");
                    layouts.push({ el: bottomPanel, type: "BHS" });
                }
                return layouts;
            };

            const injectHandles = () => {
                const layouts = getLayouts();
                
                const existingHandles = document.querySelectorAll(`[id^="${handlePrefix}"]`);
                existingHandles.forEach(h => {
                    const type = h.id.replace(handlePrefix, "");
                    const isStillActive = layouts.some(l => l.type === type);
                    if (!isStillActive) h.remove();
                });

                layouts.forEach(layout => {
                    const { el, type } = layout;
                    const handleId = handlePrefix + type;
                    
                    if (document.getElementById(handleId)) return;

                    const applyDimension = (val) => {
                        if (el.classList.contains("is-detached-window")) return;

                        let useOverlay = (panelMode === "overlay") || (panelMode === "auto" && window.innerWidth < 600);

                        if (type === "BHS") {
                            el.style.setProperty("position", "relative", "important");
                            el.style.setProperty("height", val + "px", "important");
                            el.style.setProperty("flex", "0 0 " + val + "px", "important");
                        } else {
                            if (useOverlay) {
                                el.style.setProperty("position", "fixed", "important");
                                el.style.setProperty("top", "56px", "important");
                                el.style.setProperty("bottom", "0", "important");
                                el.style.setProperty("z-index", "1000", "important");
                                if (type === "LHS") {
                                    el.style.setProperty("left", "0", "important");
                                    el.style.removeProperty("right");
                                } else {
                                    el.style.setProperty("right", "0", "important");
                                    el.style.removeProperty("left");
                                }
                            } else {
                                el.style.setProperty("position", "relative", "important");
                                ["top", "bottom", "left", "right", "z-index"].forEach(p => el.style.removeProperty(p));
                            }
                            el.style.setProperty("width", val + "px", "important");
             //             el.style.setProperty("max-width", val + "px", "important");
                            el.style.setProperty("flex", "0 0 " + val + "px", "important");
                        }
                    };

                    let initialVal = (type === "LHS") ? "]] .. savedLHS .. [[" : (type === "RHS" ? "]] .. savedRHS .. [[" : "]] .. savedBHS .. [[");
                    applyDimension(initialVal);

                    const handle = document.createElement("div");
                    handle.id = handleId;
                    let handleStyle = `position: absolute; z-index: 10000; touch-action: none; display: flex; align-items: center; justify-content: center;`;
                    if (type === "LHS") handleStyle += `top: 0; right: -8px; width: 16px; height: 100%; cursor: col-resize;`;
                    else if (type === "RHS") handleStyle += `top: 0; left: -8px; width: 16px; height: 100%; cursor: col-resize;`;
                    else if (type === "BHS") handleStyle += `top: -8px; left: 0; width: 100%; height: 16px; cursor: row-resize;`;
                    
                    handle.setAttribute("style", handleStyle);
                    const resizeLine = document.createElement("div");
                    let lineStyle = `position: absolute; background: gray; opacity: 0; transition: opacity 0.5s, background 0.5s; pointer-events: none;`;
                    if (type === "BHS") lineStyle += `top: 8px; left: 0; width: 100%; height: 2px;`;
                    else lineStyle += `top: 0; ${type === "LHS" ? "right: 5px" : "left: 5px"}; width: 4px; height: 100%;`;
                    
                    resizeLine.setAttribute("style", lineStyle);
                    handle.appendChild(resizeLine);
                    el.appendChild(handle);

                    // Hover Effects
                    handle.addEventListener("mouseenter", () => {
                        if (handle.dataset.dragging !== "true") {
                            resizeLine.style.background = "gray";
                            resizeLine.style.opacity = "0.5";
                        }
                    });
                    handle.addEventListener("mouseleave", () => {
                        if (handle.dataset.dragging !== "true") {
                            resizeLine.style.opacity = "0";
                        }
                    });

                    const startDragging = (e) => {
                        const isTouch = e.type === 'touchstart';
                        if (e.cancelable) e.preventDefault();
                        
                        handle.dataset.dragging = "true";
                        resizeLine.style.background = "var(--ui-accent-color, #007bff)";
                        resizeLine.style.opacity = "1";
                        document.querySelectorAll('iframe').forEach(ifrm => ifrm.style.pointerEvents = 'none');
                    
                        const onMove = (me) => {
                            const touch = me.touches ? me.touches[0] : me;
                            let newVal;
                            if (type === "LHS") {
                                newVal = touch.clientX;
                                if (newVal > 300 && newVal < 800) applyDimension(newVal);
                            } else if (type === "RHS") {
                                newVal = window.innerWidth - touch.clientX;
                                if (newVal > 300 && newVal < 800) applyDimension(newVal);
                            } else if (type === "BHS") {
                                newVal = window.innerHeight - touch.clientY;
                                if (newVal > 100 && newVal < 600) applyDimension(newVal);
                            }
                        };
                    
                        const onUp = () => {
                            handle.dataset.dragging = "";
                            resizeLine.style.background = "gray";
                            resizeLine.style.opacity = "0";
                            document.querySelectorAll('iframe').forEach(ifrm => ifrm.style.pointerEvents = 'auto');
                            
                            window.removeEventListener("mousemove", onMove);
                            window.removeEventListener("mouseup", onUp);
                            window.removeEventListener("touchmove", onMove);
                            window.removeEventListener("touchend", onUp);
                    
                            const dim = (type === "BHS") ? el.offsetHeight : el.offsetWidth;
                            window.dispatchEvent(new CustomEvent("sb-save-" + type.toLowerCase(), { detail: { value: dim } }));
                        };
                    
                        if (isTouch) {
                            window.addEventListener("touchmove", onMove, { passive: false });
                            window.addEventListener("touchend", onUp);
                        } else {
                            window.addEventListener("mousemove", onMove);
                            window.addEventListener("mouseup", onUp);
                        }
                    };
                    
                    handle.addEventListener("mousedown", startDragging);
                    handle.addEventListener("touchstart", startDragging, { passive: false });
                });
            };

            const observer = new MutationObserver(injectHandles);
            observer.observe(document.body, { childList: true, subtree: true });
            injectHandles();
        })();
    ]]

    local scriptEl = js.window.document.createElement("script")
    scriptEl.innerHTML = script
    js.window.document.body.appendChild(scriptEl)

    js.window.addEventListener("sb-save-lhs", function(e) clientStore.set("lhsPanelWidth", e.detail.value) end)
    js.window.addEventListener("sb-save-rhs", function(e) clientStore.set("rhsPanelWidth", e.detail.value) end)
    js.window.addEventListener("sb-save-bhs", function(e) clientStore.set("bottomPanelHeight", e.detail.value) end)
end

initDraggablePanel()


-- Command to FIX Resizer when not launched automagically
-- command.define {
--    name = "UI: Fix Multi-Panel Resizer",
--    run = function() initDraggablePanel() end
--}
```

# Discussions about this library
- [Silverbullet Community](https://community.silverbullet.md/t/resizing-side-panels-lhs-rhs-bhs-using-drag-handle/3728)
