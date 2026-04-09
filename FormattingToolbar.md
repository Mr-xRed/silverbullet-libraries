---
name: "Library/Mr-xRed/FormattingToolbar"
tags: meta/library
pageDecoration.prefix: "✏️ "
---

# Formatting Toolbar

This library introduces a context-sensitive formatting toolbar that materialises only when you select text, providing quick access to functions such as **Bold**, _Italic_, ~~Strikethrough~~, `Blockquotes`, etc. It manages to be quite helpful without cluttering your screen.

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
    showTask = true,
    showH1 = true,
    showH2 = true,
    showH3 = true,
    showH4 = true,
    showH5 = true,
    showH6 = true
})
```

## Implementation

### Space-Style

```space-style
/* -- Theme tokens ------------------------------------------------------- */

html[data-theme="dark"] #sb-fmttb-wrap {
    --fmttb-bg:         oklch(0.14 0.01 270);
    --fmttb-border:     oklch(0.45 0 0);
    --fmttb-text:       oklch(0.88 0 0);
    --fmttb-hover-bg:   oklch(1 0 0 / 0.10);
    --fmttb-active-bg:  oklch(1 0 0 / 0.20);
    --fmttb-on-bg:      oklch(0.62 0.14 255 / 0.32);
    --fmttb-on-dot:     oklch(0.75 0.18 255);
    --fmttb-sep:        oklch(1 0 0 / 0.20);
    --fmttb-drop-shadow: drop-shadow(0 8px 20px oklch(0 0 0 / 0.5));
}

html[data-theme="light"] #sb-fmttb-wrap {
    --fmttb-bg:         oklch(0.99 0 0);
    --fmttb-border:     oklch(0.8 0 0);
    --fmttb-text:       oklch(0.18 0 0);
    --fmttb-hover-bg:   oklch(0 0 0 / 0.06);
    --fmttb-active-bg:  oklch(0 0 0 / 0.13);
    --fmttb-on-bg:      oklch(0.55 0.12 255 / 0.12);
    --fmttb-on-dot:     oklch(0.45 0.18 255);
    --fmttb-sep:        oklch(0 0 0 / 0.20);
    --fmttb-drop-shadow: drop-shadow(0 4px 12px oklch(0 0 0 / 0.15));
}

/* -- Toolbar Container -------------------------------------------------- */

#sb-fmttb-wrap {
    position: fixed;
    z-index: 10000;
    display: flex;
    align-items: **center**er**;
    gap: 2px;
    padding: 4px;
    border-radius: 8px;
    border: 1px solid var(--fmttb-border);
    background: var(--fmttb-bg);
    backdrop-filter: blur(14px) saturate(1.6);
    -webkit-backdrop-filter: blur(14px) saturate(1.6);
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

/* -- Mobile Overrides --------------------------------------------------- */

#sb-fmttb-wrap.sb-fmttb-mobile {
    left: 0 !important;
    right: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    border-radius: 0 !important;
    border-left: none !important;
    border-right: none !important;
    border-bottom: none !important;
    padding: 8px 8px !important;
    overflow-x: auto !important;
    justify-content: flex-start !important;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    transform: none !important;
    touch-action: pan-x;   /* ← add this */
}

#sb-fmttb-wrap.sb-fmttb-mobile .sb-fmttb-btn {
    flex-shrink: 0;
    padding: 8px 8px;
}

#sb-fmttb-wrap.sb-fmttb-mobile .sb-fmttb-sep {
    flex-shrink: 0;
}

#sb-fmttb-wrap.sb-fmttb-mobile::-webkit-scrollbar {
    display: none;
}

#sb-fmttb-wrap.sb-fmttb-mobile .sb-fmttb-btn svg {width: 18fmttb-active::afterpx; height:18px;}

/* -- Buttons ------------------------------------------------------------ */

.sb-fmttb-btn {
    position: relative;
    background: transparent;
    border: none;
    color: var(--fmttb-text);
    cursor: pointer;
    padding: 8px 8px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.1s, transform 0.08s;
}

