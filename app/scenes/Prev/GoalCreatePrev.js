import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';

import { BBRequest } from 'mov-react-native-connector';
import { BBNativeConstants } from 'mov-react-native';

import { BBColors, BBDeviceInfo, BBFormItem, BBContainer, BBIcon, BBNavigationHeader, BBText, BBForm, BBPicker, BBView, BBLoaderIndicator } from 'mov-react-native-ui';
import Modal from '../../components/Modal';
//import BBTabView from 'mov-react-native-ui';
import DecimalText from '../../components/DecimalText';
// import { Container } from './styles';

import GoalService from '../../services/GoalServices';
import GoalStorage from '../../persistence/GoalStorage';
import GoalServices from '../../services/GoalServices';

const { width } = Dimensions.get('window');

export default class GoalCreatePrev extends Component {
  state = {
    q1: '',
    q2: '0',
    q3: '18',
    q4: '',
    q5: '',
    isLoading: false,
  };

  getPickerItens1 = () => {
    return [
      {
        value: '0',
        label: 'Pagar mensalmente',
      },
      {
        value: '1',
        label: 'Pagar uma única vez',
      },
    ];
  };

  getPickerItens2 = () => {
    return [
      {
        value: '0',
        label: 'Não',
      },
      {
        value: '1',
        label: 'Sim',
      },
    ];
  };

  getDays = () => {
    let days = [];
    for (let i = 1; i <= 28; i++) {
      days = [...days, { value: `${i}`, label: `${i}` }];
    }
    return days;
  };

  sendQuestions = async () => {
    const res = await GoalService.getCPF();
    console.log(res);
    return;
    this.setState({ isLoading: true });
    const { navigation } = this.props;
    try {
      const data = {
        codigoCanalDistribuicao: 1,
        codigoCanalVenda: 6,
        valorContribuicao: 200,
        codigoPeriodicidade: 1,
        idadeSaida: 51,
        codigoTipoDeclaracaoIr: 1,
        nomeProponente: 'Dymmer Souza',
        numeroCpfproponente: '02690612151',
        codigoGeneroProponente: 1,
        dataNascimentoProponente: '06/02/1988',
        idPerfilInvestidor: 1,
        numeroDiaVencimento: 10,
      };

      const uri = `https://${BBNativeConstants.GRAFENO_SERVER}/cfe-bpr/api/v1/simular-venda-plano-previdencia-sem-projecao`;

      await BBRequest.doRequest2(
        uri,
        data,
        success => {
          console.log(success, 'SUCCESS SERVICE');
          this.setState({ isLoading: false });
          //navigation.navigate('GoalDetailsPrev', success);
        },
        error => {
          console.log(error, 'ERRO SERVICE');
          this.setState({ isLoading: false });
        },
        { Host: 'Grafeno' },
      );
    } catch (err) {
      console.log(err, 'ERRO');
    }
  };

  componentDidMount() {}

  showModalSaibaMais = question => {
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
  };

  nextDetails() {
    this.props.navigation.navigate('GoalDetailsPrev');
  }

  render() {
    const { navigation } = this.props;
    const { isLoading } = this.state;

    return (
      <BBContainer
        style={{ backgroundColor: BBColors.CurrentTheme.Default_Cell_Background }}
        safebarTemplate={BBContainer.SAFE_AREA_TEMPLATE.SAFE_AREA_TEMPLATE_DEFAULT_BUTTON_SCREEN}
      >
        <BBNavigationHeader title="Investir por objetivo" type="centerTitle" navigation={navigation} />

        {isLoading ? (
          <BBView style={[styles.container, styles.center]}>
            <ActivityIndicator size="large" color={BBColors.Blue} />
          </BBView>
        ) : (
          <>
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
                <DecimalText style={{ marginBottom: 15, fontWeight: 'bold' }} integerFontSize={18} decimalFontSize={18} value={2300} />
              </View>
            </View>

            <BBForm
              actionName="AVANÇAR"
              onSubmit={() => this.sendQuestions()}
              autoFocus={false}
              keyboardOffset={BBDeviceInfo.safeAreaInsets.top}
              textUpPrimaryButton="*Campos de preenchimento opcional"
              backgroundColor="transparent"
            >
              <View style={styles.formStyle}>
                <View style={{ flex: 0.9 }}>
                  <BBPicker
                    formID="create-prev"
                    quaternary
                    label="Como você prefere investir no seu objetivo?"
                    items={this.getPickerItens1()}
                    selectedValue={'0'}
                    value={this.state.q1}
                  />
                </View>
                <View style={{ flex: 0.1, alignSelf: 'center' }}>
                  <BBIcon icon="interface-question-mark" customColor="#00375a" size={20} onPress={() => this.showModalSaibaMais('question4')} />
                </View>
              </View>

              <View style={styles.formStyle}>
                <View style={{ flex: 0.9 }}>
                  <BBFormItem
                    required={false}
                    formID="valorAdicionalInvestimento"
                    label="Quanto você quer investir?"
                    value={this.state.q2}
                    onChangeText={value => this.setState({ q2: value })}
                    type="money"
                  />
                </View>
                <View style={{ flex: 0.1, alignSelf: 'center' }}>
                  <BBIcon icon="interface-question-mark" customColor="#00375a" size={20} onPress={() => {}} />
                </View>
              </View>

              <View style={styles.formStyle}>
                <View style={{ flex: 0.9 }}>
                  <BBFormItem required={false} formID="valorAdicionalInvestimento" label="Com qual idade você pretende se aposentar?" value={this.state.q3} type="only-numbers" />
                </View>
                <View style={{ flex: 0.1, alignSelf: 'center' }}>
                  <BBIcon icon="interface-question-mark" customColor="#00375a" size={20} onPress={() => {}} />
                </View>
              </View>

              <View style={styles.formStyle}>
                <View style={{ flex: 0.9 }}>
                  <BBPicker
                    formID="utilizar-previdencia"
                    quaternary
                    label="Utilizar previdência pra abatimento fiscal de IRPF?"
                    items={this.getPickerItens2()}
                    selectedValue={'0'}
                    value={this.state.q4}
                  />
                </View>
                <View style={{ flex: 0.1, alignSelf: 'center' }}>
                  <BBIcon icon="interface-question-mark" customColor="#00375a" size={20} onPress={() => this.showModalSaibaMais('question4')} />
                </View>
              </View>

              <View style={styles.formStyle}>
                <View style={{ flex: 0.9 }}>
                  <BBPicker formID="dia-debito" quaternary label="Qual o melhor dia para débito?" items={this.getDays()} selectedValue={'1'} value={this.state.q5} />
                </View>
                <View style={{ flex: 0.1, alignSelf: 'center' }}>
                  <BBIcon icon="interface-question-mark" customColor="#00375a" size={20} onPress={() => this.showModalSaibaMais('question5')} />
                </View>
              </View>
            </BBForm>
          </>
        )}
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
  container: {
    flex: 1,
    backgroundColor: '#E9E9EF',
  },
  center: {
    alignContent: 'center',
    justifyContent: 'center',
  },
});
