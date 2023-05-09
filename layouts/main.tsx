import { Flex, FlexProps } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect } from 'react';
import { hotjar } from 'react-hotjar';

interface IMainLayout extends FlexProps {
  children: ReactNode;
}

export const MainLayout: React.FC<IMainLayout> = ({ children, ...rest }) => {
  const { theme, daoInfo } = useDAO();

  useEffect(() => {
    hotjar.initialize(3358140, 6);
  }, []);

  const router = useRouter();

  const isHome =
    router.pathname === '/_sites/[site]' ||
    router.pathname.includes('/_sites/[site]/profile');

  return (
    <Flex
      flexDir="column"
      minH="100vh"
      backgroundColor={theme.bodyBg}
      boxShadow={theme.bodyShadow}
      align="center"
      px={{ base: 0, lg: '8' }}
      zIndex="1"
      mt={daoInfo.config.HEADER_MARGIN && isHome ? '6' : '0'}
      borderTopRadius={daoInfo.config.HEADER_MARGIN && isHome ? 'xl' : 'none'}
      {...rest}
    >
      {children}
    </Flex>
  );
};
