import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { BBIcon } from 'mov-react-native-ui';

export default class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.width = this.props.width;
    this.state = {
      checked: this.props.checked,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ checked: nextProps.checked });
  }

  changeState() {
    const checked = !this.state.checked;
    this.setState({ checked });
    this.props.onPress(checked);
  }

  render() {
    const diameter = 20;
    const radius = diameter / 2;
    const bgcolor = '#00375a';
    const dinamicStyle = {
      circle: { width: diameter, height: diameter, borderRadius: radius },
      checked: { backgroundColor: bgcolor },
      unchecked: { borderWidth: 1, borderColor: bgcolor },
    };
    return (
      <View {...this.props}>
        <TouchableOpacity activeOpacity={1} onPress={() => this.changeState()}>
          {this.state.checked ? (
            <View style={[dinamicStyle.circle, dinamicStyle.checked, styles.center]}>
              <BBIcon name="check" size={15} style={{ color: 'white' }} />
            </View>
          ) : (
            <View style={[dinamicStyle.circle, dinamicStyle.unchecked]} />
            )}
        </TouchableOpacity>
      </View>
    );
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onPress: PropTypes.func,
  width: PropTypes.number,
};

Checkbox.defaultProps = {
  checked: false,
  onPress: {},
  width: 20,
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
