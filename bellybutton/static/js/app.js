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
          // BONUS: Build the Gauge Chart
          // buildGauge(data.WFREQ);
        }); 
      });
    });
  }


function buildCharts(sample) {
  var sampleUrl = `/samples/${sample}`
  d3.json(sampleUrl).then((data) => {
    var sample_values = data.sample_values;
    var otu_ids = data.otu_ids;
    var otu_labels = data.otu_labels;

  // Bubble Chart using the sample data
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      text: otu_labels,
      marker: {
        color: otu_ids,
        colorscale: "Earth",
        size: sample_values
      }
    };
    var pltdata = [trace1];
    var layout = {
      showlegend: false,
      height: 600,
      width: 1500,
      xaxis: {
        title: {
          text: 'OTU IDs',
        }
      }
    };
    var BUB = document.getElementById("bubble");
    Plotly.newPlot(BUB, pltdata, layout);

    // Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieArray = []
    for (var j = 0; j < otu_ids.length; j++) {
      pieArray.push({'sample_values': sample_values[j], 'otu_ids': otu_ids[j], 'otu_labels': otu_labels[j]}
    )};
   var sorted = pieArray.sort(function(a, b) {
      return parseFloat(b.sample_values) - parseFloat(a.sample_values);
    });
    sorted.sort();
    // Slice the first 10 objects for plotting
    sorted = sorted.slice(0, 10);
    // Reverse the array due to Plotly's defaults
    sorted = sorted.reverse();

    var trace2 = {
      values: sorted.map(row => row.sample_values),
      labels: sorted.map(row => row.otu_ids),
      hovertext: sorted.map(row => row.otu_labels),
      type: "pie"
    };
    var pltdata2 = [trace2];
    var layout2 = {
      height: 500,
      width: 500
    };
    var PIE = document.getElementById("pie");
    Plotly.newPlot(PIE, pltdata2, layout2);
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
