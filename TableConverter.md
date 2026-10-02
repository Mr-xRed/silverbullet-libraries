---
name: "Library/Mr-xRed/TableConverter"
tags: meta/library
pageDecoration.prefix: "🛠️ "
---

# Table Converter

Converts the **selected text** (CSV, TSV, semicolon/pipe separated, JSON or JSON Lines) into a Markdown table. The separator is detected automatically. No external libraries are used.

## Usage

1.  Select the text on a page.
2.  Run the command (`Cmd/Ctrl-/`):
    *   **Table: Convert Selection to Markdown Table**: the first row is used as the header.
    *   **Table: Convert Selection to Markdown Table (No Header)**: generates `Col 1`, `Col 2`, ... headers.

From your own Lua code you can call `tableconv.toMarkdown(text, opts)`, which returns `markdown` or `nil, errorMessage`. Options: `delimiter` (force a separator), `noHeader` (boolean), `format` (`"json"` or `"delimited"`).

## Supported input

*   **Delimited text**: tab, semicolon, pipe, comma (quoted fields, escaped `""` quotes, and line breaks inside quotes are supported).
*   **JSON array of objects**: columns are the union of all keys, in order of first appearance.
*   **JSON array of arrays**: the first array is the header.
*   **JSON array of scalars**: a single `value` column.
*   **JSON object**: a `Key | Value` table.
*   **JSON Lines (NDJSON)**: one object per line.
*   Nested objects and arrays are written into the cell as compact JSON.

## Code

```space-lua
tableconv = tableconv or {}

local FENCE = string.rep("`", 3)
local DELIMS = {"\t", ";", "|", ","}
local NULL = {t = "null"}

-- In SilverBullet strings are JS strings; in plain Lua they are byte strings.
local JS_STRINGS = (string.char(233) == "é")

------------------------------------------------------------------------
-- Helpers
------------------------------------------------------------------------

local function trim(s)
  return (string.gsub(s, "^%s*(.-)%s*$", "%1"))
end

local function stripFence(text)
  local t = trim(text)
  if string.sub(t, 1, 3) == FENCE then
    local nl = string.find(t, "\n", 1, true)
    if nl then
      t = string.sub(t, nl + 1)
      t = string.gsub(t, "\n?" .. FENCE .. "%s*$", "")
    end
  end
  return t
end

local function escapeCell(s)
  s = trim(s)
  s = string.gsub(s, "|", "\\|")
  s = string.gsub(s, "\r?\n", "<br>")
  return s
end

------------------------------------------------------------------------
-- Delimited text (CSV / TSV / ...) parser
------------------------------------------------------------------------

local function parseDelimited(text, delim)
  local rows, row, buf = {}, {}, {}
  local inQuotes = false
  local i, n = 1, string.len(text)

  local function endField()
    table.insert(row, table.concat(buf))
    buf = {}
  end
  local function endRow()
    endField()
    table.insert(rows, row)
    row = {}
  end

  while i <= n do
    local c = string.sub(text, i, i)
    if inQuotes then
      if c == '"' then
        if string.sub(text, i + 1, i + 1) == '"' then
          table.insert(buf, '"')
          i = i + 1
        else
          inQuotes = false
        end
      else
        table.insert(buf, c)
      end
    else
      if c == '"' and #buf == 0 then
        inQuotes = true
      elseif c == delim then
        endField()
      elseif c == "\r" then
        -- ignore, \n ends the row
      elseif c == "\n" then
        endRow()
      else
        table.insert(buf, c)
      end
    end
    i = i + 1
  end
  if #buf > 0 or #row > 0 then
    endRow()
  end
  return rows
end

local function cleanRows(rows)
  local out = {}
  for _, r in ipairs(rows) do
    local keep = false
    for _, c in ipairs(r) do
      if string.find(c, "%S") then
        keep = true
        break
      end
    end
    if keep then
      table.insert(out, r)
    end
  end
  return out
end

