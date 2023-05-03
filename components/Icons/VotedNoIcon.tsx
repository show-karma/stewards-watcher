import { Icon, IconProps } from '@chakra-ui/react';

export const VotedNoIcon = (props: IconProps) => (
  <Icon display="flex" alignItems="center" justifyItems="center" {...props}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.5 14.5L11.993 12M11.993 12L14.5 9.5M11.993 12L9.5 9.5M11.993 12L14.5 14.5M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 13.821 2.487 15.53 3.338 17L2.5 21.5L7 20.662C8.51954 21.5411 10.2445 22.0027 12 22Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </Icon>
);
