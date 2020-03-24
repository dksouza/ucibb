import React from 'react';
import { shallow } from 'enzyme';
import FundPercentage from '../../../funds-rentability/legend';

let wrapper = {};
let props = {};

const data = [
  {
    fundName: 'MULTI DINAMICO V',
    value: 277.3,
    yieldValue: 0,
    key: 'MULTI DINAMICO V',
    svg: { fill: '#005AA5' },
    hexColor: '#005AA5',
    percent: 9.09,
  },
];

describe('FundPercentage', () => {
  beforeAll(() => {
    props = {
      data,
    };

    return props;
  });

  beforeEach(() => {
    wrapper = shallow(<FundPercentage {...props} />);
    return wrapper;
  });

  it('Shallow View', () => {
    expect(wrapper.find('View').exists()).toBe(true);
  });

  it('Shallow FundsRentabilityLegendItem', () => {
    expect(wrapper.find('FundsRentabilityLegendItem').exists()).toBe(true);
  });

  it('Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
