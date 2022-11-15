class LineChart {
    /**
    * Creates a LineChart
    * @param globalApplicationState The shared global application state (has the data and map instance in it)
    */
    constructor(data,tradeType,country) {
        // Set some class level variables
        this.tradeType = tradeType
        this.lineChart = d3.select('#line-chart')
        
        this.padding = { left: 80, bottom: 150, right: 50 }

        let svg_w = 1500;
        let svg_h = 600;        
        // console.log('width', svg_width);
        // x axis text
        this.lineChart
            .append('text')
            .text('Year')
            .attr('x', 350)
            .attr('y', 500);

        // Append y axis text
        this.lineChart
            .append('text')
            .text('Trading Amount in US dolloar')
            .attr('x', -250)
            .attr('y', 25)
            .attr('transform', 'translate(0,50)rotate(-90)');

        let LineChartData = data.filter(v => v.country === country && v.tradeType === this.tradeType);

        let temp_data=[]
        LineChartData.forEach(element => {
            element.TradeData.forEach((data,i)=>{
                let year = String(i+1992)
                let temp={
                    country: element.country,
                    traders: element.traders,
                    tradeType: element.tradeType,
                    year: year,
                    data:data
                }
                //temp[year] = data
                temp_data.push(temp)
                
            })
        });
        this.updateLineChart(temp_data);
    }
    updateLineChart(LineChartData) {
        
        if (this.tradeType == "Import") {
            this.lineChart = this.lineChart.select('#Import')
            this.lineChart.attr("transform", `translate(700,0)`);
            // x axis text
            this.lineChart
                .append('text')
                .text('Year')
                .attr('x', 350)
                .attr('y', 500);

            // Append y axis text
            this.lineChart
                .append('text')
                .text('Trading Amount in US dolloar')
                .attr('x', -250)
                .attr('y', 25)
                .attr('transform', 'translate(0,50)rotate(-90)');
           
        }
        else {
            this.lineChart = this.lineChart.select('#Export')
            // x axis text
            this.lineChart
                .append('text')
                .text('Year')
                .attr('x', 350)
                .attr('y', 500);

            // Append y axis text
            this.lineChart
                .append('text')
                .text('Trading Amount in US dolloar')
                .attr('x', -250)
                .attr('y', 25)
                .attr('transform', 'translate(0,50)rotate(-90)');
        }
  
        // current linechart data should be an array of length 9-10 (countries)

        // year: 1992-2020

        let groupedLocationData = d3.group(LineChartData, d => d.traders)
        let lineColors = ['#d98032', '#ef3e36', '#17bebb', '#237373', '#2e282a', '#5e4c43', '#8e705b', '#edb88b', '#f4c8b1', '#fad8d6']
        this.lineColorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(groupedLocationData.keys());
        const tickLabels = [];

        for (let i = 1992; i < 2020; i++) {
            tickLabels.push(i);
        }

        // Add x axis --> it is a date format
        const xAxis = d3.scaleLinear()
            .domain([1992,2020])
            .range([this.padding.left, 700 - this.padding.right])
            .nice();
        
        this.lineChart
            .select('#x-axis')
            .attr('transform', `translate(0, ${600 - this.padding.bottom})`)
            .call(d3.axisBottom(xAxis).tickFormat((d,i) => tickLabels[i]))

        // y axis, linear float number
        const yAxis = d3.scaleLinear()
            .domain([Math.min(...LineChartData.map((row) => row.data)), Math.max(...LineChartData.map((row) => row.data))])
            .range([600 - this.padding.bottom, 10])
            .nice();

        this.lineChart.select('#y-axis')
            .attr('transform', `translate(${this.padding.left},0)`)
            .call(d3.axisLeft(yAxis).tickFormat(d3.format('.2s')));

        //console.log(groupedLocationData)
        this.lineChart
            .select('#lines')
            .selectAll('path')
            .data(groupedLocationData)
            .join('path')
            .attr('fill', 'none')
            .attr('stroke', ([group, values]) => this.lineColorScale(values[0].traders))
            .attr('stroke-width', 1)
            .attr('d', ([group, values]) => d3.line()
                .x((d,i) =>xAxis(parseInt(d.year)))
                .y((d) => (d3.format(".2s")(yAxis(parseFloat(d.data)))))
                (values))

        // interative section
        this.lineChart.on('mousemove', (event) => {
            if (event.offsetX > this.padding.left && event.offsetX < 700 - this.padding.right && this.click) {
                // Set the line position

                this.lineChart
                    .select('#overlay')
                    .select('line')
                    .attr('stroke', 'black')
                    .attr('x1', event.offsetX)
                    .attr('x2', event.offsetX)
                    .attr('y1', 600 - this.padding.bottom)
                    .attr('y2', 0);

                //// round date data 
                const dateHovered = xAxis.invert(event.offsetX)
                dateHovered.setTime(dateHovered.getTime() + (12 * 60 * 60 * 1000));
                dateHovered.setHours(0, 0, 0, 0);

                // sort data
                const filteredData = dataLookup
                    .filter((row) => +row.date === +dateHovered)
                    .sort((rowA, rowB) => rowB.total_cases_per_million - rowA.total_cases_per_million)

                // flag to switch side
                let condition = event.offsetX > 500 - this.padding.right

                // draw text labels
                this.lineChart.select('#overlay')
                    .selectAll('text')
                    .data(filteredData)
                    .join('text')
                    //.text(d => d.total_cases_per_million > 1000 ? `${d.location}, ${Math.round(d.total_cases_per_million / 1000)}k` : `${d.location}, ${Math.round(d.total_cases_per_million)}`)
                    .text(d => `${d.location}, ${d3.format(".2s")(d.total_cases_per_million)}`)
                    .attr('x', condition ? event.offsetX - 150 : event.offsetX + 20)
                    .attr('y', (d, i) => 20 * i + 20)
                    .attr('alignment-baseline', 'hanging')
                    .attr('fill', (d) => this.lineColorScale(d.location));
            }

        });
    }

}