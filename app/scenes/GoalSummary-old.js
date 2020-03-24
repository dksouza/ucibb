import React, { PureComponent } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { BBContainer, BBNavigationHeader, BBButton, BBModal, BBAlert, BBReinforcementAnimation, BBLoaderIndicator, BBColors, BBPasswordInput } from 'mov-react-native-ui';
import { NavigationActions } from 'react-navigation';
import StringUtil from 'mov-react-native/components/stringutil';
import { AnalyticsCentral } from 'mov-react-native-analytics';
import { Container } from 'native-base';

import TopSheetButton from '../components/TopSheetButton';
import GoalInvestment from './GoalInvestment';
import GoalPrediction from './GoalPrediction';
import SummaryComponent from '../components/SummaryComponent';
import Modal from '../components/Modal';
import GoalServices from '../services/GoalServices';
import { INVESTMENT_TERM_ITEM_PARAMS, ANALYTICS_EVENT_NAME } from '../model/GoalConstants';

// Cores para as classes ainda a serem definidas pela UX.
const codigoClasseCorMap = {
  1: '#034F85',
  2: '#54428E',
  3: '#257A5F',
  4: '#FFCB47',
  5: '#76B041',
  6: '#FE5F55',
  7: '#5EB1BF',
  8: '#F08700',
  9: '#9E0059',
  10: '#AFAFDC',
};
const { height } = Dimensions.get('window');

export default class GoalSummary extends PureComponent {
  static navigationOptions = {
    header: false,
  };

  constructor(props) {
    super(props);
    this.setListLevel(this.props.navigation.state.params.simulation);
    this.state = {
      showModalPassword: false,
      goal: this.props.navigation.state.params.goal,
      simulation: this.props.navigation.state.params.simulation,
      isNewContribution: this.props.navigation.state.params.isNewContribution,
      balance: this.props.navigation.state.params.balance,
    };

    this.titleNavigation = this.props.navigation.getParam('titleNavigation', this.state.goal.nomeObjetivoPlanoInvestimento);
  }

  setListLevel(simulation) {
    simulation.dadosRespostaCriarSimulacaoPlanoInvestimentoCliente.listaNivel.map(_item => {
      const item = _item;
      // Manter o padrão de cores do APP - Minhas Finanças
      // if (item.codigoCorClasseAtivo === '') {
      //   const index = item.codigoClasse < 10 ? item.codigoClasse : String(item.codigoClasse).substr(1, 1);
      //   item.color = codigoClasseCorMap[index];
      // } else{
      //   item.color = item.codigoCorClasseAtivo;
      // }
      const index = item.codigoClasse < 10 ? item.codigoClasse : String(item.codigoClasse).substr(1, 1);
      item.color = codigoClasseCorMap[index];
      return true;
    });
  }

  showPasswordModal() {
    this.closeModal();
    // return <BBPasswordInput onSubmit={password => this.onPasswordModalSubmit(password)} />;
    setTimeout(() => {
      this.setState({ showModalPassword: true });
    }, 200);
  }

  showConfirmationModal = () => {
    const valueInvesting = StringUtil.formatStringCurrencyToDecimalNumber(this.state.goal.valorAplicacaoInicioInvestimento);
    if (valueInvesting > this.state.balance) {
      BBAlert.alert(`O seu investimento ${this.state.goal.valorAplicacaoInicioInvestimento} não pode ser maior que o saldo disponível.`);
    } else {
      this.topSheetButton.hideContent();
      const modalProps = {
        actionName: 'Confirmar Investimento',
        alignActionName: 'flex-start',
        iconName: 'coins',
        sizeIcon: 60,
        titleLeft: 'cancelar',
        titleRight: 'investir',
        describe: 'Declaro que li e concordo com as condições descritas em cada produto desta proposta.',
        callback: params => this.showPasswordModal(params),
      };
      Modal.showModal(modalProps);
    }
  };

  closeModal = () => {
    BBModal.closeModal();
  };

  onPasswordModalSubmit = senhaConta => {
    this.setState({ showModalPassword: false }, () => {
      BBReinforcementAnimation.show();
      if (this.state.isNewContribution) {
        this.createInvestment(senhaConta);
      } else {
        this.createGoal(senhaConta);
      }
    });
  };

