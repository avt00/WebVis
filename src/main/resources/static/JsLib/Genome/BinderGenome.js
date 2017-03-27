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
    }
}