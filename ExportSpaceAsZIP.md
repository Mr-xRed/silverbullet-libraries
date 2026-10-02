---
name: "Library/Mr-xRed/ExportSpaceAsZIP"
description: "Adds a command to download the whole space (pages and attachments) as a zip file."
files:
- jszip.min.js
tags: meta/library
pageDecoration.prefix: "🛠️ "
---

# Export Space as ZIP

Adds the command `Export: Download Space as Zip` to the command palette.

- Read-only: it doesn’t modifies or deletes anything in your space.
- Included JSZip (v3.10.1 (`jszip.min.js`)), so it doesn’t need internet access.
- Uses no compression (`STORE`) for speed. Change to `DEFLATE` for smaller files.

## Credits and third-party licenses
This repository includes a copy of [JSZip](https://github.com/Stuk/jszip) v3.10.1 (`jszip.min.js`), which is used to create the zip file. JSZip is dual-licensed under the MIT License or GPLv3, and is used here under the MIT License. It is copyright of its authors and is included unmodified, with its original license header intact.
JSZip's distributed build also bundles other open-source components; their notices are preserved in the file header


```space-lua
command.define {
  name = "Export: Download Space as ZIP",
  run = function()
    local ok, err = pcall(function()
      editor.flashNotification("Export started: loading zip library...")
      local urlPrefix = system.getURLPrefix()

      local src = js.window.fetch(urlPrefix .. ".fs/Library/Mr-xRed/jszip.min.js")
      js.window.eval(src.text())
      local JSZip = js.window.JSZip
      local zip = js.new(JSZip)

      -- pages (markdown)
      local pages = space.listPages()
      local totalPages = #pages
      for i, page in ipairs(pages) do
        zip.file(page.name .. ".md", space.readPage(page.name))
        if i % 50 == 0 then
          editor.flashNotification("Reading pages: " .. i .. " / " .. totalPages)
        end
      end

      -- documents (pdf, images, js, css, etc.)
      local docs = space.listDocuments()
      local totalDocs = #docs
      for i, doc in ipairs(docs) do
        zip.file(doc.name, space.readDocument(doc.name))
        if i % 50 == 0 then
          editor.flashNotification("Reading attachments: " .. i .. " / " .. totalDocs)
        end
      end

      editor.flashNotification("Packing " .. totalPages .. " pages and " .. totalDocs .. " attachments...")

      -- STORE = no compression, much faster (zip will be larger)
      local lastStep = -1
      local blob = zip.generateAsync(
        js.tojs({ type = "blob", compression = "STORE" }),
        function(meta)
          local step = math.floor(meta.percent / 20)
          if step ~= lastStep then
            lastStep = step
            editor.flashNotification("Packing: " .. math.floor(meta.percent) .. "%")
          end
        end
      )

      -- download (plain JS, since URL.createObjectURL isn't reachable from Lua)
      local download = js.window.eval([[(function (blob, name) {
        var u = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = u;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(u); }, 10000);
      })]])
      download(blob, "space-export.zip")

      editor.flashNotification("Export complete: " .. totalPages .. " pages, " .. totalDocs .. " attachments. Check your downloads.")
    end)

    if not ok then
      editor.flashNotification("Export FAILED: " .. tostring(err), "error")
      js.log("Export error:", err)
    end
  end
}
```