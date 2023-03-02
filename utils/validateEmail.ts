export const validateEmail = (email: string) =>
  /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/gi.test(email);
