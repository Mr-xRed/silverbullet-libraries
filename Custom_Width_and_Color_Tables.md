#meta

# Custom Width & Colored Tables

## Usage:
* drop the tag with the theme-color or percentage tag anywhere in the table:

Color theme tags
#silver #sea #mint #hazel #maroon #burgundy #wine #grape 

Table percentage tags
#t30p #t40p #t50p #t60p #t70p #t80p #t90p 

Use it Like this:

\| Header    | Header   #mint #t30p|
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

### Sea
| Product #sea #t40p| Category   | Price | In Stock |
|----------|-------------|-------|-----------|
| Widget A | Tools       | $12.99 | Yes       |
| Widget B | Hardware    | $8.50  | No        |
| Widget C | Accessories | $5.75  | Yes       |

### Mint
| ID #mint #t50p| First Name | Last Name | Department | Role          |
|----|-------------|------------|-------------|----------------|
| 101 | John       | Miller     | Sales       | Manager        |
| 102 | Sarah      | Brown      | IT          | Developer      |
| 103 | Luke       | Green      | HR          | Recruiter      |

### Hazel
| Order ID #hazel #t60p| Date       | Customer    | Product     | Quantity | Total   |
|-----------|-------------|-------------|--------------|-----------|----------|
| 001       | 2025-10-15  | Alice Smith | Widget A     | 3         | $38.97   |
| 002       | 2025-10-16  | Bob Johnson | Widget B     | 1         | $8.50    |
| 003       | 2025-10-17  | Carol Davis | Widget C     | 5         | $28.75   |

### Maroon
| ID #maroon #t70p| Name | Email | Department | Role | Start Date | Status |
|----|------|--------|-------------|-------|-------------|----------|
| 1  | Alice Smith | alice@example.com | Sales | Manager | 2023-04-12 | Active |
| 2  | Bob Johnson | bob@example.com | IT | Developer | 2022-11-05 | Inactive |
| 3  | Carol Davis | carol@example.com | HR | Recruiter | 2024-02-19 | Pending |

### Burgundy
| ID #burgundy #t80p| Name | Email | Phone | Country | Department | Role | Status |
|----|------|--------|--------|----------|-------------|--------|---------|
| 1  | Alice | alice@example.com | +1-555-1234 | USA | Sales | Manager | Active |
| 2  | Bob   | bob@example.com   | +44-555-5678 | UK  | IT    | Engineer | Inactive |
| 3  | Carol | carol@example.com | +49-555-9012 | DE  | HR    | Analyst  | Pending  |

### Wine
| ID #wine #t90p| First Name | Last Name | Email | Phone | Department | Role | Country | Status |
|----|-------------|------------|--------|--------|-------------|--------|----------|----------|
| 1  | Alice | Smith | alice@example.com | +1-555-1000 | Sales | Manager | USA | Active |
| 2  | Bob | Johnson | bob@example.com | +44-555-2000 | IT | Developer | UK | Inactive |
| 3  | Carol | Davis | carol@example.com | +49-555-3000 | HR | Analyst | Germany | Pending |

### Grape
| ID #grape| Name | Email | Phone | Country | City | Department | Role | Hire Date | Status |
|----|------|--------|--------|----------|--------|-------------|--------|-------------|----------|
| 1  | Alice Smith | alice@example.com | +1-555-1234 | USA | New York | Sales | Manager | 2023-04-12 | Active |
| 2  | Bob Johnson | bob@example.com | +44-555-5678 | UK | London | IT | Developer | 2022-11-05 | Inactive |
| 3  | Carol Davis | [carol@example.com](carol@example.com) | +49-555-9012 | Germany | Berlin | HR | Recruiter | 2024-02-19 | Pending |

## Implementation

