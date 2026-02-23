---
name: "Library/Mr-xRed/FloatingCursorPosition"
tags: meta/library
pageDecoration.prefix: "📍 "
---

${widgets.commandButton("Cursor Position","Floating: Cursor Position")}

# Floating Cursor Position

A minimal floating widget that shows the current cursor position in the editor — line, column, and absolute character offset — updating in real time as you type or move the cursor. Draggable and persistent across sessions.

## Config & Defaults

```space-lua
config.set("FloatingCursorPos", {
    showCharOffset = true,
    showSelectionLength = true,
    recoverAfterRefresh = true
})
```

## Implementation

### Space-Style
```space-style

#sb-cursorpos-root {
    position: fixed;
    z-index: 101;
    font-family: var(--editor-font), monospace;
    user-select: none;
    touch-action: none;
}

html[data-theme="dark"] #sb-cursorpos-root {
    --cp-bg: oklch(0.2 0 0);
    --cp-border: oklch(0.8 0 0 / 0.6);
    --cp-text: oklch(0.95 0 0);
    --cp-label: oklch(0.95 0 0);
    --cp-accent: var(--ui-accent-color, oklch(0.65 0.18 200));
    --cp-sep: oklch(0.50 0 0);
}

html[data-theme="light"] #sb-cursorpos-root {
    --cp-bg: oklch(0.90 0 0);
    --cp-border: oklch(0.80 0 0);
    --cp-text: oklch(0.20 0 0);
    --cp-label: oklch(0.60 0 0);
    --cp-accent: var(--ui-accent-color, oklch(0.5 0.18 200));
    --cp-sep: oklch(0.90 0 0);
}

.cp-card {
    background: var(--cp-bg);
    color: var(--cp-text);
    border-radius: 12px;
    border: 1px solid var(--cp-border);
    box-shadow: 0 8px 24px oklch(0 0 0 / 0.18);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-width: 160px;
    position: relative;
}

.cp-titlebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 10px 6px 12px;
    border-bottom: 1px solid var(--cp-sep);
    cursor: grab;
}

.cp-titlebar:active {
    cursor: grabbing;
}

.cp-title {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--cp-label);
}

.cp-close {
    font-size: 0.9rem;
    cursor: pointer;
    color: var(--cp-label);
    line-height: 1;
    padding: 0 2px;
    transition: color 0.15s;
}

.cp-close:hover {
    color: var(--cp-text);
}

.cp-body {
    padding: 10px 14px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.cp-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 14px;
}

.cp-label-text {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--cp-label);
    flex-shrink: 0;
}

.cp-value {
    font-size: 0.95rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--cp-accent);
    text-align: right;
}

.cp-divider {
    height: 1px;
    background: var(--cp-sep);
    margin: 2px 0;
}

.cp-sel-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 14px;
}

.cp-sel-badge {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 1px 6px;
    border-radius: 4px;
    background: var(--cp-accent);
    color: var(--cp-bg);
    opacity: 0;
    transition: opacity 0.15s;
}

.cp-sel-badge.active {
    opacity: 1;
}

.cp-sel-value {
    font-size: 0.85rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--cp-text);
    text-align: right;
    opacity: 0;
    transition: opacity 0.15s;
}

.cp-sel-value.active {
    opacity: 1;
}

```

