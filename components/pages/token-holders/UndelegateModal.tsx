import { DelegateModalBody } from 'components/Modals/Delegate/DelegateModalBody';
import { DelegateModalHeader } from 'components/Modals/Delegate/DelegateModalHeader';
import { TrackBadge } from 'components/DelegationPool/TrackBadge';
import { useDAO, useDelegates, useWallet } from 'contexts';
import {
  Box,
  Button,
  ButtonProps,
  Flex,
  Modal,
  ModalContent,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { NumberIsh } from 'types';
import {
  formatNumber,
  IActiveDelegatedTracks,
  moonriverActiveDelegatedTracks,
  truncateAddress,
} from 'utils';
import { useMixpanel, useToasty } from 'hooks';
// eslint-disable-next-line import/no-extraneous-dependencies
import { writeContract, waitForTransaction } from '@wagmi/core';
import { IBulkUndelegatePayload } from 'utils/moonbeam/moonriverUndelegateAction';
import { handleError } from 'utils/handleWriteError';
import { useSwitchNetwork } from 'wagmi';

interface IUndelegateModalProps {
  buttonProps?: ButtonProps;
}

export const UndelegateModal: React.FC<IUndelegateModalProps> = ({
  buttonProps,
}) => {
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;

  const { tracks } = useDelegates();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { mixpanel } = useMixpanel();
  const { openConnectModal, chain, isConnected, address } = useWallet();

  const { toast } = useToasty();

  const [tracksDelegated, setTracksDelegated] = useState<
    IActiveDelegatedTracks[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<NumberIsh[]>([]);
  const [openModalAfterConnect, setOpenModalAfterConnect] = useState(false);

  const handleSelectTrack = (trackId: NumberIsh) => {
    const isSelected = selectedTracks.includes(trackId);
    if (isSelected) {
      const filteredTracks = selectedTracks.filter(item => item !== trackId);
      setSelectedTracks(filteredTracks);
    } else {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  };

  const handleRemoveTrack = (trackId: NumberIsh) => {
    const filteredTracks = selectedTracks.filter(item => item !== trackId);
    setSelectedTracks(filteredTracks);
  };

  const sameNetwork = chain?.id === config.DAO_CHAIN.id;

  const { switchNetwork } = useSwitchNetwork({
    chainId: config.DAO_CHAIN.id,
  });

  const handleOnClick = () => {
    mixpanel.reportEvent({
      event: 'undelegateButtonClick',
    });

    if (!isConnected) {
      setOpenModalAfterConnect(true);
      return openConnectModal?.();
    }

    if (chain && !sameNetwork) {
      setOpenModalAfterConnect(true);
      return switchNetwork?.();
    }

    return onOpen();
  };

  const getActiveDelegations = async () => {
    if (address) {
      try {
        setIsLoading(true);
        const foundTracks = await moonriverActiveDelegatedTracks(
          address,
          'moonriver'
        );
        setTracksDelegated(foundTracks);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const clearSucessfullUndelegations = () => {
    setTracksDelegated(
      tracksDelegated.filter(item => !selectedTracks.includes(item.trackId))
    );
    setSelectedTracks([]);
  };

  const handleSubmit = async () => {
    if (!selectedTracks.length) {
      toast({
        title: 'No tracks selected',
        description: 'Please select at least one track to undelegate',
        status: 'warning',
        duration: 5000,
      });
      return;
    }
    if (config.UNDELEGATE_ACTION && address) {
      const payload: IBulkUndelegatePayload = {
        tracks: tracks
          .filter(track => selectedTracks.includes(track.id))
          .map(track => {
            const curTrack = tracksDelegated.find(
              item => item.trackId === track.id
            );
            if (curTrack)
              return {
                trackId: track.id,
                amount: curTrack.amount || 0,
                active: curTrack.active,
                locked: curTrack.locked,
              };
            return null;
          })
          .filter(item => item !== null) as IActiveDelegatedTracks[],
        delegate: address,
      };
      try {
        setIsLoading(true);

        const hash = await config.UNDELEGATE_ACTION(payload, writeContract);
        await waitForTransaction({ hash });
        clearSucessfullUndelegations();
      } catch (error) {
        handleError(error, daoInfo, toast);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (openModalAfterConnect && isConnected && sameNetwork) {
      setOpenModalAfterConnect(false);
      onOpen();
    }
  }, [chain, sameNetwork, isConnected]);

  useEffect(() => {
    if (isOpen) getActiveDelegations();
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        aria-labelledby="delegate-modal-title"
        aria-describedby="delegate-modal-description"
        isCentered
      >
        <ModalContent maxW="max-content">
          <Box position="relative">
            {isLoading && (
              <Box
                position="absolute"
                top="0"
                borderRadius="xl"
                left="0"
                w="full"
                h="full"
                bg="rgba(255,255,255,0.5)"
                zIndex="1"
              >
                <Flex
                  width="full"
                  h="full"
                  align="center"
                  justify="center"
                  key="loading-spinner"
                >
                  <Spinner w="20" h="20" />
                </Flex>
              </Box>
            )}
            <DelegateModalHeader
              handleModal={onClose}
              flexProps={{ color: theme.text }}
              title="Undelegate and unlock your tokens"
            />
            <DelegateModalBody flexProps={{ px: 10, pb: 5 }}>
              {tracksDelegated.length > 0 ? (
                <>
                  <Text color={theme.text} mb="2">
                    Select tracks you want to undelegate from:
                  </Text>
                  {tracks
                    .filter(track =>
                      tracksDelegated.some(
                        delegatedTrack => +delegatedTrack.trackId === +track.id
                      )
                    )
                    .map(track => {
                      const lockTime: { [key: number]: number } = {
                        0: 0,
                        1: 1,
                        2: 2,
                        3: 4,
                        4: 8,
                        5: 16,
                        6: 32,
                      };

                      const trackFound = tracksDelegated.find(
                        trackToFind => trackToFind.trackId === track.id
                      );

                      const disabledCondition = trackFound
                        ? trackFound.timestamp * 1000 +
                            lockTime[+trackFound.conviction] * 86400000 >
                          Date.now()
                        : false;

                      return (
                        <Flex
                          mt={3}
                          pb={5}
                          key={track.id}
                          flexDirection="column"
                          __css={{
                            ':not(:last-of-type)': {
                              borderBottom: '1px solid',
                            },
                          }}
                        >
                          {trackFound && disabledCondition ? (
                            <Flex flexDir="column" gap="2">
                              <Flex flexDir="row" gap="1">
                                <Text
                                  color={theme.text}
                                  fontSize="sm"
                                  align="center"
                                >
                                  {daoInfo.config.TRACKS_DICTIONARY &&
                                  daoInfo.config.TRACKS_DICTIONARY[
                                    track.displayName
                                  ]
                                    ? daoInfo.config.TRACKS_DICTIONARY[
                                        track.displayName
                                      ].emoji
                                    : undefined}
                                </Text>
                                <Text color={theme.text} fontSize="md">
                                  {track.displayName}
                                </Text>
                              </Flex>
                              <Text color={theme.text} fontSize="sm">
                                You have {formatNumber(trackFound.amount)}{' '}
                                tokens locked with conviction{' '}
                                {trackFound.conviction}
                              </Text>
                            </Flex>
                          ) : (
                            <TrackBadge
                              track={{
                                id: track.id,
                                name: track.displayName,
                              }}
                              onRemove={removed => {
                                handleRemoveTrack(removed);
                              }}
                              onSelect={selected => {
                                handleSelectTrack(selected.id);
                              }}
                              selected={selectedTracks.some(
                                arr => arr === track.id
                              )}
                            />
                          )}
                        </Flex>
                      );
                    })}
                  <Box textAlign="center" py={3}>
                    <Button
                      mt={5}
                      background={theme.branding}
                      color={theme.buttonText}
                      disabled={selectedTracks.length === 0 || !selectedTracks}
                      isDisabled={
                        selectedTracks.length === 0 || !selectedTracks
                      }
                      onClick={handleSubmit}
                      _hover={{}}
                      _active={{}}
                    >
                      Submit
                    </Button>
                  </Box>
                </>
              ) : (
                <Text color={theme.text}>
                  Wallet account {truncateAddress(address || '')} has no active
                  delegations. <br />
                  Please make sure you are connected to the right wallet account
                </Text>
              )}
            </DelegateModalBody>
          </Box>
        </ModalContent>
      </Modal>
      <Button
        onClick={handleOnClick}
        background="transparent"
        _hover={{
          opacity: '0.6',
        }}
        fontWeight="300"
        px={{ base: '0', md: '3' }}
        justifyContent={{ base: 'flex-start', lg: 'center' }}
        fontSize={{ base: 'sm', lg: 'md' }}
        width={{ base: 'full', lg: 'auto' }}
        _active={{}}
        _focus={{}}
        _focusVisible={{}}
        _focusWithin={{}}
        {...buttonProps}
      >
        Undelegate
      </Button>
    </>
  );
};
