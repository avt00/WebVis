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




