let width = 800, height = 800;

let svg = d3.select("svg")
    .attr("viewBox", "0 0 " + width + " " + height)

// Load external data
Promise.all([d3.json("links-sample.json"), d3.json("cases-sample.json")]).then(data => {

    // Data preprocessing
    data[0].forEach(e => {
        e.source = e.infector;
        e.target = e.infectee;
    });

    

    console.log(data[0]); //links
    console.log(data[1]); //cases


    // Setup Drag functions
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        // if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }


    // Color for male and female nodes
    let colorScale = d3.scaleOrdinal()
        .domain([0, 1])
        .range(["steelblue", "pink"]);

    console.log(colorScale(1))

    // Add in circles
    // var pattern_def = svg.append("defs");
    let node = svg.append("g")
        .attr("id", "nodes")
        .selectAll("circle")
        .data(data[1])
        .enter()
        .append("circle")
        .attr("r", 10)
        // .style("fill", "steelblue")
        .style("fill", d => { if (d.gender == 'male') { return colorScale(0) } else { return colorScale(1) } })
        .attr("fill", "url(#image)")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("mouseover", (event, d) => {
            d3.select(".tooltip")
                .html("Age: " + d.age + "<br>Gender: " + d.gender.charAt(0).toUpperCase() + "<br>Nationality: " + d.nationality + "<br>Occupation: " + d.occupation + "<br>Organization: " + d.organization + "<br>Vaccination Status: " + d.vaccinated)
                .style("position", "absolute")
                .style("background", "#fff")
                .style("font-size", "25px")
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY) + "px")
                .style("border", "solid")
                .style("border-width", "3px")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("opacity", 1);

            let path = d3.select(event.currentTarget)
            path.style("stroke", "orange").style("stroke-width", 2);
        })
        .on("mouseout", (event, d) => {
            d3.select(".tooltip")
                .text("")
                .style("opacity", 0);

            let path = d3.select(event.currentTarget)
            path.style("stroke", "#fff").style("stroke-width", 0.5);
        });


    // make groups
    // var node = svg.selectAll(".node")
    //     .data(data[1])
    //     .enter().append("g");

    // node
    //     .attr("id", "nodes")
    //     .append("circle")
    //     .attr("r", 10)
    //     .style("fill", d => { if (d.gender == 'male') { return colorScale(0) } else { return colorScale(1) } })
    //     .call(d3.drag()
    //         .on("start", dragstarted)
    //         .on("drag", dragged)
    //         .on("end", dragended)
    //     )


    // Adding image href for nodes
    node.append("image")
        .data(data[1])
        .attr("xlink:href", d => { if (d.gender == 'male') { return "icons/male.svg" } else { return "icons/female.svg" } })
        .attr("width", 15)
        .attr("height", 15)
        .attr("pointer-events", "none");


    // Link Strcuture
    // let xPosition = d3.scaleOrdinal()
    //     .domain([0, 1, 2])
    //     .range([150, 650]);

    let xPosition = d3.scaleOrdinal()
        .domain([0, 1, 2])
        .range([150, 400, 650]);

    let linkpath = svg.append("g")
        .attr("id", "links")
        .selectAll("path")
        .data(data[0])
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "black");


    let simulation = d3.forceSimulation()
        .nodes(data[1])
        .force("x", d3.forceX().strength(0.5).x(d => xPosition(d.class)))
        .force("y", d3.forceY().strength(0.01).y(height / 2))
        // .force("link", d3.forceLink(links).id(d => d.id))
        .force("link", d3.forceLink(data[0])
            .id(d => d.id)
            .distance(50)
            .strength(0.5))
        .force("charge", d3.forceManyBody().strength(-15)) // Charge Determines whether each nodes attract or reject each other
        .force("collide", d3.forceCollide().strength(0.1).radius(15))
        .on("tick", d => {

            // node
            //     // .attr("cx", d => d.x)
            //     // .attr("cy", d => d.y)
            //     .attr("transform", function (d) {
            //         return "translate(" + d.x + "," + d.y + ")";
            //     })

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            linkpath
                .attr("d", d => "M" + d.source.x + "," + d.source.y + " " + d.target.x + "," + d.target.y);

            // image
            //     .attr("x", d => d.x - 7.5)
            //     .attr("y", d => d.y - 7.5);

        });

    let vaccinationScale = d3.scaleOrdinal()
        .domain([0, 1, 2])
        .range([100, 300, 600]);

    
    // Sort by Vaccination status
    var i = 0
    data[1].forEach(d => {
        if (i < 10) {
            d.class = 0
        } else {
            d.class = 1
        }
        i++
    })
   
    d3.select("#group1").on("click", function () {
        simulation
            .nodes(data[1])
            .force("x", d3.forceX().strength(0.1).x(d => xPosition(d.class)))
            .force("y", d3.forceY().strength(0.1).y(100))
            .alphaTarget(0.3)
            .restart();
    })

})