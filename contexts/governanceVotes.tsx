import React, {
  useContext,
  createContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { useContractRead, useContractReads } from 'wagmi';
import { formatEther } from 'utils';
import { BigNumber } from 'ethers';
import { useDAO } from './dao';
import { useWallet } from './wallet';

interface IGovernanceVotesProps {
  votes: string;
  isLoadingVotes: boolean;
  delegatedBefore: string;
  symbol: string;
  walletAddress?: string;
  getVotes: () => Promise<void>;
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
  const { data: voteAmounts, isFetching: isLoadingVotes } = useContractReads({
    contracts: daoInfo.config.DAO_TOKEN_CONTRACT
      ? daoInfo.config.DAO_TOKEN_CONTRACT.map(contract => ({
          address: contract.contractAddress,
          abi: contract.ABI || daoInfo.TOKEN_ABI,
          functionName: contract.method,
          args: [walletAddress],
          chainId: daoInfo.config.DAO_CHAIN.id,
        }))
      : undefined,
  });

  const { data: delegated } = useContractRead({
    address: daoInfo.config.DAO_DELEGATE_CONTRACT,
    abi: daoInfo.DELEGATE_ABI,
    functionName: 'delegates',
    args: [walletAddress],
    chainId: daoInfo.config.DAO_CHAIN.id,
    enabled: !!walletAddress,
  });

  const { data: fetchedSymbol } = useContractRead({
    address: daoInfo.config.DAO_TOKEN_CONTRACT?.[0].contractAddress,
    abi: daoInfo.TOKEN_ABI,
    functionName: 'symbol',
    chainId: daoInfo.config.DAO_CHAIN.id,
  });

  const getVotes = async () => {
    if (!voteAmounts || !voteAmounts?.length) {
      setVotes('0');
      return;
    }
    const amountsBN = voteAmounts.map(amount => {
      if (amount) return BigNumber.from(amount).toString();
      return '0';
    });
    const onlyZeros = amountsBN.every(amount => amount === '0');
    if (onlyZeros) {
      setVotes('0');
      return;
    }
    const sumBNs = amountsBN.reduce(
      (acc, amount) => acc.add(BigNumber.from(amount)),
      BigNumber.from('0')
    );

    const fromWeiAmount = formatEther(sumBNs.toString());
    setVotes(fromWeiAmount);
  };

  useEffect(() => {
    getVotes();
  }, [walletAddress, voteAmounts, isConnected]);

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
      walletAddress,
      getVotes,
    }),
    [
      votes,
      isLoadingVotes,
      delegatedBefore,
      symbol,
      isConnected,
      walletAddress,
      getVotes,
    ]
  );

  return (
    <GovernanceVotesContext.Provider value={providerValue}>
      {children}
    </GovernanceVotesContext.Provider>
  );
};

export const useGovernanceVotes = () => useContext(GovernanceVotesContext);