  /**
   * Cria a meta e realiza o investimento
   */
  createGoal = senhaConta => {
    const goalParams = this.buildCreateGoalParams(senhaConta);
    GoalServices.createGoal(
      goalParams,
      onSuccessData => {
        const pathName = 'DadosRespostaGravarContratoAssessoriaInvestimento';
        this.state.goal.codigoContratoAssessoriaInvestimento = onSuccessData[pathName].codigoContratoAssessoriaInvestimento;
        this.createInvestment(senhaConta);
      },
      onErrorData => {
        BBReinforcementAnimation.hide(false, () => {
          BBAlert.alert(onErrorData.message);
        });
      },
    );
  };

  createInvestment = senhaConta => {
    this.sendFabricEvent();
    const investmentParams = this.buildCreateInvestmentParams(senhaConta);
    GoalServices.createInvestment(
      investmentParams,
      onSuccessData => {
        BBReinforcementAnimation.hide(true, () => {
          const pathName = 'DadosRespostaIncluirAplicacaoAtivosFinanceirosPlanoInvestimentoCliente';
          this.investments = onSuccessData[pathName].listaAtivoAplicacao;
          this.navigateToResultScreen(onSuccessData);
        });
      },
      onErrorData => {
        BBReinforcementAnimation.hide(false, () => {
          BBAlert.alert(onErrorData.message);
        });
      },
    );
  };

  buildCreateGoalParams = senhaConta => {
    const formatValueToSend = value => StringUtil.formatStringCurrencyToDecimalNumber(value) * 100;
    const goalParams = {
      valorAplicacaoInicioContrato: formatValueToSend(this.state.goal.valorAplicacaoInicioInvestimento),
      valorObjetivoRentabilidadeContrato: formatValueToSend(this.state.goal.valorObjetivoRentabilidadeContrato),
      valorAdicionalAplicacao: formatValueToSend(this.state.goal.valorAdicionalInvestimento),
      codigoObjetivoContrato: this.state.goal.codigoObjetivoPlanoInvestimento,
      quantidadeMesObjetivoContrato: this.state.goal.numeroPrazoPermanenciaPlano,
      nomePersonalizadoContrato: this.state.goal.nomePersonalizadoContrato,
      diaSelecionadoAplicacao: this.state.goal.diaSelecionadoAplicacao,
      codigoTipoPerfilCliente: this.state.goal.codigoTipoPerfilPlano,
      codigoPerfilRiscoContrato: this.state.goal.codigoPerfilPlanoInvestimento,
      numeroSequencialPlanoInvestimento: this.state.simulation.dadosRespostaCriarSimulacaoPlanoInvestimentoCliente.numeroSequencialPlanoInvestimento,
      numeroVersaoAlocacaoPlano: this.state.simulation.dadosRespostaCriarSimulacaoPlanoInvestimentoCliente.numeroVersaoAlocacaoPlano,
      numeroSimulacaoPlanoInvestimento: this.state.simulation.dadosRespostaCriarSimulacaoPlanoInvestimentoCliente.numeroSimulacaoPlanoInvestimento,
      numeroSugestaoAlocacaoPlano: this.state.simulation.dadosRespostaCriarSimulacaoPlanoInvestimentoCliente.numeroSugestaoAlocacaoPlano,
      senhaConta,
    };
    return goalParams;
  };

