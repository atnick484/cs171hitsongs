// Variables for the visualization instances
let genreViz, wordTree, lyricViz, durationViz, tempoViz, repetitionMatrix;

let choruses = [];

let songData;
let lyricData;
let firstSelection = true;
let myChorusLines;

let myDuration;
let myTempo;
let myRepetitiveness;
let myReadability;
let myUniqueness;

let dateFormatter = d3.timeFormat("%d/%m/%Y");
let dateParser = d3.timeParse("%d/%m/%Y");

let selectBox = "all";
let selectBox2 = 'love';
let selectBox3 = 1;

let popData = [
    {axis: 'duration', value: 0.47}, // 104–455
    {axis: 'tempo', value: 0.42}, // 60–206
    {axis: 'repetitiveness', value: 0.297},
    {axis: 'readability', value: 0.526}
    // {axis: 'uniqueness', value: 0.203}
];

let rapData = [
    {axis: 'duration', value: 0.53},
    {axis: 'tempo', value: 0.44},
    {axis: 'repetitiveness', value: 0.267},
    {axis: 'readability', value: 0.534}
    // {axis: 'uniqueness', value: 0.203}
];

let myData = [
    {axis: 'duration', 'value': myDuration},
    {axis: 'tempo', 'value': myTempo},
    {axis: 'repetitiveness', 'value': myRepetitiveness},
    {axis: 'readability', 'value': myReadability}
    // {axis: 'uniqueness', value: myUniqueness}
];

let rockData = [
    {axis: 'duration', value: 0.55},
    {axis: 'tempo', value: 0.44},
    {axis: 'repetitiveness', value: 0.266},
    {axis: 'readability', value: 0.585}
    // {axis: 'uniqueness', value: 0.227}
];




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

// const corpus = new Corpus(
//     songData.map(song => song.song),
//     choruses
// );
// console.log(corpus.getTopTermsForDocument("Blinding Lights by The Weeknd"));

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
        textPop.stysle.display = 'none';
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
    (async () => {
        myRepetitiveness = await calculateRepetitiveness(myChorusLines);
    })();
    console.log("assigned", myRepetitiveness);
    myReadability = getScores(myChorusLines.join(' ')).fleschReadingEase / 100;

    if (myReadability > 1) {
        myReadability = 1;
    } else if (myReadability < 0) {
        myReadability = 0;
    }

    console.log("My Readability:", myReadability);
    // myUniqueness = calculateTFIDF(myChorusLines)
    document.getElementById('repetition-matrix-mine').innerHTML = '';
    let myRepetitionMatrix = new RepetitionMatrix('repetition-matrix-mine', ['tooltip-line-1-mine', 'tooltip-line-2-mine'],  'similarity-mine', {'chorus': myChorusLines})
}

function updateVisualization4(){
    myDuration = Math.max(0, Math.min(1, (durationViz.getChosenDuration()[0] - 60) / 450));
    console.log("My Duration", myDuration);
    myTempo = Math.max(0, Math.min(1, tempoViz.getChosenTempo()[0] / 300));
    console.log("My Tempo", myTempo);

    if (myDuration > 1) {
        myDuration = 1;
    } else if (myDuration < 0) {
        myDuration = 0;
    }
    if (myTempo > 1) {
        myTempo = 1;
    } else if (myTempo < 0) {
        myTempo = 0;
    }

    let nweeks = Math.round(Math.random() * 60)
    let rank = Math.round(Math.random() * 100)
    document.getElementById('finalMessage').innerHTML =
        "Nice work! Based on our calculations, your song will last for " + nweeks.toString() + " weeks on the Billboard Hot 100 and will hit a peak rank of " + rank.toString() + "!"
    console.log([
        {axis: 'duration', 'value': myDuration},
        {axis: 'tempo', 'value': myTempo},
        {axis: 'repetitiveness', 'value': myRepetitiveness},
        {axis: 'readability', 'value': myReadability}
    ]);
    createRadarChart([
        {name: 'Average Pop', axes: popData, color: '#D81B60'},
        {name: 'Average Rap', axes: rapData, color: '#1E88E5'},
        {name: 'Average Rock', axes: rockData, color: '#FFC107'},
        {name: 'My Song', axes: [
                {axis: 'duration', 'value': myDuration},
                {axis: 'tempo', 'value': myTempo},
                {axis: 'repetitiveness', 'value': myRepetitiveness},
                {axis: 'readability', 'value': myReadability}
            ], color: '#004D40'}
    ]);
}

