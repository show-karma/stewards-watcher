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
import { useDAO } from 'contexts';
import { FC } from 'react';

export const Madeby: FC<FlexProps> = props => {
  const { theme } = useDAO();
  const variantImg = useBreakpointValue({
    base: useColorModeValue(
      '/images/karma_logo_black.svg',
      '/images/karma_logo_white.png'
    ),
    md: useColorModeValue(
      theme.headerBg === '#FFFFFF'
        ? '/images/karma_logo_black.svg'
        : '/images/karma_logo_white.png',
      '/images/karma_logo_white.png'
    ),
  });
  return (
    <Flex
      align={{ base: 'center', lg: 'flex-start' }}
      justify={{ base: 'center', lg: 'flex-start' }}
      gap="2"
      py="0"
      {...props}
    >
      <Flex
        gap={{ base: '2' }}
        flexDir={{ base: 'row' }}
        align={{ base: 'center' }}
      >
        <Text
          fontSize={['sm', 'md']}
          fontWeight="normal"
          color={theme.hat.text.madeBy}
        >
          Powered by
        </Text>

        <Link href="https://karmahq.xyz" isExternal>
          <Img
            w={{ base: '96px', lg: '80px' }}
            h={{ base: '24px', lg: '35px' }}
            objectFit="contain"
            src={variantImg}
          />
        </Link>
      </Flex>
    </Flex>
  );
};
