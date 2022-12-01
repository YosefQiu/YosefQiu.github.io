/*
 * This is a tool class used to add text for the story telling
*/

async function load (path, countryName) {
    const response = await fetch(path);
    const data = await response.text();
    this.data = data;
    let content = this.splitTxt(data);
    addContent(content, countryName);
    return content;
}

function splitTxt(str) {
    const countries_content = str.split('******');
    return countries_content;
}

function getCountryIdx(countryName) {
    switch (countryName) {
        case 'China':return 1; break;
        case 'United States': return 0; break;
        case 'Japan': return 4; break;
        case 'Korea, Rep.': return 5; break;
        case 'Australia': return 2; break;
        case 'Malaysia': return 6; break;
        case 'Germany': return 3; break;
        case 'Vietnam': return 9; break;
        case 'Thailand': return 8; break;
        case 'Singapore': return 7; break;
    }
}

function addContent(content, countryName) {
    let svg = d3.select('#lineCharts').select('#g_txt');
    let index = getCountryIdx(countryName);
    console.log(index);
    console.log(content);
    svg.selectAll('text').remove();
    svg.selectAll('tspan').remove();


    if (index == 0) {
        let str = content[index];
        let strs = str.split("!!!!") ;
       for (let i = 0; i < strs.length; i++) {
        svg.append('text')
            .attr('x', 30)
            .attr('y', 30 + i * 20)
            .attr('font-size', '20px')
            .style('fill', 'white')
            .text(strs[i]);
       }
    }

    if (index == 1) {
        let str = content[index];
        let strs = str.split("!!!!") ;
       for (let i = 0; i < strs.length; i++) {
        svg.append('text')
            .attr('x', 30)
            .attr('y', 30 + i * 20)
            .attr('font-size', '20px')
            .style('fill', 'white')
            .text(strs[i]);
       }
    }

    if (index == 2) {
        let str = content[index];
        let strs = str.split("!!!!") ;
       for (let i = 0; i < strs.length; i++) {
        svg.append('text')
            .attr('x', 30)
            .attr('y', 30 + i * 30)
            .attr('font-size', '30px')
            .style('fill', 'white')
            .text(strs[i]);
       }
    }

    else {
        let str = content[index];
        let strs = str.split("!!!!") ;
       for (let i = 0; i < strs.length; i++) {
        svg.append('text')
            .attr('x', 30)
            .attr('y', 30 + i * 20)
            .attr('font-size', '20px')
            .style('fill', 'white')
            .text(strs[i]);
       }
    }
    
}

