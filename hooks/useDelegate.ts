import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useDAO } from 'contexts';
import { useToasty } from './useToasty';

export const useDelegate = (delegatee: string) => {
  const { daoInfo } = useDAO();
  const { config } = usePrepareContractWrite({
    addressOrName: daoInfo.config.DAO_DELEGATE_CONTRACT,
    contractInterface: daoInfo.ABI,
    functionName: 'delegate',
    args: [delegatee],
  });
  const { toast } = useToasty();
  const { data, isLoading, isSuccess, write } = useContractWrite({
    ...config,
    onSuccess() {
      toast({
        title: 'Success',
        description: 'The delegate was successful!',
        status: 'success',
      });
    },
    onError() {
      toast({
        title: 'Error',
        description: 'The transaction goes wrong...',
        status: 'error',
      });
    },
  });

  return { data, isLoading, isSuccess, write };
};
