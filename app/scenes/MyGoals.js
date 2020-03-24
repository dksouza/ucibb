import React, { PureComponent } from 'react';
import { NativeModules, View, StyleSheet, ScrollView } from 'react-native';
import { BBColors, BBContainer, BBNavigationHeader, BBText, BBButton, BBModal, BBIcon, BBAlert } from 'mov-react-native-ui';
import Carousel from 'react-native-snap-carousel';
import { AnalyticsCentral } from 'mov-react-native-analytics';
import styles from '../style/index.style';
import MyGoalsService from '../services/MyGoalsService';
import SliderEntry from '../components/SliderEntry';
import DecimalText from '../components/DecimalText';
import Modal from '../components/Modal';
import { sliderWidth, itemWidth } from '../style/sliderentry.style';
import { goalImages, ANALYTICS_EVENT_NAME } from '../model/GoalConstants';

const moment = require('moment');

export default class MyGoals extends PureComponent {
  static navigationOptions = {
    header: false,
  };

  constructor(props) {
    super(props);
    this.titleNavigation = 'Minhas metas';
    const { navigation } = this.props;
    this.selectedItemIndex = navigation.getParam('selectedIndex', 0);
    let goals = navigation.getParam('goals', []);
    goals = goals.map(item => ({ ...item, image: goalImages[item.codigoObjetivoPlanoInvestimento - 1] || goalImages[1] }));

    this.state = {
      goals,
      loading: true,
      refreshCarousel: false,
    };

    this.backButton = {
      imageName: 'arrow-back',
      color: 'white',
      accessibilityLabel: 'Sair',
      opacity: 1,
      onPress: () => this.closeBundle(),
    };
    this.changeSelectedGoal = this.changeSelectedGoal.bind(this);
    this.changeSelectedGoal();
  }

  /**
   * @method closeBundle - Encerra o bundle
   * @description encerra o bundle utilizado e retorna para o bundle da aplicação principal
   */
  closeBundle() {
    NativeModules.BBRNNavigation.closeBundle(() => {});
  }

  /**
   * @method renderItem - renderiza os cards
   * @description pega o item de cada card e renderiza colocando o efeito do parallax
   */
  renderItem = ({ item }, parallaxProps) => (
    <SliderEntry data={item.image} even parallax parallaxProps={parallaxProps} subtitle={item.nomePersonalizadoContrato} percentage={item.percentual} />
  );

  changeSelectedGoal() {
    const currentItemIndex = this.carousel ? this.carousel.currentIndex : this.selectedItemIndex;
    const currentGoal = this.state.goals[currentItemIndex];
    const params = { codigoContratoAssessoriaInvestimento: currentGoal.codigoContratoAssessoriaInvestimento };
    AnalyticsCentral.getInstance().sendFabricEvent(ANALYTICS_EVENT_NAME, { Consultar: currentGoal.nomeObjetivoPlanoInvestimento });
    MyGoalsService.consultContract(
      params,
      onSuccess => {
        const contract = onSuccess.DadosRespostaConsultarSaldosContratoAssessoriaEmInvestimentos;
        const percentual = (parseFloat(contract.valorSaldoAtualizado) / parseFloat(contract.valorObjetivo)) * 100.0;
        const selectedGoal = Object.assign(contract, {
          dataInicioObjetivo: contract.dataInicioObjetivo.replace(/[.]/g, '/'),
          dataFinalizacaoObjetivo: contract.dataFinalizacaoObjetivo.replace(/[.]/g, '/'),
          percentualRentabilidade: parseFloat(contract.percentualRentabilidade).toFixed(2),
          percentual: percentual < 100 ? percentual : 100,
          nomePersonalizadoContrato: currentGoal.nomePersonalizadoContrato,
          codigoContratoAssessoriaInvestimento: currentGoal.codigoContratoAssessoriaInvestimento,
          nomeObjetivoPlanoInvestimento: currentGoal.nomeObjetivoPlanoInvestimento,
          codigoObjetivoPlanoInvestimento: currentGoal.codigoObjetivoPlanoInvestimento,
          diaSelecionadoAplicacao: currentGoal.diaSelecionadoAplicacao,
          image: currentGoal.image,
          codigoTipoPerfilPlano: this.props.navigation.state.params.clientProfile.codigoTipoPerfil,
          codigoPerfilPlanoInvestimento: this.props.navigation.state.params.clientProfile.codigoPerfilInvestidor,
          textoDescricaoPerfil: this.props.navigation.state.params.clientProfile.textoDescricaoPerfil,
        });
        currentGoal.percentual = selectedGoal.percentual;
        NativeModules.BBRNNavigation.onFinishLoad();
        this.setState({
          selectedGoal,
          loading: false,
          refreshCarousel: !this.state.refreshCarousel,
        });
      },
      onError => {
        console.log(`erro=${onError}`);
        NativeModules.BBRNNavigation.onFinishLoad();
        this.setState({
          loading: false,
        });
      },
    );
  }

