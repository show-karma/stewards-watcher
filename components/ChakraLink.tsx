import { LinkProps, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FC } from 'react';

export const ChakraLink: FC<LinkProps> = ({ children, href, ...rest }) => (
  <NextLink href={href || '/'} passHref>
    <Link
      isExternal={href?.includes('http') || href?.includes('https')}
      {...rest}
    >
      {children}
    </Link>
  </NextLink>
);
