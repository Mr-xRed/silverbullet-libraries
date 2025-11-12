---
name: "Library/Mr-xRed/Custom_Width_and_Color_Tables"
tags: meta/library
pageDecoration.prefix: "🖌️ "
---

# Custom Width & Colored Tables

## Usage:
* drop the tag with the theme-color or percentage tag anywhere in the table:

Color theme tags
#silver #sea #mint #hazel #maroon #burgundy #wine #grape 

Table percentage tags
#t30p #t40p #t50p #t60p #t70p #t80p #t90p 

Use it Like this:

\| Header    | Header  #mint #t30p|
\|-----------|---------------------|
\|   Cell    |        Cell         |
\|   Cell    |        Cell         |


## Color Themes:

### Standard (no tag)
| Header A | Header B |
|----------|----------|
| Cell A | Cell B |
| Cell X | Cell Y |
| Cell I | Cell II |

### Silver
| ID #silver #t30p | Name        | Status     |
|----|--------------|------------|
| 1  | Alice Smith  | Active     |
| 2  | Bob Johnson  | Inactive   |
| 3  | Carol Davis  | Pending    |

### Burgundy
| Product #burgundy #t40p| Category   | Price | Stock |
|----------|-------------|--------|-----------|
| Widget A | Tools       | $12.99 | Yes       |
| Widget B | Hardware    | $8.50  | No        |
| Widget C | Access      | $5.75  | Yes       |

### Maroon
| ID #maroon #t50p| First Name | Last Name | Dep. | Role     |
|-----|------------|------------|-------------|-------------|
| 101 | John       | Miller     | Sales       | Manager     |
| 102 | Sarah      | Brown      | IT          | Developer   |
| 103 | Luke       | Green      | HR          | Recruiter   |

### Hazel
|  ID #hazel #t60p| Date       | Customer    | Product     | Qty | Total   |
|-----------|-------------|-------------|--------------|-----------|----------|
| 001       | 2025-10-15  | Alice Smith | Widget A     | 3         | $38.97   |
| 002       | 2025-10-16  | Bob Johnson | Widget B     | 1         | $8.50    |
| 003       | 2025-10-17  | Carol Davis | Widget C     | 5         | $28.75   |

### Mint
| ID #mint #t70p| Name | Email | Dep. | Role | Start Date |
|----|------|--------|-------------|-------|-------------|
| 1  | Alice Smith | alice@mail.com | Sales | Manager | 2023-04-12 |
| 2  | Bob Johnson | bob@mail.com | IT | Developer | 2022-11-05 |
| 3  | Carol Davis | carol@mail.com | HR | Recruiter | 2024-02-19 |

### Sea
| ID #sea #t80p| Name | Email | Phone | Country | Dep. | Role |
|----|------|--------|--------|----------|-------------|--------|
| 1  | Alice | alice@example.com | +1-555-1234 | USA | Sales | Manager |
| 2  | Bob   | bob@example.com   | +44-555-5678 | UK  | IT    | Engineer |
| 3  | Carol | carol@example.com | +49-555-9012 | DE  | HR    | Analyst  |

### Grape
| ID #grape #t90p| First Name | Last Name | Email | Phone | Dep. | Role | Country |
|----|-------------|------------|--------|--------|-------------|--------|----------|
| 1  | Alice | Smith | alice@mail.com | +1-555-1000 | Sales | Manager | USA |
| 2  | Bob | Johnson | bob@mail.com | +44-555-2000 | IT | Developer | UK |
| 3  | Carol | Davis | carol@mail.com | +49-555-3000 | HR | Analyst | Germany |

### Wine
| ID #wine| Name | Phone | Country | City | Dep. | Role | Hire Date | Status |
|----|------|--------|----------|--------|-------------|--------|-------------|----------|
| 1  | Alice Smith | +1-555-1234 | USA | New York | Sales | Manager | 2023-04-12 | Active |
| 2  | Bob Johnson | +44-555-5678 | UK | London | IT | Developer | 2022-11-05 | Inactive |
| 3  | Carol Davis | +49-555-9012 | Germany | Berlin | HR | Recruiter | 2024-02-19 | Pending |

## Implementation

