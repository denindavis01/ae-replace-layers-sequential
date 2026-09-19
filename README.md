# Sequential Multi-Layer Replace for After Effects

A dockable ScriptUI panel for Adobe After Effects that swaps multiple placeholder layers with new footage or precomps **all at once** — complete with a live mapping preview, repeat/cycle handling, and composition support.

---

## What Does This Script Do?

Normally in After Effects, if you have an animated layer or placeholder solid and want to swap it with a new video or image, you hold **`Alt` (Windows)** or **`Option` (Mac)** and drag the new file onto the layer. This keeps all your position, scale, keyframes, effects, and timing intact.

**The catch?** After Effects only lets you do this **one single layer at a time**.

If you're building a video wall, photo grid, slideshow, or montage with dozens (or thousands!) of clips, doing that by hand takes hours. 

This panel provides a full workflow interface:
* **Live Mapping Preview:** See a side-by-side table of which source maps to which layer before applying changes.
* **Auto-Repeat / Cycling:** Have 3 clips but 15 layers? The script automatically repeats your sources across the timeline layers and indicates each cycle.
* **Compositions Toggle:** Swap solids with precomps or nest precomps effortlessly.
* **100% Non-destructive:** Swaps only the source assets. All keyframes, effects, crop/masks, transforms, and timing remain untouched.
* **1-Click Undo:** Reverts the entire batch in a single `Ctrl+Z` / `Cmd+Z`.

---

## Key Features & Interface

### 1. Live Mapping Preview
Before modifying anything, the panel renders a live list showing:
```
#   | Source Footage / Comp       | Target Timeline Layer
----+-----------------------------+---------------------------
1   | Clip_A.mp4                  | [1] Placeholder Solid 1
2   | Clip_B.mp4                  | [2] Placeholder Solid 2
3   | Clip_A.mp4 (cycle 2)        | [3] Placeholder Solid 3
```

### 2. Smart Repeat & Mismatch Handling
You no longer need an exact 1:1 count:
* **Fewer sources than layers ($S < L$):** The script automatically cycles through your sources to fill all target layers, tagging repeated entries with `(cycle 2)`, `(cycle 3)`, etc., and alerting you in the notice banner.
* **More sources than layers ($S > L$):** The script uses the first $L$ sources and informs you how many extra sources will remain unused.
* **Exact match ($S = L$):** Full 1-to-1 sequential mapping.

### 3. "Allow Compositions as Sources" Toggle
Check this box to include precomps and nested compositions in your replacement sources, or uncheck it to limit replacements strictly to raw footage items.

---

## ⚠️ How Ordering Works

| Where | How it orders your selection | Pro Tip |
| :--- | :--- | :--- |
| **Project Panel** (Sources) | **Top to bottom** as listed in your Project bin (alphabetical). After Effects does *not* track click order in the Project panel. | Name your files with numbers (e.g. `clip_01.mp4`, `clip_02.mp4`) so they line up neatly in order. |
| **Timeline** (Layers) | **Click order** (the order you selected them) or **top-to-bottom** (if using Shift or box-select). | Click your timeline layers in the order you want them filled, or select them from top to bottom. |

---

## How to Use It

1. **Select your replacement files/comps** in the **Project panel**.
2. **Select your target layers** in the **Timeline**.
3. In the panel, click **Refresh Selection** to inspect the live preview mapping.
4. Click **Replace Layers**.
5. Done! Check the status banner to see confirmation of replaced layers.

---

## Installation

### Option A: Install as a Dockable Panel (Recommended)
Place `replace_layers_sequential.jsx` into the **ScriptUI Panels** directory:

* **Windows:**  
  `C:\Program Files\Adobe\Adobe After Effects [version]\Support Files\Scripts\ScriptUI Panels\`
* **Mac:**  
  `/Applications/Adobe After Effects [version]/Scripts/ScriptUI Panels/`

Restart After Effects, then open it from the **Window** menu:  
`Window → replace_layers_sequential.jsx` (dock it anywhere in your workspace).

### Option B: Run as a Standalone / Floating Palette
In After Effects, go to:  
**File → Scripts → Run Script File...** and choose `replace_layers_sequential.jsx`.

### Option C: KBar Integration
Add this script as a button in **KBar** to launch the panel or trigger replacements with one click.

---

## Compatibility

* Tested on **After Effects 2025** and backwards-compatible with CS6+.
* Mac and Windows compatible.
* Fully compatible with standard After Effects undo architecture.

---

## License

[MIT](LICENSE) — free to use and modify for personal and commercial projects.
