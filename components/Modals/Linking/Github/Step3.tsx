import React, { useRef } from 'react';
import {
  IconButton,
  Icon,
  Flex,
  Text,
  Button,
  useClipboard,
  Input,
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
  daoName: string;
  step: ESteps;
  verifyPublication: () => void;
  gistUrl: string;
  setGistUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const Step3: React.FC<IModal> = ({
  handleModal,
  setStep,
  signature,
  publicAddress,
  daoName,
  step,
  verifyPublication,
  gistUrl,
  setGistUrl,
}) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const textToCopy = `Verifying my github identity for ${daoName} governance
  addr: ${publicAddress}
  sig: ${signature}
  #${daoName}governance`;
  const { onCopy } = useClipboard(textToCopy);
  const backStep = () => setStep(ESteps.SIGN);
  const { toast } = useToasty();

  const openGithub = () => {
    if (typeof window !== 'undefined') {
      const { outerHeight, outerWidth } = window;
      const [width, height] = [outerWidth * 0.75, outerHeight * 0.75];
      const windowFeatures = `left=0,top=0,width=${width},height=${height}`;
      window.open('https://gist.github.com/', '_blank', windowFeatures);
      setStep(ESteps.VERIFICATION);
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) =>
    setGistUrl(event.target.value);

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
          <IconButton aria-label="close" onClick={backStep} color="gray.500">
            <Icon as={BsArrowLeft} boxSize="6" />
          </IconButton>
          <Text
            fontStyle="normal"
            fontWeight="700"
            fontSize="20px"
            color="#000000"
            width="100%"
          >
            3/3 Create a secret gist
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
        Copy the text below, click on open window and paste at github and create
        a secret gist. Once you create, copy the url of the gist created, come
        back and click “Verify” to complete the linking.
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
          bgColor="transparent"
        >
          <Icon as={MdContentCopy} boxSize="6" />
        </IconButton>
      </Flex>
      <Input
        mt="4"
        padding="8px 20px"
        background="#ebedf0"
        fontStyle="normal"
        fontWeight="500"
        fontSize="14px"
        lineHeight="17px"
        color="rgba(104, 119, 133, 1)"
        border="none"
        flex="1"
        h="max-content"
        _placeholder={{
          color: 'rgba(104, 119, 133, 0.58)',
          fontStyle: 'normal',
          fontWeight: '500',
          fontSize: '14px',
          lineHeight: '17px',
        }}
        _active={{
          outline: 'none',
        }}
        _focusVisible={{
          outline: 'none',
        }}
        type="text"
        placeholder="Paste the link of the gist created"
        value={gistUrl}
        onChange={handleInput}
        onKeyDown={event => event.key === 'Enter' && verifyPublication()}
      />
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
          onClick={openGithub}
        >
          Open Github
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
          _hover={{
            opacity: 0.9,
          }}
          _disabled={{
            opacity: 0.25,
            cursor: 'not-allowed',
          }}
          _active={{}}
          _focus={{}}
          _focusVisible={{}}
          _focusWithin={{}}
          disabled={step === ESteps.VERIFYING || !gistUrl}
          isDisabled={step === ESteps.VERIFYING || !gistUrl}
          onClick={verifyPublication}
        >
          Verify Publication
        </Button>
      </Flex>
    </Flex>
  );
};
