import type { AppProps } from 'next/app';
import { ColorHandler } from 'contexts';
import Head from 'next/head';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>{`Karma's Stewards Watcher`}</title>
      <meta name="description" content="" />
      <meta
        property="og:url"
        content="https://watcher.showkarma.xyz"
        key="ogurl"
      />
      <meta property="og:image" content="/meta.png" key="ogimage" />
      <meta
        property="og:site_name"
        content="Karma's Stewards Watcher"
        key="ogsitename"
      />
      <meta
        property="og:title"
        content="Karma's Stewards Watcher"
        key="ogtitle"
      />
      <meta
        property="og:description"
        content="Stewards Watcher made by Karma."
        key="ogdesc"
      />
      <link rel="icon" href="/favicon.ico" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://watcher.showkarma.xyz" />
      <meta property="twitter:title" content="Karma's Stewards Watcher" />
      <meta
        property="twitter:description"
        content="Stewards Watcher made by Karma."
      />
      <meta property="twitter:image" content="/meta.png" />
    </Head>
    <ColorHandler cookies={pageProps.cookies}>
      <Component {...pageProps} />
    </ColorHandler>
  </>
);

export default MyApp;
