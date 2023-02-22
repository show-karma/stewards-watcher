import { Flex, FlexProps } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import React, { ReactNode, useEffect } from 'react';
import { hotjar } from 'react-hotjar';

interface IMainLayout extends FlexProps {
  children: ReactNode;
}

export const MainLayout: React.FC<IMainLayout> = ({ children, ...rest }) => {
  const { theme } = useDAO();

  useEffect(() => {
    hotjar.initialize(3358140, 6);
  }, []);

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
