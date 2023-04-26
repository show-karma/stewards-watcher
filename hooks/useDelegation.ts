import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useDAO, useDelegates } from 'contexts';
import { IDelegation } from 'types';
import snapshotContract from 'resources/contracts/snapshot.json';
import { getIdBySnapshotId } from 'utils';
import { useToasty } from './useToasty';
import { useMixpanel } from './useMixpanel';

export const useDelegation = (args: IDelegation) => {
  const { delegatee, onSuccessFunction } = args;
  const { daoInfo } = useDAO();
  const { voteInfos } = useDelegates();

  const { snapshotIds } = voteInfos;
  const type = daoInfo.config.DAO_DELEGATE_MODE;

  const getAddressOrName = () => {
    if (type === 'snapshot')
      return '0x469788fe6e9e9681c6ebf3bf78e7fd26fc015446';
    return daoInfo.config.DAO_DELEGATE_CONTRACT as `0x${string}`;
  };

  const getABI = () => {
    if (type === 'snapshot') return snapshotContract;
    return daoInfo.ABI;
  };

  const getArgs = () => {
    if (type === 'snapshot' && snapshotIds && snapshotIds.length) {
      const idBySnapshotId = getIdBySnapshotId(snapshotIds[0]);
      return [idBySnapshotId, delegatee];
    }
    return [delegatee];
  };

  const getFunctionName = () => {
    if (type === 'snapshot') return 'setDelegate';
    return 'delegate';
  };

  const { mixpanel } = useMixpanel();

  const { config } = usePrepareContractWrite({
    address: getAddressOrName(),
    abi: getABI(),
    functionName: getFunctionName(),
    args: getArgs(),
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
        description: 'The delegate was successful!',
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
