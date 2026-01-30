---
name: "Library/Mr-xRed/PomodoroClock"
tags: meta/library
pageDecoration.prefix: "⏲️ "
---

${widgets.commandButton("Pomodoro Clock","Floating: Pomodoro Clock")}

# Floating Pomodoro Clock

A minimalist Pomodoro timer designed to stay out of your way until you inevitably lose focus. It features a circular progress visualization, session tracking, and a draggable interface that remembers its place—unlike some of your more "inspired" ideas.

![Pomodoro_Screenshot|500](https://raw.githubusercontent.com/Mr-xRed/silverbullet-libraries/refs/heads/main/screenshots/Pomodoro_Screenshot.png)

## **Core Functions**

*   **Work/Break Cycles:** 25-minute focus blocks followed by 5-minute intervals.
*   **Visual Feedback:** A dynamic SVG progress ring that depletes as your deadline approaches.
*   **Persistent Positioning:** Stays where you put it across sessions.

## Config & Defaults

```lua

config.set("FloatingPomodoro", {
    workTime = 25,
    breakTime = 5,
    autoStartBreaks = true,
    recoverAfterRefresh = true
  })

```

## Implementation

### Space-Style
```space-style

#sb-pomodoro-root {
    position: fixed;
    width: 180px;
    z-index: 101;
    font-family: var(--editor-font), monospace;
    user-select: none;
    touch-action: none;
}

html[data-theme="dark"] #sb-pomodoro-root {
    --pm-bg: oklch(0.25 0 0);
    --pm-border: oklch(0.4 0 0 / 0.5);
    --pm-text: oklch(0.9 0 0);
    --pm-accent: var(--ui-accent-color, oklch(0.7 0.2 270));
}

html[data-theme="light"] #sb-pomodoro-root {
    --pm-bg: oklch(0.98 0 0);
    --pm-border: oklch(0.85 0 0);
    --pm-text: oklch(0.2 0 0);
    --pm-accent: var(--ui-accent-color, oklch(0.6 0.2 270));
}

.pm-card {
    background: var(--pm-bg);
    color: var(--pm-text);
    border-radius: 20px;
    border: 1px solid var(--pm-border);
    box-shadow: 0 10px 30px oklch(0 0 0 / 0.15);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
     position: relative;
}

.pm-timer-display {
    position: relative;
    width: 140px;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pm-svg {
    transform: rotate(-90deg);
}

.pm-circle-bg {
    fill: none;
    stroke: var(--pm-border);
    stroke-width: 8;
}

.pm-circle-progress {
    fill: none;
    stroke: var(--pm-accent);
    stroke-width: 8;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.3s ease;
}

.pm-time-text {
    position: absolute;
    font-size: 1.8rem;
    top: 40px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
}

.pm-controls {
    display: flex;
    gap: 12px;
    margin-top: 15px;
}

.pm-btn {
    background: var(--pm-border);
    border: none;
    color: var(--pm-text);
    padding: 8px 16px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: 0.2s;
}

.pm-btn:hover {
    background: var(--pm-accent);
    color: white;
}


.pm-urgent { animation: pm-pulse 1.5s infinite; }
      @keyframes pm-pulse { 
          0% { box-shadow: 0 0 0 0 oklch(0.6 0.25 20 / 0.6); } 
          70% { box-shadow: 0 0 0 15px oklch(0.6 0.25 20 / 0); } 
          100% { box-shadow: 0 0 0 0 oklch(0.6 0.25 20 / 0); } 
      }
      
.pm-mode-label {
    position: absolute;
    top: 90px;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.1rem;
    font-weight: bold;
    pointer-events: none;
    z-index: 2;
}
.pm-close {
    position: absolute;
    top: 0px;
    right: 10px;
    font-size: 1.4rem;
    cursor: pointer;
    z-index: 3;
}

```


### Space-Lua
```space-lua
-- priority: -1
config.define("FloatingPomodoro", {
  type = "object",
  properties = {
    workTime = { type = "number" },
    breakTime = { type = "number" },
    autoStartBreaks = { type = "boolean" },
    recoverAfterRefresh = { type = "boolean" }
  }
})

function togglePomodoro()
    local existing = js.window.document.getElementById("sb-pomodoro-root")
    if existing then 
        if existing.style.display == "none" then
            existing.style.display = ""
            clientStore.set("pm_is_open", "true")
            js.window.dispatchEvent( js.new(js.window.CustomEvent, "pm-show-ui") )
        else
            existing.style.display = "none"
            clientStore.set("pm_is_open", "false")
        end
        return 
    end

    local cfg = config.get("FloatingPomodoro") or {}
    local work_m = cfg.workTime or 25
    local break_m = cfg.breakTime or 5

    local saved_top = clientStore.get("pm_pos_top") or "100px"
    local saved_left = clientStore.get("pm_pos_left") or "auto"
    local saved_right = (saved_left == "auto") and "20px" or "auto"

    -- Persistence State Sanitization
    local is_running = clientStore.get("pm_is_running") == "true"
    local is_work_stored = clientStore.get("pm_is_work") ~= "false"
    local target_time_stored = tonumber(clientStore.get("pm_target_time")) or 0
    local paused_time_stored = tonumber(clientStore.get("pm_time_left_at_pause")) or (work_m * 60)
    
    -- Mark as open for recovery
    clientStore.set("pm_is_open", "true")

    local container = js.window.document.createElement("div")
    container.id = "sb-pomodoro-root"
    container.innerHTML = [[
    <style>
        #sb-pomodoro-root { position: fixed; z-index: 1000; top: ]]..tostring(saved_top)..[[; left: ]]..tostring(saved_left)..[[; right: ]]..tostring(saved_right)..[[; }
    
    </style>
    <div class="pm-card" id="pm-main-card">
        <span class="pm-close" id="pm-close-btn">✕</span>
        <div class="pm-timer-display">
            <svg class="pm-svg" width="130" height="130">
                <circle class="pm-circle-bg" cx="65" cy="65" r="58"></circle>
                <circle class="pm-circle-progress" id="pm-bar" cx="65" cy="65" r="58"></circle>
            </svg>
            <div class="pm-time-text" id="pm-time">--:--</div>
            <span id="pm-mode-label" class="pm-mode-label">FOCUS</span>
        </div>
        <div class="pm-controls">
            <button class="pm-btn" id="pm-start">Start</button>
            <button class="pm-btn" id="pm-reset">Reset</button>
        </div>
    </div>
    ]]

    js.window.document.body.appendChild(container)

    local scriptEl = js.window.document.createElement("script")
    scriptEl.innerHTML = [[
    (function() {
        const workTime = ]]..tostring(work_m)..[[ * 60;
        const breakTime = ]]..tostring(break_m)..[[ * 60;
        let timeLeft;
        let isWork = ]]..tostring(is_work_stored)..[[;
        let timer = null;
        let targetTime = ]]..tostring(target_time_stored)..[[; 
        let isRunning = ]]..tostring(is_running)..[[;
        let pausedTime = ]]..tostring(paused_time_stored)..[[;
        const autoStartBreaks = ]]..tostring(cfg.autoStartBreaks or true)..[[;

        const timeEl = document.getElementById("pm-time");
        const barEl = document.getElementById("pm-bar");
        const modeEl = document.getElementById("pm-mode-label");
        const startBtn = document.getElementById("pm-start");
        const cardEl = document.getElementById("pm-main-card");
        const root = document.getElementById("sb-pomodoro-root");
        
        const circ = 2 * Math.PI * 58;
        barEl.style.strokeDasharray = circ;

        const SNAP = 15;
        const TOP_OFFSET = 60;

        function clamp() {
            const rect = root.getBoundingClientRect();
            let left = rect.left, top = rect.top;
            if (left < 0) left = 0;
            if (top < TOP_OFFSET) top = TOP_OFFSET;
            if (left + rect.width > window.innerWidth) left = window.innerWidth - rect.width;
            if (top + rect.height > window.innerHeight) top = window.innerHeight - rect.height;
            root.style.left = left + "px";
            root.style.top = top + "px";
            root.style.right = "auto";
        }

        function saveState() {
            window.dispatchEvent(new CustomEvent("pm-save-state", { 
                detail: { 
                    isRunning, 
                    isWork, 
                    targetTime, 
                    pausedTime: isRunning ? null : timeLeft 
                } 
            }));
        }

        function updateUI() {
            if (timeLeft < 0) timeLeft = 0;
            let m = Math.floor(timeLeft / 60);
            let s = timeLeft % 60;
            timeEl.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
            
            let total = isWork ? workTime : breakTime;
            barEl.style.strokeDashoffset = circ - (timeLeft / total) * circ;
            modeEl.innerText = isWork ? "FOCUS" : "BREAK";

            if (timeLeft < 60 && timeLeft > 0) cardEl.classList.add("pm-urgent");
            else cardEl.classList.remove("pm-urgent");
        }

        function tick() {
            if (targetTime) {
                timeLeft = Math.round((targetTime - Date.now()) / 1000);
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    timer = null;
                    isRunning = false;
                    isWork = !isWork;
                    timeLeft = isWork ? workTime : breakTime;
                    targetTime = null;
                    saveState();
                    updateUI();
                    alert(isWork ? "Work cycle starting." : "Break time, sir.");
                    if (autoStartBreaks) {
                        isRunning = true;
                        targetTime = Date.now() + (timeLeft * 1000);
                        timer = setInterval(tick, 1000);
                        startBtn.innerText = "Pause";
                        saveState();
                        updateUI();
                    }
                }
            }
            updateUI();
        }

        if (isRunning) {
            timeLeft = Math.round((targetTime - Date.now()) / 1000);
            if (timeLeft <= 0) {
                isRunning = false;
                isWork = !isWork;
                timeLeft = isWork ? workTime : breakTime;
                targetTime = null;
                saveState();
                updateUI();
                startBtn.innerText = "Start";
            } else {
                timer = setInterval(tick, 1000);
                startBtn.innerText = "Pause";
            }
        } else {
            timeLeft = pausedTime;
            if (timeLeft <= 0) {
                timeLeft = isWork ? workTime : breakTime;
            }
            startBtn.innerText = timeLeft === (isWork ? workTime : breakTime) ? "Start" : "Resume";
        }

        startBtn.onclick = () => {
            if (timer) {
                clearInterval(timer);
                timer = null;
                isRunning = false;
                targetTime = null;
                startBtn.innerText = "Resume";
                saveState();
                updateUI();
            } else {
                isRunning = true;
                targetTime = Date.now() + (timeLeft * 1000);
                timer = setInterval(tick, 1000);
                startBtn.innerText = "Pause";
                saveState();
            }
        };

        document.getElementById("pm-reset").onclick = () => {
            clearInterval(timer);
            timer = null;
            isRunning = false;
            targetTime = null;
            isWork = true;
            timeLeft = workTime;
            startBtn.innerText = "Start";
            saveState();
            updateUI();
        };

        document.getElementById("pm-close-btn").onclick = () => { 
            clearInterval(timer);
            timer = null;
            root.style.display = "none"; 
            window.dispatchEvent(new CustomEvent("pm-close-ui"));
        };

        window.addEventListener("resize", clamp);

        cardEl.onpointerdown = (e) => {
            if (e.target.tagName === "BUTTON") return;
            document.body.classList.add("sb-dragging-active");
            let sX = e.clientX - root.offsetLeft, sY = e.clientY - root.offsetTop;
            const move = (m) => {
                let nL = m.clientX - sX, nT = m.clientY - sY;
                const w = root.offsetWidth, h = root.offsetHeight;
                if (nL < SNAP) nL = 0;
                if (nT < TOP_OFFSET + SNAP) nT = TOP_OFFSET;
                if (nL + w > window.innerWidth - SNAP) nL = window.innerWidth - w;
                if (nT + h > window.innerHeight - SNAP) nT = window.innerHeight - h;
                root.style.left = Math.max(0, Math.min(nL, window.innerWidth - w)) + "px";
                root.style.top = Math.max(TOP_OFFSET, Math.min(nT, window.innerHeight - h)) + "px";
                root.style.right = "auto";
            };
            const up = () => {
                document.body.classList.remove("sb-dragging-active");
                window.removeEventListener("pointermove", move);
                window.dispatchEvent(new CustomEvent("pm-save-pos", { detail: { top: root.style.top, left: root.style.left }}));
            };
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", up, {once:true});
        };

        window.addEventListener("pm-show-ui", () => {
            updateUI();
            if (isRunning && timer === null && targetTime > Date.now()) {
                timer = setInterval(tick, 1000);
            }
        });

        updateUI();

        setTimeout(clamp, 50);
    })();
    ]]
    container.appendChild(scriptEl)
end

-- Persistence Listeners
js.window.addEventListener("pm-save-state", function(e)
    clientStore.set("pm_is_running", tostring(e.detail.isRunning))
    clientStore.set("pm_is_work", tostring(e.detail.isWork))
    clientStore.set("pm_target_time", tostring(e.detail.targetTime or 0))
    clientStore.set("pm_time_left_at_pause", tostring(e.detail.pausedTime or 0))
end)

js.window.addEventListener("pm-reset-state", function()
    clientStore.set("pm_is_running", "false")
    clientStore.set("pm_is_work", "true")
    clientStore.set("pm_target_time", "0")
    clientStore.set("pm_time_left_at_pause", "0")
end)

js.window.addEventListener("pm-close-ui", function()
    clientStore.set("pm_is_open", "false")
end)

js.window.addEventListener("pm-save-pos", function(e)
    clientStore.set("pm_pos_top", e.detail.top)
    clientStore.set("pm_pos_left", e.detail.left)
end)

-- Recovery Logic
function restorePomodoroOnLoad()
    local cfg = config.get("FloatingPomodoro") or {}
    local recoverAfterRefresh = cfg.recoverAfterRefresh ~= false
    
    if not recoverAfterRefresh then return end
    
    local isOpen = clientStore.get("pm_is_open")
    local existing = js.window.document.getElementById("sb-pomodoro-root")
    
    -- If it should be open but doesn't exist in the current page DOM, create it.
    if isOpen == "true" and not existing then
        togglePomodoro()
    end
end

event.listen { name = "editor:pageLoaded", run = function() restorePomodoroOnLoad() end }

command.define {
    name = "Floating: Pomodoro Clock",
    run = function() togglePomodoro() end
}
```

## **A Note on Productivity**

If you find yourself staring at the circular progress ring more than the text you are supposed to be writing, please remember that the Pomodoro technique was designed by **Francesco Cirillo** in the late 1980s to *increase* focus, not to provide another distraction via high-end CSS.


## Discussion about this Library
- [Silverbullet Community](https://community.silverbullet.md/latest)

