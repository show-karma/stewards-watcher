import {
  Flex,
  Th,
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
  Heading,
  Button,
  Spinner,
  Input,
  Text,
  Tooltip,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Icon,
  ModalBody,
} from '@chakra-ui/react';
import axios from 'axios';
import { ChakraLink } from 'components/ChakraLink';
import { useAuth, useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { API_ROUTES, KARMA_API } from 'helpers';
import { useToasty } from 'hooks';
import { useState } from 'react';
import { TbExternalLink } from 'react-icons/tb';
import { DelegateStatsBreakdown, DelegateStatsFromAPI } from 'types';
import { formatDate } from 'utils';
import { getProposals } from 'utils/delegate-compensation/getProposals';
import { useQuery } from 'wagmi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import debounce from 'lodash.debounce';
import { IoEyeSharp } from 'react-icons/io5';
import { ProposalItem } from 'types/proposals';
import dynamic from 'next/dynamic';

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
  const { authToken } = useAuth();

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
      <Heading size="md" color={theme.text}>
        Proposals - {selectedDate?.name} {selectedDate?.value.year} (
        {proposalsAndVotes?.length})
      </Heading>
      {proposalsFetching || proposalsLoading ? (
        <Flex w="full" justify="center" align="center">
          <Spinner />
        </Flex>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDir="column" gap="4" maxH="320px" overflowY="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th borderColor={theme.card.border} color={theme.text}>
                    Proposal Name
                  </Th>
                  <Th borderColor={theme.card.border} color={theme.text}>
                    Forum Link
                  </Th>
                  <Th borderColor={theme.card.border} color={theme.text}>
                    Date
                  </Th>
                  <Th borderColor={theme.card.border} color={theme.text}>
                    Link
                  </Th>
                  <Th borderColor={theme.card.border} color={theme.text}>
                    Type
                  </Th>
                  <Th borderColor={theme.card.border} color={theme.text}>
                    Voted
                  </Th>
                  <Th borderColor={theme.card.border} color={theme.text}>
                    CR
                  </Th>
                  <Th borderColor={theme.card.border} color={theme.text}>
                    Valid Rationale
                  </Th>
                  <Th borderColor={theme.card.border} color={theme.text} />
                </Tr>
              </Thead>
              <Tbody>
                {proposalsAndVotes?.map((item, itemIndex) => (
                  <Tr
                    opacity={
                      !watch(
                        `communicatingRationale.breakdown.${itemIndex}.validRationale`
                      )
                        ? 0.5
                        : 1
                    }
                    key={itemIndex}
                  >
                    <Td color={theme.text} borderColor={theme.card.border}>
                      {item.name}
                      {item.name[0] === '#' ? '...' : ''}
                    </Td>
                    <Td color={theme.text} borderColor={theme.card.border}>
                      {item.proposalTopic ? (
                        <ChakraLink
                          display="flex"
                          flexDir="row"
                          gap="1"
                          alignItems="center"
                          href={item.proposalTopic}
                          isExternal
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
                          See proposal
                          <TbExternalLink />
                        </ChakraLink>
                      ) : null}
                    </Td>
                    <Td color={theme.text} borderColor={theme.card.border}>
                      <Text w="max-content">
                        {formatDate(item.endDate as string, 'MMM D, YYYY')}
                      </Text>
                    </Td>
                    <Td color={theme.text} borderColor={theme.card.border}>
                      {item.link ? (
                        <ChakraLink
                          display="flex"
                          flexDir="row"
                          gap="1"
                          alignItems="center"
                          href={item.link}
                          isExternal
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
                          See proposal
                          <TbExternalLink />
                        </ChakraLink>
                      ) : null}
                    </Td>
                    <Td color={theme.text} borderColor={theme.card.border}>
                      {item.type === 'onChain' ? 'Onchain' : 'Snapshot'}
                    </Td>
                    <Td color={theme.text} borderColor={theme.card.border}>
                      {watch(
                        `communicatingRationale.breakdown.${itemIndex}.voted`
                      ) === true
                        ? 'Yes'
                        : 'No'}
                    </Td>
                    <Td color={theme.text} borderColor={theme.card.border}>
                      <Flex
                        flexDir="row"
                        gap="3"
                        alignItems="center"
                        justify="center"
                      >
                        <Input
                          defaultValue={item.post || ''}
                          bg={theme.card.background}
                          disabled={isSaving}
                          _active={{}}
                          _focus={{
                            bg: theme.card.background,
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
                            onChangeDebounce(event.target.value, itemIndex);
                          }}
                        />
                        {item.rationale ? (
                          <Tooltip label="See post content">
                            <Flex
                              bg={theme.card.background}
                              px="1"
                              py="1"
                              rounded="full"
                              width="24px"
                              height="24px"
                              alignItems="center"
                              justifyContent="center"
                              onClick={() => setRationaleSelected(item)}
                              cursor="pointer"
                            >
                              <Icon as={IoEyeSharp} w="12px" h="12px" />
                            </Flex>
                          </Tooltip>
                        ) : (
                          <Flex width="24px" height="24px" />
                        )}
                      </Flex>
                    </Td>
                    <Td color={theme.text} borderColor={theme.card.border}>
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
                    </Td>
                    <Td color={theme.text} borderColor={theme.card.border}>
                      {item?.updated === 'manually' ? (
                        <Tooltip label="Manually updated">
                          <Flex
                            bg={theme.card.background}
                            p="1"
                            rounded="full"
                            width="24px"
                            height="24px"
                            alignItems="center"
                            justify="center"
                          >
                            <Text fontSize="small" color={theme.text}>
                              M
                            </Text>
                          </Flex>
                        </Tooltip>
                      ) : (
                        <Flex width="24px" height="24px" />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Flex>
          {formState.isDirty ? (
            <Flex flexDir="row" gap="2" justify="flex-end" mt="4">
              <Button
                isDisabled={isSaving || !formState.isValid}
                disabled={isSaving || !formState.isValid}
                isLoading={isSaving}
                w="max-content"
                alignSelf="flex-end"
                type="submit"
                bgColor={theme.card.background}
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
