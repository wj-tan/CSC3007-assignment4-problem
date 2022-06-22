let width = 800, height = 800;

let svg = d3.select("svg")
    .attr("viewBox", "0 0 " + width + " " + height)

let xPosition = d3.scaleOrdinal()
    .domain([0, 1, 2])
    .range([150, 400, 650]);

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


    // Add in circles
    let node = svg.append("g")
        .attr("id", "nodes")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 10)
        // .style("fill", "steelblue")
        .style("fill", d => colorScale(d.class))
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));


    let simulation = d3.forceSimulation()
        .nodes(data)
        .force("x", d3.forceX().strength(0.5).x(d => xPosition(d.class)))
        .force("y", d3.forceY().strength(0.1).y(height / 2))
        // .force("link", d3.forceLink(links).id(d => d.id))
        .force("link", d3.forceLink(links)
            .id(d => d.id)
            .distance(50)
            .strength(0.5))
        .force("charge", d3.forceManyBody().strength(-15)) // Charge Determines whether each nodes attract or reject each other
        .force("collide", d3.forceCollide().strength(0.1).radius(15))

})