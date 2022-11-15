

// Promise.all([d3.csv('./dataset2.csv')]).then( data =>
//     {
//     // processing data here
//     // ******* STATE MANAGEMENT *******
//     // This should be all you need, but feel free to add to this if you need to 
//     // communicate across the visualizations
//     const globalApplicationState = {
//         selectedCountry: null,
//         selectedState:null, // importing or exporting
//         selectedYear:null, // this should be initialized to the latest year
//         importingChart: null, //chord chart
//         exportingChart:null,// chord chart
//         lineChart: null,
//         data:null
//     };

//     console.log(globalApplicationState);
//     });//background: #88b6f7;

   
function checkYear(num) {
    let baseStr = "year_";
    let baseYear = 1992 + num
    return String(baseStr + String(baseYear));
}    

let aa = checkYear(0);
console.log(aa);

d3.csv('./ProcessedData/dataset2.csv')
    .then(dataOutput => {
        const dataResult = dataOutput.map((d) =>({
            country: String(d.ReporterName),
            traders: String(d.PartnerName),
            tradeType: String(d.TradeFlow),
            TradeData:[
            parseFloat(d.year_1992),
            parseFloat(d.year_1993),
            parseFloat(d.year_1994),
            parseFloat(d.year_1995),
            parseFloat(d.year_1996),
            parseFloat(d.year_1997),
            parseFloat(d.year_1998),
            parseFloat(d.year_1998),
            parseFloat(d.year_2000),
            parseFloat(d.year_2001),
            parseFloat(d.year_2002),
            parseFloat(d.year_2003),
            parseFloat(d.year_2004),
            parseFloat(d.year_2005),
            parseFloat(d.year_2006),
            parseFloat(d.year_2007),
            parseFloat(d.year_2008),
            parseFloat(d.year_2009),
            parseFloat(d.year_2010),
            parseFloat(d.year_2011),
            parseFloat(d.year_2012),
            parseFloat(d.year_2013),
            parseFloat(d.year_2014),
            parseFloat(d.year_2015),
            parseFloat(d.year_2016),
            parseFloat(d.year_2017),
            parseFloat(d.year_2018),
            parseFloat(d.year_2019),
            parseFloat(d.year_2020)],
            year_length: parseInt(2020 - 1992 + 1)
        }));

        //console.log(dataResult);

        let line_chart_Import = new LineChart(dataResult, "Import","China");
        let line_chart_Export = new LineChart(dataResult, "Export","China");

        let chord_Importchart = new ChordChart(dataResult, "Import", 2020);
        let chord_Exportchart = new ChordChart(dataResult, "Export", 2020);
    });


    window.onload  = function(){
        let option = document.getElementById("option");
        let page_tt_label = document.getElementById("page_tt_label");
        let page_tt= document.getElementById("page_tt");
       
           option.onchange = function(e){
              let val = e.target.value;
              page_tt.value = val;
              page_tt_label.innerHTML = val;
           }                           
       }