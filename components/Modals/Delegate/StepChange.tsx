/* eslint-disable @next/next/no-img-element */
import { Button, Flex, Img, Text, Icon, useClipboard } from '@chakra-ui/react';
import { ImgWithFallback } from 'components';
import { useDAO } from 'contexts';
import { IoCopy } from 'react-icons/io5';
import makeBlockie from 'ethereum-blockies-base64';
import { api } from 'helpers';
import React, { useEffect, useState } from 'react';
import { IDelegate } from 'types';
import { truncateAddress } from 'utils';

import { useToasty } from 'hooks';
import { VotesToDelegate } from './VotesToDelegate';
import { ModalDelegateButton } from './ModalDelegateButton';
import { DelegateModalBody } from './DelegateModalBody';
import { DelegateModalFooter } from './DelegateModalFooter';
import { DelegateModalHeader } from './DelegateModalHeader';

interface StepProps {
  handleModal: () => void;
  votes: string;
  delegatedUser: IDelegate;
  delegatedBefore: string;
  walletAddress?: string;
}

export const StepChange: React.FC<StepProps> = ({
  handleModal,
  votes,
  delegatedUser,
  delegatedBefore,
  walletAddress,
}) => {
  const [beforeENSName, setBeforeEnsName] = useState('');
  const [beforeImage, setBeforeImage] = useState(
    makeBlockie(delegatedBefore || '0x0000000000000000000000000000000000000000')
  );
  const { onCopy } = useClipboard(beforeENSName || delegatedBefore || '');
  const { toast } = useToasty();
  const { daoData, theme } = useDAO();

  const getEnsName = async () => {
    try {
      const response = await api.get(`/user/${delegatedBefore}`);
      const { ensName } = response.data.data;
      setBeforeEnsName(ensName);
      setBeforeImage(makeBlockie(ensName));
    } catch {
      setBeforeEnsName('');
    }
  };

  useEffect(() => {
    getEnsName();
  }, []);

  const modalSpacing = {
    padding: '16px 32px',
  };

  if (!daoData) return null;
  const { name: daoName, socialLinks } = daoData;
  const { logoUrl } = socialLinks;

  const copyText = () => {
    onCopy();
    toast({
      title: 'Copied to clipboard',
      description: 'Address copied',
      duration: 3000,
    });
  };

  return (
    <Flex
      flexDir="column"
      width="max-content"
      w="550px"
      height="max-content"
      backgroundColor="white"
      borderRadius="6px"
    >
      <DelegateModalHeader
        title="Change your delegate"
        handleModal={handleModal}
      />
      <Flex
        fontWeight="500"
        fontSize="14px"
        lineHeight="17px"
        color="#687785"
        flexDir="column"
      >
        <DelegateModalBody
          flexProps={{
            ...modalSpacing,
            boxShadow: '0px 15px 10px rgba(0, 0, 0, 0.05)',
            paddingTop: 0,
            paddingBottom: 7,
          }}
        >
          <Text
            display="flex"
            flexDirection="row"
            height="max-content"
            alignItems="center"
            gap="10px"
            fontStyle="normal"
            fontSize="14px"
            color="black"
          >
            Current delegate:
            <Flex
              padding="6px 4px"
              gap="8px"
              display="flex"
              ml={3}
              flexDirection="row"
              alignItems="center"
              background="#ebedf0"
              border="1px solid #ebedf0"
              boxSizing="border-box"
              borderRadius="6px"
              height="max-content"
              width="max-content"
              my="2"
            >
              <Img
                alt={beforeENSName}
                src={beforeImage}
                boxSize="20px"
                borderRadius="full"
              />
              <Text
                height="max-content"
                fontWeight="500"
                fontSize="14px"
                color="#000000"
                display="flex"
              >
                {beforeENSName || truncateAddress(delegatedBefore)}
                <Button
                  bg="transparent"
                  py="0"
                  px="0"
                  ml={1}
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
              </Text>
            </Flex>
          </Text>
          <Flex
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            gap="2"
            margin="0 0 23px 0"
          >
            <VotesToDelegate
              logoUrl={logoUrl}
              daoName={daoName}
              votes={votes}
            />
            <Text fontStyle="normal" fontSize="14px" color="black">
              to
            </Text>
            <Flex
              paddingX={2}
              paddingY={1}
              border="1px solid #ebedf0"
              boxSizing="border-box"
              borderRadius="6px"
              wordBreak="break-all"
              position="relative"
              background="#ebedf0"
              flexDirection="column"
            >
              <Flex
                display="flex"
                flexDirection="row"
                gap="8px"
                alignItems="center"
              >
                <ImgWithFallback
                  fallback={daoName}
                  src={
                    delegatedUser.profilePicture ||
                    makeBlockie(
                      delegatedUser.realName ||
                        delegatedUser.ensName ||
                        delegatedUser.address ||
                        Math.random().toString()
                    )
                  }
                  boxSize="20px"
                  borderRadius="full"
                />
                <Text
                  fontStyle="normal"
                  fontWeight="500"
                  fontSize="14px"
                  color="#000000"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                >
                  {delegatedUser.realName ||
                    delegatedUser.ensName ||
                    truncateAddress(delegatedUser.address)}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <ModalDelegateButton
            delegated={delegatedUser.address}
            votes={votes}
          />
        </DelegateModalBody>
      </Flex>
      <DelegateModalFooter
        flexProps={{ ...modalSpacing }}
        delegateInfo={delegatedUser}
        handleModal={handleModal}
        publicAddress={walletAddress}
      />
    </Flex>
  );
};
