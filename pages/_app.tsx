import type { AppProps } from 'next/app';
import { ColorHandler } from 'contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import { Analytics } from '@vercel/analytics/react';
import 'styles/navigator.css';

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <ColorHandler cookies={pageProps.cookies}>
      <Component {...pageProps} />
      <Analytics />
    </ColorHandler>
  </QueryClientProvider>
);

export default MyApp;
