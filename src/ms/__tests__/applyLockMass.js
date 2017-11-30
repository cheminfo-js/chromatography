import {Chromatogram} from '../..';
import {toBeDeepCloseTo} from 'jest-matcher-deep-close-to';
expect.extend({toBeDeepCloseTo});

test('simple case', () => {
    let chromatogram = new Chromatogram(
        [1, 2], {
            ms: [
                [[100, 200, 300], [10, 20, 30]],
                [[622.024747], [274]]
            ]
        }
    );

    let newLength = chromatogram.getTimes().length / 2;
    chromatogram.applyLockMass('C12H19F12N3O6P3'); // em: 622.02951

    expect(chromatogram.getTimes().length).toBe(newLength);
    expect(chromatogram.length).toBe(newLength);
    expect(chromatogram.getSerie('ms').data.length).toBe(newLength);

    expect(chromatogram.getTimes()).toEqual([1]);
    expect(chromatogram.getSerie('ms').data[0][1]).toEqual([10, 20, 30]);

    const expectedMass = [100.005, 200.005, 300.005];
    expect(chromatogram.getSerie('ms').data[0][0]).toBeDeepCloseTo(expectedMass, 3);
});

test('array of mf', () => {
    let chromatogram = new Chromatogram(
        [1, 2], {
            ms: [
                [[100, 200, 300], [10, 20, 30]],
                [[622.024747], [274]]
            ]
        }
    );

    let newLength = chromatogram.getTimes().length / 2;
    chromatogram.applyLockMass(['C12H19F12N3O6P3', 'CCl3H', 'C10H20O3']); // em: 622.02951

    expect(chromatogram.getTimes().length).toBe(newLength);
    expect(chromatogram.length).toBe(newLength);
    expect(chromatogram.getSerie('ms').data.length).toBe(newLength);

    expect(chromatogram.getTimes()).toEqual([1]);
    expect(chromatogram.getSerie('ms').data[0][1]).toEqual([10, 20, 30]);

    const expectedMass = [100.005, 200.005, 300.005];
    expect(chromatogram.getSerie('ms').data[0][0]).toBeDeepCloseTo(expectedMass, 3);
});

test.only('different references', () => {
    let chromatogram = new Chromatogram(
        [1, 2, 3, 4, 5, 6], {
            ms: [
                [[10, 622.024747, 100, 200], [10, 274, 40, 50]],
                [[100, 200, 300], [10, 20, 30]],
                [[188.136240], [272]],
                [[100, 200, 300], [10, 20, 30]],
                [[10], [10]],
                [[100, 200, 300], [10, 20, 30]],
            ]
        }
    );

    let newLength = chromatogram.getTimes().length / 2;
    const {referenceUsed} = chromatogram.applyLockMass(['C12H19F12N3O6P3', 'C10H20O3', 'C100'], {
        oddReference: false
    }); // em: 622.02951

    expect(referenceUsed).toEqual({
        C100: 0,
        C12H19F12N3O6P3: 1,
        C10H20O3: 1,
        total: 3,
        percent: 66.66666666666666,
        totalFound: 2
    });

    expect(chromatogram.getTimes().length).toEqual(newLength);
    expect(chromatogram.length).toEqual(newLength);
    expect(chromatogram.getSerie('ms').data.length).toEqual(newLength);

    expect(chromatogram.getTimes()).toEqual([2, 4, 6]);
    expect(chromatogram.getSerie('ms').data[0][1]).toEqual([10, 20, 30]);
    expect(chromatogram.getSerie('ms').data[1][1]).toEqual([10, 20, 30]);

    const expectedMass = [100.005, 200.005, 300.005];
    expect(chromatogram.getSerie('ms').data[0][0]).toBeDeepCloseTo(expectedMass, 3);
    expect(chromatogram.getSerie('ms').data[1][0]).toBeDeepCloseTo(expectedMass, 3);
});

test('check exceptions', () => {
    let chromatogram = new Chromatogram([1]);
    expect(() => chromatogram.applyLockMass('C12H19F12N3O6P3')).toThrow('The "ms" serie must be defined');
});
