let highestZ = 10000;

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
      .sb-floating-container {
        position: fixed !important;
        display: flex !important;
        flex-direction: column !important;
        box-sizing: border-box !important;
        background: var(--frame-color, #222);
        border: var(--window-border, 1px) solid var(--window-border-color, #444);
        backdrop-filter: blur(10px);
        box-shadow: 0px 5px 15px #0008;
        border-radius: 12px;
        padding: 6px;
        width: 600px;
        height: 500px;
        touch-action: none;
        transition: box-shadow 0.2s, border-color 0.2s;
      }
      
      /* Visual feedback for focused window */
      .sb-floating-container.is-focused {
        box-shadow: 0px 10px 30px #000a;
        border-color: var(--ui-accent-color, #007bff);
      }

      .sb-floating-header {
        height: 30px !important;
        width: 100% !important;
        cursor: grab !important;
        flex-shrink: 0 !important;
        display: flex !important;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .sb-floating-title {
        white-space: nowrap;      
        overflow: hidden;        
        text-overflow: ellipsis; 
        

        max-width: 100%;         
        padding: 0 35px;          
        box-sizing: border-box;   
        text-align: center;     

        font-size: 11px;
        font-family: sans-serif;
        color: rgba(255, 255, 255, 0.5);
        pointer-events: none;
        text-transform: uppercase;
        letter-spacing: 0.5px;
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
        border-radius: 6px;
        overflow: hidden;
      }

      .sb-floating-iframe {
        width: 100%; height: 100%;
        border: none;
        background: var(--background, white);
      }

      /* The "Shield" prevents the iframe from stealing focus clicks */
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

      .sb-floating-resizer {
        position: absolute;
        right: 0; bottom: 0; width: 20px; height: 20px;
        cursor: nwse-resize; z-index: 10001;
      }
    `;
    document.head.appendChild(style);
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

  // New wrapper for iframe and shield
  const wrapper = document.createElement("div");
  wrapper.className = "sb-floating-iframe-wrapper";

  const shield = document.createElement("div");
  shield.className = "sb-iframe-shield";

  const iframe = document.createElement("iframe");
  iframe.className = "sb-floating-iframe";

  if (isHtml) iframe.srcdoc = content;
  else if (isUrl) iframe.src = content;
  else iframe.src = window.location.origin + "/" + encodeURIComponent(content);

  const resizer = document.createElement("div");
  resizer.className = "sb-floating-resizer";

  header.appendChild(title);
  header.appendChild(closeBtn);
  wrapper.appendChild(shield);
  wrapper.appendChild(iframe);
  container.appendChild(header);
  container.appendChild(wrapper);
  container.appendChild(resizer);

  const target = document.querySelector("#sb-main") || document.body;
  target.appendChild(container);

  // Focus triggers
  container.addEventListener("pointerdown", (e) => focusWindow(container), true);

  setupEvents(container, header, resizer, storageKey);

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

  focusWindow(container);
}

function focusWindow(win) {
  // 1. Clear focus from all windows
  document.querySelectorAll(".sb-floating-container").forEach(c => {
    c.classList.remove("is-focused");
  });

  // 2. Apply focus to this window
  win.classList.add("is-focused");
  win.style.zIndex = ++highestZ;
}

export function closeAll() {
  document.querySelectorAll(".sb-floating-container").forEach(win => win.remove());
}

function setupEvents(container, header, resizer, storageKey) {
  let isDragging = false, isResizing = false;
  let startX, startY, startW, startH, offsetX, offsetY;

  header.addEventListener("pointerdown", (e) => {
    if (e.target.classList.contains('sb-floating-close-btn')) return;
    isDragging = true;
    const rect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    header.setPointerCapture(e.pointerId);
  });

  resizer.addEventListener("pointerdown", (e) => {
    isResizing = true;
    startX = e.clientX; startY = e.clientY;
    startW = container.offsetWidth; startH = container.offsetHeight;
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
    localStorage.setItem(storageKey, JSON.stringify({
      x: container.offsetLeft, y: container.offsetTop,
      w: container.offsetWidth, h: container.offsetHeight
    }));
  };

  window.addEventListener("pointerup", stopAction);
}