import { Flex } from '@chakra-ui/react';
import { THEME } from 'configs';
import React from 'react';

interface IMainLayout {
  children: React.ReactNode;
}

export const MainLayout: React.FC<IMainLayout> = ({ children }) => (
  <Flex
    flexDir="column"
    minH="100vh"
    backgroundColor={THEME.background}
    px={{ base: '0', lg: '120' }}
  >
    {children}
  </Flex>
);
