import {Chromatogram, spectraComparison, scaleAlignment} from '..';
import {lorentzian} from './data/examples';

test('Simple case', async () => {
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
    expect(compared.peaksSimilarity).toEqual([1, 1, 1, 1, 1]);
    expect(compared.peaksFirst.map((val) => val.x)).toEqual([10, 20, 30, 40, 50]);
    expect(compared.peaksSecond.map((val) => val.x)).toEqual([20, 30, 40, 50, 60]);

    let aligned = scaleAlignment(compared.peaksFirst, compared.peaksSecond);
    expect(Math.abs(aligned.scaleRegression.predict(30) - 20) < 1e-4).toEqual(true);
});

test('Quality and string', async () => {
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
    expect(compared.peaksSimilarity).toEqual([1, 1, 1, 1, 1]);
    expect(compared.peaksFirst.map((val) => val.x)).toEqual([10, 20, 30, 40, 50]);
    expect(compared.peaksSecond.map((val) => val.x)).toEqual([20, 30, 40, 50, 60]);

    let aligned = scaleAlignment(compared.peaksFirst, compared.peaksSecond, {computeQuality: true, stringFormula: 3});
    expect(Math.abs(aligned.scaleRegression.predict(30) - 20) < 1e-4).toEqual(true);
    expect(aligned.scaleRegression.toString(3)).toEqual('f(x) = 9.95e-17 * x^3 - 1.22e-14 * x^2 + 1.00 * x - 10.0');
    expect(Math.abs(aligned.r2 - 1) < 1e-4).toEqual(true);
});
