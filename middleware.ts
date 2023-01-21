import { NextRequest, NextResponse } from 'next/server';
import { supportedDAOs } from 'resources';

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

const devUrl = 'dapp.karmahq.xyz';
const DAO_CUSTOM_DOMAIN: Record<string, string> = {
  [devUrl]: 'gitcoin',
  'daostewards.xyz': 'gitcoin',
  'stewards.gitcoin.co': 'gitcoin',
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || 'www.karmahq.xyz';
  const currentPathname = url.pathname;
  const rootUrl = hostname.replaceAll(/(www\.)|(:.+)/gi, '');

  let dao = DAO_CUSTOM_DOMAIN[rootUrl] || getDAOName(hostname);

  if (rootUrl === devUrl) {
    const daoName = url.searchParams.get('dao');
    dao = daoName ? getDAOName(daoName) : DAO_CUSTOM_DOMAIN[devUrl];
  }

  if (!supportedDAOs[dao]) {
    url.pathname = `_error`;
  } else {
    url.pathname = `/_sites/${dao}${currentPathname}`;
  }

  return NextResponse.rewrite(url);
}
