import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useDAO } from 'contexts';
import { IDelegation } from 'types';
import { useToasty } from './useToasty';
import { useMixpanel } from './useMixpanel';

export const useDelegation = (args: IDelegation) => {
  const { delegatee, onSuccessFunction } = args;
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
      toast({
        title: 'Success',
        description: 'You successfully delegated your tokens!',
        status: 'success',
      });
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

  return { data, isLoading, isSuccess, write };
};
