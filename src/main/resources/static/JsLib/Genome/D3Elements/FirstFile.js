/**
 * Created by user on 05.04.2017.
 */
function BarChart(data, parent, type) {


    this.initLogScale = function () {
        this.scaleX = d3.scaleLog()
            .range([0, width])
            .domain([1, d3.max(data, function (d) {
                return d.value;
            })]);

        this.scaleY = d3.scaleBand()
            .rangeRound([height, 0])
            .padding(0.1)
            .domain(data.map(function (d) {
                return d.name;
            }));
    };

    this.initLianerScale = function () {
        this.scaleX = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
                return d.value;
            })]);

        this.scaleY = d3.scaleBand()
            .rangeRound([height, 0])
            .padding(0.1)
            .domain(data.map(function (d) {
                return d.name;
            }));
    };

    this.data = data;
    this.margin = {
        top: 15,
        right: 55,
        bottom: 15,
        left: 60
    };
    this.heightElement = 30;
    this.width = parent.offsetWidth - this.margin.left - this.margin.right,
    this.height = this.heightElement*data.length - this.margin.top - this.margin.bottom

    this.svg = d3.select(parent).append("svg")
        .attr("width", width + this.margin.left + this.margin.right)
        .attr("height", height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.scaleX = null;
    this.scaleY = null;
    if(type){
        this.initLogScale();
    }
    else{
        this.initLianerScale();
    }

    this.yAxis =  d3.axisLeft(y)
        .tickSize(0);

    var gy = this.svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    this.bars = this.svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g");

    this.bars.append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {
            return this.scaleY(d.name);
        })
        .attr("height", this.scaleY.bandwidth())
        .attr("x", 0)
        .attr("width", function (d) {
            return this.scaleX(d.value+1);
        });

//add a value label to the right of each bar
    this.bars.append("text")
        .attr("class", "label")
        //y position of the label is halfway down the bar
        .attr("y", function (d) {
            return this.scaleY(d.name) + this.scaleY.bandwidth() / 2 + 4;
        })
        //x position is 3 pixels to the right of the bar
        .attr("x", function (d) {
            return this.scaleX(d.value+1) + 3;
        })
        .text(function (d) {
            return d.value;
        });
}

var margin = {
    top: 15,
    right: 55,
    bottom: 15,
    left: 60
};
function createBarChart(parent, data, linkInfo){
    data = data.sort(function (a, b) {
        return d3.ascending(a.value, b.value);
    });

    var heightElement = 20;

    //set up svg using margin conventions - we'll need plenty of room on the left for labels

    var width = parent.offsetWidth - margin.left - margin.right,
        height = heightElement*data.length;
    console.log(width);
    var svg = d3.select(parent).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLog()
        .range([0, width])
        .domain([1, d3.max(data, function (d) {
            return d.value+1;
        })]);

    var y = d3.scaleBand()
        .rangeRound([height, 0])
        .padding(0.1)
        .domain(data.map(function (d) {
            return d.name;
        }));

//make y axis to show bar names
    var yAxis = d3.axisLeft(y)
    //no tick marks
        .tickSize(0);

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var labels = gy.node().childNodes;
    for(var i = 0; i < labels.length; i++){
        labels[i].addEventListener("click", function(){
            redirectToBead(linkInfo[this.textContent]);
        });
    }
    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g");

//append rects
    bars.append("rect")
        .attr("class", "bar")
        .attr("y", function (d) {
            return y(d.name);
        })
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", function (d) {
            return x(d.value+1);
        });

//add a value label to the right of each bar
    bars.append("text")
        .attr("class", "label")
        //y position of the label is halfway down the bar
        .attr("y", function (d) {
            return y(d.name) + y.bandwidth() / 2 + 4;
        })
        //x position is 3 pixels to the right of the bar
        .attr("x", function (d) {
            return x(d.value+1) + 3;
        })
        .text(function (d) {
            return d.value;
        });
    return svg;
}

function rescaleLinear(svg, data) {
    var width = svg.node().parentElement.getBoundingClientRect().width - margin.left - margin.right;
    var x = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(data, function (d) {
            return d.value;
        })]);
    svg.selectAll("g>rect")
        .transition().duration(1000)  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .attr("width", function (d) {
            return x(d.value);
        });

    svg.selectAll("g>text.label")
        .transition().duration(1000)  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .attr("x", function (d) {
            return x(d.value)+3;
        });

}

function rescaleLog(svg, data) {
    var width = svg.node().parentElement.getBoundingClientRect().width - margin.left - margin.right;

    var x = d3.scaleLog()
        .range([0, width])
        .domain([1, d3.max(data, function (d) {
            return d.value+1;
        })]);
    svg.selectAll("g>rect")
        .transition().duration(1000)  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .attr("width", function (d) {
            return x(d.value+1);
        });

    svg.selectAll("g>text.label")
        .transition().duration(1000)  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .attr("x", function (d) {
            return x(d.value+1)+3;
        });
}

function createLegendVertical(parent, w, h, color1, color2, text) {
    var padding = 10;
    var svg = d3.select(parent).append("svg");
        // .attr("width", w)
        // .attr("height", h)
        // .attr("transform", "translate(" + 100 + "," + 100 + ")");
    svg.attr('width', w).attr('height', h);

    // Create the svg:defs element and the main gradient definition.
    var svgDefs = svg.append('defs');

    var mainGradient = svgDefs.append('linearGradient')
        .attr('id', 'mainGradient')
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

    // Create the stops of the main gradient. Each stop will be assigned
    // a class to style the stop using CSS.
    mainGradient.append('stop')
        .attr("stop-color", color1)
        .attr("offset", "0%");


    mainGradient.append('stop')
        .attr("stop-color", color2)
        .attr("offset", "100%");

    var borderGradient = svgDefs.append('linearGradient')
        .attr('id', 'borderGradient')
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

    // Create the stops of the main gradient. Each stop will be assigned
    // a class to style the stop using CSS.
    borderGradient.append('stop')
        .attr("stop-color", color2)
        .attr("offset", "0%");


    borderGradient.append('stop')
        .attr("stop-color", color1)
        .attr("offset", "100%");


    // Use the gradient to set the shape fill, via CSS.
    svg.append('rect')
    // .classed('outlined', true)
        .attr('x', padding)
        .attr('y', padding*2)
        .attr('width', (w / 2) - 1.5 * padding)
        .attr('height', h - 3 * padding)
        .style("stroke", "url(#borderGradient)")
        .style("stroke-width", "4");
    svg.append('rect')
        // .classed('filled', true)
        .attr('x', padding)
        .attr('y', padding*2)
        .attr('width', (w / 2) - 1.5 * padding)
        .attr('height', h - 3 * padding)
        .style("fill", "url(#mainGradient)");




    svg.append("text")
        .attr("y", 7)
        // .attr("x", 15)
        .attr("alignment-baseline", "central")
        .style('fill', 'white')
        .text(text);

    return svg;
}




