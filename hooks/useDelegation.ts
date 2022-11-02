import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useDAO, useDelegates } from 'contexts';
import { IDelegation } from 'types';
import snapshotContract from 'resources/contracts/snapshot.json';
import { getIdBySnapshotId } from 'utils';
import { useToasty } from './useToasty';

export const useDelegation = (args: IDelegation) => {
  const { delegatee } = args;
  const { daoInfo } = useDAO();
  const { voteInfos } = useDelegates();

  const { snapshotIds } = voteInfos;
  const type = daoInfo.config.DAO_DELEGATE_MODE;

  const getAddressOrName = () => {
    if (type === 'snapshot')
      return '0x469788fe6e9e9681c6ebf3bf78e7fd26fc015446';
    return daoInfo.config.DAO_DELEGATE_CONTRACT;
  };

  const getABI = () => {
    if (type === 'snapshot') return snapshotContract;
    return daoInfo.ABI;
  };

  const getArgs = () => {
    if (type === 'snapshot') {
      const idBySnapshotId = getIdBySnapshotId(snapshotIds[0]);
      return [idBySnapshotId, delegatee];
    }
    return [delegatee];
  };

  const getFunctionName = () => {
    if (type === 'snapshot') return 'setDelegate';
    return 'delegate';
  };

  const { config } = usePrepareContractWrite({
    addressOrName: getAddressOrName(),
    contractInterface: getABI(),
    functionName: getFunctionName(),
    args: getArgs(),
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
