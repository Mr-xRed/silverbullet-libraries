---
name: "Library/Mr-xRed/FormattingToolbar"
tags: meta/library
pageDecoration.prefix: "✏️ "
---

# Formatting Toolbar 

This library introduces a context-sensitive formatting toolbar that materialises only when you select text, providing quick access to functions such as Bold, Italic, Strikethrough, Blockquotes, etc. It manages to be quite helpful without cluttering your screen.

```lua
config.set("FormattingToolbar", {
    enabled = true,
    debug   = false,
    showBold = true,
    showItalic = true,
    showStrike = true,
    showMark = true,
    showSuper = true,
    showSub = true,
    showCode = true,
    showQuote = true,
    showBullet = true,
    showNumber = true,
    showTask = true
})
```
# 
## Implementation
### Space-Style
```space-style
/* -- Theme tokens ------------------------------------------------------- */

html[data-theme="dark"] #sb-fmttb-wrap {
    --fmttb-bg:         oklch(0.14 0.01 270 / 0.95);
    --fmttb-border:     oklch(1 0 0 / 0.12);
    --fmttb-text:       oklch(0.88 0 0);
    --fmttb-hover-bg:   oklch(1 0 0 / 0.10);
    --fmttb-active-bg:  oklch(1 0 0 / 0.20);
    --fmttb-sep:        oklch(1 0 0 / 0.13);
    --fmttb-drop-shadow: drop-shadow(0 8px 20px oklch(0 0 0 / 0.5));
}

html[data-theme="light"] #sb-fmttb-wrap {
    --fmttb-bg:         oklch(0.99 0 0 / 0.97);
    --fmttb-border:     oklch(0 0 0 / 0.12);
    --fmttb-text:       oklch(0.18 0 0);
    --fmttb-hover-bg:   oklch(0 0 0 / 0.06);
    --fmttb-active-bg:  oklch(0 0 0 / 0.13);
    --fmttb-sep:        oklch(0 0 0 / 0.12);
    --fmttb-drop-shadow: drop-shadow(0 4px 12px oklch(0 0 0 / 0.15));
}

/* -- Toolbar Container -------------------------------------------------- */

#sb-fmttb-wrap {
    position: fixed;
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 5px 7px;
    border-radius: 10px;
    border: 1px solid var(--fmttb-border);
    background: var(--fmttb-bg);
    backdrop-filter: blur(14px) saturate(1.6);
    -webkit-backdrop-filter: blur(14px) saturate(1.6);
    /* Unified shadow for both bubble and arrow */
    filter: var(--fmttb-drop-shadow);
    user-select: none;
    pointer-events: all;
    touch-action: none;
    opacity: 0;
    transform: translateY(6px) scale(0.96);
    visibility: hidden;
    transition:
        opacity    0.12s ease,
        transform  0.12s ease,
        visibility 0s   linear 0.12s;
    will-change: transform, opacity;
}

#sb-fmttb-wrap.sb-fmttb-on {
    opacity: 1;
    transform: translateY(0) scale(1);
    visibility: visible;
    transition:
        opacity    0.12s ease,
        transform  0.12s ease,
        visibility 0s   linear 0s;
}

/* -- Buttons ------------------------------------------------------------ */

.sb-fmttb-btn {
    background: transparent;
    border: none;
    color: var(--fmttb-text);
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.1s, transform 0.08s;
}

.sb-fmttb-btn:hover  { background: var(--fmttb-hover-bg); }
.sb-fmttb-btn:active { background: var(--fmttb-active-bg); transform: scale(0.9); }
.sb-fmttb-btn svg { display: block; pointer-events: none; }

.sb-fmttb-sep {
    width: 1px;
    height: 16px;
    background: var(--fmttb-sep);
    margin: 0 2px;
    flex-shrink: 0;
}

/* -- Tethered Arrow ----------------------------------------------------- */

#sb-fmttb-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    pointer-events: none;
}

/* Arrow pointing down (Toolbar is ABOVE text) */
#sb-fmttb-wrap.sb-arr-down #sb-fmttb-arrow {
    top: 100%;
    border-top: 7px solid var(--fmttb-bg);
    border-bottom: none;
    margin-top: -0.5px; /* overlap to hide seam */
}

/* Arrow pointing up (Toolbar is BELOW text) */
#sb-fmttb-wrap.sb-arr-up #sb-fmttb-arrow {
    bottom: 100%;
    border-bottom: 7px solid var(--fmttb-bg);
    border-top: none;
    margin-bottom: -0.5px;
}




```
### Space-Lua
```space-lua
-- priority: -1

config.define("FormattingToolbar", {
    type = "object",
    properties = {
        enabled = { type = "boolean" },
        debug   = { type = "boolean" },
        showBold = { type = "boolean" },
        showItalic = { type = "boolean" },
        showStrike = { type = "boolean" },
        showMark = { type = "boolean" },
        showSuper = { type = "boolean" },
        showSub = { type = "boolean" },
        showCode = { type = "boolean" },
        showQuote = { type = "boolean" },
        showBullet = { type = "boolean" },
        showNumber = { type = "boolean" },
        showTask = { type = "boolean" }
    }
})

local fmttb_showing = false

function fmttb_normalize_sel(raw)
    if not raw then return nil end
    local f = math.min(raw.from, raw.to)
    local t = math.max(raw.from, raw.to)
    if f == t then return nil end
    return { from = f, to = t }
end

function fmttb_split_lines(text)
    local lines = {}
    local remaining = text
    while true do
        local nl = remaining:find("\n")
        if nl then
            table.insert(lines, remaining:sub(1, nl - 1))
            remaining = remaining:sub(nl + 1)
        else
            table.insert(lines, remaining)
            break
        end
    end
    return lines
end

function fmttb_get_line_range(full, sel)
    if not sel or sel.from >= sel.to then return nil, nil, nil end
    local doc_len = #full
    local from_lua = sel.from + 1
    
    local line_from_lua = from_lua
    while line_from_lua > 1 do
        local prev = full:sub(line_from_lua - 1, line_from_lua - 1)
        if prev == "\n" then break end
        line_from_lua = line_from_lua - 1
    end
    
    local line_to_lua = sel.to
    if line_to_lua > 0 and line_to_lua <= doc_len then
        if full:sub(line_to_lua, line_to_lua) == "\n" then
            line_to_lua = line_to_lua - 1
        end
    end
    
    while line_to_lua < doc_len do
        local next_char = full:sub(line_to_lua + 1, line_to_lua + 1)
        if next_char == "\n" then break end
        line_to_lua = line_to_lua + 1
    end
    
    local line_from_cm = line_from_lua - 1
    local line_to_cm   = line_to_lua
    if line_from_cm > line_to_cm then return nil, nil, nil end
    return line_from_cm, line_to_cm, full:sub(line_from_lua, line_to_lua)
end

function fmttb_get_len(text)
    if utf8 and utf8.len then
        local ok, len = pcall(utf8.len, text)
        if ok and len then return len end
    end
    return #text
end

-- -- Custom toggle commands ----------------------------------------------------

function fmttb_toggle_inline(marker)
    local ok_sel, raw_sel = pcall(editor.getSelection)
    local sel = fmttb_normalize_sel(raw_sel)
    local ok_txt, full = pcall(editor.getText)
    if not (sel and ok_txt) then return end
    
    local selected_text = full:sub(sel.from + 1, sel.to)
    local m_len = #marker
    
    local start_match = selected_text:sub(1, m_len) == marker
    local end_match = selected_text:sub(-m_len) == marker
    
    if start_match and end_match then
        local inner = selected_text:sub(m_len + 1, -m_len - 1)
        editor.replaceRange(sel.from, sel.to, inner)
        editor.setSelection(sel.from, sel.from + fmttb_get_len(inner))
    else
        local new_text = marker .. selected_text .. marker
        editor.replaceRange(sel.from, sel.to, new_text)
        editor.setSelection(sel.from, sel.from + fmttb_get_len(new_text))
    end
end

command.define {
    name = "Text: Toggle Superscript",
    run = function() fmttb_toggle_inline("^") end
}

command.define {
    name = "Text: Toggle Subscript",
    run = function() fmttb_toggle_inline("~") end
}

command.define {
    name = "Text: Toggle Code",
    run = function() fmttb_toggle_inline("`") end
}

