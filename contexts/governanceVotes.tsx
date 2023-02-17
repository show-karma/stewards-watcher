import React, {
  useContext,
  createContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import numbro from 'numbro';
import { useAccount, useContractRead } from 'wagmi';
import { formatEther } from 'utils';
import { useDAO } from './dao';

interface IGovernanceVotesProps {
  votes: string;
  isLoadingVotes: boolean;
  delegatedBefore: string;
}

export const GovernanceVotesContext = createContext(
  {} as IGovernanceVotesProps
);

interface ProviderProps {
  children: React.ReactNode;
}

export const GovernanceVotesProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const { daoInfo } = useDAO();
  const { address: walletAddress } = useAccount();
  const [votes, setVotes] = useState('0');

  const [delegatedBefore, setDelegatedBefore] = useState('');
  const { data: voteAmount, isFetching: isLoadingVotes } = useContractRead({
    addressOrName: daoInfo.config.DAO_DELEGATE_CONTRACT,
    contractInterface: daoInfo.ABI,
    functionName: 'balanceOf',
    args: [walletAddress],
    chainId: daoInfo.config.DAO_CHAIN.id,
    enabled: !!walletAddress,
  });

  const { data: delegated } = useContractRead({
    addressOrName: daoInfo.config.DAO_DELEGATE_CONTRACT,
    contractInterface: daoInfo.ABI,
    functionName: 'delegates',
    args: [walletAddress],
    chainId: daoInfo.config.DAO_CHAIN.id,
    enabled: !!walletAddress,
  });

  const getVotes = async () => {
    if (!voteAmount) {
      setVotes('0');
      return;
    }
    const fromWeiAmount = formatEther(voteAmount);
    const formattedAmount = numbro(fromWeiAmount).format({
      thousandSeparated: true,
      mantissa: 3,
      trimMantissa: true,
    });
    setVotes(formattedAmount.toString());
  };

  useEffect(() => {
    getVotes();
  }, [walletAddress, voteAmount]);

  const getDelegated = async () => {
    if (!delegated) {
      setDelegatedBefore('');
      return;
    }
    setDelegatedBefore(delegated.toString());
  };

  useEffect(() => {
    getDelegated();
  }, [walletAddress]);

  const providerValue = useMemo(
    () => ({
      votes,
      isLoadingVotes,
      delegatedBefore,
    }),
    [votes, isLoadingVotes, delegatedBefore]
  );

  return (
    <GovernanceVotesContext.Provider value={providerValue}>
      {children}
    </GovernanceVotesContext.Provider>
  );
};

export const useGovernanceVotes = () => useContext(GovernanceVotesContext);
