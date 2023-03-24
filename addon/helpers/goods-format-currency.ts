import Helper from '@ember/component/helper';

export default class GoodsFormatCurrency extends Helper {
  compute([value, currency = 'GBP', addSymbol = true]: [
    number,
    string,
    boolean
  ]): string {
    return formatCurrency(value, currency, addSymbol);
  }
}

export function formatCurrency(
  value: number,
  currency = 'GBP',
  addSymbol = true
): string {
  if (currency === 'GBP') {
    let formatted = (value / 100).toFixed(2).toString();
    if (addSymbol === true) {
      formatted = `£${formatted}`;
    }
    return formatted;
  }

  return value.toString();
}
