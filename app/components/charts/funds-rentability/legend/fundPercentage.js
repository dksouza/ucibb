import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BBText, BBColors } from 'mov-react-native-ui';

type Props = {
  percent: Number,
  name: String,
}

const FundPercentage = (props: Props) => {
  const { percent, name } = props;

  return (
    <View style={styles.fundContainer}>
      <BBText
        regular
        small
        style={styles.percent}
        accessibilityLabel={`Porcentagem que esse fundo ocupa no gráfico é de
 ${percent} porcentos`}
      >
        {percent}%
      </BBText>
      <BBText
        small
        style={styles.fund}
        accessibilityLabel={`Nome do fundo: ${percent}`}
      >
        {name}
      </BBText>
    </View>
  );
};

const styles = StyleSheet.create({
  percent: {
    paddingTop: 0,
    color: BBColors.BlackSecondary,
    lineHeight: 24,
  },
  fundContainer: {
    flexDirection: 'row',
  },
  fund: {
    marginLeft: 4,
    paddingTop: 0,
    lineHeight: 24,
  },
});

export default FundPercentage;
