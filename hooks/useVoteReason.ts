import { useQuery } from '@tanstack/react-query';
import { useDAO } from 'contexts';
import { api, KARMA_API } from 'helpers';
import { useMemo } from 'react';
import {
  VotingReasonPayload,
  saveVotingReason,
} from 'utils/voting-reason/save-voting-reason';
import { useAccount } from 'wagmi';

interface IUseVoteReason {
  address: string;
}

interface IReason {
  recommendation: string;
  summary: string;
  threadId: number;
  proposalId: string;
  postId: number;
}

export const useVoteReason = (args: IUseVoteReason) => {
  const { address } = args;
  const { address: connectedAddress, connector } = useAccount();
  const { daoInfo } = useDAO();
  const { data, error, isLoading } = useQuery({
    queryKey: ['voteReason', address, daoInfo.config.DAO_KARMA_ID],
    queryFn: () =>
      api.get(
        `${KARMA_API.base_url}/forum-user/${daoInfo.config.DAO_KARMA_ID}/vote-reason/${address}`
      ),
  });

  const isVoteOwner = useMemo(
    () => connectedAddress?.toLowerCase() === address.toLowerCase(),
    [connectedAddress, address]
  );

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  const getVoteReason = (proposalId: string) => {
    if (!data) return undefined;
    const { reasons } = data.data.data;
    const reasonFound = reasons.find(
      (reason: IReason) => reason.proposalId === proposalId
    );
    return reasonFound?.summary || reasonFound?.recommendation;
  };

  const setVotingReason = async (
    payload: VotingReasonPayload,
    daoName: string,
    signer: any
  ) => {
    if (!connector || !connectedAddress || !signer)
      throw new Error('User not connected');
    if (!isVoteOwner) throw new Error('User not owner of vote');

    const easurl = await saveVotingReason(
      payload,
      signer,
      connectedAddress,
      daoName
    );
    if (typeof window !== 'undefined') {
      window.open(easurl, '_blank');
    }
    setTimeout(() => getVoteReason(payload.proposalId), 1000);
  };

  return {
    data,
    error,
    isLoading,
    getVoteReason,
    isVoteOwner,
    setVotingReason,
  };
};
