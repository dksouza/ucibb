import React, { Component } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { BBText } from 'mov-react-native-ui';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../style/sliderentry.style';
import ProgressCircle from './ProgressCircle';

const { width, height } = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * width) / 100;
  return Math.round(value);
}

const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = width;
export const itemWidth = (itemHorizontalMargin * 2) + slideWidth;

export default class SliderEntry extends Component {
  renderCard() {
    const {
      data, subtitle, parallaxProps, percentage,
    } = this.props;
    const slideLabelContainerStyle = {
      height: width / 3,
      aspectRatio: 1.75,
      top: width * 0.18,
      borderColor: BBColors.CurrentTheme.Default_Highlight,
    };

    return (
      <View style={{ flex: 1 }}>
        <View style={{ alignItems: 'center', marginRight: 27 }}>
          <View style={[styles.slideLabelContainer, slideLabelContainerStyle]}>
            <BBText mediumTitle numberOfLines={1} style={{ bottom: 10 }} adjustsFontSizeToFit minimumFontScale={0.9}>
              {subtitle}
            </BBText>
          </View>
        </View>
        <View style={BBStyles.componentContainer}>
          <View
            style={{
              height: width / 2.5,
              aspectRatio: 1.5,
            }}
          >
            <ParallaxImage source={data} containerStyle={[styles.imageContainer, styles.imageContainerEven]} style={[styles.image]} parallaxFactor={0.35} {...parallaxProps} />
          </View>
          {Boolean(percentage) && (
            <ProgressCircle
              style={[BBStyles.progressCircleStyle]}
              percent={percentage}
              radius={30}
              borderWidth={6}
              color={BBColors.CurrentTheme.brandPrimary}
              shadowColor="rgba(36, 86, 162, 1)"
              bgColor="rgba(36, 86, 162, 1)"
            >
              <BBText secondary>
                {percentage.toFixed()}
                <BBText tinyTitle secondary>
                  %
                </BBText>
              </BBText>
            </ProgressCircle>
          )}
        </View>
      </View>
    );
  }

  render() {
    const { even } = this.props;
    return (
      <View style={([styles.slideInnerContainer], { height: height / 3 })}>
        <View style={styles.shadow} />
        <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>{this.renderCard()}</View>
      </View>
    );
  }
}

SliderEntry.propTypes = {
  data: PropTypes.number.isRequired,
  even: PropTypes.bool,
  parallax: PropTypes.bool,
  parallaxProps: PropTypes.objectOf(PropTypes.object).isRequired,
  subtitle: PropTypes.string,
  percentage: PropTypes.number,
};

SliderEntry.defaultProps = {
  even: true,
  parallax: true,
  subtitle: '',
  percentage: undefined,
};

const BBStyles = StyleSheet.create({
  progressCircleStyle: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  progressTextStyle: {
    color: 'white',
    fontSize: 22,
  },
  progressPercentageStyle: {
    color: 'white',
    fontSize: 13,
  },
  componentContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    position: 'relative',
  },
});
