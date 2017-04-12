/**
 * Created by user on 10.01.2017.
 */
var state = getParameterByName('state');
var jsonState = null;
if(state!=null) {
    var loader = new THREE.ObjectLoader()
    jsonState = getRequest('/getState/' + state);
    if(jsonState!=null)
        jsonState = JSON.parse(jsonState.file);
    console.log(jsonState);
}
effectController.fileNameList =  getRequest('/getFiles');

effectController.fileName = effectController.fileNameList[0];
if(jsonState!=null && jsonState.filename!=null){
    effectController.fileName = jsonState.filename;
}

var stats = new Stats();
var container = document.getElementById( 'container' );
container.appendChild(stats.domElement);
initGUI();

var genome = new Genome();
genome.init(true);
container.appendChild(genome.renderSystem.cssRender.domElement);
genome.renderSystem.cssRender.domElement.appendChild(genome.renderSystem.renderer.domElement);

// init(jsonState);
if(effectController.fileName){
    onChangeFileName(effectController.fileName, jsonState);
}
var controllerCamera = new THREE.OrbitControls( genome.renderSystem.camera, container, container);
animate();
genome.initState(jsonState);

function animate() {
    requestAnimationFrame( animate );
    stats.update();
    for(var i = 0; i<genome.renderSystem.cssScene.children.length; i++){
        genome.renderSystem.cssScene.children[i].lookAt(genome.renderSystem.camera.position);
    }

    genome.renderSystem.camera.updateMatrixWorld(true);
    genome.moveHtmlBlock(genome.SelectedBeadInfo);
    genome.moveHtmlBlock(genome.SelectedLockBeadInfo);
    genome.renderSystem.render();
}



// events
window.addEventListener( 'resize', function () {
    genome.renderSystem.onWindowResize();
}, false );

genome.renderSystem.renderer.domElement.addEventListener( 'click', function (event) {
    if(!mouseDrag)
        genome.onClick(event);
    mouseDown=false;
}, false );

var mouseDrag = false;
var mouseDown = false;
var countMouseMoveEvent = 0;
var mousePos;
document.addEventListener( 'mousemove', function (event) {
    moveEventMouserOrTouch(event);
}, false );

document.addEventListener( 'mousedown', function (event) {
    startEventMouserOrTouch();
}, false );

document.addEventListener( 'mouseup', function (event) {
    endEventMouserOrTouch();
}, false );

document.addEventListener( 'touchmove', function (event) {
    moveEventMouserOrTouch(event);
}, false );

document.addEventListener( 'touchstart', function (event) {
    startEventMouserOrTouch();
}, false );

document.addEventListener( 'touchend', function (event) {
    endEventMouserOrTouch();
}, false );



function startEventMouserOrTouch() {
    mouseDown = true;
}

function endEventMouserOrTouch() {
    mouseDown = false;
    countMouseMoveEvent = 0;
}

function moveEventMouserOrTouch(event) {
    mousePos = new THREE.Vector2(event.x, event.y);
    if(mouseDown){
        countMouseMoveEvent++;
        if(countMouseMoveEvent>2) {
            mouseDrag = true;
        }
    }
    else {
        mouseDrag = false;
    }
}

