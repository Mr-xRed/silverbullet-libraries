/**
 * Unified Window Manager
 * Foundation: Second script's drag/resize/fail-safe logic.
 * Extensions: Viewport clamping, Absolute Z-Index Focus, min-dimensions, and content handling.
 *
 * Also contains the migrated SilverBullet Panel Manager (SPM) that was previously injected from Lua.
 *
 * Exports:
 * - show(content, titleLabel)
 * - showDocked(content, panelID)
 * - enableWindow(panelSelector)
 * - disableWindow(panelSelector)
 * - closeAll()
 * - initPanelControls(options)  <-- initialize the SPM (call from Lua with config + saved dims)
 */

let highestZ = 100;
const SNAP_THRESHOLD = 15;
const TOP_OFFSET = 55;

//function injectStyles() {
//  if (document.getElementById("sb-unified-drag-styles")) return;
//  const style = document.createElement("style");
//  style.id = "sb-unified-drag-styles";
//  style.textContent = `  `;
//  (document.head || document.documentElement).appendChild(style);
//}

function focusWindow(win) {
  document.querySelectorAll(".sb-window-container").forEach(c => c.classList.remove("is-focused"));
  highestZ += 1;
  win.style.setProperty("z-index", highestZ.toString(), "important");
  win.classList.add("is-focused");
}

function clampToViewport(win, isPanel = false) {
  const rect = win.getBoundingClientRect();
  const minTop = isPanel ? TOP_OFFSET : TOP_OFFSET;
  const minW = isPanel ? 250 : 250;
  const minH = isPanel ? 250 : 250;
  let left = rect.left, top = rect.top, width = Math.max(rect.width, minW), height = Math.max(rect.height, minH);
  if (width > window.innerWidth) width = window.innerWidth;
  if (height > window.innerHeight - minTop) height = window.innerHeight - minTop;
  if (left < 0) left = 0;
  if (top < minTop) top = minTop;
  if (left + width > window.innerWidth) left = window.innerWidth - width;
  if (top + height > window.innerHeight) top = window.innerHeight - height;
  win.style.left = `${left}px`;
  win.style.top = `${top}px`;
  win.style.width = `${width}px`;
  win.style.height = `${height}px`;
}

function setupEvents(container, header, storageKey, isPanel) {
  let activeAction = null;
  let startX, startY, startW, startH, startL, startT;
  const setIframesPointer = (val) => container.querySelectorAll("iframe").forEach(f => f.style.pointerEvents = val);
  const handleDown = (e) => {
    const resizer = e.target.closest('.sb-resizer');
    const isHeader = e.target.closest('.sb-window-header');
    if (e.target.closest('.sb-window-close-btn')) return;
    focusWindow(container);
    if (resizer || isHeader) {
      activeAction = resizer ? resizer.dataset.direction : 'drag';
      startX = e.clientX;
      startY = e.clientY;
      startW = container.offsetWidth;
      startH = container.offsetHeight;
      startL = container.offsetLeft;
      startT = container.offsetTop;
      setIframesPointer("none");
      e.target.setPointerCapture(e.pointerId);
      e.stopPropagation();
      document.body.style.userSelect = "none";
    }
  };
  container.addEventListener("pointerdown", () => focusWindow(container), true);
  header.addEventListener("pointerdown", handleDown);
  container.querySelectorAll('.sb-resizer').forEach(r => r.addEventListener("pointerdown", handleDown));
  window.addEventListener("pointermove", (e) => {
    if (!activeAction) return;
    let newLeft = startL, newTop = startT, newWidth = startW, newHeight = startH;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const minTop = isPanel ? TOP_OFFSET : TOP_OFFSET;
    const minW = isPanel ? 320 : 260;
    const minH = isPanel ? 310 : 260;
    if (activeAction === 'drag') {
      newLeft = startL + dx;
      newTop = startT + dy;
      if (newLeft < SNAP_THRESHOLD) newLeft = 0;
      if (newTop < minTop + SNAP_THRESHOLD) newTop = minTop;
      if (newLeft + startW > window.innerWidth - SNAP_THRESHOLD) newLeft = window.innerWidth - startW;
      if (newTop + startH > window.innerHeight - SNAP_THRESHOLD) newTop = window.innerHeight - startH;
      container.style.left = `${newLeft}px`;
      container.style.top = `${newTop}px`;
    } else {
      if (activeAction.includes('r')) newWidth = startW + dx;
      if (activeAction.includes('b')) newHeight = startH + dy;
      if (activeAction.includes('l')) { newWidth = startW - dx; newLeft = startL + dx; }
      if (activeAction.includes('t')) { newHeight = startH - dy; newTop = startT + dy; }
      if (newLeft < 0) { newWidth += newLeft; newLeft = 0; }
      if (newTop < minTop) { newHeight -= (minTop - newTop); newTop = minTop; }
      if (newLeft + newWidth > window.innerWidth) newWidth = window.innerWidth - newLeft;
      if (newTop + newHeight > window.innerHeight) newHeight = window.innerHeight - newTop;
      if (newWidth >= minW) { container.style.width = `${newWidth}px`; container.style.left = `${newLeft}px`; }
      if (newHeight >= minH) { container.style.height = `${newHeight}px`; container.style.top = `${newTop}px`; }
    }
  });
  const stopAction = () => {
    if (!activeAction) return;
    activeAction = null;
    setIframesPointer("auto");
    document.body.style.userSelect = "";
    try {
      localStorage.setItem(storageKey, JSON.stringify({ x: container.offsetLeft, y: container.offsetTop, w: container.offsetWidth, h: container.offsetHeight }));
    } catch (err) {}
  };
  window.addEventListener("pointerup", stopAction);
  window.addEventListener("pointercancel", stopAction);
}

