// ============================================================
// replace_layers_sequential.jsx
// After Effects script — Sequential Multi-Layer Replace
// https://github.com/[your-username]/ae-replace-layers-sequential
// ============================================================
//
// USAGE:
//   1. In the Project panel, Ctrl/Cmd+click your replacement
//      clips in the order you want them assigned.
//   2. In the Timeline, select the target layers in the same order.
//   3. Run via File > Scripts > replace_layers_sequential
//
// The script maps source #1 → layer #1, source #2 → layer #2, etc.
// Source and layer counts must match.
// ============================================================

var proj = app.project;

// Collect all selected non-comp items from the Project panel
var sources = [];
for (var i = 1; i <= proj.numItems; i++) {
    if (proj.item(i).selected && !(proj.item(i) instanceof CompItem)) {
        sources.push(proj.item(i));
    }
}

// Get the active composition
var comp = proj.activeItem;
if (!(comp instanceof CompItem)) {
    alert("No active composition found.\nClick inside the Timeline panel first, then run the script.");
}

// Validate and replace
if (sources.length === 0) {
    alert("No sources selected.\nSelect footage items in the Project panel first.");
} else if (comp && comp.selectedLayers.length > 0) {
    var layers = comp.selectedLayers;

    if (sources.length !== layers.length) {
        alert(
            "Count mismatch!\n" +
            "Sources selected: " + sources.length + "\n" +
            "Layers selected:  " + layers.length + "\n\n" +
            "These must match. Select the same number of sources and layers."
        );
    } else {
        app.beginUndoGroup("Replace Layers Sequentially");

        for (var j = 0; j < layers.length; j++) {
            layers[j].replaceSource(sources[j], false);
        }

        app.endUndoGroup();

        alert("Done!\nReplaced " + layers.length + " layer" + (layers.length !== 1 ? "s" : "") + " sequentially.");
    }
} else if (comp) {
    alert("No layers selected in the Timeline.\nSelect the layers you want to replace first.");
}
