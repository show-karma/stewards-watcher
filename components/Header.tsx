import { Flex, Img, Text, Link, Button, Skeleton } from '@chakra-ui/react';
import { useDAO, useDelegates, useFilter } from 'contexts';
import { FC } from 'react';
import { IDAOTheme, IDelegate } from 'types';
import { getTimeFromNow } from 'utils';
import { Filters } from './Filters';

const DelegatesCounter: FC<{
  isLoading: boolean;
  isSearchDirty: boolean;
  theme: IDAOTheme;
  delegates: IDelegate[];
}> = ({ isLoading, isSearchDirty, theme, delegates }) => {
  if (isLoading) return <Skeleton w="40" h="6" />;
  if (!isSearchDirty) return <Flex />;
  return (
    <Text fontSize="md" color={theme.text}>
      {delegates.length} delegate{delegates.length > 1 && 's'} found
    </Text>
  );
};

export const Header: FC = () => {
  const { delegates, isLoading, lastUpdate } = useDelegates();
  const { daoInfo } = useDAO();
  const { isSearchDirty } = useFilter();
  const { theme, config } = daoInfo;
  return (
    <Flex
      px={{ base: '4' }}
      flexDir="column"
      w={{ base: 'full', xl: 'max-content' }}
    >
      <Flex
        textAlign="start"
        w="full"
        align="flex-start"
        justify="flex-start"
        py={['2', '8']}
        flexDir="column"
        maxW="800"
        gap="2"
      >
        <Img w="36" h="20" src={config.DAO_LOGO} />
        <Text
          color={theme.title}
          textAlign="start"
          fontSize={['1.8rem', '2rem']}
          lineHeight={['2rem', '3rem']}
          fontWeight="600"
          fontFamily="heading"
        >
          {config.DAO_DESCRIPTION}
        </Text>
        <Text color={theme.subtitle} fontSize={['lg', 'xl']} fontWeight="light">
          {config.DAO_SUBDESCRIPTION}
        </Text>
        <Flex gap={['4', '8']} my={['2', '8']} flexWrap="wrap">
          <Link href={config.GOVERNANCE_FORUM}>
            <Button
              px="6"
              py="4"
              borderRadius="base"
              bgColor={theme.branding}
              fontSize="md"
              fontFamily="heading"
              _hover={{
                bgColor: theme.branding,
                opacity: 0.8,
              }}
              _focusVisible={{
                bgColor: theme.branding,
                opacity: 0.8,
              }}
              _focusWithin={{
                bgColor: theme.branding,
                opacity: 0.8,
              }}
              _focus={{
                opacity: 0.8,
              }}
              _active={{
                opacity: 0.8,
              }}
            >
              View discussion
            </Button>
          </Link>
          <Link href={config.DAO_URL}>
            <Button
              px="6"
              py="4"
              borderRadius="base"
              fontSize="md"
              fontFamily="heading"
              background="none"
              borderWidth="1px"
              borderColor={theme.buttonText}
              borderStyle="solid"
              _hover={{
                opacity: 0.8,
              }}
              _focusVisible={{
                opacity: 0.8,
              }}
              _focusWithin={{
                opacity: 0.8,
              }}
              _focus={{
                opacity: 0.8,
              }}
              _active={{
                opacity: 0.8,
              }}
            >
              Learn more & Get Involved
            </Button>
          </Link>
        </Flex>
      </Flex>
      <Filters />
      <Flex flexDir="row" justify="space-between" p="6">
        <DelegatesCounter
          delegates={delegates}
          isLoading={isLoading}
          isSearchDirty={isSearchDirty}
          theme={theme}
        />
        <Flex flexDir="column" textAlign="end">
          <Text fontSize="md" color={theme.text}>
            Data powered by{' '}
            <Link href="https://showkarma.xyz" isExternal>
              <Text as="span" textDecor="underline">
                Karma
              </Text>
            </Link>
          </Text>
          {delegates.length > 0 && (
            <Flex flexDir="row" gap="1" justifyContent="end">
              <Text fontSize="xs" color={theme.subtitle}>
                Last updated
              </Text>
              {isLoading ? (
                <Skeleton w="16" h="5">
                  00 hours ago
                </Skeleton>
              ) : (
                <Text fontSize="xs" color={theme.subtitle}>
                  {getTimeFromNow(lastUpdate)}
                </Text>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
