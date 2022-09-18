import moment from 'moment';

export const formatDate = (dateToFormat: string) =>
  moment(dateToFormat).format('MM/DD/YYYY');
