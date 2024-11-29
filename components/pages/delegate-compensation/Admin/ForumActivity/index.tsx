/* eslint-disable no-nested-ternary */
import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  Icon,
  Input,
  Spinner,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChakraLink } from 'components/ChakraLink';
import { FalseIcon } from 'components/Icons/Compensation/FalseIcon';
import { TrueIcon } from 'components/Icons/Compensation/TrueIcon';
import { useAuth, useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { API_ROUTES, KARMA_API } from 'helpers';
import { useToasty } from 'hooks';
import { DelegateCompensationAdminLayout } from 'layouts/delegateCompensationAdmin';
import dynamic from 'next/dynamic';
import { queryClient } from 'pages/_app';
import { useEffect, useState } from 'react';
import { HiExternalLink } from 'react-icons/hi';
import {
  ForumActivityBreakdown,
  ForumPosts,
} from 'types/delegate-compensation/forumActivity';
import { formatDate } from 'utils';
import { getForumActivity } from 'utils/delegate-compensation/getForumActivity';
import { DelegatePeriod } from '../DelegatePeriod';

type FeedbackRow = ForumActivityBreakdown & ForumPosts;

// eslint-disable-next-line import/no-extraneous-dependencies
const MDPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});
export const DelegateCompensationAdminForumActivity = ({
  delegateAddress,
}: {
  delegateAddress: string;
}) => {
  const { delegateInfo, refreshDelegateInfo } = useDelegateCompensation();
  const { selectedDate } = useDelegateCompensation();
  const { theme, daoInfo } = useDAO();
  const { isDaoAdmin: isAuthorized, authToken } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const { toast } = useToasty();

  const [rows, setRows] = useState<FeedbackRow[]>([]);

  const delegateFeedback = delegateInfo?.stats?.delegateFeedback;
  const forumPosts = delegateFeedback?.posts || [];

  const {
    data: posts,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    [
      'delegate-compensation-forum-activity',
      delegateInfo?.discourseHandle,
      selectedDate?.value.month,
      selectedDate?.value.year,
    ],
    () =>
      getForumActivity(
        selectedDate?.value.month,
        selectedDate?.value.year,
        delegateInfo?.discourseHandle
      ),
    {
      enabled:
        !!delegateInfo?.discourseHandle &&
        !!selectedDate?.value.year &&
        !!selectedDate?.value.month,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!posts?.length) return;
    const setupRows = () => {
      const newRows =
        posts?.map(item => {
          const post = forumPosts.find(forumPost => forumPost.id === item.id);
          return {
            id: item.id,
            status: post?.status || 'valid',
            relevance: post?.relevance || 0,
            depthOfAnalysis: post?.depthOfAnalysis || 0,
            timing: post?.timing || 0,
            clarityAndCommunication: post?.clarityAndCommunication || 0,
            impactOnDecisionMaking: post?.impactOnDecisionMaking || 0,
            totalScore: post?.totalScore || 0,
            comment: item.comment,
            link: item.link,
            topic: item.topic,
            insight: item.insight,
            createdAt: item.createdAt,
          } as FeedbackRow;
        }) || [];
      setRows(newRows);
    };
    setupRows();
  }, [posts, delegateInfo]);

  const [presenceMultiplier, setPresenceMultiplier] = useState(
    delegateFeedback?.presenceMultiplier || 1
  );

  const columns = [
    { title: 'Relevance', id: 'relevance' },
    { title: 'Depth of Analysis', id: 'depthOfAnalysis' },
    { title: 'Timing', id: 'timing' },
    { title: 'Clarity & Communication', id: 'clarityAndCommunication' },
    { title: 'Impact', id: 'impactOnDecisionMaking' },
    { title: 'Total Score', id: 'totalScore', type: 'read-only' },
    { title: 'Valid', id: 'status', type: 'boolean' },
  ];

  const calculateFinalScore = (
    currentScores: ForumActivityBreakdown,
    multiplier = presenceMultiplier
  ) => {
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
    const percentageScore = initialScore / (5 * 4); // Convert to percentage using 5 stats that can have a max of 4
    const percentageWithMultiplier = percentageScore * multiplier;
    const finalScore = Number((percentageWithMultiplier * 30).toFixed(1));
    return finalScore > 30 ? 30 : finalScore;
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    let newValue = +value >= 5 ? 4 : +value || 0;
    if (newValue <= 0 || value === '') {
      newValue = 0;
    }
    if (Number.isNaN(newValue)) {
      newValue = 0;
    }
    const newArray = [...rows];
    if (field === 'status') {
      newArray[index].status = value as 'valid' | 'invalid';
    } else {
      const numericField = field as Exclude<
        keyof ForumActivityBreakdown,
        'id' | 'status'
      >;

      newArray[index][numericField] = newValue;
    }
    newArray[index].totalScore = calculateFinalScore(newArray[index]);

    setRows(newArray);
    setIsModified(true);
  };

  const changePresenceMultiplier = (value: string) => {
    let newValue = +value >= 2 ? 2 : +value || 0;
    if (newValue <= 0 || !newValue || Number.isNaN(newValue)) {
      newValue = 0;
    }
    setPresenceMultiplier(+value);
    setIsModified(true);
    const newArray = [...rows];
    newArray.forEach(post => {
      // eslint-disable-next-line no-param-reassign
      post.totalScore = calculateFinalScore(post, newValue);
    });
    setRows(newArray);
    setIsModified(true);
  };

  const saveFeedback = async () => {
    setIsSaving(true);
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

      const typedRows: ForumActivityBreakdown[] = rows.map(item => ({
        clarityAndCommunication: item.clarityAndCommunication,
        depthOfAnalysis: item.depthOfAnalysis,
        impactOnDecisionMaking: item.impactOnDecisionMaking,
        relevance: item.relevance,
        timing: item.timing,
        id: item.id,
        status: item.status,
        totalScore: item.totalScore,
      }));
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
                presenceMultiplier:
                  presenceMultiplier <= 0
                    ? 0
                    : presenceMultiplier >= 2
                    ? 2
                    : presenceMultiplier,
                posts: typedRows,
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
          refetch();
          queryClient.invalidateQueries({
            queryKey: [
              'delegate-compensation-forum-activity',
              delegateInfo?.discourseHandle,
              selectedDate?.value.month,
              selectedDate?.value.year,
            ],
          });
        });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Failed to save delegate feedback',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DelegateCompensationAdminLayout>
      <Box w="full">
        <Flex flexDir="column" gap="4">
          <Heading fontSize="xl" fontWeight="bold" color={theme.text} mb="4">
            Forum activity
          </Heading>
        </Flex>
        <DelegatePeriod
          delegate="block"
          period
          minimumPeriod={new Date('2024-10-30')}
        />
        {isLoading || isFetching ? (
          <Flex py="4">
            <Spinner />
          </Flex>
        ) : rows?.length ? (
          <Flex flexDir="column" gap="4" w="full">
            <Flex w="full" overflowX="auto">
              <Table variant="simple" w="full">
                <Thead w="full">
                  <Tr
                    w="full"
                    borderBottom="1px solid"
                    borderBottomColor={theme.compensation?.card.dropdown}
                  >
                    <Th
                      borderBottom="1px solid"
                      borderBottomColor={theme.compensation?.card.dropdown}
                    >
                      Topic
                    </Th>
                    <Th
                      borderBottom="1px solid"
                      borderBottomColor={theme.compensation?.card.dropdown}
                    >
                      Comment
                    </Th>
                    <Th
                      borderBottom="1px solid"
                      borderBottomColor={theme.compensation?.card.dropdown}
                    >
                      Date
                    </Th>
                    {columns.map(item => (
                      <Th
                        borderBottom="1px solid"
                        borderBottomColor={theme.compensation?.card.dropdown}
                        key={item.id}
                      >
                        {item.title}
                      </Th>
                    ))}
                  </Tr>
                </Thead>

                <Tbody w="full">
                  {rows?.map((post, index) => {
                    const topicLink = `${post.link
                      .split('/')
                      .slice(0, -1)
                      .join('/')}/`;

                    return (
                      <Tr
                        key={index}
                        w="full"
                        opacity={post.status === 'valid' ? 1 : 0.75}
                      >
                        <Td
                          borderBottom="1px solid"
                          borderBottomColor={theme.compensation?.card.dropdown}
                        >
                          <ChakraLink
                            isExternal
                            href={topicLink}
                            w="max-content"
                            color="blue.500"
                            textDecor="underline"
                            display="flex"
                            flexDir="row"
                            alignItems="center"
                            gap="2"
                            maxW={['240px', '400px']}
                            _hover={{
                              textDecoration: 'none',
                              borderColor: 'blue.400',
                            }}
                            noOfLines={2}
                          >
                            {post.topic}
                          </ChakraLink>
                        </Td>
                        <Td
                          borderBottom="1px solid"
                          borderBottomColor={theme.compensation?.card.dropdown}
                        >
                          <Flex flexDir="row" gap="2">
                            <Flex noOfLines={2} w="full">
                              <MDPreview
                                source={post.comment}
                                // disallowedElements={['a']}
                                components={{
                                  // eslint-disable-next-line id-length, react/no-unstable-nested-components
                                  a: ({ children }) => <Text>{children}</Text>,
                                }}
                              />
                            </Flex>
                            <ChakraLink
                              isExternal
                              href={post.link}
                              color="blue.500"
                              display="flex"
                              flexDir="row"
                              alignItems="center"
                              textDecor="underline"
                              gap="2"
                              _hover={{
                                borderColor: 'blue.300',
                              }}
                              w="max-content"
                              maxW="max-content"
                            >
                              <Icon as={HiExternalLink} boxSize="16px" />
                            </ChakraLink>
                          </Flex>
                        </Td>
                        <Td
                          w="200px"
                          minW="200px"
                          borderBottom="1px solid"
                          borderBottomColor={theme.compensation?.card.dropdown}
                        >
                          {formatDate(post?.createdAt, 'MMM D, YYYY')}
                        </Td>
                        {columns.map(item => {
                          if (item.type === 'read-only' || !isAuthorized) {
                            if (item.id === 'status') {
                              return (
                                <Td
                                  key={item.id + post.id}
                                  borderBottom="1px solid"
                                  borderBottomColor={
                                    theme.compensation?.card.dropdown
                                  }
                                >
                                  {post.status === 'valid' ? (
                                    <TrueIcon
                                      w="24px"
                                      h="24px"
                                      color={theme.compensation?.card.success}
                                    />
                                  ) : (
                                    <FalseIcon
                                      w="24px"
                                      h="24px"
                                      color={theme.compensation?.card.error}
                                    />
                                  )}
                                </Td>
                              );
                            }
                            const stat =
                              post?.[item.id as keyof ForumActivityBreakdown];
                            return (
                              <Td
                                key={item.id + post.id}
                                borderBottom="1px solid"
                                borderBottomColor={
                                  theme.compensation?.card.dropdown
                                }
                              >
                                <Text
                                  fontSize="20px"
                                  fontWeight={700}
                                  color={theme.compensation?.card.secondaryText}
                                  lineHeight="32px"
                                  minW="60px"
                                  minH="32px"
                                  bg="transparent"
                                  textAlign="end"
                                  px="1"
                                >
                                  {post.status === 'invalid' ? '-' : stat}
                                </Text>
                              </Td>
                            );
                          }
                          if (item.id === 'status') {
                            return (
                              <Td
                                key={item.id + post.id}
                                borderBottom="1px solid"
                                borderBottomColor={
                                  theme.compensation?.card.dropdown
                                }
                              >
                                <Switch
                                  isChecked={post.status === 'valid'}
                                  defaultChecked={post.status === 'valid'}
                                  onChange={() => {
                                    const newArray = [...rows];
                                    newArray[index].status =
                                      newArray[index].status === 'valid'
                                        ? 'invalid'
                                        : 'valid';
                                    newArray[index].totalScore = 0;
                                    setRows(newArray);
                                    setIsModified(true);
                                  }}
                                  isDisabled={isSaving}
                                  disabled={isSaving}
                                />
                              </Td>
                            );
                          }
                          return (
                            <Td
                              key={item.id + post.id}
                              borderBottom="1px solid"
                              borderBottomColor={
                                theme.compensation?.card.dropdown
                              }
                            >
                              <Editable
                                defaultValue={String(
                                  post?.[
                                    item.id as keyof ForumActivityBreakdown
                                  ]
                                )}
                                maxW="60px"
                                w="60px"
                              >
                                <EditablePreview
                                  fontSize="20px"
                                  fontWeight={700}
                                  color={theme.compensation?.card.secondaryText}
                                  lineHeight="32px"
                                  cursor="pointer"
                                  textDecor="underline"
                                  minW="60px"
                                  minH="32px"
                                  bg="transparent"
                                  textAlign="end"
                                  px="1"
                                />
                                <EditableInput
                                  onChange={event => {
                                    handleInputChange(
                                      index,
                                      item.id,
                                      event.target.value
                                    );
                                  }}
                                  type="number"
                                  min={0}
                                  max={4}
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
                            </Td>
                          );
                        })}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Flex>
            {isAuthorized ? (
              <Flex flexDir="row" gap="8" justify="flex-end" mt="4">
                <Flex flexDir="row" gap="2" alignItems="center">
                  <Text
                    fontSize="14px"
                    fontWeight={600}
                    color={theme.compensation?.card.secondaryText}
                  >
                    Presence Multiplier
                  </Text>
                  <Input
                    value={presenceMultiplier}
                    onChange={event => {
                      changePresenceMultiplier(event.target.value);
                    }}
                    type="number"
                    min={0}
                    max={2}
                    w="80px"
                    bgColor={theme.compensation?.card.bg}
                    color={theme.compensation?.card.text}
                    textAlign="center"
                  />
                </Flex>
                <Button
                  isDisabled={!isModified || isSaving}
                  disabled={!isModified || isSaving}
                  isLoading={isSaving}
                  w="max-content"
                  alignSelf="flex-end"
                  onClick={() => {
                    saveFeedback();
                  }}
                  bgColor={theme.compensation?.card.bg}
                  color={theme.compensation?.card.text}
                >
                  Save
                </Button>
              </Flex>
            ) : null}
          </Flex>
        ) : (
          <Flex py="4">
            <Text>{`This delegate doesn't have forum posts for this period.`}</Text>
          </Flex>
        )}
      </Box>
    </DelegateCompensationAdminLayout>
  );
};
