---
name: "Library/Mr-xRed/TopPageBanner"
tags: meta/library
banner: ["https://raw.githubusercontent.com/Mr-xRed/silverbullet-libraries/refs/heads/main/banner/welcome.jpg"]
pageDecoration.prefix: "🖌️ "
---
## Usage
add this to the `frontmatter` of the page where you want the banner shown:
  
`banner: ["url","width","height"]`

- `url` - required
- `width` - optional
- `height` - optional

### Example:
```frontmatter
---
banner: ["banner/welcome.jpg","","200"]
---
```

## Implementation: Widget
```space-lua
-- priority: 20
widgets = widgets or {}

function widgets.banner()
  local pageText = editor.getText()
  local fm = index.extractFrontmatter(pageText)

  if fm.frontmatter and fm.frontmatter.banner then
    local bannerPath = fm.frontmatter.banner[1]
    local bannerWidth = fm.frontmatter.banner[2] or ""
    local bannerHeight = fm.frontmatter.banner[3] or ""
    local md
    if bannerWidth ~= "" or bannerHeigth ~= "" then
      md = "![Banner|" .. bannerWidth .."x".. bannerHeight .. "]("..bannerPath..")"
    else
      md = "![Banner](" .. bannerPath .. ")"
    end

    return widget.new {
      markdown = md
    }
  end
  return widget.new {}
end

event.listen {
  name = "hooks:renderTopWidgets",
  run = function(e)
    return widgets.banner()
  end
}
```


## Disable Banner border (optional)
```space-style
/* Disable Widget border*/

#sb-main .cm-editor .sb-lua-top-widget.sb-lua-directive-inline .sb-widget-array img{
  border: none;          /* no border */
/*  border-radius: 15px; */   /* rounded corners */
}
#sb-main .cm-editor .sb-lua-top-widget.sb-lua-directive-inline {
  border: none;          /* no border */
}
```

## Discussions about this widget
* [SilverBullet Community](https://community.silverbullet.md/t/space-lua-top-image-banner-widget-to-make-your-pages-unique/3306?u=mr.red)

