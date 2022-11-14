class GenreViz {
    constructor (parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];
    }

    initViz() {
        let vis = this;

        vis.margin = {top: 80, right: 20, bottom: 40, left: 20};

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

        console.log(d3.max(this.data, d => d.weeks_on_board));
        // axes and legends
        vis.x = d3.scaleSqrt()
            .domain([0, d3.max(this.data, d => d.weeks_on_board)])
            .range([0, vis.width])

        vis.y = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d.peak_rank)])
            .range([0, vis.height])

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
        this.displayData = this.data.slice(0,1000);

        this.displayData.sort( function(a,b) {
            return a.weeks_on_board - b.weeks_on_board;
        });

        this.displayData = this.displayData.filter(d => d.peak_rank < 70);

        vis.updateViz();

    }

    updateViz() {
        let vis = this;
        vis.svg.select('.y-axis').call(vis.yAxis)
        vis.svg.select('.x-axis').call(vis.xAxis)

        console.log(this.displayData);
        // Add the links
        vis.svg
            .selectAll('.mylinks')
            .data(vis.displayData)
            .enter()
            .append('path')
            .attr('class', 'mylinks')
            .attr('d', function (d) {
                let start = vis.x(0);    // X position of start node on the X axis
                let startY = vis.y(d.peak_rank);
                let end = vis.x(d.weeks_on_board) ;     // X position of end node
                return vis.curve([[start, startY], [(start + end) / 2, startY / 1.25], [end, vis.y(99)]]);
             })
            .style("fill", "none")
            .attr('stroke-width', "2px")
            .attr("stroke", function (d) {
                if (d.genres.includes('pop')) {
                    return '#b9767e'
                } else if (d.genres.includes('rap')) {
                    return "#6da87f"
                } else {
                    return '#3f6969'
                }
            });

    }
}