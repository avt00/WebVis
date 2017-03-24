/**
 * Created by user on 13.02.2017.
 */

function getMeshSpline(obj, color) {

    var points = obj.points;
    var vertices = points.map(function(point) {
        return  new THREE.Vector3(point.x, point.y, point.z);
    });


    var sampleClosedSpline = new THREE.CatmullRomCurve3(vertices);
    var splinePoints = sampleClosedSpline.getPoints(vertices.length);
    var spline = new THREE.CatmullRomCurve3(splinePoints.map(function (point) {
        return  new THREE.Vector3(point.x, point.y, point.z);
    }));

    var countSegment = 3;
    var segmenets = spline.points.length;
    var widthTube = 0.01;
    var tube = new THREE.TubeBufferGeometry( spline, segmenets, widthTube, countSegment, false );

    var tubeMesh = THREE.SceneUtils.createMultiMaterialObject( tube, [
        new THREE.MeshBasicMaterial( {
            color: color,
            transparent: true,
        } ) ]  );

    // var line = new THREE.Line(buffergeometry, shaderMaterial);
    return tubeMesh;
}

function drawSimpleLine(p1, p2) {
    var material = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
        p1,
        p2
    );
    geometry.dynamic = true;
    var line = new THREE.Line( geometry, material );
    return line;
}

function updatePositionLine(line, p1, p2){
    line.geometry.vertices[ 0 ].x=p1.x;
    line.geometry.vertices[ 0 ].y=p1.y;
    line.geometry.vertices[ 0 ].z=p1.z;

    line.geometry.vertices[ 1 ].x=p2.x;
    line.geometry.vertices[ 1 ].y=p2.y;
    line.geometry.vertices[ 1 ].z=p2.z;

    line.geometry.verticesNeedUpdate = true;
}


// var spline = new THREE.CatmullRomCurve3(points.map(function(point) {
//     return  new THREE.Vector3(point.x, point.y, point.z);
// }));
// var splinePoints = spline.getPoints(points.length*5);
//
// var vertices =[];
// var buffergeometry = new THREE.BufferGeometry();
// // 1. position
// for(var i = 0; i < splinePoints.length; i++){
//     vertices.push(splinePoints[i]);
// }
// var position = new THREE.Float32BufferAttribute( vertices.length * 3, 3 ).copyVector3sArray( vertices );
// buffergeometry.addAttribute( 'position', position );
// // 2. color
// var customColor = new THREE.Float32BufferAttribute( vertices.length * 3, 3 );
// buffergeometry.addAttribute( 'customColor', customColor );
//
// for( var i = 0, l = customColor.count; i < l; i ++ ) {
//     color.toArray( customColor.array, i * customColor.itemSize );
// }
//
// var uniforms = {
//     amplitude: { value: 5.0 },
//     opacity:   { value: 1 },
//     color:     { value: new THREE.Color( 0xffffff ) }
// };
// var shaderMaterial = new THREE.ShaderMaterial( {
//     uniforms:       uniforms,
//     vertexShader:   document.getElementById( 'vertexShaderLine' ).textContent,
//     fragmentShader: document.getElementById( 'fragmentShaderLine' ).textContent,
//     // blending:       THREE.AdditiveBlending,
//     depthTest:      true,
//     transparent:    true
// });