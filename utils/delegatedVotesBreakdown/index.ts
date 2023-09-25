import axios from 'axios';

const chainsDelegatesData = {
  1: 'https://api.thegraph.com/subgraphs/name/show-karma/dao-delegates',
  10: 'https://api.thegraph.com/subgraphs/name/show-karma/dao-delegates-arbitrum',
  137: 'https://api.thegraph.com/subgraphs/name/show-karma/dao-delegates-polygon',
  42161:
    'https://api.thegraph.com/subgraphs/name/show-karma/dao-delegates-optimism',
  100: 'https://api.thegraph.com/subgraphs/name/show-karma/dao-delegates-gnosis',
  56: 'https://api.thegraph.com/subgraphs/name/show-karma/dao-delegates-bsc',
};

type DelegatedVotes = { votes: number | string; chainId: number };

export const getDelegateVotesByNetwork = async (
  name: string,
  publicAddress: string
): Promise<{ votes: number | string; chainId: number }[]> => {
  const delegatedVotes: DelegatedVotes[] = [];

  const urls = Object.values(chainsDelegatesData);
  const entries = Object.entries(chainsDelegatesData);
  const queries = urls.map(url => ({
    query: `{
      delegateOrganizations(where: {organization: "${name}", delegate: "${publicAddress}"}) {
          voteBalance
        }
      }
    `,
    url,
    chainId: Number(entries.find(([, value]) => value === url)?.[0]),
  }));

  const results = await Promise.all(
    queries.map(query =>
      axios
        .post(query.url, { query: query.query })
        .then(res => ({ ...res, chain: query.chainId }))
    )
  );

  results.forEach(result => {
    if (result.data.data?.delegateOrganizations[0]) {
      delegatedVotes.push({
        votes: Math.round(
          result.data.data.delegateOrganizations[0].voteBalance / 10 ** 18
        ),
        chainId: result.chain as number,
      });
    }
  });

  return delegatedVotes;
};
