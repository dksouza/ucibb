import React from 'react';
import { Dimensions, ScrollView, NativeModules } from 'react-native';
import { View } from 'native-base';
import { BBText, BBTouchable, BBIcon, BBBadge, BBColors } from 'mov-react-native-ui';
import { AnalyticsCentral } from 'mov-react-native-analytics';

import BaseWidget from './BaseWidget';
import { BBStyles, Styles } from '../style/widget.styles';
import GoalCard from '../components/GoalCard';
import GoalService from '../services/GoalServices';
import clientProfileService from '../services/clientProfileService';

const { width } = Dimensions.get('window');
let TAB_ITEM_NEW_GOAL = 0;
let TAB_ITEM_MY_GOALS = 1;
const { BBRNRenderer } = NativeModules;

export default class GoalWidget extends BaseWidget {
  constructor(props) {
    super(props);

    const gfpData = GoalWidget.getGFPData();
    const gfpDataGoals = GoalWidget.getGFPDataGoals();

    this.changeTab = this.changeTab.bind(this);
    this.renderGoalCard = this.renderGoalCard.bind(this);
    this.onClickCreateNewGoal = this.onClickCreateNewGoal.bind(this);
    this.loadWidgetData = this.loadWidgetData.bind(this);
    this.state = {
      loading: gfpData.loading,
      selectedTabIndex: TAB_ITEM_NEW_GOAL,
      goalsList: gfpData.goalsList,
      goals: gfpDataGoals.goals,
      clientProfile: gfpData.clientProfile,
      hasProfile: gfpData.hasProfile,
      errorMsg: gfpData.errorMsg,
    };
  }

  componentDidMount() {
    if (this.props.loadOnCreate) {
      this.loadWidgetData();
    }
  }
  componentWillUnmount() {
    TAB_ITEM_NEW_GOAL = 0;
    TAB_ITEM_MY_GOALS = 1;
  }

  loadWidgetData() {
    this.listClientGoals();
    this.checkProfileAndListInvestorProducts();
  }

  static getGFPDataGoals() {
    if (!this.gfpDataGoals) {
      this.gfpDataGoals = {};
      this.gfpDataGoals.goals = null;
    }

    return this.gfpDataGoals;
  }

  static getGFPData() {
    if (!this.gfpData) {
      this.gfpData = {};
      this.gfpData.goalsList = null;
      this.gfpData.clientProfile = undefined;
      this.gfpData.hasProfile = false;
      this.gfpData.errorMsg = null;
      this.gfpData.loading = true;
    }

    return this.gfpData;
  }

  static setGFPData(newGFPData) {
    this.gfpData = newGFPData;
  }

  static setGFPDataGoals(newGFPData) {
    this.gfpDataGoals = newGFPData;
  }

  async listClientGoals() {
    const goals = await GoalService.listClientGoals();
    const gfpDataGoals = {
      goals,
    };
    if (goals.length > 0) {
      TAB_ITEM_NEW_GOAL = 1;
      TAB_ITEM_MY_GOALS = 0;
    }
    GoalWidget.setGFPDataGoals(gfpDataGoals);
    this.setState(gfpDataGoals);
  }

  async checkProfileAndListInvestorProducts() {
    clientProfileService(
      async clientProfile => {
        let goalsList = [];
        if (clientProfile.hasProfile) {
          goalsList = await GoalService.listInvestorProducts(clientProfile.codigoTipoPerfil, clientProfile.codigoPerfilInvestidor);
        }
        const gfpData = {
          goalsList,
          clientProfile,
          hasProfile: clientProfile.hasProfile,
          errorMsg: undefined,
          loading: false,
        };
        GoalWidget.setGFPData(gfpData);
        this.setState(gfpData);
      },
      () => {
        this.setState({ errorMsg: e.message, loading: false });
      },
    );
  }

  renderContent() {
    if (this.state.selectedTabIndex === TAB_ITEM_NEW_GOAL) {
      cards = this.state.goalsList.map(goal => <GoalCard key={goal.codigoObjetivoPlanoInvestimento} goal={goal} itemWidth={120} onPress={this.onClickCreateNewGoal} />);
    } else {
      cards =
        this.state.goals.length !== 0 ? (
          this.state.goals.map(goal => <GoalCard key={goal.codigoContratoAssessoriaInvestimento} goal={goal} itemWidth={120} onPress={this.onClickShowGoalDetails} />)
        ) : (
          <View style={{ height: 90 }} />
        );
    }
    return (
      <View bottomBorder>
        {this.state.errorMsg ? (
          <View widgetCell>{this.renderRetry()}</View>
        ) : (
          <View widgetCell>
            {this.mountHeader()}
            {this.state.hasProfile && this.state.selectedTabIndex === TAB_ITEM_NEW_GOAL && (
              <ScrollView contentContainerStyle={{ marginTop: 20 }} horizontal showsHorizontalScrollIndicator={false}>
                {cards}
              </ScrollView>
            )}
            {this.state.hasProfile && this.state.selectedTabIndex !== TAB_ITEM_NEW_GOAL && (
              <ScrollView contentContainerStyle={{ marginTop: 20 }} horizontal showsHorizontalScrollIndicator={false}>
                {cards}
              </ScrollView>
            )}
            {!this.state.hasProfile && this.createPerfil()}
            <View widgetButton>{this.mountFooter()}</View>
          </View>
        )}
        {!this.state.hasProfile && (
          <BBTouchable type="opacity" onPress={this.createPerfilRender}>
            <View widgetButton>
              <View style={[BBStyles.row, BBStyles.justified, BBStyles.widgetFooter]}>
                <BBText small bold>
                  RESPONDER AGORA
                </BBText>
                <BBIcon selected name="chevron" size={24} />
              </View>
            </View>
          </BBTouchable>
        )}
      </View>
    );
  }

