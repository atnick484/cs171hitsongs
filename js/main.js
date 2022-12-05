// Variables for the visualization instances
let genreViz, wordTree, lyricViz, durationViz, tempoViz, repetitionMatrix;

let songData;
let lyricData;
let myChorusLines;
let myDuration;
let myTempo;
let myRepetitiveness;
let firstSelection = true;
// let myReadability = getScores(myChorusLines.join(' '));
// let myUniqueness = calculateTFIDF(myChorusLines);

let dateFormatter = d3.timeFormat("%d/%m/%Y");
let dateParser = d3.timeParse("%d/%m/%Y");

let selectBox = "all";
let selectBox2 = 'love';
let selectBox3 = 1;

let durationGenres = {
    'pop': 0.2967372499160073,
    'rap': 0.2665232064116793,
    'rock': 0.2659479192314834
};

let repetitivenessGenres = {
    'pop': 0.2967372499160073,
    'rap': 0.2665232064116793,
    'rock': 0.2659479192314834
};

let readabilityGenres = {
    'pop': 0.5259932773108245,
    'rap': 0.5337738281249558,
    'rock': 0.5850028985507277
};

let uniquenessGenres = {
    'pop': 0.20255929429143196,
    'rap': 0.2025261539447777,
    'rock': 0.22668782240691968
};


d3.select("#genre-box").on('change', updateVisualization);

d3.select("#decade-box").on('change', updateVisualization2);

d3.select("#song-box").on('change', updateVisualization3);

d3.select("#play-button1").on('click', playLyricVis1);

d3.select("#stop-button1").on('click', stopLyricVis1);

d3.select("#submit-chorus-button").on('click', chorusWritten);

d3.select("#submit-duration-tempo").on('click', updateVisualization4);



// Start application by loading the data
loadData();
// createRadarChart();

