import { Flex } from '@chakra-ui/react';
import { useDAO, useWallet } from 'contexts';
import { useEffect, useState } from 'react';
import { IActiveDelegatedTracks } from 'utils';
import { IBulkDelegatePayload } from 'utils/moonbeam/moonriverDelegateAction';
import { DelegatePoolRow } from './DelegatePoolRow';

interface IDelegatePoolListProps {
  delegates: IBulkDelegatePayload[];
  onRemove: (address: string) => void;
}

export const DelegatePoolList: React.FC<IDelegatePoolListProps> = ({
  delegates,
  onRemove,
}) => {
  const { address } = useWallet();
  const { daoInfo } = useDAO();

  const [tracksDelegated, setTracksDelegated] = useState<
    IActiveDelegatedTracks[]
  >([]);

  const getActiveDelegations = async () => {
    if (address && daoInfo.config.GET_ACTIVE_DELEGATIONS_ACTION) {
      try {
        const foundTracks = await daoInfo.config.GET_ACTIVE_DELEGATIONS_ACTION(
          address,
          daoInfo.config.DAO_KARMA_ID
        );
        setTracksDelegated(foundTracks);
      } catch (error) {
        console.log('error getActiveDelegations', error);
      }
    }
  };

  useEffect(() => {
    getActiveDelegations();
  }, []);

  return (
    <Flex flexDir="row" flexWrap="wrap" align="center" w="full">
      {delegates.map(payload => (
        <DelegatePoolRow
          payload={payload}
          key={payload.delegate.address}
          onRemove={onRemove}
          activeTracks={tracksDelegated}
        />
      ))}
    </Flex>
  );
};
