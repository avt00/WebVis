/**
 * Created by amois on 1/6/2017.
 */
var gui;

var group;
var container, controls, stats;

var camera, scene, renderer;
var positions, colorsLine, colorsPoints, alphaPoint;
var particles;
var pointCloud;
var particlePositions;
var particleSize;
var linesMesh;

var mapMesh = {};
var previousValue;

var maxParticleCount = 1000;


var opacityColor = 1;
var maxOpacity = 1;

var filesName = getFilesName();

var effectController = {
    showDots: true,
    showLines: true,
    maxOpacity: 1,
    minDistance: 150,
    limitConnections: false,
    maxConnections: 20,
    particleCount: 500,
    fileNameList:filesName,
    template: [],
    message: [],
    fileName : "Name",
    add:function(){ console.log("clicked")},
    loadFile:function(){
        var inputFile = document.getElementById('InputFile');
        var submit = document.getElementById('submit');
        var data = $("form#data");
        data.submit(function () {

            var formData = new FormData($(this)[0]);

            $.ajax({
                url: "/upload",
                type: 'POST',
                data: formData,
                async: false,
                success: function (data) {
                },
                cache: false,
                contentType: false,
                processData: false
            });
            return false;
        });
        inputFile.addEventListener('change', function() {
            var file = inputFile.files[0];
            effectController['fileName'] = file.name;
            // update all controllers
            for (var i in gui.__controllers) {
                gui.__controllers[i].updateDisplay();
            }
            filesName.push(file.name);
            effectController.fileNameList = filesName;
            gui.__controllers[4].remove();
            gui.__controllers[4].remove();
            gui.add( effectController, 'fileNameList', effectController.fileNameList).name("Loaded file").onChange(onChangeFileName);
            gui.add( effectController, 'template', effectController.template).name("Part name").onChange(onChangeList); // controller 1
            submit.click();
        });
        inputFile.click();
    }
};

var onChangeFileName = function (value) {
    previousValue = null;
    scene.remove(group);
    group = new THREE.Group();
    mapMesh = {};
    var data = getData(value);
    initAll(data);
    animate();
    scene.add( group );

    var keys = Object.keys(data);
    keys.push("All");

    effectController['template'] = keys;
    gui.__controllers[5].remove();
    gui.add( effectController, 'template', effectController.template).name("Part name").onChange(onChangeList); // controller 1
};

var onChangeList = function( value ) {
    if(previousValue==="All"){
        for (var key in mapMesh) {
            var meshArray = mapMesh[key];
            updateAlpha(meshArray, effectController.maxOpacity);
        }
        previousValue=null;
    }
    if(value==="All"){
        for (var key in mapMesh) {
            var meshArray = mapMesh[key];
            updateAlpha(meshArray, 1);
        }
    }
    else{
        var meshArray = mapMesh[value];
        if(effectController.showDots==false){
            meshArray[0].visible = true;
        }
        updateAlpha(meshArray, 1);
        if(previousValue!=null){
            var meshArrayPrev = mapMesh[previousValue];
            if(effectController.showDots==false){
                meshArrayPrev[0].visible = false;
            }
            updateAlpha(meshArrayPrev, effectController.maxOpacity);
        }
    }
    previousValue = value;
};


initGUI();
init();
if(filesName[0])
    onChangeFileName(filesName[0]);




function initGUI() {

    gui = new dat.GUI();
    gui.add( effectController, 'loadFile').name('Load CSV file');
    gui.add( effectController, "showDots" ).name("Show Dots").onChange( function( value ) {

        for (var key in mapMesh) {
            if(previousValue==key)
                continue;
            var meshArray = mapMesh[key];
            meshArray[0].visible = value;
        }
    } );
    gui.add( effectController, "showLines" ).name("Show Lines").onChange( function( value ) {
        for (var key in mapMesh) {
            if(previousValue==key)
                continue;
            var meshArray = mapMesh[key];
            meshArray[1].visible = value;
            meshArray[2].visible = value;
        }
    } );

    gui.add( effectController, "maxOpacity", 0, maxOpacity, 0.05 ).name('Opacity').onChange( function( value ) {
        opacityColor = parseFloat( value );
        for (var key in mapMesh) {
            if(previousValue==key)
                continue;
            var meshArray = mapMesh[key];
            updateAlpha(meshArray, opacityColor);
        }
    });

    gui.add( effectController, 'fileNameList', effectController.fileNameList).name("Selected file").onChange(onChangeFileName);
    gui.add( effectController, 'template', effectController.template).name("Part name").onChange(onChangeList); // controller 1
}


function initAll(allObject) {
    var indexColor = 0;
    for (var key1 in allObject) {
        initModel(allObject[key1], key1, palette[indexColor]);
        indexColor++;
    }
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

    var opacity = effectController.maxOpacity;



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
}

function init() {

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.z = 50;
    controls = new THREE.OrbitControls( camera, container, container);
    scene = new THREE.Scene();


    group = new THREE.Group();
    scene.add( group );

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true} );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    container.appendChild( renderer.domElement );

    stats = new Stats();
    container.appendChild( stats.dom );

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
    requestAnimationFrame( animate );
    stats.update();
    render();

}

function render() {
    renderer.render( scene, camera );
}

function getData(value) {
    var jsonDataR;
    $.ajax({
        dataType: 'json',
        async: false,
        url: '/getGenome/'+value,
        success: function(jsondata){
            console.log("Data was received");
            console.log(Object.keys(jsondata));
            jsonDataR = jsondata;
        }
    });
    return jsonDataR;
}

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
}

function getFilesName() {
    var jsonDataR = [];
    $.ajax({
        dataType: 'json',
        async: false,
        url: '/getFiles',
        success: function(jsondata){
            jsonDataR = jsondata;
        }
    });
    return jsonDataR;
}