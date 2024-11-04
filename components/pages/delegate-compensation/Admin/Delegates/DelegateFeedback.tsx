import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth, useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { API_ROUTES, KARMA_API } from 'helpers';
import { useToasty } from 'hooks';
import { useState } from 'react';

export const DelegateFeedback = () => {
  const { theme, daoInfo, rootPathname } = useDAO();
  const { refreshDelegateInfo, delegateInfo, delegateAddress } =
    useDelegateCompensation();
  const { authToken } = useAuth();
  const { toast } = useToasty();
  const [feedbackScores, setFeedbackScores] = useState({
    relevance: delegateInfo?.stats.delegateFeedback.relevance || 0,
    depthAnalyses: delegateInfo?.stats.delegateFeedback.depthAnalyses || 0,
    timing: delegateInfo?.stats.delegateFeedback.timing || 0,
    clarityAndCommunication:
      delegateInfo?.stats.delegateFeedback.clarityAndCommunication || 0,
    impactOnDecision:
      delegateInfo?.stats.delegateFeedback.impactOnDecision || 0,
    presenceInDiscussions:
      delegateInfo?.stats.delegateFeedback.presenceInDiscussions || 0,
  });

  const inputTitle = {
    relevance: 'Relevance',
    depthAnalyses: 'Depth of Analysis',
    timing: 'Timing',
    clarityAndCommunication: 'Clarity & Communication',
    impactOnDecision: 'Impact',
    presenceInDiscussions: 'Presence',
  };

  const handleScoreChange = (field: string, value: string) => {
    setFeedbackScores(prev => ({ ...prev, [field]: +(value || 0) }));
  };

  const handleSaveFeedback = async () => {
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

      await authorizedAPI
        .put(
          API_ROUTES.DELEGATE.CHANGE_INCENTIVE_PROGRAM_STATS(
            daoInfo.config.DAO_KARMA_ID,
            delegateInfo?.id || ''
          ),
          {
            stats: {
              delegateFeedback: {
                ...delegateInfo?.stats.delegateFeedback,
                ...feedbackScores,
              },
            },
          }
        )
        .then(() => {
          toast({
            title: 'Success',
            description: 'Delegate feedback saved successfully',
          });
          refreshDelegateInfo();
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box bg={theme.card.background} borderRadius="lg" p={4} width="full">
      <VStack spacing={4} align="stretch">
        <Flex justifyContent="flex-start" gap="4" alignItems="center">
          <Text fontSize="lg" fontWeight="bold" color={theme.text}>
            Delegate Feedback
          </Text>
          <Link
            color={theme.text}
            href={`${rootPathname}/delegate-compensation/admin/delegate/${delegateAddress}/forum-activity`}
            isExternal
            textDecoration="underline"
          >
            View Forum activity
          </Link>
        </Flex>

        <HStack spacing={4} wrap="wrap">
          {Object.entries(feedbackScores).map(([key, value]) => (
            <Box key={key} flex="1" minW="150px">
              <Text color={theme.text} mb={1}>
                {inputTitle[key as keyof typeof inputTitle]}
              </Text>
              <Select
                onChange={event => handleScoreChange(key, event.target.value)}
                placeholder="Select score"
                bg={theme.card.background}
                color={theme.text}
                defaultValue={value}
              >
                {[1, 2, 3, 4].map(score => (
                  <option
                    key={score}
                    value={score}
                    style={{
                      background: 'transparent',
                    }}
                  >
                    {score}
                  </option>
                ))}
              </Select>
            </Box>
          ))}
        </HStack>

        <Button onClick={handleSaveFeedback} alignSelf="flex-end">
          Save
        </Button>
      </VStack>
    </Box>
  );
};
