function PlotConroller (data, layout, domElementid){

    this.domElementId = domElementid;
    this.data = data;
    this.layout = layout;

    this.draw = function() {
        Plotly.newPlot(this.domElementId, data, layout, {displayModeBar: false});
    };

    this.redraw = function() {
        Plotly.redraw(this.domElementId);
    };
}
