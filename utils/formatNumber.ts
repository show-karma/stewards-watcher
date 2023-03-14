import humanFormat from 'human-format';

export const formatNumber = (numberToFormat: number | string) => {
  if (typeof numberToFormat === 'string') {
    return humanFormat(+numberToFormat, {
      maxDecimals: 2,
      separator: '',
    });
  }
  return humanFormat(numberToFormat, {
    maxDecimals: 2,
    separator: '',
  });
};

export const formatNumberPercentage = (numberToFormat: number | string) => {
  if (typeof numberToFormat === 'string') {
    return +numberToFormat > 0.01
      ? `${(+numberToFormat).toFixed(2)}%`
      : '< 0.01%';
  }

  return numberToFormat > 0.01 ? `${+numberToFormat.toFixed(2)}%` : '< 0.01%';
};