  buildCreateInvestmentParams = senhaConta => {
    const investmentParams = {
      senhaConta,
      codigoContratoAssessoriaInvestimento: this.state.goal.codigoContratoAssessoriaInvestimento,
      numeroSequencialPlanoInvestimento: this.state.simulation.dadosRespostaCriarSimulacaoPlanoInvestimentoCliente.numeroSequencialPlanoInvestimento,
      numeroSimulacaoPlano: this.state.simulation.dadosRespostaCriarSimulacaoPlanoInvestimentoCliente.numeroSimulacaoPlanoInvestimento,
      numeroSugestaoAlocacaoPlano: this.state.simulation.dadosRespostaCriarSimulacaoPlanoInvestimentoCliente.numeroSugestaoAlocacaoPlano,
      numeroVersaoAlocacaoPlano: this.state.simulation.dadosRespostaCriarSimulacaoPlanoInvestimentoCliente.numeroVersaoAlocacaoPlano,
      numeroQuantidadeAtivo: this.state.simulation.dadosRespostaCriarSimulacaoPlanoInvestimentoCliente.listaNivel.length,
      codigoAcionamento: 2, // online
      listaAtivo: this.buildListaAtivosToSend(),
    };

    if (this.state.isNewContribution) {
      investmentParams.codigoContratoAssessoriaInvestimento = this.state.goal.codigoContratoAssessoriaInvestimento;
    }

    return investmentParams;
  };

  buildListaAtivosToSend = () => {
    const listaAtivos = [];
    const attributesToSend = [
      'codigoProdutoInvestimentoFinanceiro',
      'codigoModalidadeInvestimentoFinanceiro',
      'textoSubModalidadeInvestimento',
      'indicadorAssinaturaTermoAdesao',
      'indicadorAssinaturaTermoAdesao',
      'valorAplicacaoAtivo',
      'dataInicioOperacao',
      'dataVencimentoOperacao',
      'codigoAtivoFinanceiro',
    ];
    this.state.simulation.dadosRespostaCriarSimulacaoPlanoInvestimentoCliente.listaNivel.forEach(ativo => {
      const ativoObj = {};

      attributesToSend.forEach(attr => {
        ativoObj[attr] = ativo[attr];
        if (attr === 'valorAplicacaoAtivo') {
          ativoObj[attr] = ativo.valorSugestaoAplicacaoAtivo;
        }
      });
      listaAtivos.push(ativoObj);
    });
    return encodeURIComponent(JSON.stringify(listaAtivos));
  };

  sendFabricEvent() {
    const params = {};
    const eventDescription = this.isNewContribution ? 'Novo aporte - Aplicar' : 'Aplicar';
    params[eventDescription] = this.state.goal.nomeObjetivoPlanoInvestimento;
    AnalyticsCentral.getInstance().sendFabricEvent(ANALYTICS_EVENT_NAME, params);
  }

