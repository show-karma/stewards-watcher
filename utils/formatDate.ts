export const formatDate = (dateToFormat: string) =>
  new Date(dateToFormat).toISOString().split('T')[0];