function loadData() {
    Promise.all([
        d3.csv("data_scrape/genre_viz_data.csv", row => {
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
    songData = data;
    console.log(songData);

    let choruses = [];
    songData.forEach(song => choruses.push(song.chorus));
    console.log(choruses);

    // console.log(calculateRepetitiveness(choruses[0]));
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
    let num = 0;
    if (selectBox2 !== 'love') {
        if (selectBox === "pop") {
            num = (Math.round(selectBox2 / 10) - 198) * 9;
        } else if (selectBox === "rap") {
            num = (Math.round(selectBox2 / 10) - 198) * 9 + 3;
        } else {
            num = (Math.round(selectBox2 / 10) - 198) * 9 + 6;
        }
        document.getElementById('song1').innerHTML = lyricData[num].song + " by " + lyricData[num].artist;
        document.getElementById('song1').setAttribute('value', num);
        document.getElementById('song2').innerHTML = lyricData[num + 1].song + " by " + lyricData[num + 1].artist;
        document.getElementById('song2').setAttribute('value', num + 1);
        document.getElementById('song3').innerHTML = lyricData[num + 2].song + " by " + lyricData[num + 2].artist;
        document.getElementById('song3').setAttribute('value', num + 2);
        updateVisualization3();
    }

    if (selectBox == 'pop') {
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
    document.getElementById('song1').innerHTML = lyricData[num].song + " by " + lyricData[num].artist;
    document.getElementById('song1').setAttribute('value', num);
    document.getElementById('song2').innerHTML = lyricData[num + 1].song + " by " + lyricData[num + 1].artist;
    document.getElementById('song2').setAttribute('value', num + 1);
    document.getElementById('song3').innerHTML = lyricData[num + 2].song + " by " + lyricData[num + 2].artist;
    document.getElementById('song3').setAttribute('value', num + 2);

    updateVisualization3();

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
    if (firstSelection) {
        firstSelection = false;
        d3.csv("data/df_positivity_all_processed.csv", row => {
            row.percent = +row.percent;
            return row;
        }).then(data_sentiment => {


            lyricViz = new LyricViz("lyricViz", data_sentiment);
            lyricViz.initViz();


        });
    } else {
        lyricViz.svg.selectAll("*").remove();
        lyricViz.updateViz();
    }

    let csv_string = "data_scrape/chart_" + selectBox2.toString() + "_" + d3.select("#genre-box").property("value") + ".csv"

    d3.csv(csv_string, row => {
        row.duration_ms = parseFloat(row.duration_ms) / 1000;
        row.tempo = parseFloat(row.tempo);
        return row;
    }).then(data_specific => {

        document.getElementById('frequencyInstructions').innerHTML =
            "We plotted the distribution of song durations and tempos for all " + d3.select("#genre-box").property("value") + " songs from the " + selectBox2.toString() + "s!"

        console.log("Hello")
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
        let index = songData.map(song => Object.values(song)[0].song).indexOf(inputBox.value);
        document.getElementById("repetition-matrix").innerHTML = "";
        repetitionMatrix = new RepetitionMatrix("repetition-matrix", ['tooltip-line-1', 'tooltip-line-2'], 'similarity', songData[index][index]);
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

function chorusWritten(){
    let myChorus = document.getElementById("chorusTextArea").value;
    myChorusLines = myChorus.split(/\r?\n|\r|\n/g);
    console.log(myChorusLines);
    myRepetitiveness = calculateRepetitiveness(myChorusLines);
    document.getElementById('repetition-matrix-mine').innerHTML = '';
    let myRepetitionMatrix = new RepetitionMatrix('repetition-matrix-mine', ['tooltip-line-1-mine', 'tooltip-line-2-mine'],  'similarity-mine', {'chorus': myChorusLines})
}

function updateVisualization4(){
    myDuration = durationViz.getChosenDuration()[0];
    myTempo = tempoViz.getChosenTempo()[0];
    console.log(myDuration);
    console.log(myTempo);
    createRadarChart();
}

function createRadarChart() {
    //Data
    var data = [
        {
            className: 'germany', // optional, can be used for styling
            axes: [
                {axis: "strength", value: 13, yOffset: 10},
                {axis: "intelligence", value: 6},
                {axis: "charisma", value: 5},
                {axis: "dexterity", value: 9},
                {axis: "luck", value: 2, xOffset: -20}
            ]
        },
        {
            className: 'argentina',
            axes: [
                {axis: "strength", value: 6},
                {axis: "intelligence", value: 7},
                {axis: "charisma", value: 10},
                {axis: "dexterity", value: 13},
                {axis: "luck", value: 9}
            ]
        }
    ];

    let chart = RadarChart.chart();
    var svg = d3.select('body').append('svg')
        .attr('width', 600)
        .attr('height', 800);

// draw one
    svg.append('g').classed('focus', 1).datum(data).call(chart);

// draw many radars
    var game = svg.selectAll('g.game').data(
        [
            data,
            data,
            data,
            data
        ]
    );
    game.enter().append('g').classed('game', 1);
    game
        .attr('transform', function(d, i) { return 'translate(150,600)'; })
        .call(chart);

    // retrieve config
    chart.config();
// all options with default values
    chart.config({
        containerClass: 'radar-chart', // target with css, the default stylesheet targets .radar-chart
        w: 600,
        h: 600,
        factor: 0.95,
        factorLegend: 1,
        levels: 3,
        maxValue: 0,
        minValue: 0,
        radians: 2 * Math.PI,
        color: d3.scale.category10(), // pass a noop (function() {}) to decide color via css
        axisLine: true,
        axisText: true,
        circles: true,
        radius: 5,
        open: false,  // whether or not the last axis value should connect back to the first axis value
                      // if true, consider modifying the chart opacity (see "Style with CSS" section above)
        axisJoin: function(d, i) {
            return d.className || i;
        },
        tooltipFormatValue: function(d) {
            return d;
        },
        tooltipFormatClass: function(d) {
            return d;
        },
        transitionDuration: 300
    });
}

function calculateRepetitiveness(chorus) {

    async function createSimilarityArray() {
        let embeddings = await use.load().then(model => {
            return model.embed(chorus);
        });
        let embeddingsArray = embeddings.arraySync();
        console.log(embeddingsArray);

        let similarityArray = Array(embeddingsArray.length).fill().map(() => Array(embeddingsArray.length));
        let lineIndices = [...Array(embeddingsArray.length).keys()];
        const dot = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
        for (let i in lineIndices) {
            for (let j in lineIndices) {
                similarityArray[i][j] = dot(embeddingsArray[i], embeddingsArray[j]);
                if (similarityArray[i][j] > 0.99) {
                    similarityArray[i][j] = 1;
                }
            }
        }

        let countNotIdentity = Math.pow(similarityArray.length, 2) - similarityArray.length;
        let repetitiveness = 0;

        let arrayIndices = [...Array(similarityArray.length).keys()];
        for (let row in arrayIndices) {
            for (let col in arrayIndices) {
                if (row != col) {
                    repetitiveness += similarityArray[row][col] / countNotIdentity;
                }
            }
        }
        console.log(similarityArray);

        repetitiveness = Math.round(repetitiveness * 100) / 100
        if (repetitiveness > 1) {
            repetitiveness = 1;
        } else if (repetitiveness < 0) {
            repetitiveness = 0;
        }
        console.log("Repetitiveness:", repetitiveness);
        return repetitiveness;
    }

    createSimilarityArray();
}

// function calculateTFIDF(chorus) {
//     // let text = chorus.join(' ');
//     // console.log(text);
//     //
//     // const totalWords = [
//     //     ...new Set(
//     //         review.flatMap((a) =>
//     //             a.text.split(" ").filter((a) => stopwords.indexOf(a) === -1)
//     //         )
//     //     ),
//     // ];
// }