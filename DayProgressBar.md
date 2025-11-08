---
tags: meta/library
pageDecoration.prefix: "🛠️ "
---
# Time left in a day Progress Bar

This function will display the hours and percentage of the day left, and a progress bar (1xEmoji for each hour - but you can edit the bar length using `barLength` variable)

Visual Example:
⏳04:20h (18.0%) 🟢🟢🟢🟢🟢⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️


## Usage
${timeLeftBar()}

## Implementation
```space-lua
function timeLeftBar()
    local barLength = 24
    local now = os.date("*t") -- get current time as a table
    local secondsPassed = now.hour * 3600 + now.min * 60 + now.sec
    local totalSeconds = 24 * 3600
    local secondsLeft = totalSeconds - secondsPassed
    local percentLeft = (secondsLeft / totalSeconds) * 100
    local percentPassed = 100 - percentLeft  -- time gone

    -- Format time left as HH:MM
    local hoursLeft = math.floor(secondsLeft / 3600)
    local minutesLeft = math.floor((secondsLeft % 3600) / 60)
    local timeStr = string.format("%02d:%02d", hoursLeft, minutesLeft)

    -- Create progress bar (🟢 = time left, ⭕️ = time past)
    local filledLength = math.floor((percentPassed / 100) * barLength)
    local bar = string.rep("🟢", barLength - filledLength) .. string.rep("⭕️", filledLength)

    -- Combine everything
    local tlb = string.format("⏳%sh (%.1f%%) %s", timeStr,percentLeft,bar )
    return tlb
end
```

## Discussions to this function
* [SilverBullet Community](https://community.silverbullet.md/t/space-lua-time-left-in-day-with-progress-bar-visual-version-for-v2/3295?u=mr.red)