.sb-fmttb-btn:hover  { background: var(--fmttb-hover-bg); }
.sb-fmttb-btn:active { background: var(--fmttb-active-bg); transform: scale(0.9); }
.sb-fmttb-btn svg { display: block; pointer-events: none;}

/* -- Active / "formatting is on" state ---------------------------------- */

.sb-fmttb-btn.sb-fmttb-active {
    background: var(--fmttb-on-bg);
}

.sb-fmttb-btn.sb-fmttb-active::after {
    content: '';
    position: absolute;
    bottom: 3px;
    left: 50%;
    translate: -50% 0;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--fmttb-on-dot);
}

.sb-fmttb-sep {
    width: 1px;
    height: 20px;
    background: var(--fmttb-sep);
    align-self: center;
    margin: 0 2px;
    flex-shrink: 0;
}

/* -- Tethered Arrow ----------------------------------------------------- */

#sb-fmttb-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    pointer-events: none;
}

#sb-fmttb-wrap.sb-arr-down #sb-fmttb-arrow {
    top: 100%;
    border-top: 8px solid var(--fmttb-border);
    border-bottom: none;
    margin-top: 0px;
}

#sb-fmttb-wrap.sb-arr-up #sb-fmttb-arrow {
    bottom: 100%;
    border-bottom: 8px solid var(--fmttb-border);
    border-top: none;
    margin-bottom: 0px;
}

/* Inner (bg-coloured) triangle — sits on top, leaving 1 px border on the two slanted edges */
#sb-fmttb-arrow::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
}

#sb-fmttb-wrap.sb-arr-down #sb-fmttb-arrow::after {
    border-top: 7px solid var(--fmttb-bg);
    border-bottom: none;
    top: -8px;
    left: -7px;
}

#sb-fmttb-wrap.sb-arr-up #sb-fmttb-arrow::after {
    border-bottom: 7px solid var(--fmttb-bg);
    border-top: none;
    top: 1px;
    left: -7px;
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
        showTask = { type = "boolean" },
        showH1 = { type = "boolean" },
        showH2 = { type = "boolean" },
        showH3 = { type = "boolean" },
        showH4 = { type = "boolean" },
        showH5 = { type = "boolean" },
        showH6 = { type = "boolean" }
    }
})

-- ============================================================
-- Marker / command registry
-- Order matters: longer markers must appear before shorter ones
-- so that "~~" is tested before "~", "**" before "*", etc.
-- ============================================================

local FMTTB_ALL_MARKERS = { "**", "~~", "==", "_", "^", "~", "`" }

-- Maps command name → marker string (only for inline-wrap commands)
local FMTTB_CMD_TO_MARKER = {
    ["Text: Bold"]               = "**",
    ["Text: Italic"]             = "_",
    ["Text: Strikethrough"]      = "~~",
    ["Text: Marker"]             = "==",
    ["Text: Toggle Superscript"] = "^",
    ["Text: Toggle Subscript"]   = "~",
    ["Text: Toggle Code"]        = "`",
}

-- Ordered list used for active-state detection
local FMTTB_MARKER_CMD = {
    { marker = "**", cmd = "Text: Bold"               },
    { marker = "_",  cmd = "Text: Italic"             },
    { marker = "~~", cmd = "Text: Strikethrough"      },
    { marker = "==", cmd = "Text: Marker"             },
    { marker = "^",  cmd = "Text: Toggle Superscript" },
    { marker = "~",  cmd = "Text: Toggle Subscript"   },
    { marker = "`",  cmd = "Text: Toggle Code"        },
}

local fmttb_showing = false

-- ============================================================
-- Utility helpers
-- ============================================================

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

-- ============================================================
-- Marker scanning — outward (beyond the selection edges)
-- ============================================================

