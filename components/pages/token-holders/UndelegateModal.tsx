import { DelegateModalBody } from 'components/Modals/Delegate/DelegateModalBody';
import { DelegateModalHeader } from 'components/Modals/Delegate/DelegateModalHeader';
import { TrackBadge } from 'components/DelegationPool/TrackBadge';
import { useDAO, useDelegates, useWallet } from 'contexts';
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalContent,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { NumberIsh } from 'types';
import { IActiveDelegatedTracks, moonriverActiveDelegatedTracks } from 'utils';
import { useMixpanel, useToasty } from 'hooks';
// eslint-disable-next-line import/no-extraneous-dependencies
import { writeContract, waitForTransaction } from '@wagmi/core';
import { IBulkUndelegatePayload } from 'utils/moonbeam/moonriverUndelegateAction';
import { handleError } from 'utils/handleWriteError';
import { StyledButton } from 'components/HeaderHat';

export const UndelegateModal: React.FC = () => {
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;

  const { tracks } = useDelegates();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { mixpanel } = useMixpanel();
  const { openConnectModal, openChainModal, chain, isConnected, address } =
    useWallet();

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
      return openChainModal && openChainModal();
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
                  <Text color={theme.text}>
                    Select tracks you want to undelegate from:
                  </Text>
                  {tracks
                    .filter(track =>
                      tracksDelegated.some(
                        delegatedTrack => +delegatedTrack.trackId === +track.id
                      )
                    )
                    .map(track => (
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
                        <Text mb={2}>
                          Delegate:{' '}
                          {
                            tracksDelegated.find(td => td.trackId === track.id)
                              ?.toDelegate
                          }
                        </Text>
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
                      </Flex>
                    ))}
                  <Box textAlign="center" py={3}>
                    <Button
                      mt={5}
                      background={theme.branding}
                      color={theme.buttonText}
                      disabled={selectedTracks.length === 0}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </Box>
                </>
              ) : (
                <Text color={theme.text}>
                  You have no active delegations or locked tokens.
                </Text>
              )}
            </DelegateModalBody>
          </Box>
        </ModalContent>
      </Modal>
      <StyledButton onClick={handleOnClick} background="transparent">
        Undelegate
      </StyledButton>
    </>
  );
};