  navigateToResultScreen = () => {
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({
          routeName: 'GoalCreateScene',
          params: {
            clientProfile: {
              codigoTipoPerfil: this.state.goal.codigoTipoPerfilPlano,
              codigoPerfilInvestidor: this.state.goal.codigoPerfilPlanoInvestimento,
              textoDescricaoPerfil: this.state.goal.textoDescricaoPerfil,
            },
          },
        }),
        NavigationActions.navigate({
          routeName: 'GoalResultScene',
          params: {
            goal: this.state.goal,
            isNewContribution: this.state.isNewContribution,
            investments: this.investments,
          },
        }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  };

  navigateToGoalEdit = () => {
    this.topSheetButton.hideContent();
    this.props.navigation.navigate('GoalEditScene', {
      goal: this.state.goal,
      simulation: this.state.simulation,
      isNewContribution: this.state.isNewContribution,
      onSimulationSuccess: this.onSimulationSuccess,
    });
  };

  onSimulationSuccess = simulationObj => {
    const { simulation, isNewContribution, goal } = simulationObj; // just to be clear
    this.setListLevel(simulation);
    this.setState({ simulation, isNewContribution, goal });
  };

  showModalInvestmentDetail = item => {
    if (!this.isShowTerm(item)) {
      return;
    }
    this.loadInvestmentItemTerm(item);
  };

  /**
   * Não apresentar o termo quando nome do ativo for LCI ou LCA
   */
  isShowTerm(item) {
    const itemContains = text => item.nomeAtivoFinanceiro.toLowerCase().indexOf(text);
    if (itemContains('lci') > -1 || itemContains('lca') > -1) {
      return false;
    }
    return true;
  }

  loadInvestmentItemTerm = item => {
    BBLoaderIndicator.showLoaderOverlay();
    const itemParameters = {
      codigoFundoInvestimento: Number(item.textoSubModalidadeInvestimento),
      ...INVESTMENT_TERM_ITEM_PARAMS,
    };

    GoalServices.loadInvestmentItemTerm(
      itemParameters,
      onSuccess => {
        BBLoaderIndicator.hide();
        const pathName = 'DadosRespostaConsultarDadosBasicosTermoFundoInvestimentoNumeroTermoCliente';
        this.props.navigation.navigate('ReceiptScene', {
          text: onSuccess[pathName].textoFormularioTermo.split('</BR>').join('\n'),
          title: item.nomeAtivoFinanceiro,
          buttonLabel: 'OK',
          callback: () => this.props.navigation.pop(1),
        });
      },
      () => {
        BBLoaderIndicator.hide();
        // BBAlert.alert(onError.message); // Não apresentar mensagem de erro quando (Hashizume)
      },
    );
  };

  // TODO: não havia dados para essa modal, então optou-se por enviar o cliente para a visualização do termo
  // getInvestmentDetailTemplate = item => <GoalInvestmentDetail data={item} callback={this.closeModal} />;

  onScrollEnd = () => {
    setTimeout(() => {
      this.scrollView.scrollToEnd({ animated: false });
    }, 600);
  };

  onPasswordModalBlur = () => {
    this.setState({ showModalPassword: false });
  };

  /**
   * Renderiza a previsão se fluxo for diferente de novo aporte
   */
  renderGoalPrediction = () => {
    if (!this.state.isNewContribution) {
      return (
        <View style={styles.totalContainer}>
          <GoalPrediction callback={this.onScrollEnd} simulation={this.state.simulation} goal={this.state.goal} />
        </View>
      );
    }
    return <View />;
  };

  render() {
    const heightSheet = height * 0.7;
    return (
      <Container>
        <BBContainer style={{ backgroundColor: BBColors.CurrentTheme.cardDefaultBg }} safebarTemplate={BBContainer.SAFE_AREA_TEMPLATE.SAFE_AREA_TEMPLATE_DEFAULT_BUTTON_SCREEN}>
          <BBNavigationHeader title={this.titleNavigation} centerTitle navigation={this.props.navigation} />
          <TopSheetButton
            ref={ref => {
              this.topSheetButton = ref;
            }}
            style={{ minHeight: 20, maxHeight: heightSheet }}
            textButtonOpenned="OCULTAR INVESTIMENTO"
            textButtonClosed="VER INVESTIMENTOS"
            heightContent={height * 0.6}
          >
            <GoalInvestment callback={this.showModalInvestmentDetail} data={this.state.simulation} />
          </TopSheetButton>

          <ScrollView
            ref={ref => {
              this.scrollView = ref;
            }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'space-between',
              paddingTop: 10,
            }}
          >
            <SummaryComponent
              profile={this.state.goal.textoDescricaoPerfil}
              goal={this.state.goal}
              isNewContribution={this.state.isNewContribution}
              data={this.state.simulation.dadosRespostaCriarSimulacaoPlanoInvestimentoCliente.listaNivel}
              period={this.state.goal.numeroPrazoPermanenciaPlano}
              projection={this.state.simulation.dadosRespostaListarProjecaoRentabilidadeEvolucaoPatrimonialPeriodo.listaNivel}
            />
            {this.renderGoalPrediction()}
          </ScrollView>
          <View style={{ marginTop: 10 }}>
            <BBButton secondary full title="ALTERAR VALORES" onPress={this.navigateToGoalEdit} />
            <BBButton primary full title="QUERO CONTINUAR" onPress={this.showConfirmationModal} />
          </View>
          {this.state.showModalPassword && <BBPasswordInput autoFocus onSubmit={this.onPasswordModalSubmit} />}
        </BBContainer>
        <BBReinforcementAnimation />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  graphContainer: {
    flex: 0.45,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 0.55,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  detailsPercentage: {
    flex: 0.5,
    flexDirection: 'column',
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },

  textTotalTitle: {
    fontSize: 14,
    letterSpacing: -0.3,
    color: '#727272',
  },
  textTotalValue: {
    letterSpacing: -0.8,
    color: '#0f9f19',
  },

  separator: {
    width: 1,
    backgroundColor: '#D0D0D0',
  },
});
