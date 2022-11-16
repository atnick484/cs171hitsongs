class GenreViz {
    constructor (parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];
    }

    initViz() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 60, left: 25};

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
            .domain([1, 50])
            .range([0, vis.width])

        vis.y = d3.scaleLinear()
            .domain([1, 100])
            .range([0, vis.height])
        // vis.y = d3.scaleBand()
        //     .domain(["pop", "rock", "rap", "other"])
        //     .range([0, vis.height])

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "y-axis axis")

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr('transform', 'translate(0,' + vis.height + ")")

        vis.curve = d3.line();

        vis.wrangleData();

    }

    wrangleData() {
        let vis = this;
        // this.displayData = this.data;
        //
        // this.displayData.sort( function(a,b) {
        //     return a.weeks_on_board - b.weeks_on_board;
        // });

        // this.displayData = this.displayData.filter(d => d.peak_rank < 70);

        // let unique_songs = [
        //     {
        //         song: "Easy On Me by Adele",
        //         points: [[week_on_board, rank_that_week]],
        //
        // ];
        vis.unique_songs = [];
        // let idx = 0;
        // // need to figure out how to group the data based on each song
        // this.displayData.forEach(function (d) {
        //     let song = d.song + " by " + d.artist;
        //     const found = vis.unique_songs.some(el => el.song === song);
        //     if (!found) {
        //         vis.unique_songs.push({
        //             song: song,
        //             id: idx,
        //             points: [[d.weeks_on_board, d.rank]],
        //             genres: d.genres
        //         })
        //         idx += 1;
        //     } else {
        //         vis.unique_songs.find(obj => obj.song === song).points.push([d.weeks_on_board, d.rank]);
        //         // .push([d.weeks_on_board, d.rank]);
        //     }
        // })
        //
        // console.log("hello", vis.unique_songs);
        //
        // exportToJsonFile(vis.unique_songs);
       // vis.unique_songs = vis.unique_songs.slice(600, 750);

        vis.displayData = vis.data.sort(function (a, b) {
            return a.points.length - b.points.length
        })

        vis.displayData = vis.data.slice(28000, 29680);

        vis.updateViz();

    }

    updateViz() {
        let vis = this;
        vis.svg.select('.y-axis').transition().call(vis.yAxis)
        vis.svg.select('.x-axis').transition().call(vis.xAxis)

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
                let startY = vis.y(d.points[0][1]);
                // let genre = "other";
                // if (d.genres.includes('pop')) {
                //     genre = "pop"
                // } else if (d.genres.includes('rock')) {
                //     genre = "rock"
                // } else if (d.genres.includes('rap')) {
                //     genre = "rap"
                // }
                let end = vis.x(d.weeks_on_board) ;     // X position of end node
                let points = d.points.map(d => {
                    return [vis.x(d[0]), vis.y(d[1])];
                })
                return vis.curve(points);
            })
            .style("fill", "none")
            .attr('stroke-width', "2px")
            .attr("stroke", function (d) {
                if (d.id > 29495) {
                    return 'red';
                }
                if (d.genres.includes('pop')) {
                    return '#b9767e99'
                } else if (d.genres.includes('rap')) {
                    return "#6da87f99"
                } else {
                    return Math.random() < .5 ? '#b9767e22' : "#00000022";
                }
            });

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