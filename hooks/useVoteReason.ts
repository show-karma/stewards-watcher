import { useQuery } from '@tanstack/react-query';
import { useDAO } from 'contexts';
import { KARMA_API } from 'helpers';
import { axiosInstance } from 'utils';

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
  const { daoInfo } = useDAO();
  const { data, error, isLoading } = useQuery({
    queryKey: ['voteReason', address, daoInfo.config.DAO_KARMA_ID],
    queryFn: () =>
      axiosInstance.get(
        `${KARMA_API.base_url}/forum-user/${daoInfo.config.DAO_KARMA_ID}/vote-reason/${address}`
      ),
  });

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  const getVoteReason = (proposalId: string) => {
    if (!data) return undefined;
    const { reasons } = data.data.data;
    const reasonFound = reasons.find(
      (reason: IReason) => reason.proposalId === proposalId
    )?.recommendation;
    return reasonFound || undefined;
  };

  return {
    data,
    error,
    isLoading,
    getVoteReason,
  };
};
