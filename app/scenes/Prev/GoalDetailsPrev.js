import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { BBColors, BBContainer, BBIcon, BBNavigationHeader, BBView, BBText, BBPasswordInput } from 'mov-react-native-ui';
import FundsRentabilityPieChart from '../../components/charts/funds-rentability/index.js';

import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

const { width } = Dimensions.get('window');

const CHART_DATA = [
  { fundName: 'Fix I', value: 562100.16, yieldValue: 39201.07 },
  { fundName: 'Premium I', value: 240900.04, yieldValue: 16803.03 },
  { fundName: 'Fix II', value: 15000.22, yieldValue: 603.89 },
];

export default class GoalCreatePrev extends Component {
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'PROJEÇÃO' },
      { key: 'second', title: 'DISTRIBUTION' },
    ],
    response: {},
  };

  componentDidMount = () => {
    const { navigation } = this.props;
    this.setState({ response: navigation.state.params.response.rpstSimular });
    console.log(navigation.state.params.response.rpstSimular, 'RESPONSE SIMULAR');
  };

  getLegendColor = color => {
    return <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: color, marginRight: 10 }} />;
  };

  goAddress = () => {
    this.props.navigation.navigate('GoalAddressPrev');
  };

  getLabel(scene) {
    const sceneLabel = scene.index === 0 ? 'PROJEÇÃO' : 'DISTRIBUIÇÃO DE FUNDOS';
    let labelColor;
    let labelOpacity;
    if (scene.index !== this.state.index) {
      labelColor = BBColors.CurrentTheme.Default_Foreground;
      labelOpacity = BBColors.CurrentTheme.Default_LabelOpacity;
    } else {
      labelColor = BBColors.CurrentTheme.Highlight_Foreground;
      labelOpacity = 1;
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <BBText
          style={{
            opacity: labelOpacity,
            fontSize: 14,
            color: labelColor,
            weight: '600',
          }}
        >
          {sceneLabel}
        </BBText>
      </View>
    );
  }

  renderHeader = props => (
    <TabBar
      style={{
        backgroundColor: BBColors.CurrentTheme.Default_Background,
        justifyContent: 'center',
        elevation: 0,
        borderBottomColor: BBColors.CurrentTheme.Default_Separator,
        borderBottomWidth: 1,
        height: 48,
      }}
      labelStyle={{ color: BBColors.CurrentTheme.Highlight_Foreground, weight: '600' }}
      tabStyle={{ opacity: 1 }}
      renderLabel={scene => this.getLabel(scene)}
      getLabelText={() => {}}
      accessibilityLabel={this.getTabAccessibilityDescription}
      indicatorStyle={{ backgroundColor: BBColors.CurrentTheme.Highlight_Foreground }}
      {...props}
    />
  );

  render() {
    const { navigation } = this.props;

    const PrimaryTab = () => (
      <BBView>
        <View style={styles.header}>
          <BBText book style={styles.textHeader}>
            SIMULAÇÃO
          </BBText>
        </View>

        <View style={styles.body}>
          <View style={styles.box}>
            <BBText regular style={styles.titleBox}>
              INFORMAÇÕES DO PLANO
            </BBText>

            <View style={[styles.boxItem, styles.yellowBorder]}>
              <BBText regular style={styles.textBoxItem1}>
                Saldo projetado*
              </BBText>
              <BBText book style={styles.textBoxItem2}>
                R$ 1000,00
              </BBText>
            </View>

            <View style={styles.boxItem}>
              <BBText regular style={styles.textBoxItem1}>
                Valor da contribuição mensal
              </BBText>
              <BBText book style={styles.textBoxItem2}>
                R$ 200,00
              </BBText>
            </View>

            <View style={styles.boxItem}>
              <BBText regular style={styles.textBoxItem1}>
                Data do primeiro débito
              </BBText>
              <BBText book style={styles.textBoxItem2}>
                01/08/2019
              </BBText>
            </View>

            <View style={styles.boxItem}>
              <BBText regular style={styles.textBoxItem1}>
                Nome do plano
              </BBText>
              <BBText book style={styles.textBoxItem2}>
                Brasilprev VGBL Júnior
              </BBText>
            </View>

            <View style={styles.boxItem}>
              <BBText regular style={styles.textBoxItem1}>
                Idade de saída
              </BBText>
              <BBText book style={styles.textBoxItem2}>
                21 anos
              </BBText>
            </View>

            <View style={styles.boxItem}>
              <BBText regular style={styles.textBoxItem1}>
                Data de saída
              </BBText>
              <BBText book style={styles.textBoxItem2}>
                01/08/2025
              </BBText>
            </View>

            <View style={styles.boxItem}>
              <BBText regular style={styles.textBoxItem1}>
                Tipo de contribuição
              </BBText>
              <BBText book style={styles.textBoxItem2}>
                Progressiva Compensável
              </BBText>
            </View>
          </View>

          <View style={styles.box}>
            <BBText regular style={styles.titleBox}>
              DADOS DO CONTATO
            </BBText>
            <View style={styles.boxItem}>
              <BBText regular style={styles.textBoxItem1}>
                Telefone
              </BBText>
              <BBText book style={styles.textBoxItem2}>
                (61) 992665264
              </BBText>
            </View>

            <View style={styles.boxItem}>
              <BBText regular style={styles.textBoxItem1}>
                E-mail
              </BBText>
              <BBText book style={styles.textBoxItem2}>
                leonardoguedes@gmail.com
              </BBText>
            </View>
            <TouchableOpacity onPress={() => this.goAddress()}>
              <View style={[styles.boxItem, styles.boxItemFlexRow]}>
                <View style={styles.address}>
                  <BBText regular style={styles.textBoxItem1}>
                    Endereço
                  </BBText>

                  <BBText book style={styles.textBoxItem2}>
                    SQN 402 Bloco B, Apto. 601
                  </BBText>
                </View>

                <View style={styles.iconBtn}>
                  <BBIcon name="chevron" size={20} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.containerObs}>
            <BBText regular style={styles.txtObs}>
              *A reserva projetada considera: (i) as contribuições acumuladas até a data de saída e (ii) uma hipótese de rentabilidade de 3,5% ao ano. Os cálculos e as hipóteses
              financeiras aqui apresentadas são meras estimativas, não se constituindo em garantia ou obrigação por parte da Brasilprev Seguros e Previdência S/A e do Banco do
              Brasil S/A.
            </BBText>
          </View>
        </View>
      </BBView>
    );

    const SecondaryTab = () => (
      <BBView>
        <FundsRentabilityPieChart data={CHART_DATA} title="Meus Planos" />
      </BBView>
    );

    return (
      <BBContainer safebarTemplate={BBContainer.SAFE_AREA_TEMPLATE.SAFE_AREA_TEMPLATE_DEFAULT_BUTTON_SCREEN}>
        <BBNavigationHeader title="Confirmação de plano" type="centerTitle" navigation={navigation} />

        <ScrollView style={{ flex: 1 }}>
          <TabViewAnimated
            navigationState={this.state}
            renderHeader={this.renderHeader}
            renderScene={SceneMap({
              first: PrimaryTab,
              second: SecondaryTab,
            })}
            onIndexChange={index => this.setState({ index })}
            initialLayout={{ width: Dimensions.get('window').width }}
          />
        </ScrollView>

        <BBPasswordInput />
      </BBContainer>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  textHeader: {
    color: BBColors.BBBlue,
  },
  subtextHeader: {
    fontSize: 28,
    color: BBColors.Gray,
  },

  body: {
    marginBottom: 200,
  },
  box: {
    width: width,
  },
  titleBox: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
    textTransform: 'uppercase',
  },
  boxItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 2,
    flex: 1,
  },
  boxLegend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxItemFlexRow: {
    flexDirection: 'row',
  },
  textBoxItem1: {
    marginBottom: 10,
  },
  textBoxItem2: {
    fontSize: 22,
  },
  textLegend: {
    marginTop: 10,
    marginBottom: 5,
  },
  address: {
    flex: 0.9,
  },
  iconBtn: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerChart: {
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 30,
  },
  yellowBorder: {
    borderLeftColor: BBColors.Yellow,
    borderLeftWidth: 10,
  },
  containerObs: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  txtObs: {
    color: BBColors.Gray,
    textAlign: 'justify',
  },
});
