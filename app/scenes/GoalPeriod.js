import React, { Component } from 'react';
import { NativeModules, View, ScrollView, KeyboardAvoidingView, Dimensions, Keyboard } from 'react-native';
import { BBNavigationHeader, BBContainer, BBIcon, BBText, BBButton, BBColors, BBModal, BBFormItem } from 'mov-react-native-ui';
import moment from 'moment';
import 'moment/locale/pt-br';
import { AnalyticsCentral } from 'mov-react-native-analytics';
import Modal from '../components/Modal';
import GoalDataSource, { ANALYTICS_EVENT_NAME } from '../model/GoalConstants';

const { width } = Dimensions.get('window');
const { BBRNRenderer } = NativeModules;
const FORM_ID = {
  NOMERO_PRAZO_PERMANENCIA_PLANO: 'numeroPrazoPermanenciaPlano',
  VALOR_OBJETIVO_RENTABILIDADE_CONTRATO: 'valorObjetivoRentabilidadeContrato',
  VALOR_APLICACAO_INICIO_INVESTIMENTO: 'valorAplicacaoInicioInvestimento',
  VALOR_ADICIONAL_INVESTIMENTO: 'valorAdicionalInvestimento',
  DIA_SELECIONADO_APLICACAO: 'diaSelecionadoAplicacao',
};

const DEFAULT_PERIOD_VALUE = '0';
export default class GoalPeriod extends Component {
  static navigationOptions = {
    header: false,
  };

  static formatNumberOfPeriods(componentRef, _value) {
    let numberOfPeriods = Number(_value) > componentRef.range.maximum ? componentRef.range.maximum : _value;
    if (typeof numberOfPeriods === 'string' && numberOfPeriods.length > 1) {
      numberOfPeriods = Number(numberOfPeriods);
    }
    return numberOfPeriods;
  }

  constructor(props) {
    super(props);
    moment.locale('pt-br');
    this.goal = this.props.navigation.state.params.goal;
    this.state = {
      numberOfPeriods: DEFAULT_PERIOD_VALUE,
      hasCredit: true,
      periodDescription: '',
      value: '0',
    };
    this.range = GoalDataSource.getGoalRange();
    this.pickerValues = GoalDataSource.getGoalPickerValues();

    this.onNextScreenPressed = this.onNextScreenPressed.bind(this);
    this.onObtainCreditPressed = this.onObtainCreditPressed.bind(this);
    this.onPeriodChanged = this.onPeriodChanged.bind(this);
  }

  /**
   * @method onPeriodChanged - Evento chamado quando o valor do slider ou do picker é modificado
   * @description Muda o texto com a previsão da data de fim e o número de períodos selecionado
   */
  onPeriodChanged(_value) {
    let val = _value;
    if (val === '' || _value.props) {
      val = '0';
    }
    const numberOfPeriods = GoalPeriod.formatNumberOfPeriods(this, val);
    if (_value === '0') {
      this.setState({ value: '' });
    }
    this.setState({ value: _value });
    if (_value > 360) {
      this.setState({ value: '360' });
    }

    let periodDescription = moment(new Date())
      .add(numberOfPeriods, this.range.mode)
      .format('MMM/YYYY');
    if (numberOfPeriods === DEFAULT_PERIOD_VALUE) {
      periodDescription = 'Suas projeções de investimentos serão de 5 anos';
    }
    this.setState({ periodDescription, numberOfPeriods });
  }

  /**
   * @method showModalSaibaMais - Modal chamado quando o botão de ajuda é pressionado
   * @description Mostra um janela de ajuda que explica como proceder
   */
  showModalSaibaMais() {
    const description =
      'O tempo que você planeja para o concluir seu objetivo é importante, pois vai considerar o período em que você vai se organizar para atingir um objetivo bacana.' +
      '\n \n' +
      'Como o seu dinheiro será aplicado, ele também vai rendendo com o tempo. Quanto maior o tempo, mais rendimentos você terá.';

    const modalSaibaMais = (
      <Modal actionName="SAIBA MAIS" alignActionName="flex-start" iconName="ico-saiba-mais" sizeIcon={60} positionIcon={40} titleLeft="ok, entendi" describe={description} />
    );

    BBModal.showModal(modalSaibaMais, {
      height: 450,
      width: width - 40,
    });
  }

