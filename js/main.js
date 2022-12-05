// Variables for the visualization instances
let genreViz, wordTree, lyricViz, durationViz, tempoViz, repetitionMatrix;

let songData;
let lyricData;

let dateFormatter = d3.timeFormat("%d/%m/%Y");
let dateParser = d3.timeParse("%d/%m/%Y");

let selectBox = "all";
let selectBox2 = 'love';
let selectBox3 = 1;


d3.select("#genre-box").on('change', updateVisualization);

d3.select("#decade-box").on('change', updateVisualization2);

d3.select("#song-box").on('change', updateVisualization3);

d3.select("#play-button1").on('click', playLyricVis1);

d3.select("#stop-button1").on('click', stopLyricVis1);



// Start application by loading the data
loadData();

function loadData() {
    Promise.all([
        d3.csv("data_scrape/genre_viz_data.csv", row => {
            // console.log(row.rank);
            let newRank = row.rank.replaceAll("{", "");
            newRank = newRank.replaceAll("}", "");
            newRank = "[{" + newRank + "}]";
            newRank = newRank.replaceAll(',', '}, {');
            newRank = newRank.replaceAll("'", '"')
            row.rank = JSON.parse(newRank);
            return row;
        }),
    ]).then(function(files) {


        genreViz = new GenreViz("genreViz", files[0]);
        genreViz.initViz();


            // lyrics = "";


            d3.csv("data/positivity_on_selection.csv", row => {
                return row
            }).then(lyric_data => {
                lyricData = lyric_data;
                wordTree = new wordTreeViz("wordTreeViz", lyric_data);
                wordTree.initViz();
            })
        });
    };


d3.json("data/all_songs.json", row => {
    row.chorus = eval(row.chorus);
    return row
}).then(data => {
    songData = Object.entries(data).map((song) => ( { [song[0]]: song[1] } ));
});

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
    let num = 0;
    if (selectBox === "pop") {
        num = (Math.round( selectBox2 / 10) - 198) * 9
    } else if (selectBox === "rap") {
        num = (Math.round( selectBox2 / 10) - 198) * 9 + 3
    } else {
        num = (Math.round( selectBox2 / 10) - 198) * 9 + 6
    }
    document.getElementById('song1').innerHTML = lyricData[num].song
    document.getElementById('song1').setAttribute('value', num)
    document.getElementById('song2').innerHTML = lyricData[num + 1].song
    document.getElementById('song2').setAttribute('value', num + 1)
    document.getElementById('song3').innerHTML = lyricData[num + 2].song
    document.getElementById('song3').setAttribute('value', num + 2)

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
    d3.csv("data/df_positivity_all_processed.csv", row => {
        row.percent = +row.percent;
        return row;
    }).then(data_sentiment=>{


        lyricViz = new LyricViz("lyricViz", data_sentiment);
        lyricViz.initViz();


    });
    // lyricViz.updateViz();

    let csv_string = "data_scrape/chart_" + selectBox2.toString() + "_" + d3.select("#genre-box").property("value") + ".csv"

    d3.csv(csv_string, row => {
        row.duration_ms = parseFloat(row.duration_ms) / 1000;
        row.tempo = parseFloat(row.tempo);
        return row;
    }).then(data_specific=> {
        console.log(data_specific);

        document.getElementById('frequencyInstructions').innerHTML =
            "We plotted the distribution of song durations and tempos for all " + d3.select("#genre-box").property("value") + " songs from the " + selectBox2.toString() + "s!"

        durationViz = new DurationViz("durationViz", data_specific);
        durationViz.initViz();

        tempoViz = new TempoViz("tempoViz", data_specific);
        tempoViz.initViz();

    })
}

function select(element) {
    let selectData = element.textContent;
    inputBox.value = selectData.trim();
    icon.onclick = () => {
        console.log(inputBox.value);
        let index = songData.map(song => Object.values(song)[0].song).indexOf(inputBox.value);
        console.log(songData[index][index]);
        document.getElementById("repetition-matrix").innerHTML = "";
        repetitionMatrix = new RepetitionMatrix("repetition-matrix", songData[index][index]);
    }
    searchWrapper.classList.remove("active");
}

function updateVisualization3() {
    selectBox3 = d3.select("#song-box").property("value");

    wordTree.svg.selectAll("*").remove();
    wordTree.wrangleData(parseInt(selectBox3));
}

function playLyricVis1() {

    let times = [
        224000,
        207000,
        246000,
        241000,
        258000,
        334000,
        234000,
        209000,
        196000,
        246000,
        202000,
        246000,
        180000,
        253000,
        175000
    ]

    let names = [
        "Physical by Olivia Newton-John",
        "You Be Illin' by Run-D.M.C.",
        "I Hate Myself For Loving You by Joan Jett & the Blackhearts",
        "All I Want For Christmas Is You by Mariah Carey",
        "I Get Around by 2Pac",
        "Always by Bon Jovi",
        "Love Story by Taylor Swift",
        "Heartless by Kanye West",
        "Beverly Hills by Weezer",
        "Rolling In The Deep by Adele",
        "Super Bass by Nicki Minaj",
        "Love Remains The Same by Gavin Rossdale",
        "Heat Waves by Glass Animals",
        "I Like It by Cardi B, Bad Bunny & J Balvin",
        "Shy Away by twenty one pilots",
    ]

    let sequence = [0, 2, 0, 0, 2, 0, 1, 0, 1, 0, 1, 2, 2, 0, 2]

    let decade = d3.select("#decade-box").property("value");
    let genre = d3.select("#genre-box").property("value");
    let aux_num;
    if (genre == 'pop') {
        aux_num = 1;
    }
    else if (genre == 'rap') {
        aux_num = 2;
    }
    else {
        aux_num = 3;
    }
    let audioNumber = (Math.round(decade / 10) - 198) * 3 + aux_num;
    let audioString = "audio" + audioNumber.toString();
    let audio = document.getElementById(audioString);
    audio.play();
    // lyricViz.paths.forEach(function (pathObj, index) {
    lyricViz.repeat(lyricViz.paths[sequence[audioNumber-1]], times[audioNumber-1]);
    // })
}

function stopLyricVis1() {
    let decade = d3.select("#decade-box").property("value");
    let genre = d3.select("#genre-box").property("value");
    let aux_num;
    if (genre == 'pop') {
        aux_num = 1;
    }
    else if (genre == 'rap') {
        aux_num = 2;
    }
    else {
        aux_num = 3;
    }
    let audioNumber = (Math.round(decade / 10) - 198) * 3 + aux_num;
    let audioString = "audio" + audioNumber.toString();
    let audio = document.getElementById(audioString);
    audio.pause();
    lyricViz.updateViz();
}

// function createRadarChart() {
//
// }
