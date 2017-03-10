/**
 * Created by user on 27.10.2016.
 */
function RenderSystem (){

    this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true} );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.scene = new THREE.Scene();
    this.scene.add( new THREE.AmbientLight( 0x505050 ) );

    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.z = 100;


    this.addElementToScene = function(geometry, material) {
        var mesh = new THREE.Mesh( geometry, material );
        this.scene.add( mesh );
    };

    this.addMeshToScene = function(mesh) {
        this.scene.add( mesh );
    };

    this.onWindowResize = function(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    };
    
    this.update = function () {
        // this.camera.update();
        this.renderer.render( this.scene, this.camera );
        // this.controls.update();
    }
}


function createSphere(radius) {
    var geometry = new THREE.SphereGeometry( radius, 24, 18 );
    texture.minFilter = THREE.LinearFilter;
    var material = new THREE.MeshPhongMaterial({map: texture});
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = 0;
    return sphere;
}


function drawPoints(radius) {
    var geometry = new THREE.Geometry();
    for (var j = 0; j < 100; j++) {
        for (var i = 0; i < 100; i++) {
            var point = getXYZ(j, i);
            geometry.vertices.push( point.multiplyScalar(radius+4));
        }
    }
    var material = new THREE.PointsMaterial( { size: 3, sizeAttenuation: false, map: texturePoint, alphaTest: 0.5, transparent: true } );
    material.color.setHSL( 1.0, 0.3, 0.7 );
    var particles = new THREE.Points( geometry, material );
    return particles;
}
