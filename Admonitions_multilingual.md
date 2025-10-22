# Multilingual Custom Admonitions

Shoutout to [paletochen](https://community.silverbullet.md/u/paletochen/summary), [mjf](https://community.silverbullet.md/u/mjf), [malys](https://community.silverbullet.md/u/malys/summary) and [i\_am\_dangry](https://community.silverbullet.md/u/i_am_dangry/summary) for making this admonitions possible.
I wanted to translate the admonition texts to german for my use case, and tinkered around until I made it multilingual😜.

## Currently supported languages
🇬🇧  🇩🇪  🇫🇷  🇮🇹  🇨🇳  🇪🇸  🇭🇺  🇷🇴  🇨🇿

## Configuration

### Language
- add following space-lua to your configuration with your desired language. 
- available languages: "en", "de", "fr", "it", "zh", "es", "hu", "ro", “cs”
  
```lua
config.set("admonLang","de")
```

### Customize the look of your admonitions (paddings,font size , border-width, style & radius)
```space-style
:root {
  --admonition-title-font-size: 1em;
  --admonition-title-font-weight: 800;
  --admonition-text-font-size: 0.8em;
  --admonition-padding-title: 0.5em;
  --admonition-padding-text: 0.8em;
  --admonition-border-width: 2px;
  --admonition-border-style: solid;
/* dotted, dashed, solid, double, groove, ridge, inset, outset, none, hidden */
  --admonition-border-radius: 10px;
}
```

## Implementation

To not have multiple space-styles for the different languages I left the admonition types in english, and handle the multi language support only in the SlashCommand definitions.

### Styling: Icons
```space-style
:root {
--admonition-icon--note: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>');
  
--admonition-icon--abstract: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-text" viewBox="0 0 16 16"><path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5M5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z"/><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1"/></svg>'); 

--admonition-icon--info: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>'); 

--admonition-icon--tip: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fire" viewBox="0 0 16 16"><path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/></svg>'); 

--admonition-icon--success: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/></svg>'); 

--admonition-icon--question: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/></svg>'); 

--admonition-icon--failure: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>'); 

--admonition-icon--warning: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'); 

--admonition-icon--danger: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightning-fill" viewBox="0 0 16 16"><path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641z"/></svg>'); 

--admonition-icon--bug: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bug" viewBox="0 0 16 16"><path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/></svg>'); 

--admonition-icon--example: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-vector-pen" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828zm-1.8 2.908-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z"/><path fill-rule="evenodd" d="M2.832 13.228 8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086z"/></svg>'); 

--admonition-icon--quote: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-quote" viewBox="0 0 16 16"><path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388q0-.527.062-1.054.093-.558.31-.992t.559-.683q.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 9 7.558V11a1 1 0 0 0 1 1zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612q0-.527.062-1.054.094-.558.31-.992.217-.434.559-.683.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 3 7.558V11a1 1 0 0 0 1 1z"/></svg>'); 
}
```

### Styling: Combine Icons & Colors
```space-style
.sb-admonition[admonition=note] {
  --admonition-icon: var(--admonition-icon--note);
  --admonition-color: #00b8d4;
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
  --admonition-color: #ff9100;
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

### Styling: Border and Padding implementation
```space-style

.sb-admonition-type * { display: none; }

.sb-admonition-type::before {
    width: var(--admonition-width) !important;
    margin-right: .3em; 
    margin-bottom: .15em; 
}
/* target all admonitions */
#sb-main .cm-editor .sb-admonition {
  font-size: var(--admonition-text-font-size);
/* uncomment next line if you want paragraph padding inside your admonition/*
/*  padding-top: calc(var(--admonition-padding-text)/2); */ 
  padding-inline: calc(1*var(--admonition-padding-text));
  border-left: var(--admonition-border-width)  var(--admonition-border-style) var(--admonition-color) !important;
  border-right: var(--admonition-border-width)  var(--admonition-border-style) var(--admonition-color);}
  
/* target the admonition title */
.sb-admonition-title {
  color: var(--admonition-color);
  font-size: var(--admonition-title-font-size) !important;
  font-weight: var(--admonition-title-font-weight) !important;
  padding-inline: calc(2*var(--admonition-padding-title)) !important; 
  padding-block: var(--admonition-padding-title) !important;
  border-top: var(--admonition-border-width)  var(--admonition-border-style) var(--admonition-color);
  border-top-left-radius: var(--admonition-border-radius);
  border-top-right-radius: var(--admonition-border-radius);
}

/* target the first admonition directly after the title */
.sb-admonition-title + .sb-admonition {
  padding-top: calc(0.7*var(--admonition-padding-text)) !important;
}

/* target the admonition that is NOT immediately followed by another admonition */
.sb-admonition:not(:has(+ .sb-admonition)){
  padding-bottom: calc(0.7*var(--admonition-padding-text)) !important;
  border-bottom: var(--admonition-border-width) var(--admonition-border-style) var(--admonition-color);
  border-bottom-left-radius: var(--admonition-border-radius);
  border-bottom-right-radius: var(--admonition-border-radius); 
}

