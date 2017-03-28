/**
 * Created by user on 10.01.2017.
 */
function Genome() {
    this.container = null;
    this.renderSystem = new RenderSystem();
    this.allObjects = null;
    this.beads = {};
    this.bonds = {};
    this.group = null;
    this.SelectedLockBeadInfo = null;
    this.SelectedBeadInfo = null;
    this.LockedBeadInfo = {};
    this.selectedCSSObject = null;
    this.state = null;
    this.rayCaster = new THREE.Raycaster();

    this.init = function (IsCssRender) {
        var selectedBead = createSimpleSphere();
        this.renderSystem.scene.add(selectedBead);
        this.SelectedBeadInfo = new PairGenomeAndHtml(selectedBead, null, drawSimpleLine(new THREE.Vector3(), new THREE.Vector3()));
        this.renderSystem.scene.add(this.SelectedBeadInfo.line);
        //
        this.renderSystem.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1500 );
        this.renderSystem.camera.position.z = 50;
        this.renderSystem.camera.updateMatrixWorld(true);

        if(IsCssRender!=null && IsCssRender)
            this.renderSystem.initCssRender();
    };

    this.initState = function (state) {
        if(state!=null){
            this.state = state;
            if(state.camera != null){
                var cameraObject = loader.parse( this.state.camera );
                this.renderSystem.camera.copy( cameraObject );
                this.renderSystem.camera.updateProjectionMatrix();
                this.renderSystem.onWindowResize();
            }
            if(this.state.pointInfo){
                // this.selectedCssObject = createCssObject(this.state.pointInfo, this.renderSystem.camera.position);
                // this.renderSystem.cssScene.add(this.selectedCssObject);
                this.SelectedBeadInfo.beadInfo = this.state.pointInfo;
                this.SelectedBeadInfo.selectedBead.position.set(state.pointInfo.x, state.pointInfo.y, state.pointInfo.z);
                this.SelectedBeadInfo.selectedBead.scale.set(state.pointInfo.r +0.01, state.pointInfo.r +0.01, state.pointInfo.r+0.01 );
                this.renderSystem.camera.updateMatrixWorld(true);
                var position = ObjectSphericalToScreen(this.SelectedBeadInfo.selectedBead, this.renderSystem.camera,  window.innerWidth, window.innerHeight);
                updatePositionLine(this.SelectedBeadInfo.line, this.SelectedBeadInfo.selectedBead.position, this.SelectedBeadInfo.selectedBead.position);
                this.SelectedBeadInfo.selectedBeadHtml = createPopup(state.pointInfo, position);
            }
        }
    };

    this.onClick = function (event) {
        var x = ( event.clientX / window.innerWidth ) * 2 - 1;
        var y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        var mouse = new THREE.Vector2(x, y);
        // need fixed this!!!
        var minDistToCamera = 1000;
        var pointInfo = null;
        this.rayCaster = new THREE.Raycaster();
        this.rayCaster.setFromCamera(mouse, this.renderSystem.camera);
        for (var key in this.allObjects){
            if(this.beads[key].visible == false)
                continue;
            for(var i = 0; i < this.allObjects[key].points.length; i++){
                var point = new THREE.Vector3(this.allObjects[key].points[i].x, this.allObjects[key].points[i].y, this.allObjects[key].points[i].z);
                var distance = this.rayCaster.ray.distanceToPoint(point);
                // raycaster.inter
                var distanceToCamera = this.rayCaster.ray.origin.distanceTo(point);
                if(distance<this.allObjects[key].points[i].r && minDistToCamera > distanceToCamera){
                    minDistToCamera = distanceToCamera;
                    pointInfo = this.allObjects[key].points[i];
                }
            }
        }
        // need fixed this!!!
        if(minDistToCamera < 1000){
            if(this.SelectedBeadInfo!=null)
            {
                clearPopupObject(this.SelectedBeadInfo.selectedBeadHtml);
                this.SelectedBeadInfo.activate(pointInfo);
            }
            else{
                this.SelectedBeadInfo = new PairGenomeAndHtml();
                this.SelectedBeadInfo.init(pointInfo);
                this.renderSystem.scene.add(this.SelectedBeadInfo.line);
                this.renderSystem.scene.add(this.SelectedBeadInfo.selectedBead);
            }
            this.SelectedBeadInfo.selectedBeadHtml = createPopup(pointInfo, {x:event.clientX, y:event.clientY});
            updatePositionLine(this.SelectedBeadInfo.line, new THREE.Vector3(pointInfo.x, pointInfo.y, pointInfo.z), this.SelectedBeadInfo.selectedBead.position);
        }
        else {
            this.closeSelected();
            this.hideLockSelected();
        }
    };

    this.createMesh = function (allObjects, state) {
        this.allObjects = allObjects;
        if(this.group != null)
            this.renderSystem.scene.remove(this.group);
        this.beads = {};
        this.bonds = {};
        var indexColor = 0;
        this.group = new THREE.Group();
        for (var key in this.allObjects){
            var chain = getMeshPointsSeparate(this.allObjects[key], palette[indexColor]);
            chain.colorBead = palette[indexColor];
            // var spline = getMeshSpline(this.allObjects[key], palette[indexColor]);
            if(state!=null && !state.selected.includes(key))
                chain.visible = false;
            this.group.add(chain);
            // this.group.add(spline);

            this.beads[key] = chain;
            // this.bonds[key] = spline;
            indexColor++;
        }
        this.renderSystem.scene.add(this.group);
    };

    this.changeVisible = function(key, value) {
        this.beads[key].visible = value > 0;
    };

    this.changeVisibleNew = function(key) {
        this.beads[key].visible = !this.beads[key].visible;
    };

    this.moveHtmlBlock = function (beadInfo) {
        if(beadInfo == null || beadInfo.selectedBeadHtml==null || beadInfo.line==null || !beadInfo.line.visible){
            return;
        }
        var rect = beadInfo.selectedBeadHtml[0].getBoundingClientRect();
        var screenPosition = ScreenToSpherical(rect.left, rect.top, this.renderSystem.camera,  window.innerWidth , window.innerHeight);
        beadInfo.line.geometry.vertices[ 0 ].x=screenPosition.x;
        beadInfo.line.geometry.vertices[ 0 ].y=screenPosition.y;
        beadInfo.line.geometry.vertices[ 0 ].z=screenPosition.z;
        beadInfo.line.geometry.verticesNeedUpdate = true;
    };

    this.OnLock = function () {
        var id = this.SelectedBeadInfo.selectedBeadHtml.attr('id');
        this.LockedBeadInfo[id] = new PairGenomeAndHtml(this.SelectedBeadInfo.selectedBead, this.SelectedBeadInfo.selectedBeadHtml, this.SelectedBeadInfo.line, this.SelectedBeadInfo.beadInfo );

        this.renderSystem.scene.remove(this.SelectedBeadInfo.line);
        this.renderSystem.scene.remove(this.SelectedBeadInfo.selectedBead);
        this.SelectedBeadInfo = null;
        // this.SelectedBeadInfo.line.visible = false;
        // this.SelectedBeadInfo.selectedBead.visible = false;
    };

    this.OnUnlock = function (key) {
        this.closeSelected();
        var unlockedElement = this.LockedBeadInfo[key];
        // this.SelectedBeadInfo.line.visible = true;
        // this.SelectedBeadInfo.selectedBead.visible = true;
        this.SelectedBeadInfo = new PairGenomeAndHtml();
        this.SelectedBeadInfo.beadInfo = unlockedElement.beadInfo;
        this.SelectedBeadInfo.selectedBeadHtml = unlockedElement.selectedBeadHtml;
        this.SelectedBeadInfo.line = unlockedElement.line;
        this.SelectedBeadInfo.selectedBead = unlockedElement.selectedBead;
        this.renderSystem.scene.add(unlockedElement.line);
        this.renderSystem.scene.add(unlockedElement.selectedBead);
    };


    this.hideLockSelected = function () {
        if(this.SelectedLockBeadInfo==null)
            return;
        this.renderSystem.scene.remove(this.SelectedLockBeadInfo.line);
        this.renderSystem.scene.remove(this.SelectedLockBeadInfo.selectedBead);
        this.SelectedLockBeadInfo = null;
    };

    this.closeSelected = function () {
        if(this.SelectedBeadInfo==null)
            return;
        clearPopupObject(this.SelectedBeadInfo.selectedBeadHtml);
        this.SelectedBeadInfo.deactivate();
        this.renderSystem.cssScene.remove(this.selectedCssObject);
    };

    this.closeForm = function (key) {
        if(this.SelectedBeadInfo != null && this.SelectedBeadInfo.beadInfo.beadName===key)
            this.closeSelected();
        else{
            var lockedElement = this.LockedBeadInfo[key];
            clearPopupObject(lockedElement.selectedBeadHtml);
            this.renderSystem.scene.remove(lockedElement.line);
            this.renderSystem.scene.remove(lockedElement.selectedBead);
            this.SelectedBeadInfo = null;
        }
    };

    this.exportBead = function (key) {
        if(this.SelectedBeadInfo != null && this.SelectedBeadInfo.beadInfo.beadName===key)
            this.SelectedBeadInfo.export();
        else{
            this.LockedBeadInfo[key].export();
        }
    };

    this.selectLockElement = function (key) {
        this.hideLockSelected();
        this.SelectedLockBeadInfo = this.LockedBeadInfo[key];
        var rect = this.SelectedLockBeadInfo.selectedBeadHtml[0].getBoundingClientRect();
        var screenPosition = ScreenToSpherical(rect.left, rect.top, this.renderSystem.camera,  window.innerWidth , window.innerHeight);
        updatePositionLine(this.SelectedLockBeadInfo.line, screenPosition, this.SelectedLockBeadInfo.selectedBead.position)
        this.renderSystem.scene.add(this.SelectedLockBeadInfo.line);
        this.renderSystem.scene.add(this.SelectedLockBeadInfo.selectedBead);
    }
}


