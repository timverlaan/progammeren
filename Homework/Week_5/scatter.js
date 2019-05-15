//  Tim Verlaan
//  11691328
//  Displaying Json data in HTML Canvas

window.onload = function(){
    loadData()
  };

function loadData(){

    // load in the APIs
    var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017"
    var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017"
    var GDP = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions"
    var requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(GDP)];

    // handle asyncronity 
    Promise.all(requests).then(function(response){

        var teenArea = transformResponse(response[0]);        
        var teenPreg = transformResponse(response[1]);
        var GDPData = transformResponse1(response[2]);

        drawScatter(teenArea, teenPreg, GDPData);        
    }).catch(function(e){
        throw(e);
    });
        
}

function transformResponse(data){

    // Save data
    let originalData = data;

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output object, an object with each country being a key and an array
    // as value
    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["Time"] = obs.name;
                tempObj["Datapoint"] = data[0];
                tempObj["Indicator"] = originalData.structure.dimensions.series[1].values[0].name;

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else {
                  dataObject[tempObj["Country"]].push(tempObj);
                };
            }
        });
    });

    // return the finished product!
    return dataObject;
}

function transformResponse1(data){

    // Save data
    let originalData = data;

    // access data
    let dataHere = data.dataSets[0].observations;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.observation;
    let seriesLength = series.length;

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        observation.values.forEach(function(obs, index){
            let data = dataHere[string];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                // split string into array of elements seperated by ':'
                let tempString = string.split(":")
                tempString.forEach(function(s, index){
                    tempObj[varArray[index].name] = varArray[index].values[s].name;
                });

                tempObj["Datapoint"] = data[0];

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else if (dataObject[tempObj["Country"]][dataObject[tempObj["Country"]].length - 1]["Year"] != tempObj["Year"]) {
                    dataObject[tempObj["Country"]].push(tempObj);
                };

            }
        });
    });

    // return the finished product!
    return dataObject;
}

function drawScatter(teenArea, teenPreg, GDPData){

    // create the SVG (dimensions in sinc with the x and y axis)
    var svg = d3.select("body").append("svg").attr("width", "800").attr("height", "600");     
    var teenArea = teenArea;
    var teenPreg = teenPreg;
    var GDPData = GDPData;
    var dataset = mergeData(teenArea, teenPreg, GDPData);
    
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

    // set X scale 
    var xScale = d3.scaleLinear()     
        .domain([0,20])
        .range([0, w]);

    // set Y scale
    var yScale = d3.scaleLinear() 
        .domain([0, 15])   
        .range([h, 0]);
    
    // set color scale based on min and max GDP values
    var colorScale = d3.scaleLinear()
        .domain([21000, 42000])        
        .range([255, 0]);
    
    //  make tip display country, x and y coordinate when hovering       
    var tip = d3.tip()              
        .attr('class', 'd3-tip')
        .offset([-20, 0])
        .html(function(d){
            return "<strong>Country:</strong> <strong><span style='color:red'>" + d + ' ' + '(' + dataset['Adolescent fertility rates'][d][updater] + ' , ' + dataset['Children (0-17) living in areas with problems with crime or violence (%)'][d][updater] + ')' + "</span></strong>";
        });    

        svg.call(tip); 

    // source of legend: https://d3-legend.susielu.com/#color
    var linearColor = d3.scaleLinear()
        .domain([20,40])
        .range(["rgb(20,130,255)", "rgb(20,130,0)"]);
    
    var legendLinear = d3.legendColor()
        .shapeWidth(30)
        .title("GDP in Thousands")
        .labelFormat(d3.format(".0f"))
        .orient('horizontal')
        .scale(linearColor);

    // Add x-axis
    g.append("g")
        .attr("class", "axis-x")
        .attr("transform", "translate(0," + h  + ")")
        .attr("x", w)
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
        .text("Adolescent fertility rates (%)");
            
    // text label for the y axis
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (h / 2))
        .attr("dy", "1em")
        .attr("id", "info")
        .style("text-anchor", "middle")
        .text("Children living in crime or violence areas (%)"); 

    // text label for the title
    g.append("text")   
        .attr("id", "title")
        .attr("transform",
                "translate(" + (w/2) + " ," + 
                    (-20) + ")")
        .style("text-anchor", "middle")
        .text("Fertility Rate & Living Standards of Teens in Mediterranean Countries");

    // add legend to g element
    g.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(580,20)");

    g.select(".legendLinear")
        .call(legendLinear);

    // initiate the updater
    var updater = 0;

    // draw the first set of data points in the g element
    g.selectAll("circle")
        // set the country arrays as the d value
        .data(Object.keys(dataset[Object.keys(dataset)[0]])) 
        .enter()
        .append("circle")
        .attr("cy", function(d){
            let pointsY = dataset['Adolescent fertility rates'][d][updater];
            return yScale(pointsY);
        })
        .attr("cx", function(d){
            let pointsX = dataset["Children (0-17) living in areas with problems with crime or violence (%)"][d][updater];
            return xScale(pointsX);
        })
        .attr("r", 10)
        .attr("fill", function(d) {
            return "rgb(20,130, " + colorScale(dataset["Gross domestic product (expenditure approach)"][d][updater]) + ")" })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);  
        
        // make slider display the year it is selecting
        var slider = document.getElementById("myRange");
        var output = document.getElementById("year");
        output.innerHTML = slider.value;

        slider.oninput = function(){
        output.innerHTML = this.value;
        // call update function if slider is used
        update(Object.keys(dataset[Object.keys(dataset)[0]]), output.innerHTML)
        };

    // update the g element when the slider is used    
    function update(data, output){
        g.selectAll("circle")
            .attr("cy", function(d){
                let pointsY = dataset['Adolescent fertility rates'][d][updater];
                return yScale(pointsY);
            })
            .attr("cx", function(d){
                let pointsX = dataset["Children (0-17) living in areas with problems with crime or violence (%)"][d][updater];
                return xScale(pointsX);
            })
            .attr("r", 10)
            .attr("fill", function(d) {
                return "rgb(20,130, " + colorScale(dataset["Gross domestic product (expenditure approach)"][d][updater]) + ")" 
            })

        // value of output is 'year' but updater needs to start at 0
        updater = (output - 2012)
        } 
        
};

