/**
 * Página Home do módulo Metas.
 *
 */
import React, { PureComponent } from 'react';
import { View, Dimensions } from 'react-native';
import { BBColors, BBContainer, BBNavigationHeader, BBText, BBImage, BBButton } from 'mov-react-native-ui';
import GoalDataSource from '../model/GoalConstants';

const { width, height } = Dimensions.get('window');

export default class GoalDetail extends PureComponent {
  static navigationOptions = {
    header: false,
  };

  constructor(props) {
    super(props);
    this.goal = this.props.navigation.state.params.goal;
    const pickerValues = GoalDataSource.getGoalPickerValues();
    this.numeroPrazoPermanenciaPlanoLabel = pickerValues[this.goal.numeroPrazoPermanenciaPlano].label;

    this.colors = BBColors.CurrentTheme;
    const { navigation } = this.props;
    titleNavigation = navigation.getParam('titleNavigation', this.goal.nomeObjetivoPlanoInvestimento);
  }

  navigateToEditScreen = () => {
    const { navigate } = this.props.navigation;
    navigate('GoalEditScene', {
      goal: this.props.navigation.state.params.goal,
    });
  };

  render() {
    return (
      <BBContainer style={{ backgroundColor: BBColors.CurrentTheme.Default_Background }} safebarTemplate={BBContainer.SAFE_AREA_TEMPLATE.SAFE_AREA_TEMPLATE_ONLY_NAVIGATION}>
        <BBNavigationHeader title={titleNavigation} centerTitle navigation={this.props.navigation} />
        <BBImage style={{ width, height: height - 550 }} source={this.goal.image} />
        <View
          style={{
            position: 'absolute',
            top: height - 510,
            width,
            height: 30,
            left: width - 170,
            flex: 1,
            backgroundColor: '#1466ac',
          }}
        >
          <BBText
            style={{
              flex: 1,
              top: 5,
              textAlign: 'justify',
              marginLeft: 10,
              color: '#fff',
              backgroundColor: 'rgba(0, 0, 0, 0)',
            }}
          >
            {this.goal.nomePersonalizadoContrato}
          </BBText>
        </View>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <BBText
              style={{
                top: 20,
                height: 40,
                flex: 1,
                textAlign: 'left',
                marginLeft: 10,
              }}
            >
              Minha meta
            </BBText>
            <BBText
              style={{
                top: 20,
                height: 40,
                flex: 1,
                textAlign: 'left',
                marginLeft: 10,
              }}
            >
              {this.goal.valorObjetivoRentabilidadeContrato}
            </BBText>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <BBText
              style={{
                top: 20,
                height: 40,
                flex: 1,
                textAlign: 'left',
                marginLeft: 10,
              }}
            >
              Tempo estimado
            </BBText>
            <BBText
              style={{
                top: 20,
                height: 40,
                flex: 1,
                textAlign: 'left',
                marginLeft: 10,
              }}
            >
              {this.numeroPrazoPermanenciaPlanoLabel}
            </BBText>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <BBText
              style={{
                top: 10,
                height: 40,
                flex: 1,
                textAlign: 'left',
                marginLeft: 10,
              }}
            >
              Investimento inicial
            </BBText>
            <BBText
              style={{
                top: 10,
                height: 40,
                flex: 1,
                textAlign: 'left',
                marginLeft: 10,
              }}
            >
              {this.goal.valorAplicacaoInicioInvestimento}
            </BBText>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <BBText
              style={{
                flex: 1,
                textAlign: 'left',
                marginLeft: 10,
              }}
            >
              Investimento mensal
            </BBText>
            <BBText
              style={{
                flex: 1,
                textAlign: 'left',
                marginLeft: 10,
              }}
            >
              {this.goal.valorAdicionalInvestimento}
            </BBText>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <BBText
              style={{
                flex: 1,
                textAlign: 'left',
                marginLeft: 10,
              }}
            >
              Quanto vou investir
            </BBText>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <BBText
              style={{
                flex: 1,
                textAlign: 'left',
                marginLeft: 10,
              }}
            >
              Total médio projetado
            </BBText>
            <BBText
              style={{
                flex: 1,
                textAlign: 'left',
                marginLeft: 10,
              }}
            >
              20.714,00
            </BBText>
          </View>
        </View>
        <BBText style={ViewDescription.viewTextRodape} adjustsFontSizeToFit minimumFontScale={0.7}>
          *Rendimentos passados não são garantia de lucros futuros
        </BBText>
        <View behavior="padding">
          <BBButton secondary full title="ALTERAR DADOS" onPress={this.navigateToEditScreen} />

          <BBButton primary full title="MOSTRAR INVESTIMENTOS" onPress={this.onNextScreenPressed} />
        </View>
      </BBContainer>
    );
  }
}

const ViewDescription = {
  viewTextRodape: {
    position: 'absolute',
    top: height - 120,
    textAlign: 'center',
    width,
  },

  viewIcon: {
    height: 30,
    width: 30,
  },

  viewContainer: {
    flexDirection: 'row',
    height: 100,
    padding: 20,
  },
};
