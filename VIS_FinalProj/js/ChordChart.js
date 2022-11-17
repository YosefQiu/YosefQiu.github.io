var call_names;
var that;
class ChordChart {
    /**
     * Creates a bubble chart Object
     */

    // https://observablehq.com/@d3/chord-diagram
    // chord chart takes array of 10*10 as input
    constructor(data,Tradetype,year) {
        this.originalData = data
        this.chordChart = d3.select("#chordCharts");
        let svg_w = this.chordChart.attr('width');
        let svg_h = this.chordChart.attr('height');
        this.svg_w = svg_w;
        this.svg_h = svg_h;
        this.vizWidth = svg_w;
        this.vizHeight = svg_h;

        this.bLineChartInit = false;
        this.bFirstZoom = true;
        this.bFirstIn = true;

        this.vizWidth = 500;
        this.vizHeight = 500;
        this.TradeType = Tradetype;
        this.year = year;
        this.updateChart(this.year)
        

    }
    
    updateData(year) {
        let countries = [];
        for (let i = 0; i < this.originalData.length; i++)
            countries.push(this.originalData[i].country);  
        this.year = year
        let temp = [];
        let processData = { CHN: [], USA: [], AUS: [], GER: [], JAP: [], KOR: [], MAL: [], SIN: [], THA: [], VIE: [] };
        countries = unique(countries);

        function sum(arr) {
            return arr.reduce(function (acr, cur) {
                return acr + cur;
            });
        }

        function unique(arr) {
            let newArr = [];
            return arr.filter(function (item) {
                return newArr.includes(item) ? "" : newArr.push(item)
            })
            return newArr;
        }

        let findCountries = {
            "China": "CHN",
            "United States": "USA",
            "Australia": "AUS",
            "Germany": "GER",
            "Japan": "JAP",
            "Korea, Rep.": "KOR",
            "Malaysia": "MAL",
            "Singapore": "SIN",
            "Thailand": "THA",
            "Vietnam": "VIE"
        }

        for (let k = 0; k < countries.length; k++) {
            for (let i = 0; i < this.originalData.length; i++) {
                if (this.originalData[i].country == countries[k]) {
                    if (this.originalData[i].tradeType == this.TradeType) {
                        for (let j = 0; j < countries.length; j++) {
                            if (this.originalData[i].traders == countries[j]) {
                                temp.push(this.originalData[i].TradeData[this.year-1992]);
                            }
                        }
                    }
                }
            }
            processData[findCountries[countries[k]]] = temp;
            temp = [];
        }

        for (let i = 0; i < countries.length; i++) {
            processData[findCountries[countries[i]]].splice(i, 0, 0);
        }
        processData['VIE'][0] = 0;
        let tradeSum = 0;
        for (let i = 0; i < countries.length; i++) {
            tradeSum += sum(processData[findCountries[countries[i]]]);
        }
        for (let i = 0; i < countries.length; i++) {
            for (let j = 0; j < processData[findCountries[countries[i]]].length; j++) {
                processData[findCountries[countries[i]]][j] = processData[findCountries[countries[i]]][j] / tradeSum;
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
    updateChart(year) {
        // here year is a four digit year number (e.g. 2022)
        this.updateData(year)
        d3.select("#chordCharts").attr("viewBox", [-this.vizWidth / 2, -this.vizWidth / 2, this.vizWidth, this.vizWidth])
        let svg;
        if (this.TradeType == "Import") {
            svg = d3.select("#Import").attr("transform", `scale(1.15)translate(-200,0)`);
        }
        else {
            svg = d3.select("#Export").attr("transform", `scale(1.15)translate(200,0)`);
        }


        svg.append("g")
            .attr("id", "title");

       
        svg.select("#title")
            .append("text")
            .attr("font-size", 20)
            .text(`${this.TradeType} Data For year ${this.year}`)
            .attr("transform", ` translate(${- this.vizWidth *0.3125}, ${- this.vizWidth * 0.4375})`);

        const chords = this.chord(this.data);

        const group = svg.append("g")
            .attr("font-size", 10)
            .attr("font-family", "sans-serif")
            .selectAll("g")
            .data(chords.groups)
            .join("g");

        

        
       

        let names = this.names
          
        svg.append("g")
            .attr("id", "belts")
            .attr("class","default")
            .attr("fill-opacity", 0.25)
            .selectAll("path")
            .data(chords)
            .join("path")
            .style("mix-blend-mode", "multiply")
            .attr("fill", d => this.color(names[d.source.index]))
            .attr("d", this.ribbon)
            .on("mouseover", (d, i) => {
                d3.select("#belts").attr("fill-opacity", 0.25);
                d.target.setAttribute("fill-opacity", 1)
                console.log()
            })
            .on("mouseout", (d, i) => {
                d.target.setAttribute("fill-opacity", 0.25)
            })
            .append("title")
            .text(d => `${this.formatValue(d.source.value)} 
            ${names[d.target.index]} → ${names[d.source.index]}
            ${d.source.index === d.target.index ? "" : `
            ${this.formatValue(d.target.value)} 
            ${names[d.source.index]} → ${names[d.target.index]}`}`);

        // fill inside
        group.append("path")
            .attr("id", "arcs")
            .attr("fill", d => this.color(this.names[d.index]))
            .attr("d", this.arc)
            .on("mouseover", (d, i) => {
                d3.select("#arcs").attr("fill-opacity", 0.25);
                d.target.setAttribute("fill-opacity", 1)

                // if a country arc is selected, the chord chart should show all the belts related to this country
                // by filtering the country color
                //d3.select("#belts").selectAll("path").filter((o, index) => { console.log(o, index); return o.getAttribute("fill") === d.target.getAttribute("fill") })
                //console.log(this.names[i.index]);
            })
            .on("click", (d, i) => {
                console.log('new zoomm', this.bFirstZoom);
                if (this.bFirstZoom == true) {
                    d3.select("#Import")
                    .transition()
                    .duration(3000)
                    .attr("transform", `scale(5.0)translate(-200,0)`)
                    .transition()
                    .duration(3000)
                    .attr("transform", `scale(1.0)translate(-200,0)`);
                    d3.select("#Export")
                    .transition()
                    .duration(3000)
                    .attr("transform", `scale(5.0)translate(250,0)`)
                    .transition()
                    .duration(3000)
                    .attr("transform", `scale(1.0)translate(250,0)`).on("end",this.myCallback);
                    // this.bFirstZoom = false;
                }
                call_names = names[i.index];
                that = this;
                
                if (this.bFirstZoom == false) {
                    if (this.bLineChartInit == false) {this.initLineChartSvg();}
                    globalApplicationState.ImportLine = new LineChart(this.originalData, "Import",names[i.index]);
                    globalApplicationState.ImportLine = new LineChart(this.originalData, "Export",names[i.index]);
                    globalApplicationState.ImportLine.updateLineChart(names[i.index]);
                }
                this.bFirstZoom = false;
            })

        // country name

        let outerRadius = this.outerRadius + 10;
        group.append("path")
            .attr("id", "countryName") //Unique id of the path
            .attr("d", d3.arc()({ outerRadius, startAngle: 0, endAngle: 2 * Math.PI }))
            .style("fill", "none")

        
        group.append("text")
            .append("textPath")
            .attr("id", "countryNameText")
            .attr("stroke", d => this.color(names[d.index]))
            .attr("xlink:href", "#countryName") 
            .style("text-anchor", "middle")
            .attr("startOffset", d => (d.startAngle + d.endAngle)/2 * outerRadius)
            .text(d => `${this.names[d.index]}`)
            .on("mouseover", (d, i) => {
                //console.log(this.names[i.index]);
            })
}

    initLineChartSvg() {
        let svg = d3.select('.charts').append('svg').attr('id', 'lineCharts')
            .attr("width", 1500).attr("height", 600);
        let svg_import = svg.append('g').attr('id', "Import");
        svg_import.append('g').attr('id', "lines");
        svg_import.append('g').attr('id', "overlay");
        svg_import.append('g').attr('id', "x-axis");
        svg_import.append('g').attr('id', "y-axis");
        let svg_export = svg.append('g').attr('id', "Export");
        svg_export.append('g').attr('id', "lines");
        svg_export.append('g').attr('id', "overlay");
        svg_export.append('g').attr('id', "x-axis");
        svg_export.append('g').attr('id', "y-axis");

        this.bLineChartInit = true;
        console.log('init finish========');
    }

    myCallback() {
        console.log('call back');
        console.log(call_names);
        this.bFirstZoom = false;
        console.log("zoom", this.bFirstZoom);
        that.initLineChartSvg();
        globalApplicationState.ImportLine = new LineChart(that.originalData, "Import",call_names);
        globalApplicationState.ImportLine = new LineChart(that.originalData, "Export",call_names);
        globalApplicationState.ImportLine.updateLineChart(call_names);
        
    }

}