import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BBPieChart } from 'mov-react-native-ui';
import { mapDataToChart } from './utils';
import FundsRentabilityLegend from './legend';

export type DataItemProps = {
  fundName: String,
  value: Number,
  yieldValue: Number,
};

type Props = {
  data: Array<DataItemProps>,
  title: String,
};

const FundsRentabilityPieChart = (props: Props) => {
  const { data, title } = props;
  const formattedData = mapDataToChart(data);
  console.log(formattedData);

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <BBPieChart innerLabel={(title || '').toUpperCase()} showInnerTotal showCurrencySymbol data={formattedData} accessibilityLabel={title && `${title}`} />
      </View>
      <FundsRentabilityLegend data={formattedData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default FundsRentabilityPieChart;
