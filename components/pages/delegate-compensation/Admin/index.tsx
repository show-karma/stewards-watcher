import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Switch,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { DelegateCompensationAdminLayout } from 'layouts/delegateCompensationAdmin';
import { ChakraLink } from 'components/ChakraLink';
import { TbExternalLink } from 'react-icons/tb';
import { useAuth, useDAO } from 'contexts';
import { useQuery } from '@tanstack/react-query';
import { getProposals } from 'utils/delegate-compensation/getProposals';
import axios from 'axios';

export const DelegateCompensationAdmin = () => {
  const { selectedDate, refreshDelegateInfo } = useDelegateCompensation();
  const { daoInfo, theme } = useDAO();
  const [actionsLoading, setActionsLoading] = useState<Record<string, boolean>>(
    {}
  );
  const { authToken } = useAuth();

  const {
    data: proposals,
    isLoading,
    isFetching,
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
      ),
    {
      initialData: [
        {
          name: 'Onchain Proposals',
          items: [],
        },
        {
          name: 'Snapshot Proposals',
          items: [],
        },
      ],
      enabled:
        !!selectedDate?.value.month &&
        !!selectedDate?.value.year &&
        !!daoInfo.config.DAO_KARMA_ID,
    }
  );

  const toggleInclude = async (proposalId: string, proposalChoice: boolean) => {
    try {
      setActionsLoading({ [proposalId]: true });
      const authorizedAPI = axios.create({
        timeout: 30000,
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
          refreshDelegateInfo();
          setActionsLoading({ [proposalId]: false });
        });
    } catch (error) {
      console.log(error);
      setActionsLoading({ [proposalId]: false });
    }
  };

  return (
    <DelegateCompensationAdminLayout>
      <Flex align="stretch" flex={1} w="full" flexDirection="column" gap="8">
        <Text fontSize="xl" fontWeight="bold" color={theme.text}>
          Delegate stats for month of {selectedDate?.name}{' '}
          {selectedDate?.value.year}
        </Text>
        {(isLoading || isFetching) && proposals.length === 0 ? (
          <Flex w="full" justify="center" align="center">
            <Spinner size="xl" />
          </Flex>
        ) : (
          proposals?.map((category, categoryIndex) => (
            <Box key={categoryIndex} maxH="320px" overflowY="auto">
              <Heading size="md" mb={2} color={theme.text}>
                {category.name}
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
                      w="40%"
                      borderColor={theme.card.border}
                      color={theme.text}
                    >
                      Link
                    </Th>
                    <Th
                      w="20%"
                      borderColor={theme.card.border}
                      color={theme.text}
                    >
                      Actions
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
                        {item.name}
                      </Td>
                      <Td
                        w="40%"
                        color={theme.text}
                        borderColor={theme.card.border}
                      >
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
                            w="fit-content"
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
          ))
        )}
      </Flex>
    </DelegateCompensationAdminLayout>
  );
};
