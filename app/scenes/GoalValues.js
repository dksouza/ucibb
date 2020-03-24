/**
 * Página Home do módulo Metas.
 *
 */
import React, { PureComponent } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { BBColors, BBDeviceInfo, BBFormItem, BBContainer, BBIcon, BBNavigationHeader, BBText, BBForm, BBAlert, BBModal, BBButton, BBPicker } from 'mov-react-native-ui';
import StringUtil from 'mov-react-native/components/stringutil';
import DecimalText from '../components/DecimalText';
import SaldosService from '../services/SaldosService';
import Modal from '../components/Modal';
import moment from 'moment';
import 'moment/locale/pt-br';
import GoalDataSource from '../model/GoalConstants';

const { width, height } = Dimensions.get('window');
const DEFAULT_PERIOD_VALUE = '0';

export default class GoalValues extends PureComponent {
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
    this.balance = this.props.navigation.state.params.balance;
    this.isNewContribution = this.props.navigation.state.params.isFromMyGoals; // Novo aporte
    this.colors = BBColors.CurrentTheme;
    titleNavigation = this.props.navigation.getParam('titleNavigation', this.goal.nomeObjetivoPlanoInvestimento);

    this.range = GoalDataSource.getGoalRange();

    this.state = {
      value: '0.0',
      diaSelecionadoAplicacao: 1,
      additionalInvestmentNumber: 0,
      numberOfPeriods: DEFAULT_PERIOD_VALUE,
      valueTime: '0',
      periodDescription: '',
    };

