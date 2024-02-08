import numbro from 'numbro';

export const formatNumber = (numberToFormat: number | string) => {
  const language = numbro.languageData('en-US');
  language.abbreviations = {
    ...language.abbreviations,
    million: 'M',
    billion: 'B',
    trillion: 'T',
  };

  // Set the modified language
  numbro.registerLanguage(language, true);

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

  // as numbro doesn't support force category, we need to do it manually
  const getForceAverage = (numberToForce: number) => {
    if (numberToForce < 1000000) return 'thousand';
    if (numberToForce < 1000000000) return 'million';
    if (numberToForce < 1000000000000) return 'billion';
    if (numberToForce < 1000000000000000) return 'trillion';
    return 'thousand';
  };

  if (number < 1000) {
    return numbro(numberToFormat).format({
      mantissa: 2,
      trimMantissa: true,
    });
  }

  return numbro(numberToFormat).format({
    mantissa: 2,
    trimMantissa: true,
    average: +number >= 1000,
    forceAverage: getForceAverage(+number),
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

export const formatSimpleNumber = (
  numberToFormat: number | string,
  format?: numbro.Format
) => {
  if (numberToFormat === '-') return '-';
  if (numberToFormat === '0' || +numberToFormat === 0) return '0';

  return numbro(numberToFormat).format({
    mantissa: 2,
    trimMantissa: true,
    ...format,
  });
};
