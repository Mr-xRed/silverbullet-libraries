---
name: "Library/Mr-xRed/LineNumbering"
description: "Adds a clean, theme-aware, clickable line number gutter to the editor on every page."
tags: meta/library
pageDecoration.prefix: "🔢 "
---

# Line Numbering

Shows line numbers in the editor on every page.

* Command: **Line Numbers: Toggle** (state is remembered in the browser)
* Click a number to select that line, drag to select several, Shift+click to extend.

## Styling
```space-style
/* Make room for the gutter (width is set dynamically by the script) */
body.sb-ln-on .cm-editor .cm-content {
  padding-left: var(--sb-ln-width, 3.2em) !important;
}

/* The gutter overlay (position and size are set by the script) */
.sb-ln-overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
  z-index: 2;
  box-sizing: border-box;
  border-right: 1px solid color-mix(in srgb, var(--editor-text-color, currentColor) 14%, transparent);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.78em;
  font-variant-numeric: tabular-nums;
}

.sb-ln {
  position: absolute;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding-right: 0.9em;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: color-mix(in srgb, var(--editor-text-color, currentColor) 38%, transparent);
  transition: color 0.12s ease, background-color 0.12s ease;
  pointer-events: auto;
  cursor: pointer;
}

.sb-ln:hover {
  color: color-mix(in srgb, var(--editor-text-color, currentColor) 80%, transparent);
  background: color-mix(in srgb, var(--editor-text-color, currentColor) 6%, transparent);
}

.sb-ln.sb-ln-selected {
  color: color-mix(in srgb, var(--ui-accent-color, var(--editor-text-color, currentColor)) 85%, transparent);
  background: color-mix(in srgb, var(--ui-accent-color, var(--editor-text-color, currentColor)) 14%, transparent);
}

.sb-ln.sb-ln-active {
  color: var(--ui-accent-color, var(--editor-text-color, currentColor));
  background: color-mix(in srgb, var(--ui-accent-color, var(--editor-text-color, currentColor)) 10%, transparent);
  font-weight: 700;
}

@media print {
  .sb-ln-overlay { display: none !important; }
  body.sb-ln-on .cm-editor .cm-content { padding-left: 0 !important; }
}
```

