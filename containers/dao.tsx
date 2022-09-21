import { DelegatesProvider, useDAO, WalletProvider } from 'contexts';
import { MainLayout } from 'layouts';
import Head from 'next/head';
import React from 'react';
import { RainbowWrapper, Header, DelegatesList } from 'components';

export const DAOContainer: React.FC = () => {
  const { daoInfo } = useDAO();
  const { config } = daoInfo;

  return (
    <RainbowWrapper>
      <DelegatesProvider>
        <WalletProvider>
          <Head>
            <title>{config.METATAGS.TITLE}</title>
            <meta name="description" content={config.METATAGS.DESCRIPTION} />

            <meta property="og:type" content="website" />
            <meta property="og:url" content={config.METATAGS.URL} key="ogurl" />
            <meta
              property="og:image"
              content={config.METATAGS.IMAGE}
              key="ogimage"
            />
            <meta
              property="og:site_name"
              content={config.METATAGS.DESCRIPTION}
              key="ogsitename"
            />
            <meta
              property="og:title"
              content={config.METATAGS.DESCRIPTION}
              key="ogtitle"
            />
            <meta
              property="og:description"
              content={config.METATAGS.DESCRIPTION}
              key="ogdesc"
            />
            <link rel="icon" href={config.METATAGS.FAVICON} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={config.METATAGS.URL} />
            <meta
              property="twitter:title"
              content={config.METATAGS.DESCRIPTION}
            />
            <meta
              property="twitter:description"
              content={config.METATAGS.DESCRIPTION}
            />
            <meta property="twitter:image" content={config.METATAGS.IMAGE} />
          </Head>
          <MainLayout>
            <Header />
            <DelegatesList />
          </MainLayout>
        </WalletProvider>
      </DelegatesProvider>
    </RainbowWrapper>
  );
};
