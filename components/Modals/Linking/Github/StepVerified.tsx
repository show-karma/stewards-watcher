import { Button, Flex, Icon, IconButton, Text } from '@chakra-ui/react';
import { ImgWithFallback } from 'components';
import { useDelegates } from 'contexts';
import Img from 'next/image';
import React from 'react';
import { IoClose } from 'react-icons/io5';

interface IModal {
  handleModal: () => void;
  username: string;
  daoInfo: {
    name: string;
    logoUrl: string;
  };
}

export const StepVerified: React.FC<IModal> = ({
  handleModal,
  username,
  daoInfo,
}) => {
  const { name: daoName, logoUrl } = daoInfo;
  const { searchProfileModal, profileSelected } = useDelegates();

  const closeModal = () => {
    if (profileSelected) searchProfileModal(profileSelected?.address);
    handleModal();
  };

  return (
    <Flex
      flexDir="column"
      width="full"
      maxWidth="550px"
      height="max-content"
      backgroundColor="white"
      padding="24px 32px"
      borderRadius="6px"
    >
      <Flex
        flexDir="row"
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        gap="24px"
        width="100%"
      >
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
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        paddingTop="36px"
        paddingBottom="48px"
        gap="16px"
      >
        <Img src="/icons/check.svg" alt="Verified" height="32" width="32" />

        <Text
          fontStyle="normal"
          fontWeight="500"
          fontSize="18px"
          lineHeight="22px"
          textAlign="center"
          color="#687785"
        >
          Verification Successful
        </Text>
      </Flex>
      <Flex
        display="flex"
        flexDirection="row"
        background="#ebedf0"
        padding="8px 10px"
        borderRadius="6px"
        justifyContent="space-between"
        position="relative"
        flexWrap="wrap"
        gap="10px"
      >
        <Flex
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap="10px"
          padding="0 10px"
        >
          <ImgWithFallback
            borderRadius="100px"
            width="26px"
            height="26px"
            fallback={daoInfo.name}
          />
          <Text
            fontStyle="normal"
            fontWeight="500"
            fontSize="14px"
            lineHeight="17px"
            color="#000000"
          >
            {username}
          </Text>
          <Text
            padding="5px 20px"
            fontSize="12px"
            lineHeight="15px"
            textTransform="capitalize"
            boxSizing="border-box"
            borderRadius="5px"
            color="#19cfa1"
            border="1px solid #19cfa1"
          >
            Verified
          </Text>
        </Flex>
      </Flex>
      <Button
        fontStyle="normal"
        fontWeight="700"
        fontSize="16px"
        lineHeight="20px"
        color="white"
        background="black"
        width="100%"
        padding="12px 0"
        text-transform="none"
        marginTop="32px"
        type="submit"
        textTransform="none"
        _disabled={{
          opacity: 0.25,
          cursor: 'not-allowed',
        }}
        _hover={{
          opacity: 0.9,
        }}
        _active={{}}
        _focus={{}}
        _focusVisible={{}}
        _focusWithin={{}}
        onClick={closeModal}
      >
        Close
      </Button>
    </Flex>
  );
};
