import React, { useEffect, useMemo, useState } from 'react';
import { useDAO, useDelegates, useGovernanceVotes, useWallet } from 'contexts';
import {
  Button,
  Flex,
  FormControl,
  NumberInput,
  NumberInputField,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { Hex, IDelegate } from 'types';
import { ImgWithFallback } from 'components/ImgWithFallback';
import makeBlockie from 'ethereum-blockies-base64';
import {
  ITrackBadgeProps,
  TrackBadge,
} from 'components/DelegationPool/TrackBadge';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DelegateModalHeader } from './DelegateModalHeader';
import { DelegateModalFooter } from './DelegateModalFooter';
import { DelegateModalBody } from './DelegateModalBody';
import { VotesToDelegate } from './VotesToDelegate';
import { ConvictionMenu } from './ConvictionMenu';

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
  const { daoData, daoInfo } = useDAO();
  const { GET_LOCKED_TOKENS_ACTION } = daoInfo.config;
  const { addToDelegatePool, tracks: daoTracks } = useDelegates();
  const { address: delegator } = useWallet();
  const { symbol } = useGovernanceVotes();
  const [conviction, setConviction] = useState<number | undefined>(undefined);

  const schema = yup
    .object({
      amount: yup
        .number()
        .typeError('Token amount must be a number.')
        .moreThan(0.1, 'You must delegate more than 0.1 tokens.')
        .max(
          +votes - 0.1,
          'You do not have the specified number of tokens in your wallet.'
        )
        .required('Amount is required.'),
    })
    .required('Amount is required');
  type FormData = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: Number(votes) - 0.1 || 0,
    },
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const tracks = useMemo(
    () =>
      daoTracks.map(track => ({
        name: track.displayName,
        id: track.id,
      })),
    [daoTracks]
  );

  const [selectedTracks, setSelectedTracks] = useState<
    ITrackBadgeProps['track'][]
  >([]);

  useEffect(() => {
    if (delegatedUser.tracks?.length && !selectedTracks.length)
      setSelectedTracks(delegatedUser.tracks);
  }, [tracks]);

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
    setSelectedTracks(old => old.filter(tr => tr.id !== track.id));
  };

  const selectConviction = (selectedConviction: number) => {
    setConviction(selectedConviction);
  };

  const handleAddToDelegatePool = (
    delegate: IDelegate,
    amountToDelegate: number
  ) => {
    if (delegator && conviction !== undefined && amountToDelegate) {
      addToDelegatePool(
        delegator,
        delegate,
        selectedTracks,
        conviction,
        amountToDelegate.toString()
      );
      handleModal();
    }
  };

  const onSubmit = (data: FormData) => {
    if (!delegator) return;
    handleAddToDelegatePool(delegatedUser, data.amount);
  };

  const disableButton =
    selectedTracks.length === 0 || !!errors.amount || conviction === undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.amount}>
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
              margin="0 0 0 0"
            >
              <Text
                fontStyle="normal"
                fontSize="14px"
                marginRight="3"
                color="black"
              >
                You are delegating
              </Text>
              {daoInfo.config.DELEGATION_CUSTOM_AMOUNT ? (
                <Flex
                  flexDirection="row"
                  alignItems="center"
                  gap="1"
                  paddingX="2"
                  paddingY="1"
                  borderRadius="5"
                  backgroundColor="rgba(217, 217, 217, 0.5)"
                >
                  <NumberInput>
                    <NumberInputField
                      placeholder="Enter an amount to delegate"
                      maxW="32"
                      h="max-content"
                      px="2"
                      color="black"
                      bgColor="gray.300"
                      fontSize="sm"
                      _placeholder={{
                        color: 'gray.800',
                      }}
                      {...register('amount')}
                    />
                  </NumberInput>
                  <Text
                    fontStyle="normal"
                    fontWeight="500"
                    fontSize="1.15em"
                    color="#000000"
                  >
                    {symbol}
                  </Text>
                  <ImgWithFallback
                    fallback={daoName}
                    src={logoUrl}
                    boxSize="20px"
                    borderRadius="full"
                  />
                </Flex>
              ) : (
                <VotesToDelegate
                  logoUrl={logoUrl}
                  daoName={daoName}
                  votes={votes}
                />
              )}
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
            <Text color="red.400" fontStyle="normal" fontSize="md" pb="4">
              {errors.amount?.message}
            </Text>
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
                  const selected = !!selectedTracks.find(
                    tr => tr.id === track.id
                  );
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
            <Flex flexDir="column" gap="1" w="full">
              <Text
                fontStyle="normal"
                fontWeight="700"
                fontSize="16px"
                color="black"
              >
                Select a conviction to this delegation
              </Text>
              {daoInfo.config.DELEGATION_CUSTOM_CONVICTION ? (
                <ConvictionMenu
                  selectConviction={selectConviction}
                  conviction={conviction}
                />
              ) : undefined}
            </Flex>
            <Flex w="full" flexDir="row-reverse">
              <Tooltip
                label={
                  watch('amount') < 0.2
                    ? 'You need at least 0.2 votes to delegate'
                    : null
                }
              >
                <Button
                  bg="#000000"
                  color="#1DE9B6"
                  px="6"
                  py="3"
                  fontWeight="400"
                  type="submit"
                  _hover={{ opacity: 0.8 }}
                  _active={{ opacity: 0.8 }}
                  _focus={{ opacity: 0.8 }}
                  _focusWithin={{ opacity: 0.8 }}
                  _focusVisible={{ opacity: 0.8 }}
                  _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                  disabled={disableButton}
                  isDisabled={disableButton}
                >
                  Continue
                </Button>
              </Tooltip>
            </Flex>
          </DelegateModalBody>
          <DelegateModalFooter
            flexProps={{ ...modalSpacing }}
            delegateAddress={delegatedUser.address}
            publicAddress={walletAddress}
          />
        </Flex>
      </FormControl>
    </form>
  );
};
