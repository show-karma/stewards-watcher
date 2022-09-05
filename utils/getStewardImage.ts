import { GENERAL } from 'configs';
import makeBlockie from 'ethereum-blockies-base64';

export const getStewardImage = (address: string) => {
  const userImageBySnapshot = `${GENERAL.IMAGE_PREFIX_URL}${address}`;

  let image: string;
  try {
    const http = new XMLHttpRequest();
    http.open('HEAD', userImageBySnapshot, false);
    http.send();
    image = userImageBySnapshot;
  } catch (error) {
    image = makeBlockie(address);
  }

  return image;
};
