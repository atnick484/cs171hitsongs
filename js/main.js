
// Variables for the visualization instances
let genreViz;
let lyricViz;
let selectBox = "default";

// Start application by loading the data
loadData();

function loadData() {
    d3.csv("data/chart_with_genres_14000_full.csv", row => {
        row.weeks_on_board = parseInt(row.weeks_on_board);
        return row;
    }).then(data_genres=>{

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