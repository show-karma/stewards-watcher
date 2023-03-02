import humanFormat from 'human-format';
import numbro from 'numbro';

export const formatNumber = (numberToFormat: number) =>
  humanFormat(numberToFormat, {
    maxDecimals: 2,
    separator: '',
  });

export const formatNumberPercentage = (numberToFormat: number) =>
  numberToFormat > 0.01 ? `${+numberToFormat.toFixed(2)}%` : '< 0.01%';

export const formatThousands = (numberToFormat: number) =>
  numbro(numberToFormat).format({
    spaceSeparated: false,
    mantissa: 2,
    average: true,
  });
