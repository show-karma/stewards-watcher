/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DelegateCompensationStats } from 'types';
import {
  Code,
  Flex,
  Icon,
  List,
  ListItem,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { ImgWithFallback } from 'components/ImgWithFallback';
import { useDAO } from 'contexts';
import { FaCheckCircle } from 'react-icons/fa';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { formatSimpleNumber } from 'utils';
import { DataTable } from './DataTable';

const columnHelper = createColumnHelper<DelegateCompensationStats>();

interface TableProps {
  delegates: DelegateCompensationStats[];
  refreshFn: () => Promise<void>;
}

export const Table: React.FC<TableProps> = ({ delegates, refreshFn }) => {
  const { theme } = useDAO();
  const columns = [
    columnHelper.accessor('delegate.shouldUse', {
      cell: info => (
        <Flex flexDir="row" gap="3" alignItems="center" maxW="200px">
          <ImgWithFallback
            borderRadius="full"
            width="32px"
            height="32px"
            fallback={info.getValue()}
            src={info.row.original.delegateImage}
          />
          <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
            {info.getValue()}
          </Text>
          {info.row.original.incentiveOptedIn ? (
            <Tooltip
              shouldWrapChildren
              label="Opted-in to Incentive Program"
              fontSize="md"
            >
              <Icon as={FaCheckCircle} w="4" h="4" color="green.400" />
            </Tooltip>
          ) : (
            <Flex w="16px" />
          )}
        </Flex>
      ),
      header: 'Delegate',
    }),
    // columnHelper.accessor('ranking', {
    //   cell: info => info.getValue(),
    //   header: () => (
    //     <Tooltip
    //       bg={theme.collapse.bg || theme.card.background}
    //       color={theme.collapse.text}
    //       label="Ranking is based on the score they achieve each month."
    //     >
    //       Ranking
    //     </Tooltip>
    //   ),
    //   meta: {
    //     isNumeric: true,
    //   },
    // }),
    // columnHelper.accessor('fundsARB', {
    //   cell: info => info.getValue(),
    //   header: () => (
    //     <Tooltip
    //       bg={theme.collapse.bg || theme.card.background}
    //       color={theme.collapse.text}
    //       label="The amount of ARB allocated per month to the delegates’ payment."
    //     >
    //       Funds(ARB)
    //     </Tooltip>
    //   ),
    //   meta: {
    //     isNumeric: true,
    //   },
    // }),
    columnHelper.accessor('participationRate', {
      cell: info => {
        if (info.getValue()) {
          return formatSimpleNumber(info.getValue());
        }
        if (info.getValue() === '0') {
          return 0;
        }
        return null;
      },
      header: () => (
        <Flex flexDir="row" gap="2" alignItems="center">
          Participation Rate
          <Tooltip
            bg={theme.collapse.bg || theme.card.background}
            color={theme.collapse.text}
            label={
              <Flex flexDir="column" py="1" gap="2">
                <Text fontWeight={600}>
                  Participation Rate (PR) - Weight 20
                </Text>
                <Text fontWeight="normal">
                  Percentage of the total participation of the member in votes.
                  Karma pulls the participation activity directly from onchain
                  transactions. This is the only parameter that is not reset
                  monthly.
                </Text>
                <Code fontWeight="normal">PR formula: (PR * 20) / 100</Code>
              </Flex>
            }
          >
            <Flex w="5" h="5" cursor="pointer">
              <Icon as={AiFillQuestionCircle} w="5" h="5" />
            </Flex>
          </Tooltip>
        </Flex>
      ),
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor('snapshotVoting.score', {
      cell: info => {
        if (info.getValue()) {
          return formatSimpleNumber(info.getValue());
        }
        if (info.getValue() === '0') {
          return 0;
        }
        return null;
      },
      header: () => (
        <Flex flexDir="row" gap="2" alignItems="center">
          Snapshot Voting
          <Tooltip
            bg={theme.collapse.bg || theme.card.background}
            color={theme.collapse.text}
            label={
              <Flex flexDir="column" py="1" gap="2">
                <Text fontWeight={600}>Snapshot Voting (SV) - Weight 15</Text>
                <Text fontWeight="normal">
                  Percentage of delegate participation in snapshot voting. This
                  parameter is reset at the beginning of each month.
                </Text>
                <List fontWeight="normal">
                  <ListItem>
                    <b>Tn</b>: Number of total proposals that were sent to
                    snapshots for voting in the month.
                  </ListItem>
                  <ListItem>
                    <b>Rn:</b> Number of proposals the delegate voted on in the
                    month.
                  </ListItem>
                </List>
                <Code fontWeight="normal">
                  SV formula: (SV(Rn) / SV(Tn)) * 15
                </Code>
              </Flex>
            }
          >
            <Flex w="5" h="5" cursor="pointer">
              <Icon as={AiFillQuestionCircle} w="5" h="5" />
            </Flex>
          </Tooltip>
        </Flex>
      ),
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor('onChainVoting.score', {
      cell: info => {
        if (info.getValue()) {
          return formatSimpleNumber(info.getValue());
        }
        if (info.getValue() === '0') {
          return 0;
        }
        return null;
      },
      header: () => (
        <Flex flexDir="row" gap="2" alignItems="center" minW="100px">
          On-chain Voting
          <Tooltip
            bg={theme.collapse.bg || theme.card.background}
            color={theme.collapse.text}
            label={
              <Flex flexDir="column" py="1" gap="2">
                <Text fontWeight={600}>On-chain Voting (TV) - Weight 25</Text>
                <Text fontWeight="normal">
                  Percentage of delegate participation in on-chain voting. This
                  parameter is reset at the beginning of each month.
                </Text>
                <List fontWeight="normal">
                  <ListItem>
                    <b>Tn</b>: Number of total proposals that were sent to Tally
                    for voting in the month.
                  </ListItem>
                  <ListItem>
                    <b>Rn:</b> Number of proposals the delegate voted in Tally
                    in the month.
                  </ListItem>
                </List>
                <Code fontWeight="normal">
                  TV formula: (TV(Rn) / TV(Tn)) * 25
                </Code>
              </Flex>
            }
          >
            <Flex w="5" h="5" cursor="pointer">
              <Icon as={AiFillQuestionCircle} w="5" h="5" />
            </Flex>
          </Tooltip>
        </Flex>
      ),
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor('communicatingRationale.score', {
      cell: info => {
        if (info.getValue()) {
          return formatSimpleNumber(info.getValue());
        }
        if (info.getValue() === '0') {
          return 0;
        }
        return null;
      },
      header: () => (
        <Flex flexDir="row" gap="2" alignItems="center">
          Communication Rationale
          <Tooltip
            bg={theme.collapse.bg || theme.card.background}
            color={theme.collapse.text}
            label={
              <Flex flexDir="column" py="1" gap="2">
                <Text fontWeight={600}>
                  Communication Rationale (CR) - Weight 25
                </Text>
                <Text fontWeight="normal">
                  Percentage of communication threads with the justification of
                  the delegate’s vote on the proposals sent to snapshots and
                  Tally (if necessary if the vote does not change). This
                  parameter is reset at the beginning of each month.
                </Text>
                <List fontWeight="normal">
                  <ListItem>
                    <b>Tn</b>: Total number of proposals that were submitted to
                    a vote.
                  </ListItem>
                  <ListItem>
                    <b>Rn:</b> Number of real communication rational threads
                    where the delegate communicated and justified his/her
                    decision.
                  </ListItem>
                </List>
                <Code fontWeight="normal">
                  CR formula: (CR(Rn) / CR(Tn)) * 25
                </Code>
              </Flex>
            }
          >
            <Flex w="5" h="5" cursor="pointer">
              <Icon as={AiFillQuestionCircle} w="5" h="5" />
            </Flex>
          </Tooltip>
        </Flex>
      ),
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor('commentingProposal.score', {
      cell: info => {
        if (info.getValue()) {
          return formatSimpleNumber(info.getValue());
        }
        if (info.getValue() === '0') {
          return 0;
        }
        return null;
      },
      header: () => (
        <Flex flexDir="row" gap="2" alignItems="center">
          Commenting Proposal
          <Tooltip
            bg={theme.collapse.bg || theme.card.background}
            color={theme.collapse.text}
            label={
              <Flex flexDir="column" py="1" gap="2">
                <Text fontWeight={600}>
                  Commenting Proposal (CP) - Weight 15
                </Text>
                <Text fontWeight="normal">
                  Percentage of proposals where the delegate asked questions or
                  generated important discussion for the advancement of the
                  proposal. This parameter is reset at the beginning of each
                  month.
                </Text>
                <List fontWeight="normal">
                  <ListItem>
                    <b>Tn</b>: Total number of formal proposals posted on the
                    forum.
                  </ListItem>
                  <ListItem>
                    <b>Rn:</b> Number of actual proposals where the delegate
                    made a genuine and quality contribution. Spam messages will
                    not be considered.
                  </ListItem>
                </List>
                <Code fontWeight="normal">
                  CP formula: (CP(Rn) / CP(Tn)) * 15
                </Code>
              </Flex>
            }
          >
            <Flex w="5" h="5" cursor="pointer">
              <Icon as={AiFillQuestionCircle} w="5" h="5" />
            </Flex>
          </Tooltip>
        </Flex>
      ),
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor('totalParticipation', {
      cell: info => {
        if (info.getValue()) {
          return formatSimpleNumber(info.getValue());
        }
        if (info.getValue() === '0') {
          return 0;
        }
        return null;
      },
      header: () => (
        <Flex flexDir="row" gap="2" alignItems="center">
          Total Participation
          <Tooltip
            bg={theme.collapse.bg || theme.card.background}
            color={theme.collapse.text}
            label={
              <Flex flexDir="column" py="1" gap="2">
                <Text fontWeight={600}>Total Participation (TP)</Text>
                <Text fontWeight="normal">
                  Sum of the results of activities performed by the delegate. A
                  TP% of 100 indicates full participation.
                </Text>

                <Code fontWeight="normal">
                  TP% formula: PR + SV + TV + CR + CP + BP
                </Code>
              </Flex>
            }
          >
            <Flex w="5" h="5" cursor="pointer">
              <Icon as={AiFillQuestionCircle} w="5" h="5" />
            </Flex>
          </Tooltip>
        </Flex>
      ),
      meta: {
        isNumeric: true,
      },
    }),
    columnHelper.accessor('bonusPoint', {
      cell: info => {
        if (info.getValue()) {
          return formatSimpleNumber(info.getValue());
        }
        if (info.getValue() === '0') {
          return 0;
        }
        return null;
      },
      header: () => (
        <Flex flexDir="row" gap="2" alignItems="center">
          Bonus Points
          <Tooltip
            bg={theme.collapse.bg || theme.card.background}
            color={theme.collapse.text}
            label={
              <Flex flexDir="column" py="1" gap="2">
                <Text fontWeight={600}>Bonus Point (BP) - Extra +30% TP</Text>
                <Text fontWeight="normal">
                  This parameter is extra. If the delegate makes a significant
                  contribution to the DAO, he/she is automatically granted +40%
                  extra TP. This parameter is at the discretion of the program
                  administrator. This parameter is reset at the beginning of
                  each month
                </Text>
              </Flex>
            }
          >
            <Flex w="5" h="5" cursor="pointer">
              <Icon as={AiFillQuestionCircle} w="5" h="5" />
            </Flex>
          </Tooltip>
        </Flex>
      ),
      meta: {
        isNumeric: true,
      },
    }),
    // columnHelper.accessor('payment', {
    //   cell: info => {
    //     if (info.getValue()) {
    //       return formatSimpleNumber(info.getValue(), {
    //         thousandSeparated: true,
    //       });
    //     }
    //     if (info.getValue() === '0') {
    //       return 0;
    //     }
    //     return null;
    //   },
    //   header: () => (
    //     <Flex flexDir="row" gap="2" alignItems="center">
    //       Payment (ARB)
    //       <Tooltip
    //         bg={theme.collapse.bg || theme.card.background}
    //         color={theme.collapse.text}
    //         label={
    //           <Flex flexDir="column" py="1" gap="2">
    //             <Text fontWeight={600}>Payment ARB (PARB)</Text>
    //             <Text fontWeight="normal">
    //               Final amount of ARB that the delegate will receive based on
    //               his TP% and his position in the table.
    //             </Text>

    //             <Code fontWeight="normal">
    //               PARB formula:
    //               <br />
    //               {`IF(TP% >=100; 5000;(5000 * TP% / 100))`}
    //             </Code>
    //           </Flex>
    //         }
    //       >
    //         <Flex w="5" h="5" cursor="pointer">
    //           <Icon as={AiFillQuestionCircle} w="5" h="5" />
    //         </Flex>
    //       </Tooltip>
    //     </Flex>
    //   ),
    //   meta: {
    //     isNumeric: true,
    //   },
    // }),
  ];
  return <DataTable refreshFn={refreshFn} columns={columns} data={delegates} />;
};
