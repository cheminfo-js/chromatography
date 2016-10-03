import test from 'ava';
import {convert} from 'jcampconverter';
import fs from 'fs';
import Promise from 'bluebird';
import {join} from 'path';
import {Chromatogram, peakPicking} from '..';

const readFileAsync = Promise.promisify(fs.readFile);

// https://en.wikipedia.org/wiki/Cauchy_distribution
function lorentzian(x, x0 = 0, gamma = 1) {
    return (gamma * gamma) / (Math.PI * gamma * (gamma * gamma + (x - x0) * (x - x0)));
}

test('from a Diesel chromatogram', async t => {
    const path = join(__dirname, 'data/jcamp/P064.JDX');
    const jcamp = await readFileAsync(path, 'utf8');
    const data = convert(jcamp, {newGCMS: true}).gcms;
    const chrom = new Chromatogram(data);
    t.is(chrom.length, 6992);

    let peakList = peakPicking(chrom);
    t.is(peakList.length, 312);
});

test('triplet', t => {
    const size = 60;
    const fourth = size / 4;
    let times = new Array(size);
    let tic = new Array(size);
    let ms = new Array(size);
    for (let i = 0; i < size; ++i) {
        times[i] = i;
        tic[i] = lorentzian(i, fourth, 9) + 2 * lorentzian(i, 2 * fourth, 9) + lorentzian(i, 3 * fourth, 9);
        ms[i] = [[1, 2, 3], [1, 1, 1]];
    }
    let chrom = new Chromatogram(times);
    chrom.addSerie({
        dimension: 1,
        name: 'tic',
        data: tic
    });
    chrom.addSerie({
        dimension: 2,
        name: 'ms',
        data: ms
    });

    let peaks = peakPicking(chrom);
    t.is(peaks.length, 1);
});

test('throws when not send a tic serie', t => {
    const size = 30;
    let times = new Array(size);
    for (let i = 0; i < size; ++i) {
        times[i] = i;
    }
    let chrom = new Chromatogram(times);

    t.throws(peakPicking.bind(null, chrom), '\'tic\' serie not founded');
});
