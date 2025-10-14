#meta

# Weather Widget for OpenWeatherMaps.org

## Configuration

Get your OpenWeatherMap API KEY from [OpenWeatherMap Website](https://home.openweathermap.org/api_keys). If you don’t have one, you can get one with the free plan.
Setup your apiKey (required) and other options in your configuration page using:

```
config.set( "owm", {
            apiKey = "YOUR_API_KEY",  --required
            refresh = 30,             --optional (minutes)
            def_location = "Berlin"   --optional
}) 
```

## Usage

You have three slash command options:
 
  * `/owm_cust` adds the `getOWM()` function for your **prompted** location:

  ${getOWM("New York")}

or

  * `/owm_inline` adds a **simple string** with current weather:

  🌡️11.4°C 💧97% 🍃↑3 km/h ☁️ overcast clouds ℹ️21:49 🌐Berlin,DE
  
or

  - `/owm_widget_def` - adds a widget for your **default location** (required **defLocation** to be set in configuration)
  
  ${owm_widget()}


## Implementation

### Config Schema
```space-lua
config.define("owm", {
    type = "object",
    properties = {
      apiKey = schema.string(), --req.
      refresh = schema.number(), --opt.
      defLocation = schema.string() --req. for default loc widget only
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
    ["50d"] = "🌫️", ["50n"] = "🌁" }
    -- 1.clear sky, 2.few clouds,
    -- 3.scattered clouds 4.broken clouds,
    -- 9.shower rain, 10.rain
    -- 11. thunderstorm, 13. snow, 50. mist 
    
    -- unicode
    local arrows = { "↑", "↗︎", "→", "↘︎", "↓", "↙︎", "←", "↖︎" }
    -- emoji  
  --local arrows = { "⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️" }
    
        local weatherConfig = config.get("owm") or {}
      local API_KEY = weatherConfig.apiKey
        if not API_KEY or API_KEY == "" then 
          editor.flashNotification("⚠️ OWM API key not set!", "error")
          return "⚠️ OWM API key not set!"
        end
      local refresh = weatherConfig.refresh
      refresh = tonumber(refresh) or 30 --defaults to 30min if not set
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
      else editor.flashNotification("⚠️ Invalid weather data received.") end
    else editor.flashNotification("⚠️ HTTP request failed.") end
  end
  
  if not owm then
  editor.flashNotification( "⚠️ No weather data available.") end
    local owm_weather = string.format("🌡️%.1f°C 💧%d%% 🍃%s%.0f km/h %s %s ℹ️%s 🌐%s,%s", owm.temp, owm.hum, owm.wdir, owm.wind, owm.icon, owm.cond, os.date("%H:%M", owm.timestamp), owm.city, owm.country )
   return owm_weather
end


local function owm_inline()
        local weatherConfig = config.get("owm") or {}
        local location = weatherConfig.defLocation
        local location = editor.prompt("Enter Location:", location)
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
        editor.insertAtCursor('${getOWM("' .. location ..'")}')
  end
}
```
