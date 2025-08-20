import { describe, it, expect } from '@jest/globals';
import { normalizeStocksDataDatesAscending } from './util';

describe('normalizeStocksDataDatesAscending', () => {
  it('returns empty array when input is empty', () => {
    expect(normalizeStocksDataDatesAscending([])).toEqual([]);
  });

  it('keeps data in ascending order if already sorted', () => {
    const input = [
      {
        ticker: 'abc',
        data: [
          { Date: '2023-01', Close: '10' },
          { Date: '2023-02', Close: '11' },
          { Date: '2023-03', Close: '12' },
        ],
      },
    ];
    const out = normalizeStocksDataDatesAscending(input);
    expect(out[0].data.map(d => d.Date)).toEqual(['2023-01', '2023-02', '2023-03']);
  });

  it('reverses data when first date is newer than last date', () => {
    const input = [
      {
        ticker: 'xyz',
        data: [
          { Date: '2023-03', Close: '12' },
          { Date: '2023-02', Close: '11' },
          { Date: '2023-01', Close: '10' },
        ],
      },
    ];
    const out = normalizeStocksDataDatesAscending(input);
    expect(out[0].data.map(d => d.Date)).toEqual(['2023-01', '2023-02', '2023-03']);
  });

  it('handles per-stock normalization without mutating input', () => {
    const input = [
      {
        ticker: 'a',
        data: [
          { Date: '2023-02', Close: '11' },
          { Date: '2023-01', Close: '10' },
        ],
      },
      {
        ticker: 'b',
        data: [
          { Date: '2022-12', Close: '9' },
          { Date: '2023-01', Close: '10' },
        ],
      },
    ];
    const copy = JSON.parse(JSON.stringify(input));
    const out = normalizeStocksDataDatesAscending(input);
    expect(out[0].data.map(d => d.Date)).toEqual(['2023-01', '2023-02']);
    expect(out[1].data.map(d => d.Date)).toEqual(['2022-12', '2023-01']);
    // input should remain unchanged
    expect(input).toEqual(copy);
  });

  it('ignores non-parsable dates and leaves order as-is', () => {
    const input = [
      {
        ticker: 'weird',
        data: [
          { Date: 'foo', Close: '1' },
          { Date: 'bar', Close: '2' },
        ],
      },
    ];
    const out = normalizeStocksDataDatesAscending(input);
    expect(out[0].data.map(d => d.Date)).toEqual(['foo', 'bar']);
  });
});


