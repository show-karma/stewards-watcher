/* eslint-disable no-console */
import {
  DelegatesProvider,
  GovernanceVotesProvider,
  ProxyProvider,
  useDAO,
  WalletProvider,
} from 'contexts';
import { MainLayout } from 'layouts';
import Head from 'next/head';
import React from 'react';
import { Flex } from '@chakra-ui/react';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { HeaderHat } from 'components';
import { useRouter } from 'next/router';

const RainbowWrapper = dynamic(() =>
  import('components').then(module => module.RainbowWrapper)
);

const EndorsementsComponent = dynamic(() =>
  import('components').then(module => module.EndorsementsComponent)
);

const AuthProvider = dynamic(() =>
  import('contexts/auth').then(module => module.AuthProvider)
);

const HandlesProvider = dynamic(() =>
  import('contexts/handles').then(module => module.HandlesProvider)
);

export const EndorsementsContainer: React.FC = () => {
  const { daoInfo, theme } = useDAO();
  const router = useRouter();
  const { config } = daoInfo;

  const title = `Delegates endorsed in ${daoInfo.config.DAO} DAO`;
  const description = `View all the delegates endorsed by peers in ${daoInfo.config.DAO} DAO.  This is a powerful signal for token holders seeking new delegates.`;
  const url = `${config.METATAGS.URL}${router.asPath}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} key="ogurl" />
        <meta
          property="og:image"
          content={config.METATAGS.IMAGE_DISCORD}
          key="ogimage"
        />
        <meta property="og:site_name" content={title} key="ogsitename" />
        <meta property="og:title" content={title} key="ogtitle" />
        <meta property="og:description" content={description} key="ogdesc" />
        <link rel="icon" href={config.METATAGS.FAVICON} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:title" content={description} />
        <meta property="twitter:description" content={description} />
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
                    <Flex
                      w="full"
                      flexDir="column"
                      background={theme.secondBg || theme.bodyBg}
                    >
                      <HeaderHat />
                      <MainLayout>
                        <EndorsementsComponent />
                      </MainLayout>
                    </Flex>
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
