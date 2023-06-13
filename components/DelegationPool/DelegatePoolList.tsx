import { Flex } from '@chakra-ui/react';
import { ImgWithFallback } from 'components/ImgWithFallback';
import { useDAO, useDelegates } from 'contexts';
import { truncateAddress } from 'utils';
import { IBulkDelegatePayload } from 'utils/moonbeam/moonriverDelegateAction';
import { TrackBadge } from './TrackBadge';

interface IDelegatePoolListProps {
  delegates: IBulkDelegatePayload[];
  onRemove: (address: string) => void;
}

export const DelegatePoolList: React.FC<IDelegatePoolListProps> = ({
  delegates,
  onRemove,
}) => {
  const { daoInfo } = useDAO();
  const { config } = daoInfo;

  const { addTrackToDelegateInPool, removeTrackFromDelegateInPool } =
    useDelegates();

  return (
    <Flex flexDir="row" flexWrap="wrap" align="center" w="full">
      {delegates.map(payload => (
        <Flex
          __css={{
            ':not(:last-of-type)': {
              borderBottom: '#CED1D4 1px solid',
            },
          }}
          py={3}
          position="relative"
          w="full"
          key={payload.delegate.address}
        >
          <Flex gap={3} align="center" flexWrap="wrap">
            <Flex>
              <ImgWithFallback
                h={['36px']}
                w={['36px']}
                borderRadius="full"
                src={
                  payload.delegate.profilePicture ||
                  `${config.IMAGE_PREFIX_URL}${payload.delegate.address}`
                }
                fallback={payload.delegate.address}
                cursor="pointer"
              />
            </Flex>
            <Flex fontWeight="bold" align="center">
              {payload.delegate.realName ||
                payload.delegate.ensName ||
                truncateAddress(payload.delegate.address)}
            </Flex>
            {payload.delegate.tracks && payload.delegate.tracks.length > 0 && (
              <>
                <Flex>for</Flex>
                <Flex gap={2} flexWrap="wrap">
                  {payload.delegate.tracks?.map(track => (
                    <TrackBadge
                      track={track}
                      key={track.id}
                      selected={!!payload.tracks.find(tr => tr.id === track.id)}
                      onSelect={() =>
                        addTrackToDelegateInPool(
                          track,
                          payload.delegate.address
                        )
                      }
                      onRemove={() =>
                        removeTrackFromDelegateInPool(
                          track.id,
                          payload.delegate.address
                        )
                      }
                    />
                  ))}
                </Flex>
              </>
            )}
          </Flex>
          <Flex
            align="center"
            position="absolute"
            right="0"
            top="0"
            h="100%"
            cursor="pointer"
            fontSize={24}
            onClick={() => onRemove(payload.delegate.address)}
          >
            &times;
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
