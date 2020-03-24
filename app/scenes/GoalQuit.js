import React, { PureComponent } from 'react';
import { BBColors, BBContainer, BBNavigationHeader } from 'mov-react-native-ui';

export default class GoalQuit extends PureComponent {
  static navigationOptions = {
    header: false,
  };

  constructor(props) {
    super(props);
    this.titleNavigation = 'Resgate';
  }

  render() {
    return (
      <BBContainer style={{ backgroundColor: BBColors.CurrentTheme.Default_Background }} safebarTemplate={BBContainer.SAFE_AREA_TEMPLATE.SAFE_AREA_TEMPLATE_ONLY_NAVIGATION}>
        <BBNavigationHeader title={this.titleNavigation} centerTitle navigation={this.props.navigation} />
      </BBContainer>
    );
  }
}
