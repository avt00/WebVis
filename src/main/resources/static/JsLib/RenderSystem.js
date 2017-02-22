/**
 * Created by user on 26.10.2016.
 */

var radius = 60;
var zoom = 4;

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
renderer.setPixelRatio( window.devicePixelRatio );
this.renderer.setSize( window.innerWidth, window.innerHeight );

document.getElementById('render').appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 1000 );
camera.position.z = 100;
var controls = new THREE.OrbitControls( camera, renderer.domElement, renderer.domElement);
var scene = new THREE.Scene();


scene.add( new THREE.AmbientLight( 0x505050 ) );
drawEarth();
window.addEventListener( 'resize', onWindowResize, false );

function getXYZ(lat, lon) {
    var Lat   = (lat)*(Math.PI/180);
    var Long  = (lon)*(Math.PI/180);

    var x = (Math.cos(Lat)*Math.cos(Long));
    var y = (Math.sin(Lat));
    var z = (Math.cos(Lat)*Math.sin(Long));

    return new THREE.Vector3(x,y,z);
}

var render = function () {
    requestAnimationFrame( render );
    controls.update();
    renderer.render( scene, camera );
};

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
function drawPoints(listPoint, lenX, lenY, len2X, len2Y) {
    scene.remove(particles);
    if(!(lenX<lenY)){
        console.error("incorrect input data")
        return;
    }
    var countPoint = lenY - lenX + 1;
    var countPoint2 = len2Y - len2X + 1;
    var positions = new Float32Array( countPoint * countPoint2 * 3);
    var colors = new Float32Array( countPoint * countPoint2 * 3 );
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




    // console.log(positions);
    // console.log(colors);
    // console.log(indices);
//        console.log(sizes);
//        console.log(texturePoint);
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
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
        var material = new THREE.MeshBasicMaterial( {transparent: true, opacity: 0.5, side: THREE.BackSide, vertexColors: THREE.FaceColors, wireframe: $('#wireFrame').is(":checked") } );
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

$('#getData').click(getData);
$('#drawButton').click(drawData);
