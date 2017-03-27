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
    this.SelectedBeadInfo = null;
    this.LocledBeadInfo = {};
    this.selectedCSSObject = null;
    this.state = null;
    this.rayCaster = new THREE.Raycaster();
    // this.line = null;

    this.init = function (IsCssRender) {
        var selectedBead = new THREE.Mesh( new THREE.SphereBufferGeometry( 1, 20, 20 ), new THREE.MeshBasicMaterial( { color: new THREE.Color( 0xff0000 ) } ) );
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
                // camera.aspect = this.DEFAULT_CAMERA.aspect;
                this.renderSystem.camera.updateProjectionMatrix();
                this.renderSystem.onWindowResize();
            }
            if(this.state.pointInfo){
                // this.selectedCssObject = createCssObject(this.state.pointInfo, this.renderSystem.camera.position);
                // this.renderSystem.cssScene.add(this.selectedCssObject);

                this.SelectedBeadInfo.selectedBead.position.set(state.pointInfo.x, state.pointInfo.y, state.pointInfo.z);
                this.SelectedBeadInfo.selectedBead.scale.set(state.pointInfo.r +0.01, state.pointInfo.r +0.01, state.pointInfo.r+0.01 );

                this.renderSystem.camera.updateMatrixWorld(true);
                // var position = SphericalToScreen(state.pointInfo.x, state.pointInfo.y, state.pointInfo.z, this.renderSystem.camera, this.renderSystem.renderer.domElement.width, this.renderSystem.renderer.domElement.height);

                // var position = ObjectSphericalToScreen(this.SelectedBeadInfo.selectedBead, this.renderSystem.camera, this.renderSystem.renderer.domElement.width, this.renderSystem.renderer.domElement.height);
                // var screenPosition = ScreenToSpherical(position.x, position.y, this.renderSystem.camera, this.renderSystem.renderer.domElement.width, this.renderSystem.renderer.domElement.height);

                this.SelectedBeadInfo.line = updatePositionLine(this.SelectedBeadInfo.line, this.SelectedBeadInfo.selectedBead.position, this.SelectedBeadInfo.selectedBead.position);
                // this.renderSystem.scene.add(this.line);
                this.SelectedBeadInfo.selectedBeadHtml = createPopup(state.pointInfo, position);
                // var position = SphericalToScreen(state.pointInfo.x, state.pointInfo.y, state.pointInfo.z, this.renderSystem.camera, this.renderSystem.renderer.domElement.width, this.renderSystem.renderer.domElement.height);
                // this.htmlObject = createPopup(state.pointInfo, position);

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
            this.SelectedBeadInfo.activate(pointInfo);
            clearPopupObject(this.SelectedBeadInfo.selectedBeadHtml);
            this.SelectedBeadInfo.selectedBeadHtml = createPopup(pointInfo, {x:event.clientX, y:event.clientY});
            updatePositionLine(this.SelectedBeadInfo.line, new THREE.Vector3(pointInfo.x, pointInfo.y, pointInfo.z), this.SelectedBeadInfo.selectedBead.position);
        }
        else {
            clearPopupObject(this.SelectedBeadInfo.selectedBeadHtml);
            this.SelectedBeadInfo.deactivate();
            this.renderSystem.cssScene.remove(this.selectedCssObject);
        }
    };

    this.createMesh = function (allObjects) {
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

    this.moveHtmlBlock = function () {
        if(this.SelectedBeadInfo.selectedBeadHtml==null || this.SelectedBeadInfo.line==null || !this.SelectedBeadInfo.line.visible){
            return;
        }
        var rect = this.SelectedBeadInfo.selectedBeadHtml[0].getBoundingClientRect();
        var screenPosition = ScreenToSpherical(rect.left, rect.top, this.renderSystem.camera,  window.innerWidth , window.innerHeight);
        this.SelectedBeadInfo.line.geometry.vertices[ 0 ].x=screenPosition.x;
        this.SelectedBeadInfo.line.geometry.vertices[ 0 ].y=screenPosition.y;
        this.SelectedBeadInfo.line.geometry.vertices[ 0 ].z=screenPosition.z;
        this.SelectedBeadInfo.line.geometry.verticesNeedUpdate = true;
    };

    this.OnLock = function () {
        // this.LocledBeadInfo[]
        this.SelectedBeadInfo.selectedBeadHtml = null;
        this.SelectedBeadInfo.line.visible = false;
        this.SelectedBeadInfo.selectedBead.visible = false;
    };

    this.OnUnlock = function (htmlObject) {
        this.htmlObject = htmlObject;
        this.SelectedBeadInfo.line.visible = true;
        this.SelectedBeadInfo.selectedBead.visible = true;
    }
}


