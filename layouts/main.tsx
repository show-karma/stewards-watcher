import { Flex, FlexProps } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import React, { ReactNode } from 'react';

interface IMainLayout extends FlexProps {
  children: ReactNode;
}

export const MainLayout: React.FC<IMainLayout> = ({ children, ...rest }) => {
  const { theme } = useDAO();

  return (
    <Flex
      flexDir="column"
      minH="100vh"
      backgroundColor={theme.bodyBg}
      boxShadow={theme.bodyShadow}
      align="center"
      px={{ base: 0, lg: '20' }}
      zIndex="1"
      {...rest}
    >
      {children}
    </Flex>
  );
};
