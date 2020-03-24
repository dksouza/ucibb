import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BBText } from 'mov-react-native-ui';
import { StringUtil } from 'mov-react-native';

export default class DecimalText extends Component {
  constructor(props) {
    super(props);
    this.value = parseFloat(this.props.value);
    this.currencySymbol = this.props.currencySymbol;
    this.state = {
      integerValue: '0',
      decimalValue: '00',
    };
  }

  componentDidMount() {
    this.updateValues();
  }

  componentWillReceiveProps(nextProps) {
    const newValue = parseFloat(nextProps.value);
    if (typeof newValue === 'number') {
      this.value = newValue;
      this.updateValues();
    }
  }

  updateValues() {
    if (typeof this.value === 'number') {
      const splitedValue = StringUtil.formatStringToPtBrLocaleValueFormat(this.value).split(',');
      this.setState({ integerValue: splitedValue[0], decimalValue: splitedValue[1] });
    }
  }

  render() {
    const { integerFontSize, decimalFontSize, style } = this.props;
    return (
      <BBText {...this.props}>
        <BBText style={[style, { fontSize: decimalFontSize, fontWeight: '300' }]}>{this.currencySymbol}</BBText>
        <BBText style={[style, { fontSize: integerFontSize, fontWeight: '300' }]}>{this.state.integerValue}</BBText>
        <BBText style={[style, { fontSize: decimalFontSize, fontWeight: '300' }]}>,{this.state.decimalValue}</BBText>
      </BBText>
    );
  }
}

DecimalText.propTypes = {
  decimalFontSize: PropTypes.number,
  integerFontSize: PropTypes.number,
  style: PropTypes.objectOf(PropTypes.any),
  value: PropTypes.number.isRequired,
  currencySymbol: PropTypes.string,
};

DecimalText.defaultProps = {
  integerFontSize: 36,
  decimalFontSize: 20,
  style: {},
  currencySymbol: '',
};
