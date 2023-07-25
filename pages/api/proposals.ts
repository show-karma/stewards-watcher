import axios from 'axios';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { SafeCache } from 'utils/api/safe-cache';

const cache = SafeCache.create({ expire: 10 });

/**
 * Sends a sponsored call to the DelegateRegistry contract using GelatoRelay
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
  const cacheKey = 'proposals';

  const cached = cache.get(cacheKey);
  if (cached) {
    res.json(cached);
    console.log('Cache hit');
    return;
  }

  const { data } = await axios.get(
    'https://jsonplaceholder.typicode.com/todos'
  );

  console.log('Cache miss');
  cache.set(cacheKey, data);
  res.json(data);
};

export default handler;
