/**
 * Created by user on 16.01.2017.
 */
var mapping = {};
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
    var colors = new THREE.InstancedBufferAttribute( new Float32Array( countAllPoint * 4 ), 4, 1 ).setDynamic( true );
    // 7. radius
    var scaleValues =  new THREE.InstancedBufferAttribute( new Float32Array( countAllPoint*3 ), 3, 1 );
    var currentIndex = 0;
    var colorId = 0;
    for(var key in listChains){
        var points = listChains[key].points;
        for ( var i = 0, ul = points.length; i < ul; i++ ) {
            offsets.setXYZ( currentIndex + i, points[i].x, points[i].y, points[i].z);
            colors.setXYZW ( currentIndex + i, pallete[colorId].r, pallete[colorId].g, pallete[colorId].b, 1.0);
            scaleValues.setXYZ( currentIndex + i, points[i].r,  points[i].r,  points[i].r);
        }
        mapping[key] = {start: currentIndex, count: points.length};
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
        vertexShader: PointTextureShader.vertexShader,
        fragmentShader: PointTextureShader.fragmentShader,
        // alphaTest: 0.5,
        // transparent: true,
        // depthWrite: false,
        // depthTest: false,
    } );

    var mesh = new THREE.Mesh( geometry, material );
    return mesh;
}

function updateAlphaMesh(mesh, name, value) {
    var attributeColor = mesh.geometry.getAttribute("customColor");
    var dataInformation = mapping[name];
    for ( var i = dataInformation.start, ul = dataInformation.start + dataInformation.count; i < ul; i++ ) {
        var index = i * 4;
        var vector4 = new THREE.Vector4( attributeColor.array[index], attributeColor.array[index + 1], attributeColor.array[index + 2], attributeColor.array[index + 3] );
        attributeColor.setXYZW( i, vector4.x, vector4.y, vector4.z, value );
    }
    attributeColor.needsUpdate = true;
}

function updateAlphaBead(model, value) {
    model.material.opacity = value;
    model.material.needsUpdate = true;
    if(value > 0)
        model.visible = true;
    else
        model.visible = false;
}

var basicGeometrySphere = new THREE.SphereBufferGeometry( 1, 20, 20 );
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
    var colors = new THREE.InstancedBufferAttribute( new Float32Array( countAllPoint * 4 ), 4, 1 ).setDynamic( true );
    // 7. radius
    var scaleValues =  new THREE.InstancedBufferAttribute( new Float32Array( countAllPoint*3 ), 3, 1 );
    var currentIndex = 0;
    var points = chain.points;
    for ( var i = 0, ul = points.length; i < ul; i++ ) {
        offsets.setXYZ( currentIndex + i, points[i].x, points[i].y, points[i].z);
        colors.setXYZW ( currentIndex + i, color.r, color.g, color.b, 1.0);
        scaleValues.setXYZ( currentIndex + i, points[i].r,  points[i].r,  points[i].r);
    }
    
    geometry.addAttribute( 'offset', offsets ); // per mesh translation
    geometry.addAttribute( 'customColor', colors );
    geometry.addAttribute( 'scale', scaleValues );

    // material
    var texture = new THREE.TextureLoader().load( '../content/moon.gif' );
    // texture.anisotropy = renderer.getMaxAnisotropy();

    var material = new THREE.RawShaderMaterial( {

        uniforms: {
            map: { value: texture }
        },
        vertexShader: SphereShader.vertexShader,
        fragmentShader: SphereShader.fragmentShader,
        alphaTest: 0.5,
        transparent: true,
        // depthWrite: false,
        // depthTest: false,
    } );

    var mesh = new THREE.Mesh( geometry, material );
    return mesh;
}


