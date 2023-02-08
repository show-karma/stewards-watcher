import { Flex, Text, Icon, Button, useDisclosure } from '@chakra-ui/react';
import { DiscordIcon, ForumIcon, TwitterIcon } from 'components';
import { useDAO, useDelegates } from 'contexts';
import { FC } from 'react';
import { useAccount } from 'wagmi';
import { TwitterModal } from '../Linking';

export const Handles: FC = () => {
  const { theme, daoInfo } = useDAO();
  const {
    isOpen: twitterIsOpen,
    onOpen: twitterOnOpen,
    onClose: twitterOnClose,
  } = useDisclosure();
  const { profileSelected } = useDelegates();

  const { address: publicAddress } = useAccount();

  const socialMedias = [
    {
      icon: TwitterIcon,
      name: 'Twitter',
      action: () => {
        twitterOnOpen();
      },
      handle: profileSelected?.twitterHandle
        ? `@${profileSelected?.twitterHandle}`
        : undefined,
    },
    {
      icon: ForumIcon,
      name: 'Forum',
      action: undefined,
      handle: profileSelected?.discourseHandle,
    },
    {
      icon: DiscordIcon,
      name: 'Discord',
      action: undefined,
    },
  ];

  const openTwitterModal = () =>
    twitterIsOpen ? twitterOnClose() : twitterOnOpen();

  return (
    <>
      <Flex
        flexDir="column"
        mt={{ base: '5', lg: '6' }}
        mb={{ base: '5', lg: '5' }}
      >
        <Text
          fontSize="2xl"
          fontWeight="medium"
          color={theme.modal.statement.sidebar.section}
        >
          Handles
        </Text>
        <Text
          fontSize="lg"
          fontWeight="normal"
          color={theme.modal.statement.sidebar.item.border}
        >
          Lorem ipsum dolor sit amet consectetur. Ut quis sed aliquam tortor
          sodales fermentum. Dapibus orolor porta etiam et eget erat
        </Text>
        <Flex flexDir="column" gap="4" py="6">
          {socialMedias.map((media, index) => (
            <Flex
              flexDir="row"
              key={+index}
              gap="3"
              align="center"
              color={theme.modal.statement.sidebar.section}
            >
              <Icon boxSize="6" as={media.icon} />
              <Text fontSize="lg" fontWeight="medium" w="20" mr="6">
                {media.name}
              </Text>
              {media.handle ? (
                <Text
                  px="4"
                  py="2"
                  borderWidth="1px"
                  borderColor={theme.modal.statement.sidebar.item}
                  w="60"
                >
                  {media.handle}
                </Text>
              ) : (
                <Button
                  onClick={media.action}
                  isDisabled={!media.name.includes('Twitter')}
                  disabled={!media.name.includes('Twitter')}
                  _disabled={{
                    opacity: 0.4,
                    cursor: 'not-allowed',
                  }}
                >
                  Link your {media.name} handle{' '}
                </Button>
              )}
            </Flex>
          ))}
        </Flex>
      </Flex>
      <TwitterModal open={twitterIsOpen} handleModal={openTwitterModal} />
    </>
  );
};
