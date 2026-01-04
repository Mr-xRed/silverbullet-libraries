/**
 * Unified Window Manager
 * Foundation: Second script's drag/resize/fail-safe logic.
 * Extensions: Viewport clamping, Absolute Z-Index Focus, min-dimensions, and content handling.
 */

let highestZ = 100;
const SNAP_THRESHOLD = 15;
const TOP_OFFSET = 55;

function injectStyles() {
    if (document.getElementById("sb-unified-drag-styles")) return;
    const style = document.createElement("style");
    style.id = "sb-unified-drag-styles";
    style.textContent = `
      :root {
        --header-height: 20px;
        --frame-width: 5px;
        --frame-opacity: 10%;
        --window-border: 2px;
        --window-border-radius: 10px;
      } 

      #sb-main .sb-panel:last-child {border-left: none;}

      html[data-theme="dark"]{
        --explorer-border-color: oklch(from var(--explorer-accent-color) calc(l - 0.5) c h / 0.1);
        --explorer-accent-color: oklch(0.75 0.25 230);
      }

      html[data-theme="light"]{
        --explorer-border-color: oklch(from var(--explorer-accent-color) calc(l - 0.5) c h / 0.1);
        --explorer-accent-color: oklch(0.80 0.18 230);
      }

      .sb-window-container {
        position: fixed !important;
        z-index: 9999 !important; 
        display: flex !important;
        flex-direction: column !important;
        box-sizing: border-box !important;
        background:  oklch(from var(--explorer-accent-color) l 0.02 h / var(--frame-opacity));
        border: var(--window-border) solid var(--explorer-border-color) ;
        backdrop-filter: blur(10px);
        box-shadow: 0px 0px 20px #00000090;
        border-radius: calc(var(--window-border-radius) + var(--frame-width));
        padding: var(--frame-width);
        touch-action: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .sb-window-container.is-focused {
        background:  oklch(from var(--explorer-accent-color) l c h / var(--frame-opacity));
        border-color: var(--explorer-border-color) !important;
        box-shadow: 0px 0px 20px #000000b0;
      }

      .sb-window-header {
        height: var(--header-height) !important;
        width: 100% !important;
        cursor: grab !important;
        border-radius: 8px !important;
        flex-shrink: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: background 0.2s ease;
        position: relative;
      }

      .is-panel .sb-window-header::after {
        content: "" !important;
        width: 60px !important;
        height: 12px !important;
        background: repeating-linear-gradient(
          to bottom,
          #808080cc 0px,
          #808080cc 2px,
          transparent 2px,
          transparent 5px
        ) !important;
        opacity: 0.6 !important;
      }

      .sb-window-title {
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        max-width: 100%; padding: 0 40px; text-align: center; font-weight: 700;
        font-size: 0.85em; text-transform: uppercase; z-index: 1;
        pointer-events: none; color: var(--root-color);
      }

      .sb-window-close-btn {
        position: absolute; top: -2px; right: 0px; width: 22px; height: 22px;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; border-radius: 6px; font-size: 14px;
        color: var(--root-color);
        background: oklch(from var(--explorer-accent-color) l 0.02 h / 0.1);;
        transition: all 0.2s; z-index: 10002;
      }

      .sb-window-container.is-focused .sb-window-close-btn {
        background: oklch(from var(--explorer-accent-color) l c h / 0.5);;
      }

      .sb-window-container.is-focused .sb-window-close-btn:hover , .sb-window-close-btn:hover { background: oklch(0.65 0.2 30); color: white; }

      .sb-window-content {
        flex: 1 1 0% !important;
        position: relative !important;
        margin-top: 4px !important;
        width: 100% !important;
        height: 100% !important; 
        overflow: clip !important;
        box-sizing: border-box !important;
        border: var(--window-border) solid var(--explorer-border-color) !important;
        border-radius: var(--window-border-radius) !important;
        background: var(--root-background-color, transparent) !important;
      }
      
      .sb-window-iframe { width: 100%; height: 100%; border: none; display: block; }

      .sb-resizer { position: absolute; z-index: 10001; }
      .resizer-t { top: 0; left: 20px; right: 20px; height: 8px; cursor: ns-resize; }
      .resizer-b { bottom: 0; left: 20px; right: 20px; height: 8px; cursor: ns-resize; }
      .resizer-l { left: 0; top: 20px; bottom: 20px; width: 8px; cursor: ew-resize; }
      .resizer-r { right: 0; top: 20px; bottom: 20px; width: 8px; cursor: ew-resize; }
      .resizer-tl { top: 0; left: 0; width: 22px; height: 22px; cursor: nwse-resize; }
      .resizer-tr { top: 0; right: 0; width: 22px; height: 22px; cursor: nesw-resize; }
      .resizer-bl { bottom: 0; left: 0; width: 22px; height: 22px; cursor: nesw-resize; }
      .resizer-br { bottom: 0; right: 0; width: 22px; height: 22px; cursor: nwse-resize; }
    `;
    (document.head || document.documentElement).appendChild(style);
}

