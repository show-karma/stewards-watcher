import { Flex, Img, Text, Link, Button, Skeleton } from '@chakra-ui/react';
import { GENERAL, THEME } from 'configs';
import { useStewards } from 'contexts';
import { FC } from 'react';
import { getTimeFromNow } from 'utils';
import { Filters } from './Filters';

export const Header: FC = () => {
  const { stewards, isLoading, lastUpdate } = useStewards();

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
        <Img w="36" h="20" src="/images/logo.svg" />
        <Text
          color={THEME.title}
          textAlign="start"
          fontSize={['1.8rem', '2rem']}
          lineHeight={['2rem', '3rem']}
          fontWeight="600"
          fontFamily="heading"
        >
          {GENERAL.DAO_DESCRIPTION}
        </Text>
        <Text color={THEME.subtitle} fontSize={['lg', 'xl']} fontWeight="light">
          {GENERAL.DAO_SUBDESCRIPTION}
        </Text>
        <Flex gap={['4', '8']} my={['2', '8']} flexWrap="wrap">
          <Link href={GENERAL.GOVERNANCE_FORUM}>
            <Button
              px="6"
              py="4"
              borderRadius="base"
              bgColor={THEME.branding}
              fontSize="md"
              fontFamily="heading"
              _hover={{
                bgColor: THEME.branding,
                opacity: 0.8,
              }}
              _focusVisible={{
                bgColor: THEME.branding,
                opacity: 0.8,
              }}
              _focusWithin={{
                bgColor: THEME.branding,
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
          <Link href={GENERAL.DAO_URL}>
            <Button
              px="6"
              py="4"
              borderRadius="base"
              fontSize="md"
              fontFamily="heading"
              background="none"
              borderWidth="1px"
              borderColor={THEME.buttonText}
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
        {isLoading ? (
          <Skeleton w="40" h="6" />
        ) : (
          <Text fontSize="md" color={THEME.text}>
            {stewards.length} Stewards found
          </Text>
        )}
        <Flex flexDir="column" textAlign="end">
          <Text fontSize="md" color={THEME.text}>
            Data powered by{' '}
            <Link href="https://showkarma.xyz" isExternal>
              <Text as="span" textDecor="underline">
                Karma
              </Text>
            </Link>
          </Text>
          <Flex flexDir="row" gap="1" justifyContent="end">
            <Text fontSize="xs" color={THEME.subtitle}>
              Last updated
            </Text>
            {isLoading ? (
              <Skeleton w="16" h="5">
                00 hours ago
              </Skeleton>
            ) : (
              <Text fontSize="xs" color={THEME.subtitle}>
                {getTimeFromNow(lastUpdate)}
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
