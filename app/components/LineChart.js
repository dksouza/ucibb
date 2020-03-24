import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
// import { BBText } from 'mov-react-native-ui';
import PropTypes from 'prop-types';
import { G, Line, Circle, Svg, Text as SVGText } from 'react-native-svg';
import { LineChart, XAxis, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';
import { NumberUtils } from '../utils/Utils';


const Decorator = ({
  x, y, data, color,
}) => data.map((value, index) => <Circle key={index} cx={x(index)} cy={y(value)} r={5} fill={color} />);

const LineY = ({ x, data }) =>
  data.map(() => (
    <G>
      {data.map((_, index) => (
        <Line key={`line-y-${index}`} y1="3%" y2="97%" x1={x(index)} x2={x(index)} stroke="#c1c1c1" />
      ))}
    </G>
  ));
export default class Linechart extends PureComponent {
  static navigationOptions = {
    header: false,
  };

  constructor(props) {
    super(props);
    // calcula maior valor
    const { list, period } = this.props;
    const allValues = [];
    list.forEach(item => allValues.push(...item.values));
    console.log(list);
    this.max = allValues.reduce((prev, current) => (prev > current ? prev : current));
    const expectedValue = {
      expected:{
        value: list.find(x => x.name === 'Esperado').values.slice(-1)[0],
        color: list.find(x => x.name === 'Esperado').color

      }
    };
    this.min = allValues.reduce((prev, current) => (prev < current ? prev : current));
    this.dataY = [this.min, this.max];
    // quantos elementos tem na lista de valores?
    const xElements = list ? list[0].values.length : 0;
    this.xList = Array.from({ length: xElements }, (_, key) => key);
    // scale
    this.labelsHeight = 150;
    const padding = 5;
    this.yLabelsScale = scale
      .scaleLinear()
      .domain([this.min, this.max])
      .range([this.labelsHeight - padding, padding]);
    const profilesList = this.getProfilesList(list);
    this.state = {
      list,
      period,
      profilesList,
      expectedValue
    };
  }


  render() {
    return (
      <View style={styles.container}>
        {/* <View style={{ flex: 0.1, flexDirection: 'row', justifyContent: 'center' }}>
          <View style={styles.graphTitle}>
            <BBText opacity style={{ fontSize: 12 }}>
              Perfil
            </BBText>
            <BBText bold title>{` ${this.props.profile}`}</BBText>
          </View>
        </View> */}

        <View style={styles.graphContainer}>
          <YAxis
            data={this.dataY}
            style={{ paddingBottom: 10 }}
            contentInset={styles.verticalContentInset}
            svg={axesSvg}
            formatLabel={value => `R$ ${NumberUtils.formatWithMultiplierSuffix(value)}`}
            numberOfTicks={6}
          />

          <View style={{ flex: 1, marginLeft: 10, justifyContent: 'flex-end' }}>
            {this.state.list.map((item, index) => (
              <LineChart
                key={index}
                style={[{ paddingBottom: 20 }, StyleSheet.absoluteFill]}
                data={item.values}
                contentInset={verticalContentInset}
                curve={shape.curveNatural}
                svg={{ strokeWidth: 2, stroke: item.color }}
                yMax={this.max}
                yMin={this.min}
                animate
                animationDuration={600}
              >
                {index === 0 && <LineY />}
                <Decorator color={item.color} />
              </LineChart>
            ))}
            <XAxis
              data={this.state.period}
              formatLabel={(value, index) => this.state.period[index].month}
              contentInset={{ left: 10, right: 10 }}
              svg={{ fontSize: 8, fill: 'grey', y: 1 }}
            />
            <XAxis
              data={this.state.period}
              formatLabel={(value, index) => this.state.period[index].year}
              contentInset={{ left: 10, right: 10 }}
              svg={{
                fontSize: 8,
                fill: 'grey',
                fontWeight: 'bold',
                y: 1,
              }}
            />
          </View>
         
        </View>
      </View>
    );
  }

  expectedTextStyle = function (color) {
    return{
      color:color
    }
  }
  getPosition(values) {
    return this.yLabelsScale(values[values.length - 1] || 0);
  }

  getProfilesList(list) {
    const defaultOffset = 9;
    let offset = defaultOffset;
    list.forEach((item, i) => {
      const position = this.getPosition(item.values);
      if (i !== 0) {
        const positionDiff = position - list[i - 1].position;
        if (positionDiff < defaultOffset) {
          offset += (defaultOffset - positionDiff) + 2;
        }
      }
      Object.assign(item, { position, offset });
    });
    list.sort((a, b) => a.position - b.position);
    return list;
  }
}

Linechart.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  period: PropTypes.objectOf(PropTypes.object).isRequired,
  // profile: PropTypes.string,
};

// Linechart.defaultProps = {
//   profile: {},
// };

const styles = StyleSheet.create({
  graphTitle: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotateZ: '270deg' }],
    flexDirection: 'row',
    height: 20,
    width: 150,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'center',
  },
  graphContainer: {
    height: 200,
    padding: 10,
    flexDirection: 'row',
    flex: 1,
  }
  
});

const axesSvg = {
  fontSize: 10,
  fill: 'grey',
};
const verticalContentInset = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};
