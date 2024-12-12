import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth, useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { API_ROUTES, KARMA_API } from 'helpers';
import { useToasty } from 'hooks';
import { useState } from 'react';
import { formatSimpleNumber } from 'utils';
import { DelegateFeedback } from './DelegateFeedback';

export const DelegateFeedbackCard = () => {
  const { delegateInfo, refreshDelegateInfo } = useDelegateCompensation();
  const [delegateFeedback, setDelegateFeedback] = useState(
    delegateInfo?.stats?.delegateFeedback?.finalScore || 0
  );
  const { theme, daoInfo } = useDAO();
  const { authToken } = useAuth();
  const { toast } = useToasty();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const handleSaveDelegateFeedback = async () => {
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
                finalScore: delegateFeedback,
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
    <>
      {/* Delegate Feedback Modal */}
      {isFeedbackModalOpen ? (
        <DelegateFeedback
          isModalOpen={isFeedbackModalOpen}
          setIsModalOpen={setIsFeedbackModalOpen}
        />
      ) : null}
      <Flex
        flexDir="column"
        gap="0"
        justify="center"
        align="flex-start"
        w="full"
      >
        <Button
          p="0"
          bg="transparent"
          borderRadius="0"
          h="24px"
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
        <Flex gap="4" justify="space-between" flexDir="row" w="full">
          <Editable
            defaultValue={formatSimpleNumber(delegateFeedback.toString())}
            value={formatSimpleNumber(delegateFeedback.toString()) || '0'}
          >
            <EditablePreview
              fontSize="24px"
              fontWeight={700}
              color={theme.compensation?.card.secondaryText}
              lineHeight="32px"
              cursor="pointer"
              textDecor="underline"
            />
            <EditableInput
              type="number"
              min={0}
              max={30}
              onChange={event => {
                if (+event.target.value >= 30) {
                  setDelegateFeedback(30);
                } else {
                  setDelegateFeedback(+event.target.value);
                }
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

          <Button onClick={handleSaveDelegateFeedback}>Save</Button>
        </Flex>
      </Flex>
    </>
  );
};
