import React, { useMemo, useRef } from 'react';
import {
  IconButton,
  Icon,
  Flex,
  Text,
  Button,
  useClipboard,
} from '@chakra-ui/react';
import { MdContentCopy } from 'react-icons/md';
import { BsArrowLeft } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import { useToasty } from 'hooks';
import { ESteps } from './ESteps';

interface IModal {
  handleModal: () => void;
  setStep: React.Dispatch<React.SetStateAction<ESteps>>;
  signature: string;
  publicAddress: string;
  step: ESteps;
  verifyPublication: () => void;
}

export const Step3: React.FC<IModal> = ({
  handleModal,
  setStep,
  signature,
  publicAddress,
  step,
  verifyPublication,
}) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const textToCopy = `Verifying my Twitter account for Karma
  addr: ${publicAddress}
  sig: ${signature}
  @karmahq_ #karmahq`;
  const backStep = () => setStep(ESteps.SIGN);
  const { onCopy } = useClipboard(textToCopy);
  const { toast } = useToasty();

  const openTwitter = () => {
    if (typeof window !== 'undefined') {
      const { outerHeight, outerWidth } = window;
      const [width, height] = [outerWidth * 0.75, outerHeight * 0.75];
      const windowFeatures = `left=0,top=0,width=${width},height=${height}`;
      window.open('https://twitter.com', '_blank', windowFeatures);
      setStep(ESteps.VERIFICATION);
    }
  };

  const copyText = () => {
    if (textRef.current) {
      onCopy();

      toast({
        title: 'Copied to clipboard',
        description: 'Address copied',
        duration: 3000,
      });
    }
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
        justifyContent="space-between"
        gap="100px"
        width="100%"
        minWidth="490px"
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
            3/3 Publish on Twitter
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
        Copy the text below and post publicly on Twitter. Once you post, come
        back and click “Verify Tweet” to complete the linking.
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
        <Text
          ref={textRef}
          margin="24px 48px 24px 20px"
          fontStyle="normal"
          fontWeight="500"
          fontSize="14px"
          lineHeight="17px"
          color="#000000"
          wordBreak="break-word"
        >
          {textToCopy}
        </Text>
        <IconButton
          aria-label="close"
          onClick={copyText}
          position="absolute"
          top={2}
          right={4}
          color="gray.400"
        >
          <Icon as={MdContentCopy} boxSize="6" />
        </IconButton>
      </Flex>

      <Flex flexDir="row">
        <Button
          fontStyle="normal"
          fontWeight="700"
          fontSize="16px"
          lineHeight="20px"
          bg="ffffff"
          color="black"
          width="50%"
          padding="12px 0"
          text-transform="none"
          marginTop="32px"
          type="submit"
          textTransform="none"
          border="2px solid #000000"
          borderRadius="none"
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
          onClick={openTwitter}
        >
          Open Twitter
        </Button>

        <Button
          fontStyle="normal"
          fontWeight="700"
          fontSize="16px"
          lineHeight="20px"
          color="white"
          background="black"
          width="50%"
          padding="12px 0"
          text-transform="none"
          marginTop="32px"
          type="submit"
          textTransform="none"
          borderRadius="none"
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
          disabled={step === ESteps.VERIFYING}
          onClick={verifyPublication}
        >
          Verify Tweet
        </Button>
      </Flex>
    </Flex>
  );
};
