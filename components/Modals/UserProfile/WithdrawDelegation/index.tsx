import { Button, Flex, Text } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC } from 'react';
import { WithdrawPopover } from './WithdrawPopover';

export const WithdrawDelegation: FC = () => {
  const { theme } = useDAO();
  return (
    <Flex flexDir="column" minH={{ base: '500px' }}>
      <Text
        fontSize="2xl"
        fontWeight="semibold"
        color={theme.modal.header.title}
        mt="6"
      >
        No longer active?
      </Text>
      <Text
        fontWeight="normal"
        fontSize="lg"
        color={theme.modal.header.subtitle}
        mt="1"
        fontFamily="heading"
      >
        If you are no longer active in the community and would like to withdraw
        your delegation click the button below.
      </Text>

      <WithdrawPopover />
    </Flex>
  );
};
