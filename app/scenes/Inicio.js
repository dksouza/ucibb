import React, { PureComponent } from 'react';
import GoalWidget from '../widgets/GoalWidget';

export default class GoalCreate extends PureComponent {
  static navigationOptions = {
    header: false,
  };

  /**
   * @method renderItem - renderiza os cards
   * @description pega o item de cada card e renderiza colocando o efeito do parallax
   */
  render() {
    return <GoalWidget loadOnCreate="true" {...this.props} />;
  }
}
