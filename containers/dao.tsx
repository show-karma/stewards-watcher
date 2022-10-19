import { DelegatesProvider, useDAO, WalletProvider } from 'contexts';
import { MainLayout } from 'layouts';
import Head from 'next/head';
import React from 'react';
import { RainbowWrapper, Header, DelegatesList, HeaderHat } from 'components';
import { Flex } from '@chakra-ui/react';

export const DAOContainer: React.FC = () => {
  const { daoInfo, theme } = useDAO();
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
              content={`Karma - ${config.DAO} delegate dashboard`}
              key="ogsitename"
            />
            <meta
              property="og:title"
              content={`Active delegates of ${config.DAO}`}
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
          <Flex
            w="full"
            flexDir="column"
            align="center"
            bgColor={theme.background}
          >
            <HeaderHat />
            <MainLayout>
              <Header />
              <DelegatesList />
            </MainLayout>
          </Flex>
        </WalletProvider>
      </DelegatesProvider>
    </RainbowWrapper>
  );
};
