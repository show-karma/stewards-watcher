import { Flex } from '@chakra-ui/react';
import { IBulkDelegatePayload } from 'utils/moonbeam/moonriverDelegateAction';
import { DelegatePoolRow } from './DelegatePoolRow';

interface IDelegatePoolListProps {
  delegates: IBulkDelegatePayload[];
  onRemove: (address: string) => void;
}

export const DelegatePoolList: React.FC<IDelegatePoolListProps> = ({
  delegates,
  onRemove,
}) => (
  <Flex flexDir="row" flexWrap="wrap" align="center" w="full">
    {delegates.map(payload => (
      <DelegatePoolRow
        payload={payload}
        key={payload.delegate.address}
        onRemove={onRemove}
      />
    ))}
  </Flex>
);
