#meta

# Custom Colored Tables

## Usage:
* drop the tag with the theme-color anywhere in the table:

#silver #sea #mint #hazel #maroon #burgundy #wine #grape 

* Like this:

\| Header A | Header B #mint|
\|----------|---------------|
\|  Cell A  |     Cell B    |
\|  Cell A  |     Cell B    |


## Color Themes:

### Standard (no tag)
| Header A | Header B |
|----------|----------|
| Cell A | Cell B |
| Cell X | Cell Y |

### Silver
|#silver Header A | Header B |
|----------|----------|
| Cell A | Cell B |
| Cell X | Cell Y |

### Sea
|#sea Header A | Header B |
|----------|----------|
| Cell A | Cell B |
| Cell X | Cell Y |

### Mint
|#mint Header A | Header B |
|----------|----------|
| Cell A | Cell B |
| Cell X | Cell Y |

### Hazel
|#hazel Header A | Header B |
|----------|----------|
| Cell A | Cell B |
| Cell X | Cell Y |

### Maroon
|#maroon Header A | Header B |
|----------|----------|
| Cell A | Cell B |
| Cell X | Cell Y |

### Burgundy
|#burgundy Header A | Header B |
|----------|----------|
| Cell A | Cell B |
| Cell X | Cell Y |

### Wine
|#wine Header A | Header B |
|----------|----------|
| Cell A | Cell B |
| Cell X | Cell Y |

### Grape
|#grape Header A | Header B |
|----------|----------|
| Cell A | Cell B |
| Cell X | Cell Y |

## Implementation
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
  tbody tr:nth-child(even) { background-color: #4569a2;}
  tbody tr:nth-child(odd) { background-color: #658ac4;}
  --editor-wiki-link-page-color: #ffe559;
}
/* ---------- silver ---------- */
table:has(.sb-hashtag[data-tag-name="silver"]) {
  thead { background-color: #333333;}
  tbody tr:nth-child(even) { background-color: #444444;}
  tbody tr:nth-child(odd) { background-color: #555555;}
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

## Optional only  (adds color to the matching tags)

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