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
import { IDAOTheme, IDelegate } from 'types';
import { IoClose } from 'react-icons/io5';
import { ClearButton } from './Filters/ClearButton';
import { GradientBall } from './GradientBall';
import { Madeby } from './HeaderHat/Madeby';
import { Filters } from './Filters';

const DelegatesCounter: FC<{
  isLoading: boolean;
  isSearchDirty: boolean;
  theme: IDAOTheme;
  delegates: IDelegate[];
  delegateCount?: number;
}> = ({ isLoading, isSearchDirty, theme, delegates, delegateCount = 0 }) => {
  if (isLoading) return <Skeleton w="40" h="6" />;
  if (!isSearchDirty) return <Flex />;
  return (
    <Flex align="center">
      <Text fontSize="md" color={theme.text}>
        {delegateCount} delegate{delegateCount > 1 && 's'} found
      </Text>
      <ClearButton />
    </Flex>
  );
};

export const Header: FC = () => {
  const { delegates, isLoading, isSearchDirty, delegateCount } = useDelegates();
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;
  const [showHeaderText, setShowHeaderText] = useState(true);

  const hideHeaderText = () => {
    setShowHeaderText(false);
  };

  return (
    <>
      <Flex
        flexDir="column"
        w={{ base: 'full', '2xl': '1360px' }}
        px={{ base: '6', lg: '0' }}
        zIndex="4"
        py={showHeaderText ? '0' : { base: '0', md: '2rem' }}
        align={{ base: 'center', md: 'flex-start' }}
      >
        <Madeby display={{ base: 'flex', md: 'none' }} py="6" />
        <Collapse in={showHeaderText} style={{ width: '100%' }}>
          <Flex
            align="center"
            justify="space-between"
            flexWrap="wrap"
            py={['2', '3.75rem']}
            position="relative"
            w="full"
          >
            <Flex
              textAlign="start"
              w="full"
              align="flex-start"
              justify="flex-start"
              flexDir="column"
              maxW="800"
              gap="2"
            >
              <Text
                color={theme.title}
                textAlign={{ base: 'start' }}
                fontSize={{ base: 'lg', sm: '2xl' }}
                lineHeight={['8', '9']}
                fontWeight="600"
                fontFamily="body"
              >
                {config.DAO_DESCRIPTION}
              </Text>
              <Text
                color={theme.subtitle}
                fontSize={{ base: 'md', sm: 'xl' }}
                textAlign={{ base: 'start' }}
                fontWeight="light"
                fontFamily="heading"
                pt={{ base: '4', md: '0' }}
                pb={{ base: '8', md: '0' }}
              >
                {config.DAO_SUBDESCRIPTION}
              </Text>
            </Flex>
            <Flex
              alignItems={{ base: 'center' }}
              justifyContent={{ base: 'center', md: 'flex-start' }}
              gap={['4', '8']}
              mt={{ base: '2', sm: '4', md: '8' }}
              mb={{ base: '10' }}
              flexWrap="wrap"
            >
              {config.GOVERNANCE_FORUM && (
                <Link href={config.GOVERNANCE_FORUM} isExternal _hover={{}}>
                  <Button
                    px="6"
                    py="4"
                    borderRadius="base"
                    bgColor={theme.branding}
                    fontSize="md"
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
                  >
                    View discussion
                  </Button>
                </Link>
              )}
              <Link href={config.DAO_URL} isExternal _hover={{}}>
                <Button
                  px="6"
                  py="4"
                  color={theme.buttonTextSec}
                  borderRadius="base"
                  fontSize="md"
                  fontFamily="heading"
                  background="none"
                  borderWidth="1px"
                  borderColor={theme.buttonTextSec}
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
            <Icon
              as={IoClose}
              w="6"
              h="6"
              color={theme.themeIcon}
              onClick={hideHeaderText}
              position="absolute"
              top={{ base: '0', md: '8' }}
              right="0"
              cursor="pointer"
              display={{ base: 'none', md: 'flex' }}
            />
          </Flex>
        </Collapse>
        <Filters />
        <Flex flexDir="row" justify="space-between" p="6">
          <DelegatesCounter
            delegates={delegates}
            isLoading={isLoading}
            isSearchDirty={isSearchDirty}
            theme={theme}
            delegateCount={delegateCount}
          />
        </Flex>
      </Flex>
      <GradientBall background={theme.gradientBall} />
    </>
  );
};
