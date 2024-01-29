import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
  Button,
  Editable,
  EditablePreview,
  EditableInput,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Switch,
  FormControl,
} from '@chakra-ui/react';
import { ImgWithFallback } from 'components/ImgWithFallback';
import { useAuth, useDAO, useDelegates } from 'contexts';
import { FC, useState } from 'react';
import { DelegateCompensationStats } from 'types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useToasty } from 'hooks';
import { API_ROUTES } from 'helpers';

interface BreakdownModalProps {
  delegate: DelegateCompensationStats;
  isOpen: boolean;
  onClose: () => void;
  refreshFn: () => Promise<void>;
}

const schema = yup.object({
  optedIn: yup.boolean().required(),
  commentingProposal: yup.object({
    rn: yup
      .number()
      .typeError('RN must be a number.')
      .required('RN is required'),
    tn: yup
      .number()
      .typeError('TN must be a number.')
      .required('TN is required'),
  }),
  communicatingRationale: yup.object({
    rn: yup
      .number()
      .typeError('RN must be a number.')
      .required('RN is required'),
    tn: yup
      .number()
      .typeError('TN must be a number.')
      .required('TN is required'),
  }),
  bonusPoint: yup.object({
    total: yup
      .number()
      .typeError('Total must be a number.')
      .required('Total is required'),
  }),
});

type StatKeys = 'commentingProposal' | 'bonusPoint';

type FormData = yup.InferType<typeof schema>;

