import React, { PureComponent } from 'react';
import { View, StyleSheet, Dimensions, NativeModules } from 'react-native';
import PropTypes from 'prop-types';
import { BBModal, BBButton, BBIcon, BBText, BBColors } from 'mov-react-native-ui';

const { width } = Dimensions.get('window');
const modalWidth = width * 0.8;
export default class Modal extends PureComponent {
  static showModal(modalProps) {
    const textSize = 15;
    NativeModules.BBRNLayoutUtils.calculateHeightForText(modalProps.describe, textSize, modalWidth - 40, textHeight => {
      const textWithLineBreaks = modalProps.describe.match(/\n/g);
      const textRealHeight = (textHeight + textSize) * (textWithLineBreaks ? textWithLineBreaks.length : 1);
      const modalHeight = Modal.calculateModalHeight(textRealHeight, modalProps.sizeIcon || Modal.defaultProps.sizeIcon);
      const modalTemplate = <Modal {...modalProps} />;
      BBModal.showModal(modalTemplate, { height: modalHeight, width: modalWidth });
    });
  }

  static calculateModalHeight(textHeight, iconSize) {
    const icon = iconSize + 60; // 60 margem
    const title = 10 + 24; // 24 tamanho da fonte, 10 margem
    const description = textHeight + 30; // 30 margem do texto
    const buttom = 48;
    return icon + title + description + buttom;
  }

  constructor(props) {
    super(props);
    const { callback } = this.props;
    this.callback = callback;
  }

  /**
   * @method closeModal - Fechar modal
   * @description Função que fecha a modal
   */
  closeModal() {
    BBModal.closeModal();
  }

  isEmpty(titleRight) {
    if (!titleRight) {
      return '100%';
    }
    return '49.9%';
  }

  renderButton(titleLeft, titleRight) {
    const largura = this.isEmpty(titleRight);

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <BBButton full style={{ width: largura }} onPress={() => this.closeModal()} title={titleLeft.toUpperCase()} />
        {titleRight != null && <BBButton full style={{ width: largura }} onPress={params => this.callback(params)} title={titleRight.toUpperCase()} />}
      </View>
    );
  }
  render() {
    const {
      iconName, sizeIcon, actionName, alignActionName, describe, titleLeft, titleRight,
    } = this.props;
    return (
      <View style={styles.container}>
        <BBIcon style={styles.icon} name={iconName} size={sizeIcon} customColor={BBColors.CurrentTheme.brandTertiary} />
        <BBText alertTitle style={{ color: BBColors.CurrentTheme.brandTertiary, paddingHorizontal: 10, alignSelf: alignActionName }}>
          {actionName}
        </BBText>
        <View style={styles.descriptionAlertDualButton}>
          <BBText
            style={{
              marginTop: 10,
              lineHeight: 25,
              fontSize: 15,
              color: BBColors.CurrentTheme.brandTertiary,
              fontWeight: '300',
              letterSpacing: 0.1,
            }}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {describe}
          </BBText>
        </View>
        <View>{this.renderButton(titleLeft, titleRight)}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  icon: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: 30,
  },
  descriptionAlertDualButton: {
    paddingHorizontal: 10,
  },
});

Modal.propTypes = {
  actionName: PropTypes.string.isRequired,
  alignActionName: PropTypes.string,
  iconName: PropTypes.string.isRequired,
  positionIcon: PropTypes.number,
  sizeIcon: PropTypes.number,
  describe: PropTypes.string.isRequired,
  titleLeft: PropTypes.string,
  titleRight: PropTypes.string,
  callback: PropTypes.func,
};

Modal.defaultProps = {
  callback: {},
  titleLeft: 'OK',
  titleRight: null,
  alignActionName: 'center',
  positionIcon: 20,
  sizeIcon: 90,
};
