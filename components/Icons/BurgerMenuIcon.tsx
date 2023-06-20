import { Icon, IconProps } from '@chakra-ui/react';

export const BurgerMenuIcon = (props: IconProps) => (
  <Icon display="flex" alignItems="center" justifyItems="center" {...props}>
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 4.83228H21V6.83228H3V4.83228ZM3 11.8323H21V13.8323H3V11.8323ZM3 18.8323H21V20.8323H3V18.8323Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);
