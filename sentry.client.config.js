// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://34603b8b014c4e08a952edd25f6acf37@o1174022.ingest.sentry.io/4504255615205376',
  tracesSampleRate: 1.0,
});