### Space-Lua
```space-lua
-- priority: -1
config.define("FloatingCursorPos", {
    type = "object",
    properties = {
        showCharOffset = { type = "boolean" },
        showSelectionLength = { type = "boolean" },
        recoverAfterRefresh = { type = "boolean" }
    }
})

function toggleCursorPos()
    local existing = js.window.document.getElementById("sb-cursorpos-root")
    if existing then
        if existing.style.display == "none" then
            existing.style.display = ""
            clientStore.set("cp_is_open", "true")
        else
            existing.style.display = "none"
            clientStore.set("cp_is_open", "false")
        end
        return
    end

    local cfg = config.get("FloatingCursorPos") or {}
    local show_offset = cfg.showCharOffset ~= false
    local show_sel = cfg.showSelectionLength ~= false

    local saved_top  = clientStore.get("cp_pos_top")  or "auto"
    local saved_left = clientStore.get("cp_pos_left") or "auto"
    local saved_bottom = (saved_top == "auto") and "20px" or "auto"
    local saved_right  = (saved_left == "auto") and "20px" or "auto"

    clientStore.set("cp_is_open", "true")

    local offset_row = ""
    if show_offset then
        offset_row = [[
        <div class="cp-row">
            <span class="cp-label-text">Offset</span>
            <span class="cp-value" id="cp-offset">—</span>
        </div>
        ]]
    end

    local sel_row = ""
    if show_sel then
        sel_row = [[
        <div class="cp-divider"></div>
        <div class="cp-sel-row">
            <span class="cp-sel-badge" id="cp-sel-badge">SEL</span>
            <span class="cp-sel-value" id="cp-sel-value">0 chars</span>
        </div>
        ]]
    end

    local container = js.window.document.createElement("div")
    container.id = "sb-cursorpos-root"
    container.innerHTML = [[
    <style>
        #sb-cursorpos-root {
            top:    ]] .. tostring(saved_top)    .. [[;
            left:   ]] .. tostring(saved_left)   .. [[;
            right:  ]] .. tostring(saved_right)  .. [[;
            bottom: ]] .. tostring(saved_bottom) .. [[;
        }
    </style>
    <div class="cp-card" id="cp-main-card">
        <div class="cp-titlebar" id="cp-drag-handle">
            <span class="cp-title">Cursor</span>
            <span class="cp-close" id="cp-close-btn">✕</span>
        </div>
        <div class="cp-body">
            <div class="cp-row">
                <span class="cp-label-text">Line</span>
                <span class="cp-value" id="cp-line">—</span>
            </div>
            <div class="cp-row">
                <span class="cp-label-text">Col</span>
                <span class="cp-value" id="cp-col">—</span>
            </div>
            ]] .. offset_row .. [[
            ]] .. sel_row .. [[
        </div>
    </div>
    ]]

    js.window.document.body.appendChild(container)

    local scriptEl = js.window.document.createElement("script")
    scriptEl.innerHTML = [[
    (function() {
        const root   = document.getElementById("sb-cursorpos-root");
        const card   = document.getElementById("cp-main-card");
        const handle = document.getElementById("cp-drag-handle");

        const SNAP       = 12;
        const TOP_OFFSET = 60;

        // ── Dragging ──────────────────────────────────────────────
        handle.onpointerdown = (e) => {
            if (e.target.id === "cp-close-btn") return;
            document.body.classList.add("sb-dragging-active");
            handle.setPointerCapture(e.pointerId);
            let sX = e.clientX - root.offsetLeft;
            let sY = e.clientY - root.offsetTop;

            const move = (m) => {
                let nL = m.clientX - sX;
                let nT = m.clientY - sY;
                const w = root.offsetWidth, h = root.offsetHeight;
                nL = Math.max(0, Math.min(nL, window.innerWidth - w));
                nT = Math.max(TOP_OFFSET, Math.min(nT, window.innerHeight - h));
                root.style.left   = nL + "px";
                root.style.top    = nT + "px";
                root.style.right  = "auto";
                root.style.bottom = "auto";
            };

            const up = () => {
                document.body.classList.remove("sb-dragging-active");
                handle.removeEventListener("pointermove", move);
                window.dispatchEvent(new CustomEvent("cp-save-pos", {
                    detail: { top: root.style.top, left: root.style.left }
                }));
            };

            handle.addEventListener("pointermove", move);
            handle.addEventListener("pointerup", up, { once: true });
        };

        // ── Close ─────────────────────────────────────────────────
        document.getElementById("cp-close-btn").onclick = () => {
            root.style.display = "none";
            window.dispatchEvent(new CustomEvent("cp-close-ui"));
        };

        // ── Poll trigger: ask Lua to read cursor & push back ──────
        function triggerPoll() {
            window.dispatchEvent(new CustomEvent("cp-poll"));
        }

        // Listen to editor interactions
        document.addEventListener("keyup",   triggerPoll);
        document.addEventListener("mouseup", triggerPoll);
        document.addEventListener("keydown", triggerPoll);

        // Fallback polling every 300 ms (catches programmatic moves)
        setInterval(triggerPoll, 300);

        window.addEventListener("resize", () => {
            const rect = root.getBoundingClientRect();
            let l = rect.left, t = rect.top;
            if (l < 0) l = 0;
            if (t < TOP_OFFSET) t = TOP_OFFSET;
            if (l + rect.width > window.innerWidth)  l = window.innerWidth  - rect.width;
            if (t + rect.height > window.innerHeight) t = window.innerHeight - rect.height;
            root.style.left = l + "px";
            root.style.top  = t + "px";
            root.style.right  = "auto";
            root.style.bottom = "auto";
        });

        // Initial read
        triggerPoll();

        // Clamp on load
        setTimeout(() => {
            const rect = root.getBoundingClientRect();
            if (rect.bottom > window.innerHeight) {
                root.style.top    = (window.innerHeight - rect.height - 10) + "px";
                root.style.bottom = "auto";
            }
        }, 80);
    })();
    ]]
    container.appendChild(scriptEl)
end

-- ── Lua-side: handle the poll event ──────────────────────────────────
js.window.addEventListener("cp-poll", function()
    local root = js.window.document.getElementById("sb-cursorpos-root")
    if not root or root.style.display == "none" then return end

    -- Cursor offset
    local ok_cur, cursor = pcall(editor.getCursor)
    if not ok_cur then return end

    -- Current line info
    local ok_line, line_info = pcall(editor.getCurrentLine)
    if not ok_line then return end

    -- Full text (needed for line number)
    local ok_text, full_text = pcall(editor.getText)
    if not ok_text then return end

    -- Compute line number by counting newlines before line_info.from
    local before_line = full_text:sub(1, line_info.from)
    local line_num = 0
    for _ in before_line:gmatch("\n") do line_num = line_num + 1 end
    line_num = line_num + 1

    -- Column (1-based)
    local col = cursor - line_info.from + 1

    -- Update DOM
    local lineEl = js.window.document.getElementById("cp-line")
    local colEl  = js.window.document.getElementById("cp-col")
    if lineEl then lineEl.innerText = tostring(line_num) end
    if colEl  then colEl.innerText  = tostring(col)      end

    local offsetEl = js.window.document.getElementById("cp-offset")
    if offsetEl then offsetEl.innerText = tostring(cursor) end

    -- Selection
    local ok_sel, sel = pcall(editor.getSelection)
    if ok_sel and sel then
        local sel_len = math.abs(sel.to - sel.from)
        local badge = js.window.document.getElementById("cp-sel-badge")
        local selVal = js.window.document.getElementById("cp-sel-value")
        if badge and selVal then
            if sel_len > 0 then
                badge.className = "cp-sel-badge active"
                selVal.className = "cp-sel-value active"
                selVal.innerText = tostring(sel_len) .. " ch"
            else
                badge.className = "cp-sel-badge"
                selVal.className = "cp-sel-value"
            end
        end
    end
end)

-- ── Persistence listeners ─────────────────────────────────────────────
js.window.addEventListener("cp-save-pos", function(e)
    clientStore.set("cp_pos_top",  e.detail.top)
    clientStore.set("cp_pos_left", e.detail.left)
end)

js.window.addEventListener("cp-close-ui", function()
    clientStore.set("cp_is_open", "false")
end)

-- ── Recovery on page load ─────────────────────────────────────────────
function restoreCursorPosOnLoad()
    local cfg = config.get("FloatingCursorPos") or {}
    if cfg.recoverAfterRefresh == false then return end

    local isOpen = clientStore.get("cp_is_open")
    local existing = js.window.document.getElementById("sb-cursorpos-root")

    if isOpen == "true" and not existing then
        toggleCursorPos()
    end
end

event.listen { name = "editor:pageLoaded", run = function() restoreCursorPosOnLoad() end }

command.define {
    name = "Floating: Cursor Position",
    run  = function() toggleCursorPos() end
}
```

## How It Works

The widget uses a **JS → Lua bridge** to read cursor data without polling from the page directly:

1. The injected JavaScript listens for `keyup`, `mouseup`, and `keydown` events on the document, then fires a custom `cp-poll` event on `window`.
2. A Lua listener catches `cp-poll`, calls `editor.getCursor()`, `editor.getCurrentLine()`, and `editor.getText()` (for line counting), then pushes the results back into the DOM via `js.window.document.getElementById`.
3. A 300 ms `setInterval` fallback ensures the display stays current after programmatic cursor moves (e.g. navigation commands).

## Fields

| Field | Description |
|---|---|
| **Line** | 1-based line number |
| **Col** | 1-based column within the line |
| **Offset** | Absolute character offset from the start of the document |
| **SEL** | Appears when text is selected; shows the selection length in characters |