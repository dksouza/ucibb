import React, { PureComponent } from 'react';
import { ListView, ScrollView, View, Dimensions, StyleSheet, NativeModules } from 'react-native';
import { BBContainer, BBNavigationHeader, BBImage, BBIcon, BBText, BBButton, BBColors } from 'mov-react-native-ui';
import DecimalText from '../components/DecimalText';
import { ViewUtils } from '../utils/Utils';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 80;
const imageHeight = height * 0.25;
const labelHeight = (imageHeight * 0.85) + HEADER_HEIGHT;
const RESULT_STATUS = {
  PARTIALLY: { icon: 'interface-alert-circle', message: 'Algumas transações não foram realizadas', color: 'orange' },
  SUCCESS: { icon: 'check-circle-2', message: 'Transação realizada com sucesso', color: '#008725' },
};
export default class GoalResult extends PureComponent {
  static navigationOptions = {
    header: false,
  };

  constructor(props) {
    super(props);
    this.navigate = this.props.navigation.navigate;
    const { params } = this.props.navigation.state;
    this.isNewContribution = params.isNewContribution;
    this.investments = params.investments;
    this.goal = params.goal;
    this.titleNavigation = this.props.navigation.getParam('titleNavigation', 'Investir');
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(this.investments),
      resultStatus: RESULT_STATUS.SUCCESS,
    };
  }

  componentDidMount() {
    this.setResultStatus();
  }

  setResultStatus() {
    if (this.investments.some(e => e.textoNaoAplicacao !== '')) {
      this.setState({ resultStatus: RESULT_STATUS.PARTIALLY });
    }
  }

  closeBundle() {
    NativeModules.BBRNNavigation.closeBundleAndReloadWidget(() => {});
  }

  renderRow(item) {
    return (
      <View style={{ marginVertical: 6 }}>
        <View style={styles.itemContainer}>
          <View style={{ flex: 0.45, flexDirection: 'row', alignItems: 'center' }}>
            <BBIcon icon="file-document" size={22} color="#008725" />
            <BBText style={[styles.textContent, styles.textTitle]} numberOfLines={1} ellipsizeMode="tail">
              {item.nomeAtivoFinanceiroReduzidoAplicacao}
            </BBText>
          </View>
          <DecimalText
            tinyTitle
            value={Number(item.valorAplicacaoAtivoAplicacao)}
            integerFontSize={18}
            decimalFontSize={10}
            style={{ flex: 0.25, textAlign: 'right', alignSelf: 'flex-end' }}
          />
          <BBText style={[styles.textContent, { flex: 0.2 }]}>{item.dataInicioOperacaoAplicacao.split('.').join('/')}</BBText>
        </View>
        {item.textoNaoAplicacao !== '' && (
          <BBText bold style={[styles.textContent, { marginRight: 20, marginLeft: 48 }]}>
            {item.textoNaoAplicacao}
          </BBText>
        )}
      </View>
    );
  }

  render() {
    let saldoBBTextValue = 'Mantenha saldo em conta corrente para o débito';
    if (!this.isNewContribution) {
      saldoBBTextValue += ' dos valores agendados';
    }
    return (
      <BBContainer style={{ backgroundColor: BBColors.CurrentTheme.cardDefaultBg }} safebarTemplate={BBContainer.SAFE_AREA_TEMPLATE.SAFE_AREA_TEMPLATE_DEFAULT_BUTTON_SCREEN}>
        <BBNavigationHeader title={this.titleNavigation} centerTitle navigation={this.props.navigation} />
        <BBImage style={styles.image} source={this.goal.image} />
        <View style={[styles.imageLabelContainer, ViewUtils.getBackgroundColor(this.goal.codigoObjetivoPlanoInvestimento)]}>
          <BBText style={styles.imageLabel}>{this.goal.nomePersonalizadoContrato}</BBText>
        </View>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View
            style={{
              flex: 0.2,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <BBIcon icon={this.state.resultStatus.icon} size={28} style={{ color: this.state.resultStatus.color }} />
            <BBText style={[styles.textContent, { fontSize: 14, paddingLeft: 10 }]}>{this.state.resultStatus.message}</BBText>
          </View>
          <View style={styles.scrollviewContainer}>
            <BBText style={[styles.textContent, { alignSelf: 'flex-end', marginRight: 15, width: '15%' }]}>Débito</BBText>
            <ScrollView>
              <ListView dataSource={this.state.dataSource} renderRow={item => this.renderRow(item)} />
            </ScrollView>
          </View>
          <View style={{ flex: 0.3, justifyContent: 'flex-end' }}>
            <BBText style={[styles.textContent, styles.footerText]}>{saldoBBTextValue}</BBText>
            <BBButton primary full title="OK" onPress={this.closeBundle} />
          </View>
        </View>
      </BBContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 17,
    fontSize: 20,
  },
  image: {
    width,
    height: imageHeight,
  },
  imageLabel: {
    paddingLeft: 10,
    paddingRight: 21,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  imageLabelContainer: {
    position: 'absolute',
    top: labelHeight,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomView: {
    flex: 1,
    height: 50,
    position: 'absolute',
    bottom: 0,
  },
  MainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollviewContainer: {
    flex: 0.5,
    marginBottom: 15,
  },
  textContent: {
    fontSize: 12,
    letterSpacing: -0.3,
    color: '#727272',
  },
  footerText: {
    marginRight: 20,
    marginLeft: 40,
    marginBottom: 10,
    lineHeight: 20,
  },
  textTitle: {
    fontSize: 14,
    marginLeft: 5,
    marginRight: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
});
