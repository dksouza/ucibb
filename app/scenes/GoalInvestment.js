import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { BBText, BBIcon, BBHorizontalBar, BBBar, BBTouchable, BBColors } from 'mov-react-native-ui';
import { StringUtil, DateUtil } from 'mov-react-native';
import Accordion from 'react-native-collapsible/Accordion';
import DecimalText from '../components/DecimalText';

export default class GoalInvestment extends Component {
  static navigationOptions = {
    header: false,
  };

  constructor(props) {
    super(props);
    this.isRenderHeaderInfoActive = false;
    this.info = [{ header: '', content: '' }];
    this.callback = this.props.callback.bind(this);
  }

  renderHeaderInfo = () => {
    this.isRenderHeaderInfoActive = !this.isRenderHeaderInfoActive;
    return (
      <View style={styles.header}>
        <BBText opacity largeTitle style={styles.textHeader}>
          {' '}
          Em quais produtos você vai investir?{' '}
        </BBText>
        <BBIcon selected name={this.isRenderHeaderInfoActive ? 'interface-information' : 'close-circle'} size={20} style={{ color: '#727272' }} />
      </View>
    );
  };

  renderContentInfo() {
    const infoBoxContentText =
      'Para atingir sua meta, o BB vai criar um portfólio de investimentos personalizado, adequado à sua necessidade. ' +
      'Ele será composto por diversos produtos que, de forma conjunta, devem apresentar rentabilidade próxima ao "Total Esperado BB" na próxima tela.';
    return (
      <View style={{ backgroundColor: BBColors.CurrentTheme.brandPrimary, padding: 20 }}>
        <BBText small style={[styles.textContentInfo, { color: BBColors.CurrentTheme.brandTertiary }]}>
          {infoBoxContentText}
        </BBText>
      </View>
    );
  }

  renderHeader(content, index, isActive) {
    const rotate = isActive ? '180deg' : '0deg';
    return (
      <View style={{ marginTop: 18 }}>
        <BBHorizontalBar>
          <BBBar color={content.color} percentage={content.percenteOverTotal.toFixed(2)} />
        </BBHorizontalBar>
        <View style={styles.accordionTitle}>
          <BBTouchable onPress={() => this.touchableProps.callback(content)} style={{ flex: 0.88, alignSelf: 'flex-start' }}>
            <BBText opacity>{content.nomeAtivoFinanceiro}</BBText>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 6,
              }}
            >
              <BBText bold style={styles.textValue}>
                {`R$ ${StringUtil.formatStringToPtBrLocaleValueFormat(content.valorSugestaoAplicacaoAtivo.toString())}`}
              </BBText>
              <View style={{ flexDirection: 'row' }}>
                <BBText style={styles.textPorcent}>{content.percenteOverTotal.toFixed(2)}</BBText>
                <BBText style={[styles.textPorcent, { fontSize: 12, paddingVertical: 4 }]}>%</BBText>
              </View>
            </View>
          </BBTouchable>
          <View style={styles.iconArrowContainer}>
            <BBIcon selected name="arrow-down-small" size={24} customColor="#727272" style={{ transform: [{ rotate }] }} />
          </View>
        </View>
      </View>
    );
  }

  renderContent = content => {
    let dueDateText = DateUtil.formatDate(content.dataVencimentoOperacao, 'DD.MM.YYYY', 'DD/MM/YYYY');
    if (dueDateText.substr(6, dueDateText.length) === '9999') {
      dueDateText = 'Sem Vencimento';
    }
    return (
      <View style={styles.accordionContent}>
        <View style={{ flex: 0.5, justifyContent: 'center' }}>
          <BBText opacity tinyTitle>
            Quando posso resgatar?
          </BBText>
          <BBText bold opacity tinyTitle>
            {DateUtil.formatDate(content.dataDisponivelResgate, 'DD.MM.YYYY', 'DD/MM/YYYY')}
          </BBText>
        </View>
        <View style={{ flex: 0.5, justifyContent: 'center' }}>
          <BBText opacity tinyTitle>
            Vencimento
          </BBText>
          <BBText bold opacity tinyTitle>
            {dueDateText}
          </BBText>
        </View>
      </View>
    );
  };

  render() {
    const investments = this.props.data.dadosRespostaCriarSimulacaoPlanoInvestimentoCliente.listaNivel;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
          <Accordion sections={this.info} renderHeader={this.renderHeaderInfo} renderContent={this.renderContentInfo} underlayColor="transparent" />
          <Accordion
            sections={investments}
            renderHeader={this.renderHeader}
            renderContent={this.renderContent}
            underlayColor="transparent"
            touchableProps={{ callback: this.callback }}
          />
          <View style={styles.footer}>
            <BBText opacity> INVESTIMENTO TOTAL </BBText>
            <DecimalText tinyTitle value={this.props.data.investmentsTotal} integerFontSize={27} decimalFontSize={20} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

GoalInvestment.propTypes = {
  callback: PropTypes.func.isRequired,
  data: PropTypes.shape({
    listaNivel: PropTypes.array.isRequired,
    investmentsTotal: PropTypes.number.isRequired,
    dadosRespostaCriarSimulacaoPlanoInvestimentoCliente: PropTypes.shape({
      listaNivel: PropTypes.array.isRequired,
    }),
  }).isRequired,
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 55,
    paddingLeft: 20,
    paddingVertical: 13,
  },

  textHeader: {
    letterSpacing: -0.4,
    marginRight: 10,
  },

  accordionTitle: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 6,
  },

  accordionContent: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 6,
    marginRight: 28,
  },

  textTitle: {
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#727272',
  },

  textValue: {
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#202020',
  },
  textPorcent: {
    fontSize: 22.8,
    letterSpacing: -0.5,
    textAlign: 'right',
    color: '#95928a',
    alignSelf: 'flex-end',
  },
  textContentTitle: {
    fontSize: 12,
    color: '#727272',
  },

  textContentSubTitle: {
    fontSize: 12,
    color: '#727272',
  },

  footer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 22,
    backgroundColor: '#f2f2f2',
  },
  textFooterValue: {
    fontSize: 18,
    letterSpacing: -0.4,
    textAlign: 'right',
    color: '#727272',
  },

  textContentInfo: {
    letterSpacing: 0.1,
    textAlign: 'justify',
  },

  iconArrowContainer: {
    flex: 0.12,
    marginHorizontal: 12,
    alignItems: 'center',
  },
});
