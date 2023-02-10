export const removeHtmlTagWithRegex = (textToTransform: string) => {
  const regex = /(<([^>]+)>|\r|\n)/gi;
  return textToTransform.replace(regex, ' ');
};