export const BreakdownModal: FC<BreakdownModalProps> = ({
  delegate,
  isOpen,
  onClose,
  refreshFn,
}) => {
  const { theme, daoInfo } = useDAO();
  const { isDaoAdmin, authToken } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const { openProfile } = useDelegates();
  const { toast } = useToasty();
  const {
    register,
    formState: { errors, isValid, isDirty },
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      // amount: +payload.amount,
    },
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const stats = [
    {
      name: 'Participation Rate (PR)',
      TN: null,
      RN: null,
      total: delegate.participationRate,
      formName: 'participationRate',
      canEdit: false,
    },
    {
      name: 'Snapshot Voting (SV)',
      TN: delegate.snapshotVoting.tn,
      RN: delegate.snapshotVoting.rn,
      total: delegate.snapshotVoting.score,
      formName: 'snapshotVoting',
      canEdit: false,
    },
    {
      name: 'Tally Voting (TV)',
      TN: delegate.onChainVoting.tn,
      RN: delegate.onChainVoting.rn,
      total: delegate.onChainVoting.score,
      formName: 'onChainVoting',
      canEdit: false,
    },
    {
      name: 'Communicating Rationale (CR)',
      TN: delegate.communicatingRationale.tn,
      RN: delegate.communicatingRationale.rn,
      total: delegate.communicatingRationale.score,
      formName: 'communicatingRationale',
      canEdit: true,
    },
    {
      name: 'Commenting Proposal (CP)',
      TN: delegate.commentingProposal.tn,
      RN: delegate.commentingProposal.rn,
      total: delegate.commentingProposal.score,
      formName: 'commentingProposal',
      canEdit: true,
    },
    {
      name: 'Bonus Point (BP)',
      TN: null,
      RN: null,
      total: delegate.bonusPoint,
      formName: 'bonusPoint',
      canEdit: true,
    },
    {
      name: 'Total Particiaption (TP)',
      TN: null,
      RN: null,
      total: delegate.totalParticipation,
      formName: 'totalParticipation',
      canEdit: false,
    },
  ];

  const onSave = async (data: {
    optedIn: boolean;
    commentingProposal: { rn: number; tn: number };
    communicatingRationale: { rn: number; tn: number };
    bonusPoint: { total: number };
  }) => {
    setIsSaving(true);
    try {
      const authorizedAPI = axios.create({
        timeout: 30000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: authToken ? `Bearer ${authToken}` : '',
        },
      });
      await authorizedAPI.put(
        API_ROUTES.DELEGATE.CHANGE_INCENTIVE_PROGRAM_STATS(
          daoInfo.config.DAO_KARMA_ID,
          delegate.id
        ),
        {
          incentiveOptedIn: data.optedIn,
          stats: {
            communicatingRationale: {
              rn: data.communicatingRationale.rn,
              tn: data.communicatingRationale.tn,
            },
            commentingProposal: {
              rn: data.commentingProposal.rn,
              tn: data.commentingProposal.tn,
            },
            bonusPoints: data.bonusPoint.total,
          },
        }
      );
      toast({
        title: 'Success',
        description: 'Delegate updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      refreshFn();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        w="max-content"
        maxW="max-content"
        py="4"
        background={theme.modal.background}
      >
        <ModalHeader>
          <Flex flexDir="row" gap="3" alignItems="center" mr="8">
            <ImgWithFallback
              borderRadius="full"
              boxSize="32px"
              fallback={delegate.delegate.shouldUse}
              src={delegate.delegateImage}
            />
            <Text w="full" color={theme.modal.header.title}>
              {delegate.delegate.shouldUse}
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody w="max-content" maxW="max-content">
          <form onSubmit={handleSubmit(onSave)}>
            <FormControl isInvalid={isValid}>
              <Flex flexDir="row" gap="2" alignItems="center">
                <Switch
                  defaultChecked={delegate.incentiveOptedIn}
                  {...register('optedIn')}
                >
                  Opted-in to Incentive Program
                </Switch>
              </Flex>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor={theme.modal.header.title}
                        color={theme.modal.header.title}
                      >
                        Stat
                      </Th>
                      <Th
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor={theme.modal.header.title}
                        color={theme.modal.header.title}
                        isNumeric
                      >
                        Rn
                      </Th>
                      <Th
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor={theme.modal.header.title}
                        color={theme.modal.header.title}
                        isNumeric
                      >
                        Tn
                      </Th>
                      <Th
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor={theme.modal.header.title}
                        color={theme.modal.header.title}
                        isNumeric
                      >
                        Total
                      </Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {stats.map(item => (
                      <Tr key={item.name}>
                        <Td
                          borderBottomWidth="1px"
                          borderBottomStyle="solid"
                          borderBottomColor={theme.modal.header.title}
                          color={theme.modal.header.title}
                        >
                          {item.name}
                        </Td>
                        <Td
                          borderBottomWidth="1px"
                          borderBottomStyle="solid"
                          borderBottomColor={theme.modal.header.title}
                          color={theme.modal.header.title}
                        >
                          {item.RN && item.canEdit && isDaoAdmin ? (
                            <Flex flexDir="row" gap="4" alignItems="center">
                              <Editable
                                w="48px"
                                defaultValue={item.RN.toString()}
                              >
                                <EditablePreview
                                  cursor="pointer"
                                  _hover={{ opacity: 0.7 }}
                                  px="1"
                                  bg={
                                    errors &&
                                    (
                                      errors[
                                        item.formName as keyof typeof errors
                                      ] as any
                                    )?.rn
                                      ? 'red.900'
                                      : 'gray.700'
                                  }
                                  w="full"
                                />
                                <EditableInput
                                  w="full"
                                  bg="gray.900"
                                  disabled={isSaving}
                                  _active={{}}
                                  _focus={{
                                    bg: 'gray.700',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: theme.modal.header.title,
                                    padding: '0 4px',
                                  }}
                                  _focusVisible={{}}
                                  _focusWithin={{}}
                                  {...register(
                                    `${item.formName as StatKeys}.rn` as any
                                  )}
                                />
                              </Editable>
                            </Flex>
                          ) : (
                            <Text px="1" color={theme.modal.header.title}>
                              {item.RN}
                            </Text>
                          )}
                        </Td>
                        <Td
                          borderBottomWidth="1px"
                          borderBottomStyle="solid"
                          borderBottomColor={theme.modal.header.title}
                          color={theme.modal.header.title}
                        >
                          {item.TN && item.canEdit && isDaoAdmin ? (
                            <Flex flexDir="row" gap="4" alignItems="center">
                              <Editable
                                w="48px"
                                defaultValue={item.TN.toString()}
                              >
                                <EditablePreview
                                  cursor="pointer"
                                  _hover={{ opacity: 0.7 }}
                                  px="1"
                                  bg={
                                    errors &&
                                    (
                                      errors[
                                        item.formName as keyof typeof errors
                                      ] as any
                                    )?.tn
                                      ? 'red.900'
                                      : 'gray.700'
                                  }
                                  w="full"
                                />
                                <EditableInput
                                  w="full"
                                  px="1"
                                  bg="gray.900"
                                  disabled={isSaving}
                                  _active={{}}
                                  _focus={{
                                    bg: 'gray.700',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: theme.modal.header.title,
                                    padding: '0 4px',
                                  }}
                                  _focusVisible={{}}
                                  _focusWithin={{}}
                                  {...register(
                                    `${item.formName as StatKeys}.tn` as any
                                  )}
                                />
                              </Editable>
                            </Flex>
                          ) : (
                            <Text px="1" color={theme.modal.header.title}>
                              {item.TN}
                            </Text>
                          )}
                        </Td>

                        <Td
                          borderBottomWidth="1px"
                          borderBottomStyle="solid"
                          borderBottomColor={theme.modal.header.title}
                          color={theme.modal.header.title}
                        >
                          {item.total &&
                          item.canEdit &&
                          (!item.TN || !item.RN) &&
                          isDaoAdmin ? (
                            <Flex flexDir="row" gap="4" alignItems="center">
                              <Editable
                                w="48px"
                                defaultValue={item.total.toString()}
                              >
                                <EditablePreview
                                  cursor="pointer"
                                  _hover={{ opacity: 0.7 }}
                                  px="1"
                                  bg={
                                    errors &&
                                    (
                                      errors[
                                        item.formName as keyof typeof errors
                                      ] as any
                                    )?.total
                                      ? 'red.900'
                                      : 'gray.700'
                                  }
                                  w="full"
                                />
                                <EditableInput
                                  w="full"
                                  px="1"
                                  _active={{}}
                                  disabled={isSaving}
                                  _focus={{
                                    bg: 'gray.700',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: theme.modal.header.title,
                                    padding: '0 8px',
                                    width: '64px',
                                  }}
                                  _focusVisible={{}}
                                  _focusWithin={{}}
                                  {...register(
                                    `${
                                      item.formName as keyof typeof schema
                                    }.total` as any
                                  )}
                                />
                              </Editable>
                            </Flex>
                          ) : (
                            <Text px="1" color={theme.modal.header.title}>
                              {item.total}
                            </Text>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              <Flex
                flexDir="row"
                gap="4"
                justifyContent="space-between"
                alignItems="center"
                mt="8"
                mb="4"
              >
                <Button
                  onClick={() => {
                    openProfile(
                      delegate.delegate.publicAddress,
                      'overview',
                      false
                    );
                    onClose();
                  }}
                >
                  Open delegate profile
                </Button>
                {isDirty ? (
                  <Button
                    type="submit"
                    bg="blue.900"
                    _hover={{ opacity: 0.4 }}
                    isDisabled={!isValid || isSaving}
                    disabled={!isValid || isSaving}
                    isLoading={isSaving}
                  >
                    Save changes
                  </Button>
                ) : null}
              </Flex>
            </FormControl>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
