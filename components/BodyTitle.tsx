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
import { TbExternalLink } from 'react-icons/tb';
import { Filters } from './Filters';
import { ClearButton } from './Filters/ClearButton';
import { GradientBall } from './GradientBall';
import { Madeby } from './HeaderHat/Madeby';

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

export const BodyTitle: FC = () => {
  const { delegates, isLoading, isSearchDirty, delegateCount } = useDelegates();
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;
  const [showHeaderText, setShowHeaderText] = useState(true);

  const hideHeaderText = () => {
    setShowHeaderText(false);
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
          py={['2', '3.75rem']}
          w="full"
        >
          <Flex
            position="relative"
            textAlign="start"
            align="flex-start"
            justify="flex-start"
            flexDir="row"
            w="100%"
            bgColor={theme.collapse.bg}
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
              <Text
                color={theme.collapse.text}
                textAlign={{ base: 'start' }}
                fontSize={{ base: 'lg', sm: '2xl', md: '3xl' }}
                lineHeight="9"
                fontWeight="600"
                fontFamily="body"
              >
                {config.DAO_DESCRIPTION}
              </Text>
              <Text
                color={theme.collapse.subtext}
                fontSize={{ base: 'md', md: 'xl' }}
                textAlign={{ base: 'start' }}
                fontWeight="light"
                fontFamily="heading"
                pt={{ base: '4', md: '0' }}
                pb={{ base: '8', md: '0' }}
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
                      px="6"
                      py={{ base: '6', lg: '4' }}
                      justifyContent={{ base: 'space-between', lg: 'center' }}
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
                      w={{ base: 'full', md: 'max-content' }}
                    >
                      View discussion
                      <Icon
                        as={TbExternalLink}
                        ml="2.5"
                        boxSize={{ base: '5', lg: '4' }}
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
                    px="6"
                    py={{ base: '6', lg: '4' }}
                    color={theme.collapse.text}
                    justifyContent={{ base: 'space-between', lg: 'center' }}
                    borderRadius="base"
                    fontSize="md"
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
                      boxSize={{ base: '5', lg: '4' }}
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
  );
};
