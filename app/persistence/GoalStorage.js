import { AsyncStorage } from 'react-native';
import { goalImages } from '../model/GoalConstants';

const GOALS_STORE = '@GOALS_STORE:';
const CLIENT_PROFILE_KEY = 'CLIENT_PROFILE';
const GOALS_CARDS_KEY = 'GOALS_CARDS';
const MY_GOALS_KEY = 'MY_GOALS';

export default class GoalStorage {
  static async getCards() {
    const rsp = await AsyncStorage.getItem(`${GOALS_STORE}${GOALS_CARDS_KEY}`);
    const cards = JSON.parse(rsp);
    cards.map(item => Object.assign(item, { image: goalImages[item.codigoObjetivoPlanoInvestimento - 1] || goalImages[1] }));
    return cards;
  }

  static async getProfile() {
    const rsp = await AsyncStorage.getItem(`${GOALS_STORE}${CLIENT_PROFILE_KEY}`);
    return rsp;
  }

  static async getMyGoals() {
    const rsp = await AsyncStorage.getItem(`${GOALS_STORE}${MY_GOALS_KEY}`);
    return rsp;
  }

  static async setInvestmentProducts(products) {
    await AsyncStorage.setItem(`${GOALS_STORE}${GOALS_CARDS_KEY}`, JSON.stringify(products));
  }

  static async setClientGoals(goals) {
    await AsyncStorage.setItem(`${GOALS_STORE}${MY_GOALS_KEY}`, JSON.stringify(goals));
  }
}
