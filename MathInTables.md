---
name: "Library/Mr-xRed/MathInTables"
tags: meta/library
pageDecoration.prefix: "🧮 "
---

# Silverbullet Math In Tables

- This Library renders KaTeX (`$...$` and `$$...$$`) expressions inside table cells in **reading/preview mode**, where SilverBullet's table widget renderer normally leaves them as raw, un-rendered text.
- Requires **[MrMugame/silverbullet-math](https://github.com/MrMugame/silverbullet-math)** to already be installed and working for normal (non-table) `$formula$` text — this library reuses that plugin's own KaTeX module rather than bundling a second copy.
- Designed to be used **alongside** `TableFilterAndSorting.md` (by Mr-xRed) — if you use both, use the fixed copy of that library that protects math spans from its multiline `\n` → `<br>` conversion, or this library's rendering can still get fed already-corrupted text.

> **note** Enable/Disable Commands and Config example
> `Table: Enable Math Rendering` - Command to manually ENABLE math rendering in tables (for current instance)
>
> `Table: Disable Math Rendering` - Command to manually DISABLE math rendering in tables (for current instance)
>
> `config.set("mathInTables", { enabled = false })` - enable/disable math-in-tables autostart (default: true)

## Why this is needed

SilverBullet's live-preview editor renders `$...$` math fine while you're editing a table, but the **rendered table widget** (the actual `<table>` element shown in reading/preview mode) is built by a separate code path that never runs the math plugin's decorations — so the raw `$...$` text is shown literally instead of the formula. See the [upstream issue](https://github.com/MrMugame/silverbullet-math/issues/5) for background; the plugin maintainer has said a proper fix isn't easy since it needs SilverBullet's own parser to change.

This library works around that by watching the DOM for rendered `<table>` elements (the same technique `TableFilterAndSorting.md` uses for sorting/filtering) and manually running KaTeX on any un-rendered `$...$` / `$$...$$` text it finds inside `td`/`th` cells.

## ⚠️ Important: check your katex.mjs path

The script below imports KaTeX from `.fs/Library/mrmugame/Silverbullet-Math/katex.mjs`, guessed from the `silverbullet-math` plugin's own source. **Your actual path may differ** depending on how you installed that library. To confirm:

1. Open your browser's DevTools → Network tab.
2. Trigger a normal `$formula$` render anywhere outside a table (edit and exit a line containing one).
3. Find the `katex.mjs` request and copy its exact request URL.
4. Paste that URL into the `katexPath` variable in the `space-lua` block below, replacing the guessed one.

## Math In Tables

```space-lua
-- priority: -1

-- ------------- Load Config -------------
local mathTablesCfg = config.get("mathInTables") or {}
local mathTablesEnabled = mathTablesCfg.enabled ~= false

-- Adjust this if your silverbullet-math install path differs.
-- See the "check your katex.mjs path" note above.
local katexPath = mathTablesCfg.katexPath or "Library/mrmugame/Silverbullet-Math/katex.mjs"

local function cleanupMathTables()
    local scriptId = "sb-math-in-tables-runtime"
    local existing = js.window.document.getElementById(scriptId)

    if existing then
        local event = js.window.document.createEvent("Event")
        event.initEvent("sb-math-tables-unload", true, true)
        js.window.dispatchEvent(event)

        existing.remove()
        print("Table Math: Disabled")
    else
        print("Table Math: Already inactive")
    end
end

function enableMathInTables()
    local scriptId = "sb-math-in-tables-runtime"
    if js.window.document.getElementById(scriptId) then
        print("Table Math: Already active")
        return
    end

    -- The import happens natively inside the browser
    -- script itself, using a real (correctly-awaited) dynamic import().
    local prefix = (system.getURLPrefix and system.getURLPrefix()) or ""
    local fallbackUrl = prefix .. ".fs/" .. katexPath

    local scriptEl = js.window.document.createElement("script")
    scriptEl.id = scriptId
    scriptEl.innerHTML = [[
    (function() {
        const FALLBACK_KATEX_URL = "]] .. fallbackUrl .. [[";

        // Fix: try to auto-detect the real katex.mjs path from a <link>
        // tag the math plugin already injected elsewhere on the page
        // (it adds one next to every rendered $formula$), so a wrong
        // guess in FALLBACK_KATEX_URL doesn't silently break things.
        function detectKatexUrl() {
            const link = document.querySelector('link[href*="katex"]');
            if (link) {
                return link.getAttribute('href').replace(/katex\.min\.css.*$/, 'katex.mjs');
            }
            return null;
        }

        function loadKatex() {
            const detected = detectKatexUrl();
            const url = detected || FALLBACK_KATEX_URL;
            console.log("Table Math: loading KaTeX from", url, detected ? "(auto-detected)" : "(fallback/config path)");
            return import(url).then(mod => {
                const katex = mod.default || mod;
                if (!katex || typeof katex.renderToString !== "function") {
                    throw new Error("module loaded but has no renderToString()");
                }
                console.log("Table Math: KaTeX loaded OK.");
                return katex;
            }).catch(err => {
                console.error("Table Math: failed to load KaTeX from", url, "-", err.message,
                    "\nOpen DevTools > Network, trigger a normal (non-table) $formula$ render, " +
                    "find the katex.mjs request, and set that exact URL as katexPath in " +
                    "config.set('mathInTables', { katexPath = '...' }).");
                return null;
            });
        }

        function reverseEscapeSpans(html) {
            // SilverBullet wraps every backslash-escaped character in
            // <span class="escape">X</span>. A lone escaped BACKSLASH here
            // is the collapsed remains of a LaTeX "\\" row separator
            // (matrices, aligned blocks) — restore it to two backslashes.
            // Any other escaped character (an intentionally escaped "_"
            // or "*", say) is already correct once unwrapped.
            return html.replace(/<span class="escape"[^>]*>([\s\S]*?)<\/span>/gi, (m, ch) => {
                return ch === '\\' ? '\\\\' : ch;
            });
        }

        function reverseInlineEmphasis(html) {
            // Bare underscores are everywhere in LaTeX subscripts
            // (\alpha_p, \theta_{claw}, \mathbf{M}_k...). SilverBullet
            // runs cell content through normal Markdown inline parsing,
            // which treats _..._ / __..__ as emphasis — consuming the
            // underscore as markup and wrapping the span in <em>/<strong>,
            // losing the literal character entirely. Put it back.
            let out = html;
            out = out.replace(/<strong>\s*<em>([\s\S]*?)<\/em>\s*<\/strong>/gi, '___$1___');
            out = out.replace(/<em>\s*<strong>([\s\S]*?)<\/strong>\s*<\/em>/gi, '___$1___');
            out = out.replace(/<strong>([\s\S]*?)<\/strong>/gi, '__$1__');
            out = out.replace(/<em>([\s\S]*?)<\/em>/gi, '_$1_');
            return out;
        }

        function extractCellSource(cell) {
            let html = cell.innerHTML;
            html = reverseEscapeSpans(html);
            html = reverseInlineEmphasis(html);
            // Assigning to a detached element and reading textContent
            // decodes any remaining HTML entities (&amp; -> &, needed for
            // LaTeX's matrix column separator) and strips leftover tags.
            const scratch = document.createElement('div');
            scratch.innerHTML = html;
            return scratch.textContent || '';
        }

        function mergeOrphanRows(table) {
            // A cell can't contain a real line break in Markdown table
            // syntax — pressing Enter inside a $$...$$ block splits it
            // into extra, malformed <tr> rows instead (each holding a
            // leftover fragment in its first cell, the rest empty). This
            // is a best-effort recovery: stitch those fragments back onto
            // the end of the row above, in source order, and drop the
            // orphaned rows. It won't help every case — writing the whole
            // $$...$$ block as a single line in the cell is still the
            // reliable fix.
            const headerCount = table.querySelectorAll('thead th, thead td').length;
            if (!headerCount) return;

            const rows = Array.from(table.querySelectorAll('tbody > tr'));
            for (let i = rows.length - 1; i >= 1; i--) {
                const cells = Array.from(rows[i].children);
                const firstHasContent = cells[0] && cells[0].textContent.trim().length > 0;
                const restEmpty = cells.slice(1).every(c => c.textContent.trim().length === 0);

                if (firstHasContent && restEmpty && cells.length <= headerCount) {
                    const prevCells = rows[i - 1].children;
                    const target = prevCells[prevCells.length - 1];
                    if (target) {
                        target.innerHTML = target.innerHTML + ' ' + cells[0].innerHTML;
                        delete target.dataset.sbMathProcessed;
                    }
                    rows[i].remove();
                }
            }
        }

        function renderCell(katex, cell) {
            if (cell.dataset.sbMathProcessed) return;

            // If sorting/filtering or another script already rendered
            // KaTeX here, don't touch it.
            if (cell.querySelector('.katex')) {
                cell.dataset.sbMathProcessed = "true";
                return;
            }

            const raw = extractCellSource(cell);
            if (!raw || !raw.includes('$')) {
                cell.dataset.sbMathProcessed = "true";
                return;
            }

            let renderedAny = false;

            // Display math ($$...$$) first, then inline ($...$), so a
            // display span's inner single $ characters aren't matched twice.
            let out = raw.replace(/\$\$([\s\S]+?)\$\$/g, (m, expr) => {
                try {
                    const html = katex.renderToString(expr.trim(), {
                        throwOnError: false,
                        displayMode: true,
                        trust: true
                    });
                    renderedAny = true;
                    return html;
                } catch (e) {
                    console.error("Table Math: renderToString failed for", JSON.stringify(expr), "-", e.message);
                    return m;
                }
            });

            out = out.replace(/\$([^\$\n]+?)\$/g, (m, expr) => {
                try {
                    const html = katex.renderToString(expr.trim(), {
                        throwOnError: false,
                        displayMode: false,
                        trust: true
                    });
                    renderedAny = true;
                    return html;
                } catch (e) {
                    console.error("Table Math: renderToString failed for", JSON.stringify(expr), "-", e.message);
                    return m;
                }
            });

            if (renderedAny) {
                cell.innerHTML = out;
            }
            cell.dataset.sbMathProcessed = "true";
        }

        function processTable(katex, table) {
            mergeOrphanRows(table);
            table.querySelectorAll('td, th').forEach(cell => renderCell(katex, cell));
        }

        loadKatex().then((katex) => {
            if (!katex) return; // error already logged by loadKatex()

            document.querySelectorAll('table').forEach(t => processTable(katex, t));

            const obs = new MutationObserver((muts) => {
                muts.forEach(m => {
                    if (m.addedNodes.length) {
                        document.querySelectorAll('table').forEach(t => processTable(katex, t));
                    }
                });
            });
            obs.observe(document.body, { childList: true, subtree: true });

            window.addEventListener('sb-math-tables-unload', function cln() {
                obs.disconnect();
                document.querySelectorAll('[data-sb-math-processed]').forEach(c => {
                    delete c.dataset.sbMathProcessed;
                });
                window.removeEventListener('sb-math-tables-unload', cln);
            });
        });
    })();
    ]]
    js.window.document.body.appendChild(scriptEl)
    print("Table Math: Active.")
end

function disableMathInTables()
    cleanupMathTables()
end

if mathTablesEnabled then
  enableMathInTables()
else
  disableMathInTables()
end

command.define { name = "Table: Enable Math Rendering", run = function() enableMathInTables() end }
command.define { name = "Table: Disable Math Rendering", run = function() disableMathInTables() end }
```

## Notes / limitations

- This only fixes **reading/preview mode**. The editor's live-preview already renders math correctly while you're editing a table cell, per the upstream behavior.
- **Always write `$...$` / `$$...$$` as a single physical line inside the cell.** A Markdown table row is one line of source — pressing Enter inside a cell doesn't create a soft line break, it splits the table itself, producing extra malformed rows that this library can only heuristically try to stitch back together (`mergeOrphanRows`, best-effort — it looks for a row whose only populated cell is the first one and merges it onto the row above). It's much more reliable to keep the whole formula on one line: LaTeX ignores whitespace and newlines in its own source anyway, so a matrix on one line renders identically to one spread across several — the only thing that matters is that the *table cell* itself has no real line break in it.
- **Underscores and matrix row breaks are restored, not guessed.** SilverBullet runs each cell through normal Markdown inline parsing before this library ever sees it, which mangles LaTeX two ways: bare `_..._` gets consumed as `<em>` emphasis (eating the underscore — common in subscripts like `\theta_{claw}`), and `\\` gets collapsed to `\` by backslash-escaping (breaking matrix/aligned row separators). This library reverses both precisely, using the same `<em>`/`<strong>` and `<span class="escape">` markup SilverBullet's own renderer leaves behind, rather than guessing from already-lost text.
- Rendering is done by matching literal `$...$` text in each cell after SilverBullet has built the table DOM — if another script rewrites a cell's `innerHTML` *after* this one runs and reintroduces raw `$...$` text, it won't be re-rendered until the next DOM mutation triggers the observer. If you're also using `TableFilterAndSorting.md`, use the fixed copy so its multiline handler doesn't corrupt math before this library gets to it.
- If `katex.renderToString` throws (e.g. invalid LaTeX), the cell falls back to showing the original raw `$...$` text rather than breaking the page. Check the console for a `Table Math: renderToString failed for ...` message naming the exact expression and error.

