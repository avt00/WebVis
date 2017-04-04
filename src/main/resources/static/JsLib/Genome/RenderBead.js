/**
 * Created by user on 16.01.2017.
 */
var basicGeometrySphere = new THREE.SphereBufferGeometry( 1, 9, 9 );
function getMeshPointsSeparate(chain, color) {
    var countAllPoint = Object.keys(chain.points).length;

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

    for ( var key in points) {
        currentIndex++;
        offsets.setXYZ( currentIndex, points[key].x, points[key].y, points[key].z);
        scaleValues.setXYZ( currentIndex, points[key].r,  points[key].r,  points[key].r);
    }
    
    geometry.addAttribute( 'offset', offsets ); // per mesh translation
    geometry.addAttribute( 'scale', scaleValues );
    var color4 = new THREE.Vector4(color.r, color.g, color.b, 1);
    var material = new THREE.RawShaderMaterial( {
        uniforms: {
            color:{ value:  color4},
            u_lightWorldPosition: {value: new THREE.Vector3(3,0,0)},
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


function drawBeads( chain, color) {
    var geometry = new THREE.Geometry();
    var defaultMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0	} );
    function applyVertexColors( g, c ) {
        g.faces.forEach( function( f ) {
            var n = ( f instanceof THREE.Face3 ) ? 3 : 4;
            for( var j = 0; j < n; j ++ ) {
                f.vertexColors[ j ] = c;
            }
        } );
    }
    var geom = new THREE.SphereGeometry( 1, 9, 9 );
    var matrix = new THREE.Matrix4();
    var quaternion = new THREE.Quaternion();

    var points = chain.points;
    for ( var i = 0, ul = points.length; i < ul; i++ ) {
        var position = new THREE.Vector3();
        position.x = points[i].x;
        position.y = points[i].y;
        position.z = points[i].z;

        var rotation = new THREE.Euler();
        rotation.x = 1;
        rotation.y = 1;
        rotation.z = 1;

        var scale = new THREE.Vector3();
        scale.x = points[i].r;
        scale.y = points[i].r;
        scale.z = points[i].r;


        quaternion.setFromEuler( rotation, false );
        matrix.compose( position, quaternion, scale );
        // give the geom's vertices a random color, to be displayed
        applyVertexColors( geom, color );
        geometry.merge( geom, matrix );
        // give the geom's vertices a color corresponding to the "id"
        applyVertexColors( geom, color );

    }
    var drawnObject = new THREE.Mesh( geometry, defaultMaterial );
    return drawnObject;
}
