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
import { useWallet } from './wallet';

interface IGovernanceVotesProps {
  votes: string;
  isLoadingVotes: boolean;
  delegatedBefore: string;
  symbol: string;
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
  const { address: walletAddress, isConnected } = useWallet();
  const [votes, setVotes] = useState('0');
  const [symbol, setSymbol] = useState('');

  const [delegatedBefore, setDelegatedBefore] = useState('');
  const { data: voteAmount, isFetching: isLoadingVotes } = useContractRead({
    addressOrName: daoInfo.config.DAO_DELEGATE_CONTRACT,
    contractInterface: daoInfo.ABI,
    functionName: 'balanceOf',
    args: [walletAddress],
    chainId: daoInfo.config.DAO_CHAIN.id,
  });

  const { data: delegated } = useContractRead({
    addressOrName: daoInfo.config.DAO_DELEGATE_CONTRACT,
    contractInterface: daoInfo.ABI,
    functionName: 'delegates',
    args: [walletAddress],
    chainId: daoInfo.config.DAO_CHAIN.id,
    enabled: !!walletAddress,
  });

  const { data: fetchedSymbol } = useContractRead({
    addressOrName: daoInfo.config.DAO_DELEGATE_CONTRACT,
    contractInterface: daoInfo.ABI,
    functionName: 'symbol',
    chainId: daoInfo.config.DAO_CHAIN.id,
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
  }, [walletAddress, voteAmount, isConnected]);

  const getDelegated = async () => {
    if (!delegated) {
      setDelegatedBefore('');
      return;
    }
    setDelegatedBefore(delegated.toString());
  };

  useEffect(() => {
    getDelegated();
  }, [walletAddress, isConnected]);

  const getSymbol = async () => {
    if (!fetchedSymbol) {
      setSymbol('');
      return;
    }
    setSymbol(fetchedSymbol.toString());
  };

  useEffect(() => {
    getSymbol();
  }, [fetchedSymbol, isConnected]);

  const providerValue = useMemo(
    () => ({
      votes,
      isLoadingVotes,
      delegatedBefore,
      symbol,
      isConnected,
    }),
    [votes, isLoadingVotes, delegatedBefore, symbol, isConnected]
  );

  return (
    <GovernanceVotesContext.Provider value={providerValue}>
      {children}
    </GovernanceVotesContext.Provider>
  );
};

export const useGovernanceVotes = () => useContext(GovernanceVotesContext);
