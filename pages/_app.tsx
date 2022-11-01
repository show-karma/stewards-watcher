import type { AppProps } from 'next/app';
import { ColorHandler } from 'contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <ColorHandler cookies={pageProps.cookies}>
      <Component {...pageProps} />
    </ColorHandler>
  </QueryClientProvider>
);

export default MyApp;
