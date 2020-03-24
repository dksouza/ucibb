import React, { PureComponent } from 'react';
import { View } from 'native-base';
import { BBText, BBImage, BBTouchable } from 'mov-react-native-ui';
import PropTypes from 'prop-types';
import ProgressCircle from './ProgressCircle';

export default class GoalCard extends PureComponent {
  // CODEREVIEW - Verificar eslint. Os tipos object devem ser tratados de outra maneira no PropTypes. Verificar a possibilidade de usar PropTypes.shape

  static defaultProps = {
    itemWidth: 100,
    imageStyle: {},
  };

  constructor(props) {
    super(props);
    this.mountProgressCircle = this.mountProgressCircle.bind(this);
  }

  onSelectGoal(goal) {
    if (this.props.onPress) {
      this.props.onPress(goal);
    }
  }

  mountProgressCircle(goal) {
    const fontSize = goal.percentual >= 100 ? 11 : 12;
    return (
      <ProgressCircle style={Styles.progressCircleStyle} percent={goal.percentual} radius={19} borderWidth={4} color="#fae128" shadowColor="#005aa5" bgColor="#005aa5">
        <BBText small style={[Styles.progressTextStyle, { fontSize }]}>
          {goal.percentual}%
        </BBText>
      </ProgressCircle>
    );
  }

  render() {
    const { itemWidth, goal, imageStyle } = this.props;
    return (
      <View style={[Styles.cardViewStyle, { width: itemWidth }]}>
        <BBTouchable
          type="opacity"
          onPress={() => {
            this.onSelectGoal(goal);
          }}
        >
          <View>
            <View style={Styles.imageContainerStyle}>
              <BBImage style={[Styles.cardImageStyle, { ...imageStyle }]} source={goal.image} />
              {goal.percentual && this.mountProgressCircle(goal)}
            </View>
            <BBText small style={Styles.titleStyle}>
              {goal.nomePersonalizadoContrato}
            </BBText>
          </View>
        </BBTouchable>
      </View>
    );
  }
}

GoalCard.propTypes = {
  onPress: PropTypes.func.isRequired,
  itemWidth: PropTypes.number,
  imageStyle: PropTypes.shape({}),
  goal: PropTypes.shape({}).isRequired,
};

const Styles = {
  titleStyle: {
    textAlign: 'center',
  },
  cardViewStyle: {
    overflow: 'hidden',
  },
  cardImageStyle: {
    height: 54,
    width: 100,
    borderRadius: 3,
    alignSelf: 'center',
  },
  imageContainerStyle: {
    height: 59,
  },
  progressCircleStyle: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  progressTextStyle: {
    color: 'white',
    fontSize: 12,
  },
};
