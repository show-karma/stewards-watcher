import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { moonriverProposals } from 'utils/api/proposals';
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

  if (req.query.dao !== 'moonriver') {
    res.statusCode = 400;
    res.send('Bad request');
    return;
  }

  const cacheKey = `proposals-${req.query.dao}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  let result: any = [];

  if (req.query.dao === 'moonriver') {
    const data = await moonriverProposals();
    result = data;
  }

  cache.set(cacheKey, result);
  res.json(result);
};

export default handler;
