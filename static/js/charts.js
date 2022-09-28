function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ID = result.otu_ids;

    var otu_Label = result.otu_labels;
    console.log(otu_Label);

    var sample_Val = result.sample_values.map((value) => parseInt(value));

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ID.slice(0,10).map((id) => "OTU "+ id).reverse();
    console.log(yticks);
   
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x:sample_Val.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
     
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

  

    //NEXT PIECE OF CODE

 // 1. Create the trace for the bubble chart.
 var bubbleData = {
  x: otu_ID,
  y: sample_Val,
  type: "bubble",
  text: otu_Label,
  hoverinfo: "x+y+text",
  mode: "markers",
  marker: {size: sample_Val, color: otu_ID, colorscale: "Earth"}
     
 };

// 2. Create the layout for the bubble chart.
var bubbleLayout = {
  title: {
    text: "<b>Bacteria Cultures/Sample</b>",
    y: 0.9,
  },
  xaxis: {
    title: {
      text: "OTU ID",
      font: {
        family: "arial black",
        size: 18,
        color: "black"
      }
    },
  },
  hovermode: "closest",
};

// 3. Use Plotly to plot the data with the layout.
Plotly.newPlot("bubble", [bubbleData], bubbleLayout); 


// NEXT PIECE OF CODE


    // Create a variable that holds the metadata array. 
    var metadata = data.metadata;

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
   
    // 2. Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];

    // 3. Create a variable that holds the washing frequency.
    var wfreq = parseFloat(result.wfreq);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        value: wfreq,
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          bar: {color: "black"},
          axis: {range:[0,10], dtick:2},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "yellowgreen" },
            { range: [8, 10], color: "green" },
          ],
        }
      }
     ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: { 
        text:"<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
     
      width: 500, height: 450, margin: { t: 100, b: 75, l: 75, r: 75 }
      
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}