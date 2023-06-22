import { Icon, IconProps } from '@chakra-ui/react';

export const CloseMenuIcon = (props: IconProps) => (
  <Icon display="flex" alignItems="center" justifyItems="center" {...props}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_209_1478)">
        <path
          d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_209_1478">
          <rect width="24" height="24" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  </Icon>
);
