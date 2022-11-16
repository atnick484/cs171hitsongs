
// Variables for the visualization instances
let genreViz;
<<<<<<< HEAD
let dateFormatter = d3.timeFormat("%d/%m/%Y");
let dateParser = d3.timeParse("%d/%m/%Y");
=======
let lyricViz;
>>>>>>> 73e289ee03d5746cebb8f231704c64129a8d43d6
let selectBox = "default";

// Start application by loading the data
loadData();

function loadData() {
<<<<<<< HEAD
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
    d3.json("data/data.json").then(data_genres=>{

        d3.csv("data/sentiment_sample_happiness.csv", row => {
            row.percent = +row.percent;
            row.song1 = parseFloat(row.song1);
            row.song2 = parseFloat(row.song2);
            return row;
        }).then(data_sentiment=>{

            // prepare data
            console.log(data_genres);

            genreViz = new GenreViz("genreViz", data_genres);
            genreViz.initViz();

            lyricViz = new LyricViz("lyricViz", data_sentiment);
            lyricViz.initViz();

            // prepare data
            console.log(data_sentiment);


        });


    });
}


// function updateVisualization() {
//     selectBox = d3.select("#select-box").property("value");
//     genreViz.updateVis();
// }