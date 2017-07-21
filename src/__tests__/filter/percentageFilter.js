import {Chromatogram} from '../../index';
import {percentageFilter} from '../../filter/percentageFilter';

test('simple case', () => {
    let chromatogram = new Chromatogram(
        [1, 2], {
            ms: [
                [[100, 200, 300], [10, 40, 300]],
                [[600], [274]]
            ]
        }
    );

    let ms = percentageFilter(chromatogram, 'ms');
    expect(ms.data).toEqual([
        [[200, 300], [40, 300]],
        [[600], [274]]
    ]);
});

describe('inplace', () => {
    it('default behavior', () => {
        let chromatogram = new Chromatogram(
            [1, 2], {
                ms: [
                    [[100, 200, 300], [10, 40, 300]],
                    [[600], [274]]
                ]
            }
        );
        chromatogram.percentageFilter('ms');
        expect(chromatogram.series.msPercentage.data).toEqual([
            [[200, 300], [40, 300]],
            [[600], [274]]
        ]);
        expect(chromatogram.series.ms.data).toEqual([
            [[100, 200, 300], [10, 40, 300]],
            [[600], [274]]
        ]);
    });

    it('input name', () => {
        let chromatogram = new Chromatogram(
            [1, 2], {
                ms: [
                    [[100, 200, 300], [10, 40, 300]],
                    [[600], [274]]
                ]
            }
        );
        chromatogram.percentageFilter('ms', {serieName: 'filtered'});
        expect(chromatogram.series.filtered.data).toEqual([
            [[200, 300], [40, 300]],
            [[600], [274]]
        ]);
        expect(chromatogram.series.ms.data).toEqual([
            [[100, 200, 300], [10, 40, 300]],
            [[600], [274]]
        ]);
    });
});
