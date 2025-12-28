---
name: "Library/Mr-xRed/DatePicker"
tags: meta/library
pageDecoration.prefix: "🛠️ "
---
# Date Picker as Slash Command
This slash command let’s you pick a date from a calendar and adds it to your page as a WikiLink.
![DatePicker](https://raw.githubusercontent.com/Mr-xRed/silverbullet-libraries/refs/heads/main/DatePicker.png)


```space-lua

function insertDate(args)
  if args and args.date then
    editor.insertAtCursor("[[" .. args.date .. "]]")
  end
end

function openDatePicker()
  local sessionID = "dp_" .. tostring(math.floor(js.window.performance.now()))
  
  local existing = js.window.document.getElementById("sb-datepicker-root")
  if existing then existing.remove() end

  local function uniqueHandler(e)
    if e.detail.session == sessionID then
      insertDate({date = e.detail.date})
      js.window.removeEventListener("sb-insert-date", uniqueHandler)
    end
  end
  js.window.addEventListener("sb-insert-date", uniqueHandler)

  local container = js.window.document.createElement("div")
  container.id = "sb-datepicker-root"
  container.innerHTML = [[
    <style>
      #sb-datepicker-root {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.3); z-index: 20000; display: flex;
        align-items: center; justify-content: center; font-family: sans-serif;
      }
      .dp-card {
        background: #222; color: white;
        border: 1px solid var(--ui-accent-color, #444); border-radius: 12px;
        padding: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); 
        width: 280px; user-select: none;
      }
      .dp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; gap: 5px; }
      .dp-selectors { display: flex; gap: 4px; flex-grow: 1; justify-content: center; }
      .dp-select { 
        background: transparent; color: inherit; border: 1px solid rgba(255,255,255,0.1); 
        border-radius: 4px; font-size: 0.9em; padding: 2px; cursor: pointer;
      }
      .dp-select option { background: #222; color: white; }
      .dp-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
      #dp-days { min-height: 200px; align-content: start; }
      .dp-cell { 
        padding: 6px 0; border: none; background: rgba(255,255,255,0.05); color: inherit; 
        cursor: pointer; border-radius: 6px; font-size: 0.8em; text-align: center;
        height: 28px; display: flex; align-items: center; justify-content: center;
      }
      .dp-cell:hover { background: var(--ui-accent-color, #007bff); color: white !important; }
      .dp-cell.today { border: 1px solid var(--ui-accent-color); font-weight: bold; }
      .dp-cell.sunday { color: #ff5f5f; }
      .dp-lbl.sunday { color: #ff5f5f; opacity: 0.8; }
      .dp-lbl { font-size: 0.75em; opacity: 0.5; font-weight: bold; text-align: center; padding-bottom: 8px; }
      .dp-nav { cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.1); color: white; border-radius: 6px; padding: 5px 10px; }
      .dp-nav:hover { background: var(--ui-accent-color); }
      .dp-footer { 
        margin-top: 10px; display: flex; flex-direction: column; align-items: center; gap: 8px;
        border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;
      }
      .btn-today {
        background: transparent; border: 1px solid var(--ui-accent-color); color: var(--ui-accent-color);
        padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 0.8em; transition: 0.2s; width: 100%;
      }
      .btn-today:hover { background: var(--ui-accent-color); color: white; }
    </style>
    <div class="dp-card" onclick="event.stopPropagation()">
      <div class="dp-header">
        <button class="dp-nav" id="dp-prev"> &lt; </button>
        <div class="dp-selectors" id="dp-title-area">
           <select id="dp-month-select" class="dp-select"></select>
           <select id="dp-year-select" class="dp-select"></select>
        </div>
        <button class="dp-nav" id="dp-next"> &gt; </button>
      </div>
      <div class="dp-grid" id="dp-labels"></div>
      <div class="dp-grid" id="dp-days"></div>
      <div class="dp-footer">
        <button class="btn-today" id="dp-today">Today</button>
        <div style="font-size: 9px; opacity: 0.4; letter-spacing: 1px;">ESC TO CANCEL</div>
      </div>
    </div>
  ]]

  js.window.document.body.appendChild(container)

  local script = [[
    (function() {
      const currentSession = "]] .. sessionID .. [[";
      let viewDate = new Date();
      const today = new Date();
      const root = document.getElementById("sb-datepicker-root");
      
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      const cleanup = () => {
        window.removeEventListener("keydown", handleKey);
        if (root && root.parentNode) root.remove();
      };

      const handleKey = (e) => { if (e.key === "Escape") cleanup(); };

      const render = () => {
        const monthSelect = document.getElementById("dp-month-select");
        const yearSelect = document.getElementById("dp-year-select");
        const grid = document.getElementById("dp-days");
        const labels = document.getElementById("dp-labels");
        
        grid.innerHTML = "";
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        // Update Dropdowns
        monthSelect.innerHTML = monthNames.map((m, i) => `<option value="${i}" ${i === month ? 'selected' : ''}>${m}</option>`).join('');
        
        const years = [];
        for (let y = year - 10; y <= year + 5; y++) years.push(y);
        yearSelect.innerHTML = years.map(y => `<option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>`).join('');

        const daysArr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        labels.innerHTML = daysArr.map((day, idx) => `<div class="dp-lbl ${idx === 6 ? 'sunday' : ''}">${day}</div>`).join('');
        
        let firstDay = new Date(year, month, 1).getDay();
        let offset = (firstDay === 0) ? 6 : firstDay - 1;
        const lastDay = new Date(year, month + 1, 0).getDate();
        
        for (let i = 0; i < offset; i++) grid.appendChild(document.createElement("div"));
        
        for (let i = 1; i <= lastDay; i++) {
          const btn = document.createElement("button");
          btn.className = "dp-cell";
          if (new Date(year, month, i).getDay() === 0) btn.classList.add("sunday");
          if(i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) btn.classList.add("today");
          btn.innerText = i;
          btn.onclick = (e) => {
            e.stopPropagation();
            const m = String(month + 1).padStart(2, '0');
            const d = String(i).padStart(2, '0');
            window.dispatchEvent(new CustomEvent("sb-insert-date", { 
              detail: { date: year + "-" + m + "-" + d, session: currentSession } 
            }));
            cleanup();
          };
          grid.appendChild(btn);
        }
      };

      // Events for dropdowns
      document.getElementById("dp-month-select").onchange = (e) => {
        viewDate.setMonth(parseInt(e.target.value));
        render();
      };
      document.getElementById("dp-year-select").onchange = (e) => {
        viewDate.setFullYear(parseInt(e.target.value));
        render();
      };

      window.addEventListener("keydown", handleKey);
      root.onclick = cleanup;
      document.getElementById("dp-prev").onclick = (e) => { e.stopPropagation(); viewDate.setMonth(viewDate.getMonth() - 1); render(); };
      document.getElementById("dp-next").onclick = (e) => { e.stopPropagation(); viewDate.setMonth(viewDate.getMonth() + 1); render(); };
      document.getElementById("dp-today").onclick = (e) => { e.stopPropagation(); viewDate = new Date(); render(); };
      render();
    })();
  ]]
  
  local scriptEl = js.window.document.createElement("script")
  scriptEl.innerHTML = script
  container.appendChild(scriptEl)
end

slashCommand.define {
  name = "datepicker",
  run = function() openDatePicker() end
}
```

* [SilverBullet Community](https://community.silverbullet.md/t/?u=mr.red)






















