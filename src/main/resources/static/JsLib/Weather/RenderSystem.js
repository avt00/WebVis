/**
 * Created by user on 26.10.2016.
 */
getData('air');
var radius = 60;
var zoom = 4;
var container = document.getElementById('container');

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
renderer.setClearColor(0x000000);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);
renderer.domElement.style.zIndex = 1;

container.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera(  60, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.z = 100;
var controls = new THREE.OrbitControls( camera, container, container);
var scene = new THREE.Scene();
var stats = new Stats();
container.appendChild( stats.dom );


scene.add( new THREE.AmbientLight( 0x505050 ) );
// drawEarth();
window.addEventListener( 'resize', onWindowResize, false );

function getXYZ(lat, lon) {
    // lat+=90;
    // lon=180-lon;
    var Lat   = (lat)*(Math.PI/180);
    var Long  = (lon)*(Math.PI/180);

    var x = (Math.cos(Long) * Math.cos(Lat));
    var y = (Math.sin(Lat));
    var z = (Math.sin(Long) * Math.cos(Lat));

    return new THREE.Vector3(x,y,z);
}
var currentTimeIndex = 0;
var timer = 0;
var render = function () {
    if($('#updateMeshColor').is(":checked")){
        // updateMeshColor();
        if(timer>2){
            updateColorAnother(currentTimeIndex, lengthLan, lengthLon, values);
            if(currentTimeIndex >= time.length-1){
                currentTimeIndex=0;
            }
            currentTimeIndex++;
            timer=0;
        }
        timer++;
    }



    requestAnimationFrame( render );
    controls.update();
    stats.update();
    renderer.render( scene, camera );
};

function updateMeshColor() {
    if(particles!=null && particles.geometry!=null){
        for(var i = 0; i < colors.length; i++){
            colors[i] = Math.random();
        }
        particles.geometry.attributes.color.needsUpdate = true;
    }
}

function distance(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1));
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

render();

var particles, uniforms;
var PARTICLE_SIZE = 50;
var textureLoader = new THREE.TextureLoader();
var texturePoint = textureLoader.load("../content/disc.png");
var colors;
function drawPoints(listPoint, lenX, lenY, len2X, len2Y) {
    scene.remove(particles);
    if(!(lenX<lenY)){
        console.error("incorrect input data")
        return;
    }
    var countPoint = lenY - lenX + 1;
    var countPoint2 = len2Y - len2X + 1;
    var positions = new Float32Array( countPoint * countPoint2 * 3);
    colors = new Float32Array( countPoint * countPoint2 * 3 );
    var sizes = new Float32Array( countPoint * countPoint2 );
    var indices = new Uint32Array( 6*(countPoint-2)* (countPoint2-2));
    var normals = new Float32Array( countPoint * countPoint2 * 3);

    var vertex;
    var normal;
    var color = new THREE.Color();
    var geometry = new THREE.BufferGeometry();
    var count = 0;

    var vertices = [];
    for (var j = len2X; j < len2Y; j++) {
        for ( var i = lenX; i < lenY; i ++ ) {
            if ($('#drawCustomPoint').is(":checked"))
            {
                normal = getXYZ(1*i, 1*j);
                var coord = normal.clone();
                normal.toArray(normals, ((i - lenX)*countPoint2 + (j - len2X))*3);
                vertex =  coord.multiplyScalar(radius);
                vertex.toArray(positions, ((i - lenX)*countPoint2 + (j - len2X)) * 3);
                color.setHSL(1.0, 0.3, 0.7);
                color.toArray(colors, ((i - lenX)*countPoint2 + (j - len2X)) * 3);
                sizes[i+j*countPoint2] = PARTICLE_SIZE * 0.5;
                vertices.push(vertex);
            }
            if($('#drawFromFile').is(":checked")){
                normal = getXYZ(listPoint.latitudeArray[i][j], listPoint.longitudeArray[i][j]);
                // normal =  normal.multiplyScalar(-1);
                normal.toArray(normals, ((i - lenX)*countPoint2 + (j - len2X))*3);
                vertex =  normal.multiplyScalar(radius);
                vertex.toArray(positions, ((i - lenX)*countPoint2 + (j - len2X)) * 3);
                color.setHSL(listPoint.iceArray[0][i][j]/200, listPoint.iceArray[0][i][j]/200, listPoint.iceArray[0][i][j]/200);
                color.toArray(colors, ((i - lenX)*countPoint2 + (j - len2X)) * 3);
                sizes[i+j*countPoint2] = PARTICLE_SIZE * 0.5;
                vertices.push(vertex);
            }
        }
    }
    for ( var i = 0, l1 = countPoint-2; i < l1; i ++ ) {
        for (var j = 0, l2 = countPoint2-2; j < l2; j++) {
            var first = i*countPoint2+j;
            var second = first + countPoint2;
            indices[count++] = first;
            indices[count++] = second;
            indices[count++] = first + 1;
//
            indices[count++] = second;
            indices[count++] = second + 1;
            indices[count++] = first + 1;
        }
    }




    // console.log(positions);
    // console.log(colors);
    // console.log(indices);
//        console.log(sizes);
//        console.log(texturePoint);
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setDynamic( true ) );
//        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
//     geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geometry.setIndex(new THREE.BufferAttribute( indices, 1 ) );


