import { DelegateModalBody } from 'components/Modals/Delegate/DelegateModalBody';
import { DelegateModalHeader } from 'components/Modals/Delegate/DelegateModalHeader';
import { useDAO, useDelegates, useWallet } from 'contexts';
import {
  Box,
  Button,
  ButtonProps,
  Divider,
  Flex,
  Modal,
  ModalContent,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { NumberIsh } from 'types';
import { IActiveDelegatedTracks, truncateAddress } from 'utils';
import { useMixpanel, useToasty } from 'hooks';
// eslint-disable-next-line import/no-extraneous-dependencies
import { writeContract, waitForTransaction } from '@wagmi/core';
import { IBulkUndelegatePayload } from 'utils/moonbeam/moonriverUndelegateAction';
import { handleError } from 'utils/handleWriteError';
import { useSwitchNetwork } from 'wagmi';
import { UndelegateItems } from './UndelegateItems';

export const convictionLockTime: { [key: number]: number } = {
  0: 0,
  1: 1,
  2: 2,
  3: 4,
  4: 8,
  5: 16,
  6: 32,
};

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
    if (
      config.BULK_DELEGATE_MAXSIZE &&
      selectedTracks.length >= config.BULK_DELEGATE_MAXSIZE
    ) {
      toast({
        title: 'Too many choices',
        description: `You can only undelegate ${config.BULK_DELEGATE_MAXSIZE} track at a time.`,
        status: 'error',
      });
      return;
    }
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
  const sameNetwork = !!config.DAO_CHAINS.find(
    chainToSearch => chainToSearch.id === chain?.id
  )?.id;

  const { switchNetwork } = useSwitchNetwork({
    chainId: config.DAO_CHAINS[0].id,
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
    const { GET_ACTIVE_DELEGATIONS_ACTION } = daoInfo.config;
    if (address && GET_ACTIVE_DELEGATIONS_ACTION) {
      try {
        setIsLoading(true);
        const foundTracks = await GET_ACTIVE_DELEGATIONS_ACTION(
          address,
          daoInfo.config.DAO_KARMA_ID
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

  const unlockableTracks = useMemo(
    () => tracksDelegated.filter(tr => tr.timestamp),
    [tracksDelegated]
  );

  const notUnlockableTracks = useMemo(
    () =>
      tracksDelegated.filter(
        tr =>
          tr.timestamp * 1000 + convictionLockTime[+tr.conviction] * 86400000 * 0 >
          Date.now()
      ),
    [tracksDelegated]
  );

  useEffect(() => {
    if (openModalAfterConnect && isConnected && sameNetwork) {
      setOpenModalAfterConnect(false);
      onOpen();
    }
  }, [chain, sameNetwork, isConnected]);

  useEffect(() => {
    if (isOpen) getActiveDelegations();
  }, [isOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('undelegateOpen', onOpen);
      return () => {
        window.removeEventListener('undelegateOpen', onOpen);
      };
    }

    return () => {
      // do nothing
    };
  }, []);

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
                  {unlockableTracks.length > 0 && (
                    <Box>
                      <Text color={theme.text} mb="10">
                        Select tracks you want to undelegate from:
                      </Text>

                      <UndelegateItems
                        tracksDelegated={unlockableTracks}
                        onRemoveTrack={handleRemoveTrack}
                        onSelectTrack={handleSelectTrack}
                        selectedTracks={selectedTracks}
                      />
                    </Box>
                  )}
                  {!!(
                    unlockableTracks.length && notUnlockableTracks.length
                  ) && <Divider my={5} />}
                  {notUnlockableTracks.length > 0 && (
                    <Box mt={3}>
                      <Text color={theme.text} mb="10">
                        Tokens not available for unlock/undelegate:
                      </Text>

                      <UndelegateItems
                        tracksDelegated={notUnlockableTracks}
                        onRemoveTrack={handleRemoveTrack}
                        onSelectTrack={handleSelectTrack}
                        selectedTracks={selectedTracks}
                      />
                    </Box>
                  )}
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
