import humanFormat from 'human-format';

export const formatNumber = (numberToFormat: number) =>
  humanFormat(numberToFormat, {
    maxDecimals: 2,
    separator: '',
  });

export const formatNumberPercentage = (numberToFormat: number) =>
  numberToFormat > 0.01 ? `${+numberToFormat.toFixed(2)}%` : '< 0.01%';
