import { Header, DelegatesList } from 'components';
import { DelegatesProvider, WalletProvider } from 'contexts';
import { MainLayout } from 'layouts';
import React from 'react';

export const HomeContainer: React.FC = () => (
  <DelegatesProvider>
    <WalletProvider>
      <MainLayout>
        <Header />
        <DelegatesList />
      </MainLayout>
    </WalletProvider>
  </DelegatesProvider>
);
