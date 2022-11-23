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
     */
    '/((?!api|_next|daos|icons|images|meta|[\\w-]+\\.\\w+).*)',
  ],
};

function getDAOName(host: string) {
  let dao;
  switch (host) {
    case 'optimism.showkarma.xyz':
      dao = 'optimism';
      break;
    case 'pooltogether.showkarma.xyz':
      dao = 'pooltogether';
      break;
    case 'yamfinance.showkarma.xyz':
      dao = 'yamfinance';
      break;
    case 'ssvnetwork.showkarma.xyz':
      dao = 'ssvnetwork';
      break;
    case 'op.showkarma.xyz':
      dao = 'op';
      break;
    default:
      dao = 'optimism';
  }
  return dao;
}

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || 'www.showkarma.xyz';
  const dao =
    process.env.NODE_ENV === 'production'
      ? getDAOName(hostname)
      : hostname.split('.')[0];
  const currentPathname = url.pathname;

  url.pathname = `/_sites/${dao}${currentPathname}`;
  return NextResponse.rewrite(url);
}
