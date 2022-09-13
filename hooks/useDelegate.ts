import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import ABI from 'resources/optimism/ABI.json';
import { GENERAL } from 'configs';
import { useToasty } from './useToasty';

export const useDelegate = (delegatee: string) => {
  const { config } = usePrepareContractWrite({
    addressOrName: GENERAL.DAO_DELEGATE_CONTRACT,
    contractInterface: ABI,
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
