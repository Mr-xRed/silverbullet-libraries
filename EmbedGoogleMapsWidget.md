#meta

## Embed Google Maps in your pages
The widget accepts following arguments:

*   `qry` - required - City, Address, Coordinates
*   `width` - optional - in pixels or %, default is 640
*   `height` - optional - in pixels or %, default is 480
*   `zoom` - optional
    *   min: `1` (zoomed out, whole world)
    *   default: `14`
    *   max: `21` (zoomed in)
*   `map_type` (optional) :
    *   `m (default)`: standard street map
    *   `k` : satellite/hybrid view

!!! Undeclared/Empty arguments must be skipped with double-quotes `""`

## Example:
${embed_map("Colosseum","","400","18","k")}

## Implementation
```space-lua
function embed_map(qry, width, height, zoom, map_type)
  -- Set default values for width, height, zoom, type if not provided
  local width = width or "640"
  local height = height or "480"
  local zoom = zoom or "14"
  local map_type = map_type or "m"
  return widget.new {
    html = '<iframe src="https://maps.google.com/maps?hl=en&q=' .. qry .. '&t=' .. map_type .. '&z=' .. zoom .. '&ie=UTF8&output=embed" style="width:' .. width .. 'px !important; height:' .. height .. 'px !important; border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    display = "inline",
    cssClasses = {"my-map"}
  }
end
```


## More Examples & Discussions
* [SilverBullet Community](https://community.silverbullet.md/t/embed-an-interactive-google-map-to-any-page/1629?u=mr.red)
