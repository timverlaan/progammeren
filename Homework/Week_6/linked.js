//  Tim Verlaan
//  11691328
//  Displaying Json data in HTML Canvas

window.onload = function(){
    loadData()
  };

function loadData(){

    var datafile = "result1.json";

    d3.json(datafile).then(function(data) {
        console.log(data);
        
        drawBar(data)
    });
}

function drawBar(data){
    // create the SVG (dimensions in sinc with the x and y axis)
    var svg = d3.select("body").append("svg").attr("width", "1260").attr("height", "500");     
    
    // set margins for inner g element 
    var margin = 
            {
            top: 35,
            right: 20,
            bottom: 50,
            left: 50
            };
    var w = +svg.attr("width") - margin.left - margin.right;
    var h = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
    var barPadding = 1

    var xScale = d3.scaleBand()     // make seperate bins for every country
        .domain(data.map(function (d) { return d.country; }))
        // .domain([0, 50])
        .range([0, w]);

    var yScale = d3.scaleLinear()
        .domain([0, 30])             // data is normalized
        .range([h, 0]);
    
    var ColourScale = d3.scaleLinear()
        .domain([0, 27])        // make the bar colour go from blue to black
        .range([0, 255])

    var tip = d3.tip()              // displays data when hovering
        .attr('class', 'd3-tip')
        .offset([-20, 0])
        .html(function(d) {
            return "<strong>Country:</strong> <span style='color:red'>" + d.country + "</span>";
        })    

        svg.call(tip);        

    g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")       // make hover
        .attr("width", (w / 42 - barPadding))
        .attr("x", function(d)
        {             
            return xScale(d.country);
        })     
        .attr("fill", function(d) {
            return "rgb(0, 0, " + ColourScale(d.lengthList) + ")"; // minus smallest value to have get a nice spectrum
        })
        .attr("y", function(d) {
            return yScale(d.lengthList); //Height minus data value
        })      
        .attr("height", function(d)
        {
            return  h - yScale(d.lengthList);
        })         
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)       // make dynamic
        .on('click', function(d){
            drawPie(d)
        })

    // Add x-axis
    g.append("g")
        .attr("class", "axis-x")
        .attr("transform", "translate(0," + h  + ")")
        .call(d3.axisBottom(xScale));
    
    // Add y-axis
    g.append("g")
        .attr("class", "axis-y")
        .attr("y", h)
        .call(d3.axisLeft(yScale));
        
    // text label for the x axis
    g.append("text")   
        .attr("id", "info")
        .attr("transform",
                "translate(" + (w/2) + " ," + 
                    (h + margin.top ) + ")")
        .style("text-anchor", "middle")
        .text("Country");
            
    // text label for the y axis
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (h / 2))
        .attr("dy", "1em")
        .attr("id", "info")
        .style("text-anchor", "middle")
        .text("Number of Journalists killed"); 

    // text label for the x axis
    g.append("text")   
        .attr("id", "title")
        .attr("transform",
                "translate(" + (w/2) + " ," + 
                    (-20) + ")")
        .style("text-anchor", "middle")
        .text("Journalists Killed in Foreign Countries");

    drawPie(data);

            // update the g element when the slider is used    
    function update(data){

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
    
    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
    .selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return color((d.data.key)) })
        // .attr('fill', 'blue')
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
    .selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('text')
        .text(function(d){ 
            // console.log(d.data.key) 
            return  d.data.key})
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", 17)


    }
};

function drawPie(data){

    let dataset = Array.isArray(data) ? data[0] : data
    console.log(dataset);
    // set the dimensions and margins of the graph
    var widthPC = 450
        heightPC = 450
        marginPC = 10

    // The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
    var radius = Math.min(widthPC, heightPC) / 2 - marginPC

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select("body")
        .append("svg")
            .attr("width", widthPC)
            .attr("height", heightPC)
        .append("g")
        .attr("transform", "translate(" + widthPC / 2 + "," + heightPC / 2 + ")");

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .value(function(d) { return color(d.data); })

    var pie = d3.pie()
        .value(function(d) {return d.value; })
    // var data_ready = pie(d3.entries(data['pieChart']))

    let t = {'Male': dataset.pieChart[0].value, 'Female': dataset.pieChart[1].value}
    data_ready = pie(d3.entries(t))
    // Now I know that group A goes from 0 degrees to x degrees and so on.   
    
    // shape helper to build arcs:
    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    // set the color scale
    var color = d3.scaleOrdinal()
        .domain(data_ready)
        .range(d3.schemeSet2);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
    .selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return color((d.data.key)) })
        // .attr('fill', 'blue')
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
    .selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('text')
        .text(function(d){ 
            // console.log(d.data.key) 
            return  d.data.key})
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", 17)

}

