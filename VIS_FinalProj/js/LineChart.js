class LineChart {
    /**
    * Creates a LineChart
    * @param globalApplicationState The shared global application state (has the data and map instance in it)
    */
    constructor(data,tradeType,country) {
        // Set some class level variables
        this.tradeType = tradeType

        
        this.lineChart = d3.select('#lineCharts')
        
        this.padding = { left: 80, bottom: 150, right: 50 }

        let svg_w = this.lineChart.attr('width');
        let svg_h = this.lineChart.attr('height');
        this.svg_w = svg_w;
        this.svg_h = svg_h;
        this.bMouseMove = false;
        this.country = country;
    
        this.originalData = data;
        let LineChartData = data.filter(v => v.country === country && v.tradeType === this.tradeType);
        let temp_data=[]
        LineChartData.forEach(element => {
            element.TradeData.forEach((data,i)=>{
                data = data || 0
                let year = String(i+1992)
                let temp={
                    country: element.country,
                    traders: element.traders,
                    tradeType: element.tradeType,
                    year: year,
                    data: data
                }
                temp_data.push(temp)
                
            })
        });

        this.renderLineChart(temp_data);
        // this.updateLineChart(temp_data);
    }
    
    renderAxisLabel(svg) {
        // x axis text
        svg
            .append('text')
            .text('Year')
            .attr('x', 350)
            .attr('y', 500);

        // Append y axis text
        svg
            .append('text')
            .text('Trading Amount in US dolloar')
            .attr('x', -250)
            .attr('y', 25)
            .attr('transform', 'translate(0,50)rotate(-90)');
    }

    renderAxis(svg, LineChartData, tickLabels) {
        // Add x axis --> it is a date format
        const xAxis = d3.scaleLinear()
            .domain([1992,2020])
            .range([this.padding.left, 700 - this.padding.right])
            .nice();
     
        svg
            .select('#x-axis')
            .attr('transform', `translate(0, ${600 - this.padding.bottom})`)
            .call(d3.axisBottom(xAxis).tickFormat((d,i) => tickLabels[i]))

        // y axis, linear float number
        const yAxis = d3.scaleLinear()
            .domain([Math.min(...LineChartData.map((row) => row.data)), Math.max(...LineChartData.map((row) => row.data))])
            .range([600 - this.padding.bottom, 10])
            .nice();

        svg
            .select('#y-axis')
            .attr('transform', `translate(${this.padding.left},0)`)
            .call(d3.axisLeft(yAxis).tickFormat(d3.format('.2s')));
        
        this.xAxis = xAxis;
        this.yAxis = yAxis;
    }

    renderLine(svg, data) {
        const xAxis = this.xAxis;
        const yAxis = this.yAxis;

        svg
            .select('#lines')
            .selectAll('path')
            .data(data)
            .join('path')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 10)
            .style("opacity", 0)
            .transition()
            .duration(6000)
            .ease(d3.easeLinear)
            .style("opacity", 1)
            .attr('stroke-width', 1)
            .attr('stroke', ([group, values]) => this.lineColorScale(values[0].traders))
            .attr('d', ([group, values]) => d3.line()
                .x((d,i) =>xAxis(parseInt(d.year)))
                .y((d) => (d3.format(".2s")(yAxis(parseFloat(d.data)))))
                (values));
    }

    renderLineChart(LineChartData) {
        if (this.tradeType == "Export") {
            this.lineChart = this.lineChart.select('#Export')
            this.lineChart.attr("transform", `translate(${this.svg_w / 2},0)`);
            this.renderAxisLabel(this.lineChart);
            this.lineChart.append('text').text('EXPORT').attr('x', this.svg_h / 2).attr('y', 20);
        }
        else {
            this.lineChart = this.lineChart.select('#Import')
            this.renderAxisLabel(this.lineChart);
            this.lineChart.append('text').text('IMPORT').attr('x', this.svg_h / 2).attr('y', 20);
        }
  
        // year: 1992-2020
        let groupedLocationData = d3.group(LineChartData, d => d.traders)
        let lineColors = ['#d98032', '#ef3e36', '#17bebb', '#237373', '#2e282a', '#5e4c43', '#8e705b', '#edb88b', '#f4c8b1', '#fad8d6']
        this.lineColorScale = d3.scaleOrdinal(lineColors).domain(groupedLocationData.keys());
        
        const tickLabels = [];
        for (let i = 1992; i <= 2020; i = i + 2) {
            tickLabels.push(i);
        }

        this.renderAxis(this.lineChart, LineChartData, tickLabels);

        this.renderLine(this.lineChart, groupedLocationData);
        
        // interative section
        this.lineChart.select('#overlay').append('line')
            .style("stroke", "lightgreen").style("stroke-width", 10);
        
        let svg = d3.select('#lineCharts');

        svg.on('mousemove', (event) => {

            let bMouseExport = false;
            let bMouseImport = false;


            if (event.offsetX > this.padding.left && event.offsetX < 700 - this.padding.right) {
                bMouseImport = true;
                let tmpData = this.originalData.filter(v => v.country === this.country && v.tradeType === "Import");
                let temp_data=[]
                tmpData.forEach(element => {
                    element.TradeData.forEach((data,i)=>{
                        data = data || 0
                        let year = String(i+1992)
                        let temp={
                            country: element.country,
                            traders: element.traders,
                            tradeType: element.tradeType,
                            year: year,
                            data: data
                        }
                        temp_data.push(temp)
                    })
                });
                LineChartData = temp_data;

            }

            if (event.offsetX > (this.padding.left + this.svg_w / 2) && event.offsetX < this.svg_w - this.padding.right - 50) {
                bMouseExport = true;
                let tmpData = this.originalData.filter(v => v.country === this.country && v.tradeType === "Export");
                let temp_data=[]
                tmpData.forEach(element => {
                    element.TradeData.forEach((data,i)=>{
                        data = data || 0
                        let year = String(i+1992)
                        let temp={
                            country: element.country,
                            traders: element.traders,
                            tradeType: element.tradeType,
                            year: year,
                            data: data
                        }
                        temp_data.push(temp)
                    })
                });
                LineChartData = temp_data;
            }
            
            if (bMouseImport == true && bMouseExport == false) {
                let current_svg_imp = d3.select('#lineCharts').select('#Import');

                current_svg_imp.select('#overlay')
                .selectAll('line')
                .attr('stroke', 'black')
                .style('opacity', 1)
                .attr('x1', event.offsetX)
                .attr('x2', event.offsetX)
                .attr('y1', 600 - this.padding.bottom)
                .attr('y2', 0);

                const xAxis = this.xAxis;
                const yAxis = this.yAxis;
            
                // round date data 
                const dateHovered = Math.floor(xAxis.invert(event.offsetX));
                
                // sort data
                let dataLookup = LineChartData;
                let filteredData = [];
                dataLookup.filter((row) => {parseFloat(row.year) == dateHovered; if(parseFloat(row.year) == dateHovered){filteredData.push(row);}});
                filteredData.sort((rowA, rowB) => parseFloat(rowA.data) - parseFloat(rowB.data) > 0 ? -1 : 1);
               
                // flag to switch side
                let condition = event.offsetX > 500 - this.padding.right;
            
                // draw text labels
                current_svg_imp.select('#overlay')
                    .selectAll('text')
                    .data(filteredData)
                    .join('text')
                    .text(d => `${d.traders}, ${d3.format(".2s")(parseFloat(d.data))}`)
                    .attr('x', condition ? event.offsetX - 170: event.offsetX + 20)
                    .attr('y', (d, i) => 20 * i + 20)
                    .attr('alignment-baseline', 'hanging')
                    .style('opacity', 1)
                    .attr('fill', (d) => this.lineColorScale(d.traders));
                

            
            }
            if (bMouseExport == true && bMouseImport == false) {

                let current_svg_exp = d3.select('#lineCharts').select('#Export');
                current_svg_exp.select('#overlay')
                .selectAll('line')
                .attr('stroke', 'black')
                .style('opacity', 1)
                .attr('x1', event.offsetX - this.svg_w / 2)
                .attr('x2', event.offsetX - this.svg_w / 2)
                .attr('y1', 600 - this.padding.bottom)
                .attr('y2', 0);

                const xAxis = this.xAxis;
                const yAxis = this.yAxis;
            
                // round date data 
                const dateHovered = Math.floor(xAxis.invert(event.offsetX - this.svg_w / 2));
                
                // sort data
                let dataLookup = LineChartData;
                let filteredData = [];
                dataLookup.filter((row) => {parseFloat(row.year) == dateHovered; if(parseFloat(row.year) == dateHovered){filteredData.push(row);}});
                filteredData.sort((rowA, rowB) => parseFloat(rowA.data) - parseFloat(rowB.data) > 0 ? -1 : 1);
               
                // flag to switch side
                let condition = event.offsetX > 1200 - this.padding.right;
            
                // draw text labels
                current_svg_exp.select('#overlay')
                    .selectAll('text')
                    .data(filteredData)
                    .join('text')
                    .text(d => `${d.traders}, ${d3.format(".2s")(parseFloat(d.data))}`)
                    .attr('x', condition ? event.offsetX - 170 - this.svg_w / 2: event.offsetX + 20 - this.svg_w / 2)
                    .attr('y', (d, i) => 20 * i + 20)
                    .attr('alignment-baseline', 'hanging')
                    .style('opacity', 1)
                    .attr('fill', (d) => this.lineColorScale(d.traders));
                
            }

            if (bMouseImport == false && bMouseExport == true) {
                let current_svg = d3.select('#lineCharts').select('#Import').select('#overlay');
                current_svg.selectAll('line').style('opacity', 0);
                current_svg.selectAll('text').style('opacity', 0);
            }
            if (bMouseImport == true && bMouseExport == false) {
                let current_svg = d3.select('#lineCharts').select('#Export').select('#overlay');
                current_svg.selectAll('line').style('opacity', 0);
                current_svg.selectAll('text').style('opacity', 0);
            }
            if (bMouseImport == false && bMouseExport == false) {
                let current_svg = d3.select('#lineCharts').select('#Export').select('#overlay');
                current_svg.selectAll('line').style('opacity', 0);
                current_svg.selectAll('text').style('opacity', 0);

                current_svg = d3.select('#lineCharts').select('#Import').select('#overlay');
                current_svg.selectAll('line').style('opacity', 0);
                current_svg.selectAll('text').style('opacity', 0);
            }

        
           
        });
        svg.on('click', (event, d, i) => {
            console.log('evnet', event);
            console.log('d', d);
            console.log('i', i);
            console.log(event.target);
        })
        
    }

    updateLineChart(country) {
            let country_name = country;

            this.lineChart = d3.select('#lineCharts')
            
            this.padding = { left: 80, bottom: 150, right: 50 }
    
            let svg_w = this.lineChart.attr('width');
            let svg_h = this.lineChart.attr('height');
            this.svg_w = svg_w;
            this.svg_h = svg_h;
            this.bMouseMove = false;
            this.country = country_name;
        
            let current_svg = d3.select('#lineCharts').select('#Import');
            current_svg.selectAll('text').remove();
            current_svg.select('#lines').selectAll('path').remove();
            current_svg.select('#x-axis').remove();
            current_svg.append('g').attr('id', 'x-axis');
            current_svg.select('#y-axis').remove();
            current_svg.append('g').attr('id', 'y-axis');
            let current_svg_overlay = current_svg.select('#overlay');
            current_svg_overlay.selectAll('line').remove();
            current_svg_overlay.selectAll('text').remove();

            current_svg = d3.select('#lineCharts').select('#Export');
            current_svg.selectAll('text').remove();
            current_svg.select('#lines').selectAll('path').remove();
            current_svg.select('#x-axis').remove();
            current_svg.append('g').attr('id', 'x-axis');
            current_svg.select('#y-axis').remove();
            current_svg.append('g').attr('id', 'y-axis');
            current_svg_overlay = current_svg.select('#overlay');
            current_svg_overlay.selectAll('line').remove();
            current_svg_overlay.selectAll('text').remove();

            let type = ["Import", "Export"];
            this.tradeType = type[0];
            let LineChartData = this.originalData.filter(v => v.country === country_name && v.tradeType === this.tradeType);
            let temp_data=[]
            LineChartData.forEach(element => {
                element.TradeData.forEach((data,i)=>{
                    data = data || 0
                    let year = String(i+1992)
                    let temp={
                        country: element.country,
                        traders: element.traders,
                        tradeType: element.tradeType,
                        year: year,
                        data: data
                    }
                    temp_data.push(temp)   
                })
            });
            this.renderLineChart(temp_data);
            
            this.tradeType = type[1];
            this.lineChart = d3.select('#lineCharts');
            LineChartData = this.originalData.filter(v => v.country === country_name && v.tradeType === this.tradeType);
            temp_data=[]
            LineChartData.forEach(element => {
                element.TradeData.forEach((data,i)=>{
                    data = data || 0
                    let year = String(i+1992)
                    let temp={
                        country: element.country,
                        traders: element.traders,
                        tradeType: element.tradeType,
                        year: year,
                        data: data
                    }
                    temp_data.push(temp)   
                })
            });
            this.renderLineChart(temp_data);

            

        }


}

