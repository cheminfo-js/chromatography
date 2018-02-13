import fs from 'fs';
import { join } from 'path';

import { Chromatogram, fromJcamp } from '../..';
import { getSimulatedSpectrum } from '../../__tests__/examples';


test('from a Diesel chromatogram', () => {
  const path = join(__dirname, '../../../testFiles/jcamp/P064.JDX');
  const jcamp = fs.readFileSync(path, 'utf8');

  const chrom = fromJcamp(jcamp);
  expect(chrom).toHaveLength(6992);

  let peakList = chrom.getPeaks();
  expect(peakList).toHaveLength(312);
});

test('triplet', () => {
  let chromatogram = getSimulatedSpectrum({ size: 60 });
  let peaks = chromatogram.getPeaks();
  expect(peaks).toHaveLength(1);
});

test('throws when not send a tic serie', () => {
  const size = 30;
  let times = new Array(size);
  for (let i = 0; i < size; ++i) {
    times[i] = i;
  }
  let chromatogram = new Chromatogram(times);

  expect(() => chromatogram.getPeaks()).toThrow('"tic" serie not founded');
});