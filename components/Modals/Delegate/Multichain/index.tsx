import React, { useState } from 'react';
import { useDAO, useDelegates, useGovernanceVotes, useWallet } from 'contexts';
import { Button, Checkbox, Flex, Image, Text } from '@chakra-ui/react';
import { IDelegate, MultiChainResult } from 'types';
import { ImgWithFallback } from 'components/ImgWithFallback';
import makeBlockie from 'ethereum-blockies-base64';
import { formatNumber, truncateAddress } from 'utils';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { useMixpanel, useToasty } from 'hooks';
// eslint-disable-next-line import/no-extraneous-dependencies
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { DelegateModalHeader } from '../DelegateModalHeader';
import { DelegateModalBody } from '../DelegateModalBody';

interface StepProps {
  handleModal: () => void;
  votes: MultiChainResult[];
  delegatedUser: IDelegate;
  walletAddress?: string;
}

export const MultiChain: React.FC<StepProps> = ({
  handleModal,
  votes,
  delegatedUser,
  walletAddress,
}) => {
  const { daoInfo, daoData } = useDAO();
  const { config } = daoInfo;
  const { delegatedBefore } = useGovernanceVotes();
  const [chainsToDelegate, setChainsToDelegate] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);

  const { isConnected } = useAccount();
  const { openConnectModal } = useWallet();
  const { delegatePoolList } = useDelegates();

  const { mixpanel } = useMixpanel();
  const { toast } = useToasty();

  const handleChainToDelegate = (chainId: number) => {
    if (chainsToDelegate.includes(chainId)) {
      setChainsToDelegate(chainsToDelegate.filter(ch => ch !== chainId));
      return;
    }
    setChainsToDelegate([...chainsToDelegate, chainId]);
  };

  const modalSpacing = {
    padding: '16px 32px',
  };

  const { switchNetworkAsync } = useSwitchNetwork();
  const { chain } = useNetwork();

  const delegate = async (chainId: number) => {
    const prepareConfig = await prepareWriteContract({
      address: config.DAO_DELEGATE_CONTRACT?.find(
        contract => contract.chain.id === chainId
      )?.contractAddress as `0x${string}`,
      functionName: daoInfo.config.DAO_DELEGATE_FUNCTION || 'delegate',
      args: [delegatedUser.address],
      abi: daoInfo.DELEGATE_ABI,
      chainId: chainsToDelegate[0],
    });

    mixpanel.reportEvent({
      event: 'delegateButtonClick',
    });

    await writeContract(prepareConfig).then(() => {
      const filteredChains = chainsToDelegate.filter(
        newChain => newChain !== chainsToDelegate[0]
      );
      setChainsToDelegate(filteredChains);
      if (filteredChains.length > 0) {
        // eslint-disable-next-line no-use-before-define
        multiChainDelegate();
      }
    });
  };

  const multiChainDelegate = async () => {
    if (!chainsToDelegate.length) return;
    try {
      setIsLoading(true);
      setIsDelegating(false);
      if (
        config.ALLOW_BULK_DELEGATE &&
        config.BULK_DELEGATE_MAXSIZE &&
        delegatePoolList.length > config.BULK_DELEGATE_MAXSIZE
      ) {
        toast({
          title: 'Too many delegates',
          description: `You can only delegate to ${config.BULK_DELEGATE_MAXSIZE} user at a time.`,
          status: 'error',
        });
      }

      if (!chain) {
        openConnectModal?.();
        return;
      }

      if (chain.id !== chainsToDelegate[0]) {
        await switchNetworkAsync?.(chainsToDelegate[0]).then(async ({ id }) => {
          await delegate(id);
        });
        return;
      }

      if (!config.DAO_DELEGATE_CONTRACT)
        throw new Error('No DELEGATE_CONTRACT in config');

      await delegate(chain.id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!daoData) return null;
  const { name: daoName, socialLinks } = daoData;
  const { logoUrl } = socialLinks;

  return (
    <Flex
      flexDir="column"
      width={['340px', '390px', '550px']}
      height="max-content"
      backgroundColor="white"
      borderRadius="6px"
    >
      <DelegateModalHeader handleModal={handleModal} />
      <DelegateModalBody
        flexProps={{
          ...modalSpacing,
          boxShadow: '0px 15px 10px rgba(0, 0, 0, 0.05)',
          paddingBottom: 7,
        }}
      >
        <Flex flex="1" flexDirection="column">
          <Flex
            flex="1"
            alignItems="center"
            flexWrap="wrap"
            gap="2"
            margin="0 0 23px 0"
          >
            <Text
              fontStyle="normal"
              fontSize="14px"
              marginRight="3"
              color="black"
            >
              You are delegating to
            </Text>
            <Flex alignItems="center" gap="4" flex="2">
              <Flex
                paddingX={2}
                paddingY={1}
                border="1px solid #ebedf0"
                boxSizing="border-box"
                borderRadius="6px"
                wordBreak="break-all"
                position="relative"
                background="#ebedf0"
                flexDirection="column"
              >
                <Flex
                  display="flex"
                  flexDirection="row"
                  gap="8px"
                  alignItems="center"
                >
                  <ImgWithFallback
                    fallback={daoName}
                    src={makeBlockie(
                      delegatedUser.ensName ||
                        delegatedUser.address ||
                        Math.random().toString()
                    )}
                    boxSize="20px"
                    borderRadius="full"
                  />
                  <Text
                    fontStyle="normal"
                    fontWeight="500"
                    fontSize="14px"
                    color="#000000"
                    textOverflow="ellipsis"
                    maxW={[100, 100, 130]}
                    whiteSpace="nowrap"
                    overflow="hidden"
                  >
                    {delegatedUser.ensName ||
                      truncateAddress(delegatedUser.address)}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex flexDir="column" gap="2" mb="6">
            {votes
              .filter(vote => +vote.value !== 0)
              .map((item, index) => {
                const before = delegatedBefore.find(
                  delegated => delegated.chain.id === item.chain.id
                )?.value;
                return (
                  <Flex
                    flexDir="row"
                    flexWrap="wrap"
                    key={+index}
                    alignItems="center"
                    gap="2"
                    backgroundColor="gray.100"
                    px="4"
                    py="2"
                    borderRadius="lg"
                    justifyContent="flex-start"
                  >
                    <Checkbox
                      defaultChecked={false}
                      isChecked={chainsToDelegate.includes(item.chain.id)}
                      onChange={() => handleChainToDelegate(item.chain.id)}
                      colorScheme="blue"
                      backgroundColor="gray.300"
                    />
                    <Image
                      src={`/images/chains/${item.chain.network}.svg`}
                      alt={item.chain.name}
                      boxSize="24px"
                      borderRadius="full"
                    />
                    <Text
                      color="black"
                      fontStyle="normal"
                      fontWeight="500"
                      fontSize="14px"
                    >
                      {item.chain.name}: {formatNumber(item.value)}{' '}
                      {before
                        ? `(currently delegating to: ${truncateAddress(
                            before
                          )})`
                        : ''}
                    </Text>
                  </Flex>
                );
              })}
          </Flex>
        </Flex>
        {/* <ModalDelegateButton
          delegated={delegatedUser.address}
          votes={votes[0].value}
        /> */}
        <Button
          disabled={chainsToDelegate.length === 0}
          isDisabled={chainsToDelegate.length === 0}
          bgColor="black"
          color="white"
          _focus={{ opacity: 0.8 }}
          _focusWithin={{ opacity: 0.8 }}
          _focusVisible={{ opacity: 0.8 }}
          _active={{ opacity: 0.8 }}
          _hover={{ opacity: 0.8 }}
          _disabled={{ opacity: 0.8 }}
          isLoading={isLoading}
          onClick={() => multiChainDelegate()}
        >
          Delegate
        </Button>
      </DelegateModalBody>
    </Flex>
  );
};
