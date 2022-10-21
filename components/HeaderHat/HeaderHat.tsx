import { Flex, Img, Text } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { Madeby } from './Madeby';
import { ThemeButton } from './ThemeButton';

export const HeaderHat = () => {
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;
  return (
    <Flex
      bgColor={theme.headerBg}
      py="4"
      w="full"
      align="center"
      justify="center"
      px={['4', '16']}
      zIndex="2"
    >
      <Flex
        w={{ base: 'full', '2xl': '1360px' }}
        flexDir="row"
        justify="space-between"
        gap="4"
        flexWrap="wrap"
      >
        <Flex
          flexDir="column"
          flex={['1', 'none']}
          align={['center', 'flex-start']}
        >
          <Img w="36" h="10" objectFit="contain" src={config.DAO_LOGO} />
          <Text
            w="max-content"
            fontWeight="semibold"
            fontSize={['lg', '2xl']}
            color={theme.hat.text.primary}
          >
            Delegates Dashboard
          </Text>
        </Flex>
        <Flex
          flexDir="row"
          gap="2"
          h="full"
          w={['min-content', 'max-content']}
          position={{ base: 'absolute', md: 'unset' }}
          right={{ base: '4', md: 'unset' }}
          top={{ base: '6', md: 'unset' }}
        >
          <ThemeButton />
          <Madeby display={{ base: 'none', md: 'flex' }} />
        </Flex>
      </Flex>
    </Flex>
  );
};
