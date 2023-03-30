import {
  Flex,
  Img,
  Text,
  Icon,
  useClipboard,
  SkeletonCircle,
  Skeleton,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { ExpandIcon, PlayIcon } from 'components/Icons';
import { ImgWithFallback } from 'components/ImgWithFallback';
import { useDAO, useTokenHolders } from 'contexts';
import { useToasty } from 'hooks';
import { FC, useMemo, useState } from 'react';
import { IoCopy } from 'react-icons/io5';
import { formatNumber, truncateAddress } from 'utils';
import { TopHoldersModal } from './TopHoldersModal';

interface IHolders {
  position: number;
  nameOrAddress: string;
  address: string;
  tokensDelegated: number | string;
  picture?: string;
  wallets: string[];
}

export const TopHoldersList: FC = () => {
  const { theme } = useDAO();
  // const { onCopy, setValue, value } = useClipboard('');
  const { toast } = useToasty();
  // const [isCopying, setIsCopying] = useState(false);
  const {
    getTopHolders,
    isFetchingTopHolders: isFetching,
    changeSelectedAddress,
  } = useTokenHolders();
  const [holders, setHolders] = useState<IHolders[]>([]);

  const {
    isOpen: mobileModalOpen,
    onClose: mobileModalOnClose,
    onOpen: mobileModalOnOpen,
  } = useDisclosure();

  const topHolders = getTopHolders();

  const formatHolders = () => {
    const formattedHolders: IHolders[] = [];
    if (!topHolders?.length) return;
    topHolders.forEach((holder, index) =>
      formattedHolders.push({
        position: index + 1,
        nameOrAddress: holder.ensName || truncateAddress(holder.publicAddress),
        address: holder.publicAddress,
        tokensDelegated: 0,
        picture: holder.profilePicture,
        wallets: holder.wallets,
      })
    );
    setHolders(formattedHolders);
  };

  useMemo(() => {
    formatHolders();
  }, [topHolders]);

  const selectHolder = (wallets: string[]) => {
    changeSelectedAddress(wallets);
  };

  // const handleCopy = () => {
  //   onCopy();
  //   toast({
  //     title: 'Copied to clipboard',
  //     description: 'Address copied',
  //     duration: 3000,
  //   });
  // };

  // useMemo(() => {
  //   if (value && isCopying) handleCopy();
  // }, [value, isCopying]);

  const skeletonArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <>
      <Flex
        display={{ base: 'none', lg: 'flex' }}
        borderLeftWidth="1.5px"
        borderLeftColor={theme.tokenHolders.border}
        borderLeftStyle="solid"
        borderRightWidth="1.5px"
        borderRightColor={theme.tokenHolders.border}
        borderRightStyle="solid"
        w="max-content"
        flexDir="column"
        h="max-content"
      >
        <Flex
          borderBottomWidth="1.5px"
          borderBottomColor={theme.tokenHolders.border}
          borderBottomStyle="solid"
          px="8"
          py="6"
        >
          <Text
            fontFamily="Poppins"
            fontWeight={600}
            fontSize={{ base: '18px', lg: '20px', xl: '24px' }}
            color={theme.tokenHolders.delegations.text.primary}
            w="max-content"
          >
            Top 10 tokenholders
          </Text>
        </Flex>
        <Flex flexDir="column" h="max-content">
          {isFetching
            ? skeletonArray.map((_, index) => (
                <Flex
                  flexDir="row"
                  key={+index}
                  px="6"
                  py="6"
                  gap="2"
                  _odd={{
                    background: theme.tokenHolders.list.bg.primary,
                  }}
                  _even={{
                    background: theme.tokenHolders.list.bg.secondary,
                  }}
                  align="flex-start"
                >
                  <Skeleton h="8">
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      w="6"
                      color={theme.tokenHolders.list.text.primary}
                    >
                      SkeletonText
                    </Text>
                  </Skeleton>

                  <SkeletonCircle
                    boxSize="30px"
                    borderRadius="full"
                    minH="30px"
                    minW="30px"
                  />
                  <Flex flexDir="column">
                    <Skeleton>
                      <Text
                        fontWeight="medium"
                        fontSize="md"
                        color={theme.tokenHolders.list.text.primary}
                      >
                        SkeletonText
                      </Text>
                    </Skeleton>
                    <Flex
                      align="center"
                      justify="flex-start"
                      gap="1"
                      w="max-content"
                      mt="2"
                    >
                      <Skeleton>
                        <Text
                          fontWeight="medium"
                          fontSize="md"
                          color={theme.tokenHolders.list.text.secondary}
                        >
                          SkeletonText
                        </Text>
                      </Skeleton>
                      <SkeletonCircle
                        color={theme.tokenHolders.list.text.secondary}
                        boxSize="4"
                      />
                    </Flex>
                  </Flex>
                </Flex>
              ))
            : holders.map((holder, index) => (
                <Flex
                  flexDir="row"
                  key={+index}
                  px={{ base: '2', xl: '6' }}
                  py="6"
                  gap="2"
                  _odd={{
                    background: theme.tokenHolders.list.bg.primary,
                  }}
                  _even={{
                    background: theme.tokenHolders.list.bg.secondary,
                  }}
                  align="flex-start"
                  cursor="pointer"
                  onClick={() =>
                    selectHolder(
                      holder.wallets.length ? holder.wallets : [holder.address]
                    )
                  }
                >
                  <Text
                    fontWeight="bold"
                    fontSize="lg"
                    w="6"
                    color={theme.tokenHolders.list.text.primary}
                  >
                    {holder.position}.
                  </Text>
                  <ImgWithFallback
                    fallback={holder.nameOrAddress}
                    src={holder.picture}
                    boxSize="30px"
                    borderRadius="full"
                    objectFit="cover"
                    minH="30px"
                    minW="30px"
                  />
                  <Flex flexDir="column">
                    <Text
                      fontWeight="medium"
                      fontSize="md"
                      color={theme.tokenHolders.list.text.primary}
                    >
                      {holder.nameOrAddress}
                    </Text>
                    <Flex
                      align="center"
                      justify="flex-start"
                      gap="1"
                      // cursor="pointer"
                      // onClick={() => {
                      //   setIsCopying(true);
                      //   setValue(holder.address);
                      // }}
                      w="max-content"
                    >
                      <Text
                        fontWeight="medium"
                        fontSize="md"
                        color={theme.tokenHolders.list.text.secondary}
                      >
                        {truncateAddress(holder.address)}
                      </Text>
                      {/* <Icon
                      as={IoCopy}
                      color={theme.tokenHolders.list.text.secondary}
                      boxSize="4"
                    /> */}
                    </Flex>
                    {holder.tokensDelegated ? (
                      <Flex
                        align="center"
                        justify="center"
                        gap="0"
                        w="max-content"
                      >
                        <Text
                          fontWeight="medium"
                          fontSize="md"
                          color={theme.tokenHolders.list.text.secondary}
                          mr="1"
                        >
                          Tokens Delegated:
                        </Text>
                        <Text
                          fontWeight="medium"
                          fontSize="md"
                          color={theme.tokenHolders.list.text.primary}
                          mr="9px"
                        >
                          {formatNumber(holder.tokensDelegated)}
                        </Text>
                        <PlayIcon
                          color={theme.tokenHolders.list.text.secondary}
                          boxSize="18px"
                          cursor="pointer"
                          // onClick={() => {}}
                        />
                      </Flex>
                    ) : null}
                  </Flex>
                </Flex>
              ))}
        </Flex>
      </Flex>

      <Flex
        display={{ base: 'flex', lg: 'none' }}
        w="max-content"
        h="max-content"
        position="fixed"
        bottom="0"
        left="50%"
        transform="translate(-50%,0)"
        zIndex="3"
      >
        <Button
          color={theme.tokenHolders.delegations.text.primary}
          bg={theme.tokenHolders.delegations.bg.primary}
          borderBottomRadius="none"
          display="flex"
          flexDir="row"
          alignItems="center"
          justifyContent="center"
          boxShadow="0px 0px 20px rgba(0, 0, 0, 0.5)"
          onClick={mobileModalOnOpen}
          _active={{}}
          _hover={{}}
          _focus={{}}
          _focusWithin={{}}
          _focusVisible={{}}
        >
          <Text fontWeight="800" fontSize="14px">
            Top 10{' '}
            <Text fontWeight="600" fontSize="14px" as="span">
              tokenholders
            </Text>
          </Text>

          <ExpandIcon boxSize="12px" ml="2" />
        </Button>
        <TopHoldersModal
          isOpen={mobileModalOpen}
          onClose={mobileModalOnClose}
          data={holders}
        />
      </Flex>
    </>
  );
};
