import React from 'react';
import { shallow } from 'enzyme';
import FundsRentabilityPieChart from '../../funds-rentability';

let wrapper = {};
let props = {};

const title = 'Teste';
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
    yieldValue: 1000,
  },
  {
    fundName: 'MULTI DINAMICO V',
    value: 277.3,
    yieldValue: 100,
  },
];

describe('FundsRentabilityPieChart', () => {
  beforeAll(() => {
    props = {
      data,
      title,
    };

    return props;
  });

  beforeEach(() => {
    wrapper = shallow(<FundsRentabilityPieChart {...props} />);
    return wrapper;
  });

  it('Shallow View', () => {
    expect(wrapper.find('View').exists()).toBe(true);
  });

  it('Shallow BBPieChart', () => {
    expect(wrapper.find('BBPieChart').exists()).toBe(true);
  });

  it('Shallow FundsRentabilityLegend - no title', () => {
    props = [...props.data, { title: '' }];
    expect(wrapper.find('FundsRentabilityLegend').exists()).toBe(true);
  });

  it('Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
