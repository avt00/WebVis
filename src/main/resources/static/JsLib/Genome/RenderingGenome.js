/**
 * Created by user on 10.01.2017.
 */

var group;
var camera, scene, renderer;
var container, controls, stats;
var positions,  colorsPoints, alphaPoint, particleSize, particlePositions;
var linesMesh, colorsLine;
var mapMesh = {};
var maxParticleCount;
var raycaster, mouse;

var meshSpheres;

function init() {

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1500 );
    camera.position.z = 50;

    controls = new THREE.OrbitControls( camera, container, container);

    scene = new THREE.Scene();
    group = new THREE.Group();
    scene.add( group );

    renderer = new THREE.WebGLRenderer( { antialias: true} );
    // renderer.setClearColor( 0xa0a0a0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.sortObjects = true;
    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;
    // renderer.shadowMap.enabled = true;

    container.appendChild( renderer.domElement );

    stats = new Stats();
    container.appendChild( stats.dom );

    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
}


function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();


    var width = window.innerWidth;
    var height = window.innerHeight;

    renderer.setSize( window.innerWidth, window.innerHeight );

    ssaoPass.uniforms[ 'size' ].value.set( window.innerWidth, window.innerHeight );

    var pixelRatio = renderer.getPixelRatio();
    var newWidth  = Math.floor( width / pixelRatio ) || 1;
    var newHeight = Math.floor( height / pixelRatio ) || 1;
    depthRenderTarget.setSize( newWidth, newHeight );
    effectComposer.setSize( newWidth, newHeight );

}

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

function animate() {
    requestAnimationFrame( animate );
    stats.update();

    if(visibleModel!=null){
        raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObject( visibleModel );
        if(intersects.length > 0 )
            console.log(intersects[0]);
    }

    render();
}

function render() {
    if ( postprocessing.enabled ) {
        // Render depth into depthRenderTarget
        scene.overrideMaterial = depthMaterial;
        renderer.render( scene, camera, depthRenderTarget, true );
        // Render renderPass and SSAO shaderPass
        scene.overrideMaterial = null;
        effectComposer.render();
    } else {
        renderer.render( scene, camera );
    }
}

function initAll(allObject) {
    // var indexColor = 0;
    // for (var key1 in allObject) {
    //     initModel(allObject[key1], key1, palette[indexColor]);
    //     indexColor++;
    // }

    meshSpheres = getMeshPoints(allObject, palette)
    scene.add(meshSpheres);


    // group = new THREE.Object3D();
    // scene.add( group );
    //
    // var geometry = new THREE.SphereGeometry( 5, 20, 20 );
    // for ( var i = 0; i < 200; i ++ ) {
    //
    //     var material = new THREE.MeshBasicMaterial();
    //     material.color.r = Math.random();
    //     material.color.g = Math.random();
    //     material.color.b = Math.random();
    //
    //     var mesh = new THREE.Mesh( geometry, material );
    //     mesh.position.x = Math.random() * 400 - 200;
    //     mesh.position.y = Math.random() * 400 - 200;
    //     mesh.position.z = Math.random() * 400 - 200;
    //     mesh.rotation.x = Math.random();
    //     mesh.rotation.y = Math.random();
    //     mesh.rotation.z = Math.random();
    //
    //     mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 10 + 1;
    //     group.add( mesh );
    //
    // }
    // Init postprocessing
    initPostprocessing();
}

var depthMaterial, effectComposer, depthRenderTarget;
var ssaoPass;
var postprocessing = { enabled : false, renderMode: 0 }; // renderMode: 0('framebuffer'), 1('onlyAO')
var depthScale = 1.0;
function initPostprocessing() {
    // Setup render pass
    var renderPass = new THREE.RenderPass( scene, camera );
    // Setup depth pass
    depthMaterial = new THREE.MeshDepthMaterial();
    depthMaterial.depthPacking = THREE.RGBADepthPacking;
    depthMaterial.blending = THREE.NoBlending;
    var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
    depthRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );
    // Setup SSAO pass
    ssaoPass = new THREE.ShaderPass( THREE.SSAOShader );
    ssaoPass.renderToScreen = true;
    //ssaoPass.uniforms[ "tDiffuse" ].value will be set by ShaderPass
    ssaoPass.uniforms[ "tDepth" ].value = depthRenderTarget.texture;
    ssaoPass.uniforms[ 'size' ].value.set( window.innerWidth, window.innerHeight );
    ssaoPass.uniforms[ 'cameraNear' ].value = camera.near;
    ssaoPass.uniforms[ 'cameraFar' ].value = camera.far;
    ssaoPass.uniforms[ 'onlyAO' ].value = ( postprocessing.renderMode == 1 );
    ssaoPass.uniforms[ 'aoClamp' ].value = 0.3;
    ssaoPass.uniforms[ 'lumInfluence' ].value = 0.5;
    // Add pass to effect composer
    effectComposer = new THREE.EffectComposer( renderer );
    effectComposer.addPass( renderPass );
    effectComposer.addPass( ssaoPass );
}

