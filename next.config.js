/** @type {import('next').NextConfig} */
// const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  swcMinify: true,
  sentry: {
    hideSourceMaps: true,
  },
  webpack(config, { nextRuntime }) {
    // as of Next.js latest versions, the nextRuntime is preferred over `isServer`, because of edge-runtime
    if (typeof nextRuntime === 'undefined') {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
};

// const withSentryNextConfig = withSentryConfig?.(nextConfig, {
//   silent: true,
//   dryRun: process.env.VERCEL_ENV !== 'production',
//   hideSourceMaps: true,
// });

// const config = withSentryNextConfig ?? nextConfig;
const config = nextConfig;

module.exports = config;