/* ===========================
   Existing exported functions
   =========================== */

export function show(content, titleLabel = null) {
 // injectStyles();
  const isUrl = content.startsWith("http://") || content.startsWith("https://");
  const isHtml = content.trim().startsWith("<") && content.trim().endsWith(">");
  const storageKey = isHtml ? "sb_dim_mode_html" : (isUrl ? "sb_dim_mode_url" : "sb_dim_mode_page");
  const sanitizedId = "sb-float-" + (titleLabel || content).replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);
  let container = document.getElementById(sanitizedId);
  if (container) {
    focusWindow(container);
    return;
  }
  container = document.createElement("div");
  container.id = sanitizedId;
  container.className = "sb-window-container is-floating";
  const header = document.createElement("div");
  header.className = "sb-window-header";
  const title = document.createElement("div");
  title.className = "sb-window-title";
  title.innerText = titleLabel || (isUrl ? "Web" : (isHtml ? "HTML" : content));

  //Adding a Dock Button
const dockLHSBtn = document.createElement("div");
dockLHSBtn.className = "sb-window-close-btn";
dockLHSBtn.innerHTML = "⇤";
dockLHSBtn.style.right = "52px";
dockLHSBtn.title = "Dock left";
dockLHSBtn.onclick = e => {
  e.stopPropagation();
  dockFloatingWindow(container, "lhs");
};

const dockRHSBtn = document.createElement("div");
dockRHSBtn.className = "sb-window-close-btn";
dockRHSBtn.innerHTML = "⇥";
dockRHSBtn.style.right = "26px";
dockRHSBtn.title = "Dock right";
dockRHSBtn.onclick = e => {
  e.stopPropagation();
  dockFloatingWindow(container, "rhs");
};

header.appendChild(dockLHSBtn);
header.appendChild(dockRHSBtn);



  const closeBtn = document.createElement("div");
  closeBtn.className = "sb-window-close-btn";
  closeBtn.innerHTML = "✕";

  closeBtn.onclick = (e) => { e.stopPropagation(); container.remove(); };
  
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  const contentArea = document.createElement("div");
  contentArea.className = "sb-window-content";
  
  // Set background to black for a better video experience
  contentArea.style.backgroundColor = "black";

  const iframe = document.createElement("iframe");
  iframe.className = "sb-window-iframe";

  // Critical additions for Video Players
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.setAttribute("allowfullscreen", "true");

  /*
  iframe.onload = () => {
    try {
      const style = document.createElement('style');
      style.textContent = `#sb-top, #sb-main .sb-panel, #sb-root .sb-bhs { display: none !important; } html #sb-root {--editor-width: 800px !important; }`;
      iframe.contentDocument.head.appendChild(style);
    } catch (e) {
      console.warn("Cross-origin iframe detected: Cannot hide #sb-top inside this frame.", e);
    }
  };
  */

  iframe.onload = () => {
    try {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // ===SAFETY NET: CSS HIDE (instant + future-proof) === 
      const style = doc.createElement("style");
      style.textContent = `
        #sb-top,
        #sb-main .sb-panel,
        #sb-root .sb-bhs {
          display: none !important;
        }
      `;
      doc.head.appendChild(style);

      // ====HARD DELETE: remove only the children, never parents ==== 
      const kill = () => {
        doc.querySelector("#sb-top")?.remove();
        doc.querySelectorAll("#sb-main .sb-panel").forEach(el => el.remove());
        doc.querySelector("#sb-root .sb-bhs")?.remove();
     //   doc.querySelector("#custom-styles")?.remove();
      };

      // First pass
      kill();

      // Watch for SPA respawns
      const observer = new MutationObserver(kill);
      observer.observe(doc.body, { childList: true, subtree: true });

    } catch (e) {
      console.warn("Cross-origin iframe detected: DOM modification skipped.", e);
    }
  };


  if (isHtml) {
    const blob = new Blob([content], { type: 'text/html' });
    iframe.src = URL.createObjectURL(blob);
  } else if (isUrl) {
    iframe.src = content;
  } else {
    iframe.src = window.location.origin + "/" + encodeURIComponent(content);
  }
  contentArea.appendChild(iframe);
  container.appendChild(header);
  container.appendChild(contentArea);
  ['t', 'b', 'l', 'r', 'tl', 'tr', 'bl', 'br'].forEach(dir => {
    const handle = document.createElement("div");
    handle.className = `sb-resizer resizer-${dir}`;
    handle.dataset.direction = dir;
    container.appendChild(handle);
  });
  
  /*
  (document.querySelector("#sb-main") || document.body).appendChild(container);
  setupEvents(container, header, storageKey, false);
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
  if (saved) {
    container.style.left = `${saved.x}px`;
    container.style.top = `${saved.y}px`;
    container.style.width = `${saved.w}px`;
    container.style.height = `${saved.h}px`;
    clampToViewport(container, false);
  } else {
    const offset = document.querySelectorAll('.is-floating').length * 30;
    container.style.width = "600px";
    container.style.height = "500px";
    container.style.left = `${100 + offset}px`;
    container.style.top = `${TOP_OFFSET + 35 + offset}px`;
  }
  */

  // Get all existing floating windows *before* adding the new one
  const existingFloating = document.querySelectorAll('.is-floating').length;
  // Then append container
  (document.querySelector("#sb-main") || document.body).appendChild(container);
  setupEvents(container, header, storageKey, false);

  // Apply saved position + offset
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
  const OFFSET_STEP = 20;
  if (saved) {
    const offset = existingFloating > 0 ? existingFloating * OFFSET_STEP : 0;
    container.style.left = `${saved.x + offset}px`;
    container.style.top = `${saved.y + offset}px`;
    container.style.width = `${saved.w}px`;
    container.style.height = `${saved.h}px`;
    clampToViewport(container, false);
  } else {
    const offset = existingFloating * OFFSET_STEP;
    container.style.width = "600px";
    container.style.height = "500px";
    container.style.left = `${100 + offset}px`;
    container.style.top = `${TOP_OFFSET + 35 + offset}px`;
  }
  focusWindow(container);
}

