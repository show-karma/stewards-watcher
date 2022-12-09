/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sentry: {
    hideSourceMaps: true,
  },
};

const withSentryNextConfig = withSentryConfig?.(nextConfig, {
  silent: true,
  dryRun: process.env.VERCEL_ENV !== 'production',
  hideSourceMaps: true,
});

const config = withSentryNextConfig ?? nextConfig;

module.exports = config;