  /**
   * @method onNextScreenPressed - Evento chamado quando o botão de avançar é pressionado
   * @description Navega para a próxima tela passando o objeto de metas como parâmetro
   */
  onNextScreenPressed() {
    const { navigate } = this.props.navigation;
    Keyboard.dismiss();
    navigate('GoalValuesScene', {
      goal: {
        ...this.goal,
        numeroPrazoAplicacaoAdicional: this.pickerValues[this.state.numberOfPeriods].value,
        numeroPrazoPermanenciaPlano: this.pickerValues[this.state.numberOfPeriods].value,
      },
    });
  }

  /**
   * @method onObtainCreditPressed - Evento chamado quando o botão de crédito é pressionado
   * @description Mostra uma janela de crédito com opções de contratação ou cancelamento
   */
  onObtainCreditPressed() {
    AnalyticsCentral.getInstance().sendFabricEvent(ANALYTICS_EVENT_NAME, { Empréstimo: this.goal.nomeObjetivoPlanoInvestimento });
    this.modal = BBModal.showModal(this.showModalSimulate(), {
      height: 350,
      width: width - 40,
    });
  }

  /**
   * @method mountTitle - Monta a pergunta inicial da tela
   * @description Define o texto inicial da tela com destaque em negrito em certas palavras
   * e com um botão de ajuda no final do texto
   */
  mountTitle() {
    return (
      <View style={styles.titleContainer}>
        <BBText>
          <BBText style={styles.title}>Em </BBText>
          <BBText medium style={styles.title}>
            quanto tempo
          </BBText>
          <BBText style={styles.title}> você gostaria de atingir esse objetivo? </BBText>
          <BBIcon
            style={{ alignSelf: 'center', backgroundColor: 'transparent' }}
            onPress={this.showModalSaibaMais}
            name="interface-question-mark"
            size={20}
            customColor="#00375a"
          />
          {/* </BBTouchable> */}
        </BBText>
      </View>
    );
  }

  /**
   * @method mountFooterText - Monta o texto auxiliar da parte inferior da tela.
   * @description Define o texto da parte inferior da tela com destaque em negrito em certas palavras
   * e com um icone de calendario no canto esquerdo do texto.
   */
  mountFooterText() {
    return (
      <View style={[styles.footerContainer]}>
        <View style={{ flexDirection: 'row', marginRight: 30 }}>
          <BBIcon name="calendar-empty" size={20} style={{ alignSelf: 'flex-start', marginTop: 10 }} customColor={BBColors.CurrentTheme.brandTertiary} />
          <BBText style={{ marginLeft: 8, fontSize: 14, lineHeight: 30 }}>
            Grande parte das pessoas costuma poupar por volta de
            <BBText medium style={{ fontSize: 14 }}>
              {' '}
              1 ano
            </BBText>
            . Não se preocupe, você pode alterar isso depois.
          </BBText>
        </View>
      </View>
    );
  }

  /**
   * @method closeModal - Fechar modal
   * @description Função que fecha a modal
   */
  closeModal() {
    BBModal.closeModal();
  }

  /**
   * @method openScreenRender - Abre telas renderizadas
   * @description Função que abre telas renderizadas
   */
  openScreenRender() {
    BBModal.closeModal();
    let screen = '';
    switch (this.goal.codigoObjetivoPlanoInvestimento) {
      case 5:
        screen = 'tela/SimulacaoCreditoVeiculo/entrada';
        break;
      case 4:
        screen = 'tela/SimulacaoCreditoImobiliario/entrada';
        break;
      default:
        screen = 'tela/CreditoSimplificado/entrada';
    }
    BBRNRenderer.execute(screen, null);
  }

