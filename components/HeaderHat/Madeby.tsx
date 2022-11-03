import {
  Flex,
  FlexProps,
  Img,
  Link,
  Skeleton,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { FC } from 'react';
import { getTimeFromNow } from 'utils';

export const Madeby: FC<FlexProps> = props => {
  const { theme } = useDAO();
  const { delegates, isLoading, lastUpdate } = useDelegates();
  const variantImg = useBreakpointValue({
    base: useColorModeValue(
      '/images/karma_logo_black.svg',
      '/images/karma_logo_white.svg'
    ),
    md: '/images/karma_logo_white.svg',
  });
  return (
    <Flex
      flexDir="column"
      align={{ base: 'center', md: 'flex-start' }}
      justify={{ base: 'center', md: 'flex-start' }}
      {...props}
    >
      <Flex
        gap={{ base: '2', md: '0' }}
        flexDir={{ base: 'row', md: 'column' }}
        align={{ base: 'center', md: 'flex-start' }}
      >
        <Text
          fontSize={['sm', 'md']}
          fontWeight="normal"
          color={{ base: theme.hat.text.madeBy, md: theme.hat.text.primary }}
        >
          Made with ❤️ by
        </Text>

        <Link href="https://showkarma.xyz" isExternal>
          <Img
            w={['5.25rem', '8.75rem']}
            h={['1.35rem', '2.25rem']}
            objectFit="contain"
            src={variantImg}
          />
        </Link>
      </Flex>
      {delegates.length > 0 && (
        <Flex
          flexDir="row"
          gap="1"
          justifyContent="end"
          color={{
            base: theme.hat.text.lastUpdated,
            md: theme.hat.text.secondary,
          }}
          fontSize="xs"
        >
          <Text>Data updated</Text>
          {isLoading ? (
            <Skeleton w="16" h="5">
              00 hours ago
            </Skeleton>
          ) : (
            <Text>{getTimeFromNow(lastUpdate)}</Text>
          )}
        </Flex>
      )}
    </Flex>
  );
};
