import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { StringUtil } from 'mov-react-native';
import { PieChart } from 'react-native-svg-charts';
import BBText from '../BBText/BBText';
import BBPieChartUtil from './bbpiechartutil';

export default class BBPieChart extends Component {
  static propTypes = {
    innerLabel: PropTypes.string,
    showInnerTotal: PropTypes.bool,
    showCurrencySymbol: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      hexColor: PropTypes.string,
      value: PropTypes.number.isRequired,
    })).isRequired,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    innerLabel: undefined,
    showInnerTotal: false,
    showCurrencySymbol: true,
    onPress: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: null,
    };
    this.totalValue = this.calcTotal();
    this.highlightSlice = this.highlightSlice.bind(this);
  }

  calcTotal() {
    return this.props.data.reduce((sum, item) => sum + item.value, 0);
  }

  giveColor(index) {
    return BBPieChartUtil.DEFAULT_COLORS[index % BBPieChartUtil.DEFAULT_COLORS.length];
  }

  mountData() {
    const { data, onPress } = this.props;
    return data.map((item, index) => ({
      key: index,
      value: item.value,
      svg: { fill: item.hexColor ? item.hexColor : this.giveColor(index) },
      arc: { outerRadius: this.state.selectedIndex === index ? '110%' : '100%' },
      onPress: () => onPress && this.highlightSlice(index, item, onPress),
    }));
  }

  highlightSlice(index, item, onPress) {
    if (index === this.state.selectedIndex) {
      this.setState({ selectedIndex: undefined });
      onPress();
    } else {
      this.setState({ selectedIndex: index });
      onPress(index, item);
    }
  }

  render() {
    return (
      <View style={{
        justifyContent: 'center',
        height: 300,
        flexDirection: 'column',
        }}
      >
        <PieChart
          style={{ flex: 1 }}
          outerRadius="80%"
          innerRadius="60%"
          padAngle={0.025}
          data={this.mountData()}
        />
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          flex: 1,
          position: 'absolute',
        }}
        >
          {this.props.innerLabel && <BBText regularTitle >{ this.props.innerLabel }</BBText>}
          {this.props.showInnerTotal &&
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            {this.props.showCurrencySymbol && <BBText tinyTitle style={{ fontSize: 12, color: '#2260AA' }}>R$ </BBText>}
            <BBText bold style={{ fontSize: 22, color: '#2260AA' }}>{ StringUtil.formatStringToPtBrLocaleValueFormat(this.totalValue) }</BBText>
          </View>
          }
        </View>
      </View>
    );
  }
}