    this.onPeriodChanged = this.onPeriodChanged.bind(this);
  }

  componentDidMount = () => {
    this.accountValues();
  };

  onAdditionalValueChanged(value) {
    this.setState({ additionalInvestmentNumber: value });
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
    const numberOfPeriods = GoalValues.formatNumberOfPeriods(this, val);
    if (_value === '0') {
      this.setState({ valueTime: '' });
    }
    this.setState({ valueTime: _value });
    if (_value > 360) {
      this.setState({ valueTime: '360' });
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
   * @method accountValues - Realiza requisição dos valores
   * @description Obtém os valores somados da conta corrente, poupança
   * e aplicações
   */
  async accountValues() {
    try {
      const saldos = await SaldosService.execute();
      this.setState({ value: saldos.total });
    } catch (e) {
      console.log('falha ao obter saldos...');
    }
  }
  validateForms(initialValue, values) {
    const text = this.isNewContribution ? '' : ' inicial';
    if (initialValue < 100) {
      BBAlert.alert(`O seu investimento${text} não pode ser menor que R$ 100,00.`);
      return false;
    }
    if (!this.isNewContribution) {
      if (initialValue > StringUtil.formatStringCurrencyToDecimalNumber(values.valorObjetivoRentabilidadeContrato)) {
        BBAlert.alert('Seu objetivo deve ser maior que o investimento inicial.');
        return false;
      }
      const additionalInvestmentNumber = StringUtil.formatStringCurrencyToDecimalNumber(values.valorAdicionalInvestimento);
      if (additionalInvestmentNumber > 0 && additionalInvestmentNumber < 100) {
        BBAlert.alert('O seu investimento mensal não pode ser menor que R$ 100,00.');
        return false;
      }
    }
    return true;
  }

  onFormSubmit = values => {
    const goal = { ...this.goal, ...values };
    const initialValue = StringUtil.formatStringCurrencyToDecimalNumber(values.valorAplicacaoInicioInvestimento);
    if (!this.isNewContribution) {
      goal.diaSelecionadoAplicacao = this.state.diaSelecionadoAplicacao;
    }
    if (this.validateForms(initialValue, values)) {
      this.props.navigation.navigate('GoalTransitionScene', {
        goal,
        isNewContribution: this.isNewContribution,
        balance: this.state.value,
        titleNavigation: this.goal.nomeObjetivoPlanoInvestimento,
      });
    }
  };

  /**
   * @method showModalSaibaMais - Alert no canto direito da label
   * @description monta o alert usando componente
   */
  showModalSaibaMais(question) {
    const description = [];
    description.question0 = 'Voce precisa investir com o valor mínimo de R$ 100,00.';
    description.question1 =
      'O valor total a ser guardado é uma das informações mais importantes. É o valor que você está reservando para materializar seu sonho.' +
      '\n ' +
      'Lembre-se de contabilizar todos os custos necessários.';
    description.question3 = 'O valor mensal é a maneira mais simples de alcançar seu objetivo. Guardando um pouquinho todo mês, seu sonho fica cada vez mais perto.';
    description.question4 = 'Dia preferencial para os aportes mensais programados.\n\nLembre-se de deixar em sua conta a quantia programada.';
    description.question5 =
      'O tempo que você planeja para o concluir seu objetivo é importante.' +
      '\n' +
      'Como o seu dinheiro será aplicado, ele também vai rendendo com o tempo. Quanto maior o tempo, mais rendimentos você terá.';

    const modalProps = {
      actionName: 'SAIBA MAIS',
      alignActionName: 'flex-start',
      iconName: 'ico-saiba-mais',
      sizeIcon: 60,
      titleLeft: 'ok, entendi',
      describe: description[question],
    };
    Modal.showModal(modalProps);
  }

  /**
   * @method showModalInitialInvestment - Alert no canto direito da label
   * @description mostra o alert personalizado de 3 ícones
   */
  showModalInitialInvestment() {
    return BBModal.showModal(this.modalInitialInvestment(), {
      height: height / 1.6,
      width: width * 0.9,
    });
  }

  /**
   * @method closeModal - Fechar modal
   * @description Função que fecha a modal
   */
  closeModal() {
    BBModal.closeModal();
  }

  getPickerItens() {
    let day = Array.from({ length: 28 }, (x, i) => i + 1).map(val => ({ value: val, label: val.toString() }));
    return day;
  }

  changeUserDate(value) {
    this.setState({ diaSelecionadoAplicacao: value });
  }

  /**
   * @method modalInitialInvestment - Alert personalizado
   * @description Função que monta o alert personalizado com mais de 3 ícones
   */
  modalInitialInvestment() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              top: '10%',
              left: 30,
            }}
          >
            <BBText style={{ color: '#00375a' }} adjustsFontSizeToFit minimumFontScale={0.9}>
              Meta
            </BBText>
            <BBText style={{ color: '#00375a' }} adjustsFontSizeToFit minimumFontScale={0.9}>
              bacana
            </BBText>
            <BBIcon icon="ico_meta_bacana" customColor="#00375a" size={35} />
          </View>

          <View style={{ flexDirection: 'column', top: '15%', left: 20 }}>
            <BBIcon icon="ico-sinal-mais" customColor="#00375a" />
          </View>

          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              top: '10%',
            }}
          >
            <BBText style={{ color: '#00375a' }} adjustsFontSizeToFit minimumFontScale={0.9}>
              Investimento
            </BBText>
            <BBText style={{ color: '#00375a' }} adjustsFontSizeToFit minimumFontScale={0.9}>
              inicial
            </BBText>
            <BBIcon icon="Money-penny" customColor="#00375a" size={35} />
          </View>

          <View
            style={{
              flexDirection: 'column',
              top: '15%',
              right: 20,
            }}
          >
            <BBIcon icon="ico-sinal-igual" customColor="#00375a" />
          </View>

          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              top: '10%',
              right: 30,
            }}
          >
            <BBText style={{ color: '#00375a' }} adjustsFontSizeToFit minimumFontScale={0.9}>
              Menos
            </BBText>
            <BBText style={{ color: '#00375a' }} adjustsFontSizeToFit minimumFontScale={0.9}>
              tempo!
            </BBText>
            <BBIcon icon="ico_menos_tempo" customColor="#00375a" size={35} />
          </View>
        </View>

        <BBText
          alertTitle
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'flex-start',
            color: '#00375a',
            left: 20,
            fontSize: 24,
          }}
        >
          INVESTIMENTO INICIAL
        </BBText>
        <View style={{ height: 20 }} />

        <BBText
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'left',
            left: 20,
            marginRight: 30,
            color: '#00375a',
            fontSize: 14,
            letterSpacing: 0.1,
            lineHeight: 25,
          }}
        >
          Vimos que você já tem algum dinheiro disponível. Você precisa começar com o valor mínimo de R$100,00. Este é um ótimo jeito de começar sua meta com o pé direito!
        </BBText>

        <BBButton full style={{ width: width * 0.9, alignSelf: 'flex-end' }} title="OK, ENTENDI" onPress={() => this.closeModal()} />
      </View>
    );
  }

  /**
   * Renderiza itens do formulário para a criação de uma simulação
   */
  renderCreateSimulationFormItems() {
    if (!this.isNewContribution) {
      if (this.state.additionalInvestmentNumber === 0) {
        visible = 'none';
      } else {
        visible = 'flex';
      }
      return (
        <View>
          <View style={styles.formStyle}>
            <View style={{ flex: 0.9 }}>
              <BBFormItem formID="valorAplicacaoInicioInvestimento" label="Qual seu investimento inicial?  " type="money" validateOnSubmitOnly />
            </View>
            <View style={{ flex: 0.1, alignSelf: 'center' }}>
              <BBIcon icon="interface-question-mark" customColor="#00375a" size={20} onPress={() => this.showModalSaibaMais('question0')} />
            </View>
          </View>
          <View style={styles.formStyle}>
            <View style={{ flex: 0.9 }}>
              <BBFormItem
                formID="numeroPrazoPermanenciaPlano"
                label="Tempo estimado (meses)"
                type="only-numbers"
                maxLength={4}
                value={this.state.valueTime}
                maximumValue={this.range.maximum}
                onFocus={value => this.onPeriodChanged(value)}
                onChangeText={value => this.onPeriodChanged(value)}
              />
              <BBText smallTitle style={styles.dateDescription}>
                {this.state.periodDescription}
              </BBText>
            </View>
            <View style={{ flex: 0.1, alignSelf: 'center' }}>
              <BBIcon icon="interface-question-mark" customColor="#00375a" size={20} onPress={() => this.showModalSaibaMais('question5')} />
            </View>
          </View>

          <View style={styles.formStyle}>
            <View style={{ flex: 0.9 }}>
              <BBFormItem required={false} formID="valorObjetivoRentabilidadeContrato" label="Quanto você deseja guardar?  " type="money" />
            </View>
            <View style={{ flex: 0.1, alignSelf: 'center' }}>
              <BBIcon icon="interface-question-mark" customColor="#00375a" size={20} onPress={() => this.showModalSaibaMais('question1')} />
            </View>
          </View>

          <View style={styles.formStyle}>
            <View style={{ flex: 0.9 }}>
              <BBFormItem
                required={false}
                formID="valorAdicionalInvestimento"
                label="Você irá realizar aplicações mensais? "
                type="money"
                onChangeText={value => this.onAdditionalValueChanged(StringUtil.formatStringCurrencyToDecimalNumber(value))}
              />
            </View>
            <View style={{ flex: 0.1, alignSelf: 'center' }}>
              <BBIcon icon="interface-question-mark" customColor="#00375a" size={20} onPress={() => this.showModalSaibaMais('question3')} />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              paddingTop: 10,
              flexDirection: 'row',
              display: `${visible}`,
            }}
          >
            <View style={{ flex: 0.9 }}>
              <BBPicker
                quaternary
                label="Dia preferencial de débito?"
                items={this.getPickerItens()}
                selectedValue={this.state.diaSelecionadoAplicacao}
                onValueChange={value => this.changeUserDate(value)}
              />
            </View>
            <View style={{ flex: 0.1, alignSelf: 'center' }}>
              <BBIcon icon="interface-question-mark" customColor="#00375a" size={20} onPress={() => this.showModalSaibaMais('question4')} />
            </View>
          </View>
        </View>
      );
    }
    return <View />;
  }

  /**
   * Renderiza itens do formulário para um novo aporte
   */
  renderNewContributionFormItems() {
    if (this.isNewContribution) {
      return <BBFormItem formID="valorAplicacaoInicioInvestimento" label="Quanto você quer investir?" type="money" />;
    }
    return <View />;
  }

  render() {
    return (
      <BBContainer
        style={{ backgroundColor: BBColors.CurrentTheme.Default_Cell_Background }}
        safebarTemplate={BBContainer.SAFE_AREA_TEMPLATE.SAFE_AREA_TEMPLATE_DEFAULT_BUTTON_SCREEN}
      >
        <BBNavigationHeader title={titleNavigation} centerTitle navigation={this.props.navigation} />
        <View
          style={{
            flexDirection: 'row',
            paddingLeft: 15,
            paddingTop: 15,
            backgroundColor: BBColors.CurrentTheme.Default_Background,
          }}
        >
          <BBIcon
            secondary
            style={{
              borderColor: 'transparent',
              borderWidth: 7,
              paddingTop: 5,
              paddingRight: 5,
            }}
            name="coins"
            customColor={BBColors.CurrentTheme.brandTertiary}
            size={28}
            color="black"
          />
          <View style={{ flexDirection: 'column', width }}>
            <BBText style={{ fontWeight: 'bold' }}>Saldo disponível para investimento</BBText>
            <DecimalText style={{ marginBottom: 15, fontWeight: 'bold' }} value={this.state.value} integerFontSize={18} decimalFontSize={18} />
          </View>
        </View>
        <BBText style={{ marginHorizontal: 30, marginTop: 10 }}>
          <BBText>
            Vamos planejar seu
            <BBText style={{ fontWeight: 'bold' }}> investimento?</BBText>
          </BBText>
        </BBText>
        <BBForm
          actionName="VER PROPOSTAS DE INVESTIMENTOS"
          onSubmit={this.onFormSubmit}
          autoFocus={false}
          keyboardOffset={BBDeviceInfo.safeAreaInsets.top}
          textUpPrimaryButton="*Campos de preenchimento opcional"
          backgroundColor="transparent"
        >
          {this.renderCreateSimulationFormItems()}
          {this.renderNewContributionFormItems()}
        </BBForm>
      </BBContainer>
    );
  }
}
const styles = StyleSheet.create({
  formStyle: {
    flex: 1,
    paddingTop: 10,
    flexDirection: 'row',
  },
  dateDescription: {
    marginHorizontal: 15,
    marginTop: 5,
    fontSize: 14,
  },
});
