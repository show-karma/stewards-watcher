import { ModalContent, ModalOverlay, Modal, Box } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { AxiosClient } from 'helpers';
import { useToasty } from 'hooks';
import React, { useEffect, useState } from 'react';
import { lessThanDays } from 'utils';
import { useAccount } from 'wagmi';
import { ESteps } from './ESteps';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { StepVerified } from './StepVerified';

interface IModal {
  open: boolean;
  handleModal: () => void;
  onClose: () => void;
}

export const TwitterModal: React.FC<IModal> = ({
  open,
  handleModal,
  onClose,
}) => {
  const [step, setStep] = useState(ESteps.INPUT);
  const [signature, setSignature] = useState('');
  const [username, setUsername] = useState('');
  const { toast, updateState } = useToasty();
  const { address: publicAddress } = useAccount();
  const { daoData, daoInfo } = useDAO();
  const { profileSelected } = useDelegates();
  const daoName = daoData?.name || '';
  const logoUrl = daoData?.socialLinks.logoUrl || '';
  const request = AxiosClient();

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
            description:
              'Your twitter handle has been verified and linked to your profile!',
            status: 'success',
            duration: 10000,
          });
          return resolve(true);
        })
        .catch(error => {
          setStep(ESteps.PUBLISH);
          updateState({
            title: 'Twitter verification failed',
            description: `We're sorry, the verification failed. Make sure you tweeted the correct message and click the verify button again.`,
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
        title: 'Verifying your tweet',
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

  const notShowCondition =
    daoInfo.config.SHOULD_NOT_SHOW === 'twitter' ||
    (daoInfo.config.DAO_KARMA_ID === 'starknet' &&
      !!profileSelected?.userCreatedAt &&
      lessThanDays(profileSelected?.userCreatedAt, 1));

  useEffect(() => {
    if (notShowCondition) {
      onClose();
    }
  }, [open]);

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
