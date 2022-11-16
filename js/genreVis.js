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
        vis.x = d3.scaleLinear()
            // .domain([dateParser("1/1/57"), d3.max(this.data, d => d.date)])
            .domain([0, 60])
            .range([0, vis.width])

        vis.y = d3.scaleLinear()
            .domain([0, 1])
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
        this.displayData = this.data;

        // this.displayData.sort( function(a,b) {
        //     return a.date - b.date;
        // });
        vis.years = d3.group(this.displayData, (d) => d.date.slice(0, 4));


        vis.years = Array.from(vis.years);

        vis.years.sort(function (a,b) {
            return parseInt(a[0]) - parseInt(b[0])
        })

        vis.percentages = [];

        for (let i =0; i < 4; i++) {
            vis.percentages.push([]);
        }

        console.log(vis.years);
        // get percentage of each genre per year
        vis.years.forEach(function (el) {
            let song_array = el[1];
            let len = song_array.length;
            let popCount = 0;
            let rapCount = 0;
            let rockCount = 0;
            let otherCount = 0;
            song_array.forEach(function (d) {
                if (d.genres.includes('pop')) {
                    popCount += 1;
                } else if (d.genres.includes('rap')) {
                    rapCount += 1;
                } else if (d.genres.includes('rock')) {
                    rockCount += 1;
                } else {
                    otherCount += 1;
                }
            })

            let popPercentage = Math.random()//popCount / len;
            let rapPercentage = Math.random()//rapCount / len;
            let rockPercentage = Math.random(); //rockCount / len;
            let otherPercentage = Math.random(); // otherCount / len;


            vis.percentages[0].push(popPercentage);
            vis.percentages[1].push(rapPercentage);
            vis.percentages[2].push(rockPercentage);
            vis.percentages[3].push(otherPercentage);
        })

        console.log(vis.percentages);

        vis.updateViz();

    }

    updateViz() {
        let vis = this;
        vis.svg.select('.y-axis').transition().call(vis.yAxis)
        vis.svg.select('.x-axis').transition().call(vis.xAxis)

        console.log(this.displayData);
        // Add the lines
        vis.svg
            .selectAll('.mylines')
            .data(vis.percentages)
            .enter()
            .append('path')
            .attr('class', 'mylines')
            .attr('d', function (d, i) {
                console.log(d);
                let points = d.map((el,j) => [vis.x(j), vis.y(el)])
                console.log("points", points)
                return vis.curve(points);
            })
            .style("fill", "none")
            .attr('stroke-width', "2px")
            .attr("stroke", function (d) {
                // if (d.genres !== null) {
                //     if (d.genres.includes('pop')) {
                //         return '#b9767e99'
                //     } else if (d.genres.includes('rap')) {
                //         return "#6da87f99"
                //     } else {
                //         return '#3f696999'
                //     }
                // }
                return 'black'
            });


    }
}