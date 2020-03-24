import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Dimensions } from 'react-native';
import { BBText, BBNavigationHeader, BBButton, BBColors, BBAutoText, BBStatusBar, BBContainer } from 'mov-react-native-ui';

const { width } = Dimensions.get('window');

const FONT_SIZE_TEST_STRING = Array(49).join('='); // 48 + 1 para descontar o padding
const PADDING = 10;
const MARGIN = 20;

export default class Receipt extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      state: PropTypes.object,
    }).isRequired,
  };

  static navigationOptions = {
    header: false,
  };

  constructor(props) {
    super(props);

    this.callback = this.props.navigation.state.params.callback;
    this.buttonLabel = this.props.navigation.state.params.buttonLabel;

    this.state = {
      text: this.props.navigation.state.params.text,
      title: this.props.navigation.state.params.title,
      fontSize: 14,
      fontColor: 'transparent',
      receiptBackgroundColor: 'transparent',
    };
  }

  call = () => {
    if (this.callback) {
      this.callback();
    }
  };

  fontResizeFinished(fontSize) {
    this.setState({
      fontSize,
      fontColor: BBColors.CurrentTheme.receiptFontColor,
      receiptBackgroundColor: BBColors.CurrentTheme.receiptBackgroundColor,
    });
  }

  discoverCorrectFontSize() {
    let parentWidth = width;
    parentWidth -= PADDING * 2;
    parentWidth -= MARGIN * 2;

    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <BBAutoText invisible={false} style={{ fontFamily: this.FONT_FAMILY }} parentWidth={parentWidth} onResizeFinished={fontSize => this.fontResizeFinished(fontSize)}>
          {FONT_SIZE_TEST_STRING}
        </BBAutoText>
      </View>
    );
  }

  render() {
    this.FONT_FAMILY = BBColors.CurrentTheme.receiptFontFamily; // Courier New

    return (
      <BBContainer safebarTemplate={BBContainer.SAFE_AREA_TEMPLATE.SAFE_AREA_TEMPLATE_DEFAULT_BUTTON_SCREENN}>
        <BBStatusBar />
        <BBNavigationHeader title={this.state.title} centerTitle navigation={this.props.navigation} />

        {this.discoverCorrectFontSize()}

        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              padding: PADDING,
              margin: MARGIN,
              backgroundColor: this.state.receiptBackgroundColor,
              alignItems: 'center',
            }}
          >
            <BBText
              style={{
                fontSize: this.state.fontSize,
                fontFamily: this.FONT_FAMILY,
                color: this.state.fontColor,
                textAlign: 'justify',
              }}
            >
              {this.state.text}
            </BBText>
          </View>
        </ScrollView>
        <BBButton primary full onPress={this.call} title={this.buttonLabel} />
      </BBContainer>
    );
  }
}
