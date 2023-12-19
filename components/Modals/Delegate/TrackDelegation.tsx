/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo, useState } from 'react';
import { useDAO, useDelegates, useGovernanceVotes, useWallet } from 'contexts';
import {
  Button,
  Flex,
  FormControl,
  Input,
  Skeleton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { IDelegate, MultiChainResult } from 'types';
import { ImgWithFallback } from 'components/ImgWithFallback';
import makeBlockie from 'ethereum-blockies-base64';
import {
  ITrackBadgeProps,
  TrackBadge,
} from 'components/DelegationPool/TrackBadge';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useToasty } from 'hooks';
import { IActiveDelegatedTracks } from 'utils';
import { numberToWords } from 'utils/numberToWords';
import { DelegateModalHeader } from './DelegateModalHeader';
import { DelegateModalFooter } from './DelegateModalFooter';
import { DelegateModalBody } from './DelegateModalBody';
import { VotesToDelegate } from './VotesToDelegate';
import { ConvictionMenu } from './ConvictionMenu';

interface StepProps {
  handleModal: () => void;
  votes: MultiChainResult[];
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
  const { toast } = useToasty();
  // const { GET_LOCKED_TOKENS_ACTION } = daoInfo.config;
  const { addToDelegatePool, tracks: daoTracks } = useDelegates();
  const { address: delegator } = useWallet();
  const { symbol, loadedVotes } = useGovernanceVotes();

  const [isLoading, setIsLoading] = useState(true);
  const [conviction, setConviction] = useState<number | undefined>(undefined);
  const [tracksDelegated, setTracksDelegated] = useState<
    IActiveDelegatedTracks[]
  >([]);

  const getActiveDelegations = async () => {
    if (delegator && daoInfo.config.GET_ACTIVE_DELEGATIONS_ACTION) {
      try {
        setIsLoading(true);
        const foundTracks = await daoInfo.config.GET_ACTIVE_DELEGATIONS_ACTION(
          delegator,
          daoInfo.config.DAO_KARMA_ID
        );
        setTracksDelegated(foundTracks);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getActiveDelegations();
  }, []);

  const schema = yup
    .object({
      amount: yup
        .number()
        .typeError('Token amount must be a number.')
        .moreThan(0.1, 'You must delegate more than 0.1 tokens.')
        .max(
          +(votes?.[0]?.value || 0) - 0.1,
          'You do not have the specified number of tokens in your wallet.'
        )
        .required('Amount is required.'),
    })
    .required('Amount is required');
  type FormData = yup.InferType<typeof schema>;

  const voteValue =
    Number(votes?.[0]?.value || 0) - 0.1 >= 0.1 &&
    !Number.isNaN(Number(votes?.[0]?.value || 0))
      ? Number(votes?.[0]?.value || 0) - 0.1
      : 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: voteValue,
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

  // useEffect(() => {
  //   if (delegatedUser.tracks?.length && !selectedTracks.length)
  //     setSelectedTracks(
  //       delegatedUser.tracks.filter(track =>
  //         tracksDelegated.every(tr => tr.trackId !== track.id)
  //       )
  //     );
  // }, [tracksDelegated]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // updating token amount after loading votes
  useEffect(() => {
    if (watch('amount') === 0) {
      setValue('amount', voteValue);
    }
  }, [loadedVotes, votes?.[0]?.value]);

  if (!daoData) return null;

  const { name: daoName, socialLinks } = daoData;
  const { logoUrl } = socialLinks;

  const modalSpacing = {
    padding: '16px 32px',
  };

  const selectTrack = (track: ITrackBadgeProps['track']) => {
    if (
      daoInfo.config.BULK_DELEGATE_MAXSIZE &&
      selectedTracks.length >= daoInfo.config.BULK_DELEGATE_MAXSIZE
    ) {
      toast({
        title: 'Too many tracks',
        description: `You can only select ${numberToWords(
          daoInfo.config.BULK_DELEGATE_MAXSIZE
        )} track${
          daoInfo.config.BULK_DELEGATE_MAXSIZE > 1 ? 's' : ''
        } at a time.`,
        status: 'error',
      });

      return;
    }
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

  const disableButton =
    selectedTracks.length === 0 || !!errors.amount || conviction === undefined;

  const tooltipHint = () => {
    if (watch('amount') < 0.2)
      return 'You need at least 0.2 tokens to delegate';
    if (selectedTracks.length === 0)
      return 'You need select at least 1 track to delegate';
    if (conviction === undefined) return 'You must select a conviction.';
    return null;
  };

  const onSubmit = (data: FormData) => {
    if (!delegator || disableButton) return;
    setTimeout(() => scrollToTop(), 300);
    handleAddToDelegatePool(delegatedUser, data.amount);
  };

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

              {!loadedVotes ? (
                <Skeleton w="32" h="8" />
              ) : daoInfo.config.DELEGATION_CUSTOM_AMOUNT ? (
                <Flex
                  flexDirection="row"
                  alignItems="center"
                  gap="1"
                  paddingX="2"
                  paddingY="1"
                  borderRadius="5"
                  backgroundColor="rgba(217, 217, 217, 0.5)"
                >
                  <Input
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
                    type="text"
                  />
                  <Text
                    fontStyle="normal"
                    fontWeight="500"
                    fontSize="1.15em"
                    color="#000000"
                  >
                    {symbol?.[0]?.value || ''}
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
                  votes={votes[0].value}
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
                  >
                    {delegatedUser.ensName || delegatedUser.address}
                  </Text>
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
                      alreadyDelegated={tracksDelegated.some(
                        item => item.trackId === track.id
                      )}
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
              {conviction === undefined ? (
                <Text color="red.400" fontStyle="normal" fontSize="md" pb="4">
                  You must select a conviction.
                </Text>
              ) : undefined}
            </Flex>
            <Flex w="full" flexDir="row-reverse">
              <Tooltip label={tooltipHint()}>
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
            delegateInfo={delegatedUser}
            handleModal={handleModal}
            publicAddress={walletAddress}
          />
        </Flex>
      </FormControl>
    </form>
  );
};
