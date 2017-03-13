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
    this.selectedBead = null;
    this.selectedCSSObject = null;
    this.beadInfo = null;
    this.state = null;
    this.rayCaster = new THREE.Raycaster();

    this.init = function (IsCssRender) {
        this.selectedBead =  new THREE.Mesh( new THREE.SphereBufferGeometry( 1, 20, 20 ), new THREE.MeshBasicMaterial( { color: new THREE.Color( 0xff0000 ) } ) );
        this.renderSystem.scene.add(this.selectedBead);

        this.renderSystem.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1500 );
        this.renderSystem.camera.position.z = 50;

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
            }
            if(this.state.pointInfo){
                this.selectedCssObject = createCssObject(this.state.pointInfo, this.renderSystem.camera.position);
                this.renderSystem.cssScene.add(this.selectedCssObject);
                this.selectedBead.position.set(state.pointInfo.x, state.pointInfo.y, state.pointInfo.z);
                this.selectedBead.scale.set(state.pointInfo.r +0.01, state.pointInfo.r +0.01, state.pointInfo.r+0.01 );
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
            this.selectedBead.visible = true;
            this.selectedBead.position.set(pointInfo.x, pointInfo.y, pointInfo.z);
            this.selectedBead.scale.set(pointInfo.r+0.01, pointInfo.r+0.01, pointInfo.r+0.01);
            console.log(pointInfo);
            this.beadInfo = pointInfo;

            this.renderSystem.cssScene.remove(this.selectedCssObject);
            this.selectedCssObject = createCssObject(this.beadInfo, this.renderSystem.camera.position);
            this.renderSystem.cssScene.add(this.selectedCssObject);
            // createPopup(key, event);
            // redirectToBead(key);
            // scene.updateMatrix();
            // mapBeads[key].visible = false;
        }
        else {
            this.selectedBead.visible = false;
            this.beadInfo = null;
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
            var spline = getMeshSpline(this.allObjects[key], palette[indexColor]);

            this.group.add(chain);
            this.group.add(spline);

            this.beads[key] = chain;
            this.bonds[key] = spline;
            indexColor++;
        }
        this.renderSystem.scene.add(this.group);
    };

    this.changeVisible = function(key, value) {
        this.beads[key].visible = value > 0;
    }
}


