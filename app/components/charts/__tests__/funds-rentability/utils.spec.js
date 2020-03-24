import {
  mapDataToChart,
  getTotalValue,
  getItemPercentage,
} from '../../funds-rentability/utils';

const data = [
  {
    fundName: 'MULTI DINAMICO V',
    value: 277.3,
    yieldValue: 0,
  },
  {
    fundName: 'MULTI DINAMICO V',
    value: 277.3,
    yieldValue: 0,
  },
  {
    fundName: 'MULTI DINAMICO V',
    value: 277.3,
    yieldValue: 0,
  },
  {
    fundName: 'MULTI DINAMICO V',
    value: 277.3,
    yieldValue: 0,
  },
  {
    fundName: 'MULTI DINAMICO V',
    value: 277.3,
    yieldValue: 0,
  },
  {
    fundName: 'MULTI DINAMICO V',
    value: 277.3,
    yieldValue: 0,
  },
  {
    fundName: 'MULTI DINAMICO V',
    value: 277.3,
    yieldValue: 0,
  },
  {
    fundName: 'MULTI DINAMICO V',
    value: 277.3,
    yieldValue: 0,
  },
  {
    fundName: 'MULTI DINAMICO V',
    value: 277.3,
    yieldValue: 0,
  },
  {
    fundName: 'MULTI DINAMICO V',
    value: 277.3,
    yieldValue: 0,
  },
  {
    fundName: 'MULTI DINAMICO V',
    value: 277.3,
    yieldValue: 0,
  },
];

describe('mapDataToChart()', () => {
  it('should convert an array to formattedData', () => {
    const result = mapDataToChart(data);
    const expected = [
      {
        fundName: 'MULTI DINAMICO V',
        value: 277.3,
        yieldValue: 0,
        key: 'MULTI DINAMICO V',
        svg: { fill: '#005AA5' },
        hexColor: '#005AA5',
        percent: 9.09,
      },
      {
        fundName: 'MULTI DINAMICO V',
        value: 277.3,
        yieldValue: 0,
        key: 'MULTI DINAMICO V',
        svg: { fill: '#00ACC1' },
        hexColor: '#00ACC1',
        percent: 9.09,
      },
      {
        fundName: 'MULTI DINAMICO V',
        value: 277.3,
        yieldValue: 0,
        key: 'MULTI DINAMICO V',
        svg: { fill: '#FFB300' },
        hexColor: '#FFB300',
        percent: 9.09,
      },
      {
        fundName: 'MULTI DINAMICO V',
        value: 277.3,
        yieldValue: 0,
        key: 'MULTI DINAMICO V',
        svg: { fill: '#D81B60' },
        hexColor: '#D81B60',
        percent: 9.09,
      },
      {
        fundName: 'MULTI DINAMICO V',
        value: 277.3,
        yieldValue: 0,
        key: 'MULTI DINAMICO V',
        svg: { fill: '#5E35B1' },
        hexColor: '#5E35B1',
        percent: 9.09,
      },
      {
        fundName: 'MULTI DINAMICO V',
        value: 277.3,
        yieldValue: 0,
        key: 'MULTI DINAMICO V',
        svg: { fill: '#F4511E' },
        hexColor: '#F4511E',
        percent: 9.09,
      },
      {
        fundName: 'MULTI DINAMICO V',
        value: 277.3,
        yieldValue: 0,
        key: 'MULTI DINAMICO V',
        svg: { fill: '#6D4C41' },
        hexColor: '#6D4C41',
        percent: 9.09,
      },
      {
        fundName: 'MULTI DINAMICO V',
        value: 277.3,
        yieldValue: 0,
        key: 'MULTI DINAMICO V',
        svg: { fill: '#C0CA33' },
        hexColor: '#C0CA33',
        percent: 9.09,
      },
      {
        fundName: 'MULTI DINAMICO V',
        value: 277.3,
        yieldValue: 0,
        key: 'MULTI DINAMICO V',
        svg: { fill: '#43A047' },
        hexColor: '#43A047',
        percent: 9.09,
      },
      {
        fundName: 'Outros',
        value: 554.6,
        yieldValue: 0,
        key: 'Outros',
        svg: { fill: '#646464' },
        hexColor: '#646464',
        percent: 18.18,
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should empty array []', () => {
    const result = mapDataToChart([]);
    const expected = [];
    expect(result).toEqual(expected);
  });
});

describe('getTotalValue()', () => {
  it('should return total value', () => {
    const result = getTotalValue(data);
    const expected = 3050.3000000000006;

    expect(result).toEqual(expected);
  });

  it('should empty array []', () => {
    const result = getTotalValue([]);
    const expected = 0;
    expect(result).toEqual(expected);
  });
});

describe('getItemPercentage()', () => {
  it('should return percentage item', () => {
    const result = getItemPercentage(100, 25);
    const expected = 25;

    expect(result).toEqual(expected);
  });

  it('should return 0 by wrog calculate', () => {
    const result = getItemPercentage('NaN', 'NaN');
    const expected = 0;
    expect(result).toEqual(expected);
  });

  it('should return 0 by null values', () => {
    const result = getItemPercentage(0 / 0, 0 / 0);
    const expected = 0;
    expect(result).toEqual(expected);
  });
});
