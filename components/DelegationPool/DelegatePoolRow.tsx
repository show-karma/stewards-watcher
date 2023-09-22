import {
  Flex,
  FormControl,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import { ImgWithFallback } from 'components/ImgWithFallback';
import { useDAO, useDelegates, useGovernanceVotes } from 'contexts';
import { FC, useEffect, useMemo, useState } from 'react';
import {
  IActiveDelegatedTracks,
  IBulkDelegatePayload,
  truncateAddress,
} from 'utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ConvictionMenu } from 'components/Modals/Delegate/ConvictionMenu';
import { TrackBadge } from './TrackBadge';

interface IDelegatePoolRowProps {
  payload: IBulkDelegatePayload;
  onRemove: (address: string) => void;
  activeTracks: IActiveDelegatedTracks[];
}

export const DelegatePoolRow: FC<IDelegatePoolRowProps> = ({
  payload,
  onRemove,
  activeTracks = [],
}) => {
  const { daoInfo, theme, daoData } = useDAO();
  const { config } = daoInfo;
  const {
    addTrackToDelegateInPool,
    removeTrackFromDelegateInPool,
    tracks: daoTracks,
    changeAmountOfDelegation,
    changeConviction,
    setDelegationError,
  } = useDelegates();
  const { symbol, votes } = useGovernanceVotes();

  const tracks = useMemo(
    () =>
      daoTracks.map(track => ({
        name: track.displayName,
        id: track.id,
      })),
    [daoTracks]
  );

  const [conviction, setConviction] = useState<number | undefined>(
    payload.conviction !== undefined ? payload.conviction : undefined
  );

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
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: +payload.amount,
    },
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const selectConviction = (selectedConviction: number) => {
    changeConviction(payload.delegate.address, selectedConviction);
    setConviction(selectedConviction);
  };
  const amount = watch('amount');

  useEffect(() => {
    setDelegationError(!!errors.amount);
  }, [errors.amount]);

  useMemo(() => {
    changeAmountOfDelegation(payload.delegate.address, amount.toString());
  }, [amount]);

  return (
    <FormControl isInvalid={!!errors.amount}>
      <Flex
        __css={{
          ':not(:last-of-type)': {
            borderBottom: '#CED1D4 1px solid',
          },
        }}
        py={3}
        position="relative"
        w="full"
        color={theme.card.text.primary}
      >
        <Flex gap={3} align="center" flexWrap="wrap">
          <Flex>
            <ImgWithFallback
              h={['36px']}
              w={['36px']}
              borderRadius="full"
              src={
                payload.delegate.profilePicture ||
                `${config.IMAGE_PREFIX_URL}${payload.delegate.address}`
              }
              fallback={payload.delegate.address}
              cursor="pointer"
            />
          </Flex>
          <Flex fontWeight="bold" align="center">
            {payload.delegate.realName ||
              payload.delegate.ensName ||
              truncateAddress(payload.delegate.address)}
          </Flex>
          <Text>amount of</Text>
          <NumberInput>
            <NumberInputField
              placeholder="Enter an amount to delegate"
              maxW="32"
              h="max-content"
              px="2"
              color={theme.card.text.primary}
              bgColor="transparent"
              fontSize="md"
              _placeholder={{
                color: `${theme.card.text.primary}80`,
              }}
              border="none"
              borderBottom="1px solid"
              borderBottomColor={theme.card.text.primary}
              borderRadius="none"
              {...register('amount')}
            />
          </NumberInput>
          <Flex gap="1" align="center">
            {daoData ? (
              <ImgWithFallback
                fallback={daoData.name}
                src={daoData.socialLinks.logoUrl}
                boxSize="20px"
                borderRadius="full"
              />
            ) : null}
            <Text>{symbol?.[0]?.value || ''}</Text>
          </Flex>
          {tracks.length > 0 && (
            <>
              <Flex>for</Flex>
              <Flex gap={2} flexWrap="wrap">
                {tracks?.map(track => (
                  <TrackBadge
                    track={track}
                    key={track.id}
                    alreadyDelegated={activeTracks.some(
                      tr => tr.trackId === track.id
                    )}
                    selected={!!payload.tracks.find(tr => tr.id === track.id)}
                    onSelect={() =>
                      addTrackToDelegateInPool(track, payload.delegate.address)
                    }
                    onRemove={() =>
                      removeTrackFromDelegateInPool(
                        track.id,
                        payload.delegate.address
                      )
                    }
                  />
                ))}
              </Flex>
            </>
          )}
          <Text>with conviction of</Text>
          {daoInfo.config.DELEGATION_CUSTOM_CONVICTION ? (
            <ConvictionMenu
              selectConviction={selectConviction}
              conviction={conviction}
              menuButtonStyle={{
                borderColor: theme.card.text.primary,
                background: 'none',
                color: theme.card.text.primary,
                maxH: '8',
              }}
            />
          ) : null}
        </Flex>
        <Flex
          align="center"
          position="absolute"
          right="0"
          top="0"
          h="100%"
          cursor="pointer"
          fontSize={24}
          onClick={() => onRemove(payload.delegate.address)}
        >
          &times;
        </Flex>
      </Flex>
    </FormControl>
  );
};
