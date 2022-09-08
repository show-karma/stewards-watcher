import type { AppProps } from 'next/app';
import { ColorHandler } from 'contexts';
import Head from 'next/head';
import { GENERAL } from 'configs';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>{GENERAL.METATAGS.TITLE}</title>
      <meta name="description" content={GENERAL.METATAGS.DESCRIPTION} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={GENERAL.METATAGS.URL} key="ogurl" />
      <meta
        property="og:image"
        content={GENERAL.METATAGS.IMAGE}
        key="ogimage"
      />
      <meta
        property="og:site_name"
        content={GENERAL.METATAGS.DESCRIPTION}
        key="ogsitename"
      />
      <meta
        property="og:title"
        content={GENERAL.METATAGS.DESCRIPTION}
        key="ogtitle"
      />
      <meta
        property="og:description"
        content={GENERAL.METATAGS.DESCRIPTION}
        key="ogdesc"
      />
      <link rel="icon" href={GENERAL.METATAGS.FAVICON} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={GENERAL.METATAGS.URL} />
      <meta property="twitter:title" content={GENERAL.METATAGS.DESCRIPTION} />
      <meta
        property="twitter:description"
        content={GENERAL.METATAGS.DESCRIPTION}
      />
      <meta property="twitter:image" content={GENERAL.METATAGS.IMAGE} />
    </Head>
    <ColorHandler cookies={pageProps.cookies}>
      <Component {...pageProps} />
    </ColorHandler>
  </>
);

export default MyApp;
