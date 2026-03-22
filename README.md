# ae-replace-layers-sequential

A simple After Effects JSX script that replaces multiple layers with new footage **sequentially** — the multi-layer version of Alt+drag that Adobe never built.

---

## The Problem

Alt+dragging a source onto a layer in the timeline is the fastest way to do a layer replacement in AE. But it only works **one layer at a time**.

If you have a comp with dozens — or thousands — of placeholder layers that need swapping out, doing it one by one is completely impractical.

## The Use Case That Broke the Camel's Back

This script was born out of editing a **3,000-clip video wall** — a massive composition where every single cell was a placeholder solid that needed replacing with real footage. Alt+dragging 3,000 times wasn't an option.

The built-in workaround (selecting a single source in the Project panel and Alt+dragging) has no multi-layer equivalent. This script fills that gap: select N sources, select N layers, run the script — done.

---

## How It Works

The script reads your selected items from the **Project panel** and your selected layers from the **Timeline**, then maps them in order:

```
Source 1  →  Layer 1
Source 2  →  Layer 2
Source 3  →  Layer 3
...
```

If the counts don't match, it warns you before touching anything. The replacement is wrapped in an undo group so you can Ctrl/Cmd+Z if something looks wrong.

---

## Installation

### Option A — Permanent (recommended)

Drop the script into your AE Scripts folder and it'll appear in the **File → Scripts** menu every time you open AE.

**Windows:**
```
C:\Program Files\Adobe\Adobe After Effects [version]\Support Files\Scripts\
```

**Mac:**
```
/Applications/Adobe After Effects [version]/Scripts/
```

Restart AE after copying the file.

### Option B — One-off

**File → Scripts → Run Script File** and browse to wherever you saved the `.jsx`.

---

## Usage

1. **Project panel** — Ctrl+click (Windows) or Cmd+click (Mac) your replacement clips **in the order you want them assigned**
2. **Timeline** — Select your target layers in the same order
3. **File → Scripts → replace_layers_sequential**

> ⚠️ **Order matters.** AE registers project panel selections in the order you click them, so be deliberate. When working with a large batch, test with 2–3 clips first to confirm the order is what you expect.

---

## Tips

- **KBar users** — assign this to a toolbar button for one-click access without going through the menu
- **Large comps** — select layers in the timeline using Shift+click or Ctrl/Cmd+A to grab all, then trim the selection as needed
- The script **does not** affect layer timing, effects, or transform properties — it only swaps the source footage

---

## Compatibility

Tested on **After Effects 2025**. Should work on any version of AE that supports JSX scripting (CS6+).

---

## License

MIT — do whatever you want with it.