function dockFloatingWindow(container, side) {
  const main = document.querySelector("#sb-main");
  if (!main) return;

  // When docking fails because a panel already exists
  if (main.querySelector(`.sb-panel.${side}`)) {
    // Log to console as before
    console.warn(`Panel already docked on ${side}`);
    
    // Trigger Lua flashNotification
    window.dispatchEvent(
      new CustomEvent("flashNotification", { detail: { value: `Panel already docked on ${side.toUpperCase()}. Close ${side.toUpperCase()} first.` } })
    );

    return;
  }


  const iframe = container.querySelector("iframe");
  if (!iframe) return;

  const panel = document.createElement("div");
  panel.className = `sb-panel ${side} is-expanded`;
  panel.dataset.synthetic = "true"; // ← THIS WAS MISSING


  panel.style.setProperty("--sb-panel-width",
    container.offsetWidth + "px"
  );

  panel.appendChild(iframe);

  if (side === "lhs") {
    main.insertBefore(panel, main.firstChild);
  } else {
    main.appendChild(panel);
  }

  container.remove();
}

/**
 * Show content directly as a synthetic docked panel (LHS/RHS).
 *
 * Usage:
 *  showDocked(content, "rhs"|"lhs", titleLabel?)
 *
 * - Creates a synthetic panel (.sb-panel) with an iframe
 * - Sets dataset.synthetic="true" so SPM treats it as JS-managed
 * - If panel already exists on the side, shows flashNotification and returns
 */
export function showDocked(content, side = "rhs", titleLabel = null) {
  const isUrl = content.startsWith("http://") || content.startsWith("https://");
  const isHtml = content.trim().startsWith("<") && content.trim().endsWith(">");

  const main = document.querySelector("#sb-main");
  if (!main) return;

  // Prevent duplicate synthetic panels on same side
  if (main.querySelector(`.sb-panel.${side}`)) {
    window.dispatchEvent(
      new CustomEvent("flashNotification", {
        detail: { value: `Panel already docked on ${side.toUpperCase()}. Close it first.` }
      })
    );
    return;
  }

  const panel = document.createElement("div");
  panel.className = `sb-panel ${side} is-expanded`;
  panel.dataset.synthetic = "true";

  // Iframe creation (same handling as show)
  const iframe = document.createElement("iframe");
  iframe.className = "sb-window-iframe";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.setAttribute("allowfullscreen", "true");

  iframe.onload = () => {
    try {
      const doc = iframe.contentDocument;
      if (!doc) return;

      const style = doc.createElement("style");
      style.textContent = `
        #sb-top,
        #sb-main .sb-panel,
        #sb-root .sb-bhs {
          display: none !important;
        }
      `;
      doc.head.appendChild(style);

      const kill = () => {
        doc.querySelector("#sb-top")?.remove();
        doc.querySelectorAll("#sb-main .sb-panel").forEach(el => el.remove());
        doc.querySelector("#sb-root .sb-bhs")?.remove();
      };

      kill();
      const observer = new MutationObserver(kill);
      observer.observe(doc.body, { childList: true, subtree: true });

    } catch (e) {
      console.warn("Cross-origin iframe detected: DOM modification skipped.", e);
    }
  };

  if (isHtml) {
    const blob = new Blob([content], { type: 'text/html' });
    iframe.src = URL.createObjectURL(blob);
  } else if (isUrl) {
    iframe.src = content;
  } else {
    iframe.src = window.location.origin + "/" + encodeURIComponent(content);
  }

  panel.appendChild(iframe);

  if (side === "lhs") {
    main.insertBefore(panel, main.firstChild);
  } else {
    main.appendChild(panel);
  }

  // Let the SPM observer pick it up; also trigger an immediate refresh if available
  try {
    if (window.SilverBulletPanelManager && typeof window.SilverBulletPanelManager.layout.refresh === "function") {
      window.SilverBulletPanelManager.layout.refresh();
    }
  } catch (e) {}

  return panel;
}

function cssPx(varName, fallback = 0) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName);
  return parseInt(v, 10) || fallback;
}



