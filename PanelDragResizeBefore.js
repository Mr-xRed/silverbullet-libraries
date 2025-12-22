export function enableDrag(panelSelector = "#sb-main .sb-panel") {
  const panel = document.querySelector(panelSelector);
  if (!panel || panel.parentElement.classList.contains('sb-panel-container')) return;

  // 1. Capture Original Styles for Reset
  const originalInlineStyles = panel.getAttribute("style") || "";

  // 2. Global Style Injection (Targets the Main HTML Head)
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

      .sb-header {
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

      .sb-header:hover { background: rgba(255, 255, 255, 0.2) !important; }

      .sb-header::after {
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
        width: 15px !important;
        height: 15px !important;
        cursor: nwse-resize !important;
        z-index: 10001 !important;
        background: linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.1) 50%) !important;
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
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  // 3. Create Container Elements
  const container = document.createElement("div");
  container.className = "sb-panel-container";
  const header = document.createElement("div");
  header.className = "sb-header";
  const resizer = document.createElement("div");
  resizer.className = "sb-resize-handle";

  // 4. Wrap the Panel
  panel.parentNode.insertBefore(container, panel);
  container.appendChild(header);
  container.appendChild(panel);
  container.appendChild(resizer);
  panel.classList.add('is-drag-active');

  // 5. Cleanup Observer
  const observer = new MutationObserver(() => {
    if (!document.body.contains(panel)) {
      panel.classList.remove('is-drag-active');
      panel.setAttribute("style", originalInlineStyles);
      container.remove();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // 6. Movement & Resize Logic
  let isDragging = false, isResizing = false;
  let startX, startY, startW, startH, offsetX, offsetY;
  const setIframesPointer = (val) => 
    container.querySelectorAll("iframe").forEach(f => f.style.pointerEvents = val);

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

  window.addEventListener("pointermove", (e) => {
    if (isDragging) {
      container.style.left = `${e.clientX - offsetX}px`;
      container.style.top = `${e.clientY - offsetY}px`;
    } else if (isResizing) {
      container.style.width = `${Math.max(250, startW + (e.clientX - startX))}px`;
      container.style.height = `${Math.max(250, startH + (e.clientY - startY))}px`;
    }
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

  // 7. Load Persistence
  const saved = JSON.parse(localStorage.getItem("sb_dims_v1") || "null");
  if (saved) {
    container.style.left = `${saved.x}px`;
    container.style.top = `${saved.y}px`;
    container.style.width = `${saved.w}px`;
    container.style.height = `${saved.h}px`;
  }
}