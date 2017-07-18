/**
 * Created by user on 27.10.2016.
 */
function RenderSystem (){

    this.renderer = createGlRenderer();

    this.cssRender = null;
    this.cssScene = null;

    this.scene = new THREE.Scene();
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    this.scene.add( directionalLight );
    this.scene.add( new THREE.AmbientLight( 0x555555 ) );

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
        if(this.cssRender!=null)
            this.cssRender.setSize( window.innerWidth, window.innerHeight );
    };

    this.update = function () {
        // this.camera.update();
        this.renderer.render( this.scene, this.camera );
        // this.controls.update();
    };

    this.initCssRender = function () {
        this.cssRender = createCssRenderer();
        this.cssScene = new THREE.Scene();
    };

    this.render = function () {
        this.renderer.render( this.scene, this.camera );
        if(this.cssRender!=null)
            this.cssRender.render(this.cssScene, this.camera);
    }
}

function createGlRenderer() {
    var glRenderer = new THREE.WebGLRenderer( { antialias:true, alpha:true, preserveDrawingBuffer: true} );
    glRenderer.setClearColor(0x000000);
    glRenderer.setPixelRatio(window.devicePixelRatio);
    glRenderer.setSize(window.innerWidth, window.innerHeight);
    return glRenderer;
}

function createCssRenderer() {
    var cssRenderer = new THREE.CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    // cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.zIndex = 0;
    // cssRenderer.domElement.style.top = 0;
    return cssRenderer;
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
