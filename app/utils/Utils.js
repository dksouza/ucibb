import { StyleSheet } from 'react-native';

const units = ['K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

export class NumberUtils {
  static formatWithMultiplierSuffix(value) {
    if (!value || value < 1000) {
      return value;
    }
    for (let i = 0; i < units.length; i += 1) {
      const divisor = 1000 ** (i + 1);
      const result = value / divisor;
      if (result < 1000) {
        return parseFloat(result.toFixed(1)) + units[i];
      }
    }
    return value;
  }
}
export class StringUtils {
  static asNumber(value, divisor = ',') {
    let number = 0.0;
    if (value && typeof value === 'string') {
      const regex = new RegExp(`[^- ^\\d  ${divisor}]`, 'g'); // /[^- ^\d ,]/g
      number = parseFloat(value.replace(regex, '').replace(',', '.'));
    }
    return number;
  }
}

const blueBackgroundOptions = [1, 6];
export class ViewUtils {
  static getBackgroundColor(code) {
    return blueBackgroundOptions.includes(code) ? styles.blueBackground : styles.greenBackground;
  }
}

const styles = StyleSheet.create({
  greenBackground: {
    backgroundColor: 'rgba(51, 94, 43, 0.82)',
  },
  blueBackground: {
    backgroundColor: 'rgba(20, 102, 172, 0.82)',
  },
});
