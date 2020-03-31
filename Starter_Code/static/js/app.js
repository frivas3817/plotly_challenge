
/***********************************************/
function optionChanged(newSample) {
    createBarChart(newSample)
    createBubbleChart(newSample);
    buildMetadata(newSample);
}
/***********************************************/
function buildMetadata(sample) {
    var panel = d3.select('#sample-metadata');

    panel.html('');
    d3.json('samples.json').then(data => {
        var metadata = data.metadata.filter(obj => obj.id == sample)[0];
        Object.entries(metadata).forEach(([key, value]) => {
            panel
                .append('h6')
                .text(`${key.toUpperCase()}: ${value}`)
        })
        buildGauge(metadata.wfreq)
    })
}
/***********************************************/
function createBubbleChart(sample) {
    d3.json('samples.json').then(data => {
        var samples = data.samples.filter(obj => obj.id == sample)[0];

        var bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            margin: { t: 0 },
            hovermode: 'closest',
            xaxis: { title: 'OTU ID' },
            margin: { t: 30 }
        };

        var bubbleData = [
            {
                x: samples.otu_ids,
                y: samples.sample_values,
                test: samples.otu_labels,
                mode: 'markers',
                marker: {
                    size: samples.sample_values,
                    color: samples.otu_ids,
                    colorscale: 'Earth'
                }
            }
        ];

        Plotly.newPlot('bubble', bubbleData, bubbleLayout)
    })
}

/***********************************************/
function createBarChart(sample) {
    d3.json('samples.json').then(data => {
        var samples = data.samples.filter(obj => obj.id == sample)[0];
        var yticks = samples.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

        var barData = [
            {
                y: yticks,
                x: samples.sample_values.slice(0, 10).reverse(),
                text: samples.otu_labels.slice(0, 10).reverse(),
                type: 'bar',
                orientation: 'h'
            }
        ];

        var barLayout = {
            title: 'Top 10 Bacteria Cultures Found',
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot('bar', barData, barLayout);
    });
};
/***********************************************/
function fillDropDown() {
    var selector = d3.select('select');
    d3.json('samples.json').then(data => {
        data.names.forEach(name => {
            selector
                .append('option')
                .text(name)
                .property('value', name)
        });
        buildMetadata(data.names[0]);
        createBubbleChart(data.names[0]);
        createBarChart(data.names[0]);
    })
}
/***********************************************/

fillDropDown()