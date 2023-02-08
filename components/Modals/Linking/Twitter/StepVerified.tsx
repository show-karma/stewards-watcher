import { Flex, IconButton, Text, Icon, Button } from '@chakra-ui/react';
import React from 'react';
import Img from 'next/image';
import { ImgWithFallback } from 'components';
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

  const closeModal = () => {
    handleModal();
    document.location.reload();
  };

  return (
    <Flex
      flexDir="column"
      width="550px"
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
        gap="100px"
        width="100%"
        minWidth="490px"
      >
        <IconButton aria-label="close" onClick={handleModal} color="gray.500">
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
        <Flex
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap="4px"
          background="rgba(173, 184, 192, 0.24)"
          borderRadius="200px"
          padding="4px 8px 4px 8px"
          width="max-content"
        >
          <ImgWithFallback
            borderRadius="100px"
            width="22px"
            height="22px"
            fallback={daoInfo.name}
            src={logoUrl}
          />
          <Text
            width="max-content"
            wordBreak="keep-all"
            fontStyle="normal"
            fontWeight="500"
            fontSize="14px"
            color="#2d1b33"
          >
            {daoName}
          </Text>
        </Flex>
      </Flex>
      <Button
        fontStyle="normal"
        fontWeight="700"
        fontSize="16px"
        lineHeight="20px"
        color="ffffff"
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
