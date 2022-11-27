const globalApplicationState = {
    chord_Importchart: null,
    chord_Exportchart: null,
    ImportLine: null,
    ExportLine: null,
    dot_Importchart: null,
    dot_ExportcHart: null,
};

let bChordChartLine = true;
let bShowLine = false;

let line_chart_Import = null;
let line_chart_Export = null;

let chord_Importchart = null;
let chord_Exportchart = null;

let dot_Importchart = null;
let dot_Exportchart = null;

let bDotImportchart = true;
let bDotExportchart = true;

let bCurrentLeft = false;
let bCurrentRight = false;

let bLineChartCreate = false;







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

        line_chart_Import = null;
        line_chart_Export = null;

        chord_Importchart = new ChordChart(dataResult, "Import", 2020);
        chord_Exportchart = new ChordChart(dataResult, "Export", 2020);


        globalApplicationState.ImportLine = line_chart_Import;
        globalApplicationState.ExportLine = line_chart_Export;
        globalApplicationState.chord_Importchart = chord_Importchart;
        globalApplicationState.chord_Exportchart = chord_Exportchart;
    });

    

window.onload  = function(){
    let option = document.getElementById("option");
    let page_tt_label = document.getElementById("page_tt_label");
    let page_tt = document.getElementById("page_tt");
    
    option.onchange = function(e){
            let val = e.target.value;
            page_tt.value = val;
            page_tt_label.innerHTML = val;
            getSelectValue();
    }                           
}

function getSelectValue() {
    let option = document.getElementById("option");
    let page_tt_label = document.getElementById("page_tt_label");
    let page_tt = document.getElementById("page_tt");
    let value = page_tt_label.innerHTML;
    console.log(value);
    if (bLineChartCreate == true) {
        call_names = value;
        globalApplicationState.ImportLine.updateLineChart(value);
    }
    if (bLineChartCreate == false) {
        alert("Please select a country you are interseted in the chord chart first....");
    }

    return value;
}


let bubbleChart = new ForceBubbleChart();

document.getElementById('showLine_btn').onclick = function() {
    bShowLine = !bShowLine;
    chord_Exportchart.sliderWnd();
}

// Select the node that will be observed for mutations
var targetNode = document.getElementById("rangeValue");

// Options for the observer (which mutations to observe)
var config = { childList: true };

// Callback function to execute when mutations are observed
var callback = function(mutationsList, observer) {
    let year = document.getElementById("rangeValue").textContent;
    //console.log(year)

    globalApplicationState.chord_Importchart.updateChart(year);
    globalApplicationState.chord_Exportchart.updateChart(year);
    
    globalApplicationState.dot_Importchart.updateChart("Import", year);
    globalApplicationState.dot_Exportchart.updateChart("Export", year);
    
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);