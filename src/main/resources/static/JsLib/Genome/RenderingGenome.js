/**
 * Created by user on 10.01.2017.
 */

var group;
var camera,
    scene, cssScene,
    renderer, cssRenderer;
var container, controls, stats;
var positions,  colorsPoints, alphaPoint, particleSize, particlePositions;
var linesMesh, colorsLine;
var mapMesh = {};
var maxParticleCount;
var raycaster, mouse;
var textureLoader;

function init() {

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1500 );
    camera.position.z = 50;

    controls = new THREE.OrbitControls( camera, container, container);

    scene = new THREE.Scene();
    cssScene = new THREE.Scene();
    // group = new THREE.Group();
    // scene.add( group );

    renderer = createGlRenderer();
    cssRenderer = createCssRenderer();

    container.appendChild(cssRenderer.domElement);
    cssRenderer.domElement.appendChild(renderer.domElement);
    // container.appendChild( renderer.domElement );

    stats = new Stats();
    container.appendChild( stats.dom );

    window.addEventListener( 'resize', onWindowResize, false );
    // window.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'click', onClick, false );

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    textureLoader = new THREE.TextureLoader();
}

function createGlRenderer() {
    var glRenderer = new THREE.WebGLRenderer( { alpha:true} );
    glRenderer.setClearColor(0x000000);
    glRenderer.setPixelRatio(window.devicePixelRatio);
    glRenderer.setSize(window.innerWidth, window.innerHeight);
    // glRenderer.domElement.style.position = 'absolute';
    glRenderer.domElement.style.zIndex = 1;
    // glRenderer.domElement.style.top = 0;
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
// function onDocumentMouseMove( event ) {
//     event.preventDefault();
//     mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//     mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
// }

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    renderer.setSize( window.innerWidth, window.innerHeight );
    cssRenderer.setSize( window.innerWidth, window.innerHeight );
}
var selectedCssObject;
function onClick(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    var minDistToCamera = 1000;
    var key = null;
    var positionSelected;
    if(group.children.length > 0) {
        raycaster.setFromCamera(mouse, camera);
        for (var key1 in mapPoints){
            if(mapBeads[key1].visible == false)
                continue;
            for(var i = 0; i < mapPoints[key1].points.length; i++){
                var point = new THREE.Vector3(mapPoints[key1].points[i].x, mapPoints[key1].points[i].y, mapPoints[key1].points[i].z);
                var distance = raycaster.ray.distanceToPoint(point);
                // raycaster.inter
                var distanceToCamera = raycaster.ray.origin.distanceTo(point);
                if(distance<0.07 && minDistToCamera > distanceToCamera){
                    minDistToCamera = distanceToCamera;
                    key = mapPoints[key1].points[i].id;
                    positionSelected = point;
                }
            }
        }
        if(minDistToCamera < 1000){
            selectedBead.position.set(positionSelected.x, positionSelected.y, positionSelected.z);
            console.log(key);
            console.log(positionSelected);
            cssScene.remove(selectedCssObject);
            selectedCssObject = createCssObject(key, positionSelected, camera.position);
            cssScene.add(selectedCssObject);
            // createPopup(key, event);
            // redirectToBead(key);
            // scene.updateMatrix();
            // mapBeads[key].visible = false;
        }

    }
}

function animate() {
    requestAnimationFrame( animate );
    stats.update();
    for(var i = 0; i<cssScene.children.length; i++){
        cssScene.children[i].lookAt(camera.position);
    }
    render();
}

function render() {
    renderer.render( scene, camera );
    cssRenderer.render(cssScene, camera);
}

var mapBeads = {};
var mapPoints = {};
var selectedBead;
function initAll(allObject) {
    var indexColor = 0;
    mapPoints = allObject;
    group = new THREE.Group();
    for (var key1 in allObject) {
        var part = getMeshPointsSeparate(allObject[key1], palette[indexColor]);
        var spline = getMeshSpline(allObject[key1], palette[indexColor]);

        group.add(part);
        group.add(spline);

        mapBeads[key1] = part;
        indexColor++;
    }

    selectedBead =  new THREE.Mesh( new THREE.SphereBufferGeometry( 0.2, 20, 20 ), new THREE.MeshBasicMaterial( { color: new THREE.Color( 0xff0000 ) } ) );
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );
    scene.add(group);
    scene.add(selectedBead);
}