### Color Themes
```space-style
/*   Adds a rounded corner to the tables   */
.sb-table-widget:has(table),
.sb-lua-directive-block:has(table) {
  border-radius: 15px !important;
  border: 2px solid rgba(0,0,0,0.5);
  overflow: hidden;
  box-shadow: 0 1px 6px oklch(20% 0 250 / 0.5),
              0 6px 12px oklch(20% 0 250 / 0.4);
}


tbody tr:hover td {
        font-weight: 900;
        transition: transform 0.5s ease;
}

table {}

/* Hide specific colour tags inside tables */

.sb-table-widget .sb-hashtag[data-tag-name="silver"],
.sb-table-widget .sb-hashtag[data-tag-name="burgundy"],
.sb-table-widget .sb-hashtag[data-tag-name="maroon"],
.sb-table-widget .sb-hashtag[data-tag-name="hazel"],
.sb-table-widget .sb-hashtag[data-tag-name="mint"],
.sb-table-widget .sb-hashtag[data-tag-name="sea"],
.sb-table-widget .sb-hashtag[data-tag-name="grape"],
.sb-table-widget .sb-hashtag[data-tag-name="wine"],

.sb-lua-directive-block .sb-hashtag[data-tag-name="silver"],
.sb-lua-directive-block .sb-hashtag[data-tag-name="burgundy"],
.sb-lua-directive-block .sb-hashtag[data-tag-name="maroon"],
.sb-lua-directive-block .sb-hashtag[data-tag-name="hazel"],
.sb-lua-directive-block .sb-hashtag[data-tag-name="mint"],
.sb-lua-directive-block .sb-hashtag[data-tag-name="sea"],
.sb-lua-directive-block .sb-hashtag[data-tag-name="grape"],
.sb-lua-directive-block .sb-hashtag[data-tag-name="wine"]{
  display: none !important;
}

html[data-theme="dark"] {
  /* ---------- silver ---------- */
  table:has(.sb-hashtag[data-tag-name="silver"]) {
    thead tr{ background-color: oklch(30% 0 0); }
    tbody tr:nth-child(even) { background-color: oklch(40% 0 0); }
    tbody tr:nth-child(odd) { background-color: oklch(50% 0 0); }
    --editor-wiki-link-page-color: oklch(80% 0 0);
  }

  /* ---------- burgundy ---------- */
  table:has(.sb-hashtag[data-tag-name="burgundy"]) {
    thead tr{ background-color: oklch(30% 0.12 20); }
    tbody tr:nth-child(even) { background-color: oklch(40% 0.12 20); }
    tbody tr:nth-child(odd) { background-color: oklch(50% 0.12 20); }
    --editor-wiki-link-page-color: oklch(80% 0.18 20);
  }

  /* ---------- maroon ---------- */
  table:has(.sb-hashtag[data-tag-name="maroon"]) {
    thead tr{ background-color: oklch(30% 0.12 40); }
    tbody tr:nth-child(even) { background-color: oklch(40% 0.12 40); }
    tbody tr:nth-child(odd) { background-color: oklch(50% 0.12 40); }
    --editor-wiki-link-page-color: oklch(80% 0.16 40);
  }

  /* ---------- hazel ---------- */
  table:has(.sb-hashtag[data-tag-name="hazel"]) {
    thead tr{ background-color: oklch(30% 0.12 80); }
    tbody tr:nth-child(even) { background-color: oklch(40% 0.12 80); }
    tbody tr:nth-child(odd) { background-color: oklch(50% 0.12 80); }
    --editor-wiki-link-page-color: oklch(80% 0.15 90);
  }

  /* ---------- mint ---------- */
  table:has(.sb-hashtag[data-tag-name="mint"]) {
    thead tr{ background-color: oklch(30% 0.12 150) ; }
    tbody tr:nth-child(even) { background-color: oklch(40% 0.12 150); }
    tbody tr:nth-child(odd) { background-color: oklch(50% 0.12 150); }
    --editor-wiki-link-page-color: oklch(80% 0.14 150);
  }

  /* ---------- sea ---------- */
  table:has(.sb-hashtag[data-tag-name="sea"]) {
    thead tr{ background-color: oklch(30% 0.12 260); }
    tbody tr:nth-child(even) { background-color: oklch(40% 0.12 250); }
    tbody tr:nth-child(odd) { background-color: oklch(50% 0.12 250); }
    --editor-wiki-link-page-color: oklch(80% 0.17 95);
  }

  /* ---------- grape ---------- */
  table:has(.sb-hashtag[data-tag-name="grape"]) {
    thead tr{ background-color: oklch(30% 0.12 300); }
    tbody tr:nth-child(even) { background-color: oklch(40% 0.12 300); }
    tbody tr:nth-child(odd) { background-color: oklch(50% 0.12 300); }
    --editor-wiki-link-page-color: oklch(80% 0.18 300);
  }

  /* ---------- wine ---------- */
  table:has(.sb-hashtag[data-tag-name="wine"]) {
    thead tr{ background-color: oklch(30% 0.12 340); }
    tbody tr:nth-child(even) { background-color: oklch(40% 0.12 340); }
    tbody tr:nth-child(odd) { background-color: oklch(50% 0.12 340); }
    --editor-wiki-link-page-color: oklch(80% 0.25 340);
  }

}

html[data-theme="light"] {
  /* ---------- silver ---------- */
  table:has(.sb-hashtag[data-tag-name="silver"]) {
    thead tr{ background-color: oklch(55% 0 0); }
    tbody tr:nth-child(even) { background-color: oklch(85% 0 0); }
    tbody tr:nth-child(odd) { background-color: oklch(95% 0 0); }
    --editor-wiki-link-page-color: oklch(55% 0 0);
  }

  /* ---------- burgundy ---------- */
  table:has(.sb-hashtag[data-tag-name="burgundy"]) {
    thead tr{ background-color: oklch(55% 0.15 20); }
    tbody tr:nth-child(even) { background-color: oklch(85% 0.12 20); }
    tbody tr:nth-child(odd) { background-color: oklch(95% 0.10 20); }
    --editor-wiki-link-page-color: oklch(55% 0.25 20);
  }

  /* ---------- maroon ---------- */
  table:has(.sb-hashtag[data-tag-name="maroon"]) {
    thead tr{ background-color: oklch(55% 0.15 40); }
    tbody tr:nth-child(even) { background-color: oklch(85% 0.12 40); }
    tbody tr:nth-child(odd) { background-color: oklch(95% 0.10 40); }
    --editor-wiki-link-page-color: oklch(55% 0.22 40);
  }

  /* ---------- hazel ---------- */
  table:has(.sb-hashtag[data-tag-name="hazel"]) {
    thead tr{ background-color: oklch(55% 0.15 80); }
    tbody tr:nth-child(even) { background-color: oklch(85% 0.12 80); }
    tbody tr:nth-child(odd) { background-color: oklch(95% 0.10 80); }
    --editor-wiki-link-page-color: oklch(55% 0.22 80);
  }

  /* ---------- mint ---------- */
  table:has(.sb-hashtag[data-tag-name="mint"]) {
    thead tr{ background-color: oklch(55% 0.15 150); }
    tbody tr:nth-child(even) { background-color: oklch(85% 0.12 150); }
    tbody tr:nth-child(odd) { background-color: oklch(95% 0.10 150); }
    --editor-wiki-link-page-color: oklch(55% 0.22 150);
  }

  /* ---------- sea ---------- */
  table:has(.sb-hashtag[data-tag-name="sea"]) {
    thead tr{ background-color: oklch(55% 0.15 250); }
    tbody tr:nth-child(even) { background-color: oklch(85% 0.12 250); }
    tbody tr:nth-child(odd) { background-color: oklch(95% 0.10 250); }
    --editor-wiki-link-page-color: oklch(55% 0.25 260);
  }

  /* ---------- grape ---------- */
  table:has(.sb-hashtag[data-tag-name="grape"]) {
    thead tr{ background-color: oklch(55% 0.15 300); }
    tbody tr:nth-child(even) { background-color: oklch(85% 0.12 300); }
    tbody tr:nth-child(odd) { background-color: oklch(95% 0.10 300); }
    --editor-wiki-link-page-color: oklch(55% 0.25 300);
  }

  /* ---------- wine ---------- */
  table:has(.sb-hashtag[data-tag-name="wine"]) {
    thead tr{ background-color: oklch(55% 0.15 0); }
    tbody tr:nth-child(even) { background-color: oklch(85% 0.12 0); }
    tbody tr:nth-child(odd) { background-color: oklch(95% 0.10 0); }
    --editor-wiki-link-page-color: oklch(55% 0.25 0);
  }

}

```

