import React, { PureComponent } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { BBContainer, BBNavigationHeader, BBText, BBButton, BBIcon, BBFormItem, BBAlert, BBReinforcementAnimation, BBPasswordInput } from 'mov-react-native-ui';
import { Container } from 'native-base';
import Accordion from 'react-native-collapsible/Accordion';
import Modal from '../components/Modal';
import { goalImages } from '../model/GoalConstants';
import DecimalText from '../components/DecimalText';
import InvestmentsDetail from '../components/InvestmentsDetail';
import CheckBox from '../components/Checkbox';

export default class RedeemInvestiments extends PureComponent {
  static navigationOptions = { header: false };
  constructor(props) {
    super(props);
    this.titleNavigation = 'Resgatar';
    const { params } = props.navigation.state;
    const { goal } = params;
    const list = this.getUncheckedList(goal.investimentos);
    global.total = this.getTotal(list);
    global.totalRedeem = this.getTotalRedeem(list);
    global.isDiffValue = false;
    const piechartList = [
      { value: goal.percentualRendaFixa, subtitle: 'Renda fixa', color: '#599de4' },
      { value: goal.percentualRendaVariavel, subtitle: 'Renda variavel', color: '#f0ce11' },
    ];
    this.state = {
      total,
      list,
      piechartList,
      totalRedeem,
      showModal: false,
      goal,
    };
  }

  getUncheckedList(list) {
    return list.map(item => Object.assign(item, { isChecked: false, isDiffValue: false }));
  }

  getTotal(list) {
    return list.reduce((total, current) => total + (!current.isChecked ? (current.isDiffValue ? current.num : current.valor) : 0), 0);
  }

  getTotalRedeem(list) {
    return list.reduce((total, current) => total + (current.isChecked ? (current.isDiffValue ? current.num : current.valor) : 0), 0);
  }

  checkUncheckedList(list) {
    const isSelect = list.every(current => current.isChecked === false);
    return isSelect;
  }

  showModal() {
    const description = 'Nenhum item selecionado.';
    const modalError = (
      <Modal actionName="Erro" alignActionName="flex-start" iconName="ico-saiba-mais" sizeIcon={60} positionIcon={40} titleLeft="ok, entendi" describe={description} />
    );

    return BBModal.showModal(modalError, {
      height: modalHeight,
      width: modalWidth,
    });
  }

