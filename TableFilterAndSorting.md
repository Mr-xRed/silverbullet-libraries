---
name: "Library/Mr-xRed/TableFilterAndSorting"
tags: meta/library
pageDecoration.prefix: "🛠️ "
share.uri: "github:Mr-xRed/silverbullet-libraries/TableFilterAndSorting.md"
---

# Silverbullet Table Sorting and Filtering (Ver. 2.1)

- This library adds sorting, filtering, searching, CSV export, and rich-copy support to every Silverbullet table in your Space.
- This is a UI/UX-focused remake of the original library. Same core idea (client-side sort + filter for SB tables), rebuilt with a modern toolbar, multi-column sort, a searchable filter dropdown with value counts, a global per-table search box, and CSV export.

> **note** Commands
> `Table: Enable Sorting and Filter` — manually ENABLE sorting & filtering (current instance)
>
> `Table: Disable Sorting and Filter` — manually DISABLE sorting & filtering (current instance)
>
> `Table: Reset All Tables On This Page` — clears sort, filters and search on every table on the page
>
> `Table: Enable Multiline` / `Table: Disable Multiline` — toggle `<br>`/`\n` support inside cells

## What's new vs. the original

- **Multi-column sort** — Shift-click a header to add it as a secondary/tertiary sort key. A small numbered badge shows sort priority.
- **Smarter filter dropdown** — search box to narrow long value lists, a live count next to each value, and `All / Clear / Invert` actions.
- **Global row search** — a search icon in the toolbar expands into a live text box that filters across every visible column.
- **Row counter** — the toolbar shows `12 / 45 rows` so you always know how much is filtered out.
- **CSV export** — one click, respects current filters/search (only visible rows are exported).
- **Cleaner visual language** — a floating pill-shaped toolbar, animated dropdown, theme-aware colors, and an optional custom accent color.
- All the original Codemirror/edit-mode safety guards, session-persisted state, and cleanup-on-disable behavior are preserved.

## Config Example:

```lua
-- Table Sorting/Filtering is enabled by default.
config.set("tableSort", {
    enabled = true,        -- set to false to disable auto-start (commands still work)
    accentColor = "",      -- e.g. "#22c55e" to override the accent color, "" = theme default
    showRowCount = true,   -- show the "x / y rows" badge in the toolbar
    showCsvExport = true,  -- show the CSV export button in the toolbar
})

-- Multiline table cell support (turns <br> / \n into real line breaks)
config.set("multilineTables", { enabled = true })
```

## Table Filter and Sorting Styling

