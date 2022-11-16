
// Variables for the visualization instances
let genreViz;
let dateFormatter = d3.timeFormat("%d/%m/%Y");
let dateParser = d3.timeParse("%d/%m/%Y");
let selectBox = "default";

// Start application by loading the data
loadData();

function loadData() {
    // d3.csv("data/chart_with_genres_8950.csv", row => {
    //     row.weeks_on_board = parseInt(row.weeks_on_board);
    //     row.rank = parseInt(row.rank);
    //     return row;
    // }).then(data=>{
    //
    //     // prepare data
    //     console.log(data);
    //
    //     genreViz = new GenreViz("genreViz", data)
    //     genreViz.initViz();
    //
    //
    // });
    d3.json("data/data.json").then(data=>{
        // prepare data
        console.log(data);

        genreViz = new GenreViz("genreViz", data)
        genreViz.initViz();


    });
}


// function updateVisualization() {
//     selectBox = d3.select("#select-box").property("value");
//     genreViz.updateVis();
// }