import makeBlockie from 'ethereum-blockies-base64';
import React from 'react';
import { useDAO } from 'contexts';
import { IconButton, Icon, Flex, Text, Button } from '@chakra-ui/react';
import { IoClose } from 'react-icons/io5';
import { ImgWithFallback } from 'components';
import { IDelegate } from 'types';
import { ModalDelegateButton } from './ModalDelegateButton';
import { VotesToDelegate } from './VotesToDelegate';

interface StepProps {
  handleModal: () => void;
  votes: string;
  delegatedUser: IDelegate;
}

export const Step1: React.FC<StepProps> = ({
  handleModal,
  votes,
  delegatedUser,
}) => {
  const { daoData } = useDAO();
  if (!daoData) return null;
  const { name: daoName, socialLinks } = daoData;
  const { logoUrl } = socialLinks;

  return (
    <Flex
      flexDir="column"
      width="550px"
      height="max-content"
      backgroundColor="white"
      padding="16px 32px"
      borderRadius="6px"
    >
      <Flex
        display="flex"
        flexDirection="row"
        gap="100px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text
          fontStyle="normal"
          fontWeight="700"
          fontSize="20px"
          color="#000000"
          width="100%"
        >
          Delegate
        </Text>
        <IconButton
          bgColor="transparent"
          aria-label="close"
          onClick={handleModal}
          color="gray.500"
        >
          <Icon as={IoClose} boxSize="6" />
        </IconButton>
      </Flex>
      <Flex
        fontWeight="500"
        fontSize="14px"
        color="#687785"
        marginBottom="32px"
        flexDir="column"
      >
        <Text
          fontWeight="500"
          fontSize="14px"
          lineHeight="17px"
          color="#687785"
          marginBottom="32px"
        >
          Please make sure the following details look correct
        </Text>
        <Flex display="flex" flexDirection="column" gap="2" margin="0 0 18px 0">
          <VotesToDelegate logoUrl={logoUrl} daoName={daoName} votes={votes} />
          <Flex
            padding="16px 20px"
            border="1px solid #ebedf0"
            boxSizing="border-box"
            borderRadius="6px"
            wordBreak="break-all"
            position="relative"
            background="#ebedf0"
            flexDirection="column"
          >
            <Text
              fontStyle="normal"
              fontWeight="700"
              fontSize="12px"
              color="#adb8c0"
            >
              You’re delegating to
            </Text>
            <Flex
              display="flex"
              flexDirection="row"
              gap="8px"
              marginTop="8px"
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
                fontSize="20px"
                color="#000000"
              >{`${delegatedUser.ensName || delegatedUser.address}`}</Text>
            </Flex>
          </Flex>
        </Flex>
        <ModalDelegateButton delegated={delegatedUser.address} votes={votes} />
      </Flex>
    </Flex>
  );
};
