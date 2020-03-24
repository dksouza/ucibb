import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import BBText from '../BBText/BBText';
import BBPieChart from './bbpiechart';
import BBPieChartUtil from './bbpiechartutil';

export default class BBLabelPieChart extends Component {
  static propTypes = {
    label: PropTypes.string,
    showInnerTotal: PropTypes.bool,
    showCurrencySymbol: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      hexColor: PropTypes.string,
      value: PropTypes.number.isRequired,
    })).isRequired,
  };

  static defaultProps = {
    label: undefined,
    showInnerTotal: false,
    showCurrencySymbol: true,
  };

  constructor(props) {
    super(props);
    this.state = { selectedIndex: null };
    this.coloredData = this.giveColor(this.props.data);
  }

  giveColor(data) {
    return data.map((item, index) => ({
      ...item,
      hexColor: item.hexColor ? item.hexColor : BBPieChartUtil.DEFAULT_COLORS[index % BBPieChartUtil.DEFAULT_COLORS.length],
    }));
  }

  renderColoredData() {
    return this.coloredData.map(item => (
      <View style={{
        paddingLeft: 30,
        height: 10,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
      }}
      >
        <View style={{
          width: 15,
          height: 15,
          borderRadius: 15 / 2,
          backgroundColor: item.hexColor,
        }}
        />
        <BBText regularTitle bold style={{ flex: 1 }}>{'    '}{item.label}</BBText>
      </View>
    ));
  }

  render() {
    return (
      <View style={{
        backgroundColor: '#D3D3D3',
        flex: 1,
        alignItems: 'stretch',
        flexDirection: 'column',
        }}
      >
        <BBPieChart showInnerTotal={this.props.showInnerTotal} showCurrencySymbol={this.props.showCurrencySymbol} data={this.coloredData} />
        <View style={{
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'flex-start',
          flex: 1,
        }}
        >
          <BBText regularTitle bold >{this.props.label}</BBText>
          {this.renderColoredData()}
        </View>
      </View>
    );
  }
}
