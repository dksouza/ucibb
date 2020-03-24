import React, { PureComponent } from 'react';
import { BBColors, BBDeviceInfo, BBFormItem, BBContainer, BBNavigationHeader, BBForm, BBImage, BBPicker, BBAlert } from 'mov-react-native-ui';
import { View, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import StringUtil from 'mov-react-native/components/stringutil';
import GoalDataSource from '../model/GoalConstants';
import { ViewUtils } from '../utils/Utils';
import GoalService from '../services/GoalServices';
import SaldosService from '../services/SaldosService';

const { width } = Dimensions.get('window');
const imageHeight = width / 2;

const ACTION_NAMES = Object.freeze({
  BACK: 'VOLTAR',
  CONFIRM: 'CONFIRMAR',
});
const FORM_ID = {
  NOMERO_PRAZO_PERMANENCIA_PLANO: 'numeroPrazoPermanenciaPlano',
  VALOR_OBJETIVO_RENTABILIDADE_CONTRATO: 'valorObjetivoRentabilidadeContrato',
  VALOR_APLICACAO_INICIO_INVESTIMENTO: 'valorAplicacaoInicioInvestimento',
  VALOR_ADICIONAL_INVESTIMENTO: 'valorAdicionalInvestimento',
  DIA_SELECIONADO_APLICACAO: 'diaSelecionadoAplicacao',
};
export default class GoalEdit extends PureComponent {
  static navigationOptions = {
    header: false,
  };

  constructor(props) {
    super(props);
    this.goal = this.props.navigation.state.params.goal;
    this.balance = this.props.navigation.state.params.balance;
    this.isNewContribution = this.props.navigation.state.params.isNewContribution;
    this.state = {
      actionName: ACTION_NAMES.BACK,
      numeroPrazoPermanenciaPlano: this.goal.numeroPrazoPermanenciaPlano,
      diaSelecionadoAplicacao: this.goal.diaSelecionadoAplicacao,
      value: '0.0',
      additionalInvestmentNumber: 0,
    };

    this.range = GoalDataSource.getGoalRange();
    this.numeroPrazoPermanenciaPlanoValues = GoalDataSource.getGoalPickerValues();
    this.diaSelecionadoAplicacaoValues = this.getSelectedDayAplicationValues();
    this.createGoalCopyToCompare();
  }
  componentDidMount = () => {
    this.accountValues();
  };

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

  getSelectedDayAplicationValues() {
    days = Array.from({ length: 28 }, (x, i) => i + 1).map(val => ({ value: val, label: val.toString() }));
    return days;
  }

  createGoalCopyToCompare() {
    this.goalCopy = Object.assign({}, this.goal);
  }

  validateForms(initialValue, formObject) {
    const text = this.isNewContribution ? '' : ' inicial';
    if (initialValue < 100) {
      BBAlert.alert(`O seu investimento${text} não pode ser menor que R$ 100,00.`);
      return false;
    }
    if (
      StringUtil.formatStringCurrencyToDecimalNumber(formObject.valorAplicacaoInicioInvestimento) < 100 &&
      StringUtil.formatStringCurrencyToDecimalNumber(formObject.valorAplicacaoInicioInvestimento) > 0
    ) {
      BBAlert.alert('O seu investimento mensal não pode ser menor que R$ 100,00.');
      return false;
    }
    if (!this.isNewContribution && initialValue > StringUtil.formatStringCurrencyToDecimalNumber(formObject.valorObjetivoRentabilidadeContrato)) {
      BBAlert.alert('Sua meta deve ser maior que o investimento inicial.');
      return false;
    }
    return true;
  }

  onFormSubmit = formObject => {
    if (this.state.actionName === ACTION_NAMES.BACK) {
      this.navigateBack();
      return;
    }
    const initialValue = StringUtil.formatStringCurrencyToDecimalNumber(this.goal.valorAplicacaoInicioInvestimento);
    if (this.validateForms(initialValue, formObject)) {
      this.modifyGoalObjectToSend(formObject);
      if (this.goal.nomePersonalizadoContrato !== this.goalCopy.nomePersonalizadoContrato) {
        this.validateCustomContractName();
      } else {
        this.createSimulation();
      }
    }
  };

  modifyGoalObjectToSend(formObject) {
    Object.keys(formObject).forEach(key => {
      if (key === 'diaSelecionadoAplicacao') {
        this.goal[key] = formObject[key].value;
      } else if (key === 'numeroPrazoPermanenciaPlano') {
        this.goal[key] = formObject[key];
        this.goal.numeroPrazoAplicacaoAdicional = formObject[key];
      } else {
        this.goal[key] = formObject[key];
      }
    });
  }

  validateCustomContractName() {
    const params = {
      codigoObjetivoPlanoInvestimento: this.goal.codigoObjetivoPlanoInvestimento,
      nomePersonalizadoContrato: this.goal.nomePersonalizadoContrato,
    };
    GoalService.isValidName(
      params,
      onSucessData => {
        const isValid = onSucessData.DadosRespostaValidarNomePersonalizadoContratoAssessoriaEmInvestimentos.numeroQuantidadePalavraNaoProprio === 0;
        if (isValid) {
          this.createSimulation();
        } else {
          BBAlert.alert('Nome impróprio!');
        }
      },
      onErrorData => {
        BBAlert.alert(onErrorData);
      },
    );
  }

  createSimulation = () => {
    this.props.navigation.navigate('GoalTransitionScene', {
      goal: this.goal,
      isFromGoalEdit: true,
      onSimulationSuccess: this.props.navigation.state.params.onSimulationSuccess,
      isNewContribution: this.isNewContribution,
      balance: this.balance,
    });
  };

  navigateBack = () => {
    this.props.navigation.goBack();
  };

  changeNumberDeadlinePlane = numeroPrazoPermanenciaPlano => {
    let numPrazo = numeroPrazoPermanenciaPlano;
    if (numPrazo.length > 0) {
      this.setState({ numeroPrazoPermanenciaPlano: parseInt(numeroPrazoPermanenciaPlano, 10) });
    } else {
      return;
    }
    if (numPrazo > 360) {
      numPrazo = '360';
    }
    this.onGoalValueChange('numeroPrazoPermanenciaPlano', numPrazo);
    this.setState({ numeroPrazoPermanenciaPlano: parseInt(numPrazo, 10) });
  };

  changeSelectedDayAplication = diaSelecionadoAplicacao => {
    this.onGoalValueChange('diaSelecionadoAplicacao', diaSelecionadoAplicacao);
    this.setState({ diaSelecionadoAplicacao });
  };

  /**
   * Se houver alteração na meta, então alterar botão para 'CONFIRMAR', senão 'VOLTAR'
   */
  onGoalValueChange = (goalKey, goalNewValue) => {
    this.goal[goalKey] = goalNewValue;

    let actionName = ACTION_NAMES.BACK;
    if (JSON.stringify(this.goal) !== JSON.stringify(this.goalCopy)) {
      actionName = ACTION_NAMES.CONFIRM;
    }

    if (goalKey === FORM_ID.VALOR_ADICIONAL_INVESTIMENTO) {
      this.setState({ actionName, additionalInvestmentNumber: StringUtil.formatStringCurrencyToDecimalNumber(goalNewValue) });
    } else {
      this.setState({ actionName });
    }
  };

  renderFormItemsFromNewSimulation() {
    if (!this.isNewContribution) {
      if (this.state.additionalInvestmentNumber === 0) {
        visible = 'none';
      } else {
        visible = 'flex';
      }
      return (
        <View>
          {/* <BBPicker
            formID={FORM_ID.NOMERO_PRAZO_PERMANENCIA_PLANO}
            label=""
            items={this.numeroPrazoPermanenciaPlanoValues}
            selectedValue={this.state.numeroPrazoPermanenciaPlano}
            onValueChange={this.changeNumberDeadlinePlane}
          /> */}
          <BBFormItem
            formID={FORM_ID.NOMERO_PRAZO_PERMANENCIA_PLANO}
            label="Tempo estimado"
            type="only-numbers"
            value={this.state.numeroPrazoPermanenciaPlano.toString()}
            maximumValue={this.range.maximum}
            maxLength={4}
            // onFocus={value => this.changeNumberDeadlinePlane(value)}
            onChangeText={value => this.changeNumberDeadlinePlane(value)}
            textValidate="Campo obrigatório"
          />
          <BBFormItem
            formID={FORM_ID.VALOR_OBJETIVO_RENTABILIDADE_CONTRATO}
            label="Minha meta"
            type="money"
            leftFloatLabelIcon="coins"
            value={this.goal.valorObjetivoRentabilidadeContrato}
            onChangeText={text => this.onGoalValueChange(FORM_ID.VALOR_OBJETIVO_RENTABILIDADE_CONTRATO, text)}
            textValidate="Campo obrigatório"
          />
          <BBFormItem
            formID={FORM_ID.VALOR_APLICACAO_INICIO_INVESTIMENTO}
            label="Investimento inicial"
            type="money"
            leftFloatLabelIcon="coins"
            value={this.goal.valorAplicacaoInicioInvestimento}
            onChangeText={text => this.onGoalValueChange(FORM_ID.VALOR_APLICACAO_INICIO_INVESTIMENTO, text)}
            textValidate="Campo obrigatório"
          />
          <BBFormItem
            formID={FORM_ID.VALOR_ADICIONAL_INVESTIMENTO}
            label="Investimento Mensal"
            type="money"
            leftFloatLabelIcon="coins"
            value={this.goal.valorAdicionalInvestimento}
            onChangeText={text => this.onGoalValueChange(FORM_ID.VALOR_ADICIONAL_INVESTIMENTO, text)}
            required={false}
          />
          <View
            style={{
              display: `${visible}`,
            }}
          >
            <BBPicker
              formID={FORM_ID.DIA_SELECIONADO_APLICACAO}
              label="Dia preferencial de débito"
              items={this.diaSelecionadoAplicacaoValues}
              selectedValue={this.state.diaSelecionadoAplicacao}
              onValueChange={this.changeSelectedDayAplication}
            />
          </View>
        </View>
      );
    }
    return <View />;
  }

  renderNewContributionItems() {
    if (this.isNewContribution) {
      return (
        <BBFormItem
          formID={FORM_ID.VALOR_APLICACAO_INICIO_INVESTIMENTO}
          label="Quanto você quer investir?"
          onChangeText={text => this.onGoalValueChange('valorAplicacaoInicioInvestimento', text)}
          value={this.goal.valorAplicacaoInicioInvestimento}
          type="money"
        />
      );
    }
    return <View />;
  }

  render() {
    return (
      <BBContainer style={{ backgroundColor: BBColors.CurrentTheme.Default_Background }} safebarTemplate={BBContainer.SAFE_AREA_TEMPLATE.SAFE_AREA_TEMPLATE_DEFAULT_BUTTON_SCREEN}>
        <BBNavigationHeader title="Alterar Meta" centerTitle navigation={this.props.navigation} />
        <BBForm actionName={this.state.actionName} onSubmit={this.onFormSubmit} autoFocus={false} keyboardOffset={BBDeviceInfo.safeAreaInsets.top} backgroundColor="#ffffff">
          <BBImage style={styles.image} source={this.goal.image} />
          <View>
            <BBFormItem
              formID="nomePersonalizadoContrato"
              label="Meta"
              type="no-mask"
              inputTextColor="#fff"
              style={[ViewUtils.getBackgroundColor(this.goal.codigoObjetivoPlanoInvestimento), styles.bbFormItemLabel]}
              editable={!this.isNewContribution}
              value={this.goal.nomePersonalizadoContrato}
              leftFloatLabelIcon="pencil-write"
              onChangeText={text => this.onGoalValueChange('nomePersonalizadoContrato', text)}
              maxLength={19}
              textValidate="O nome da meta é um campo obrigatório"
            />
          </View>

          {this.renderFormItemsFromNewSimulation()}
          {this.renderNewContributionItems()}
        </BBForm>
      </BBContainer>
    );
  }
}

GoalEdit.propTypes = {
  onSimulationSuccess: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  image: {
    width,
    height: imageHeight,
  },
  bbFormItemLabel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 15,
    fontSize: 30,
  },
});
