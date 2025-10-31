
# ModalBox Highlighter

This CSS snippet is all about **improving focus and usability** when interacting with modal boxes in SilverBullet, such as search results, dialogs, or other pop-ups. Essentially, it’s a combination of **visual polish** and **functional enhancement**.

*   **Dimensions & Shape**: 600px wide, 80px from top, 15px rounded corners - modern, soft look.
*   **Backdrop**: Dark, semi-transparent, blurred overlay - focuses attention on modal.
*   **Benefits**: Improves focus, usability, and aesthetics with sleek, user-friendly design.


```space-style
/* Makes the modal box a little narrower and higher to fit more results*/
.sb-modal-box {
    width: 600px;
    top:80px;
    border-radius: 15px !important;
}

.sb-modal-box .sb-result-list {
    max-height: 60vh;
}

/* Creates a dark blured backdrop when a ModalBox is opened */
#sb-root::before {
  content: "";
  position: fixed;
  inset: 0; 
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(10px);
  z-index: 9998;
  opacity: 0;
  pointer-events: none; 
  transition: opacity 0.5s ease;
}

#sb-root:has(.sb-modal-box[open])::before {
  opacity: 1;
  pointer-events: auto;
}

.sb-modal-box[open] {
  position: fixed;
  z-index: 9999;
}

```


## Silversearch-Modalbox Highlighter

```space-style
#sb-root:has(.sb-modal-box)::before, #sb-root:has(.sb-modal)::before {
  opacity: 1;
  pointer-events: auto;
}

.sb-modal-box[open], .sb-modal {
  position: fixed;
  z-index: 9999;
}

```

## Discussions about this space-style
* [SilverBullet Community](https://community.silverbullet.md/t/modalbox-highlighter/3456?u=mr.red)