  renderItem(item) {
    Object.assign(item);
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
            alignItems: 'stretch',
            paddingTop: 10,
          }}
        >
          <CheckBox checked={item.isChecked} onPress={isChecked => this.checkPress(item, isChecked, isDiffValue)} style={{ marginLeft: 10 }} />
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Accordion sections={[item]} renderHeader={this.renderHeader} renderContent={this.renderContent} underlayColor="transparent" touchableProps={{}} />

            <View style={{ flex: 1 }}>
              <BBFormItem onChangeText={num => this.diffValue(item, isDiffValue, num)} fontSize="1" type="money" hideFloatingLabel="true" borderColor="#979797" style={formItem} />
            </View>
          </View>
        </View>
        <Accordion sections={[item]} renderHeader={this.renderHeaderInfo} renderContent={this.renderContentInfo} underlayColor="transparent" touchableProps={{}} />
      </View>
    );
  }
  diffValue(item, isDiffValue, num) {
    const numValue = parseFloat(num.replace(/[^0-9,-]+/g, '').replace(',', '.'));

    if (numValue > 0) {
      Object.assign(item, { isDiffValue: true, num: numValue });
    } else {
      Object.assign(item, { isDiffValue: false });
      this.updateValues(item);
    }

    if (item.isChecked) {
      this.updateValues(item);
    }
  }
  checkPress(item, isChecked) {
    Object.assign(item, { isChecked });
    this.updateValues(item);
    return !isChecked;
  }

  updateValues() {
    let valorTotal = 0;

    this.state.list.map(item => {
      if (item.isChecked && item.isDiffValue) {
        valorTotal += item.num;
      } else if (item.isChecked && !item.isDiffValue) {
        valorTotal += item.valor;
      }
      return valorTotal;
    });
    const valorRestante = total - valorTotal;
    this.setState({ totalRedeem: valorTotal, total: valorRestante });
  }

  navigateToResult() {
    const { goal } = this.state;
    const image = goalImages[goal.codigoObjetivoPlanoInvestimento - 1];
    const goalSummary = Object.assign({}, { title: goal.nomeObjetivoPlanoInvestimento, image, investments: goal.investimentos });
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [NavigationActions.navigate({ routeName: 'MyGoalsScene' }), NavigationActions.navigate({ routeName: 'GoalResultScene', params: { goalSummary } })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  async confirmInvestments() {
    this.setState({ showModal: false });
    BBReinforcementAnimation.show();
    try {
      BBReinforcementAnimation.hide(true, () => {
        this.navigateToResult();
      });
    } catch (e) {
      console.log(`erro: ${e}`);
      BBReinforcementAnimation.hide(false, () => {
        BBAlert.alert('Falha ao executar transação.');
      });
    }
  }

  renderHeader(content) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <BBText opacity> {content.nome} </BBText>
        <BBIcon selected name="arrow-down-small" size={20} style={{ color: '#727272', paddingRight: 10 }} />
      </View>
    );
  }

  renderContent(content) {
    return (
      <View style={renderContent}>
        <View style={{ flexDirection: 'column' }}>
          <BBText opacity style={{ fontSize: 12 }}>
            Investido
          </BBText>
          <DecimalText tinyTitle value={content.valor} integerFontSize={10} decimalFontSize={10} style={{ fontWeight: 'bold' }} currencySymbol="R$" />
        </View>

        <View style={{ flexDirection: 'column', justifyContent: 'flex-end' }}>
          <BBText opacity>Quando Credita</BBText>
          <BBText opacity>imediatamente</BBText>
        </View>
      </View>
    );
  }

  renderHeaderInfo(content, isActive) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 21 }}>
        <BBText style={textHeaderInfo}> Máximo para resgate: {content.valorResgate} </BBText>

        <BBIcon selected name={isActive ? 'close-circle' : 'interface-information'} size={14} style={{ color: '#727272', paddingTop: 5 }} />
      </View>
    );
  }

  renderContentInfo() {
    return (
      <View style={renderContentInfo}>
        <BBText style={{ fontSize: 12, color: '#00375a', lineHeight: 20 }}>
          Esse é o valor máximo que você pode resgatar hoje. Investimentos que possuem uma carência maior precisam aguardar um tempo definido antes do resgate. Para mais
          informações veja na seção Investimentos do seu app.
        </BBText>
      </View>
    );
  }

  render() {
    const footerMessage = this.state.total === 0.0 ? 'Todo saldo do seu objetivo será resgatado e a sua meta excluída' : '';
    const isSelect = this.state.list.every(current => current.isChecked === false);
    return (
      <Container>
        <BBContainer style={bbContainer} safebarTemplate={BBContainer.SAFE_AREA_TEMPLATE.SAFE_AREA_TEMPLATE_ONLY_NAVIGATION}>
          <BBNavigationHeader title={this.titleNavigation} centerTitle leftButtons={this.backButton} navigation={this.props.navigation} />
          <InvestmentsDetail value={this.state.total} chartData={this.state.piechartList} footerMessage={footerMessage} />
          <FlatList data={this.state.list} renderItem={({ item }) => this.renderItem(item, item.isChecked, item.isDiffValue)} style={{ marginTop: 20, flex: 1 }} />
          <View>
            <View style={textBottom}>
              <BBText tinyTitle style={{ fontSize: 14, flex: 0.5 }}>
                RESGATE TOTAL
              </BBText>
              <DecimalText value={this.state.totalRedeem} integerFontSize={18} decimalFontSize={10} style={{ flex: 0.5, textAlign: 'right' }} />
            </View>
            {!isSelect && <BBButton primary full title="RESGATAR" onPress={() => this.setState({ showModal: true })} />}
          </View>
          {this.state.showModal && <BBPasswordInput autoFocus onSubmit={params => this.confirmInvestments(params)} />}
        </BBContainer>
        <BBReinforcementAnimation />
      </Container>
    );
  }
}

const Styles = StyleSheet.create({
  bbContainer: {
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  textBottom: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    padding: 20,
  },
  renderContent: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: 10,
  },
  textHeaderInfo: {
    fontSize: 12,
    color: '#727272',
    justifyContent: 'flex-start',
    paddingTop: 5,
    paddingLeft: 10,
  },
  formItem: {
    position: 'relative',
    left: -10,
    backgroundColor: 'transparent',
    paddingLeft: -10,
  },
  renderContentInfo: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flex: 1,
    backgroundColor: '#fae128',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
});

const { renderContent, textHeaderInfo, textBottom, bbContainer, formItem, renderContentInfo } = Styles;
