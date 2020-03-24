import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { BBColors } from 'mov-react-native-ui';
import { PieChart } from 'react-native-svg-charts';
import Svg, { Circle } from 'react-native-svg';
import { View } from 'native-base';

export default class Piechart extends PureComponent {
  constructor(props) {
    super(props);
    const { data, radius } = this.props;
    this.radius = radius;
    this.diameter = radius * 2;
    this.state = {
      data,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      this.setState({ data: nextProps.data });
    }
  }

  renderPie = () => {
    const pieData = this.state.data.filter(item => item.percentualAlocacaoClasse > 0).map((item, index) => this.getPieItem(item, index));
    return <PieChart style={{ height: this.diameter, width: this.diameter }} data={pieData} padAngle={0} animate />;
  };

  getPieItem(item, index) {
    return {
      value: item.percentualAlocacaoClasse,
      svg: {
        fill: item.color,
        onPress: () => {},
      },
      key: `pie-${index}`,
    };
  }

  render() {
    const isEmpty = this.state.data.every(item => item.percentualAlocacaoClasse === 0);
    const left = this.radius;
    const top = this.radius;
    const edge = this.diameter + 2;
    const viewBox = `-1 -1 ${edge} ${edge}`;
    return (
      <View>
        {isEmpty ? (
          <View style={{ marginTop: 13 }}>
            <Svg height={this.diameter} width={this.diameter} viewBox={viewBox}>
              <Circle cx={left} cy={top} r={this.radius} stroke="#8c8c8c" strokeWidth="1" fill={BBColors.CurrentTheme.Default_Background} />
              <Circle cx={left} cy={top} r={this.radius / 2} stroke="#8c8c8c" strokeWidth="1" fill={BBColors.CurrentTheme.Default_Background} />
            </Svg>
          </View>
        ) : (
          this.renderPie()
        )}
      </View>
    );
  }
}

Piechart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  radius: PropTypes.number,
};

Piechart.defaultProps = {
  radius: 55,
};
