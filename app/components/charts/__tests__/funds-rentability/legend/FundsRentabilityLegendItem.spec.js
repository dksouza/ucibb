import React from 'react';
import { shallow } from 'enzyme';
import FundsRentabilityLegendItem from '../../../funds-rentability/legend/legendItem';

let wrapper = {};
let props = {};

describe('FundsRentabilityLegendItem', () => {
  beforeAll(() => {
    props = {
      fundName: 'MULTI DINAMICO V',
      percent: 9.09,
      yieldValue: 0,
      value: 277.3,
      index: 1,
    };

    return props;
  });

  beforeEach(() => {
    wrapper = shallow(<FundsRentabilityLegendItem {...props} />);
    return wrapper;
  });

  it('Shallow View', () => {
    const newProps = { ...props, index: 0 };
    const newWrapper = shallow(<FundsRentabilityLegendItem {...newProps} />);
    expect(newWrapper.find('View').exists()).toBe(true);
  });

  it('Shallow FundPercentage', () => {
    expect(wrapper.find('FundPercentage').exists()).toBe(true);
  });

  it('Shallow BBCurrencyValue', () => {
    expect(wrapper.find('BBCurrencyValue').exists()).toBe(true);
  });

  it('Shallow BBText', () => {
    expect(wrapper.find('BBText').exists()).toBe(true);
  });

  it('Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