-- Picks the delimiter whose parse gives the most consistent column count.
-- Ties are resolved by the order in DELIMS (tab, semicolon, pipe, comma).
local function detectDelimiter(text)
  local best, bestScore = nil, 0
  for _, d in ipairs(DELIMS) do
    if string.find(text, d, 1, true) then
      local rows = cleanRows(parseDelimited(text, d))
      if #rows > 0 then
        local counts, modeCols, modeN = {}, 0, 0
        for _, r in ipairs(rows) do
          local k = #r
          counts[k] = (counts[k] or 0) + 1
          if counts[k] > modeN or (counts[k] == modeN and k > modeCols) then
            modeN = counts[k]
            modeCols = k
          end
        end
        if modeCols >= 2 then
          local score = modeN / #rows
          if score > bestScore + 0.0001 then
            best = d
            bestScore = score
          end
        end
      end
    end
  end
  if bestScore < 0.5 then
    return nil
  end
  return best
end

------------------------------------------------------------------------
-- JSON parser / encoder (order preserving)
-- objects: {t="object", keys={...}, vals={...}}   arrays: {t="array", items={...}}
------------------------------------------------------------------------

local function utf8encode(cp)
  if cp < 0x80 then
    return string.char(cp)
  elseif cp < 0x800 then
    return string.char(0xC0 + math.floor(cp / 64), 0x80 + cp % 64)
  elseif cp < 0x10000 then
    return string.char(0xE0 + math.floor(cp / 4096),
      0x80 + math.floor(cp / 64) % 64, 0x80 + cp % 64)
  end
  return string.char(0xF0 + math.floor(cp / 262144),
    0x80 + math.floor(cp / 4096) % 64,
    0x80 + math.floor(cp / 64) % 64, 0x80 + cp % 64)
end

local SIMPLE_ESCAPES = {n = "\n", t = "\t", r = "\r", b = "\b", f = "\f"}

local function jsonParse(s)
  local pos, len = 1, string.len(s)
  local parseValue

  local function fail(msg)
    error(msg .. " at position " .. pos)
  end

  local function skip()
    while pos <= len do
      local c = string.sub(s, pos, pos)
      if c == " " or c == "\t" or c == "\n" or c == "\r" then
        pos = pos + 1
      else
        break
      end
    end
  end

  local function parseString()
    pos = pos + 1
    local buf = {}
    while true do
      if pos > len then
        fail("Unterminated string")
      end
      local c = string.sub(s, pos, pos)
      if c == '"' then
        pos = pos + 1
        break
      elseif c == "\\" then
        local e = string.sub(s, pos + 1, pos + 1)
        if SIMPLE_ESCAPES[e] then
          table.insert(buf, SIMPLE_ESCAPES[e])
        elseif e == "u" then
          local cp = tonumber(string.sub(s, pos + 2, pos + 5), 16)
          if not cp then
            fail("Invalid unicode escape")
          end
          pos = pos + 4
          if not JS_STRINGS and cp >= 0xD800 and cp <= 0xDBFF
              and string.sub(s, pos + 2, pos + 3) == "\\u" then
            local lo = tonumber(string.sub(s, pos + 4, pos + 7), 16)
            if lo and lo >= 0xDC00 and lo <= 0xDFFF then
              cp = 0x10000 + (cp - 0xD800) * 1024 + (lo - 0xDC00)
              pos = pos + 6
            end
          end
          if JS_STRINGS then
            table.insert(buf, string.char(cp))
          else
            table.insert(buf, utf8encode(cp))
          end
        else
          table.insert(buf, e)
        end
        pos = pos + 2
      else
        table.insert(buf, c)
        pos = pos + 1
      end
    end
    return table.concat(buf)
  end

  parseValue = function()
    skip()
    local c = string.sub(s, pos, pos)
    if c == "{" then
      pos = pos + 1
      local obj = {t = "object", keys = {}, vals = {}}
      skip()
      if string.sub(s, pos, pos) == "}" then
        pos = pos + 1
        return obj
      end
      while true do
        skip()
        if string.sub(s, pos, pos) ~= '"' then
          fail("Expected string key")
        end
        local k = parseString()
        skip()
        if string.sub(s, pos, pos) ~= ":" then
          fail("Expected ':'")
        end
        pos = pos + 1
        local v = parseValue()
        if obj.vals[k] == nil then
          table.insert(obj.keys, k)
        end
        obj.vals[k] = v
        skip()
        local d = string.sub(s, pos, pos)
        pos = pos + 1
        if d == "}" then
          return obj
        elseif d ~= "," then
          fail("Expected ',' or '}'")
        end
      end
    elseif c == "[" then
      pos = pos + 1
      local arr = {t = "array", items = {}}
      skip()
      if string.sub(s, pos, pos) == "]" then
        pos = pos + 1
        return arr
      end
      while true do
        table.insert(arr.items, parseValue())
        skip()
        local d = string.sub(s, pos, pos)
        pos = pos + 1
        if d == "]" then
          return arr
        elseif d ~= "," then
          fail("Expected ',' or ']'")
        end
      end
    elseif c == '"' then
      return parseString()
    elseif string.sub(s, pos, pos + 3) == "true" then
      pos = pos + 4
      return true
    elseif string.sub(s, pos, pos + 4) == "false" then
      pos = pos + 5
      return false
    elseif string.sub(s, pos, pos + 3) == "null" then
      pos = pos + 4
      return NULL
    else
      local start = pos
      while pos <= len and string.find("0123456789+-.eE", string.sub(s, pos, pos), 1, true) do
        pos = pos + 1
      end
      local num = tonumber(string.sub(s, start, pos - 1))
      if not num then
        fail("Unexpected token")
      end
      return num
    end
  end

  local result = parseValue()
  skip()
  if pos <= len then
    fail("Unexpected trailing data")
  end
  return result
