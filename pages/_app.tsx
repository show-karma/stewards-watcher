import type { AppProps } from 'next/app';
import { ColorHandler } from 'contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import Script from 'next/script';

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <QueryClientProvider client={queryClient}>
      <ColorHandler cookies={pageProps.cookies}>
        <Component {...pageProps} />
      </ColorHandler>
    </QueryClientProvider>
    {process.env.NODE_ENV !== 'production' && (
      <>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-67LDHT697P"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', 'G-67LDHT697P');
                `}
        </Script>
      </>
    )}
  </>
);

export default MyApp;