```


### Multilingual SlashCommands
```space-lua
-- prioity: 9
config.define("admonLang", {
    type = "string",
    enum = {"en", "de", "fr", "it", "zh", "es", "hu", "ro", "cs"}
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
local admonitions_es = {
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
-- Hungarian
local admonitions_hu = {
  note = "Jegyzet",
  abstract = "Kivonat",
  info = "Információ",
  tip = "Tipp",
  success = "Siker",
  question = "Kérdés",
  warning = "Figyelem",
  failure = "Hiba",
  danger = "Veszély",
  bug = "Programhiba",
  example = "Példa",
  quote = "Idézet"
}

-- Romanian
local admonitions_ro = {
  note = "Notă",
  abstract = "Rezumat",
  info = "Informație",
  tip = "Sfat",
  success = "Succes",
  question = "Întrebare",
  warning = "Atenție",
  failure = "Eroare",
  danger = "Pericol",
  bug = "Bug",
  example = "Exemplu",
  quote = "Citat"
}

-- Czech
local admonitions_cs = {
  note = "Poznámka",
  abstract = "Abstrakt",
  info = "Informace",
  tip = "Tip",
  success = "Úspěch",
  question = "Otázka",
  warning = "Varování",
  failure = "Neúspěch",
  danger = "Nebezpečí",
  bug = "Chyba",
  example = "Příklad",
  quote = "Citát"
}

-- Language mapping
local lang_map = {
  en = admonitions_en,
  de = admonitions_de,
  fr = admonitions_fr,
  it = admonitions_it,
  zh = admonitions_zh,
  es = admonitions_es,
  hu = admonitions_hu,
  ro = admonitions_ro,
  cs = admonitions_cs
}

local lang = config.get("admonLang") or ""
   if lang == "" then 
     editor.flashNotification("⚠️ Admonition lang. not set. Default: English", "info")
   end
   
-- Select based on chosen language or fallback to english
local admonitions = lang_map[lang] or admonitions_en

-- Generate slash commands
for type, displayName in pairs(admonitions) do
  slashcommand.define {
    name = displayName .. " admonition",
    description = "Admonition for " .. displayName,
    run = function()
      local currentLine= editor.getCurrentLine()
      local admonitionTemplate = "> **"..type.."** "..displayName.."\n> ".. currentLine.text .."|^|\n"
      editor.replaceRange(currentLine.from, currentLine.to, admonitionTemplate, true)
    end
  }
end
```

## Examples:

> **abstract** Abstract
> This section provides a brief overview of the concept. Abstracts are perfect for giving readers a quick sense of direction, ensuring they know what’s coming before they commit to reading the full explanation.

> **note** Note
> This is a simple note to remind you of something important. Keep it in mind before making changes to your setup. Notes like this are meant to draw your attention without alarming you, serving as small signposts to prevent silly mistakes later.

> **info** Info
> Here’s some additional information that might clarify things. It’s not essential, but it could save you some confusion later. These  informational blocks are like friendly nudges, helping you connect dots that might otherwise slip through the cracks.

> **tip** Tip
> Use keyboard shortcuts to speed up your workflow. Small optimizations make a big difference over time. Tips are the gentle whispers of experience, saving you hours of trial and error while making you look like you’ve mastered the system from day one.

> **success** Success
> Your configuration was applied successfully. Everything is running exactly as intended. When success messages appear, take a brief moment to bask in the satisfaction — your system finally listened, and nothing exploded. That’s progress worth celebrating.

> **question** Question
> What happens if you modify this setting? Try it and observe the result to understand the behavior. Questions like these encourage exploration and help you build intuition instead of just following recipes. The best learning often starts with curiosity.

> **warning** Warning
> Changing these values could cause unexpected results. Proceed carefully and back up your data first. Warnings exist to stop your future self from swearing at your past self — a small yellow triangle that screams, “Don’t say I didn’t warn you.”

> **failure** Failure
> The operation didn’t complete as expected. Review the logs to identify what went wrong. Failures are not the end but a breadcrumb trail back to understanding. If nothing ever failed, you’d never know how impressively creative software can be in breaking.

> **danger**Danger
> This action is irreversible and could break critical functionality. Execute only if you know what you’re doing. Danger warnings are not for decoration; they mean “one click and you’ll regret everything.” Always assume they’re dead serious — because they usually are.

> **bug**Bug
> There’s a known issue with this feature under certain conditions. Bugs are the digital equivalent of ghosts - rarely seen directly, but you feel their presence when something moves that shouldn’t. Developers chase them. Sometimes catching one just to release three more.

> **example** Example
> Here’s how you might apply the function in a real use case. Adjust the parameters as needed for your scenario. Examples show what’s possible without forcing you to imagine the outcome. A good example bridges theory and reality in two tidy lines of code.


## Discussions to this library
* [SilverBullet Community](https://community.silverbullet.md/t/additional-admonition-types/281?u=mr.red)

## Credits:
- [paletochen](https://community.silverbullet.md/u/paletochen/summary)
- [mjf](https://community.silverbullet.md/u/mjf)
- [malys](https://community.silverbullet.md/u/malys/summary)
- [i\_am\_dangry](https://community.silverbullet.md/u/i_am_dangry/summary)
