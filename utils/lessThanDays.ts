import moment from 'moment';

// using momentjs to compare dates and if that date is less than the number of days passed in
export const lessThanDays = (date: string, days: number) => {
  const now = moment();
  const then = moment(new Date(date));

  return then.isAfter(now.subtract(days, 'days'));
};
