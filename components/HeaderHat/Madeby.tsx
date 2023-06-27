import {
  Flex,
  FlexProps,
  Img,
  Link,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC } from 'react';

export const Madeby: FC<FlexProps> = () => {
  const { theme } = useDAO();
  const variantImg = useBreakpointValue({
    base: useColorModeValue(
      theme.headerBg === '#FFFFFF'
        ? '/images/karma_logo_black.svg'
        : '/images/karma_logo_white.png',
      '/images/karma_logo_white.png'
    ),
  });
  return (
    <Flex
      gap={{ base: '2' }}
      flexDir={{ base: 'row' }}
      align={{ base: 'center' }}
      h="max-content"
      justify={{ base: 'center', lg: 'flex-start' }}
      py="0"
      flexWrap="wrap"
    >
      <Text
        fontSize={{ base: '9px', lg: 'md' }}
        fontWeight="normal"
        color={theme.hat.text.madeBy}
      >
        Powered by
      </Text>

      <Link href="https://karmahq.xyz" isExternal h="max-content">
        <Img
          w={{ base: '48px', lg: '48px' }}
          h={{ base: '14px', lg: '14px' }}
          objectFit="contain"
          src={variantImg}
        />
      </Link>
    </Flex>
  );
};