```space-style

/*---------- System Style Overrides ----------*/
#sb-main .cm-editor .sb-lua-directive-block:has(.sortable-header) .button-bar {
  top: -40px; padding: 0; border-radius: 1em; opacity: 0.4; transition: opacity 0.25s ease;display: flex !important;
}
#sb-main .cm-editor .sb-lua-directive-block:has(.sortable-header) .button-bar:hover { opacity: 1; }
#sb-main .cm-editor .sb-lua-wrapper {overflow-x:visible !important;}
#sb-main .cm-editor .sb-table-widget:has(.sortable-header) { overflow: visible !important; position: relative !important; }
#sb-main .cm-editor .sb-table-widget .content { overflow: auto; }

@media (hover: none) and (pointer: coarse) {
#sb-main .cm-editor .sb-lua-directive-block:has(.sortable-header) .button-bar {display: flex !important;}
}

/*---------- Design Tokens ----------*/
body {
    --tfs-accent: var(--ui-accent-color, #6366f1);
    --tfs-border: var(--sb-border-color, rgba(128,128,128,0.25));
    --tfs-shadow: 0 12px 32px -8px rgba(0,0,0,.20), 0 2px 6px rgba(0,0,0,.06);
    --tfs-radius: 10px;
    --tfs-radius-sm: 7px;
    --tfs-fast: 140ms cubic-bezier(.2,.8,.3,1);
}

/*---------- Sortable header cell ----------*/
.sortable-header {
    cursor: pointer !important;
    position: relative !important;
    transition: background var(--tfs-fast);
    white-space: nowrap;
    padding-left: 32px !important;
    padding-right: 30px !important;
    isolation: isolate;
}
.sortable-header:hover { background: color-mix(in srgb, var(--tfs-accent) 8%, transparent) !important; }

.sort-indicator-wrapper {
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px; height: 16px;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none;
}
.sort-indicator-wrapper svg { width: 15px; height: 15px; opacity: .3; stroke: currentColor; transition: opacity var(--tfs-fast), transform var(--tfs-fast); }
.sort-asc .sort-indicator-wrapper svg { opacity: 1; color: var(--tfs-accent); transform: rotate(180deg); }
.sort-desc .sort-indicator-wrapper svg { opacity: 1; color: var(--tfs-accent); transform: rotate(0deg); }

.sort-priority-badge {
    position: absolute; top: -6px; right: -8px;
    background: var(--tfs-accent); color: #fff;
    font-size: 9px; font-weight: 700; line-height: 1;
    width: 13px; height: 13px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
}

/*---------- Filter button ----------*/
.filter-container {
    position: absolute;
    left: 6px;
    top: 50%;
    transform: translateY(-50%);
    width: 22px; height: 22px;
    display: flex; align-items: center; justify-content: center;
    z-index: 10;
    cursor: pointer;
    border-radius: 6px;
    transition: background var(--tfs-fast);
}
.filter-container:hover { background: color-mix(in srgb, var(--tfs-accent) 12%, transparent); }
.filter-container svg { width: 15px; height: 15px; opacity: .35; stroke: currentColor; transition: opacity var(--tfs-fast), color var(--tfs-fast); }
.filter-container:hover svg { opacity: .8; }
.filter-container.active svg { opacity: 1; color: var(--tfs-accent); }
.filter-container .filter-count {
    position: absolute; top: -3px; right: -3px;
    background: var(--tfs-accent); color: #fff;
    font-size: 9px; font-weight: 700;
    min-width: 13px; height: 13px; border-radius: 1em;
    display: none; align-items: center; justify-content: center;
    padding: 0 2px;
}
.filter-container.active .filter-count { display: flex; }

/*---------- Dropdown menu ----------*/
.custom-dropdown-menu {
    position: fixed; left: 0; top: 0; z-index: 9999;
    background: oklch(from var(--root-background-color, #fff) l c h / 1);
    border: 1px solid var(--tfs-border);
    border-radius: var(--tfs-radius);
    box-shadow: var(--tfs-shadow);
    width: 240px;
    max-height: 340px;
    overflow: hidden;
    display: none;
    flex-direction: column;
    font-size: 13px;
}
.custom-dropdown-menu.show { display: flex; animation: tfs-pop 140ms cubic-bezier(.2,.8,.3,1); }
@keyframes tfs-pop { from { opacity: 0; transform: translateY(-4px) scale(.98); } to { opacity: 1; transform: none; } }

.dropdown-search {
    margin: 8px 8px 6px; padding: 6px 10px;
    border: 1px solid var(--tfs-border); border-radius: var(--tfs-radius-sm);
    background: transparent; color: inherit; font-size: 12px; outline: none;
}
.dropdown-search:focus { border-color: var(--tfs-accent); }

.dropdown-actions {
    display: flex; gap: 6px; padding: 0 8px 8px; margin-bottom: 6px;
    border-bottom: 1px solid var(--tfs-border);
}
.action-btn {
    flex: 1; font-size: 11px; font-weight: 600; cursor: pointer;
    padding: 5px 4px; text-align: center; border-radius: var(--tfs-radius-sm);
    border: 1px solid var(--tfs-border); transition: background var(--tfs-fast);
}
.action-btn:hover { background: color-mix(in srgb, var(--tfs-accent) 10%, transparent); }

.dropdown-list { overflow-y: auto; padding: 0 8px; flex: 1; }
.dropdown-item {
    display: flex; align-items: center; gap: 8px;
    padding: 6px; border-radius: var(--tfs-radius-sm);
    cursor: pointer; transition: background var(--tfs-fast);
    user-select: none;
}
.dropdown-item:hover { background: color-mix(in srgb, var(--tfs-accent) 8%, transparent); }
.dropdown-item .chk {
    flex: 0 0 auto;
    width: 15px; height: 15px; border-radius: 4px;
    border: 1.5px solid var(--tfs-border);
    display: flex; align-items: center; justify-content: center;
    transition: background var(--tfs-fast), border-color var(--tfs-fast);
}
.dropdown-item .chk svg { width: 10px; height: 10px; stroke: #fff; stroke-width: 3; opacity: 0; transition: opacity var(--tfs-fast); }
.dropdown-item[data-selected="true"] .chk { background: var(--tfs-accent); border-color: var(--tfs-accent); }
.dropdown-item[data-selected="true"] .chk svg { opacity: 1; }
.dropdown-text {
    overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
    display: block; max-width: 100%; flex: 1;
}
.dropdown-count { font-size: 11px; opacity: .5; font-variant-numeric: tabular-nums; }

.apply-btn {
    margin: 8px; background: var(--tfs-accent); color: #fff;
    border: none; padding: 7px; border-radius: var(--tfs-radius-sm);
    cursor: pointer; font-weight: 600; font-size: 12px;
}
.apply-btn:hover { filter: brightness(1.08); }

/*---------- Toolbar (button bar) ----------*/
#sb-main .cm-editor .sb-lua-directive-block:has(.sortable-header) .button-bar {
    position: absolute !important;
    right: 0 !important;
    left: auto !important;
    bottom: auto !important;
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    align-items: center !important;
    gap: 2px;
    width: max-content !important;
    height: auto !important;
    max-width: none;
    background: oklch(from var(--root-background-color, #fff) l c h / .92);
    border: 1px solid var(--tfs-border);
    border-radius: 1em;
    backdrop-filter: blur(6px);
    box-shadow: 0 2px 8px rgba(0,0,0,.06);
    overflow: visible !important;
    z-index: 20;
}
.button-bar button {
    background: transparent; border: none; cursor: pointer;
    opacity: .65; padding: 11px 8px; border-radius: 1em;
    display: flex !important; align-items: center; justify-content: center;
    flex: 0 0 auto;
    color: inherit; transition: all var(--tfs-fast);
}
.button-bar button svg { width: 13px; height: 13px; flex: 0 0 auto; }
.button-bar button:hover { opacity: 1; /*background: color-mix(in srgb, var(--tfs-accent) 14%, transparent);*/ }

.row-count-badge {
    font-size: 11px; opacity: .6; padding: 0 6px; white-space: nowrap;
    font-variant-numeric: tabular-nums; flex: 0 0 auto;
}
.tfs-search-wrap { display: flex !important; flex: 0 0 auto; align-items: center; }
.tfs-search-input {
    /* Fix: this is a normal in-flow box now, so the bar visibly grows to contain
       it (as requested) instead of floating over other content. The no-shift
       guarantee that fixed the earlier flicker bug now comes from DOM order:
       this input is inserted BEFORE the toggle button (see attachSearchToggle),
       so widening it only pushes the bar's own left edge further left — the
       toggle button and everything after it keep their exact screen position,
       since the bar is right-anchored and sized to its content. */
    width: 0;
    opacity: 0;
    pointer-events: none;
    border: 1px solid transparent;
    background: transparent;
    color: inherit;
    border-radius: 1em;
    transition: width var(--tfs-fast), opacity var(--tfs-fast), padding var(--tfs-fast), margin-right var(--tfs-fast);
    font-size: 12px; outline: none; flex: 0 0 auto;
}
.tfs-search-input.open { width: 50px; opacity: 1; padding: 5px 10px; margin-inline: 4px; pointer-events: auto; border-color: var(--tfs-border); background: oklch(from var(--root-background-color, #fff) l c h / .95); }

```