// render with texture
function initModel(obj, modelName, color) {

    maxParticleCount = obj.points.length;

    var segments = maxParticleCount * maxParticleCount;

    positions = new Float32Array( segments * 3 );
    colorsLine = new Float32Array( segments * 3 );

    particlePositions = new Float32Array( maxParticleCount * 3);
    colorsPoints = new Float32Array( maxParticleCount * 3 );
    particleSize = new Float32Array( maxParticleCount);
    alphaPoint = new Float32Array( maxParticleCount);

    var opacity = 0;

    var texture = new THREE.TextureLoader().load( "../content/ball.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    var pMaterial = new THREE.ShaderMaterial( {
        uniforms: {
            amplitude: { value: 1.0 },
            color:     { value: new THREE.Color( 0xffffff ) },
            texture:   { value: texture}
        },
        vertexShader:   document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        transparent:    true,
        depthTest:      true,
        depthWrite:     true,
    });

    particles = new THREE.BufferGeometry();

    var colorpos = 0;
    var vertexpos = 0;
    var points = [];

    for ( var i = 0; i < maxParticleCount; i++ ) {

        var x = obj.points[i].x;
        var y = obj.points[i].y;
        var z = obj.points[i].z;

        particlePositions[ i * 3     ] = x;
        particlePositions[ i * 3 + 1 ] = y;
        particlePositions[ i * 3 + 2 ] = z;

        colorsPoints[i * 3     ] = color.r;
        colorsPoints[i * 3 + 1 ] = color.g;
        colorsPoints[i * 3 + 2 ] = color.b;

        alphaPoint[ i ] = opacity;
        particleSize[i] = obj.points[i].r*10;


        points.push(new THREE.Vector3(x, y, z));

        if(i==0){
            continue;
        }



        positions[ vertexpos++ ] = particlePositions[ i * 3     ];
        positions[ vertexpos++ ] = particlePositions[ i * 3 + 1 ];
        positions[ vertexpos++ ] = particlePositions[ i * 3 + 2 ];

        positions[ vertexpos++ ] = particlePositions[ (i-1) * 3     ];
        positions[ vertexpos++ ] = particlePositions[ (i-1) * 3 + 1 ];
        positions[ vertexpos++ ] = particlePositions[ (i-1) * 3 + 2 ];



        colorsLine[ colorpos++ ] = color.r;
        colorsLine[ colorpos++ ] = color.g;
        colorsLine[ colorpos++ ] = color.b;

        colorsLine[ colorpos++ ] = color.r;
        colorsLine[ colorpos++ ] = color.g;
        colorsLine[ colorpos++ ] = color.b;

    }

    particles.setDrawRange( 0, maxParticleCount );
    particles.addAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setDynamic( true ) );
    particles.addAttribute( 'customColor', new THREE.BufferAttribute( colorsPoints, 3 ) );
    particles.addAttribute( 'size', new THREE.BufferAttribute( particleSize, 1 ).setDynamic( true ) );
    particles.addAttribute( 'alpha', new THREE.BufferAttribute( alphaPoint, 1 ).setDynamic( true ) );

    // create the particle system
    pointCloud = new THREE.Points( particles, pMaterial );
    group.add( pointCloud );

    var geometry = new THREE.BufferGeometry();

    var spline = new THREE.CatmullRomCurve3(points);
    var splinePoints = spline.getPoints(points.length*5);

    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setDynamic( true ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colorsLine, 3 ).setDynamic( true ) );

    geometry.computeBoundingSphere();

    geometry.setDrawRange( 0, 0 );

    var material = new THREE.LineBasicMaterial( {
        vertexColors: THREE.VertexColors,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity : opacity,
    } );

    linesMesh = new THREE.LineSegments( geometry, material );

    linesMesh.geometry.setDrawRange( 0, maxParticleCount * 2 );
//        group.add( linesMesh );



    var material = new THREE.LineBasicMaterial({
        color: color,
        opacity: opacity,
        transparent: true,
    });

    var geometry = new THREE.Geometry();

    for(var i = 0; i < splinePoints.length; i++){
        geometry.vertices.push(splinePoints[i]);
    }

    var line = new THREE.Line(geometry, material);
    group.add(line);
    mapMesh[modelName] = [pointCloud, linesMesh, line];
    mapMesh[modelName][0].visible = false;
    mapMesh[modelName][1].visible = false;
    mapMesh[modelName][2].visible = false;
}


var visibleModel;
function updateAlpha(model, value) {
    var points = model[0].geometry.attributes.alpha;
    for( var i = 0; i < points.array.length; i++ ) {
        points.array[ i ] = value;
    }
    points.needsUpdate = true;
    model[1].material.opacity = value;
    model[1].material.needsUpdate = true;

    model[2].material.opacity = value;
    model[2].material.needsUpdate = true;

    model[0].visible = true;
    model[1].visible = true;
    model[2].visible = true;

    visibleModel = model[0];
}




