export function enableDrag(panelSelector = "#sb-main .sb-panel") {
  const panel = document.querySelector(panelSelector);
  if (!panel || panel.parentElement.classList.contains('sb-panel-container')) return;

  const originalInlineStyles = panel.getAttribute("style") || "";
  const SNAP_THRESHOLD = 15;

  if (!document.getElementById("sb-global-drag-styles")) {
    const style = document.createElement("style");
    style.id = "sb-global-drag-styles";
    style.textContent = `
      :root{
        --header-height: 20px;
        --frame-width: 5px;
        --frame-color: oklch(0.4 0 0 / 0.2);
        --window-border: 2px;
        --window-border-radius: 10px;
        --window-border-color: oklch(0.65 0 0 / 0.2);
      } 

      .sb-panel iframe {
      background-color: transparent !important;
      width: calc(100% + 2px);
      height: calc(100% + 2px);
      margin: -1px;
      }

      #sb-top .panel, 
      body #sb-top .panel { 
        position: fixed !important; 
        z-index: 10000 !important;
      }
      html, body {
        background: transparent !important;
        background-color: transparent !important;
      } 

      .sb-panel-container {
        position: fixed !important;
        z-index: 9999 !important;
        display: flex !important;
        flex-direction: column !important;
        box-sizing: border-box !important;
        background: var(--frame-color);
        border: var(--window-border) solid var(--window-border-color);
        backdrop-filter: blur(10px);
        box-shadow: 0px 0px 20px #0008;
        border-radius: calc(var(--window-border-radius) + var(--frame-width));
        padding: var(--frame-width);
        width: var(--sb-panel-width);
        height: var(--sb-panel-height);
        top: var(--top-offset);
        left: var(--left-offset);
        touch-action: none;
      }

       .sb-panel-header {
        height: var(--header-height) !important;
        width: 100% !important;
        cursor: grab !important;
        border-radius: 8px !important;
        flex-shrink: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: background 0.2s ease;
      }

      .sb-panel-header:hover { background: rgba(255, 255, 255, 0.2) !important; }

      .sb-panel-header::after {
        content: "" !important;
        width: 60px !important;
        height: 12px !important;
        background: repeating-linear-gradient(
          to bottom,
          rgba(128, 128, 128, 0.8) 0px,
          rgba(128, 128, 128, 0.8) 2px,
          transparent 2px,
          transparent 5px
        ) !important;
        opacity: 0.6 !important;
      }

      .sb-resizer { position: absolute; z-index: 10001; }
      .resizer-t { top: 0; left: 22px; right: 22px; height: 10px; cursor: ns-resize; }
      .resizer-b { bottom: 0; left: 22px; right: 22px; height: 10px; cursor: ns-resize; }
      .resizer-l { left: 0; top: 22px; bottom: 22px; width: 10px; cursor: ew-resize; }
      .resizer-r { right: 0; top: 22px; bottom: 22px; width: 10px; cursor: ew-resize; }
      .resizer-tl { top: 0; left: 0; width: 24px; height: 24px; cursor: nwse-resize; }
      .resizer-tr { top: 0; right: 0; width: 24px; height: 24px; cursor: nesw-resize; }
      .resizer-bl { bottom: 0; left: 0; width: 24px; height: 24px; cursor: nesw-resize; }
      .resizer-br { bottom: 0; right: 0; width: 24px; height: 24px; cursor: nwse-resize; }
      
      #sb-main .sb-panel.is-drag-active {
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
        border: var(--window-border) solid var(--window-border-color) !important;
        border-radius: var(--window-border-radius) !important;
        background: transparent !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  const container = document.createElement("div");
  container.className = "sb-panel-container";
  const header = document.createElement("div");
  header.className = "sb-panel-header";

  ['t', 'b', 'l', 'r', 'tl', 'tr', 'bl', 'br'].forEach(dir => {
    const handle = document.createElement("div");
    handle.className = `sb-resizer resizer-${dir}`;
    handle.dataset.direction = dir;
    container.appendChild(handle);
  });

  panel.parentNode.insertBefore(container, panel);
  container.appendChild(header);
  container.appendChild(panel);
  panel.classList.add('is-drag-active');

  const observer = new MutationObserver(() => {
    if (!document.body.contains(panel)) {
      panel.classList.remove('is-drag-active');
      panel.setAttribute("style", originalInlineStyles);
      container.remove();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  let activeAction = null;
  let startX, startY, startW, startH, startL, startT;

  const setIframesPointer = (val) => 
    container.querySelectorAll("iframe").forEach(f => f.style.pointerEvents = val);

  const handleDown = (e) => {
    const resizer = e.target.closest('.sb-resizer');
    const isHeader = e.target.closest('.sb-panel-header');
    
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

  header.addEventListener("pointerdown", handleDown);
  container.querySelectorAll('.sb-resizer').forEach(r => r.addEventListener("pointerdown", handleDown));

  window.addEventListener("pointermove", (e) => {
    if (!activeAction) return;

    let newLeft = startL, newTop = startT, newWidth = startW, newHeight = startH;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (activeAction === 'drag') {
      newLeft = startL + dx;
      newTop = startT + dy;
      
      if (newLeft < SNAP_THRESHOLD) newLeft = 0;
      if (newTop < SNAP_THRESHOLD) newTop = 0;
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
      if (newTop < 0) { newHeight += newTop; newTop = 0; }
      if (newLeft + newWidth > window.innerWidth) newWidth = window.innerWidth - newLeft;
      if (newTop + newHeight > window.innerHeight) newHeight = window.innerHeight - newTop;

      if (newWidth > 320) { 
        container.style.width = `${newWidth}px`; 
        container.style.left = `${newLeft}px`; 
      }
      if (newHeight > 310) { 
        container.style.height = `${newHeight}px`; 
        container.style.top = `${newTop}px`; 
      }
    }
  });

  const stopAction = () => {
    if (!activeAction) return;
    activeAction = null;
    setIframesPointer("auto");
    document.body.style.userSelect = "";
    
    // Save as rounded integers
     localStorage.setItem("sb_dims_v1", JSON.stringify({
      x: container.offsetLeft, y: container.offsetTop,
      w: container.offsetWidth, h: container.offsetHeight
    }));
  };

  window.addEventListener("pointerup", stopAction);
  window.addEventListener("pointercancel", stopAction);

  const saved = JSON.parse(localStorage.getItem("sb_dims_v1") || "null");
  if (saved) {
    container.style.left = `${saved.x}px`;
    container.style.top = `${saved.y}px`;
    container.style.width = `${saved.w}px`;
    container.style.height = `${saved.h}px`;
  }
}