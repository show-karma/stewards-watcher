import { Flex, Text, Tooltip } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC } from 'react';
import { ICardStat } from 'types';

export const DelegateStat: FC<{
  stat: ICardStat;
  disableTooltip?: boolean;
  underline?: boolean;
}> = ({ stat, disableTooltip, underline }) => {
  const { theme } = useDAO();
  return (
    <Tooltip
      label={disableTooltip ? '' : stat.tooltipText}
      hasArrow
      bgColor="black"
      color="white"
      fontWeight="normal"
      fontSize="sm"
    >
      <Flex
        flexDir="column"
        gap="0.2"
        textAlign="center"
        alignItems="center"
        justifyContent="center"
        maxH="max-content"
        h="max-content"
        w="full"
        maxW="max-content"
      >
        <Text
          color={theme.card.text.primary}
          fontFamily="heading"
          fontSize={{ base: 'md', md: 'lg' }}
          fontWeight="bold"
          textAlign="center"
          h="max-content"
          w="full"
          maxW="max-content"
        >
          {stat.value}
        </Text>
        <Text
          color={theme.card.text.primary}
          fontSize={{ base: '10px', md: '11px' }}
          fontWeight="light"
          h="max-content"
          w="full"
          maxW="max-content"
          textDecoration={underline ? 'underline' : 'none'}
        >
          {stat.title}
        </Text>
      </Flex>
    </Tooltip>
  );
};
