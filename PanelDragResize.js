export function enableDrag(
  windowSelector = "#sb-top .panel, #sb-main .sb-panel",
  headerSelector = "#sb-top .panel") {
  const dragItems = document.querySelectorAll(windowSelector);
  const headers = document.querySelectorAll(headerSelector);
  if (dragItems.length < 2 || headers.length === 0) return;

  const primary = dragItems[0];
  const secondary = dragItems[1];
  const header = headers[0];

  // Config
  const edgeSize = 20;
  const M_bounds = { l: 5, t: 80, r: 20, b: 5 };
  const snapDistance = 50;
  const minWidth = 100;
  const minHeight = 100;

  // State
  let isDragging = false, isResizing = false;
  let offsetX = 0, offsetY = 0;
  let startX = 0, startY = 0, startW = 0, startH = 0;

  // collect iframes inside both windows to toggle pointer-events
  const iframes = Array.from(primary.querySelectorAll("iframe"))
    .concat(Array.from(secondary.querySelectorAll("iframe")));

  const preventScroll = e => { if (isDragging || isResizing) e.preventDefault(); };
  const setIframesPointerEvents = (v) => iframes.forEach(f => { f.style.pointerEvents = v; });

  // utility: clamp/snap and persist
  function limitPositionAndSize() {
    // previous metrics
    const prevLeft = primary.offsetLeft;
    const prevTop = primary.offsetTop;
    const prevW = primary.offsetWidth;
    const prevH = primary.offsetHeight;

    const rect = primary.getBoundingClientRect();
    const W = window.innerWidth;
    const H = window.innerHeight;

    let x = rect.left;
    let y = rect.top;
    let w = rect.width;
    let h = rect.height;

    // snap
    if (x < snapDistance) x = M_bounds.l;
    if (y < snapDistance) y = M_bounds.t;
    if (W - (x + w) < snapDistance) x = W - w - M_bounds.r;
    if (H - (y + h) < snapDistance) y = H - h - M_bounds.b;

    // clamp within bounds
    x = Math.max(M_bounds.l, Math.min(x, W - w - M_bounds.r));
    y = Math.max(M_bounds.t, Math.min(y, H - h - M_bounds.b));

    // enforce minimums
    w = Math.max(minWidth, w);
    h = Math.max(minHeight, h);

    // apply to primary
    primary.style.left = x + "px";
    primary.style.top = y + "px";
    primary.style.width = w + "px";
    primary.style.height = h + "px";

    // compute diffs and apply to secondary (keep relative movement & size change)
    const deltaX = x - prevLeft;
    const deltaY = y - prevTop;
    const wDiff = w - prevW;
    const hDiff = h - prevH;

    secondary.style.left = (secondary.offsetLeft + deltaX) + "px";
    secondary.style.top = (secondary.offsetTop + deltaY) + "px";
    secondary.style.width = Math.max(minWidth, secondary.offsetWidth + wDiff) + "px";
    secondary.style.height = Math.max(minHeight, secondary.offsetHeight + hDiff) + "px";

    // persist both
    try {
      localStorage.setItem(windowSelector + "_pos_primary",
        JSON.stringify({ left: x, top: y, width: w, height: h }));
      localStorage.setItem(windowSelector + "_pos_secondary",
        JSON.stringify({
          left: parseFloat(secondary.style.left),
          top: parseFloat(secondary.style.top),
          width: parseFloat(secondary.style.width),
          height: parseFloat(secondary.style.height)
        }));
    } catch (err) {
      // localStorage may fail in some contexts — ignore silently
    }
  }

  // pointer handlers
  header.addEventListener("pointerdown", e => {
    const rect = primary.getBoundingClientRect();
    const nearRight = e.clientX > rect.right - edgeSize;
    const nearBottom = e.clientY > rect.bottom - edgeSize;

    if (nearRight || nearBottom) {
      // start resizing
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startW = rect.width;
      startH = rect.height;
      document.body.style.cursor = (nearRight && nearBottom) ? "nwse-resize" : "se-resize";
    } else {
      // start dragging
      isDragging = true;
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      document.body.style.cursor = "move";
    }

    // disable iframes so they don't swallow pointer events
    if (iframes.length) setIframesPointerEvents("none");

    header.setPointerCapture(e.pointerId);
    document.body.style.userSelect = "none";
    window.addEventListener("touchmove", preventScroll, { passive: false });
  });

  // dynamic cursor when hovering over header (no active drag/resize)
  header.addEventListener("pointermove", e => {
    if (isDragging || isResizing) return;
    const rect = primary.getBoundingClientRect();
    const nearRight = e.clientX > rect.right - edgeSize;
    const nearBottom = e.clientY > rect.bottom - edgeSize;
    if (nearRight && nearBottom) {
      header.style.cursor = "nwse-resize";
    } else if (nearRight || nearBottom) {
      header.style.cursor = "se-resize";
    } else {
      header.style.cursor = "grab";
    }
  });

  // global move handler so we don't lose the pointer if it leaves the header element
  const moveHandler = e => {
    if (isDragging) {
      const newLeft = e.clientX - offsetX;
      const newTop = e.clientY - offsetY;
      const deltaX = newLeft - primary.offsetLeft;
      const deltaY = newTop - primary.offsetTop;

      primary.style.left = newLeft + "px";
      primary.style.top = newTop + "px";

      secondary.style.left = (secondary.offsetLeft + deltaX) + "px";
      secondary.style.top = (secondary.offsetTop + deltaY) + "px";
    }

    if (isResizing) {
      const newW = Math.max(minWidth, startW + (e.clientX - startX));
      const newH = Math.max(minHeight, startH + (e.clientY - startY));
      const wDiff = newW - primary.offsetWidth;
      const hDiff = newH - primary.offsetHeight;

      primary.style.width = newW + "px";
      primary.style.height = newH + "px";

      secondary.style.width = Math.max(minWidth, secondary.offsetWidth + wDiff) + "px";
      secondary.style.height = Math.max(minHeight, secondary.offsetHeight + hDiff) + "px";
    }
  };

  const upHandler = e => {
    if (!isDragging && !isResizing) return;

    isDragging = false;
    isResizing = false;

    try { header.releasePointerCapture && header.releasePointerCapture(e.pointerId); } catch (err) {}
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    header.style.cursor = "grab";

    if (iframes.length) setIframesPointerEvents("auto");
    window.removeEventListener("touchmove", preventScroll);

    // snap, clamp and persist
    limitPositionAndSize();
  };

  header.addEventListener("pointerup", upHandler);
  header.addEventListener("pointercancel", upHandler);
  window.addEventListener("pointermove", moveHandler);
  window.addEventListener("pointerup", upHandler);

  // init cursor
  header.style.cursor = "grab";

  // --- restore saved positions if present ---
  try {
    const savedP = JSON.parse(localStorage.getItem(windowSelector + "_pos_primary") || "null");
    const savedS = JSON.parse(localStorage.getItem(windowSelector + "_pos_secondary") || "null");
    if (savedP) {
      if (savedP.left !== undefined) primary.style.left = savedP.left + "px";
      if (savedP.top !== undefined) primary.style.top = savedP.top + "px";
      if (savedP.width !== undefined) primary.style.width = savedP.width + "px";
      if (savedP.height !== undefined) primary.style.height = savedP.height + "px";
    }
    if (savedS) {
      if (savedS.left !== undefined) secondary.style.left = savedS.left + "px";
      if (savedS.top !== undefined) secondary.style.top = savedS.top + "px";
      if (savedS.width !== undefined) secondary.style.width = savedS.width + "px";
      if (savedS.height !== undefined) secondary.style.height = savedS.height + "px";
    }
  } catch (err) {
    // ignore parse errors
  }

  // observe removal (optional — keeps things tidy)
  const observer = new MutationObserver(() => {
    if (!document.querySelector(windowSelector)) {
      try {
        window.removeEventListener("pointermove", moveHandler);
        window.removeEventListener("pointerup", upHandler);
      } catch (e) {}
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
