import { Button, Flex, Text } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC } from 'react';
import { truncateAddress } from 'utils';

interface ITokensDelegatedProps {
  address: string;
}

export const TokensDelegated: FC<ITokensDelegatedProps> = ({ address }) => {
  const { theme } = useDAO();
  const { delegateTo: modalTheme } = theme.modal;

  return (
    <Flex px="4" flexDir="column" align="center" maxW="368px" pb="6">
      <Text
        mb={1}
        color={modalTheme.text}
        fontWeight="semibold"
        fontSize="2xl"
        textAlign="center"
        w="full"
      >
        Tokens delegated!
      </Text>
      <Text
        mb={7}
        color={modalTheme.subtext}
        fontWeight="normal"
        fontSize="lg"
        textAlign="center"
        w="full"
      >
        You successfully delegated tokens to{' '}
        <Text as="span" textDecor="underline">
          {truncateAddress(address)}
        </Text>
        .
      </Text>

      <Flex flexDir="column" w="full" gap="3">
        <Button
          bgColor={modalTheme.button.normal.bg}
          color={modalTheme.button.normal.text}
          fontSize="md"
        >
          Close
        </Button>
        <Button
          bgColor={modalTheme.button.alternative.bg}
          color={modalTheme.button.alternative.text}
          border="1px solid"
          borderColor={modalTheme.button.alternative.border}
          fontSize="md"
        >
          Delegate to another use
        </Button>
      </Flex>
    </Flex>
  );
};