export function enableWindow(panelSelector = "#sb-main .sb-panel") {
  //injectStyles();
  const panel = document.querySelector(panelSelector);
  // Guard clause: if panel doesn't exist or is already wrapped
  if (!panel || panel.parentElement.classList.contains('sb-window-container')) return;
  // Identify the type
  let panelType = "panel";
  if (panelSelector.includes("lhs")) panelType = "lhs";
  else if (panelSelector.includes("rhs")) panelType = "rhs";
  else if (panelSelector.includes("bhs") || panel.classList.contains("sb-bhs")) panelType = "bhs";
  // IMPORTANT: Tag the panel so the Resizer script ignores it
  panel.classList.add("is-detached-window");
  panel.classList.remove("is-expanded", "is-collapsed", "is-full");
  const originalInlineStyles = panel.getAttribute("style") || "";
  const storageKey = `sb_dims_${panelType}_v1`;
  const container = document.createElement("div");
  container.className = `sb-window-container is-panel panel-${panelType}`;
  // Store the original style for reversal later
  container.dataset.originalStyle = originalInlineStyles;
  const header = document.createElement("div");
  header.className = "sb-window-header";

  // --- ADDED: two panel-top buttons (close via Lua and revert to panel mode) ---
  // PANEL_ID resolution: prefer element id, otherwise use detected panelType
  const PANEL_ID = panel.id || panelType;
  // Close panel (calls Lua function editor.hidePanel(PANEL_ID) via syscall)
  const panelCloseBtn = document.createElement("div");
 
  panelCloseBtn.addEventListener("pointerdown", e => {e.stopPropagation();});
 
  panelCloseBtn.className = "sb-window-close-btn";
  panelCloseBtn.innerHTML = "✕";
  // position it flush-right (same style as floating window close)
  panelCloseBtn.style.right = "0px";
  
  panelCloseBtn.onclick = (e) => {
    e.stopPropagation();
    
    const container = panelCloseBtn.closest(".sb-window-container");
    if (!container) return;

    // If the panel was docked/floating JS-only
    if (container.querySelector(".sb-panel")?.dataset.synthetic === "true" || container.classList.contains("is-floating")) {
      container.remove();
      return;
    }

 /*    const PANEL_ID = container.querySelector(".sb-panel")?.id || type;
    window.dispatchEvent(new CustomEvent("sb-close-panel", { detail: { type: PANEL_ID } }));*/

    // Native panel (managed by Lua)
    const type = container.querySelector(".sb-panel")?.classList[1] || panelType;
    window.dispatchEvent(new CustomEvent("sb-close-panel", { detail: { type: type.toLowerCase() } }));
  };


   const panelRevertBtn = document.createElement("div");
  panelRevertBtn.className = "sb-window-close-btn";
  panelRevertBtn.innerHTML = "⧉";
  panelRevertBtn.style.right = "26px";
  panelRevertBtn.onclick = (e) => {
    e.stopPropagation();
    try {
      const selector = `#sb-main .sb-panel.${PANEL_ID}`;
      disableWindow(selector);
    } catch (err) {
      console.error("Failed to call disableWindow for panel", PANEL_ID, err);
    }
  };
  // Append title and the new buttons (title is added later if present)
  header.appendChild(panelRevertBtn);
  header.appendChild(panelCloseBtn);
  // --- END ADDED SECTION ---
  ['t', 'b', 'l', 'r', 'tl', 'tr', 'bl', 'br'].forEach(dir => {
    const handle = document.createElement("div");
    handle.className = `sb-resizer resizer-${dir}`;
    handle.dataset.direction = dir;
    container.appendChild(handle);
  });
  panel.parentNode.insertBefore(container, panel);
  container.appendChild(header);
  container.appendChild(panel);
  // Apply localized reset panel.style
  panel.style.cssText = `
  flex: 1 1 0% !important;
  position: relative !important;

  top: 0 !important;
  left: 0 !important;

  margin: 0 !important;
  margin-top: 4px !important;

  width: 100% !important;
  height: 100% !important;

  overflow: clip !important;
  box-sizing: border-box !important;

  border: var(--window-border) solid var(--winbdow-border-color) !important;
  border-radius: var(--window-border-radius) !important;
  
  background: transparent !important;
`;
setupEvents(container, header, storageKey, true);
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
  if (saved) {
    container.style.left = `${saved.x}px`;
    container.style.top = `${saved.y}px`;
    container.style.width = `${saved.w}px`;
    container.style.height = `${saved.h}px`;
    clampToViewport(container, true);
  } else {
    container.style.width = "350px";
    container.style.height = "500px";
    container.style.left = panelType === "rhs" ? (window.innerWidth - 380) + "px" : "30px";
    container.style.top = "100px";
  }
  const observer = new MutationObserver(() => {
    if (!document.body.contains(panel)) {
      if (panel.classList.contains("is-detached-window")) {
        panel.classList.remove("is-detached-window");
        panel.setAttribute("style", originalInlineStyles);
      }
      container.remove();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  focusWindow(container);
}

/**
 * Reverses enableWindow: moves the panel back to its original flow.
 */
export function disableWindow(panelSelector = "#sb-main .sb-panel") {
  const panel = document.querySelector(panelSelector);
  if (!panel || !panel.classList.contains("is-detached-window")) return;
  const container = panel.closest(".sb-window-container");
  if (!container) return;
  // Restore original state
  panel.classList.remove("is-detached-window");
  const originalStyle = container.dataset.originalStyle || "";
  panel.setAttribute("style", originalStyle);
  // Re-insert panel before the container and incinerate the container
  container.parentNode.insertBefore(panel, container);
  container.remove();
  // Note: MutationObserver in enableWindow will trigger cleanup automatically
}

export function closeAll() {
  document.querySelectorAll(".is-floating").forEach(win => win.remove());
}

window.addEventListener("resize", () => {
  document.querySelectorAll(".sb-window-container").forEach(win => {
    clampToViewport(win, win.classList.contains('is-panel'));
  });
});

/* ========================================================
   Migrated SPM (SilverBullet Panel Manager) JS portion
   This was previously injected by Lua. Now it's here.
   Call initPanelControls(...) from Lua with config + saved values.
   ======================================================== */

function _makeSPM(configOverrides = {}) {
  // Provide defaults and allow overrides
  const defaults = {
    config: {
      mode: "auto",
      gestures: true,
      constraints: { minW: 300, maxW: 1000, minH: 100, maxH: 500 },
    //  positions: { lhs: "50%", rhs: "50%", bhs: "50%" },
      prefixes: { handle: "sb-drag-handle-", controls: "sb-panel-controls-" }
    },
    state: { currentMode: "dock", isDragging: false, swipe: { startX: 0, startY: 0, lastAction: 0 }, resizeTimer: null },
    ui: {},
    layout: {},
    events: {}
  };

  // merge shallow
  const SPM = Object.assign({}, defaults);
  SPM.config = Object.assign(defaults.config, configOverrides.config || {});
  if (typeof configOverrides.gestures === "boolean") SPM.config.gestures = configOverrides.gestures;
  if (configOverrides.constraints) SPM.config.constraints = Object.assign(SPM.config.constraints, configOverrides.constraints);
 // if (configOverrides.positions) SPM.config.positions = Object.assign(SPM.config.positions, configOverrides.positions);
  if (configOverrides.savedLHS) SPM.savedLHS = String(configOverrides.savedLHS);
  if (configOverrides.savedRHS) SPM.savedRHS = String(configOverrides.savedRHS);
  if (configOverrides.savedBHS) SPM.savedBHS = String(configOverrides.savedBHS);

  // UI helpers
  SPM.ui.createControl = (id, className) => {
    const div = document.createElement("div");
    if (id) div.id = id;
    if (className) div.className = className;
    return div;
  };
  SPM.ui.updateIcon = (toggle, type, isOpen) => {
  if (!toggle) return;
  const map = {
    "LHS": isOpen ? "❮" : "❯",
    "RHS": isOpen ? "❯" : "❮",
    "BHS": isOpen ? "∨" : "∧"
  };
  toggle.innerHTML = map[type] || "?";
};

  SPM.ui.injectResizeHandle = (el, type) => {
    const id = SPM.config.prefixes.handle + type;
    if (document.getElementById(id)) return;
    const handle = SPM.ui.createControl(id, "sb-drag-handle");
    const line = SPM.ui.createControl("", "sb-drag-line");
    handle.appendChild(line);
    el.appendChild(handle);
    SPM.events.attachDrag(handle, el, type, line);
  };

  SPM.ui.injectControls = (el, type) => {
    const id = SPM.config.prefixes.controls + type;
    if (document.getElementById(id)) return;
    const container = SPM.ui.createControl(id, "sb-panel-controls-container");
/*
    // 🔑 APPLY POSITION HERE
      if (type === "LHS" && SPM.config.positions.lhs) {
        container.style.top = SPM.config.positions.lhs;
      }

      if (type === "RHS" && SPM.config.positions.rhs) {
        container.style.top = SPM.config.positions.rhs;
      }

      if (type === "BHS" && SPM.config.positions.bhs) {
        container.style.left = SPM.config.positions.bhs;
      }
*/
    const btnClass = "sb-panel-control-base";
    // Toggle Button
    const toggleBtn = SPM.ui.createControl("", btnClass + " sb-drawer-toggle");
    toggleBtn.title = "Collapse/Expand";
    toggleBtn.onclick = (e) => { e.stopPropagation(); SPM.layout.togglePanel(el, type); };
    // Close Button
    const closeBtn = SPM.ui.createControl("", btnClass);

    closeBtn.addEventListener("pointerdown", e => { e.stopPropagation();});


    closeBtn.innerHTML = "✕";
    closeBtn.title = "Close Panel";


    closeBtn.onclick = (e) => {
      e.stopPropagation();

      const panel = el; // el is the .sb-panel

      // 🧠 Synthetic panel? Kill it locally.
      if (panel.dataset.synthetic === "true") {
        panel.remove();
        return;
      }

      // 🧾 Native panel? Delegate to Lua
      window.dispatchEvent(
        new CustomEvent("sb-close-panel", {
          detail: { type: type.toLowerCase() }
        })
      );
    };


    /*
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      window.dispatchEvent(new CustomEvent("sb-close-panel", { detail: { type: type.toLowerCase() } }));
    };
    */

    // Full Screen Button
    const maxBtn = SPM.ui.createControl("", btnClass);
    maxBtn.innerHTML = "⛶";
    maxBtn.title = "Toggle Full Size";
    maxBtn.onclick = (e) => { e.stopPropagation(); SPM.layout.toggleFullSize(el, type); };
    // Window Mode Button
    const winBtn = SPM.ui.createControl("", btnClass);
    winBtn.innerHTML = "⧉";
    winBtn.title = "Window Mode";
    winBtn.onclick = (e) => {
      e.stopPropagation();
      el.classList.remove("is-collapsed", "is-expanded", "is-full");
      window.dispatchEvent(new CustomEvent("sb-window-mode", { detail: { type: type.toLowerCase() } }));
    };
    container.appendChild(closeBtn);
    container.appendChild(maxBtn);
    container.appendChild(winBtn);
    container.appendChild(toggleBtn);
    el.appendChild(container);
    //SPM.ui.updateIcon(toggleBtn, type, el.classList.contains("is-expanded"));
    SPM.ui.syncChevron(el, type); // SYNC CHEVRON

  };

  SPM.layout.getPanels = () => {
    const main = document.querySelector("#sb-main");
    if (!main) return [];
    const layouts = [];
    const sidePanels = main.querySelectorAll(":scope > .sb-panel");
    const bottomPanel = document.querySelector("#sb-root > .sb-bhs");
    const editor = document.querySelector("#sb-editor");
    sidePanels.forEach(panel => {
      if (panel.classList.contains("is-detached-window")) return;
      const isLHS = panel.nextElementSibling === editor || (panel.nextElementSibling && panel.nextElementSibling.contains(editor));
      const type = isLHS ? "LHS" : "RHS";
      if (!panel.classList.contains(type.toLowerCase())) panel.classList.add(type.toLowerCase());
      layouts.push({ el: panel, type: type });
    });
    if (bottomPanel && !bottomPanel.classList.contains("is-detached-window")) {
      if (!bottomPanel.classList.contains("bhs")) bottomPanel.classList.add("bhs");
      layouts.push({ el: bottomPanel, type: "BHS" });
    }
    return layouts;
  };

  SPM.layout.togglePanel = (el, type, forceState) => {
    const current = el.classList.contains("is-expanded");
    const newState = forceState !== undefined ? forceState : !current;
    if (current === newState && !el.classList.contains("is-full")) return false;
    el.classList.remove("is-full", "is-collapsed", "is-expanded");
    if (newState) { el.classList.add("is-expanded"); } else { el.classList.add("is-collapsed"); }
    const container = document.getElementById(SPM.config.prefixes.controls + type);
    const toggleBtn = container ? container.querySelector(".sb-drawer-toggle") : null;
    const maxBtn = container ? container.querySelector(".sb-panel-control-base:nth-child(2)") : null;
//    SPM.ui.updateIcon(toggleBtn, type, newState);
    if (maxBtn) maxBtn.innerHTML = "⛶";
    SPM.ui.syncChevron(el, type); // SYNC CHEVRON
    return true;
  };

  SPM.layout.toggleFullSize = (el, type, forceState) => {
    const currentIsFull = el.classList.contains("is-full");
    const newState = forceState !== undefined ? forceState : !currentIsFull;
    if (currentIsFull === newState) return false;
    const container = document.getElementById(SPM.config.prefixes.controls + type);
    const maxBtn = container ? container.querySelector(".sb-panel-control-base:nth-child(2)") : null;
    el.classList.remove("is-collapsed", "is-expanded", "is-full");
    if (newState) {
      SPM.layout.getPanels().forEach(p => {
        if (p.type !== type && p.el.classList.contains("is-full")) {
          SPM.layout.toggleFullSize(p.el, p.type, false);
        }
      });
      el.classList.add("is-full");
      if (maxBtn) maxBtn.innerHTML = "❐";
    } else {
      el.classList.add("is-expanded");
      if (maxBtn) maxBtn.innerHTML = "⛶";
      setTimeout(() => SPM.layout.refresh(), 500);
    }
    SPM.ui.syncChevron(el, type); // SYNC CHEVRON
    return true;
  };


  SPM.ui.syncChevron = (el, type) => {
  const controls = document.getElementById(SPM.config.prefixes.controls + type);
  if (!controls) return;

  const toggleBtn = controls.querySelector(".sb-drawer-toggle");
  if (!toggleBtn) return;

  const isExpanded =
    el.classList.contains("is-expanded") ||
    el.classList.contains("is-full");

  SPM.ui.updateIcon(toggleBtn, type, isExpanded);
};


  SPM.layout.refresh = () => {
    const layouts = SPM.layout.getPanels();
    const width = window.innerWidth;
    const useOverlay = (SPM.config.mode === "overlay") || (SPM.config.mode === "auto" && width < 800);
    SPM.state.currentMode = useOverlay ? "overlay" : "dock";
    layouts.forEach(layout => {
      if (!layout.el.classList.contains("is-full") && !layout.el.classList.contains("is-detached-window")) {
        SPM.layout.setupPanel(layout.el, layout.type, useOverlay);
      }
    });
  };

  SPM.layout.setupPanel = (el, type, useOverlay) => {
    if (!el.style.getPropertyValue("--sb-panel-width")) {
      const def = (type === "LHS" ? (SPM.savedLHS || "300") : (SPM.savedRHS || "300"));
      el.style.setProperty("--sb-panel-width", def + "px");
    }
    if (!el.style.getPropertyValue("--sb-panel-height")) {
      el.style.setProperty("--sb-panel-height", (SPM.savedBHS || "200") + "px");
    }
    if (!el.classList.contains("is-collapsed") && !el.classList.contains("is-expanded") && !el.classList.contains("is-full")) {
      el.classList.add("is-expanded");
    }
    SPM.ui.injectControls(el, type);
    SPM.ui.injectResizeHandle(el, type);
    if (useOverlay) {
      el.style.position = "fixed";
      el.style.zIndex = "100";
      el.style.flex = "none";
      if (type === "BHS") {
        el.style.bottom = "0";
        el.style.left = "0";
        el.style.right = "0";
        el.style.height = "var(--sb-panel-height)";
        el.style.width = "100%";
      } else {
        el.style.top = "56px";
        el.style.bottom = "0";
        el.style.width = "var(--sb-panel-width)";
        el.style.left = type === "LHS" ? "0" : "auto";
        el.style.right = type === "RHS" ? "0" : "auto";
      }
    } else {
      el.style.position = "relative";
      el.style.zIndex = "90";
      el.style.top = "";
      el.style.bottom = "";
      el.style.left = "";
      el.style.right = "";
      if (type === "BHS") {
        el.style.height = "var(--sb-panel-height)";
        el.style.width = "100%";
        el.style.flex = "0 0 auto";
      } else {
        el.style.width = "var(--sb-panel-width)";
        el.style.maxWidth = "100vw";
        el.style.flex = "0 0 auto";
      }
    }
  };

  SPM.events.attachDrag = (handle, el, type, line) => {
    const startDragging = (e) => {
      if (el.classList.contains("is-collapsed") || el.classList.contains("is-full") || el.classList.contains("is-detached-window")) return;
      const isTouch = e.type === 'touchstart';
      if (e.cancelable) e.preventDefault();
      SPM.state.isDragging = true;
      el.style.setProperty("transition", "none", "important");
      handle.dataset.dragging = "true";
      document.querySelectorAll('iframe').forEach(ifrm => ifrm.style.pointerEvents = 'none');
      const onMove = (me) => {
        const touch = me.touches ? me.touches[0] : me;
        let val;
        if (type === "LHS") val = touch.clientX;
        else if (type === "RHS") val = window.innerWidth - touch.clientX;
        else if (type === "BHS") val = window.innerHeight - touch.clientY;
        const c = SPM.config.constraints;
        if (type !== "BHS" && (val < c.minW || val > c.maxW)) return;
        if (type === "BHS" && (val < c.minH || val > c.maxH)) return;
        el.style.setProperty(type === "BHS" ? "--sb-panel-height" : "--sb-panel-width", val + "px");
      };
      const onUp = () => {
        SPM.state.isDragging = false;
        el.style.removeProperty("transition");
        handle.dataset.dragging = "";
        document.querySelectorAll('iframe').forEach(ifrm => ifrm.style.pointerEvents = 'auto');
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onUp);
        const prop = type === "BHS" ? "--sb-panel-height" : "--sb-panel-width";
        const dimValue = el.style.getPropertyValue(prop);
        if (dimValue) {
          const dim = parseInt(dimValue);
          window.dispatchEvent(new CustomEvent("sb-save-" + type.toLowerCase(), { detail: { value: dim } }));
        }
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

SPM.events.initSwipe = () => {
  if (!SPM.config.gestures) return;

  const MIN_DISTANCE = 70;
  const MAX_DURATION = 300;
  const MIN_VELOCITY = 0.6;
  const DIRECTION_RATIO = 1.5;

  const handleStart = (e) => {
    if (SPM.state.isDragging) return;
    const t = e.changedTouches[0];
    // Ensure the swipe object exists to avoid undefined errors
    if (!SPM.state.swipe) SPM.state.swipe = {};
    
    SPM.state.swipe.startX = t.screenX;
    SPM.state.swipe.startY = t.screenY;
    SPM.state.swipe.startTime = Date.now();
  };

  const handleEnd = (e) => {
    if (SPM.state.isDragging || !SPM.state.swipe) return;

    const now = Date.now();
    if (now - (SPM.state.swipe.lastAction || 0) < 500) return;

    const t = e.changedTouches[0];
    // Fixed: Correctly referencing the nested swipe object
    const dx = t.screenX - SPM.state.swipe.startX;
    const dy = t.screenY - SPM.state.swipe.startY;
    const duration = now - SPM.state.swipe.startTime;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (duration > MAX_DURATION || Math.max(absX, absY) < MIN_DISTANCE) return;

    const velocityX = absX / duration;
    const velocityY = absY / duration;

    let acted = false;
    const layouts = SPM.layout.getPanels();
    const lhs = layouts.find(l => l.type === "LHS");
    const rhs = layouts.find(l => l.type === "RHS");
    const bhs = layouts.find(l => l.type === "BHS");

    // Horizontal logic
    if (absX > absY * DIRECTION_RATIO && velocityX >= MIN_VELOCITY) {
      const dir = dx > 0 ? "right" : "left";
      
      const state = {
        LHS: {
          full: lhs?.el.classList.contains("is-full"),
          open: lhs?.el.classList.contains("is-expanded") && !lhs?.el.classList.contains("is-full")
        },
        RHS: {
          full: rhs?.el.classList.contains("is-full"),
          open: rhs?.el.classList.contains("is-expanded") && !rhs?.el.classList.contains("is-full")
        }
      };

      const actions = dir === "left" ? [
        { cond: state.LHS.full, run: () => SPM.layout.toggleFullSize(lhs.el, "LHS", false) },
        { cond: state.LHS.open, run: () => SPM.layout.togglePanel(lhs.el, "LHS", false) },
        { cond: !state.RHS.open, run: () => SPM.layout.togglePanel(rhs.el, "RHS", true) },
        { cond: !state.RHS.full, run: () => SPM.layout.toggleFullSize(rhs.el, "RHS", true) }
      ] : [
        { cond: state.RHS.full, run: () => SPM.layout.toggleFullSize(rhs.el, "RHS", false) },
        { cond: state.RHS.open, run: () => SPM.layout.togglePanel(rhs.el, "RHS", false) },
        { cond: !state.LHS.open, run: () => SPM.layout.togglePanel(lhs.el, "LHS", true) },
        { cond: !state.LHS.full, run: () => SPM.layout.toggleFullSize(lhs.el, "LHS", true) }
      ];

      const action = actions.find(a => a.cond);
      if (action) acted = action.run();

    // Vertical logic
    } else if (absY > absX * DIRECTION_RATIO && velocityY >= MIN_VELOCITY && bhs) {
      const bOpen = bhs.el.classList.contains("is-expanded") && !bhs.el.classList.contains("is-full");
      const bFull = bhs.el.classList.contains("is-full");

      if (dy < 0) {
        if (!bOpen) acted = SPM.layout.togglePanel(bhs.el, "BHS", true);
        else if (!bFull) acted = SPM.layout.toggleFullSize(bhs.el, "BHS", true);
      } else {
        if (bFull) acted = SPM.layout.toggleFullSize(bhs.el, "BHS", false);
        else if (bOpen) acted = SPM.layout.togglePanel(bhs.el, "BHS", false);
      }
    }

    if (acted) SPM.state.swipe.lastAction = now;
  };

  const main = document.querySelector("#sb-main");
  if (main && main.getAttribute("data-swipe-init") !== "true") {
    main.setAttribute("data-swipe-init", "true");
    main.addEventListener("touchstart", handleStart, { passive: true });
    main.addEventListener("touchend", handleEnd, { passive: true });
  }

  // Handle iframes
  document.querySelectorAll(".sb-panel iframe").forEach(iframe => {
    const attach = () => {
      try {
        const iDoc = iframe.contentDocument || iframe.contentWindow.document;
        iDoc.removeEventListener("touchstart", handleStart);
        iDoc.removeEventListener("touchend", handleEnd);
        iDoc.addEventListener("touchstart", handleStart, { passive: true });
        iDoc.addEventListener("touchend", handleEnd, { passive: true });
      } catch (e) {}
    };
    attach();
    iframe.addEventListener("load", attach);
  });
};




  SPM.init = () => {
    const observer = new MutationObserver(() => {
      SPM.layout.refresh();
      SPM.events.initSwipe();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", () => {
      clearTimeout(SPM.state.resizeTimer);
      SPM.state.resizeTimer = setTimeout(SPM.layout.refresh, 50);
    });
    setTimeout(() => {
      SPM.layout.refresh();
      SPM.events.initSwipe();
    }, 100);
    window.SilverBulletPanelManager = SPM;
  };

  return SPM;
}

/**
 * initPanelControls(options)
 * options = {
 *   panelMode: "auto"|"overlay"|"dock",
 *   gestures: true|false,
 *   constraints: { minW, maxW, minH, maxH },
 * //  positions: { lhs, rhs, bhs },
 *   savedLHS: "300",
 *   savedRHS: "300",
 *   savedBHS: "200"
 * }
 *
 * Call this from your Lua script via js.import(...).initPanelControls({...})
 */
export function initPanelControls(options = {}) {

  const configOverrides = {
    config: {
      mode: options.panelMode || (options.mode || "auto"),
      gestures: (typeof options.gestures === "boolean") ? options.gestures : (options.gesturesEnabled !== undefined ? options.gesturesEnabled : true),
      constraints: options.constraints || (options.constraints || null),
    //  positions: options.positions || (options.positions || null),
      prefixes: { handle: "sb-drag-handle-", controls: "sb-panel-controls-" }
    },
    savedLHS: options.savedLHS,
    savedRHS: options.savedRHS,
    savedBHS: options.savedBHS
  };
  const SPM = _makeSPM(configOverrides);
  SPM.init();

  // Keep the SPM object in sync with clientStore saves
  window.addEventListener("sb-save-lhs", (e) => {
    if (window.SilverBulletPanelManager) window.SilverBulletPanelManager.savedLHS = String(e.detail.value);
  });
  window.addEventListener("sb-save-rhs", (e) => {
    if (window.SilverBulletPanelManager) window.SilverBulletPanelManager.savedRHS = String(e.detail.value);
  });
  window.addEventListener("sb-save-bhs", (e) => {
    if (window.SilverBulletPanelManager) window.SilverBulletPanelManager.savedBHS = String(e.detail.value);
  });

  // Wire the previously-used 'sb-window-mode' event to call enableWindow (this was handled in Lua before).
  window.addEventListener("sb-window-mode", function(e) {
    try {
      const type = (e && e.detail && e.detail.type) ? e.detail.type : null;
      if (!type) return;
      let selector = "#sb-main .sb-panel." + type;
      if (type === "bhs") selector = "#sb-root > .sb-bhs";
      // call enableWindow from this same module
      enableWindow(selector);
    } catch (err) {
      console.error("sb-window-mode handler failed", err);
    }
  });

  return SPM;
}

// End of UnifiedFloating.js