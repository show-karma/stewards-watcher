import React, { useState } from 'react';
import { useDAO, useDelegates } from 'contexts';
import { Button, Flex, Text } from '@chakra-ui/react';
import { IDelegate } from 'types';
import { ImgWithFallback } from 'components/ImgWithFallback';
import makeBlockie from 'ethereum-blockies-base64';
import {
  ITrackBadgeProps,
  TrackBadge,
} from 'components/DelegationPool/TrackBadge';
import { DelegateModalHeader } from './DelegateModalHeader';
import { DelegateModalFooter } from './DelegateModalFooter';
import { DelegateModalBody } from './DelegateModalBody';
import { ModalDelegateButton } from './ModalDelegateButton';
import { VotesToDelegate } from './VotesToDelegate';

interface StepProps {
  handleModal: () => void;
  votes: string;
  delegatedUser: IDelegate;
  walletAddress?: string;
}

export const TrackDelegation: React.FC<StepProps> = ({
  handleModal,
  votes,
  delegatedUser,
  walletAddress,
}) => {
  const { daoData } = useDAO();
  const { addToDelegatePool } = useDelegates();

  const { tracks } = delegatedUser;

  const [selectedTracks, setSelectedTracks] = useState<
    ITrackBadgeProps['track'][]
  >([]);

  if (!daoData) return null;

  const { name: daoName, socialLinks } = daoData;
  const { logoUrl } = socialLinks;

  const modalSpacing = {
    padding: '16px 32px',
  };

  const selectTrack = (track: ITrackBadgeProps['track']) => {
    setSelectedTracks(old => [...old, track]);
  };
  const removeTrack = (track: ITrackBadgeProps['track']) => {
    setSelectedTracks(old => old.filter(tr => tr !== track));
  };

  const handleAddToDelegatePool = (delegate: IDelegate) => {
    addToDelegatePool(delegate, selectedTracks, '0.1');
    handleModal();
  };

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
            You are delegating
          </Text>
          <Flex alignItems="center" justifyContent="space-between" flex="2">
            <VotesToDelegate
              logoUrl={logoUrl}
              daoName={daoName}
              votes={votes}
            />
            <Text fontStyle="normal" fontSize="14px" color="black">
              to
            </Text>
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
                >{`${delegatedUser.ensName || delegatedUser.address}`}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex gap="3" flexDir="column" mb="4">
          <Text
            fontStyle="normal"
            fontWeight="700"
            fontSize="16px"
            color="black"
          >
            Select tracks to delegate to
          </Text>
          <Flex flexDir="row" flexWrap="wrap" rowGap="2" columnGap="1">
            {tracks?.map(track => {
              const selected = !!selectedTracks.find(tr => tr.id === track.id);
              return (
                <TrackBadge
                  track={track}
                  key={track.id}
                  selected={selected}
                  onSelect={() => selectTrack(track)}
                  onRemove={() => removeTrack(track)}
                  styles={{
                    color: selected ? '#1DE9B6' : 'black',
                    borderColor: selected ? 'transparent' : 'black',
                    backgroundColor: selected ? 'black' : 'transparent',
                  }}
                />
              );
            })}
          </Flex>
        </Flex>
        <Flex w="full" flexDir="row-reverse">
          <Button
            bg="#000000"
            color="#1DE9B6"
            px="6"
            py="3"
            fontWeight="400"
            onClick={() => {
              if (delegatedUser) handleAddToDelegatePool(delegatedUser);
            }}
            _hover={{ opacity: 0.8 }}
            _active={{ opacity: 0.8 }}
            _focus={{ opacity: 0.8 }}
            _focusWithin={{ opacity: 0.8 }}
            _focusVisible={{ opacity: 0.8 }}
            disabled={selectedTracks.length === 0}
            isDisabled={selectedTracks.length === 0}
          >
            Continue
          </Button>
        </Flex>
      </DelegateModalBody>
      <DelegateModalFooter
        flexProps={{ ...modalSpacing }}
        delegateAddress={delegatedUser.address}
        publicAddress={walletAddress}
      />
    </Flex>
  );
};
