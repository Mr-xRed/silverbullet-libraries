let highestZ = 10000;
const SNAP_THRESHOLD = 15;
const TOP_OFFSET = 65;

export function show(content, titleLabel = null) {
  const isUrl = content.startsWith("http://") || content.startsWith("https://");
  const isHtml = content.trim().startsWith("<") && content.trim().endsWith(">");
  
  let storageKey = "sb_dim_mode_page";
  if (isHtml) storageKey = "sb_dim_mode_html";
  else if (isUrl) storageKey = "sb_dim_mode_url";

  const nameForId = titleLabel || content;
  const sanitizedId = "sb-float-" + nameForId.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);
  
  let container = document.getElementById(sanitizedId);

  if (!document.getElementById("sb-floating-page-styles")) {
    const style = document.createElement("style");
    style.id = "sb-floating-page-styles";
    style.textContent = `
      :root {
        --header-height: 20px;
        --frame-width: 5px;
        --frame-color: oklch(0.4 0 0 / 0.2);
        --window-border: 2px;
        --window-border-radius: 10px;
        --window-border-color: oklch(0.65 0 0 / 0.2);
      }

      body.sb-dragging-active {
        user-select: none !important;
        -webkit-user-select: none !important;
      }

      .sb-floating-container {
        position: fixed !important;
        display: flex !important;
        flex-direction: column !important;
        box-sizing: border-box !important;
        background: var(--frame-color);
        border: var(--window-border) solid var(--window-border-color);
        backdrop-filter: blur(10px);
        box-shadow: 0px 0px 20px #0008;
        border-radius: calc(var(--window-border-radius) + var(--frame-width));
        padding: var(--frame-width);
        width: 600px;
        height: 500px;
        touch-action: none;
        max-width: 100vw;
        max-height: calc(100vh - ${TOP_OFFSET}px);
      }
      
      .sb-floating-container.is-focused {
        box-shadow: 0px 10px 30px #000a;
        border-color: oklch(0.65 0 0 / 0.4);
      }

      .sb-floating-header {
        height: var(--header-height) !important;
        width: 100% !important;
        cursor: grab !important;
        border-radius: 8px !important;
        flex-shrink: 0 !important;
        display: flex !important;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: background 0.2s ease;
      }

      .sb-floating-header:hover { 
        background: rgba(255, 255, 255, 0.1) !important; 
      }

/* 
      .sb-floating-header::after {
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
        position: absolute;
      }
*/
      .sb-floating-title {
        white-space: nowrap;      
        overflow: hidden;        
        text-overflow: ellipsis; 
        max-width: 100%;         
        padding: 0 40px;          
        box-sizing: border-box;   
        text-align: center;     
        font-size: 1em;
/*      font-family: sans-serif;
        pointer-events: none; 
        letter-spacing: 1; */
        text-transform: uppercase;
        z-index: 1;
      }

      .sb-floating-close-btn {
        position: absolute;
        right: 5px;
        width: 22px; height: 22px;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; border-radius: 6px;
        font-family: sans-serif; font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        transition: all 0.2s;
        z-index: 10002;
      }
      .sb-floating-close-btn:hover { background: #ff4d4d; color: white; }

      .sb-floating-iframe-wrapper {
        flex: 1;
        position: relative;
        border-radius: var(--window-border-radius);
        overflow: hidden;
        border: var(--window-border) solid var(--window-border-color);
        margin-top: 4px;
      }

      .sb-floating-iframe {
        width: 100%; height: 100%;
        border: none;
        background: var(--root-background-color) !important;
      }

      .sb-iframe-shield {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 1000;
        background: transparent;
        display: block;
      }
      .is-focused .sb-iframe-shield {
        display: none;
      }

      /* Multi-side resizers - Adjusted to match source hit areas */
      .sb-resizer { position: absolute; z-index: 10001; }
      .resizer-t { top: 0; left: 22px; right: 22px; height: 10px; cursor: ns-resize; }
      .resizer-b { bottom: 0; left: 22px; right: 22px; height: 10px; cursor: ns-resize; }
      .resizer-l { left: 0; top: 22px; bottom: 22px; width: 10px; cursor: ew-resize; }
      .resizer-r { right: 0; top: 22px; bottom: 22px; width: 10px; cursor: ew-resize; }
      .resizer-tl { top: 0; left: 0; width: 24px; height: 24px; cursor: nwse-resize; }
      .resizer-tr { top: 0; right: 0; width: 24px; height: 24px; cursor: nesw-resize; }
      .resizer-bl { bottom: 0; left: 0; width: 24px; height: 24px; cursor: nesw-resize; }
      .resizer-br { bottom: 0; right: 0; width: 24px; height: 24px; cursor: nwse-resize; }
    `;
    (document.head || document.documentElement).appendChild(style);

    window.addEventListener("resize", () => {
      document.querySelectorAll(".sb-floating-container").forEach(win => clampToViewport(win));
    });
  }

  if (container) {
    focusWindow(container);
    return;
  }

  container = document.createElement("div");
  container.id = sanitizedId;
  container.className = "sb-floating-container";
  const header = document.createElement("div");
  header.className = "sb-floating-header";
  const title = document.createElement("div");
  title.className = "sb-floating-title";
  title.innerText = titleLabel || (isUrl ? "Web" : (isHtml ? "HTML" : content));
  const closeBtn = document.createElement("div");
  closeBtn.className = "sb-floating-close-btn";
  closeBtn.innerHTML = "✕";
  closeBtn.onclick = (e) => { e.stopPropagation(); container.remove(); };
  const wrapper = document.createElement("div");
  wrapper.className = "sb-floating-iframe-wrapper";
  const shield = document.createElement("div");
  shield.className = "sb-iframe-shield";
  const iframe = document.createElement("iframe");
  iframe.className = "sb-floating-iframe";
  if (isHtml) iframe.srcdoc = content;
  else if (isUrl) iframe.src = content;
  else iframe.src = window.location.origin + "/" + encodeURIComponent(content);
  header.appendChild(title);
  header.appendChild(closeBtn);
  wrapper.appendChild(shield);
  wrapper.appendChild(iframe);
  container.appendChild(header);
  container.appendChild(wrapper);

  ['t', 'b', 'l', 'r', 'tl', 'tr', 'bl', 'br'].forEach(dir => {
    const handle = document.createElement("div");
    handle.className = `sb-resizer resizer-${dir}`;
    handle.dataset.direction = dir;
    container.appendChild(handle);
  });

  const target = document.querySelector("#sb-main") || document.body;
  target.appendChild(container);
  container.addEventListener("pointerdown", () => focusWindow(container), true);

  setupEvents(container, header, storageKey);
  
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
  if (saved) {
    container.style.left = `${saved.x}px`;
    container.style.top = `${saved.y}px`;
    container.style.width = `${saved.w}px`;
    container.style.height = `${saved.h}px`;
    clampToViewport(container);
  } else {
    const offset = document.querySelectorAll('.sb-floating-container').length * 30;
    container.style.left = `${100 + offset}px`;
    container.style.top = `${TOP_OFFSET + 35 + offset}px`;
  }
  focusWindow(container);
}

