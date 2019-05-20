//  Tim Verlaan
//  11691328
//  Displaying Json data in HTML Canvas

window.onload = function(){
    loadData()
  };

function loadData(){

    var datafile = "result2.json";

    d3.json(datafile).then(function(data) {
        console.log(data);
        
        drawBar(data)
    });
}

function drawBar(data){
    // create the SVG (dimensions in sinc with the x and y axis)
    var svg = d3.select("body").append("svg").attr("width", "960").attr("height", "500");     
    
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
        // .domain(data.map(function (d) { return d.country; }))
        .domain([0, 50])
        .range([0, w]);

    var yScale = d3.scaleLinear()
        .domain([0, 20])             // data is normalized
        .range([h, 0]);
    
    var ColourScale = d3.scaleLinear()
        .domain([0.25, 0.6])        // make the bar colour go from blue to black
        .range([0, 255])

    var tip = d3.tip()              // displays data when hovering
        .attr('class', 'd3-tip')
        .offset([-20, 0])
        .html(function(d) {
            return "<strong>GINI Value:</strong> <span style='color:red'>" + d.country + "</span>";
        })    

        svg.call(tip);        

    console.log(data[Object.keys(data)[1]])

    g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")       // make hover
        .attr("width", (w / data.length - barPadding))
        .attr("x", function(d)
        {             
            return xScale(d.country);
        })     
        // .attr("fill", function(d) {
        //     return "rgb(0, 0, " + ColourScale(d.Value) + ")"; // minus smallest value to have get a nice spectrum
        // })
        .attr("y", function(d) {
            return yScale(d.country.length); //Height minus data value
        })      
        .attr("height", function(d)
        {
            return  h - yScale(d.country.length);
        })         
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)       // make dynamic

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

}