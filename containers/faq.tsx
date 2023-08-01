import {
  DelegatesProvider,
  GovernanceVotesProvider,
  HandlesProvider,
  useDAO,
  WalletProvider,
} from 'contexts';
import { MainLayout } from 'layouts';
import Head from 'next/head';
import React from 'react';
import { RainbowWrapper, HeaderHat, FAQPage } from 'components';
import { Flex } from '@chakra-ui/react';
import Script from 'next/script';
import { AuthProvider } from 'contexts/auth';

export const FAQContainer: React.FC = () => {
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;

  return (
    <>
      <Head>
        <title>{config.METATAGS.TITLE}</title>
        <meta name="description" content={config.METATAGS.DESCRIPTION} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={config.METATAGS.URL} key="ogurl" />
        <meta
          property="og:image"
          content={config.METATAGS.IMAGE_DISCORD}
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
        <meta property="twitter:title" content={config.METATAGS.DESCRIPTION} />
        <meta
          property="twitter:description"
          content={config.METATAGS.DESCRIPTION}
        />
        <meta
          property="twitter:image"
          content={config.METATAGS.IMAGE_TWITTER}
        />
      </Head>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${config.DAO_GTAG}`}
        // eslint-disable-next-line no-console
        onLoad={() => console.log('GTAG code setup')}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        // eslint-disable-next-line no-console
        onLoad={() => console.log('Google-Analytics code setup')}
      >
        {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
  
                gtag('config', '${config.DAO_GTAG}');`}
      </Script>
      <RainbowWrapper>
        <DelegatesProvider ignoreAutoFetch>
          <WalletProvider>
            <GovernanceVotesProvider>
              <AuthProvider>
                <HandlesProvider>
                  <Flex
                    w="full"
                    flexDir="column"
                    align="center"
                    bg={theme.background}
                  >
                    <HeaderHat />
                    <MainLayout px="0" w="full">
                      <FAQPage />
                    </MainLayout>
                  </Flex>
                </HandlesProvider>
              </AuthProvider>
            </GovernanceVotesProvider>
          </WalletProvider>
        </DelegatesProvider>
      </RainbowWrapper>
    </>
  );
};
