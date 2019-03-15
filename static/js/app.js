function buildMetadata(sample) {

  var url = `/metadata/${sample}`;
  var sampleData = d3.select("#sample-metadata");

    d3.json(url).then((metadata) => {
      var metadata = [metadata];
      metadata.forEach((sampledata) =>{
        sampleData.html("");
        var row = sampleData.append("tr");
        Object.entries(sampledata).forEach(([key,value]) => {
          var cell = row.append("tr");
          var display = cell.text(`${key}: ${value}`);
          //   // BONUS: Build the Gauge Chart
          //   // buildGauge(data.WFREQ); 
        }); 
      });
    });
  }


function buildCharts(sample) {
  var sampleUrl = `/samples/${sample}`
  d3.json(sampleUrl).then((data) => {
    console.log(data);
    var sample_values = data.sample_values.slice(0,10);
    var otu_ids = data.otu_ids.slice(0,10)
    var otu_labels = data.otu_labels.slice(0,10)
  // Bubble Chart using the sample data
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      text: otu_labels,
      marker: {
        color: [otu_ids],
        size: sample_values
      }
    };
    var data = [trace1];
    var layout = {
      showlegend: false,
      height: 400,
      width: 1200
    };
    var BUB = document.getElementById("bubble");
    Plotly.newPlot(BUB, data, layout);

    // Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    // Figure out how to sort!
    // data.sort(function(a, b) {
    //   return parseFloat(b.sample_values) - parseFloat(a.sample_values);
    // });
    // // Slice the first 10 objects for plotting
    // data = data.slice(0, 10);
    // // Reverse the array due to Plotly's defaults
    // data = data.reverse();

    var trace2 = {
      values: sample_values,
      labels: otu_ids,
      hoverinfo: otu_labels,
      type: "pie"
    };
    var data2 = [trace2];
    var layout2 = {
      height: 500,
      width: 500
    };
    var PIE = document.getElementById("pie");
    Plotly.newPlot(PIE, data2, layout2);
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
