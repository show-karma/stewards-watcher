import { useEffect, useState } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Img, ImgProps } from '@chakra-ui/react';

interface Props extends ImgProps {
  fallback?: string;
}
/**
 * Image component to avoid possible not handled error on image path
 */
export const ImgWithFallback = ({
  fallback = 'Steward',
  src,
  ...props
}: Props) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [canLoad, setCanLoad] = useState(false);

  const avatarIcon = makeBlockie(fallback);

  const onError = () => {
    setImgSrc(avatarIcon);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanLoad(true);
    }
  }, []);

  return canLoad ? (
    // eslint-disable-next-line @next/next/no-img-element
    <Img src={imgSrc || avatarIcon} onError={onError} alt="" {...props} />
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>
  );
};
