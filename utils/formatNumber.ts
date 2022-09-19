import numbro from 'numbro';

export const formatNumber = (numberToFormat: number) =>
  numbro(numberToFormat).format({ thousandSeparated: true });