### Table Width with Tag
```space-style
table .sb-hashtag[data-tag-name="t30p"],.sb-lua-directive-block.sb-hashtag[data-tag-name="t30p"],
table .sb-hashtag[data-tag-name="t40p"],.sb-lua-directive-block.sb-hashtag[data-tag-name="t40p"],
table .sb-hashtag[data-tag-name="t50p"],.sb-lua-directive-block.sb-hashtag[data-tag-name="t50p"],
table .sb-hashtag[data-tag-name="t60p"],.sb-lua-directive-block.sb-hashtag[data-tag-name="t60p"],
table .sb-hashtag[data-tag-name="t70p"],.sb-lua-directive-block.sb-hashtag[data-tag-name="t70p"],
table .sb-hashtag[data-tag-name="t80p"],.sb-lua-directive-block.sb-hashtag[data-tag-name="t80p"],
table .sb-hashtag[data-tag-name="t90p"],.sb-lua-directive-block.sb-hashtag[data-tag-name="t90p"] {
  display: none !important;
}
.sb-table-widget:has(.sb-hashtag[data-tag-name="t30p"]) {width:30% !important;}
.sb-table-widget:has(.sb-hashtag[data-tag-name="t40p"]) {width:40% !important;}
.sb-table-widget:has(.sb-hashtag[data-tag-name="t50p"]) {width:50% !important;}
.sb-table-widget:has(.sb-hashtag[data-tag-name="t60p"]) {width:60% !important;}
.sb-table-widget:has(.sb-hashtag[data-tag-name="t70p"]) {width:70% !important;}
.sb-table-widget:has(.sb-hashtag[data-tag-name="t80p"]) {width:80% !important;}
.sb-table-widget:has(.sb-hashtag[data-tag-name="t90p"]) {width:90% !important;}
```


