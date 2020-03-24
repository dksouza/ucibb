import React, { PureComponent } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { BBContainer, BBNavigationHeader, BBImage, BBIcon, BBText, BBTouchable, BBColors } from 'mov-react-native-ui';
import StringUtil from 'mov-react-native/components/stringutil';
import PropTypes from 'prop-types';
import { AnalyticsCentral } from 'mov-react-native-analytics';
import { ANALYTICS_EVENT_NAME } from '../model/GoalConstants';
import GoalServices from '../services/GoalServices';
import { ViewUtils } from '../utils/Utils';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 80; // from BBNavigationHeader: Platform.OS === 'ios' ? 78 : 83;
const imageHeight = width / 2;
const imageReduced = imageHeight * 0.85;
const labelHeight = imageReduced + HEADER_HEIGHT;
const TRANSITION_TIMEOUT = 1000;

const TRANSITION_VIEW = {
  INVESTIMENT: 0,
  WALLET: 1,
  ERROR: 9,
};
export default class GoalTransition extends PureComponent {
  static navigationOptions = {
    header: false,
  };

  constructor(props) {
    super(props);
    this.goal = this.props.navigation.state.params.goal;
    this.isFromGoalEdit = this.props.navigation.state.params.isFromGoalEdit;
    this.isNewContribution = this.props.navigation.state.params.isNewContribution;
    this.balance = this.props.navigation.state.params.balance;
    this.titleNavigation = this.props.navigation.getParam('titleNavigation', this.goal.nomeObjetivoPlanoInvestimento);

    this.state = {
      transitionView: TRANSITION_VIEW.INVESTIMENT,
    };
    this.simulation = undefined;
    this.isTimeoutEnded = false;
    this.errorMessage = undefined;
  }

  componentDidMount() {
    this.showInvestmentView();
  }

  showInvestmentView() {
    this.executeService();
    setTimeout(() => {
      this.showWalletView();
    }, TRANSITION_TIMEOUT);
  }

  sendFabricEvent() {
    const params = {};
    const eventDescription = this.isNewContribution ? 'Novo aporte - Simular' : 'Simular';
    params[eventDescription] = this.goal.nomeObjetivoPlanoInvestimento;
    AnalyticsCentral.getInstance().sendFabricEvent(ANALYTICS_EVENT_NAME, params);
  }

  async executeService() {
    this.sendFabricEvent();

    this.simulation = undefined;
    this.errorMessage = undefined;
    let goalParams;
    if (this.goal.numeroPrazoPermanenciaPlano === '0') {
      this.goal.numeroPrazoAplicacaoAdicional = 60;
      this.goal.numeroPrazoPermanenciaPlano = 60;
    }

    if (this.isNewContribution) {
      goalParams = this.buildNewContributionParams();
    } else {
      const valorAdicional = StringUtil.formatStringCurrencyToDecimalNumber(this.goal.valorAdicionalInvestimento);
      if (this.goal.valorAdicionalInvestimento === '' || valorAdicional === 0) {
        this.goal.numeroPrazoAplicacaoAdicional = 0;
      }
      goalParams = Object.assign({}, this.goal);
    }

    const formatValue = value => StringUtil.formatStringCurrencyToDecimalNumber(value) * 100;
    goalParams.valorAplicacaoInicioInvestimento = formatValue(this.goal.valorAplicacaoInicioInvestimento);
    goalParams.valorAdicionalInvestimento = this.isNewContribution || this.goal.valorAdicionalInvestimento === '' ? 0 : formatValue(this.goal.valorAdicionalInvestimento);

    GoalServices.getSimulation(
      goalParams,
      onSuccess => {
        this.setAditionalAttributesToResult(onSuccess);
        this.simulation = onSuccess;
        this.navigateToSummary();
      },
      onError => {
        console.log(`erro=${onError}`);
        this.errorMessage = onError.message;
        this.navigateToSummary();
      },
    );
  }

  buildNewContributionParams() {
    const params = {
      dataFinalizacaoObjetivo: this.goal.dataFinalizacaoObjetivo.split('/').join('.'),
      codigoTipoPerfilPlano: this.goal.codigoTipoPerfilPlano,
      codigoPerfilPlanoInvestimento: this.goal.codigoPerfilPlanoInvestimento,
      codigoObjetivoPlanoInvestimento: this.goal.codigoObjetivoPlanoInvestimento,
    };
    return params;
  }

