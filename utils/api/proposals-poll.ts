import { SafeCache } from './safe-cache';

/**
 * Polls the proposals every hour and update the cache if there are new proposals
 * @param cache the cache instance reference
 */
export function proposalsPoll(cache: SafeCache) {
  const iv: Record<string, NodeJS.Timeout> = {};

  const init = async (cacheKey: string, fetcher: () => Promise<any[]>) => {
    // Set first call
    const firstResult = await fetcher();

    console.log(`Setting first cache for ${cacheKey}`);
    cache.set(cacheKey, firstResult);

    return setInterval(async () => {
      const cached = cache.get(cacheKey) as any[];

      console.log('Polling proposals');
      if (cached) {
        const data = await fetcher();
        if (data.length !== cached.length) {
          console.log('Updating cache');
          cache.set(cacheKey, data);
        }
      }
    }, 1000 * 60 * 60);
  };

  return {
    /**
     * Start polling, returns the first result
     *
     */
    start: async (
      cacheKey: string,
      fetcher: () => Promise<any[]>
    ): Promise<any[]> => {
      clearInterval(iv[cacheKey]);
      if (!fetcher) return [];

      iv[cacheKey] = await init(cacheKey, fetcher);
      return (cache.get(cacheKey) || []) as any[];
    },
    /**
     * Stop polling
     */
    stop: (cacheKey: string) => {
      clearInterval(iv[cacheKey]);
    },
  };
}
