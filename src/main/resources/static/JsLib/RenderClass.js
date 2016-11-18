/**
 * Created by user on 27.10.2016.
 */
function RenderSystem (domElement){

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    domElement.appendChild( this.renderer.domElement );

    this.scene = new THREE.Scene();
    this.scene.add( new THREE.AmbientLight( 0x505050 ) );

    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.z = 100;

    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement, this.renderer.domElement);


    this.addElementToScene = function(geometry, material) {
        var mesh = new THREE.Mesh( geometry, material );
        this.scene.add( mesh );
    };

    this.addMeshToScene = function(mesh) {
        this.scene.add( mesh );
    };
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

function getXYZ(lat, lon) {
    var phi   = (90-lat)*(Math.PI/180),
        theta = (lon+180)*(Math.PI/180),
        x = (Math.sin(phi)*Math.cos(theta)),
        z = (Math.sin(phi)*Math.sin(theta)),
        y = (Math.cos(phi));

    return new THREE.Vector3(x,y,z);
}