command.define {
    name = "Text: Toggle Bullet List",
    run = function()
        local ok_sel, raw_sel = pcall(editor.getSelection)
        local sel = fmttb_normalize_sel(raw_sel)
        local ok_txt, full = pcall(editor.getText)
        if not (sel and ok_txt) then return end
        local lf, lt, block = fmttb_get_line_range(full, sel)
        if not lf then return end
        
        local lines = fmttb_split_lines(block)
        local all_are_bullets = true
        for _, l in ipairs(lines) do
            if l ~= "" then
                local is_bullet = l:match("^%- ")
                if not is_bullet then
                    all_are_bullets = false
                    break
                end
            end
        end
        
        local nl = {}
        for _, l in ipairs(lines) do
            local s = l
            if all_are_bullets then
                s = (l:gsub("^%- ", ""))
            else
                if l ~= "" then
                    s = (l:gsub("^%- ", ""))
                    s = "- " .. s
                end
            end
            table.insert(nl, s)
        end
        
        local new_block = table.concat(nl, "\n")
        editor.replaceRange(lf, lt, new_block)
        editor.setSelection(lf, lf + fmttb_get_len(new_block))
    end
}

command.define {
    name = "Text: Toggle Numbered List",
    run = function()
        local ok_sel, raw_sel = pcall(editor.getSelection)
        local sel = fmttb_normalize_sel(raw_sel)
        local ok_txt, full = pcall(editor.getText)
        if not (sel and ok_txt) then return end
        local lf, lt, block = fmttb_get_line_range(full, sel)
        if not lf then return end
        
        local lines = fmttb_split_lines(block)
        local all_are_numbered = true
        for _, l in ipairs(lines) do
            if l ~= "" then
                local is_numbered = l:match("^%d+%. ")
                if not is_numbered then
                    all_are_numbered = false
                    break
                end
            end
        end
        
        local nl = {}
        local count = 1
        for _, l in ipairs(lines) do
            local s = l
            if all_are_numbered then
                s = (l:gsub("^%d+%. ", ""))
            else
                if l ~= "" then
                    s = (l:gsub("^%d+%. ", ""))
                    s = (s:gsub("^%- ", ""))
                    s = (s:gsub("^%- %[.%] ", ""))
                    s = count .. ". " .. s
                    count = count + 1
                end
            end
            table.insert(nl, s)
        end
        
        local new_block = table.concat(nl, "\n")
        editor.replaceRange(lf, lt, new_block)
        editor.setSelection(lf, lf + fmttb_get_len(new_block))
    end
}

