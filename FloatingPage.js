// Global state to keep track of the window
let container = null;

export function show(pageName) {
  const windowId = "sb-floating-window";
  container = document.getElementById(windowId);

  // 1. Setup Global Styles
  if (!document.getElementById("sb-global-drag-styles")) {
    const style = document.createElement("style");
    style.id = "sb-global-drag-styles";
    style.textContent = `
      .sb-floating-container {
        position: fixed !important;
        z-index: 10000 !important;
        display: flex !important;
        flex-direction: column !important;
        box-sizing: border-box !important;
        background: var(--frame-color, #222);
        border: var(--window-border, 1px) solid var(--window-border-color, #444);
        backdrop-filter: blur(10px);
        box-shadow: 0px 10px 30px #000a;
        border-radius: 12px;
        padding: 6px;
        width: 600px;
        height: 500px;
        top: 100px;
        left: 100px;
        touch-action: none;
      }

      .sb-floating-header {
        height: 30px !important;
        width: 100% !important;
        cursor: grab !important;
        flex-shrink: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        position: relative;
      }

      /* Drag handle indicator in middle */
      .sb-floating-header::after {
        content: "";
        width: 30px;
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
      }

      .sb-floating-close-btn {
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 6px;
        font-family: sans-serif;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        transition: all 0.2s;
        z-index: 10002;
      }

      .sb-floating-close-btn:hover {
        background: #ff4d4d;
        color: white;
      }

      .sb-floating-iframe {
        flex: 1;
        border: none;
        border-radius: 6px;
        background: var(--background, white);
      }

      .sb-floating-resizer {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 20px;
        height: 20px;
        cursor: nwse-resize;
        z-index: 10001;
      }
    `;
    document.head.appendChild(style);
  }

  // 2. Create the window if it doesn't exist
  if (!container) {
    container = document.createElement("div");
    container.id = windowId;
    container.className = "sb-floating-container";
    
    const header = document.createElement("div");
    header.className = "sb-floating-header";
    
    // Create the Close Button
    const closeBtn = document.createElement("div");
    closeBtn.className = "sb-floating-close-btn";
    closeBtn.innerHTML = "✕";
    closeBtn.title = "Close Window";
    closeBtn.onclick = (e) => {
      e.stopPropagation(); // Prevent drag trigger
      close();
    };
    
    const iframe = document.createElement("iframe");
    iframe.className = "sb-floating-iframe";
    iframe.name = "floating-iframe";

    const resizer = document.createElement("div");
    resizer.className = "sb-floating-resizer";

    header.appendChild(closeBtn); // Add button to header
    container.appendChild(header);
    container.appendChild(iframe);
    container.appendChild(resizer);
    document.body.appendChild(container);

    setupEvents(container, header, resizer);
    
    const saved = JSON.parse(localStorage.getItem("sb_floating_dims") || "null");
    if (saved) {
      container.style.left = `${saved.x}px`;
      container.style.top = `${saved.y}px`;
      container.style.width = `${saved.w}px`;
      container.style.height = `${saved.h}px`;
    }
  }

  // 3. Update iframe source
  const iframe = container.querySelector('iframe');
  iframe.src = window.location.origin + "/" + encodeURIComponent(pageName);
}

export function close() {
  const win = document.getElementById("sb-floating-window");
  if (win) win.remove();
}

function setupEvents(container, header, resizer) {
  let isDragging = false, isResizing = false;
  let startX, startY, startW, startH, offsetX, offsetY;

  const setIframesPointer = (val) => 
    container.querySelectorAll("iframe").forEach(f => f.style.pointerEvents = val);

  header.addEventListener("pointerdown", (e) => {
    // Don't drag if clicking the close button
    if (e.target.classList.contains('sb-floating-close-btn')) return;

    isDragging = true;
    const rect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    setIframesPointer("none");
    header.setPointerCapture(e.pointerId);
  });

  resizer.addEventListener("pointerdown", (e) => {
    isResizing = true;
    startX = e.clientX; startY = e.clientY;
    startW = container.offsetWidth; startH = container.offsetHeight;
    setIframesPointer("none");
    resizer.setPointerCapture(e.pointerId);
    e.stopPropagation();
  });

  window.addEventListener("pointermove", (e) => {
    if (isDragging) {
      container.style.left = `${e.clientX - offsetX}px`;
      container.style.top = `${e.clientY - offsetY}px`;
    } else if (isResizing) {
      container.style.width = `${startW + (e.clientX - startX)}px`;
      container.style.height = `${startH + (e.clientY - startY)}px`;
    }
  });

  const stopAction = () => {
    if (!isDragging && !isResizing) return;
    isDragging = false; isResizing = false;
    setIframesPointer("auto");
    localStorage.setItem("sb_floating_dims", JSON.stringify({
      x: container.offsetLeft, y: container.offsetTop,
      w: container.offsetWidth, h: container.offsetHeight
    }));
  };

  window.addEventListener("pointerup", stopAction);
}