  /**
   * @method showModalSimulate - Alert Personalizada
   * @description Apresenta um alerta com 2 botões.
   */
  showModalSimulate() {
    const { descriptionAlertDualButton, titleAlert, descriptionAlertDualButtonText } = styles;
    const B = props => <BBText style={{ fontWeight: '500', fontSize: 15, color: '#00375a' }}>{props.children}</BBText>;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              height: 120,
            }}
          >
            <BBIcon style={{ top: 41, color: '#00375a' }} name="Money-penny" size={63} />
          </View>

          <View style={titleAlert}>
            <BBText style={{ fontSize: 15, color: '#00375a' }} adjustsFontSizeToFit minimumFontScale={0.9}>
              Disponível
            </BBText>
            <BBText style={{ fontSize: 28, color: '#00375a', fontWeight: '400' }} adjustsFontSizeToFit minimumFontScale={0.9}>
              CRÉDITO
            </BBText>
          </View>
          <View style={descriptionAlertDualButton}>
            <BBText style={descriptionAlertDualButtonText} adjustsFontSizeToFit minimumFontScale={0.9}>
              Nós podemos te ajudar a realizar seu objetivo <B>agora</B>. Quer saber mais?
              {'\n'}
              Ao sair, a criação de sua meta será descartada.
            </BBText>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <BBButton full style={{ width: '49.9%' }} onPress={() => this.closeModal()} title="CANCELAR" />
          <BBButton full style={{ width: '49.9%' }} onPress={() => this.openScreenRender()} title="SIMULAR" />
        </View>
      </View>
    );
  }

  render() {
    return (
      <BBContainer>
        <BBNavigationHeader title={this.goal.nomeObjetivoPlanoInvestimento} centerTitle navigation={this.props.navigation} secondaryBottomBorder />
        <ScrollView
          style={[styles.scrollContainer, { backgroundColor: BBColors.CurrentTheme.Default_Cell_Background }]}
          keyboardDismissMode="on-drag"
          alwaysBounceVertical={false}
          contentContainerStyle={{
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {this.mountTitle()}
          {/* Pode ser que esse código volte a ser usado. */}
          {/* <BBSlider
            onRef={ref => {
              this.sliderRef = ref;
            }}
            type="value"
            value={Number(this.state.numberOfPeriods)}
            // expanded
            mode="value"
            label="Tempo estimado"
            step={this.range.step}
            minimumValue={this.range.minimum}
            maximumValue={this.range.maximum}
            onChangeText={text => this.onPeriodChanged(text)}
            onSlidingComplete={value => this.onPeriodChanged(value)}
          /> */}
          <BBFormItem
            formID={FORM_ID.NOMERO_PRAZO_PERMANENCIA_PLANO}
            label="Tempo estimado (meses)"
            type="only-numbers"
            maxLength={4}
            value={this.state.value}
            maximumValue={this.range.maximum}
            onFocus={value => this.onPeriodChanged(value)}
            onChangeText={value => this.onPeriodChanged(value)}
          />

          {/* <BBPicker label="" items={this.pickerValues} selectedValue={this.state.numberOfPeriods} onValueChange={this.onPeriodChanged} /> */}

          <BBText smallTitle style={styles.dateDescription}>
            {this.state.periodDescription}
          </BBText>

          {this.mountFooterText()}
        </ScrollView>
        <KeyboardAvoidingView behavior="padding">
          {this.state.hasCredit && (
            <BBButton
              secondary
              full
              title={`NÃO QUERO ESPERAR, ME AJUDE A ${this.goal.nomeObjetivoPlanoInvestimento.toUpperCase()} AGORA`}
              textProps={{ style: { fontSize: 13 } }}
              colorIconLeftLabel="#fff"
              leftLabelIcon="lightning-circle"
              onPress={this.onObtainCreditPressed}
              style={{ paddingLeft: 35 }}
            />
          )}
          <BBButton primary full title="AVANÇAR" onPress={this.onNextScreenPressed} />
        </KeyboardAvoidingView>
      </BBContainer>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  helpButtonContainer: {
    marginLeft: 5,
    marginTop: 8,
    width: 20,
    height: 20,
  },
  titleContainer: {
    marginTop: 15,
    marginHorizontal: 15,
    flexDirection: 'row',
  },
  title: {
    fontSize: 17,
  },
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 30,
    marginHorizontal: 15,
    alignItems: 'flex-end',
  },
  dateDescription: {
    marginHorizontal: 15,
    marginTop: 5,
    fontSize: 14,
  },

  descriptionAlertDualButton: {
    marginLeft: 20,
    marginRight: 20,
  },

  descriptionAlertDualButtonText: {
    fontSize: 15,
    color: '#00375a',
    lineHeight: 25,
    letterSpacing: 0.1,
    textAlign: 'justify',
    marginTop: 10,
    fontWeight: '300',
  },

  titleAlert: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 0,
  },
};
