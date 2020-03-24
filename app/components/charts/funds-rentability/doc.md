
# FundsRentabilityPieChart

## Description

Pie chart that displays the rentability of each fund.
This chart will display the first 9 items. After the 9th, it will show a item called 'Outros' with the sum of the left items.

## Props

| Name  | Type              | Required | Default value | Description        |
| ----- | ----------------- | -------- | ------------- | ------------------ |
| data  | `Array<DataItem>` | `true`   | -             | An array of items. |
| title | `String`          | `true`   | -             | Chat's title.      |

### DataItem

| Name       | Type     | Required | Default value | Description                         |
| ---------- | -------- | -------- | ------------- | ----------------------------------- |
| fundName   | `String` | `true`   | -             | Name of the fund.                   |
| value      | `Float`  | `true`   | -             | Amount of money that this fund has. |
| yieldValue | `Float`  | `true`   | -             | How much this fund yielded.         |


## Usage example

```js
  ...

  render() {
    ...

    const CHART_DATA = [
      { fundName: 'Fix I', value: 562100.16, yieldValue: 39201.07 },
      { fundName: 'Premium I', value: 240900.04, yieldValue: 16803.03 },
      { fundName: 'Fix II', value: 15000.22, yieldValue: 603.89 },
      { fundName: 'Premium II', value: 178923.90, yieldValue: 17823.2 },
      { fundName: 'Fix III', value: 562100.16, yieldValue: 39201.07 },
      { fundName: 'Premium III', value: 240900.04, yieldValue: 16803.03 },
      { fundName: 'Premium IV', value: 240900.04, yieldValue: 16803.03 },
      { fundName: 'Fix IV', value: 175000.22, yieldValue: 603.89 },
      { fundName: 'Premium V', value: 1789203.90, yieldValue: 17823.2 },
      { fundName: 'Premium VI', value: 178923.90, yieldValue: 17823.2 },
    ]

    return (
      <FundsRentabilityPieChart data={CHART_DATA} title={'Meus Planos'}/>
    )
  ...
```