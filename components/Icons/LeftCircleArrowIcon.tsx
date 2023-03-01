/* eslint-disable id-length */
import { Icon, IconProps } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { IoMdArrowDropleftCircle } from 'react-icons/io';

export const LeftCircleArrowIcon = (props: IconProps) => {
  const { theme } = useDAO();
  return (
    <Icon {...props}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="6"
          cy="6"
          r="6"
          transform="rotate(-90 6 6)"
          fill={theme.card.text.primary}
        />
        <path
          opacity="0.5"
          transform="rotate(-180 6 6)"
          d="M2.45 6.25981C2.25 6.14434 2.25 5.85566 2.45 5.74019L7.55 2.79571C7.75 2.68024 8 2.82457 8 3.05551L8 8.94449C8 9.17543 7.75 9.31976 7.55 9.20429L2.45 6.25981Z"
          fill={theme.card.background}
        />
      </svg>
    </Icon>
  );
};
