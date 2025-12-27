let highestZ = 10000;

export function show(content, titleLabel = null) {
  // 1. Detect Content Type and assign a shared Storage Key
  const isUrl = content.startsWith("http://") || content.startsWith("https://");
  const isHtml = content.trim().startsWith("<") && content.trim().endsWith(">");
  
  let storageKey = "sb_dim_mode_page"; // Mode 1
  if (isHtml) storageKey = "sb_dim_mode_html"; // Mode 3
  else if (isUrl) storageKey = "sb_dim_mode_url"; // Mode 2

  // The ID must remain unique per-content so we can open multiple separate windows
  const nameForId = titleLabel || content;
  const sanitizedId = "sb-float-" + nameForId.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);
  
  let container = document.getElementById(sanitizedId);

  // 2. Setup Global Styles (unchanged)
  if (!document.getElementById("sb-floating-page-styles")) {
    const style = document.createElement("style");
    style.id = "sb-floating-page-styles";
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

  if (container) {
    focusWindow(container);
    return;
  }

  // 3. Create New Window
  container = document.createElement("div");
  container.id = sanitizedId;
  container.className = "sb-floating-container";
  container.style.zIndex = ++highestZ;

  const header = document.createElement("div");
  header.className = "sb-floating-header";

  const title = document.createElement("div");
  title.className = "sb-floating-title";
  title.innerText = titleLabel || (isUrl ? "Web" : (isHtml ? "HTML" : content));

  const closeBtn = document.createElement("div");
  closeBtn.className = "sb-floating-close-btn";
  closeBtn.innerHTML = "✕";
  closeBtn.onclick = (e) => { e.stopPropagation(); container.remove(); };

  const iframe = document.createElement("iframe");
  iframe.className = "sb-floating-iframe";

  if (isHtml) iframe.srcdoc = content;
  else if (isUrl) iframe.src = content;
  else iframe.src = window.location.origin + "/" + encodeURIComponent(content);

  const resizer = document.createElement("div");
  resizer.className = "sb-floating-resizer";

  header.appendChild(title);
  header.appendChild(closeBtn);
  container.appendChild(header);
  container.appendChild(iframe);
  container.appendChild(resizer);

  const target = document.querySelector("#sb-main") || document.body;
  target.appendChild(container);

  container.addEventListener("pointerdown", () => focusWindow(container));
  
  // Pass the shared mode-based storageKey instead of the unique sanitizedId
  setupEvents(container, header, resizer, storageKey);

  // Load saved dimensions based on the MODE
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
  if (saved) {
    container.style.left = `${saved.x}px`;
    container.style.top = `${saved.y}px`;
    container.style.width = `${saved.w}px`;
    container.style.height = `${saved.h}px`;
  } else {
    const offset = document.querySelectorAll('.sb-floating-container').length * 30;
    container.style.left = `${100 + offset}px`;
    container.style.top = `${100 + offset}px`;
  }
}

function focusWindow(win) {
  win.style.zIndex = ++highestZ;
}

export function closeAll() {
  document.querySelectorAll(".sb-floating-container").forEach(win => win.remove());
}

function setupEvents(container, header, resizer, storageKey) {
  let isDragging = false, isResizing = false;
  let startX, startY, startW, startH, offsetX, offsetY;

  const setIframesPointer = (val) => 
    container.querySelectorAll("iframe").forEach(f => f.style.pointerEvents = val);

  header.addEventListener("pointerdown", (e) => {
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
    // Saves to the MODE key (e.g., sb_dim_mode_page)
    localStorage.setItem(storageKey, JSON.stringify({
      x: container.offsetLeft, y: container.offsetTop,
      w: container.offsetWidth, h: container.offsetHeight
    }));
  };

  window.addEventListener("pointerup", stopAction);
}