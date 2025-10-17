# Multilingual Custom Admonitions

Shoutout to [paletochen](https://community.silverbullet.md/u/paletochen/summary), [mjf](https://community.silverbullet.md/u/mjf), [malys](https://community.silverbullet.md/u/malys/summary) and [i\_am\_dangry](https://community.silverbullet.md/u/i_am_dangry/summary) for making this admonitions possible.

I wanted to translate the admonition texts to german for my use case, and tinkered around until I made it multilingual😜.

## Currently supported languages
🇬🇧 🇩🇪 🇫🇷 🇮🇹 🇨🇳 🇪🇸

## Configuration
- just add following space-lua to your configuration with your desired language. 
- available languages: "en", "de", "fr", "it", "zh", "es"

```lua
-- priority: 9
config.set("admonLang","de")

```

## Implementation

To not have multiple space-styles for the different languages I left the admonition types in wnglish, and handle the multi language support only in the SlashCommand definitions (you can check out below).


### Styling, icons and colors

```space-style
:root {
  --admonition-icon--note:     url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m3.1 5.07c.14 0 .28.05.4.16l1.27 1.27c.23.22.23.57 0 .78l-1 1-2.05-2.05 1-1c.1-.11.24-.16.38-.16m-1.97 1.74 2.06 2.06-6.06 6.06H7.07v-2.06z"/></svg>');
  --admonition-icon--abstract: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17 9H7V7h10m0 6H7v-2h10m-3 6H7v-2h7M12 3a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1m7 0h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2"/></svg>');
  --admonition-icon--info:     url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>');
  --admonition-icon--tip:      url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12a.6.6 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.12 6.07-1.6 1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26m-3.16 6.3c-.28.24-.74.5-1.1.6-1.12.4-2.24-.16-2.9-.82 1.19-.28 1.9-1.16 2.11-2.05.17-.8-.15-1.46-.28-2.23-.12-.74-.1-1.37.17-2.06.19.38.39.76.63 1.06.77 1 1.98 1.44 2.24 2.8.04.14.06.28.06.43.03.82-.33 1.72-.93 2.27"/></svg>');
  --admonition-icon--success:  url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 7 9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59z"/></svg>');
  --admonition-icon--question: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m15.07 11.25-.9.92C13.45 12.89 13 13.5 13 15h-2v-.5c0-1.11.45-2.11 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41a2 2 0 0 0-2-2 2 2 0 0 0-2 2H8a4 4 0 0 1 4-4 4 4 0 0 1 4 4 3.2 3.2 0 0 1-.93 2.25M13 19h-2v-2h2M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10c0-5.53-4.5-10-10-10"/></svg>');
  --admonition-icon--warning:  url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 14h-2V9h2m0 9h-2v-2h2M1 21h22L12 2z"/></svg>');
  --admonition-icon--failure:  url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>');
  --admonition-icon--danger:   url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m11.5 20 4.86-9.73H13V4l-5 9.73h3.5zM12 2c2.75 0 5.1 1 7.05 2.95S22 9.25 22 12s-1 5.1-2.95 7.05S14.75 22 12 22s-5.1-1-7.05-2.95S2 14.75 2 12s1-5.1 2.95-7.05S9.25 2 12 2"/></svg>');
  --admonition-icon--bug:      url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11 13h2v1h-2zm10-8v6c0 5.5-3.8 10.7-9 12-5.2-1.3-9-6.5-9-12V5l9-4zm-4 5h-2.2c-.2-.6-.6-1.1-1.1-1.5l1.2-1.2-.7-.7L12.8 8H12c-.2 0-.5 0-.7.1L9.9 6.6l-.8.8 1.2 1.2c-.5.3-.9.8-1.1 1.4H7v1h2v1H7v1h2v1H7v1h2.2c.4 1.2 1.5 2 2.8 2s2.4-.8 2.8-2H17v-1h-2v-1h2v-1h-2v-1h2zm-6 2h2v-1h-2z"/></svg>');
  --admonition-icon--example:  url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 2v2h1v14a4 4 0 0 0 4 4 4 4 0 0 0 4-4V4h1V2zm4 14c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1m2-4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1m1-5h-4V4h4z"/></svg>');
  --admonition-icon--quote:    url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 17h3l2-4V7h-6v6h3M6 17h3l2-4V7H5v6h3z"/></svg>')
}

.sb-admonition-type * { display: none; }

.sb-admonition-type::before {
  width: 1em !important;
  margin-right: .3em;
  margin-bottom: .15em;
}

.sb-admonition {
  border-right: 1px solid var(--admonition-color);
}

.sb-admonition[admonition=note] {
  --admonition-icon: var(--admonition-icon--note);
  --admonition-color: cyan;
}

.sb-admonition[admonition=abstract] {
  --admonition-icon: var(--admonition-icon--abstract);
  --admonition-color: dodgerblue;
}

.sb-admonition[admonition=info] {
  --admonition-icon: var(--admonition-icon--info);
  --admonition-color: turquoise;
}

.sb-admonition[admonition=tip] {
  --admonition-icon: var(--admonition-icon--tip);
  --admonition-color: #00bfa5;
}

.sb-admonition[admonition=success] {
  --admonition-icon: var(--admonition-icon--success);
  --admonition-color: #00c853;
}

.sb-admonition[admonition=question] {
  --admonition-icon: var(--admonition-icon--question);
  --admonition-color: #64dd17;
}

.sb-admonition[admonition=warning] {
  --admonition-icon: var(--admonition-icon--warning);
  --admonition-color: #ff5252;
}

.sb-admonition[admonition=failure] {
  --admonition-icon: var(--admonition-icon--failure);
  --admonition-color: #ff5252;
}

.sb-admonition[admonition=danger] {
  --admonition-icon: var(--admonition-icon--danger);
  --admonition-color: #ff1744;
}

.sb-admonition[admonition=bug] {
  --admonition-icon: var(--admonition-icon--bug);
  --admonition-color: #f50057;
}

.sb-admonition[admonition=example] {
  --admonition-icon: var(--admonition-icon--example);
  --admonition-color: #7c4dff;
}

.sb-admonition[admonition=quote] {
  --admonition-icon: var(--admonition-icon--quote);
  --admonition-color: #9e9e9e;
}

```


### Multilingual SlashCommands and DisplayNames

```space-lua
-- prioity: 9
config.define("admonLang", {
    type = "string",
    enum = {"en", "de", "fr", "it", "zh", "es"}
})

-- English
local admonitions_en = {
  note = "Note",
  abstract = "Abstract",
  info = "Info",
  tip = "Tip",
  success = "Success",
  question = "Question",
  warning = "Warning",
  failure = "Failure",
  danger = "Danger",
  bug = "Bug",
  example = "Example",
  quote = "Quote"
}

-- German
local admonitions_de = {
  note = "Hinweis",
  abstract = "Zusammenfassung",
  info = "Information",
  tip = "Tipp",
  success = "Erfolg",
  question = "Frage",
  warning = "Warnung",
  failure = "Fehler",
  danger = "Gefahr",
  bug = "Programmfehler",
  example = "Beispiel",
  quote = "Zitat"
}

-- French
local admonitions_fr = {
  note = "Remarque",
  abstract = "Résumé",
  info = "Information",
  tip = "Astuce",
  success = "Succès",
  question = "Question",
  warning = "Avertissement",
  failure = "Échec",
  danger = "Danger",
  bug = "Bogue",
  example = "Exemple",
  quote = "Citation"
}

-- Italian
local admonitions_it = {
  note = "Nota",
  abstract = "Sommario",
  info = "Informazione",
  tip = "Suggerimento",
  success = "Successo",
  question = "Domanda",
  warning = "Avvertimento",
  failure = "Errore",
  danger = "Pericolo",
  bug = "Bug",
  example = "Esempio",
  quote = "Citazione"
}

-- Chinese (Simplified)
local admonitions_zh = {
  note = "注意",
  abstract = "摘要",
  info = "信息",
  tip = "提示",
  success = "成功",
  question = "问题",
  warning = "警告",
  failure = "失败",
  danger = "危险",
  bug = "错误",
  example = "示例",
  quote = "引用"
}

-- Spanish
admonitions_es = {
  note = "Nota",
  abstract = "Resumen",
  info = "Información",
  tip = "Consejo",
  success = "Éxito",
  question = "Pregunta",
  warning = "Advertencia",
  failure = "Fallo",
  danger = "Peligro",
  bug = "Error",
  example = "Ejemplo",
  quote = "Cita"
}

-- Language mapping
local lang_map = {
  en = admonitions_en,
  de = admonitions_de,
  fr = admonitions_fr,
  it = admonitions_it,
  zh = admonitions_zh,
  es = admonitions_es
}

local lang = config.get("admonLang") or ""
   if lang == "" then 
     editor.flashNotification("⚠️ Admonition lang. not set. Default: English", "info")
   end
   
-- Select based on chosen language or fallback to english
local admonitions = lang_map[lang] or admonitions_en

-- Generate slash commands
for key, displayName in pairs(admonitions) do
  slashcommand.define {
    name = displayName .. " admonition",
    description = "Admonition for " .. displayName,
    run = function()
      editor.insertAtCursor("> **"..key.."** "..displayName.."\n> |^|\n", false, true)
    end
  }
end

```

## Examples:

> **note** Note
>

> **abstract** Abstract
>

> **info** Info
>
 
> **tip** Tip
> 

> **success** Success
> 

> **question** Question
> 

> **warning** Warning
> 

> **failure** Failure
> 

> **danger** Danger
> 

> **bug** Bug
> 

> **example** Example
> 

> **quote** Quote
> 

## Discussions to this library
* [SilverBullet Community](https://community.silverbullet.md/t/space-lua-time-left-in-day-with-progress-bar-visual-version-for-v2/3295?u=mr.red)

## Credits:
- [paletochen](https://community.silverbullet.md/u/paletochen/summary)
- [mjf](https://community.silverbullet.md/u/mjf)
- [malys](https://community.silverbullet.md/u/malys/summary)
- [i\_am\_dangry](https://community.silverbullet.md/u/i_am_dangry/summary)
