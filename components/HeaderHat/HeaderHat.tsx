import {
  Button,
  Flex,
  Icon,
  Img,
  Link,
  Skeleton,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { getTimeFromNow } from 'utils';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';

export const HeaderHat = () => {
  const { daoInfo, theme } = useDAO();
  const { delegates, isLoading, lastUpdate } = useDelegates();
  const { config } = daoInfo;
  const { toggleColorMode } = useColorMode();
  return (
    <Flex
      bgColor={theme.headerBg}
      py="4"
      w="100%"
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
        <Flex flexDir="column">
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
        <Flex flexDir="row" gap="8" align="center">
          <Button
            onClick={toggleColorMode}
            _hover={{ opacity: 0.9 }}
            _active={{}}
            _focus={{}}
            _focusWithin={{}}
            bgColor="transparent"
            color={theme.themeIcon}
          >
            <Icon
              as={useColorModeValue(BsFillMoonFill, BsFillSunFill)}
              w="5"
              h="5"
            />
          </Button>
          <Flex flexDir="column" align="start">
            <Text
              fontSize={['sm', 'md']}
              fontWeight="normal"
              color={theme.hat.text.primary}
            >
              Made with ❤️ by
            </Text>

            <Link href="https://showkarma.xyz" isExternal>
              <Img
                w={['5.25rem', '8.75rem']}
                h={['1.35rem', '2.25rem']}
                objectFit="contain"
                src="/images/karma_logo.svg"
              />
            </Link>
            {delegates.length > 0 && (
              <Flex
                flexDir="row"
                gap="1"
                justifyContent="end"
                color={theme.hat.text.secondary}
              >
                <Text fontSize="xs">Data updated</Text>
                {isLoading ? (
                  <Skeleton w="16" h="5">
                    00 hours ago
                  </Skeleton>
                ) : (
                  <Text fontSize="xs">{getTimeFromNow(lastUpdate)}</Text>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
