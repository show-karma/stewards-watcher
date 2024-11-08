/* eslint-disable no-nested-ternary */
import {
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { ChakraLink } from 'components/ChakraLink';
import { FalseIcon } from 'components/Icons/Compensation/FalseIcon';
import { LinkIcon } from 'components/Icons/Compensation/LinkIcon';
import { TrueIcon } from 'components/Icons/Compensation/TrueIcon';
import { useAuth, useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { API_ROUTES, KARMA_API } from 'helpers';
import { useToasty } from 'hooks';
import debounce from 'lodash.debounce';
import dynamic from 'next/dynamic';
import pluralize from 'pluralize';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DelegateStatsBreakdown, DelegateStatsFromAPI } from 'types';
import { ProposalItem } from 'types/proposals';
import { formatDate } from 'utils';
import { getProposals } from 'utils/delegate-compensation/getProposals';
import { useQuery } from 'wagmi';
import * as yup from 'yup';

// eslint-disable-next-line import/no-extraneous-dependencies
const MDPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});
type Breakdown =
  DelegateStatsFromAPI['stats']['communicatingRationale']['breakdown'];

type ProposalAndBreakdownRow = ProposalItem &
  DelegateStatsBreakdown & {
    postId: string | undefined;
  };

interface DelegateProposalsProps {
  delegateVotes: Breakdown;
}

const schema = yup.object({
  communicatingRationale: yup.object({
    breakdown: yup.array(
      yup.object({
        proposal: yup.string().optional(),
        voted: yup.bool().optional(),
        modified: yup.bool().optional(),
        post: yup.string().url().optional(),
        validRationale: yup.bool().optional(),
      })
    ),
  }),
});

type FormData = yup.InferType<typeof schema>;

