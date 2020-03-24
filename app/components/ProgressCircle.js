import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ViewPropTypes } from 'react-native';

// compatability for react-native versions < 0.44
const ViewPropTypesStyle = ViewPropTypes ? ViewPropTypes.style : View.propTypes.style;

const styles = StyleSheet.create({
  outerCircle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  halfCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
});

function percentToDegrees(percent) {
  return percent * 3.6;
}

export default class ProgressCircle extends Component {
  static propTypes = {
    color: PropTypes.string,
    shadowColor: PropTypes.string,
    bgColor: PropTypes.string,
    radius: PropTypes.number.isRequired,
    borderWidth: PropTypes.number,
    percent: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
    children: PropTypes.node,
    containerStyle: ViewPropTypesStyle,
  };

  static defaultProps = {
    color: '#f00',
    shadowColor: '#999',
    bgColor: '#e9e9ef',
    borderWidth: 2,
    children: null,
    containerStyle: null,
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getInitialStateFromProps(nextProps));
  }

  getInitialStateFromProps(props) {
    const percent = Math.max(Math.min(100, props.percent), 0);
    const needHalfCircle2 = percent > 50;
    let halfCircle1Degree;
    let halfCircle2Degree;
    if (needHalfCircle2) {
      halfCircle1Degree = 180;
      halfCircle2Degree = percentToDegrees(percent);
    } else {
      halfCircle1Degree = percentToDegrees(percent);
      halfCircle2Degree = 0;
    }

    return {
      halfCircle1Degree,
      halfCircle2Degree,
      halfCircle2Styles: {
        backgroundColor: needHalfCircle2 ? this.props.color : this.props.shadowColor,
      },
    };
  }

  renderHalfCircle(rotateDegrees, halfCircleStyles) {
    const { radius, color } = this.props;
    return (
      <View
        style={[
          styles.leftWrap,
          {
            overflow: 'hidden',
            width: radius,
            height: radius * 2,
            transform: [{ translateX: radius / 2 }, { rotate: `${rotateDegrees}deg` }, { translateX: -radius / 2 }],
          },
        ]}
      >
        <View
          style={[
            styles.halfCircle,
            {
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius,

              backgroundColor: color,
              ...halfCircleStyles,
            },
          ]}
        />
      </View>
    );
  }

  renderInnerCircle() {
    const radiusMinusBorder = this.props.radius - this.props.borderWidth;
    return (
      <View
        style={[
          styles.innerCircle,
          {
            width: radiusMinusBorder * 2,
            height: radiusMinusBorder * 2,
            borderRadius: radiusMinusBorder,
            backgroundColor: this.props.bgColor,
            ...this.props.containerStyle,
          },
        ]}
      >
        {this.props.children}
      </View>
    );
  }

  render() {
    const { halfCircle1Degree, halfCircle2Degree, halfCircle2Styles } = this.state;
    return (
      <View
        style={[
          styles.outerCircle,
          {
            width: this.props.radius * 2,
            height: this.props.radius * 2,
            borderRadius: this.props.radius,
            backgroundColor: this.props.shadowColor,
            elevation: 4,
            shadowOffset: { width: 0, height: 0 },
            shadowColor: 'black',
            shadowOpacity: 0.5,
            shadowRadius: 3,
          },
        ]}
      >
        {this.renderHalfCircle(halfCircle1Degree)}
        {this.renderHalfCircle(halfCircle2Degree, halfCircle2Styles)}
        {this.renderInnerCircle()}
      </View>
    );
  }
}