/* eslint-disable no-nested-ternary */
import { Flex, Spinner } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { DelegateCompensationAdminLayout } from 'layouts/delegateCompensationAdmin';
import { useEffect } from 'react';
import { DelegatePeriod } from '../DelegatePeriod';
import { DelegateProposals } from './DelegateProposals';
import { DelegateStats } from './DelegateStats';

export const DelegateCompensationAdminDelegates = ({
  delegateAddress,
}: {
  delegateAddress?: string;
}) => {
  const { selectedDate } = useDelegateCompensation();
  const { theme } = useDAO();

  const {
    delegateInfo,
    isFetchingDelegateInfo,
    isLoadingDelegateInfo,
    changeDelegateAddress,
  } = useDelegateCompensation();

  const delegateVotes =
    delegateInfo?.stats?.communicatingRationale?.breakdown || {};

  useEffect(() => {
    if (delegateAddress) {
      changeDelegateAddress(delegateAddress);
    }
  }, [delegateAddress]);

  return (
    <DelegateCompensationAdminLayout>
      <Flex align="stretch" flex={1} w="full" flexDirection="column" gap="8">
        <DelegatePeriod />
        {isFetchingDelegateInfo || isLoadingDelegateInfo ? (
          <Flex w="full" h="20" align="center" justify="center">
            <Spinner />
          </Flex>
        ) : (
          <Flex
            flexDir="column"
            alignItems="flex-start"
            justify="flex-start"
            gap="4"
            w="full"
          >
            <DelegateStats />
            {delegateInfo?.stats ? (
              <>
                <DelegateProposals delegateVotes={delegateVotes} />
                {/* <Flex
                  flexDir="row"
                  gap="4"
                  justify="space-between"
                  align="center"
                  w="full"
                >
                  <DelegateStatsBlock
                    blockName="Snapshot Stats"
                    totalProposals={
                      delegateInfo?.stats.snapshotVoting.tn !== null
                        ? Number(delegateInfo.stats.snapshotVoting.tn)
                        : 0
                    }
                    totalVotedOn={
                      delegateInfo?.stats.snapshotVoting.rn !== null
                        ? Number(delegateInfo.stats.snapshotVoting.rn)
                        : 0
                    }
                    formula="(SV(Rn) / SV(Tn)) * 20"
                    score={
                      delegateInfo?.stats.snapshotVoting?.score !== null
                        ? Number(delegateInfo.stats.snapshotVoting.score)
                        : 0
                    }
                  />
                  <DelegateStatsBlock
                    blockName="Onchain Stats"
                    totalProposals={
                      delegateInfo?.stats?.onChainVoting?.tn !== null
                        ? Number(delegateInfo.stats.onChainVoting.tn)
                        : 0
                    }
                    totalVotedOn={
                      delegateInfo?.stats?.onChainVoting?.rn !== null
                        ? Number(delegateInfo.stats.onChainVoting.rn)
                        : 0
                    }
                    formula="(TV(Rn) / TV(Tn)) * 25"
                    score={
                      delegateInfo?.stats?.onChainVoting?.score !== null
                        ? Number(delegateInfo.stats.onChainVoting.score)
                        : 0
                    }
                  />
                </Flex>
                <DelegateFeedback />
                <DelegateBP /> */}
                {/* <Box maxW="600px" w="full" mb="8">
                  <DelegateStatsBlock
                    blockName="Final Score"
                    formula={
                      <Flex flexDir="column">
                        <Text>
                          {`PR - ${
                            delegateInfo?.stats.participationRate
                              ? formatNumberPercentage(
                                  delegateInfo?.stats.participationRate
                                )
                              : '0%'
                          }`}
                        </Text>
                        <Text>
                          {`SV - ${
                            delegateInfo?.stats.snapshotVoting?.score
                              ? formatNumberPercentage(
                                  delegateInfo?.stats.snapshotVoting?.score
                                )
                              : '0%'
                          }`}
                        </Text>
                        <Text>
                          {`TV - ${
                            delegateInfo?.stats.onChainVoting?.score
                              ? formatNumberPercentage(
                                  delegateInfo?.stats.onChainVoting?.score
                                )
                              : '0%'
                          }`}
                        </Text>
                        <Text>
                          {`CR - ${
                            delegateInfo?.stats.communicatingRationale?.score
                              ? formatNumberPercentage(
                                  delegateInfo?.stats.communicatingRationale
                                    ?.score
                                )
                              : '0%'
                          }`}
                        </Text>
                        <Text>
                          {`DF - ${
                            delegateInfo?.stats.delegateFeedback?.score
                              ? delegateInfo?.stats.delegateFeedback?.score
                              : '0'
                          }`}
                        </Text>
                        <Text>
                          {`BP - ${
                            delegateInfo?.stats.bonusPoint
                              ? delegateInfo?.stats.bonusPoint
                              : '0'
                          }`}
                        </Text>
                      </Flex>
                    }
                    score={
                      delegateInfo?.stats?.totalParticipation !== null
                        ? Number(delegateInfo.stats.totalParticipation)
                        : 0
                    }
                  />
                </Box> */}
              </>
            ) : null}
          </Flex>
        )}
      </Flex>
    </DelegateCompensationAdminLayout>
  );
};
