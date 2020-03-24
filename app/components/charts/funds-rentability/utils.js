import { BBColors } from 'mov-react-native-ui';

/**
 * Sum of all "value" property of data array.
 * @param {Array} data
 */
export function getTotalValue(data) {
  if (!data || !data.length) {
    return 0;
  }

  let total = 0;
  data.forEach(d => {
    total += d.value;
  });

  return total;
}

/**
 * Calculate the percentage of a value.
 * Return 0 if any parameter is invalid.
 * Round the result to two decimal numbers.
 * @param {Number} total
 * @param {Number} value
 */
export function getItemPercentage(total, value) {
  if (Number.isNaN(total) || Number.isNaN(value)) {
    return 0;
  }

  const num = (value / total) * 100;

  if (Number.isNaN(num)) {
    return 0;
  }
  // round to 2 decimals
  return +`${Math.round(`${num}e+2`)}e-2`;
}

export function getColor(index) {
  const colors = [
    BBColors.BBBlue,
    BBColors.Cyan,
    BBColors.Amber,
    BBColors.Pink,
    BBColors.Purple,
    BBColors.Orange,
    BBColors.Brown,
    BBColors.Lime,
    BBColors.Green,
    BBColors.Gray,
  ];

  return colors[index % colors.length];
}

/**
 * Format data items to be used in a pie chart
 * @param {Array} data
 */
export function mapDataToChart(data) {
  if (!data || !data.length) {
    return [];
  }

  const total = getTotalValue(data);

  const d = data
    .sort((a, b) => b.value - a.value)
    .reduce((acc, item, index) => {
      if (index >= 9) {
        acc[9] = {
          ...item,
          fundName: 'Outros',
          value: (acc[9] && acc[9].value ? acc[9].value : 0) + item.value,
          yieldValue:
            (acc[9] && acc[9].yieldValue ? acc[9].yieldValue : 0) +
            item.yieldValue,
        };
      } else {
        acc.push(item);
      }
      return acc;
    }, [])
    .map((item, index) => ({
      ...item,
      key: item.fundName,
      value: item.value,
      svg: { fill: getColor(index) },
      hexColor: getColor(index),
      percent: getItemPercentage(total, item.value),
    }));
  console.log(d);
  return d;
}