export const DelegateProposals = ({
  delegateVotes,
}: DelegateProposalsProps) => {
  const { selectedDate, delegateInfo, refreshDelegateInfo } =
    useDelegateCompensation();
  const { daoInfo, theme } = useDAO();
  const { authToken, isDaoAdmin: isAuthorized } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToasty();

  const [rationaleSelected, setRationaleSelected] = useState<
    ProposalAndBreakdownRow | undefined
  >(undefined);

  const {
    data: proposals,
    isLoading: proposalsLoading,
    isFetching: proposalsFetching,
  } = useQuery(
    [
      'delegate-compensation-proposals',
      selectedDate?.value.month,
      selectedDate?.value.year,
    ],
    () =>
      getProposals(
        daoInfo.config.DAO_KARMA_ID,
        selectedDate?.value.month as string | number,
        selectedDate?.value.year as string | number
      ).then(res =>
        res?.flatMap(category => category.items).filter(item => item.isValid)
      ),
    {
      enabled:
        !!selectedDate?.value.month &&
        !!selectedDate?.value.year &&
        !!daoInfo.config.DAO_KARMA_ID,
    }
  );

  const setupProposalsAndVotes = () => {
    if (!proposals) return [];
    return proposals?.map(proposal => {
      const getVote = () => {
        if (!delegateVotes) return undefined;
        const votesArray = Object.entries(delegateVotes);
        const findProposal = votesArray.find(([key]) =>
          proposal.type === 'snapshot'
            ? key.includes(proposal.id)
            : key.includes(proposal.name)
        );
        return {
          ...findProposal?.[1],
          proposal: findProposal?.[0],
        };
      };
      const delegateVote = getVote();
      return {
        ...proposal,
        ...delegateVote,
        postId: delegateVote?.proposal,
      } as ProposalAndBreakdownRow;
    });
  };

  const proposalsAndVotes: ProposalAndBreakdownRow[] =
    setupProposalsAndVotes() || [];

  const defaultValueBreakdown = proposalsAndVotes?.map(item => ({
    proposal: item.postId || (item.type === 'onChain' ? item.name : item.id),
    voted: item.voted,
    modified: false,
    post: item.post || undefined,
    validRationale: item.validRationale,
  }));

  const {
    register,
    formState,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      communicatingRationale: {
        breakdown: defaultValueBreakdown,
      },
    },
  });

  const onChangeDebounce = debounce((value: string, itemIndex: number) => {
    setValue(`communicatingRationale.breakdown.${itemIndex}.post`, value, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(`communicatingRationale.breakdown.${itemIndex}.modified`, true);
  }, 350);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSaving(true);
      const authorizedAPI = axios.create({
        timeout: 30000,
        baseURL: KARMA_API.base_url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: authToken ? `Bearer ${authToken}` : '',
        },
      });

      const breakdown: Record<string, DelegateStatsBreakdown> = {};
      const modifiedRows =
        data.communicatingRationale?.breakdown?.filter(
          item => item.modified && item.proposal
        ) || [];
      if (!modifiedRows.length) {
        return;
      }
      modifiedRows?.forEach(item => {
        breakdown[item.proposal as string] = {
          post: item.post,
          validRationale: item.validRationale,
        };
      });
      await authorizedAPI
        .put(
          API_ROUTES.DELEGATE.CHANGE_INCENTIVE_PROGRAM_STATS(
            daoInfo.config.DAO_KARMA_ID,
            delegateInfo?.id || ''
          ),
          {
            stats: {
              communicatingRationale: {
                breakdown,
              },
            },
          }
        )
        .then(() => {
          toast({
            title: 'Success',
            description: 'Successfully saved the Communication Rationale',
          });
          refreshDelegateInfo();
        });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error saving the Communication Rationale',
      });
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const onChainProposals = proposalsAndVotes?.filter(
    item => item.type === 'onChain'
  );
  const snapshotProposals = proposalsAndVotes?.filter(
    item => item.type === 'snapshot'
  );

  return (
    <Flex w="full" flexDir="column" gap="8">
      {/* do a modal for the rationale selected */}
      {rationaleSelected ? (
        <Modal
          isOpen={!!rationaleSelected}
          onClose={() => setRationaleSelected(undefined)}
        >
          <ModalOverlay />
          <ModalContent rounded="lg">
            <ModalHeader
              bg={theme.modal.background}
              textColor={theme.modal.statement.headline}
            >
              {rationaleSelected?.name}
            </ModalHeader>
            <ModalCloseButton textColor={theme.modal.statement.headline} />
            <ModalBody
              bg={theme.modal.background}
              textColor={theme.modal.statement.text}
              maxH="80vh"
              overflowY="auto"
            >
              <MDPreview source={rationaleSelected?.rationale || ''} />
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : null}

      {proposalsFetching || proposalsLoading ? (
        <Flex w="full" justify="center" align="center">
          <Spinner />
        </Flex>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex
            flexDir="column"
            gap="4"
            alignItems="flex-start"
            w="full"
            py="4"
          >
            <Flex flexDir="row" px="4" gap="4" alignItems="center" w="full">
              <Heading
                lineHeight="30px"
                size="md"
                color={theme.compensation?.card.text}
              >
                Snapshot Proposals
              </Heading>
              <Flex flexDir="row" gap="2" alignItems="center">
                <Text
                  fontSize="14px"
                  fontWeight={500}
                  color={theme.compensation?.card.text}
                >
                  {snapshotProposals?.length} Total{' '}
                  {pluralize('Proposal', snapshotProposals?.length || 0)}
                  {', '}
                  <Text
                    as="span"
                    fontSize="14px"
                    fontWeight={500}
                    color={theme.compensation?.card.success}
                  >
                    {snapshotProposals.filter(item => item.voted)?.length} Voted
                    On
                  </Text>
                </Text>
              </Flex>
            </Flex>
            <Flex
              flexDir="column"
              gap="4"
              maxH="320px"
              overflowY="auto"
              w="full"
            >
              <Table
                variant="simple"
                bg={theme.compensation?.card.bg}
                borderRadius="8px"
              >
                <Thead>
                  <Tr>
                    <Th
                      borderColor={theme.compensation?.card.divider}
                      color={theme.compensation?.card.text}
                      textTransform="none"
                      fontSize="14px"
                      fontWeight="700"
                    >
                      Proposal Name
                    </Th>

                    <Th
                      borderColor={theme.compensation?.card.divider}
                      color={theme.compensation?.card.text}
                      textTransform="none"
                      fontSize="14px"
                      fontWeight="700"
                    >
                      Date
                    </Th>

                    <Th
                      borderColor={theme.compensation?.card.divider}
                      color={theme.compensation?.card.text}
                      textTransform="none"
                      fontSize="14px"
                      fontWeight="700"
                    >
                      Voted
                    </Th>
                    <Th
                      borderColor={theme.compensation?.card.divider}
                      color={theme.compensation?.card.text}
                      textTransform="none"
                      fontSize="14px"
                      fontWeight="700"
                    >
                      CR
                    </Th>
                    <Th
                      borderColor={theme.compensation?.card.divider}
                      color={theme.compensation?.card.text}
                      textTransform="none"
                      fontSize="14px"
                      fontWeight="700"
                    >
                      Valid Rationale
                    </Th>
                    <Th
                      borderColor={theme.compensation?.card.divider}
                      color={theme.compensation?.card.text}
                      textTransform="none"
                      fontSize="14px"
                      fontWeight="700"
                    />
                  </Tr>
                </Thead>
                <Tbody>
                  {snapshotProposals?.map(item => {
                    const findProposal = proposalsAndVotes?.find(
                      proposal =>
                        proposal.postId === item.postId ||
                        proposal.id === item.id
                    );
                    if (!findProposal) return null;
                    const itemIndex = proposalsAndVotes.indexOf(findProposal);
                    return (
                      <Tr
                        opacity={
                          !watch(
                            `communicatingRationale.breakdown.${itemIndex}.validRationale`
                          )
                            ? 0.7
                            : 1
                        }
                        key={itemIndex}
                      >
                        <Td
                          color={theme.compensation?.card.text}
                          borderColor={theme.compensation?.card.divider}
                        >
                          <Flex
                            flexDirection="column"
                            justify="flex-start"
                            align="flex-start"
                            gap="2"
                          >
                            <Text color={theme.text} lineHeight="14px">
                              {item.name}
                              {item.name[0] === '#' ? '...' : ''}
                            </Text>
                            <Flex flexDir="row" gap="4" alignItems="center">
                              {item.link ? (
                                <ChakraLink
                                  display="flex"
                                  flexDir="row"
                                  gap="2"
                                  alignItems="center"
                                  justifyContent="center"
                                  href={item.link}
                                  isExternal
                                  color="blue.500"
                                  w="fit-content"
                                  _hover={{
                                    textDecoration: 'none',
                                    color: 'blue.400',
                                    borderColor: 'blue.400',
                                  }}
                                >
                                  See proposal
                                  <LinkIcon
                                    w="14px"
                                    h="14px"
                                    viewBox="0 0 18 18"
                                    mt="0.5"
                                  />
                                </ChakraLink>
                              ) : null}
                              {item.proposalTopic ? (
                                <ChakraLink
                                  display="flex"
                                  flexDir="row"
                                  gap="2"
                                  alignItems="center"
                                  justifyContent="center"
                                  href={item.proposalTopic}
                                  isExternal
                                  color="blue.500"
                                  w="fit-content"
                                  _hover={{
                                    textDecoration: 'none',
                                    color: 'blue.400',
                                    borderColor: 'blue.400',
                                  }}
                                >
                                  See Forum Link
                                  <LinkIcon
                                    w="14px"
                                    h="14px"
                                    viewBox="0 0 18 18"
                                    mt="0.5"
                                  />
                                </ChakraLink>
                              ) : null}
                            </Flex>
                          </Flex>
                        </Td>

                        <Td
                          color={theme.compensation?.card.text}
                          borderColor={theme.compensation?.card.divider}
                        >
                          <Text w="max-content">
                            {formatDate(item.endDate as string, 'MMM D, YYYY')}
                          </Text>
                        </Td>

                        <Td
                          color={theme.compensation?.card.text}
                          borderColor={theme.compensation?.card.divider}
                        >
                          {watch(
                            `communicatingRationale.breakdown.${itemIndex}.voted`
                          ) === true ? (
                            <TrueIcon
                              w="24px"
                              h="24px"
                              color={theme.compensation?.card.success}
                            />
                          ) : (
                            <FalseIcon
                              w="24px"
                              h="24px"
                              color={theme.compensation?.card.error}
                            />
                          )}
                        </Td>
                        <Td
                          color={theme.compensation?.card.text}
                          borderColor={theme.compensation?.card.divider}
                        >
                          <Flex
                            flexDir="row"
                            gap="3"
                            alignItems="center"
                            justify="flex-start"
                          >
                            {isAuthorized ? (
                              <Input
                                defaultValue={item.post || ''}
                                bg={theme.compensation?.card.input.bg}
                                color={theme.compensation?.card.input.text}
                                disabled={isSaving}
                                _active={{}}
                                _focus={{
                                  bg: theme.compensation?.card.input.bg,
                                }}
                                _focusVisible={{}}
                                _focusWithin={{}}
                                w="180px"
                                h="32px"
                                px="1"
                                border={
                                  formState.errors.communicatingRationale
                                    ?.breakdown?.[itemIndex]?.post
                                    ? '1px solid red'
                                    : 'none'
                                }
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  onChangeDebounce(
                                    event.target.value,
                                    itemIndex
                                  );
                                }}
                              />
                            ) : item.post ? (
                              <ChakraLink
                                href={item.post}
                                isExternal
                                color="blue.500"
                                maxW="180px"
                                wordBreak="break-all"
                              >
                                {item.post.length > 32
                                  ? `${item.post.slice(0, 32)}...`
                                  : item.post}
                              </ChakraLink>
                            ) : null}
                            {item.rationale ? (
                              <Flex
                                display="flex"
                                flexDir="row"
                                gap="1"
                                alignItems="center"
                                onClick={() => setRationaleSelected(item)}
                                cursor="pointer"
                                color="blue.500"
                                borderBottom="1px solid"
                                borderColor="blue.500"
                                w="max-content"
                                _hover={{
                                  textDecoration: 'none',
                                  color: 'blue.400',
                                  borderColor: 'blue.400',
                                }}
                              >
                                See
                              </Flex>
                            ) : (
                              <Flex width="24px" height="24px" />
                            )}
                          </Flex>
                        </Td>
                        <Td
                          color={theme.compensation?.card.text}
                          borderColor={theme.compensation?.card.divider}
                        >
                          {isAuthorized ? (
                            <Switch
                              isChecked={watch(
                                `communicatingRationale.breakdown.${itemIndex}.validRationale`
                              )}
                              onChange={() => {
                                setValue(
                                  `communicatingRationale.breakdown.${itemIndex}.validRationale`,
                                  !watch(
                                    `communicatingRationale.breakdown.${itemIndex}.validRationale`
                                  ),
                                  {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  }
                                );
                                setValue(
                                  `communicatingRationale.breakdown.${itemIndex}.modified`,
                                  true
                                );
                              }}
                              isDisabled={isSaving}
                              disabled={isSaving}
                            />
                          ) : watch(
                              `communicatingRationale.breakdown.${itemIndex}.validRationale`
                            ) ? (
                            <TrueIcon
                              w="24px"
                              h="24px"
                              color={theme.compensation?.card.success}
                            />
                          ) : (
                            <FalseIcon
                              w="24px"
                              h="24px"
                              color={theme.compensation?.card.error}
                            />
                          )}
                        </Td>
                        <Td
                          color={theme.compensation?.card.text}
                          borderColor={theme.compensation?.card.divider}
                        >
                          {item?.updated === 'manually' ? (
                            <Tooltip label="Manually updated">
                              <Flex
                                bg={theme.compensation?.card.input.bg}
                                p="1"
                                rounded="full"
                                width="24px"
                                height="24px"
                                alignItems="center"
                                justify="center"
                              >
                                <Text
                                  fontSize="small"
                                  color={theme.compensation?.card.text}
                                >
                                  M
                                </Text>
                              </Flex>
                            </Tooltip>
                          ) : (
                            <Flex width="24px" height="24px" />
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Flex>
          </Flex>
          <Flex
            flexDir="column"
            gap="4"
            alignItems="flex-start"
            w="full"
            mt="4"
            py="4"
          >
            <Flex flexDir="row" gap="4" alignItems="center" px="4" w="full">
              <Heading
                lineHeight="30px"
                size="md"
                color={theme.compensation?.card.text}
              >
                Onchain Proposals
              </Heading>
              <Flex flexDir="row" gap="2" alignItems="center">
                <Text
                  fontSize="14px"
                  fontWeight={500}
                  color={theme.compensation?.card.text}
                >
                  {onChainProposals?.length} Total{' '}
                  {pluralize('Proposal', onChainProposals?.length || 0)}
                  {', '}
                  <Text
                    as="span"
                    fontSize="14px"
                    fontWeight={500}
                    color={theme.compensation?.card.success}
                  >
                    {onChainProposals.filter(item => item.voted)?.length} Voted
                    On
                  </Text>
                </Text>
              </Flex>
            </Flex>
            <Flex
              flexDir="column"
              gap="4"
              maxH="320px"
              overflowY="auto"
              w="full"
            >
              <Table
                variant="simple"
                bg={theme.compensation?.card.bg}
                borderRadius="8px"
              >
                <Thead>
                  <Tr>
                    <Th
                      borderColor={theme.compensation?.card.divider}
                      color={theme.compensation?.card.text}
                      textTransform="none"
                      fontSize="14px"
                      fontWeight="700"
                    >
                      Proposal Name
                    </Th>

                    <Th
                      borderColor={theme.compensation?.card.divider}
                      color={theme.compensation?.card.text}
                      textTransform="none"
                      fontSize="14px"
                      fontWeight="700"
                    >
                      Date
                    </Th>

                    <Th
                      borderColor={theme.compensation?.card.divider}
                      color={theme.compensation?.card.text}
                      textTransform="none"
                      fontSize="14px"
                      fontWeight="700"
                    >
                      Voted
                    </Th>
                    <Th
                      borderColor={theme.compensation?.card.divider}
                      color={theme.compensation?.card.text}
                      textTransform="none"
                      fontSize="14px"
                      fontWeight="700"
                    >
                      CR
                    </Th>
                    <Th
                      borderColor={theme.compensation?.card.divider}
                      color={theme.compensation?.card.text}
                      textTransform="none"
                      fontSize="14px"
                      fontWeight="700"
                    >
                      Valid Rationale
                    </Th>
                    <Th
                      borderColor={theme.compensation?.card.divider}
                      color={theme.compensation?.card.text}
                      textTransform="none"
                      fontSize="14px"
                      fontWeight="700"
                    />
                  </Tr>
                </Thead>
                <Tbody>
                  {onChainProposals?.map(item => {
                    const findProposal = proposalsAndVotes?.find(
                      proposal => proposal.name === item.name
                    );
                    if (!findProposal) return null;
                    const itemIndex = proposalsAndVotes.indexOf(findProposal);
                    return (
                      <Tr
                        opacity={
                          !watch(
                            `communicatingRationale.breakdown.${itemIndex}.validRationale`
                          )
                            ? 0.7
                            : 1
                        }
                        key={itemIndex}
                      >
                        <Td
                          color={theme.compensation?.card.text}
                          borderColor={theme.compensation?.card.divider}
                        >
                          <Flex
                            flexDirection="column"
                            justify="flex-start"
                            align="flex-start"
                            gap="2"
                          >
                            <Text color={theme.text} lineHeight="14px">
                              {item.name}
                              {item.name[0] === '#' ? '...' : ''}
                            </Text>
                            <Flex flexDir="row" gap="4" alignItems="center">
                              {item.link ? (
                                <ChakraLink
                                  display="flex"
                                  flexDir="row"
                                  gap="2"
                                  alignItems="center"
                                  justifyContent="center"
                                  href={item.link}
                                  isExternal
                                  color="blue.500"
                                  w="fit-content"
                                  _hover={{
                                    textDecoration: 'none',
                                    color: 'blue.400',
                                    borderColor: 'blue.400',
                                  }}
                                >
                                  See proposal
                                  <LinkIcon
                                    w="14px"
                                    h="14px"
                                    viewBox="0 0 18 18"
                                    mt="0.5"
                                  />
                                </ChakraLink>
                              ) : null}
                              {item.proposalTopic ? (
                                <ChakraLink
                                  display="flex"
                                  flexDir="row"
                                  gap="2"
                                  alignItems="center"
                                  justifyContent="center"
                                  href={item.proposalTopic}
                                  isExternal
                                  color="blue.500"
                                  w="fit-content"
                                  _hover={{
                                    textDecoration: 'none',
                                    color: 'blue.400',
                                    borderColor: 'blue.400',
                                  }}
                                >
                                  See Forum Link
                                  <LinkIcon
                                    w="14px"
                                    h="14px"
                                    viewBox="0 0 18 18"
                                    mt="0.5"
                                  />
                                </ChakraLink>
                              ) : null}
                            </Flex>
                          </Flex>
                        </Td>

                        <Td
                          color={theme.compensation?.card.text}
                          borderColor={theme.compensation?.card.divider}
                        >
                          <Text w="max-content">
                            {formatDate(item.endDate as string, 'MMM D, YYYY')}
                          </Text>
                        </Td>

                        <Td
                          color={theme.compensation?.card.text}
                          borderColor={theme.compensation?.card.divider}
                        >
                          {watch(
                            `communicatingRationale.breakdown.${itemIndex}.voted`
                          ) === true ? (
                            <TrueIcon
                              w="24px"
                              h="24px"
                              color={theme.compensation?.card.success}
                            />
                          ) : (
                            <FalseIcon
                              w="24px"
                              h="24px"
                              color={theme.compensation?.card.error}
                            />
                          )}
                        </Td>
                        <Td
                          color={theme.compensation?.card.text}
                          borderColor={theme.compensation?.card.divider}
                        >
                          <Flex
                            flexDir="row"
                            gap="3"
                            alignItems="center"
                            justify="flex-start"
                          >
                            {isAuthorized ? (
                              <Input
                                defaultValue={item.post || ''}
                                bg={theme.compensation?.card.input.bg}
                                color={theme.compensation?.card.input.text}
                                disabled={isSaving}
                                _active={{}}
                                _focus={{
                                  bg: theme.compensation?.card.input.bg,
                                }}
                                _focusVisible={{}}
                                _focusWithin={{}}
                                w="180px"
                                h="32px"
                                px="1"
                                border={
                                  formState.errors.communicatingRationale
                                    ?.breakdown?.[itemIndex]?.post
                                    ? '1px solid red'
                                    : 'none'
                                }
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  onChangeDebounce(
                                    event.target.value,
                                    itemIndex
                                  );
                                }}
                              />
                            ) : item.post ? (
                              <ChakraLink
                                href={item.post}
                                isExternal
                                color="blue.500"
                                maxW="180px"
                                wordBreak="break-all"
                              >
                                {item.post.length > 32
                                  ? `${item.post.slice(0, 32)}...`
                                  : item.post}
                              </ChakraLink>
                            ) : null}
                            {item.rationale ? (
                              <Flex
                                display="flex"
                                flexDir="row"
                                gap="1"
                                alignItems="center"
                                onClick={() => setRationaleSelected(item)}
                                cursor="pointer"
                                color="blue.500"
                                borderBottom="1px solid"
                                borderColor="blue.500"
                                w="max-content"
                                _hover={{
                                  textDecoration: 'none',
                                  color: 'blue.400',
                                  borderColor: 'blue.400',
                                }}
                              >
                                See
                              </Flex>
                            ) : (
                              <Flex width="24px" height="24px" />
                            )}
                          </Flex>
                        </Td>
                        <Td
                          color={theme.compensation?.card.text}
                          borderColor={theme.compensation?.card.divider}
                        >
                          {isAuthorized ? (
                            <Switch
                              isChecked={watch(
                                `communicatingRationale.breakdown.${itemIndex}.validRationale`
                              )}
                              onChange={() => {
                                setValue(
                                  `communicatingRationale.breakdown.${itemIndex}.validRationale`,
                                  !watch(
                                    `communicatingRationale.breakdown.${itemIndex}.validRationale`
                                  ),
                                  {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  }
                                );
                                setValue(
                                  `communicatingRationale.breakdown.${itemIndex}.modified`,
                                  true
                                );
                              }}
                              isDisabled={isSaving}
                              disabled={isSaving}
                            />
                          ) : watch(
                              `communicatingRationale.breakdown.${itemIndex}.validRationale`
                            ) ? (
                            <TrueIcon
                              w="24px"
                              h="24px"
                              color={theme.compensation?.card.success}
                            />
                          ) : (
                            <FalseIcon
                              w="24px"
                              h="24px"
                              color={theme.compensation?.card.error}
                            />
                          )}
                        </Td>
                        <Td
                          color={theme.compensation?.card.text}
                          borderColor={theme.compensation?.card.divider}
                        >
                          {item?.updated === 'manually' ? (
                            <Tooltip label="Manually updated">
                              <Flex
                                bg={theme.compensation?.card.input.bg}
                                p="1"
                                rounded="full"
                                width="24px"
                                height="24px"
                                alignItems="center"
                                justify="center"
                              >
                                <Text
                                  fontSize="small"
                                  color={theme.compensation?.card.text}
                                >
                                  M
                                </Text>
                              </Flex>
                            </Tooltip>
                          ) : (
                            <Flex width="24px" height="24px" />
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Flex>
          </Flex>

          {formState.isDirty && isAuthorized ? (
            <Flex flexDir="row" gap="2" justify="flex-end" mt="4">
              <Button
                isDisabled={isSaving || !formState.isValid}
                disabled={isSaving || !formState.isValid}
                isLoading={isSaving}
                w="max-content"
                alignSelf="flex-end"
                type="submit"
                bgColor={theme.compensation?.card.bg}
                color={theme.compensation?.card.text}
              >
                Save
              </Button>
            </Flex>
          ) : null}
        </form>
      )}
    </Flex>
  );
};