### Color Themes
```space-style
/*   Adds a rounded corner to the tables   */
table { border-radius: 15px; overflow: hidden;}

/* Hide specific colour tags inside tables */
table .sb-hashtag[data-tag-name="wine"],
table .sb-hashtag[data-tag-name="sea"],
table .sb-hashtag[data-tag-name="silver"],
table .sb-hashtag[data-tag-name="mint"],
table .sb-hashtag[data-tag-name="burgundy"],
table .sb-hashtag[data-tag-name="grape"],
table .sb-hashtag[data-tag-name="hazel"],
table .sb-hashtag[data-tag-name="maroon"] {
  display: none !important;
}

html[data-theme="dark"]{
/* ---------- wine ---------- */
table:has(.sb-hashtag[data-tag-name="wine"]) {
  thead { background-color: #4a0d26;}
  tbody tr:nth-child(even) { background-color: #6b1a3b;}
  tbody tr:nth-child(odd) { background-color: #5e1735;}
  --editor-wiki-link-page-color: #e6a9c9;
}
/* ---------- sea ---------- */
table:has(.sb-hashtag[data-tag-name="sea"]) {
  thead { background-color: #0048f2;}
  tbody tr:nth-child(even) { background-color: #658ac4;}
  tbody tr:nth-child(odd) { background-color: #4569a2;}
  --editor-wiki-link-page-color: #ffe559;
}
/* ---------- silver ---------- */
table:has(.sb-hashtag[data-tag-name="silver"]) {
  thead { background-color: #333333;}
  tbody tr:nth-child(even) { background-color: #555555;}
  tbody tr:nth-child(odd) { background-color: #444444;}
  --editor-wiki-link-page-color: #d1d1d1;
}
/* ---------- mint ---------- */
table:has(.sb-hashtag[data-tag-name="mint"]) {
  thead { background-color: #264d26;}
  tbody tr:nth-child(even) { background-color: #336633;}
  tbody tr:nth-child(odd) { background-color: #2b5b2b;}
  --editor-wiki-link-page-color: #a8d5a2;
}
/* ---------- burgundy ---------- */
table:has(.sb-hashtag[data-tag-name="burgundy"]) {
  thead { background-color: #330d0d;}
  tbody tr:nth-child(even) { background-color: #4d1a1a;}
  tbody tr:nth-child(odd) { background-color: #401515;}
  --editor-wiki-link-page-color: #d19999;
}
/* ---------- grape ---------- */
table:has(.sb-hashtag[data-tag-name="grape"]) {
  thead { background-color: #1a0d33;}
  tbody tr:nth-child(even) { background-color: #341b51; }
  tbody tr:nth-child(odd) { background-color: #261540;}
  --editor-wiki-link-page-color: #a799d1;
}
/* ---------- hazel ---------- */
table:has(.sb-hashtag[data-tag-name="hazel"]) {
  thead{ background-color: #4a3b0d;}
  tbody tr:nth-child(even) { background-color: #6b561a;}
  tbody tr:nth-child(odd) { background-color: #5e4e17;}
  --editor-wiki-link-page-color: #e6d899;
}
/* --------- maroon ---------- */
  table:has(.sb-hashtag[data-tag-name="maroon"]) {
  thead { background-color: #4a230d; }
  tbody tr:nth-child(even) { background-color: #6b361a; }
  tbody tr:nth-child(odd) { background-color: #5e3017; }
    --editor-wiki-link-page-color: #e6b899;
 }
}

html[data-theme="light"] {
  /* ---------- wine ---------- */
  table:has(.sb-hashtag[data-tag-name="wine"]) {
    --editor-wiki-link-page-color: #bf4664;
    thead { background-color: #f7c1d0; }
    tbody tr:nth-child(even) { background-color: #fbd9e5; }
    tbody tr:nth-child(odd) { background-color: #f9b7cf; }
  }

  /* ---------- sea ---------- */
  table:has(.sb-hashtag[data-tag-name="sea"]) {
    --editor-wiki-link-page-color: #0033b2;
    thead { background-color: #c3dbff; }
    tbody tr:nth-child(even) { background-color: #e3f0ff; }
    tbody tr:nth-child(odd) { background-color: #b7d1ff; }
  }

  /* ---------- silver ---------- */
  table:has(.sb-hashtag[data-tag-name="silver"]) {
    --editor-wiki-link-page-color: #777777;
    thead { background-color: #e0e0e0; }
    tbody tr:nth-child(even) { background-color: #f5f5f5; }
    tbody tr:nth-child(odd) { background-color: #ececec; }
  }

  /* ---------- mint ---------- */
  table:has(.sb-hashtag[data-tag-name="mint"]) {
    --editor-wiki-link-page-color: #3b803b;
    thead { background-color: #c8eac6; }
    tbody tr:nth-child(even) { background-color: #e1f8e1; }
    tbody tr:nth-child(odd) { background-color: #b8e5b8; }
  }

  /* ---------- burgundy ---------- */
  table:has(.sb-hashtag[data-tag-name="burgundy"]) {
    --editor-wiki-link-page-color: #a01a1a;
    thead { background-color: #f2a1a1; }
    tbody tr:nth-child(even) { background-color: #f9c6c6; }
    tbody tr:nth-child(odd) { background-color: #f6b0b0; }
  }

  /* ---------- grape ---------- */
  table:has(.sb-hashtag[data-tag-name="grape"]) {
    --editor-wiki-link-page-color: #361a70;
    thead { background-color: #d5c1f3; }
    tbody tr:nth-child(even) { background-color: #e9e0fc; }
    tbody tr:nth-child(odd) { background-color: #dfd1f9; }
  }

  /* ---------- hazel ---------- */
  table:has(.sb-hashtag[data-tag-name="hazel"]) {
    --editor-wiki-link-page-color: #7c5f1a;
    thead { background-color: #f5f0cc; }
    tbody tr:nth-child(even) { background-color: #fcf8df; }
    tbody tr:nth-child(odd) { background-color: #f1e8b5; }
  }

  /* ---------- maroon ---------- */
  table:has(.sb-hashtag[data-tag-name="maroon"]) {
    --editor-wiki-link-page-color: #862f18;
    thead { background-color: #f4c6b8; }
    tbody tr:nth-child(even) { background-color: #f9e2da; }
    tbody tr:nth-child(odd) { background-color: #f6cfc3; }
  }
}

```

