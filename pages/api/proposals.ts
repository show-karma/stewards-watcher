import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { moonbeamProposals, moonriverProposals } from 'utils/api/proposals';
import { SafeCache } from 'utils/api/safe-cache';

const cache = SafeCache.create({ expire: 86400 });
/**
 *
 * @param payload
 * @returns { taskId }
 */
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.send('Method not allowed');
    return;
  }

  if (req.query.dao !== 'moonriver' && req.query.dao !== 'moonbeam') {
    res.statusCode = 400;
    res.send('Bad request');
    return;
  }

  const cacheKey = `proposals-${req.query.dao}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    res.setHeader('Cache-Control', 's-maxage=86400');
    res.json(cached);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = [];

  if (req.query.dao === 'moonriver') {
    const data = await moonriverProposals();
    result = data;
  }
  if (req.query.dao === 'moonbeam') {
    const data = await moonbeamProposals();
    result = data;
  }

  cache.set(cacheKey, result);
  res.setHeader('Cache-Control', 's-maxage=86400');
  res.json(result);
};

export default handler;
