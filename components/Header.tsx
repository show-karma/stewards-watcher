import { Flex, Img, Text, Link } from '@chakra-ui/react';
import { GENERAL, THEME } from 'configs';
import { FC } from 'react';
import { removeLinkPrefix } from 'utils';

export const Header: FC = () => {
  const handledDAOUrl = removeLinkPrefix(GENERAL.DAO_URL);
  const capitalizedDAOUrl =
    handledDAOUrl.charAt(0).toUpperCase() + handledDAOUrl.slice(1);

  return (
    <Flex
      textAlign="center"
      w="full"
      align="center"
      justify="center"
      py="8"
      px={{ base: '4', lg: '8' }}
      flexDir="column"
    >
      <Img w="36" h="20" src="/images/logo.svg" />
      <Text color={THEME.subtitle} textAlign="center" fontSize="lg">
        {GENERAL.DAO_DESCRIPTION}{' '}
        <Text as="span">
          Details and discussion can be found on the{' '}
          <Link
            textDecor="underline"
            isExternal
            href={GENERAL.GOVERNANCE_FORUM}
          >
            governance forum
          </Link>
          , to learn more and get involved - visit{' '}
          <Link textDecor="underline" isExternal href={GENERAL.DAO_URL}>
            {capitalizedDAOUrl}
          </Link>
        </Text>
      </Text>
      <Text color={THEME.subtitle} fontSize="lg" my="8">
        Data powered by{' '}
        <Link
          isExternal
          href="https://www.showkarma.xyz/"
          textDecoration="underline"
        >
          Karma
        </Link>
        . Last updated 18 hours ago.
      </Text>
    </Flex>
  );
};
