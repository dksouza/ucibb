import { NativeModules, ActivityIndicator, Dimensions } from 'react-native';
import React, { Component } from 'react';
import { View } from 'native-base';
import { BBText, BBTouchable, BBIcon, BBColors } from 'mov-react-native-ui';

const { width } = Dimensions.get('window');

export default class BaseWidget extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null, loading: undefined };
    this.iconSize = {
      cardwidget: width - 45,
      eventswidget: width - 15,
      goalswidget: width * 0.65,
      default: width,
    };

    this.loadingSizes = {
      cardwidget: {
        paddingVertical: 10,
      },
      goalswidget: {
        paddingVertical: 10,
        paddingHorizontal: 10,
      },
      default: {
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
    };
  }

  showLoading() {
    this.setState({ loading: true });
  }

  openScreen(acao) {
    NativeModules.BBRNRenderer.execute(acao.replace('aparelho:menu?acao=', ''), null);
  }

  navigateToScreen(screen, parameters) {
    const { navigate } = this.props.navigation;
    navigate(screen, parameters);
  }

  defineSize(widgetName) {
    return this.iconSize[widgetName] || this.iconSize.default;
  }

  getLoadingSizes(widgetName) {
    return this.loadingSizes[widgetName] || this.loadingSizes.default;
  }

  loading(height, widgetName) {
    if (!this.state.loading) {
      return null;
    }

    const loadingHeight = height !== undefined ? height : 150;
    const loadingSizes = this.getLoadingSizes(widgetName);
    const iconSize = this.defineSize(widgetName) - (loadingSizes.paddingHorizontal ? loadingSizes.paddingHorizontal * 2 : 0);
    return (
      <View widgetCell style={{ flex: 1, justifyContent: 'center', alignItems: 'center', ...loadingSizes }}>
        <View
          widgetCell
          style={{
            overflow: 'hidden',
            width,
            height: this.state.loading ? loadingHeight : 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          importantForAccessibility="no-hide-descendants"
        >
          {this.state.loading && widgetName !== undefined ? (
            <BBIcon name={widgetName} terciary size={iconSize} style={{ position: 'absolute', alignSelf: 'center' }} customColor={BBColors.CurrentTheme.image_widgets_color} />
          ) : (
            <ActivityIndicator animating={this.state.loading} />
          )}
        </View>
      </View>
    );
  }

  renderRetry(message) {
    const messageError = message !== undefined ? message : 'Dados não carregados.';
    return (
      <View
        widgetCell
        style={{
          flex: 1,
          flexDirection: 'row',
          height: 56,
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 20,
        }}
      >
        <View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
          <BBText bold style={{ fontSize: 14, color: 'black' }}>
            {messageError}
          </BBText>
        </View>
        <BBTouchable type="opacity" onPress={this.loadWidgetData}>
          <View
            style={{
              flexDirection: 'row',
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'flex-end',
              backgroundColor: '#fae128',
              borderRadius: 16,
              paddingHorizontal: 12,
              paddingVertical: 5,
            }}
            accessibilityLabel="Tentar de novo"
          >
            <BBText
              bold
              dark
              style={{
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'flex-end',
                fontSize: 12,
              }}
            >
              Tentar de novo
            </BBText>
            <BBIcon
              name="synchronize-3"
              size={16}
              customColor="#00375a"
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingStart: 9,
                paddingHorizontal: 3,
              }}
            />
          </View>
        </BBTouchable>
      </View>
    );
  }
}
