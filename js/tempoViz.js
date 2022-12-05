class TempoViz {
    constructor (parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];

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
            .text("Song Tempo (beats per minute)");

        vis.svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("y", -50)
            .attr("dy", ".75em")
            .attr('x', - vis.height/2)
            .attr("transform", "rotate(-90)")
            .text("Frequency");


        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "y-axis axis")

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr('transform', 'translate(0,' + vis.height + ")");

        // Interactivity
        //
        // vis.svg.append('line').classed('hoverLine', true)
        // vis.svg.append('circle').classed('hoverPoint', true);
        // vis.svg.append("text").classed('hoverText', true);
        //
        // vis.svg.append('rect')
        //     .attr('fill', 'transparent')
        //     .attr('x', 0)
        //     .attr('y', 0)
        //     .attr('width', vis.width)
        //     .attr('height', vis.height)
        // ;

        // vis.svg.on("mousemove", (event) => {
        //     vis.mouseMove(event);
        // })

        vis.wrangleData();

    }

    wrangleData() {
        let vis = this;

        vis.updateViz();
        vis.displayData = vis.data;

    }


    updateViz() {
        let vis = this;
        vis.svg.select('.y-axis').transition().call(vis.yAxis)
        vis.svg.select('.x-axis').transition().call(vis.xAxis)

        console.log(this.displayData);
        // Add the links

        let kde = vis.kernelDensityEstimator(vis.kernelEpanechnikov(7),vis.x.ticks(1000))
        vis.density =  kde( vis.data.map(function(d){  return d.tempo; }) )

        vis.y.domain([0, d3.max(vis.density, function (d) { return d[1]; })])

        console.log(vis.density);

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
            // .attr("d",  d3.line()
            //     .curve(d3.curveBasis)
            //     .x(function(d) { return vis.x(d[0]); })
            //     .y(function(d) { return vis.y(d[1]); })
            // );



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

    mouseMove = (event) => {
        let vis = this;
        event.preventDefault();
        const mouse = d3.pointer(event.target);
        const [
            xCoord,
            yCoord,
        ] = mouse;
        console.log(mouse);

        const mouseTime = vis.x.invert(xCoord);

        if (vis.x(mouseTime) < vis.margin.left ||
            vis.x(mouseTime) > vis.width - vis.margin.right) {
            return;
        }

        console.log(mouseTime)

        const bisectTime = d3.bisector(d => d[0]).right;
        const xIndex = bisectTime(vis.density, mouseTime, 1);
        console.log(vis.density[xIndex])
        const mouseDensity = vis.density[xIndex][1];

        svg.selectAll('.hoverLine')
            .attr('x1', vis.x(mouseTime))
            .attr('y1', vis.margin.top)
            .attr('x2', vis.x(mouseTime))
            .attr('y2', vis.height - vis.margin.bottom)
            .attr('stroke', '#147F90')
            .attr('fill', '#A6E8F2')
        ;

        svg.selectAll('.hoverPoint')
            .attr('cx', vis.x(mouseTime))
            .attr('cy', vis.y(mouseTime))
            .attr('r', '7')
            .attr('fill', '#147F90')
        ;

        const isLessThanHalf = xIndex > vis.density.length / 2;
        const hoverTextX = isLessThanHalf ? '-0.75em' : '0.75em';
        const hoverTextAnchor = isLessThanHalf ? 'end' : 'start';

        svg.selectAll('.hoverText')
            .attr('x', vis.x(mouseTime))
            .attr('y', vis.y(mouseDensity))
            .attr('dx', hoverTextX)
            .attr('dy', '-1.25em')
            .style('text-anchor', hoverTextAnchor)
            .text(d3.format('.5s')(mouseDensity));
    };
}