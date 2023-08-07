import { Box, Flex, Text } from '@chakra-ui/react';
import { TrackBadge } from 'components/DelegationPool/TrackBadge';
import { useDAO, useDelegates } from 'contexts';
import { NumberIsh } from 'types';
import { formatNumber, IActiveDelegatedTracks } from 'utils';
import { convictionLockTime } from './UndelegateModal';

interface IUndelegateItemProps {
  tracksDelegated: IActiveDelegatedTracks[];
  onRemoveTrack: (trackId: number) => void;
  onSelectTrack: (trackId: number) => void;
  selectedTracks: NumberIsh[];
}

export const UndelegateItems: React.FC<IUndelegateItemProps> = ({
  tracksDelegated,
  onRemoveTrack,
  onSelectTrack,
  selectedTracks,
}) => {
  const { tracks } = useDelegates();
  const { theme, daoInfo } = useDAO();

  const getDelegatedTrackAmount = (trackId: NumberIsh) => {
    const track = tracksDelegated.find(item => item.trackId === trackId);
    if (track) return track.amount;
    return 0;
  };

  return (
    <>
      {tracks
        .filter(track =>
          tracksDelegated.some(
            delegatedTrack => +delegatedTrack.trackId === +track.id
          )
        )
        .map(track => {
          const trackFound = tracksDelegated.find(
            trackToFind => trackToFind.trackId === track.id
          );

          const disabledCondition = trackFound
            ? trackFound.timestamp * 1000 +
                convictionLockTime[+trackFound.conviction] * 86400000 >
              Date.now()
            : false;

          return (
            <Flex
              mt={3}
              pb={5}
              key={track.id}
              flexDirection="column"
              __css={{
                ':not(:last-of-type)': {
                  borderBottom: '1px solid',
                },
              }}
            >
              {trackFound && disabledCondition ? (
                <Flex flexDir="column" gap="2">
                  <Flex flexDir="row" gap="1">
                    <Text color={theme.text} fontSize="sm" align="center">
                      {daoInfo.config.TRACKS_DICTIONARY &&
                      daoInfo.config.TRACKS_DICTIONARY[track.displayName]
                        ? daoInfo.config.TRACKS_DICTIONARY[track.displayName]
                            .emoji
                        : undefined}
                    </Text>
                    <Text color={theme.text} fontSize="md">
                      {track.displayName}
                    </Text>
                  </Flex>
                  <Text color={theme.text} fontSize="sm">
                    You have {formatNumber(trackFound.amount)} tokens locked
                    with conviction {trackFound.conviction}
                  </Text>
                </Flex>
              ) : (
                <Box>
                  <TrackBadge
                    track={{
                      id: track.id,
                      name: track.displayName,
                    }}
                    onRemove={removed => {
                      onRemoveTrack(removed);
                    }}
                    onSelect={selected => {
                      onSelectTrack(selected.id);
                    }}
                    selected={selectedTracks.some(arr => arr === track.id)}
                  />
                  <Text color="white" mt={3} fontWeight="normal">
                    You have {formatNumber(getDelegatedTrackAmount(track.id))}{' '}
                    tokens delegated to this track.
                  </Text>
                </Box>
              )}
            </Flex>
          );
        })}
    </>
  );
};
