import { Icon, IconProps } from '@chakra-ui/react';

export const StatsIcon = (props: IconProps) => (
  <Icon display="flex" alignItems="center" justifyItems="center" {...props}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="16" fill="#F0EBFA" />
      <path
        d="M15.1667 18.5H11L16.8333 6.83337V13.5H21L15.1667 25.1667V18.5Z"
        fill="currentColor"
      />
    </svg>
  </Icon>
);
