/**
 * Created by user on 16.01.2017.
 */
function getMeshPoints(listChains, pallete) {
    var countAllPoint = 0 ;
    for(var key in listChains){
        countAllPoint += listChains[key].points.length;
    }


    var basicGeometrySphere = new THREE.SphereBufferGeometry( 1, 20, 20 );
    var geometry = new THREE.InstancedBufferGeometry();
    // per mesh data
    // 1. position
    var vertices = basicGeometrySphere.getAttribute("position");
    geometry.addAttribute( 'position', vertices );
    // 2. UV
    var uvs = basicGeometrySphere.getAttribute("uv");
    geometry.addAttribute( 'uv', uvs );
    // 3. index
    var indices = basicGeometrySphere.getIndex();
    geometry.setIndex( indices );

    // 4. normal
    var normals = basicGeometrySphere.getAttribute("normal");
    geometry.addAttribute("normal", normals );
    // 5. offset
    var offsets = new THREE.InstancedBufferAttribute( new Float32Array( countAllPoint * 3 ), 3, 1 );
    // 6. color
    var colors = new THREE.InstancedBufferAttribute( new Float32Array( countAllPoint * 3 ), 3, 1 );
    // 7. radius
    var scaleValues =  new THREE.InstancedBufferAttribute( new Float32Array( countAllPoint*3 ), 3, 1 );
    var currentIndex = 0;
    var colorId = 0;
    for(var key in listChains){
        var points = listChains[key].points;
        for ( var i = 0, ul = points.length; i < ul; i++ ) {
            offsets.setXYZ( currentIndex + i, points[i].x, points[i].y, points[i].z);
            colors.setXYZ ( currentIndex + i, pallete[colorId].r, pallete[colorId].g, pallete[colorId].b);
            scaleValues.setXYZ( currentIndex + i, points[i].r,  points[i].r,  points[i].r);
        }
        currentIndex += points.length;
        colorId++;
    }

    geometry.addAttribute( 'offset', offsets ); // per mesh translation
    geometry.addAttribute( 'customColor', colors );
    geometry.addAttribute( 'scale', scaleValues );

    // material
    var texture = new THREE.TextureLoader().load( '../content/moon.gif' );
    texture.anisotropy = renderer.getMaxAnisotropy();

    var material = new THREE.RawShaderMaterial( {

        uniforms: {
            map: { value: texture }
        },
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        transparent: false,

    } );

    var mesh = new THREE.Mesh( geometry, material );
    return mesh;
}

// function RenderManySphere() {
//
//
//     var countSphere = 1000;
//     var sizeCube = 10;
//     var geometry = new THREE.BufferGeometry();
//     var basicGeometrySphere = new THREE.SphereBufferGeometry( 0.5, 2, 2 );
//
//     var position = Array.prototype.slice.call(basicGeometrySphere.getAttribute("position").array);
//     var indexes = Array.prototype.slice.call(basicGeometrySphere.getIndex().array);
//
//     var allPosition = [];
//     var allIndexes = [];
//
//     for(var i = 0; i < countSphere; i++) {
//         // 1. position
//         var newPosition = [];
//
//         for (var j in position) {
//             if ( j % 3 == 0) {
//                 // x:
//                 var rowNumber = i % sizeCube;
//
// //                    while(rowNumber > sizeCube)
// //                    {
// //                        rowNumber = Math.floor(rowNumber / sizeCube);
// //                    }
//                 newPosition[j] = position[j] + (rowNumber*2);
//             }
//             else if((j+1) % 3 == 0){
//                 // y:
//                 var columnNumber = Math.floor(i / sizeCube) % sizeCube;
// //                    while(columnNumber > sizeCube)
// //                    {
// //                        columnNumber = Math.floor(columnNumber / sizeCube);
// //                    }
//                 newPosition[j] = position[j] + (columnNumber*2);
//             }
//             else{
//                 var heightNumber = Math.floor(i / sizeCube / sizeCube) % sizeCube;
//                 newPosition[j] = position[j] + (heightNumber * 2);
//             }
//         }
// //            console.log(allPosition.concat(newPosition));
//         allPosition = allPosition.concat(newPosition);
//         // 2. indexes
//
//         var newIndexes =[];
//         for(var j in indexes){
//             newIndexes.push(indexes[j] + i*(position.length/3));
//         }
//         allIndexes = allIndexes.concat(newIndexes);
//     }
//
//     var arr = Array(allPosition.count).fill(1);
//     var colors = new Float32Array( arr );
//
//     var material = new THREE.MeshBasicMaterial( {
//         color: 0xaaaaaa
//     } );
//
//     geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(allPosition), 3 ) );
// //        geometry.addAttribute( 'normal', basicGeometrySphere.getAttribute("normal") );
//     geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
//     geometry.setIndex( new THREE.BufferAttribute( new Uint32Array(allIndexes), 1 ) );
//
//     var mesh = new THREE.Mesh( geometry, material );
//     var newMesh = new THREE.Mesh(basicGeometrySphere, material);
//     scene.add(newMesh);
//     scene.add( mesh );
//
//     // scene.add( new THREE.AmbientLight( 0x444444 ) );
// }




