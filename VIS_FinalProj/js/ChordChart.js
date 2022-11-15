
class Chord {
    /**
     * Creates a bubble chart Object
     */

    // https://observablehq.com/@d3/chord-diagram
    // chord chart takes array of 10*10 as input
    constructor() {
        //this.data = data
        this.vizWidth = 400;
        this.vizHeight = 400;
        this.drawChart()
        
    }
    
    drawChart(){
        this.setup()
        this.updateChart()
    }   

    setup(){
        this.data = Object.assign([
            [.096899, .008859, .000554, .004430, .025471, .024363, .005537, .025471],
            [.001107, .018272, .000000, .004983, .011074, .010520, .002215, .004983],
            [.000554, .002769, .002215, .002215, .003876, .008306, .000554, .003322],
            [.000554, .001107, .000554, .012182, .011628, .006645, .004983, .010520],
            [.002215, .004430, .000000, .002769, .104097, .012182, .004983, .028239],
            [.011628, .026024, .000000, .013843, .087486, .168328, .017165, .055925],
            [.000554, .004983, .000000, .003322, .004430, .008859, .017719, .004430],
            [.002215, .007198, .000000, .003322, .016611, .014950, .001107, .054264]
            ], {
            names: ["Apple", "HTC", "Huawei", "LG", "Nokia", "Samsung", "Sony", "Other"],
            colors: ["#c4c4c4", "#69b40f", "#ec1d25", "#c8125c", "#008fc8", "#10218b", "#134b24", "#737373"]
            })
        this.names = this.data.names === undefined ? d3.range(this.data.length) : this.data.names
        this.colors = this.data.colors === undefined ? d3.quantize(d3.interpolateRainbow, names.length) : this.data.colors
        

        
        this.outerRadius = Math.min(this.vizWidth, this.vizHeight) * 0.5 - 60
        let innerRadius = this.outerRadius - 10

        this.formatValue = d3.format(".1~%")
        this.chord = d3.chord()
            .padAngle(10 / innerRadius)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending)

        

        this.arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(this.outerRadius)

        this.ribbon = d3.ribbon()
            .radius(innerRadius - 1)
            .padAngle(1 / innerRadius)

        this.color = d3.scaleOrdinal(this.names, this.colors)
        
        //d3 = require("d3@6")
    }
    // this will be called in script.js 
    // when the year changes
    updateChart() {
            const svg = d3.select("#chordCharts")
            .attr("viewBox", [-400 / 2, -400 / 2, 400, 400])
          
            const chords = this.chord(this.data);
          
            const group = svg.append("g")
                .attr("font-size", 5)
                .attr("font-family", "sans-serif")
              .selectAll("g")
              .data(chords.groups)
              .join("g");
          
            group.append("path")
                .attr("fill", d => this.color(this.names[d.index]))
                .attr("d", this.arc);
          
            group.append("title")
                .text(d => `${this.names[d.index]}
          ${this.formatValue(d.value)}`);
          let tickStep = d3.tickStep(0, d3.sum(this.data.flat()), 100)
          function ticks({startAngle, endAngle, value}) {
            const k = (endAngle - startAngle) / value;
            return d3.range(0, value, tickStep).map(value => {
              return {value, angle: value * k + startAngle};
            });
          }
            const groupTick = group.append("g")
              .selectAll("g")
              .data(ticks)
              .join("g")
                .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${this.outerRadius},0)`);
          
            groupTick.append("line")
                .attr("stroke", "currentColor")
                .attr("x2", 6);
          
            groupTick.append("text")
                .attr("x", 8)
                .attr("dy", "0.35em")
                .attr("transform", d => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
                .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
                .text(d => this.formatValue(d.value));
            let names = this.names
            group.select("text")
                .attr("font-weight", "bold")
                .text(function(d) {
                  return this.getAttribute("text-anchor") === "end"
                      ? `↑ ${names[d.index]}`
                      : `${names[d.index]} ↓`;
                });
          
            svg.append("g")
                .attr("fill-opacity", 0.8)
              .selectAll("path")
              .data(chords)
              .join("path")
                .style("mix-blend-mode", "multiply")
                .attr("fill", d => this.color(names[d.source.index]))
                .attr("d", this.ribbon)
              .append("title")
                .text(d => `${this.formatValue(d.source.value)} ${names[d.target.index]} → ${names[d.source.index]}${d.source.index === d.target.index ? "" : `\n${this.formatValue(d.target.value)} ${names[d.source.index]} → ${names[d.target.index]}`}`);
            
    }

}