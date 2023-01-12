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
      flexDir={{ base: 'column', sm: 'row', lg: 'column' }}
      align={{ base: 'center', lg: 'flex-start' }}
      justify={{ base: 'center', lg: 'flex-start' }}
      gap="2"
      py={{ base: '2', lg: '0' }}
      {...props}
    >
      <Flex
        gap={{ base: '2', lg: '0' }}
        flexDir={{ base: 'row', lg: 'column' }}
        align={{ base: 'center', lg: 'flex-start' }}
      >
        <Text
          fontSize={['sm', 'md']}
          fontWeight="normal"
          color={{ base: theme.hat.text.madeBy, md: theme.hat.text.primary }}
        >
          Data powered by
        </Text>

        <Link href="https://showkarma.xyz" isExternal>
          <Img
            w={{ base: '96px', lg: '140px' }}
            h={{ base: '24px', lg: '35px' }}
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
          fontSize={{ base: 'sm', lg: 'xs' }}
        >
          <Text>Last updated</Text>
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
