import { Button, Flex, Icon, IconButton, Text } from '@chakra-ui/react';
import { blo } from 'blo';
import { ImgWithFallback } from 'components';
import { useWallet } from 'contexts';
import React from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import { useSignMessage } from 'wagmi';
import { ESteps } from './ESteps';

interface IModal {
  handleModal: () => void;
  setStep: React.Dispatch<React.SetStateAction<ESteps>>;
  username: string;
  setSignature: React.Dispatch<React.SetStateAction<string>>;
  daoInfo: {
    name: string;
    logoUrl: string;
  };
}

export const Step2: React.FC<IModal> = ({
  handleModal,
  setStep,
  username,
  setSignature,
  daoInfo,
}) => {
  const { name: daoName, logoUrl } = daoInfo;
  const { openConnectModal, isConnected } = useWallet();
  const backStep = () => setStep(ESteps.INPUT);
  const nextStep = () => setStep(ESteps.PUBLISH);
  const { signMessageAsync } = useSignMessage();

  const signUsername = async () => {
    if (!isConnected) openConnectModal?.();
    try {
      const sign = await signMessageAsync({ message: username.toLowerCase() });
      setSignature(sign);
      nextStep();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
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
        justifyContent="space-between"
        gap="24px"
        width="100%"
      >
        <Flex display="flex" flexDirection="row" alignItems="center" gap="15px">
          <IconButton
            bgColor="transparent"
            aria-label="close"
            onClick={backStep}
            color="gray.500"
          >
            <Icon as={BsArrowLeft} boxSize="6" />
          </IconButton>
          <Text
            fontStyle="normal"
            fontWeight="700"
            fontSize="20px"
            color="#000000"
            width="100%"
          >
            2/3 Sign a message
          </Text>
        </Flex>
        <IconButton
          bgColor="transparent"
          aria-label="close"
          onClick={handleModal}
          color="gray.400"
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
      >
        Sign a message that includes your github handle to prove you truly own
        this wallet.
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
            fallback={username}
            src={blo(`0x${username}`)}
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
        disabled={!username}
        onClick={signUsername}
      >
        Sign
      </Button>
    </Flex>
  );
};
