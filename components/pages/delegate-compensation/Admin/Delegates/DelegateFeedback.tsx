/* eslint-disable no-param-reassign */
import {
  Box,
  Button,
  Flex,
  Img,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { StarIcon } from 'components/Icons/Compensation/StarIcon';
import { useAuth, useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { API_ROUTES, KARMA_API } from 'helpers';
import { useToasty } from 'hooks';
import { useState } from 'react';

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
    depthAnalyses: delegateInfo?.stats?.delegateFeedback?.depthAnalyses || 0,
    timing: delegateInfo?.stats?.delegateFeedback?.timing || 0,
    clarityAndCommunication:
      delegateInfo?.stats?.delegateFeedback?.clarityAndCommunication || 0,
    impactOnDecision:
      delegateInfo?.stats?.delegateFeedback?.impactOnDecision || 0,
    presenceInDiscussions:
      delegateInfo?.stats?.delegateFeedback?.presenceInDiscussions || 0,
  });
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);
  const inputTitle = {
    relevance: 'Relevance',
    depthAnalyses: 'Depth of Analysis',
    timing: 'Timing',
    clarityAndCommunication: 'Clarity & Communication',
    impactOnDecision: 'Impact',
    presenceInDiscussions: 'Presence',
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

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <ModalOverlay />
      <ModalContent rounded="4px" w="full" maxW="660px">
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
                      <Text
                        color={theme.compensation?.card.text}
                        fontWeight="600"
                        fontSize="16px"
                        mb={1}
                      >
                        {inputTitle[key as keyof typeof inputTitle]}
                      </Text>
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
                    >
                      {delegateInfo?.stats.delegateFeedback?.score || '0'}%
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
