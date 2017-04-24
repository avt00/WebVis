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
        zoom: 4,
        updateHeatMap: false,
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
    }
}