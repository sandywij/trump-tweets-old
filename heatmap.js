var margin = { top: 50, right: 0, bottom: 100, left: 30 },
    width = 960 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize * 2,
    buckets = 7,
    colors = ['#ffffcc', '#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#0c2c84'],
    days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    times = ["12am", "1am", "2am", "3am", "4am", "5am,", "6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"],
    datasets = ["realdtrump.json"],
    dayData = [202, 268, 269, 262, 304, 243, 250];




var svg = d3.select("#heatmap").append("svg")
    .attr("width", width + margin.left * 5 + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left * 2 + "," + margin.top / 2 + ")");


var dayLabels = svg.selectAll(".dayLabel")
    .data(days)
    .enter().append("text")
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", function (d, i) { return i * gridSize * 1.05; })
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 2 + ")")
      .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

  var dayCounts = svg.selectAll(".dayCounts")
          .data(dayData)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize * 1.05; })
            .style("text-anchor", "end")
            .attr("transform", "translate(" + width * 1.05 + "," + gridSize / 2 + ")")
            .attr("class", "mono");


var timeLabels = svg.selectAll(".timeLabel")
    .data(times)
    .enter().append("text")
      .text(function(d) { return d; })
      .attr("x", function(d, i) { return i * gridSize * 1.05; })
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + gridSize / 2 + ", -6)")
      .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });




var heatmapChart = function(jsonFile) {
  d3.json(jsonFile, function(error, data) {
    var colorScale = d3.scale.quantile()
        .domain([-1, buckets - 1, d3.max(data, function (d) { return d.value; })])
        .range(colors);

    var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .style("visibility","visible")
                    .html(function(d) {
                      return "Tweets:  <span style='color:red'>" + d.value;
                    });

    tip(svg.append("g"));

    var cards = svg.selectAll(".hour")
        .data(data, function(d) {return d.day+':'+d.hour;});

    cards.enter().append("path")
          .style("stroke", "black")
          .style("stroke-width" , 8)
          .attr("transform", function(d) { return "translate(" + d.hour * gridSize * 1.05 + "," + (d.day - 1) * gridSize * 1.05 +")" + "scale(0.015)";})
          .attr("d","m 1999.9999,192.4 c -73.58,32.64 -152.67,54.69 -235.66,64.61 84.7,-50.78 149.77,-131.19 180.41,-227.01 -79.29,47.03 -167.1,81.17 -260.57,99.57 C 1609.3399,49.82 1502.6999,0 1384.6799,0 c -226.6,0 -410.328,183.71 -410.328,410.31 0,32.16 3.628,63.48 10.625,93.51 -341.016,-17.11 -643.368,-180.47 -845.739,-428.72 -35.324,60.6 -55.5583,131.09 -55.5583,206.29 0,142.36 72.4373,267.95 182.5433,341.53 -67.262,-2.13 -130.535,-20.59 -185.8519,-51.32 -0.039,1.71 -0.039,3.42 -0.039,5.16 0,198.803 141.441,364.635 329.145,402.342 -34.426,9.375 -70.676,14.395 -108.098,14.395 -26.441,0 -52.145,-2.578 -77.203,-7.364 52.215,163.008 203.75,281.649 383.304,284.946 -140.429,110.062 -317.351,175.66 -509.5972,175.66 -33.1211,0 -65.7851,-1.949 -97.8828,-5.738 181.586,116.4176 397.27,184.359 628.988,184.359 754.732,0 1167.462,-625.238 1167.462,-1167.47 0,-17.79 -0.41,-35.48 -1.2,-53.08 80.1799,-57.86 149.7399,-130.12 204.7499,-212.41")
          .style("fill", function(d) { return colorScale(d.value);})

//tooltip
    cards.on('mouseover', tip.show)
          .on('mouseout', tip.hide);



cards.on('click', function(){

  var twitter = d3.select("#days").selectAll("p")
               .data(data, function(d) { return d.day+':'+d.hour;});


                  twitter.enter().append("blockquote")
                          .attr("class","twitter-tweet")
                          .attr("data-lang","en")
                          .append("p")
                          .attr("lang", "en")
                          .attr("dir", "ltr")
                          .append("a")
                          .attr("href", function (d) { return "https://twitter.com/realDonaldTrump/status/" + d.tweet_id[0];})
                          .text(function (d) { return "https://twitter.com/realDonaldTrump/status/" + d.tweet_id[0];})
                          .append("script")
                          .attr("async src", "https://platform.twitter.com/widgets.js")
                          .attr("charset", "utf-8");


  } // function bracket

); //on click


//LENGENDS//
////////////


    var legend = svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; });

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height + gridSize)
      .attr("width", legendElementWidth)
      .attr("height", gridSize / 2)
      .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return "≥ " + Math.round(d); })
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height + gridSize * 2);


  });
};




heatmapChart(datasets[0]);


var ctx1 = document.getElementById('month').getContext('2d');
var tweetchart = new Chart(ctx1, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {

        labels: ["January", "February", "March", "April", "May", "June", "July", "August","September", "October", "November", "December"],
        datasets: [
          {
            label: "Tweets by Month",
            backgroundColor: '#55acee',
            data: [75, 152, 142, 155, 149, 210, 245, 264, 292, 296, 260, 44]
        },

      ]
    },

});


var ctx2 = document.getElementById('day').getContext('2d');
var tweetchart = new Chart(ctx2, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {

        labels: ["January", "February", "March", "April", "May", "June", "July", "August","September", "October", "November", "December"],
        datasets: [
          {
            label: "Average Daily Tweets",
            backgroundColor: '#55acee',
            data: [6.2, 5.4, 4.5, 5.1, 4.8, 7, 7.9, 8.5, 9.7, 9.5, 8.6, 6.2]

        },

      ]
    },

});

var ctx2 = document.getElementById('retweets').getContext('2d');
var tweetchart = new Chart(ctx2, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {

        labels: [">10k", "10k+", "20k+", "30k+", "40k+", "50k+", "60k+", "70k+", "80k+", "90k+", "100k+", "110k+", "120k+", "130k+", "140k+", "150k+", "160k+", "170k+", "180k+", "190k+", "200k+", "210k+", "220k+"],
        datasets: [
          {
            label: "Number of Retweets",
            backgroundColor: '#55acee',
            data: [2237, 22, 11, 6, 5, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]

        },

      ] //dataset  
    }, //data
    
       options: {
                title:{
                    display:true,
                    text:'Retweets Histogram'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            // the data minimum used for determining the ticks is Math.min(dataMin, suggestedMin)
                            min: 0,
                            // the data maximum used for determining the ticks is Math.max(dataMax, suggestedMax)
                            max: 5
                        }
                    }]
                }
            }
        });

