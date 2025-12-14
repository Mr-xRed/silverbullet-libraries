---
name: "Library/Mr-xRed/ImageGallery"
tags: meta/library
pageDecoration.prefix: "🖼️ "
---

# Image Gallery Widget


## Usage: `${widgets.imageGallery("FolderPathWith/Images","height")}`
 
${widgets.imageGallery("")}

> **note** Note
> To display all images use empty `""` for the path



## Integration: `[space-lua]`

```space-lua
function widgets.imageGallery(folderPrefix, height)
  if not height or height == "" then
    height = "50vh"
  end

  local files = space.listFiles()
  local galleryHtml = string.format("<div class='image-gallery' style='max-height:%s;'>", height)

  for _, file in ipairs(files) do
    local name = file.name

    if name:match("^" .. folderPrefix) then
      local isImage =
        name:match("%.png$") or
        name:match("%.jpg$") or
        name:match("%.jpeg$") or
        name:match("%.webp$") or
        name:match("%.gif$")

      if isImage then
        galleryHtml = galleryHtml ..
          "<a href='/.fs/" .. name .. "' target='_blank' class='image-tile' title='" .. name .. "'>" ..
            "<div class='image-thumb'>" ..
              "<img src='/.fs/" .. name .. "' loading='lazy' alt='" .. name .. "' />" ..
            "</div>" ..
            "<div class='image-title'>" .. name:match("[^/]+$") .. "</div>" ..
          "</a>"
      end
    end
  end

  galleryHtml = galleryHtml .. "</div>"

  return widget.new {
    display = "block",
    html = galleryHtml
  }
end


```

## Styling: `[space-style]`

```space-style
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-auto-rows: 190px; /* image + title */
  gap: 14px;

  padding: 1em;
  overflow-y: auto;
  align-content: start;
}

.image-tile {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  
  background: var(--editor-code-background-color, #111);
  border-radius: 8px;
  overflow: hidden;

  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
}

/* Thumbnail area */
.image-thumb {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  overflow: hidden;
}

/* Image itself */
.image-thumb img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}

.image-title {
  padding: 6px 8px;
  font-size: 0.75em;
  text-align: center;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  background: rgba(0,0,0,0.15);
}

.image-tile:hover img {
  transform: scale(1.05);
  transition: transform 0.25s ease;
}

.image-tile:hover {
  background-color: rgba(127,127,127,0.3);
}

@supports (animation-timeline: view()) {

  .image-tile {
    animation: fly-in linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 100%;
  }

}

@keyframes fly-in {
  0% {
    opacity: 0.8;
    transform: translateY(30px) scaleX(0.7);
    filter: blur(5px);
  }

  11% {
    opacity: 1;
    transform: translateY(0) scaleX(1);
    filter: blur(0);
  }

  90% {
    opacity: 1;
    transform: translateY(0) scaleX(1);
    filter: blur(0);
  }

  100% {
    opacity: 0.8;
    transform: translateY(-30px) scaleX(0.7);
    filter: blur(5px);
  }
}

```



## Discussions to this library
* [SilverBullet Community](https://community.silverbullet.md/t/image-gallery-browser-widget-for-silverbullet/3647?u=mr.red)
