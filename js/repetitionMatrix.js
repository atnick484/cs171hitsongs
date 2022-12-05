class RepetitionMatrix {
    constructor (parentElement, song) {
        this.parentElement = parentElement;
        this.song = song;
        this.displayData = [];

        this.initVis();
    }

    initVis() {
        let vis = this;

        // Color definitions
        vis.lowColor = "#88BA99";
        vis.highColor = "#1DB954";

        vis.margin = {top: 20, right: 0, bottom: 20, left: 0};

        // Set width and height to the height of the parent element - margins
        vis.width = Math.min(512, document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right);
        vis.height = vis.width + vis.margin.top + vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.boxSize = vis.width / vis.song.chorus.length;

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }

    wrangleData() {

        let vis = this;

        let chorus = vis.song.chorus;

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
            vis.displayData = {
                'song': vis.song.song,
                'artist': vis.song.artist,
                'chorus': vis.song.chorus,
                'similarityArray': similarityArray,
            };

            vis.updateVis();
        }

        createSimilarityArray();
    }

    updateVis() {
        let vis = this;

        console.log("displayData", vis.displayData);

        let countNotIdentity = Math.pow(vis.displayData.similarityArray.length, 2) - vis.displayData.similarityArray.length;
        let repetitiveness = 0;

        let arrayIndices = [...Array(vis.displayData.similarityArray.length).keys()];
        let yPos = vis.margin.top;
        for (let row in arrayIndices) {
            let xPos = vis.margin.left;
            for (let col in arrayIndices) {
                vis.svg.append("rect")
                    .attr("x", xPos)
                    .attr("y", yPos)
                    .attr("width", vis.boxSize)
                    .attr("height", vis.boxSize)
                    .style("fill", `rgb(0,${vis.displayData.similarityArray[row][col] * 255},0)`)
                    .on("mouseover", () => {
                        document.getElementById("tooltip-line-1").innerText = `Line ${+row + 1}: ${vis.displayData.chorus[row]}`;
                        document.getElementById("tooltip-line-2").innerText = `Line ${+col + 1}: ${vis.displayData.chorus[col]}`;
                        document.getElementById("similarity").innerText = `Similarity Score: ${Math.round(vis.displayData.similarityArray[row][col] * 100) / 100}`;
                    });

                xPos += vis.boxSize;

                if (row != col) {
                    repetitiveness += vis.displayData.similarityArray[row][col] / countNotIdentity;
                }
            }
            yPos += vis.boxSize;
        }

        repetitiveness = Math.round(repetitiveness * 100) / 100
        if (repetitiveness > 1) {
            repetitiveness = 1;
        } else if (repetitiveness < 0) {
            repetitiveness = 0;
        }
        console.log(repetitiveness);
        return repetitiveness;
    }
}

function createVocab(chorus) {
    let cleanText = chorus.join(' ').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
    let vocab = new Set(cleanText.split(' '));
    return Array.from(vocab);
}

function vectorizeChorus(chorus, wrd2idx) {
    let cleanChorus = chorus.map(line => {
        return line.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
                   .toLowerCase().split(' ')
               .map(token => wrd2idx[token]);
    })
    return cleanChorus;
}

function calculateSimilarityScores(line, chorus) {

}