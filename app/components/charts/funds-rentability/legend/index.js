import React from 'react';
import { View } from 'react-native';
import FundsRentabilityLegendItem from './legendItem';

type Props = {
  data: Array<{
    fundName: String,
    value: Number,
    yieldValue: Number,
  }>,
}

const FundsRentabilityLegend = (props: Props) => {
  const { data } = props;

  return (
    <View>
      {data.map((item, index) => (
        <FundsRentabilityLegendItem
          fundName={item.fundName}
          index={index}
          percent={item.percent}
          value={item.value}
          yieldValue={item.yieldValue}
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          accessibilityLabel={`Item descritivo do gráfico, index ${index}`}
        />
      ))}
    </View>
  );
};

export default FundsRentabilityLegend;
