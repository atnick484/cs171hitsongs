class TempoViz {
    constructor (parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];
        this.chosenTempo = null;

        this.colors = ['#b9767e', '#6da87f', '#ffa64a', "#000000"];
    }

    initViz() {
        let vis = this;

        vis.margin = {top: 30, right: 20, bottom: 70, left: 50};

        // Set width and height to the height of the parent element - margins
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right; // NEW!!
        vis.height = 600 - vis.margin.top - vis.margin.bottom;//document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom; // NEW!!

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Overlay with path clipping
        vis.svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        let min = d3.min(vis.data, function (d) { return d.tempo; });
        let max = d3.max(vis.data, function (d) { return d.tempo; });

        vis.x = d3.scaleLinear()
            .domain([min, max])
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .domain([0, 0.05])
            .range([vis.height, 0])

        // axis
        vis.svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", vis.width / 2)
            .attr("y", vis.height + 50)
            .text("Tempo (beats per minute)");

        vis.svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("y", -50)
            .attr("dy", ".75em")
            .attr('x', - vis.height/2)
            .attr("transform", "rotate(-90)")
            .text("Frequency");


        vis.wrangleData();

    }

    wrangleData() {
        let vis = this;

        vis.updateViz();
        vis.displayData = vis.data;

    }


    updateViz() {
        let vis = this;

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "y-axis axis")

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr('transform', 'translate(0,' + vis.height + ")");

        vis.svg.select('.y-axis').transition().call(vis.yAxis)
        vis.svg.select('.x-axis').transition().call(vis.xAxis)

        // Add the links

        let kde = vis.kernelDensityEstimator(vis.kernelEpanechnikov(7),vis.x.ticks(1000))
        vis.density =  kde( vis.data.map(function(d){  return d.tempo; }) )

        vis.y.domain([0, d3.max(vis.density, function (d) { return d[1]; })])


        vis.svg.append("path")
            .attr("class", "mypath")
            .datum(vis.density)
            .attr("fill", "#ffa64a")
            .attr("stroke-linejoin", "round")
            .attr("d", d3.area()
                .x(function(d) { return vis.x(d[0]); })
                .y0(vis.y(0))
                .y1(function(d) { return vis.y(d[1]); })
            );

        vis.bisectDuration = d3.bisector(d => d[0]).right;

        vis.tooltipGroup = vis.svg.append("g")
            .attr("class", "tooltip-group")

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'tempoTooltip')

        vis.tooltipGroup
            .append("rect")
            .attr("class", "tooltip-rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", vis.height)
            .attr("width", vis.width)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("mousemove", function (event) {
                if (!vis.chosenTempo) {
                    vis.mousemove(event);
                }
            })
            .on("click", function (event) {
                vis.mouseUnclick(event);
            });
        vis.tooltipLine = vis.tooltipGroup
            .append("line")
            .attr("class", "tooltip-line")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", vis.height)
            .attr("y2", 0)
            .attr("stroke-width", 3)
            .attr("stroke", "blue")
            .on("click", function (event) {
                // vis.tooltipGroup.style("visibility", "visible");
                vis.mouseClick(event);
            });

    }

    mousemove(event) {
        let vis = this;
        let x_pos = d3.pointer(event)[0];
        let x_inv = vis.x.invert(x_pos);
        let loc = vis.bisectDuration(vis.density, x_inv);
        vis.datum = vis.density[loc];
        vis.tooltipLine.attr("transform", "translate(" + x_pos + ", " + 0 + ")");
        vis.tooltip
            .style("opacity", 1)
            .style("left", event.pageX + 20 + "px")
            .style("top", event.pageY + 50 + "px")
            .html(`
                 <div style="border: thin solid grey; border-radius: 5px; background: #212121; padding: 5px; text-align: left">
                     <h3>${vis.datum[0]}bpm</h3>
                      <p><b>Frequency:</b> ${Number((vis.datum[1] * 100).toFixed(3))}%</p>
                 </div>`
            );
    }

    mouseClick(event) {
        let vis = this;
        vis.chosenTempo = vis.datum;
        vis.tooltipLine
            .attr("stroke", "black")
            .attr("stroke-width", 5);
    }

    mouseUnclick(event) {
        let vis = this;
        vis.tooltipLine
            .attr("stroke", "blue")
            .attr("stroke-width", 3);
        vis.chosenTempo = null;
    }

    // Function to compute density
    kernelDensityEstimator(kernel, X) {
        return function(V) {
            return X.map(function(x) {
                return [x, d3.mean(V, function(v) { return kernel(x - v); })];
            });
        };
    }
    kernelEpanechnikov(k) {
        return function(v) {
            return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
        };
    }
    getChosenTempo() {
        let vis = this;
        return vis.chosenTempo;
    }
}