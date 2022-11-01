import moment from 'moment';

type IFormat = 'YYYY-MM-DD' | 'MMMM D, YYYY';

export const formatDate = (
  dateToFormat: string,
  format: IFormat = 'YYYY-MM-DD'
) => moment(dateToFormat).format(format);
