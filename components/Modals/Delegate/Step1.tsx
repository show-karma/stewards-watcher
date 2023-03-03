import React from 'react';
import { useDAO } from 'contexts';
import { Button, Flex, Text } from '@chakra-ui/react';
import { IDelegate } from 'types';
import { ImgWithFallback } from 'components/ImgWithFallback';
import makeBlockie from 'ethereum-blockies-base64';
import { DelegateModalHeader } from './DelegateModalHeader';
import { DelegateModalFooter } from './DelegateModalFooter';
import { DelegateModalBody } from './DelegateModalBody';
import { ModalDelegateButton } from './ModalDelegateButton';
import { VotesToDelegate } from './VotesToDelegate';

interface StepProps {
  handleModal: () => void;
  votes: string;
  delegatedUser: IDelegate;
  walletAddress?: string;
}

export const Step1: React.FC<StepProps> = ({
  handleModal,
  votes,
  delegatedUser,
  walletAddress,
}) => {
  const { daoData } = useDAO();
  if (!daoData) return null;
  const { name: daoName, socialLinks } = daoData;
  const { logoUrl } = socialLinks;

  const modalSpacing = {
    padding: '16px 32px',
  };

  return (
    <Flex
      flexDir="column"
      width="550px"
      height="max-content"
      backgroundColor="white"
      borderRadius="6px"
    >
      <DelegateModalHeader handleModal={handleModal} />
      <DelegateModalBody
        flexProps={{
          ...modalSpacing,
          boxShadow: '0px 15px 10px rgba(0, 0, 0, 0.05)',
          paddingBottom: 7,
        }}
      >
        <Flex
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap="2"
          margin="0 0 23px 0"
        >
          <VotesToDelegate logoUrl={logoUrl} daoName={daoName} votes={votes} />
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
                src={makeBlockie(
                  delegatedUser.ensName ||
                    delegatedUser.address ||
                    Math.random().toString()
                )}
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
              >{`${delegatedUser.ensName || delegatedUser.address}`}</Text>
            </Flex>
          </Flex>
        </Flex>
        <ModalDelegateButton delegated={delegatedUser.address} votes={votes} />
      </DelegateModalBody>
      <DelegateModalFooter
        flexProps={{ ...modalSpacing }}
        delegateAddress={delegatedUser.address}
        publicAddress={walletAddress}
      />
    </Flex>
  );
};
