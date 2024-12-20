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
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth, useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { API_ROUTES, KARMA_API } from 'helpers';
import { useToasty } from 'hooks';
import { useState } from 'react';

export const DelegateBP = () => {
  const { delegateInfo, refreshDelegateInfo } = useDelegateCompensation();
  const [totalBonusPoints, setTotalBonusPoints] = useState(
    delegateInfo?.stats?.bonusPoint || '0'
  );
  const [attendances, setAttendances] = useState('0');
  const [contributionPoints, setContributionPoints] = useState('0');

  const totalAttendances = 3;
  const maxBonusPoints = 30;

  const { theme, daoInfo } = useDAO();
  const { authToken } = useAuth();
  const { toast } = useToasty();

  const handleSaveBonusPoints = async () => {
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
              bonusPoint: Number(attendances) + Number(contributionPoints),
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
    }
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
              {totalBonusPoints.toString()}
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
                      <Th />
                      <Th px="2">Value</Th>
                      <Th px="2">Total</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td p="0" textAlign="left">
                        No. of Attendances
                      </Td>
                      <Td p="0" textAlign="center">
                        <Editable
                          defaultValue={attendances.toString()}
                          value={attendances.toString()}
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
                              attendances.toString() === ''
                                ? theme.compensation?.card.link
                                : 'transparent'
                            }
                            w={attendances.toString() === '' ? '32px' : 'auto'}
                            h={attendances.toString() === '' ? '40px' : 'auto'}
                          />
                          <Input
                            as={EditableInput}
                            type="number"
                            onChange={event => {
                              setAttendances(event.target.value);
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
                      </Td>
                      <Td p="0" textAlign="center">
                        <Text
                          fontSize="22px"
                          fontWeight={700}
                          color={theme.compensation?.card.secondaryText}
                          lineHeight="32px"
                          bg="transparent"
                        >
                          {totalAttendances}
                        </Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td p="0" textAlign="left">
                        Contributions
                      </Td>
                      <Td p="0" textAlign="center">
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
                                maxBonusPoints - Number(attendances)
                              ) {
                                setContributionPoints(
                                  (
                                    maxBonusPoints - Number(attendances)
                                  ).toString()
                                );
                              } else {
                                setContributionPoints(event.target.value);
                              }
                            }}
                            placeholder="Enter no. of attendances"
                            bg="transparent"
                            w="min-content"
                            maxW="100px"
                            fontSize="22px"
                            fontWeight={700}
                            color={theme.compensation?.card.secondaryText}
                            lineHeight="32px"
                            px="2"
                            py="0"
                            border="none"
                          />
                        </Editable>
                      </Td>
                      <Td p="0" textAlign="center">
                        <Text
                          fontSize="22px"
                          fontWeight={700}
                          color={theme.compensation?.card.secondaryText}
                          lineHeight="32px"
                          bg="transparent"
                        >
                          {maxBonusPoints - totalAttendances}
                        </Text>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td p="0" textAlign="left">
                        Total Bonus Points
                      </Td>
                      <Td p="0" textAlign="center" />
                      <Td p="0" textAlign="center">
                        <Text
                          fontSize="22px"
                          fontWeight={700}
                          color={theme.compensation?.card.secondaryText}
                          lineHeight="32px"
                          bg="transparent"
                        >
                          {Number(attendances) + Number(contributionPoints)}
                        </Text>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>

                <Flex w="full" justify="center" mt="3">
                  <Button
                    isDisabled={
                      attendances.toString() === '' ||
                      contributionPoints.toString() === ''
                    }
                    disabled={
                      attendances.toString() === '' ||
                      contributionPoints.toString() === ''
                    }
                    onClick={handleSaveBonusPoints}
                    color={theme.compensation?.card.secondaryText}
                    bg={theme.compensation?.bg}
                  >
                    Save
                  </Button>
                </Flex>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </Flex>
  );
};
