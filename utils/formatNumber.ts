import numbro from 'numbro';

export const formatNumber = (numberToFormat: number | string) => {
  if (numberToFormat === '-') return '-';
  if (numberToFormat === '0' || +numberToFormat === 0) return '0';
  if (+numberToFormat <= 1) {
    const formattedNumber = numbro(numberToFormat).format({
      mantissa: 2,
      trimMantissa: true,
    });
    if (formattedNumber === 'NaN' || formattedNumber === '0') {
      return '< 0.01';
    }
    return numbro(numberToFormat).format({
      mantissa: 2,
      trimMantissa: true,
    });
  }
  const number = Number.isNaN(+numberToFormat) ? 0 : +numberToFormat;
  if (typeof numberToFormat === 'string') {
    return numbro(numberToFormat).format({
      mantissa: 2,
      trimMantissa: true,
      average: +number >= 1000,
    });
  }
  return numbro(numberToFormat).format({
    mantissa: 2,
    trimMantissa: true,
    average: +number >= 1000,
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
