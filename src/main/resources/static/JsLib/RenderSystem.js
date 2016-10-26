/**
 * Created by user on 26.10.2016.
 */

var radius = 60;

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( 1024, 1024 );

document.getElementById('render').appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 1000 );
camera.position.z = 100;
var controls = new THREE.OrbitControls( camera, renderer.domElement, renderer.domElement);
var scene = new THREE.Scene();
var geometry = new THREE.SphereGeometry( radius, 24, 18 );

var texture = THREE.ImageUtils.loadTexture("../content/times.jpg");
texture.minFilter = THREE.LinearFilter;

var material = new THREE.MeshPhongMaterial({map: texture});
var sphere = new THREE.Mesh( geometry, material );
//    sphere.castShadow = true;
//    sphere.receiveShadow = false;
sphere.position.x = 0;
scene.add( sphere );


scene.add( new THREE.AmbientLight( 0x505050 ) );
//    var light = new THREE.SpotLight( 0xffffff, 0.5 );
//    light.position.set( -80, 125, 80 )
//    light.angle = Math.PI/2;
//    light.penumbra = 0.2;
//
//    light.castShadow = true;
//    light.shadowDarkness = 0.5;
//    light.shadowCameraRight     =  5;
//    light.shadowCameraLeft     = -5;
//    light.shadowCameraTop      =  5;
//    light.shadowCameraBottom   = -5;
//    light.shadowCameraVisible = true;
//
//    scene.add(light);

function getXYZ(lat, lon) {
    var phi   = (90-lat)*(Math.PI/180),
        theta = (lon+180)*(Math.PI/180),
        x = (Math.sin(phi)*Math.cos(theta)),
        z = (Math.sin(phi)*Math.sin(theta)),
        y = (Math.cos(phi));

    return new THREE.Vector3(x,y,z);
}

var render = function () {
    requestAnimationFrame( render );
    controls.update();
    renderer.render( scene, camera );
};

render();

var particles, uniforms;
var PARTICLE_SIZE = 50;
var texturePoint = THREE.ImageUtils.loadTexture("../content/disc.png");
function drawPoints(listPoint, lenX, lenY, len2X, len2Y) {
    scene.remove(particles);
    if(!(lenX<lenY)){
        console.error("incorrect input data")
        return;
    }
    var countPoint = lenY - lenX;
    var countPoint2 = len2Y - len2X;
    var positions = new Float32Array( countPoint * countPoint2 * 3);
    var colors = new Float32Array( countPoint * countPoint2 * 3 );
    var sizes = new Float32Array( countPoint * countPoint2 );
    var indices = new Uint16Array( 6*(countPoint-1)* (countPoint2-1));
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
                vertex =  coord.multiplyScalar(radius+5);
                vertex.toArray(positions, ((i - lenX)*countPoint2 + (j - len2X)) * 3);
                color.setHSL(1.0, 0.3, 0.7);
                color.toArray(colors, ((i - lenX)*countPoint2 + (j - len2X)) * 3);
                sizes[i+j*countPoint2] = PARTICLE_SIZE * 0.5;
                vertices.push(vertex);
            }
            if($('#drawFromFile').is(":checked")){
                normal = getXYZ(listPoint.latitudeArray[i][j], listPoint.longitudeArray[i][j]);
                normal.multiplyScalar(-1);
                normal.toArray(normals, ((i - lenX)*countPoint2 + (j - len2X))*3);
                vertex =  normal.multiplyScalar(radius+5);
                vertex.toArray(positions, ((i - lenX)*countPoint2 + (j - len2X)) * 3);
                color.setHSL((j+i)%10/10, (j+i)%10/10, (j+i)%10/10);
                color.toArray(colors, ((i - lenX)*countPoint2 + (j - len2X)) * 3);
                sizes[i+j*countPoint2] = PARTICLE_SIZE * 0.5;
                vertices.push(vertex);
            }
        }
    }
    for ( var i = 0, l1 = countPoint - 1; i < l1; i ++ ) {
        for (var j = 0, l2 = countPoint2-1; j < l2; j++) {
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




    console.log(positions);
    console.log(colors);
    console.log(indices);
//        console.log(sizes);
//        console.log(texturePoint);
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
//        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
    geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geometry.setIndex(new THREE.BufferAttribute( indices, 1 ) );


//        var material = new THREE.ShaderMaterial( {
//            uniforms: {
//                color:   { value: new THREE.Color( 0xffffff ) },
//                texture: { value: texturePoint },
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
        var holes = [];
//            var triangles = THREE.Shape.Utils.triangulateShape( vertices, holes );
//            for( var i = 0; i < triangles.length; i++ ){
//                geometry.faces.push( new THREE.Face3( triangles[i][0], triangles[i][1], triangles[i][2] ));
//            }

        var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, wireframe: $('#wireFrame').is(":checked") } );
        particles = new THREE.Mesh( geometry, material );
    }


    scene.add( particles );
}

var jsonDataReceived;
function getData() {
    $.ajax({
        dataType: 'json',
        url: '/getData/test',
        success: function(jsondata){
            console.log("Data was received");
            jsonDataReceived = jsondata;
//                console.log(jsondata);
//                drawPoints(jsondata);
        }
    });
}

function drawData() {
    var length1X = parseInt($('#lenght1X').val());
    var length1Y = parseInt($('#lenght1Y').val());

    var length2X = parseInt($('#lenght2X').val());
    var length2Y = parseInt($('#lenght2Y').val());
    drawPoints(jsonDataReceived, length1X, length1Y, length2X, length2Y);
}

$('#getData').click(getData);
$('#drawButton').click(drawData);
