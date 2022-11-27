class ForceBubbleChart
{
    constructor() {
        let bubbleChart = d3.select("#bubbleCharts");

        bubbleChart.attr('width', '100%');
        bubbleChart.attr('height', '100%');
        let b_w  = bubbleChart.attr('width');
        let b_h = bubbleChart.attr('height');
        
        b_w = document.getElementById("bubbleCharts").clientWidth;
        b_h = document.getElementById("bubbleCharts").clientHeight;
        
        //console.log(b_h, b_w);
        
        this.renderLegend();
        var width = b_w, height = b_h, sizeDivisor = 2500000, nodePadding = 2.5;
        
        var svg = bubbleChart;
        
        var color = d3.scaleOrdinal(['#d98032', '#ef3e36', '#17bebb', '#237373', '#2e282a', '#5e4c43']);
        
        var simulation = d3.forceSimulation()
            .force("forceX", d3.forceX().strength(.1).x(width * .5))
            .force("forceY", d3.forceY().strength(.1).y(height * .5))
            .force("center", d3.forceCenter().x(width * .5).y(height * .5))
            .force("charge", d3.forceManyBody().strength(-15));
        
            d3.csv('./ProcessedData/dataset2.csv')
            .then(dataOutput => {
                let graph = dataOutput.map((d) =>({
                    country: String(d.Region),
                    traders: String(d.PartnerName),
                    tradeType: String(d.TradeFlow),
                    TradeData: parseFloat(d.year_2019),
                    gdp: +parseFloat(d.year_2019),
                    size: +parseFloat(d.year_2019) / sizeDivisor,
                    radius: +parseFloat(d.year_2019) / sizeDivisor
                }));

                // sort the nodes so that the bigger ones are at the back
                graph = graph.sort(function(a,b){ b.size - a.size > 0 ? 1 : -1;});
                

                function dragstarted(event, d) {
                    if (!event.active) simulation.alphaTarget(.03).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }
                
                function dragged(event, d) {
                    d.fx = event.x;
                    d.fy = event.y;
                }
                
                function dragended(d) {
                    if (!event.active) simulation.alphaTarget(.03);
                    d.fx = null;
                    d.fy = null;
                }

                //update the simulation based on the data
                simulation
                    .nodes(graph)
                    .force("collide", d3.forceCollide().strength(.5).radius(function(d){ return d.radius + nodePadding; }).iterations(1))
                    .on("tick", function(d){
                        node
                            .attr("cx", function(d){ return d.x; })
                            .attr("cy", function(d){ return d.y; })
                    });
                
                var node = svg.append("g")
                    .attr("class", "node")
                    .selectAll("circle")
                    .data(graph)
                    .enter().append("circle")
                    .attr("r", function(d) { if (isNaN(d.radius)){d.radius = 0;} if(d.radius < 6){d.radius=3;} return d.radius; })
                    .attr("fill", function(d) { return color(d.traders); })
                    .attr("cx", function(d){ return d.x; })
                    .attr("cy", function(d){ return d.y; })
                    .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));
                    var name = svg.append("g").attr('id', "name")
                    .attr("class", "node")
                    .selectAll("text")
                    .data(graph)
                    .enter().append("text")
                    .attr("x", function(d){ return d.x; })
                    .attr("y", function(d){ return d.y; })
                    .attr("text", function(d){ return d.Region;})
                    .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));

            });    
        

          

        
        
        
        function types(d){
          d.country = String(d.Region),
          d.traders = String(d.PartnerName),
          d.tradeType = String(d.TradeFlow),
          d.TradeData = parseFloat(d.year_2019),
          d.gdp = +parseFloat(d.year_2019);
          d.size = +parseFloat(d.year_2019) / sizeDivisor;
          d.size < 6 ? d.radius = 6 : d.radius = d.size;
          return d;
        }
    }

    renderLegend() {
        var color = d3.scaleOrdinal(['#d98032', '#ef3e36', '#17bebb', '#237373', '#2e282a', '#5e4c43']);
        let name = ["East Asia & Pacific", "Europe & Central Asia", "Middle East & North Africa", "North America", "South Asia"];
        
        let bubbleChart = d3.select("#bubbleCharts");
        let gLegend = bubbleChart.append('g').attr('id', 'g_legend');

        gLegend
                .attr("class", "node")
                .selectAll("circle").data(name).join('circle')
                .attr('cx', 20)
                .attr('cy', function(d, i) {return 20 + 50 * i;})
                .attr('r', 15)
                .attr("fill", function(d) { return color(d); });
        gLegend
                .selectAll("text").data(name).join('text')
                .attr('x', 50)
                .attr('y', function(d, i) {return 25 + 50 * i;})
                .text(function(d) { return d; })
                .style("fill", "white")
                .attr('font-size', '20px');
    }
}
