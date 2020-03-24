import React, { Component } from 'react';
import { View, ScrollView, NativeModules, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { BBText, BBIcon, BBTouchable, BBButton, BBColors } from 'mov-react-native-ui';

// TELA NÃO UTILIZADA POR AGORA. POSSIVELMENTE SERÁ USADA EM VERSÕES POSTERIORES.
export default class GoalInvestmentDetail extends Component {
  static navigationOptions = {
    header: false,
  };

  constructor(props) {
    super(props);

    this.investment = this.props.data;
  }

  openDocument(url) {
    const action = `aparelho:abrirMenuComprovante?urlPdf=${url}`;
    NativeModules.BBRNRenderer.execute(action, null);
  }

  render() {
    const descricao =
      'A Letra de Crédito Imobiliário (LCI), é um título de renda fixa, ou seja, tem a remuneração calculada por índice de inflação e taxa de juros prefixados. O rendimento é atrelado ao CDI e tem vantagens como a isenção de impostos.';

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <ScrollView style={styles.container}>
          <View style={styles.containerTitle}>
            <BBIcon selected name="Money-penny" size={56} style={{ color: BBColors.CurrentTheme.btnSecondaryColor }} />
            <BBText style={[styles.textTitle, { marginTop: 16, textAlign: 'justify' }]}>{this.investment.nomeAtivoFinanceiroReduzido}</BBText>
            <BBText style={[styles.textSmall, { marginTop: 20 }]}>{descricao}</BBText>
          </View>

          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 0.5 }}>
              <BBText style={styles.textSmall}>Taxa Contratada</BBText>
              <BBText style={[styles.textDetail, { color: BBColors.CurrentTheme.btnSecondaryColor }]}>1,43% a.m.</BBText>
              <BBText style={[styles.textSmall, { fontSize: 10 }]}>96,00% da CDI</BBText>
              <BBText style={[styles.textSmall, { marginTop: 10 }]}>Quando posso resgatar?</BBText>
              <BBText style={styles.textDetail}>90 dias</BBText>
              <View style={styles.containerLink}>
                <BBTouchable style={styles.containerLink} onPress={() => this.openDocument()}>
                  <BBIcon selected name="file-check" size={25} style={{ color: '#727272' }} />
                  <BBText style={[styles.textSmall, { marginLeft: 6 }]}>Documentos</BBText>
                </BBTouchable>
              </View>
            </View>
            <View style={{ flex: 0.5, alignSelf: 'flex-end' }}>
              <BBText style={styles.textSmall}>Investimento mínimo</BBText>
              <BBText style={styles.textDetail}>R$ 150,00</BBText>
              <BBText style={[styles.textSmall, { marginTop: 30 }]}>Risco</BBText>
              <BBText style={[styles.textDetail, { color: '#329632' }]}>Baixo</BBText>
              <View style={styles.containerLink}>
                <BBTouchable style={styles.containerLink} onPress={() => this.openDocument()}>
                  <BBIcon selected name="file-document" size={25} style={{ color: '#727272' }} />
                  <BBText style={[styles.textSmall, { marginLeft: 6 }]}>Termos do Produto</BBText>
                </BBTouchable>
              </View>
            </View>
          </View>
        </ScrollView>

        <BBButton full title="OK, ENTENDI!" onPress={() => this.props.callback()} />
      </View>
    );
  }
}

GoalInvestmentDetail.propTypes = {
  callback: PropTypes.func.isRequired,
  data: PropTypes.shape({}).isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 25,
  },

  containerTitle: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 15,
  },

  containerDetail: {
    fontSize: 16,
    letterSpacing: -0.4,
    color: '#727272',
    marginRight: 10,
  },

  containerLink: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  textTitle: {
    fontSize: 22,
    letterSpacing: -0.5,
    color: '#727272',
  },

  textSmall: {
    fontSize: 12,
    letterSpacing: -0.3,
    lineHeight: 18,
    color: '#727272',
  },

  textDetail: {
    fontSize: 14,
    color: '#727272',
  },
});
