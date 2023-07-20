import { Flex, Text } from '@chakra-ui/react';
import { FC } from 'react';
import Lottie from 'lottie-react';
import CheckAnimation from 'assets/animations/check.json';
import { DelegateModalBody } from './DelegateModalBody';
import { DelegateModalHeader } from './DelegateModalHeader';

interface ProcessedTransactionProps {
  handleModal: () => void;
}

export const ProcessedTransaction: FC<ProcessedTransactionProps> = ({
  handleModal,
}) => {
  const modalSpacing = {
    padding: '16px 32px',
  };

  return (
    <Flex
      flexDir="column"
      width={['340px', '390px', '550px']}
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
          flex="1"
          alignItems="center"
          flexWrap="wrap"
          gap="2"
          margin="0 0 23px 0"
          justifyContent="center"
          flexDir="column"
          textAlign="center"
        >
          <Lottie animationData={CheckAnimation} style={{ width: '64px' }} />
          <Text fontWeight="600" color="black" fontSize="lg">
            Your transaction is being processed!
          </Text>
          <Text fontWeight="400" color="black" fontSize="sm">
            Sit tight as we securely handle your request. We appreciate your
            patience and look forward to completing your transaction shortly.
          </Text>
        </Flex>
      </DelegateModalBody>
    </Flex>
  );
};
