
// Variables for the visualization instances
let genreViz;
let dateFormatter = d3.timeFormat("%d/%m/%Y");
let dateParser = d3.timeParse("%d/%m/%Y");
let lyricViz;
let selectBox = "pop";
let selectBox2 = 'love'

d3.select("#genre-box").on('change', updateVisualization);

d3.select("#theme-box").on('change', updateVisualization2);

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

function updateVisualization() {
    selectBox = d3.select("#genre-box").property("value");
    let textContainer = document.getElementById('genreTextContainer');
    if (selectBox != 'none') {
        textContainer.style.display = 'block';
    }
    let textPop = document.getElementById('genreTextPop');
    let textRock = document.getElementById('genreTextRock');
    let textRap = document.getElementById('genreTextRap');
    if (selectBox == 'pop') {
        console.log(selectBox)
        textPop.style.display = 'block';
        textRock.style.display = 'none';
        textRap.style.display = 'none';
    }
    else if (selectBox == 'rock') {
        textPop.style.display = 'none';
        textRock.style.display = 'block';
        textRap.style.display = 'none';
    }
    else if (selectBox == 'rap') {
        textPop.style.display = 'none';
        textRock.style.display = 'none';
        textRap.style.display = 'block';
    }
    // console.log(selectBox);
    genreViz.updateViz();
}

function updateVisualization2() {
    selectBox2 = d3.select("#theme-box").property("value");

    let textLove = document.getElementById('themeTextLove');
    let textHeartbreak = document.getElementById('themeTextHeartbreak');
    let textParty = document.getElementById('themeTextParty');
    let textFeels = document.getElementById('themeTextFeels');

    let textContainer = document.getElementById('themeTextContainer');
    if (selectBox2 != 'none') {
        textContainer.style.display = 'block';
    }

    if (selectBox2 == 'love') {
        textLove.style.display = 'block';
        textHeartbreak.style.display = 'none';
        textParty.style.display = 'none';
        textFeels.style.display = 'none';
    }
    else if (selectBox2 == 'heartbreak') {
        textLove.style.display = 'none';
        textHeartbreak.style.display = 'block';
        textParty.style.display = 'none';
        textFeels.style.display = 'none';
    }
    else if (selectBox2 == 'party') {
        textLove.style.display = 'none';
        textHeartbreak.style.display = 'none';
        textParty.style.display = 'block';
        textFeels.style.display = 'none';
    }
    else if (selectBox2 == 'feels') {
        textLove.style.display = 'none';
        textHeartbreak.style.display = 'none';
        textParty.style.display = 'none';
        textFeels.style.display = 'block';
    }
}