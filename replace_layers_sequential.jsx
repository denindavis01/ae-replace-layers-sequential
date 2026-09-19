// ============================================================
// replace_layers_sequential.jsx
// After Effects ScriptUI Panel — Sequential Multi-Layer Replace
// https://github.com/[your-username]/ae-replace-layers-sequential
// ============================================================

(function(thisObj) {
    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel)
            ? thisObj
            : new Window("palette", "Sequential Layer Replacer", undefined, { resizeable: true });

        win.orientation = "column";
        win.alignChildren = ["fill", "top"];
        win.spacing = 8;
        win.margins = 10;

        // --- Top Controls: Options & Refresh ---
        var topGroup = win.add("group");
        topGroup.orientation = "row";
        topGroup.alignChildren = ["left", "center"];
        topGroup.spacing = 10;
        topGroup.alignment = ["fill", "top"];

        var chkIncludeComps = topGroup.add("checkbox", undefined, "Allow Compositions as sources");
        chkIncludeComps.value = true;
        chkIncludeComps.helpTip = "When checked, selected precomps and compositions in the Project panel can be used as replacement sources.";

        var btnRefresh = topGroup.add("button", undefined, "Refresh Selection");
        btnRefresh.alignment = ["right", "center"];
        btnRefresh.helpTip = "Re-scans selected project items and timeline layers.";

        // --- Summary & Notice Area ---
        var infoPanel = win.add("panel", undefined, "Selection Summary");
        infoPanel.orientation = "column";
        infoPanel.alignChildren = ["fill", "top"];
        infoPanel.spacing = 4;
        infoPanel.margins = 8;
        infoPanel.alignment = ["fill", "top"];

        var lblCounts = infoPanel.add("statictext", undefined, "0 sources selected | 0 layers selected");
        lblCounts.graphics.font = ScriptUI.newFont(lblCounts.graphics.font.name, "Bold", lblCounts.graphics.font.size);

        var lblNotice = infoPanel.add("statictext", undefined, "Select project items and timeline layers, then click Refresh.", { multiline: true });
        lblNotice.preferredSize.height = 32;

        // --- Preview List ---
        var previewGroup = win.add("group");
        previewGroup.orientation = "column";
        previewGroup.alignChildren = ["fill", "fill"];
        previewGroup.alignment = ["fill", "fill"];

        var previewHeader = previewGroup.add("statictext", undefined, "Replacement Preview:");
        previewHeader.alignment = ["left", "top"];

        var previewList = previewGroup.add("listbox", undefined, [], {
            numberOfColumns: 3,
            showHeaders: true,
            columnTitles: ["#", "Source Footage / Comp", "Target Timeline Layer"],
            columnWidths: [35, 170, 170]
        });
        previewList.alignment = ["fill", "fill"];
        previewList.preferredSize = [400, 180];

        // --- Bottom Action Bar ---
        var bottomGroup = win.add("group");
        bottomGroup.orientation = "row";
        bottomGroup.alignChildren = ["fill", "center"];
        bottomGroup.alignment = ["fill", "bottom"];

        var btnReplace = bottomGroup.add("button", undefined, "Replace Layers");
        btnReplace.preferredSize = [130, 28];
        btnReplace.enabled = false;

        var lblStatus = bottomGroup.add("statictext", undefined, "Ready.");
        lblStatus.alignment = ["fill", "center"];

        // State storage
        var currentSources = [];
        var currentLayers = [];

        // Helper: Collect selected sources from project panel
        function getSelectedSources() {
            var proj = app.project;
            var sources = [];
            if (!proj) return sources;

            for (var i = 1; i <= proj.numItems; i++) {
                var item = proj.item(i);
                if (item.selected) {
                    if (item instanceof CompItem) {
                        if (chkIncludeComps.value) {
                            sources.push(item);
                        }
                    } else if (item instanceof FootageItem) {
                        sources.push(item);
                    }
                }
            }
            return sources;
        }

        // Helper: Collect selected layers from active composition
        function getSelectedLayers() {
            var layers = [];
            var proj = app.project;
            if (!proj) return layers;

            var comp = proj.activeItem;
            if (comp instanceof CompItem && comp.selectedLayers.length > 0) {
                for (var j = 0; j < comp.selectedLayers.length; j++) {
                    layers.push(comp.selectedLayers[j]);
                }
            }
            return layers;
        }

        // Refresh and update preview mapping
        function updatePreview() {
            currentSources = getSelectedSources();
            currentLayers = getSelectedLayers();

            previewList.removeAll();
            lblStatus.text = "Ready.";

            var sCount = currentSources.length;
            var lCount = currentLayers.length;

            if (sCount === 0 && lCount === 0) {
                lblCounts.text = "No sources or layers selected";
                lblNotice.text = "Select footage/comps in the Project panel and target layers in the Timeline, then click Refresh.";
                btnReplace.enabled = false;
                return;
            }

            if (sCount === 0) {
                lblCounts.text = "0 sources selected  |  " + lCount + " layer(s) selected";
                lblNotice.text = "Please select footage items or comps in the Project panel.";
                btnReplace.enabled = false;
                return;
            }

            if (lCount === 0) {
                lblCounts.text = sCount + " source(s) selected  |  0 layers selected";
                lblNotice.text = "Please select target layers in the active composition timeline.";
                btnReplace.enabled = false;
                return;
            }

            // Both sources and layers are present
            btnReplace.enabled = true;
            lblCounts.text = sCount + " source(s) selected  ➔  " + lCount + " target layer(s)";

            if (sCount < lCount) {
                var repeatTimes = Math.ceil(lCount / sCount);
                lblNotice.text = "Notice: " + sCount + " source(s) will repeat across " + lCount + " layers (" + repeatTimes + " cycles).";
            } else if (sCount > lCount) {
                var unused = sCount - lCount;
                lblNotice.text = "Notice: " + sCount + " sources for " + lCount + " layers. The first " + lCount + " will be used (" + unused + " unused).";
            } else {
                lblNotice.text = "Exact match: 1-to-1 sequential mapping.";
            }

            // Populate the preview list
            for (var k = 0; k < lCount; k++) {
                var srcIdx = k % sCount;
                var srcItem = currentSources[srcIdx];
                var layerItem = currentLayers[k];

                var isRepeated = (k >= sCount) ? " (cycle " + (Math.floor(k / sCount) + 1) + ")" : "";
                var sourceDisplayName = srcItem.name + isRepeated;
                var layerDisplayName = "[" + layerItem.index + "] " + layerItem.name;

                var row = previewList.add("item", (k + 1).toString());
                row.subItems[0].text = sourceDisplayName;
                row.subItems[1].text = layerDisplayName;
            }
        }

        // Replace action
        function performReplace() {
            if (currentSources.length === 0 || currentLayers.length === 0) {
                lblStatus.text = "Cannot replace: missing selection.";
                return;
            }

            var sCount = currentSources.length;
            var lCount = currentLayers.length;
            var replacedCount = 0;
            var skippedCount = 0;

            app.beginUndoGroup("Replace Layers Sequentially");

            for (var j = 0; j < lCount; j++) {
                var targetLayer = currentLayers[j];
                var newSource = currentSources[j % sCount];

                // Ensure the layer is capable of having its source replaced
                if (targetLayer && typeof targetLayer.replaceSource === "function") {
                    try {
                        targetLayer.replaceSource(newSource, false);
                        replacedCount++;
                    } catch (err) {
                        skippedCount++;
                    }
                } else {
                    skippedCount++;
                }
            }

            app.endUndoGroup();

            if (skippedCount > 0) {
                lblStatus.text = "Replaced " + replacedCount + " layer(s) (" + skippedCount + " skipped/incompatible).";
            } else {
                lblStatus.text = "Success! Replaced " + replacedCount + " layer(s) sequentially.";
            }

            // Refresh preview to show updated state
            updatePreview();
        }

        // Event Listeners
        btnRefresh.onClick = updatePreview;
        chkIncludeComps.onClick = updatePreview;
        btnReplace.onClick = performReplace;

        // Resize behavior
        win.onResizing = win.onResize = function() {
            this.layout.resize();
        };

        win.layout.layout(true);
        win.layout.resize();

        // Initial preview scan if possible
        try {
            updatePreview();
        } catch (e) {}

        return win;
    }

    var myPanel = buildUI(thisObj);
    if (myPanel instanceof Window) {
        myPanel.center();
        myPanel.show();
    }
})(this);
