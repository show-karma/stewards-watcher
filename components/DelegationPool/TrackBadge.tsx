import { Box, Flex, FlexProps } from '@chakra-ui/react';
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
  const { theme } = useDAO();

  const handleSelect = () => {
    onSelect(track);
  };

  const handleRemove = () => {
    onRemove(track.id);
  };

  return (
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
      <Flex>
        <Flex>{track.name}</Flex>
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
  );
};
