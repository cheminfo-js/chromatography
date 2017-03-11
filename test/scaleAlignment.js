import test from 'ava';
import {Chromatogram, spectraComparison, scaleAlignment} from '..';

// https://en.wikipedia.org/wiki/Cauchy_distribution
function lorentzian(x, x0 = 0, gamma = 1) {
    return (gamma * gamma) / (Math.PI * gamma * (gamma * gamma + (x - x0) * (x - x0)));
}

test('Simple case', async t => {
    const size = 70;
    const peakX = 10;
    let times = new Array(size);
    let tic1 = new Array(size);
    let tic2 = new Array(size);
    let ms1 = new Array(size);
    let ms2 = new Array(size);
    for (let i = 0; i < size; ++i) {
        times[i] = i;
        tic1[i] = lorentzian(i, peakX) + 2 * lorentzian(i, 2 * peakX) + 3 * lorentzian(i, 3 * peakX) + lorentzian(i, 4 * peakX) + 2 * lorentzian(i, 5 * peakX);
        tic2[i] = lorentzian(i, 2 * peakX) + 2 * lorentzian(i, 3 * peakX) + lorentzian(i, 4 * peakX) + 2 * lorentzian(i, 5 * peakX) + lorentzian(i, 6 * peakX);
        ms1[i] = [[(i + 10), 2 * (i + 10), 3 * (i + 10)], [1, 1, 1]];
        ms2[i] = [[i, 2 * i, 3 * i], [1, 1, 1]];
    }

    const options = {
        heightFilter: 0
    };

    let chrom1 = new Chromatogram(times);
    chrom1.addSerie('tic', tic1);
    chrom1.addSerie('ms', ms1);

    let chrom2 = new Chromatogram(times);
    chrom2.addSerie('tic', tic2);
    chrom2.addSerie('ms', ms2);

    let compared = spectraComparison(chrom1, chrom2, options);
    t.deepEqual(compared.peaksSimilarity, [1, 1, 1, 1, 1]);
    t.deepEqual(compared.peaksFirst.map((val) => val.x), [10, 20, 30, 40, 50]);
    t.deepEqual(compared.peaksSecond.map((val) => val.x), [20, 30, 40, 50, 60]);

    let aligned = scaleAlignment(compared.peaksFirst, compared.peaksSecond);
    t.is(Math.abs(aligned.scaleRegression.predict(30) - 20) < 1e-4, true);
});

test('Quality and string', async t => {
    const size = 70;
    const peakX = 10;
    let times = new Array(size);
    let tic1 = new Array(size);
    let tic2 = new Array(size);
    let ms1 = new Array(size);
    let ms2 = new Array(size);
    for (let i = 0; i < size; ++i) {
        times[i] = i;
        tic1[i] = lorentzian(i, peakX) + 2 * lorentzian(i, 2 * peakX) + 3 * lorentzian(i, 3 * peakX) + lorentzian(i, 4 * peakX) + 2 * lorentzian(i, 5 * peakX);
        tic2[i] = lorentzian(i, 2 * peakX) + 2 * lorentzian(i, 3 * peakX) + lorentzian(i, 4 * peakX) + 2 * lorentzian(i, 5 * peakX) + lorentzian(i, 6 * peakX);
        ms1[i] = [[(i + 10), 2 * (i + 10), 3 * (i + 10)], [1, 1, 1]];
        ms2[i] = [[i, 2 * i, 3 * i], [1, 1, 1]];
    }

    const options = {
        heightFilter: 0
    };

    let chrom1 = new Chromatogram(times);
    chrom1.addSerie('tic', tic1);
    chrom1.addSerie('ms', ms1);

    let chrom2 = new Chromatogram(times);
    chrom2.addSerie('tic', tic2);
    chrom2.addSerie('ms', ms2);

    let compared = spectraComparison(chrom1, chrom2, options);
    t.deepEqual(compared.peaksSimilarity, [1, 1, 1, 1, 1]);
    t.deepEqual(compared.peaksFirst.map((val) => val.x), [10, 20, 30, 40, 50]);
    t.deepEqual(compared.peaksSecond.map((val) => val.x), [20, 30, 40, 50, 60]);

    let aligned = scaleAlignment(compared.peaksFirst, compared.peaksSecond, {computeQuality: true, stringFormula: 3});
    t.is(Math.abs(aligned.scaleRegression.predict(30) - 20) < 1e-4, true);
    t.is(aligned.scaleRegression.toString(3), 'f(x) = 9.95e-17 * x^3 - 1.22e-14 * x^2 + 1.00 * x - 10.0');
    t.is(Math.abs(aligned.r2 - 1) < 1e-4, true);
});
