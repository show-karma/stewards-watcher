import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Select,
  Input,
  Button,
  Link,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';

export const DelegateFeedback = () => {
  const { theme, daoInfo, rootPathname } = useDAO();
  const { delegateAddress } = useDelegateCompensation();
  const [feedbackScores, setFeedbackScores] = useState({
    relevance: '',
    depthOfAnalysis: '',
    timing: '',
    clarityAndCommunication: '',
    impact: '',
    presence: '',
  });
  const [bonusPoints, setBonusPoints] = useState('');

  const handleScoreChange = (field: string, value: string) => {
    setFeedbackScores(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveFeedback = () => {
    // TODO: Implement save functionality
    console.log('Saving feedback:', feedbackScores);
  };

  const handleSaveBonusPoints = () => {
    // TODO: Implement save functionality for bonus points
    console.log('Saving bonus points:', bonusPoints);
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
                {key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())}
              </Text>
              <Select
                value={value}
                onChange={event => handleScoreChange(key, event.target.value)}
                placeholder="Select score"
                bg={theme.card.background}
                color={theme.text}
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

        <Box>
          <Text color={theme.text} mb={1}>
            Bonus Points
          </Text>
          <Flex>
            <Input
              type="number"
              value={bonusPoints}
              onChange={event => {
                // doesn't change the value if it's not a number
                if (event?.target?.value === '') {
                  setBonusPoints('');
                  return;
                }
                if (
                  !event?.target?.value ||
                  Number.isNaN(Number(event.target.value))
                )
                  return;
                setBonusPoints(event.target.value);
              }}
              placeholder="Enter bonus points"
              mr={2}
              bg={theme.card.background}
              color={theme.text}
            />
            <Button onClick={handleSaveBonusPoints}>Save</Button>
          </Flex>
        </Box>
      </VStack>
    </Box>
  );
};
