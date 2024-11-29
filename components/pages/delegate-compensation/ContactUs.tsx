import { Flex, Text } from '@chakra-ui/react';
import { ChakraLink } from 'components/ChakraLink';
import { useDAO } from 'contexts';

export const ContactUs = () => {
  const { theme } = useDAO();
  return (
    <Flex flexDir="column">
      <Text textAlign="center" color={theme.compensation?.card.text}>
        Questions or feedback about this dashboard? Contact us on{' '}
        <ChakraLink
          isExternal
          href="https://t.me/karmahq"
          color="blue.500"
          textDecor="underline"
        >
          Telegram
        </ChakraLink>
      </Text>
    </Flex>
  );
};
