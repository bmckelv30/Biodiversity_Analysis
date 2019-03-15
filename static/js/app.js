function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = `/metadata/${sample}`
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then((metadata) => {
    // Use `.html("") to clear any existing metadata
    // document.getElementById("sample-metadata").html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    var keys = []
    var values = []
    Object.entries(metadata).forEach(([key,value]) => {
      keys.push(key);
      values.push(value);
    });
    var entry = "<row/>"
    for (var y = 0; y<keys.length; y++) {
      entry += `${keys[y]}: ${values[y]} <br/>`;
    }
    // Use d3 to select the panel with id of `#sample-metadata`
    document.getElementById("sample-metadata").innerHTML = entry;
  //   // BONUS: Build the Gauge Chart
  //   // buildGauge(data.WFREQ);
  });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // var inputValue = selector.property("value", sample);
  var sampleUrl = `/samples/${sample}`
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(sampleUrl).then((data) => {
    console.log(data);
  // Use `d3.json` to fetch the metadata for a sample
  // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: data.map(row => row.otu_ids),
      y: data.map(row => row.sample_values),
      mode: 'markers',
      text: data.map(row => row.otu_labels),
      marker: {
        color: data.map(row => row.otu_ids),
        size: data.map(row => row.sample_values)
      }
    };
    var data = [trace1];
    var BUB = document.getElementById("bubble");
    // Plotly.plot(PIE, data, layout);
    Plotly.newPlot(BUB, data);
    // @TODO: Build a Pie Chart
    data.sort(function(a, b) {
      return parseFloat(b.sample_values) - parseFloat(a.sample_values);
    });
    // Slice the first 10 objects for plotting
    data = data.slice(0, 10);
    // Reverse the array due to Plotly's defaults
    data = data.reverse();

    var trace2 = {
      values: data.map(row => row.sample_values),
      labels: data.map(row => row.otu_ids),
      hoverinfo: data.map(row => row.otu_labels),
      type: "pie"
    };
    var data = [trace2];
    // var layout = {
    //   height: 600,
    //   width: 800
    // };
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var PIE = document.getElementById("pie");
    // Plotly.plot(PIE, data, layout);
    Plotly.newPlot(PIE, data);

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
