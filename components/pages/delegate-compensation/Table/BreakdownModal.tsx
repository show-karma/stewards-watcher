/* eslint-disable no-nested-ternary */
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
  Icon,
  useClipboard,
  Tooltip,
  List,
  ListItem,
  Link,
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
import { IoCopy } from 'react-icons/io5';
import { formatNumberPercentage, truncateAddress } from 'utils';
import { FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';

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
  const { onCopy } = useClipboard(delegate?.delegate?.publicAddress || '');
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

  const copyText = () => {
    onCopy();
    toast({
      title: 'Copied to clipboard',
      description: 'Address copied',
      duration: 3000,
    });
  };

  const stats = [
    {
      name: 'Participation Rate (PR)',
      TN: delegate.participationRatePercent
        ? formatNumberPercentage(delegate.participationRatePercent)
        : null,
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
      name: 'Onchain Voting (TV)',
      TN: delegate.onChainVoting.tn,
      RN: delegate.onChainVoting.rn,
      total: delegate.onChainVoting.score,
      formName: 'onChainVoting',
      canEdit: false,
    },
    {
      name: 'Communication Rationale (CR)',
      TN: delegate.communicatingRationale.tn,
      RN: delegate.communicatingRationale.rn,
      total: delegate.communicatingRationale.score,
      formName: 'communicatingRationale',
      canEdit: true,
      breakdown: delegate.communicatingRationale.breakdown,
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
      name: 'Total Participation (TP)',
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

  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setShowBreakdown(false);
      }}
    >
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
            <Text
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
              color={theme.modal.header.title}
            >
              {delegate.delegate.shouldUse}
            </Text>
            {delegate.incentiveOptedIn ? (
              <Tooltip
                shouldWrapChildren
                label="Opted-in to Incentive Program"
                fontSize="md"
              >
                <Icon as={FaCheckCircle} w="4" h="4" color="green.400" />
              </Tooltip>
            ) : (
              <Flex w="16px" />
            )}
          </Flex>
          <Flex flexDir="row" color={theme.subtitle} paddingLeft="44px" gap="3">
            <Text fontSize="xs" fontWeight="medium">
              {truncateAddress(delegate.delegate.publicAddress)}
            </Text>
            <Button
              bg="transparent"
              py="0"
              px="0"
              _hover={{
                opacity: 0.7,
              }}
              _active={{}}
              _focus={{}}
              onClick={copyText}
              h="max-content"
              w="min-content"
              minW="min-content"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={IoCopy} color={theme.subtitle} boxSize="4" />
            </Button>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody w="max-content" maxW="max-content">
          <form onSubmit={handleSubmit(onSave)}>
            <FormControl isInvalid={isValid}>
              {isDaoAdmin && (
                <Flex flexDir="row" gap="2" alignItems="center">
                  <Switch
                    defaultChecked={delegate.incentiveOptedIn}
                    {...register('optedIn')}
                  >
                    Opted-in to Incentive Program
                  </Switch>
                </Flex>
              )}
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
                      >
                        <Flex flexDir="row" gap="2" alignItems="center">
                          Rn{' '}
                          <Tooltip
                            bg={theme.collapse.bg || theme.card.background}
                            color={theme.collapse.text}
                            label={
                              <Flex flexDir="column" py="1" gap="2">
                                <List fontWeight="normal">
                                  <ListItem>
                                    <b>Snapshot Voting (SV):</b> Number of
                                    proposals the delegate voted on in the
                                    month.
                                  </ListItem>
                                  <ListItem>
                                    <b>Onchain Voting (TV):</b> Number of
                                    proposals the delegate voted onchain in the
                                    month.
                                  </ListItem>
                                  <ListItem>
                                    <b>Communication Rationale (CR):</b> Number
                                    of real communication rational threads where
                                    the delegate communicated and justified
                                    his/her decision.
                                  </ListItem>
                                  <ListItem>
                                    <b>Commenting Proposal (CP):</b> Number of
                                    actual proposals where the delegate made a
                                    genuine and quality contribution. Spam
                                    messages will not be considered.
                                  </ListItem>
                                </List>
                              </Flex>
                            }
                          >
                            <Flex w="5" h="5" cursor="pointer">
                              <Icon as={AiFillQuestionCircle} w="5" h="5" />
                            </Flex>
                          </Tooltip>
                        </Flex>
                      </Th>
                      <Th
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor={theme.modal.header.title}
                        color={theme.modal.header.title}
                      >
                        <Flex flexDir="row" gap="2" alignItems="center">
                          Tn{' '}
                          <Tooltip
                            bg={theme.collapse.bg || theme.card.background}
                            color={theme.collapse.text}
                            label={
                              <Flex flexDir="column" py="1" gap="2">
                                <List fontWeight="normal">
                                  <ListItem>
                                    <b>Participation Rate (PR):</b>{' '}
                                    Participation Rate percentage.
                                  </ListItem>
                                  <ListItem>
                                    <b>Snapshot Voting (SV):</b> Number of total
                                    proposals that were sent to snapshots for
                                    voting in the month.
                                  </ListItem>
                                  <ListItem>
                                    <b>Onchain Voting (TV):</b> Number of total
                                    proposals that were sent onchain for voting
                                    in the month.
                                  </ListItem>
                                  <ListItem>
                                    <b>Communication Rationale (CR):</b> Total
                                    number of proposals that were submitted to a
                                    vote.
                                  </ListItem>
                                  <ListItem>
                                    <b>Commenting Proposal (CP):</b> Total
                                    number of formal proposals posted on the
                                    forum.
                                  </ListItem>
                                </List>
                              </Flex>
                            }
                          >
                            <Flex w="5" h="5" cursor="pointer">
                              <Icon as={AiFillQuestionCircle} w="5" h="5" />
                            </Flex>
                          </Tooltip>
                        </Flex>
                      </Th>
                      <Th
                        borderBottomWidth="1px"
                        borderBottomStyle="solid"
                        borderBottomColor={theme.modal.header.title}
                        color={theme.modal.header.title}
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
                          ) : item.formName === 'communicatingRationale' &&
                            item.breakdown ? (
                            showBreakdown ? (
                              <Flex flexDir="column">
                                <Button
                                  bg="transparent"
                                  color={theme.modal.header.title}
                                  onClick={() => setShowBreakdown(false)}
                                >
                                  Hide breakdown
                                </Button>
                                <TableContainer>
                                  <Table>
                                    <Thead>
                                      <Tr>
                                        <Th>Proposal</Th>
                                        <Th>Rationale Communicated?</Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {Object.keys(item.breakdown).map(key => {
                                        const id = key.split('-')[0];
                                        return (
                                          <Tr key={key}>
                                            <Td>
                                              <Link
                                                wordBreak="break-all"
                                                href={`https://snapshot.org/#/arbitrumfoundation.eth/proposal/${id}`}
                                                isExternal
                                                h="max-content"
                                                w="full"
                                                display="flex"
                                                flexDir="row"
                                                gap="1"
                                                alignItems="center"
                                                justifyContent="flex-start"
                                              >
                                                <Text
                                                  maxW="220px"
                                                  wordBreak="break-all"
                                                  whiteSpace="break-spaces"
                                                  color={
                                                    theme.modal.header.title
                                                  }
                                                  textDecoration="underline"
                                                >
                                                  {truncateAddress(id)}
                                                </Text>
                                                <Icon
                                                  as={FaExternalLinkAlt}
                                                  w="4"
                                                  h="4"
                                                />
                                              </Link>
                                            </Td>
                                            <Td>
                                              {item.breakdown?.[key] ===
                                              'not_posted'
                                                ? 'No'
                                                : 'Yes'}
                                            </Td>
                                          </Tr>
                                        );
                                      })}
                                    </Tbody>
                                  </Table>
                                </TableContainer>
                              </Flex>
                            ) : (
                              <Button
                                bg="transparent"
                                px="1"
                                py="1"
                                h="max-content"
                                color={theme.modal.header.title}
                                fontWeight="normal"
                                onClick={() => setShowBreakdown(true)}
                              >
                                {item.total} <BiChevronDown />
                              </Button>
                            )
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
                  bg={theme.branding}
                  color={theme.buttonText}
                >
                  View Delegate Info
                </Button>
                {isDirty && isDaoAdmin ? (
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