### Optional only  (adds color to the matching tags)

```space-style

html[data-theme="dark"] {
  .sb-hashtag[data-tag-name="grape"]    { background: oklch(40% 0.12 300); color: oklch(95% 0.05 300); }
  .sb-hashtag[data-tag-name="sea"]      { background: oklch(40% 0.12 250); color: oklch(95% 0.05 250); }
  .sb-hashtag[data-tag-name="mint"]     { background: oklch(40% 0.12 150); color: oklch(95% 0.05 150); }
  .sb-hashtag[data-tag-name="hazel"]    { background: oklch(40% 0.12 80);  color: oklch(95% 0.05 90); }
  .sb-hashtag[data-tag-name="maroon"]   { background: oklch(40% 0.12 40);  color: oklch(95% 0.05 40); }
  .sb-hashtag[data-tag-name="burgundy"] { background: oklch(40% 0.12 20);  color: oklch(95% 0.05 20); }
  .sb-hashtag[data-tag-name="wine"]     { background: oklch(40% 0.12 10);  color: oklch(95% 0.05 10); }
  .sb-hashtag[data-tag-name="silver"]   { background: oklch(40% 0 0);      color: oklch(90% 0 0); }
}

html[data-theme="light"] {
  .sb-hashtag[data-tag-name="silver"]
  { background: oklch(95% 0 0); color: oklch(35% 0 0); }
  .sb-hashtag[data-tag-name="burgundy"]
  { background: oklch(95% 0.05 20); color: oklch(35% 0.12 20); }
  .sb-hashtag[data-tag-name="maroon"]
  { background: oklch(95% 0.05 40); color: oklch(35% 0.12 40); }
  .sb-hashtag[data-tag-name="hazel"]
  { background: oklch(95% 0.05 80); color: oklch(35% 0.12 80); }
  .sb-hashtag[data-tag-name="mint"]
  { background: oklch(95% 0.05 150); color: oklch(35% 0.12 150); }
  .sb-hashtag[data-tag-name="sea"]
  { background: oklch(95% 0.05 250); color: oklch(35% 0.12 250); }
  .sb-hashtag[data-tag-name="grape"]
  { background: oklch(95% 0.05 300); color: oklch(35% 0.12 300); }
  .sb-hashtag[data-tag-name="wine"]
  { background: oklch(95% 0.05 340); color: oklch(35% 0.12 340); }
}

```


## Discussions to this space-style
* [SilverBullet Community](https://community.silverbullet.md/t/custom-colorful-table-styles-for-dark-theme/1620?u=mr.red)