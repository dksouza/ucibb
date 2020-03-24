import React, { Component } from 'react';
import { View } from 'react-native';
import { BBText, BBIcon } from 'mov-react-native-ui';
import StringUtil from 'mov-react-native/components/stringutil';
import PropTypes from 'prop-types';
import Accordion from 'react-native-collapsible/Accordion';
import DecimalText from '../components/DecimalText';

export default class GoalPrediction extends Component {
  static navigationOptions = {
    header: false,
  };

  buildSections() {
    const values = this.props.simulation.dadosRespostaListarProjecaoRentabilidadeEvolucaoPatrimonialPeriodo.listaNivel[this.props.goal.numeroPrazoPermanenciaPlano];
    this.sections = [
      {
        title: 'Previsão',
        detail: '[Investimento+ganhos]',
        itemFormat: this.renderHeaderInfo.bind(this),
        contentItemFormat: this.renderContentInfo.bind(this),
        items: [
          { name: 'Total Previsto', value: values.valorTotalAcumuladoBase },
          { name: 'Meu Objetivo desejado', value: StringUtil.formatStringCurrencyToDecimalNumber(this.props.goal.valorObjetivoRentabilidadeContrato) },
          { name: 'Máximo previsto', value: values.valorTotalAcumuladoAcima },
          { name: 'Mínimo previsto', value: values.valorTotalAcumuladoAbaixo },
        ],
      },
    ];
  }

  renderHeader(content, _index, isActive) {
    return (
      <View>
        <View style={[styles.containerHeader, { marginBottom: 10 }]}>
          <View style={styles.containerTitle}>
            <BBText style={styles.textTitle}>{content.title} </BBText>
            <BBText style={styles.textSubtitle}>{content.detail}</BBText>
          </View>
          <BBIcon name="arrow-down-small" size={24} style={isActive ? { transform: [{ rotate: '180deg' }] } : ''} terciary />
        </View>
        {!isActive && content.itemFormat(content.items[0], 0, false, 'noIcon')}
      </View>
    );
  }

  /* eslint-disable react/jsx-no-bind */
  renderContent(content, _index, isActive) {
    return (
      <View>
        <Accordion
          sections={content.items}
          renderHeader={content.itemFormat.bind(this)}
          renderContent={content.contentItemFormat.bind(this)}
          onChange={isActive ? () => this.touchableProps.callback() : null}
          underlayColor="transparent"
        />
      </View>
    );
  }

  renderHeaderInfo(content, index) {
    const styleItem = {};

    if (index === 0) {
      styleItem.title = styles.textItem;
      styleItem.value = { color: '#31b28a', opacity: 1.0 };
      styleItem.valueInt = 24;
      styleItem.valueDec = 14;
    } else if (index === 1) {
      styleItem.title = styles.textItem;
      styleItem.value = { color: '#696969', opacity: 1.0 };
      styleItem.valueInt = 24;
      styleItem.valueDec = 14;
    } else if (index === 2) {
      styleItem.title = styles.textSubtitle;
      styleItem.value = { color: '#2467a8', opacity: 1.0 };
      styleItem.valueInt = 18;
      styleItem.valueDec = 14;
    } else if (index === 3) {
      styleItem.title = styles.textSubtitle;
      styleItem.value = { color: '#f5a623', opacity: 1.0 };
      styleItem.valueInt = 18;
      styleItem.valueDec = 14;
    } else {
      styleItem.title = styles.textSubtitle;
      styleItem.value = { color: '#696969', opacity: 1.0 };
      styleItem.valueInt = 18;
      styleItem.valueDec = 14;
    }

    return (
      <View style={styles.containerHeader}>
        <BBText style={styleItem.title}>{content.name}</BBText>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <DecimalText tinyTitle style={styleItem.value} value={content.value} integerFontSize={styleItem.valueInt} decimalFontSize={styleItem.valueDec} />
          {/* TODO: Talvez volte esse layout, não retirar */}
          {/* {sections !== 'noIcon' && <BBIcon style={{ marginLeft: 10 }} name={isActive ? 'close-circle' : 'interface-information'} size={20} terciary />} */}
        </View>
      </View>
    );
  }

  renderContentInfo() {
    /* TODO: Talvez volte esse layout, não retirar */
    // const infoBoxContentText =
    //   'Existe uma possibilidade menor que esse valor seja atingido. Essa previsão é o resultado de simulações com um índice de segurança de 95% representando análise de cenário e expectativas ao índice livre de risco (CDI). ';
    // return (
    //   <View style={{ backgroundColor: '#fae128', padding: 20 }}>
    //     <BBText style={styles.textContentInfo}>{infoBoxContentText}</BBText>
    //   </View>
    // );
    return <View />;
  }

  render() {
    this.buildSections();
    return (
      <View style={{ flex: 1 }}>
        <Accordion
          initiallyActiveSection={0}
          sections={this.sections}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
          underlayColor="transparent"
          touchableProps={{ callback: this.props.callback.bind(this) }}
          onChange={() => this.props.callback()}
        />
        <BBText style={[styles.footerText]}>
          A probabilidade de se obter o retorno esperado é maior do que a de se obter o máximo ou mínimo previstos. Essas previsões representam o resultado de simulações com base
          em análises de cenário e expectativas em relação à taxa livre de risco (CDI), com um intervalo de confiança de 95%.
        </BBText>
      </View>
    );
  }
}

GoalPrediction.propTypes = {
  /**
   * @prop {func} callback - Função de callback de quando o componente sobre atualização.
   */
  callback: PropTypes.func.isRequired,
  goal: PropTypes.shape({
    numeroPrazoPermanenciaPlano: PropTypes.number.isRequired,
    valorObjetivoRentabilidadeContrato: PropTypes.number.isRequired,
  }).isRequired,
  simulation: PropTypes.shape({
    dadosRespostaListarProjecaoRentabilidadeEvolucaoPatrimonialPeriodo: PropTypes.shape({
      listaNivel: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = {
  containerHeader: {
    marginLeft: 25,
    marginRight: 17,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  containerTitle: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center',
  },

  textTitle: {
    fontSize: 20,
    letterSpacing: -0.3,
    color: '#727272',
  },

  textSubtitle: {
    fontSize: 12,
    letterSpacing: -0.3,
    color: '#727272',
  },

  textItem: {
    fontSize: 14,
    letterSpacing: -0.3,
    color: '#727272',
  },

  textValue: {
    fontSize: 24,
    letterSpacing: -0.8,
    color: '#696969',
  },

  textValueSmall: {
    fontSize: 16,
    letterSpacing: -0.6,
    color: '#696969',
  },

  footerText: {
    fontSize: 12,
    color: '#727272',
    marginLeft: 25,
    marginRight: 17,
    marginTop: 10,
    letterSpacing: 0.3,
    lineHeight: 18,
  },
};
