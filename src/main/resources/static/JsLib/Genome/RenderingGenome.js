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

function init(state) {

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1500 );
    camera.position.z = 50;
    scene = new THREE.Scene();
    cssScene = new THREE.Scene();

    selectedBead =  new THREE.Mesh( new THREE.SphereBufferGeometry( 1, 20, 20 ), new THREE.MeshBasicMaterial( { color: new THREE.Color( 0xff0000 ) } ) );
    if(state!=null){
        if(state.camera != null){
            var cameraObject = loader.parse( jsonState.camera );

            camera.copy( cameraObject );
            // camera.aspect = this.DEFAULT_CAMERA.aspect;
            camera.updateProjectionMatrix();
        }
        if(state.pointInfo){
            selectedCssObject = createCssObject(state.pointInfo, state.pointInfo, camera.position);
            cssScene.add(selectedCssObject);
            selectedBead.position.set(state.pointInfo.x, state.pointInfo.y, state.pointInfo.z);
            selectedBead.scale.set(state.pointInfo.r +0.01, state.pointInfo.r +0.01, state.pointInfo.r+0.01 );
        }
    }


    controls = new THREE.OrbitControls( camera, container, container);


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


    window.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'mouseup', onDocumentMouseUp, false );
    window.addEventListener( 'mousedown', onDocumentMouseDown, false );
    // window.addEventListener( 'click', onClick, false );

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    textureLoader = new THREE.TextureLoader();


    renderer.domElement.addEventListener('click', function(e) {
        if (e.target !== this)
            return;
        PopUpHide();
        onClick(e);
    });

    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );

    scene.add(selectedBead);
}
var isMouseDrag = false;
var isMouseDown = false;
function onDocumentMouseMove() {
    if(isMouseDown){
        isMouseDrag = true;
    }
}

function onDocumentMouseUp() {
    isMouseDown = false;
    isMouseDrag = false;
}
function onDocumentMouseDown() {
    isMouseDown = true;
}

function createGlRenderer() {
    var glRenderer = new THREE.WebGLRenderer( { antialias:true, alpha:true} );
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

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    renderer.setSize( window.innerWidth, window.innerHeight );
    cssRenderer.setSize( window.innerWidth, window.innerHeight );
}
var selectedCssObject;
function onClick(event) {
    if(isMouseDrag)
        return;
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    var minDistToCamera = 1000;
    var pointInfo = null;
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
                    pointInfo = mapPoints[key1].points[i];
                }
            }
        }
        if(minDistToCamera < 1000){
            currentPointInfo = pointInfo;
            selectedBead.position.set(currentPointInfo.x, currentPointInfo.y, currentPointInfo.z);
            selectedBead.scale.set(currentPointInfo.r+0.01, currentPointInfo.r+0.01, currentPointInfo.r+0.01);
            console.log(currentPointInfo);

            cssScene.remove(selectedCssObject);
            selectedCssObject = createCssObject(pointInfo, camera.position);
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
var currentPointInfo;
function initAll(allObject) {
    scene.remove(group);
    mapBeads = {};
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
    scene.add(group);
}


