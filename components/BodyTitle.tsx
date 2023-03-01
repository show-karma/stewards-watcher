import {
  Flex,
  Text,
  Link,
  Button,
  Skeleton,
  Icon,
  Collapse,
} from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { FC, useState } from 'react';
import { IDAOTheme } from 'types';
import { IoClose } from 'react-icons/io5';
import { TbExternalLink } from 'react-icons/tb';
import { getTimeFromNow } from 'utils';
import { Filters } from './Filters';
import { ClearButton } from './Filters/ClearButton';
import { SortBy } from './Filters/SortBy';

const DelegatesCounter: FC<{
  isLoading: boolean;
  isSearchDirty: boolean;
  theme: IDAOTheme;
  delegateCount?: number;
}> = ({ isLoading, isSearchDirty, theme, delegateCount = 0 }) => {
  const { delegates, lastUpdate } = useDelegates();
  if (isLoading) return <Skeleton w="40" h="6" />;

  return (
    <Flex align="center" w="full" justifyContent="flex-start">
      <Flex flexDir="column">
        <Text
          fontSize="lg"
          color={theme.text}
          w="max-content"
          align="center"
          textAlign="start"
        >
          {delegateCount} delegate{delegateCount > 1 && 's'}
        </Text>
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
            w="max-content"
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
      {isSearchDirty && <ClearButton />}
    </Flex>
  );
};

export const BodyTitle: FC = () => {
  const { isLoading, isSearchDirty, delegateCount } = useDelegates();
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;
  const [showHeaderText, setShowHeaderText] = useState(true);

  const hideHeaderText = () => {
    setShowHeaderText(false);
  };

  const getCustomDescription = () => {
    if (config.DAO_KARMA_ID === 'starknet') {
      return (
        <Text
          color={theme.collapse.text}
          textAlign={{ base: 'start' }}
          fontSize={{ base: 'lg', sm: '2xl' }}
          lineHeight="9"
          fontWeight="600"
          fontFamily="body"
        >
          Starknet delegates play a vital role in decentralizing the upgrade
          process for Starknet mainnet. Delegates vote to approve protocol
          upgrades before they go live on mainnet. Read more about delegate
          responsibilities{' '}
          <Link
            href="https://community.starknet.io/t/delegate-onboarding-announcement/4047"
            isExternal
            textDecor="underline"
          >
            here.
          </Link>
        </Text>
      );
    }
    return (
      <Text
        color={theme.collapse.text}
        textAlign={{ base: 'start' }}
        fontSize={{ base: 'lg', sm: '2xl' }}
        lineHeight="9"
        fontWeight="600"
        fontFamily="body"
      >
        {config.DAO_DESCRIPTION}
      </Text>
    );
  };

  return (
    <Flex
      flexDir="column"
      w={{ base: 'full', '2xl': '1360px' }}
      px={{ base: '4', lg: '0' }}
      zIndex="4"
      py={showHeaderText ? '0' : { base: '0', md: '2rem' }}
      align={{ base: 'center', md: 'flex-start' }}
    >
      <Collapse in={showHeaderText} style={{ width: '100%' }}>
        <Flex
          align="center"
          justify="space-between"
          flexWrap="wrap"
          py="6"
          w="full"
        >
          <Flex
            position="relative"
            textAlign="start"
            align="flex-start"
            justify="flex-start"
            flexDir="row"
            w="100%"
            bgColor={theme.collapse.bg || theme.card.background}
            px="4"
            borderRadius="md"
          >
            <Flex
              flexDir="column"
              gap="2"
              w="full"
              maxW={{ base: '100%', lg: '80%' }}
              py="5"
            >
              {getCustomDescription()}
              <Text
                color={theme.collapse.subtext}
                fontSize={{ base: 'md', md: 'xl' }}
                textAlign={{ base: 'start' }}
                fontWeight="light"
                fontFamily="heading"
                pt={{ base: '4', md: '0' }}
                pb={{ base: '8', md: '5px' }}
              >
                {config.DAO_SUBDESCRIPTION}
              </Text>
              <Flex
                alignItems={{ base: 'center' }}
                justifyContent={{ base: 'center', md: 'flex-start' }}
                gap={['4']}
                flexWrap="wrap"
                w="full"
              >
                {config.GOVERNANCE_FORUM && (
                  <Link
                    href={config.GOVERNANCE_FORUM}
                    isExternal
                    _hover={{}}
                    w={{ base: 'full', md: 'max-content' }}
                  >
                    <Button
                      px={{ base: '3', md: '6' }}
                      py={{ base: '4', md: '6' }}
                      justifyContent={{ base: 'space-between', lg: 'center' }}
                      borderRadius="base"
                      bgColor={theme.branding}
                      fontSize={{ base: 'sm', md: 'md' }}
                      fontFamily="heading"
                      color={theme.buttonText}
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
                      w={{ base: 'full', md: 'max-content' }}
                    >
                      View discussion
                      <Icon
                        as={TbExternalLink}
                        ml="2.5"
                        boxSize={{ base: '4', lg: '4' }}
                      />
                    </Button>
                  </Link>
                )}
                <Link
                  href={config.DAO_URL}
                  isExternal
                  _hover={{}}
                  w={{ base: 'full', md: 'max-content' }}
                >
                  <Button
                    px={{ base: '3', md: '6' }}
                    py={{ base: '4', md: '6' }}
                    color={theme.collapse.text}
                    justifyContent={{ base: 'space-between', lg: 'center' }}
                    borderRadius="base"
                    fontSize={{ base: 'sm', md: 'md' }}
                    fontFamily="heading"
                    background="none"
                    borderWidth="1px"
                    borderColor={theme.collapse.text}
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
                    w={{ base: 'full', md: 'max-content' }}
                  >
                    Learn more & Get Involved
                    <Icon
                      as={TbExternalLink}
                      ml="2.5"
                      boxSize={{ base: '4', lg: '4' }}
                    />
                  </Button>
                </Link>
              </Flex>
            </Flex>
            <Icon
              as={IoClose}
              w="6"
              h="6"
              color={theme.themeIcon}
              onClick={hideHeaderText}
              position="absolute"
              top={{ base: '3' }}
              right="3"
              cursor="pointer"
            />
          </Flex>
        </Flex>
      </Collapse>
      <Filters />
      <Flex
        flexDir={{ base: 'column', md: 'row' }}
        w="full"
        gap="6"
        justify="space-between"
        px="0"
        py="6"
      >
        <DelegatesCounter
          isLoading={isLoading}
          isSearchDirty={isSearchDirty}
          theme={theme}
          delegateCount={delegateCount}
        />
        <SortBy />
      </Flex>
    </Flex>
  );
};
