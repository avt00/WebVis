/**
 * Created by user on 24.03.2017.
 */
// function BinderGenome() {
//     this.selectedPair = null;
//     this.lockedPairs = {};
//
//     this.setPair = function (pair) {
//         this.selectedPair = pair;
//     };
//
//     this.addLockPair = function (key, pair) {
//         this.lockedPairs[key] = pair;
//     };
//
//     this.removeLockPair = function (key) {
//         delete this.lockedPairs[key];
//     }
// }

function PairGenomeAndHtml(bead, htmlBead, line, beadInfo) {
    this.beadInfo = beadInfo;
    this.selectedBead = bead;
    this.selectedBeadHtml = htmlBead;
    this.line = line;

    this.init = function (beadInfo) {
        this.beadInfo = beadInfo;
        this.line = drawSimpleLine(new THREE.Vector3(beadInfo.x, beadInfo.y, beadInfo.z), new THREE.Vector3(beadInfo.x, beadInfo.y, beadInfo.z));
        this.selectedBead = createSimpleSphere();
        this.selectedBead.position.set(beadInfo.x, beadInfo.y, beadInfo.z);
        this.selectedBead.scale.set(beadInfo.r+0.01, beadInfo.r+0.01, beadInfo.r+0.01);
    };

    this.activate = function (beadInfo) {
        this.beadInfo = beadInfo;
        this.line.visible = true;
        this.selectedBead.visible = true;
        this.selectedBead.position.set(beadInfo.x, beadInfo.y, beadInfo.z);
        this.selectedBead.scale.set(beadInfo.r+0.01, beadInfo.r+0.01, beadInfo.r+0.01);
    };

    this.deactivate = function () {
        this.line.visible = false;
        this.selectedBead.visible = false;
        this.beadInfo = null;
        this.selectedBeadHtml = null;
    };

    this.export = function () {
        var element = document.createElement('a');
        var fileName = this.beadInfo.beadName;
        var text = "Chr, start, end, name, fpkm\n";
        var SEPARATOR = ",";

        $.each(this.beadInfo.geneInfos, function(index, value)
        {
            text += fileName + SEPARATOR + value.startGene + SEPARATOR + value.endGene + SEPARATOR + value.genomeName + SEPARATOR + value.expression + SEPARATOR + "\n";
        });

        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}