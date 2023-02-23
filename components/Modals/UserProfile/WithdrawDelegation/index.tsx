import { Flex, Text } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { FC } from 'react';
import { WithdrawPopover } from './WithdrawPopover';

export const WithdrawDelegation: FC = () => {
  const { theme } = useDAO();
  const { profileSelected } = useDelegates();
  return (
    <Flex flexDir="column" minH={{ base: '500px' }}>
      {profileSelected?.status === 'withdrawn' ? (
        <>
          <Text
            fontSize="2xl"
            fontWeight="semibold"
            color={theme.modal.header.title}
            mt="6"
          >
            You have withdrawn your nomination
          </Text>
          <Text
            fontWeight="normal"
            fontSize="lg"
            color={theme.modal.header.subtitle}
            mt="1"
            fontFamily="heading"
          >
            If you would like to start accepting delegations, please contact us
            at dao@karmahq.xyz
          </Text>
        </>
      ) : (
        <>
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
            If you are not interested in being a delegate and would like to withdraw
            your nomination, click the button below.
          </Text>
          <WithdrawPopover />
        </>
      )}
    </Flex>
  );
};
