---
tags: meta/library
---
# Weather Widget for OpenWeatherMap.org

## Configuration

Get your OpenWeatherMap API KEY from [OpenWeatherMap Website](https://home.openweathermap.org/api_keys). If you don’t have one, you can get one with the free plan.
Setup your **apiKey** (required⚠️) and the other optional keys in your configuration page using:

```
config.set( "owm", {
            apiKey = "YOUR_API_KEY",  --required ⚠️
            refresh = 30,             --optional (minutes)
            defLocation = "Berlin",   --optional (req. for def widget)
            temp = true,              --optional |
            humidity = true,          --optional |
            wind = true,              --optional |-(false to hide)
            cache_time = true,        --optional |
            location = true,          --optional |
            custom_emojis = {"🌡️","💧","🍃","ℹ️","🌐"} --optional
}) 
```

## Usage

You have three slash command options:
 
  * `/owm_cust` adds the `getOWM()` function for your **prompted** location:

  ${getOWM("New York")}

or

  * `/owm_inline` adds a **simple string** with current weather:

  🌡️11.4°C 💧97% 🍃↑3km/h ☁️overcast clouds ℹ️21:49 🌐Berlin,DE
  
or

  - `/owm_widget_def` - adds a widget for your **default location**
    (requires **defLocation** to be set in configuration)
  
  ${owm_widget()}


## Implementation

### Config Schema
```space-lua
config.define("owm", {
  type = "object",
  properties = {
    apiKey = schema.string(),
    refresh = schema.number(),
    defLocation = schema.string(),
    temp = schema.boolean(),
    humidity = schema.boolean(),
    wind = schema.boolean(),
    cache_time = schema.boolean(),
    location = schema.boolean(),
    custom_emojis = schema.array(schema.string())
  }
})
```

### Space-Lua functions
```space-lua    
function getOWM(location)
  local weatherEmoji = {
    ["01d"] = "☀️", ["01n"] = "🌙", ["02d"] = "🌤️", ["02n"] = "🌥️",
    ["03d"] = "⛅", ["03n"] = "☁️", ["04d"] = "☁️", ["04n"] = "☁️",
    ["09d"] = "🌦️", ["09n"] = "🌧️", ["10d"] = "🌧️", ["10n"] = "🌧️",
    ["11d"] = "⛈️", ["11n"] = "🌩️", ["13d"] = "❄️", ["13n"] = "🌨️",
    ["50d"] = "🌫️", ["50n"] = "🌁"
  }

  local arrows = { "↑", "↗︎", "→", "↘︎", "↓", "↙︎", "←", "↖︎" }

  local weatherConfig = config.get("owm") or {}
  local API_KEY = weatherConfig.apiKey
  if not API_KEY or API_KEY == "" then
    editor.flashNotification("⚠️ OWM API key not set!", "error")
    return "⚠️ OWM API key not set!"
  end

  local refresh = tonumber(weatherConfig.refresh) or 30
  local refresh_time = refresh * 60
  local url = "https://api.openweathermap.org/data/2.5/weather?q="
  local param = "&units=metric&appid="
  local now = os.time()
  local owm = datastore.get({"owm", location})
  local owmUrl = string.format("%s%s%s%s", url, location, param, API_KEY)

  if not owm or not owm.timestamp or owm.timestamp < (now - refresh_time) then
    local response = http.request(owmUrl)
    if response and response.ok then
      local data = response.body
      if data and data.weather and data.weather[1] then
        owm = {
          city = data.name,
          country = data.sys.country,
          icon = weatherEmoji[data.weather[1].icon] or "❔",
          cond = data.weather[1].description,
          temp = data.main.temp,
          hum = data.main.humidity,
          wind = data.wind.speed,
          wdir = arrows[math.floor((data.wind.deg + 22.5) / 45) % 8 + 1] or "❔",
          timestamp = now
        }
        datastore.set({"owm", location}, owm)
      else
        editor.flashNotification("⚠️ Invalid weather data received.")
      end
    else
      editor.flashNotification("⚠️ HTTP request failed.")
    end
  end

  if not owm then
    editor.flashNotification("⚠️ No weather data available.")
    return "⚠️ No weather data available."
  end

  -- Custom emojis (defaults)
  local e = weatherConfig.custom_emojis or {"🌡️", "💧", "🍃", "ℹ️", "🌐"}

  local parts = {}

  if weatherConfig.temp ~= false then
    table.insert(parts, string.format("%s%.1f°C", e[1], owm.temp))
  end
  if weatherConfig.humidity ~= false then
    table.insert(parts, string.format("%s%d%%", e[2], owm.hum))
  end
  if weatherConfig.wind ~= false then
    table.insert(parts, string.format("%s%s%.0fkm/h", e[3], owm.wdir, owm.wind))
  end

  table.insert(parts, string.format("%s %s", owm.icon, owm.cond))

  if weatherConfig.cache_time ~= false then
    table.insert(parts, string.format("%s%s", e[4], os.date("%H:%M", owm.timestamp)))
  end
  if weatherConfig.location ~= false then
    table.insert(parts, string.format("%s%s,%s", e[5], owm.city, owm.country))
  end

  return table.concat(parts, " ")
end


local function owm_inline()
  local weatherConfig = config.get("owm") or {}
  local location = weatherConfig.defLocation
  location = editor.prompt("Enter Location:", location)
  local weather = getOWM(location)
  editor.insertAtCursor(weather)
end

function owm_widget()
  local weatherConfig = config.get("owm") or {}
  local location = weatherConfig.defLocation
  if not location or location == "" then
    return "⚠️ Default location not set!"
  end
  local weather = getOWM(location)
  return widget.new {
    markdown = weather,
    display = block
  }
end

slashCommand.define {
  name = "owm_inline",
  description = "Inserts current weather as string",
  run = function()
    owm_inline()
  end
}

slashCommand.define {
  name = "owm_widget",
  description = "Insert weather widget for default location",
  run = function()
    editor.insertAtCursor('${owm_widget()}')
  end
}

slashCommand.define {
  name = "owm_cust",
  description = "Insert weather function with custom location",
  run = function()
    local location = editor.prompt("Enter Location:", location)
    editor.insertAtCursor('${getOWM("' .. location .. '")}')
  end
}
```


## Discussions to this Library
* [Silverbullet Community](https://community.silverbullet.md/t/openweathermap-widget/3440?u=mr.red)