function fmttb_scan_outward(full, cm_from, cm_to)
    local left_markers  = {}
    local right_markers = {}

    local pos = cm_from
    while pos > 0 do
        local found = false
        for _, m in ipairs(FMTTB_ALL_MARKERS) do
            local mlen = #m
            if pos >= mlen then
                local chunk = full:sub(pos - mlen + 1, pos)
                if chunk == m then
                    table.insert(left_markers, m)
                    pos = pos - mlen
                    found = true
                    break
                end
            end
        end
        if not found then break end
    end

    local pos2    = cm_to + 1
    local doc_len = #full
    while pos2 <= doc_len do
        local found = false
        for _, m in ipairs(FMTTB_ALL_MARKERS) do
            local mlen = #m
            if pos2 + mlen - 1 <= doc_len then
                local chunk = full:sub(pos2, pos2 + mlen - 1)
                if chunk == m then
                    table.insert(right_markers, m)
                    pos2 = pos2 + mlen
                    found = true
                    break
                end
            end
        end
        if not found then break end
    end

    return left_markers, right_markers
end

-- ============================================================
-- Marker scanning — inward (from the edges of the selected text)
-- ============================================================

function fmttb_scan_inward(selected_text)
    local left_markers  = {}
    local right_markers = {}
    local text_len = #selected_text

    local pos = 1
    while pos <= text_len do
        local found = false
        for _, m in ipairs(FMTTB_ALL_MARKERS) do
            local mlen = #m
            if pos + mlen - 1 <= text_len then
                local chunk = selected_text:sub(pos, pos + mlen - 1)
                if chunk == m then
                    table.insert(left_markers, m)
                    pos = pos + mlen
                    found = true
                    break
                end
            end
        end
        if not found then break end
    end

    local pos2 = text_len
    while pos2 > 0 do
        local found = false
        for _, m in ipairs(FMTTB_ALL_MARKERS) do
            local mlen = #m
            if pos2 - mlen + 1 >= 1 then
                local chunk = selected_text:sub(pos2 - mlen + 1, pos2)
                if chunk == m then
                    table.insert(right_markers, m)
                    pos2 = pos2 - mlen
                    found = true
                    break
                end
            end
        end
        if not found then break end
    end

    return left_markers, right_markers
end

-- ============================================================
-- Active-marker detection
-- ============================================================

function fmttb_detect_active_markers(full, sel)
    local selected_text = full:sub(sel.from + 1, sel.to)
    local lo, ro = fmttb_scan_outward(full, sel.from, sel.to)
    local li, ri = fmttb_scan_inward(selected_text)

    local function has(list, m)
        for _, v in ipairs(list) do
            if v == m then return true end
        end
        return false
    end

    local active_cmds = {}
    for _, item in ipairs(FMTTB_MARKER_CMD) do
        local m = item.marker
        local left_has  = has(lo, m) or has(li, m)
        local right_has = has(ro, m) or has(ri, m)
        if left_has and right_has then
            table.insert(active_cmds, item.cmd)
        end
    end

    return table.concat(active_cmds, ",")
end

-- ============================================================
-- Smart selection expansion
-- ============================================================

function fmttb_expand_for_marker(marker, sel, full)
    local m_len        = #marker
    local selected_text = full:sub(sel.from + 1, sel.to)

    if #selected_text >= 2 * m_len
        and selected_text:sub(1, m_len)  == marker
        and selected_text:sub(-m_len)    == marker then
        return
    end

    local left_expand = 0
    local pos         = sel.from
    local found_left  = false
    while pos > 0 do
        local found = false
        for _, m in ipairs(FMTTB_ALL_MARKERS) do
            local mlen = #m
            if pos >= mlen and full:sub(pos - mlen + 1, pos) == m then
                left_expand = left_expand + mlen
                pos         = pos - mlen
                if m == marker then found_left = true end
                found = true
                break
            end
        end
        if found_left or not found then break end
    end

    local right_expand = 0
    local pos2         = sel.to + 1
    local doc_len      = #full
    local found_right  = false
    while pos2 <= doc_len do
        local found = false
        for _, m in ipairs(FMTTB_ALL_MARKERS) do
            local mlen = #m
            if pos2 + mlen - 1 <= doc_len and full:sub(pos2, pos2 + mlen - 1) == m then
                right_expand = right_expand + mlen
                pos2         = pos2 + mlen
                if m == marker then found_right = true end
                found = true
                break
            end
        end
        if found_right or not found then break end
    end

    if found_left and found_right then
        editor.setSelection(sel.from - left_expand, sel.to + right_expand)
    end
