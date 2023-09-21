import React, {
  useContext,
  createContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { useContractReads } from 'wagmi';
// eslint-disable-next-line import/no-extraneous-dependencies
import { readContracts } from '@wagmi/core';
import { formatEther } from 'utils';
import { BigNumber } from 'ethers';
import { Hex } from 'types';
import { useDAO } from './dao';
import { useWallet } from './wallet';

interface IGovernanceVotesProps {
  votes: string;
  isLoadingVotes: boolean;
  delegatedBefore: string[];
  symbol: string[];
  walletAddress?: string;
  getVotes: () => Promise<void>;
  loadedVotes: boolean;
  loadedMultiChainsVotes: boolean;
  multiChainVotes: { chainId: number; sum: string }[];
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
  const [multiChainVotes, setMultiChainVotes] = useState<
    { chainId: number; sum: string }[]
  >([]);
  const [loadedMultiChainsVotes, setLoadedMultiChainsVotes] = useState(false);
  const [symbol, setSymbol] = useState(['']);
  const [loadedVotes, setLoadedVotes] = useState(false);

  const [delegatedBefore, setDelegatedBefore] = useState(['']);

  const { data: voteAmounts, isFetching: isLoadingVotes } = useContractReads({
    contracts: daoInfo.config.DAO_TOKEN_CONTRACT
      ? daoInfo.config.DAO_TOKEN_CONTRACT.map(contract => ({
          address: contract.contractAddress,
          abi: contract.ABI || daoInfo.TOKEN_ABI,
          functionName: contract.method,
          args: walletAddress ? [walletAddress] : undefined,
          chainId: contract.chain.id,
        }))
      : undefined,
  });

  const { data: delegated } = useContractReads({
    contracts: daoInfo.config.DAO_DELEGATE_CONTRACT
      ? daoInfo.config.DAO_DELEGATE_CONTRACT.map(contract => ({
          address: contract.contractAddress,
          abi: daoInfo.DELEGATE_ABI,
          functionName: 'delegates',
          args: walletAddress ? [walletAddress] : undefined,
          chainId: contract.chain.id,
          enabled: !!walletAddress,
        }))
      : undefined,
  });

  const { data: fetchedSymbol } = useContractReads({
    contracts: daoInfo.config.DAO_TOKEN_CONTRACT
      ? daoInfo.config.DAO_TOKEN_CONTRACT.map(contract => ({
          address: contract.contractAddress,
          abi: daoInfo.TOKEN_ABI,
          functionName: 'symbol',
          chainId: contract.chain.id,
        }))
      : undefined,
  });

  const getVotes = async () => {
    setLoadedVotes(false);
    if (!voteAmounts || !voteAmounts?.length) {
      setVotes('0');
      setLoadedVotes(true);
      return;
    }

    const amountsBN = voteAmounts.map(amount => {
      if (amount && amount.result)
        return BigNumber.from(amount.result).toString();
      return '0';
    });
    const onlyZeros = amountsBN.every(amount => amount === '0');
    if (onlyZeros) {
      setVotes('0');
      setLoadedVotes(true);
      return;
    }
    const sumBNs = amountsBN.reduce(
      (acc, amount) => acc.add(BigNumber.from(amount)),
      BigNumber.from('0')
    );

    const fromWeiAmount = formatEther(sumBNs.toString());

    if (daoInfo.config.GET_LOCKED_TOKENS_ACTION) {
      const { GET_LOCKED_TOKENS_ACTION: getLocked } = daoInfo.config;
      const lockedVotes = await getLocked(walletAddress as Hex);
      setVotes((+fromWeiAmount + +lockedVotes).toString());
    } else setVotes(fromWeiAmount);
    setLoadedVotes(true);
  };

  useEffect(() => {
    getVotes();
  }, [walletAddress, voteAmounts, isConnected]);

  // it doesn't support locked_tokens yet
  const getMultiChainsVotes = async () => {
    setLoadedMultiChainsVotes(false);
    try {
      const groupContractsByChain = daoInfo.config.DAO_TOKEN_CONTRACT?.reduce(
        (acc, contract) => {
          if (!acc[contract.chain.id]) acc[contract.chain.id] = [];
          acc[contract.chain.id].push(contract);
          return acc;
        },
        {} as Record<string, any[]>
      );
      if (!groupContractsByChain) return;
      const keys = Object.keys(groupContractsByChain as object);
      const multiChainAmounts = await Promise.all(
        keys.map(async key => {
          const data = await readContracts({
            contracts: groupContractsByChain[key].map(contract => ({
              address: contract.contractAddress,
              abi: contract.ABI || daoInfo.TOKEN_ABI,
              functionName: contract.method,
              args: walletAddress ? [walletAddress] : undefined,
              chainId: contract.chain.id,
            })),
          });

          const amountsBN = data.map(amount => {
            if (amount && amount.result)
              return BigNumber.from(amount.result).toString();
            return '0';
          });

          const onlyZeros = amountsBN.every(amount => amount === '0');
          if (onlyZeros) {
            return { chainId: +key, sum: '0' };
          }
          const sumBNs = amountsBN.reduce(
            (acc, amount) => acc.add(BigNumber.from(amount)),
            BigNumber.from('0')
          );

          const fromWeiAmount = formatEther(sumBNs.toString());

          return { chainId: +key, sum: fromWeiAmount };
        })
      );

      setMultiChainVotes(multiChainAmounts);
    } catch {
      setMultiChainVotes([]);
    } finally {
      setLoadedMultiChainsVotes(true);
    }
  };

  useEffect(() => {
    if (daoInfo.config.DAO_CHAINS.length > 1) getMultiChainsVotes();
  }, [walletAddress, isConnected]);

  const getDelegated = async () => {
    if (!delegated) {
      setDelegatedBefore(['']);
      return;
    }
    const delegateds = delegated.map(item => item.result) as string[];
    setDelegatedBefore(delegateds);
  };

  useEffect(() => {
    getDelegated();
  }, [walletAddress, isConnected]);

  const getSymbol = async () => {
    if (!fetchedSymbol) {
      setSymbol(['']);
      return;
    }
    const symbols = fetchedSymbol.map(item => item.result) as string[];
    setSymbol(symbols);
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
      loadedVotes,
      multiChainVotes,
      loadedMultiChainsVotes,
    }),
    [
      votes,
      isLoadingVotes,
      delegatedBefore,
      symbol,
      isConnected,
      walletAddress,
      getVotes,
      loadedVotes,
      multiChainVotes,
      loadedMultiChainsVotes,
    ]
  );

  return (
    <GovernanceVotesContext.Provider value={providerValue}>
      {children}
    </GovernanceVotesContext.Provider>
  );
};

export const useGovernanceVotes = () => useContext(GovernanceVotesContext);