  mountHeader() {
    if (this.state.goals.length > 0) {
      return (
        <View style={[BBStyles.rowFlow]}>
          {this.mountTabItem(TAB_ITEM_MY_GOALS, 'MINHAS METAS')}
          {this.mountTabItem(TAB_ITEM_NEW_GOAL, 'NOVA META')}
        </View>
      );
    }
    return <View style={[BBStyles.rowFlow]}>{this.mountTabItem(TAB_ITEM_NEW_GOAL, 'NOVA META')}</View>;
  }

  createPerfil() {
    return (
      <View>
        <BBText
          style={{
            textAlign: 'center',
            alignSelf: 'center',
            marginLeft: 25,
            marginRight: 25,
            marginTop: 25,
          }}
        >
          Ops! Conte-nos um pouco mais sobre seu perfil de investimento antes de continuar
        </BBText>
      </View>
    );
  }

  createPerfilRender = () => {
    AnalyticsCentral.getInstance().sendFabricEvent('Widgets x Centrais', { Ação: 'Widget - Metas - Questionário' });
    BBRNRenderer.execute('tela/ResponderQuestionario/entrada', null);
  };

  mountTabItem(selectedTabIndex, tabName) {
    const isSelected = this.state.selectedTabIndex === selectedTabIndex;
    const bottomBorder = isSelected ? { highlightBottomBorder: true } : { bottomBorder: true };
    const textStyle = isSelected ? { opacity: 1.0 } : {};

    return (
      <View {...bottomBorder} style={{ flex: 1 }}>
        <BBTouchable type="opacity" style={{ flex: 1, alignItems: 'center', padding: 16 }} onPress={() => this.changeTab(selectedTabIndex)}>
          <BBText badge={isSelected} smallTitle style={textStyle}>
            {tabName}
          </BBText>
        </BBTouchable>
      </View>
    );
  }

  mountFooter() {
    const buttonText = this.state.selectedTabIndex === TAB_ITEM_NEW_GOAL ? 'CRIAR META' : 'VISUALIZAR MINHAS METAS';
    const callback = this.state.selectedTabIndex === TAB_ITEM_NEW_GOAL ? this.onClickCreateNewGoal.bind(this) : this.onClickShowGoalDetails.bind(this);
    const showBadge = this.state.selectedTabIndex === TAB_ITEM_MY_GOALS && this.state.goals && this.state.goals.length > 0;

    return (
      <View widgetButton>
        {this.state.hasProfile && <View style={{ height: 5, width, backgroundColor: BBColors.CurrentTheme.Default_Background }} />}
        {this.state.hasProfile && (
          <BBTouchable type="opacity" onPress={callback}>
            <View style={[BBStyles.row, BBStyles.justified, BBStyles.widgetFooter]}>
              <BBText small bold>
                {buttonText}
              </BBText>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                {showBadge && <BBBadge value={this.state.goals.length} style={{ alignSelf: 'flex-end' }} />}
                <BBIcon selected name="chevron" size={24} style={{ alignSelf: 'center' }} />
              </View>
            </View>
          </BBTouchable>
        )}
      </View>
    );
  }

  changeTab(selectedTabIndex) {
    // if (selectedTabIndex === TAB_ITEM_NEW_GOAL || this.state.goals.length > 0) {
    this.setState({ loading: false, selectedTabIndex });
    // }
  }

  onClickShowGoalDetails = goal => {
    if (this.state.goals.length > 0) {
      this.navigateToScreen('MyGoalsScene', goal, this.state.goals);
    }
  };

  onClickCreateNewGoal(goal) {
    this.navigateToScreen('GoalCreateScene', goal, this.state.goalsList);
  }

  navigateToScreen(screen, selectedGoal, goals) {
    AnalyticsCentral.getInstance().sendFabricEvent('Widgets x Centrais', { Ação: 'Widget - Metas' });
    let selectedIndex = goals.indexOf(selectedGoal);
    if (selectedIndex === -1) selectedIndex = 0;

    const params = {
      selectedIndex,
      clientProfile: this.state.clientProfile,
      goals,
      screenID: 'METAS',
    };

    this.props.navigation.navigate(screen, { params });
  }

  renderGoalCard(item) {
    const color = item.index % 2 === 0 ? 'green' : 'black';
    return (
      <View style={{ padding: 30 }}>
        <View style={{ backgroundColor: color, height: 100 }} />
        <BBText small bold>
          Planejar uma viagem
        </BBText>
      </View>
    );
  }

  render() {
    return (
      <View style={[BBStyles.sessionBottomSpace]} importantForAccessibility="no-hide-descendants">
        <View style={[BBStyles.row, BBStyles.justified, BBStyles.sessionOptions]}>
          <BBText title style={Styles.optionTitle}>
            OBJETIVOS DE VIDA
          </BBText>
        </View>
        {this.loading(null, 'goalswidget')}
        {!this.state.loading && this.renderContent()}
      </View>
    );
  }
}
