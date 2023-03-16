import { Divider, Flex, Text, Tooltip } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC } from 'react';
import { ICardStat } from 'types';
import { convertHexToRGBA } from 'utils';

export const ScoreStat: FC<{ stat: ICardStat }> = ({ stat }) => {
  const { theme } = useDAO();

  const getGradient = () =>
    `linear-gradient(to right, ${convertHexToRGBA(
      theme.card.text.primary,
      0
    )},${convertHexToRGBA(theme.card.text.primary, 0.25)}, ${convertHexToRGBA(
      theme.card.text.primary,
      0.25
    )}, ${convertHexToRGBA(theme.card.text.primary, 0.25)}, ${convertHexToRGBA(
      theme.card.text.primary,
      0
    )})`;

  return (
    <Tooltip
      label={stat.tooltipText}
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
        w="max-content"
        bg={theme.card.statBg}
        px="2"
        py="1"
        boxShadow="0px 0px 6px rgba(0, 0, 0, 0.2)"
        borderRadius="5px"
        mt="-2"
      >
        <Text
          color={theme.card.text.primary}
          fontFamily="heading"
          fontSize={{ base: 'md', md: 'lg' }}
          fontWeight="bold"
          textAlign="center"
          h="max-content"
          w="max-content"
        >
          {stat.value}
        </Text>
        <Text
          color={theme.card.text.secondary}
          fontSize={{ base: '12px' }}
          fontWeight="normal"
          h="max-content"
          w="max-content"
        >
          {stat.title}
        </Text>
        <Flex h="1px" w="full" backgroundImage={getGradient()} mb="1" />
      </Flex>
    </Tooltip>
  );
};
