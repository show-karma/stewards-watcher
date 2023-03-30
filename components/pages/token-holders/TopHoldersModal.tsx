import {
  Button,
  Flex,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ExpandIcon } from 'components/Icons';
import { ImgWithFallback } from 'components/ImgWithFallback';
import { useDAO } from 'contexts';
import React, { useState } from 'react';

interface IHolders {
  position: number;
  nameOrAddress: string;
  address: string;
  tokensDelegated: number | string;
  picture?: string;
  wallets: string[];
}

interface IDelegateVotesModal {
  isOpen: boolean;
  onClose?: () => void;
  data: IHolders[];
}

export const TopHoldersModal: React.FC<IDelegateVotesModal> = ({
  isOpen = false,
  onClose = () => ({}),
  data,
}) => {
  const { theme } = useDAO();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        background="linear-gradient(359.86deg, rgba(20, 21, 24, 0.85) 41.37%, rgba(33, 35, 40, 0) 101.24%)"
        backdropFilter="blur(4px)"
      />
      <ModalContent
        w={{ base: 'max-content', lg: '920' }}
        maxW={{ base: 'max-content', lg: '920' }}
        bgColor={theme.tokenHolders.delegations.bg.primary}
        mx="1rem"
        maxH="max-content"
        borderTopRadius="12px"
      >
        <ModalBody
          px="0"
          py="0"
          w="full"
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            color={theme.tokenHolders.delegations.text.primary}
            bg={theme.tokenHolders.delegations.bg.primary}
            borderBottomRadius="none"
            display="flex"
            flexDir="row"
            alignItems="center"
            justifyContent="center"
            onClick={onClose}
            _active={{}}
            _hover={{}}
            _focus={{}}
            _focusWithin={{}}
            _focusVisible={{}}
            py="6"
          >
            <Text fontWeight="800" fontSize="14px">
              Top 10{' '}
              <Text fontWeight="600" fontSize="14px" as="span">
                tokenholders
              </Text>
            </Text>

            <ExpandIcon boxSize="12px" ml="2" transform="rotateZ(180deg)" />
          </Button>
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>
                    <Text>Top 10 Delegates</Text>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((holder, index) => (
                  <Tr key={+index}>
                    <Td>
                      <Flex flexDir="row" align="center">
                        <Text
                          fontWeight="bold"
                          fontSize="lg"
                          w="6"
                          color={theme.tokenHolders.delegations.text.primary}
                        >
                          {holder.position}.
                        </Text>
                        <ImgWithFallback
                          fallback={holder.nameOrAddress}
                          src={holder.picture}
                          boxSize="30px"
                          borderRadius="full"
                          objectFit="cover"
                          minH="30px"
                          minW="30px"
                          mr="2"
                        />
                        <Text
                          fontWeight="medium"
                          fontSize="md"
                          color={theme.tokenHolders.delegations.text.primary}
                        >
                          {holder.nameOrAddress}
                        </Text>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