  /**
   * @method navigateToScreen - Navegação entre telas
   * @description monta os parametrôs e envia para a próxima tela
   */
  navigateToScreen(screenName, screenTitle) {
    this.props.navigation.navigate(screenName, {
      goal: this.state.selectedGoal,
      isFromMyGoals: true,
      titleNavigation: screenTitle,
    });
  }

  onPressCancel() {
    BBModal.closeModal(this.modal);
  }

  onNewContributionPress = () => {
    if (this.isAvailable()) {
      AnalyticsCentral.getInstance().sendFabricEvent(ANALYTICS_EVENT_NAME, {
        'Novo aporte - Visita': this.state.selectedGoal.nomeObjetivoPlanoInvestimento,
      });
      this.navigateToScreen('GoalValuesScene', 'Novo Aporte');
    }
  };

  isAvailable = () => {
    const transferMoment = moment().locale('pt-br');
    if (transferMoment.hour() <= 6 || transferMoment.hour() >= 23) {
      alertText = 'Funcionalidade disponível entre 7 e 23 horas!';
      BBAlert.alert(alertText, 'INFO', 'Atenção', null, ['OK, ENTENDI']);
      return false;
    }
    return true;
  };

  modalQuit() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-around' }}>
        <BBIcon name="close-circle" size={50} style={{ marginVertical: 30, alignSelf: 'center', color: '#00375a' }} />
        <BBText style={[titleModal, { color: BBColors.CurrentTheme.badgeTextColor }]}>Desistir da meta</BBText>
        <BBText style={[textModal, { color: BBColors.CurrentTheme.brandTertiary }]}>Ao desistir da meta você pode escolher se quer manter ou não seus investimentos.</BBText>
        <View>
          <BBButton primary full style={{ justifyContent: 'flex-start' }} title="Desistir da meta e manter produtos" onPress={() => this.renderModalGiveUp()} />
          <BBButton
            style={{ backgroundColor: '#fff', color: '#0f3f66', justifyContent: 'flex-start' }}
            full
            title="Desistir e resgatar tudo"
            onPress={() => {
              this.onPressCancel();
              this.navigateToScreen('RedeemInvestments');
            }}
          />
          <BBButton primary style={{ backgroundColor: '#fff', color: '#0f3f66', justifyContent: 'flex-start' }} full title="Cancelar" onPress={() => this.onPressCancel()} />
        </View>
      </View>
    );
  }

  givUpRedeem() {
    this.onPressCancel();
    this.navigateToScreen('RedeemInvestments');
  }

  giveUpGoal() {
    const params = { codigoContratoAssessoriaInvestimento: this.state.goals[this.carousel.currentIndex].codigoContratoAssessoriaInvestimento };
    MyGoalsService.terminateContract(
      params,
      () => {
        AnalyticsCentral.getInstance().sendFabricEvent(ANALYTICS_EVENT_NAME, {
          Cancelar: this.state.selectedGoal.nomeObjetivoPlanoInvestimento,
        });
        NativeModules.BBRNNavigation.closeBundleAndReloadWidget(() => {});
      },
      onError => {
        console.log(`erro=${onError}`);
        BBModal.closeModal(this.modal);
        BBAlert.alert('Erro ao desistir da meta, tente novamente.');
      },
    );
  }

  renderModalGiveUp() {
    const modalProps = {
      actionName: 'Desistir?',
      alignActionName: 'flex-start',
      iconName: 'close-circle',
      sizeIcon: 80,
      titleLeft: 'cancelar',
      titleRight: 'confirmar',
      describe: 'Você irá desistir da sua meta, mas seus investimentos serão mantidos, fique tranquilo! Para acompanhar seus investimentos, acesse a aba Investimentos no seu app.',
      callback: () => this.giveUpGoal(),
    };
    Modal.showModal(modalProps);
  }

  // Será usado futuramente
  renderModalQuit() {
    // BBModal.showModal(this.modalQuit(), {
    //   height: modalHeight,
    //   width: modalWidth,
    //   closeOnClick: false,
    //   keyboardAvoidingView: false,
    //   modalTouchableOpacityStyle: { flex: 1, justifyContent: 'flex-end' },
    //   customRequestClose: () => this.onPressCancel(),
    // });
  }

  renderContent() {
    return (
      this.state.selectedGoal && (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Carousel
                ref={ref => {
                  this.carousel = ref;
                }}
                onSnapToItem={this.changeSelectedGoal}
                data={this.state.goals}
                firstItem={this.selectedItemIndex}
                renderItem={this.renderItem}
                hasParallaxImages
                containerCustomStyle={styles.slider}
                contentContainerCustomStyle={styles.sliderContentContainer}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                extraData={this.state.refreshCarousel}
              />
              <View style={BBStyles.textContainer}>
                <View style={[BBStyles.textColumn]}>
                  <BBText opacity smallTitle style={BBStyles.title}>
                    Saldo atualizado
                  </BBText>
                  <DecimalText value={this.state.selectedGoal.valorSaldoAtualizado} integerFontSize={26} style={{ color: '#027800', paddingBottom: 15, maxWidth: 140 }} />
                  <BBText opacity smallTitle style={BBStyles.title}>
                    Iniciada em
                  </BBText>
                  <BBText opacity style={[BBStyles.tinyText, { fontSize: 18 }]}>
                    {this.state.selectedGoal.dataInicioObjetivo}
                  </BBText>
                </View>
                <View style={[BBStyles.textColumn]}>
                  <BBText opacity smallTitle style={BBStyles.title}>
                    Minha Meta
                  </BBText>
                  <DecimalText value={this.state.selectedGoal.valorObjetivo} integerFontSize={26} style={{ color: '#027800', paddingBottom: 15, maxWidth: 140 }} />
                  <BBText opacity smallTitle style={BBStyles.title}>
                    Previsão de Término
                  </BBText>
                  <BBText opacity style={[BBStyles.tinyText, { fontSize: 18 }]}>
                    {this.state.selectedGoal.dataFinalizacaoObjetivo}
                  </BBText>
                </View>
              </View>
            </View>
          </ScrollView>
          <View>
            <BBButton full title="NOVO APORTE" onPress={this.onNewContributionPress} />
            <BBButton secondary full title="DESISTIR DA META" onPress={() => this.renderModalGiveUp()} />
          </View>
        </View>
      )
    );
  }

  renderNoContent() {
    return (
      !this.state.loading &&
      !this.state.selectedGoal && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <BBIcon name="happy-sweat-face" size={50} style={{ color: '#727272' }} />
          <BBText tinyTitle style={{ paddingTop: 20, fontSize: 16 }}>
            Nenhuma meta encontrada...
          </BBText>
        </View>
      )
    );
  }

  render() {
    return (
      <BBContainer style={{ backgroundColor: '#fff' }} safebarTemplate={BBContainer.SAFE_AREA_TEMPLATE.SAFE_AREA_TEMPLATE_HOME}>
        <BBNavigationHeader title={this.titleNavigation} leftButtons={this.backButton} navigation={this.props.navigation} centerTitle />
        {this.renderContent()}
        {this.renderNoContent()}
      </BBContainer>
    );
  }
}

const BBStyles = StyleSheet.create({
  title: {
    fontWeight: '500',
    paddingBottom: 5,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 10,
    marginRight: 12,
    marginLeft: 12,
  },
  textColumn: {
    flexDirection: 'column',
  },
  titleModal: {
    fontSize: 24,
    marginLeft: 15,
  },
  textModal: {
    marginLeft: 15,
    marginRight: 15,
    opacity: 0.8,
    fontSize: 14,
    marginTop: 15,
    marginBottom: 30,
  },
  tinyText: {
    fontWeight: '300',
  },
});

const { titleModal, textModal } = BBStyles;
