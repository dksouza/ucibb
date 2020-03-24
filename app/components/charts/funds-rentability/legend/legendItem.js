import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StringUtil } from 'mov-react-native';
import { BBColors, BBBalance } from 'mov-react-native-ui';
import { getColor } from '../utils';
import FundPercentage from './fundPercentage';

type Props = {
  fundName: String,
  percent: Number,
  value: Number,
  index: Number,
}

const FundsRentabilityLegendItem = (props: Props) => {
  const {
    fundName, index, percent, value,
  } = props;
  const marginTop = index > 0 ? 15 : 0;

  return (
    <View style={[styles.container, { marginTop }]}>
      {/* colored ball */}
      <View style={styles.rightColumn}>
        <View style={[styles.ball, { backgroundColor: getColor(index) }]} />
      </View>
      <View style={styles.leftColumn}>
        <FundPercentage percent={percent} name={fundName} />
        <BBBalance
          showDollar
          regularText
        >
          {StringUtil.formatMoney(value)}
        </BBBalance>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 32,
  },
  rightColumn: {
    marginTop: 3,
  },
  leftColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
    marginLeft: 8,
  },
  ball: {
    width: 16,
    height: 16,
    borderRadius: 50,
  },
  value: {
    alignSelf: 'flex-end',
  },
  yieldLabel: {
    paddingTop: 0,
    color: BBColors.BlackSecondary,
  },
  yieldValue: {
    paddingTop: 0,
    color: BBColors.BlackSecondary,
    alignSelf: 'flex-end',
  },
});

export default FundsRentabilityLegendItem;
