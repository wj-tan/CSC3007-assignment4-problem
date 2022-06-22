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

})