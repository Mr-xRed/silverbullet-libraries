export function enableDrag(panelSelector = "#sb-main .sb-panel") {
  const panel = document.querySelector(panelSelector);
  if (!panel || panel.parentElement.classList.contains('sb-panel-container')) return;

  const originalInlineStyles = panel.getAttribute("style") || "";

  if (!document.getElementById("sb-global-drag-styles")) {
    const style = document.createElement("style");
    style.id = "sb-global-drag-styles";
    style.textContent = `
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
          rgba(255, 255, 255, 0.4) 0px,
          rgba(255, 255, 255, 0.4) 2px,
          transparent 2px,
          transparent 5px
        ) !important;
        opacity: 0.6 !important;
      }

      .sb-resize-handle {
        position: absolute !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 25px !important;
        height: 25px !important;
        cursor: nwse-resize !important;
        z-index: 10001 !important;
        background: linear-gradient(135deg, transparent 50%, rgba(128,128,128,0.1) 50%) !important;
        border-bottom-right-radius: var(--window-border-radius) !important;
      }
      
      .sb-resize-handle:hover {
        background: linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.3) 50%) !important;
        border-bottom-right-radius: var(--window-border-radius) !important;
      }

      #sb-main .sb-panel.is-drag-active {
        flex: 1 1 0% !important;
        position: relative !important;
        top: 0 !important;
        left: 0 !important;
        margin: 0 !important;
        margin-top: 5px !important;
        width: 100% !important;
        height: 100% !important; 
        overflow: hidden !important;
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
  const resizer = document.createElement("div");
  resizer.className = "sb-resize-handle";

  panel.parentNode.insertBefore(container, panel);
  container.appendChild(header);
  container.appendChild(panel);
  container.appendChild(resizer);
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

  let isDragging = false, isResizing = false;
  let startX, startY, startW, startH, offsetX, offsetY;
  const setIframesPointer = (val) => 
    container.querySelectorAll("iframe").forEach(f => f.style.pointerEvents = val);

  // --- NEW BOUNDS & SNAPPING HELPER ---
  const applyBounds = (x, y, w, h) => {
    const minW = 255;
    const minH = 260;
    const snapThreshold = 15;
    
    // Constrain size
    const finalW = Math.max(minW, w);
    const finalH = Math.max(minH, h);

    // Calculate available movement area
    const maxX = window.innerWidth - finalW;
    const maxY = window.innerHeight - finalH;

    let finalX = Math.max(0, Math.min(x, maxX));
    let finalY = Math.max(0, Math.min(y, maxY));

    // Snapping logic
    if (finalX < snapThreshold) finalX = 0;
    if (maxX - finalX < snapThreshold) finalX = maxX;
    if (finalY < snapThreshold) finalY = 0;
    if (maxY - finalY < snapThreshold) finalY = maxY;

    return { x: finalX, y: finalY, w: finalW, h: finalH };
  };

  header.addEventListener("pointerdown", (e) => {
    isDragging = true;
    const rect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    setIframesPointer("none");
    header.setPointerCapture(e.pointerId);
    document.body.style.userSelect = "none";
  });

  resizer.addEventListener("pointerdown", (e) => {
    isResizing = true;
    startX = e.clientX; startY = e.clientY;
    startW = container.offsetWidth; startH = container.offsetHeight;
    setIframesPointer("none");
    resizer.setPointerCapture(e.pointerId);
    e.stopPropagation();
    document.body.style.userSelect = "none";
  });

  // --- UPDATED POINTERMOVE WITH SNAPPING ---
  window.addEventListener("pointermove", (e) => {
    if (isDragging) {
      const coords = applyBounds(
        e.clientX - offsetX, 
        e.clientY - offsetY, 
        container.offsetWidth, 
        container.offsetHeight
      );
      container.style.left = `${coords.x}px`;
      container.style.top = `${coords.y}px`;
    } else if (isResizing) {
      const coords = applyBounds(
        container.offsetLeft, 
        container.offsetTop, 
        startW + (e.clientX - startX), 
        startH + (e.clientY - startY)
      );
      container.style.width = `${coords.w}px`;
      container.style.height = `${coords.h}px`;
    }
  });

  // Keep window in view during browser resize
  window.addEventListener("resize", () => {
    const coords = applyBounds(
      container.offsetLeft, 
      container.offsetTop, 
      container.offsetWidth, 
      container.offsetHeight
    );
    container.style.left = `${coords.x}px`;
    container.style.top = `${coords.y}px`;
  });

  const stopAction = () => {
    if (!isDragging && !isResizing) return;
    isDragging = false; isResizing = false;
    setIframesPointer("auto");
    document.body.style.userSelect = "";
    localStorage.setItem("sb_dims_v1", JSON.stringify({
      x: container.offsetLeft, y: container.offsetTop,
      w: container.offsetWidth, h: container.offsetHeight
    }));
  };

  window.addEventListener("pointerup", stopAction);
  window.addEventListener("pointercancel", stopAction);

  const saved = JSON.parse(localStorage.getItem("sb_dims_v1") || "null");
  if (saved) {
    const coords = applyBounds(saved.x, saved.y, saved.w, saved.h);
    container.style.left = `${coords.x}px`;
    container.style.top = `${coords.y}px`;
    container.style.width = `${coords.w}px`;
    container.style.height = `${coords.h}px`;
  }
}