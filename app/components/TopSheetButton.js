import React, { Component } from 'react';
import { View, PanResponder, Animated } from 'react-native';
import { BBText, BBIcon } from 'mov-react-native-ui';
import PropTypes from 'prop-types';

export default class TopSheetButton extends Component {
  static navigationOptions = {
    header: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      textButton: this.props.textButtonClosed,
      height: new Animated.Value(0),
    };
    this.contentOpen = false;
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.state.height.setValue(this.contentOpen ? this.props.heightContent : 0);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (this.contentOpen) {
          this.state.height.setValue(this.props.heightContent + gestureState.dy);
        } else {
          this.state.height.setValue(gestureState.dy);
        }
      },

      onPanResponderRelease: () => {
        this.doAction();
      },
    });
  }

  doAction() {
    const duration = 2000;
    const height = this.state.height._value;

    if (this.contentOpen && height <= this.props.heightContent) {
      this.animateView(0, duration);
      this.updateStateContent();
    } else if (!this.contentOpen && height >= 0) {
      this.animateView(this.props.heightContent, duration);
      this.updateStateContent();
    } else {
      this.animateView(this.contentOpen ? this.props.heightContent : 0, duration);
    }
  }

  updateStateContent() {
    this.contentOpen = !this.contentOpen;
    this.setState({
      textButton: this.contentOpen ? this.props.textButtonOpenned : this.props.textButtonClosed,
    });
    if (this.props.callback) {
      this.props.callback(this.contentOpen);
    }
  }

  animateView(value, duration) {
    Animated.spring(this.state.height, {
      toValue: value,
      duration,
    }).start();
  }

  hideContent() {
    if (this.contentOpen) this.doAction();
  }

  render() {
    const rotate = this.contentOpen ? '180deg' : '0deg';
    return (
      <View>
        <Animated.View style={{ height: this.state.height }}>{this.props.children}</Animated.View>
        {this.contentOpen && <View style={styles.divider} />}
        <Animated.View {...this.panResponder.panHandlers}>
          <View style={styles.buttonBackground}>
            <BBText bold style={styles.textButton}>
              {this.state.textButton}
            </BBText>
            <BBIcon selected name="arrow-down-small" size={20} style={{ color: '#005aa5', transform: [{ rotate }] }} />
          </View>
        </Animated.View>
      </View>
    );
  }
}

TopSheetButton.propTypes = {
  /**
   * @prop {string} textButtonClosed - Texto a ser apresentado no botão quando o painel estiver oculto.
   */
  textButtonClosed: PropTypes.string,
  /**
   * @prop {string} textButtonOpenned - Texto a ser apresentado no botão quando o painel estiver visível.
   */
  textButtonOpenned: PropTypes.string,
  /**
   * @prop {number} heightContent - Define a altura do painel.
   */
  heightContent: PropTypes.number.isRequired,
  /**
   * @prop {node} children - Nós filhos para composição dentro do painel.
   */
  children: PropTypes.node,
  /**
   * @prop {func} callback - Função de callback de quando o componente sobre atualização.
   */
  callback: PropTypes.func,
};

TopSheetButton.defaultProps = {
  textButtonClosed: 'Abrir',
  textButtonOpenned: 'Fechar',
  children: null,
  callback: null,
};

const styles = {
  buttonBackground: {
    flexDirection: 'row',
    width: 150,
    height: 24,
    alignSelf: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fae128',
    zIndex: 0,
  },

  textButton: {
    fontSize: 10,
    letterSpacing: 0.2,
    textAlign: 'center',
    color: '#005aa5',
  },

  divider: {
    flexDirection: 'row',
    height: 3,
    backgroundColor: '#fae128',
  },
};