  setAditionalAttributesToResult(_result) {
    const result = _result;
    const listaNivel = result.dadosRespostaCriarSimulacaoPlanoInvestimentoCliente.listaNivel.filter(e => e.codigoAtivoFinanceiro > 0);
    result.dadosRespostaCriarSimulacaoPlanoInvestimentoCliente.listaNivel = listaNivel;
    result.investmentsTotal = listaNivel.reduce((prev, current) => prev + current.valorSugestaoAplicacaoAtivo, 0.0);
    result.dadosRespostaCriarSimulacaoPlanoInvestimentoCliente.listaNivel.map(item =>
      Object.assign(item, { percenteOverTotal: (item.valorSugestaoAplicacaoAtivo * 100) / result.investmentsTotal }));
  }

  showWalletView() {
    this.setState({ transitionView: TRANSITION_VIEW.WALLET });
    this.isTimeoutEnded = false;
    setTimeout(() => {
      this.isTimeoutEnded = true;
      this.navigateToSummary();
    }, TRANSITION_TIMEOUT);
  }

  reloadService() {
    this.setState({ transitionView: TRANSITION_VIEW.INVESTIMENT });
    this.showInvestmentView();
  }

  navigateToSummary() {
    if (this.isTimeoutEnded) {
      if (this.errorMessage) {
        this.setState({ transitionView: TRANSITION_VIEW.ERROR });
      } else if (this.simulation) {
        const simulationObj = {
          goal: this.goal,
          simulation: this.simulation,
          isNewContribution: this.isNewContribution,
          balance: this.balance,
        };
        if (this.isFromGoalEdit) {
          this.props.navigation.pop(2);
          const { onSimulationSuccess } = this.props.navigation.state.params;
          if (onSimulationSuccess) {
            onSimulationSuccess(simulationObj);
          }
        } else {
          this.props.navigation.replace('GoalSummaryScene', simulationObj);
        }
      }
    }
  }

  render() {
    return (
      <BBContainer style={{ backgroundColor: BBColors.CurrentTheme.cardDefaultBg }} safebarTemplate={BBContainer.SAFE_AREA_TEMPLATE.SAFE_AREA_TEMPLATE_ONLY_NAVIGATION}>
        <BBNavigationHeader title={this.titleNavigation} centerTitle navigation={this.props.navigation} />
        <BBImage style={styles.image} source={this.goal.image} />
        <View style={[styles.imageLabelContainer, ViewUtils.getBackgroundColor(this.goal.codigoObjetivoPlanoInvestimento)]}>
          <BBText style={styles.imageLabel}>{this.goal.nomePersonalizadoContrato}</BBText>
        </View>

        {this.state.transitionView === TRANSITION_VIEW.INVESTIMENT && (
          <View style={styles.container}>
            <BBIcon name="search-dollar" size={50} customColor={BBColors.CurrentTheme.brandTertiary} />
            <BBText tinyTitle style={styles.text}>
              Escolhendo o melhor
            </BBText>
            <BBText tinyTitle style={styles.text}>
              investimento
            </BBText>
            <BBText tinyTitle style={styles.text}>
              para você
            </BBText>
          </View>
        )}
        {this.state.transitionView === TRANSITION_VIEW.WALLET && (
          <View style={styles.container}>
            <BBIcon name="piechart" size={50} customColor={BBColors.CurrentTheme.brandTertiary} />
            <BBText tinyTitle style={styles.text}>
              Criando sua
            </BBText>
            <BBText tinyTitle style={styles.text}>
              carteira de
            </BBText>
            <BBText tinyTitle style={styles.text}>
              investimentos
            </BBText>
          </View>
        )}

        {this.state.transitionView === TRANSITION_VIEW.ERROR && (
          <View style={styles.container}>
            <BBTouchable style={styles.container} type="opacity" onPress={() => this.reloadService()}>
              <BBIcon name="happy-sweat-face" size={50} />
              <BBText tinyTitle style={styles.text}>
                Ops...
              </BBText>
              <BBText tinyTitle style={styles.text}>
                Falha na transação.
              </BBText>
              <BBText tinyTitle style={styles.text}>
                Executar novamente?
              </BBText>
            </BBTouchable>
          </View>
        )}
      </BBContainer>
    );
  }
}

GoalTransition.propTypes = {
  onSimulationSuccess: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 17,
    fontSize: 20,
  },
  image: {
    width,
    height: imageHeight,
  },
  imageLabel: {
    paddingLeft: 10,
    paddingRight: 21,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  imageLabelContainer: {
    position: 'absolute',
    top: labelHeight,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