### Table Width with Tag
```space-style
table .sb-hashtag[data-tag-name="t30p"],
table .sb-hashtag[data-tag-name="t40p"],
table .sb-hashtag[data-tag-name="t50p"],
table .sb-hashtag[data-tag-name="t60p"],
table .sb-hashtag[data-tag-name="t70p"],
table .sb-hashtag[data-tag-name="t80p"], 
table .sb-hashtag[data-tag-name="t90p"]{
  display: none !important;
}
table:has(.sb-hashtag[data-tag-name="t30p"]) {width:30% !important;}
table:has(.sb-hashtag[data-tag-name="t40p"]) {width:40% !important;}
table:has(.sb-hashtag[data-tag-name="t50p"]) {width:50% !important;}
table:has(.sb-hashtag[data-tag-name="t60p"]) {width:60% !important;}
table:has(.sb-hashtag[data-tag-name="t70p"]) {width:70% !important;}
table:has(.sb-hashtag[data-tag-name="t80p"]) {width:80% !important;}
table:has(.sb-hashtag[data-tag-name="t90p"]) {width:90% !important;}
```


### Optional only  (adds color to the matching tags)

```space-style
html[data-theme="dark"]{
.sb-hashtag[data-tag-name="silver"]{background: #444444;}
.sb-hashtag[data-tag-name="sea"]{background: #4569a2;}
.sb-hashtag[data-tag-name="mint"]{background: #336633;}
.sb-hashtag[data-tag-name="hazel"]{background: #6b561a;}
.sb-hashtag[data-tag-name="maroon"]{background: #6b361a;}
.sb-hashtag[data-tag-name="burgundy"]{background: #4d1a1a;}
.sb-hashtag[data-tag-name="wine"]{background: #6b1a3b;}
.sb-hashtag[data-tag-name="grape"]{background: #341b51;}
}

html[data-theme="light"] {
.sb-hashtag[data-tag-name="silver"]{background: #f5f5f5;color:#000;}
.sb-hashtag[data-tag-name="sea"]{background: #e3f0ff;color:#000;}
.sb-hashtag[data-tag-name="mint"]{background: #e1f8e1;color:#000;}
.sb-hashtag[data-tag-name="hazel"]{background: #fcf8df;color:#000;}
.sb-hashtag[data-tag-name="maroon"]{background: #f9e2da;color:#000;}
.sb-hashtag[data-tag-name="burgundy"]{background: #f9c6c6;color:#000;}
.sb-hashtag[data-tag-name="wine"]{background: #fbd9e5;color:#000;}
.sb-hashtag[data-tag-name="grape"]{background: #e9e0fc;color:#000;}
}
```


## Discussions to this space-style
* [SilverBullet Community](https://community.silverbullet.md/t/custom-colorful-table-styles-for-dark-theme/1620?u=mr.red)