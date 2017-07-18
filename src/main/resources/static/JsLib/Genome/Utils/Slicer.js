/**
 * Created by user on 22.06.2017.
 */
function Sliser() {
    this.plane = new THREE.Mesh( new THREE.PlaneGeometry( 20, 20, 32 ), new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide,
        // depthTest: false,
        // depthWrite: false,
        transparent: true,
        opacity: 0.3} ) );
    this.plane.position.set(0, 0.1, 0);
    this.plane.visible = false;

    this.isDragging = false;
    this.previousMousePosition = new THREE.Vector2();

    this.dragControls = new THREE.DragControls( [this.plane], genome.renderSystem.camera, genome.renderSystem.renderer.domElement );
    // this.dragControls.addEventListener( 'dragstart', this.DragStart );
    // this.dragControls.addEventListener( 'dragend', this.DragEnd );

    this.DragStart = function (e) {
        controllerCamera.enableRotate = false;
    };

    this.DragEnd = function (e) {
        controllerCamera.enableRotate = true;
    };

    this.move = function (x, y, z) {
        object.translateX( x );
        object.translateY( y );
        object.translateZ( z );
    };
    this.rotate = function (x, y, z) {
        this.plane.rotateX(x);
        this.plane.rotateY(y);
        this.plane.rotateZ(z);
    };

    this.addEvents = function (htmlElement) {
        var slicer = this;
        var plane = this.plane;
        // var IsRotate = this.IsRotate;
        var previousMousePosition = this.previousMousePosition;
        var isDragging = this.isDragging;
        $(htmlElement)
            .on('mousedown', function(e) {
                slicer.actionDown(e);
            })
            .on('mousemove', function(e) {
                slicer.actionMove(e)
            })
            .on('mouseup', function(e) {
                // isDragging = false;
                // controllerCamera.enableRotate = true;
                slicer.actionUp();
            })
            .on('touchmove', function (e) {
                slicer.actionMove(e)
            })
            .on('touchstart', function (e) {
                slicer.actionDown(e);
            })
            .on('touchend', function (e) {
                slicer.actionUp();
            });
    };

    this.actionMove = function (e) {
        if(!this.plane.visible)
            return;

        var deltaMove = {
            x: e.pageX - this.previousMousePosition.x,
            y: e.pageY - this.previousMousePosition.y
        };

        this.previousMousePosition.x = e.pageX;
        this.previousMousePosition.y = e.pageY;
        if(this.isDragging && effectController.IsRotate) {

            var deltaRotationQuaternion = new THREE.Quaternion()
                .setFromEuler(new THREE.Euler(
                    toRadians(deltaMove.y * 1),
                    toRadians(deltaMove.x * 1),
                    0,
                    'XYZ'
                ));

            this.plane.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.plane.quaternion);
        }

        if(!genome.OneMeshBeads.material.uniforms.u_hasClipping.value)
            return;
        // console.log(previousMousePosition);

        this.previousMousePosition = {
            x: e.pageX,
            y: e.pageY
        };

        this.plane.updateMatrixWorld();
        this.plane.geometry.computeFaceNormals();
        this.plane.geometry.computeVertexNormals();
        var position = new THREE.Vector3();
        position.setFromMatrixPosition( this.plane.matrixWorld );
        var normalMatrix = new THREE.Matrix3().getNormalMatrix( this.plane.matrixWorld );
        var newNormal = this.plane.geometry.faces[0].normal.clone().applyMatrix3( normalMatrix ).normalize();
        genome.OneMeshBeads.material.uniforms.u_normalClipping.value = newNormal;
        genome.OneMeshBeads.material.uniforms.u_positionPoint.value = position;
        genome.Sphere.material.uniforms.u_normalClipping.value = newNormal;
        genome.Sphere.material.uniforms.u_positionPoint.value = position;
    };

    this.actionUp = function () {
        this.isDragging = false;
        controllerCamera.enableRotate = true;
    };
    
    this.actionDown = function (e) {
        this.previousMousePosition.x = ( e.pageX / window.innerWidth ) * 2 - 1;
        this.previousMousePosition.y = - ( e.pageY / window.innerHeight ) * 2 + 1;
        genome.rayCaster.setFromCamera( this.previousMousePosition, genome.renderSystem.camera );
        this.previousMousePosition.x = e.pageX;
        this.previousMousePosition.y = e.pageY;
        var intersects = genome.rayCaster.intersectObjects( [this.plane] );
        for ( var i = 0; i < intersects.length; i++ ) {
            if(intersects[ i ].object===this.plane){
                this.isDragging = true;
                controllerCamera.enableRotate = false;
            }
        }
    };

    this.checkPoint = function (point) {
        var position = new THREE.Vector3();
        position.setFromMatrixPosition( this.plane.matrixWorld );
        var normalMatrix = new THREE.Matrix3().getNormalMatrix( this.plane.matrixWorld );
        var newNormal = this.plane.geometry.faces[0].normal.clone().applyMatrix3( normalMatrix ).normalize();
        var vectorDirection = position.sub(point);
        var scalarMultiValue = newNormal.dot(vectorDirection);
        return scalarMultiValue >= 0.0;
    }


}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}