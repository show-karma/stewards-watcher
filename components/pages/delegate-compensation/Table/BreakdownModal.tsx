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
} from '@chakra-ui/react';
import { ImgWithFallback } from 'components/ImgWithFallback';
import { useDAO, useDelegates } from 'contexts';
import { FC, useState } from 'react';
import { DelegateCompensationStats } from 'types';

interface BreakdownModalProps {
  delegate: DelegateCompensationStats;
  isOpen: boolean;
  onClose: () => void;
}

export const BreakdownModal: FC<BreakdownModalProps> = ({
  delegate,
  isOpen,
  onClose,
}) => {
  const { theme } = useDAO();
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { openProfile } = useDelegates();

  const stats = [
    {
      name: 'Participation Rate (PR)',
      TN: null,
      RN: null,
      total: delegate.participationRate,
    },
    {
      name: 'Snapshot Voting (SV)',
      TN: delegate.snapshotVoting.tn,
      RN: delegate.snapshotVoting.rn,
      total: delegate.snapshotVoting.score,
    },
    {
      name: 'Tally Voting (TV)',
      TN: delegate.onChainVoting.tn,
      RN: delegate.onChainVoting.rn,
      total: delegate.onChainVoting.score,
    },
    {
      name: 'Communicating Rationale (CR)',
      TN: delegate.communicatingRationale.tn,
      RN: delegate.communicatingRationale.rn,
      total: delegate.communicatingRationale.score,
    },
    {
      name: 'Commenting Proposal (CP)',
      TN: delegate.commentingProposal.tn,
      RN: delegate.commentingProposal.rn,
      total: delegate.commentingProposal.score,
    },
    {
      name: 'Bonus Point (BP)',
      TN: null,
      RN: null,
      total: delegate.bonusPoint,
    },
    {
      name: 'Total Particiaption (TP)',
      TN: null,
      RN: null,
      total: delegate.totalParticipation,
    },
  ];

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
              fallback={delegate.delegate}
              src={delegate.delegateImage}
            />
            <Text w="full" color={theme.modal.header.title}>
              {delegate.delegate}
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody w="max-content" maxW="max-content">
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
                    Tn
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
                      {item.TN ? (
                        <Flex flexDir="row" gap="4" alignItems="center">
                          <Editable w="48px" defaultValue={item.TN.toString()}>
                            <EditablePreview
                              cursor="pointer"
                              _hover={{ opacity: 0.7 }}
                            />
                            <EditableInput
                              w="full"
                              bg="gray.900"
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
                              onChange={() => {
                                setIsChanged(true);
                              }}
                            />
                          </Editable>
                        </Flex>
                      ) : null}
                    </Td>
                    <Td
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor={theme.modal.header.title}
                      color={theme.modal.header.title}
                    >
                      {item.TN ? (
                        <Flex flexDir="row" gap="4" alignItems="center">
                          <Editable w="48px" defaultValue={item.RN.toString()}>
                            <EditablePreview
                              cursor="pointer"
                              _hover={{ opacity: 0.7 }}
                            />
                            <EditableInput
                              w="full"
                              bg="gray.900"
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
                              onChange={() => {
                                setIsChanged(true);
                              }}
                            />
                          </Editable>
                        </Flex>
                      ) : null}
                    </Td>
                    <Td
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor={theme.modal.header.title}
                      color={theme.modal.header.title}
                    >
                      {item.total}
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
                openProfile(delegate.delegate, 'overview', false);
                onClose();
              }}
            >
              Open delegate profile
            </Button>
            {isChanged ? (
              <Button
                bg="blue.900"
                _hover={{ opacity: 0.4 }}
                onClick={() => {
                  setIsSaving(true);
                  setTimeout(() => {
                    setIsSaving(false);
                  }, 2000);
                }}
                isLoading={isSaving}
              >
                Save changes
              </Button>
            ) : null}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
