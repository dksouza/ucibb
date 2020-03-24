import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { BBText, BBIcon, BBButton, BBColors, BBContainer, BBNavigationHeader, BBBalance, BBAlert, BBTouchable } from 'mov-react-native-ui';
import StringUtil from 'mov-react-native/components/stringutil';
import GoalServices from '../services/GoalServices';
import DecimalText from '../components/DecimalText';

export default class GoalSetting extends Component {
  static navigationOptions = {
    header: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      goalSuggestion: {},
    };
    this.goal = this.props.navigation.state.params.goal;
    this.initialApplication = this.goal.valorAplicacaoInicioInvestimento;
    this.monthlyApplication = this.goal.valorAdicionalInvestimento;
  }

  componentWillMount() {
    this.getGoalSuggestion();
  }

  getGoalSuggestion() {
    const formatValueToSend = value => StringUtil.formatStringCurrencyToDecimalNumber(value) * 100;
    const formatValueToSend2 = value => StringUtil.formatStringCurrencyToDecimalNumber(value);

    const values = this.props.navigation.state.params.simulation.dadosRespostaListarProjecaoRentabilidadeEvolucaoPatrimonialPeriodo.listaNivel[
      this.props.navigation.state.params.goal.numeroPrazoPermanenciaPlano
    ];

    const goalParams = {
      indicadorCenarioSugestao: 1,
      valorAplicacaoInicioSugestao: formatValueToSend(this.props.navigation.state.params.goal.valorAplicacaoInicioInvestimento),
      valorAplicacaoMensalSugestao: formatValueToSend(this.props.navigation.state.params.goal.valorAdicionalInvestimento),
      valorMetaSugestao: formatValueToSend(this.props.navigation.state.params.goal.valorObjetivoRentabilidadeContrato),
      quantidadeMesSugestao: this.props.navigation.state.params.goal.numeroPrazoPermanenciaPlano,
      valorTotalAcumuladoSugestao: formatValueToSend2(`${values.valorTotalAcumuladoBase}`),
      percentualJuroAcumuladoSugestao: parseFloat(values.percentualJuroAcumuladoBase).toFixed(2),
    };
    GoalServices.goalSuggestion(
      goalParams,
      onSuccessData => {
        this.setState({ goalSuggestion: onSuccessData.SugestaoMeta });
      },
      onErrorData => {
        this.props.navigation.goBack();
        BBAlert.alert(onErrorData.message);
      },
    );
  }

  sendSelectedGoalSuggestin() {
    const formatValue = value => StringUtil.formatStringToPtBrLocaleValueFormat(value);

    this.props.navigation.state.params.goal.valorAplicacaoInicioInvestimento = formatValue(this.state.goalSuggestion.valorAplicacaoInicioAjustado);
    this.props.navigation.state.params.goal.valorAdicionalInvestimento = this.monthlyApplication;
    // this.props.navigation.navigate('GoalTransitionScene', { goal: this.props.navigation.state.params.goal });

    this.props.navigation.navigate('GoalTransitionScene', {
      goal: this.props.navigation.state.params.goal,
      isFromGoalEdit: true,
      onSimulationSuccess: this.props.navigation.state.params.onSimulationSuccess,
    });
  }

  sendSelectedSuggestinMonthlyApplication() {
    const formatValue = value => StringUtil.formatStringToPtBrLocaleValueFormat(value);

    this.props.navigation.state.params.goal.valorAdicionalInvestimento = formatValue(this.state.goalSuggestion.valorAplicacaoMensalAjustado);
    this.props.navigation.state.params.goal.valorAplicacaoInicioInvestimento = this.initialApplication;
    // this.props.navigation.navigate('GoalTransitionScene', { goal: this.props.navigation.state.params.goal });

    this.props.navigation.navigate('GoalTransitionScene', {
      goal: this.props.navigation.state.params.goal,
      isFromGoalEdit: true,
      onSimulationSuccess: this.props.navigation.state.params.onSimulationSuccess,
    });
  }


  render() {
    return (
      <BBContainer style={{ backgroundColor: BBColors.CurrentTheme.Default_Background }} safebarTemplate={BBContainer.SAFE_AREA_TEMPLATE.SAFE_AREA_TEMPLATE_DEFAULT_BUTTON_SCREEN}>
        <BBNavigationHeader
          title={this.goal.nomeObjetivoPlanoInvestimento}
          centerTitle
          leftButtons={this.backButton}
          navigation={this.props.navigation}
          style={{ alignItems: 'center' }}
        />
        <ScrollView>
          <View style={{ alignItems: 'center', backgroundColor: 'white' }}>
            <BBBalance bigTitle bold showDollar style={{ marginTop: 20 }}>
              {this.goal.valorObjetivoRentabilidadeContrato}
            </BBBalance>
            <BBText style={[styles.grayText, { marginBottom: 20 }]}>Meta - {this.goal.nomePersonalizadoContrato}</BBText>
          </View>

          <View style={styles.originalGoal}>
            <View style={{ marginLeft: 10, marginTop: 15 }}>
              <BBText mediumTitle style={styles.grayText}>
                Aporte inicial
              </BBText>
              <BBText mediumTitle style={styles.grayText}>
                Aplicação mensal
              </BBText>
              <BBText mediumTitle style={styles.grayText}>
                Prazo
              </BBText>
              <BBText mediumTitle style={{ marginBottom: 15 }}>
                Valor total projetado
              </BBText>
            </View>

            <View style={{ marginRight: 10, marginTop: 15 }}>
              <BBText mediumTitle bold>
                {this.goal.valorAplicacaoInicioInvestimento}
              </BBText>
              <BBText mediumTitle bold>
                {this.goal.valorAdicionalInvestimento}
              </BBText>
              <BBText mediumTitle bold>
                {this.goal.numeroPrazoPermanenciaPlano} meses
              </BBText>
              <BBBalance mediumTitle bold>
                {
                  `R$ ${StringUtil.formatStringToPtBrLocaleValueFormat(this.props.navigation.state.params.simulation.dadosRespostaListarProjecaoRentabilidadeEvolucaoPatrimonialPeriodo
                    .listaNivel[this.goal.numeroPrazoPermanenciaPlano].valorTotalAcumuladoBase)}`
                  }
              </BBBalance>
            </View>
          </View>

          <View style={{ backgroundColor: BBColors.CurrentTheme.Default_Background }}>
            <BBText bold style={{ color: 'gray', margin: 20 }}>
              SUGESTÕES DE AJUSTE
            </BBText>
          </View>

          <BBTouchable onPress={() => this.sendSelectedGoalSuggestin()}>
            <View style={styles.settingGoal}>
              <View style={{ marginLeft: 10, marginTop: 15, marginBottom: 15 }}>
                <BBText style={{ fontSize: 16 }}>Ajuste aporte inical para</BBText>
                <BBText style={styles.grayText}>Valor total projetado</BBText>
              </View>

              <View style={{ marginRight: 10, marginTop: 15, marginBottom: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <BBText bold style={styles.grayText}>
                    R$
                  </BBText>
                  <DecimalText smallTitle bold value={this.state.goalSuggestion.valorAplicacaoInicioAjustado} integerFontSize={18} decimalFontSize={18} />
                </View>

                <BBText bold style={styles.grayText}>
                  R$ {StringUtil.formatStringToPtBrLocaleValueFormat(this.state.goalSuggestion.valorTotalAcumuladoAjustado)}
                </BBText>
              </View>
              <BBIcon selected name="chevron" size={30} style={{ color: BBColors.CurrentTheme.Default_Background }} />
            </View>
          </BBTouchable>

          <View style={{ height: 5, backgroundColor: BBColors.CurrentTheme.Default_Background }} />

          <BBTouchable onPress={() => this.sendSelectedSuggestinMonthlyApplication()}>
            <View style={styles.settingGoal}>
              <View style={{ marginLeft: 10, marginTop: 15, marginBottom: 15 }}>
                <BBText style={{ fontSize: 16 }}>Ajuste aplicação mensal para</BBText>
                <BBText style={styles.grayText}>Valor total projetado</BBText>
              </View>

              <View style={{ marginRight: 10, marginTop: 15, marginBottom: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <BBText bold style={styles.grayText}>
                    R$
                  </BBText>
                  <DecimalText smallTitle bold value={this.state.goalSuggestion.valorAplicacaoMensalAjustado} integerFontSize={18} decimalFontSize={18} />
                </View>

                <BBText bold style={styles.grayText}>
                  R$ {StringUtil.formatStringToPtBrLocaleValueFormat(this.state.goalSuggestion.valorTotalAcumuladoAjustado)}
                </BBText>
              </View>

              <BBIcon selected name="chevron" size={30} style={{ color: BBColors.CurrentTheme.Default_Background }} />
            </View>
          </BBTouchable>
        </ScrollView>
        <BBButton
          full
          title="AJUSTE PERSONALIZADO"
          style={{ backgroundColor: 'white' }}
          onPress={() => this.props.navigation.navigate('GoalPeriodScene', { goal: this.props.navigation.state.params.goal })}
        />
      </BBContainer>
    );
  }
}

const styles = StyleSheet.create({
  grayText: {
    color: 'gray',
  },
  originalGoal: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: BBColors.CurrentTheme.Default_Background,
    backgroundColor: 'white',
  },
  settingGoal: {
    justifyContent: 'space-between',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
