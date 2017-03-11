import test from 'ava';
import {Chromatogram, fromStringifiedJSON} from '..';

// https://en.wikipedia.org/wiki/Cauchy_distribution
function lorentzian(x, x0 = 0, gamma = 1) {
    return (gamma * gamma) / (Math.PI * gamma * (gamma * gamma + (x - x0) * (x - x0)));
}

test('toStringifiedJSON - fromStringifiedJSON', t => {
    const size = 30;
    const fourth = size / 4;
    let times = new Array(size);
    let tic = new Array(size);
    let ms = new Array(size);
    for (let i = 0; i < size; ++i) {
        times[i] = i;
        tic[i] = lorentzian(i, fourth) + 2 * lorentzian(i, 2 * fourth) + lorentzian(i, 3 * fourth);
        ms[i] = [[1, 2, 3], [1, 1, 1]];
    }
    let chrom = new Chromatogram(times);
    chrom.addSeries({
        'tic': tic,
        'ms': ms
    });

    let json = chrom.toStringifiedJSON();
    let newChrom = fromStringifiedJSON(json);
    t.deepEqual(newChrom.getTimes(), chrom.getTimes());
    t.deepEqual(newChrom.getSerie('tic'), chrom.getSerie('tic'));
    t.deepEqual(newChrom.getSerie('ms'), chrom.getSerie('ms'));
});