import {
  Flex,
  Th,
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
  Box,
  Heading,
  Button,
  Spinner,
  Input,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { ChakraLink } from 'components/ChakraLink';
import { useAuth, useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { API_ROUTES, KARMA_API } from 'helpers';
import { useToasty } from 'hooks';
import { useState } from 'react';
import { TbExternalLink } from 'react-icons/tb';
import { DelegateStatsFromAPI } from 'types';
import { formatDate } from 'utils';
import { getProposals } from 'utils/delegate-compensation/getProposals';
import { useQuery } from 'wagmi';

interface DelegateProposals {
  delegateVotes: DelegateStatsFromAPI['stats']['communicatingRationale']['breakdown'];
}

export const DelegateProposals = ({ delegateVotes }: DelegateProposals) => {
  const { selectedDate, delegateInfo, refreshDelegateInfo } =
    useDelegateCompensation();
  const { daoInfo, theme } = useDAO();
  const { authToken } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToasty();

  const {
    data: proposals,
    isLoading: proposalsLoading,
    isFetching: proposalsFetching,
    refetch,
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
        status: delegateVote?.status === 'posted' ? 'posted' : 'not_posted',
        post: delegateVote?.post,
        postId: delegateVote?.proposal,
      };
    });
  };

  const [proposalsAndVotes, setProposalsAndVotes] = useState(
    setupProposalsAndVotes() || []
  );

  const onSubmit = async () => {
    try {
      const authorizedAPI = axios.create({
        timeout: 30000,
        baseURL: KARMA_API.base_url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: authToken ? `Bearer ${authToken}` : '',
        },
      });
      const breakdown = proposalsAndVotes?.map(item => ({
        proposal:
          item.postId || (item.type === 'onChain' ? item.name : item.id),
        post: item.post,
        status: item.status,
      }));
      const newBreakdown: Record<string, any> = {};
      breakdown?.forEach(item => {
        newBreakdown[item.proposal] = {
          status: item.status,
          post: item.post,
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
              ...delegateInfo?.stats,
              communicatingRationale: {
                ...delegateInfo?.stats.communicatingRationale,
                breakdown: newBreakdown,
              },
            },
          }
        )
        .then(() => {
          toast({
            title: 'Success',
            description: 'Posts saved successfully',
          });
          refreshDelegateInfo();
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex w="full" flexDir="column" gap="8">
      <Heading size="md" color={theme.text}>
        Proposals - {selectedDate?.name} {selectedDate?.value.year}
      </Heading>
      {proposalsFetching || proposalsLoading ? (
        <Flex w="full" justify="center" align="center">
          <Spinner />
        </Flex>
      ) : (
        <Box maxH="320px" overflowY="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th borderColor={theme.card.border} color={theme.text}>
                  Proposal Name
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
              </Tr>
            </Thead>
            <Tbody>
              {proposalsAndVotes?.map((item, itemIndex) => (
                <Tr opacity={!item.isValid ? 0.5 : 1} key={itemIndex}>
                  <Td color={theme.text} borderColor={theme.card.border}>
                    {item.name}
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
                    <p>{item.status === 'posted' ? 'Yes' : 'No'}</p>
                  </Td>
                  <Td color={theme.text} borderColor={theme.card.border}>
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
                      border="none"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const newProposals = [...proposalsAndVotes];
                        const findProposal = newProposals?.find(
                          proposal => proposal.postId === item.postId
                        );
                        if (findProposal) {
                          findProposal.post =
                            event.target.value !== '' &&
                            event.target.value !== undefined
                              ? event.target.value
                              : null;
                          findProposal.status = event.target.value
                            ? 'posted'
                            : 'not_posted';
                          setProposalsAndVotes(newProposals);
                        }
                      }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
      {JSON.stringify(setupProposalsAndVotes()) !==
      JSON.stringify(proposalsAndVotes) ? (
        <Flex flexDir="row" gap="2" justify="flex-end" mt="4">
          <Button
            isDisabled={isSaving}
            disabled={isSaving}
            w="max-content"
            alignSelf="flex-end"
            type="button"
            onClick={onSubmit}
            bgColor={theme.card.background}
          >
            Save
          </Button>
        </Flex>
      ) : null}
    </Flex>
  );
};
