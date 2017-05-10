/**
 * Created by user on 24.04.2017.
 */

function Menu(){
    this.gui = new dat.GUI();
    this.weatherController = null;

    this.elements = {
        mapSources: ["OSM", "Google"],
        drawHeatMap: function() {
            weatherController.drawHeatMap(jsonData);
        },
        debugRotation: function () {
            console.log(renderSystem.camera.rotation.x*180);
            console.log(renderSystem.camera.rotation.y*180);
            console.log(renderSystem.camera.rotation.z*180);

            console.log(distance(renderSystem.camera.position.x, 0, renderSystem.camera.position.y, 0, renderSystem.camera.position.z, 0));
        },
        zoom: 4,
        updateHeatMap: false,
        wireframe: false,
    };

    this.init = function () {
        var onChangeSource = this.onChangeSource;
        this.gui.add( this.elements, 'mapSources', this.elements.mapSources).name("Map source").onChange(function (value) {
            onChangeSource(value);
        });
        this.gui.add( this.elements, 'drawHeatMap').name("Draw heat map");
        this.gui.add( this.elements, 'updateHeatMap', this.elements.updateHeatMap).name("Update heat maps");
        var onChangeZoom = this.onChangeZoom;
        this.gui.add( this.elements, 'zoom').min(0).max(7).step(1).onChange(function (value) {
            onChangeZoom(value);
        });
        this.gui.add( this.elements, 'debugRotation').name("debugRotation");
        var onWireframe = this.onChangeWireFrame;
        this.gui.add( this.elements, 'wireframe').name("Wireframe").onChange(function (value) {
            onWireframe(value);
        });
    };

    this.onChangeSource = function (value) {
        if(this.weatherController == null)
            return;
        this.weatherController.changeMapSource(value);
    };

    this.onChangeZoom = function (value) {
        if(this.weatherController == null)
            return;
        var intValue = parseInt( value );
        this.weatherController.changeZoom(intValue);
    };

    this.onChangeWireFrame = function (value) {
        if(this.weatherController == null)
            return;
        console.log(value);
        var tiles = this.weatherController.planet.tiles.children;
        for(var i = 0; i < tiles.length; i++){
            var tile = tiles[i];
            tile.material.wireframe = value;
        }
    }
}