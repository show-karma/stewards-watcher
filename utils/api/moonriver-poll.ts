import { MoonbeamProposal, NumberIsh } from 'types';
import { moonriverProposals } from './proposals';
import { SafeCache } from './safe-cache';

export function moonriverProposalPoll(cache: SafeCache) {
  const iv: Record<string, NodeJS.Timeout> = {};

  const init = async (daoName: string) => {
    // Set first call
    const firstResult = await moonriverProposals();

    console.log('Setting first cache');
    cache.set(`proposals-${daoName}`, firstResult);

    return setInterval(async () => {
      const cacheKey = `proposals-${daoName}`;
      const cached = cache.get(cacheKey) as (MoonbeamProposal & {
        proposal: string;
        trackId: NumberIsh;
      })[];

      console.log('Polling proposals');
      if (cached) {
        const data = await moonriverProposals();
        if (data.length !== cached.length) {
          console.log('Updating cache');
          cache.set(cacheKey, data);
        }
      }
    }, 1000 * 60 * 60);
  };

  return {
    /**
     * Start polling
     */
    start: async (pollName: string) => {
      clearInterval(iv[pollName]);
      iv[pollName] = await init(pollName);
    },
    /**
     * Stop polling
     */
    stop: (pollName: string) => {
      clearInterval(iv[pollName]);
    },
  };
}
