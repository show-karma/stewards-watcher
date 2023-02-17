/* eslint-disable @next/next/no-img-element */
import { Button, Flex, IconButton, Img, Text, Icon } from '@chakra-ui/react';
import { ImgWithFallback } from 'components';
import { useDAO } from 'contexts';
import { IoClose } from 'react-icons/io5';
import makeBlockie from 'ethereum-blockies-base64';
import { api } from 'helpers';
import React, { useEffect, useState } from 'react';
import { IDelegate } from 'types';
import { truncateAddress } from 'utils';

import { VotesToDelegate } from './VotesToDelegate';
import { ModalDelegateButton } from './ModalDelegateButton';

interface StepProps {
  handleModal: () => void;
  votes: string;
  delegatedUser: IDelegate;
  delegatedBefore: string;
}

export const StepChange: React.FC<StepProps> = ({
  handleModal,
  votes,
  delegatedUser,
  delegatedBefore,
}) => {
  const [beforeENSName, setBeforeEnsName] = useState('');
  const [beforeImage, setBeforeImage] = useState(
    makeBlockie(delegatedBefore || '0x0000000000000000000000000000000000000000')
  );

  const { daoData } = useDAO();

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

  if (!daoData) return null;
  const { name: daoName, socialLinks } = daoData;
  const { logoUrl } = socialLinks;

  return (
    <Flex
      flexDir="column"
      width="max-content"
      minW="450px"
      height="max-content"
      backgroundColor="white"
      padding="24px 32px"
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
          Change your delegate
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
        lineHeight="17px"
        color="#687785"
        marginBottom="32px"
        flexDir="column"
      >
        <Text
          display="flex"
          flexDirection="row"
          height="max-content"
          alignItems="center"
          gap="10px"
          fontStyle="normal"
          fontWeight="700"
          fontSize="13px"
          color="#adb8c0"
        >
          Your current delegate is{' '}
          <Flex
            padding="6px 20px 6px 4px"
            gap="8px"
            display="flex"
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
              alt={`${beforeENSName}`}
              src={beforeImage}
              boxSize="20px"
              borderRadius="full"
            />
            <Text
              height="max-content"
              fontWeight="500"
              fontSize="14px"
              color="#000000"
            >
              {beforeENSName || truncateAddress(delegatedBefore)}
            </Text>
          </Flex>
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
      </Flex>
      <ModalDelegateButton delegated={delegatedUser.address} votes={votes} />
    </Flex>
  );
};