end

local function isContainer(v)
  return type(v) == "table" and (v.t == "object" or v.t == "array")
end

local function jsonEncode(v)
  local ty = type(v)
  if ty == "string" then
    local e = string.gsub(v, '[\\"]', "\\%0")
    e = string.gsub(e, "\n", "\\n")
    e = string.gsub(e, "\r", "\\r")
    e = string.gsub(e, "\t", "\\t")
    return '"' .. e .. '"'
  elseif ty == "number" or ty == "boolean" then
    return tostring(v)
  elseif v == NULL then
    return "null"
  elseif v.t == "array" then
    local parts = {}
    for _, item in ipairs(v.items) do
      table.insert(parts, jsonEncode(item))
    end
    return "[" .. table.concat(parts, ",") .. "]"
  else
    local parts = {}
    for _, k in ipairs(v.keys) do
      table.insert(parts, jsonEncode(k) .. ":" .. jsonEncode(v.vals[k]))
    end
    return "{" .. table.concat(parts, ",") .. "}"
  end
end

local function cellText(v)
  if type(v) == "string" then
    return v
  elseif v == NULL then
    return ""
  elseif isContainer(v) then
    return jsonEncode(v)
  end
  return tostring(v)
end

-- Returns header (list of strings), rows (list of lists of strings)
local function jsonToRows(v)
  if not isContainer(v) then
    return {"value"}, {{cellText(v)}}
  end

  if v.t == "object" then
    local rows = {}
    for _, k in ipairs(v.keys) do
      table.insert(rows, {k, cellText(v.vals[k])})
    end
    return {"Key", "Value"}, rows
  end

  local items = v.items
  if #items == 0 then
    return nil, "The JSON array is empty"
  end

  local allObj, allArr = true, true
  for _, item in ipairs(items) do
    if not (type(item) == "table" and item.t == "object") then allObj = false end
    if not (type(item) == "table" and item.t == "array") then allArr = false end
  end

  if allObj then
    local header, seen = {}, {}
    for _, item in ipairs(items) do
      for _, k in ipairs(item.keys) do
        if not seen[k] then
          seen[k] = true
          table.insert(header, k)
        end
      end
    end
    local rows = {}
    for _, item in ipairs(items) do
      local r = {}
      for i, k in ipairs(header) do
        local val = item.vals[k]
        r[i] = (val == nil) and "" or cellText(val)
      end
      table.insert(rows, r)
    end
    return header, rows
  elseif allArr then
    local header = {}
    for i, c in ipairs(items[1].items) do
      header[i] = cellText(c)
    end
    local rows = {}
    for idx = 2, #items do
      local r = {}
      for i, c in ipairs(items[idx].items) do
        r[i] = cellText(c)
      end
      table.insert(rows, r)
    end
    return header, rows
  end

  local rows = {}
  for _, item in ipairs(items) do
    table.insert(rows, {cellText(item)})
  end
  return {"value"}, rows
