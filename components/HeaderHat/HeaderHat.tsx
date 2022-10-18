import { Flex, Img, Skeleton, Text } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { getTimeFromNow } from 'utils';

export const HeaderHat = () => {
  const { daoInfo } = useDAO();
  const { delegates, isLoading, lastUpdate } = useDelegates();
  const { theme, config } = daoInfo;
  return (
    <Flex
      px={{ base: '0', lg: '136' }}
      bgColor={theme.headerBg}
      flexDir="row"
      justify="space-between"
      py="4"
    >
      <Flex flexDir="column">
        <Img w="36" h="10" objectFit="contain" src={config.DAO_LOGO} />
        <Text w="max-content" fontWeight="semibold" fontSize="2xl">
          DAO Reputation Tracker
        </Text>
      </Flex>
      <Flex flexDir="row">
        <Flex flexDir="column">
          <Text fontSize="md" fontWeight="normal">
            Data powered by
          </Text>

          <Img
            w="8.75rem"
            h="2.25rem"
            objectFit="contain"
            src="/images/karma_logo.svg"
          />
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
