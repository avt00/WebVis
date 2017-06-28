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
    // 8. expression
    var expressionValues = new THREE.InstancedBufferAttribute( new Float32Array( countAllPoint ), 1, 1 );
    var currentIndex = 0;
    var points = chain.points;


    var minExpression;
    var maxExpression;

    var minX;
    var maxX;
    var minY;
    var maxY;
    var minZ;
    var maxZ;

    for ( var key in points) {
        var x = points[key].x;
        var y = points[key].y;
        var z = points[key].z;
        if(currentIndex==0)
        {
            minExpression = calculateAvrExpression(points[key]);
            maxExpression = minExpression;
            minX = x;
            maxX = x;
            minY = y;
            maxY = y;
            minZ = z;
            maxZ = z;
        }
        currentIndex++;

        offsets.setXYZ( currentIndex, x, y, z);
        scaleValues.setXYZ( currentIndex, points[key].r,  points[key].r,  points[key].r);
        var expressionValue = calculateAvrExpression(points[key]);
        if(expressionValue > maxExpression)
            maxExpression = expressionValue;
        if(expressionValue < minExpression)
            minExpression = expressionValue;

        if(minX > x)
            minX = x;
        if(maxX < x)
            maxX = x;

        if(minY > y)
            minY = y;
        if(maxY < y)
            maxY = y;

        if(minZ > z)
            minZ = z;
        if(maxZ < z)
            maxZ = z;
        expressionValues.setX(currentIndex, expressionValue);
    }
    
    geometry.addAttribute( 'offset', offsets ); // per mesh translation
    geometry.addAttribute( 'scale', scaleValues );
    geometry.addAttribute( 'expression', expressionValues );
    var color4 = new THREE.Vector4(color.r, color.g, color.b, 1);
    var center = new THREE.Vector3(maxX - Math.abs(maxX - minX)/2, maxY - Math.abs(maxY - minY)/2, maxZ - Math.abs(maxZ - maxZ)/2);
    var material = new THREE.RawShaderMaterial( {
        uniforms: {
            color:{ value:  color4},
            u_lightWorldPosition: { value: new THREE.Vector3(3,0,0) },
            u_UseExpression: {value: false},
            u_minExpression: {value: minExpression },
            u_maxExpression: {value: maxExpression },

            u_UseExpressionGlobal: {value: false},
            u_minExpressionGlobal: {value: 0 },
            u_maxExpressionGlobal: {value: 0 },
            u_center: {value: center}
        },
        vertexShader: SphereShader.vertexShader,
        fragmentShader: SphereShader.fragmentShader,
        alphaTest: 0.5,
        transparent: true,
    } );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(center.x, center.y, center.z);
    return mesh;
}


function createSimpleSphere() {
   return new THREE.Mesh( new THREE.SphereBufferGeometry( 1, 20, 20 ), new THREE.MeshLambertMaterial({color : 0xff0000, shading: THREE.SmoothShading}) )
}

function calculateAvrExpression(pointInfo) {
    if(pointInfo==null || pointInfo.geneInfos.length == 0){
        return 0;
    }
    var sum = 0;
    for(var index = 0; index < pointInfo.geneInfos.length; index++) {
        var gen = pointInfo.geneInfos[index];
        sum += gen.expression;
    }
    return sum/pointInfo.geneInfos.length;
}

function createOneMeshGenome(allChains, palettes) {
    var indexColor = 0;
    var countAllPoint = 0;
    for (var key in allChains){
        countAllPoint+=Object.keys(allChains[key].points).length;
    }

    var geometry = new THREE.InstancedBufferGeometry();
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
    var colors = new THREE.InstancedBufferAttribute( new Float32Array( countAllPoint * 4 ), 4, 1 ).setDynamic( true );
    // 7. radius
    var scaleValues =  new THREE.InstancedBufferAttribute( new Float32Array( countAllPoint*3 ), 3, 1 );
    // 8. expression
    var expressionValues = new THREE.InstancedBufferAttribute( new Float32Array( countAllPoint ), 1, 1 );


    var minExpression;
    var maxExpression;

    var currentIndex = 0;
    for (var key1 in allChains){
        var color = palettes[indexColor];
        allChains[key1].color = color;
        allChains[key1].visible = true;
        var points = allChains[key1].points;
        for ( var key in points) {
            var x = points[key].x;
            var y = points[key].y;
            var z = points[key].z;
            if(currentIndex==0)
            {
                minExpression = calculateAvrExpression(points[key]);
                maxExpression = minExpression;
            }
            currentIndex++;
            points[key].index = currentIndex;
            points[key].visible = true;
            offsets.setXYZ( currentIndex, x, y, z);
            scaleValues.setXYZ( currentIndex, points[key].r,  points[key].r,  points[key].r);
            colors.setXYZW(currentIndex, color.r, color.g, color.b, 1);
            var expressionValue = calculateAvrExpression(points[key]);
            if(expressionValue > maxExpression)
                maxExpression = expressionValue;
            if(expressionValue < minExpression)
                minExpression = expressionValue;

            expressionValues.setX(currentIndex, expressionValue);
            points[key].avrExTest2 = expressionValue;
        }
        indexColor++;
    }

    geometry.addAttribute( 'offset', offsets ); // per mesh translation
    geometry.addAttribute( 'color', colors ); // per mesh translation

    geometry.addAttribute( 'scale', scaleValues );
    geometry.addAttribute( 'expression', expressionValues );
    var material = new THREE.RawShaderMaterial( {
        uniforms: {
            u_lightWorldPosition: { value: new THREE.Vector3(3,0,0) },
            u_UseExpressionGlobal: {value: false},
            u_minExpressionGlobal: {value: minExpression },
            u_maxExpressionGlobal: {value: maxExpression },
            u_hasClipping : {value: false},
            u_normalClipping : {value: new THREE.Vector3(0, 0, 0)},
            u_positionPoint : {value: new THREE.Vector3(0, 0, 0)},
        },
        vertexShader: SphereShader.vertexShaderNew,
        fragmentShader: SphereShader.fragmentShaderNew,
        alphaTest: 0.5,
        transparent: true,
        blending: THREE.NormalBlending
    } );

    var mesh = new THREE.Mesh( geometry, material );
    return mesh;
}
