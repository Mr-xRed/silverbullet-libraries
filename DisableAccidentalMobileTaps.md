---
name: "Library/Mr-xRed/DisableAccidentalMobileTaps"
tags: meta/library
pageDecoration.prefix: "🛠️ "
---
# Fixing the Mobile Keyboard Drama - Disable Accidental Taps

Let’s face it: SilverBullet on mobile is a nightmare for reading. You try to scroll, and the keyboard jumps out like a jack-in-the-box. It’s annoying, it’s clunky, and I’m done with it.

I’ve built a script (together with Gemini) that forces the editor to stay in “ReadOnly” mode (not the real SilverBullet-ReadOnly, but a virtualized one) until you actually intend to write.

## Try it out: ${widgets.commandButton("Mobile: Toggle Accidental Tap Shield")}  

## What it does:
*   Blocks Single Taps: **Poking the text does nothing. No cursor, no keyboard, no jumping screen.**
*   But if you Single Tap **WikiLinks** or **PageReferences** insid a query, it acts normal and follows the link
*   Scroll Freely: **You can Swipe, Scroll and Navigate** without the UI losing its mind.
*   The Unlock: **Double-tap or Long-press** the editor to summon the keyboard. Once you click away, it locks itself again.

## Why it works:
I went nuclear 💣. Instead of asking the editor to behave, I used a Capture Phase interceptor on `#sb-editor`. It catches tap signals at the window level and deletes them before the browser can trigger the “helpful” keyboard pop-up.
It turns your notes back into a document, not a minefield.

> **note** Note
>   * Command to trigger it:
>   * Also included a disabled event listener on **editor.pageLoaded**, if you want to enable it you find it in the last part of the script

## Implementation

```space-lua

function setupStreamlinedShield()

  if js.window.sbStreamlinedActive then return end

  local scriptContent = [[
    (function() {
      let lastTap = 0;
      let holdTimer = null;
      const DOUBLE_TAP_THRESHOLD = 300;
      const LONG_PRESS_THRESHOLD = 500;
      let isUnlocked = false;

      const unlock = () => {
        isUnlocked = true;
        console.log("Jarvis: Perimeter disarmed. Editing enabled.");
      };

      const lock = () => {
        isUnlocked = false;
      };

      const handleCapture = (e) => {
        // Critical: If the user toggled the shield OFF, stop intercepting
        if (window.sbShieldDisabledManually) return;

        const isEditor = e.target.closest('#sb-editor');
        const isUI = e.target.closest('.sb-actions, .sb-top-bar, .sb-sidebar, button, .menu-item, a');

        if (!isEditor || isUI) return;
        if (isUnlocked && document.activeElement.closest('#sb-editor')) return;

        const now = Date.now();

        if (e.type === 'touchstart') {
          if (now - lastTap < DOUBLE_TAP_THRESHOLD) {
            unlock();
          }
          lastTap = now;

          clearTimeout(holdTimer);
          holdTimer = setTimeout(() => {
            unlock();
            const el = document.querySelector('#sb-main .cm-content');
            if (el) {
              el.setAttribute('inputmode', 'text');
              el.focus();
            }
          }, LONG_PRESS_THRESHOLD);
        }

        if (e.type === 'touchend' || e.type === 'touchmove') {
          clearTimeout(holdTimer);
        }

        if (!isUnlocked) {
          const killZone = ['mousedown', 'mouseup', 'click', 'touchend'];
          if (killZone.includes(e.type)) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          }
        }
      };

      // NEW: Intercept programmatic focus attempts by the app
      document.addEventListener('focus', (e) => {
        if (window.sbShieldDisabledManually) return;
        if (isUnlocked) return;

        // If the editor tries to grab focus while locked, deny it.
        if (e.target.closest('#sb-editor')) {
          e.preventDefault();
          e.target.blur();
        }
      }, true); // Capture phase is essential here

      document.addEventListener('focusout', (e) => {
        if (e.target.closest('#sb-editor')) lock();
      }, true);

      ['touchstart', 'touchend', 'touchmove', 'mousedown', 'mouseup', 'click'].forEach(type => {
        window.addEventListener(type, handleCapture, { capture: true, passive: false });
      });

      window.sbStreamlinedActive = true;
      console.log("Jarvis: v7 Streamlined Shield is operational.");
    })();
  ]]

  local scriptEl = js.window.document.createElement("script")
  scriptEl.innerHTML = scriptContent
  js.window.document.body.appendChild(scriptEl)
end

command.define {
  name = "Mobile: Toggle Accidental Tap Shield",
  run = function() 
    if not js.window.sbStreamlinedActive then
      setupStreamlinedShield()
      js.window.sbShieldDisabledManually = false
      editor.flashNotification("Shield INITIALIZED and ENGAGED.", "info")
      return
    end

    if js.window.sbShieldDisabledManually then
      js.window.sbShieldDisabledManually = false
      editor.flashNotification("Shield ENGAGED. Double-tap/Hold to edit.", "info")
    else
      js.window.sbShieldDisabledManually = true
      editor.flashNotification("Shield  is DISARMED. Normal tapping restored.", "info")
    end
  end
}

-- Auto-init on load is disabled.
-- You must run the command once to "deploy" the shield.
-- event.listen { name = "editor:pageLoaded", run = function() setupStreamlinedShield() end }

```



## Discussions about this library
* [SilverBullet Community](https://community.silverbullet.md/t/fixing-the-silverbullet-mobile-keyboard-drama-disable-accidental-taps/3709?u=mr.red)