function clampToViewport(win) {
  const rect = win.getBoundingClientRect();
  let left = rect.left, top = rect.top, width = rect.width, height = rect.height;
  if (width > window.innerWidth) width = window.innerWidth;
  if (height > window.innerHeight - TOP_OFFSET) height = window.innerHeight - TOP_OFFSET;
  if (left < 0) left = 0;
  if (top < TOP_OFFSET) top = TOP_OFFSET;
  if (left + width > window.innerWidth) left = window.innerWidth - width;
  if (top + height > window.innerHeight) top = window.innerHeight - height;
  win.style.left = `${left}px`; win.style.top = `${top}px`; win.style.width = `${width}px`; win.style.height = `${height}px`;
}

function focusWindow(win) {
  document.querySelectorAll(".sb-floating-container").forEach(c => c.classList.remove("is-focused"));
  win.classList.add("is-focused");
  win.style.zIndex = ++highestZ;
}

function setupEvents(container, header, storageKey) {
  let activeAction = null;
  let startX, startY, startW, startH, startL, startT;

  container.addEventListener("pointerdown", (e) => {
    const resizer = e.target.closest('.sb-resizer');
    const isHeader = e.target.closest('.sb-floating-header');
    if (e.target.closest('.sb-floating-close-btn')) return;

    if (resizer || isHeader) {
      activeAction = resizer ? resizer.dataset.direction : 'drag';
      document.body.classList.add("sb-dragging-active");
      startX = e.clientX; startY = e.clientY;
      startW = container.offsetWidth; startH = container.offsetHeight;
      startL = container.offsetLeft; startT = container.offsetTop;
      e.target.setPointerCapture(e.pointerId);
      e.stopPropagation();
    }
  });

  window.addEventListener("pointermove", (e) => {
    if (!activeAction) return;

    let newLeft = startL, newTop = startT, newWidth = startW, newHeight = startH;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (activeAction === 'drag') {
      newLeft = startL + dx;
      newTop = startT + dy;
      if (newLeft < SNAP_THRESHOLD) newLeft = 0;
      if (newTop < TOP_OFFSET + SNAP_THRESHOLD) newTop = TOP_OFFSET; 
      if (newLeft + startW > window.innerWidth - SNAP_THRESHOLD) newLeft = window.innerWidth - startW;
      if (newTop + startH > window.innerHeight - SNAP_THRESHOLD) newTop = window.innerHeight - startH;
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - startW));
      newTop = Math.max(TOP_OFFSET, Math.min(newTop, window.innerHeight - startH));
      container.style.left = `${newLeft}px`;
      container.style.top = `${newTop}px`;
    } else {
      if (activeAction.includes('r')) newWidth = startW + dx;
      if (activeAction.includes('b')) newHeight = startH + dy;
      if (activeAction.includes('l')) { newWidth = startW - dx; newLeft = startL + dx; }
      if (activeAction.includes('t')) { newHeight = startH - dy; newTop = startT + dy; }
      if (newLeft < 0) { newWidth += newLeft; newLeft = 0; }
      if (newTop < TOP_OFFSET) { newHeight -= (TOP_OFFSET - newTop); newTop = TOP_OFFSET; }
      if (newLeft + newWidth > window.innerWidth) newWidth = window.innerWidth - newLeft;
      if (newTop + newHeight > window.innerHeight) newHeight = window.innerHeight - newTop;
      if (newWidth > 150) { container.style.width = `${newWidth}px`; container.style.left = `${newLeft}px`; }
      if (newHeight > 100) { container.style.height = `${newHeight}px`; container.style.top = `${newTop}px`; }
    }
  });

  const stopAction = () => {
    if (!activeAction) return;
    activeAction = null;
    document.body.classList.remove("sb-dragging-active");
    localStorage.setItem(storageKey, JSON.stringify({
      x: container.offsetLeft, y: container.offsetTop,
      w: container.offsetWidth, h: container.offsetHeight
    }));
  };

  window.addEventListener("pointerup", stopAction);
}

export function closeAll() {
  document.querySelectorAll(".sb-floating-container").forEach(win => win.remove());
}