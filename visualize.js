vega = require('vega');
vl = require('vega-lite')
fs = require('fs');

function drawVisualizations(data, specificSpecs=null) {
    let specs
    if(specificSpecs == null) {
        specs = fs.readdirSync("viz-specs")
    }
    else {
        specs = specificSpecs
    }
    for(let spec of specs){
        render(data, spec.substr(0, spec.length - 5))
    }
}

function render(data, specFile){
    let fileSpec = JSON.parse(fs.readFileSync("viz-specs/" + specFile + ".json", "UTF8"))
    fileSpec["data"] = data
    let spec = vl.compile(fileSpec).spec

    var view = new vega.View(vega.parse(spec), {
        loader: vega.loader(),
        logLevel: vega.Warn,
        renderer: 'none'
    }).initialize().finalize();

    // generate a static SVG image
    view.toSVG(1)
    .then(function(svg) {
        fs.writeFileSync("output/" + specFile + ".svg", svg)
    })
    .catch(function(err) { console.error(err); });
}

module.exports = {
    drawVisualizations: drawVisualizations
}