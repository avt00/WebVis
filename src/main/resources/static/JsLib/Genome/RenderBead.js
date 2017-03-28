/**
 * Created by user on 16.01.2017.
 */
var basicGeometrySphere = new THREE.SphereBufferGeometry( 1, 9, 9 );
function getMeshPointsSeparate(chain, color) {
    var countAllPoint = chain.points.length;

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
    // var colors = new THREE.InstancedBufferAttribute( new Float32Array( countAllPoint * 4 ), 4, 1 ).setDynamic( true );
    // 7. radius
    var scaleValues =  new THREE.InstancedBufferAttribute( new Float32Array( countAllPoint*3 ), 3, 1 );
    var currentIndex = 0;
    var points = chain.points;
    for ( var i = 0, ul = points.length; i < ul; i++ ) {
        offsets.setXYZ( currentIndex + i, points[i].x, points[i].y, points[i].z);
        scaleValues.setXYZ( currentIndex + i, points[i].r,  points[i].r,  points[i].r);
    }
    
    geometry.addAttribute( 'offset', offsets ); // per mesh translation
    geometry.addAttribute( 'scale', scaleValues );


    var material = new THREE.RawShaderMaterial( {
        uniforms: {
            color:{ value: color },
        },
        vertexShader: SphereShader.vertexShader,
        fragmentShader: SphereShader.fragmentShader,
        alphaTest: 0.5,
        transparent: true,
    } );

    var mesh = new THREE.Mesh( geometry, material );
    return mesh;
}


function createSimpleSphere() {
   return new THREE.Mesh( new THREE.SphereBufferGeometry( 1, 20, 20 ), new THREE.MeshLambertMaterial({color : 0xff0000, shading: THREE.SmoothShading}) )
}



