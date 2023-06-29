import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { DelegateRegistryContract } from 'utils/delegate-registry/DelegateRegistry';

const assertionObj = [
  {
    data: /0x[a-fA-F0-9]+/gim,
    chainId: /\d+/,
    target: /0x[a-fA-F0-9]{40}/gim,
  },
  /\{apiKey\}/,
  {
    retries: /\d+/,
  },
];

function assert(body: any) {
  if (!Array.isArray(body) || body.length !== assertionObj.length)
    throw new Error('Invalid request body');

  assertionObj.forEach((item, index) => {
    // check if objects from assertion Object are present in body
    // and test them using the regexp from the assertion Object
    if (typeof item === 'object') {
      Object.entries(item).forEach(([key, value]) => {
        if (!body[index][key]?.toString().match(value))
          throw new Error('Invalid request body');
      });
    }
    // test other items as strings
    else if (!body[index]?.toString().match(item))
      throw new Error('Invalid request body');
  });
}

/**
 * Sends a sponsored call to the DelegateRegistry contract using GelatoRelay
 * @param payload
 * @returns { taskId }
 */
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.send('Method not allowed');
    return;
  }

  const body = req.body as Parameters<
    DelegateRegistryContract['sponsoredCall']
  >;

  try {
    assert(body);

    const { GELATO_API_KEY: apiKey } = process.env;
    if (!apiKey) throw new Error("Sorry, we can't do it right now.");

    body[1] = apiKey;

    const result = await DelegateRegistryContract.sendGelato(...body);

    const txId = await result.wait();
    res.send({ txId });
  } catch (error: any) {
    res.statusCode = 400;
    res.send(error.message);
  }
};

export default handler;
