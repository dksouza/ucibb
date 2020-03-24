import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { BBText } from 'mov-react-native-ui';
import Piechart from './PieChart';
import DecimalText from './DecimalText';

export default class InvestmentsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      subtitle: this.props.subtitle,
      value: this.props.value,
      chartData: this.props.chartData,
      footerMessage: this.props.footerMessage,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value, chartData, footerMessage } = nextProps;
    this.setState({ value, chartData, footerMessage });
  }

  render() {
    return (
      <View style={[BBStyles.container, BBStyles.row]}>
        <View style={BBStyles.pieChartContainer}>
          <Piechart data={this.state.chartData} />
        </View>
        <View style={BBStyles.detailsContainer}>
          <BBText tinyTitle style={{ fontSize: 12 }}>
            {this.state.title}
          </BBText>
          <BBText style={{ fontSize: 12, paddingTop: 5 }}>{this.state.subtitle}</BBText>
          <DecimalText tinyTitle value={this.state.value} integerFontSize={20} decimalFontSize={9} currencySymbol="R$" />
          <View style={BBStyles.row}>
            {this.state.chartData.map(item => (
              <View style={{ paddingTop: 13, paddingRight: 20 }}>
                <BBText>
                  <BBText tinyTitle style={{ color: item.color, fontSize: 24 }}>
                    {item.value}
                  </BBText>
                  <BBText tinyTitle style={{ color: item.color, fontSize: 12 }}>
                    %
                  </BBText>
                </BBText>
                <BBText tinyTitle style={{ fontSize: 10 }}>
                  {item.subtitle}
                </BBText>
              </View>
            ))}
          </View>
          <BBText note style={{ fontSize: 10, paddingRight: 20, paddingTop: 6 }}>
            {this.state.footerMessage}
          </BBText>
        </View>
      </View>
    );
  }
}

InvestmentsDetail.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  value: PropTypes.number,
  chartData: PropTypes.arrayOf(PropTypes.object),
  footerMessage: PropTypes.string,
};

InvestmentsDetail.defaultProps = {
  title: 'ATUALMENTE',
  subtitle: 'Minha carteira',
  value: 0.0,
  chartData: [],
  footerMessage: '',
};

const BBStyles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
  },
  pieChartContainer: {
    flex: 0.45,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 0.55,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});
