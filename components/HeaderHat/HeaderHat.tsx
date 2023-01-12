import {
  Button,
  Center,
  Divider,
  Flex,
  Img,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { DelegateVotesModal } from 'components/Modals/DelegateVotes';
import { useDAO } from 'contexts';
import { Madeby } from './Madeby';
import { ThemeButton } from './ThemeButton';

export const HeaderHat = () => {
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Flex flexDir="column" w="full">
      <Madeby display={{ base: 'flex', lg: 'none' }} />

      <Flex
        bgColor={theme.headerBg}
        py="4"
        w="full"
        align="center"
        justify="center"
        px={{ base: '4', lg: '16' }}
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
            flexDir="row"
            flex={['1', 'none']}
            align={{ base: 'center', lg: 'flex-start' }}
            gap="16"
            w="full"
          >
            <Flex
              flexDir="column"
              flex={['1', 'none']}
              align={['flex-start', 'flex-start']}
            >
              <Img
                w="auto"
                maxW="36"
                h="10"
                objectFit="contain"
                src={config.DAO_LOGO}
              />
              <Text
                w="max-content"
                fontWeight="semibold"
                fontSize={['lg', '2xl']}
                color={theme.hat.text.primary}
              >
                Delegate Dashboard
              </Text>
            </Flex>
            <Flex
              flexDir="row"
              alignItems="center"
              justify="space-between"
              w="full"
            >
              <Flex
                flexDir="row"
                gap="4"
                h="min-content"
                w={['min-content', 'max-content']}
                position={{ base: 'absolute', md: 'unset' }}
                right={{ base: '4', md: 'unset' }}
                top={{ base: '6', md: 'unset' }}
                alignItems="center"
              >
                <Flex
                  flexDir="row"
                  gap="4"
                  display={{ base: 'none', lg: 'flex' }}
                  alignItems="center"
                >
                  <Center height="60px" alignItems="center">
                    <Divider orientation="vertical" />
                  </Center>
                  <Madeby />
                </Flex>
              </Flex>
              <Flex
                justify="center"
                alignItems="center"
                height="100%"
                display={{ base: 'none', md: 'flex' }}
                gap="4"
              >
                <ThemeButton />
                <Button
                  bgColor="white"
                  color="black"
                  onClick={onToggle}
                  px="6"
                  py="4"
                  fontWeight="semibold"
                  border="1px solid white"
                  _active={{}}
                  _focus={{}}
                  _hover={{}}
                >
                  Delegate to Anyone
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <DelegateVotesModal isOpen={isOpen} onClose={onToggle} />
      </Flex>
    </Flex>
  );
};