end

-- ============================================================
-- Custom toggle commands
-- ============================================================

function fmttb_toggle_inline(marker)
    local ok_sel, raw_sel = pcall(editor.getSelection)
    local sel = fmttb_normalize_sel(raw_sel)
    local ok_txt, full = pcall(editor.getText)
    if not (sel and ok_txt) then return end

    local selected_text = full:sub(sel.from + 1, sel.to)
    local m_len = #marker

    local start_match = selected_text:sub(1, m_len) == marker
    local end_match   = selected_text:sub(-m_len)   == marker

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

-- ============================================================
-- Heading toggle helper and commands (H1–H6)
-- ============================================================

function fmttb_toggle_heading(level)
    local ok_sel, raw_sel = pcall(editor.getSelection)
    local sel = fmttb_normalize_sel(raw_sel)
    local ok_txt, full = pcall(editor.getText)
    if not (sel and ok_txt) then return end
    local lf, lt, block = fmttb_get_line_range(full, sel)
    if not lf then return end

    -- Build prefix for this heading level, e.g. "## " for level 2
    local prefix = string.rep("#", level) .. " "
    -- Detection pattern: exactly N hashes followed by a space
    -- (^# " won't match "## " because char 2 would be # not space)
    local detect_pat = "^" .. string.rep("#", level) .. " "
    -- Strip pattern: any run of hashes + space at line start
    local strip_pat = "^#+ "

    local lines = fmttb_split_lines(block)
    local all_are_h = true
    for _, l in ipairs(lines) do
        if l ~= "" then
            if not l:match(detect_pat) then
                all_are_h = false
                break
            end
        end
    end

    local nl = {}
    for _, l in ipairs(lines) do
        local s = l
        if all_are_h then
            s = l:gsub(strip_pat, "")
        else
            if l ~= "" then
                s = l:gsub(strip_pat, "")
                s = prefix .. s
            end
        end
        table.insert(nl, s)
    end

    local new_block = table.concat(nl, "\n")
    editor.replaceRange(lf, lt, new_block)
    editor.setSelection(lf, lf + fmttb_get_len(new_block))
end

for _level = 1, 6 do
    local lvl = _level
    command.define {
        name = "Text: Toggle Heading " .. lvl,
        run  = function() fmttb_toggle_heading(lvl) end
    }
end

-- ============================================================
-- DOM Construction
-- ============================================================

function buildFormattingToolbar()
    if js.window.document.getElementById("sb-fmttb-wrap") then return end

    local cfg = config.get("FormattingToolbar") or {}

    local icons = {
        bold    = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h9a4 4 0 0 1 0 8H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"></path></svg>]],
        italic  = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>]],
        strike  = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4"></path><path d="M14 12a4 4 0 0 1 0 8H6"></path><line x1="4" y1="12" x2="20" y2="12"></line></svg>]],
        marker  = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h9l3-3"></path><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"></path></svg>]],
        super   = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 19 8-8"/><path d="m12 19-8-8"/><path d="M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06"/></svg>]],
        sub     = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 5 8 8"/><path d="m12 5-8 8"/><path d="M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"/></svg>]],
        code    = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>]],
        quote   = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1 0 2.5 0 5-2 5"></path><path d="M11 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1 0 2.5 0 5-2 5"></path></svg>]],
        bullet  = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>]],
        number  = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>]],
        task    = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="m9 11 3 3L22 4"></path></svg>]],
        h1      = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><text x="1" y="18" font-family="sans-serif" font-size="16" font-weight="700">H1</text></svg>]],
        h2      = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><text x="1" y="18" font-family="sans-serif" font-size="16" font-weight="700">H2</text></svg>]],
        h3      = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><text x="1" y="18" font-family="sans-serif" font-size="16" font-weight="700">H3</text></svg>]],
        h4      = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><text x="1" y="18" font-family="sans-serif" font-size="16" font-weight="700">H4</text></svg>]],
        h5      = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><text x="1" y="18" font-family="sans-serif" font-size="16" font-weight="700">H5</text></svg>]],
        h6      = [[<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><text x="1" y="18" font-family="sans-serif" font-size="16" font-weight="700">H6</text></svg>]]
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
        { divider=true },
        { i=icons.h1,     t="H1",     c="Text: Toggle Heading 1" },
        { i=icons.h2,     t="H2",     c="Text: Toggle Heading 2" },
        { i=icons.h3,     t="H3",     c="Text: Toggle Heading 3" },
        { i=icons.h4,     t="H4",     c="Text: Toggle Heading 4" },
        { i=icons.h5,     t="H5",     c="Text: Toggle Heading 5" },
        { i=icons.h6,     t="H6",     c="Text: Toggle Heading 6" },
    }

    local html = ""
    local last_was_divider = true
    local pending_divider  = false

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
                pending_divider  = false
            end
        end
    end
    html = html .. '<div id="sb-fmttb-arrow"></div>'

    local toolbar = js.window.document.createElement("div")
    toolbar.id        = "sb-fmttb-wrap"
    toolbar.innerHTML = html
    js.window.document.body.appendChild(toolbar)

    local scriptEl = js.window.document.createElement("script")
    scriptEl.id = "sb-fmttb-script"
    scriptEl.innerHTML = [[
(function () {
    var MARGIN = 12, GAP = 8, TOP_G = 64;
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    var positionLocked = false;
    var lockedLeft = 0; 

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
                    t = Math.min(t, rect.top);  b = Math.max(b, rect.bottom);
                    l = Math.min(l, rect.left); r = Math.max(r, rect.right);
                }
            });
            return t < 9999 ? { top: t, bottom: b, left: l, right: r, width: r - l, height: b - t } : null;
        }
        return null;
    }

    function updateActiveButtons(tb) {
        var activeStr = tb.getAttribute("data-active") || "";
        tb.querySelectorAll(".sb-fmttb-btn").forEach(function (btn) {
            var cmd = btn.getAttribute("data-cmd");
            var isActive = cmd && activeStr.split(",").indexOf(cmd) !== -1;
            btn.classList.toggle("sb-fmttb-active", isActive);
        });
    }

    function update() {
        var tb = document.getElementById("sb-fmttb-wrap");
        var ar = document.getElementById("sb-fmttb-arrow");
        
        if (!tb || tb.getAttribute("data-on") !== "1") {
            positionLocked = false;
            return;
        }

        updateActiveButtons(tb);

        var r = getRect();
        if (!r) return;

        var tw = tb.offsetWidth, th = tb.offsetHeight;

        if (isMobile) {
            var vv = window.visualViewport;
            var vh = vv ? vv.height : window.innerHeight;
            var vt = vv ? vv.offsetTop : 0;
            tb.style.top = Math.round(vt + vh - th) + "px";
            tb.style.left = "0px";
            tb.className = "sb-fmttb-mobile sb-fmttb-on";
            if (ar) ar.style.display = "none";
            return;
        }

        // --- VERTICAL CALCULATION (Always active) ---
        var top = r.top - th - GAP;
        var below = top < (TOP_G + MARGIN);
        if (below) top = r.bottom + GAP;
        
        tb.style.top = Math.round(top) + "px";
        tb.className = below ? "sb-arr-up sb-fmttb-on" : "sb-arr-down sb-fmttb-on";

        // --- HORIZONTAL CALCULATION ---
        if (!positionLocked) {
            var left = r.left + r.width / 2 - tw / 2;
            left = Math.max(MARGIN, Math.min(left, window.innerWidth - tw - MARGIN));
            tb.style.left = Math.round(left) + "px";
            lockedLeft = left; 
        }

        // --- ARROW CALCULATION (Always active) ---
        if (ar) {
            ar.style.display = "block";
            var ax = Math.round(r.left + r.width / 2 - (lockedLeft || 0) - 7);
            ar.style.left = Math.max(8, Math.min(ax, tw - 22)) + "px";
        }
    }

    setInterval(function () {
        var tb = document.getElementById("sb-fmttb-wrap");
        if (!tb) return;
        if (tb.getAttribute("data-on") === "1") update();
        else {
            tb.classList.remove("sb-fmttb-on");
            positionLocked = false;
        }
    }, 100);

    function poll() { window.dispatchEvent(new CustomEvent("fmttb-poll")); }
    
    // Interactions that reset the lock
    ["mousedown", "keydown"].forEach(function(ev) {
        document.addEventListener(ev, function(e) {
            if (!e.target.closest("#sb-fmttb-wrap")) positionLocked = false;
        }, { passive: true });
    });

    // Scrolling also resets the lock to allow full repositioning
    var scroller = document.querySelector(".cm-scroller") || document;
    scroller.addEventListener("scroll", function() {
        positionLocked = false; 
        poll();
    }, { passive: true });

    ["selectionchange", "mouseup", "touchend", "keyup"].forEach(function (ev) {
        document.addEventListener(ev, poll, { passive: true });
    });

    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", update);
        window.visualViewport.addEventListener("scroll", update);
    }

    var lastTouchCmdTime = 0, touchStartX = 0, touchStartY = 0;

    document.addEventListener("touchstart", function (e) {
        var b = e.target.closest("#sb-fmttb-wrap [data-cmd]");
        if (b) { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; }
    }, { passive: true });

    document.addEventListener("touchend", function (e) {
        var b = e.target.closest("#sb-fmttb-wrap [data-cmd]");
        if (!b) return;
        e.preventDefault(); e.stopPropagation();
        var dx = e.changedTouches[0].clientX - touchStartX, dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.sqrt(dx * dx + dy * dy) > 8) return; 
        lastTouchCmdTime = Date.now();
        positionLocked = true; // Lock horizontal only
        window.dispatchEvent(new CustomEvent("fmttb-cmd", { detail: { command: b.getAttribute("data-cmd") } }));
    }, { passive: false });

    document.addEventListener("mousedown", function (e) {
        var b = e.target.closest("#sb-fmttb-wrap [data-cmd]");
        if (!b) return;
        e.preventDefault(); e.stopPropagation();
        if (Date.now() - lastTouchCmdTime < 500) return;
        positionLocked = true; // Lock horizontal only
        window.dispatchEvent(new CustomEvent("fmttb-cmd", { detail: { command: b.getAttribute("data-cmd") } }));
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

-- ============================================================
-- Poll handler
-- ============================================================

js.window.addEventListener("fmttb-poll", function()
    local toolbar = js.window.document.getElementById("sb-fmttb-wrap")
    if not toolbar then return end

    local ok_sel, raw_sel = pcall(editor.getSelection)
    local sel = fmttb_normalize_sel(raw_sel)
    local has_sel = ok_sel and sel ~= nil

    toolbar.setAttribute("data-on", has_sel and "1" or "0")

    if has_sel then
        local ok_txt, full = pcall(editor.getText)
        if ok_txt then
            local active = fmttb_detect_active_markers(full, sel)
            toolbar.setAttribute("data-active", active)
        end
    else
        toolbar.setAttribute("data-active", "")
    end
end)

-- ============================================================
-- Command handler
-- ============================================================

js.window.addEventListener("fmttb-cmd", function(e)
    local cmd    = e.detail.command
    local marker = FMTTB_CMD_TO_MARKER[cmd]

    if marker then
        local ok_sel, raw_sel = pcall(editor.getSelection)
        local sel = fmttb_normalize_sel(raw_sel)
        local ok_txt, full = pcall(editor.getText)
        if sel and ok_txt then
            fmttb_expand_for_marker(marker, sel, full)
        end
    end

    editor.invokeCommand(cmd)
end)

-- ============================================================
-- Toggle command
-- ============================================================

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

## Discussions about this Library
- [Silverbullet Community](https://community.silverbullet.md/t/formatting-toolbar-for-selections/4010?u=mr.red)