## Logic
```space-lua
local jsSource = [[
(function () {
  var KEY = "__sbLineNumbers";
  var LS = "sb-line-numbers";
  var w = window;

  // Clean up a previous instance (e.g. after "System: Reload")
  if (w[KEY]) { try { w[KEY].destroy(); } catch (e) {} }

  var enabled = true;
  try { enabled = localStorage.getItem(LS) !== "off"; } catch (e) {}

  var view = null, overlay = null, raf = 0, timer = 0, cleanups = [];
  var lastSig = "";
  var dragging = false, dragAnchor = 1;

  function findView() {
    if (w.client && w.client.editorView) return w.client.editorView;
    var c = document.querySelector(".cm-content");
    return (c && c.cmView && c.cmView.view) || null;
  }

  function schedule() {
    if (!raf) raf = requestAnimationFrame(render);
  }

  // ---- line selection ----
  function selectRange(a, b) {
    if (!view) return;
    var doc = view.state.doc;
    var lo = Math.max(1, Math.min(a, b));
    var hi = Math.min(doc.lines, Math.max(a, b));
    var from = doc.line(lo).from;
    var to = doc.line(hi).to;
    if (to < doc.length) to += 1; // include the line break
    view.dispatch({ selection: { anchor: from, head: to } });
    view.focus();
  }

  function lineOfEvent(e) {
    var t = e.target;
    if (!t || !t.closest) return 0;
    var el = t.closest(".sb-ln");
    return el ? Number(el.dataset.line) : 0;
  }

  function onDown(e) {
    var n = lineOfEvent(e);
    if (!n || !view) return;
    e.preventDefault();
    if (e.shiftKey) {
      dragAnchor = view.state.doc.lineAt(view.state.selection.main.anchor).number;
    } else {
      dragAnchor = n;
    }
    dragging = true;
    selectRange(dragAnchor, n);
  }

  function onOver(e) {
    if (!dragging) return;
    var n = lineOfEvent(e);
    if (n) selectRange(dragAnchor, n);
  }

  function onUp() { dragging = false; }

  // ---- attach / detach ----
  function attach(v) {
    view = v;
    lastSig = "";
    overlay = document.createElement("div");
    overlay.className = "sb-ln-overlay";
    v.dom.appendChild(overlay);

    function on(target, ev, fn, opts) {
      target.addEventListener(ev, fn, opts);
      cleanups.push(function () { target.removeEventListener(ev, fn, opts); });
    }
    on(v.scrollDOM, "scroll", schedule, { passive: true });
    on(document, "selectionchange", schedule);
    on(w, "resize", schedule);
    on(v.dom, "keyup", schedule);
    on(v.dom, "mouseup", schedule);
    on(overlay, "mousedown", onDown);
    on(overlay, "mouseover", onOver);
    on(document, "mouseup", onUp);

    var mo = new MutationObserver(schedule);
    mo.observe(v.contentDOM, { childList: true, subtree: true, characterData: true });
    cleanups.push(function () { mo.disconnect(); });

    if (w.ResizeObserver) {
      var ro = new ResizeObserver(schedule);
      ro.observe(v.dom);
      ro.observe(v.contentDOM);
      cleanups.push(function () { ro.disconnect(); });
    }
    schedule();
  }

  function detach() {
    cleanups.forEach(function (fn) { try { fn(); } catch (e) {} });
    cleanups = [];
    dragging = false;
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    lastSig = "";
    overlay = null;
    view = null;
  }

  // ---- rendering ----
  function render() {
    raf = 0;
    if (!view || !overlay) return;

    var dom = view.dom;
    document.body.classList.toggle("sb-ln-on", enabled);
    if (!enabled) {
      overlay.style.display = "none";
      return;
    }
    overlay.style.display = "block";

    var doc = view.state.doc;
    var digits = Math.max(String(doc.lines).length, 2);

    // Size the gutter and reserve room for it in the content
    overlay.style.width = "calc(" + digits + "ch + 1.9em)";
    var gw = overlay.offsetWidth;
    var root = document.documentElement;
    if (gw > 0 && root.style.getPropertyValue("--sb-ln-width") !== gw + "px") {
      root.style.setProperty("--sb-ln-width", gw + "px");
    }

    var eRect = dom.getBoundingClientRect();
    var cRect = view.contentDOM.getBoundingClientRect();
    var sRect = view.scrollDOM.getBoundingClientRect();

    // Editor temporarily hidden (e.g. a modal is switching focus): keep what we have
    if (sRect.height === 0 || cRect.width === 0) return;

    overlay.style.left = (cRect.left - eRect.left) + "px";
    overlay.style.top = (sRect.top - eRect.top) + "px";
    overlay.style.height = sRect.height + "px";

    var sel = view.state.selection.main;
    var active = -1, selFrom = -1, selTo = -1;
    try {
      active = doc.lineAt(sel.head).number;
      if (!sel.empty) {
        selFrom = doc.lineAt(sel.from).number;
        selTo = doc.lineAt(sel.to).number;
        // a selection ending exactly at a line start doesn't cover that line
        if (selTo > selFrom && doc.line(selTo).from === sel.to) selTo -= 1;
      }
    } catch (e) {}

    var lines = view.contentDOM.querySelectorAll(":scope > .cm-line");
    var frag = document.createDocumentFragment();
    var sig = (cRect.left - eRect.left) + "|" + (sRect.top - eRect.top) + "|" + sRect.height + "|" + gw + ";";

    for (var i = 0; i < lines.length; i++) {
      var el = lines[i];
      var r = el.getBoundingClientRect();
      if (r.height === 0) continue;
      if (r.bottom < sRect.top || r.top > sRect.bottom) continue;

      var n;
      try { n = doc.lineAt(view.posAtDOM(el)).number; } catch (e) { continue; }

      var cs = getComputedStyle(el);
      var lh = parseFloat(cs.lineHeight);
      if (!lh) lh = parseFloat(cs.fontSize) * 1.4;
      var pt = parseFloat(cs.paddingTop) || 0;

      var cls = "sb-ln";
      if (selFrom > 0 && n >= selFrom && n <= selTo) cls += " sb-ln-selected";
      if (n === active) cls += " sb-ln-active";

      var d = document.createElement("div");
      d.className = cls;
      d.dataset.line = String(n);
      d.textContent = String(n);
      d.style.top = (r.top - sRect.top + pt) + "px";
      d.style.height = lh + "px";
      d.style.lineHeight = lh + "px";
      sig += n + cls + d.style.top + d.style.height + ";";
      frag.appendChild(d);
    }
    // Only touch the DOM when something actually changed (prevents flicker)
    if (sig !== lastSig) {
      overlay.replaceChildren(frag);
      lastSig = sig;
    }
  }

  function ensure() {
    var v = findView();
    // Don't tear down the gutter if the view is only momentarily unavailable
    if (!v && view && view.dom.isConnected) v = view;
    if (v !== view) {
      detach();
      if (v) attach(v);
    } else if (view && overlay && !overlay.isConnected) {
      view.dom.appendChild(overlay);
    }
    schedule();
  }

  timer = setInterval(ensure, 1000);
  ensure();

  w[KEY] = {
    toggle: function () {
      enabled = !enabled;
      try { localStorage.setItem(LS, enabled ? "on" : "off"); } catch (e) {}
      schedule();
      return enabled;
    },
    refresh: schedule,
    destroy: function () {
      clearInterval(timer);
      if (raf) cancelAnimationFrame(raf);
      detach();
      document.body.classList.remove("sb-ln-on");
      document.documentElement.style.removeProperty("--sb-ln-width");
      delete w[KEY];
    }
  };
})();
]]

local function win()
  return js.window or js.globalThis
end

local function install()
  local w = win()
  local ok = pcall(function()
    local doc = w.document
    local old = doc.getElementById("sb-line-numbers-script")
    if old then old.remove() end
    local s = doc.createElement("script")
    s.id = "sb-line-numbers-script"
    s.textContent = jsSource
    doc.head.appendChild(s)
  end)
  if not ok then
    -- Fallback in case script injection is blocked
    pcall(function() w.eval(jsSource) end)
  end
end

install()

command.define {
  name = "Line Numbers: Toggle",
  run = function()
    local ln = win()["__sbLineNumbers"]
    if not ln then
      install()
      ln = win()["__sbLineNumbers"]
    end
    if ln then ln.toggle() end
  end
}

event.listen {
  name = "editor:pageLoaded",
  run = function()
    local ln = win()["__sbLineNumbers"]
    if ln then ln.refresh() end
  end
}
```