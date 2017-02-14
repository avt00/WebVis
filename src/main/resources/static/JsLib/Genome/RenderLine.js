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