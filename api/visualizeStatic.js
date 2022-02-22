vega = require('vega');
vl = require('vega-lite')
fs = require('fs');

async function render(data, vlSpec){
    vlSpec["data"] = {"values": data}
    
    const spec = vl.compile(vlSpec).spec

    const view = new vega.View(vega.parse(spec), {
        loader: vega.loader(),
        logLevel: vega.Warn,
        renderer: 'none',
        hover: true
    }).initialize()

    view.hover();
    view.finalize();
    // generate a static SVG image
    const svg = await view.toSVG(1);

    return svg;
}

module.exports = render