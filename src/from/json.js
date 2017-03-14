'use strict';

const Chromatogram = require('./../Chromatogram');

/**
 * Parse from a JSON element to a new Chromatogram
 * @param {object} json - Result from the toJSON method
 * @return {Chromatogram} - New parsed Chromatogram
 */
function fromJSON(json) {
    let series = json.series;
    let times = json.times;
    let chromatogram = new Chromatogram(times);
    for (let key of Object.keys(series)) {
        chromatogram.addSerie(key, series[key].data, {
            meta: series[key].meta
        });
    }
    return chromatogram;
}

module.exports = fromJSON;