//        var material = new THREE.ShaderMaterial( {
//            uniforms: {
//                color:   { value: new THREE.Color( 0xffffff ) },
//                texturAirport Boulevard, Los Angeles, CAe: { value: texturePoint },
//            },
//            vertexShader: document.getElementById( 'vertexshader' ).textContent,
//            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
//            alphaTest: 0.9,
//        } );

    if($('#drawPoint').is(":checked")) {
        material = new THREE.PointsMaterial( { size: 3, sizeAttenuation: false, map: texturePoint, alphaTest: 0.5, transparent: true } );
        material.color.setHSL( 1.0, 0.3, 0.7 );
        particles = new THREE.Points( geometry, material );
    }
    else {
        var material = new THREE.MeshBasicMaterial( {transparent: true, opacity: 0.5, side: THREE.FrontSide, vertexColors: THREE.FaceColors, wireframe: $('#wireFrame').is(":checked") } );
        particles = new THREE.Mesh( geometry, material );
    }


    scene.add( particles );
}

function updateColorAnother(timeIndex, latArrayLength, lonArrayLength, valueArray) {
    var color = new THREE.Color();
    console.log(timeIndex +" min: "+ min + " max:"+ max);
    for(var i = 0; i < latArrayLength; i++){
        for(var j = 0; j < lonArrayLength; j++){
            var value = valueArray[timeIndex][i][j];
            var indexForInsert = (i*lonArrayLength + j)*3;

            if(min > value)
                min=value;
            if(max < value)
                max =value;

            color.setHSL((1-(value-min)/(max-min))*240/360, 1, 0.5);
            color.toArray(colors, indexForInsert);
        }
    }
    particles.geometry.attributes.color.needsUpdate = true;
}
var min=0;
var max=0;
function drawPointsAnother(timeIndex, latArray, lonArray, valueArray, lonFrom, lonTo) {
    min= 500;
    max = 500;
    scene.remove(particles);
    var lengthLat = latArray.length;
    var lengthLon = lonArray.length;
    var countPoint = lengthLat * lengthLon;

    var positions = new Float32Array( countPoint * 3);
    colors = new Float32Array( countPoint * 3 );
    var indices = new Uint32Array( 6*(lengthLat-1)*(lengthLon-1));
    var normals = new Float32Array( countPoint * 3);
    var color = new THREE.Color();

    for(var i = 0; i < lengthLat; i++){
        for(var j = lonFrom; j < lonTo; j++){

            var lat = latArray[i];
            var lon = 180-lonArray[j];
            var value = valueArray[timeIndex][i][j];
            var indexForInsert = (i*(lonTo-lonFrom) + j)*3;


            var normal = getXYZ(lat, lon);

            if(min > value)
                min=value;
            if(max < value)
                max =value;
            var vertex =  normal.multiplyScalar(radius);
            normal.toArray(normals, indexForInsert);
            vertex.toArray(positions, indexForInsert);
            color.setHSL((1-(value-min)/(max-min))*240/360, 1, 0.5);
            color.toArray(colors, indexForInsert);
        }
    }
    var count = 0;
    for ( var i = 0; i < lengthLat-1; i++ ) {
        for (var j = 0; j < lengthLon; j++) {
            var first = i*lengthLon+j;
            var second = first + lengthLon;
            if(j==lengthLon-1){
                indices[count++] = first;
                indices[count++] = second;
                indices[count++] = first - lengthLon + 1;
//
                indices[count++] = second;
                indices[count++] = first + 1;
                indices[count++] = first - lengthLon + 1;
            }
            else{
                indices[count++] = first;
                indices[count++] = second;
                indices[count++] = first + 1;
//
                indices[count++] = second;
                indices[count++] = second + 1;
                indices[count++] = first + 1;
            }

        }
        if(i==lengthLat-1){

        }
    }
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setDynamic( true ) );
    geometry.setIndex(new THREE.BufferAttribute( indices, 1 ) );

    if ($('#drawCustomPoint').is(":checked"))
    {
        var material = new THREE.PointsMaterial( { size: 3, sizeAttenuation: false, map: texturePoint, alphaTest: 0.5, transparent: true } );
        material.color.setHSL( 1.0, 0.3, 0.7 );
        particles = new THREE.Points( geometry, material );
    }
    if($('#drawFromFile').is(":checked")){
        var material = new THREE.MeshBasicMaterial( {transparent: true, opacity: 0.5, side: THREE.FrontSide, vertexColors: THREE.FaceColors, wireframe: $('#wireFrame').is(":checked") } );
        particles = new THREE.Mesh( geometry, material );
    }

    scene.add( particles );
}


