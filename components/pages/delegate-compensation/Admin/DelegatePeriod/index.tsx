import { Flex, Text } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { MonthDropdown } from '../../MonthDropdown';
import { DelegatesDropdown } from '../Delegates/DelegatesDropdown';

export const DelegatePeriod = ({
  delegate = true,
  period = true,
  minimumPeriod,
}: {
  delegate?: boolean;
  period?: boolean;
  minimumPeriod?: Date;
}) => {
  const { theme } = useDAO();
  return (
    <Flex
      flexDir="row"
      gap="10"
      justify="flex-start"
      bg={theme.compensation?.card.bg}
      borderRadius="8px"
      px="4"
      py="6"
      flexWrap="wrap"
    >
      {delegate ? (
        <Flex
          flexDir="row"
          gap="4"
          justify="flex-start"
          align="center"
          w="full"
          maxW="max-content"
        >
          <Text
            fontSize="16px"
            fontWeight="600"
            color={theme.compensation?.card.text}
          >
            Delegate
          </Text>
          <DelegatesDropdown />
        </Flex>
      ) : null}
      {period ? (
        <Flex
          flexDir="row"
          gap="4"
          justify="flex-start"
          align="center"
          bg={theme.compensation?.card.bg}
          w="full"
          maxW="max-content"
        >
          <Text
            fontSize="16px"
            fontWeight="600"
            color={theme.compensation?.card.text}
          >
            Period
          </Text>
          <MonthDropdown minimumPeriod={minimumPeriod} />
        </Flex>
      ) : null}
    </Flex>
  );
};
