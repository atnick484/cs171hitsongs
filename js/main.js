
// Variables for the visualization instances
let genreViz, wordTree, lyricViz;
let dateFormatter = d3.timeFormat("%d/%m/%Y");
let dateParser = d3.timeParse("%d/%m/%Y");
let selectBox = "pop";
let selectBox2 = 'love';

d3.select("#genre-box").on('change', updateVisualization);

d3.select("#decade-box").on('change', updateVisualization2);

d3.select("#play-button1").on('click', playLyricVis1);

d3.select("#stop-button1").on('click', stopLyricVis1);

// Start application by loading the data
loadData();

function loadData() {
    d3.json("data/data.json").then(data_genres=>{

        d3.csv("data/df_positivity_2010_pop_processed.csv", row => {
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

            lyrics = "";

            d3.csv("data_scrape/chart_with_lyrics_genres_split_1.csv", row => {
                return row
            }).then(lyric_data => {
                wordTree = new wordTreeViz("wordTreeViz", lyric_data);
                wordTree.initViz();
            })

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
    selectBox2 = d3.select("#decade-box").property("value");

    let decade1980 = document.getElementById('decade1980');
    let decade1990 = document.getElementById('decade1990');
    let decade2000 = document.getElementById('decade2000');
    let decade2010 = document.getElementById('decade2010');
    let decade2020 = document.getElementById('decade2020');

    let textContainer = document.getElementById('decadeTextContainer');
    if (selectBox2 != 'none') {
        textContainer.style.display = 'block';
    }

    if (selectBox2 == 1980) {
        decade1980.style.display = 'block';
        decade1990.style.display = 'none';
        decade2000.style.display = 'none';
        decade2010.style.display = 'none';
        decade2020.style.display = 'none';
    }
    else if (selectBox2 == 1990) {
        decade1980.style.display = 'none';
        decade1990.style.display = 'block';
        decade2000.style.display = 'none';
        decade2010.style.display = 'none';
        decade2020.style.display = 'none';
    }
    else if (selectBox2 == 2000) {
        decade1980.style.display = 'none';
        decade1990.style.display = 'none';
        decade2000.style.display = 'block';
        decade2010.style.display = 'none';
        decade2020.style.display = 'none';
    }
    else if (selectBox2 == 2010) {
        decade1980.style.display = 'none';
        decade1990.style.display = 'none';
        decade2000.style.display = 'none';
        decade2010.style.display = 'block';
        decade2020.style.display = 'none';
    }
    else if (selectBox2 == 2020) {
        decade1980.style.display = 'none';
        decade1990.style.display = 'none';
        decade2000.style.display = 'none';
        decade2010.style.display = 'none';
        decade2020.style.display = 'block';
    }
}

function playLyricVis1() {
    let audio = document.getElementById("audio1");
    audio.play();
    lyricViz.paths.forEach(function (pathObj, index) {
        lyricViz.repeat(pathObj, 187000);
    })
}

function stopLyricVis1() {
    let audio = document.getElementById("audio1");
    audio.pause();
    lyricViz.updateViz();
}