var jsonDataReceived;
function getData(filename) {
    if(filename==null)
        filename='test';
    $.ajax({
        dataType: 'json',
        url: '/getData/'+filename,
        success: function(jsondata){
            console.log("Data was received");
            jsonDataReceived = jsondata;
        }
    });
}

var lengthLan;
var lengthLon;
var values;
var time;
function drawData() {
    var length1X = parseInt($('#lenght1X').val());
    var length1Y = parseInt($('#lenght1Y').val());

    var length2X = parseInt($('#lenght2X').val());
    var length2Y = parseInt($('#lenght2Y').val());

    time = jsonDataReceived.time;
    var lat = jsonDataReceived.lat;
    var lon = jsonDataReceived.lon;
    values = jsonDataReceived.dataValue;
    lengthLan = lat.length;
    lengthLon = lon.length;
    drawPointsAnother(0, lat, lon, values, length1X, length1Y);
    // drawPoints(jsonDataReceived, length1X, length1Y, length2X, length2Y);
}

var earthMesh;
function drawEarth()
{
    scene.remove(earthMesh);
    var horizontal = Math.pow(2,zoom), vertical=Math.pow(2,zoom);
    var geometry   = new THREE.SphereGeometry(radius, horizontal, vertical);

    var materials = [];
    for(var j=0;j<vertical;j++)
        for(var i=0;i<horizontal;i++){
            THREE.ImageUtils.crossOrigin = '';
            var texture = THREE.ImageUtils.loadTexture("http://b.tile.openstreetmap.org/"+zoom+"/"+i+"/"+j+".png");
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set( horizontal, vertical );
            var material1 = new THREE.MeshBasicMaterial( { map:texture});
            materials.push(  material1);
            if(j==0)
                i++;
        }
    var l = geometry.faces.length / 2;
    for(var j=0;j<vertical;j++)
        for( var i = 0; i < horizontal; i ++ ) {
            var index=j*horizontal+i;

            var k = 2 * index;
            if(k>=2*l){
                break;
            }
            geometry.faces[ k ].materialIndex = index ;
            if(j!=0 && j!=vertical-1){
                geometry.faces[ k + 1 ].materialIndex =index ;
            }
        }
    earthMesh = new THREE.Mesh(geometry,new THREE.MeshFaceMaterial(materials));
    scene.add(earthMesh);
}

$('#getData').click(function () {
    var fileName = document.getElementById("textField").value;
    getData(fileName);
});
$('#drawButton').click(drawData);
