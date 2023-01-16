import numbro from 'numbro';

export const formatNumber = (numberToFormat: number) =>
  numbro(numberToFormat).format({
    thousandSeparated: true,
    average: true,
    mantissa: 2,
    trimMantissa: true,
  });

export const formatNumberPercentage = (numberToFormat: number) =>
  numberToFormat > 0.01
    ? `${formatNumber(+numberToFormat.toFixed(2))}%`
    : '< 0.01%';
