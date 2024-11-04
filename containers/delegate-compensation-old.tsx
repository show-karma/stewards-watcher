/* eslint-disable no-console */
import { Flex } from '@chakra-ui/react';
import { DelegateCompensationOld, HeaderHat } from 'components';
import {
  DelegatesProvider,
  GovernanceVotesProvider,
  ProxyProvider,
  useDAO,
  WalletProvider,
} from 'contexts';
import { DelegateCompensationProvider } from 'contexts/delegateCompensation';
import { MainLayout } from 'layouts';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Script from 'next/script';
import React from 'react';

const RainbowWrapper = dynamic(() =>
  import('components').then(module => module.RainbowWrapper)
);

const DelegatesList = dynamic(() =>
  import('components').then(module => module.DelegatesList)
);

const AuthProvider = dynamic(() =>
  import('contexts/auth').then(module => module.AuthProvider)
);

const HandlesProvider = dynamic(() =>
  import('contexts/handles').then(module => module.HandlesProvider)
);

interface IDelegateCompensationOldContainer {
  user?: string;
  shouldOpenDelegateToAnyone?: boolean;
}

export const DelegateCompensationOldContainer: React.FC<
  IDelegateCompensationOldContainer
> = ({ user, shouldOpenDelegateToAnyone }) => {
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
        onLoad={() => console.log('GTAG code setup')}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        onLoad={() => console.log('Google-Analytics code setup')}
      >
        {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
  
                gtag('config', '${config.DAO_GTAG}');`}
      </Script>
      <RainbowWrapper>
        <DelegatesProvider>
          <WalletProvider>
            <AuthProvider>
              <GovernanceVotesProvider>
                <ProxyProvider>
                  <HandlesProvider>
                    <DelegateCompensationProvider>
                      <Flex
                        w="full"
                        flexDir="column"
                        align="center"
                        background={theme.secondBg || theme.bodyBg}
                      >
                        <HeaderHat
                          shouldOpenDelegateToAnyone={
                            shouldOpenDelegateToAnyone
                          }
                        />
                        <MainLayout w="full">
                          <DelegateCompensationOld />
                        </MainLayout>
                      </Flex>
                    </DelegateCompensationProvider>
                  </HandlesProvider>
                </ProxyProvider>
              </GovernanceVotesProvider>
            </AuthProvider>
          </WalletProvider>
        </DelegatesProvider>
      </RainbowWrapper>
    </>
  );
};
