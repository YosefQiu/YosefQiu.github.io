class NPM 
{
  constructor() {
    // get the data
    let map_url = "./data/usa.json";
    let park_url = "./data/park.json";
    let forests_url = "./data/forest.json"

  }

  async renderMap(us, park, forest) {
    const width = 960;
    const height = 600;
    const scale0 = (width - 1) / 2 / Math.PI;
    const that = this;
    const projection = d3.geoAlbersUsa();
    

    function _visited(){return(
      ["YELL", "ARCH", "GRTE", "ZION", "CORO", "ROCR", "CANY", "GUIS",  "GLCA"]
    )}
      
    function _going(){return(
      ["YOSE", "San Isabel National Forest", "DEVA"]
    )}

    let visited = _visited();
    let going = _going();
    const geoGenerator = d3.geoPath()
      .projection(projection);
    
    let usJson = await d3.json("./data/usa.json");
    let parkJson = await d3.json("./data/park.json");
    let forestJson = await d3.json("./data/forest.json");


    console.log('park', parkJson);

    projection.fitExtent([[0, 0], [960, 600]], usJson);
    const svg = d3.select("#national_park_map")
        .attr('width', '100%')
        .attr('height', '600');
    
    this.layers = svg.append('g')
        .attr('class', 'layers');

    this.layers.append('g').selectAll('path')
          .data(usJson.features)
          .enter()
          .append('path')
          .attr('d', geoGenerator)
          .attr('fill', '#636363')
          .attr('stroke', '#ccc')
          .attr('class', 'us-states');

    
    this.layers.append('g').selectAll('path')
      .data(parkJson.features)
      .enter()
      .append('path')
      .attr('d', geoGenerator)
      .attr('class', 'nat-parks')
      .attr('fill', function(d){
            if (visited.indexOf(d.properties.UNIT_CODE) > -1){ 
              return '#ff6347';
            } 
            else if (going.indexOf(d.properties.UNIT_CODE) > -1) { 
              return '#50A6C2';
            } else { //parks
              return '#3EA055';
            }
      });

    this.layers.append('g').selectAll('path')
      .data(forestJson.features)
      .enter()
        .append('path')
        .attr('d', geoGenerator)
        .attr('class', 'nat-forests')
        .attr('fill', function(d){
              if (visited.indexOf(d.properties.FORESTNAME) > -1){ 
                return '#ff6347';
              } else if (going.indexOf(d.properties.FORESTNAME) > -1) { 
                return '#50A6C2';
              } else { //forests
                return '#89A46F';
              }
        });
    svg.call(d3.zoom().on("zoom", zoomed));
    function zoomed() {
      // mapLayer is a g element
      that.layers.attr("transform", d3.event.transform)
    }

    
//legend
let ordinal = d3.scaleOrdinal()
.domain(["National Parks", "National Forests", "Visitied", "Going To"])
.range([ "#3EA055", "#89A46F", "#ff6347", "#50A6C2"]);

svg.append("g")
  .attr("class", "legendOrdinal")
  .attr("transform", "translate(750,40)");

var legendOrdinal = d3.legendColor()
  .shape("path", d3.symbol().type(d3.symbolCircle).size(200)())
  .shapePadding(20)
  .scale(ordinal);

svg.select(".legendOrdinal")
  .call(legendOrdinal);

  }

   


}
    
    
    
