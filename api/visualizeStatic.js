const vega = require('vega');
const vl = require('vega-lite')

async function render(data, vlSpec, format){
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

    if( format === 'png' ) {
        const cvs = await view.toCanvas(1.5);

        return cvs;
    }
    else {
        const svg = await view.toSVG(1);

        return svg;
    }

}

module.exports = render