## Filter and Sort Tables
```space-lua
-- priority: -1

-- ------------- Load Config -------------
local cfg = config.get("tableSort") or {}
local enabled = cfg.enabled ~= false
local accentColor = cfg.accentColor or ""
local showRowCount = cfg.showRowCount ~= false
local showCsvExport = cfg.showCsvExport ~= false

local jsConfig = string.format(
    '{"accent": %q, "showRowCount": %s, "showCsvExport": %s}',
    accentColor, tostring(showRowCount), tostring(showCsvExport)
)

local function cleanupSorter()
    local scriptId = "sb-table-sorter-runtime"
    local existing = js.window.document.getElementById(scriptId)

    if existing then
        local event = js.window.document.createEvent("Event")
        event.initEvent("sb-table-sorter-unload", true, true)
        js.window.dispatchEvent(event)

        existing.remove()
        print("Table Sorter/Filter: Disabled")
    else
        print("Table Sorter/Filter: Already inactive")
    end
end

function enableTableSorter()
    local scriptId = "sb-table-sorter-runtime"
    local existing = js.window.document.getElementById(scriptId)

    if existing then
        print("Table Sorter/Filter: Already active")
        return
    end

    local scriptEl = js.window.document.createElement("script")
    scriptEl.id = scriptId
    scriptEl.innerHTML = "const TFS_CONFIG = " .. jsConfig .. ";\n" .. [[
    (function() {
        if (TFS_CONFIG.accent) {
            document.body.style.setProperty('--tfs-accent', TFS_CONFIG.accent);
        }

        const style = document.createElement('style');
        // FOUC fix: the injected elements (SVGs, filter menus, toolbar) are created
        // synchronously when the script runs, which on page load can happen BEFORE the
        // space-style block above has been applied. Until then they render unstyled
        // (oversized SVGs, the dropdown menu fully visible inside the header cell, etc.).
        // So the layout-critical rules live here too, in a <style> that exists the
        // moment the first element is injected. Cosmetic polish stays in space-style.
        style.innerHTML = `
        body { --tfs-accent: var(--ui-accent-color, #6366f1); --tfs-border: var(--sb-border-color, rgba(128,128,128,0.25)); }
        .sortable-header { cursor: pointer !important; position: relative !important; white-space: nowrap; padding-left: 32px !important; padding-right: 30px !important; isolation: isolate; }
        .sort-indicator-wrapper { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; pointer-events: none; }
        .sort-indicator-wrapper svg { width: 15px; height: 15px; opacity: .3; stroke: currentColor; }
        .sort-asc .sort-indicator-wrapper svg { opacity: 1; color: var(--tfs-accent); transform: rotate(180deg); }
        .sort-desc .sort-indicator-wrapper svg { opacity: 1; color: var(--tfs-accent); }
        .sort-priority-badge { position: absolute; top: -6px; right: -8px; background: var(--tfs-accent); color: #fff; font-size: 9px; font-weight: 700; line-height: 1; width: 13px; height: 13px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .filter-container { position: absolute; left: 6px; top: 50%; transform: translateY(-50%); width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; z-index: 10; cursor: pointer; border-radius: 6px; }
        .filter-container svg { width: 15px; height: 15px; opacity: .35; stroke: currentColor; }
        .filter-container.active svg { opacity: 1; color: var(--tfs-accent); }
        .filter-container .filter-count { position: absolute; top: -3px; right: -3px; background: var(--tfs-accent); color: #fff; font-size: 9px; font-weight: 700; min-width: 13px; height: 13px; border-radius: 1em; display: none; align-items: center; justify-content: center; padding: 0 2px; }
        .filter-container.active .filter-count { display: flex; }
        .custom-dropdown-menu { position: fixed; left: 0; top: 0; z-index: 9999; width: 240px; max-height: 340px; overflow: hidden; display: none; flex-direction: column; font-size: 13px; }
        .custom-dropdown-menu.show { display: flex; }
        .dropdown-item .chk svg { width: 10px; height: 10px; stroke: #fff; stroke-width: 3; opacity: 0; }
        .dropdown-item[data-selected="true"] .chk svg { opacity: 1; }
        .button-bar { position: absolute !important; top: -40px !important; right: 0 !important; left: auto !important; bottom: auto !important; display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; align-items: center !important; width: max-content !important; height: auto !important; overflow: visible !important; z-index: 20; }
        .button-bar button { display: flex !important; align-items: center; justify-content: center; flex: 0 0 auto; }
        .button-bar button svg { width: 13px; height: 13px; flex: 0 0 auto; }
        .tfs-search-wrap { display: flex !important; flex: 0 0 auto; align-items: center; }
        .tfs-search-input { width: 0; opacity: 0; pointer-events: none; border: 1px solid transparent; background: transparent; color: inherit; flex: 0 0 auto; }
        .tfs-search-input.open { width: 50px; opacity: 1; padding: 5px 10px; margin-inline: 4px; pointer-events: auto; border-color: var(--tfs-border); }
        `;
        document.head.appendChild(style);

        const FUNNEL_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16l-6.5 7.5v6L10 20v-8.5z"/></svg>';
        const CHEVRON_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
        const SEARCH_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';
        const CSV_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/></svg>';
        const COPY_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="15" height="15" rx="2"/><path d="M4 16V5a2 2 0 0 1 2-2h11"/></svg>';
        const CHECK_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
        const RESET_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 5H3"/><path d="M7 12H3"/><path d="M7 19H3"/><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14"/><path d="M11 10v4h4"/></svg>';

        // Fix: flag to tell the document click handler to skip one closing cycle
        // when a filter menu was just opened via mousedown (desktop: mousedown fires
        // first and opens the menu, then the browser fires click which would close it)
        let _skipNextDocClick = false;

        // Fix: document-level capture-phase guard for markdown tables only.
        // SilverBullet/CM6 registers its edit-mode trigger with a capture listener
        // higher in the DOM, so bubble-phase stopPropagation on the widget is too late.
        //
        // Every interactive control in this library (sort headers, filter icon,
        // toolbar buttons, and the filter dropdown's items/action buttons/apply
        // button) runs its real logic on 'mousedown'. That means we can safely
        // swallow the *following* 'mouseup' and 'click' entirely at document
        // capture time, before CM ever sees a completed gesture — nothing here
        // depends on 'click' actually being delivered to its target.
        // The two search inputs (global search, per-column value search) are the
        // only genuine text fields: for those we still stop propagation (so CM
        // doesn't react) but skip preventDefault so native focus/caret/typing works.
        const GUARD_SELECTOR = '.sortable-header, .filter-container, .button-bar button, .custom-dropdown-menu, .tfs-search-input';

        function isTextField(el) {
            return !!(el.closest('.tfs-search-input') || el.closest('.dropdown-search'));
        }

        const _mdTableEventGuard = (e) => {
            if (e.button !== undefined && e.button !== 0) return;
            const target = e.target;
            const match = target.closest(GUARD_SELECTOR);
            if (!match) return;
            const widget = target.closest('.sb-table-widget');
            if (!widget) return;
            if (widget.closest('.sb-lua-directive-block')) return;
            if (e.type === 'click') { _skipNextDocClick = false; }
            // Never preventDefault on a text field: that would block native caret
            // placement/typing. Buttons/checkboxes are fine to preventDefault.
            if (!isTextField(target)) e.preventDefault();
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        };
        document.addEventListener('mouseup', _mdTableEventGuard, true);
        document.addEventListener('click', _mdTableEventGuard, true);
        document.addEventListener('focusin', _mdTableEventGuard, true);

        // Fix: SilverBullet is a single-page app, so navigating between pages does not
        // reload the document — a table at "position 0" on page A and a table at
        // "position 0" on page B previously shared the exact same sessionStorage key,
        // making filters/sort bleed across pages. Scope every key to the current page.
        function getPageKey() {
            return (location.pathname || '') + (location.hash || '') + (location.search || '') +
                   '::' + (document.title || '');
        }

        function getTableKey(table) {
            if (table.dataset.tfsKey) return table.dataset.tfsKey;
            const pageKey = getPageKey();
            const allTables = Array.from(document.querySelectorAll('table'));
            const index = allTables.indexOf(table);
            const key = 'sb-tfs::' + pageKey + '::' + (table.id || ('pos-' + index));
            table.dataset.tfsKey = key;
            if (!table.id) table.id = 'sb-table-pos-' + index;
            return key;
        }

        // Header cells contain our injected UI (sort chevron, filter button with its
        // dropdown menu full of values/counts/buttons). Their textContent therefore
        // includes all of that text, so read the cell from a clone with the injected
        // elements stripped. Body cells never contain injected UI and take the fast path.
        const INJECTED_SEL = '.sort-indicator-wrapper, .filter-container, .custom-dropdown-menu, .tfs-injected';
        function cellValue(cell) {
            if (!cell) return "";
            const attr = cell.getAttribute('data-fulltexttext');
            if (attr) return attr;
            if (cell.querySelector(INJECTED_SEL)) {
                const clone = cell.cloneNode(true);
                clone.querySelectorAll(INJECTED_SEL).forEach(el => el.remove());
                return clone.textContent.trim();
            }
            return cell.textContent.trim();
        }

        function compareValues(aT, bT) {
            const numeric = /^[\s$€£%0-9.,\-]+$/;
            const aN = parseFloat(aT.replace(/[^0-9.\-]+/g, "")), bN = parseFloat(bT.replace(/[^0-9.\-]+/g, ""));
            if (!isNaN(aN) && !isNaN(bN) && numeric.test(aT) && numeric.test(bT) && aT.trim() !== "" && bT.trim() !== "") {
                return aN - bN;
            }
            return aT.localeCompare(bT, undefined, { numeric: true, sensitivity: 'base' });
        }

        function getSortState(table) {
            return JSON.parse(sessionStorage.getItem(getTableKey(table) + '-sort') || "[]");
        }
        function setSortState(table, state) {
            sessionStorage.setItem(getTableKey(table) + '-sort', JSON.stringify(state));
        }

        function sortTable(table, sortState) {
            const tbody = table.tBodies[0];
            if (!tbody) return;
            const rows = Array.from(tbody.rows);
            rows.sort((a, b) => {
                for (const s of sortState) {
                    const aT = cellValue(a.cells[s.index]);
                    const bT = cellValue(b.cells[s.index]);
                    const cmp = compareValues(aT, bT);
                    if (cmp !== 0) return s.asc ? cmp : -cmp;
                }
                return (parseInt(a.dataset.orgIndex) || 0) - (parseInt(b.dataset.orgIndex) || 0);
            });
            tbody.append(...rows);
        }

        function restoreOriginalOrder(table) {
            const tbody = table.tBodies[0];
            if (!tbody) return;
            const rows = Array.from(tbody.rows);
            rows.sort((a, b) => (parseInt(a.dataset.orgIndex) || 0) - (parseInt(b.dataset.orgIndex) || 0));
            tbody.append(...rows);
        }

        function applySortVisuals(table, sortState) {
            const headerRow = table.querySelector("thead tr") || table.rows[0];
            Array.from(headerRow.cells).forEach((c, i) => {
                c.classList.remove('sort-asc', 'sort-desc');
                c.querySelector('.sort-priority-badge')?.remove();
                const s = sortState.find(s => s.index === i);
                if (s) {
                    c.classList.add(s.asc ? 'sort-asc' : 'sort-desc');
                    if (sortState.length > 1) {
                        const b = document.createElement('span');
                        b.className = 'sort-priority-badge';
                        b.textContent = sortState.indexOf(s) + 1;
                        c.querySelector('.sort-indicator-wrapper')?.appendChild(b);
                    }
                }
            });
        }

        function getButtonBarForTable(table) {
            const block = table.closest('.sb-lua-directive-block');
            if (block) return block.querySelector('.button-bar');
            const wrapper = table.closest('[data-md-wrapper]');
            if (wrapper) return wrapper.querySelector('.button-bar');
            return null;
        }

        function updateRowCountBadge(table, visible, total) {
            if (!TFS_CONFIG.showRowCount) return;
            const bar = getButtonBarForTable(table);
            if (!bar) return;
            let badge = bar.querySelector('.row-count-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'row-count-badge tfs-injected';
                // Fix: the search box expands *leftward* out of normal flow, so it
                // overlaps whatever sits immediately to its left. Keeping the search
                // wrap as the bar's very first (leftmost) element and placing the
                // row-count badge right after it means the expansion always grows
                // into empty space beyond the bar's own edge instead of over the badge.
                const searchWrap = bar.querySelector('.tfs-search-wrap');
                if (searchWrap) searchWrap.insertAdjacentElement('afterend', badge);
                else bar.insertBefore(badge, bar.firstChild);
            }
            badge.textContent = visible === total ? (total + ' rows') : (visible + ' / ' + total);
        }

        function filterTable(table) {
            const tbody = table.tBodies[0];
            if (!tbody) return;
            const rows = Array.from(tbody.rows);
            const headerRow = table.querySelector("thead tr") || table.rows[0];
            const filterContainers = Array.from(headerRow.cells).map(cell => cell.querySelector('.filter-container'));
            const tableKey = getTableKey(table);

            const state = filterContainers.map(c => {
                if (!c) return "all";
                try { return (c.dataset.value && c.dataset.value !== "all") ? JSON.parse(c.dataset.value) : "all"; }
                catch (e) { return "all"; }
            });
            sessionStorage.setItem(tableKey + '-filters', JSON.stringify(state));

            const searchInput = table._searchInput;
            const searchTerm = (searchInput ? searchInput.value : "").trim().toLowerCase();
            if (searchInput) sessionStorage.setItem(tableKey + '-search', searchTerm);

            let visibleCount = 0;
            rows.forEach(row => {
                const colsOk = filterContainers.every((container, colIndex) => {
                    let selectedValues = "all";
                    if (container && container.dataset.value && container.dataset.value !== "all") {
                        try { selectedValues = JSON.parse(container.dataset.value); } catch (e) { selectedValues = "all"; }
                    }
                    if (selectedValues === "all" || (Array.isArray(selectedValues) && selectedValues.length === 0)) return true;
                    const cellText = cellValue(row.cells[colIndex]);
                    return selectedValues.includes(cellText);
                });
                const searchOk = !searchTerm || Array.from(row.cells).some(c => cellValue(c).toLowerCase().includes(searchTerm));
                const isVisible = colsOk && searchOk;
                row.style.display = isVisible ? "" : "none";
                if (isVisible) visibleCount++;
            });

            updateRowCountBadge(table, visibleCount, rows.length);
        }

        function populateFilters(table) {
            const tbody = table.tBodies[0];
            if (!tbody) return;
            const headerRow = table.querySelector("thead tr") || table.rows[0];
            const rows = Array.from(tbody.rows);
            const tableKey = getTableKey(table);
            const savedFilters = JSON.parse(sessionStorage.getItem(tableKey + '-filters') || "[]");

            Array.from(headerRow.cells).forEach((cell, colIndex) => {
                const container = cell.querySelector('.filter-container');
                if (!container) return;

                if (!container.querySelector('svg')) {
                    container.insertAdjacentHTML('afterbegin', FUNNEL_SVG);
                }
                let countBadge = container.querySelector('.filter-count');
                if (!countBadge) {
                    countBadge = document.createElement('span');
                    countBadge.className = 'filter-count';
                    container.appendChild(countBadge);
                }

                let menu = container.querySelector('.custom-dropdown-menu');
                if (!menu) {
                    menu = document.createElement('div');
                    menu.className = 'custom-dropdown-menu';
                    container.appendChild(menu);
                    const filterInteractionHandler = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        document.querySelectorAll('.custom-dropdown-menu').forEach(m => m !== menu && m.classList.remove('show'));
                        menu.classList.toggle('show');
                        if (menu.classList.contains('show')) {
                            _skipNextDocClick = true;
                            const search = menu.querySelector('.dropdown-search');
                            if (search) setTimeout(() => search.focus(), 30);
                        }
                    };
                    container.onmousedown = filterInteractionHandler;
                    container.ontouchstart = filterInteractionHandler;
                    container.onmouseup = (e) => { e.preventDefault(); e.stopPropagation(); };
                }

                const counts = new Map();
                rows.forEach(row => {
                    const txt = cellValue(row.cells[colIndex]);
                    if (txt) counts.set(txt, (counts.get(txt) || 0) + 1);
                });

                const savedVal = savedFilters[colIndex] || "all";
                container.dataset.value = (savedVal === "all") ? "all" : JSON.stringify(savedVal);
                const activeCount = (savedVal !== "all" && Array.isArray(savedVal)) ? savedVal.length : 0;
                container.classList.toggle('active', activeCount > 0);
                countBadge.textContent = activeCount;

                menu.innerHTML = '';
                // Fix: without this, any click inside the menu (a checkbox, All/Clear/
                // Invert, Apply) bubbles up to the document click handler below that
                // closes every open dropdown menu, so the menu would slam shut on the
                // very interaction you're trying to make. This matters for query
                // tables especially, since the CM-edit-mode guard above deliberately
                // skips anything inside a Lua directive block.
                menu.onclick = (e) => e.stopPropagation();

                const searchBox = document.createElement('input');
                searchBox.type = 'text';
                searchBox.className = 'dropdown-search';
                searchBox.placeholder = 'Search values…';
                menu.appendChild(searchBox);

                const actionWrapper = document.createElement('div');
                actionWrapper.className = 'dropdown-actions';

                const list = document.createElement('div');
                list.className = 'dropdown-list';

                function makeActionBtn(label, onActivate) {
                    const b = document.createElement('div');
                    b.className = 'action-btn';
                    b.textContent = label;
                    b.onmousedown = (e) => { e.preventDefault(); e.stopPropagation(); onActivate(); };
                    b.onmouseup = (e) => { e.preventDefault(); e.stopPropagation(); };
                    return b;
                }

                const selectAllBtn = makeActionBtn('All', () => {
                    list.querySelectorAll('.dropdown-item').forEach(item => {
                        if (item.style.display !== 'none') item.dataset.selected = 'true';
                    });
                });
                const clearBtn = makeActionBtn('Clear', () => {
                    list.querySelectorAll('.dropdown-item').forEach(item => { item.dataset.selected = 'false'; });
                });
                const invertBtn = makeActionBtn('Invert', () => {
                    list.querySelectorAll('.dropdown-item').forEach(item => {
                        item.dataset.selected = (item.dataset.selected === 'true') ? 'false' : 'true';
                    });
                });
                actionWrapper.append(selectAllBtn, clearBtn, invertBtn);
                menu.appendChild(actionWrapper);
                menu.appendChild(list);

                const currentSelection = (savedVal === "all") ? [] : savedVal;
                Array.from(counts.keys()).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).forEach(val => {
                    const item = document.createElement('div');
                    item.className = 'dropdown-item';
                    item.dataset.value = val;
                    item.dataset.selected = currentSelection.includes(val) ? 'true' : 'false';
                    const chk = document.createElement('span');
                    chk.className = 'chk';
                    chk.innerHTML = CHECK_SVG;
                    const text = document.createElement('span');
                    text.className = 'dropdown-text';
                    text.textContent = val;
                    const cnt = document.createElement('span');
                    cnt.className = 'dropdown-count';
                    cnt.textContent = counts.get(val);
                    item.append(chk, text, cnt);
                    // Fix: toggle on mousedown (like every other control in this library) rather
                    // than relying on a native click, which the host editor can intercept first.
                    item.onmousedown = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        item.dataset.selected = (item.dataset.selected === 'true') ? 'false' : 'true';
                    };
                    item.onmouseup = (e) => { e.preventDefault(); e.stopPropagation(); };
                    list.appendChild(item);
                });

                searchBox.oninput = () => {
                    const q = searchBox.value.toLowerCase();
                    list.querySelectorAll('.dropdown-item').forEach(item => {
                        const match = item.querySelector('.dropdown-text').textContent.toLowerCase().includes(q);
                        item.style.display = match ? 'flex' : 'none';
                    });
                };

                const okBtn = document.createElement('button');
                okBtn.className = 'apply-btn';
                okBtn.textContent = 'Apply';
                okBtn.onmousedown = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const checked = Array.from(list.querySelectorAll('.dropdown-item[data-selected="true"]')).map(i => i.dataset.value);
                    if (checked.length === 0) {
                        container.dataset.value = "all";
                        container.classList.remove('active');
                        countBadge.textContent = '0';
                    } else {
                        container.dataset.value = JSON.stringify(checked);
                        container.classList.add('active');
                        countBadge.textContent = checked.length;
                    }
                    menu.classList.remove('show');
                    filterTable(table);
                };
                okBtn.onmouseup = (e) => { e.preventDefault(); e.stopPropagation(); };
                menu.appendChild(okBtn);
            });
            filterTable(table);
        }

        function resetAll(table) {
            const tableKey = getTableKey(table);
            sessionStorage.removeItem(tableKey + '-filters');
            sessionStorage.removeItem(tableKey + '-sort');
            sessionStorage.removeItem(tableKey + '-search');
            if (table._searchInput) {
                table._searchInput.value = '';
                table._searchInput.classList.remove('open');
            }
            const headerRow = table.querySelector("thead tr") || table.rows[0];
            Array.from(headerRow.cells).forEach(cell => {
                cell.classList.remove("sort-asc", "sort-desc");
                cell.querySelector('.sort-priority-badge')?.remove();
                const cont = cell.querySelector('.filter-container');
                if (cont) { cont.dataset.value = "all"; cont.classList.remove('active'); }
            });
            const tbody = table.tBodies[0];
            if (tbody) {
                const rows = Array.from(tbody.rows);
                rows.sort((a, b) => (parseInt(a.dataset.orgIndex) || 0) - (parseInt(b.dataset.orgIndex) || 0));
                tbody.append(...rows);
                rows.forEach(r => r.style.display = "");
            }
            populateFilters(table);
        }

        function buildToolbarButton(cls, title, svg, handler) {
            const btn = document.createElement('button');
            btn.className = cls + ' tfs-injected';
            btn.title = title;
            btn.innerHTML = svg;
            btn.onmousedown = handler;
            btn.ontouchstart = handler;
            btn.onmouseup = (e) => { e.preventDefault(); e.stopPropagation(); };
            return btn;
        }

        function attachSearchToggle(bar, table) {
            if (bar.querySelector('.tfs-search-wrap')) return;
            const wrap = document.createElement('div');
            wrap.className = 'tfs-search-wrap tfs-injected';
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'tfs-search-input';
            input.placeholder = 'Search…';
            const savedSearch = sessionStorage.getItem(getTableKey(table) + '-search') || '';
            input.value = savedSearch;
            table._searchInput = input;
            let debounce;
            input.oninput = () => { clearTimeout(debounce); debounce = setTimeout(() => filterTable(table), 150); };
            input.onkeydown = (e) => {
                e.stopPropagation();
                if (e.key === 'Escape') { input.value = ''; filterTable(table); input.blur(); }
            };
            input.onmousedown = (e) => e.stopPropagation();
            input.onclick = (e) => e.stopPropagation();
            const toggleBtn = buildToolbarButton('tfs-search-toggle', 'Search table', SEARCH_SVG, (e) => {
                e.preventDefault(); e.stopPropagation();
                input.classList.toggle('open');
                if (input.classList.contains('open')) setTimeout(() => input.focus(), 60);
            });
            wrap.append(input, toggleBtn);
            bar.insertBefore(wrap, bar.firstChild);
            if (savedSearch) input.classList.add('open');
        }

        function exportCsv(table) {
            const headers = Array.from(table.querySelectorAll('thead tr th, thead tr td')).map(cellValue);
            const rows = Array.from(table.tBodies[0]?.rows || []).filter(r => r.style.display !== 'none');
            const data = rows.map(r => Array.from(r.cells).map(cellValue));
            const escape = (v) => '"' + String(v).replace(/"/g, '""') + '"';
            const csv = [headers, ...data].map(r => r.map(escape).join(',')).join('\r\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'table-export.csv';
            document.body.appendChild(a); a.click(); a.remove();
            URL.revokeObjectURL(url);
        }

        function copyHandlerFactory(table) {
            return (e) => {
                e.preventDefault(); e.stopPropagation();
                const tableClone = table.cloneNode(true);
                tableClone.querySelectorAll('.sort-indicator-wrapper, .filter-container').forEach(el => el.remove());
                tableClone.querySelectorAll('thead tr th, thead tr td').forEach(cell => {
                    cell.classList.remove('sortable-header', 'sort-asc', 'sort-desc');
                });
                const originalBodyRows = Array.from(table.tBodies[0]?.rows || []);
                Array.from(tableClone.tBodies[0]?.rows || []).forEach((cloneRow, i) => {
                    if (originalBodyRows[i]?.style.display === 'none') cloneRow.remove();
                });
                tableClone.querySelectorAll('a').forEach(a => a.replaceWith(document.createTextNode(a.textContent)));
                tableClone.style.borderCollapse = 'collapse';
                tableClone.querySelectorAll('th, td').forEach(cell => {
                    cell.style.border = '1px solid #000';
                    cell.style.padding = '4px 8px';
                });
                const htmlData = tableClone.outerHTML;

                const headers = Array.from(table.querySelectorAll('thead tr th, thead tr td')).map(cellValue);
                const visibleRows = Array.from(table.tBodies[0]?.rows || []).filter(r => r.style.display !== 'none');
                const bodyData = visibleRows.map(row => Array.from(row.cells).map(cellValue));
                const tsv = [headers, ...bodyData].map(r => r.join('\t')).join('\n');

                const btn = e.currentTarget;
                navigator.clipboard.write([
                    new ClipboardItem({
                        'text/html': new Blob([htmlData], { type: 'text/html' }),
                        'text/plain': new Blob([tsv], { type: 'text/plain' }),
                    })
                ]).then(() => {
                    btn.innerHTML = CHECK_SVG;
                    setTimeout(() => { btn.innerHTML = COPY_SVG; }, 1200);
                });
            };
        }

        function enhanceBar(bar, table, opts) {
            opts = opts || {};
            attachSearchToggle(bar, table);
            if (TFS_CONFIG.showCsvExport && !bar.querySelector('.global-csv-btn')) {
                bar.appendChild(buildToolbarButton('global-csv-btn', 'Export visible rows as CSV', CSV_SVG, (e) => {
                    e.preventDefault(); e.stopPropagation(); exportCsv(table);
                }));
            }
            if (opts.copy && !bar.querySelector('.global-copy-btn')) {
                bar.appendChild(buildToolbarButton('global-copy-btn', 'Copy table (rich text + TSV)', COPY_SVG, copyHandlerFactory(table)));
            }
            if (!bar.querySelector('.global-reset-btn')) {
                bar.appendChild(buildToolbarButton('global-reset-btn', 'Reset sorting, filters & search', RESET_SVG, (e) => {
                    e.preventDefault(); e.stopPropagation(); resetAll(table);
                }));
            }
        }

        function injectToolbar() {
            // Case 1: existing widget button bars (Lua query/table widgets)
            document.querySelectorAll('.sb-lua-directive-block:has(table) .button-bar').forEach(bar => {
                if (bar.dataset.generated) return;
                const block = bar.closest('.sb-lua-directive-block');
                const table = block?.nextElementSibling?.querySelector('table') || block?.querySelector('table');
                if (!table) return;
                enhanceBar(bar, table, { copy: false });
            });

            // Case 2: orphan tables (plain markdown tables, not in a Lua widget)
            document.querySelectorAll('.sb-table-widget').forEach(widget => {
                if (widget.closest('.sb-lua-directive-block')) return;
                if (widget.querySelector('.button-bar')) return;

                const table = widget.querySelector('table');
                if (!table) return;

                widget._mouseupGuard = widget._mouseupGuard || ((e) => { e.preventDefault(); e.stopPropagation(); });
                widget.addEventListener('mouseup', widget._mouseupGuard);

                const bar = document.createElement('div');
                bar.className = 'button-bar';
                bar.dataset.generated = "true";

                enhanceBar(bar, table, { copy: true });

                const contentDiv = document.createElement('div');
                contentDiv.className = 'content';
                const wrapperSpan = document.createElement('span');
                wrapperSpan.className = 'wrapper';
                wrapperSpan.appendChild(table);
                contentDiv.appendChild(wrapperSpan);

                const outerDiv = document.createElement('div');
                outerDiv.dataset.mdWrapper = "true";
                outerDiv.appendChild(bar);
                outerDiv.appendChild(contentDiv);

                widget.appendChild(outerDiv);
            });
        }

        function initTable(table) {
            if (table.dataset.sortedInit || table.rows.length === 0) return;
            const headerRow = table.querySelector("thead tr") || table.rows[0];
            if (!headerRow) return;
            table.dataset.sortedInit = "true";

            Array.from(table.tBodies[0]?.rows || []).forEach((row, i) => {
                if (row.dataset.orgIndex === undefined) row.dataset.orgIndex = i;
            });

            const sortState = getSortState(table);

            Array.from(headerRow.cells).forEach((cell, idx) => {
                cell.classList.add("sortable-header");
                const wrap = document.createElement("span");
                wrap.className = "sort-indicator-wrapper";
                wrap.innerHTML = CHEVRON_SVG;
                cell.appendChild(wrap);
                const cont = document.createElement("div");
                cont.className = "filter-container";
                cell.appendChild(cont);

                cell._sortHandler = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.target.closest('.filter-container')) return;
                    let state = getSortState(table);
                    const existing = state.find(s => s.index === idx);
                    if (e.shiftKey) {
                        // 3-state cycle per column when adding it as a secondary/tertiary key:
                        // not sorted -> asc -> desc -> not sorted (removed from the sort list)
                        if (existing) {
                            if (existing.asc) { existing.asc = false; }
                            else { state = state.filter(s => s.index !== idx); }
                        } else {
                            state.push({ index: idx, asc: true });
                        }
                    } else {
                        // 3-state cycle for a plain click: asc -> desc -> reset to original order.
                        // Clicking a different column always starts that column fresh at asc.
                        if (existing && state.length === 1) {
                            if (existing.asc) {
                                state = [{ index: idx, asc: false }];
                            } else {
                                state = [];
                            }
                        } else {
                            state = [{ index: idx, asc: true }];
                        }
                    }
                    setSortState(table, state);
                    applySortVisuals(table, state);
                    if (state.length === 0) restoreOriginalOrder(table);
                    else sortTable(table, state);
                };
                cell.addEventListener('mousedown', cell._sortHandler);
                cell.addEventListener('touchstart', cell._sortHandler);
                cell._sortUpHandler = (e) => { e.preventDefault(); e.stopPropagation(); };
                cell.addEventListener('mouseup', cell._sortUpHandler);
            });

            applySortVisuals(table, sortState);
            if (sortState.length) sortTable(table, sortState);

            // Fix: build the toolbar/wrapper structure first. For a plain markdown
            // table this is what moves the table into its [data-md-wrapper], which
            // is how updateRowCountBadge()/getButtonBarForTable() locate the bar.
            // Doing this after populateFilters() meant the very first filterTable()
            // call couldn't find a bar yet, so the row count only ever appeared
            // once something else (like Reset) called filterTable() a second time.
            injectToolbar();
            populateFilters(table);
        }

        const _docClickHandler = () => {
            if (_skipNextDocClick) { _skipNextDocClick = false; return; }
            document.querySelectorAll('.custom-dropdown-menu').forEach(m => m.classList.remove('show'));
        };
        document.addEventListener('click', _docClickHandler);

        const _escHandler = (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.custom-dropdown-menu.show').forEach(m => m.classList.remove('show'));
            }
        };
        document.addEventListener('keydown', _escHandler);

        const _resetAllHandler = () => {
            document.querySelectorAll('table[data-sorted-init]').forEach(resetAll);
        };
        window.addEventListener('sb-table-sorter-reset-all', _resetAllHandler);

        const obs = new MutationObserver((ms) => {
            ms.forEach(m => {
                if (m.addedNodes.length) {
                    document.querySelectorAll("table").forEach(initTable);
                    injectToolbar();
                }
            });
        });

        obs.observe(document.body, { childList: true, subtree: true });
        document.querySelectorAll("table").forEach(initTable);
        injectToolbar();

        /* ---- Hoist dropdown menus next to the table (scroll-safe, sibling-after-table) ---- */
        let hoistObserver;
        (function () {
            function bind(menu) {
                if (menu.__bound) return;
                const button = menu.parentElement;
                if (!button) return;
                const table = button.closest('table');
                if (!table) return;
                const tableParent = table.parentElement;
                if (!tableParent) return;

                function ensureSiblingPlacement() {
                    if (menu.parentElement !== tableParent || menu.previousSibling !== table) {
                        table.insertAdjacentElement('afterend', menu);
                    }
                }

                function position() {
                    const rect = button.getBoundingClientRect();
                    let left = rect.left;
                    let top = rect.bottom + 6;
                    const menuWidth = Math.max(menu.offsetWidth || 240, 240);
                    const vw = document.documentElement.clientWidth;
                    if (left + menuWidth > vw - 8) left = Math.max(8, vw - menuWidth - 8);
                    menu.style.left = Math.round(left) + 'px';
                    menu.style.top = Math.round(top) + 'px';
                }

                const observer = new MutationObserver(() => {
                    if (menu.classList.contains('show')) {
                        ensureSiblingPlacement();
                        position();
                        window.addEventListener('scroll', position, true);
                        window.addEventListener('resize', position);
                    } else {
                        button.appendChild(menu);
                        window.removeEventListener('scroll', position, true);
                        window.removeEventListener('resize', position);
                    }
                });
                observer.observe(menu, { attributes: true, attributeFilter: ['class'] });
                menu.__bound = true;
            }

            function scan() {
                document.querySelectorAll('.filter-container > .custom-dropdown-menu').forEach(bind);
            }
            scan();
            hoistObserver = new MutationObserver(scan);
            hoistObserver.observe(document.body, { childList: true, subtree: true });
        })();

        window.addEventListener("sb-table-sorter-unload", function cln() {
            obs.disconnect();
            hoistObserver?.disconnect();
            document.querySelectorAll(".sortable-header").forEach(c => {
                c.removeEventListener('mousedown', c._sortHandler);
                c.removeEventListener('touchstart', c._sortHandler);
                c.removeEventListener('mouseup', c._sortUpHandler);
                c.classList.remove("sortable-header", "sort-asc", "sort-desc");
                c.querySelector(".sort-indicator-wrapper")?.remove();
                c.querySelector(".filter-container")?.remove();
            });
            document.querySelectorAll(".tfs-injected").forEach(el => el.remove());
            document.querySelectorAll(".button-bar[data-generated='true']").forEach(b => b.remove());
            document.querySelectorAll("[data-md-wrapper='true']").forEach(outerDiv => {
                const table = outerDiv.querySelector('table');
                const widget = outerDiv.parentElement;
                if (table && widget) widget.appendChild(table);
                outerDiv.remove();
            });
            document.querySelectorAll('.sb-table-widget').forEach(w => {
                if (w._mouseupGuard) { w.removeEventListener('mouseup', w._mouseupGuard); delete w._mouseupGuard; }
            });
            document.removeEventListener('mouseup', _mdTableEventGuard, true);
            document.removeEventListener('click', _mdTableEventGuard, true);
            document.removeEventListener('focusin', _mdTableEventGuard, true);
            document.removeEventListener('click', _docClickHandler);
            document.removeEventListener('keydown', _escHandler);
            window.removeEventListener('sb-table-sorter-reset-all', _resetAllHandler);
            document.querySelectorAll("tbody tr").forEach(r => r.style.display = "");
            document.querySelectorAll("table").forEach(t => {
                delete t.dataset.sortedInit;
                delete t.dataset.tfsKey;
                delete t._searchInput;
                if (t.id.startsWith('sb-table-pos-')) t.removeAttribute('id');
            });
            style.remove();
            window.removeEventListener("sb-table-sorter-unload", cln);
        });
    })();
    ]]
    js.window.document.body.appendChild(scriptEl)
    print("Table Sorter/Filter: Modern UI Active.")
end

command.define { name = "Table: Enable Sorting and Filter", run = function() enableTableSorter() end }
command.define { name = "Table: Disable Sorting and Filter", run = function() cleanupSorter() end }
command.define { name = "Table: Reset All Tables On This Page", run = function()
    local ev = js.window.document.createEvent("Event")
    ev.initEvent("sb-table-sorter-reset-all", true, true)
    js.window.dispatchEvent(ev)
end }

if enabled then
    enableTableSorter()
else
    cleanupSorter()
end


-- -------------------------------------
-- Adding Multiline support inside cells
-- -------------------------------------
-- to disable it use: config.set("multilineTables", { enabled = false })

function enableMultilineTables()
    local scriptId = "sb-multiline-tables-runtime"
    local existing = js.window.document.getElementById(scriptId)

    if existing then
        return
    end

    local scriptEl = js.window.document.createElement("script")
    scriptEl.id = scriptId
    scriptEl.innerHTML = [[
    (function() {
        function processTable(table) {
            if (table.dataset.multilineProcessed) return;

            const cells = table.querySelectorAll('td, th');
            cells.forEach(cell => {
                const raw = cell.innerHTML;
                if (raw.includes('&lt;br&gt;') ||
                    raw.includes('&lt;br/&gt;') ||
                    raw.includes('<br>') ||
                    raw.includes('\\n')) {

                    let content = raw;
                    content = content.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
                    content = content.replace(/\\n/g, '<br>');

                    cell.innerHTML = content;
                }
            });
            table.dataset.multilineProcessed = "true";
        }

        document.querySelectorAll("table").forEach(processTable);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    document.querySelectorAll("table").forEach(processTable);
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        window.addEventListener("sb-multiline-cleanup", function cleanup() {
            observer.disconnect();
            document.querySelectorAll("table").forEach(t => delete t.dataset.multilineProcessed);
            window.removeEventListener("sb-multiline-cleanup", cleanup);
        });
    })();
    ]]
    js.window.document.body.appendChild(scriptEl)
end

function disableMultilineTables()
    local event = js.window.document.createEvent("Event")
    event.initEvent("sb-multiline-cleanup", true, true)
    js.window.dispatchEvent(event)

    local scriptId = "sb-multiline-tables-runtime"
    local existing = js.window.document.getElementById(scriptId)
    if existing then
        existing.remove()
    end
end

local multilineCfg = config.get("multilineTables") or {}
local multilineEnabled = multilineCfg.enabled ~= false

if multilineEnabled then
  enableMultilineTables()
else
  disableMultilineTables()
end

command.define { name = "Table: Enable Multiline", run = function() enableMultilineTables() end }
command.define { name = "Table: Disable Multiline", run = function() disableMultilineTables() end }

```

## Discussion
- This is a modernized remake of the original library — same underlying approach (space-lua + space-style injected client-side JS), rebuilt UI/UX and extra features as described above.
- Community thread: [Silverbullet Community](https://community.silverbullet.md/t/todo-task-manager-global-interactive-table-sorter-filtering/3767?u=mr.red)