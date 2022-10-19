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
import { Filters } from './Filters';
import { ClearButton } from './Filters/ClearButton';
import { GradientBall } from './GradientBall';

const DelegatesCounter: FC<{
  isLoading: boolean;
  isSearchDirty: boolean;
  theme: IDAOTheme;
  delegates: IDelegate[];
}> = ({ isLoading, isSearchDirty, theme, delegates }) => {
  if (isLoading) return <Skeleton w="40" h="6" />;
  if (!isSearchDirty) return <Flex />;
  return (
    <Flex align="center">
      <Text fontSize="md" color={theme.text}>
        {delegates.length} delegate{delegates.length > 1 && 's'} found
      </Text>
      <ClearButton />
    </Flex>
  );
};

export const Header: FC = () => {
  const { delegates, isLoading, isSearchDirty } = useDelegates();
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
        py={showHeaderText ? '0' : ['2', '3.75rem']}
      >
        <Collapse in={showHeaderText}>
          <Flex
            align="center"
            justify="space-between"
            flexWrap="wrap"
            py={['2', '3.75rem']}
            position="relative"
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
                textAlign="start"
                fontSize={['xl', '2xl']}
                lineHeight={['8', '9']}
                fontWeight="600"
                fontFamily="heading"
              >
                {config.DAO_DESCRIPTION}
              </Text>
              <Text
                color={theme.subtitle}
                fontSize={['lg', 'xl']}
                fontWeight="light"
              >
                {config.DAO_SUBDESCRIPTION}
              </Text>
            </Flex>
            <Flex gap={['4', '8']} my={['2', '8']} flexWrap="wrap">
              <Link href={config.GOVERNANCE_FORUM}>
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
              <Link href={config.DAO_URL}>
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
              top="8"
              right="0"
              cursor="pointer"
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
          />
        </Flex>
      </Flex>
      <GradientBall background={theme.gradientBall} />
    </>
  );
};
