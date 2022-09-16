import { Flex } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import React from 'react';

interface IMainLayout {
  children: React.ReactNode;
}

export const MainLayout: React.FC<IMainLayout> = ({ children }) => {
  const { daoInfo } = useDAO();
  const { theme } = daoInfo;

  return (
    <Flex
      flexDir="column"
      minH="100vh"
      backgroundColor={theme.background}
      px={{ base: '0', lg: '120' }}
    >
      {children}
    </Flex>
  );
};
