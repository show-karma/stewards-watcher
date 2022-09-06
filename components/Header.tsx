import { Flex, Img, Text, Link, Button } from '@chakra-ui/react';
import { GENERAL, THEME } from 'configs';
import { FC } from 'react';
import { removeLinkPrefix } from 'utils';

export const Header: FC = () => {
  const handledDAOUrl = removeLinkPrefix(GENERAL.DAO_URL);
  const capitalizedDAOUrl =
    handledDAOUrl.charAt(0).toUpperCase() + handledDAOUrl.slice(1);

  return (
    <Flex px={{ base: '4', lg: '140' }}>
      <Flex
        textAlign="start"
        w="full"
        align="flex-start"
        justify="flex-start"
        py={['2', '8']}
        flexDir="column"
        maxW="800"
        gap="2"
      >
        <Img w="36" h="20" src="/images/logo.svg" />
        <Text
          color={THEME.title}
          textAlign="start"
          fontSize={['1.8rem', '2rem']}
          lineHeight={['2rem', '3rem']}
          fontWeight="600"
        >
          {GENERAL.DAO_DESCRIPTION}
        </Text>
        <Text color={THEME.subtitle} fontSize={['lg', 'xl']} fontWeight="light">
          {GENERAL.DAO_SUBDESCRIPTION}
        </Text>
        <Flex gap={['4', '8']} my={['2', '8']} flexWrap="wrap">
          <Button
            px="6"
            py="4"
            borderRadius="base"
            bgColor={THEME.branding}
            fontSize="md"
            _hover={{
              bgColor: THEME.branding,
              opacity: 0.8,
            }}
            _focusVisible={{
              bgColor: THEME.branding,
              opacity: 0.8,
            }}
            _focusWithin={{
              bgColor: THEME.branding,
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
          <Button
            px="6"
            py="4"
            borderRadius="base"
            fontSize="md"
            background="none"
            borderWidth="1px"
            borderColor={THEME.buttonText}
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
        </Flex>
      </Flex>
    </Flex>
  );
};
