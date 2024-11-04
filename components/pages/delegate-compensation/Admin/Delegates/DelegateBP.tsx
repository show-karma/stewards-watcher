import {
  Box,
  Button,
  Flex,
  NumberInput,
  NumberInputField,
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
    delegateInfo?.stats?.bonusPoint || 0
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
    <Box bg={theme.card.background} borderRadius="lg" p={4} width="full">
      <Text color={theme.text} mb={1}>
        Bonus Points
      </Text>
      <Flex gap="4">
        <NumberInput w="full" defaultValue={bonusPoints}>
          <NumberInputField
            type="number"
            min={0}
            max={25}
            onChange={event => {
              setBonusPoints(+event.target.value);
            }}
            placeholder="Enter bonus points"
            mr={2}
            bg={theme.card.background}
            color={theme.text}
            w="full"
          />
        </NumberInput>

        <Button onClick={handleSaveBonusPoints}>Save</Button>
      </Flex>
    </Box>
  );
};
