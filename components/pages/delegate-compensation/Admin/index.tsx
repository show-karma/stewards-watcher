import {
  Box,
  Flex,
  Heading,
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
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChakraLink } from 'components/ChakraLink';
import { LinkIcon } from 'components/Icons/Compensation/LinkIcon';
import { useAuth, useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { KARMA_API } from 'helpers';
import { useToasty } from 'hooks';
import { DelegateCompensationAdminLayout } from 'layouts/delegateCompensationAdmin';
import { queryClient } from 'pages/_app';
import { useState } from 'react';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { formatDate } from 'utils';
import { getProposals } from 'utils/delegate-compensation/getProposals';
import { DelegatePeriod } from './DelegatePeriod';

export const DelegateCompensationAdmin = () => {
  const { selectedDate, refreshDelegateInfo } = useDelegateCompensation();
  const { daoInfo, theme } = useDAO();
  const [actionsLoading, setActionsLoading] = useState<Record<string, boolean>>(
    {}
  );
  const { authToken } = useAuth();
  const { toast } = useToasty();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      'delegate-compensation-proposals',
      selectedDate?.value.month,
      selectedDate?.value.year,
    ],
    queryFn: () =>
      getProposals(
        daoInfo.config.DAO_KARMA_ID,
        selectedDate?.value.month as string | number,
        selectedDate?.value.year as string | number
      ),
    initialData: {
      proposals: [
        {
          name: 'Onchain Proposals',
          items: [],
        },
        {
          name: 'Snapshot Proposals',
          items: [],
        },
      ],
      finished: false,
    },
    enabled:
      !!selectedDate?.value.month &&
      !!selectedDate?.value.year &&
      !!daoInfo.config.DAO_KARMA_ID,
    refetchOnWindowFocus: false,
  });

  const { proposals, finished } = data;

  const toggleInclude = async (proposalId: string, proposalChoice: boolean) => {
    try {
      setActionsLoading({ [proposalId]: true });
      const authorizedAPI = axios.create({
        timeout: 30000,
        baseURL: KARMA_API.base_url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: authToken ? `Bearer ${authToken}` : '',
        },
      });
      await authorizedAPI
        .put(
          `/incentive-settings/${daoInfo.config.DAO_KARMA_ID}/${selectedDate?.value.month}/${selectedDate?.value.year}`,
          {
            proposals: { [proposalId]: proposalChoice },
          }
        )
        .then(() => {
          toast({
            title: `This proposal will be ${
              proposalChoice ? 'included' : 'excluded'
            } from calculation`,
            status: 'success',
          });
          queryClient
            .invalidateQueries([
              'delegate-compensation-proposals',
              selectedDate?.value.month,
              selectedDate?.value.year,
            ])
            .then(() => {
              setActionsLoading({ [proposalId]: false });
            });
        });
    } catch (error) {
      console.log(error);
      setActionsLoading({ [proposalId]: false });
    }
  };

  const finishPeriod = async (checked: boolean) => {
    try {
      setActionsLoading({ finished: true });
      const authorizedAPI = axios.create({
        timeout: 30000,
        baseURL: KARMA_API.base_url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: authToken ? `Bearer ${authToken}` : '',
        },
      });
      await authorizedAPI
        .put(
          `/incentive-settings/${daoInfo.config.DAO_KARMA_ID}/${selectedDate?.value.month}/${selectedDate?.value.year}`,
          {
            finished: checked,
          }
        )
        .then(() => {
          setTimeout(() => {
            toast({
              title: `The scores for ${selectedDate?.name} ${
                selectedDate?.value.year
              } is ${
                checked
                  ? 'have been marked as finalized.'
                  : 'are marked as pending finalization.'
              }`,
              status: 'success',
            });
            queryClient
              .invalidateQueries([
                'delegate-compensation-proposals',
                selectedDate?.value.month,
                selectedDate?.value.year,
              ])
              .then(() => {
                setActionsLoading({ finished: false });
              });
          }, 250);
        });
    } catch (error) {
      console.log(error);
      setActionsLoading({ finished: false });
    }
  };

  return (
    <DelegateCompensationAdminLayout>
      <DelegatePeriod
        delegate="none"
        period
        minimumPeriod={new Date('2024-11-01')}
        maximumPeriod={new Date()}
      />
      <Flex my="8" flexDir="row" align="center" gap="4">
        <Switch
          isChecked={finished}
          onChange={() => finishPeriod(!finished)}
          isDisabled={actionsLoading.finished}
        />
        <Text color={theme.compensation?.card.text}>
          The scores for this month has been finalized.
        </Text>
        {actionsLoading.finished && <Spinner size="xs" />}
      </Flex>
      <Flex align="stretch" flex={1} w="full" flexDirection="column" gap="8">
        {(isLoading || isFetching) && proposals.length === 0 ? (
          <Flex w="full" justify="center" align="center">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <Flex flexDir="column" gap="20">
            {proposals?.map((category, categoryIndex) => (
              <Box key={categoryIndex} maxH="320px" overflowY="auto">
                <Heading size="md" mb={2} color={theme.text}>
                  {category.name}
                  {category.items.length
                    ? ` - Total Proposals (${
                        category.items.length
                      }), Included Proposals (${
                        category.items.filter(item => item.isValid).length
                      })`
                    : ' - No proposals'}
                </Heading>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th
                        w="40%"
                        borderColor={theme.card.border}
                        color={theme.text}
                      >
                        Proposal Name
                      </Th>
                      <Th
                        w="20%"
                        borderColor={theme.card.border}
                        color={theme.text}
                      >
                        End Date
                      </Th>

                      <Th
                        w="20%"
                        borderColor={theme.card.border}
                        color={theme.text}
                      >
                        <Flex flexDir="row" gap="2" alignItems="center">
                          Actions
                          <Tooltip
                            placement="top"
                            label="Enable or Disable proposals to consider in the calculations for this month"
                            hasArrow
                            bgColor="white"
                            color="rgba(0,0,0,0.7)"
                            fontWeight="normal"
                            fontSize="sm"
                            borderRadius={10}
                            p="3"
                          >
                            <Text as="span">
                              <AiFillQuestionCircle cursor="help" />
                            </Text>
                          </Tooltip>
                        </Flex>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {category.items.map((item, itemIndex) => (
                      <Tr opacity={!item.isValid ? 0.5 : 1} key={itemIndex}>
                        <Td
                          w="40%"
                          color={theme.text}
                          borderColor={theme.card.border}
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
                            <Flex flexDir="row" gap="2" alignItems="center">
                              {item.link ? (
                                <ChakraLink
                                  display="flex"
                                  flexDir="row"
                                  gap="3"
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
                                  />
                                </ChakraLink>
                              ) : null}
                            </Flex>
                          </Flex>
                        </Td>
                        <Td
                          w="20%"
                          color={theme.text}
                          borderColor={theme.card.border}
                        >
                          <Text w="max-content">
                            {formatDate(item.endDate as string, 'MMM D, YYYY')}
                          </Text>
                        </Td>

                        <Td
                          w="20%"
                          color={theme.text}
                          borderColor={theme.card.border}
                        >
                          <Flex flexDir="row" gap="2" alignItems="center">
                            <Switch
                              isChecked={item.isValid}
                              onChange={() =>
                                toggleInclude(item.id, !item.isValid)
                              }
                              isDisabled={actionsLoading[item.id]}
                              disabled={actionsLoading[item.id]}
                            />
                            {actionsLoading[item.id] && <Spinner size="xs" />}
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            ))}
          </Flex>
        )}
      </Flex>
    </DelegateCompensationAdminLayout>
  );
};
