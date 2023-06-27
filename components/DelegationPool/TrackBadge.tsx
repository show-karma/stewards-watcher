import { Box, Flex, FlexProps, Text, Tooltip } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { BsPlus } from 'react-icons/bs';

export interface ITrackBadgeProps {
  track: {
    id: number;
    name: string;
  };
  selected?: boolean;
  onSelect: (track: ITrackBadgeProps['track']) => void;
  onRemove: (trackId: number) => void;
  styles?: FlexProps;
}

export const TrackBadge: React.FC<ITrackBadgeProps> = ({
  track,
  onRemove,
  onSelect,
  selected,
  styles,
}) => {
  const { theme, daoInfo } = useDAO();

  const handleSelect = () => {
    onSelect(track);
  };

  const handleRemove = () => {
    onRemove(track.id);
  };

  return (
    <Tooltip
      label={
        daoInfo.config.TRACKS_DICTIONARY &&
        daoInfo.config.TRACKS_DICTIONARY[track.name]
          ? daoInfo.config.TRACKS_DICTIONARY[track.name].description
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
        onClick={selected ? handleRemove : handleSelect}
        color={selected ? '#1DE9B6' : theme.text}
        background={selected ? 'black' : 'transparent'}
        {...styles}
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
          <BsPlus />
        </Box>
      </Flex>
    </Tooltip>
  );
};
