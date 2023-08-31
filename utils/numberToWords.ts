const ONES = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

export const numberToWords = (number: number) => {
  if (number < 10) {
    return ONES[number];
  }
  return number.toString();
};