end

------------------------------------------------------------------------
-- Markdown table builder
------------------------------------------------------------------------

local function buildTable(header, rows)
  local n = #header
  for _, r in ipairs(rows) do
    if #r > n then n = #r end
  end

  local function line(cells)
    local out = {}
    for i = 1, n do
      out[i] = escapeCell(cells[i] or "")
    end
    return "| " .. table.concat(out, " | ") .. " |"
  end

  local hdr, sep = {}, {}
  for i = 1, n do
    local h = header[i]
    if h == nil or not string.find(h, "%S") then
      h = "Col " .. i
    end
    hdr[i] = h
    sep[i] = "---"
  end

  local lines = {line(hdr), "| " .. table.concat(sep, " | ") .. " |"}
  for _, r in ipairs(rows) do
    table.insert(lines, line(r))
  end
  return table.concat(lines, "\n")
end

------------------------------------------------------------------------
-- Public API
------------------------------------------------------------------------

-- Returns markdown string, or nil + error message
function tableconv.toMarkdown(text, opts)
  opts = opts or {}
  text = stripFence(text or "")
  if text == "" then
    return nil, "Nothing to convert"
  end

  local jsonErr = nil
  local first = string.sub(text, 1, 1)

  if opts.format ~= "delimited" and (first == "{" or first == "[") then
    local ok, val = pcall(jsonParse, text)
    if not ok then
      -- maybe JSON Lines
      local items, allOk = {}, true
      for ln in string.gmatch(text, "[^\r\n]+") do
        if string.find(ln, "%S") then
          local ok2, v2 = pcall(jsonParse, ln)
          if ok2 then
            table.insert(items, v2)
          else
            allOk = false
            break
          end
        end
      end
      if allOk and #items > 0 then
        ok, val = true, {t = "array", items = items}
      else
        jsonErr = tostring(val)
      end
    end
    if ok then
      local header, rows = jsonToRows(val)
      if not header then
        return nil, rows
      end
      return buildTable(header, rows)
    end
  end

  if opts.format == "json" then
    return nil, "Invalid JSON: " .. (jsonErr or "unknown error")
  end

  local delim = opts.delimiter or detectDelimiter(text)
  if not delim then
    if jsonErr then
      return nil, "Invalid JSON: " .. jsonErr
    end
    return nil, "Could not detect a separator (tab, semicolon, pipe or comma)"
  end

  local rows = cleanRows(parseDelimited(text, delim))
  if #rows == 0 then
    return nil, "No rows found"
  end

  local header
  if opts.noHeader then
    local maxc = 0
    for _, r in ipairs(rows) do
      if #r > maxc then maxc = #r end
    end
    header = {}
    for i = 1, maxc do
      header[i] = "Col " .. i
    end
  else
    header = table.remove(rows, 1)
  end
  return buildTable(header, rows)
end

------------------------------------------------------------------------
-- Commands
------------------------------------------------------------------------

local function convertSelection(opts)
  local sel = editor.getSelection()
  if not sel or sel.from == sel.to then
    editor.flashNotification("Select the text to convert first", "error")
    return
  end
  local from = math.min(sel.from, sel.to)
  local to = math.max(sel.from, sel.to)
  local selected = string.sub(editor.getText(), from + 1, to)

  local md, err = tableconv.toMarkdown(selected, opts)
  if not md then
    editor.flashNotification("Table conversion failed: " .. err, "error")
    return
  end
  editor.replaceRange(from, to, md)
  editor.flashNotification("Converted to Markdown table")
end

command.define {
  name = "Table: Convert Selection to Markdown Table",
  run = function()
    convertSelection({})
  end
}

command.define {
  name = "Table: Convert Selection to Markdown Table (No Header)",
  run = function()
    convertSelection({noHeader = true})
  end
}
```