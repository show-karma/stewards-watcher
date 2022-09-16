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
}

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get('host');

  const dao =
    process.env.NODE_ENV === 'production'
      ? getDAOName(hostname)
      : hostname.split('.')[0]

  // rewrite everything else to `/_sites/[site] dynamic route
  url.pathname = `/_sites/${dao}`;
  return NextResponse.rewrite(url);
}
