import { useMixpanel, useToasty } from 'hooks';
import React, { useContext, createContext, useMemo, useEffect } from 'react';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { useDAO } from './dao';

interface IDelegationProps {
  isLoading: boolean;
  isSuccess: boolean;
  write: (() => void) | undefined;
}

export const DelegationContext = createContext({} as IDelegationProps);

interface IProviderProps {
  children: React.ReactNode;
  delegatee: string;
  onSuccessFunction: () => void;
}

export const DelegationProvider: React.FC<IProviderProps> = ({
  children,
  delegatee,
  onSuccessFunction,
}) => {
  const { daoInfo } = useDAO();

  const getArgs = () => {
    const functionArgs = daoInfo.config.DAO_DELEGATE_FUNCTION_ARGS;
    if (!functionArgs) return [delegatee];
    return functionArgs.concat([delegatee]);
  };

  const { mixpanel } = useMixpanel();

  const { config } = usePrepareContractWrite({
    address: daoInfo.config.DAO_DELEGATE_CONTRACT,
    abi: daoInfo.DELEGATE_ABI,
    functionName: daoInfo.config.DAO_DELEGATE_FUNCTION || 'delegate',
    args: getArgs(),
    chainId: daoInfo.config.DAO_CHAIN.id,
  });

  const { toast } = useToasty();
  const { data, isLoading, isSuccess, write } = useContractWrite({
    ...config,
    onSuccess() {
      mixpanel.reportEvent({
        event: 'delegateapp.tokenDelegated',
      });

      onSuccessFunction?.();
    },
    onError(error) {
      console.log(error);
      if (
        error.stack?.includes('code=ACTION_REJECTED') ||
        error.stack?.includes('code=4001') ||
        error.message.includes('User rejected')
      ) {
        toast({
          title: 'Error',
          description: 'The transaction was cancelled. Please try again.',
          status: 'error',
        });
      } else {
        toast({
          title: 'Error',
          description: 'The transaction goes wrong...',
          status: 'error',
        });
      }
    },
  });

  const { isSuccess: successWaitTransaction } = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 1,
    enabled: !!data?.hash,
    chainId: daoInfo.config.DAO_CHAIN.id,
    cacheTime: 1000,
    staleTime: 1000,
  });

  useEffect(() => {
    if (successWaitTransaction) {
      toast({
        title: 'Success',
        description: 'You successfully delegated your tokens!',
        status: 'success',
      });
    }
  }, [successWaitTransaction]);

  const providerValue = useMemo(
    () => ({ isLoading, isSuccess, write }),
    [isLoading, isSuccess, write]
  );

  return (
    <DelegationContext.Provider value={providerValue}>
      {children}
    </DelegationContext.Provider>
  );
};

export const useDelegation = () => useContext(DelegationContext);
