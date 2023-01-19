import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /examples (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     * 6. meta
     */
    '/((?!api|_next|daos|icons|images|meta|[\\w-]+\\.\\w+).*)',
  ],
};

const getDAOName = (host: string) => host.split('.')[0];

const supportedDAOs = [
  'aave',
  'op',
  'optimism',
  'pooltogether',
  'yamfinance',
  'ssvnetwork',
  'dydx',
  'dimo',
  'gitcoin',
  'element-finance',
  'starknet',
];

const DAO_CUSTOM_DOMAIN: Record<string, string> = {
  'daostewards.xyz': 'gitcoin',
  'karma.dollarsoundtrack.com': 'gitcoin',
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || 'www.karmahq.xyz';
  const currentPathname = url.pathname;

  const rootUrl = hostname.replaceAll(/(www\.)|(:.+)/gi, '');

  const dao = DAO_CUSTOM_DOMAIN[rootUrl] || getDAOName(hostname);

  if (
    hostname.includes('vercel.app') ||
    (hostname.includes('localhost') && !dao)
  ) {
    const daoToFind = currentPathname.split('/')[1];
    const searchDAO = supportedDAOs.find(item => item === daoToFind);
    const lastPathname = currentPathname.split(`/${searchDAO}`)[1];
    url.pathname = `/_sites/${searchDAO}${lastPathname || ''}`;
    return NextResponse.rewrite(url);
  }

  url.pathname = `/_sites/${dao}${currentPathname}`;
  return NextResponse.rewrite(url);
}
