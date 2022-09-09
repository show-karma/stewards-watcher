import { Flex } from '@chakra-ui/react';
import { Header, DelegatesList } from 'components';
import { DelegatesProvider } from 'contexts';
import { MainLayout } from 'layouts';
import React from 'react';

export const HomeContainer: React.FC = () => (
  <DelegatesProvider>
    <MainLayout>
      <Header />
      <DelegatesList />
    </MainLayout>
  </DelegatesProvider>
);
