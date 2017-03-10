var radius = 60;
var zoom = 4;
var container = document.getElementById('container');
var renderSystem = new RenderSystem();
container.appendChild(renderSystem.renderer.domElement);
// tiles
if(0==1){
    var earth = new Planet(radius, zoom, "http://b.tile.openstreetmap.org");
    renderSystem.addMeshToScene(earth.getMesh());
}
// camera
renderSystem.camera = new THREE.PerspectiveCamera(  60, window.innerWidth / window.innerHeight, 1, 1000 );
renderSystem.camera.position.z = 100;
var controls = new THREE.OrbitControls( renderSystem.camera, container, container);
// window with stat
var stats = new Stats();
container.appendChild( stats.dom );
renderSystem.addMeshToScene( new THREE.AmbientLight( 0x505050 ) );

var raycaster = new THREE.Raycaster();

window.addEventListener( 'resize', function () {
    renderSystem.onWindowResize();
}, false );

// non standart
var jsonData;
getData('air');

$('#getData').click(function () {
    var fileName = document.getElementById("textField").value;
    getData(fileName);
});
$('#drawButton').click(function () {
    drawData(jsonData);
});

var time;
var heatMap;
function drawData(jsonData) {
    var length1X = parseInt($('#lenght1X').val());
    var length1Y = parseInt($('#lenght1Y').val());

    var length2X = parseInt($('#lenght2X').val());
    var length2Y = parseInt($('#lenght2Y').val());

    time= jsonData.time;
    var lat = jsonData.lat;
    var lon = jsonData.lon;
    var values = jsonData.dataValue;

    heatMap = new HeatMapEarth(time, lat, lon, values, radius+10);
    renderSystem.addMeshToScene(heatMap.getLayer());
    // drawPointsAnother(0, lat, lon, values, length1X, length1Y);
    // drawPoints(jsonDataReceived, length1X, length1Y, length2X, length2Y);
}

var currentTimeIndex = 0;
var timer = 0;
var render = function () {
    if($('#updateMeshColor').is(":checked")){
        // updateMeshColor();
        if(timer>10){
            heatMap.updateColor(currentTimeIndex);
            if(currentTimeIndex >= time.length-1){
                currentTimeIndex=0;
            }
            currentTimeIndex++;
            timer=0;
        }
        timer++;
    }
    requestAnimationFrame( render );
    renderSystem.update();
    controls.update();
    stats.update();
};
render();

function getData(filename) {
    if(filename==null)
        filename='test';
    $.ajax({
        dataType: 'json',
        url: '/getData/'+filename,
        success: function(jsondata){
            console.log("Data was received");
            jsonData = jsondata;
        }
    });
}

function onClick(event) {
    var mouse = new THREE.Vector2();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(mouse, renderSystem.camera);
    var intersects = raycaster.intersectObject( heatMap.mesh );
    if ( intersects.length > 0 ) {
        var intersect = intersects[0];
        var face = intersect.face;
        var latIndex = Math.floor(face.a / heatMap.longitudeArray.length);
        var longIndex = face.a % heatMap.longitudeArray.length;
        console.log(latIndex+" : "+longIndex);
        var trace = {
            x: [],
            y: [],
            mode: 'lines',
            name: 'spline',
            line: {shape: 'spline', width: 0.5},
            type: 'scatter'
        };
        var layout = {
            legend: {
                y: 0.5,
                traceorder: 'reversed',
                font: {size: 16},
                yref: 'paper'
            }};
        for(var i = 0; i<heatMap.timeArray.length; i++){
            trace.y.push(heatMap.values[i][latIndex][longIndex]);
            trace.x.push(heatMap.timeArray[i]);
        }
        var plot = new PlotConroller([trace],layout, document.getElementById('plot'));
        plot.draw();
    }
}

renderSystem.renderer.domElement.addEventListener('click', function(e) {
    if (e.target !== this)
        return;
    onClick(e);
});