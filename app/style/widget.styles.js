import { StyleSheet } from 'react-native';

const Styles = {
  alignCenter: {
    alignSelf: 'center',
  },
  textBold: {
    fontWeight: 'bold',
  },
  textYellow: {
    color: '#ffee02',
  },
  textWhite: {
    color: '#ffffff',
  },
  greetText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  stringAsImageText: {
    fontSize: 32,
  },
  sessionOptionName: {
    color: 'white',
    fontSize: 16,
  },
  summaryBaseText: {
    paddingBottom: 13,
    paddingTop: 20,
    flex: 1,
  },
  optionTitle: {
    marginBottom: 14,
  },
  summaryTextValue: {
    marginLeft: 6,
  },
  summaryTextLabel: {
    letterSpacing: 0.1,
  },
  idCardText: {
    fontSize: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  fs22: {
    fontSize: 22,
  },
  fs18: {
    fontSize: 18,
  },
  fs14: {
    fontSize: 14,
  },
  fs13: {
    fontSize: 13,
  },
  fs12: {
    fontSize: 12,
  },
  fs11: {
    fontSize: 11,
  },
  optionSubtext: {
    opacity: 0.7,
    paddingTop: 15,
    fontSize: 12,
  },
  lastSessionText: {
    alignSelf: 'center',
    opacity: 0.7,
    fontSize: 16,
    paddingTop: 45,
    paddingBottom: 45,
  },
  cardWidgetViewStyle: {
    width: 290,
    height: 182,
    backgroundColor: '#00569e',
    padding: 18,
    marginRight: 20,
    borderRadius: 8,
    flexDirection: 'column',
  },
  cardCentralViewStyle: {
    width: 290,
    height: 182,
    backgroundColor: '#00569e',
    padding: 18,
    borderRadius: 8,
    flexDirection: 'column',
  },
};

const BBStyles = StyleSheet.create({
  alignCenter: {
    alignSelf: 'center',
  },
  session: {
    flexDirection: 'column',
    paddingBottom: 20,
  },
  sessionTitle: {
    paddingTop: 10,
  },
  sessionBottomSpace: {
    marginBottom: 15,
  },
  sessionOptions: {
    marginTop: 25,
  },
  sessionOptionLine: {
    alignItems: 'center',
  },
  sessionOptionIcon: {
    marginLeft: 20,
    color: '#ffee02',
  },
  sessionOptionNameBorder: {
    flex: 3,
    borderBottomWidth: 1,
    borderColor: '#0f66b3',
    marginLeft: 20,
    paddingVertical: 12,
  },
  sessionOptionNameClear: {
    flex: 3,
    marginLeft: 20,
    paddingVertical: 12,
  },
  widgetFooter: {
    padding: 10,
    alignItems: 'center',
  },
  row: {
    // height: box_height,
    paddingRight: 20,
    paddingLeft: 20,
    flexDirection: 'row',
  },
  rowFlow: {
    paddingRight: 0,
    paddingLeft: 0,
    flexDirection: 'row',
  },
  justified: {
    justifyContent: 'space-between',
  },

  col: {
    flex: 1,
    flexDirection: 'column',
  },
  verticalLine: {
    backgroundColor: ' rgba(0, 0, 0, 0.12)',
    width: 1,
    marginRight: 20,
  },
  header: {
    paddingTop: 40,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  centralsPlainHeader: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  messageBubble: {
    width: 26,
    height: 26,
    right: 0,
  },
  greet: {
    paddingTop: 30,
    // paddingBottom: 20,
  },
  stringAsImageMargins: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stringAsImageBackground: {
    backgroundColor: '#0660b0',
  },
  otherOptions: {
    opacity: 0.5,
    color: '#fff',
    // resizeMode: 'contain',
    marginTop: 2,
  },
  idCard: {
    width: 110,
  },
  idImage: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 2,
  },
  tabsRow: {
    marginBottom: 16,
  },
  optionTitle: {
    marginBottom: 14,
  },
  cardRow: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  borderBottom: {},
  brightYellow: {
    color: '#ffee02',
  },
  baseText: {
    color: 'white',
    fontSize: 16,
  },
  textBold: {
    fontWeight: 'bold',
  },
  textYellow: {
    color: '#ffee02',
  },
  textWhite: {
    color: '#ffffff',
  },
  greetText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  sessionTitleText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.56)',
  },
  sessionOptionName: {
    color: 'white',
    fontSize: 16,
  },
  summaryBaseText: {
    paddingBottom: 13,
    paddingTop: 20,
    color: '#fff',
    flex: 1,
  },
  summaryTextValue: {
    marginLeft: 6,
  },
  summaryTextLabel: {
    color: 'rgba(255,255,255,0.56)',
    marginBottom: 15,
  },
  idCardText: {
    fontSize: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  fs22: {
    fontSize: 22,
  },
  fs18: {
    fontSize: 18,
  },
  fs14: {
    fontSize: 14,
  },
  fs13: {
    fontSize: 13,
  },
  fs12: {
    fontSize: 12,
  },
  fs11: {
    fontSize: 11,
  },
  cardWidgetViewStyle: {
    width: 292,
    height: 182,
    padding: 18,
    borderRadius: 8,
    flexDirection: 'column',
    marginRight: 20,
    borderColor: '#055aa5',
    borderWidth: 0.5,
  },
  cardCentralViewStyle: {
    width: 292,
    height: 182,
    backgroundColor: '#00569e',
    padding: 18,
    borderRadius: 8,
    flexDirection: 'column',
  },
  cardError: {
    flex: 1,
    height: 144,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 20,
    paddingLeft: 20,
  },
});

export { BBStyles, Styles };
