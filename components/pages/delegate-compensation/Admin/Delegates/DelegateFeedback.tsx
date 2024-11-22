/* eslint-disable no-param-reassign */
import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Icon,
  Img,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { StarIcon } from 'components/Icons/Compensation/StarIcon';
import { useAuth, useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { API_ROUTES, KARMA_API } from 'helpers';
import { useToasty } from 'hooks';
import { useState } from 'react';
import { BsFillInfoCircleFill } from 'react-icons/bs';

export const DelegateFeedback = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}) => {
  const { theme, daoInfo, rootPathname } = useDAO();
  const { refreshDelegateInfo, delegateInfo, delegateAddress } =
    useDelegateCompensation();
  const { authToken, isDaoAdmin: isAuthorized } = useAuth();
  const { toast } = useToasty();
  const [feedbackScores, setFeedbackScores] = useState({
    relevance: delegateInfo?.stats?.delegateFeedback?.relevance || 0,
    depthOfAnalysis:
      delegateInfo?.stats?.delegateFeedback?.depthOfAnalysis || 0,
    timing: delegateInfo?.stats?.delegateFeedback?.timing || 0,
    clarityAndCommunication:
      delegateInfo?.stats?.delegateFeedback?.clarityAndCommunication || 0,
    impactOnDecisionMaking:
      delegateInfo?.stats?.delegateFeedback?.impactOnDecisionMaking || 0,
    presenceMultiplier:
      delegateInfo?.stats?.delegateFeedback?.presenceMultiplier || 0,
  });
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);
  const inputTitle = {
    relevance: 'Relevance',
    depthOfAnalysis: 'Depth of Analysis',
    timing: 'Timing',
    clarityAndCommunication: 'Clarity & Communication',
    impactOnDecisionMaking: 'Impact',
    presenceMultiplier: 'Presence Multiplier',
  };
  const inputLabel = {
    relevance:
      'Analyzes whether the delegate’s feedback throughout the month is relevant to the discussion.',
    depthOfAnalysis:
      'It evaluates the depth of analysis provided by the delegate concerning the proposals or discussions. This serves as a metric to assess whether the delegate takes the time to thoroughly meditate on the discussion and demonstrates attention to the details. Key elements include solid arguments, relevant questions, and thorough reasoning.',
    timing:
      'Considers when the delegate provides feedback, rewarding those who provide feedback earlier, as long as they meet the above criteria. Note that feedback will be considered as provided before on-chain/off-chain voting if it was published before the day voting starts at 00:00 UTC.',
    clarityAndCommunication:
      'This is a review of the clarity, structured communication, and overall readability of the delegate’s feedback. Clear and well-written feedback is rewarded.',
    impactOnDecisionMaking:
      'While the proposer ultimately decides whether to incorporate feedback, high-quality feedback from a delegate often influences the final proposal that goes to vote. This criterion evaluates whether the delegate’s feedback tends to drive changes in proposals/discussions.',
    presenceMultiplier:
      'This is a more quantitative analysis, intended to reflect the effort of delegates who participate in most discussions. This parameter serves as a multiplier to the score obtained across the previous five criteria. Note that the percentage of participation in monthly discussions could be not linear across all DAO’s discussions. Some proposals may carry more weight in the overall discussions (special cases such as LTIPP/STIP, gaming, treasury, etc.).',
  };

  const handleScoreChange = (field: string, value: string) => {
    if (feedbackScores[field as keyof typeof feedbackScores] === +value) {
      setFeedbackScores(prev => ({ ...prev, [field]: 0 }));
    } else {
      setFeedbackScores(prev => ({ ...prev, [field]: +(value || 0) }));
    }
  };

  const handleSaveFeedback = async () => {
    setIsSavingFeedback(true);
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
    } finally {
      setIsSavingFeedback(false);
    }
  };

  const numberInputs = ['presenceMultiplier'];

  const calculateFinalScore = () => {
    const currentScores = feedbackScores;

    // Calculate final scores
    const initialScore = Number(
      (
        currentScores.relevance +
        currentScores.depthOfAnalysis +
        currentScores.timing +
        currentScores.clarityAndCommunication +
        currentScores.impactOnDecisionMaking
      ).toFixed(1)
    );
    const percentageScore = initialScore / 20; // Convert to percentage
    const percentageWithMultiplier =
      percentageScore * currentScores.presenceMultiplier;
    const finalScore = Number((percentageWithMultiplier * 30).toFixed(1));
    return finalScore > 30 ? 30 : finalScore;
  };

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <ModalOverlay />
      <ModalContent rounded="4px" w="full" maxW="860px">
        <ModalHeader
          bg={theme.compensation?.card.bg}
          textColor={theme.compensation?.card.text}
          rounded="4px"
        >
          <Text
            fontSize="lg"
            textAlign="center"
            fontWeight="bold"
            color={theme.compensation?.card.text}
          >
            Delegate Feedback
          </Text>
        </ModalHeader>
        <ModalCloseButton textColor={theme.compensation?.card.text} />
        <ModalBody
          bg={theme.compensation?.card.bg}
          textColor={theme.compensation?.card.text}
          maxH="80vh"
          overflowY="auto"
          rounded="4px"
          px="10"
          py="8"
        >
          <Box bg={theme.card.background} borderRadius="lg" p={4} width="full">
            <VStack spacing={4} align="stretch">
              <Flex justifyContent="flex-end" gap="4" alignItems="center">
                <Link
                  color={theme.compensation?.card.text}
                  href={`${rootPathname}/delegate-compensation/delegate/${delegateAddress}/forum-activity`}
                  isExternal
                  textDecoration="underline"
                >
                  View Forum activity
                </Link>
              </Flex>

              <Flex
                flexDir="row"
                gap="8"
                align="center"
                justify="center"
                h="100%"
                flex="1"
              >
                <Flex flexDir="column" gap={2} wrap="wrap">
                  {Object.entries(feedbackScores).map(([key, value]) => (
                    <Flex
                      flexDir="row"
                      align="center"
                      justify="space-between"
                      key={key}
                      flex="1"
                      minW="150px"
                      gap="8"
                    >
                      <Flex flexDir="row" align="center" gap="2">
                        <Text
                          color={theme.compensation?.card.text}
                          fontWeight="600"
                          fontSize="16px"
                          mb={1}
                        >
                          {inputTitle[key as keyof typeof inputTitle]}
                        </Text>
                        <Tooltip
                          placement="top"
                          label={inputLabel[key as keyof typeof inputLabel]}
                          hasArrow
                          bgColor={theme.compensation?.card.bg}
                          color={theme.compensation?.card.text}
                          fontWeight="normal"
                          fontSize="sm"
                          borderRadius={10}
                          p="3"
                        >
                          <Text as="span">
                            <Icon
                              boxSize="12px"
                              as={BsFillInfoCircleFill}
                              cursor="help"
                            />
                          </Text>
                        </Tooltip>
                      </Flex>
                      {!numberInputs.includes(key) ? (
                        <Flex flexDir="row" gap="1">
                          {[1, 2, 3, 4].map(score => (
                            <Button
                              key={score}
                              variant="unstyled"
                              onClick={() => {
                                if (!isAuthorized) {
                                  return;
                                }
                                handleScoreChange(key, score.toString());
                              }}
                              color={
                                score <= Number(value)
                                  ? 'yellow.400'
                                  : theme.compensation?.card.text
                              }
                              opacity={score > Number(value) ? 0.3 : 1}
                              _hover={
                                isAuthorized
                                  ? {
                                      color: 'yellow.300',
                                      opacity: 1,
                                    }
                                  : undefined
                              }
                              onMouseEnter={() => {
                                if (!isAuthorized) return;
                                const buttons = document.querySelectorAll(
                                  `button[data-key="${key}"]`
                                );
                                buttons.forEach((btn, index) => {
                                  if (index < score) {
                                    (btn as any).style.opacity = '1';
                                  }
                                });
                              }}
                              onMouseLeave={() => {
                                if (!isAuthorized) return;
                                const buttons = document.querySelectorAll(
                                  `button[data-key="${key}"]`
                                );
                                buttons.forEach((btn, index) => {
                                  if (index >= Number(value)) {
                                    (btn as any).style.opacity = '0.3';
                                  }
                                });
                              }}
                              data-key={key}
                              cursor={isAuthorized ? 'pointer' : 'default'}
                            >
                              <StarIcon w="28px" h="28px" />
                            </Button>
                          ))}
                        </Flex>
                      ) : (
                        <Editable defaultValue={value.toString()}>
                          <EditablePreview
                            fontSize="20px"
                            fontWeight={700}
                            color={theme.compensation?.card.secondaryText}
                            lineHeight="32px"
                            cursor="pointer"
                            textDecor="underline"
                            minW="60px"
                            minH="32px"
                            bg={theme.compensation?.bg}
                            textAlign="end"
                            px="1"
                          />
                          <EditableInput
                            onChange={event => {
                              handleScoreChange(key, event.target.value);
                            }}
                            type="number"
                            min={0}
                            max={2}
                            mr={2}
                            bg={theme.compensation?.card.bg}
                            w="full"
                            fontSize="20px"
                            fontWeight={700}
                            color={theme.compensation?.card.secondaryText}
                            lineHeight="32px"
                            px="2"
                            textAlign="end"
                          />
                        </Editable>
                      )}
                    </Flex>
                  ))}
                </Flex>
                <Flex
                  flexDir="column"
                  gap="3"
                  justify="center"
                  align="center"
                  borderRadius="8px"
                  bg={theme.compensation?.icons.delegateFeedback}
                  maxH="330px"
                  h="full"
                  minH="full"
                  px="32px"
                  py="72px"
                  flex="1"
                >
                  <Img
                    src="/icons/delegate-compensation/delegateFeedback.png"
                    w="40px"
                    h="40px"
                  />
                  <Flex
                    flexDir="column"
                    gap="0"
                    align="center"
                    justify="center"
                  >
                    <Text
                      fontSize="16px"
                      fontWeight={600}
                      color={theme.compensation?.card.text}
                      textAlign="center"
                    >
                      Delegate
                      <br />
                      Feedback
                    </Text>
                    <Text
                      fontSize="36px"
                      fontWeight={600}
                      color={theme.compensation?.card.secondaryText}
                      w="120px"
                      textAlign="center"
                    >
                      {calculateFinalScore() || '0'}%
                    </Text>
                  </Flex>
                </Flex>
              </Flex>

              {isAuthorized ? (
                <Flex flexDir="row" gap="4" justify="flex-end">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    bg="white"
                    color="black"
                    border="1px solid black"
                    px="5"
                    py="2.5"
                    borderRadius="4px"
                    _hover={{ opacity: 0.8 }}
                    _focus={{ opacity: 0.8 }}
                    _focusVisible={{ opacity: 0.8 }}
                    _focusWithin={{ opacity: 0.8 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveFeedback}
                    bg="black"
                    color="white"
                    border="1px solid white"
                    px="10"
                    py="2.5"
                    borderRadius="4px"
                    _hover={{ opacity: 0.8 }}
                    _focus={{ opacity: 0.8 }}
                    _focusVisible={{ opacity: 0.8 }}
                    _focusWithin={{ opacity: 0.8 }}
                    _loading={{ opacity: 0.8 }}
                    isLoading={isSavingFeedback}
                    disabled={isSavingFeedback}
                    isDisabled={isSavingFeedback}
                  >
                    Save
                  </Button>
                </Flex>
              ) : null}
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
