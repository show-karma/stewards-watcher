import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
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
import { useAuth, useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { API_ROUTES, KARMA_API } from 'helpers';
import { useToasty } from 'hooks';
import { useEffect, useState } from 'react';
import { formatSimpleNumber } from 'utils';
import { getProposals } from 'utils/delegate-compensation/getProposals';

export const DelegateBP = () => {
  const { delegateInfo, refreshDelegateInfo, selectedDate } =
    useDelegateCompensation();
  const [totalBonusPoints, setTotalBonusPoints] = useState(
    delegateInfo?.stats?.bonusPoint || '0'
  );
  const { theme, daoInfo } = useDAO();
  const { authToken, isDaoAdmin: isAuthorized } = useAuth();
  const { toast } = useToasty();
  const [isSaving, setIsSaving] = useState(false);

  const { data: proposalsData } = useQuery(
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
      initialData: {
        proposals: [],
        finished: false,
        biweeklyCalls: 0,
        monthlyCalls: 0,
      },
      enabled:
        !!selectedDate?.value.month &&
        !!selectedDate?.value.year &&
        !!daoInfo.config.DAO_KARMA_ID,
      refetchOnWindowFocus: false,
    }
  );

  const [attendancesBiWeekly, setAttendancesBiWeekly] = useState('0');
  const [attendancesMonthly, setAttendancesMonthly] = useState('0');
  const [contributionPoints, setContributionPoints] = useState('0');

  useEffect(() => {
    if (delegateInfo) {
      setAttendancesBiWeekly(
        delegateInfo.stats?.biweeklyCalls?.toString() || '0'
      );
      setAttendancesMonthly(
        delegateInfo.stats?.monthlyCalls?.toString() || '0'
      );
      setContributionPoints(
        delegateInfo.stats?.contributions?.toString() ||
          delegateInfo.stats?.bonusPoint?.toString() ||
          '0'
      );
      setTotalBonusPoints(delegateInfo.stats?.bonusPoint?.toString() || '0');
    }
  }, [delegateInfo]);

  const totalAttendancesBiWeekly = proposalsData?.biweeklyCalls || 0;
  const totalAttendancesMonthly = proposalsData?.monthlyCalls || 0;
  const maxBonusPoints = 30;

  const pointsPerAttendance = 2.5;

  const partialBP =
    +(delegateInfo?.stats?.totalParticipation ?? 0) *
    (0.025 * (Number(attendancesMonthly) + Number(attendancesBiWeekly)));

  function calculateBonusPoints() {
    const totalBP =
      +(delegateInfo?.stats?.totalParticipation ?? 0) *
        (((Number(attendancesMonthly) + Number(attendancesBiWeekly)) /
          (totalAttendancesBiWeekly + totalAttendancesMonthly)) *
          0.05) +
      Number(contributionPoints);
    return Math.min(totalBP, 30).toFixed(2);
  }

  const maxContributionPossible = 25;

  const currentTotalBP = calculateBonusPoints();

  const handleSaveBonusPoints = async () => {
    try {
      setIsSaving(true);
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
              monthlyCalls: +attendancesMonthly,
              biweeklyCalls: +attendancesBiWeekly,
              contributions: +contributionPoints,
            },
          }
        )
        .then(() => {
          toast({
            title: 'Success',
            description: 'Bonus points saved successfully',
          });
          refreshDelegateInfo();
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderBiWeekly = () => {
    if (+totalAttendancesBiWeekly) {
      return (
        <Tr>
          <Td
            p="0"
            textAlign="left"
            borderBottomColor={theme.compensation?.card.divider}
            borderBottom="1px solid"
          >
            No. of Attendances Bi-Weekly
          </Td>
          <Td
            p="0"
            textAlign="center"
            borderBottomColor={theme.compensation?.card.divider}
            borderBottom="1px solid"
          >
            {isAuthorized ? (
              <Editable
                defaultValue={attendancesBiWeekly.toString()}
                value={attendancesBiWeekly.toString()}
              >
                <EditablePreview
                  fontSize="22px"
                  fontWeight={700}
                  color={theme.compensation?.card.secondaryText}
                  lineHeight="32px"
                  cursor="pointer"
                  textDecor="underline"
                  bg="transparent"
                  border="2px solid"
                  borderColor={
                    attendancesBiWeekly.toString() === ''
                      ? theme.compensation?.card.link
                      : 'transparent'
                  }
                  w={attendancesBiWeekly.toString() === '' ? '32px' : 'auto'}
                  h={attendancesBiWeekly.toString() === '' ? '40px' : 'auto'}
                />
                <Input
                  as={EditableInput}
                  type="number"
                  onChange={event => {
                    if (
                      Number(event.target.value) >= totalAttendancesBiWeekly
                    ) {
                      setAttendancesBiWeekly(
                        totalAttendancesBiWeekly.toString()
                      );
                    } else {
                      setAttendancesBiWeekly(event.target.value);
                    }
                  }}
                  placeholder="Enter no. of attendances"
                  bg="transparent"
                  w="36px"
                  fontSize="22px"
                  fontWeight={700}
                  color={theme.compensation?.card.secondaryText}
                  lineHeight="32px"
                  px="2"
                  py="0"
                  border="none"
                />
              </Editable>
            ) : (
              <Text
                fontSize="22px"
                fontWeight={700}
                color={theme.compensation?.card.secondaryText}
                lineHeight="32px"
                bg="transparent"
              >
                {attendancesBiWeekly}
              </Text>
            )}
          </Td>
          <Td
            p="0"
            textAlign="center"
            borderBottomColor={theme.compensation?.card.divider}
            borderBottom="1px solid"
          >
            <Text
              fontSize="22px"
              fontWeight={700}
              color={theme.compensation?.card.secondaryText}
              lineHeight="32px"
              bg="transparent"
            >
              {totalAttendancesBiWeekly}
            </Text>
          </Td>
        </Tr>
      );
    }
    return null;
  };

  const renderMonthly = () => {
    if (+totalAttendancesMonthly) {
      return (
        <Tr>
          <Td
            p="0"
            textAlign="left"
            borderBottomColor={theme.compensation?.card.divider}
            borderBottom="1px solid"
          >
            No. of Attendances Monthly
          </Td>
          <Td
            p="0"
            textAlign="center"
            borderBottomColor={theme.compensation?.card.divider}
            borderBottom="1px solid"
          >
            {isAuthorized ? (
              <Editable
                defaultValue={attendancesMonthly.toString()}
                value={attendancesMonthly.toString()}
              >
                <EditablePreview
                  fontSize="22px"
                  fontWeight={700}
                  color={theme.compensation?.card.secondaryText}
                  lineHeight="32px"
                  cursor="pointer"
                  textDecor="underline"
                  bg="transparent"
                  border="2px solid"
                  borderColor={
                    attendancesMonthly.toString() === ''
                      ? theme.compensation?.card.link
                      : 'transparent'
                  }
                  w={attendancesMonthly.toString() === '' ? '32px' : 'auto'}
                  h={attendancesMonthly.toString() === '' ? '40px' : 'auto'}
                />
                <Input
                  as={EditableInput}
                  type="number"
                  onChange={event => {
                    if (Number(event.target.value) >= totalAttendancesMonthly) {
                      setAttendancesMonthly(totalAttendancesMonthly.toString());
                    } else {
                      setAttendancesMonthly(event.target.value);
                    }
                  }}
                  placeholder="Enter no. of attendances"
                  bg="transparent"
                  w="36px"
                  fontSize="22px"
                  fontWeight={700}
                  color={theme.compensation?.card.secondaryText}
                  lineHeight="32px"
                  px="2"
                  py="0"
                  border="none"
                />
              </Editable>
            ) : (
              <Text
                fontSize="22px"
                fontWeight={700}
                color={theme.compensation?.card.secondaryText}
                lineHeight="32px"
                bg="transparent"
              >
                {attendancesMonthly}
              </Text>
            )}
          </Td>
          <Td
            p="0"
            textAlign="center"
            borderBottomColor={theme.compensation?.card.divider}
            borderBottom="1px solid"
          >
            <Text
              fontSize="22px"
              fontWeight={700}
              color={theme.compensation?.card.secondaryText}
              lineHeight="32px"
              bg="transparent"
            >
              {totalAttendancesMonthly}
            </Text>
          </Td>
        </Tr>
      );
    }
    return null;
  };

  return (
    <Flex flexDir="column" gap="0" justify="center" align="flex-start" w="full">
      <Text
        fontSize="16px"
        fontWeight="600"
        color={theme.compensation?.card.text}
        lineHeight="24px"
      >
        Bonus Points
      </Text>
      <Flex gap="4" justify="space-between" flexDir="row" w="full">
        <Popover>
          <PopoverTrigger>
            <Button
              fontSize="24px"
              fontWeight={700}
              color={theme.compensation?.card.secondaryText}
              lineHeight="32px"
              cursor="pointer"
              textDecor="underline"
              bg="transparent"
              border="2px solid"
              borderColor={
                totalBonusPoints.toString() === ''
                  ? theme.compensation?.card.link
                  : 'transparent'
              }
              w={totalBonusPoints.toString() === '' ? '32px' : 'auto'}
              h={totalBonusPoints.toString() === '' ? '40px' : 'auto'}
              px="0"
              py="0"
            >
              <Flex flexDir="row" gap="3" align="center" justify="start">
                {totalBonusPoints.toString()}
                {isSaving ? <Spinner size="xs" /> : null}
              </Flex>
            </Button>
          </PopoverTrigger>
          <PopoverContent w="max-content" bg={theme.compensation?.modal.block}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader
              color={theme.compensation?.card.text}
              fontSize="16px"
            >
              Bonus Points
            </PopoverHeader>
            <PopoverBody>
              <Flex flexDir="column" gap="1">
                <Table>
                  <Thead>
                    <Tr>
                      <Th borderColor={theme.compensation?.card.divider} />
                      <Th px="2" borderColor={theme.compensation?.card.divider}>
                        Value
                      </Th>
                      <Th px="2" borderColor={theme.compensation?.card.divider}>
                        MAX
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {renderBiWeekly()}
                    {renderMonthly()}
                    <Tr>
                      <Td
                        p="0"
                        textAlign="left"
                        borderBottomColor={theme.compensation?.card.divider}
                        borderBottom="1px solid"
                      >
                        Contributions
                      </Td>
                      <Td
                        p="0"
                        textAlign="center"
                        borderBottomColor={theme.compensation?.card.divider}
                        borderBottom="1px solid"
                      >
                        {isAuthorized ? (
                          <Editable
                            defaultValue={contributionPoints.toString()}
                            value={contributionPoints.toString()}
                          >
                            <EditablePreview
                              fontSize="22px"
                              fontWeight={700}
                              color={theme.compensation?.card.secondaryText}
                              lineHeight="32px"
                              cursor="pointer"
                              textDecor="underline"
                              bg="transparent"
                              border="2px solid"
                              borderColor={
                                contributionPoints.toString() === ''
                                  ? theme.compensation?.card.link
                                  : 'transparent'
                              }
                              w={
                                contributionPoints.toString() === ''
                                  ? '36px'
                                  : 'auto'
                              }
                              h={
                                contributionPoints.toString() === ''
                                  ? '40px'
                                  : 'auto'
                              }
                            />
                            <Input
                              as={EditableInput}
                              type="number"
                              onChange={event => {
                                if (
                                  Number(event.target.value) >
                                  maxContributionPossible
                                ) {
                                  setContributionPoints(
                                    maxContributionPossible.toString()
                                  );
                                } else {
                                  setContributionPoints(event.target.value);
                                }
                              }}
                              placeholder="Enter no. of attendances"
                              bg="transparent"
                              w="min-content"
                              maxW="64px"
                              fontSize="22px"
                              fontWeight={700}
                              color={theme.compensation?.card.secondaryText}
                              lineHeight="32px"
                              px="2"
                              py="0"
                              border="none"
                            />
                          </Editable>
                        ) : (
                          <Text
                            fontSize="22px"
                            fontWeight={700}
                            color={theme.compensation?.card.secondaryText}
                            lineHeight="32px"
                            bg="transparent"
                          >
                            {contributionPoints}
                          </Text>
                        )}
                      </Td>
                      <Td
                        p="0"
                        textAlign="center"
                        borderBottomColor={theme.compensation?.card.divider}
                        borderBottom="1px solid"
                      >
                        <Text
                          fontSize="22px"
                          fontWeight={700}
                          color={theme.compensation?.card.secondaryText}
                          lineHeight="32px"
                          bg="transparent"
                        >
                          {maxContributionPossible}
                        </Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td
                        p="0"
                        textAlign="left"
                        borderBottomColor={theme.compensation?.card.divider}
                        borderBottom="1px solid"
                      >
                        Total Bonus Points
                      </Td>

                      <Td
                        p="0"
                        textAlign="center"
                        borderBottomColor={theme.compensation?.card.divider}
                        borderBottom="1px solid"
                      >
                        <Text
                          fontSize="22px"
                          fontWeight={700}
                          color={theme.compensation?.card.secondaryText}
                          lineHeight="32px"
                          bg="transparent"
                        >
                          {Math.min(+formatSimpleNumber(currentTotalBP), 30)}
                        </Text>
                      </Td>
                      <Td
                        p="0"
                        textAlign="center"
                        borderBottomColor={theme.compensation?.card.divider}
                        borderBottom="1px solid"
                      >
                        <Text
                          fontSize="22px"
                          fontWeight={700}
                          color={theme.compensation?.card.secondaryText}
                          lineHeight="32px"
                          bg="transparent"
                        >
                          {maxBonusPoints}
                        </Text>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>

                {isAuthorized ? (
                  <Flex w="full" justify="center" mt="3">
                    <Button
                      isDisabled={
                        attendancesBiWeekly.toString() === '' ||
                        attendancesMonthly.toString() === '' ||
                        contributionPoints.toString() === ''
                      }
                      disabled={
                        attendancesBiWeekly.toString() === '' ||
                        attendancesMonthly.toString() === '' ||
                        contributionPoints.toString() === ''
                      }
                      onClick={handleSaveBonusPoints}
                      color={theme.compensation?.card.secondaryText}
                      bg={theme.compensation?.bg}
                      isLoading={isSaving}
                    >
                      Save
                    </Button>
                  </Flex>
                ) : null}
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </Flex>
  );
};
