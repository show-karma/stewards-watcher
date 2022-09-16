import type { AppProps } from 'next/app';
import { ColorHandler } from 'contexts';
import Head from 'next/head';
import '@rainbow-me/rainbowkit/styles.css';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ColorHandler cookies={pageProps.cookies}>
    <Component {...pageProps} />
  </ColorHandler>
);

export default MyApp;
