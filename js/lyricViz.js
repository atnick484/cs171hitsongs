class LyricViz {
    constructor (parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = data;
        this.paths = [];
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
            .domain([0, 0.9])
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

    repeat(pathObj, timems) {
        const length = pathObj.node().getTotalLength();
        // Animate the path by setting the initial offset and dasharray and then transition the offset to 0
        pathObj.attr("stroke-dasharray", length + " " + length)
            .attr("stroke-dashoffset", length)
            .transition()
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
            .duration(timems)
            .on("end", () => setTimeout(repeat, 1000)); // this will repeat the animation after waiting 1 second
    }

    updateViz() {
        let vis = this;
        vis.svg.select('.y-axis').call(vis.yAxis)
        vis.svg.select('.x-axis').call(vis.xAxis)

        vis.colors = ['#b9767e', '#6da87f', '#ffa64a']

        vis.decade = d3.select("#decade-box").property("value");
        vis.genre = d3.select("#genre-box").property("value");

        vis.idxPop = (Math.round(vis.decade / 10) - 198) * 9
        vis.idxRap = (Math.round(vis.decade / 10) - 198) * 9 + 3
        vis.idxRock = (Math.round(vis.decade / 10) - 198) * 9 + 6

        vis.displayPop = [vis.displayData.columns.slice(1)[vis.idxPop], vis.displayData.columns.slice(1)[vis.idxPop + 1], vis.displayData.columns.slice(1)[vis.idxPop + 2]];
        vis.displayRap = [vis.displayData.columns.slice(1)[vis.idxRap], vis.displayData.columns.slice(1)[vis.idxRap + 1], vis.displayData.columns.slice(1)[vis.idxRap + 2]];
        vis.displayRock = [vis.displayData.columns.slice(1)[vis.idxRock], vis.displayData.columns.slice(1)[vis.idxRock + 1], vis.displayData.columns.slice(1)[vis.idxRock + 2]]

        // Add the links
        let pathSelect = vis.svg
            .selectAll('.mylinks')
            .data(vis.displayData)
            .enter();

        vis.displayData.columns.slice(1).forEach(function (songName, index) {
            if (vis.genre == 'pop' && (index == vis.idxPop || index == vis.idxPop + 1 || index == vis.idxPop + 2)) {
                let line = d3.line()
                    .curve(d3.curveBasis)
                    .x(d => vis.x(d.percent))
                    .y(d => vis.y(d[songName]))
                let path = pathSelect
                    .append("path")
                    .datum(vis.displayData)
                    .attr("class", "line")
                    .attr("d", line(vis.displayData))
                    .style("fill", "none")
                    .attr('stroke-width', "10px")
                    .style("opacity", 0.05)
                    .attr("stroke", function (d) {
                        return vis.colors[index - vis.idxPop]
                    });

                vis.paths.push(path);
            }
            else if (vis.genre == 'rap' && (index == vis.idxRap || index == vis.idxRap + 1 || index == vis.idxRap + 2)) {
                let line = d3.line()
                    .curve(d3.curveBasis)
                    .x(d => vis.x(d.percent))
                    .y(d => vis.y(d[songName]))
                let path = pathSelect
                    .append("path")
                    .datum(vis.displayData)
                    .attr("class", "line")
                    .attr("d", line(vis.displayData))
                    .style("fill", "none")
                    .attr('stroke-width', "10px")
                    .style("opacity", 0.05)
                    .attr("stroke", function (d) {
                        return vis.colors[index - vis.idxRap]
                    });

                vis.paths.push(path);
            }
            else if (vis.genre == 'rock' && (index == vis.idxRock || index == vis.idxRock + 1 || index == vis.idxRock + 2)) {
                let line = d3.line()
                    .curve(d3.curveBasis)
                    .x(d => vis.x(d.percent))
                    .y(d => vis.y(d[songName]))
                let path = pathSelect
                    .append("path")
                    .datum(vis.displayData)
                    .attr("class", "line")
                    .attr("d", line(vis.displayData))
                    .style("fill", "none")
                    .attr('stroke-width', "10px")
                    .style("opacity", 0.05)
                    .attr("stroke", function (d) {
                        return vis.colors[index - vis.idxRock]
                    });

                vis.paths.push(path);
            }
            else {
                console.log('issue')
            }

            // vis.repeat(path, 10000);


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


        if (vis.genre == 'pop') {
            // legend
            vis.svg.selectAll("mylabels")
                .data(vis.displayPop)
                .enter()
                .append("text")
                .attr("x", vis.width - 350 + 20)
                .attr("y", function(d,i){ return 100 + i*25 - 125}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function(d, i){ return vis.colors[i]})
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

            vis.svg.selectAll("mydots")
                .data(vis.displayPop)
                .enter()
                .append("rect")
                .attr("x", vis.width - 350)
                .attr("y", function(d,i){ return 100 + i*25 - 7 - 125}) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("height", 15)
                .attr("width", 15)
                .style("fill", function(d, i){ return vis.colors[i]})
        }
        else if (vis.genre == 'rap') {
            // legend
            vis.svg.selectAll("mylabels")
                .data(vis.displayRap)
                .enter()
                .append("text")
                .attr("x", vis.width - 350 + 20)
                .attr("y", function(d,i){ return 100 + i*25 - 125}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function(d, i){ return vis.colors[i]})
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

            vis.svg.selectAll("mydots")
                .data(vis.displayRap)
                .enter()
                .append("rect")
                .attr("x", vis.width - 350)
                .attr("y", function(d,i){ return 100 + i*25 - 7 - 125}) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("height", 15)
                .attr("width", 15)
                .style("fill", function(d, i){ return vis.colors[i]})
        }
        else if (vis.genre == 'rock') {
            // legend
            vis.svg.selectAll("mylabels")
                .data(vis.displayRock)
                .enter()
                .append("text")
                .attr("x", vis.width - 350 + 20)
                .attr("y", function(d,i){ return 100 + i*25 - 125}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function(d, i){ return vis.colors[i]})
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

            vis.svg.selectAll("mydots")
                .data(vis.displayRock)
                .enter()
                .append("rect")
                .attr("x", vis.width - 350)
                .attr("y", function(d,i){ return 100 + i*25 - 7 - 125}) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("height", 15)
                .attr("width", 15)
                .style("fill", function(d, i){ return vis.colors[i]})
        }
        // // legend
        // vis.svg.selectAll("mylabels")
        //     .data(vis.displayData.columns.slice(1))
        //     .enter()
        //     .append("text")
        //     .attr("x", vis.width - 350 + 20)
        //     .attr("y", function(d,i){ return 100 + i*25 - 125}) // 100 is where the first dot appears. 25 is the distance between dots
        //     .style("fill", function(d, i){ return vis.colors[i]})
        //     .text(function(d){ return d})
        //     .attr("text-anchor", "left")
        //     .style("alignment-baseline", "middle")
        //
        // vis.svg.selectAll("mydots")
        //     .data(vis.displayData.columns.slice(1))
        //     .enter()
        //     .append("rect")
        //     .attr("x", vis.width - 350)
        //     .attr("y", function(d,i){ return 100 + i*25 - 7 - 125}) // 100 is where the first dot appears. 25 is the distance between dots
        //     .attr("height", 15)
        //     .attr("width", 15)
        //     .style("fill", function(d, i){ return vis.colors[i]})


    }
}