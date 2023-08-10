import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { proposalsPoll } from 'utils/api/proposals-poll';
import { moonriverProposals } from 'utils/api/proposals';
import { SafeCache } from 'utils/api/safe-cache';
import { fetchOffChainProposals, fetchOnChainProposals } from 'hooks';

const cache = SafeCache.create({ expire: 86400 });

const { start, stop } = proposalsPoll(cache);
interface ProposalQuery {
  dao: string;
  source: 'on-chain' | 'off-chain';
  poll?: 'start' | 'stop';
  skipIds?: string;
  [key: string]: string | string[] | undefined;
}

function validateRequest(req: NextApiRequest): ProposalQuery {
  if (req.method !== 'GET') {
    throw new Error('405:Method not allowed');
  }

  const { dao, source, poll, skipIds } = req.query as ProposalQuery;

  if (!dao || !source) {
    throw new Error('400:Missing dao or source');
  }

  if (!['on-chain', 'off-chain'].includes(source)) {
    throw new Error('400:Source should be on-chain or off-chain');
  }

  if (poll && (!dao || !source)) {
    throw new Error('400:Missing dao name or source');
  }

  if (skipIds && !Array.isArray(skipIds.split(','))) {
    throw new Error('400:skipIds should be an array joined by comma');
  }

  return {
    dao,
    source,
    poll,
    skipIds,
  };
}

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { dao, source, poll, skipIds } = validateRequest(req);

    const cacheKey = `proposals-${source}-${dao}`;
    // Stop polling
    if (poll === 'stop') {
      stop(dao);
      res.send('Polling stopped');
      return;
    }

    const cached = cache.get(cacheKey);
    if (cached) {
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=1800, stale-while-revalidate=86400'
      );
      res.setHeader('x-source', 'cache');
      res.json(cached);
      return;
    }

    let result: any = [];

    if (dao === 'moonriver') {
      // Start polling
      result = await start(cacheKey, moonriverProposals);
    } else if (dao && source) {
      result = await start(cacheKey, () =>
        source === 'off-chain'
          ? fetchOffChainProposals(dao)
          : fetchOnChainProposals(dao, skipIds?.split(',') || [])
      );
    }

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=1800, stale-while-revalidate=86400'
    );
    res.setHeader('x-source', 'api');
    res.json(result);
  } catch (error: any) {
    const [code, msg] = error.message.split(':');
    res.statusCode = code || 500;
    res.send(msg || error.message);
  }
};

export default handler;
