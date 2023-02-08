import { ModalContent, ModalOverlay, Modal, Box } from '@chakra-ui/react';
import { useDAO, useWallet } from 'contexts';
import { AxiosClient } from 'helpers';
import { useToasty } from 'hooks';
import React, { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { ESteps } from './ESteps';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { StepVerified } from './StepVerified';

interface IModal {
  open: boolean;
  handleModal: () => void;
}

export const TwitterModal: React.FC<IModal> = ({ open, handleModal }) => {
  const [step, setStep] = useState(ESteps.INPUT);
  const [signature, setSignature] = useState('');
  const [username, setUsername] = useState('');
  const { toast, updateState } = useToasty();
  const { isConnected } = useWallet();
  const { address: publicAddress } = useAccount();
  const { daoData } = useDAO();
  const daoName = daoData?.name || '';
  const logoUrl = daoData?.socialLinks.logoUrl || '';
  const request = AxiosClient();

  // useMemo(() => {
  //   if (open && !isConnected) handleModal();
  // }, [isConnected, open]);

  const validationPromise = () =>
    new Promise((resolve, reject) =>
      // eslint-disable-next-line no-promise-executor-return
      request
        .post('/dao/link/twitter', {
          daoName,
          message: username,
        })
        .then(() => {
          setStep(ESteps.VERIFIED);
          updateState({
            title: 'Verified.',
            description: 'Your twitter has been verified.',
            status: 'success',
            duration: 10000,
          });
          return resolve(true);
        })
        .catch(error => {
          setStep(ESteps.PUBLISH);
          updateState({
            title: 'Verification had an error.',
            description:
              'Please try again. Make sure you tweeted the correct message.',
            status: 'error',
            duration: 10000,
          });
          return reject(error);
        })
    );

  const verifyPublication = async () => {
    setStep(ESteps.VERIFYING);
    try {
      toast({
        title: 'Verifying tweet...',
        description: 'Please wait while we verify your tweet.',
        duration: 100000,
        status: 'info',
      });
      validationPromise();
    } catch (error) {
      console.log(error);
    }
  };

  const resetStep = () => setStep(ESteps.INPUT);

  const closeModal = () => {
    handleModal();
    resetStep();
  };

  const renderStep = () => {
    if (step === ESteps.SIGN)
      return (
        <Step2
          handleModal={closeModal}
          setStep={setStep}
          username={username}
          setSignature={setSignature}
          daoInfo={{ name: daoName, logoUrl }}
        />
      );
    if (
      (step === ESteps.PUBLISH ||
        step === ESteps.VERIFICATION ||
        step === ESteps.VERIFYING) &&
      publicAddress
    )
      return (
        <Step3
          handleModal={closeModal}
          setStep={setStep}
          signature={signature}
          publicAddress={publicAddress}
          step={step}
          verifyPublication={verifyPublication}
        />
      );
    if (step === ESteps.VERIFIED)
      return (
        <StepVerified
          handleModal={closeModal}
          username={username}
          daoInfo={{ name: daoName, logoUrl }}
        />
      );
    return (
      <Step1
        handleModal={closeModal}
        setStep={setStep}
        username={username}
        setUsername={setUsername}
        daoInfo={{ name: daoName, logoUrl }}
      />
    );
  };

  return (
    <Modal
      isOpen={open}
      onClose={closeModal}
      aria-labelledby="twitter-modal-title"
      aria-describedby="twitter-modal-description"
    >
      <ModalOverlay />
      <ModalContent>{renderStep()}</ModalContent>
    </Modal>
  );
};
