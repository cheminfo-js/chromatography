const Chromatogram = require('../Chromatogram');
const parserXY = require('xy-parser');

/**
 * Creates a new Chromatogram element based in a Txt string
 * @param {string} text - String containing the data as CSV or TSV
 * @return {Chromatogram} - New class element with the given data
 */
export function fromText(text, options) {
    var options = Object.assign({}, options, {arrayType: 'xxyy'});
    const data = parserXY.parse(text, options);


    const time = data[0];
    let series = {
        intensity: data[1]
    };

    return new Chromatogram(time, series);
}