function focusWindow(win) {
    document.querySelectorAll(".sb-window-container").forEach(c => c.classList.remove("is-focused"));
    highestZ += 1;
    win.style.setProperty("z-index", highestZ.toString(), "important");
    win.classList.add("is-focused");
}

function clampToViewport(win, isPanel = false) {
    const rect = win.getBoundingClientRect();
    const minTop = isPanel ? TOP_OFFSET : TOP_OFFSET;
    const minW = isPanel ? 320 : 260;
    const minH = isPanel ? 310 : 260;

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

  const setIframesPointer = (val) => 
    container.querySelectorAll("iframe").forEach(f => f.style.pointerEvents = val);

  const handleDown = (e) => {
    const resizer = e.target.closest('.sb-resizer');
    const isHeader = e.target.closest('.sb-window-header');
    if (e.target.closest('.sb-window-close-btn')) return;
    
    focusWindow(container);

    if (resizer || isHeader) {
      activeAction = resizer ? resizer.dataset.direction : 'drag';
      startX = e.clientX; startY = e.clientY;
      startW = container.offsetWidth; startH = container.offsetHeight;
      startL = container.offsetLeft; startT = container.offsetTop;
      
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
    localStorage.setItem(storageKey, JSON.stringify({
      x: container.offsetLeft, y: container.offsetTop,
      w: container.offsetWidth, h: container.offsetHeight
    }));
  };

  window.addEventListener("pointerup", stopAction);
  window.addEventListener("pointercancel", stopAction);
}

export function show(content, titleLabel = null) {
  injectStyles();
  const isUrl = content.startsWith("http://") || content.startsWith("https://");
  const isHtml = content.trim().startsWith("<") && content.trim().endsWith(">");
  const storageKey = isHtml ? "sb_dim_mode_html" : (isUrl ? "sb_dim_mode_url" : "sb_dim_mode_page");
  const sanitizedId = "sb-float-" + (titleLabel || content).replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);

  let container = document.getElementById(sanitizedId);
  if (container) { focusWindow(container); return; }

  container = document.createElement("div");
  container.id = sanitizedId;
  container.className = "sb-window-container is-floating";
  const header = document.createElement("div");
  header.className = "sb-window-header";
  const title = document.createElement("div");
  title.className = "sb-window-title";
  title.innerText = titleLabel || (isUrl ? "Web" : (isHtml ? "HTML" : content));
  const closeBtn = document.createElement("div");
  closeBtn.className = "sb-window-close-btn";
  closeBtn.innerHTML = "✕";
  closeBtn.onclick = (e) => { e.stopPropagation(); container.remove(); };

  header.appendChild(title);
  header.appendChild(closeBtn);
  const contentArea = document.createElement("div");
  contentArea.className = "sb-window-content";
  const iframe = document.createElement("iframe");
  iframe.className = "sb-window-iframe";

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
  focusWindow(container);
}

export function enableDrag(panelSelector = "#sb-main .sb-panel") {
  injectStyles();
  const panel = document.querySelector(panelSelector);
  if (!panel || panel.parentElement.classList.contains('sb-window-container')) return;

  const originalInlineStyles = panel.getAttribute("style") || "";
  const storageKey = "sb_dims_v1";
  const container = document.createElement("div");
  container.className = "sb-window-container is-panel";
  const header = document.createElement("div");
  header.className = "sb-window-header"; 

  ['t', 'b', 'l', 'r', 'tl', 'tr', 'bl', 'br'].forEach(dir => {
    const handle = document.createElement("div");
    handle.className = `sb-resizer resizer-${dir}`;
    handle.dataset.direction = dir;
    container.appendChild(handle);
  });

  panel.parentNode.insertBefore(container, panel);
  container.appendChild(header);
  container.appendChild(panel);
  panel.style.cssText = `flex: 1 1 0% !important; position: relative !important; top: 0 !important; left: 0 !important; margin: 0 !important; margin-top: 4px !important; width: 100% !important; height: 100% !important; overflow: clip !important; box-sizing: border-box !important; border: var(--window-border) solid var(--explorer-border-color) !important; border-radius: var(--window-border-radius) !important; background: transparent !important;`;

  setupEvents(container, header, storageKey, true);

  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
  if (saved) {
    container.style.left = `${saved.x}px`;
    container.style.top = `${saved.y}px`;
    container.style.width = `${saved.w}px`;
    container.style.height = `${saved.h}px`;
    clampToViewport(container, true);
  }

  const observer = new MutationObserver(() => {
    if (!document.body.contains(panel)) {
      panel.setAttribute("style", originalInlineStyles);
      container.remove();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  focusWindow(container);
}

export function closeAll() {
  document.querySelectorAll(".is-floating").forEach(win => win.remove());
}

window.addEventListener("resize", () => {
  document.querySelectorAll(".sb-window-container").forEach(win => {
    clampToViewport(win, win.classList.contains('is-panel'));
  });
});

window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "fastnav_nav") {
    if (typeof syscall === "function") syscall("editor.navigate", event.data.path, false, false);
  }
});