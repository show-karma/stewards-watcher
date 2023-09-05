import axios from 'axios';
import _ from 'lodash';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.send('Method not allowed');
    return;
  }

  const { address: delegateAddress, daoName } = req.query;

  try {
    const { SUBSCAN_API_KEY: apiKey } = process.env;
    if (!apiKey) throw new Error("Sorry, we can't do it right now.");

    const response = await axios.post(
      `https://${daoName}.api.subscan.io/api/v2/scan/search`,
      { key: delegateAddress },
      {
        headers: {
          'X-API-Key': apiKey,
        },
      }
    );

    const delegationData =
      response.data?.data?.account?.delegate?.conviction_delegated || [];

    const groupedData = _.groupBy(delegationData, 'origins');

    const groupByTrack = _.mapValues(groupedData, group =>
      _.sumBy(group, item => parseFloat((item.amount / 1e18).toString()))
    );
    res.send({ groupByTrack });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.statusCode = 400;
    res.send(error.message);
  }
};

export default handler;