function createRadarChart(data) {

    var margin = { top: 50, right: 80, bottom: 50, left: 80 },
        width = Math.min(700, window.innerWidth / 4) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

    console.log(data[0].color);

    let radarChartOptions = {
        w: 290,
        h: 350,
        margin: margin,
        maxValue: 1,
        levels: 6,
        roundStrokes: true,
        color: d3.scaleOrdinal().range(["#D81B60", "#1E88E5", "#FFC107", '#004D40']),
        format: '.3f',
        legend: { title: 'Ring', translateX: 100, translateY: 40 },
        unit: ''
    };

    // Draw the chart, get a reference the created svg element :
    let svg_radar = RadarChart(".radar-chart", data, radarChartOptions);
}

async function calculateRepetitiveness(chorus) {
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
    console.log("My Repetitiveness:", repetitiveness);
    return repetitiveness;
}

function calculateTFIDF(chorus) {
    let text = chorus.join(' ');
    console.log(text);

    let choruses = [];
    songData.forEach(song => choruses.push(song.chorus));
    const totalWords = [
        ...new Set(
            choruses.forEach(chorus => chorus.join(' ')).map((a) =>
                a.text.split(" ")
            )
        ),
    ];
}

function getScores(text) {

    /*
     * To speed the script up, you can set a sampling rate in words. For example, if you set
     * sampleLimit to 1000, only the first 1000 words will be parsed from the input text.
     * Set to 0 to never sample.
     */
    var sampleLimit = 1000;

    // Manual rewrite of the textstat Python library (https://github.com/shivam5992/textstat/)

    /*
     * Regular expression to identify a sentence. No, it's not perfect.
     * Fails e.g. with abbreviations and similar constructs mid-sentence.
     */
    var sentenceRegex = new RegExp('[.?!]\\s[^a-z]', 'g');

    /*
     * Regular expression to identify a syllable. No, it's not perfect either.
     * It's based on English, so other languages with different vowel / consonant distributions
     * and syllable definitions need a rewrite.
     * Inspired by https://bit.ly/2VK9dz1
     */
    var syllableRegex = new RegExp('[aiouy]+e*|e(?!d$|ly).|[td]ed|le$', 'g');

    // Baseline for FRE - English only
    var freBase = {
        base: 206.835,
        sentenceLength: 1.015,
        syllablesPerWord: 84.6,
        syllableThreshold: 3
    };

    var cache = {};

    var punctuation = ['!','"','#','$','%','&','\'','(',')','*','+',',','-','.','/',':',';','<','=','>','?','@','[',']','^','_','`','{','|','}','~'];

    var legacyRound = function(number, precision) {
        var k = Math.pow(10, (precision || 0));
        return Math.floor((number * k) + 0.5 * Math.sign(number)) / k;
    };

    var charCount = function(text) {
        if (cache.charCount) return cache.charCount;
        if (sampleLimit > 0) text = text.split(' ').slice(0, sampleLimit).join(' ');
        text = text.replace(/\s/g, '');
        return cache.charCount = text.length;
    };

    var removePunctuation = function(text) {
        return text.split('').filter(function(c) {
            return punctuation.indexOf(c) === -1;
        }).join('');
    };

    var letterCount = function(text) {
        if (sampleLimit > 0) text = text.split(' ').slice(0, sampleLimit).join(' ');
        text = text.replace(/\s/g, '');
        return removePunctuation(text).length;
    };

    var lexiconCount = function(text, useCache, ignoreSample) {
        if (useCache && cache.lexiconCount) return cache.lexiconCount;
        if (ignoreSample !== true && sampleLimit > 0) text = text.split(' ').slice(0, sampleLimit).join(' ');
        text = removePunctuation(text);
        var lexicon = text.split(' ').length;
        return useCache ? cache.lexiconCount = lexicon : lexicon;
    };

    var getWords = function(text, useCache) {
        if (useCache && cache.getWords) return cache.getWords;
        if (sampleLimit > 0) text = text.split(' ').slice(0, sampleLimit).join(' ');
        text = text.toLowerCase();
        text = removePunctuation(text);
        var words = text.split(' ');
        return useCache ? cache.getWords = words : words;
    }

    var syllableCount = function(text, useCache) {
        if (useCache && cache.syllableCount) return cache.syllableCount;
        var count = 0;
        var syllables = getWords(text, useCache).reduce(function(a, c) {
            return a + (c.match(syllableRegex) || [1]).length;
        }, 0);
        return useCache ? cache.syllableCount = syllables : syllables;
    };

    var polySyllableCount = function(text, useCache) {
        var count = 0;
        getWords(text, useCache).forEach(function(word) {
            var syllables = syllableCount(word);
            if (syllables >= 3) {
                count += 1;
            }
        });
        return count;
    };

    var sentenceCount = function(text, useCache) {
        if (useCache && cache.sentenceCount) return cache.sentenceCount;
        if (sampleLimit > 0) text = text.split(' ').slice(0, sampleLimit).join(' ');
        var ignoreCount = 0;
        var sentences = text.split(sentenceRegex);
        sentences.forEach(function(s) {
            if (lexiconCount(s, true, false) <= 2) { ignoreCount += 1; }
        });
        var count = Math.max(1, sentences.length - ignoreCount);
        return useCache ? cache.sentenceCount = count : count;
    };

    var avgSentenceLength = function(text) {
        var avg = lexiconCount(text, true) / sentenceCount(text, true);
        return legacyRound(avg, 2);
    };

    var avgSyllablesPerWord = function(text) {
        var avg = syllableCount(text, true) / lexiconCount(text, true);
        return legacyRound(avg, 2);
    };

    var avgCharactersPerWord = function(text) {
        var avg = charCount(text) / lexiconCount(text, true);
        return legacyRound(avg, 2);
    };

    var avgLettersPerWord = function(text) {
        var avg = letterCount(text, true) / lexiconCount(text, true);
        return legacyRound(avg, 2);
    };

    var avgSentencesPerWord = function(text) {
        var avg = sentenceCount(text, true) / lexiconCount(text, true);
        return legacyRound(avg, 2);
    };

    var fleschReadingEase = function(text) {
        var sentenceLength = avgSentenceLength(text);
        var syllablesPerWord = avgSyllablesPerWord(text);
        return legacyRound(
            freBase.base -
            freBase.sentenceLength * sentenceLength -
            freBase.syllablesPerWord * syllablesPerWord,
            2
        );
    };

    var fleschKincaidGrade = function(text) {
        var sentenceLength = avgSentenceLength(text);
        var syllablesPerWord = avgSyllablesPerWord(text);
        return legacyRound(
            0.39 * sentenceLength +
            11.8 * syllablesPerWord -
            15.59,
            2
        );
    };

    var smogIndex = function(text) {
        var sentences = sentenceCount(text, true);
        if (sentences >= 3) {
            var polySyllables = polySyllableCount(text, true);
            var smog = 1.043 * (Math.pow(polySyllables * (30 / sentences), 0.5)) + 3.1291;
            return legacyRound(smog, 2);
        }
        return 0.0;
    };

    var colemanLiauIndex = function(text) {
        var letters = legacyRound(avgLettersPerWord(text) * 100, 2);
        var sentences = legacyRound(avgSentencesPerWord(text) * 100, 2);
        var coleman = 0.0588 * letters - 0.296 * sentences - 15.8;
        return legacyRound(coleman, 2);
    };

    var automatedReadabilityIndex = function(text) {
        var chars = charCount(text);
        var words = lexiconCount(text, true);
        var sentences = sentenceCount(text, true);
        var a = chars / words;
        var b = words / sentences;
        var readability = (
            4.71 * legacyRound(a, 2) +
            0.5 * legacyRound(b, 2) -
            21.43
        );
        return legacyRound(readability, 2);
    };

    var linsearWriteFormula = function(text) {
        var easyWord = 0;
        var difficultWord = 0;
        var roughTextFirst100 = text.split(' ').slice(0,100).join(' ');
        var plainTextListFirst100 = getWords(text, true).slice(0,100);
        plainTextListFirst100.forEach(function(word) {
            if (syllableCount(word) < 3) {
                easyWord += 1;
            } else {
                difficultWord += 1;
            }
        });
        var number = (easyWord + difficultWord * 3) / sentenceCount(roughTextFirst100);
        if (number <= 20) {
            number -= 2;
        }
        return legacyRound(number / 2, 2);
    };

    var rix = function(text) {
        var words = getWords(text, true);
        var longCount = words.filter(function(word) {
            return word.length > 6;
        }).length;
        var sentencesCount = sentenceCount(text, true);
        return legacyRound(longCount / sentencesCount, 2);
    };

    var readingTime = function(text) {
        var wordsPerSecond = 4.17;
        // To get full reading time, ignore cache and sample
        return legacyRound(lexiconCount(text, false, true) / wordsPerSecond, 2);
    };

    // Build textStandard
    var grade = [];
    var obj = {};
    (function() {

        // FRE
        var fre = obj.fleschReadingEase = fleschReadingEase(text);
        if (fre < 100 && fre >= 90) {
            grade.push(5);
        } else if (fre < 90 && fre >= 80) {
            grade.push(6);
        } else if (fre < 80 && fre >= 70) {
            grade.push(7);
        } else if (fre < 70 && fre >= 60) {
            grade.push(8);
            grade.push(9);
        } else if (fre < 60 && fre >= 50) {
            grade.push(10);
        } else if (fre < 50 && fre >= 40) {
            grade.push(11);
        } else if (fre < 40 && fre >= 30) {
            grade.push(12);
        } else {
            grade.push(13);
        }

        // FK
        var fk = obj.fleschKincaidGrade = fleschKincaidGrade(text);
        grade.push(Math.floor(fk));
        grade.push(Math.ceil(fk));

        // SMOG
        var smog = obj.smogIndex = smogIndex(text);
        grade.push(Math.floor(smog));
        grade.push(Math.ceil(smog));

        // CL
        var cl = obj.colemanLiauIndex = colemanLiauIndex(text);
        grade.push(Math.floor(cl));
        grade.push(Math.ceil(cl));

        // ARI
        var ari = obj.automatedReadabilityIndex = automatedReadabilityIndex(text);
        grade.push(Math.floor(ari));
        grade.push(Math.ceil(ari));

        // LWF
        var lwf = obj.linsearWriteFormula = linsearWriteFormula(text);
        grade.push(Math.floor(lwf));
        grade.push(Math.ceil(lwf));

        // RIX
        var rixScore = obj.rix = rix(text);
        if (rixScore >= 7.2) {
            grade.push(13);
        } else if (rixScore < 7.2 && rixScore >= 6.2) {
            grade.push(12);
        } else if (rixScore < 6.2 && rixScore >= 5.3) {
            grade.push(11);
        } else if (rixScore < 5.3 && rixScore >= 4.5) {
            grade.push(10);
        } else if (rixScore < 4.5 && rixScore >= 3.7) {
            grade.push(9);
        } else if (rixScore < 3.7 && rixScore >= 3.0) {
            grade.push(8);
        } else if (rixScore < 3.0 && rixScore >= 2.4) {
            grade.push(7);
        } else if (rixScore < 2.4 && rixScore >= 1.8) {
            grade.push(6);
        } else if (rixScore < 1.8 && rixScore >= 1.3) {
            grade.push(5);
        } else if (rixScore < 1.3 && rixScore >= 0.8) {
            grade.push(4);
        } else if (rixScore < 0.8 && rixScore >= 0.5) {
            grade.push(3);
        } else if (rixScore < 0.5 && rixScore >= 0.2) {
            grade.push(2);
        } else {
            grade.push(1);
        }

        // Find median grade
        grade = grade.sort(function(a, b) { return a - b; });
        var midPoint = Math.floor(grade.length / 2);
        var medianGrade = legacyRound(
            grade.length % 2 ?
                grade[midPoint] :
                (grade[midPoint-1] + grade[midPoint]) / 2.0
        );
        obj.medianGrade = medianGrade;

    })();

    obj.readingTime = readingTime(text);

    return obj;
};