command.define {
    name = "Text: Toggle Task",
    run = function()
        local ok_sel, raw_sel = pcall(editor.getSelection)
        local sel = fmttb_normalize_sel(raw_sel)
        local ok_txt, full = pcall(editor.getText)
        if not (sel and ok_txt) then return end
        local lf, lt, block = fmttb_get_line_range(full, sel)
        if not lf then return end
        
        local lines = fmttb_split_lines(block)
        local all_are_tasks = true
        for _, l in ipairs(lines) do
            if l ~= "" then
                local is_task = l:match("^%- %[.%] ")
                if not is_task then
                    all_are_tasks = false
                    break
                end
            end
        end
        
        local nl = {}
        for _, l in ipairs(lines) do
            local s = l
            if all_are_tasks then
                s = (l:gsub("^%- %[.%] ", ""))
            else
                if l ~= "" then
                    s = (l:gsub("^%- %[.%] ", ""))
                    s = (s:gsub("^%- ", ""))
                    s = (s:gsub("^%d+%. ", ""))
                    s = "- [ ] " .. s
                end
            end
            table.insert(nl, s)
        end
        
        local new_block = table.concat(nl, "\n")
        editor.replaceRange(lf, lt, new_block)
        editor.setSelection(lf, lf + fmttb_get_len(new_block))
    end
}

