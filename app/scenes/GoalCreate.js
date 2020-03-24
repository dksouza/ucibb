import React, { PureComponent } from 'react';
import { NativeModules, View } from 'react-native';
import { BBColors, BBDeviceInfo, BBFormItem, BBContainer, BBNavigationHeader, BBText, BBForm, BBAlert } from 'mov-react-native-ui';
import { AnalyticsCentral } from 'mov-react-native-analytics';
import Carousel from 'react-native-snap-carousel';
import { ANALYTICS_EVENT_NAME } from '../model/GoalConstants';
import styles from '../style/index.style';
import SliderEntry from '../components/SliderEntry';
import GoalStorage from '../persistence/GoalStorage';
import GoalService from '../services/GoalServices';
import { sliderWidth, itemWidth } from '../style/sliderentry.style';
import clientProfileService from '../services/clientProfileService';

const moment = require('moment');

export default class GoalCreate extends PureComponent {
  static navigationOptions = {
    header: false,
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const tabIndex = navigation.getParam('selectedIndex', 0);
    this.getCards();
    this.state = {
      cards: [],
      tabIndex,
      clientProfile: {},
      nameGoal: undefined,
      goals: [],
    };

    this.backButton = {
      imageName: 'arrow-back',
      color: 'white',
      accessibilityLabel: 'Sair',
      opacity: 1,
      onPress: () => this.closeBundle(),
    };
    this.titleNavigation = 'Investir por objetivo';
  }

  componentWillMount() {
    this.valiteAvailableTime();
    this.listClientGoals();
    this.checkProfileAndListInvestorProducts();
  }

  componentDidMount() {
    this.getCards();
    NativeModules.BBRNNavigation.onFinishLoad();
  }

  async getCards() {
    try {
      const cards = await GoalStorage.getCards();
      this.setState({ cards });
    } catch (e) {
      BBAlert.alert('Falha ao obter os objetivos para investir.');
    }
  }

  valiteAvailableTime = () => {
    const transferMoment = moment().locale('pt-br');
    if (transferMoment.hour() <= 6 || transferMoment.hour() >= 23) {
      const alertText = 'Funcionalidade disponível entre 7 e 23 horas!';
      BBAlert.alert(alertText, 'INFO', 'Atenção', null, ['OK, ENTENDI']);
      NativeModules.BBRNNavigation.closeBundle(() => {});
    }
  };

  async listClientGoals() {
    try {
      const goals = await GoalService.listClientGoals();
      this.state.goals = goals;
    } catch (e) {
      BBAlert.alert('Falha ao obter os objetivos do cliente.');
    }
  }

  /**
   * @method closeBundle - Encerra o bundle
   * @description encerra o bundle utilizado e retorna para o bundle da aplicação principal
   */
  closeBundle() {
    NativeModules.BBRNNavigation.closeBundle(() => {});
  }

  async isValidName(codigoObjetivoPlanoInvestimento, nomePersonalizadoContrato) {
    if (nomePersonalizadoContrato.trim() === '') {
      BBAlert.alert('O nome do objetivo é um campo obrigatório!');
    } else if (this.state.goals.find(item => item.nomePersonalizadoContrato === nomePersonalizadoContrato)) {
      BBAlert.alert('Nome do objetivo já existente!');
    } else {
      const params = { codigoObjetivoPlanoInvestimento, nomePersonalizadoContrato };
      GoalService.isValidName(
        params,
        onSucessData => {
          const isValid = onSucessData.DadosRespostaValidarNomePersonalizadoContratoAssessoriaEmInvestimentos.numeroQuantidadePalavraNaoProprio === 0;
          if (isValid) {
            this.navigateToScreen(nomePersonalizadoContrato);
          } else {
            BBAlert.alert('Nome impróprio!');
          }
        },
        onErrorData => {
          BBAlert.alert(onErrorData);
        },
      );
    }
  }

  submitName = value => {
    const goalOption = this.state.cards[this.state.tabIndex];
    const { codigoObjetivoPlanoInvestimento } = goalOption;
    const nomePersonalizadoContrato = value.nameMeta;
    this.isValidName(codigoObjetivoPlanoInvestimento, nomePersonalizadoContrato);
  };

