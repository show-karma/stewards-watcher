import { Flex } from '@chakra-ui/react';
import { Header, StewardsList } from 'components';
import { StewardsProvider } from 'contexts';
import { MainLayout } from 'layouts';
import React from 'react';

export const HomeContainer: React.FC = () => (
  <StewardsProvider>
    <MainLayout>
      <Header />
      <StewardsList />
    </MainLayout>
  </StewardsProvider>
);
