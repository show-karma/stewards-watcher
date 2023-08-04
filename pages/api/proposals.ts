import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { moonriverProposalPoll } from 'utils/api/moonriver-poll';
import { moonriverProposals } from 'utils/api/proposals';
import { SafeCache } from 'utils/api/safe-cache';

const cache = SafeCache.create({ expire: 86400 });

const { start, stop } = moonriverProposalPoll(cache);
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

  // Start polling
  if (req.query.poll === 'start') {
    await start(req.query.dao);

    res.send('Polling started');
    return;
  }

  // Stop polling
  if (req.query.poll === 'stop') {
    stop(req.query.dao);
    res.send('Polling stopped');
    return;
  }

  const cacheKey = `proposals-${req.query.dao}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    res.setHeader('Cache-Control', 's-maxage=86400');
    res.json(cached);
    return;
  }
  let result: any = [];

  if (req.query.dao === 'moonriver') {
    await start(req.query.dao);
    const data = await moonriverProposals();
    result = data;
  }

  cache.set(cacheKey, result);
  res.setHeader('Cache-Control', 's-maxage=86400');
  res.json(result);
};

export default handler;
