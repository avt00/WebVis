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
initGUI();

var genome = new Genome();
genome.init(true);
genome.initState(jsonState);
container.appendChild(genome.renderSystem.cssRender.domElement);
genome.renderSystem.cssRender.domElement.appendChild(genome.renderSystem.renderer.domElement);
// init(jsonState);
if(effectController.fileName){
    onChangeFileName(effectController.fileName);
}

animate();
function animate() {
    requestAnimationFrame( animate );
    stats.update();
    for(var i = 0; i<genome.renderSystem.cssScene.children.length; i++){
        genome.renderSystem.cssScene.children[i].lookAt(genome.renderSystem.camera.position);
    }
    genome.renderSystem.render();
}

var controllerCamera = new THREE.OrbitControls( genome.renderSystem.camera, container, container);

// events
window.addEventListener( 'resize', function () {
    genome.renderSystem.onWindowResize();
}, false );

window.addEventListener( 'click', function (event) {
    if(!mouseDrag)
        genome.onClick(event);
    mouseDown=false;
}, false );

var mouseDrag = false;
var mouseDown = false;
var countMouseMoveEvent = 0;
document.addEventListener( 'mousemove', function (event) {
    if(mouseDown){
        countMouseMoveEvent++;
        if(countMouseMoveEvent>2) {
            mouseDrag = true;
        }
    }
    else {
        mouseDrag = false;
    }

}, false );
document.addEventListener( 'mousedown', function (event) {
    mouseDown = true;
}, false );

document.addEventListener( 'mouseup', function (event) {
    mouseDown = false;
    countMouseMoveEvent = 0;
}, false );