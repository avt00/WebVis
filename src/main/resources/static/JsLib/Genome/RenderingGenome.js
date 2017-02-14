/**
 * Created by user on 10.01.2017.
 */

var group;
var camera, scene, renderer;
var container, controls, stats;
var positions,  colorsPoints, alphaPoint, particleSize, particlePositions;
var linesMesh, colorsLine;
var mapMesh = {};
var maxParticleCount;
var raycaster, mouse;

function init() {

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1500 );
    camera.position.z = 50;

    controls = new THREE.OrbitControls( camera, container, container);

    scene = new THREE.Scene();
    group = new THREE.Group();
    scene.add( group );

    renderer = new THREE.WebGLRenderer( { antialias: true} );
    // renderer.setClearColor( 0xa0a0a0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.sortObjects = false;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    // renderer.shadowMap.enabled = true;

    container.appendChild( renderer.domElement );

    stats = new Stats();
    container.appendChild( stats.dom );

    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
}


function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    stats.update();

    if(visibleModel!=null){
        raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObject( visibleModel );
        if(intersects.length > 0 )
            console.log(intersects[0]);
    }

    render();
}

function render() {
    renderer.render( scene, camera );
}

var mapBeads = {};

function initAll(allObject) {
    var indexColor = 0;
    var group = new THREE.Object3D();
    for (var key1 in allObject) {
        var part = getMeshPointsSeparate(allObject[key1], palette[indexColor]);
        var spline = getMeshSpline(allObject[key1], palette[indexColor]);

        group.add(part);
        group.add(spline);

        mapBeads[key1] = part;


        // group.add(spline);



        indexColor++;
    }

    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 0, 1 );
    scene.add( light );
    // var geometry = new THREE.SphereGeometry( 1, 32, 32 );
    // var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    // var sphere = new THREE.Mesh( geometry, material );
    // scene.add( sphere );
    // sphere.position.x = 3;
    // var geometry2 = new THREE.SphereGeometry( 2, 32, 32 );
    // var material2 = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    // var sphere2 = new THREE.Mesh( geometry2, material2 );
    // sphere2.position.x = -3;
    // scene.add( sphere2 );

    scene.add(group);
}


