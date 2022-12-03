class wordTreeViz {
    constructor (parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];

        this.colors = ['#b9767e', '#6da87f', '#ffa64a'];
    }

    initViz() {
        let vis = this;

        vis.margin = {top: 30, right: 20, bottom: 60, left: 40};

        // Set width and height to the height of the parent element - margins
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right; // NEW!!
        vis.height = 1000 - vis.margin.top - vis.margin.bottom;//document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom; // NEW!!

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

        // Declares a tree layout and assigns the size
        vis.treemap = d3.tree().size([vis.width / 1.5, vis.height/3]).separation(function (a, b) {
            return a.parent === b.parent ? 200 : 200;
        });

        vis.wrangleData();

    }

    wrangleData() {
        let vis = this;


        let tree = new Tree();

        let lyric = vis.data[1]['lyrics_text'];
        document.getElementById("lyricContainer").innerText = lyric;
        for (let i = 0; i < 10; i++) {
            let lyric = vis.data[i]['lyrics_text']
            let lyrics = lyric.split(" ");
            for (let i = 0; i < lyrics.length; i++) {
                tree.addNode(lyrics.slice(i, lyrics.length));
            }
        }

        tree.sortTree();


        console.log("tree", tree);

        vis.displayData = tree.root.children[0];

        // word extraction if child nodes are equal to 1
        // how can i combine the words together
        // it might be better to just do it when constructing the tree

        // how tf can we actually do this
        // go through each string basically
        function extractWord(node) {
            if (node.children !== null && node.children.length === 1) {
                node.word += " " + node.children[0].word
                node.children = node.children[0].children
                if (node.word.split(" ").length > 20) {
                    node.children = []
                }
                extractWord(node)
            } else if (node.children !== null && node.children.length > 1) {
                for (let child of node.children) {
                    extractWord(child)
                }
            } else {
                return 0
            }
        }
        //console.log(vis.displayData);
        extractWord(vis.displayData);
        // // make a recursive function to go through each of the child nodes too
        // for (let i = 0; i < vis.displayData.children.length;i++) {
        //     extractWord(vis.displayData.children[i])
        //     // console.log(vis.displayData.children[i].children.length);
        // //     let child_children = vis.displayData.children[i].children;
        // //     if (child_children.length === 1) {
        // //         vis.displayData.children[i].children = [];
        // //     }
        // }

        let nodes = d3.hierarchy(vis.displayData, d => d.children);
        nodes = vis.treemap(nodes);

        vis.data = nodes.descendants().filter(d => d.depth < 8);

        vis.updateViz();

    }

    updateViz() {
        let vis = this;

        console.log("nodes", vis.data);

        const node = vis.svg.selectAll(".node")
            .data(vis.data)
            .enter().append("g")
            .attr("class", d => "node" + (d.children ? " node--internal"
                : " node--leaf"))
            .attr("transform", d => "translate(" + d.y + "," +
                d.x + ")");

        const link = vis.svg.selectAll(".link")
            .data(vis.data.slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr("d", d => {
                return "M" + d.y + "," + d.x
                    + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                    + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                    + " " + d.parent.y + "," + d.parent.x;
            });

        node.append("circle")
            .attr("r", d => 1)
            .style("fill", "black");

        node.append("text")
            .attr("class", "tree")
            .attr("dy", ".35em")
            .attr("x", 0)
            .attr("y", 0)
            .text(function (d) {
                return d.data.word;
            });
    }
}

class Node {
    constructor(parent, word) {
        this.parent = parent;
        this.word = word;
        this.children = [];
    }

    contains(word) {
        for (let child of this.children) {
            if (child.word === word) {
                return child;
            }
        }
        return null;
    }
}

class Tree {
    constructor(string) {
        this.root = new Node(null, string);
    }

    addNode(strings) {
        let rootNode = this.root;
        for (let string of strings) {
            let test = rootNode.contains(string);
            if (test !== null) {

                // add to the child node of test
                rootNode = test;
                continue
            }
            let child = new Node(rootNode, string);
            rootNode.children.push(child);
            rootNode = child;
        }
    }

    sortTree() {
        this.root.children.sort(function (a, b) {
            return b.children.length - a.children.length;
        })
    }
}