command.define {
    name = "Text: Toggle Quote",
    run = function()
        local ok_sel, raw_sel = pcall(editor.getSelection)
        local sel = fmttb_normalize_sel(raw_sel)
        local ok_txt, full = pcall(editor.getText)
        if not (sel and ok_txt) then return end
        local lf, lt, block = fmttb_get_line_range(full, sel)
        if not lf then return end
        
        local lines = fmttb_split_lines(block)
        local all_are_quotes = true
        for _, l in ipairs(lines) do
            if l ~= "" then
                local is_quote = l:match("^%> ")
                if not is_quote then
                    all_are_quotes = false
                    break
                end
            end
        end
        
        local nl = {}
        for _, l in ipairs(lines) do
            local s = l
            if all_are_quotes then
                s = (l:gsub("^%> ", ""))
            else
                if l ~= "" then
                    s = (l:gsub("^%> ", ""))
                    s = "> " .. s
                end
            end
            table.insert(nl, s)
        end
        
        local new_block = table.concat(nl, "\n")
        editor.replaceRange(lf, lt, new_block)
        editor.setSelection(lf, lf + fmttb_get_len(new_block))
    end
}

-- -- DOM Construction ---------------------------------------------------------

function buildFormattingToolbar()
    if js.window.document.getElementById("sb-fmttb-wrap") then return end

    local cfg = config.get("FormattingToolbar") or {}

    local icons = {
        bold    = [[<svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h9a4 4 0 0 1 0 8H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"></path></svg>]],
        italic  = [[<svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>]],
        strike  = [[<svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4"></path><path d="M14 12a4 4 0 0 1 0 8H6"></path><line x1="4" y1="12" x2="20" y2="12"></line></svg>]],
        marker  = [[<svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h9l3-3"></path><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"></path></svg>]],
        super   = [[<svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-superscript-icon lucide-superscript"><path d="m4 19 8-8"/><path d="m12 19-8-8"/><path d="M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06"/></svg>]],
        sub     = [[<svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-subscript-icon lucide-subscript"><path d="m4 5 8 8"/><path d="m12 5-8 8"/><path d="M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"/></svg>]],
        code    = [[<svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>]],
        quote   = [[<svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1 0 2.5 0 5-2 5"></path><path d="M11 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1 0 2.5 0 5-2 5"></path></svg>]],
        bullet  = [[<svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>]],
        number  = [[<svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>]],
        task    = [[<svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="m9 11 3 3L22 4"></path></svg>]]
    }

    local buttons = {
        { i=icons.bold,   t="Bold",   c="Text: Bold" },
        { i=icons.italic, t="Italic", c="Text: Italic" },
        { i=icons.strike, t="Strike", c="Text: Strikethrough" },
        { i=icons.marker, t="Mark",   c="Text: Marker" },
        { i=icons.super,  t="Super",  c="Text: Toggle Superscript" },
        { i=icons.sub,    t="Sub",    c="Text: Toggle Subscript" },
        { i=icons.code,   t="Code",   c="Text: Toggle Code" },
        { divider=true },
        { i=icons.quote,  t="Quote",  c="Text: Toggle Quote" },
        { i=icons.bullet, t="Bullet", c="Text: Toggle Bullet List" },
        { i=icons.number, t="Number", c="Text: Toggle Numbered List" },
        { i=icons.task,   t="Task",   c="Text: Toggle Task" },
    }

    local html = ""
    local last_was_divider = true
    local pending_divider = false

    for _, item in ipairs(buttons) do
        if item.divider then
            pending_divider = true
        else
            local key = "show" .. item.t
            if cfg[key] ~= false then
                if pending_divider and not last_was_divider then
                    html = html .. '<div class="sb-fmttb-sep"></div>'
                end
                html = html .. '<button class="sb-fmttb-btn" title="' .. item.t .. '" data-cmd="' .. item.c .. '">' .. item.i .. '</button>'
                last_was_divider = false
                pending_divider = false
            end
        end
    end
    html = html .. '<div id="sb-fmttb-arrow"></div>'

    local toolbar = js.window.document.createElement("div")
    toolbar.id = "sb-fmttb-wrap"
    toolbar.innerHTML = html
    js.window.document.body.appendChild(toolbar)

    local scriptEl = js.window.document.createElement("script")
    scriptEl.id = "sb-fmttb-script"
    scriptEl.innerHTML = [[
(function () {
    var MARGIN = 12, GAP = 8, TOP_G = 64;

    function getRect() {
        var nSel = window.getSelection();
        if (nSel && nSel.rangeCount > 0 && !nSel.isCollapsed) {
            var r = nSel.getRangeAt(0).getBoundingClientRect();
            if (r && r.height > 0) return r;
        }
        var bgs = document.querySelectorAll(".cm-selectionBackground");
        if (bgs.length > 0) {
            var t = 9999, b = -9999, l = 9999, r = -9999;
            bgs.forEach(function (el) {
                var rect = el.getBoundingClientRect();
                if (rect.height > 0) {
                    t = Math.min(t, rect.top); b = Math.max(b, rect.bottom);
                    l = Math.min(l, rect.left); r = Math.max(r, rect.right);
                }
            });
            return t < 9999 ? { top: t, bottom: b, left: l, right: r, width: r - l, height: b - t } : null;
        }
        return null;
    }

    function update() {
        var tb = document.getElementById("sb-fmttb-wrap");
        var ar = document.getElementById("sb-fmttb-arrow");
        if (!tb || tb.getAttribute("data-on") !== "1") return;

        var r = getRect();
        if (!r) return;

        var tw = tb.offsetWidth, th = tb.offsetHeight;
        var top = r.top - th - GAP;
        var left = r.left + r.width / 2 - tw / 2;
        var below = top < (TOP_G + MARGIN);

        if (below) top = r.bottom + GAP;
        left = Math.max(MARGIN, Math.min(left, window.innerWidth - tw - MARGIN));
        
        tb.style.top = Math.round(top) + "px";
        tb.style.left = Math.round(left) + "px";
        tb.className = below ? "sb-arr-up sb-fmttb-on" : "sb-arr-down sb-fmttb-on";

        if (ar) {
            var ax = Math.round(r.left + r.width / 2 - left - 7);
            ar.style.left = Math.max(8, Math.min(ax, tw - 22)) + "px";
        }
    }

    setInterval(function() {
        var tb = document.getElementById("sb-fmttb-wrap");
        if (!tb) return;
        if (tb.getAttribute("data-on") === "1") update();
        else tb.classList.remove("sb-fmttb-on");
    }, 100);

    function poll() { window.dispatchEvent(new CustomEvent("fmttb-poll")); }
    ["selectionchange", "mouseup", "touchend", "keyup", "scroll"].forEach(ev => {
        (ev === "scroll" ? (document.querySelector(".cm-scroller") || document) : document)
        .addEventListener(ev, poll, {passive: true});
    });

    document.addEventListener("mousedown", function(e) {
        var b = e.target.closest("#sb-fmttb-wrap [data-cmd]");
        if (!b) return; e.preventDefault(); e.stopPropagation();
        window.dispatchEvent(new CustomEvent("fmttb-cmd", {detail:{command:b.getAttribute("data-cmd")}}));
    });
})();
    ]]
    js.window.document.body.appendChild(scriptEl)
end

function destroyFormattingToolbar()
    for _, id in ipairs({ "sb-fmttb-wrap", "sb-fmttb-script" }) do
        local el = js.window.document.getElementById(id)
        if el then el.remove() end
    end
end

js.window.addEventListener("fmttb-poll", function()
    local toolbar = js.window.document.getElementById("sb-fmttb-wrap")
    if not toolbar then return end
    local ok, sel = pcall(editor.getSelection)
    toolbar.setAttribute("data-on", (ok and sel and math.abs(sel.to - sel.from) > 0) and "1" or "0")
end)

js.window.addEventListener("fmttb-cmd", function(e)
    editor.invokeCommand(e.detail.command)
end)

command.define {
    name = "Text: Formatting Toolbar",
    run  = function()
        if js.window.document.getElementById("sb-fmttb-wrap") then
            destroyFormattingToolbar()
          clientStore.set("fmttb_enabled", "false")
        else
            buildFormattingToolbar()
            clientStore.set("fmttb_enabled", "true")
        end
    end
}

event.listen { name = "editor:pageLoaded", run = function()
    local cfg = config.get("FormattingToolbar") or {}
    if cfg.enabled ~= false and clientStore.get("fmttb_enabled") ~= "false" then
        buildFormattingToolbar()
    end
end }



```
## Discussions to this library
 * [Silverbullet Community](https://community.silverbullet.md/t/formatting-toolbar-for-selections/4010?u=mr.red)
