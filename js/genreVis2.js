class GenreViz {
    constructor (parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];

        this.colors = ['#b9767e', '#6da87f', '#ffa64a', "#000000"];
    }

    initViz() {
        let vis = this;

        vis.margin = {top: 30, right: 20, bottom: 60, left: 40};

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
        vis.x = d3.scaleSqrt()
            .domain([1, 90])
            .range([0, vis.width])

        vis.y = d3.scaleLinear()
            .domain([1, 105])
            .range([0, vis.height])

        // axis
        vis.svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", vis.width / 2)
            .attr("y", vis.height + 40)
            .text("Weeks on Billboard Top 100");

        vis.svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("y", -40)
            .attr("dy", ".75em")
            .attr('x', - vis.height/2)
            .attr("transform", "rotate(-90)")
            .text("Ranking");

        // legend
        vis.svg.selectAll("mylabels")
            .data(["pop", "rap", "rock", "other"])
            .enter()
            .append("text")
            .attr("x", vis.width - 50 + 20)
            .attr("y", function(d,i){ return 500 + i*25 - 125}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d, i){ return vis.colors[i]})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        vis.svg.selectAll("mydots")
            .data(["pop", "rap", "rock", "other"])
            .enter()
            .append("rect")
            .attr("x", vis.width - 50)
            .attr("y", function(d,i){ return 500 + i*25 - 7 - 125}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("height", 15)
            .attr("width", 15)
            .style("fill", function(d, i){ return vis.colors[i]})


        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'genreTooltip')

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


        vis.unique_songs = [];

        vis.displayData = [];
        vis.data.forEach(function (d) {
            let rank = d.rank.reverse();
            let newRank = [];
            d.rank.forEach(function (elt, i) {
                let key = Object.keys(elt)[0];
                newRank.push([i + 1, elt[key]])
            })
            vis.displayData.push({
                song: d.song,
                artist: d.artist,
                genres: d.genre,
                points: newRank
            })
        })

        vis.displayData = vis.displayData.slice(0,50);

        vis.updateViz();

    }

    strokeColor(d) {
        let vis = this;
        if (d.id > 29495) {
            return 'red';
        }
        let alpha = "00"
        if (selectBox === "all") {
            alpha = ""
        }

        if (d.genres.includes('pop')) {
            return (selectBox === "pop") ? vis.colors[0] : vis.colors[0] + alpha;
        } else if (d.genres.includes('rap')) {
            return (selectBox === "rap") ? vis.colors[1] : vis.colors[1] + alpha;
        } else if (d.genres.includes('rock')) {
            return (selectBox === "rock") ? vis.colors[2] : vis.colors[2] + alpha;
        } else {
            return '#00000022';
        }
    }

    updateViz() {
        let vis = this;
        vis.svg.select('.y-axis').transition().call(vis.yAxis)
        vis.svg.select('.x-axis').transition().call(vis.xAxis)

        // Add the links
        let lines = vis.svg
            .selectAll('.mylinks')
            .data(vis.displayData)

        let shadows = vis.svg
            .selectAll('.shadows')
            .data(vis.displayData);

        shadows.enter()
            .append('path')
            .attr('class', 'shadows')
            .attr('d', function (d) {
                let start = vis.x(0);    // X position of start node on the X axis
                let startY = vis.y(d.points[0][1]);
                let end = vis.x(d.weeks_on_board) ;     // X position of end node
                let points = d.points.map(d => {
                    return [vis.x(d[0]), vis.y(d[1])];
                })
                return vis.curve(points);
            })
            .merge(shadows)
            .transition()
            .duration(500)
            .style("fill", "none")
            .attr('stroke-width', "5px")
            .attr("stroke", 'black');

        lines.enter()
            .append('path')
            .attr('class', 'mylinks')
            .attr('d', function (d) {
                let start = vis.x(0);    // X position of start node on the X axis
                let startY = vis.y(d.points[0][1]);
                let end = vis.x(d.weeks_on_board) ;     // X position of end node
                let points = d.points.map(d => {
                    return [vis.x(d[0]), vis.y(d[1])];
                })
                return vis.curve(points);
            })
            .on("mouseover", function (event, d) {
                d3.selectAll('.mylinks').transition().attr('stroke', '#00000033').attr('stroke-width', "3px");
                d3.select(this).transition().attr('stroke', "#1DB954").attr('stroke-width', "8px");

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + 50 + "px")
                    .html(`
                     <div style="border: thin solid grey; border-radius: 5px; background: #212121; padding: 5px; text-align: left">
                         <h3>${d.song}</h3>  
                          <p><b>Artist:</b> ${d.artist}</p> 
                           <p>Weeks on board: ${d.points.length}</p>            
                     </div>`
                    );
            })
            .on("mouseout", function (event, d) {
                d3.selectAll('.mylinks').transition().attr('stroke', j => vis.strokeColor(j)).attr('stroke-width', "3px");

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .merge(lines)
            .transition()
            .duration(500)
            .style("fill", "none")
            .attr('stroke-width', "3px")
            .attr("stroke", d => vis.strokeColor(d))


    }
}

function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'data.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}