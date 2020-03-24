import { AppRegistry } from 'react-native';
import React, { PureComponent } from 'react';
import { BBNavigationManager } from 'mov-react-native-ui';
import Scenes from './app/navigator/Scenes';

const packageJson = require('./package.json');

export default class RootComponent extends PureComponent {
  render() {
    return <BBNavigationManager scenes={Scenes} moduleName={packageJson.name} isNewBundle {...this.props} />;
  }
}

console.disableYellowBox = true;

AppRegistry.registerComponent('mov-rn-assessoria-investimentos', () => RootComponent);
