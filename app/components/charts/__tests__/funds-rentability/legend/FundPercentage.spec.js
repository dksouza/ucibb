import React from 'react';
import { shallow } from 'enzyme';
import FundPercentage from '../../../funds-rentability/legend/fundPercentage';

let wrapper = {};
let props = {};

const name = 'Fundo';
const percent = 10;

describe('FundPercentage', () => {
  beforeAll(() => {
    props = {
      name,
      percent,
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

  it('Shallow BBText', () => {
    expect(wrapper.find('BBText').exists()).toBe(true);
  });

  it('Snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
