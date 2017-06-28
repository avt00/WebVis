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
        var plane = this.plane;
        // var IsRotate = this.IsRotate;
        var previousMousePosition = this.previousMousePosition;
        var isDragging = this.isDragging;
        $(htmlElement).on('mousedown', function(e) {
            previousMousePosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            previousMousePosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            genome.rayCaster.setFromCamera( previousMousePosition, genome.renderSystem.camera );
            previousMousePosition.x = e.offsetX;
            previousMousePosition.y = e.offsetY;
            var intersects = genome.rayCaster.intersectObjects( [plane] );
            for ( var i = 0; i < intersects.length; i++ ) {
                if(intersects[ i ].object===plane){
                    isDragging = true;
                    controllerCamera.enableRotate = false;
                }
            }
        })
            .on('mousemove', function(e) {

                if(!plane.visible)
                    return;

                var deltaMove = {
                    x: e.offsetX-previousMousePosition.x,
                    y: e.offsetY-previousMousePosition.y
                };

                previousMousePosition.x = e.offsetX;
                previousMousePosition.y = e.offsetY;
                if(isDragging && effectController.IsRotate) {

                    var deltaRotationQuaternion = new THREE.Quaternion()
                        .setFromEuler(new THREE.Euler(
                            toRadians(deltaMove.y * 1),
                            toRadians(deltaMove.x * 1),
                            0,
                            'XYZ'
                        ));

                    plane.quaternion.multiplyQuaternions(deltaRotationQuaternion, plane.quaternion);
                }

                if(!genome.OneMeshBeads.material.uniforms.u_hasClipping.value)
                    return;
                // console.log(previousMousePosition);

                previousMousePosition = {
                    x: e.offsetX,
                    y: e.offsetY
                };

                plane.updateMatrixWorld();
                plane.geometry.computeFaceNormals();
                plane.geometry.computeVertexNormals();
                var position = new THREE.Vector3();
                position.setFromMatrixPosition( plane.matrixWorld );
                var normalMatrix = new THREE.Matrix3().getNormalMatrix( plane.matrixWorld );
                var newNormal = plane.geometry.faces[0].normal.clone().applyMatrix3( normalMatrix ).normalize();
                // console.log(newNormal);
                // console.log(plane.geometry.center());
                genome.OneMeshBeads.material.uniforms.u_normalClipping.value = newNormal;
                genome.OneMeshBeads.material.uniforms.u_positionPoint.value = position;
                // console.log(position);
            })
            .on('mouseup', function(e) {
                isDragging = false;
                controllerCamera.enableRotate = true;

            });
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