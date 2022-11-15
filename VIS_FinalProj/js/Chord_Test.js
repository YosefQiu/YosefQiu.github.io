
class ChordChart {
    /**
     * Creates a bubble chart Object
     */

    // https://observablehq.com/@d3/chord-diagram
    // chord chart takes array of 10*10 as input
    constructor(data,Tradetype,year) {
        this.originalData = data
        this.vizWidth = 400;
        this.vizHeight = 400;
        this.TradeType = Tradetype;
        this.year = year-1992;
        this.drawChart()
        
    }
    
    drawChart(){
        this.setup()
        this.updateChart()
    }   

    setup(){

        let countries = [];
        for (let i = 0; i < this.originalData.length; i++)
            countries.push(this.originalData[i].country);

        function unique(arr) {
            let newArr = [];
            return arr.filter(function(item){
                return newArr.includes(item)?"":newArr.push(item)
            })
            return newArr;
        }

        function findCountries(arr) {
            switch(arr){
                case "China": return "CHN"; break;
                case "United States": return "USA"; break;
                case "Australia": return "AUS"; break;
                case "Germany": return "GER"; break;
                case "Japan": return "JAP"; break;
                case "Korea, Rep.": return "KOR"; break;
                case "Malaysia": return "MAL"; break;
                case "Singapore": return "SIN"; break;
                case "Thailand": return "THA"; break;
                case "Vietnam": return "VIE"; break;
            }
        }

        function sum(arr) {
            return arr.reduce(function(acr, cur){
              return acr + cur;
            });
          }

        let temp = [];
        let processData = {CHN:[], USA:[], AUS:[], GER:[], JAP:[], KOR:[], MAL:[], SIN:[], THA:[], VIE:[]};
        countries = unique(countries);
        console.log(processData);
        for (let k = 0; k < countries.length; k++) {
            for (let i = 0; i < this.originalData.length; i++) {
                if (this.originalData[i].country == countries[k]) {
                    if (this.originalData[i].tradeType == this.TradeType) {
                        for (let j = 0; j < countries.length; j++) {
                            if (this.originalData[i].traders == countries[j]) {
                                temp.push(this.originalData[i].TradeData[this.year]);
                            }
                        } 
                    }
                }
            }
            processData[findCountries(countries[k])] = temp;
            temp = [];
        }
        
        for (let i = 0; i < countries.length; i++) {
            processData[findCountries(countries[i])].splice(i, 0, 0);
        }
        processData['VIE'][0] = 0;
        let tradeSum = 0;
        for(let i = 0; i < countries.length; i++) {
            tradeSum += sum(processData[findCountries(countries[i])]);
        }
        for (let i = 0; i < countries.length; i++) {
            for (let j = 0; j < processData[findCountries(countries[i])].length; j++) {
                processData[findCountries(countries[i])][j] = processData[findCountries(countries[i])][j] / tradeSum;
            }
        }
        
        this.data = Object.assign([
            processData['CHN'],
            processData['USA'],
            processData['AUS'],
            processData['GER'],
            processData['JAP'],
            processData['KOR'],
            processData['MAL'],
            processData['SIN'],
            processData['THA'],
            processData['VIE']
            ], {
            names: ['China', 'United States', 'Australia', 'Germany', 'Japan', 'Korea, Rep.', 'Malaysia', 'Singapore', 'Thailand', 'Vietnam'],
            colors: ['#d98032', '#ef3e36', '#17bebb', '#237373', '#2e282a', '#5e4c43', '#8e705b', '#edb88b', '#f4c8b1', '#fad8d6']
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
        
    }
    // this will be called in script.js 
    // when the year changes
    updateChart() {
        d3.select("#chordCharts").attr("viewBox", [-this.vizWidth / 2 , -this.vizWidth / 2, this.vizWidth, this.vizWidth])
        let svg;
        if (this.TradeType == "Import") {
            svg = d3.select("#Import").attr("transform", `translate(-200,0)`);
        }
        else {
            svg = d3.select("#Export").attr("transform", `translate(200,0)`);
        }

        
          
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

    function ticks({ startAngle, endAngle, value }) {
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