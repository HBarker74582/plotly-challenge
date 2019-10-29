function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  // Use `.html("") to clear any existing metadata
  // Use `Object.entries` to add each key and value pair to the panel

  d3.json(`/metadata/${sample}`).then(function (data) {
    sampleMetadata = d3.select(`#sample-metadata`);
    sampleMetadata.html("");
    Object.entries(data).forEach(([key, value]) => {
      sampleMetadata.append("p").text(`${key}: ${value}`);
      // console.log(data);
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    var gaugeChart = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: data.WFREQ,
        title: { text: "Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: { axis: { range: [null, 9] } }
      }
    ];

    var layout = { width: 400, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot("gauge", gaugeChart, layout);
  });
}
// @TODO: Use `d3.json` to fetch the sample data for the plots
function buildCharts(sample) {

  d3.json(`/samples/${sample}`).then(function (data) {
    // console.log(data.otu_labels);

    var sampleValues = data.sample_values;
    var otuID = data.otu_ids;
    var otuLabels = data.otu_labels;

    // @TODO: Build a Bubble Chart using the sample data
    var bubbleTrace = [{
      x: otuID,
      y: sampleValues,
      mode: "markers",
      text: otuLabels,
      marker: {
        size: sampleValues,
        color: otuID
      }
    }];

    var traceBubble = bubbleTrace;
    Plotly.newPlot("bubble", traceBubble);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,  otu_ids, and labels (10 each).

    var pieChart = [{
      values: sampleValues.slice(0, 10),
      labels: otuID.slice(0, 10),
      type: "pie"
    }];

    var layout = {
      height: 500,
      width: 400
    };

    var tracePie = pieChart;
    Plotly.newPlot("pie", tracePie, layout);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
