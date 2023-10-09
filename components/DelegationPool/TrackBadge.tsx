/* eslint-disable no-nested-ternary */
import {
  AlertDescription,
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  FlexProps,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { useToasty } from 'hooks';
import { BsPlus } from 'react-icons/bs';
import { IoWarning } from 'react-icons/io5';

export interface ITrackBadgeProps {
  track: {
    id: number;
    name: string;
  };
  selected?: boolean;
  onSelect: (track: ITrackBadgeProps['track']) => void;
  onRemove: (trackId: number) => void;
  styles?: FlexProps;
  alreadyDelegated?: boolean;
}

export const TrackBadge: React.FC<ITrackBadgeProps> = ({
  track,
  onRemove,
  onSelect,
  selected,
  styles,
  alreadyDelegated,
}) => {
  const { theme, daoInfo } = useDAO();
  const { toast } = useToasty();

  const dispatchUndelegateOpenEvent = () => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new Event('undelegateOpen'));
  };

  const handleSelect = () => {
    if (alreadyDelegated) {
      toast({
        render: () => (
          <Alert status="error" backgroundColor="#feb2b2" borderRadius={6}>
            <AlertIcon color="black" />
            <Box color="black">
              <AlertTitle>Track already delegated</AlertTitle>
              <AlertDescription>
                <p>
                  You have already delegated to this track. Please undelegate
                  before redelegating by clicking{' '}
                  <button type="button" onClick={dispatchUndelegateOpenEvent}>
                    <u>here</u>
                  </button>
                  .{' '}
                </p>
              </AlertDescription>
            </Box>
          </Alert>
        ),
        status: 'error',
      });
    } else onSelect(track);
  };

  const handleRemove = () => {
    onRemove(track.id);
  };

  return (
    <Tooltip
      label={
        daoInfo.config.TRACKS_DICTIONARY &&
        daoInfo.config.TRACKS_DICTIONARY[track.name]
          ? alreadyDelegated
            ? `⚠️ You have already delegated to this ${
                daoInfo.config.TRACKS_DICTIONARY[track.name].emoji
              } ${track.name}. Undelegate before redelegating.`
            : `${daoInfo.config.TRACKS_DICTIONARY[track.name].description}`
          : undefined
      }
      bg={theme.collapse.bg || theme.card.background}
      color={theme.collapse.text}
    >
      <Flex
        cursor="pointer"
        userSelect="none"
        border={`1px solid ${theme.text}`}
        borderRadius="xl"
        pl={3}
        pr={2}
        w="max-content"
        h="max-content"
        align="center"
        fontSize="sm"
        key={track.id}
        color={selected ? '#1DE9B6' : theme.text}
        isDisabled={alreadyDelegated}
        disabled={alreadyDelegated}
        onClick={() => {
          if (alreadyDelegated) return;
          if (selected) {
            handleRemove();
          } else {
            handleSelect();
          }
        }}
        _disabled={{
          opacity: 0.5,
        }}
        {...styles}
        background={selected ? 'black' : 'transparent'}
        style={{
          cursor: alreadyDelegated ? 'not-allowed' : 'pointer',
        }}
      >
        <Flex flexDir="row" gap="1">
          <Text>
            {daoInfo.config.TRACKS_DICTIONARY &&
            daoInfo.config.TRACKS_DICTIONARY[track.name]
              ? daoInfo.config.TRACKS_DICTIONARY[track.name].emoji
              : undefined}
          </Text>
          <Text>{track.name}</Text>
        </Flex>
        <Box
          ml={3}
          transform={selected ? 'rotate(45deg)' : 'rotate(0deg)'}
          transition="200ms ease-in-out"
          fontSize={24}
        >
          {alreadyDelegated ? <IoWarning color="orange" /> : <BsPlus />}
        </Box>
      </Flex>
    </Tooltip>
  );
};