function mergeData(teenArea, teenPreg, GDPData){

    // set up output object, an object with each country being a key and an array
    // as value
    var dataPoints = []

    // list with countries and years I want to use
    let countries = ["Croatia", "Italia", "Spain", "Greece", "France", "Slovenia", "Italy"]
    let years = ["2012", "2013", "2014", "2015", "2016"]
    var counter = 0
    
    var countryDict1 = {};
    var indiDict1 = {};

    Object.values(teenArea).forEach(function(teenArea){
        counter = 0
        for (var j = 0; j < Object.values(teenArea).length; j++){
            if (countries.includes(Object.values(teenArea)[j].Country)){
                if (years.includes(Object.values(teenArea)[j].Time)) {
                    var nation = Object.values(teenArea)[j].Country
                    var indicator = Object.values(teenArea)[j].Indicator 
                    dataPoints.push(Object.values(teenArea)[j].Datapoint)
                    counter++
                }     
            }  
            if (counter == 5){                
                countryDict1[nation] = dataPoints
                indiDict1[indicator] = countryDict1
                dataPoints = [] 
                counter = 0
            }  
        } 

    })

    var countryDict2 = {};
    var indiDict2 = {};

    Object.values(teenPreg).forEach(function(teenPreg){
        counter = 0
        for (var j = 0; j < Object.values(teenPreg).length; j++){
            if (countries.includes(Object.values(teenPreg)[j].Country)){
                if (years.includes(Object.values(teenPreg)[j].Time)) {
                var nation = Object.values(teenPreg)[j].Country
                var indicator = Object.values(teenPreg)[j].Indicator 
                dataPoints.push(Object.values(teenPreg)[j].Datapoint)
                counter++
                }     
            }  
            if (counter == 5){
                countryDict2[nation] = dataPoints
                indiDict2[indicator] = countryDict2
                dataPoints = [] 
                counter = 0
            }  
        } 

    })

    var countryDict3 = {};
    var indiDict3 = {};

    Object.values(GDPData).forEach(function(GDPData){
        counter = 0
        for (var j = 0; j < Object.values(GDPData).length; j++){
            if (countries.includes(Object.values(GDPData)[j].Country)){
                if (years.includes(Object.values(GDPData)[j].Year)){
                    var nation = Object.values(GDPData)[j].Country
                    var indicator = Object.values(GDPData)[j].Transaction
                    dataPoints.push(Object.values(GDPData)[j].Datapoint)
                    counter++
                }     
            }  
            if (counter == 5){
                countryDict3[nation] = dataPoints
                indiDict3[indicator] = countryDict3
                dataPoints = [] 
                counter = 0
            }  
        } 

    })

    var finalObject = Object.assign([], indiDict1, indiDict2, indiDict3);
    return finalObject;
    };
