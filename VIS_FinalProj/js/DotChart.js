class DotChart {
    constructor(data,Tradetype,year) {
        this.originalData = data;
        this.year = year;
        this.tradeType = Tradetype;
        this.bImportAxis = false;
        this.bExportAxis = false;
        this.padding = { left: 50, bottom: 150, right: 50};

        this.processData(this.tradeType, this.year);
    }


    processData(tradeType, year) {

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

        function sum(arr) {
            return arr.reduce(function (acr, cur) {
                return acr + cur;
            });
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
        this.findCountries = findCountries;

        let countries = [];
        for (let i = 0; i < this.originalData.length; i++)
            countries.push(this.originalData[i].country);  
        // let temp = [];
        let processData = { CHN: [[],[],[],[]], USA: [[],[],[],[]], AUS: [[],[],[],[]], GER: [[],[],[],[]], JAP: [[],[],[],[]], KOR: [[],[],[],[]], MAL: [[],[],[],[]], SIN: [[],[],[],[]], THA: [[],[],[],[]], VIE: [[],[],[],[]] };
        countries = unique(countries);
        this.countries = countries;
        let temp = [];
        let data = this.originalData;
        let Data = null;
        let dot_data = Array(29).fill(0);;

        for (let i = 0; i < countries.length; i++) {
            Data = data.filter(v => v.country === countries[i] && v.tradeType === tradeType);
            // console.log(Data); // 9 个国家 9 X 29
            for (let j = 0; j < Data.length; j++) {
                // console.log(Data[j]);  // 每个国家的 9 个对象
                for (let k = 0; k < Data[j].TradeData.length; k++) {
                    if (isNaN(Data[j].TradeData[k])) {
                        Data[j].TradeData[k] = 0;
                    }
                    dot_data[k] = dot_data[k] + Data[j].TradeData[k];
                }
            }
            // console.log(countries[i]," ",dot_data);
            processData[findCountries[countries[i]]].push(Math.max.apply(Math,dot_data));
            processData[findCountries[countries[i]]].push(Math.min.apply(Math,dot_data));
            processData[findCountries[countries[i]]].push(sum(dot_data) );
            processData[findCountries[countries[i]]].push(dot_data[year - 1992]);
            dot_data.forEach(ele => ele = 0);
            // console.log('pro', processData);
            Data = [];
        }

        for (let i = 0; i < 10; i++) {
            processData[findCountries[countries[i]]] = processData[findCountries[countries[i]]].filter((item, index) => index >= 4);
        }
        this.DotChartData  = processData;
    }

    renderAxis() {

        if (this.bImportAxis == true) {
            this.dotChart.select('#Import').select('#y-axis').attr('opacity', '1');
            this.bImportAxis == false;
        }
        else if (this.bExportAxis == true) {
            this.dotChart.select('#Export').select('#y-axis').attr('opacity', '1');
            this.bExportAxis == false;
        }
        else {
            this.dotChart = d3.select("#dotCharts");
            let svg_w = d3.select("#chordCharts").attr('width');
            let svg_h = d3.select("#chordCharts").attr('height');
    
            svg_w = document.getElementById("chordCharts").clientWidth;
            svg_h = document.getElementById("chordCharts").clientHeight;
    
            this.svg_w = svg_w;
            this.svg_h = svg_h;
            this.vizWidth = svg_w / 2;
            this.vizHeight = svg_h / 2;
    
            let vizWidth = this.vizWidth;
            let vizHeight = this.vizHeight;
            
    
            let tmp_maxData = [];
            let tmp_minData = [];
            let tmp_avgData = [];
            let tmp_yearData = [];
            for (let i = 0; i < 10; i++) {
                tmp_maxData.push(parseFloat(this.DotChartData[this.findCountries[this.countries[i]]][0]));
                tmp_minData.push(parseFloat(this.DotChartData[this.findCountries[this.countries[i]]][1]));
                tmp_avgData.push(parseFloat(this.DotChartData[this.findCountries[this.countries[i]]][2]));
                tmp_yearData.push(parseFloat(this.DotChartData[this.findCountries[this.countries[i]]][3]));
            }
    
            //console.log(tmp_maxData, tmp_minData, tmp_avgData, tmp_yearData);
    
            let yAxis = d3.scaleLinear()
                .domain([0, Math.max.apply(Math,tmp_maxData)])
                .range([-vizHeight / 2, vizHeight / 2 ])
                .nice();
            this.yAxis = yAxis;
            if (this.tradeType == 'Import') {
                this.dotChart.select('#Import').select('#y-axis')
                .attr('transform', `translate(${this.padding.left},${0})`)
                .call(d3.axisLeft(yAxis).tickFormat(d3.format('.2s')));   
            }
    
            if (this.tradeType == 'Export') {
                this.dotChart.select('#Export').select('#y-axis')
                .attr('transform', `translate(${-this.padding.right},${0})`)
                .call(d3.axisRight(yAxis).tickFormat(d3.format('.2s')));
            }
        }
        
    }
     
    renderChart() {

        let vizWidth = this.vizWidth;
        let vizHeight = this.vizHeight;
        let yAxis = this.yAxis;

        this.color = d3.scaleOrdinal(['#d98032', '#ef3e36', '#17bebb', '#237373', '#2e282a', '#5e4c43', '#8e705b', '#edb88b', '#f4c8b1', '#fad8d6']);

        if (this.tradeType == "Import") {
            // xPos = vizWidth / 20 * i + this.padding.left + 40
        for (let i = 0; i < 10; i++) {
            this.dotChart.select('#Import').append('line')
            .attr('x1', vizWidth / 20 * i + this.padding.left + 40)
            .attr('y1', yAxis(this.DotChartData[this.findCountries[this.countries[i]]][1]))
            .attr('x2', vizWidth / 20 * i + this.padding.left  + 40)
            .attr('y2', yAxis(this.DotChartData[this.findCountries[this.countries[i]]][0]))
            .style("stroke", this.color(this.countries[i])).style("stroke-width", 6);

            // add countries name
            this.dotChart.select('#Import').append('text')
            .attr('x', vizWidth / 20 * i + this.padding.left + 30)
            .attr('y', yAxis(this.DotChartData[this.findCountries[this.countries[i]]][1]) - 10)
            .text(this.findCountries[this.countries[i]])
            .style("fill", "white")
            .attr('font-size', '10px');


            // add circle
            this.dotChart.select('#Import').append('circle')
            .attr('cx', vizWidth / 20 * i + this.padding.left + 40)
            .attr('cy', yAxis(this.DotChartData[this.findCountries[this.countries[i]]][1]))
            .attr('r', 5)
            .style("stroke", "black").style('fill', 'red').style("stroke-width", 2);

            this.dotChart.select('#Import').append('circle')
            .attr('cx', vizWidth / 20 * i + this.padding.left + 40)
            .attr('cy', yAxis(this.DotChartData[this.findCountries[this.countries[i]]][0]))
            .attr('r', 5)
            .style("stroke", "black").style('fill', 'yellow').style("stroke-width", 2);

            this.dotChart.select('#Import').append('circle')
            .attr('cx', vizWidth / 20 * i + this.padding.left + 40)
            .attr('cy', yAxis(this.DotChartData[this.findCountries[this.countries[i]]][2] / 28))
            .attr('r', 5)
            .style("stroke", "black").style('fill', '#134F5C').style("stroke-width", 2);

            this.dotChart.select('#Import').append('circle')
            .attr('cx', vizWidth / 20 * i + this.padding.left + 40)
            .attr('cy', yAxis(this.DotChartData[this.findCountries[this.countries[i]]][3]))
            .attr('r', 5)
            .style("stroke", "black").style('fill', 'white').style("stroke-width", 2);
        }
        }

        
        if (this.tradeType == "Export") {
            // xPos = -vizWidth / 20 * i - this.padding.right - 40
            for (let i = 0; i < 10; i++) {
                this.dotChart.select('#Export').append('line')
                .attr('x1', -vizWidth / 20 * i - this.padding.right - 40)
                .attr('y1', yAxis(this.DotChartData[this.findCountries[this.countries[i]]][1]))
                .attr('x2', -vizWidth / 20 * i - this.padding.right - 40)
                .attr('y2', yAxis(this.DotChartData[this.findCountries[this.countries[i]]][0]))
                .style("stroke", this.color(this.countries[i])).style("stroke-width", 6);

                // add countries name
                this.dotChart.select('#Export').append('text')
                .attr('x', -vizWidth / 20 * i - this.padding.right - 50)
                .attr('y', yAxis(this.DotChartData[this.findCountries[this.countries[i]]][1]) - 10)
                .text(this.findCountries[this.countries[i]])
                .style("fill", "white")
                .attr('font-size', '10px');

                // add circle
                this.dotChart.select('#Export').append('circle')
                .attr('cx', -vizWidth / 20 * i - this.padding.right - 40)
                .attr('cy', yAxis(this.DotChartData[this.findCountries[this.countries[i]]][1]))
                .attr('r', 5)
                .style("stroke", "black").style('fill', 'red').style("stroke-width", 2);

                this.dotChart.select('#Export').append('circle')
                .attr('cx', -vizWidth / 20 * i - this.padding.right - 40)
                .attr('cy', yAxis(this.DotChartData[this.findCountries[this.countries[i]]][0]))
                .attr('r', 5)
                .style("stroke", "black").style('fill', 'yellow').style("stroke-width", 2);

                this.dotChart.select('#Export').append('circle')
                .attr('cx', -vizWidth / 20 * i - this.padding.right - 40)
                .attr('cy', yAxis(this.DotChartData[this.findCountries[this.countries[i]]][2] / 28))
                .attr('r', 5)
                .style("stroke", "black").style('fill', '#134F5C').style("stroke-width", 2);

                this.dotChart.select('#Export').append('circle')
                .attr('cx', -vizWidth / 20 * i - this.padding.right - 40)
                .attr('cy', yAxis(this.DotChartData[this.findCountries[this.countries[i]]][3]))
                .attr('r', 5)
                .style("stroke", "black").style('fill', 'white').style("stroke-width", 2);
            }
        }
    }
    
    renderClear(tradeType) {
        if (tradeType == "Import") {
            this.dotChart.select('#Import').select('#y-axis').attr('opacity', '0');
            this.dotChart.select('#Import').append('g').attr('id', '#y-axis');
            this.dotChart.select('#Import').selectAll('line').remove();
            this.dotChart.select('#Import').selectAll('circle').remove();
            this.dotChart.select('#Import').selectAll('text').remove();
            this.bImportAxis = true;
        }

        if (tradeType == "Export") {
            this.dotChart.select('#Export').select('#y-axis').attr('opacity', '0');
            this.dotChart.select('#Export').selectAll('line').remove();
            this.dotChart.select('#Export').selectAll('circle').remove();
            this.dotChart.select('#Export').selectAll('text').remove();
            this.bExportAxis = true;
        }
    }

    updateChart(tradeType, year) {
        this.renderClear();
        this.processData(tradeType, year);
        this.renderAxis();
    
        this.renderChart();
    
    }
}