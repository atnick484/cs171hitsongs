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
        vis.height = 700 - vis.margin.top - vis.margin.bottom;//document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom; // NEW!!

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
        vis.treemap = d3.tree().size([vis.height, vis.width/4])
         .separation(function (a, b) {
            return a.parent === b.parent ? 5 : 20;
         })
            // .separation(function(a,b){
            //     return (a.width+b.width)/2+20;
            // });

        vis.wrangleData(selectBox3);

    }

    wrangleData(i) {
        let vis = this;


        let tree = new Tree();

        let lyric = vis.data[i]['lyrics_text'];
        document.getElementById("lyricContainer").innerText = vis.data[i]['lyrics'];
        let lyrics = lyric.split(" ");
        for (let i = 0; i < lyrics.length; i++) {
            tree.addNode(lyrics.slice(i, lyrics.length));
        }

        tree.sortTree();

        vis.displayData = tree.root.children[0];

        // word extraction if child nodes are equal to 1
        function extractWord(node) {
            if (node.children !== null && node.children.length === 1) {
                node.word += " " + node.children[0].word
                node.children = node.children[0].children
                if (node.word.split(" ").length > 10) {
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
        extractWord(vis.displayData);

        let nodes1 = d3.hierarchy(vis.displayData, d => d.children);
        let nodes2 = vis.treemap(nodes1);

        var nodeGroup = vis.svg.selectAll("g.node")
            .data(nodes2)
            .enter().append("text").text(function(d){return d.data.word;});
        // now we knows the text of each node.

        //calculate each nodes's width by getBBox();
        nodeGroup.each(function(d,i){d["width"] = this.getBBox().width;})

        vis.svg.selectAll("*").remove();

        vis.treemap = d3.tree().size([vis.height, vis.width/4])
            .separation(function(a,b){
                return (a.width+b.width)/2+50;
            });
        nodes2 = vis.treemap(nodes1);

        vis.displayData = nodes2.descendants().filter(d => d.depth < 8);

        vis.updateViz();

    }

    updateViz() {
        let vis = this;

        let first = true;
        // vis.displayData.forEach(function(d) {
        //     if (!first) {
        //        // d.parent.y += 10;
        //         d.y += d.parent.width;
        //         d.parent.width = d.y;
        //     }
        //     first = false;
        // });

        const link = vis.svg.selectAll(".link")
            .data(vis.displayData.slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr('fill', 'none')
            .attr('stroke', "#1DB954")
            .attr('stroke-width', '3px')
            .attr("d", (d, i) => {
                let add = 0;
                if (i === 0) {
                    add = d.parent.width;
                }
                return "M" + (d.y) + "," + d.x
                    + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                    + " " + (d.y + d.parent.y)  / 2 + "," + d.parent.x
                    + " " + (d.parent.y) + "," + d.parent.x;
            });

        const node = vis.svg.selectAll(".node")
            .data(vis.displayData)
            .enter().append("g")
            .attr("class", d => "node" + (d.children ? " node--internal"
                : " node--leaf"))
            .attr("transform", function (d,i) {
                return "translate(" + (d.y) + "," +
                    d.x + ")"
            });

        node.append("rect")
            .attr('width', function (d) {
                let len = d.data.word.length;
                if (len < 10) {
                    return d.width + 20
                } else if (len > 10) {
                    return d.width
                }
            })
            .attr('transform', 'translate(-40, -10)')
            .attr('height', "20px")
            .attr('fill', '#212121')
            .attr('stroke', 'black')

        node.append("text")
            .attr("class", "tree")
            .attr('transform', 'translate(-30, 0)')
            .attr("dy", ".35em")
            .attr('fill', '#FAEBD7FF')
            .style("font-size", function (d) {
                let len = d.data.word.length;
                if (len < 10) {
                    return "20px"
                } else if (len > 10) {
                    return "10px"
                }
            })
            .on('mouseover', function (event, d) {
                d3.select(this).attr('fill', "#1DB954");
                var inputText = document.getElementById("lyricContainer");
                var innerHTML = inputText.innerHTML;
                inputText.innerHTML = innerHTML.replaceAll(d.data.word, "<span class='highlight'>"+d.data.word+"</span>");;

            })
            .on('mouseout', function (event, d) {
                d3.select(this).attr('fill', '#FAEBD7FF');
                var inputText = document.getElementById("lyricContainer");
                var innerHTML = inputText.innerHTML;
                inputText.innerHTML = innerHTML.replaceAll(`<span class="highlight">`+d.data.word+"</span>", d.data.word);

            })
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
        this.root.children.forEach(function (d, i) {
            d.children.sort(function (a, b) {
                return b.children.length - a.children.length;
            })
        })
    }
}