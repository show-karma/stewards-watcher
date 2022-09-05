export const removeLinkPrefix = (url: string) => {
  const removeHttp = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');
  return removeHttp;
};
