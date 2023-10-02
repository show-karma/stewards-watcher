/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { proposalsPoll } from 'utils/api/proposals-poll';
import {
  moonbaseProposals,
  moonbeamProposals,
  moonriverProposals,
} from 'utils/api/proposals';
import { SafeCache } from 'utils/api/safe-cache';
import { fetchOffChainProposals, fetchOnChainProposals } from 'hooks';
import { MixpanelService } from 'utils/mixpanel';

const cache = SafeCache.create();

const { start, stop } = proposalsPoll(cache);
interface ProposalQuery {
  dao: string;
  source: 'on-chain' | 'off-chain' | 'all';
  poll?: 'start' | 'stop';
  skipIds?: string;
  [key: string]: string | string[] | undefined;
}

function reportMixpanel(cacheKey: string, hit: boolean) {
  MixpanelService.reportEvent('daoDelegatesApp', {
    event: 'cache',
    properties: {
      cacheKey,
      hit,
    },
  });
}

function validateRequest(req: NextApiRequest): ProposalQuery {
  if (req.method !== 'GET') {
    throw new Error('405:Method not allowed');
  }

  const { dao, source, poll, skipIds } = req.query as ProposalQuery;

  if (!dao || !source) {
    throw new Error('400:Missing dao or source');
  }

  if (!['on-chain', 'off-chain', 'all'].includes(source)) {
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
      stop(cacheKey);
      res.send('Polling stopped');
      return;
    }

    let result: any = [];
    const cached = cache.get(cacheKey);
    if (cached) {
      result = cached;
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=1800, stale-while-revalidate=86400'
      );
      res.setHeader('x-source', 'cache');

      if (skipIds) {
        result = result.filter(
          (proposal: any) => !skipIds.includes(proposal.id)
        );
      }

      res.json(result);
      reportMixpanel(cacheKey, true);
      return;
    }

    reportMixpanel(cacheKey, false);

    if (dao === 'moonriver') {
      // Start polling
      result = await start(cacheKey, moonriverProposals);
    } else if (req.query.dao === 'moonbeam') {
      result = await start(cacheKey, moonbeamProposals);
    } else if (req.query.dao === 'moonbase') {
      result = await start(cacheKey, moonbaseProposals);
    } else if (dao && source && source !== 'all') {
      result = await start(cacheKey, () =>
        source === 'off-chain'
          ? fetchOffChainProposals(dao)
          : fetchOnChainProposals(dao, [])
      );
    } else if (dao && source && source === 'all') {
      const results = await Promise.all([
        start(cacheKey, () => fetchOffChainProposals(dao)),
        start(cacheKey, () => fetchOnChainProposals(dao, [])),
      ]);

      result = results.flat();
    }

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=1800, stale-while-revalidate=86400'
    );
    res.setHeader('x-source', 'api');
    if (skipIds) {
      result = result.filter((proposal: any) => !skipIds.includes(proposal.id));
    }

    res.json(result);
  } catch (error: any) {
    const [code, msg] = error.message.split(':');
    res.statusCode = code || 500;
    res.send(msg || error.message);
  }
};

export default handler;
