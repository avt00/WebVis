/**
 * Created by user on 24.04.2017.
 */
function WeatherController(renderSystem) {
    this.renderSystem = renderSystem;
    this.time = null;
    this.timer = 0;
    this.currentTimeIndex = 0;
    this.heatMap = null;
    this.raycaster = new THREE.Raycaster();
    this.planet = null;

    this.DictionaryMapSource = {
        Google: new GoogleMapSource(),
        OSM: new OSMMapSource()
    };

    this.drawHeatMap = function (jsonData) {
        this.time = jsonData.time;
        var lat = jsonData.lat;
        var lon = jsonData.lon;
        var values = jsonData.dataValue;

        this.heatMap = new HeatMapEarth(this.time, lat, lon, values, radius+0.01);
        this.renderSystem.addMeshToScene(this.heatMap.getLayer());
        // drawPointsAnother(0, lat, lon, values, length1X, length1Y);
        // drawPoints(jsonDataReceived, length1X, length1Y, length2X, length2Y);
    };

    this.updateHeatMap = function(){
        if(this.timer>10){
            this.heatMap.updateColor(this.currentTimeIndex);
            if(this.currentTimeIndex >= this.time.length-1){
                this.currentTimeIndex=0;
            }
            this.currentTimeIndex++;
            this.timer=0;
        }
        this.timer++;
    };

    this.openPlotByClick = function(event) {
        if(this.heatMap==null)
            return;
        var mouse = new THREE.Vector2();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        this.raycaster.setFromCamera(mouse, this.renderSystem.camera);
        var intersects = this.raycaster.intersectObject( this.heatMap.mesh );
        if ( intersects.length > 0 ) {
            var intersect = intersects[0];
            var face = intersect.face;
            var latIndex = Math.floor(face.a / this.heatMap.longitudeArray.length);
            var longIndex = face.a % this.heatMap.longitudeArray.length;
            console.log(latIndex+" : "+longIndex);
            var trace = {
                x: [],
                y: [],
                mode: 'lines',
                name: 'spline',
                line: {shape: 'spline', width: 0.5},
                type: 'scatter'
            };
            var layout = {
                legend: {
                    y: 0.5,
                    traceorder: 'reversed',
                    font: {size: 16},
                    yref: 'paper'
                }};
            for(var i = 0; i<this.heatMap.timeArray.length; i++){
                trace.y.push(this.heatMap.values[i][latIndex][longIndex]);
                trace.x.push(this.heatMap.timeArray[i]);
            }
            var plotHtml =  $('<div/>').addClass('plot').appendTo($('body'));
            var plot = new PlotConroller([trace],layout, plotHtml[0]);
            plot.domElementId.addEventListener('click', function(e) {
                this.parentElement.removeChild(this);
            });
            plot.draw();
        }
    };

    this.changeMapSource = function (value) {
        if(this.planet == null)
            return;
        this.renderSystem.scene.remove(this.planet.tiles);
        if(this.DictionaryMapSource[value]!=null){
            this.planet.mapSource = this.DictionaryMapSource[value];
            this.renderSystem.scene.add(this.planet.getTilesSphere());
        }
    };

    this.changeZoom = function (value) {
        if(this.planet == null)
            return;
        this.renderSystem.scene.remove(this.planet.tiles);
        this.planet.zoom = value;
        this.renderSystem.scene.add(this.planet.getTilesSphere());
    }
}