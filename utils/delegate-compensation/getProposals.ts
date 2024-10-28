import { AxiosResponse } from 'axios';
import { api } from 'helpers';
import { Proposal, ProposalsFromAPI } from 'types/proposals';

export const getProposals = async (
  daoName: string,
  month: string | number,
  year: string | number
): Promise<Proposal[]> => {
  try {
    const axiosClient: AxiosResponse<{ data: ProposalsFromAPI }> =
      await api.get(`/incentive-settings/${daoName}/${month}/${year}`);
    const data = axiosClient?.data?.data?.proposals;
    if (!data) throw new Error('No data');
    const fetchedProposalsArray = Object.entries(data);
    const onChainProposals = fetchedProposalsArray
      .filter(([key, value]) => value.type === 'onChain')
      .map(([key, value]) => ({
        id: key,
        name: value.title,
        link: `https://www.tally.xyz/gov/${daoName}/proposal/${BigInt(
          key.split('-')[1]
        ).toString()}`,
        isValid: value.isValid,
        type: 'onChain',
      }));
    const snapshotProposals = fetchedProposalsArray
      .filter(([key, value]) => value.type === 'snapshot')
      .map(([key, value]) => ({
        id: key,
        name: value.title,
        link: `https://snapshot.org/#/arbitrumfoundation.eth/proposal/${key}`,
        isValid: value.isValid,
        type: 'snapshot',
      }));

    return [
      {
        name: 'Onchain Proposals',
        items: onChainProposals,
      },
      {
        name: 'Snapshot Proposals',
        items: snapshotProposals,
      },
    ] as Proposal[];
  } catch (error) {
    console.log(error);
    return [];
  }
};
