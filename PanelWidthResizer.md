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
            const drawerPrefix = "sb-drawer-toggle-";
            const configMode = "]] .. panelMode .. [[";
            
            // --- STATE MANAGEMENT ---
            let currentMode = "dock"; 

            const updateToggleIcon = (toggle, type, isOpen) => {
                if (type === "LHS") toggle.innerHTML = isOpen ? "<" : ">";
                if (type === "RHS") toggle.innerHTML = isOpen ? ">" : "<"; 
                if (type === "BHS") toggle.innerHTML = isOpen ? "v" : "^";
            };

            const createDrawerToggle = (el, type) => {
                const toggleId = drawerPrefix + type;
                if (document.getElementById(toggleId)) return;

                const toggle = document.createElement("div");
                toggle.id = toggleId;
                toggle.className = "sb-drawer-toggle"; 
                
                let style = `
                    position: absolute; 
                    z-index: 10005; 
                    background: oklch(from var(--top-background-color) l c h );
                    /*backdrop-filter: blur(5px);*/
                    border: 1px solid var(--panel-border-color);
                    color: var(--root-color);
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    cursor: pointer;
                    font-family: monospace;
                    font-weight: bold;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    transition: all 0.3s ease;
                `;

                if (type === "LHS") {
                    style += `top: 50%; right: -29px; width: 28px; height: 64px; border-left: none; border-radius: 0 8px 8px 0; transform: translateY(-50%);`;
                } else if (type === "RHS") {
                    style += `top: 50%; left: -29px; width: 28px; height: 64px; border-right: none; border-radius: 8px 0 0 8px; transform: translateY(-50%);`;
                } else if (type === "BHS") {
                    style += `left: 50%; top: -29px; width: 64px; height: 28px; border-bottom: none; border-radius: 8px 8px 0 0; transform: translateX(-50%);`;
                }

                toggle.style.cssText = style;
                
                toggle.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const isOpen = el.getAttribute("data-drawer-open") !== "false";
                    const newState = !isOpen;
                    el.setAttribute("data-drawer-open", newState);
                    updateToggleIcon(toggle, type, newState);
                    refreshPanelState(el, type, currentMode);
                });
                
                updateToggleIcon(toggle, type, el.getAttribute("data-drawer-open") !== "false");
                el.appendChild(toggle);
            };

            const refreshPanelState = (el, type, mode) => {
                const isOpen = el.getAttribute("data-drawer-open") !== "false";
                
                // Get current size settings
                let widthVal = el.style.getPropertyValue("--sb-panel-width") || "300px";
                let heightVal = el.style.getPropertyValue("--sb-panel-height") || "200px";

                // Clean up raw numeric values if they somehow got in
                if (!widthVal.includes("px")) widthVal += "px";
                if (!heightVal.includes("px")) heightVal += "px";

                if (mode === "overlay") {
                    // --- OVERLAY MODE ---
                    // Reset margins that might be left over from dock mode
                    el.style.marginLeft = ""; el.style.marginRight = ""; el.style.marginBottom = "";
                    el.style.opacity = "1";

                    if (type === "LHS") el.style.transform = isOpen ? "translateX(0)" : "translateX(-100%)";
                    if (type === "RHS") el.style.transform = isOpen ? "translateX(0)" : "translateX(100%)";
                    if (type === "BHS") el.style.transform = isOpen ? "translateY(0)" : "translateY(100%)";
                    
                } else {
                    // --- DOCK MODE ---
                    // Reset transforms from overlay mode
                    el.style.transform = "";
                    
                    // We use Negative Margins to "slide" the panel away while collapsing space
                    // AND we use opacity to fade it out so it doesn't look like a glitchy squeeze
                    
                    if (isOpen) {
                        el.style.marginLeft = "0";
                        el.style.marginRight = "0";
                        el.style.marginBottom = "0";
                        el.style.opacity = "1";
                        // Ensure pointer events work when open
                        el.style.pointerEvents = "auto";
                    } else {
                        if (type === "LHS") el.style.marginLeft = `calc(${widthVal} * -1)`;
                        if (type === "RHS") el.style.marginRight = `calc(${widthVal} * -1)`;
                        if (type === "BHS") el.style.marginBottom = `calc(${heightVal} * -1)`;
                        
                        // Fade out content to prevent "squished text" visual artifacts
                        el.style.opacity = "0.5";
                        // Optional: disable interactions when closed to prevent accidental clicks on hidden items
                        el.style.pointerEvents = "none";
                        // Re-enable pointer events on the TOGGLE handle explicitly? 
                        // The toggle is a child, so we need to ensure it stays clickable.
                        // We do this by not setting pointer-events: none on the container, 
                        // or by overriding it on the toggle handle (which we did in CSS).
                        el.style.pointerEvents = "auto"; 
                    }
                }
            };

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

            const refreshLayout = () => {
                const layouts = getLayouts();
                const viewportWidth = window.innerWidth;
                
                // Determine Mode
                let useOverlay = (configMode === "overlay") || (configMode === "auto" && viewportWidth < 800);
                currentMode = useOverlay ? "overlay" : "dock";

                layouts.forEach(layout => {
                    const { el, type } = layout;

                    // 1. Setup CSS Variables for Width/Height if not present
                    // This is crucial for the CSS calc() in dock mode to work smoothly
                    if (!el.style.getPropertyValue("--sb-panel-width")) {
                        const w = (type === "LHS" ? "]] .. savedLHS .. [[" : "]] .. savedRHS .. [[") + "px";
                        el.style.setProperty("--sb-panel-width", w);
                    }
                    if (!el.style.getPropertyValue("--sb-panel-height")) {
                        const h = "]] .. savedBHS .. [[" + "px";
                        el.style.setProperty("--sb-panel-height", h);
                    }

                    // 2. Base Styles
                    el.style.overflow = "visible"; // Allow handle to stick out
                    // Standardize transition: handles transform (overlay) and margin (dock)
                    el.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), margin 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s";
                    
                    // 3. Inject Controls
                    createDrawerToggle(el, type);
                    injectResizeHandle(el, type);

                    // 4. Mode Specific Setup
                    if (useOverlay) {
                        el.style.position = "fixed";
                        el.style.zIndex = "1001";
                        el.style.minWidth = ""; el.style.minHeight = "";
                        el.style.maxWidth = ""; 
                        
                        // Reset Flex settings so it doesn't mess with overlay
                        el.style.flex = "none";

                        if (type === "BHS") {
                            el.style.bottom = "0"; el.style.left = "0"; el.style.right = "0";
                            el.style.height = "var(--sb-panel-height)";
                            el.style.width = "100%";
                        } else {
                            el.style.top = "56px"; el.style.bottom = "0";
                            el.style.width = "var(--sb-panel-width)";
                            if (type === "LHS") el.style.left = "0";
                            else el.style.right = "0";
                        }
                    } else {
                        // --- DOCK MODE SETUP ---
                        el.style.position = "relative";
                        el.style.zIndex = "100"; // Lower than overlay
                        el.style.top = ""; el.style.bottom = ""; el.style.left = ""; el.style.right = "";
                        
                        // --- RESIZING LOGIC FIX ---
                        // flex-shrink: 0 ensures panel stays fixed width when window resizes
                        // max-width: 100vw ensures it shrinks ONLY if window < panel width
                        if (type === "BHS") {
                            el.style.height = "var(--sb-panel-height)";
                            el.style.width = "100%";
                            el.style.flex = "0 0 auto"; 
                        } else {
                            el.style.width = "var(--sb-panel-width)";
                            el.style.maxWidth = "100vw"; 
                            el.style.flex = "0 0 auto"; // Don't grow, Don't shrink
                        }
                    }

                    // 5. Apply Open/Close State
                    refreshPanelState(el, type, currentMode);
                });
            };

            const injectResizeHandle = (el, type) => {
                const handleId = handlePrefix + type;
                if (document.getElementById(handleId)) return;

                const handle = document.createElement("div");
                handle.id = handleId;
                
                let handleStyle = `position: absolute; z-index: 10006; touch-action: none; display: flex; align-items: center; justify-content: center;`;
                if (type === "LHS") handleStyle += `top: 0; right: -8px; width: 16px; height: 100%; cursor: col-resize;`;
                else if (type === "RHS") handleStyle += `top: 0; left: -8px; width: 16px; height: 100%; cursor: col-resize;`;
                else if (type === "BHS") handleStyle += `top: -8px; left: 0; width: 100%; height: 16px; cursor: row-resize;`;
                
                handle.setAttribute("style", handleStyle);

                const resizeLine = document.createElement("div");
                let lineStyle = `position: absolute; background: var(--ui-accent-color, #007bff); opacity: 0; transition: opacity 0.3s; pointer-events: none;`;
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
                    if (el.getAttribute("data-drawer-open") === "false") return;
                    
                    const isTouch = e.type === 'touchstart';
                    if (e.cancelable) e.preventDefault();
                    
                    handle.dataset.dragging = "true";
                    resizeLine.style.opacity = "1";
                    document.querySelectorAll('iframe').forEach(ifrm => ifrm.style.pointerEvents = 'none');
                
                    const onMove = (me) => {
                        const touch = me.touches ? me.touches[0] : me;
                        let newVal;
                        
                        if (type === "LHS") newVal = touch.clientX;
                        else if (type === "RHS") newVal = window.innerWidth - touch.clientX;
                        else if (type === "BHS") newVal = window.innerHeight - touch.clientY;

                        // Constraints
                        if (type !== "BHS" && (newVal < 150 || newVal > 800)) return;
                        if (type === "BHS" && (newVal < 100 || newVal > 600)) return;

                        // UPDATE CSS VARIABLES
                        // This updates the layout AND the "closed" state calc() automatically
                        if (type === "BHS") {
                            el.style.setProperty("--sb-panel-height", newVal + "px");
                        } else {
                            el.style.setProperty("--sb-panel-width", newVal + "px");
                        }
                    };
                
                    const onUp = () => {
                        handle.dataset.dragging = "";
                        resizeLine.style.opacity = "0";
                        document.querySelectorAll('iframe').forEach(ifrm => ifrm.style.pointerEvents = 'auto');
                        
                        window.removeEventListener("mousemove", onMove);
                        window.removeEventListener("mouseup", onUp);
                        window.removeEventListener("touchmove", onMove);
                        window.removeEventListener("touchend", onUp);
                
                        // Save Value
                        let dim;
                        if (type === "BHS") {
                            dim = parseInt(el.style.getPropertyValue("--sb-panel-height"));
                        } else {
                            dim = parseInt(el.style.getPropertyValue("--sb-panel-width"));
                        }
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
            };

            // Init
            const observer = new MutationObserver(refreshLayout);
            observer.observe(document.body, { childList: true, subtree: true });
            
            // Debounce resize
            let resizeTimer;
            window.addEventListener("resize", () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(refreshLayout, 50);
            });
            
            // Initial boot
            setTimeout(refreshLayout, 100);
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
