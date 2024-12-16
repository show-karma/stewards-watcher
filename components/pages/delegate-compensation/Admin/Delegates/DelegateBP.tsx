import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Input,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth, useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { API_ROUTES, KARMA_API } from 'helpers';
import { useToasty } from 'hooks';
import { useState } from 'react';

export const DelegateBP = () => {
  const { delegateInfo, refreshDelegateInfo } = useDelegateCompensation();
  const [bonusPoints, setBonusPoints] = useState(
    delegateInfo?.stats?.bonusPoint || '0'
  );
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
              bonusPoints,
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
        <Editable
          defaultValue={bonusPoints.toString()}
          value={bonusPoints.toString()}
        >
          <EditablePreview
            fontSize="24px"
            fontWeight={700}
            color={theme.compensation?.card.secondaryText}
            lineHeight="32px"
            cursor="pointer"
            textDecor="underline"
            bg="transparent"
            border="2px solid"
            borderColor={
              bonusPoints.toString() === ''
                ? theme.compensation?.card.link
                : 'transparent'
            }
            w={bonusPoints.toString() === '' ? '32px' : 'auto'}
            h={bonusPoints.toString() === '' ? '40px' : 'auto'}
          />
          <Input
            as={EditableInput}
            type="number"
            onChange={event => {
              setBonusPoints(event.target.value);
            }}
            placeholder="Enter bonus points"
            mr={2}
            bg={theme.compensation?.card.bg}
            w="full"
            fontSize="24px"
            fontWeight={700}
            color={theme.compensation?.card.secondaryText}
            lineHeight="32px"
            px="2"
          />
        </Editable>

        <Button
          isDisabled={bonusPoints.toString() === ''}
          disabled={bonusPoints.toString() === ''}
          onClick={handleSaveBonusPoints}
        >
          Save
        </Button>
      </Flex>
    </Flex>
  );
};
