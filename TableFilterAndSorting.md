---
name: "Library/Mr-xRed/TableFilterAndSorting"
tags: meta/library
pageDecoration.prefix: "🛠️ "
---

# Silverbullet Table Sorting andd Filtering

- This Library adds table Sorting and Filtering to all Silverbullt Tables inside your Space

> **note** Enable/Disable Commands and Config example
> `Table: Enable Sorting and Filter` - Command to manually ENABLE Soring&Filtering (for current instance)
>
> `Table: Disable Sorting and Filter` - Command to manually DISABLE Soring&Filtering (for current instance)
>
> `config.set("tableSort", { enabled = false })` - enable/disable for Sorting&Filter to autostart (default: true)

![DocumentExplorer_Screenshot](https://raw.githubusercontent.com/Mr-xRed/silverbullet-libraries/refs/heads/main/screenshots/TableSortAndFilters-Screenshot.png)

## Config Example:

```lua

-- Table Sorting is enabled by default. To disable it and use only the comands use following config
config.set("tableSort", { enabled = false })
-- to disable it us: 
config.set("multilineTables", { enabled = false })

```

## Table Filter and Sorting Styling

```space-style

/*---------- System Styles Overrides ----------*/

#sb-main .cm-editor .sb-lua-directive-block:has(.sortable-header) .button-bar
{ top: -40px; padding:0; border-radius: 2em; opacity:0.2; transition: all 0.5s ease;} 
#sb-main .cm-editor .sb-lua-directive-block:has(.sortable-header) .button-bar:hover { opacity:1;}
#sb-main .cm-editor .sb-table-widget { overflow: visible !important; position: relative !important;}

/*---------- Sorting and Filter Styles ----------*/
 .sortable-header { 
    cursor: pointer !important; 
    position: relative !important; 
    transition: background 0.2s;
    white-space: nowrap;
    padding-left: 30px !important; 
    padding-right: 25px !important; 
    isolation: isolate;
}
.sortable-header:hover { 
    background: rgba(128, 128, 128, 0.08) !important; 
}
.sort-indicator-wrapper {
    display: inline-flex;
    flex-direction: column;
    vertical-align: middle;
    line-height: 0.8;
    font-size: 0.8em;
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
}
.sort-indicator-wrapper span { opacity: 0.2; }
.sort-asc .up, .sort-desc .down {
    opacity: 1 !important;
    color: white;
}

.filter-container {
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    cursor: pointer;
}

/* ---- Filter icon: default funnel, swap to funnel-plus when active ---- */
.filter-container::after {
  content: "";
  width: 15px;
  height: 15px;
  display: inline-block;
  opacity: 0.2;
  background-color: currentColor; /* stroke uses this because we mask it */
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M13.354 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l1.218-1.348'/><path d='M16 6h6'/><path d='M19 3v6'/></svg>") no-repeat center / contain;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M13.354 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l1.218-1.348'/><path d='M16 6h6'/><path d='M19 3v6'/></svg>") no-repeat center / contain;
  transition: opacity 0.12s ease, color 0.12s ease, filter 0.12s ease;
}

/* hover visual boost (optional) */
.filter-container:hover::after { opacity: 1; }

/* when active -> swap mask to funnel-plus and tint to accent */
.filter-container.active::after {
  opacity: 1;
  width: 18px;
  height: 18px;
  color: var(--root-color, white);
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z'/></svg>") no-repeat center / contain;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z'/></svg>") no-repeat center / contain;
}


/* ----- Dropdown: escape clipping and float above everything ----- */
.custom-dropdown-menu {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  background: oklch(from var(--root-background-color) l c h / 1);
  border: 2px solid rgba(128, 128, 128, 0.35);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  min-width: 180px;
  max-width: 260px;
  max-height: 300px;
  overflow-y: auto;
  display: none;
  padding: 8px;
}


.dropdown-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
}

.custom-dropdown-menu.show {
  display: flex;
  flex-direction: column;
}


/* small touch-ups so the menu contents keep working as before */
.custom-dropdown-menu .dropdown-actions { z-index: 1; }
.custom-dropdown-menu .dropdown-item { z-index: 1; }

/* ----- Dropdown: escape clipping and float above everything ----- */
            
.dropdown-item {
    display: flex;
    align-items: center;
    padding: 6px;
    font-size: 14px;
    border-radius: 5px;
    color: var(--root-color, #000);
    transition: all 0.15s;
    cursor: pointer;
}
.dropdown-item:hover { background: rgba(128, 128, 128, 0.1); }
.dropdown-item input { margin-right: 8px; }

.dropdown-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(128, 128, 128, 0.2);
}

.apply-btn {
    background: var(--ui-accent-color, #007bff);
    color: white; border: none; padding: 5px; border-radius: 4px;
    cursor: pointer; font-weight: bold; grid-column: span 2;
}

.action-btn {
    font-size: 11px; font-weight: bold; cursor: pointer;
    padding: 4px; text-align: center;
    border: 1px solid rgba(128, 128, 128, 0.3); border-radius: 4px;
}



.button-bar .global-reset-btn { margin-left: auto; background: transparent; border: 1px solid transparent; cursor: pointer; opacity: 0.6; padding: 4px; border-radius: 4px; transition: all 0.2s; color: inherit; }
    
.button-bar .global-reset-btn:hover { opacity: 1; background-color: var(--sb-secondary-background, rgba(0,0,0,0.05)); border-color: var(--sb-border-color, #ddd); }

.button-bar {
    position: absolute;
    top: -30px;
    right: 0px;
}


```

## Filter and Sort Tables
```space-lua
-- priority: -1

-- ------------- Load Config -------------
local cfg = config.get("tableSort") or {}
local enabled = cfg.enabled ~= false


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
    scriptEl.innerHTML = [[
    (function() {
        const style = document.createElement('style');
        style.innerHTML = `
            
        `;
        document.head.appendChild(style);

        // Fix: flag to tell the document click handler to skip one closing cycle
        // when a filter menu was just opened via mousedown (desktop: mousedown fires
        // first and opens the menu, then the browser fires click which would close it)
        let _skipNextDocClick = false;

        // Fix: document-level capture-phase guard for markdown tables only.
        // SilverBullet/CM6 registers its edit-mode trigger with a capture listener
        // higher in the DOM, so bubble-phase stopPropagation on the widget is too late.
        // By capturing at document level we sit above CM in the event chain and can
        // intercept mouseup and click before CM ever sees them — but only for our
        // interactive elements inside markdown widgets (not lua/query widgets).
        const _mdTableEventGuard = (e) => {
            if (e.button !== undefined && e.button !== 0) return;
            const target = e.target;
            if (!target.closest('.sortable-header') && !target.closest('.filter-container') && !target.closest('.global-reset-btn')) return;
            const widget = target.closest('.sb-table-widget');
            if (!widget) return;
            if (widget.closest('.sb-lua-directive-block')) return;
            // If consuming a click event, reset the skip flag so the menu-close
            // handler isn't left in a permanently-skipped state
            if (e.type === 'click') { _skipNextDocClick = false; }
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        };
        document.addEventListener('mouseup', _mdTableEventGuard, true);
        document.addEventListener('click', _mdTableEventGuard, true);

        // Helper to find a stable ID for a table based on its position
        function getTableKey(table) {
            if (table.id) return table.id;
            
            // Generate a stable ID based on index in document
            const allTables = Array.from(document.querySelectorAll('table'));
            const index = allTables.indexOf(table);
            const stableId = 'sb-table-pos-' + index;
            table.id = stableId;
            return stableId;
        }

        function filterTable(table) {
            const tbody = table.tBodies[0];
            if (!tbody) return;
            const rows = Array.from(tbody.rows);
            const headerRow = table.querySelector("thead tr") || table.rows[0];
            const filterContainers = Array.from(headerRow.cells).map(cell => cell.querySelector('.filter-container'));

            const state = filterContainers.map(c => {
                if (!c) return "all";
                try {
                    return (c.dataset.value && c.dataset.value !== "all") ? JSON.parse(c.dataset.value) : "all";
                } catch(e) { return "all"; }
            });
            sessionStorage.setItem(getTableKey(table) + '-filters', JSON.stringify(state));

            rows.forEach(row => {
                const isVisible = filterContainers.every((container, colIndex) => {
                    let selectedValues = "all";
                    if (container && container.dataset.value && container.dataset.value !== "all") {
                        try { selectedValues = JSON.parse(container.dataset.value); } catch(e) { selectedValues = "all"; }
                    }
                    if (selectedValues === "all" || (Array.isArray(selectedValues) && selectedValues.length === 0)) return true;
                    const cell = row.cells[colIndex];
                    const cellText = cell ? (cell.getAttribute('data-fulltexttext') || cell.textContent.trim()) : "";
                    return selectedValues.includes(cellText);
                });
                row.style.display = isVisible ? "" : "none";
            });
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
                        // Fix: if the menu just became visible, tell the document click
                        // handler (which fires right after this mousedown on desktop) to
                        // skip its closing cycle so the menu stays open
                        if (menu.classList.contains('show')) {
                            _skipNextDocClick = true;
                        }
                    };
                    container.onmousedown = filterInteractionHandler;
                    container.ontouchstart = filterInteractionHandler;
                    // Fix: prevent mouseup from reaching CodeMirror, which watches mouseup
                    // to activate edit mode when a click is completed inside its DOM
                    container.onmouseup = (e) => { e.preventDefault(); e.stopPropagation(); };
                }

                const uniqueValues = new Set();
                rows.forEach(row => {
                    const c = row.cells[colIndex];
                    const txt = c ? (c.getAttribute('data-fulltexttext') || c.textContent.trim()) : "";
                    if (txt) uniqueValues.add(txt);
                });

                const savedVal = savedFilters[colIndex] || "all";
                container.dataset.value = (savedVal === "all") ? "all" : JSON.stringify(savedVal);
                container.classList.toggle('active', savedVal !== "all" && Array.isArray(savedVal) && savedVal.length > 0);

                menu.innerHTML = '';
                menu.onclick = (e) => e.stopPropagation();

                const actionWrapper = document.createElement('div');
                actionWrapper.className = 'dropdown-actions';

                const toggleAllBtn = document.createElement('div');
                toggleAllBtn.className = 'action-btn';
                toggleAllBtn.textContent = 'Toggle All';
                toggleAllBtn.onclick = () => {
                    const cbs = menu.querySelectorAll('input[type="checkbox"]');
                    const allChecked = Array.from(cbs).every(i => i.checked);
                    cbs.forEach(i => i.checked = !allChecked);
                };

                const invertBtn = document.createElement('div');
                invertBtn.className = 'action-btn';
                invertBtn.textContent = 'Invert';
                invertBtn.onclick = () => {
                    const cbs = menu.querySelectorAll('input[type="checkbox"]');
                    cbs.forEach(i => i.checked = !i.checked);
                };

                const okBtn = document.createElement('button');
                okBtn.className = 'apply-btn';
                okBtn.textContent = 'OK';
                okBtn.onclick = () => {
                    const checked = Array.from(menu.querySelectorAll('input:checked')).map(i => i.value);
                    if (checked.length === 0) {
                        container.dataset.value = "all";
                        container.classList.remove('active');
                    } else {
                        container.dataset.value = JSON.stringify(checked);
                        container.classList.add('active');
                    }
                    menu.classList.remove('show');
                    filterTable(table);
                };

                actionWrapper.append(toggleAllBtn, invertBtn, okBtn);
                menu.appendChild(actionWrapper);

                const currentSelection = (savedVal === "all") ? [] : savedVal;
                Array.from(uniqueValues).sort().forEach(val => {
                    const item = document.createElement('label');
                    item.className = 'dropdown-item';
                    const cb = document.createElement('input');
                    cb.type = 'checkbox';
                    cb.value = val;
                    if (currentSelection.includes(val)) cb.checked = true;
              //      item.append(cb, document.createTextNode(val));
               
                    const text = document.createElement('span');
                    text.className = 'dropdown-text';
                    text.textContent = val;
                    item.append(cb, text);
  
                    menu.appendChild(item);
                });
            });
            filterTable(table);
        }

        function sortTable(table, colIndex, asc, isAuto = false) {
            const tbody = table.tBodies[0];
            if (!tbody) return;
            if (!isAuto) sessionStorage.setItem(getTableKey(table) + '-sort', JSON.stringify({ index: colIndex, asc: asc }));
            const rows = Array.from(tbody.rows);
            const sorted = rows.sort((a, b) => {
                const aCell = a.cells[colIndex], bCell = b.cells[colIndex];
                const aT = (aCell?.getAttribute('data-fulltexttext') || aCell?.textContent.trim()) || "";
                const bT = (bCell?.getAttribute('data-fulltexttext') || bCell?.textContent.trim()) || "";
                const aN = parseFloat(aT.replace(/[^0-9.-]+/g, "")), bN = parseFloat(bT.replace(/[^0-9.-]+/g, ""));
                if (!isNaN(aN) && !isNaN(bN) && !isNaN(aT) && !isNaN(bT)) return asc ? aN - bN : bN - aN;
                return asc ? aT.localeCompare(bT, undefined, {numeric: true}) : bT.localeCompare(aT, undefined, {numeric: true});
            });
            tbody.append(...sorted);
        }



/* ---- Hoist dropdown menus next to the table (not into <body>) ---- */
/* ---- Anchor dropdown to filter button (scroll-safe, precise) ---- */
/* ---- Universal dropdown hoist: always sibling-after-table ---- */
(function () {

  function bind(menu) {
    if (menu.__bound) return;

    const button = menu.parentElement; // .filter-container
    if (!button) return;

    const table = button.closest('table');
    if (!table) return;

    const tableParent = table.parentElement;
    if (!tableParent) return;

    // Insert menu right after table (once)
    function ensureSiblingPlacement() {
      if (menu.parentElement !== tableParent ||
          menu.previousSibling !== table) {
        table.insertAdjacentElement('afterend', menu);
      }
    }

    function position() {
      const rect = button.getBoundingClientRect();

      let left = rect.left;
      let top  = rect.bottom + 6;

      // Clamp horizontally to viewport
      const menuWidth = Math.max(menu.offsetWidth || 220, 220);
      const vw = document.documentElement.clientWidth;

      if (left + menuWidth > vw - 8) {
        left = Math.max(8, vw - menuWidth - 8);
      }

      menu.style.left = Math.round(left) + 'px';
      menu.style.top  = Math.round(top)  + 'px';
    }

    const observer = new MutationObserver(() => {
      if (menu.classList.contains('show')) {
        ensureSiblingPlacement();
        position();

        // Reposition on anything that could move the button
        window.addEventListener('scroll', position, true);
        window.addEventListener('resize', position);
      } else {
        // Restore original DOM location when closed
        button.appendChild(menu);
        window.removeEventListener('scroll', position, true);
        window.removeEventListener('resize', position);
      }
    });

    observer.observe(menu, {
      attributes: true,
      attributeFilter: ['class']
    });

    menu.__bound = true;
  }

  function scan() {
    document
      .querySelectorAll('.filter-container > .custom-dropdown-menu')
      .forEach(bind);
  }

  scan();

  new MutationObserver(scan).observe(document.body, {
    childList: true,
    subtree: true
  });

})();


/* ---- Hoist dropdown menus next to the table (not into <body>) ---- */


        function resetAll(table) {
            const tableKey = getTableKey(table);
            sessionStorage.removeItem(tableKey + '-filters');
            sessionStorage.removeItem(tableKey + '-sort');
            const headerRow = table.querySelector("thead tr") || table.rows[0];
            Array.from(headerRow.cells).forEach(cell => {
                cell.classList.remove("sort-asc", "sort-desc");
                const cont = cell.querySelector('.filter-container');
                if (cont) {
                    cont.dataset.value = "all";
                    cont.classList.remove('active');
                }
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

        function injectResetButton() {
            // Case 1: Existing button bars (Widgets)
            document.querySelectorAll('.button-bar').forEach(bar => {
                if (bar.querySelector('.global-reset-btn')) return;
                // Ignore button bars that we injected ourselves (handled in Case 2 logic logic via absence check, preventing loops)
                if (bar.dataset.generated) return;

                const btn = document.createElement('button');
                btn.className = 'global-reset-btn';
                btn.title = 'Reset Table Filters/Sorting';
                btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-restart-icon lucide-list-restart"><path d="M21 5H3"/><path d="M7 12H3"/><path d="M7 19H3"/><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14"/><path d="M11 10v4h4"/></svg>`;
                const resetHandler = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const block = bar.closest('.sb-lua-directive-block');
                    const table = block?.nextElementSibling?.querySelector('table') || block?.querySelector('table');
                    if (table) resetAll(table);
                };
                btn.onmousedown = resetHandler;
                btn.ontouchstart = resetHandler;
                // Fix: prevent mouseup from reaching CodeMirror, which watches mouseup
                // to activate edit mode when a click is completed inside its DOM
                btn.onmouseup = (e) => { e.preventDefault(); e.stopPropagation(); };
                bar.appendChild(btn);
            });

            // Case 2: Orphan tables (Markdown tables not in a widget/query block)
            document.querySelectorAll('.sb-table-widget').forEach(widget => {
                // Skip if it's inside a Lua block (already handled by Case 1 via the outer button bar)
                if (widget.closest('.sb-lua-directive-block')) return;
                
                // Skip if we already injected one or one exists
                if (widget.querySelector('.button-bar')) return;

                const table = widget.querySelector('table');
                if (!table) return;

                // Fix: intercept mouseup at the widget wrapper level for markdown tables only.
                // CM lives above this widget in the DOM and watches mouseup to activate
                // edit mode; stopping it here prevents that without affecting query/widget tables.
                widget._mouseupGuard = (e) => { e.preventDefault(); e.stopPropagation(); };
                widget.addEventListener('mouseup', widget._mouseupGuard);

                const bar = document.createElement('div');
                bar.className = 'button-bar';
                bar.dataset.generated = "true"; // Mark as auto-generated for cleanup
                // I tweaked this CSS slightly to ensure it doesn't collapse or overlap the header
                bar.style.cssText = "display: flex; justify-content: flex-end; margin-bottom: 4px; padding: 2px 4px; min-height: 24px;";

                const btn = document.createElement('button');
                btn.className = 'global-reset-btn';
                btn.title = 'Reset Table Filters/Sorting';
                btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-restart-icon lucide-list-restart"><path d="M21 5H3"/><path d="M7 12H3"/><path d="M7 19H3"/><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14"/><path d="M11 10v4h4"/></svg>`;
                const resetHandler = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    resetAll(table);
                };
                btn.onmousedown = resetHandler;
                btn.ontouchstart = resetHandler;
                // Fix: prevent mouseup from reaching CodeMirror, which watches mouseup
                // to activate edit mode when a click is completed inside its DOM
                btn.onmouseup = (e) => { e.preventDefault(); e.stopPropagation(); };
                
                bar.appendChild(btn);

                // Mirror the query/widget DOM hierarchy:
                // div[data-md-wrapper] > div.button-bar + div.content > span.wrapper > table
                const contentDiv = document.createElement('div');
                contentDiv.className = 'content';
                const wrapperSpan = document.createElement('span');
                wrapperSpan.className = 'wrapper';
                wrapperSpan.appendChild(table);
                contentDiv.appendChild(wrapperSpan);

                const outerDiv = document.createElement('div');
                outerDiv.dataset.mdWrapper = "true"; // Mark for cleanup
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

            // Track original order for reset functionality
            Array.from(table.tBodies[0]?.rows || []).forEach((row, i) => {
                if (row.dataset.orgIndex === undefined) row.dataset.orgIndex = i;
            });

            const tableKey = getTableKey(table);
            const savedSort = JSON.parse(sessionStorage.getItem(tableKey + '-sort') || "null");

            Array.from(headerRow.cells).forEach((cell, idx) => {
                cell.classList.add("sortable-header");
                const wrap = document.createElement("span");
                wrap.className = "sort-indicator-wrapper";
                wrap.innerHTML = '<span class="up">▲</span><span class="down">▼</span>';
                cell.appendChild(wrap);
                const cont = document.createElement("div");
                cont.className = "filter-container";
            /* cont.setAttribute("data-icon", "🔽");*/
                cell.appendChild(cont);

                cell._sortHandler = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.target.closest('.filter-container')) return;
                    Array.from(headerRow.cells).forEach(c => { if(c!==cell) c.classList.remove("sort-asc", "sort-desc"); });
                    const isAsc = cell.classList.contains("sort-asc");
                    cell.classList.remove("sort-asc", "sort-desc");
                    cell.classList.add(isAsc ? "sort-desc" : "sort-asc");
                    sortTable(table, idx, !isAsc);
                };
                cell.addEventListener('mousedown', cell._sortHandler);
                cell.addEventListener('touchstart', cell._sortHandler);
                // Fix: prevent mouseup from reaching CodeMirror, which watches mouseup
                // to activate edit mode when a click is completed inside its DOM
                cell._sortUpHandler = (e) => { e.preventDefault(); e.stopPropagation(); };
                cell.addEventListener('mouseup', cell._sortUpHandler);

                if (savedSort && savedSort.index === idx) {
                    cell.classList.add(savedSort.asc ? "sort-asc" : "sort-desc");
                    sortTable(table, idx, savedSort.asc, true);
                }
            });
            populateFilters(table);
            injectResetButton();
        }

        // Fix: check the flag before closing menus — if a filter was just opened via
        // mousedown, skip this one click cycle so the menu stays visible on desktop
        document.addEventListener('click', () => {
            if (_skipNextDocClick) { _skipNextDocClick = false; return; }
            document.querySelectorAll('.custom-dropdown-menu').forEach(m => m.classList.remove('show'));
        });

        const obs = new MutationObserver((ms) => {
            ms.forEach(m => {
                if (m.addedNodes.length) {
                    document.querySelectorAll("table").forEach(initTable);
                    injectResetButton();
                }
            });
        });

        obs.observe(document.body, { childList: true, subtree: true });
        document.querySelectorAll("table").forEach(initTable);
        injectResetButton();

        window.addEventListener("sb-table-sorter-unload", function cln() {
            obs.disconnect();
            document.querySelectorAll(".sortable-header").forEach(c => {
                c.removeEventListener('click', c._sortHandler);
                c.removeEventListener('mousedown', c._sortHandler);
                c.removeEventListener('touchstart', c._sortHandler);
                c.removeEventListener('mouseup', c._sortUpHandler);
                c.classList.remove("sortable-header", "sort-asc", "sort-desc");
                c.querySelector(".sort-indicator-wrapper")?.remove();
                c.querySelector(".filter-container")?.remove();
            });
            document.querySelectorAll(".global-reset-btn").forEach(b => b.remove());
            // Cleanup generated button bars for markdown tables
            document.querySelectorAll(".button-bar[data-generated='true']").forEach(b => b.remove());
            // Cleanup outer wrapper divs added to markdown table wrappers, restoring table to widget
            document.querySelectorAll("[data-md-wrapper='true']").forEach(outerDiv => {
                const table = outerDiv.querySelector('table');
                const widget = outerDiv.parentElement;
                if (table && widget) {
                    widget.appendChild(table);
                }
                outerDiv.remove();
            });
            // Cleanup widget-level mouseup guards added to markdown table wrappers
            document.querySelectorAll('.sb-table-widget').forEach(w => {
                if (w._mouseupGuard) {
                    w.removeEventListener('mouseup', w._mouseupGuard);
                    delete w._mouseupGuard;
                }
            });
            // Cleanup document-level capture guards for markdown table edit-mode prevention
            document.removeEventListener('mouseup', _mdTableEventGuard, true);
            document.removeEventListener('click', _mdTableEventGuard, true);

            document.querySelectorAll("tbody tr").forEach(r => r.style.display = "");
            document.querySelectorAll("table").forEach(t => {
                delete t.dataset.sortedInit;
                if (t.id.startsWith('sb-table-pos-')) t.removeAttribute('id');
            });
            style.remove();
            window.removeEventListener("sb-table-sorter-unload", cln);
        });
    })();
    ]]
    js.window.document.body.appendChild(scriptEl)
    print("Table Sorter/Filter: Advanced UI Active.")
end

command.define { name = "Table: Enable Sorting and Filter", run = function() enableTableSorter() end }
command.define { name = "Table: Disable Sorting and Filter", run = function() cleanupSorter() end }



if enabled then
    enableTableSorter()
else
    cleanupSorter()
    return
end




-- -------------------------------------
-- Adding Multiline support inside cells
-- -------------------------------------
-- to disable it us: config.set("multilineTables.enabled", false)


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
                    // Replace escaped or literal <br> tags
                    content = content.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
                    // Replace literal \n strings
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

local multilineEnabled = config.get("multilineTables.enabled")

if multilineEnabled == nil then multilineEnabled = true end
if multilineEnabled then enableMultilineTables() end

command.define { name = "Table: Enable Multiline", run = function() enableMultilineTables() end }
command.define { name = "Table: Disable Multiline", run = function() disableMultilineTables() end }

```




## Discussion to this Library
- [Silverbullet Community](https://community.silverbullet.md/t/todo-task-manager-global-interactive-table-sorter-filtering/3767?u=mr.red)