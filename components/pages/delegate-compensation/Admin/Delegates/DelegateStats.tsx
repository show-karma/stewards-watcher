import { Button, Flex, Img, Text } from '@chakra-ui/react';
import { useAuth, useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import pluralize from 'pluralize';
import { useState } from 'react';
import { formatSimpleNumber } from 'utils';
import { DelegateBP } from './DelegateBP';
import { DelegateFeedback } from './DelegateFeedback';
import { DelegateFinalScoreModal } from './DelegateFinalScore';
import { DelegatePeriodIndicator } from './DelegatePeriodIndicator';

export const DelegateStats = () => {
  const {
    delegateInfo,
    isFetchingDelegateInfo,
    isLoadingDelegateInfo,
    changeDelegateAddress,
  } = useDelegateCompensation();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isFinalScoreModalOpen, setIsFinalScoreModalOpen] = useState(false);
  const { theme } = useDAO();
  const { isDaoAdmin: isAuthorized } = useAuth();
  return (
    <Flex flexDir="column" w="full" gap="5">
      {/* Delegate Feedback Modal */}
      {isFeedbackModalOpen ? (
        <DelegateFeedback
          isModalOpen={isFeedbackModalOpen}
          setIsModalOpen={setIsFeedbackModalOpen}
        />
      ) : null}
      {/* Delegate Feedback Modal */}
      {isFinalScoreModalOpen ? (
        <DelegateFinalScoreModal
          isModalOpen={isFinalScoreModalOpen}
          setIsModalOpen={setIsFinalScoreModalOpen}
        />
      ) : null}
      {/* 3 blocks */}
      <Flex
        flexDir={['column', 'column', 'row']}
        flexWrap="wrap"
        w="full"
        gap="5"
      >
        <DelegatePeriodIndicator />
        <Flex
          flexDir="column"
          bg={theme.compensation?.card.bg}
          flex="1"
          borderRadius="8px"
        >
          <Flex
            flexDir="row"
            w="full"
            borderBottom="1px solid"
            borderBottomColor={theme.compensation?.card.divider}
            gap="3"
            align="center"
            p="3"
          >
            <Flex
              borderRadius="4px"
              bg={theme.compensation?.icons.snapshot}
              w="40px"
              h="40px"
            >
              <Img
                src="/icons/delegate-compensation/snapshot.jpg"
                w="40px"
                h="40px"
                mixBlendMode="multiply"
                borderRadius="4px"
              />
            </Flex>
            <Text
              fontSize="16px"
              fontWeight="600"
              color={theme.compensation?.card.text}
            >
              Snapshot Stats
            </Text>
          </Flex>
          <Flex flexDir="column" p="4" justify="center" align="flex-start">
            <Text
              fontSize="16px"
              fontWeight={400}
              color={theme.compensation?.card.secondaryText}
            >
              Score
            </Text>

            <Text
              fontSize="24px"
              fontWeight={700}
              color={theme.compensation?.card.secondaryText}
            >
              {formatSimpleNumber(
                delegateInfo?.stats?.snapshotVoting.score || 0
              )}
            </Text>
            <Flex flexDir="row" gap="2">
              <Text
                fontSize="14px"
                fontWeight={400}
                color={theme.compensation?.card.secondaryText}
                as="span"
              >
                {delegateInfo?.stats?.snapshotVoting.rn} Total{' '}
                {pluralize(
                  'Proposals',
                  +(delegateInfo?.stats?.snapshotVoting.rn || 0)
                )}
                ,
              </Text>
              <Text
                fontSize="14px"
                fontWeight={400}
                color={theme.compensation?.card.success}
                as="span"
              >
                {delegateInfo?.stats?.snapshotVoting.tn} Voted On
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          flexDir="column"
          bg={theme.compensation?.card.bg}
          flex="1"
          borderRadius="8px"
        >
          <Flex
            flexDir="row"
            w="full"
            borderBottom="1px solid"
            borderBottomColor={theme.compensation?.card.divider}
            gap="3"
            align="center"
            p="3"
          >
            <Flex
              borderRadius="4px"
              bg={theme.compensation?.icons.onchain}
              w="40px"
              h="40px"
              justify="center"
              align="center"
            >
              <Img
                src="/icons/delegate-compensation/onchain.png"
                w="24px"
                h="24px"
              />
            </Flex>
            <Text
              fontSize="16px"
              fontWeight="600"
              color={theme.compensation?.card.text}
            >
              Onchain Stats
            </Text>
          </Flex>
          <Flex flexDir="column" p="4" justify="center" align="flex-start">
            <Text
              fontSize="16px"
              fontWeight={400}
              color={theme.compensation?.card.secondaryText}
            >
              Score
            </Text>

            <Text
              fontSize="24px"
              fontWeight={700}
              color={theme.compensation?.card.secondaryText}
            >
              {formatSimpleNumber(
                delegateInfo?.stats?.onChainVoting.score || 0
              )}
            </Text>
            <Flex flexDir="row" gap="2">
              <Text
                fontSize="14px"
                fontWeight={400}
                color={theme.compensation?.card.secondaryText}
                as="span"
              >
                {delegateInfo?.stats?.onChainVoting.rn} Total{' '}
                {pluralize(
                  'Proposals',
                  +(delegateInfo?.stats?.onChainVoting.rn || 0)
                )}
                ,
              </Text>
              <Text
                fontSize="14px"
                fontWeight={400}
                color={theme.compensation?.card.success}
                as="span"
              >
                {delegateInfo?.stats?.onChainVoting.tn} Voted On
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          flexDir="column"
          bg={theme.compensation?.icons.finalScore}
          flex="1"
          borderRadius="8px"
          align="center"
          justify="center"
          py="4"
        >
          <Img
            src="/icons/delegate-compensation/finalScore.png"
            w="40px"
            h="40px"
            borderRadius="4px"
          />

          <Text
            fontSize="16px"
            fontWeight="600"
            color={theme.compensation?.card.text}
          >
            Final Score
          </Text>

          <Text
            fontSize="36px"
            fontWeight={600}
            color={theme.compensation?.card.success}
            textDecoration="underline"
            onClick={() => setIsFinalScoreModalOpen(true)}
            cursor="pointer"
          >
            {formatSimpleNumber(delegateInfo?.stats?.totalParticipation || 0)}
          </Text>
          {/* </Tooltip> */}
        </Flex>
      </Flex>
      {/* 4 blocks */}
      <Flex
        flexDir={['column', 'column', 'row']}
        flexWrap="wrap"
        w="full"
        gap="5"
        flex="1"
      >
        <Flex
          flexDir="row"
          bg={theme.compensation?.card.bg}
          flex="1"
          borderRadius="8px"
          p="3"
          gap="3"
        >
          <Flex
            borderRadius="4px"
            bg={theme.compensation?.icons.delegateFeedback}
            w="40px"
            h="40px"
            justify="center"
            align="center"
          >
            <Img
              src="/icons/delegate-compensation/delegateFeedback.png"
              w="24px"
              h="24px"
            />
          </Flex>
          <Flex
            flexDir="column"
            gap="2"
            justify="center"
            align="flex-start"
            minW="120px"
          >
            <Button
              p="0"
              bg="transparent"
              borderRadius="0"
              h="max-content"
              _hover={{ opacity: 0.8 }}
              _focus={{ opacity: 0.8 }}
              _focusVisible={{ opacity: 0.8 }}
              _focusWithin={{ opacity: 0.8 }}
              fontSize="16px"
              fontWeight="600"
              color={theme.compensation?.card.text}
              borderBottom="1px solid"
              borderBottomColor={theme.compensation?.card.text}
              onClick={() => setIsFeedbackModalOpen(true)}
            >
              Delegate Feedback
            </Button>
            <Text
              fontSize="24px"
              fontWeight={700}
              color={theme.compensation?.card.secondaryText}
              lineHeight="32px"
            >
              {formatSimpleNumber(
                delegateInfo?.stats?.delegateFeedback?.finalScore || 0
              )}
            </Text>
          </Flex>
        </Flex>
        <Flex
          flexDir="row"
          bg={theme.compensation?.card.bg}
          flex="1"
          borderRadius="8px"
          p="3"
          gap="3"
        >
          <Flex
            borderRadius="4px"
            bg={theme.compensation?.icons.rationale}
            w="40px"
            h="40px"
            justify="center"
            align="center"
          >
            <Img
              src="/icons/delegate-compensation/rationale.png"
              w="24px"
              h="24px"
            />
          </Flex>
          <Flex flexDir="column" gap="2" justify="center" align="flex-start">
            <Text
              fontSize="16px"
              fontWeight="600"
              color={theme.compensation?.card.text}
            >
              Communication Rationale
            </Text>
            <Text
              fontSize="24px"
              fontWeight={700}
              color={theme.compensation?.card.secondaryText}
              lineHeight="32px"
            >
              {formatSimpleNumber(
                delegateInfo?.stats?.communicatingRationale.score || 0
              )}
            </Text>
          </Flex>
        </Flex>
        <Flex
          flexDir="row"
          bg={theme.compensation?.card.bg}
          flex="1"
          borderRadius="8px"
          p="3"
          gap="3"
        >
          <Flex
            borderRadius="4px"
            bg={theme.compensation?.icons.bonusPoint}
            w="40px"
            h="40px"
            justify="center"
            align="center"
          >
            <Img
              src="/icons/delegate-compensation/bonusPoint.png"
              w="24px"
              h="24px"
            />
          </Flex>
          {!isAuthorized ? (
            <Flex flexDir="column" gap="2" justify="center" align="flex-start">
              <Text
                fontSize="16px"
                fontWeight="600"
                color={theme.compensation?.card.text}
              >
                Bonus Points
              </Text>
              <Text
                fontSize="24px"
                fontWeight={700}
                color={theme.compensation?.card.secondaryText}
                lineHeight="32px"
              >
                +{formatSimpleNumber(delegateInfo?.stats?.bonusPoint || 0)}
              </Text>
            </Flex>
          ) : (
            <DelegateBP />
          )}
        </Flex>
        <Flex
          flexDir="row"
          bg={theme.compensation?.card.bg}
          flex="1"
          borderRadius="8px"
          p="3"
          gap="3"
        >
          <Flex
            borderRadius="4px"
            bg={theme.compensation?.icons.participationRate}
            w="40px"
            h="40px"
            justify="center"
            align="center"
          >
            <Img
              src="/icons/delegate-compensation/participationRate.png"
              w="24px"
              h="24px"
            />
          </Flex>
          <Flex flexDir="column" gap="2" justify="center" align="flex-start">
            <Text
              fontSize="16px"
              fontWeight="600"
              color={theme.compensation?.card.text}
            >
              Participation Rate
            </Text>
            <Text
              fontSize="24px"
              fontWeight={700}
              color={theme.compensation?.card.secondaryText}
              lineHeight="32px"
            >
              {formatSimpleNumber(delegateInfo?.stats?.participationRate || 0)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
