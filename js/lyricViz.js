class LyricViz {
    constructor (parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = data;
    }

    initViz() {
        let vis = this;

        vis.margin = {top: 50, right: 20, bottom: 60, left: 50};

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

        // axes and legends
        vis.x = d3.scaleLinear()
            .domain([0, 1])
            .range([0, vis.width])

        vis.y = d3.scaleLinear()
            .domain([-1, 1])
            .range([vis.height, 0])

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "y-axis axis")

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr('transform', 'translate(0,' + vis.height + ")")

        vis.curve = d3.line().curve(d3.curveNatural);

        vis.wrangleData();

    }

    wrangleData() {
        let vis = this;

        vis.updateViz();

    }



    updateViz() {
        let vis = this;
        vis.svg.select('.y-axis').call(vis.yAxis)
        vis.svg.select('.x-axis').call(vis.xAxis)

        console.log(this.displayData);

        // let path = vis.svg.append("path")
        //     .datum(vis.displayData)
        //     .attr("class", "line");

        vis.colors = ['#b9767e', '#6da87f', '#ffa64a']

        // Add the links
        let pathSelect = vis.svg
            .selectAll('.mylinks')
            .data(vis.displayData)
            .enter();

        vis.displayData.columns.slice(1).forEach(function (songName, index) {
            let line = d3.line()
                .curve(d3.curveBasis)
                .x(d => vis.x(d.percent))
                .y(d => vis.y(d[songName]))
            pathSelect
                .append("path")
                .datum(vis.displayData)
                .attr("class", "line")
                .attr("d", line(vis.displayData))
                .style("fill", "none")
                .attr('stroke-width', "10px")
                .style("opacity", 0.05)
                .attr("stroke", function (d) {
                    return vis.colors[index]
                });
        })

        vis.svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", vis.width / 2)
            .attr("y", vis.height + 40)
            .text("Duration Percentage in Song");

        vis.svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("y", -40)
            .attr("dy", ".75em")
            .attr('x', - vis.height/2)
            .attr("transform", "rotate(-90)")
            .text("Positivity Score");


        // legend
        vis.svg.selectAll("mylabels")
            .data(vis.displayData.columns.slice(1))
            .enter()
            .append("text")
            .attr("x", vis.width - 350 + 20)
            .attr("y", function(d,i){ return 100 + i*25 - 125}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d, i){ return vis.colors[i]})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        vis.svg.selectAll("mydots")
            .data(vis.displayData.columns.slice(1))
            .enter()
            .append("rect")
            .attr("x", vis.width - 350)
            .attr("y", function(d,i){ return 100 + i*25 - 7 - 125}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("height", 15)
            .attr("width", 15)
            .style("fill", function(d, i){ return vis.colors[i]})


    }
}