  async checkProfileAndListInvestorProducts() {
    clientProfileService(
      async clientProfile => {
        if (clientProfile.hasProfile) {
          this.state.clientProfile = clientProfile;
        }
      },
      () => {
        console.log(`GoalWidget - erro: ${e.message}`);
        this.setState({ errorMsg: e.message, loading: false });
      },
    );
  }

  /**
   * @method navigateToScreen - Navegação entre telas
   * @description monta os parametros e envia para a próxima tela
   */
  navigateToScreen(name) {
    const goalOption = this.state.cards[this.state.tabIndex];

    const goal = {
      nomePersonalizadoContrato: name,
      codigoObjetivoPlanoInvestimento: goalOption.codigoObjetivoPlanoInvestimento,
      image: goalOption.image,
      nomeObjetivoPlanoInvestimento: goalOption.nomeObjetivoPlanoInvestimento,
      codigoTipoPerfilPlano: this.state.clientProfile.codigoTipoPerfil,
      codigoPerfilPlanoInvestimento: this.state.clientProfile.codigoPerfilInvestidor,
      textoDescricaoPerfil: this.state.clientProfile.textoDescricaoPerfil,
    };
    this.goalOption = [];
    AnalyticsCentral.getInstance().sendFabricEvent(ANALYTICS_EVENT_NAME, { Visita: goal.nomeObjetivoPlanoInvestimento });

    console.log(`GoalCreateScene${JSON.stringify(goal)}`);
    //this.props.navigation.navigate('GoalPeriodScene', { goal });
    this.props.navigation.navigate('GoalValuesScene', { goal });
  }

  /**
   * @method changeSelectedIndexCard - Evento chamado quando altera o card selecionado
   * @description altera o state do card selecionado
   */
  changeSelectedIndexCard(index) {
    this.setState({
      tabIndex: index,
    });
  }

  /**
   * @method renderItem - renderiza os cards
   * @description pega o item de cada card e renderiza colocando o efeito do parallax
   */
  renderItem = ({ item }, parallaxProps) => <SliderEntry data={item.image} even parallax parallaxProps={parallaxProps} subtitle={item.nomeObjetivoPlanoInvestimento} />;
  render() {
    return (
      <BBContainer style={{ backgroundColor: BBColors.CurrentTheme.Default_Background }} safebarTemplate={BBContainer.SAFE_AREA_TEMPLATE.SAFE_AREA_TEMPLATE_DEFAULT_BUTTON_SCREEN}>
        <BBNavigationHeader title={this.titleNavigation} centerTitle leftButtons={this.backButton} navigation={this.props.navigation} style={{ alignItems: 'center' }} />

        <BBForm
          actionName="AVANÇAR"
          onSubmit={this.submitName}
          autoFocus={false}
          keyboardOffset={BBDeviceInfo.safeAreaInsets.top}
          backgroundColor={BBColors.CurrentTheme.Default_Cell_Background}
        >
          <BBText style={{ marginHorizontal: 30, marginTop: 10 }}>
            <BBText>
              Me conte sobre o <BBText style={{ fontWeight: 'bold' }}>objetivo</BBText>
            </BBText>

            <BBText> que você deseja alcançar</BBText>
          </BBText>

          <View>
            {this.state.cards.length > 0 && (
              <Carousel
                ref={ref => {
                  this.carousel = ref;
                }}
                onSnapToItem={index => this.changeSelectedIndexCard(index)}
                data={this.state.cards}
                firstItem={this.state.tabIndex}
                renderItem={this.renderItem}
                hasParallaxImages
                containerCustomStyle={styles.slider}
                contentContainerCustomStyle={styles.sliderContentContainer}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
              />
            )}
          </View>

          <View style={{ height: 50 }} />

          <BBFormItem
            formID="nameMeta"
            label="Que tal dar um nome para esse objetivo?"
            type="no-mask"
            maxLength={19}
            value={this.state.nameGoal}
            textValidate="O nome do objetivo é um campo obrigatório"
          />
        </BBForm>
      </BBContainer>
    );
  }
}
