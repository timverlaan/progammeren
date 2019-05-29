//  Tim Verlaan
//  11691328
//  Displaying Json data in HTML Canvas

window.onload = function(){
    loadData()
  }

function loadData(){

    var datafile = "result1.json";

    d3.json(datafile).then(function(data){
        
        drawBar(data)
        
        drawPie(data);
    });
}

function drawBar(data){
    // create the SVG (dimensions in sinc with the x and y axis)
    var svg = d3.select("#bar")
                .append("svg")
                .attr("width", "1260")
                .attr("height", "500");     
    
    // set margins for inner g element 
    var margin = 
            {
                top: 35,
                right: 20,
                bottom: 50,
                left: 50
            }
    var w = +svg.attr("width") - margin.left - margin.right;
    var h = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
    const barPadding = 1;

    // make seperate bins for every country
    var xScale = d3.scaleBand()     
                   .domain(data.map(function (d) { return d.country; }))
                   .range([0, w]);

    var yScale = d3.scaleLinear()
                   .domain([0, 30])             
                   .range([h, 0]);

    // displays data when hovering
    var tip = d3.tip()              
                .attr('class', 'd3-tip')
                .offset([-20, 0])
                .html(function(d) {
                    fullCountry = toCountryName(d.country)
                    return "<strong>Country:</strong> <span style='color:red'>" + fullCountry + "</span>";
                })    

    svg.call(tip);        

    // build bar chart, standard color black is suitable for death  
    // (Removed colour scale in consultation with Sander, was not adding anything)
    g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")       
        .attr("width", (w / data.length - barPadding))
        .attr("x", function(d){             
            return xScale(d.country);
        })     
        .attr("y", function(d){
            return yScale(d.lengthList); 
        })      
        .attr("height", function(d){
            return  h - yScale(d.lengthList);
        })         
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)       
        .on('click', function(d){
            updatePie(d)
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
                "translate(" + (w / 2) + " ," + 
                    (h + margin.top ) + ")")
        .style("text-anchor", "middle")
        .text("Country");
            
    // text label for the y axis
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (h / 2))
        .attr("dy", "1em")
        .attr("id", "info")
        .style("text-anchor", "middle")
        .text("Number of Journalists killed"); 

    // text label for the title
    g.append("text")   
        .attr("id", "title")
        .attr("transform",
                "translate(" + (w / 2) + " ," + 
                    (-10) + ")")
        .style("text-anchor", "middle")
        .text("Journalists Killed in Foreign Countries 1994 - 2019");

}

var updatePie;

