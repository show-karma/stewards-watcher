import {
  DelegatesProvider,
  GovernanceVotesProvider,
  HandlesProvider,
  TokenHoldersProvider,
  useDAO,
  WalletProvider,
} from 'contexts';
import { MainLayout } from 'layouts';
import Head from 'next/head';
import React from 'react';
import {
  RainbowWrapper,
  DelegatesList,
  HeaderHat,
  BodyTitle,
  TokenHolders,
} from 'components';
import { Flex } from '@chakra-ui/react';
import Script from 'next/script';
import { AuthProvider } from 'contexts/auth';
import { useRouter } from 'next/router';

interface IDAOContainer {
  user?: string;
}

export const TokenHoldersContainer: React.FC<IDAOContainer> = ({ user }) => {
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;
  const router = useRouter();

  const title = `Check Your DAO Delegate's Performance`;
  const description =
    'Find out how well your delegate has performed since you delegated your tokens.';
  const imageBig = `${config.METATAGS.URL}/meta/token-holders/delegate-activity-tracker-big.png`;
  const image = `${config.METATAGS.URL}/meta/token-holders/delegate-activity-tracker.png`;
  const url = `${config.METATAGS.URL}${router.asPath}`;

  return (
    <RainbowWrapper>
      <DelegatesProvider>
        <WalletProvider>
          <AuthProvider>
            <GovernanceVotesProvider>
              <HandlesProvider>
                <TokenHoldersProvider>
                  <Head>
                    <title>{title}</title>
                    <meta name="description" content={description} />

                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={url} key="ogurl" />
                    <meta
                      property="og:image"
                      content={imageBig}
                      key="ogimage"
                    />
                    <meta
                      property="og:site_name"
                      content={title}
                      key="ogsitename"
                    />
                    <meta property="og:title" content={title} key="ogtitle" />
                    <meta
                      property="og:description"
                      content={description}
                      key="ogdesc"
                    />
                    <link rel="icon" href={config.METATAGS.FAVICON} />

                    <meta
                      property="twitter:card"
                      content="summary_large_image"
                    />
                    <meta property="twitter:url" content={url} />
                    <meta property="twitter:title" content={description} />
                    <meta
                      property="twitter:description"
                      content={description}
                    />
                    <meta property="twitter:image" content={image} />
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
                  <Flex
                    w="full"
                    flexDir="column"
                    align="center"
                    background={theme.secondBg || theme.bodyBg}
                  >
                    <HeaderHat />
                    <MainLayout px="0" w="full" bgColor={theme.tokenHolders.bg}>
                      <TokenHolders />
                    </MainLayout>
                  </Flex>
                </TokenHoldersProvider>
              </HandlesProvider>
            </GovernanceVotesProvider>
          </AuthProvider>
        </WalletProvider>
      </DelegatesProvider>
    </RainbowWrapper>
  );
};