function drawPie(data){

    // on first load, load afghanistan
    let dataset = Array.isArray(data) ? data[0] : data;
    
    // set the dimensions and margins of the graph
    var widthPC = 450,
        heightPC = 450,
        marginPC = 10

    // The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
    var radius = Math.min(widthPC, heightPC) / 2 - marginPC

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select("#pie")
                .append("svg")
                    .attr("width", widthPC)
                    .attr("height", heightPC)
                .append("g")
                .attr("transform", "translate(" + widthPC / 2 + "," + heightPC / 2 + ")");

    // Compute the position of each group on the pie:
    var pie = d3.pie()
                .value(function(d){ return color(d.data); });

    var pie = d3.pie()
                .value(function(d){ return d.value; });

    let dataPie = {'Male': dataset.pieChart[0].value, 'Female': dataset.pieChart[1].value}
    
    data_ready = pie(d3.entries(dataPie));   
    
    // shape helper to build arcs:
    var arcGenerator = d3.arc()
                         .innerRadius(0)
                         .outerRadius(radius - 50);

    // set the color scale
    var color = d3.scaleOrdinal()
                  .domain(data_ready)
                  .range(d3.schemeSet2);

    // displays data when hovering
    var tip = d3.tip()              
                .attr('class', 'd3-tip')
                .offset([-20, 0])
                .html(function(d){
                    return "<strong>Killed:</strong> <span style='color:red'>" + d.value + "</span>";
                });    

    svg.call(tip); 

    // make color legend for pie chart
    var legendOrdinal = d3.legendColor()
                            .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
                            .shapePadding(10)
                            //use cellFilter to hide the "e" cell
                            .cellFilter(function(d){ return d.label !== "e" })
                            .scale(color);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    var path = svg
                .selectAll('.mySlices')
                .data(data_ready)
                .enter()
                .append('path')
                    .attr('d', arcGenerator)
                    .attr('fill', function(d){ 
                        return color((d.data.key)) 
                    })
                    .attr("stroke", "black")
                    .attr("class", "mySlices")
                    .style("stroke-width", "2px")
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide) 

    // make pie chart legend
    svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(120, -240)");    
    
    // call pie chart legend
    svg.select(".legendOrdinal")
        .call(legendOrdinal);

    // Create photo div in a so images are clickable and takes you to journalists page
    d3.select("#photo").selectAll('a')
        .data(dataset.journalists)
        .enter()
        .append('a')   
        .attr('href', function(d){  
            names = d.fullName.split(" ").join("-").toLowerCase();
            // set hyperlink to right format 
            name_link = "https://cpj.org/data/people/" + names + "/index.php";
            return name_link;
        }) 
        .append('img').attr('src', function(d){              
            return d.photoUrl;
        })
        .attr('id', 'img')
        .attr('title', function(d){          
            return d.fullName;
        });

        // title piechart
        svg.append("text")   
            .attr("id", "titlePie")
            .attr("transform",
                    "translate(0 , -170)")
            .attr("dy", "-2em")
            .style("text-anchor", "middle")
            .text("Division Male/Female");


        svg.append("text")
            .attr("id", "titlePie")
            .attr("transform",
                    "translate(0 , -170)")
            .attr("dy", "-1em")
            .style("text-anchor", "middle")
            .text("killed in");

        svg.append("text")
            .attr("id", "titleCountry")
            .attr("transform",
                    "translate(0 , -170)")
            .style("text-anchor", "middle")
            .text(toCountryName(dataset.country));

    
    // update the g element when the slider is used    
    updatePie = function(dataset){

        let dataPie = {'Male': dataset.pieChart[0].value, 'Female': dataset.pieChart[1].value}
        data_ready = pie(d3.entries(dataPie));

        path = path.data(data_ready);

        // smooth transition
        path.transition()
            .duration(750)
            .attrTween("d", arcTween);

        // Store the displayed angles in _current.
        // Then, interpolate from _current to the new angles.
        // During the transition, _current is updated in-place by d3.interpolate.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t, j) {
                return arcGenerator(i(t));
            }
        }

        // remove the images of the previous country
        d3.select("#photo").selectAll('a')
            .remove();

        // update photo div in a so images are clickable and takes you to journalists page
        d3.select("#photo").selectAll('a')
            .data(dataset.journalists)
            .enter()
            .append('a')   
            .attr('href', function(d){  
                names = d.fullName.split(" ").join("-").toLowerCase();
                // set hyperlink to right format 
                name_link = "https://cpj.org/data/people/" + names + "/index.php"
                return name_link
            }) 
            .append('img').attr('src', function(d){              
                return d.photoUrl
            })
            .attr('id', 'img')
            .attr('title', function(d){          
                return d.fullName
            });

        // title piechart
        svg.append("text")   
            .attr("id", "titlePie")
            .attr("transform",
                    "translate(0 , -170)")
            .attr("dy", "-2em")
            .style("text-anchor", "middle")
            .text("Division Male/Female");


        svg.append("text")
            .attr("id", "titlePie")
            .attr("transform",
                    "translate(0 , -170)")
            .attr("dy", "-1em")
            .style("text-anchor", "middle")
            .text("killed in");

        d3.selectAll('#titleCountry')
            .remove();

        svg.append("text")
            .attr("id", "titleCountry")
            .attr("transform",
                    "translate(0 , -170)")
            .style("text-anchor", "middle")
            .text(toCountryName(dataset.country));
    
    }

}
